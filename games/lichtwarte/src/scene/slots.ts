/** Plätze der Talkarte (Prozent der Kartenfläche), entlang des Pfades vom Tor (unten) zur Sternwarte (oben). */
import type { Slot } from '@engine/art'
import type { ProducerId } from '../game'

export const SLOTS: (Slot & { id: ProducerId })[] = [
  { id: 'kraeuterkate', x: 34, y: 90, scale: 1.1 },
  { id: 'holzlager', x: 72, y: 84, scale: 1.05 },
  { id: 'steinbruch', x: 22, y: 77, scale: 1 },
  { id: 'quellschrein', x: 62, y: 71, scale: 1 },
  { id: 'schmiede', x: 32, y: 64, scale: 0.95 },
  { id: 'kartenstube', x: 74, y: 58, scale: 0.95 },
  { id: 'alchemistenturm', x: 22, y: 51, scale: 0.9 },
  { id: 'greifenhorst', x: 64, y: 46, scale: 0.9 },
  { id: 'runenhalle', x: 30, y: 39, scale: 0.85 },
  { id: 'sternwarte', x: 70, y: 33, scale: 0.85 },
]

/** Bauwerke auf der Karte größer als im Ausbau-Fenster (Fußpunkt bleibt). */
export const BUILD_SCALE = 1.6

export const MAP_W = 360
export const MAP_H = 640
/** Oberer Himmel wird auf der Karte abgeschnitten (bleibt im ?artsheet sichtbar). */
export const MAP_CROP = 110

/** Platz → Prozent in der sichtbaren (beschnittenen) Kartenfläche. */
export function slotView(s: { x: number; y: number }): { left: number; top: number } {
  return { left: s.x, top: (((s.y / 100) * MAP_H - MAP_CROP) / (MAP_H - MAP_CROP)) * 100 }
}
