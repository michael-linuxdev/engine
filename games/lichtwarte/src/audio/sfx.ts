/**
 * Ton-Effekte (8), nur WebAudio-Synthese, keine Dateien:
 *  spark   Funkenruf: knisterndes Rauschen + heller Glanz
 *  build   Ausbau: hölzerner Doppelschlag
 *  claim   Einsammeln: dumpfer Korb + zwei Glocken
 *  level   Wächterrang: aufsteigende Vogelrufe
 *  chime   Auftrag/Tat: kleines Dreiklang-Glöckchen
 *  turn    Mondwende/Lange Nacht/Zeitalter: Spieluhr-Phrase
 *  letter  Chronik/Rückkehr-Brief: Papierrascheln + Glocke
 *  coin    Markt/Rad/Fest: zwei helle Münzklänge
 */
import type { EngineEvent } from '@engine/core'
import type { SfxRecipe } from '@engine/react'

const tone = (at: number, freq: number, dur: number, vol: number, wave: OscillatorType = 'sine', glideTo?: number) => ({ kind: 'tone' as const, at, freq, dur, vol, wave, glideTo })
const pluck = (at: number, f: number, vol: number) => [tone(at, f, 0.35, vol), tone(at, f * 4, 0.06, vol * 0.35)]

export const SFX: Readonly<Record<string, SfxRecipe>> = {
  spark: [
    { kind: 'noise', at: 0, dur: 0.25, vol: 0.06, filter: 'highpass', freq: 2500, freqTo: 6000 },
    tone(0.04, 1318.5, 0.35, 0.03, 'triangle', 1760),
  ],
  build: [...pluck(0, 392, 0.06), ...pluck(0.08, 587.33, 0.045)],
  claim: [tone(0, 140, 0.18, 0.08, 'triangle', 80), tone(0.08, 659.25, 0.5, 0.04), tone(0.18, 987.77, 0.6, 0.035)],
  level: [tone(0, 2200, 0.09, 0.025, 'sine', 3200), tone(0.11, 2600, 0.09, 0.022, 'sine', 3600), tone(0.26, 1900, 0.09, 0.025, 'sine', 2900)],
  chime: [783.99, 987.77, 1318.5].map((f, i) => tone(i * 0.09, f, 0.5, 0.035)),
  turn: [659.25, 587.33, 493.88, 523.25, 659.25, 783.99].map((f, i) => tone(i * 0.26 + (i >= 3 ? 0.3 : 0), f, 1, 0.04, 'triangle')),
  letter: [{ kind: 'noise', at: 0, dur: 0.3, vol: 0.03, filter: 'highpass', freq: 3000 }, tone(0.2, 1046.5, 0.8, 0.03)],
  coin: [tone(0, 1567.98, 0.25, 0.03, 'square'), tone(0.07, 2093, 0.35, 0.025, 'square')],
}

/** Kurzes Vibrieren (Handy) je Effekt, in ms. */
export const SFX_VIBRATE: Readonly<Record<string, number>> = { spark: 8, build: 6, claim: 14, level: 20, turn: 30, chime: 10 }

/** Welches Engine-Ereignis welchen Effekt spielt. */
export const SFX_EVENTS: Readonly<Record<string, string | ((e: EngineEvent) => string | null)>> = {
  'burst.used': 'spark',
  'surprise.found': 'chime',
  'choice.made': 'chime',
  'combine.fizzle': 'letter',
  'producer.bought': 'build',
  'region.bought': 'build',
  'meta.bought': 'build',
  'daily.claimed': 'claim',
  'offline.claimed': 'claim',
  'weekend.claimed': 'claim',
  'flash.claimed': 'claim',
  'level.up': 'level',
  'quest.claimed': 'chime',
  'achievement.done': 'chime',
  'challenge.done': 'chime',
  'collection.found': 'chime',
  'prestige.performed': 'turn',
  'offline.comeback': 'letter',
  'region.opened': 'letter',
  'visitor.greeted': 'chime',
  'region.mastered': 'level',
  'prestige.milestone': 'level',
  'wheel.spun': 'coin',
  'fest.bought': 'coin',
  'market.offer': 'coin',
  'market.gift': 'coin',
  'market.cosmetic': 'coin',
}
