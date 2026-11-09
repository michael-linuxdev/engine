import { describe, expect, it } from 'vitest'
import {
  branchCost, createManualClock, createState, dispatch, explain, levelMult, levelOf, view, xpForLevel, type EngineState,
} from '../src'
import { T0, testGame } from './fixture'

const def = testGame()
const clock = createManualClock(T0)
const rich = (): EngineState => {
  const s = createState(def, clock)
  return { ...s, core: { ...s.core, primary: 1e9 } }
}
const buy = (s: EngineState, id: string, count: number | 'max' = 1) => dispatch(def, s, { module: 'producers', type: 'buy', payload: { id, count } }, clock).state

describe('branches', () => {
  it('efficiency raises the producer rate, capacity lowers its cost', () => {
    let s = buy(rich(), 'a', 10)
    const r0 = view(def, s).producerRate('a')
    s = dispatch(def, s, { module: 'branches', type: 'buy', payload: { id: 'a', kind: 'efficiency' } }, clock).state
    expect(view(def, s).producerRate('a')).toBeCloseTo(r0 * 1.04, 9)
    const c0 = view(def, s).value('cost:a', 1)
    s = dispatch(def, s, { module: 'branches', type: 'buy', payload: { id: 'a', kind: 'capacity' } }, clock).state
    expect(view(def, s).value('cost:a', 1)).toBeCloseTo(c0 * 0.97, 9)
    expect(branchCost(def.producers[0], 'capacity', 0, def.balance)).toBe(Math.max(25, Math.floor(10 * 2.2 * 1.15)))
  })
  it('needs an owned producer and stops at max rank', () => {
    const s = rich()
    expect(dispatch(def, s, { module: 'branches', type: 'buy', payload: { id: 'a', kind: 'efficiency' } }, clock).ok).toBe(false)
    let t = buy(s, 'a')
    for (let i = 0; i < 5; i++) t = dispatch(def, t, { module: 'branches', type: 'buy', payload: { id: 'a', kind: 'efficiency' } }, clock).state
    expect(dispatch(def, t, { module: 'branches', type: 'buy', payload: { id: 'a', kind: 'efficiency' } }, clock).ok).toBe(false)
    expect(dispatch(def, t, { module: 'branches', type: 'buy', payload: { id: 'a', kind: 'bogus' } }, clock).ok).toBe(false)
  })
})

describe('progression', () => {
  it('xp curve and level from xp', () => {
    const b = def.balance
    expect(xpForLevel(1, b)).toBe(40 + 25 + 8)
    expect(levelOf(0, b).level).toBe(1)
    expect(levelOf(xpForLevel(1, b), b).level).toBe(2)
    expect(levelOf(1e12, b).level).toBe(b.progression.maxLevel)
    expect(levelMult(1, b)).toBe(1)
    expect(levelMult(100, b)).toBeCloseTo(1 + 24 * 0.005, 9)
  })
  it('upgrades give xp; level-up grants its reward once', () => {
    const s = buy(rich(), 'a', 10)
    const p = s.modules.progression as { xp: number; rewarded: number[] }
    expect(p.xp).toBe(80)
    expect(p.rewarded).toEqual([2])
    expect((s.modules.wallet as { balances: Record<string, number> }).balances.gem).toBe(7)
    const again = buy(s, 'a', 1)
    expect((again.modules.wallet as { balances: Record<string, number> }).balances.gem).toBe(7)
  })
  it('breakdown names every source of a rate', () => {
    let s = buy(rich(), 'a', 25)
    s = dispatch(def, s, { module: 'branches', type: 'buy', payload: { id: 'a', kind: 'efficiency' } }, clock).state
    const r = explain(def, s, 'rate:a', 25)
    expect(r.parts.map((x) => x.labelKey).sort()).toEqual(['effect.branchEfficiency', 'effect.level', 'effect.milestones'])
    expect(r.value).toBeCloseTo(view(def, s).producerRate('a'), 9)
  })
})

describe('edge cases', () => {
  it('rates and costs saturate at 1e300 instead of Infinity', () => {
    const s = rich()
    const huge = { ...s, modules: { ...s.modules, producers: { owned: { a: 1e299 } } } }
    const v = view(def, huge)
    expect(Number.isFinite(v.rate())).toBe(true)
    expect(v.rate()).toBeLessThanOrEqual(1e300)
  })
  it('a buy at 0 money is rejected cleanly', () => {
    const s = createState(def, clock)
    expect(dispatch(def, s, { module: 'producers', type: 'buy', payload: { id: 'a', count: 'max' } }, clock).ok).toBe(false)
  })
})
