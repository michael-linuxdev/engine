/**
 * Branches: two secondary upgrade tracks per producer — efficiency (rate)
 * and capacity (cost). Paid in primary, reset on every prestige.
 */
import { act } from '../result'
import { isRecord, parseInt0, primaryCurrency } from '../state'
import type { BalanceConfig, EffectSource, EngineModule, ProducerDef } from '../types'
import { MODULE } from './ids'
import { ownedOf } from './producers'

export type BranchKind = 'efficiency' | 'capacity'

export interface BranchesState {
  ranks: Record<string, { efficiency: number; capacity: number }>
}

export function branchCost(p: ProducerDef, kind: BranchKind, rank: number, b: BalanceConfig): number {
  const c = b.branches
  const kindMult = kind === 'capacity' ? c.capacityCostMult : 1
  return Math.max(c.minCost, Math.floor(p.baseCost * c.costFactor * Math.pow(c.costGrowth, Math.max(0, rank)) * kindMult))
}

export function branchesModule(): EngineModule<BranchesState> {
  return {
    id: MODULE.branches,
    version: 1,
    init: () => ({ ranks: {} }),
    parse: (raw, _ctx, def) => {
      const out: BranchesState['ranks'] = {}
      const r = isRecord(raw) && isRecord(raw.ranks) ? raw.ranks : {}
      const max = def.balance.branches.maxRank
      for (const p of def.producers) {
        const x = r[p.id]
        if (!isRecord(x)) continue
        out[p.id] = { efficiency: parseInt0(x.efficiency, 0, max), capacity: parseInt0(x.capacity, 0, max) }
      }
      return { ranks: out }
    },
    resetOn: 'reset',
    effects: (s, view) => {
      const b = view.def.balance.branches
      const out: EffectSource[] = []
      for (const [id, r] of Object.entries(s.ranks)) {
        if (r.efficiency > 0) out.push({ id: `branch.eff:${id}`, target: `rate:${id}`, op: 'mul', value: 1 + b.efficiencyPerRank * r.efficiency, labelKey: 'effect.branchEfficiency' })
        if (r.capacity > 0) out.push({ id: `branch.cap:${id}`, target: `cost:${id}`, op: 'mul', value: Math.pow(1 - b.capacityPerRank, r.capacity), labelKey: 'effect.branchCapacity' })
      }
      return out
    },
    actions: {
      buy: (s, payload, _ctx, world) => {
        const { id, kind } = (payload ?? {}) as { id?: string; kind?: BranchKind }
        const p = world.def.producers.find((x) => x.id === id)
        if (!p || (kind !== 'efficiency' && kind !== 'capacity') || ownedOf(world, p.id) < 1) return s
        const cur = s.ranks[p.id] ?? { efficiency: 0, capacity: 0 }
        if (cur[kind] >= world.def.balance.branches.maxRank) return s
        const cost = branchCost(p, kind, cur[kind], world.def.balance)
        return act(
          { ranks: { ...s.ranks, [p.id]: { ...cur, [kind]: cur[kind] + 1 } } },
          { spend: [{ currency: primaryCurrency(world.def), amount: cost }], events: [{ type: 'branch.bought', id: p.id, kind, rank: cur[kind] + 1 }] },
        )
      },
    },
    playtestEvents: ['branch.bought'],
    sample: (_ctx, def) => {
      const ranks: BranchesState['ranks'] = {}
      for (const p of def.producers) ranks[p.id] = { efficiency: 2, capacity: 1 }
      return { ranks }
    },
  }
}
