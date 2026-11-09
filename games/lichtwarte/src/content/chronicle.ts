/** Chronik: Seiten erscheinen nach Fortschritt (Bedingung auf dem Spielstand). Texte in i18n/*.ts. */
import { layerStatus, MODULE, ownedOf, prestigeState, REGIONS_ID, type HelperState, type RegionsState, type WorldView } from '@engine/core'
import { LAYER } from '../ids'

export type ChronicleId =
  | 'welcome' | 'firstBuild' | 'holzlager' | 'steinbruch' | 'moonturnReady' | 'afterMoonturn'
  | 'schmiede' | 'kartenstube' | 'alchemistenturm' | 'greifenhorst' | 'runenhalle' | 'sternwarte'
  | 'moonturn3' | 'moonturn5' | 'moonturn10' | 'longNight' | 'ages' | 'firstRealm' | 'fiveRealms' | 'apprentice'

export interface ChronicleEntry {
  id: ChronicleId
  open: (w: WorldView) => boolean
}

export const CHRONICLE: readonly ChronicleEntry[] = [
  { id: 'welcome', open: () => true },
  { id: 'firstBuild', open: (w) => ownedOf(w, 'kraeuterkate') >= 1 },
  { id: 'holzlager', open: (w) => ownedOf(w, 'holzlager') >= 1 },
  { id: 'steinbruch', open: (w) => ownedOf(w, 'steinbruch') >= 1 },
  { id: 'moonturnReady', open: (w) => layerStatus(w, LAYER.moonturn).ratio >= 0.6 || prestigeState(w).layers[0].count > 0 },
  { id: 'afterMoonturn', open: (w) => prestigeState(w).layers[0].count >= 1 },
  { id: 'schmiede', open: (w) => ownedOf(w, 'schmiede') >= 1 },
  { id: 'kartenstube', open: (w) => ownedOf(w, 'kartenstube') >= 1 },
  { id: 'alchemistenturm', open: (w) => ownedOf(w, 'alchemistenturm') >= 1 },
  { id: 'greifenhorst', open: (w) => ownedOf(w, 'greifenhorst') >= 1 },
  { id: 'runenhalle', open: (w) => ownedOf(w, 'runenhalle') >= 1 },
  { id: 'sternwarte', open: (w) => ownedOf(w, 'sternwarte') >= 1 },
  { id: 'moonturn3', open: (w) => prestigeState(w).layers[0].count >= 3 },
  { id: 'moonturn5', open: (w) => prestigeState(w).layers[0].count >= 5 },
  { id: 'moonturn10', open: (w) => prestigeState(w).layers[0].count >= 10 },
  { id: 'apprentice', open: (w) => (w.get<HelperState>(MODULE.helper)?.rank ?? 0) >= 1 },
  { id: 'longNight', open: (w) => (prestigeState(w).layers[1]?.count ?? 0) >= 1 },
  { id: 'firstRealm', open: (w) => openRealms(w) >= 1 },
  { id: 'fiveRealms', open: (w) => openRealms(w) >= 5 },
  { id: 'ages', open: (w) => (prestigeState(w).layers[2]?.count ?? 0) >= 1 },
]

function openRealms(w: WorldView): number {
  return Object.values(w.get<RegionsState | undefined>(REGIONS_ID)?.regions ?? {}).filter((r) => r.open).length
}
