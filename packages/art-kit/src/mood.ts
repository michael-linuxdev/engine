/**
 * Moods: daypart × season, from the real local clock (or ?ambient=night-winter).
 * The art reads colours through a mood palette, never hard-coded per scene.
 */
export const DAYPARTS = ['dawn', 'day', 'evening', 'night'] as const
export const SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const
export type Daypart = (typeof DAYPARTS)[number]
export type Season = (typeof SEASONS)[number]
export interface Mood {
  daypart: Daypart
  season: Season
}

export function daypartOf(hour: number): Daypart {
  if (hour >= 5 && hour < 9) return 'dawn'
  if (hour >= 9 && hour < 17) return 'day'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'night'
}

/** Meteorological seasons, northern hemisphere. Month 1–12. */
export function seasonOf(month: number): Season {
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

export function moodAt(date: Date): Mood {
  return { daypart: daypartOf(date.getHours()), season: seasonOf(date.getMonth() + 1) }
}

/** `?ambient=night`, `?ambient=evening-winter` … overrides the clock. */
export function moodOverride(search: string, base: Mood): Mood {
  const q = new URLSearchParams(search).get('ambient')
  if (!q) return base
  const parts = q.split('-')
  const daypart = (DAYPARTS as readonly string[]).includes(parts[0]) ? (parts[0] as Daypart) : base.daypart
  const season = parts[1] && (SEASONS as readonly string[]).includes(parts[1]) ? (parts[1] as Season) : base.season
  return { daypart, season }
}

export function allMoods(): Mood[] {
  return DAYPARTS.flatMap((daypart) => SEASONS.map((season) => ({ daypart, season })))
}
