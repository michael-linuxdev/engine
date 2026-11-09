import { describe, expect, it } from 'vitest'
import {
  choiceEventsModule, collectionsModule, combineModule, createManualClock, createState, decorModule, dispatch, layerCardsModule, prestige, projectsModule,
  seasonAlbumModule, seasonKey, standardModules, tick, view, visitorsModule, type EngineState, type GameDefinition,
} from '../src'
import { T0, testGame } from './fixture'

const ready = (s: EngineState): EngineState => ({ ...s, modules: { ...s.modules, prestige: { layers: [{ count: 0, runEarned: 600, sinceReset: 0 }, { count: 0, runEarned: 0, sinceReset: 0 }, { count: 0, runEarned: 0, sinceReset: 0 }] } } })

function game(): GameDefinition {
  return testGame({
    modules: [
      ...standardModules(),
      collectionsModule({
        entries: [
          { id: 'h1', category: 'herb', rarity: 0, source: 'buy' },
          { id: 'h2', category: 'herb', rarity: 0, source: 'buy' },
          { id: 'x', category: 'brew', rarity: 1, source: 'event' },
        ],
        chance: [1, 0, 0],
        bonus: [0.01, 0.02, 0.03],
        setBonus: 0.05,
        layer: 'l1',
      }),
      combineModule({ recipes: [{ id: 'r', a: 'h1', b: 'h2', result: 'x', durationMs: 3600_000 }], fizzle: [{ currency: 'gem', amount: 5 }], skipCost: { currency: 'gem', amount: 15 } }),
      visitorsModule({ list: [{ id: 'fox', when: () => true }], stayMs: 60_000, gapMs: [180_000, 420_000], firstGift: [{ currency: 'gem', amount: 10 }], againSeconds: 60, bonusPerSpecies: 0.01, unseenWeight: 3 }),
      decorModule({ items: [{ id: 'flag', cost: { currency: 'gem', amount: 5 }, bonus: 0.02 }, { id: 'gift', cost: null, bonus: 0.05 }], slots: 2 }),
      seasonAlbumModule({ goals: [{ id: 'buy3', event: 'producer.bought', amountKey: 'count', target: 3 }], stampReward: [{ currency: 'gem', amount: 3 }], rewardAt: 1, seasonReward: () => ({ type: 'decor.granted', id: 'gift' }) }),
      layerCardsModule({ layer: 'l1', fromRuns: 1, offer: 2, cards: [{ id: 'c1', effects: [{ target: 'income', op: 'mul', value: 2 }] }, { id: 'c2', effects: [{ target: 'income', op: 'mul', value: 3 }] }, { id: 'c3', effects: [] }] }),
      choiceEventsModule({ list: [{ id: 'storm', safe: { cost: { currency: 'gem', amount: 1 }, buff: { target: 'income', mult: 1.1, durationMs: 3600_000 } }, risk: { win: { target: 'income', mult: 1.2, durationMs: 3600_000 }, lose: { target: 'income', mult: 0.75, durationMs: 3600_000 }, chance: 0.5 } }], daily: 1, fromHour: 0 }),
      projectsModule([{ id: 'bridge', stages: [{ cost: [{ currency: 'c', amount: 100 }] }, { cost: [{ currency: 'm1', amount: 1 }], event: { type: 'decor.granted', id: 'gift' } }], bonusPerStage: 0.02 }]),
    ],
  })
}

function start(def: GameDefinition) {
  const clock = createManualClock(T0)
  const s = createState(def, clock)
  return { s: { ...s, core: { ...s.core, primary: 1e6 } }, clock }
}

describe('collections and alchemy', () => {
  it('manual buys find entries, prestige grants a missing one, set bonus', () => {
    const def = game()
    let { s, clock } = start(def)
    s = dispatch(def, s, { module: 'producers', type: 'buy', payload: { id: 'a', count: 1 } }, clock).state
    const found = (s.modules.collections as { found: Record<string, number> }).found
    expect(Object.keys(found)).toHaveLength(1)
    s = prestige(def, ready(s), 'l1', clock).state
    expect(Object.keys((s.modules.collections as { found: Record<string, number> }).found).sort()).toEqual(['h1', 'h2'])
    // two herbs (2 %) + herb set (5 %)
    expect(view(def, s).value('rate:a', 1)).toBeCloseTo(1.07 * 1.005, 9)
  })
  it('brews a recipe in real time (also offline), fizzles on unknown pairs, skip costs', () => {
    const def = game()
    let { s, clock } = start(def)
    s = { ...s, modules: { ...s.modules, collections: { found: { h1: 1, h2: 1 } } } }
    expect(dispatch(def, s, { module: 'combine', type: 'start', payload: { a: 'h1', b: 'h1' } }, clock).ok).toBe(false)
    s = dispatch(def, s, { module: 'combine', type: 'start', payload: { a: 'h2', b: 'h1' } }, clock).state
    clock.advance(3600_000)
    s = tick(def, s, 250, clock).state
    expect((s.modules.collections as { found: Record<string, number> }).found.x).toBe(1)
    expect(dispatch(def, s, { module: 'combine', type: 'skip' }, clock).ok).toBe(false)
  })
})

describe('visitors', () => {
  it('a guest arrives while playing, the first greeting grants a gift', () => {
    const def = game()
    let { s, clock } = start(def)
    clock.advance(200_000)
    s = tick(def, s, 250, clock).state
    expect((s.modules.visitors as { current: string }).current).toBe('fox')
    const r = dispatch(def, s, { module: 'visitors', type: 'greet' }, clock)
    expect((r.state.modules.wallet as { balances: Record<string, number> }).balances.gem).toBe(10)
    expect(view(def, r.state).value('rate:a', 1)).toBeCloseTo(1.01, 9)
  })
})

describe('decor', () => {
  it('buy, place on one slot, exclusive pieces come from events', () => {
    const def = game()
    let { s, clock } = start(def)
    s = { ...s, modules: { ...s.modules, wallet: { balances: { m1: 0, m2: 0, m3: 0, gem: 10 }, earned: {} } } }
    s = dispatch(def, s, { module: 'decor', type: 'buy', payload: { id: 'flag' } }, clock).state
    expect(dispatch(def, s, { module: 'decor', type: 'buy', payload: { id: 'gift' } }, clock).ok).toBe(false)
    s = dispatch(def, s, { module: 'decor', type: 'place', payload: { slot: 0, id: 'flag' } }, clock).state
    s = dispatch(def, s, { module: 'decor', type: 'place', payload: { slot: 1, id: 'flag' } }, clock).state
    expect((s.modules.decor as { placed: string[] }).placed).toEqual(['', 'flag'])
    expect(view(def, s).value('rate:a', 1)).toBeCloseTo(1.02, 9)
  })
})

describe('season album', () => {
  it('season key by local date; goals count events; reward at the threshold', () => {
    expect(seasonKey(createManualClock(Date.UTC(2026, 11, 5)))).toBe('2027-winter')
    expect(seasonKey(createManualClock(Date.UTC(2026, 3, 5)))).toBe('2026-spring')
    const def = game()
    let { s, clock } = start(def)
    s = dispatch(def, s, { module: 'producers', type: 'buy', payload: { id: 'a', count: 3 } }, clock).state
    expect((s.modules.seasonAlbum as { stamped: string[] }).stamped).toEqual(['buy3'])
    expect((s.modules.decor as { owned: string[] }).owned).toEqual(['gift'])
  })
})

describe('layer cards', () => {
  it('offer after a run, pick one, it ends with the next run, never twice in a row', () => {
    const def = game()
    let { s, clock } = start(def)
    s = prestige(def, ready(s), 'l1', clock).state
    const offer = (s.modules.layerCards as { offer: string[] }).offer
    expect(offer).toHaveLength(2)
    s = dispatch(def, s, { module: 'layerCards', type: 'pick', payload: { id: offer[0] } }, clock).state
    s = { ...s, modules: { ...s.modules, prestige: { layers: [{ count: 1, runEarned: 1e9, sinceReset: 1 }, { count: 0, runEarned: 0, sinceReset: 0 }, { count: 0, runEarned: 0, sinceReset: 0 }] } } }
    s = prestige(def, s, 'l1', clock).state
    const c = s.modules.layerCards as { offer: string[]; active: string; last: string }
    expect(c.active).toBe('')
    expect(c.last).toBe(offer[0])
    expect(c.offer).not.toContain(offer[0])
  })
})

describe('choice events and projects', () => {
  it('daily offer, safe option costs and buffs for a while', () => {
    const def = game()
    let { s, clock } = start(def)
    s = { ...s, modules: { ...s.modules, wallet: { balances: { m1: 1, m2: 0, m3: 0, gem: 5 }, earned: {} } } }
    s = tick(def, s, 250, clock).state
    expect((s.modules.choiceEvents as { pending: string }).pending).toBe('storm')
    s = dispatch(def, s, { module: 'choiceEvents', type: 'choose', payload: { option: 'safe' } }, clock).state
    expect(view(def, s).value('income', 1)).toBeCloseTo(1.1, 9)
    clock.advance(3600_001)
    s = tick(def, s, 250, clock).state
    expect(view(def, s).value('income', 1)).toBe(1)
    // projects: stages in order, costs, bonus, events
    s = dispatch(def, s, { module: 'projects', type: 'build', payload: { id: 'bridge' } }, clock).state
    s = dispatch(def, s, { module: 'projects', type: 'build', payload: { id: 'bridge' } }, clock).state
    expect((s.modules.projects as { stage: Record<string, number> }).stage.bridge).toBe(2)
    expect((s.modules.decor as { owned: string[] }).owned).toContain('gift')
    expect(dispatch(def, s, { module: 'projects', type: 'build', payload: { id: 'bridge' } }, clock).ok).toBe(false)
  })
})
