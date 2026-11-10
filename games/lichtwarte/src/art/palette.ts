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

/** Himmel in drei Stufen (Zenit, Mitte, Horizont) für die Talkarte. */
export const SKY3: Record<Daypart, [string, string, string]> = {
  dawn: ['#7d86b5', '#f0b9a0', '#fbe6c3'],
  day: ['#7fb9da', '#bfe0ea', '#f2f4dc'],
  evening: ['#3c3a6e', '#b8627a', '#f3a765'],
  night: ['#0b1130', '#1c2752', '#3a4478'],
}

/** Bergketten je Tageszeit: fern, mittel, nah (Luftperspektive). */
export const RANGES: Record<Daypart, [string, string, string]> = {
  dawn: ['#d3b3bd', '#b295ae', '#8c7c9e'],
  day: ['#b4c3d9', '#93a3c0', '#7686a3'],
  evening: ['#96749c', '#70598b', '#544674'],
  night: ['#2f3a6c', '#262f5c', '#1d2449'],
}

/** Wolken je Tageszeit: Fläche, Schattenkante. */
export const CLOUD: Record<Daypart, [string, string]> = {
  dawn: ['#fff3e2', '#f1c2b0'],
  day: ['#ffffff', '#d5e6ee'],
  evening: ['#f7c79f', '#a8607c'],
  night: ['#4a5488', '#2a3364'],
}

/** Gestirn: Scheibe, Hof. */
export const ORB: Record<Daypart, [string, string]> = {
  dawn: ['#fff0c9', '#ffc98f'],
  day: ['#fffbe6', '#fff1b8'],
  evening: ['#ffd9a0', '#ff9f43'],
  night: ['#f6f1dc', '#cfd8ff'],
}

/** Licht-Überzug je Tageszeit (Farbe, Deckkraft). Liegt nur über dem Land, nie über dem Himmel. */
export const SHADE: Record<Daypart, [string, number]> = {
  dawn: ['#f2b28a', 0.12],
  day: ['#ffffff', 0],
  evening: ['#4a2a4a', 0.24],
  night: ['#101736', 0.52],
}

/** Weg durchs Tal: Rand, Fläche, Mittelspur. */
export const TRAIL = ['#a8895a', '#e2cf9f', '#f1e3bd'] as const

/** Figuren (Lehrling, Talgäste). */
export const FIGURE = { skin: '#f0c9a0', hair: '#7a4a2a', cloak: '#3f6e8c', hood: '#2c4f6b', fox: '#d9772f', foxLight: '#f6e3c8', owl: '#8c7558', wisp: '#bff3e6' } as const

/** Leuchtfeuer der Warte und Funken. */
export const BEACON = { core: '#fffbe6', warm: '#ffd27a', hot: '#ff9f43', cold: '#cfd8ff' } as const

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

/** Wetterschicht der Karte (art/weather.tsx). */
export const WEATHER_TINT = { rain: '#c9dcf0', mist: '#eef1f4', leaf: '#c98a3c', shadow: '#000000' } as const

/** Talstile (Markt): Himmel und Licht für die Vorschau. */
export const STYLE_TINT: Readonly<Record<string, readonly [string, string]>> = {
  duskBlue: ['#2b3a67', '#f2c46d'],
  emberRed: ['#5a2a2a', '#ff9a5a'],
  iceBlue: ['#2c4f6b', '#cfeaff'],
  amber: ['#5b4220', '#ffcf6e'],
  budWreath: ['#3d5a3a', '#f7b6c8'],
  solsticeSheen: ['#2f5b6b', '#ffe38a'],
  lanternParade: ['#4a2f52', '#ffb35c'],
  starOfLights: ['#1f2a4d', '#fff1b8'],
}
