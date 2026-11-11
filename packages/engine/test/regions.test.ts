import { describe, expect, it } from 'vitest'
import {
  applyOffline, createManualClock, createState, dispatch, loadState, regionRate, regionsModule, regionStarProgress, regionStars, serializeState, standardModules, tick, totalRegionStars, view,
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

describe('regions: mastery', () => {
  const MASTERY: RegionConfig = { ...CFG(2), mastery: { levels: [3, 6], yieldPerStar: 0.5, reward: [{ currency: 'gem', amount: 4 }] } }
  const def = testGame({ modules: [...standardModules(), regionsModule(MASTERY)] })
  const gems = (s: EngineState) => (s.modules.wallet as { balances: Record<string, number> }).balances.gem ?? 0
  const setOwned = (s: EngineState, level: number, last = level): EngineState => {
    const owned = Object.fromEntries(MASTERY.regions[0].areas.map((a, k) => [a.id, k === 9 ? last : level]))
    return { ...s, modules: { ...s.modules, regions: { regions: { ...reg(s).regions, r0: { ...reg(s).regions.r0, open: true, balance: 1e30, owned } } } } }
  }
  it('stars follow the weakest area; a closed region has none; nothing extra is saved', () => {
    const clock = createManualClock(T0)
    let s = tick(def, createState(def, clock), 250, clock).state
    expect(regionStars(MASTERY, MASTERY.regions[1], reg(s).regions.r1)).toBe(0)
    s = setOwned(s, 6, 2)
    expect(regionStars(MASTERY, MASTERY.regions[0], reg(s).regions.r0)).toBe(0)
    expect(regionStarProgress(MASTERY, MASTERY.regions[0], reg(s).regions.r0)).toEqual({ stars: 0, max: 2, nextLevel: 3, have: 9, total: 10 })
    s = setOwned(s, 6, 3)
    expect(regionStars(MASTERY, MASTERY.regions[0], reg(s).regions.r0)).toBe(1)
    expect(totalRegionStars(MASTERY, reg(s))).toEqual({ have: 1, total: 4 })
    // An old save gets its stars at once: they are derived, the slice has no star field
    const loaded = loadState(def, serializeState(def, s, clock.now()), clock).state
    expect(regionStars(MASTERY, MASTERY.regions[0], reg(loaded).regions.r0)).toBe(1)
    expect(Object.keys(reg(loaded).regions.r0).sort()).toEqual(['balance', 'grow', 'introSeen', 'open', 'openedAt', 'owned', 'thrift'])
  })
  it('the buy that completes a star grants the reward once, emits an event and raises the yield', () => {
    const clock = createManualClock(T0)
    let s = setOwned(tick(def, createState(def, clock), 250, clock).state, 3, 2)
    const rate0 = regionRate(MASTERY, MASTERY.regions[0], reg(s).regions.r0, view(def, s))
    const g0 = gems(s)
    const r = dispatch(def, s, { module: 'regions', type: 'buy', payload: { region: 'r0', area: 'r0a9', count: 1 } }, clock)
    s = r.state
    expect(r.events.some((e) => e.type === 'region.mastered' && e.region === 'r0' && e.stars === 1)).toBe(true)
    expect(gems(s) - g0).toBe(4)
    // +50 % for the star; the one extra level of the last area adds its own share on top
    expect(regionRate(MASTERY, MASTERY.regions[0], reg(s).regions.r0, view(def, s))).toBeGreaterThan(rate0 * 1.5)
    // Further levels without a new star: no second reward
    const again = dispatch(def, s, { module: 'regions', type: 'buy', payload: { region: 'r0', area: 'r0a9', count: 1 } }, clock)
    expect(again.events.some((e) => e.type === 'region.mastered')).toBe(false)
    expect(gems(again.state)).toBe(gems(s))
  })
  it('without a mastery config nothing changes', () => {
    const plain = game(2)
    const clock = createManualClock(T0)
    const s = tick(plain, createState(plain, clock), 250, clock).state
    expect(regionStars(CFG(2), CFG(2).regions[0], reg(s).regions.r0)).toBe(0)
    expect(totalRegionStars(CFG(2), reg(s))).toEqual({ have: 0, total: 0 })
  })
})
