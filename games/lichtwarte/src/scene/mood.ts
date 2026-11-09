import { moodAt, moodOverride, type Mood } from '@engine/art'

/** Stimmung der Talkarte: echte Uhrzeit/Jahreszeit, Test-Parameter ?ambient=night-winter. */
export function currentMood(now = new Date()): Mood {
  return moodOverride(typeof location !== 'undefined' ? location.search : '', moodAt(now))
}
