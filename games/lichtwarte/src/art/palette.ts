/**
 * Palette — die EINZIGE Datei mit Farbwerten der Spielgrafik.
 * Jeder Hex-Wert steht auch in hex-allow.json (test/art.test.ts prüft das).
 * Stil: Holzschnitt trifft Aquarell — dunkle, warme Konturen, gedeckte
 * Flächen, wenige helle Lichtakzente (docs/spiele/lichtwarte/kunststil.md).
 */
import type { Daypart, Mood, Season } from '@engine/art'

export const P = {
  outline: '#3b2b24',
  wood: '#8a5a3b',
  woodDark: '#6b4430',
  woodLight: '#b07a4f',
  stone: '#9b948a',
  stoneDark: '#6f6a63',
  stoneLight: '#c2bcb0',
  roof: '#a4473a',
  roofDark: '#7d3329',
  thatch: '#c9a25a',
  thatchDark: '#a07d3e',
  slate: '#55607a',
  grass: '#6f8f4e',
  grassDark: '#4f6b37',
  grassLight: '#9cb86b',
  water: '#5d8fa8',
  waterLight: '#9cc6d6',
  glow: '#ffd27a',
  glowHot: '#ff9f43',
  glowSoft: '#fff1c4',
  ember: '#e0603a',
  clothBlue: '#3f6e8c',
  clothViolet: '#7a4f8c',
  metal: '#5b6470',
  metalLight: '#a7b0ba',
  paper: '#efe2c4',
  windowDark: '#2e3346',
  thorn: '#4b3a3d',
  mist: '#cfd6dc',
  rubble: '#857c72',
  feather: '#d9c7a1',
  blossom: '#f2b8c6',
  leafAutumn: '#c8742f',
  leafAutumnDark: '#a84f2a',
  snow: '#f4f6f8',
  snowShade: '#dfe7ee',
  white: '#ffffff',
} as const

export type Color = (typeof P)[keyof typeof P]

/** Himmel oben/unten je Tageszeit. */
export const SKY: Record<Daypart, [string, string]> = {
  dawn: ['#f3c7a5', '#f7e3c2'],
  day: ['#bcd9e6', '#e9f1e7'],
  evening: ['#e59a6b', '#6d5a8c'],
  night: ['#1f2a4a', '#3b3f6b'],
}

/** Licht-Überzug je Tageszeit (Farbe, Deckkraft). */
export const SHADE: Record<Daypart, [string, number]> = {
  dawn: ['#f2b28a', 0.12],
  day: ['#ffffff', 0],
  evening: ['#5a2e3a', 0.2],
  night: ['#141a33', 0.46],
}

/** Boden je Jahreszeit: [Hügel fern, Hügel nah, Wiese]. */
export const GROUND: Record<Season, [string, string, string]> = {
  spring: ['#8fae72', '#7f9a5a', '#6f8f4e'],
  summer: ['#7f9f5c', '#6f8f4e', '#5f8044'],
  autumn: ['#a89a5c', '#9a8650', '#8a7a46'],
  winter: ['#dfe7ee', '#cfd9e2', '#f4f6f8'],
}

/** Laub je Jahreszeit. */
export const FOLIAGE: Record<Season, [string, string]> = {
  spring: ['#9cb86b', '#f2b8c6'],
  summer: ['#5f8044', '#4f6b37'],
  autumn: ['#c8742f', '#a84f2a'],
  winter: ['#dfe7ee', '#9b948a'],
}

/** Ferne Berge. */
export const MOUNTAIN: [string, string] = ['#8d8fa6', '#a9abbd']

/** Fenster leuchten abends und nachts. */
export function windowColor(m: Mood): string {
  return m.daypart === 'night' || m.daypart === 'evening' ? P.glow : P.windowDark
}

export function isDark(m: Mood): boolean {
  return m.daypart === 'night' || m.daypart === 'evening'
}
