/**
 * Save guards that run for every game (ADR 0003):
 *  - coverage: every leaf of every module slice survives save → load
 *  - fixtures: all `save-v*.json` load losslessly (values in `save-v*.expect.json`)
 *  - size: worst-case state < 100 KB
 *  - fuzz: 500 broken saves → no crash, a valid and stable state
 *  - determinism: same seed and inputs → identical save
 *  - id lock: no content id ever disappears
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  collectIds, createManualClock, createRng, createState, diffIdLock, dispatch, loadState, serializeState, tick, unitCost, view,
  type Ctx, type EngineState, type GameDefinition, type IdTable, type Rng,
} from '@engine/core'

export const GUARD_NOW = 1_800_000_000_000

export interface SaveGuardOptions {
  def: GameDefinition
  /** Directory with save-v*.json (+ save-v*.expect.json). */
  fixturesDir?: string
  /** Path of ids.lock.json. */
  idLockFile?: string
  /** Game ids beyond the definition (regions, deeds …). */
  extraIds?: IdTable
  /** Worst-case state for the size check (default: all module samples). */
  worstCase?: (def: GameDefinition) => EngineState
  maxBytes?: number
  fuzzRuns?: number
}

type Path = (string | number)[]

function leaves(v: unknown, path: Path = [], out: Path[] = []): Path[] {
  if (Array.isArray(v)) v.forEach((x, i) => leaves(x, [...path, i], out))
  else if (typeof v === 'object' && v !== null) for (const [k, x] of Object.entries(v)) leaves(x, [...path, k], out)
  else if (typeof v === 'number' || typeof v === 'boolean') out.push(path)
  return out
}

function getAt(v: unknown, path: Path): unknown {
  let cur: unknown = v
  for (const k of path) cur = (cur as Record<string | number, unknown> | undefined)?.[k]
  return cur
}

function setAt<T>(v: T, path: Path, value: unknown): T {
  if (!path.length) return value as T
  const [k, ...rest] = path
  const copy = (Array.isArray(v) ? [...v] : { ...(v as object) }) as Record<string | number, unknown>
  copy[k] = setAt(copy[k], rest, value)
  return copy as T
}

/** State with every module set to its sample (or init). */
export function sampleState(def: GameDefinition): EngineState {
  const clock = createManualClock(GUARD_NOW)
  const base = createState(def, clock)
  const ctx: Ctx = { clock, rng: createRng(1) }
  const modules: Record<string, unknown> = {}
  for (const m of def.modules) modules[m.id] = m.sample ? m.sample(ctx, def) : base.modules[m.id]
  return { ...base, core: { ...base.core, primary: 12345, primaryRun: 2345, primaryLifetime: 99999 }, modules }
}

function roundTrip(def: GameDefinition, s: EngineState): EngineState {
  const clock = createManualClock(GUARD_NOW)
  return loadState(def, serializeState(def, s, GUARD_NOW), clock).state
}

function mutations(v: unknown): unknown[] {
  if (typeof v === 'boolean') return [!v]
  if (typeof v === 'number') return [v + 1, v - 1, v * 2, v + 0.5].filter((x) => x >= 0 && Number.isFinite(x) && x !== v)
  return []
}

function brokenVariants(rng: Rng, valid: Record<string, unknown>): unknown {
  const junk = [null, NaN, -1, 'x', [], {}, true, Number.POSITIVE_INFINITY, -1e300, '1e999', { a: { b: [1, 'c'] } }, Infinity]
  const pick = <T>(xs: readonly T[]): T => xs[rng.int(xs.length)]
  const r = rng.next()
  if (r < 0.1) return pick(['', '{', 'null', '[]', '"x"', '{"format":"engine-save"', String(rng.next())])
  // Mutate a valid save: replace random leaves and objects with junk
  let out: unknown = JSON.parse(JSON.stringify(valid))
  const paths: Path[] = []
  const walk = (v: unknown, p: Path) => {
    paths.push(p)
    if (typeof v === 'object' && v !== null) for (const [k, x] of Object.entries(v)) walk(x, [...p, Array.isArray(v) ? Number(k) : k])
  }
  walk(out, [])
  const n = 1 + rng.int(6)
  for (let i = 0; i < n; i++) {
    const p = pick(paths)
    if (!p.length) continue
    out = setAt(out, p, pick(junk))
  }
  return rng.next() < 0.5 ? JSON.stringify(out) : out
}

/** A scripted session: buy the cheapest open producer every second for `seconds`. */
export function scriptedRun(def: GameDefinition, seed: number, seconds: number): string {
  const clock = createManualClock(GUARD_NOW)
  let s = createState(def, clock, seed)
  s = { ...s, core: { ...s.core, primary: 1000 } }
  for (let i = 0; i < seconds; i++) {
    clock.advance(1000)
    for (let k = 0; k < 4; k++) s = tick(def, s, 250, clock).state
    const w = view(def, s)
    const open = def.producers.filter((p) => dispatch(def, s, { module: 'producers', type: 'buy', payload: { id: p.id, count: 1 } }, clock).ok)
    if (open.length) {
      const cheapest = [...open].sort((a, b) => unitCost(a, (w.get<{ owned: Record<string, number> }>('producers').owned[a.id] ?? 0)) - unitCost(b, (w.get<{ owned: Record<string, number> }>('producers').owned[b.id] ?? 0)))[0]
      s = dispatch(def, s, { module: 'producers', type: 'buy', payload: { id: cheapest.id, count: 1 } }, clock).state
    }
    if (i % 30 === 0) s = dispatch(def, s, { module: 'burst', type: 'use' }, clock).state
  }
  return serializeState(def, s, clock.now())
}

export function describeSaveGuards(opts: SaveGuardOptions): void {
  const { def } = opts
  describe(`${def.id}: Spielstand-Wächter`, () => {
    it('Speicher-Abdeckung: jedes Feld jedes Moduls übersteht Speichern und Laden', () => {
      const base = sampleState(def)
      const back = roundTrip(def, base)
      const lost: string[] = []
      // Whole sample must survive unchanged (except transient keys).
      for (const m of def.modules) {
        const skip = new Set([...(m.transient ?? []), ...(m.derived ?? [])])
        for (const path of leaves(base.modules[m.id])) {
          if (skip.has(String(path[0]))) continue
          const v = getAt(base.modules[m.id], path)
          if (getAt(back.modules[m.id], path) !== v) lost.push(`${m.id}.${path.join('.')}: ${String(v)} → ${String(getAt(back.modules[m.id], path))}`)
          // Changed values must survive too (catches parsers that return defaults).
          const ok = mutations(v).some((next) => {
            const changed = { ...base, modules: { ...base.modules, [m.id]: setAt(base.modules[m.id], path, next) } }
            return getAt(roundTrip(def, changed).modules[m.id], path) === next
          })
          if (!ok && mutations(v).length) lost.push(`${m.id}.${path.join('.')}: Änderung geht verloren`)
        }
      }
      for (const k of Object.keys(base.core) as (keyof EngineState['core'])[]) {
        if (typeof base.core[k] === 'number' && back.core[k] !== base.core[k]) lost.push(`core.${k}`)
      }
      expect(lost).toEqual([])
    })

    it('jedes Modul hat ein reiches Beispiel (sample) für die Abdeckung', () => {
      expect(def.modules.filter((m) => !m.sample).map((m) => m.id)).toEqual([])
    })

    it('Vorwärts-Toleranz: unbekannte Module und Felder bleiben erhalten', () => {
      const raw = JSON.parse(serializeState(def, sampleState(def), GUARD_NOW))
      raw.futureTop = { a: 1 }
      raw.modules.futureModule = { v: 3, data: { x: [1, 2] } }
      const first = def.modules[0].id
      raw.modules[first].data.futureField = 'keep'
      const s = loadState(def, raw, createManualClock(GUARD_NOW)).state
      const again = JSON.parse(serializeState(def, s, GUARD_NOW))
      expect(again.futureTop).toEqual({ a: 1 })
      expect(again.modules.futureModule).toEqual({ v: 3, data: { x: [1, 2] } })
      expect(again.modules[first].data.futureField).toBe('keep')
    })

    it('neuerer Stand wird erkannt (laden ja, schreiben gesperrt)', () => {
      const raw = JSON.parse(serializeState(def, sampleState(def), GUARD_NOW))
      raw.contentVersion = def.contentVersion + 1
      expect(loadState(def, raw, createManualClock(GUARD_NOW)).status).toBe('newer')
      const raw2 = JSON.parse(serializeState(def, sampleState(def), GUARD_NOW))
      raw2.engineVersion = 99
      expect(loadState(def, raw2, createManualClock(GUARD_NOW)).status).toBe('newer')
    })

    it(`Größe: Worst-Case-Stand unter ${Math.round((opts.maxBytes ?? 100_000) / 1000)} KB`, () => {
      const s = opts.worstCase ? opts.worstCase(def) : sampleState(def)
      const bytes = new TextEncoder().encode(serializeState(def, s, GUARD_NOW)).length
      expect(bytes).toBeLessThan(opts.maxBytes ?? 100_000)
    })

    it(`Fuzz: ${opts.fuzzRuns ?? 500} kaputte Stände → kein Absturz, gültiger und stabiler Zustand`, () => {
      const valid = JSON.parse(serializeState(def, sampleState(def), GUARD_NOW))
      const rng = createRng(20261109)
      const clock = createManualClock(GUARD_NOW)
      for (let i = 0; i < (opts.fuzzRuns ?? 500); i++) {
        const input = brokenVariants(rng, valid)
        const r = loadState(def, input, clock)
        const once = serializeState(def, r.state, GUARD_NOW)
        const twice = serializeState(def, loadState(def, once, clock).state, GUARD_NOW)
        if (twice !== once) {
          const a = JSON.parse(once)
          const b = JSON.parse(twice)
          const diff = Object.keys(a.modules).filter((k) => JSON.stringify(a.modules[k]) !== JSON.stringify(b.modules[k]))
          const core = JSON.stringify(a.core) !== JSON.stringify(b.core) ? ['core'] : []
          expect([...core, ...diff].map((k) => `${k}: ${JSON.stringify(k === 'core' ? a.core : a.modules[k]).slice(0, 200)} → ${JSON.stringify(k === 'core' ? b.core : b.modules[k]).slice(0, 200)}`), 'instabil nach zweitem Laden').toEqual([])
        }
        // NaN/Infinity in state would turn into null on save and break the stability check above.
        for (const v of Object.values(r.state.core)) if (typeof v === 'number') expect(Number.isFinite(v)).toBe(true)
      }
    })

    it('Determinismus: gleicher Seed und gleiche Eingaben → identischer Spielstand', () => {
      expect(scriptedRun(def, 7, 120)).toBe(scriptedRun(def, 7, 120))
    })

    if (opts.fixturesDir) {
      const dir = opts.fixturesDir
      it('Fixtures: alle alten Spielstände laden verlustfrei', () => {
        const files = existsSync(dir) ? readdirSync(dir).filter((f) => /^save-v\d+\.json$/.test(f)) : []
        expect(files.length, `keine Fixtures in ${dir}`).toBeGreaterThan(0)
        for (const f of files) {
          const raw = readFileSync(join(dir, f), 'utf8')
          const r = loadState(def, raw, createManualClock(GUARD_NOW))
          expect(['ok', 'newer'], f).toContain(r.status)
          const expectFile = join(dir, f.replace('.json', '.expect.json'))
          expect(existsSync(expectFile), `${f}: Erwartung fehlt`).toBe(true)
          const exp = JSON.parse(readFileSync(expectFile, 'utf8')) as { values: Record<string, unknown> }
          const state = { core: r.state.core, modules: r.state.modules }
          for (const [p, v] of Object.entries(exp.values)) expect(getAt(state, p.split('.')), `${f}: ${p}`).toEqual(v)
          // Unknown data from the fixture must be written back as well
          const again = JSON.parse(serializeState(def, r.state, GUARD_NOW))
          const orig = JSON.parse(raw)
          for (const k of Object.keys(orig.modules ?? {})) expect(again.modules[k], `${f}: Modul ${k}`).toBeDefined()
        }
      })
    }

    if (opts.idLockFile) {
      const lockFile = opts.idLockFile
      it('ID-Sperre: keine gespeicherte Inhalts-ID verschwindet', () => {
        expect(existsSync(lockFile), `${lockFile} fehlt (npm run ids:update)`).toBe(true)
        const lock = JSON.parse(readFileSync(lockFile, 'utf8')) as IdTable
        const diff = diffIdLock(collectIds(def, opts.extraIds), lock)
        expect(diff.missing, 'IDs dürfen nie entfernt oder umbenannt werden').toEqual([])
        expect(diff.added, 'neue IDs: npm run ids:update').toEqual([])
      })
    }
  })
}
