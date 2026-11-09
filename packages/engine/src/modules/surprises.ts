/**
 * Surprise jumps: a manual buy sometimes finds a bonus worth N seconds of
 * income. Throttled by a minimum interval so buy spam cannot farm it.
 */
import { act } from '../result'
import { isRecord, parseInt0, parseTime, primaryCurrency } from '../state'
import type { EngineModule } from '../types'
import { MODULE } from './ids'

export interface SurprisesState {
  found: number
  lastAt: number
}

export function surprisesModule(): EngineModule<SurprisesState> {
  return {
    id: MODULE.surprises,
    version: 1,
    init: () => ({ found: 0, lastAt: 0 }),
    parse: (raw) => {
      const r = isRecord(raw) ? raw : {}
      return { found: parseInt0(r.found), lastAt: parseTime(r.lastAt, 0) }
    },
    resetOn: 'keep',
    on: (s, e, ctx, world) => {
      if (e.type !== 'producer.bought' || e.source !== 'manual') return s
      const c = world.def.balance.surprises
      const now = ctx.clock.now()
      if (now - s.lastAt < c.minIntervalMs) return s
      const roll = ctx.rng.next()
      if (roll >= c.chance * world.value('surprise.chance', 1)) return s
      const amount = world.rate() * world.value('surprise.seconds', c.seconds)
      if (!(amount > 0)) return s
      return act({ found: s.found + 1, lastAt: now }, { grant: [{ currency: primaryCurrency(world.def), amount, source: 'surprise' }], events: [{ type: 'surprise.found', amount }] })
    },
    playtestEvents: ['surprise.found'],
    sample: () => ({ found: 7, lastAt: 1_800_000_000_000 }),
  }
}
