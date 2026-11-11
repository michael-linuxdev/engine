import { describe, expect, it } from 'vitest'
import { createManualClock, createState, dispatch, monumentGivers, monumentModule, monumentStatus, standardModules, view, type EngineModule, type EngineState, type MonumentConfig, type MonumentState } from '../src'
import { act } from '../src/result'
import { T0, testGame } from './fixture'

const DAY = 86_400_000
let poor: string[] = []
// A stand-in for the module that takes the payment and confirms it
const payer: EngineModule<{ paid: string[] }> = {
  id: 'payer',
  version: 1,
  init: () => ({ paid: [] }),
  parse: () => ({ paid: [] }),
  resetOn: 'keep',
  actions: {
    pay: (s, p) => {
      const place = (p as { place: string }).place
      return act({ paid: [...s.paid, place] }, { events: [{ type: 'place.paid', place }] })
    },
  },
}
const cfg: MonumentConfig = {
  stages: 2,
  need: (stage) => 2 + stage,
  setMs: 3 * DAY,
  perStage: 0.05,
  pay: (_w, place) => (poor.includes(place) ? null : { module: 'payer', type: 'pay', payload: { place } }),
  paid: { type: 'place.paid', place: (e) => (typeof e.place === 'string' ? e.place : null) },
}
function setup() {
  const def = testGame({ modules: [...standardModules(), payer, monumentModule(cfg)] })
  const clock = createManualClock(T0)
  return { def, clock, s: createState(def, clock) }
}
const mo = (s: EngineState) => s.modules.monument as MonumentState
const give = (x: ReturnType<typeof setup>, s: EngineState, places: string[]) => dispatch(x.def, s, { module: 'monument', type: 'give', payload: { places } }, x.clock)

describe('monument', () => {
  it('a stage needs enough different places; then the work sets before the next stage', () => {
    poor = []
    const x = setup()
    let r = give(x, x.s, ['a'])
    expect(mo(r.state)).toMatchObject({ stage: 0, given: ['a'] })
    // The same place does not count twice
    expect(mo(give(x, r.state, ['a']).state).given).toEqual(['a'])
    r = give(x, r.state, ['b'])
    expect(mo(r.state)).toMatchObject({ stage: 1, given: [], readyAt: T0 + 3 * DAY })
    expect(r.events.some((e) => e.type === 'monument.stage' && e.stage === 1)).toBe(true)
    // While it sets, nobody is asked and nobody pays
    const waiting = give(x, r.state, ['a', 'b', 'c'])
    expect((waiting.state.modules.payer as { paid: string[] }).paid).toEqual(['a', 'b'])
    expect(monumentStatus(cfg, mo(r.state), x.clock.now()).waitMs).toBe(3 * DAY)
    x.clock.advance(3 * DAY)
    const last = give(x, r.state, ['a', 'b', 'c', 'd'])
    // Stage 2 needs three: the fourth is not asked
    expect((last.state.modules.payer as { paid: string[] }).paid).toEqual(['a', 'b', 'a', 'b', 'c'])
    expect(mo(last.state)).toMatchObject({ stage: 2, given: [], readyAt: 0 })
    expect(monumentStatus(cfg, mo(last.state), x.clock.now()).done).toBe(true)
  })

  it('a place that cannot pay is not asked and does not count', () => {
    poor = ['b']
    const x = setup()
    expect(monumentGivers(cfg, mo(x.s), view(x.def, x.s), ['a', 'b', 'c'], x.clock.now())).toEqual(['a', 'c'])
    const r = give(x, x.s, ['b'])
    expect(mo(r.state).given).toEqual([])
  })

  it('every finished stage adds income', () => {
    const m = monumentModule(cfg)
    expect(m.effects?.({ stage: 0, given: [], readyAt: 0 }, {} as never)).toEqual([])
    expect(m.effects?.({ stage: 2, given: [], readyAt: 0 }, {} as never)).toEqual([{ id: 'monument', target: 'income', op: 'mul', value: 1.1, labelKey: 'effect.monument' }])
  })

  it('a closed system asks nobody', () => {
    poor = []
    const x = setup()
    expect(monumentGivers({ ...cfg, open: () => false }, mo(x.s), view(x.def, x.s), ['a', 'b'], x.clock.now())).toEqual([])
    expect(monumentGivers({ ...cfg, open: () => true }, mo(x.s), view(x.def, x.s), ['a', 'b'], x.clock.now())).toEqual(['a', 'b'])
  })
})
