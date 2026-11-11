/**
 * Surprise finds: manual buys sometimes turn up a bonus worth some seconds of
 * income. Two kinds: a lucky find (chance per buy) and, if configured, a sure
 * find on every n-th manual level. A minimum interval throttles both, so buy
 * spam cannot farm them.
 */
import { act } from '../result'
import { isRecord, parseInt0, parseTime, primaryCurrency } from '../state'
import type { EngineModule } from '../types'
import { MODULE } from './ids'

export interface SurprisesState {
  found: number
  lastAt: number
  /** Manual levels bought so far (drives the sure find on every n-th). */
  buys: number
}

export function surprisesModule(): EngineModule<SurprisesState> {
  return {
    id: MODULE.surprises,
    version: 1,
    init: () => ({ found: 0, lastAt: 0, buys: 0 }),
    parse: (raw) => {
      const r = isRecord(raw) ? raw : {}
      return { found: parseInt0(r.found), lastAt: parseTime(r.lastAt, 0), buys: parseInt0(r.buys) }
    },
    resetOn: 'keep',
    on: (s, e, ctx, world) => {
      if (e.type !== 'producer.bought' || e.source !== 'manual') return s
      const c = world.def.balance.surprises
      const levels = Math.max(1, Number(e.count) || 1)
      const buys = s.buys + levels
      const counted = { ...s, buys }
      const now = ctx.clock.now()
      if (now - s.lastAt < c.minIntervalMs) return counted
      const rate = world.rate()
      // Sure find when this buy crosses a multiple of `every.count`, else the lucky roll
      const sure = !!c.every && c.every.count > 0 && Math.floor(buys / c.every.count) > Math.floor(s.buys / c.every.count)
      let seconds = 0
      let kind: 'sure' | 'lucky' = 'sure'
      if (sure && c.every) seconds = c.every.seconds
      else if (ctx.rng.next() < c.chance * world.value('surprise.chance', 1)) {
        kind = 'lucky'
        const base = world.value('surprise.seconds', c.seconds)
        seconds = c.secondsMax && c.secondsMax > base ? base + ctx.rng.next() * (c.secondsMax - base) : base
      }
      if (seconds <= 0) return counted
      let amount = rate * seconds
      if (c.capShare) amount = Math.min(amount, (world.core.primaryRun + rate * 60) * c.capShare)
      if (c.floorSeconds) amount = Math.max(amount, rate * c.floorSeconds)
      if (!(amount > 0)) return counted
      return act({ found: s.found + 1, lastAt: now, buys }, { grant: [{ currency: primaryCurrency(world.def), amount, source: 'surprise' }], events: [{ type: 'surprise.found', amount, kind }] })
    },
    playtestEvents: ['surprise.found'],
    sample: () => ({ found: 7, lastAt: 1_800_000_000_000, buys: 40 }),
  }
}
