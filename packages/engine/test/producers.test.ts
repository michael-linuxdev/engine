import { describe, expect, it } from 'vitest'
import {
  bulkCost, createManualClock, createState, defaultBalance, dispatch, gateOpen, maxAffordable, milestoneMult, nextMilestone, quote, tick,
  unitCost, view, type GateInput, type ProducerDef,
} from '../src'
import { T0, testGame } from './fixture'

const p: ProducerDef = { id: 'x', baseCost: 10, costScale: 1.15, baseRate: 1 }
const b = defaultBalance('l1')

describe('producer formulas', () => {
  it('C(n) = C0 · g^n', () => {
    expect(unitCost(p, 0)).toBe(10)
    expect(unitCost(p, 10)).toBe(Math.floor(10 * 1.15 ** 10))
    expect(unitCost(p, 5000)).toBe(1e300)
  })
  it('bulk cost in closed form matches the sum of single costs', () => {
    for (const n of [0, 7, 40]) {
      for (const k of [1, 10, 25]) {
        let sum = 0
        for (let i = 0; i < k; i++) sum += 10 * 1.15 ** (n + i)
        expect(Math.abs(bulkCost(p, n, k) - sum) / sum).toBeLessThan(1e-9 + 1 / sum)
      }
    }
  })
  it('max affordable is exact', () => {
    for (const money of [0, 9, 10, 1000, 123456, 1e12]) {
      const k = maxAffordable(p, 3, money)
      if (k > 0) expect(bulkCost(p, 3, k)).toBeLessThanOrEqual(money)
      expect(bulkCost(p, 3, k + 1)).toBeGreaterThan(money)
    }
  })
  it('milestones double the rate', () => {
    expect(milestoneMult(24, b)).toBe(1)
    expect(milestoneMult(25, b)).toBe(2)
    expect(milestoneMult(100, b)).toBe(8)
    expect(nextMilestone(30, b)).toEqual({ at: 50, from: 25 })
    expect(nextMilestone(5000, b)).toBeNull()
  })
  it('gates: all AND (any OR)', () => {
    const g: GateInput = { prestigeCount: () => 1, primaryRun: 50, producerLevel: (id) => (id === 'a' ? 5 : 0), playerLevel: 3 }
    expect(gateOpen(undefined, g)).toBe(true)
    expect(gateOpen({ all: [{ kind: 'prestige', layer: 'l', count: 2 }] }, g)).toBe(false)
    expect(gateOpen({ any: [{ kind: 'primaryRun', amount: 100 }, { kind: 'producer', id: 'a', level: 5 }] }, g)).toBe(true)
    expect(gateOpen({ all: [{ kind: 'level', level: 3 }], any: [{ kind: 'primaryRun', amount: 100 }] }, g)).toBe(false)
  })
})

describe('producers module', () => {
  const def = testGame()
  const clock = createManualClock(T0)
  const fresh = () => {
    const s = createState(def, clock)
    return { ...s, core: { ...s.core, primary: 1000 } }
  }
  it('buys, spends and emits an event', () => {
    const r = dispatch(def, fresh(), { module: 'producers', type: 'buy', payload: { id: 'a', count: 1 } }, clock)
    expect(r.ok).toBe(true)
    expect((r.state.modules.producers as { owned: Record<string, number> }).owned.a).toBe(1)
    expect(r.state.core.primary).toBe(990)
    expect(r.events.some((e) => e.type === 'producer.bought')).toBe(true)
  })
  it('bulk ×10 and max', () => {
    const s = fresh()
    const ten = dispatch(def, s, { module: 'producers', type: 'buy', payload: { id: 'a', count: 10 } }, clock)
    expect((ten.state.modules.producers as { owned: Record<string, number> }).owned.a).toBe(10)
    expect(ten.state.core.primary).toBe(1000 - bulkCost(def.producers[0], 0, 10))
    const max = dispatch(def, s, { module: 'producers', type: 'buy', payload: { id: 'a', count: 'max' } }, clock)
    const k = maxAffordable(def.producers[0], 0, 1000)
    expect((max.state.modules.producers as { owned: Record<string, number> }).owned.a).toBe(k)
  })
  it('rejects locked and unaffordable buys without changing state', () => {
    const s = fresh()
    expect(dispatch(def, s, { module: 'producers', type: 'buy', payload: { id: 'b', count: 1 } }, clock).ok).toBe(false)
    const poor = { ...s, core: { ...s.core, primary: 5 } }
    const r = dispatch(def, poor, { module: 'producers', type: 'buy', payload: { id: 'a', count: 1 } }, clock)
    expect(r.ok).toBe(false)
    expect(r.state).toBe(poor)
    expect(dispatch(def, s, { module: 'nope', type: 'buy' }, clock).ok).toBe(false)
    expect(dispatch(def, s, { module: 'producers', type: 'buy', payload: { id: 'a', count: 0 } }, clock).ok).toBe(false)
  })
  it('income per tick follows the rate', () => {
    let s = dispatch(def, fresh(), { module: 'producers', type: 'buy', payload: { id: 'a', count: 10 } }, clock).state
    expect(view(def, s).rate()).toBeCloseTo(10 * 1.005, 6) // 10 levels → player level 2 (+0.5 %)
    const before = s.core.primary
    s = tick(def, s, 1000, clock).state
    expect(s.core.primary - before).toBeCloseTo(view(def, s).rate(), 6)
    expect(quote(view(def, s), 'b', 1).levels).toBe(1)
  })
})

describe('startProducers: producers that stand from the first second', () => {
  it('a new game starts with them, and a reset brings them back with the next level affordable', async () => {
    const { createManualClock, createState, dispatch, tick, unitCost } = await import('../src')
    const { T0, testGame } = await import('./fixture')
    const d = testGame({ startProducers: { a: 1 } })
    const c = createManualClock(T0)
    let s = createState(d, c)
    const owned = () => (s.modules.producers as { owned: Record<string, number> }).owned
    expect(owned()).toEqual({ a: 1 })
    s = { ...s, modules: { ...s.modules, producers: { owned: { a: 30, b: 12 } } } }
    s = tick(d, s, 1e9, c).state
    const r = dispatch(d, s, { module: 'prestige', type: 'perform', payload: { layer: 'l1' } }, c)
    expect(r.ok).toBe(true)
    s = r.state
    expect(owned()).toEqual({ a: 1 })
    expect(s.core.primary).toBeGreaterThanOrEqual(unitCost(d.producers[0], 1))
  })
  it('without the option a new game starts empty (unchanged default)', async () => {
    const { createManualClock, createState } = await import('../src')
    const { T0, testGame } = await import('./fixture')
    const s = createState(testGame(), createManualClock(T0))
    expect((s.modules.producers as { owned: Record<string, number> }).owned).toEqual({})
  })
})
