/**
 * Producers: owned levels per producer, buying (×1 / ×n / max, closed form),
 * unlock gates and milestone effects.
 */
import { act } from '../result'
import { bulkCost, gateOpen, maxAffordable, milestoneMult, type GateInput } from '../producers'
import { isRecord, parseNumRecord, primaryCurrency } from '../state'
import type { EffectSource, EngineModule, GameDefinition, ProducerDef, StateView, WorldView } from '../types'
import { MODULE } from './ids'
import type { PrestigeState } from './prestige'
import type { ProgressionState } from './progression'
import { levelOf } from './progression'

export interface ProducersState {
  owned: Record<string, number>
}

export type BuyCount = number | 'max'
export type BuySource = 'manual' | 'helper' | 'start'

export interface BuyPayload {
  id: string
  count: BuyCount
  source?: BuySource
}

export function gateInput(view: StateView): GateInput {
  const pr = view.get<PrestigeState | undefined>(MODULE.prestige)
  const pg = view.get<ProgressionState | undefined>(MODULE.progression)
  const owned = view.get<ProducersState | undefined>(MODULE.producers)?.owned ?? {}
  return {
    prestigeCount: (layer) => {
      const i = view.def.prestigeLayers.findIndex((l) => l.id === layer)
      return i >= 0 ? (pr?.layers[i]?.count ?? 0) : 0
    },
    primaryRun: view.core.primaryRun,
    producerLevel: (id) => owned[id] ?? 0,
    playerLevel: pg ? levelOf(pg.xp, view.def.balance).level : 1,
  }
}

export function ownedOf(view: StateView, id: string): number {
  return view.get<ProducersState | undefined>(MODULE.producers)?.owned[id] ?? 0
}

export function isUnlocked(view: StateView, p: ProducerDef): boolean {
  if (ownedOf(view, p.id) > 0) return true
  return gateOpen(p.unlock, gateInput(view))
}

export function costMult(world: WorldView, id: string): number {
  return Math.max(0, world.value(`cost:${id}`, 1))
}

/** Levels and cost for a buy request (0 levels = not possible). */
export function quote(world: WorldView, id: string, count: BuyCount): { levels: number; cost: number } {
  const p = world.def.producers.find((x) => x.id === id)
  if (!p || !isUnlocked(world, p)) return { levels: 0, cost: 0 }
  const owned = ownedOf(world, id)
  const m = costMult(world, id)
  const money = world.balance(primaryCurrency(world.def))
  if (count === 'max') {
    const k = maxAffordable(p, owned, money, m)
    return { levels: k, cost: bulkCost(p, owned, k, m) }
  }
  const k = Math.max(0, Math.floor(count))
  return { levels: k, cost: bulkCost(p, owned, k, m) }
}

/** Producers count with level ≥ 1. */
export function producersOnline(view: StateView): number {
  const owned = view.get<ProducersState | undefined>(MODULE.producers)?.owned ?? {}
  return Object.values(owned).filter((n) => n >= 1).length
}

export function producerLevelsTotal(view: StateView): number {
  const owned = view.get<ProducersState | undefined>(MODULE.producers)?.owned ?? {}
  return Object.values(owned).reduce((a, n) => a + Math.max(0, n), 0)
}

function ids(def: GameDefinition): string[] {
  return def.producers.map((p) => p.id)
}

export function producersModule(): EngineModule<ProducersState> {
  return {
    id: MODULE.producers,
    version: 1,
    init: () => ({ owned: {} }),
    parse: (raw, _ctx, def) => ({ owned: parseNumRecord(isRecord(raw) ? raw.owned : undefined, ids(def), true) }),
    resetOn: (s, layer, _ctx, world) => {
      // Start levels after a prestige come from effects (`start.producer:<id>`) and from what the
      // layer leaves standing (`carry.producerShare`, raised by effects on `start.keep:<layer>`).
      const base = world.def.prestigeLayers.find((l) => l.id === layer)?.carry?.producerShare ?? 0
      const share = Math.min(1, Math.max(0, world.value(`start.keep:${layer}`, base)))
      const owned: Record<string, number> = {}
      for (const p of world.def.producers) {
        const fixed = Math.floor(Math.max(0, world.value(`start.producer:${p.id}`, 0)))
        const kept = Math.floor(Math.max(0, s.owned[p.id] ?? 0) * share)
        const n = Math.max(fixed, kept)
        if (n > 0) owned[p.id] = n
      }
      return { owned }
    },
    effects: (s, view): EffectSource[] => {
      const out: EffectSource[] = []
      for (const [id, n] of Object.entries(s.owned)) {
        const m = milestoneMult(n, view.def.balance)
        if (m > 1) out.push({ id: `milestones:${id}`, target: `rate:${id}`, op: 'mul', value: m, labelKey: 'effect.milestones' })
      }
      return out
    },
    actions: {
      buy: (s, payload, _ctx, world) => {
        const p = payload as BuyPayload
        if (!p || typeof p.id !== 'string') return s
        const q = quote(world, p.id, p.count)
        if (q.levels <= 0) return s
        const level = (s.owned[p.id] ?? 0) + q.levels
        return act(
          { owned: { ...s.owned, [p.id]: level } },
          {
            spend: [{ currency: primaryCurrency(world.def), amount: q.cost }],
            events: [{ type: 'producer.bought', id: p.id, count: q.levels, level, cost: q.cost, source: p.source ?? 'manual' }],
          },
        )
      },
    },
    playtestEvents: ['producer.bought'],
    sample: (_ctx, def) => {
      const owned: Record<string, number> = {}
      def.producers.forEach((p, i) => (owned[p.id] = 10 + i))
      return { owned }
    },
  }
}
