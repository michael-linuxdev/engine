/**
 * Burst tap: charges that refill over time; one use grants N seconds of the
 * current income (`burst.seconds`). Max charges: `burst.maxCharges`.
 */
import { act } from '../result'
import { isRecord, parseInt0, parseTime, primaryCurrency } from '../state'
import type { Ctx, EngineModule, WorldView } from '../types'
import { MODULE } from './ids'

export interface BurstState {
  charges: number
  /** When the next charge arrives (0 = full). */
  nextAt: number
  uses: number
}

export function burstMax(world: WorldView): number {
  return Math.max(1, Math.floor(world.value('burst.maxCharges', world.def.balance.burst.maxCharges)))
}

export function burstSeconds(world: WorldView): number {
  return Math.max(0, world.value('burst.seconds', world.def.balance.burst.seconds))
}

function refill(s: BurstState, ctx: Ctx, world: WorldView): BurstState {
  const max = burstMax(world)
  const now = ctx.clock.now()
  const step = Math.max(1, world.value('burst.rechargeMs', world.def.balance.burst.rechargeMs))
  if (s.charges >= max) return s.nextAt === 0 && s.charges === max ? s : { ...s, charges: Math.min(s.charges, max), nextAt: 0 }
  if (s.nextAt === 0) return { ...s, nextAt: now + step }
  if (now < s.nextAt) return s
  const gained = 1 + Math.floor((now - s.nextAt) / step)
  const charges = Math.min(max, s.charges + gained)
  return { ...s, charges, nextAt: charges >= max ? 0 : s.nextAt + gained * step }
}

export function burstModule(): EngineModule<BurstState> {
  return {
    id: MODULE.burst,
    version: 1,
    init: (_ctx, def) => ({ charges: def.balance.burst.maxCharges, nextAt: 0, uses: 0 }),
    parse: (raw, _ctx, def) => {
      const r = isRecord(raw) ? raw : {}
      return { charges: parseInt0(r.charges, def.balance.burst.maxCharges, 1000), nextAt: parseTime(r.nextAt, 0), uses: parseInt0(r.uses) }
    },
    resetOn: 'keep',
    tick: (s, _dt, ctx, world) => refill(s, ctx, world),
    onOffline: (s, _ms, ctx, world) => refill(s, ctx, world),
    actions: {
      use: (s, _p, ctx, world) => {
        const cur = refill(s, ctx, world)
        if (cur.charges <= 0) return s
        const amount = world.rate() * burstSeconds(world)
        const step = Math.max(1, world.value('burst.rechargeMs', world.def.balance.burst.rechargeMs))
        const next = { charges: cur.charges - 1, nextAt: cur.nextAt === 0 ? ctx.clock.now() + step : cur.nextAt, uses: cur.uses + 1 }
        return act(next, { grant: [{ currency: primaryCurrency(world.def), amount, source: 'burst' }], events: [{ type: 'burst.used', amount }] })
      },
    },
    playtestEvents: ['burst.used'],
    sample: () => ({ charges: 1, nextAt: 1_800_000_100_000, uses: 12 }),
  }
}
