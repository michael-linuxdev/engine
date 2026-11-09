/**
 * Content ids that end up in saves. `ids.lock.json` per game lists them; an
 * id may be added but never removed or renamed.
 */
import type { GameDefinition } from './types'

export type IdTable = Record<string, string[]>

export function collectIds(def: GameDefinition, extra: IdTable = {}): IdTable {
  const out: IdTable = {
    modules: def.modules.map((m) => m.id),
    currencies: def.currencies.map((c) => c.id),
    producers: def.producers.map((p) => p.id),
    prestigeLayers: def.prestigeLayers.map((l) => l.id),
    metaShop: def.metaShop.map((m) => m.id),
    ...extra,
  }
  for (const k of Object.keys(out)) out[k] = [...new Set(out[k])].sort()
  return out
}

export interface IdLockDiff {
  /** Locked ids that are gone (always an error). */
  missing: string[]
  /** New ids not yet in the lock (run `npm run ids:update`). */
  added: string[]
}

export function diffIdLock(current: IdTable, lock: IdTable): IdLockDiff {
  const missing: string[] = []
  const added: string[] = []
  for (const [cat, ids] of Object.entries(lock)) {
    const now = new Set(current[cat] ?? [])
    for (const id of ids) if (!now.has(id)) missing.push(`${cat}:${id}`)
  }
  for (const [cat, ids] of Object.entries(current)) {
    const old = new Set(lock[cat] ?? [])
    for (const id of ids) if (!old.has(id)) added.push(`${cat}:${id}`)
  }
  return { missing, added }
}

/** Lock after an update: union of both (removal is never allowed). */
export function mergeIdLock(current: IdTable, lock: IdTable): IdTable {
  const out: IdTable = {}
  for (const cat of new Set([...Object.keys(lock), ...Object.keys(current)])) out[cat] = [...new Set([...(lock[cat] ?? []), ...(current[cat] ?? [])])].sort()
  return out
}
