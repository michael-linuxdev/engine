import { describe, expect, it } from 'vitest'
import {
  createManualClock, createSaveGuard, createState, decodeBackup, dispatch, encodeBackup, ENGINE_VERSION, fnv1a, fromBase64, isNewerSave,
  loadState, MAX_NUM, progressionModule, serializeState, standardModules, toBase64, toSaveObject, type EngineModule,
} from '../src'
import { T0, testGame } from './fixture'

const clock = createManualClock(T0)

describe('envelope', () => {
  const def = testGame()
  it('round-trips and has the documented shape', () => {
    let s = createState(def, clock)
    s = { ...s, core: { ...s.core, primary: 500 } }
    s = dispatch(def, s, { module: 'producers', type: 'buy', payload: { id: 'a', count: 3 } }, clock).state
    const raw = toSaveObject(def, s, T0)
    expect(Object.keys(raw).sort()).toEqual(['contentVersion', 'core', 'engineVersion', 'format', 'game', 'modules', 'savedAt'])
    expect(raw.format).toBe('engine-save')
    expect((raw.modules as Record<string, { v: number }>).producers.v).toBe(1)
    const back = loadState(def, JSON.stringify(raw), clock)
    expect(back.status).toBe('ok')
    expect(serializeState(def, back.state, T0)).toBe(serializeState(def, s, T0))
  })
  it('empty, corrupt and foreign input give a fresh state, never a throw', () => {
    expect(loadState(def, null, clock).status).toBe('new')
    expect(loadState(def, '{', clock).status).toBe('corrupt')
    expect(loadState(def, '[1,2]', clock).status).toBe('corrupt')
    expect(loadState(def, { format: 'engine-save', game: 'other' }, clock).status).toBe('foreign')
  })
  it('tolerant parsers: garbage fields fall back, nothing throws', () => {
    const raw = JSON.parse(serializeState(def, createState(def, clock), T0))
    raw.core.primary = 'lots'
    raw.core.lastSeen = -5
    raw.modules.producers.data.owned = { a: -3, b: 'x', c3: 4, zz: 9 }
    raw.modules.prestige.data = 'nope'
    const r = loadState(def, raw, clock)
    expect(r.state.core.primary).toBe(0)
    expect((r.state.modules.producers as { owned: Record<string, number> }).owned).toEqual({ c3: 4 })
    expect((r.state.modules.prestige as { layers: unknown[] }).layers).toHaveLength(3)
  })
  it('1e300 survives saving; Infinity is never written', () => {
    let s = createState(def, clock)
    s = { ...s, core: { ...s.core, primary: MAX_NUM, primaryLifetime: MAX_NUM } }
    const back = loadState(def, serializeState(def, s, T0), clock).state
    expect(back.core.primary).toBe(MAX_NUM)
    const raw = JSON.parse(serializeState(def, s, T0))
    raw.core.primary = Number.POSITIVE_INFINITY // JSON writes this as null
    expect(loadState(def, JSON.stringify(raw).replace('null', '0'), clock).state.core.primary).toBeLessThanOrEqual(MAX_NUM)
  })
  it('detects newer saves on every level', () => {
    const raw = JSON.parse(serializeState(def, createState(def, clock), T0))
    expect(isNewerSave(def, raw)).toBe(false)
    expect(isNewerSave(def, { ...raw, engineVersion: ENGINE_VERSION + 1 })).toBe(true)
    expect(isNewerSave(def, { ...raw, contentVersion: 2 })).toBe(true)
    expect(isNewerSave(def, { ...raw, modules: { ...raw.modules, burst: { v: 9, data: {} } } })).toBe(true)
  })
})

describe('three migration chains', () => {
  it('content and module migrations run in order and keep the data', () => {
    // Version 2 of a module renamed `xp` → `points`; version 3 doubled it.
    const base = progressionModule()
    const v3: EngineModule<{ xp: number; rewarded: number[] }> = {
      ...base,
      version: 3,
      migrations: {
        1: (r) => ({ points: r.xp, rewarded: r.rewarded }),
        2: (r) => ({ xp: Number(r.points) * 2, rewarded: r.rewarded }),
      },
    }
    const oldDef = testGame()
    const save = JSON.parse(serializeState(oldDef, createState(oldDef, clock), T0))
    save.modules.progression.data = { xp: 50, rewarded: [] }
    save.modules.legacy = { v: 1, data: { gold: 7 } }
    const newDef = testGame({
      contentVersion: 2,
      contentMigrations: {
        // Content step: move an old module into the wallet
        1: (raw) => {
          const mods = raw.modules as Record<string, { v: number; data: Record<string, unknown> }>
          const gold = Number(mods.legacy?.data.gold ?? 0)
          const w = mods.wallet.data as { balances: Record<string, number> }
          w.balances.gem = (w.balances.gem ?? 0) + gold
          return raw
        },
      },
      modules: standardModules().map((m) => (m.id === 'progression' ? v3 : m)),
    })
    const r = loadState(newDef, save, clock)
    expect(r.migrated).toBe(true)
    expect(r.status).toBe('ok')
    expect((r.state.modules.progression as { xp: number }).xp).toBe(100)
    expect((r.state.modules.wallet as { balances: Record<string, number> }).balances.gem).toBe(7)
    // Unknown module from the old save is still kept
    expect(JSON.parse(serializeState(newDef, r.state, T0)).modules.legacy).toEqual({ v: 1, data: { gold: 7 } })
  })
})

describe('backup code', () => {
  const data = { 'g-save': '{"a":1,"ä":"ü€😀"}', 'g-prefs': '{}' }
  it('base64 and UTF-8 round-trip', () => {
    for (const t of ['', 'a', 'ab', 'abc', 'äöü ß € 😀', JSON.stringify(data)]) expect(fromBase64(toBase64(t))).toBe(t)
    expect(fnv1a('abc')).toBe('1a47e90b')
  })
  it('encodes with checksum and rejects tampering, other apps and newer bundles', () => {
    const code = encodeBackup('TG1:', 'g', data, T0)
    expect(code.startsWith('TG1:')).toBe(true)
    const ok = decodeBackup('TG1:', 'g', code)
    expect(ok.ok && ok.bundle.data).toEqual(data)
    const json = fromBase64(code.slice(4))
    expect(decodeBackup('TG1:', 'g', json).ok).toBe(true)
    expect(decodeBackup('TG1:', 'g', json.replace('"a\\":1', '"a\\":2'))).toEqual({ ok: false, reason: 'checksum' })
    expect(decodeBackup('TG1:', 'other', code)).toEqual({ ok: false, reason: 'app' })
    expect(decodeBackup('TG1:', 'g', 'TG1:%%%')).toEqual({ ok: false, reason: 'format' })
    const newer = JSON.parse(json)
    newer.v = 99
    expect(decodeBackup('TG1:', 'g', JSON.stringify(newer))).toEqual({ ok: false, reason: 'newer' })
  })
})

describe('save guard', () => {
  it('newer and foreign are sticky, others clear', () => {
    const g = createSaveGuard()
    const seen: unknown[] = []
    g.subscribe((b) => seen.push(b))
    g.set('pending')
    expect(g.canWrite()).toBe(false)
    g.set(null)
    expect(g.canWrite()).toBe(true)
    g.set('newer')
    g.set(null)
    g.set('otherTab')
    expect(g.get()).toBe('newer')
    expect(seen).toEqual(['pending', null, 'newer'])
  })
})
