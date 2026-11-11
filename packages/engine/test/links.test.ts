import { describe, expect, it } from 'vitest'
import { createManualClock, createState, dispatch, linkCost, linksModule, linksMult, longestChain, standardModules, type EngineState, type LinksConfig, type LinksState } from '../src'
import { T0, testGame } from './fixture'

const rating: Record<string, number> = {}
const cfg: LinksConfig = {
  list: [
    { id: 'ab', a: 'a', b: 'b' },
    { id: 'bc', a: 'b', b: 'c' },
    { id: 'cd', a: 'c', b: 'd' },
  ],
  needs: [1, 2],
  cost: { currency: 'gem', base: 10, growth: 2 },
  perLevel: 0.02,
  perChain: 0.01,
  rating: (_w, place) => rating[place] ?? 0,
}
function setup(gems: number) {
  const def = testGame({ modules: [...standardModules(), linksModule(cfg)] })
  const clock = createManualClock(T0)
  let s = createState(def, clock)
  s = { ...s, modules: { ...s.modules, wallet: { ...(s.modules.wallet as object), balances: { ...(s.modules.wallet as { balances: Record<string, number> }).balances, gem: gems } } } }
  return { def, clock, s }
}
const l = (s: EngineState) => s.modules.links as LinksState
const gem = (s: EngineState) => (s.modules.wallet as { balances: Record<string, number> }).balances.gem ?? 0
const light = (x: ReturnType<typeof setup>, s: EngineState, id: string) => dispatch(x.def, s, { module: 'links', type: 'light', payload: { id } }, x.clock)

describe('links', () => {
  it('a level needs the rating in both places and the price; the price grows with every level', () => {
    const x = setup(100)
    Object.assign(rating, { a: 1, b: 0, c: 0, d: 0 })
    expect(l(light(x, x.s, 'ab').state).levels.ab).toBeUndefined()
    rating.b = 1
    const r = light(x, x.s, 'ab')
    expect(l(r.state).levels.ab).toBe(1)
    expect(gem(r.state)).toBe(90)
    expect(r.events.some((e) => e.type === 'link.lit' && e.level === 1)).toBe(true)
    expect(linkCost(cfg, l(r.state))).toBe(20)
    // Level 2 needs rating 2 on both sides
    expect(l(light(x, r.state, 'ab').state).levels.ab).toBe(1)
    rating.a = 2
    rating.b = 2
    const r2 = light(x, r.state, 'ab')
    expect(l(r2.state).levels.ab).toBe(2)
    expect(gem(r2.state)).toBe(70)
    // No level beyond the highest
    expect(l(light(x, r2.state, 'ab').state).levels.ab).toBe(2)
  })

  it('not enough currency: nothing happens', () => {
    const x = setup(5)
    Object.assign(rating, { a: 3, b: 3 })
    const r = light(x, x.s, 'ab')
    expect(l(r.state).levels.ab).toBeUndefined()
    expect(gem(r.state)).toBe(5)
  })

  it('the longest unbroken run counts extra, so closing a gap pays', () => {
    const gap: LinksState = { levels: { ab: 1, cd: 1 } }
    expect(longestChain(cfg, gap)).toBe(1)
    expect(linksMult(cfg, gap)).toBeCloseTo(1 + 0.04 + 0.01)
    const closed: LinksState = { levels: { ab: 1, bc: 1, cd: 1 } }
    expect(longestChain(cfg, closed)).toBe(3)
    expect(linksMult(cfg, closed)).toBeCloseTo(1 + 0.06 + 0.03)
  })

  it('parse keeps known links within bounds and drops the rest', () => {
    const m = linksModule(cfg)
    expect(m.parse({ levels: { ab: 9, zz: 1, bc: -2 } }, {} as never, {} as never)).toEqual({ levels: { ab: 2 } })
    expect(m.parse(null, {} as never, {} as never)).toEqual({ levels: {} })
  })
})
