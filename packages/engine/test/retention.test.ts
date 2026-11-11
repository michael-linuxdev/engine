import { describe, expect, it } from 'vitest'
import {
  achievementsModule, calendarFestsModule, challengesModule, createManualClock, createState, dailyModule, dayNumber, dispatch, featureUnlocksModule, festAt, festKey, nextFest,
  flashModule, inWeekend, localDayKey, ownedOf, prestige, questsModule, standardModules, tick, view, weekendModule, weekKey, wheelModule,
  type EngineState, type GameDefinition, type ManualClock,
} from '../src'
import { T0, testGame } from './fixture'

const DAY = 86_400_000
// 2027-01-15 is a Friday; 12:00 UTC
const FRI_NOON = Date.UTC(2027, 0, 15, 12)

function game(): GameDefinition {
  return testGame({
    modules: [
      ...standardModules(),
      dailyModule({ rewards: [{ seconds: 60 }, { seconds: 60, grant: [{ currency: 'gem', amount: 3 }] }, { seconds: 120 }], minPrimary: 50, comeback: [{ minGap: 2, seconds: 60 }, { minGap: 5, seconds: 300 }] }),
      questsModule({ perDay: 2, templates: [{ id: 'buy10', kind: 'buy', target: 10, reward: [{ currency: 'gem', amount: 1 }] }, { id: 'earn', kind: 'earn', target: 60, reward: [], rewardSeconds: 30 }, { id: 'burst', kind: 'burst', target: 1, reward: [{ currency: 'gem', amount: 2 }] }] }),
      achievementsModule([{ id: 'ten', metric: (w) => ownedOf(w, 'a'), at: 10, reward: [{ currency: 'gem', amount: 5 }], bonus: 0.01 }]),
      challengesModule({ layer: 'l1', list: [{ id: 'noB', restriction: { kind: 'banProducer', id: 'b' }, fromRuns: 0, bonus: 0.03 }, { id: 'noBurst', restriction: { kind: 'noBurst' }, fromRuns: 1, bonus: 0.03 }] }),
      weekendModule({ from: { weekday: 5, hour: 18 }, to: { weekday: 1, hour: 0 }, mult: 1.25, goalSeconds: 60, reward: [{ currency: 'gem', amount: 15 }] }),
      flashModule({ durationMs: 18 * 60_000, cooldownMs: 150 * 60_000, chance: 0.55, checkMs: 10 * 60_000, mult: 1.15, goalSeconds: 360, graceMs: 10 * 60_000, reward: [{ currency: 'gem', amount: 12 }] }),
      calendarFestsModule({ fests: [{ id: 'winter', from: [12, 20], to: [1, 20], major: true }, { id: 'spring', from: [3, 1], to: [3, 31], major: false }], shop: { default: [{ id: 'boost', cost: 5, max: 2, kind: 'boost', mult: 2, durationMs: 30 * 60_000 }, { id: 'gems', cost: 3, max: 1, kind: 'grant', grant: [{ currency: 'gem', amount: 10 }] }] }, earn: { 'burst.used': 3, 'daily.claimed': 5 } }),
      wheelModule({ layer: 'l1', segments: [{ id: 'x2', weight: 1, kind: 'buff', target: 'income', mult: 2 }] }),
      featureUnlocksModule([{ id: 'quests', when: (w) => ownedOf(w, 'a') >= 5 }]),
    ],
  })
}

function start(def: GameDefinition, at = T0): { s: EngineState; clock: ManualClock } {
  const clock = createManualClock(at)
  const s = createState(def, clock)
  return { s: { ...s, core: { ...s.core, primary: 1e6 } }, clock }
}
const gem = (s: EngineState) => (s.modules.wallet as { balances: Record<string, number> }).balances.gem

describe('calendar helpers', () => {
  it('day numbers, ISO weeks, local offset', () => {
    expect(dayNumber('1970-01-02')).toBe(1)
    expect(weekKey('2026-11-09')).toBe('2026-W46')
    expect(weekKey('2027-01-01')).toBe('2026-W53')
    expect(localDayKey(createManualClock(Date.UTC(2026, 10, 9, 23, 30), 60))).toBe('2026-11-10')
  })
})

describe('daily round', () => {
  it('one claim per day, streak grows, a gap freezes instead of resetting, comeback bonus', () => {
    const def = game()
    let { s, clock } = start(def)
    s = dispatch(def, s, { module: 'producers', type: 'buy', payload: { id: 'a', count: 1 } }, clock).state
    const r1 = dispatch(def, s, { module: 'daily', type: 'claim' }, clock)
    expect(r1.ok).toBe(true)
    expect(dispatch(def, r1.state, { module: 'daily', type: 'claim' }, clock).ok).toBe(false)
    clock.advance(DAY)
    s = dispatch(def, r1.state, { module: 'daily', type: 'claim' }, clock).state
    expect((s.modules.daily as { streak: number }).streak).toBe(2)
    expect(gem(s)).toBe(3)
    clock.advance(6 * DAY)
    const r3 = dispatch(def, s, { module: 'daily', type: 'claim' }, clock)
    expect((r3.state.modules.daily as { streak: number }).streak).toBe(3)
    expect(r3.events.find((e) => e.type === 'daily.claimed')?.comeback).toBe(5)
  })
})

describe('errands', () => {
  it('same errands for the same day, progress from events, claim once', () => {
    const def = game()
    let { s, clock } = start(def)
    s = tick(def, s, 250, clock).state
    const q = s.modules.quests as { day: string; active: { id: string }[] }
    expect(q.active).toHaveLength(2)
    const again = tick(def, start(def).s, 250, clock).state.modules.quests as { active: { id: string }[] }
    expect(again.active.map((x) => x.id)).toEqual(q.active.map((x) => x.id))
    s = dispatch(def, s, { module: 'producers', type: 'buy', payload: { id: 'a', count: 10 } }, clock).state
    s = dispatch(def, s, { module: 'burst', type: 'use' }, clock).state
    const done = (s.modules.quests as { active: { id: string; progress: number; goal: number }[] }).active.filter((x) => x.id !== 'earn')
    for (const d of done) expect(d.progress).toBe(d.goal)
    const id = done[0].id
    const r = dispatch(def, s, { module: 'quests', type: 'claim', payload: { id } }, clock)
    expect(r.ok).toBe(true)
    expect(dispatch(def, r.state, { module: 'quests', type: 'claim', payload: { id } }, clock).ok).toBe(false)
  })
})

describe('deeds and features', () => {
  it('grant once with a permanent bonus; features stay unlocked', () => {
    const def = game()
    let { s, clock } = start(def)
    s = dispatch(def, s, { module: 'producers', type: 'buy', payload: { id: 'a', count: 10 } }, clock).state
    expect((s.modules.achievements as { done: string[] }).done).toEqual(['ten'])
    expect(gem(s)).toBe(5 + 7) // deed + rank-2 reward of the test game
    expect(view(def, s).value('rate:a', 1)).toBeGreaterThan(1.01 * 1.005 - 1e-9)
    expect((s.modules.featureUnlocks as { unlocked: string[] }).unlocked).toEqual(['quests'])
  })
})

describe('trials', () => {
  it('restriction blocks actions, prestige completes it, bonus stays', () => {
    const def = game()
    let { s, clock } = start(def)
    s = dispatch(def, s, { module: 'challenges', type: 'start', payload: { id: 'noB' } }, clock).state
    s = dispatch(def, s, { module: 'producers', type: 'buy', payload: { id: 'a', count: 5 } }, clock).state
    expect(dispatch(def, s, { module: 'producers', type: 'buy', payload: { id: 'b', count: 1 } }, clock).ok).toBe(false)
    expect(dispatch(def, s, { module: 'challenges', type: 'start', payload: { id: 'noBurst' } }, clock).ok).toBe(false)
    s = { ...s, modules: { ...s.modules, prestige: { layers: [{ count: 0, runEarned: 600, sinceReset: 0 }, { count: 0, runEarned: 0, sinceReset: 0 }, { count: 0, runEarned: 0, sinceReset: 0 }] } } }
    s = prestige(def, s, 'l1', clock).state
    expect(s.modules.challenges).toEqual({ active: null, done: ['noB'] })
    // starting is refused if the run already breaks it
    expect(dispatch(def, { ...s, modules: { ...s.modules, producers: { owned: { b: 1 } } } }, { module: 'challenges', type: 'start', payload: { id: 'noB' } }, clock).ok).toBe(false)
  })
})

describe('timed events', () => {
  it('weekend window by local time, boost, goal and reward', () => {
    const def = game()
    const cfg = { from: { weekday: 5, hour: 18 }, to: { weekday: 1, hour: 0 } }
    expect(inWeekend({ ...cfg, mult: 1, goalSeconds: 1, reward: [] }, createManualClock(FRI_NOON))).toBe(false)
    expect(inWeekend({ ...cfg, mult: 1, goalSeconds: 1, reward: [] }, createManualClock(FRI_NOON + 7 * 3600_000))).toBe(true)
    expect(inWeekend({ ...cfg, mult: 1, goalSeconds: 1, reward: [] }, createManualClock(FRI_NOON + 60 * 3600_000))).toBe(false)
    let { s, clock } = start(def, FRI_NOON + 7 * 3600_000)
    s = dispatch(def, s, { module: 'producers', type: 'buy', payload: { id: 'a', count: 10 } }, clock).state
    s = tick(def, s, 250, clock).state
    const w = s.modules.weekendEvent as { active: boolean; goal: number }
    expect(w.active).toBe(true)
    expect(view(def, s).value('income', 1)).toBeCloseTo(1.25, 9)
    for (let i = 0; i < 80; i++) s = tick(def, s, 1000, clock).state
    expect(dispatch(def, s, { module: 'weekendEvent', type: 'claim' }, clock).ok).toBe(true)
  })
  it('flash: first window guaranteed, boost ends with the window, grace for claiming', () => {
    const def = game()
    let { s, clock } = start(def)
    s = dispatch(def, s, { module: 'producers', type: 'buy', payload: { id: 'a', count: 10 } }, clock).state
    clock.advance(76 * 60_000)
    s = tick(def, s, 250, clock).state
    expect((s.modules.flash as { active: boolean }).active).toBe(true)
    expect(view(def, s).value('income', 1)).toBeCloseTo(1.15, 9)
    clock.advance(19 * 60_000)
    s = tick(def, s, 250, clock).state
    expect((s.modules.flash as { active: boolean }).active).toBe(false)
    expect(view(def, s).value('income', 1)).toBe(1)
  })
})

describe('calendar fests', () => {
  it('names the fest that starts next, wrapping the year', () => {
    const f = (id: string, from: [number, number], to: [number, number]) => ({ id, from, to, major: false })
    const cfg = { fests: [f('spring', [3, 1], [3, 31]), f('summer', [6, 1], [6, 30]), f('winter', [12, 20], [1, 20])], shop: {}, earn: {} }
    expect(nextFest(cfg, createManualClock(Date.UTC(2027, 2, 10, 12)))?.id).toBe('summer')
    expect(nextFest(cfg, createManualClock(Date.UTC(2027, 7, 1, 12)))?.id).toBe('winter')
    // In the winter fest (it wraps the year end) the next one is spring
    expect(nextFest(cfg, createManualClock(Date.UTC(2027, 0, 5, 12)))?.id).toBe('spring')
  })
  it('fest by date (also across the year end), tokens per instance, shop', () => {
    const def = game()
    const cfg = { fests: [{ id: 'winter', from: [12, 20] as [number, number], to: [1, 20] as [number, number], major: true }], shop: {}, earn: {} }
    const jan = createManualClock(Date.UTC(2027, 0, 5, 12))
    expect(festAt(cfg, jan)?.id).toBe('winter')
    expect(festKey(festAt(cfg, jan), jan)).toBe('winter:2026')
    expect(festAt(cfg, createManualClock(Date.UTC(2027, 1, 5)))).toBeNull()
    let { s, clock } = start(def, Date.UTC(2027, 0, 5, 12))
    s = tick(def, s, 250, clock).state
    s = dispatch(def, s, { module: 'burst', type: 'use' }, clock).state
    s = dispatch(def, s, { module: 'burst', type: 'use' }, clock).state
    expect((s.modules.calendarFests as { tokens: number }).tokens).toBe(6)
    s = dispatch(def, s, { module: 'calendarFests', type: 'buy', payload: { id: 'boost' } }, clock).state
    expect(view(def, s).value('income', 1)).toBe(2)
    expect(dispatch(def, s, { module: 'calendarFests', type: 'buy', payload: { id: 'boost' } }, clock).ok).toBe(false)
    clock.advance(31 * 60_000)
    s = tick(def, s, 250, clock).state
    expect(view(def, s).value('income', 1)).toBe(1)
  })
})

describe('wheel', () => {
  it('one spin per run, buff lasts until the next prestige', () => {
    const def = game()
    let { s, clock } = start(def)
    expect(dispatch(def, s, { module: 'wheel', type: 'spin' }, clock).ok).toBe(false)
    s = { ...s, modules: { ...s.modules, prestige: { layers: [{ count: 0, runEarned: 600, sinceReset: 0 }, { count: 0, runEarned: 0, sinceReset: 0 }, { count: 0, runEarned: 0, sinceReset: 0 }] } } }
    s = prestige(def, s, 'l1', clock).state
    s = dispatch(def, s, { module: 'wheel', type: 'spin' }, clock).state
    expect(view(def, s).value('income', 1)).toBe(2)
    expect(dispatch(def, s, { module: 'wheel', type: 'spin' }, clock).ok).toBe(false)
  })
})
