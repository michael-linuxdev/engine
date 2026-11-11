import { describe, expect, it } from 'vitest'
import { createManualClock, createState, dispatch, standardModules, tick, visitorsModule, type EngineState, type VisitorConfig, type VisitorsState } from '../src'
import { T0, testGame } from './fixture'

const base: VisitorConfig = { list: [{ id: 'fox', when: () => true }], stayMs: 60_000, gapMs: [180_000, 420_000], firstGift: [{ currency: 'gem', amount: 10 }], againSeconds: 60, bonusPerSpecies: 0.01, unseenWeight: 3 }
const v = (s: EngineState) => s.modules.visitors as VisitorsState

function arrive(cfg: VisitorConfig) {
  const def = testGame({ modules: [...standardModules(), visitorsModule(cfg)] })
  const clock = createManualClock(T0)
  let s = createState(def, clock)
  clock.advance(200_000)
  s = tick(def, s, 250, clock).state
  return { def, clock, s }
}

describe('visitors: waiting guests', () => {
  it('by default a guest leaves after the stay', () => {
    const x = arrive(base)
    expect(v(x.s).current).toBe('fox')
    x.clock.advance(61_000)
    expect(v(tick(x.def, x.s, 250, x.clock).state).current).toBe('')
  })

  it('a waiting guest is still there hours later and can be greeted', () => {
    const x = arrive({ ...base, waits: true })
    expect(v(x.s).current).toBe('fox')
    x.clock.advance(6 * 3_600_000)
    const later = tick(x.def, x.s, 250, x.clock).state
    expect(v(later).current).toBe('fox')
    const r = dispatch(x.def, later, { module: 'visitors', type: 'greet' }, x.clock)
    expect(r.ok).toBe(true)
    expect(v(r.state)).toMatchObject({ current: '', seen: { fox: 1 } })
  })
})
