import { describe, expect, it } from 'vitest'
import {
  createManualClock, createState, dispatch, gateAt, tick, layerStatus, payoutAtGate, payoutCurve, prestige, rawPayout, view,
  type EngineState, type LayerState,
} from '../src'
import { T0, testGame } from './fixture'

const def = testGame()
const clock = createManualClock(T0)
const L = def.prestigeLayers

const layers = (s: EngineState) => (s.modules.prestige as { layers: LayerState[] }).layers
const wallet = (s: EngineState) => (s.modules.wallet as { balances: Record<string, number> }).balances
const owned = (s: EngineState) => (s.modules.producers as { owned: Record<string, number> }).owned

/** Grant `amount` primary through an event (counts toward all layers' runEarned). */
function earn(s: EngineState, amount: number): EngineState {
  // A tick with a big rate is the honest path; here we shortcut via the burst-less grant: set producers and tick.
  // One honest income step: a temporary producer level, one tick of the needed length, level removed again.
  const before = owned(s)
  const t = { ...s, modules: { ...s.modules, producers: { owned: { ...before, a: Math.max(before.a ?? 0, 1) } } } }
  const seconds = amount / view(def, t).rate()
  const after = tick(def, t, seconds * 1000, clock).state
  return { ...after, modules: { ...after.modules, producers: { owned: before } } }
}

describe('prestige formulas', () => {
  it('gate with knee and late growth, probe for the first run', () => {
    expect(gateAt(L[0], 0)).toBe(1000)
    expect(gateAt(L[0], 3)).toBe(8000)
    expect(gateAt(L[0], 7)).toBe(Math.floor(1000 * 2 ** 5 * 1.1 ** 2))
    expect(gateAt(L[0], 0, true)).toBe(500)
    expect(payoutAtGate(L[0], 0, true)).toBe(3)
  })
  it('√ payout up to ×2 at r = 4, then +0.5 per doubling', () => {
    expect(payoutCurve(1)).toBe(1)
    expect(payoutCurve(4)).toBe(2)
    expect(payoutCurve(8)).toBe(2.5)
    expect(payoutCurve(0)).toBe(0)
    expect(rawPayout(L[0], 4000, 0)).toBe(20)
  })
})

describe('three layers in a row', () => {
  it('layer 1: probe run, reset of the run, meta kept, start bonus applied', () => {
    let s = createState(def, clock)
    s = earn(s, 600)
    const st = layerStatus(view(def, s), 'l1')
    expect(st.probe).toBe(true)
    expect(st.block).toBeNull()
    s = dispatch(def, s, { module: 'prestige', type: 'perform', payload: { layer: 'l1' } }, clock).state
    expect(layers(s)[0]).toMatchObject({ count: 1, runEarned: 0, sinceReset: 1 })
    expect(s.core.primaryRun).toBe(0)
    expect(s.core.primary).toBe(0)
    expect(owned(s)).toEqual({})
    expect(wallet(s).m1).toBeGreaterThanOrEqual(3)
    // meta shop survives the next prestige and its start bonus applies
    s = dispatch(def, s, { module: 'metaShop', type: 'buy', payload: { id: 'startA' } }, clock).state
    expect((s.modules.metaShop as { ranks: Record<string, number> }).ranks.startA).toBe(1)
    s = earn(s, gateAt(L[0], 1) * 1.01)
    s = prestige(def, s, 'l1', clock).state
    expect(layers(s)[0].count).toBe(2)
    expect((s.modules.metaShop as { ranks: Record<string, number> }).ranks.startA).toBe(1)
    expect(owned(s)).toEqual({ a: 2 })
  })

  it('layer 2 needs 2 runs of layer 1, resets layer-1 progress, keeps layer counts', () => {
    let s = createState(def, clock)
    for (let i = 0; i < 2; i++) {
      s = earn(s, gateAt(L[0], i, i === 0) * 1.01 + 1)
      s = prestige(def, s, 'l1', clock).state
    }
    const m1 = wallet(s).m1
    expect(layers(s)[1].runEarned).toBeGreaterThan(0)
    s = earn(s, gateAt(L[1], 0) * 1.01)
    expect(layerStatus(view(def, s), 'l2').block).toBeNull()
    s = prestige(def, s, 'l2', clock).state
    expect(layers(s)[0]).toMatchObject({ count: 2, sinceReset: 0, runEarned: 0 })
    expect(layers(s)[1]).toMatchObject({ count: 1, sinceReset: 1, runEarned: 0 })
    expect(wallet(s).m2).toBeGreaterThan(0)
    expect(wallet(s).m1).toBe(m1) // m1 has no resetOn → kept
    // right after layer 2, layer 2 is blocked by lowerRuns
    s = earn(s, gateAt(L[1], 1) * 2)
    expect(layerStatus(view(def, s), 'l2').block).toBe('lowerRuns')
  })

  it('layer 3 resets layers 1–2 progress and the m2 currency (resetOn)', () => {
    let s = createState(def, clock)
    for (let i = 0; i < 2; i++) {
      s = earn(s, gateAt(L[0], i, i === 0) * 1.01 + 1)
      s = prestige(def, s, 'l1', clock).state
    }
    s = earn(s, gateAt(L[1], 0) * 1.01)
    s = prestige(def, s, 'l2', clock).state
    expect(wallet(s).m2).toBeGreaterThan(0)
    s = earn(s, gateAt(L[0], 0) * 1.01)
    s = prestige(def, s, 'l1', clock).state
    s = earn(s, gateAt(L[2], 0) * 1.01)
    expect(layerStatus(view(def, s), 'l3').block).toBeNull()
    s = prestige(def, s, 'l3', clock).state
    expect(layers(s).map((l) => l.count)).toEqual([3, 1, 1])
    expect(layers(s).map((l) => l.runEarned)).toEqual([0, 0, 0])
    expect(layers(s).map((l) => l.sinceReset)).toEqual([0, 0, 1])
    expect(wallet(s).m2).toBe(0)
    expect(wallet(s).m3).toBeGreaterThan(0)
    expect(wallet(s).m1).toBeGreaterThan(0)
  })

  it('blocked layers do nothing', () => {
    const s = createState(def, clock)
    expect(dispatch(def, s, { module: 'prestige', type: 'perform', payload: { layer: 'l1' } }, clock).ok).toBe(false)
    expect(prestige(def, s, 'nope', clock).ok).toBe(false)
    expect(layerStatus(view(def, s), 'nope').block).toBe('unknown')
  })

  it('minimum producers online (from a count on)', () => {
    const d = testGame({ prestigeLayers: [{ ...L[0], minimum: { producersOnline: 2, producersFromCount: 1 } }, L[1], L[2]] })
    let s = createState(d, clock)
    s = { ...s, modules: { ...s.modules, prestige: { layers: [{ count: 1, runEarned: 1e9, sinceReset: 1 }, { count: 0, runEarned: 0, sinceReset: 0 }, { count: 0, runEarned: 0, sinceReset: 0 }] }, producers: { owned: { a: 3 } } } }
    expect(layerStatus(view(d, s), 'l1').block).toBe('producers')
  })
})
