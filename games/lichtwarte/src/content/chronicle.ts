/** Chronik: Seiten erscheinen nach Fortschritt (Bedingung auf dem Spielstand). Texte in i18n/*.ts. */
import { layerStatus, ownedOf, prestigeState, type WorldView } from '@engine/core'
import { LAYER } from '../ids'

export interface ChronicleEntry {
  id: 'welcome' | 'firstBuild' | 'holzlager' | 'steinbruch' | 'moonturnReady' | 'afterMoonturn'
  open: (w: WorldView) => boolean
}

export const CHRONICLE: readonly ChronicleEntry[] = [
  { id: 'welcome', open: () => true },
  { id: 'firstBuild', open: (w) => ownedOf(w, 'kraeuterkate') >= 1 },
  { id: 'holzlager', open: (w) => ownedOf(w, 'holzlager') >= 1 },
  { id: 'steinbruch', open: (w) => ownedOf(w, 'steinbruch') >= 1 },
  { id: 'moonturnReady', open: (w) => layerStatus(w, LAYER.moonturn).ratio >= 0.6 || prestigeState(w).layers[0].count > 0 },
  { id: 'afterMoonturn', open: (w) => prestigeState(w).layers[0].count >= 1 },
]
