/**
 * Surprise finds: manual buys sometimes turn up a bonus worth some seconds of
 * income. Two kinds: a lucky find (chance per buy) and, if configured, a sure
 * find on every n-th manual level. A minimum interval throttles both, so buy
 * spam cannot farm them.
 *
 * Two more, both optional: "almost there" finds when the run crosses set
 * shares of the first prestige gate (once per run each), and a lucky bonus on
 * the offline income after a longer absence.
 */
import { act } from '../result'
import { isRecord, parseInt0, parseTime, primaryCurrency } from '../state'
import type { EngineModule } from '../types'
import { MODULE } from './ids'
import { layerStatus } from './prestige'

export interface SurprisesState {
  found: number
  lastAt: number
  /** Manual levels bought so far (drives the sure find on every n-th). */
  buys: number
  /** Bitmask of the "almost there" finds already given in this run (bit i = `near.ratios[i]`). */
  near: number
}

export function surprisesModule(): EngineModule<SurprisesState> {
  return {
    id: MODULE.surprises,
    version: 1,
    init: () => ({ found: 0, lastAt: 0, buys: 0, near: 0 }),
    parse: (raw) => {
      const r = isRecord(raw) ? raw : {}
      return { found: parseInt0(r.found), lastAt: parseTime(r.lastAt, 0), buys: parseInt0(r.buys), near: parseInt0(r.near) }
    },
    // The counters stay; only the "almost there" finds start over with every run
    resetOn: (s) => ({ ...s, near: 0 }),
    tick: (s, _dt, _ctx, world) => {
      const c = world.def.balance.surprises
      const layer = world.def.prestigeLayers[0]
      if (!c.near || !layer) return s
      const ratio = layerStatus(world, layer.id).ratio
      for (let i = 0; i < c.near.ratios.length; i++) {
        const bit = 1 << i
        if (s.near & bit || ratio < c.near.ratios[i]) continue
        const rate = world.rate()
        let amount = rate * c.near.seconds
        if (c.capShare) amount = Math.min(amount, (world.core.primaryRun + rate * 60) * c.capShare)
        if (c.floorSeconds) amount = Math.max(amount, rate * c.floorSeconds)
        const next = { ...s, near: s.near | bit }
        if (!(amount > 0)) return next
        return act({ ...next, found: s.found + 1 }, { grant: [{ currency: primaryCurrency(world.def), amount, source: 'surprise' }], events: [{ type: 'surprise.found', amount, kind: 'near', tier: i }] })
      }
      return s
    },
    on: (s, e, ctx, world) => {
      if (e.type === 'offline.claimed') {
        const o = world.def.balance.surprises.offline
        const gained = Number(e.amount) || 0
        if (!o || gained < 1 || (Number(e.elapsedMs) || 0) < o.minAwayMs || ctx.rng.next() >= o.chance) return s
        const amount = Math.max(1, Math.floor(gained * o.bonus))
        return act({ ...s, found: s.found + 1 }, { grant: [{ currency: primaryCurrency(world.def), amount, source: 'surprise' }], events: [{ type: 'surprise.found', amount, kind: 'offline' }] })
      }
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
      return act({ ...s, found: s.found + 1, lastAt: now, buys }, { grant: [{ currency: primaryCurrency(world.def), amount, source: 'surprise' }], events: [{ type: 'surprise.found', amount, kind }] })
    },
    playtestEvents: ['surprise.found'],
    sample: () => ({ found: 7, lastAt: 1_800_000_000_000, buys: 40, near: 3 }),
  }
}
