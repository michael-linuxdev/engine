/**
 * Daily errands: `perDay` templates rolled from the local day key (same
 * errands on every device that day, no RNG state). Progress comes from events.
 */
import { hashKey, localDayKey } from '../clock'
import { act } from '../result'
import { isRecord, parseBool, parseNum, primaryCurrency } from '../state'
import type { Amount, EngineEvent, EngineModule, WorldView } from '../types'

export type QuestKind = 'buy' | 'earn' | 'burst' | 'daily' | 'prestige'

export interface QuestTemplate {
  id: string
  kind: QuestKind
  /** buy/burst/daily/prestige: count; earn: seconds of income at roll time. */
  target: number
  reward: readonly Amount[]
  /** Reward in seconds of income (added to `reward`). */
  rewardSeconds?: number
  /** At most one template of each group per day. */
  group?: string
}

export interface QuestConfig {
  templates: readonly QuestTemplate[]
  perDay: number
}

export interface QuestEntry {
  id: string
  progress: number
  goal: number
  claimed: boolean
}

export interface QuestsState {
  day: string
  active: QuestEntry[]
}

export const QUESTS_ID = 'quests'

export function rollQuests(cfg: QuestConfig, day: string, world: WorldView): QuestEntry[] {
  const pool = [...cfg.templates]
  const out: QuestEntry[] = []
  const groups = new Set<string>()
  let h = hashKey(`quests:${day}`)
  while (out.length < cfg.perDay && pool.length) {
    h = Math.imul(h ^ (h >>> 13), 0x5bd1e995) >>> 0
    const t = pool.splice(h % pool.length, 1)[0]
    if (t.group && groups.has(t.group)) continue
    if (t.group) groups.add(t.group)
    const goal = t.kind === 'earn' ? Math.max(100, Math.round(world.rate() * t.target)) : t.target
    out.push({ id: t.id, progress: 0, goal, claimed: false })
  }
  return out
}

function gain(t: QuestTemplate, e: EngineEvent): number {
  switch (t.kind) {
    case 'buy':
      return e.type === 'producer.bought' && e.source !== 'helper' ? Number(e.count) || 0 : 0
    case 'earn':
      return e.type === 'primary.gained' ? Number(e.amount) || 0 : 0
    case 'burst':
      return e.type === 'burst.used' ? 1 : 0
    case 'daily':
      return e.type === 'daily.claimed' ? 1 : 0
    case 'prestige':
      return e.type === 'prestige.performed' ? 1 : 0
  }
}

export function questsModule(cfg: QuestConfig): EngineModule<QuestsState> {
  const byId = new Map(cfg.templates.map((t) => [t.id, t]))
  const ensureDay = (s: QuestsState, day: string, world: WorldView): QuestsState => (s.day === day ? s : { day, active: rollQuests(cfg, day, world) })
  return {
    id: QUESTS_ID,
    version: 1,
    init: () => ({ day: '', active: [] }),
    parse: (raw) => {
      const r = isRecord(raw) ? raw : {}
      const active = Array.isArray(r.active)
        ? r.active.filter(isRecord).filter((x) => typeof x.id === 'string' && byId.has(x.id)).map((x) => ({ id: x.id as string, progress: parseNum(x.progress), goal: Math.max(1, parseNum(x.goal, 1)), claimed: parseBool(x.claimed) }))
        : []
      return { day: typeof r.day === 'string' ? r.day : '', active }
    },
    resetOn: 'keep',
    tick: (s, _dt, ctx, world) => ensureDay(s, localDayKey(ctx.clock), world),
    onOffline: (s, _ms, ctx, world) => ensureDay(s, localDayKey(ctx.clock), world),
    on: (s, e, ctx, world) => {
      const cur = ensureDay(s, localDayKey(ctx.clock), world)
      let changed = cur !== s
      const active = cur.active.map((q) => {
        const t = byId.get(q.id)
        if (!t || q.progress >= q.goal) return q
        const g = gain(t, e)
        if (g <= 0) return q
        changed = true
        return { ...q, progress: Math.min(q.goal, q.progress + g) }
      })
      return changed ? { ...cur, active } : s
    },
    actions: {
      claim: (s, p, _ctx, world) => {
        const id = (p as { id?: string } | undefined)?.id
        const i = s.active.findIndex((q) => q.id === id)
        const q = s.active[i]
        const t = q && byId.get(q.id)
        if (!q || !t || q.claimed || q.progress < q.goal) return s
        const grant = [...t.reward.map((r) => ({ ...r, source: 'quest' }))]
        if (t.rewardSeconds) grant.push({ currency: primaryCurrency(world.def), amount: world.rate() * t.rewardSeconds, source: 'quest' })
        const active = s.active.map((x, j) => (j === i ? { ...x, claimed: true } : x))
        return act({ ...s, active }, { grant, events: [{ type: 'quest.claimed', id: q.id }] })
      },
    },
    playtestEvents: ['quest.claimed'],
    sample: () => ({ day: '2026-11-09', active: cfg.templates.slice(0, cfg.perDay).map((t, i) => ({ id: t.id, progress: i, goal: 10 + i, claimed: i === 0 })) }),
  }
}
