/**
 * Wheel: every run of `layer` earns one spin; the result is a buff for the
 * next run (cleared at the following prestige) or an instant grant.
 */
import { act } from '../result'
import { isRecord, parseInt0 } from '../state'
import type { Amount, EffectSource, EngineModule } from '../types'

export type WheelSegment =
  | { id: string; weight: number; kind: 'buff'; target: string; mult: number }
  | { id: string; weight: number; kind: 'grant'; grant: readonly Amount[] }

export interface WheelConfig {
  layer: string
  segments: readonly WheelSegment[]
}

export interface WheelState {
  spins: number
  /** Segment id of the running buff ('' = none). */
  buff: string
  last: string
  total: number
}

export const WHEEL_ID = 'wheel'

export function wheelModule(cfg: WheelConfig): EngineModule<WheelState> {
  const byId = new Map(cfg.segments.map((s) => [s.id, s]))
  const totalWeight = cfg.segments.reduce((a, s) => a + s.weight, 0)
  return {
    id: WHEEL_ID,
    version: 1,
    init: () => ({ spins: 0, buff: '', last: '', total: 0 }),
    parse: (raw) => {
      const r = isRecord(raw) ? raw : {}
      const seg = (v: unknown) => (typeof v === 'string' && byId.has(v) ? v : '')
      return { spins: parseInt0(r.spins, 0, 99), buff: seg(r.buff), last: seg(r.last), total: parseInt0(r.total) }
    },
    resetOn: 'keep',
    on: (s, e) => (e.type === 'prestige.performed' && e.layer === cfg.layer ? { ...s, spins: Math.min(99, s.spins + 1), buff: '' } : s),
    effects: (s): EffectSource[] => {
      const b = byId.get(s.buff)
      return b && b.kind === 'buff' ? [{ id: `wheel:${b.id}`, target: b.target, op: 'mul', value: b.mult, labelKey: 'effect.wheel' }] : []
    },
    actions: {
      spin: (s, _p, ctx) => {
        if (s.spins <= 0 || totalWeight <= 0) return s
        let x = ctx.rng.next() * totalWeight
        let seg = cfg.segments[cfg.segments.length - 1]
        for (const c of cfg.segments) {
          x -= c.weight
          if (x < 0) {
            seg = c
            break
          }
        }
        const next: WheelState = { spins: s.spins - 1, buff: seg.kind === 'buff' ? seg.id : s.buff, last: seg.id, total: s.total + 1 }
        return act(next, { grant: seg.kind === 'grant' ? seg.grant.map((g) => ({ ...g, source: 'wheel' })) : [], events: [{ type: 'wheel.spun', segment: seg.id }] })
      },
    },
    playtestEvents: ['wheel.spun'],
    sample: () => ({ spins: 1, buff: cfg.segments.find((x) => x.kind === 'buff')?.id ?? '', last: cfg.segments[0]?.id ?? '', total: 4 }),
  }
}
