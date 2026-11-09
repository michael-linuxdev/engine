/**
 * Helper automation: once hired, buys producer levels on its own at an
 * interval that shrinks with its rank, following a rule. The character and
 * its texts come from the game; the mechanic lives here.
 */
import { bestBuy } from '../bestBuy'
import { unitCost } from '../producers'
import { act } from '../result'
import { isRecord, parseInt0, parseStr } from '../state'
import type { EngineModule, WorldView } from '../types'
import { MODULE } from './ids'
import { costMult, isUnlocked, ownedOf } from './producers'

export const HELPER_RULES = ['cheapest', 'best', 'lowest'] as const
export type HelperRule = (typeof HELPER_RULES)[number]

export interface HelperState {
  rank: number
  rule: HelperRule
  bought: number
  /** Time banked toward the next buy (transient). */
  carryMs: number
}

export function helperInterval(world: WorldView, rank: number): number {
  const r = world.def.balance.helper.ranks[rank - 1]
  if (!r) return Infinity
  return Math.max(250, r.intervalMs / Math.max(0.01, world.value('helper.speed', 1)))
}

export function helperTarget(world: WorldView, rule: HelperRule): string | null {
  const open = world.def.producers.filter((p) => isUnlocked(world, p))
  if (!open.length) return null
  if (rule === 'best') return bestBuy(world)?.id ?? null
  if (rule === 'lowest') return [...open].sort((a, b) => ownedOf(world, a.id) - ownedOf(world, b.id))[0].id
  let best = open[0]
  let bestCost = Infinity
  for (const p of open) {
    const c = unitCost(p, ownedOf(world, p.id), costMult(world, p.id))
    if (c < bestCost) {
      bestCost = c
      best = p
    }
  }
  return best.id
}

export function helperModule(): EngineModule<HelperState> {
  return {
    id: MODULE.helper,
    version: 1,
    init: () => ({ rank: 0, rule: 'cheapest', bought: 0, carryMs: 0 }),
    parse: (raw, _ctx, def) => {
      const r = isRecord(raw) ? raw : {}
      return { rank: parseInt0(r.rank, 0, def.balance.helper.ranks.length), rule: parseStr(r.rule, HELPER_RULES, 'cheapest'), bought: parseInt0(r.bought), carryMs: 0 }
    },
    serialize: (s) => ({ rank: s.rank, rule: s.rule, bought: s.bought }),
    transient: ['carryMs'],
    resetOn: 'keep',
    tick: (s, dt, _ctx, world) => {
      if (s.rank <= 0) return s
      const interval = helperInterval(world, s.rank)
      // Long steps (simulator, catch-up) may hold several buys; capped so a gap never floods.
      const carry = Math.min(interval * 20, s.carryMs + dt)
      const n = Math.floor(carry / interval)
      if (n <= 0) return { ...s, carryMs: carry }
      const id = helperTarget(world, s.rule)
      const next = { ...s, carryMs: carry - n * interval, bought: id ? s.bought + n : s.bought }
      if (!id) return next
      // Re-target after every buy: the follow-ups run in order, each picks its own target.
      const buys = Array.from({ length: n }, () => ({ module: MODULE.helper, type: 'buyOne', payload: undefined }))
      return act(next, { dispatch: buys })
    },
    actions: {
      /** One automatic buy (internal follow-up of `tick`). */
      buyOne: (s, _p, _ctx, world) => {
        if (s.rank <= 0) return s
        const id = helperTarget(world, s.rule)
        return id ? act(s, { dispatch: [{ module: MODULE.producers, type: 'buy', payload: { id, count: 1, source: 'helper' } }] }) : s
      },
      upgrade: (s, _p, _ctx, world) => {
        const r = world.def.balance.helper.ranks[s.rank]
        if (!r) return s
        return act({ ...s, rank: s.rank + 1 }, { spend: [r.cost], events: [{ type: 'helper.upgraded', rank: s.rank + 1 }] })
      },
      setRule: (s, p) => {
        const rule = (p as { rule?: string } | undefined)?.rule
        return HELPER_RULES.includes(rule as HelperRule) && rule !== s.rule ? { ...s, rule: rule as HelperRule } : s
      },
    },
    playtestEvents: ['helper.upgraded'],
    sample: () => ({ rank: 1, rule: 'best', bought: 40, carryMs: 0 }),
  }
}
