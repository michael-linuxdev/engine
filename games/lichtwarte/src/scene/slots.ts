/** Plätze der Talkarte (Prozent der Kartenfläche), entlang des Weges vom Tor (unten) hinauf zur Warte (oben Mitte). */
import type { Slot } from '@engine/art'
import type { ProducerId } from '../game'

/**
 * Auf jeder Wegseite wechseln die Plätze zwischen außen und innen. So steht kein Bauwerk
 * genau über dem nächsten, und kein Schild verdeckt das Bauwerk darunter (Rückmeldung 2026-11-11:
 * „Steinbruch überlagert Kräuterkate“). Lange Namen stehen innen, damit ihr Schild nicht über den Rand ragt.
 */
export const SLOTS: (Slot & { id: ProducerId })[] = [
  { id: 'kraeuterkate', x: 17, y: 90, scale: 1.08 },
  { id: 'holzlager', x: 83, y: 86.5, scale: 1.05 },
  { id: 'steinbruch', x: 32, y: 78.7, scale: 1 },
  { id: 'quellschrein', x: 68, y: 75.2, scale: 1 },
  { id: 'schmiede', x: 16, y: 67.4, scale: 0.95 },
  { id: 'kartenstube', x: 83, y: 63.9, scale: 0.94 },
  { id: 'alchemistenturm', x: 32, y: 56.1, scale: 0.9 },
  { id: 'greifenhorst', x: 68, y: 52.6, scale: 0.88 },
  { id: 'runenhalle', x: 17, y: 44.8, scale: 0.84 },
  { id: 'sternwarte', x: 83, y: 41.3, scale: 0.82 },
]

/** Bauwerke auf der Karte größer als im Ausbau-Fenster (Fußpunkt bleibt). */
export const BUILD_SCALE = 1.26

export const MAP_W = 360
export const MAP_H = 640
/** Horizont: Fuß der Berge, Beginn des Tals. */
export const HORIZON = 236
/** Die Warte (Wahrzeichen) steht oben in der Mitte, am Ende des Weges. */
export const TOWER = { x: 180, y: 262 } as const

/** Platz → Prozent der Kartenfläche (die Karte zeigt die ganze Szene). */
export function slotView(s: { x: number; y: number }): { left: number; top: number } {
  return { left: s.x, top: s.y }
}

/** Mittellinie des Weges bei Höhe y (Szenen-Koordinaten): sanfte Schlangenlinie. */
export function trailX(y: number): number {
  return Math.round((MAP_W / 2 + 20 * Math.sin((y - TOWER.y) / 46)) * 2) / 2
}

/** Laternen am Weg: eine je Bauwerk, auf der anderen Wegseite. Sie brennt, sobald das Bauwerk steht. */
export const LANTERNS: { x: number; y: number }[] = SLOTS.map((s) => {
  const y = (s.y / 100) * MAP_H - 12
  return { x: trailX(y) + (s.x < 50 ? 13 : -13), y }
})

/** Schmuck-Plätze (Banner & Steine) entlang des Weges. */
export const DECOR_SLOTS: { x: number; y: number }[] = [94.5, 83, 72.5, 67.5, 62, 57, 52, 47].map((y, i) => {
  const py = (y / 100) * MAP_H
  return { x: Math.round(((trailX(py) + (i % 2 ? 15 : -15)) / MAP_W) * 1000) / 10, y }
})

/**
 * Wo der Lehrling auf dem Weg steht: Er geht den Weg ab und hält auf Höhe der Bauwerke an.
 * `step` zählt seine Halte; nach dem obersten kehrt er um.
 */
export function apprenticeSpot(step: number): { x: number; y: number; scale: number } {
  const stops = SLOTS.map((s) => (s.y / 100) * MAP_H - 6)
  const n = stops.length
  const k = ((step % (2 * n - 2)) + (2 * n - 2)) % (2 * n - 2)
  const y = stops[k < n ? k : 2 * n - 2 - k]
  return { x: trailX(y), y, scale: 0.62 + ((y - HORIZON) / (MAP_H - HORIZON)) * 0.5 }
}

/** Leuchtfeuer der Warte (0–3): wächst mit den stehenden Bauwerken; nach der ersten Mondwende brennt es voll. */
export function beaconLevel(built: number, turns: number): number {
  if (turns > 0) return 3
  return built >= 5 ? 2 : built >= 1 ? 1 : 0
}

/** Wo ein Talgast stehen kann: sechs freie Stellen am Weg und am unteren Rand, alle gut antippbar. */
export const GUEST_SPOTS = [
  { x: 242, y: 626 },
  { x: 118, y: 626 },
  { x: 180, y: 540 },
  { x: 196, y: 452 },
  { x: 168, y: 368 },
  { x: 232, y: 566 },
] as const

/** Die Stelle dieses Besuchs: bleibt gleich, solange der Gast da ist (abgeleitet aus seinem Abschied). */
export function guestSpot(until: number): { x: number; y: number } {
  return GUEST_SPOTS[Math.abs(Math.floor(until / 1000)) % GUEST_SPOTS.length]
}

/** Erste Stelle (frühere feste Stelle des Talgasts). */
export const GUEST_SPOT = GUEST_SPOTS[0]

/** Wo der Umschlag liegt, wenn ein Brief wartet: am Fuß der Warte. */
export const LETTER_SPOT = { x: 212, y: 286 } as const
