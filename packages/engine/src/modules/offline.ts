/**
 * Offline module: on return, computes the "basket" (income while away) as
 * data. The UI shows it and the player claims it.
 */
import { offlineGain } from '../offline'
import { act } from '../result'
import { isRecord, parseNum, parseTime, primaryCurrency } from '../state'
import type { EngineModule, WorldView } from '../types'
import { MODULE } from './ids'

export interface OfflineBasket {
  gained: number
  elapsedMs: number
  /** True if the hard cap cut the time short. */
  capped: boolean
  at: number
}

export interface OfflineState {
  pending: OfflineBasket | null
  claims: number
}

export function offlineCaps(world: WorldView): { soft: number; hard: number } {
  const o = world.def.balance.offline
  const soft = Math.max(0, world.value('offline.softHours', o.softHours))
  const hard = Math.max(soft, world.value('offline.hardHours', o.hardHours))
  return { soft, hard }
}

export function offlineModule(): EngineModule<OfflineState> {
  return {
    id: MODULE.offline,
    version: 1,
    init: () => ({ pending: null, claims: 0 }),
    parse: (raw) => {
      const r = isRecord(raw) ? raw : {}
      const p = isRecord(r.pending) ? r.pending : null
      const pending = p && parseNum(p.gained) > 0
        ? { gained: parseNum(p.gained), elapsedMs: parseNum(p.elapsedMs), capped: p.capped === true, at: parseTime(p.at, 0) }
        : null
      return { pending, claims: parseNum(r.claims) }
    },
    resetOn: 'keep',
    onOffline: (s, elapsedMs, ctx, world) => {
      if (elapsedMs < world.def.balance.offline.minClaimMs) return s
      const { soft, hard } = offlineCaps(world)
      const gained = offlineGain(world.rate(), elapsedMs / 1000, soft, hard, world.def.balance.offline.decay)
      if (!(gained > 0)) return s
      const prev = s.pending
      // A short absence is not worth a basket: credit it at once (unless a basket is already waiting)
      const direct = world.def.balance.offline.directBelowMs ?? 0
      if (!prev && elapsedMs < direct) return act(s, { grant: [{ currency: primaryCurrency(world.def), amount: gained, source: 'offline' }], events: [{ type: 'offline.direct', amount: gained, elapsedMs }] })
      return {
        ...s,
        pending: {
          gained: (prev?.gained ?? 0) + gained,
          elapsedMs: (prev?.elapsedMs ?? 0) + elapsedMs,
          capped: (prev?.capped ?? false) || elapsedMs > hard * 3_600_000,
          at: ctx.clock.now(),
        },
      }
    },
    actions: {
      claim: (s, payload, _ctx, world) => {
        if (!s.pending) return s
        const mult = Math.max(1, Number((payload as { mult?: number } | undefined)?.mult) || 1)
        const amount = s.pending.gained * mult
        const o = world.def.balance.offline
        const comeback = !!o.comebackMs && s.pending.elapsedMs >= o.comebackMs
        return act(
          { pending: null, claims: s.claims + 1 },
          {
            grant: [{ currency: primaryCurrency(world.def), amount, source: 'offline' }, ...(comeback ? (o.comebackGrant ?? []).map((g) => ({ ...g, source: 'comeback' })) : [])],
            events: [{ type: 'offline.claimed', amount, elapsedMs: s.pending.elapsedMs }, ...(comeback ? [{ type: 'offline.comeback', elapsedMs: s.pending.elapsedMs }] : [])],
          },
        )
      },
    },
    playtestEvents: ['offline.claimed'],
    sample: () => ({ pending: { gained: 5000, elapsedMs: 3_600_000, capped: false, at: 1_800_000_000_000 }, claims: 4 }),
  }
}
