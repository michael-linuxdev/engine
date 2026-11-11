import { describe, expect, it } from 'vitest'
import {
  createManualClock, createState, dailyModule, dispatch, MARKET_ID, marketModule, skipHoursLeft, standardModules, tick, view,
  type EngineState, type GameDefinition, type MarketConfig, type MarketState, type ManualClock,
} from '../src'
import { T0, testGame } from './fixture'

const gem = (amount: number) => ({ currency: 'gem', amount })

const CFG: MarketConfig = {
  currency: 'gem',
  cosmetics: [
    { id: 'base', cost: 0 },
    { id: 'red', cost: 10 },
    { id: 'fest', cost: 5, when: () => false },
  ],
  offers: [
    { id: 'bundle', grant: [gem(50)], cosmetics: ['red'], once: true },
    { id: 'noAds', removeAds: true, once: true },
    { id: 'gems', grant: [gem(10)] },
    { id: 'plus', passPremium: true },
  ],
  ad: { cooldownMs: 60_000, choices: [{ id: 'yield', seconds: 600 }, { id: 'gems', grant: [gem(6)] }] },
  pass: { tiers: [{ xp: 0, free: { grant: [gem(1)] }, premium: { grant: [gem(4)] } }, { xp: 25, free: { seconds: 60 }, premium: { seconds: 300 } }], dailyXp: 25, adXp: 10, maxXp: 100 },
  skips: [{ id: 'h1', hours: 1, cost: 4 }, { id: 'h4', hours: 4, cost: 12 }],
  skipCapHours: 6,
  gift: [gem(3)],
  boost: { cost: 5, mult: 1.15, durationMs: 30 * 60_000 },
  circle: { cost: 6, mult: 1.1, step: 0.05, max: 1.25, durationMs: 60 * 60_000 },
}

function game(): GameDefinition {
  return testGame({
    modules: [...standardModules(), dailyModule({ rewards: [{ seconds: 60 }], minPrimary: 50, comeback: [] }), marketModule(CFG)],
  })
}

function start(): { def: GameDefinition; s: EngineState; clock: ManualClock } {
  const def = game()
  const clock = createManualClock(T0)
  let s = createState(def, clock)
  s = { ...s, core: { ...s.core, primary: 100 } }
  s = dispatch(def, s, { module: 'producers', type: 'buy', payload: { id: 'a', count: 5 } }, clock).state
  return { def, s, clock }
}

const m = (s: EngineState) => s.modules[MARKET_ID] as MarketState
const gems = (s: EngineState) => (s.modules.wallet as { balances: Record<string, number> }).balances.gem ?? 0
const act = (def: GameDefinition, s: EngineState, clock: ManualClock, type: string, payload?: unknown) => dispatch(def, s, { module: MARKET_ID, type, payload }, clock)

describe('market (mocks)', () => {
  it('starts with the free style equipped; styles cost premium and can be equipped', () => {
    let { def, s, clock } = start()
    expect(m(s).owned).toEqual(['base'])
    expect(m(s).equipped).toBe('base')
    // not affordable → nothing changes
    expect(m(act(def, s, clock, 'buyCosmetic', { id: 'red' }).state).owned).toEqual(['base'])
    s = act(def, s, clock, 'buyOffer', { id: 'gems' }).state
    s = act(def, s, clock, 'buyCosmetic', { id: 'red' }).state
    expect(m(s).owned).toContain('red')
    expect(gems(s)).toBe(0)
    s = act(def, s, clock, 'equip', { id: 'red' }).state
    expect(m(s).equipped).toBe('red')
    // fest style is locked outside its fest
    s = act(def, s, clock, 'buyOffer', { id: 'gems' }).state
    expect(m(act(def, s, clock, 'buyCosmetic', { id: 'fest' }).state).owned).not.toContain('fest')
  })

  it('once-offers can be bought only once; ad removal blocks ads', () => {
    let { def, s, clock } = start()
    s = act(def, s, clock, 'buyOffer', { id: 'bundle' }).state
    expect(gems(s)).toBe(50)
    expect(m(s).owned).toContain('red')
    s = act(def, s, clock, 'buyOffer', { id: 'bundle' }).state
    expect(gems(s)).toBe(50)
    s = act(def, s, clock, 'buyOffer', { id: 'noAds' }).state
    expect(m(s).adsRemoved).toBe(true)
    // Without ads the bonus stays (the UI hands it out without a video), the cooldown still holds
    const r = act(def, s, clock, 'watchAd', { choice: 'gems' })
    expect(gems(r.state)).toBe(56)
    expect(gems(act(def, r.state, clock, 'watchAd', { choice: 'gems' }).state)).toBe(56)
  })

  it('the bonus video pays the chosen reward and then waits for its cooldown', () => {
    let { def, s, clock } = start()
    s = act(def, s, clock, 'watchAd', { choice: 'gems' }).state
    expect(gems(s)).toBe(6)
    expect(m(s).passXp).toBe(10)
    s = act(def, s, clock, 'watchAd', { choice: 'gems' }).state
    expect(gems(s)).toBe(6)
    clock.advance(60_000)
    const before = s.core.primary
    s = act(def, s, clock, 'watchAd', { choice: 'yield' }).state
    expect(s.core.primary).toBeGreaterThan(before)
    expect(m(s).ads).toBe(2)
  })

  it('time skips grant hours of income and stop at the daily cap', () => {
    let { def, s, clock } = start()
    s = act(def, s, clock, 'buyOffer', { id: 'gems' }).state
    s = act(def, s, clock, 'buyOffer', { id: 'gems' }).state
    s = act(def, s, clock, 'buyOffer', { id: 'gems' }).state
    const rate = view(def, s).rate()
    const before = s.core.primary
    s = act(def, s, clock, 'skip', { id: 'h4' }).state
    expect(s.core.primary - before).toBeCloseTo(rate * 4 * 3600, 0)
    s = act(def, s, clock, 'skip', { id: 'h4' }).state // only 2 h left
    expect(m(s).skipHours).toBe(6)
    expect(skipHoursLeft(m(s), CFG, clock)).toBe(0)
    const g = gems(s)
    s = act(def, s, clock, 'skip', { id: 'h1' }).state
    expect(gems(s)).toBe(g)
    clock.advance(86_400_000)
    expect(skipHoursLeft(m(s), CFG, clock)).toBe(6)
  })

  it('weekly pass: XP from the daily round, free and premium tracks, weekly reset', () => {
    let { def, s, clock } = start()
    s = dispatch(def, s, { module: 'daily', type: 'claim' }, clock).state
    expect(m(s).passXp).toBe(25)
    s = act(def, s, clock, 'passClaim', { tier: 1, premium: false }).state
    expect(m(s).passFree).toBe(2)
    const g = gems(s)
    s = act(def, s, clock, 'passClaim', { tier: 0, premium: true }).state // no premium yet
    expect(gems(s)).toBe(g)
    s = act(def, s, clock, 'buyOffer', { id: 'plus' }).state
    s = act(def, s, clock, 'passClaim', { tier: 0, premium: true }).state
    expect(gems(s)).toBe(g + 4)
    clock.advance(7 * 86_400_000)
    s = tick(def, s, 250, clock).state
    expect(m(s).passXp).toBe(0)
    expect(m(s).passPremium).toBe(false)
  })

  it('boost and circle multiply income while active; the circle stacks up to its maximum', () => {
    let { def, s, clock } = start()
    for (let i = 0; i < 4; i++) s = act(def, s, clock, 'buyOffer', { id: 'gems' }).state
    const base = view(def, s).rate()
    s = act(def, s, clock, 'boost').state
    expect(view(def, s).rate()).toBeCloseTo(base * 1.15)
    s = act(def, s, clock, 'circle').state
    s = act(def, s, clock, 'circle').state
    s = act(def, s, clock, 'circle').state
    s = act(def, s, clock, 'circle').state
    expect(m(s).circleMult).toBe(1.25)
    expect(view(def, s).rate()).toBeCloseTo(base * 1.15 * 1.25)
    clock.advance(5 * 3600_000)
    s = tick(def, s, 250, clock).state
    expect(view(def, s).rate()).toBeCloseTo(base)
    expect(m(s).circleMult).toBe(1)
  })

  it('the daily gift comes once per day', () => {
    let { def, s, clock } = start()
    s = act(def, s, clock, 'claimGift').state
    s = act(def, s, clock, 'claimGift').state
    expect(gems(s)).toBe(3)
    clock.advance(86_400_000)
    s = act(def, s, clock, 'claimGift').state
    expect(gems(s)).toBe(6)
  })
})
