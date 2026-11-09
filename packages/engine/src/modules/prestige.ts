/**
 * Prestige module: counters per layer, gate checks and the perform action.
 * The actual cross-module reset is done by the engine (`resetOn` per module).
 */
import { gateAt, rawPayout } from '../prestige'
import { act } from '../result'
import { isRecord, parseInt0, parseNum, parseTime } from '../state'
import type { EngineModule, GameDefinition, StateView, WorldView } from '../types'
import { MODULE } from './ids'
import { producersOnline } from './producers'

export interface LayerState {
  /** Lifetime runs of this layer. */
  count: number
  /** Primary earned since the last reset of this layer or a higher one. */
  runEarned: number
  /** Runs of this layer since the last reset of a higher layer (gate exponent). */
  sinceReset: number
  /** Time of the last run of this layer (0 = never), for rest periods. */
  lastAt: number
}

export interface PrestigeState {
  layers: LayerState[]
}

export type PrestigeBlock = 'earned' | 'producers' | 'lowerRuns' | 'rest' | 'unknown' | null

const emptyLayer = (): LayerState => ({ count: 0, runEarned: 0, sinceReset: 0, lastAt: 0 })

export function layerIndex(def: GameDefinition, layer: string): number {
  return def.prestigeLayers.findIndex((l) => l.id === layer)
}

export function prestigeState(view: StateView): PrestigeState {
  return view.get<PrestigeState | undefined>(MODULE.prestige) ?? { layers: view.def.prestigeLayers.map(emptyLayer) }
}

/** First run of layer k ever (all layers ≥ k never performed) and a probe is defined. */
export function isProbe(view: StateView, k: number): boolean {
  const l = view.def.prestigeLayers[k]
  if (!l?.probe) return false
  const s = prestigeState(view)
  for (let j = k; j < view.def.prestigeLayers.length; j++) if ((s.layers[j]?.count ?? 0) > 0) return false
  return true
}

export interface LayerStatus {
  layer: string
  index: number
  earned: number
  gate: number
  probe: boolean
  payout: number
  block: PrestigeBlock
  /** 0…1 toward the gate. */
  ratio: number
  /** Rest left (ms) when blocked by a rest period. */
  restLeft: number
}

export function layerStatus(world: WorldView, layer: string): LayerStatus {
  const k = layerIndex(world.def, layer)
  const l = world.def.prestigeLayers[k]
  if (!l) return { layer, index: -1, earned: 0, gate: 0, probe: false, payout: 0, block: 'unknown', ratio: 0, restLeft: 0 }
  const s = prestigeState(world).layers[k] ?? emptyLayer()
  const probe = isProbe(world, k)
  const gate = gateAt(l, s.sinceReset, probe)
  const earned = s.runEarned
  const base = rawPayout(l, earned, s.sinceReset, probe)
  const payout = Math.floor(world.value(`prestige.payout:${l.id}`, base))
  let block: PrestigeBlock = null
  const min = l.minimum ?? {}
  if (earned < gate || payout <= 0) block = 'earned'
  else if (min.producersOnline && s.count >= (min.producersFromCount ?? 0) && producersOnline(world) < min.producersOnline) block = 'producers'
  else if (min.lowerRuns && k > 0 && (prestigeState(world).layers[k - 1]?.sinceReset ?? 0) < min.lowerRuns) block = 'lowerRuns'
  // Rest period: measured against the last simulated time (core.lastSeen ≈ now)
  const restLeft = min.restMs && s.lastAt > 0 ? Math.max(0, s.lastAt + min.restMs - world.core.lastSeen) : 0
  if (block === null && restLeft > 0) block = 'rest'
  return { layer, index: k, earned, gate, probe, payout, block, ratio: gate > 0 ? Math.min(1, earned / gate) : 1, restLeft }
}

export function prestigeModule(): EngineModule<PrestigeState> {
  return {
    id: MODULE.prestige,
    version: 1,
    init: (_ctx, def) => ({ layers: def.prestigeLayers.map(emptyLayer) }),
    parse: (raw, _ctx, def) => {
      const arr = isRecord(raw) && Array.isArray(raw.layers) ? raw.layers : []
      return {
        layers: def.prestigeLayers.map((_, i) => {
          const x = arr[i]
          if (!isRecord(x)) return emptyLayer()
          const count = parseInt0(x.count)
          return { count, runEarned: parseNum(x.runEarned), sinceReset: Math.min(count, parseInt0(x.sinceReset)), lastAt: parseTime(x.lastAt, 0) }
        }),
      }
    },
    resetOn: (s, layer, ctx, world) => {
      const k = layerIndex(world.def, layer)
      return {
        layers: s.layers.map((l, j) => {
          if (j > k) return l
          if (j === k) return { count: l.count + 1, runEarned: 0, sinceReset: l.sinceReset + 1, lastAt: ctx.clock.now() }
          return { ...l, runEarned: 0, sinceReset: 0 }
        }),
      }
    },
    on: (s, e) => {
      if (e.type !== 'primary.gained') return s
      const a = Number(e.amount) || 0
      if (a <= 0) return s
      return { layers: s.layers.map((l) => ({ ...l, runEarned: l.runEarned + a })) }
    },
    prestigePayout: (_s, layer, world) => {
      const st = layerStatus(world, layer)
      return st.block === null ? st.payout : 0
    },
    actions: {
      perform: (s, payload, _ctx, world) => {
        const layer = (payload as { layer?: string } | undefined)?.layer
        if (typeof layer !== 'string' || layerStatus(world, layer).block !== null) return s
        return act(s, { prestige: layer })
      },
    },
    playtestEvents: ['prestige.performed'],
    sample: (_ctx, def) => ({ layers: def.prestigeLayers.map((_, i) => ({ count: 5 - i, runEarned: 1e6 * (i + 1), sinceReset: 2, lastAt: 1_800_000_000_000 - i })) }),
  }
}
