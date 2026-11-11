import { describe, expect, it } from 'vitest'
import { createManualClock, createState, dailyModule, dispatch, standardModules, tick, weeklyDone, weeklyPlanModule, type EngineState, type WeeklyPlanConfig, type WeeklyPlanState } from '../src'
import { testGame } from './fixture'

const DAY = 86_400_000
// 2027-01-11 is a Monday; 12:00 UTC
const MONDAY = Date.UTC(2027, 0, 11, 12)
const cfg: WeeklyPlanConfig = { goals: [{ id: 'rounds', event: 'daily.claimed', target: 2 }], reward: [{ currency: 'gem', amount: 10 }] }

function setup() {
  const def = testGame({ modules: [...standardModules(), dailyModule({ rewards: [{ seconds: 60 }], minPrimary: 50, comeback: [] }), weeklyPlanModule(cfg)] })
  const clock = createManualClock(MONDAY)
  return { def, clock, s: createState(def, clock) }
}
const plan = (s: EngineState) => s.modules.weeklyPlan as WeeklyPlanState
const gem = (s: EngineState) => (s.modules.wallet as { balances: Record<string, number> }).balances.gem ?? 0

describe('weekly plan', () => {
  it('counts its events within the week and pays the bonus once all goals are met', () => {
    let { def, clock, s } = setup()
    s = dispatch(def, s, { module: 'daily', type: 'claim' }, clock).state
    expect(plan(s).progress.rounds).toBe(1)
    expect(weeklyDone(plan(s), cfg)).toBe(false)
    // Claiming early does nothing
    expect(gem(dispatch(def, s, { module: 'weeklyPlan', type: 'claim' }, clock).state)).toBe(gem(s))
    clock.advance(DAY)
    s = dispatch(def, s, { module: 'daily', type: 'claim' }, clock).state
    expect(weeklyDone(plan(s), cfg)).toBe(true)
    const before = gem(s)
    s = dispatch(def, s, { module: 'weeklyPlan', type: 'claim' }, clock).state
    expect(gem(s)).toBe(before + 10)
    // Only once per week
    expect(gem(dispatch(def, s, { module: 'weeklyPlan', type: 'claim' }, clock).state)).toBe(before + 10)
  })

  it('a new week starts empty', () => {
    let { def, clock, s } = setup()
    s = dispatch(def, s, { module: 'daily', type: 'claim' }, clock).state
    clock.advance(7 * DAY)
    s = tick(def, s, 250, clock).state
    expect(plan(s).week).toBe('2027-W03')
    expect(plan(s).progress.rounds ?? 0).toBe(0)
    expect(plan(s).claimed).toBe(false)
  })
})
