import { describe, expect, it } from 'vitest'
import {
  advance, applyOffline, createManualClock, createState, dispatch, offlineGain, serializeState, tick, view, type EngineState, type GameDefinition,
} from '../src'
import { T0, testGame } from './fixture'

function play(def: GameDefinition, seed: number): string {
  const clock = createManualClock(T0)
  let s: EngineState = createState(def, clock, seed)
  s = { ...s, core: { ...s.core, primary: 50 } }
  let acc = 0
  for (let i = 0; i < 400; i++) {
    clock.advance(1000)
    const r = advance(def, s, 1000, acc, clock)
    s = r.state
    acc = r.acc
    for (const id of ['a', 'b']) s = dispatch(def, s, { module: 'producers', type: 'buy', payload: { id, count: 1 } }, clock).state
  }
  return serializeState(def, s, clock.now())
}

describe('determinism', () => {
  it('same seed, actions and clock → identical save', () => {
    const def = testGame()
    expect(play(def, 9)).toBe(play(def, 9))
  })
  it('the RNG state is part of the save and moves with rolls', () => {
    const def = testGame()
    const a = JSON.parse(play(def, 9))
    const b = JSON.parse(play(def, 10))
    expect(a.core.rng).not.toBe(b.core.rng)
  })
})

describe('fixed-step ticker', () => {
  const def = testGame()
  it('accumulates partial steps', () => {
    const clock = createManualClock(T0)
    const s = createState(def, clock)
    const r1 = advance(def, s, 100, 0, clock)
    expect(r1.steps).toBe(0)
    expect(r1.acc).toBe(100)
    const r2 = advance(def, r1.state, 450, r1.acc, clock)
    expect(r2.steps).toBe(2)
    expect(r2.acc).toBe(50)
  })
  it('long gaps go through offline, not ticks', () => {
    const clock = createManualClock(T0)
    const s = createState(def, clock)
    clock.advance(10 * 60_000)
    const r = advance(def, s, 10 * 60_000, 0, clock)
    expect(r.offline).toBe(true)
    expect(r.steps).toBe(0)
  })
  it('negative dt does nothing', () => {
    const clock = createManualClock(T0)
    const s = createState(def, clock)
    expect(tick(def, s, -500, clock).state.core.primary).toBe(0)
  })
})

describe('offline', () => {
  it('a short absence is credited at once when the game says so; a longer one still makes a basket', () => {
    const def = testGame()
    const quick: GameDefinition = { ...def, balance: { ...def.balance, offline: { ...def.balance.offline, directBelowMs: 5 * 60_000 } } }
    const clock = createManualClock(T0)
    let s = createState(quick, clock)
    s = dispatch(quick, { ...s, core: { ...s.core, primary: 1e6 } }, { module: 'producers', type: 'buy', payload: { id: quick.producers[0].id, count: 1 } }, clock).state
    const rate = view(quick, s).rate()
    expect(rate).toBeGreaterThan(0)
    const before = s.core.primary
    clock.advance(2 * 60_000)
    const short = applyOffline(quick, s, clock)
    expect((short.state.modules.offline as { pending: unknown }).pending).toBeNull()
    expect(short.state.core.primary).toBeCloseTo(before + rate * 120, 6)
    expect(short.events.some((e) => e.type === 'offline.direct')).toBe(true)
    clock.advance(10 * 60_000)
    const long = applyOffline(quick, short.state, clock)
    expect((long.state.modules.offline as { pending: { gained: number } | null }).pending?.gained).toBeCloseTo(rate * 600, 6)
    expect(long.state.core.primary).toBe(short.state.core.primary)
    // While a basket waits, a further short absence goes into it
    clock.advance(60_000)
    const again = applyOffline(quick, long.state, clock)
    expect((again.state.modules.offline as { pending: { gained: number } | null }).pending?.gained).toBeCloseTo(rate * 660, 6)
  })
  it('closed form: soft full, decay to hard, nothing beyond', () => {
    expect(offlineGain(1, 3600, 8, 24, 0.5)).toBe(3600)
    expect(offlineGain(1, 10 * 3600, 8, 24, 0.5)).toBe(8 * 3600 + 0.5 * 2 * 3600)
    expect(offlineGain(1, 100 * 3600, 8, 24, 0.5)).toBe(offlineGain(1, 24 * 3600, 8, 24, 0.5))
    expect(offlineGain(0, 100, 8, 24, 0.5)).toBe(0)
    expect(offlineGain(5, -100, 8, 24, 0.5)).toBe(0)
  })
  it('basket is data, claim grants it; a clock going backwards gives nothing', () => {
    const def = testGame()
    const clock = createManualClock(T0)
    let s = createState(def, clock)
    s = { ...s, core: { ...s.core, primary: 1000 } }
    s = dispatch(def, s, { module: 'producers', type: 'buy', payload: { id: 'a', count: 10 } }, clock).state
    const rate = view(def, s).rate()
    clock.advance(2 * 3_600_000)
    const r = applyOffline(def, s, clock)
    const pending = (r.state.modules.offline as { pending: { gained: number } | null }).pending
    expect(pending?.gained).toBeCloseTo(rate * 7200, 3)
    const before = r.state.core.primary
    const claimed = dispatch(def, r.state, { module: 'offline', type: 'claim' }, clock)
    expect(claimed.state.core.primary - before).toBeCloseTo(rate * 7200, 3)
    clock.set(T0 - 3_600_000)
    const back = applyOffline(def, claimed.state, clock)
    expect(back.elapsedMs).toBe(0)
    expect(back.state.core.lastSeen).toBe(T0 - 3_600_000)
  })
})
