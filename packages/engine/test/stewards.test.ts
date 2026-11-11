import { describe, expect, it } from 'vitest'
import { createManualClock, createState, dispatch, standardModules, stewardCost, stewardsModule, stewardTrainMs, tick, type EngineState, type StewardsConfig, type StewardsState } from '../src'
import { T0, testGame } from './fixture'

const DAY = 86_400_000
const worked: { place: string; steps: number }[] = []
const cfg: StewardsConfig = {
  max: 3,
  cost: { currency: 'gem', base: 10, growth: 2 },
  trainMs: { base: DAY, growth: 2 },
  everyMs: 60_000,
  maxSteps: 30,
  perSteward: 0.01,
  canPost: (_w, place) => place !== 'closed',
  work: (_w, place, steps) => {
    worked.push({ place, steps })
    return null
  },
}
function setup(gems: number) {
  const def = testGame({ modules: [...standardModules(), stewardsModule(cfg)] })
  const clock = createManualClock(T0)
  let s = createState(def, clock)
  const wallet = s.modules.wallet as { balances: Record<string, number> }
  s = { ...s, modules: { ...s.modules, wallet: { ...wallet, balances: { ...wallet.balances, gem: gems } } } }
  return { def, clock, s }
}
const st = (s: EngineState) => s.modules.stewards as StewardsState
const gem = (s: EngineState) => (s.modules.wallet as { balances: Record<string, number> }).balances.gem ?? 0

describe('stewards', () => {
  it('training costs, takes its time, and only one runs at once; each one is dearer and slower', () => {
    const x = setup(100)
    let s = dispatch(x.def, x.s, { module: 'stewards', type: 'train' }, x.clock).state
    expect(gem(s)).toBe(90)
    expect(st(s).until).toBe(T0 + DAY)
    // A second training cannot start while one runs
    expect(gem(dispatch(x.def, s, { module: 'stewards', type: 'train' }, x.clock).state)).toBe(90)
    x.clock.advance(DAY - 1000)
    expect(st(tick(x.def, s, 250, x.clock).state).trained).toBe(0)
    x.clock.advance(1000)
    const r = tick(x.def, s, 250, x.clock)
    s = r.state
    expect(st(s)).toMatchObject({ trained: 1, until: 0, posts: [''] })
    expect(r.events.some((e) => e.type === 'steward.trained' && e.n === 1)).toBe(true)
    expect(stewardCost(cfg, st(s))).toBe(20)
    expect(stewardTrainMs(cfg, st(s))).toBe(2 * DAY)
  })

  it('a posted steward works once per interval and makes up for absence up to the cap', () => {
    const x = setup(100)
    let s: EngineState = { ...x.s, modules: { ...x.s.modules, stewards: { trained: 2, until: 0, posts: ['', ''], workedAt: T0 } } }
    // A place takes one steward; a closed place takes none
    worked.length = 0
    s = dispatch(x.def, s, { module: 'stewards', type: 'post', payload: { slot: 0, place: 'moor' } }, x.clock).state
    // A newly posted steward starts at once with one step
    expect(worked).toEqual([{ place: 'moor', steps: 1 }])
    expect(st(dispatch(x.def, s, { module: 'stewards', type: 'post', payload: { slot: 1, place: 'moor' } }, x.clock).state).posts).toEqual(['moor', ''])
    expect(st(dispatch(x.def, s, { module: 'stewards', type: 'post', payload: { slot: 1, place: 'closed' } }, x.clock).state).posts).toEqual(['moor', ''])
    worked.length = 0
    x.clock.advance(30_000)
    s = tick(x.def, s, 250, x.clock).state
    expect(worked).toEqual([])
    x.clock.advance(30_000)
    s = tick(x.def, s, 250, x.clock).state
    expect(worked).toEqual([{ place: 'moor', steps: 1 }])
    // Eight hours away: 480 steps would be due, 30 are made up for
    worked.length = 0
    x.clock.advance(8 * 3_600_000)
    s = tick(x.def, s, 250, x.clock).state
    expect(worked).toEqual([{ place: 'moor', steps: 30 }])
    expect(st(s).workedAt).toBe(x.clock.now())
  })

  it('parse drops double posts and keeps the list as long as the trained count', () => {
    const m = stewardsModule(cfg)
    const clock = createManualClock(T0)
    expect(m.parse({ trained: 2, posts: ['a', 'a', 'b'], until: 5, workedAt: 7 }, { clock } as never, {} as never)).toEqual({ trained: 2, until: 5, posts: ['a', ''], workedAt: 7 })
    expect(m.parse(null, { clock } as never, {} as never)).toEqual({ trained: 0, until: 0, posts: [], workedAt: T0 })
  })

  it('a closed system trains nobody', () => {
    let open = false
    const gated = { ...cfg, open: () => open }
    const def = testGame({ modules: [...standardModules(), stewardsModule(gated)] })
    const x = setup(100)
    expect(st(dispatch(def, x.s, { module: 'stewards', type: 'train' }, x.clock).state).until).toBe(0)
    open = true
    expect(st(dispatch(def, x.s, { module: 'stewards', type: 'train' }, x.clock).state).until).toBe(T0 + DAY)
  })
})
