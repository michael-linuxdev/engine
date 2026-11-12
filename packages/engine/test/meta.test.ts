import { describe, expect, it } from 'vitest'
import {
  bestBuy, burstMax, createManualClock, createState, dispatch, isRankUnlocked, isTipRank, metaCost, metaEffects, nextGoal, nextLockedMeta, rankUnlockNeed,
  tick, unitCost, unlockProgress, view, type EngineState, type MetaItemDef,
} from '../src'
import { T0, testGame } from './fixture'

const clock = createManualClock(T0)

function withMeta(s: EngineState, m1: number): EngineState {
  return { ...s, modules: { ...s.modules, wallet: { balances: { ...(s.modules.wallet as { balances: Record<string, number> }).balances, m1 }, earned: {} } } }
}

describe('meta shop', () => {
  const def = testGame()
  const gated = def.metaShop.find((i) => i.id === 'gated')!
  it('cost curve and effect values', () => {
    const item: MetaItemDef = def.metaShop[0]
    expect(metaCost(item, 0)).toBe(1)
    expect(metaCost(item, 3)).toBe(Math.ceil(1.2 ** 3))
    expect(metaEffects(item, 2)[0]).toMatchObject({ target: 'rate:*', op: 'mul', value: 2 })
    expect(metaEffects(gated, 2)[0].value).toBeCloseTo(0.81, 9)
    expect(metaEffects(item, 0)).toEqual([])
  })
  it('tip band grows with the prestige count', () => {
    const imm: MetaItemDef = { ...gated, unlock: { tip: 'immediate' } }
    const w2: MetaItemDef = { ...gated, unlock: { tip: 'wave2' } }
    expect(isTipRank(imm, 0, 0)).toBe(true)
    expect(isTipRank(imm, 2, 2)).toBe(false)
    expect(isTipRank(imm, 2, 3)).toBe(true)
    expect(isTipRank(w2, 0, 1)).toBe(false)
    expect(isTipRank(w2, 0, 2)).toBe(true)
  })
  it('ranks open during the rebuild (producer levels + √ run primary)', () => {
    let s = createState(def, clock)
    const v0 = view(def, s)
    expect(rankUnlockNeed(gated, 0, 0, v0)).toBe(12_000)
    expect(isRankUnlocked(v0, gated, 0)).toBe(false)
    expect(nextLockedMeta(v0)?.item.id).toBe('gated')
    s = { ...s, modules: { ...s.modules, producers: { owned: { a: 15 } } } }
    expect(unlockProgress(view(def, s))).toBe(15 * 800)
    expect(isRankUnlocked(view(def, s), gated, 0)).toBe(true)
    // run primary counts with √, capped
    const rich = { ...s, core: { ...s.core, primaryRun: 1e30 } }
    expect(unlockProgress(view(def, rich))).toBe(15 * 800 + 30_000)
  })
  it('buying spends the meta currency and stops at max rank', () => {
    let s = withMeta(createState(def, clock), 1000)
    for (let i = 0; i < 12; i++) s = dispatch(def, s, { module: 'metaShop', type: 'buy', payload: { id: 'startA' } }, clock).state
    expect((s.modules.metaShop as { ranks: Record<string, number> }).ranks.startA).toBe(3)
    expect((s.modules.wallet as { balances: Record<string, number> }).balances.m1).toBe(997)
    expect(dispatch(def, withMeta(createState(def, clock), 0), { module: 'metaShop', type: 'buy', payload: { id: 'mult' } }, clock).ok).toBe(false)
  })
})

describe('burst', () => {
  const def = testGame()
  it('uses a charge for N seconds of income and refills over time', () => {
    let s = createState(def, clock)
    s = { ...s, core: { ...s.core, primary: 100 } }
    s = dispatch(def, s, { module: 'producers', type: 'buy', payload: { id: 'a', count: 5 } }, clock).state
    const rate = view(def, s).rate()
    const before = s.core.primary
    s = dispatch(def, s, { module: 'burst', type: 'use' }, clock).state
    expect(s.core.primary - before).toBeCloseTo(rate * 60, 6)
    expect((s.modules.burst as { charges: number }).charges).toBe(2)
    s = dispatch(def, s, { module: 'burst', type: 'use' }, clock).state
    s = dispatch(def, s, { module: 'burst', type: 'use' }, clock).state
    expect(dispatch(def, s, { module: 'burst', type: 'use' }, clock).ok).toBe(false)
    clock.advance(11 * 60_000)
    s = tick(def, s, 250, clock).state
    expect((s.modules.burst as { charges: number }).charges).toBe(2)
    clock.advance(60 * 60_000)
    s = tick(def, s, 250, clock).state
    expect((s.modules.burst as { charges: number; nextAt: number }).charges).toBe(burstMax(view(def, s)))
    expect((s.modules.burst as { nextAt: number }).nextAt).toBe(0)
    clock.set(T0)
  })
})

describe('helper', () => {
  const def = testGame()
  it('hire costs meta; then it buys on its own at its interval', () => {
    let s = withMeta(createState(def, clock), 10)
    s = { ...s, core: { ...s.core, primary: 1000 } }
    s = dispatch(def, s, { module: 'helper', type: 'upgrade' }, clock).state
    expect((s.modules.helper as { rank: number }).rank).toBe(1)
    for (let i = 0; i < 20; i++) s = tick(def, s, 250, clock).state // 5 s → 5 buys at 1 s
    expect((s.modules.producers as { owned: Record<string, number> }).owned.a).toBe(5)
    expect(JSON.stringify(s.modules.helper)).toContain('carryMs')
    s = dispatch(def, s, { module: 'helper', type: 'setRule', payload: { rule: 'lowest' } }, clock).state
    expect((s.modules.helper as { rule: string }).rule).toBe('lowest')
    expect(dispatch(def, s, { module: 'helper', type: 'setRule', payload: { rule: 'evil' } }, clock).ok).toBe(false)
    s = dispatch(def, s, { module: 'helper', type: 'upgrade' }, clock).state
    expect(dispatch(def, s, { module: 'helper', type: 'upgrade' }, clock).ok).toBe(false)
  })
  it('helper buys never trigger surprises', () => {
    const d = testGame()
    d.balance.surprises = { chance: 1, seconds: 10, minIntervalMs: 0 }
    let s = withMeta(createState(d, clock), 10)
    s = { ...s, core: { ...s.core, primary: 1000 } }
    s = dispatch(d, s, { module: 'helper', type: 'upgrade' }, clock).state
    for (let i = 0; i < 8; i++) s = tick(d, s, 250, clock).state
    expect((s.modules.surprises as { found: number }).found).toBe(0)
  })
})

describe('surprises', () => {
  it('manual buys roll; throttled by the minimum interval', () => {
    const d = testGame()
    d.balance.surprises = { chance: 1, seconds: 10, minIntervalMs: 1000 }
    let s = createState(d, clock)
    s = { ...s, core: { ...s.core, primary: 1000 } }
    s = dispatch(d, s, { module: 'producers', type: 'buy', payload: { id: 'a', count: 1 } }, clock).state
    expect((s.modules.surprises as { found: number }).found).toBe(1)
    s = dispatch(d, s, { module: 'producers', type: 'buy', payload: { id: 'a', count: 1 } }, clock).state
    expect((s.modules.surprises as { found: number }).found).toBe(1)
    clock.advance(1500)
    const r = dispatch(d, s, { module: 'producers', type: 'buy', payload: { id: 'a', count: 1 } }, clock)
    expect(r.events.some((e) => e.type === 'surprise.found')).toBe(true)
    clock.set(T0)
  })

  it('every n-th manual level is a sure find, kept between floor and cap', () => {
    const d = testGame()
    d.balance.surprises = { chance: 0, seconds: 90, secondsMax: 210, minIntervalMs: 0, every: { count: 5, seconds: 45 }, floorSeconds: 8, capShare: 0.12 }
    let s = createState(d, clock)
    s = { ...s, core: { ...s.core, primary: 1e9 } }
    const found = () => (s.modules.surprises as { found: number; buys: number })
    for (let i = 0; i < 4; i++) s = dispatch(d, s, { module: 'producers', type: 'buy', payload: { id: 'a', count: 1 } }, clock).state
    expect(found().found).toBe(0)
    expect(found().buys).toBe(4)
    const r = dispatch(d, s, { module: 'producers', type: 'buy', payload: { id: 'a', count: 1 } }, clock)
    s = r.state
    expect(found().found).toBe(1)
    const e = r.events.find((x) => x.type === 'surprise.found')!
    expect(e.kind).toBe('sure')
    const rate = view(d, s).rate()
    // Never below a few seconds of income, never above the share of this run's income plus a minute
    expect(Number(e.amount)).toBeGreaterThanOrEqual(rate * 8 - 1e-9)
    expect(Number(e.amount)).toBeLessThanOrEqual(Math.max(rate * 8, (s.core.primaryRun + rate * 60) * 0.12) + 1e-9)
  })

  it('an old save without the buy counter loads with zero', () => {
    const d = testGame()
    const mod = d.modules.find((m) => m.id === 'surprises')!
    expect(mod.parse({ found: 3, lastAt: 5 }, {} as never, d)).toEqual({ found: 3, lastAt: 5, buys: 0, near: 0 })
  })
})

describe('best buy and next goal', () => {
  const def = testGame()
  it('best buy prefers payback; locked producers are ignored', () => {
    let s = createState(def, clock)
    expect(bestBuy(view(def, s))?.id).toBe('a')
    s = { ...s, core: { ...s.core, primary: 1e6 }, modules: { ...s.modules, producers: { owned: { a: 24 } } } }
    // a at 24 → 25 hits a milestone (×2): very short payback
    const b = bestBuy(view(def, s))!
    expect(b.id).toBe('a')
    expect(b.cost).toBe(unitCost(def.producers[0], 24))
  })
  it('next goal: prestige when ready, else unlock, else milestone', () => {
    let s = createState(def, clock)
    expect(nextGoal(view(def, s))).toMatchObject({ kind: 'unlock', id: 'b' })
    s = { ...s, modules: { ...s.modules, producers: { owned: { a: 5, b: 3 } } } }
    // c3 is behind a prestige gate → not a goal this run
    expect(nextGoal(view(def, s))).toMatchObject({ kind: 'milestone', id: 'a', at: 25 }) // a needs 20 more, b 22
    s = { ...s, modules: { ...s.modules, prestige: { layers: [{ count: 0, runEarned: 600, sinceReset: 0 }, { count: 0, runEarned: 0, sinceReset: 0 }, { count: 0, runEarned: 0, sinceReset: 0 }] } } }
    expect(nextGoal(view(def, s))).toMatchObject({ kind: 'prestige', layer: 'l1' })
  })
})

describe('surprises: almost there and lucky return', () => {
  const surprisesOf = (s: EngineState) => s.modules.surprises as { found: number; near: number }
  it('gives one find per crossed share of the first gate, once per run, and starts over after the reset', () => {
    const d = testGame()
    d.balance.surprises = { chance: 0, seconds: 10, minIntervalMs: 0, near: { ratios: [0.5, 0.9], seconds: 20 } }
    const c = createManualClock(T0)
    let s = createState(d, c)
    s = { ...s, modules: { ...s.modules, producers: { owned: { a: 1 } } } }
    const found: unknown[] = []
    const run = (ms: number) => {
      const r = tick(d, s, ms, c)
      s = r.state
      found.push(...r.events.filter((e) => e.type === 'surprise.found'))
    }
    // probe gate of the fixture is 500 at a rate of 1/s
    run(100_000)
    expect(surprisesOf(s).near).toBe(0)
    run(200_000)
    run(1000)
    expect(surprisesOf(s).near).toBe(1)
    // stays below the gate (500): at the gate itself "almost there" has nothing left to say
    run(150_000)
    run(1000)
    run(1000)
    expect(surprisesOf(s).near).toBe(3)
    expect(found.map((e) => (e as { kind: string; tier: number }).tier)).toEqual([0, 1])
    run(50_000)
    expect(found).toHaveLength(2)
    s = dispatch(d, s, { module: 'prestige', type: 'perform', payload: { layer: 'l1' } }, c).state
    expect(surprisesOf(s).near).toBe(0)
    expect(surprisesOf(s).found).toBe(2)
  })
  it('an old save without the field starts at 0', () => {
    const d = testGame()
    const m = d.modules.find((x) => x.id === 'surprises')
    expect(m?.parse({ found: 3, lastAt: 5, buys: 9 }, { clock: createManualClock(T0), rng: { next: () => 0 } } as never, d)).toEqual({ found: 3, lastAt: 5, buys: 9, near: 0 })
  })
})

describe('surprises: almost there after a jump', () => {
  const near = (s: EngineState) => (s.modules.surprises as { found: number; near: number })
  const start = () => {
    const d = testGame()
    d.balance.surprises = { chance: 0, seconds: 10, minIntervalMs: 0, near: { ratios: [0.5, 0.7, 0.9], seconds: 20 } }
    const c = createManualClock(T0)
    let s = createState(d, c)
    s = { ...s, modules: { ...s.modules, producers: { owned: { a: 1 } } } }
    return { d, c, s }
  }
  it('several shares crossed in one step give one find, for the highest', () => {
    const { d, c, s } = start()
    // probe gate 500 at 1/s: one step to 80 %
    const a = tick(d, s, 400_000, c)
    const b = tick(d, a.state, 1000, c)
    const found = [...a.events, ...b.events].filter((e) => e.type === 'surprise.found')
    expect(found).toHaveLength(1)
    expect((found[0] as unknown as { tier: number }).tier).toBe(1)
    expect(near(b.state).near).toBe(3)
  })
  it('already past the gate: no find at all, and none later in this run', () => {
    const { d, c, s } = start()
    const a = tick(d, s, 3_000_000, c)
    const b = tick(d, a.state, 1000, c)
    const x = tick(d, b.state, 1000, c)
    expect([...a.events, ...b.events, ...x.events].filter((e) => e.type === 'surprise.found')).toHaveLength(0)
    expect(near(x.state).near).toBe(7)
  })
})
