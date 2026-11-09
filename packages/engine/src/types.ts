/**
 * Core types of the engine. A game describes itself through a
 * `GameDefinition` (data); systems are `EngineModule`s with their own save
 * slice, parser, reset rule per prestige layer and migrations.
 */
import type { Clock } from './clock'
import type { Num } from './num'
import type { Rng } from './rng'

export type Raw = Record<string, unknown>
/** One migration step: data of version v → v + 1. */
export type Migration = (raw: Raw) => Raw

export type CurrencyRole = 'primary' | 'meta' | 'premium' | 'layer' | 'region'

export interface CurrencyDef {
  /** Stable id, saved. Never rename. */
  id: string
  role: CurrencyRole
  /** Prestige layer ids whose reset sets this balance to 0. */
  resetOn?: readonly string[]
}

/** One condition of an unlock gate. */
export type GateAtom =
  | { kind: 'prestige'; layer: string; count: number }
  | { kind: 'primaryRun'; amount: Num }
  | { kind: 'producer'; id: string; level: number }
  | { kind: 'level'; level: number }

/**
 * Unlock gate: every atom in `all` must hold, and — if `any` is non-empty —
 * at least one atom in `any`.
 */
export interface UnlockGate {
  all?: readonly GateAtom[]
  any?: readonly GateAtom[]
}

export interface ProducerDef {
  /** Stable id, saved. Never rename. */
  id: string
  /** Cost C0 for level 0 → 1. */
  baseCost: Num
  /** Growth g in C(n) = C0 · g^n. */
  costScale: number
  /** Rate r0 per level per second. */
  baseRate: Num
  unlock?: UnlockGate
}

export interface PrestigeLayerDef {
  /** Stable id, saved. Never rename; append only. */
  id: string
  /** Currency paid out by this layer. */
  currency: string
  /** gate(p) = base · growth^min(p, knee) · lateGrowth^max(0, p − knee) */
  gate: { base: Num; growth: number; knee: number; lateGrowth: number }
  /** Optional low gate for the very first run of this layer ever (all layers ≥ this at 0). */
  probe?: { gate: Num; payout: Num }
  /** payout = base · growth^p · f(earned / gate), f = √r up to `sqrtCap`, then +0.5 per doubling. */
  payout: { base: Num; growth: number; sqrtCap?: number }
  minimum?: {
    /** Producers with level ≥ 1 required … */
    producersOnline?: number
    /** … but only from this lifetime count of this layer on (default 0). */
    producersFromCount?: number
    /** Runs of the next lower layer since the last reset of this one. */
    lowerRuns?: number
  }
}

/** Effect targets: `rate:*`, `rate:<producer>`, `cost:*`, `cost:<producer>`, `offline.softHours`, … */
export type EffectTarget = string

export interface EffectSource {
  /** Stable id, used for the breakdown and logs. */
  id: string
  target: EffectTarget
  op: 'add' | 'mul' | 'pow'
  value: number
  /** i18n key; resolved in the UI only. */
  labelKey: string
}

export interface Amount {
  currency: string
  amount: Num
}

/** Events modules emit and listen to (`on`). */
export interface EngineEvent {
  type: string
  [key: string]: unknown
}

export interface DispatchRequest {
  module: string
  type: string
  payload?: unknown
}

/** What an action, tick or event handler may return besides a new slice. */
export interface ActionResult<S> {
  state: S
  /** Currency to take; the whole result is dropped if any balance is short. */
  spend?: readonly Amount[]
  /** Currency to give. */
  grant?: readonly (Amount & { source?: string })[]
  events?: readonly EngineEvent[]
  /** Follow-up actions on other modules, run in order after this one. */
  dispatch?: readonly DispatchRequest[]
  /** Perform this prestige layer after applying the result. */
  prestige?: string
}

export type StepResult<S> = S | ActionResult<S>

/** Context handed to modules. */
export interface Ctx {
  clock: Clock
  rng: Rng
}

/** Read-only view on the whole state for effect functions (no effect lookups). */
export interface StateView {
  def: GameDefinition
  core: CoreState
  get<S>(moduleId: string): S
  balance(currency: string): Num
}

/** Full view: adds resolved effect values and rates. */
export interface WorldView extends StateView {
  /** Resolve an effect target on top of `base`. */
  value(target: EffectTarget, base: number): number
  /** Current primary income per second. */
  rate(): Num
  /** Rate of one producer per second. */
  producerRate(id: string): Num
}

export type ResetFn<S> = (s: S, layer: string, ctx: Ctx, world: WorldView) => S
export type ResetRule<S> = 'keep' | 'reset' | ResetFn<S>
/** One rule for all layers, or rules by layer id with `*` as fallback. */
export type ResetPolicy<S> = ResetRule<S> | Readonly<Record<string, ResetRule<S>>>

export type ActionFn<S> = (s: S, payload: unknown, ctx: Ctx, world: WorldView) => StepResult<S>

export interface EngineModule<S> {
  /** Stable id = save key of the slice. Never rename. */
  id: string
  /** Slice format version; `migrations[v]` lifts v → v + 1. */
  version: number
  migrations?: Readonly<Record<number, Migration>>
  init(ctx: Ctx, def: GameDefinition): S
  /** Tolerant: missing fields → start value, garbage → start value. Never throws. */
  parse(raw: unknown, ctx: Ctx, def: GameDefinition): S
  serialize?(s: S): unknown
  /** Keys never saved. */
  transient?: readonly string[]
  /** Keys recomputed on load. */
  derived?: readonly string[]
  resetOn: ResetPolicy<S>
  tick?(s: S, dtMs: number, ctx: Ctx, world: WorldView): StepResult<S>
  onOffline?(s: S, elapsedMs: number, ctx: Ctx, world: WorldView): StepResult<S>
  on?(s: S, event: EngineEvent, ctx: Ctx, world: WorldView): StepResult<S>
  /** Must depend on module slices and the definition only (cached per slice set). */
  effects?(s: S, view: StateView): readonly EffectSource[]
  actions?: Readonly<Record<string, ActionFn<S>>>
  playtestEvents?: readonly string[]
  /** Payout if `layer` may be performed now, else 0 (only the prestige module implements this). */
  prestigePayout?(s: S, layer: string, world: WorldView): number
  /** A rich, non-default slice for the save guards (coverage, size). */
  sample?(ctx: Ctx, def: GameDefinition): S
}

/**
 * A module of any slice type. `any` is deliberate here: a game lists
 * heterogeneous modules in one array; each module is type-checked where it is
 * defined, and the engine only moves slices around as opaque values.
 */
// oxlint-disable-next-line no-explicit-any
export type AnyModule = EngineModule<any>

export interface CoreState {
  /** Primary currency balance. */
  primary: Num
  /** Primary earned since the last prestige of any layer. */
  primaryRun: Num
  primaryLifetime: Num
  /** Last time the game was simulated (ms). */
  lastSeen: number
  createdAt: number
  /** RNG state as hex. */
  rng: string
}

export interface BalanceConfig {
  /** Fixed logic step (ms). */
  tickMs: number
  /** Real-time gaps longer than this are handled as offline time. */
  maxCatchupMs: number
  milestones: { levels: readonly number[]; factor: number }
  offline: { softHours: number; hardHours: number; decay: number; minClaimMs: number }
  branches: { maxRank: number; efficiencyPerRank: number; capacityPerRank: number; costFactor: number; costGrowth: number; capacityCostMult: number; minCost: number }
  progression: {
    maxLevel: number
    xpPerUpgrade: number
    xpBase: number
    xpLinear: number
    xpQuad: number
    multPerLevel: number
    multCapLevels: number
  }
  metaShop: {
    /** Layer whose count drives tip bands and credit. */
    layer: string
    perProducerLevel: number
    primarySqrtDiv: number
    primaryCap: number
    perPrestige: number
    firstRankBase: number
    rankBase: number
    rankStep: number
    rankStepGrowth: number
  }
  burst: { maxCharges: number; rechargeMs: number; seconds: number }
  surprises: { chance: number; seconds: number; minIntervalMs: number }
  helper: { ranks: readonly { cost: Amount; intervalMs: number }[] }
  /** Free room for game-specific knobs (simulator can override). */
  extra?: Record<string, number>
}

export interface LevelReward {
  level: number
  grant: readonly Amount[]
}

export type MetaEffectKind = 'add' | 'mulLinear' | 'mulCompound'

export interface MetaItemDef {
  /** Stable id, saved. Never rename. */
  id: string
  currency: string
  /** Grouping for the UI (branch id), not saved. */
  branch: string
  maxRank: number
  cost: { base: Num; growth: number }
  effects: readonly { target: EffectTarget; kind: MetaEffectKind; perRank: number }[]
  unlock?: {
    /** Stagger offset added to the default need curve. */
    offset?: number
    /** Tip band: 'immediate' from the first prestige, 'wave2' from the second, 'free' always open. */
    tip?: 'immediate' | 'wave2' | 'free'
    /** Linear need curve instead of the default: base + rank · step. */
    linear?: { base: number; step: number }
    producersOnline?: number
  }
}

export interface GameDefinition {
  /** Stable, never change. */
  id: string
  /** localStorage key, unique per game. */
  saveKey: string
  /** Game content format version (own migration chain on the whole envelope). */
  contentVersion: number
  contentMigrations: Readonly<Record<number, Migration>>
  currencies: readonly CurrencyDef[]
  producers: readonly ProducerDef[]
  prestigeLayers: readonly PrestigeLayerDef[]
  metaShop: readonly MetaItemDef[]
  levelRewards: readonly LevelReward[]
  modules: readonly AnyModule[]
  balance: BalanceConfig
  /** Seed for a brand-new save (the UI may mix in the clock). */
  seed?: number
}
