import { describe, expect, it } from 'vitest'
import { allMoods, daypartOf, moodOverride, paintOrder, seasonOf, seeded, tierFor, vary } from '../src'

describe('art-kit', () => {
  it('seeded variation is stable', () => {
    const a = seeded('roof')
    const b = seeded('roof')
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
    expect(vary(seeded('x'), 0, 10) % 0.5).toBe(0)
  })
  it('moods from clock and override', () => {
    expect(daypartOf(6)).toBe('dawn')
    expect(daypartOf(12)).toBe('day')
    expect(daypartOf(19)).toBe('evening')
    expect(daypartOf(2)).toBe('night')
    expect(seasonOf(1)).toBe('winter')
    expect(seasonOf(10)).toBe('autumn')
    expect(moodOverride('?ambient=night-winter', { daypart: 'day', season: 'summer' })).toEqual({ daypart: 'night', season: 'winter' })
    expect(moodOverride('?ambient=bogus', { daypart: 'day', season: 'summer' })).toEqual({ daypart: 'day', season: 'summer' })
    expect(allMoods()).toHaveLength(16)
  })
  it('tiers and paint order', () => {
    expect(tierFor(0, [1, 10, 25, 50])).toBe(0)
    expect(tierFor(1, [1, 10, 25, 50])).toBe(1)
    expect(tierFor(60, [1, 10, 25, 50])).toBe(4)
    expect(paintOrder([{ y: 3 }, { y: 1 }]).map((s) => s.y)).toEqual([1, 3])
  })
})
