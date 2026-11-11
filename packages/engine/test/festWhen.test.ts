import { describe, expect, it } from 'vitest'
import { calendarFestsModule, createManualClock, createState, dispatch, festShop, standardModules, tick, view, type EngineState, type FestConfig, type FestsState } from '../src'
import { T0, testGame } from './fixture'

const cfg: FestConfig = {
  fests: [{ id: 'always', from: [1, 1], to: [12, 31], major: false }],
  shop: {
    default: [
      { id: 'plain', cost: 1, max: 1, kind: 'grant', grant: [{ currency: 'gem', amount: 1 }] },
      // Goods of a later stage: only while the player holds at least 5 gems
      { id: 'later', cost: 1, max: 1, kind: 'grant', grant: [{ currency: 'gem', amount: 10 }], when: (w) => w.balance('gem') >= 5 },
    ],
  },
  earn: {},
}
function setup(gems: number) {
  const def = testGame({ modules: [...standardModules(), calendarFestsModule(cfg)] })
  const clock = createManualClock(T0)
  // One tick so the fest of the day is set; tokens set before that would be cleared with the fest change
  let s = tick(def, createState(def, clock), 250, clock).state
  const wallet = s.modules.wallet as { balances: Record<string, number> }
  const fests = s.modules.calendarFests as FestsState
  s = { ...s, modules: { ...s.modules, wallet: { ...wallet, balances: { ...wallet.balances, gem: gems } }, calendarFests: { ...fests, tokens: 10 } } }
  return { def, clock, s }
}
const bought = (s: EngineState) => (s.modules.calendarFests as FestsState).bought

describe('calendar fests: conditional shop items', () => {
  it('an item whose condition does not hold is neither listed nor sold', () => {
    const { def, clock, s } = setup(0)
    expect(festShop(cfg, 'always', view(def, s)).map((i) => i.id)).toEqual(['plain'])
    // Without a world the full list is returned (content tools, label checks)
    expect(festShop(cfg, 'always').map((i) => i.id)).toEqual(['plain', 'later'])
    const r = dispatch(def, s, { module: 'calendarFests', type: 'buy', payload: { id: 'later' } }, clock)
    expect(bought(r.state).later).toBeUndefined()
  })

  it('once the condition holds the item is listed and can be bought', () => {
    const { def, clock, s } = setup(5)
    expect(festShop(cfg, 'always', view(def, s)).map((i) => i.id)).toEqual(['plain', 'later'])
    const r = dispatch(def, s, { module: 'calendarFests', type: 'buy', payload: { id: 'later' } }, clock)
    expect(bought(r.state).later).toBe(1)
  })
})
