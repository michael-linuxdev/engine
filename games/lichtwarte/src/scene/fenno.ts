import type { Mood } from '@engine/art'
import { t } from '../runtime'
import type { Weather } from './weather'

/** Passende Sätze: erst die zur Lage (Nacht, Morgen, Winter, Wetter), dann die allgemeinen. */
export function fennoLines(m: Mood, w: Weather): string[] {
  const f = t.fenno
  const special = [
    ...(m.daypart === 'night' || m.daypart === 'evening' ? Object.values(f.night) : []),
    ...(m.daypart === 'dawn' ? Object.values(f.dawn) : []),
    ...(m.season === 'winter' ? Object.values(f.winter) : []),
    ...(w === 'rain' ? Object.values(f.rain) : w === 'mist' ? Object.values(f.mist) : w === 'wind' ? Object.values(f.wind) : []),
  ]
  return [...special, ...Object.values(f.any)]
}

