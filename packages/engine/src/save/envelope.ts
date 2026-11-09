/**
 * Save envelope (ADR 0003):
 *
 *   { format: 'engine-save', engineVersion, game, contentVersion, savedAt,
 *     core: {…}, modules: { <id>: { v, data } } }
 *
 * Three migration chains: envelope (`engineVersion`), game content
 * (`contentVersion`, on the whole envelope) and module (`modules.<id>.v`).
 * Unknown modules and unknown fields are kept and written back. Parsers are
 * tolerant: a save is never thrown away.
 */
import type { Clock } from '../clock'
import { createState, validateDefinition } from '../engine'
import { createRng, rngFromString } from '../rng'
import { emptyExtras, isRecord, parseCore, type EngineState, type SaveExtras } from '../state'
import type { Ctx, GameDefinition, Migration, Raw } from '../types'

export const SAVE_FORMAT = 'engine-save'
export const ENGINE_VERSION = 1

/** ENGINE_MIGRATIONS[v]: envelope v → v + 1. */
export const ENGINE_MIGRATIONS: Readonly<Record<number, Migration>> = {}

const ENVELOPE_KEYS = new Set(['format', 'engineVersion', 'game', 'contentVersion', 'savedAt', 'core', 'modules'])

export type LoadStatus = 'new' | 'ok' | 'newer' | 'foreign' | 'corrupt'

export interface LoadResult {
  state: EngineState
  status: LoadStatus
  /** True when any migration step ran. */
  migrated: boolean
}

function runChain(raw: Raw, from: number, to: number, chain: Readonly<Record<number, Migration>>): { raw: Raw; ran: boolean } {
  let out = raw
  let ran = false
  for (let v = Math.max(1, from); v < to; v++) {
    const step = chain[v]
    if (step) {
      out = step(out)
      ran = true
    }
  }
  return { raw: out, ran }
}

function version(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v) && v >= 1 ? Math.floor(v) : 1
}

function sliceData(def: GameDefinition, id: string, s: unknown): unknown {
  const m = def.modules.find((x) => x.id === id)
  if (!m) return s
  if (m.serialize) return m.serialize(s)
  if (!isRecord(s) || !m.transient?.length) return s
  const out: Raw = {}
  for (const [k, v] of Object.entries(s)) if (!m.transient.includes(k)) out[k] = v
  return out
}

/** Plain object of the save (before JSON). */
export function toSaveObject(def: GameDefinition, state: EngineState, savedAt: number): Raw {
  const modules: Raw = { ...state.extras.modules }
  for (const m of def.modules) {
    const data = sliceData(def, m.id, state.modules[m.id])
    const extra = state.extras.fields[m.id]
    modules[m.id] = { v: m.version, data: extra && isRecord(data) ? { ...extra, ...data } : data }
  }
  return {
    ...state.extras.top,
    format: SAVE_FORMAT,
    engineVersion: ENGINE_VERSION,
    game: def.id,
    contentVersion: def.contentVersion,
    savedAt,
    core: state.core,
    modules,
  }
}

export function serializeState(def: GameDefinition, state: EngineState, savedAt: number): string {
  return JSON.stringify(toSaveObject(def, state, savedAt))
}

/** True if this raw save comes from a newer app (load allowed, writing must be blocked). */
export function isNewerSave(def: GameDefinition, raw: unknown): boolean {
  if (!isRecord(raw)) return false
  if (version(raw.engineVersion) > ENGINE_VERSION) return true
  if (version(raw.contentVersion) > def.contentVersion) return true
  const mods = isRecord(raw.modules) ? raw.modules : {}
  for (const m of def.modules) {
    const slice = mods[m.id]
    if (isRecord(slice) && version(slice.v) > m.version) return true
  }
  return false
}

/** Load a save (JSON text, parsed object or null). Never throws. */
export function loadState(def: GameDefinition, input: unknown, clock: Clock): LoadResult {
  validateDefinition(def)
  if (input === null || input === undefined || input === '') return { state: createState(def, clock), status: 'new', migrated: false }
  let raw: unknown = input
  if (typeof input === 'string') {
    try {
      raw = JSON.parse(input)
    } catch {
      return { state: createState(def, clock), status: 'corrupt', migrated: false }
    }
  }
  if (!isRecord(raw) || raw.format !== SAVE_FORMAT) return { state: createState(def, clock), status: 'corrupt', migrated: false }
  if (raw.game !== def.id) return { state: createState(def, clock), status: 'foreign', migrated: false }
  try {
    return parseEnvelope(def, raw, clock)
  } catch {
    return { state: createState(def, clock), status: 'corrupt', migrated: false }
  }
}

function parseEnvelope(def: GameDefinition, input: Raw, clock: Clock): LoadResult {
  const newer = isNewerSave(def, input)
  const env = runChain(input, version(input.engineVersion), ENGINE_VERSION, ENGINE_MIGRATIONS)
  const content = runChain(env.raw, version(env.raw.contentVersion), def.contentVersion, def.contentMigrations)
  let migrated = env.ran || content.ran
  const raw = content.raw
  const seed = def.seed ?? 0x2545f491
  const core = parseCore(raw.core, clock.now(), seed)
  const ctx: Ctx = { clock, rng: createRng(rngFromString(core.rng, seed)) }
  const rawModules = isRecord(raw.modules) ? raw.modules : {}
  const extras: SaveExtras = emptyExtras()
  for (const [k, v] of Object.entries(raw)) if (!ENVELOPE_KEYS.has(k)) extras.top[k] = v
  const modules: Record<string, unknown> = {}
  const known = new Set(def.modules.map((m) => m.id))
  for (const [id, slice] of Object.entries(rawModules)) {
    if (!known.has(id) && isRecord(slice)) extras.modules[id] = { v: version(slice.v), data: slice.data }
  }
  for (const m of def.modules) {
    const slice = rawModules[m.id]
    if (!isRecord(slice)) {
      modules[m.id] = m.init(ctx, def)
      continue
    }
    // Module migrations work on record slices; anything else goes to the tolerant parser as is.
    const step = isRecord(slice.data) ? runChain(slice.data, version(slice.v), m.version, m.migrations ?? {}) : { raw: slice.data, ran: false }
    migrated = migrated || step.ran
    const data: unknown = step.raw
    let parsed: unknown
    try {
      parsed = m.parse(data, ctx, def)
    } catch {
      parsed = m.init(ctx, def)
    }
    modules[m.id] = parsed
    // Keep fields this app does not know (written back on save).
    if (isRecord(data)) {
      const back = sliceData(def, m.id, parsed)
      const ownKeys = new Set([...(isRecord(back) ? Object.keys(back) : []), ...(m.transient ?? []), ...(m.derived ?? [])])
      const unknown: Raw = {}
      for (const [k, v] of Object.entries(data)) if (!ownKeys.has(k)) unknown[k] = v
      if (Object.keys(unknown).length) extras.fields[m.id] = unknown
    }
  }
  return { state: { core, modules, extras }, status: newer ? 'newer' : 'ok', migrated }
}
