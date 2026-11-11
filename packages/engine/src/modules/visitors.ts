/**
 * Visitors: while the game is open, a guest whose condition holds drops by
 * for a short while (unseen guests are more likely). Greeting a guest the
 * first time grants a gift, later visits a little income. Each species seen
 * adds a small bonus.
 */
import { act } from '../result'
import { isRecord, parseNumRecord, parseTime, primaryCurrency } from '../state'
import type { Amount, EffectSource, EngineModule, WorldView } from '../types'

export interface VisitorDef {
  id: string
  when: (w: WorldView) => boolean
}

export interface VisitorConfig {
  list: readonly VisitorDef[]
  stayMs: number
  /** The guest stays until greeted instead of leaving after `stayMs` (nobody is missed while away). */
  waits?: boolean
  gapMs: [number, number]
  firstGift: readonly Amount[]
  againSeconds: number
  bonusPerSpecies: number
  unseenWeight: number
}

export interface VisitorsState {
  seen: Record<string, number>
  current: string
  until: number
  nextAt: number
}

export const VISITORS_ID = 'visitors'

export function visitorsModule(cfg: VisitorConfig): EngineModule<VisitorsState> {
  const ids = cfg.list.map((v) => v.id)
  return {
    id: VISITORS_ID,
    version: 1,
    init: (ctx) => ({ seen: {}, current: '', until: 0, nextAt: ctx.clock.now() + cfg.gapMs[0] }),
    parse: (raw, ctx) => {
      const r = isRecord(raw) ? raw : {}
      const current = typeof r.current === 'string' && ids.includes(r.current) ? r.current : ''
      return { seen: parseNumRecord(r.seen, ids, true), current, until: current ? parseTime(r.until, 0) : 0, nextAt: parseTime(r.nextAt, ctx.clock.now() + cfg.gapMs[0]) }
    },
    resetOn: 'keep',
    tick: (s, _dt, ctx, w) => {
      const now = ctx.clock.now()
      if (s.current) return !cfg.waits && now >= s.until ? { ...s, current: '', until: 0, nextAt: now + cfg.gapMs[0] + ctx.rng.next() * (cfg.gapMs[1] - cfg.gapMs[0]) } : s
      if (now < s.nextAt) return s
      const open = cfg.list.filter((v) => v.when(w))
      if (!open.length) return { ...s, nextAt: now + cfg.gapMs[0] }
      const weights = open.map((v) => (s.seen[v.id] ? 1 : cfg.unseenWeight))
      let x = ctx.rng.next() * weights.reduce((a, b) => a + b, 0)
      let pick = open[0]
      for (let i = 0; i < open.length; i++) {
        x -= weights[i]
        if (x < 0) {
          pick = open[i]
          break
        }
      }
      return act({ ...s, current: pick.id, until: now + cfg.stayMs }, { events: [{ type: 'visitor.arrived', id: pick.id }] })
    },
    effects: (s): EffectSource[] => {
      const n = Object.values(s.seen).filter((x) => x > 0).length
      return n ? [{ id: 'visitors', target: 'rate:*', op: 'mul', value: 1 + n * cfg.bonusPerSpecies, labelKey: 'effect.visitors' }] : []
    },
    actions: {
      greet: (s, _p, ctx, w) => {
        if (!s.current || (!cfg.waits && ctx.clock.now() >= s.until)) return s
        const first = !s.seen[s.current]
        const grant = first ? cfg.firstGift.map((g) => ({ ...g, source: 'visitor' })) : [{ currency: primaryCurrency(w.def), amount: w.rate() * cfg.againSeconds, source: 'visitor' }]
        // The guest leaves; the next one comes after the usual gap (otherwise the next tick would bring one right back)
        const nextAt = ctx.clock.now() + cfg.gapMs[0] + ctx.rng.next() * (cfg.gapMs[1] - cfg.gapMs[0])
        return act({ ...s, seen: { ...s.seen, [s.current]: (s.seen[s.current] ?? 0) + 1 }, current: '', until: 0, nextAt }, { grant, events: [{ type: 'visitor.greeted', id: s.current, first }] })
      },
    },
    playtestEvents: ['visitor.arrived', 'visitor.greeted'],
    sample: () => ({ seen: Object.fromEntries(ids.slice(0, 2).map((id) => [id, 2])), current: ids[2] ?? '', until: ids[2] ? 1_800_000_060_000 : 0, nextAt: 1_800_000_000_000 }),
  }
}
