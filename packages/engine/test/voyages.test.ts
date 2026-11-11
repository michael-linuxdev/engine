import { describe, expect, it } from 'vitest'
import { createManualClock, createState, dispatch, standardModules, voyageBack, voyagesModule, type EngineState, type VoyagesConfig, type VoyagesState } from '../src'
import { T0, testGame } from './fixture'

const HOUR = 3_600_000
const cfg: VoyagesConfig = {
  list: [
    { id: 'near', durationMs: 2 * HOUR, fromDone: 0, grant: [{ currency: 'gem', amount: 5 }] },
    { id: 'far', durationMs: 8 * HOUR, fromDone: 1, grant: [{ currency: 'gem', amount: 20 }], event: { type: 'note', id: 'x' } },
  ],
}
function setup() {
  const def = testGame({ modules: [...standardModules(), voyagesModule(cfg)] })
  const clock = createManualClock(T0)
  return { def, clock, s: createState(def, clock) }
}
const v = (s: EngineState) => s.modules.voyages as VoyagesState
const gem = (s: EngineState) => (s.modules.wallet as { balances: Record<string, number> }).balances.gem ?? 0

describe('voyages', () => {
  it('one at a time; returns after its time and pays on collect', () => {
    let { def, clock, s } = setup()
    s = dispatch(def, s, { module: 'voyages', type: 'send', payload: { id: 'near' } }, clock).state
    expect(v(s).active).toBe('near')
    // A second one cannot start, and nothing can be collected early
    expect(v(dispatch(def, s, { module: 'voyages', type: 'send', payload: { id: 'near' } }, clock).state).until).toBe(v(s).until)
    expect(gem(dispatch(def, s, { module: 'voyages', type: 'collect' }, clock).state)).toBe(gem(s))
    clock.advance(2 * HOUR)
    expect(voyageBack(v(s), clock.now())).toBe(true)
    const before = gem(s)
    s = dispatch(def, s, { module: 'voyages', type: 'collect' }, clock).state
    expect(gem(s)).toBe(before + 5)
    expect(v(s)).toMatchObject({ active: '', done: 1, times: { near: 1 } })
  })

  it('later voyages open with completed ones and can carry an event', () => {
    let { def, clock, s } = setup()
    expect(v(dispatch(def, s, { module: 'voyages', type: 'send', payload: { id: 'far' } }, clock).state).active).toBe('')
    s = dispatch(def, s, { module: 'voyages', type: 'send', payload: { id: 'near' } }, clock).state
    clock.advance(2 * HOUR)
    s = dispatch(def, s, { module: 'voyages', type: 'collect' }, clock).state
    s = dispatch(def, s, { module: 'voyages', type: 'send', payload: { id: 'far' } }, clock).state
    expect(v(s).active).toBe('far')
    clock.advance(8 * HOUR)
    const r = dispatch(def, s, { module: 'voyages', type: 'collect' }, clock)
    expect(r.events.some((e) => e.type === 'note')).toBe(true)
    expect(v(r.state).done).toBe(2)
  })
})
