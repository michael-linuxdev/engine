/**
 * Voyages: timed errands sent out one at a time. A voyage runs for hours of
 * real time (also while away), then waits to be collected: fixed amounts,
 * seconds of income, and optionally an event (e.g. a find for a collection).
 * Later voyages open with the number of voyages already completed.
 */
import { act } from '../result'
import { isRecord, parseInt0, parseTime, primaryCurrency } from '../state'
import type { Amount, EngineEvent, EngineModule } from '../types'

export interface VoyageDef {
  id: string
  durationMs: number
  /** Completed voyages (any) needed before this one can be sent. */
  fromDone: number
  grant?: readonly Amount[]
  /** Reward in seconds of current income. */
  seconds?: number
  /** Extra event on return (e.g. `collection.found`). */
  event?: EngineEvent
}

export interface VoyagesConfig {
  list: readonly VoyageDef[]
}

export interface VoyagesState {
  /** Running or returned voyage ('' = none). */
  active: string
  until: number
  /** Completed voyages in total, and per id. */
  done: number
  times: Record<string, number>
}

export const VOYAGES_ID = 'voyages'

/** The voyage has returned and waits to be collected. */
export function voyageBack(s: VoyagesState, now: number): boolean {
  return !!s.active && now >= s.until
}

export function voyageOpen(s: VoyagesState, v: VoyageDef): boolean {
  return s.done >= v.fromDone
}

export function voyagesModule(cfg: VoyagesConfig): EngineModule<VoyagesState> {
  const byId = new Map(cfg.list.map((v) => [v.id, v]))
  return {
    id: VOYAGES_ID,
    version: 1,
    init: () => ({ active: '', until: 0, done: 0, times: {} }),
    parse: (raw) => {
      const r = isRecord(raw) ? raw : {}
      const active = typeof r.active === 'string' && byId.has(r.active) ? r.active : ''
      const src = isRecord(r.times) ? r.times : {}
      const times: Record<string, number> = {}
      for (const v of cfg.list) {
        const n = parseInt0(src[v.id])
        if (n > 0) times[v.id] = n
      }
      return { active, until: active ? parseTime(r.until, 0) : 0, done: parseInt0(r.done), times }
    },
    resetOn: 'keep',
    actions: {
      send: (s, p, ctx) => {
        const v = byId.get((p as { id?: string } | undefined)?.id ?? '')
        if (!v || s.active || !voyageOpen(s, v)) return s
        return act({ ...s, active: v.id, until: ctx.clock.now() + v.durationMs }, { events: [{ type: 'voyage.sent', id: v.id }] })
      },
      collect: (s, _p, ctx, world) => {
        const v = byId.get(s.active)
        if (!v || !voyageBack(s, ctx.clock.now())) return s
        const grant: (Amount & { source: string })[] = (v.grant ?? []).map((g) => ({ ...g, source: 'voyage' }))
        if (v.seconds) grant.push({ currency: primaryCurrency(world.def), amount: world.rate() * v.seconds, source: 'voyage' })
        const next = { active: '', until: 0, done: s.done + 1, times: { ...s.times, [v.id]: (s.times[v.id] ?? 0) + 1 } }
        return act(next, { grant, events: [{ type: 'voyage.returned', id: v.id, done: next.done }, ...(v.event ? [v.event] : [])] })
      },
    },
    playtestEvents: ['voyage.sent', 'voyage.returned'],
    sample: () => ({ active: cfg.list[0]?.id ?? '', until: cfg.list[0] ? 1_800_000_100_000 : 0, done: 3, times: cfg.list[0] ? { [cfg.list[0].id]: 3 } : {} }),
  }
}
