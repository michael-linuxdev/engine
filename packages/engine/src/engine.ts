/**
 * The engine runtime: pure functions `(state, input, clock) => state`.
 *
 * Every step works on a draft (shallow copies, slices replaced whole), runs
 * module results through one queue (spend/grant, events, follow-up
 * dispatches, prestige) and writes the RNG state back into the core, so the
 * same start state, actions and clock always give bit-identical saves.
 */
import { resolve, resolveValue, type Resolved } from './effects'
import type { Clock } from './clock'
import { addNum, clampNum, subNum } from './num'
import { createRng, rngFromString, rngToString, type Rng } from './rng'
import { createCore, emptyExtras, primaryCurrency, type EngineState } from './state'
import type {
  ActionResult,
  AnyModule,
  CoreState,
  Ctx,
  DispatchRequest,
  EffectSource,
  EngineEvent,
  GameDefinition,
  ResetRule,
  StateView,
  StepResult,
  WorldView,
} from './types'
import { walletAdd, WALLET_ID, type WalletState } from './modules/wallet'
import { isResult } from './result'
import { unitCost } from './producers'
import { MODULE } from './modules/ids'

/** What is left over after the first upgrade following a reset (see `startProducers`). */
const START_SPARE = 5

export { act } from './result'

/* ------------------------------------------------------------------ */
/* Definition checks                                                   */
/* ------------------------------------------------------------------ */

const checked = new WeakSet<GameDefinition>()

/** Throws on structural mistakes (duplicate ids, unknown currencies, missing wallet). */
export function validateDefinition(def: GameDefinition): void {
  if (checked.has(def)) return
  const dup = (label: string, ids: readonly string[]) => {
    const seen = new Set<string>()
    for (const id of ids) {
      if (seen.has(id)) throw new Error(`${def.id}: duplicate ${label} id "${id}"`)
      seen.add(id)
    }
  }
  dup('module', def.modules.map((m) => m.id))
  dup('currency', def.currencies.map((c) => c.id))
  dup('producer', def.producers.map((p) => p.id))
  dup('prestige layer', def.prestigeLayers.map((l) => l.id))
  dup('meta item', def.metaShop.map((m) => m.id))
  primaryCurrency(def)
  if (!def.modules.some((m) => m.id === WALLET_ID)) throw new Error(`${def.id}: wallet module missing`)
  const currencies = new Set(def.currencies.map((c) => c.id))
  for (const l of def.prestigeLayers) if (!currencies.has(l.currency)) throw new Error(`${def.id}: layer ${l.id} pays unknown currency ${l.currency}`)
  for (const m of def.metaShop) if (!currencies.has(m.currency)) throw new Error(`${def.id}: meta item ${m.id} costs unknown currency ${m.currency}`)
  checked.add(def)
}

/* ------------------------------------------------------------------ */
/* Effects and views                                                   */
/* ------------------------------------------------------------------ */

const effectCache = new WeakMap<object, readonly EffectSource[]>()

function makeStateView(def: GameDefinition, core: CoreState, modules: Readonly<Record<string, unknown>>): StateView {
  const prim = primaryCurrency(def)
  return {
    def,
    core,
    get: <S>(id: string) => modules[id] as S,
    balance: (c) => (c === prim ? core.primary : ((modules[WALLET_ID] as WalletState | undefined)?.balances[c] ?? 0)),
  }
}

/** All effect sources of a state (cached per slice set). */
export function effectSources(def: GameDefinition, state: Pick<EngineState, 'core' | 'modules'>): readonly EffectSource[] {
  const hit = effectCache.get(state.modules)
  if (hit) return hit
  const view = makeStateView(def, state.core, state.modules)
  const out: EffectSource[] = []
  for (const m of def.modules) {
    if (!m.effects) continue
    out.push(...m.effects(state.modules[m.id], view))
  }
  effectCache.set(state.modules, out)
  return out
}

export function makeWorld(def: GameDefinition, state: Pick<EngineState, 'core' | 'modules'>): WorldView {
  const view = makeStateView(def, state.core, state.modules)
  const sources = () => effectSources(def, state)
  const producerRate = (id: string): number => {
    const p = def.producers.find((x) => x.id === id)
    const owned = (state.modules.producers as { owned?: Record<string, number> } | undefined)?.owned?.[id] ?? 0
    if (!p || owned <= 0) return 0
    return clampNum(resolveValue(`rate:${id}`, p.baseRate * owned, sources()))
  }
  return {
    ...view,
    value: (target, base) => resolveValue(target, base, sources()),
    producerRate,
    rate: () => {
      let sum = 0
      for (const p of def.producers) sum += producerRate(p.id)
      return clampNum(resolveValue('income', sum, sources()))
    },
  }
}

/** Value plus breakdown for the UI (e.g. the multiplier sheet). */
export function explain(def: GameDefinition, state: EngineState, target: string, base: number): Resolved {
  return resolve(target, base, effectSources(def, state))
}

/* ------------------------------------------------------------------ */
/* Draft + queue                                                       */
/* ------------------------------------------------------------------ */

interface Draft {
  core: CoreState
  modules: Readonly<Record<string, unknown>>
  extras: EngineState['extras']
  events: EngineEvent[]
}

interface Job {
  kind: 'event' | 'dispatch' | 'prestige'
  event?: EngineEvent
  dispatch?: DispatchRequest
  layer?: string
}

const MAX_JOBS = 2000

function worldOf(def: GameDefinition, d: Draft): WorldView {
  return makeWorld(def, d)
}

function setSlice(d: Draft, id: string, s: unknown): void {
  if (d.modules[id] === s) return
  d.modules = { ...d.modules, [id]: s }
}

function moduleById(def: GameDefinition, id: string): AnyModule | undefined {
  return def.modules.find((m) => m.id === id)
}

/** Apply one module result. Returns false (and changes nothing) if a spend is not covered. */
function applyResult(def: GameDefinition, d: Draft, moduleId: string, r: StepResult<unknown>, jobs: Job[]): boolean {
  const res: ActionResult<unknown> = isResult(r) ? r : { state: r }
  const prim = primaryCurrency(def)
  const view = makeStateView(def, d.core, d.modules)
  // Sum spends per currency before checking (two spends of one currency).
  const need = new Map<string, number>()
  for (const s of res.spend ?? []) {
    if (!(s.amount >= 0) || !Number.isFinite(s.amount)) return false
    need.set(s.currency, (need.get(s.currency) ?? 0) + s.amount)
  }
  for (const [c, a] of need) if (view.balance(c) + 1e-9 < a) return false

  setSlice(d, moduleId, res.state)
  for (const [c, a] of need) {
    if (a <= 0) continue
    if (c === prim) d.core = { ...d.core, primary: subNum(d.core.primary, a) }
    else {
      const w = d.modules[WALLET_ID] as WalletState
      setSlice(d, WALLET_ID, walletAdd(w, c, -a))
    }
    jobs.push({ kind: 'event', event: { type: 'currency.spent', currency: c, amount: a, by: moduleId } })
  }
  for (const g of res.grant ?? []) grant(def, d, g.currency, g.amount, g.source ?? moduleId, jobs)
  for (const e of res.events ?? []) jobs.push({ kind: 'event', event: e })
  for (const x of res.dispatch ?? []) jobs.push({ kind: 'dispatch', dispatch: x })
  if (res.prestige) jobs.push({ kind: 'prestige', layer: res.prestige })
  return true
}

function grant(def: GameDefinition, d: Draft, currency: string, amount: number, source: string, jobs: Job[]): void {
  if (!(amount > 0) || !Number.isFinite(amount)) return
  if (currency === primaryCurrency(def)) {
    d.core = {
      ...d.core,
      primary: addNum(d.core.primary, amount),
      primaryRun: addNum(d.core.primaryRun, amount),
      primaryLifetime: addNum(d.core.primaryLifetime, amount),
    }
    jobs.push({ kind: 'event', event: { type: 'primary.gained', amount, source } })
  } else {
    const w = d.modules[WALLET_ID] as WalletState
    setSlice(d, WALLET_ID, walletAdd(w, currency, amount))
    jobs.push({ kind: 'event', event: { type: 'currency.gained', currency, amount, source } })
  }
}

function runJobs(def: GameDefinition, d: Draft, ctx: Ctx, jobs: Job[]): void {
  let n = 0
  while (jobs.length) {
    if (++n > MAX_JOBS) throw new Error(`${def.id}: job queue overflow (event loop between modules?)`)
    const job = jobs.shift()!
    if (job.kind === 'event') {
      const e = job.event!
      d.events.push(e)
      for (const m of def.modules) {
        if (!m.on) continue
        const r = m.on(d.modules[m.id], e, ctx, worldOf(def, d))
        if (r !== d.modules[m.id]) applyResult(def, d, m.id, r, jobs)
      }
    } else if (job.kind === 'dispatch') {
      runAction(def, d, ctx, job.dispatch!, jobs)
    } else {
      prestigeDraft(def, d, ctx, job.layer!, jobs)
    }
  }
}

function runAction(def: GameDefinition, d: Draft, ctx: Ctx, req: DispatchRequest, jobs: Job[]): boolean {
  const m = moduleById(def, req.module)
  const fn = m?.actions?.[req.type]
  if (!m || !fn) return false
  const w = worldOf(def, d)
  for (const g of def.modules) if (g.guard && !g.guard(d.modules[g.id], req, w)) return false
  const before = d.modules[m.id]
  const r = fn(before, req.payload, ctx, w)
  if (r === before) return false
  return applyResult(def, d, m.id, r, jobs)
}

/* ------------------------------------------------------------------ */
/* Prestige (generic reset across modules)                              */
/* ------------------------------------------------------------------ */

function ruleFor<S>(m: AnyModule, layer: string): ResetRule<S> {
  const p = m.resetOn
  if (p === 'keep' || p === 'reset' || typeof p === 'function') return p as ResetRule<S>
  return ((p as Record<string, ResetRule<S>>)[layer] ?? (p as Record<string, ResetRule<S>>)['*'] ?? 'keep') as ResetRule<S>
}

function prestigeDraft(def: GameDefinition, d: Draft, ctx: Ctx, layer: string, jobs: Job[]): boolean {
  const ldef = def.prestigeLayers.find((l) => l.id === layer)
  if (!ldef) return false
  const before = worldOf(def, d)
  // The module that owns layer formulas answers `prestigePayout` (0 = not allowed now).
  const owner = def.modules.find((m) => m.prestigePayout)
  const payout = owner?.prestigePayout?.(d.modules[owner.id], layer, before) ?? 0
  if (!(payout > 0)) return false
  const startPrimary = Math.max(def.startPrimary, before.value('start.primary', 0))
  const modules: Record<string, unknown> = { ...d.modules }
  for (const m of def.modules) {
    const rule = ruleFor<unknown>(m, layer)
    if (rule === 'keep') continue
    modules[m.id] = rule === 'reset' ? m.init(ctx, def) : rule(d.modules[m.id], layer, ctx, before)
  }
  d.modules = modules
  // With standing producers the next level of the first one is always affordable right after the reset
  let floor = 0
  const firstId = Object.keys(def.startProducers ?? {})[0]
  const first = firstId ? def.producers.find((p) => p.id === firstId) : undefined
  if (first) {
    const level = (modules[MODULE.producers] as { owned?: Record<string, number> } | undefined)?.owned?.[first.id] ?? 0
    floor = unitCost(first, level, Math.max(0, before.value(`cost:${first.id}`, 1))) + START_SPARE
  }
  d.core = { ...d.core, primary: clampNum(Math.max(startPrimary, floor)), primaryRun: 0 }
  grant(def, d, ldef.currency, payout, `prestige:${layer}`, jobs)
  jobs.push({ kind: 'event', event: { type: 'prestige.performed', layer, payout } })
  return true
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export interface StepOutput {
  state: EngineState
  events: EngineEvent[]
  /** False when an action was rejected (unknown, no-op or unaffordable). */
  ok: boolean
}

function begin(state: EngineState): { d: Draft; rng: Rng } {
  const rng = createRng(rngFromString(state.core.rng))
  return { d: { core: state.core, modules: state.modules, extras: state.extras, events: [] }, rng }
}

function end(d: Draft, rng: Rng, ok: boolean): StepOutput {
  const core = d.core.rng === rngToString(rng.state()) ? d.core : { ...d.core, rng: rngToString(rng.state()) }
  return { state: { core, modules: d.modules, extras: d.extras }, events: d.events, ok }
}

/** Brand-new state for a game. */
export function createState(def: GameDefinition, clock: Clock, seed = def.seed ?? 0x2545f491): EngineState {
  validateDefinition(def)
  const now = clock.now()
  const rng = createRng(seed)
  const ctx: Ctx = { clock, rng }
  const modules: Record<string, unknown> = {}
  for (const m of def.modules) modules[m.id] = m.init(ctx, def)
  const core = { ...createCore(now, seed), primary: Math.max(0, def.startPrimary), rng: rngToString(rng.state()) }
  return { core, modules, extras: emptyExtras() }
}

/** Run one module action, e.g. `{ module: 'producers', type: 'buy', payload: { id, count: 1 } }`. */
export function dispatch(def: GameDefinition, state: EngineState, req: DispatchRequest, clock: Clock): StepOutput {
  const { d, rng } = begin(state)
  const ctx: Ctx = { clock, rng }
  const jobs: Job[] = []
  const ok = runAction(def, d, ctx, req, jobs)
  if (!ok) return { state, events: [], ok: false }
  runJobs(def, d, ctx, jobs)
  return end(d, rng, true)
}

/** Perform a prestige layer directly (same as the prestige module's `perform` action). */
export function prestige(def: GameDefinition, state: EngineState, layer: string, clock: Clock): StepOutput {
  const { d, rng } = begin(state)
  const ctx: Ctx = { clock, rng }
  const jobs: Job[] = []
  if (!prestigeDraft(def, d, ctx, layer, jobs)) return { state, events: [], ok: false }
  runJobs(def, d, ctx, jobs)
  return end(d, rng, true)
}

/** One fixed logic step of `dtMs` (income, then module ticks). */
export function tick(def: GameDefinition, state: EngineState, dtMs: number, clock: Clock): StepOutput {
  const { d, rng } = begin(state)
  const ctx: Ctx = { clock, rng }
  const jobs: Job[] = []
  const dt = Math.max(0, dtMs)
  if (dt > 0) {
    const gain = makeWorld(def, d).rate() * (dt / 1000)
    grant(def, d, primaryCurrency(def), gain, 'tick', jobs)
    for (const m of def.modules) {
      if (!m.tick) continue
      const r = m.tick(d.modules[m.id], dt, ctx, worldOf(def, d))
      if (r !== d.modules[m.id]) applyResult(def, d, m.id, r, jobs)
    }
  }
  d.core = { ...d.core, lastSeen: Math.max(d.core.lastSeen, clock.now()) }
  runJobs(def, d, ctx, jobs)
  return end(d, rng, true)
}

/**
 * Time away (closed form, no tick loop): each module's `onOffline` runs with
 * the elapsed time since `core.lastSeen`. A clock that went backwards counts
 * as zero elapsed time and resets `lastSeen`.
 */
export function applyOffline(def: GameDefinition, state: EngineState, clock: Clock): StepOutput & { elapsedMs: number } {
  const now = clock.now()
  const elapsedMs = Math.max(0, now - state.core.lastSeen)
  const { d, rng } = begin(state)
  const ctx: Ctx = { clock, rng }
  const jobs: Job[] = []
  if (elapsedMs > 0) {
    for (const m of def.modules) {
      if (!m.onOffline) continue
      const r = m.onOffline(d.modules[m.id], elapsedMs, ctx, worldOf(def, d))
      if (r !== d.modules[m.id]) applyResult(def, d, m.id, r, jobs)
    }
  }
  d.core = { ...d.core, lastSeen: now }
  runJobs(def, d, ctx, jobs)
  return { ...end(d, rng, true), elapsedMs }
}

/** Convenience: world view of a finished state (UI, simulator, tests). */
export function view(def: GameDefinition, state: EngineState): WorldView {
  return makeWorld(def, state)
}
