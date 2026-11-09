import { describe, expect, it } from 'vitest'
import { applyOffline, createManualClock, createState, dispatch, layerStatus, prestige, tick, view, type EngineState } from '../src'
import { T0, testGame } from './fixture'

describe('rest period and comeback gift', () => {
  it('a layer with restMs is blocked until the rest is over (game clock)', () => {
    const base = testGame()
    const def = testGame({ prestigeLayers: [{ ...base.prestigeLayers[0], minimum: { restMs: 3 * 86_400_000 } }, base.prestigeLayers[1], base.prestigeLayers[2]] })
    const clock = createManualClock(T0)
    let s: EngineState = createState(def, clock)
    const ready = (x: EngineState): EngineState => ({ ...x, modules: { ...x.modules, prestige: { layers: (x.modules.prestige as { layers: object[] }).layers.map((l, i) => (i === 0 ? { ...l, runEarned: 1e12 } : l)) } } })
    s = prestige(def, ready(s), 'l1', clock).state
    s = tick(def, ready(s), 250, clock).state
    expect(layerStatus(view(def, s), 'l1').block).toBe('rest')
    expect(layerStatus(view(def, s), 'l1').restLeft).toBe(3 * 86_400_000)
    clock.advance(3 * 86_400_000)
    s = tick(def, s, 250, clock).state
    expect(layerStatus(view(def, s), 'l1').block).toBeNull()
  })
  it('claiming after a long absence adds the comeback gift once', () => {
    const def = testGame()
    def.balance.offline = { ...def.balance.offline, comebackMs: 48 * 3600_000, comebackGrant: [{ currency: 'gem', amount: 20 }] }
    const clock = createManualClock(T0)
    let s = createState(def, clock)
    s = { ...s, core: { ...s.core, primary: 100 } }
    s = dispatch(def, s, { module: 'producers', type: 'buy', payload: { id: 'a', count: 5 } }, clock).state
    clock.advance(50 * 3600_000)
    s = applyOffline(def, s, clock).state
    const r = dispatch(def, s, { module: 'offline', type: 'claim' }, clock)
    expect(r.events.some((e) => e.type === 'offline.comeback')).toBe(true)
    expect((r.state.modules.wallet as { balances: Record<string, number> }).balances.gem).toBe(20 + 7) // gift + rank-2 reward (XP from the claim)
  })
})
