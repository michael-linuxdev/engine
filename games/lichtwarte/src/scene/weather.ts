/**
 * Wetter im Tal: vier Arten, je Kalendertag fest (aus dem Tag berechnet, kein
 * Zufall im Spielstand). Die Jahreszeit gewichtet. Das Wetter bestimmt das
 * Omen des Tages, die Wetterschicht der Karte und den Umgebungsklang.
 * Test-Parameter: ?weather=rain
 */
import { dayNumber, hashKey } from '@engine/core'

export const WEATHERS = ['clear', 'wind', 'rain', 'mist'] as const
export type Weather = (typeof WEATHERS)[number]

type Season = 'winter' | 'spring' | 'summer' | 'autumn'

/** Gewichte je Jahreszeit: klar, Wind, Regen, Nebel. */
const WEIGHTS: Record<Season, readonly [number, number, number, number]> = {
  winter: [35, 25, 10, 30],
  spring: [40, 20, 30, 10],
  summer: [60, 15, 20, 5],
  autumn: [30, 25, 25, 20],
}

export function seasonOfMonth(month: number): Season {
  if (month === 12 || month <= 2) return 'winter'
  if (month <= 5) return 'spring'
  if (month <= 8) return 'summer'
  return 'autumn'
}

/** Wetter eines lokalen Tages `YYYY-MM-DD`. */
export function weatherOf(day: string): Weather {
  const n = dayNumber(day)
  if (!Number.isFinite(n)) return 'clear'
  const w = WEIGHTS[seasonOfMonth(Number(day.slice(5, 7)))]
  let x = hashKey(`weather:${day}`) % w.reduce((a, b) => a + b, 0)
  for (let i = 0; i < WEATHERS.length; i++) {
    x -= w[i]
    if (x < 0) return WEATHERS[i]
  }
  return 'clear'
}

/** Omen zum Wetter: Wind → Sturmnacht, klarer Sommer → Dürresommer, Nebel oder klarer Winter/Frühling → früher Frost. Regen: keins. */
export function omenFor(day: string): string {
  const w = weatherOf(day)
  const season = seasonOfMonth(Number(day.slice(5, 7)))
  if (w === 'wind') return 'stormNight'
  if (w === 'clear' && season === 'summer') return 'drySummer'
  if (w === 'mist' || (w === 'clear' && (season === 'winter' || season === 'spring'))) return 'earlyFrost'
  return ''
}

export function weatherOverride(search: string, base: Weather): Weather {
  const v = new URLSearchParams(search).get('weather')
  return (WEATHERS as readonly string[]).includes(v ?? '') ? (v as Weather) : base
}

function localDayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Wetter von heute (echte Uhr, Test-Parameter). */
export function currentWeather(now = new Date()): Weather {
  return weatherOverride(typeof location !== 'undefined' ? location.search : '', weatherOf(localDayKey(now)))
}
