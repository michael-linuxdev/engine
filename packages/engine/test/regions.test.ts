import { describe, expect, it } from 'vitest'
import {
  applyOffline, createManualClock, createState, dispatch, loadState, regionsModule, serializeState, standardModules, tick, view,
  type EngineState, type GameDefinition, type RegionConfig, type RegionDef, type RegionsState,
} from '../src'
import { T0, testGame } from './fixture'

function regionDefs(n: number): RegionDef[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `r${i}`,
    startBalance: 20,
    opens: (w) => i === 0 || w.core.primaryLifetime >= 1000 * i,
    areas: Array.from({ length: 10 }, (_, k) => ({ id: `r${i}a${k}`, baseCost: 10 * 8 ** k, costScale: 1.15, baseRate: 1 * 6 ** k })),
  }))
}

const CFG = (n: number): RegionConfig => ({ regions: regionDefs(n), care: { maxRank: 10, growPerRank: 0.1, thriftPerRank: 0.03, costBase: 50, costGrowth: 1.6 }, bonus: { cap: 1, l0: 400 } })

function game(n = 3): GameDefinition {
  return testGame({ modules: [...standardModules(), regionsModule(CFG(n))] })
}

const reg = (s: EngineState) => s.modules.regions as RegionsState

describe('regions', () => {
  it('opens by condition, earns its own currency, buys areas in order', () => {
    const def = game()
    const clock = createManualClock(T0)
    let s = createState(def, clock)
    s = tick(def, s, 250, clock).state
    expect(reg(s).regions.r0.open).toBe(true)
    expect(reg(s).regions.r1.open).toBe(false)
    expect(dispatch(def, s, { module: 'regions', type: 'buy', payload: { region: 'r0', area: 'r0a1' } }, clock).ok).toBe(false)
    s = dispatch(def, s, { module: 'regions', type: 'buy', payload: { region: 'r0', area: 'r0a0' } }, clock).state
    expect(reg(s).regions.r0.owned.r0a0).toBe(1)
    const b0 = reg(s).regions.r0.balance
    s = tick(def, s, 10_000, clock).state
    expect(reg(s).regions.r0.balance).toBeCloseTo(b0 + 10, 6)
    expect(view(def, s).value('rate:a', 1)).toBeGreaterThan(1)
  })
  it('care: grow raises the region rate, thrift lowers costs, capped', () => {
    const def = game()
    const clock = createManualClock(T0)
    let s = tick(def, createState(def, clock), 250, clock).state
    s = { ...s, modules: { ...s.modules, regions: { regions: { ...reg(s).regions, r0: { ...reg(s).regions.r0, balance: 1e9, owned: { r0a0: 10 } } } } } }
    for (let i = 0; i < 12; i++) s = dispatch(def, s, { module: 'regions', type: 'care', payload: { region: 'r0', kind: 'grow' } }, clock).state
    expect(reg(s).regions.r0.grow).toBe(10)
  })
  it('offline income with the same caps; a later region list fills in; data of known regions stays', () => {
    const old = game(2)
    const clock = createManualClock(T0)
    let s = tick(old, createState(old, clock), 250, clock).state
    s = dispatch(old, s, { module: 'regions', type: 'buy', payload: { region: 'r0', area: 'r0a0' } }, clock).state
    clock.advance(3600_000)
    s = applyOffline(old, s, clock).state
    expect(reg(s).regions.r0.balance).toBeGreaterThan(3000)
    const loaded = loadState(game(5), serializeState(old, s, clock.now()), clock).state
    expect(Object.keys(reg(loaded).regions)).toEqual(['r0', 'r1', 'r2', 'r3', 'r4'])
    expect(reg(loaded).regions.r0.owned.r0a0).toBe(1)
  })
  it('50 fully built regions stay well below 100 KB', () => {
    const def = game(50)
    const clock = createManualClock(T0)
    let s = createState(def, clock)
    const regions: RegionsState['regions'] = {}
    for (const r of regionDefs(50)) regions[r.id] = { open: true, owned: Object.fromEntries(r.areas.map((a) => [a.id, 1000])), balance: 1.234e250, grow: 10, thrift: 10, introSeen: true, openedAt: T0 }
    s = { ...s, modules: { ...s.modules, regions: { regions } } }
    const bytes = serializeState(def, s, T0).length
    expect(bytes).toBeLessThan(100_000)
  })
})
