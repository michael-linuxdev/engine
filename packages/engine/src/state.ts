/**
 * Engine state: a small neutral core plus one slice per module.
 * Unknown data from newer saves is carried in `extras` and written back.
 */
import { clampNum } from './num'
import { rngFromString, rngToString } from './rng'
import type { CoreState, GameDefinition, Raw } from './types'

export interface SaveExtras {
  /** Unknown top-level envelope fields. */
  top: Raw
  /** Unknown modules (raw slice incl. version). */
  modules: Record<string, { v: number; data: unknown }>
  /** Unknown fields inside known module slices. */
  fields: Record<string, Raw>
}

export interface EngineState {
  readonly core: CoreState
  readonly modules: Readonly<Record<string, unknown>>
  readonly extras: SaveExtras
}

export function emptyExtras(): SaveExtras {
  return { top: {}, modules: {}, fields: {} }
}

export function isRecord(v: unknown): v is Raw {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

/** Non-negative finite number or fallback. */
export function parseNum(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? clampNum(v) : fallback
}

/** Non-negative integer or fallback. */
export function parseInt0(v: unknown, fallback = 0, max = Number.MAX_SAFE_INTEGER): number {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.min(max, Math.floor(v)) : fallback
}

export function parseBool(v: unknown, fallback = false): boolean {
  return typeof v === 'boolean' ? v : fallback
}

export function parseStr<T extends string>(v: unknown, allowed: readonly T[], fallback: T): T {
  return typeof v === 'string' && (allowed as readonly string[]).includes(v) ? (v as T) : fallback
}

/** Timestamp: finite, ≥ 0, else fallback. */
export function parseTime(v: unknown, fallback: number): number {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.floor(v) : fallback
}

/** Record of non-negative numbers restricted to known ids (unknown ids kept separately by the caller if needed). */
export function parseNumRecord(v: unknown, ids?: readonly string[], int = false): Record<string, number> {
  const out: Record<string, number> = {}
  if (!isRecord(v)) return out
  for (const [k, x] of Object.entries(v)) {
    if (ids && !ids.includes(k)) continue
    const n = int ? parseInt0(x, -1) : parseNum(x, -1)
    if (n >= 0) out[k] = n
  }
  return out
}

export function createCore(now: number, seed: number): CoreState {
  return { primary: 0, primaryRun: 0, primaryLifetime: 0, lastSeen: now, createdAt: now, rng: rngToString(seed) }
}

export function parseCore(raw: unknown, now: number, seed: number): CoreState {
  const r = isRecord(raw) ? raw : {}
  const base = createCore(now, seed)
  const primaryRun = parseNum(r.primaryRun)
  const primaryLifetime = Math.max(parseNum(r.primaryLifetime), primaryRun)
  return {
    primary: parseNum(r.primary),
    primaryRun,
    primaryLifetime,
    lastSeen: parseTime(r.lastSeen, base.lastSeen),
    createdAt: parseTime(r.createdAt, base.createdAt),
    rng: rngToString(rngFromString(r.rng, seed)),
  }
}

export function primaryCurrency(def: GameDefinition): string {
  const c = def.currencies.find((x) => x.role === 'primary')
  if (!c) throw new Error(`game ${def.id}: no primary currency`)
  return c.id
}
