/**
 * Umgebungsklang (4 Schichten), nur Synthese:
 *  wind   gefiltertes Rauschen mit langsamem Anschwellen (stärker bei Wind)
 *  fire   Herdfeuer: tiefes Grollen + Knistern (abends und nachts, im Winter mehr)
 *  water  Bach: Bandpass-Rauschen + Tropfen (stärker bei Regen)
 *  night  Grillen und ein Käuzchen (nachts) bzw. Vögel (tagsüber)
 * Die Mischung folgt Tageszeit, Jahreszeit und Wetter (alle 10 s neu gelesen).
 */
import type { AmbienceLayer, SfxRecipe } from '@engine/react'
import type { Mood } from '@engine/art'
import type { Weather } from '../scene/weather'

const chirp = (at: number, f0: number, f1: number, vol: number, dur = 0.08) => ({ kind: 'tone' as const, at, freq: f0, glideTo: f1, dur, vol })
const crackle = (at: number, f: number): SfxRecipe => [{ kind: 'noise', at, dur: 0.04, vol: 0.02, filter: 'bandpass', freq: f, q: 3 }]
const drop = (f: number): SfxRecipe => [{ kind: 'tone', at: 0, freq: f, glideTo: f * 1.6, dur: 0.07, vol: 0.012 }]
const crickets: SfxRecipe = Array.from({ length: 6 }, (_, i) => chirp(i * 0.07, 4300, 4200, 0.006, 0.04))
const owl: SfxRecipe = [chirp(0, 420, 380, 0.02, 0.35), chirp(0.6, 440, 360, 0.018, 0.5)]
const bird = (base: number): SfxRecipe => [0, 0.12, 0.24].map((t, i) => chirp(t, base * (1 + i * 0.1), base * 1.4, 0.012))

export const AMBIENCE: readonly AmbienceLayer[] = [
  { id: 'wind', bed: { filter: 'lowpass', freq: 420, gain: 0.025, lfoHz: 0.07, lfoDepth: 0.015 } },
  { id: 'fire', bed: { filter: 'lowpass', freq: 160, gain: 0.02 }, sporadic: { everyMs: 700, chance: 0.6, recipes: [crackle(0, 2200), crackle(0, 3400), [...crackle(0, 2800), ...crackle(0.09, 1900)]] } },
  { id: 'water', bed: { filter: 'bandpass', freq: 900, q: 0.8, gain: 0.018, lfoHz: 0.23, lfoDepth: 0.006 }, sporadic: { everyMs: 900, chance: 0.5, recipes: [drop(900), drop(1200), drop(1500)] } },
  { id: 'night', sporadic: { everyMs: 2600, chance: 0.6, recipes: [crickets, crickets, owl, bird(1900), bird(2400)] } },
]

/** Pegel je Schicht (0–1). */
export function ambienceMix(m: Mood, w: Weather): Record<string, number> {
  const dark = m.daypart === 'night' || m.daypart === 'evening'
  return {
    wind: w === 'wind' ? 1 : w === 'clear' ? 0.4 : 0.6,
    fire: dark ? (m.season === 'winter' ? 1 : 0.7) : m.season === 'winter' ? 0.4 : 0.1,
    water: w === 'rain' ? 1 : 0.45,
    night: m.daypart === 'night' ? 0.9 : m.daypart === 'day' ? 0.6 : 0.4,
  }
}
