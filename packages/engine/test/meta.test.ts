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
