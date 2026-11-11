/** Plätze der Talkarte (Prozent der Kartenfläche), entlang des Weges vom Tor (unten) hinauf zur Warte (oben Mitte). */
import type { Slot } from '@engine/art'
import type { ProducerId } from '../game'

export const SLOTS: (Slot & { id: ProducerId })[] = [
  { id: 'kraeuterkate', x: 22, y: 89, scale: 1.08 },
  { id: 'holzlager', x: 77, y: 86, scale: 1.05 },
  { id: 'steinbruch', x: 21, y: 79.5, scale: 1 },
  { id: 'quellschrein', x: 74, y: 75.5, scale: 1 },
  { id: 'schmiede', x: 29, y: 69.5, scale: 0.95 },
  { id: 'kartenstube', x: 78, y: 65, scale: 0.94 },
  { id: 'alchemistenturm', x: 19, y: 59.5, scale: 0.9 },
  { id: 'greifenhorst', x: 72, y: 55, scale: 0.88 },
  { id: 'runenhalle', x: 27, y: 49.5, scale: 0.84 },
  { id: 'sternwarte', x: 79, y: 45.5, scale: 0.82 },
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

/** Wo der Lehrling auf dem Weg steht: Seine Stelle wechselt mit der Minute. */
export function apprenticeSpot(minute: number): { x: number; y: number; scale: number } {
  const y = HORIZON + 80 + ((minute * 67) % 280)
  return { x: trailX(y), y, scale: 0.62 + ((y - HORIZON) / (MAP_H - HORIZON)) * 0.5 }
}

/** Leuchtfeuer der Warte (0–3): wächst mit den stehenden Bauwerken; nach der ersten Mondwende brennt es voll. */
export function beaconLevel(built: number, turns: number): number {
  if (turns > 0) return 3
  return built >= 5 ? 2 : built >= 1 ? 1 : 0
}

/** Wo der Talgast steht: rechts neben dem Funkenruf-Knopf, frei sichtbar und antippbar. */
export const GUEST_SPOT = { x: 252, y: 614 } as const
