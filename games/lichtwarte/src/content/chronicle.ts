/**
 * Chronik: Seiten erscheinen nach Fortschritt (Bedingung auf dem Spielstand). Texte in i18n/story.*.ts.
 * Fünf Kapitel erzählen einen Bogen (docs/spiele/lichtwarte/welt.md): Alwines Aufbruch, die Mondwenden,
 * die Lange Nacht, der Weg aus Feuern durch die Lande, die Weitergabe der Wacht.
 * IDs nie ändern: Die gelesenen Seiten stehen als Gerätemerker unter diesen IDs.
 */
import { layerStatus, MODULE, ownedOf, prestigeState, REGIONS_ID, type HelperState, type RegionsState, type WorldView } from '@engine/core'
import { LAYER } from '../ids'

export type ChronicleId =
  | 'welcome' | 'firstBuild' | 'holzlager' | 'steinbruch' | 'spring' | 'moonturnReady'
  | 'afterMoonturn' | 'schmiede' | 'kartenstube' | 'alchemistenturm' | 'moonturn3'
  | 'greifenhorst' | 'letterMoor' | 'runenhalle' | 'moonturn5' | 'apprentice' | 'sternwarte' | 'moonturn10' | 'nightNear'
  | 'longNight' | 'firstRealm' | 'letterRoad' | 'fiveRealms' | 'tenRealms'
  | 'agesNear' | 'ages' | 'epilogue'

export type ChapterId = 'key' | 'remains' | 'wakes' | 'night' | 'handover'
export const CHAPTERS: readonly ChapterId[] = ['key', 'remains', 'wakes', 'night', 'handover']

/** Wer schreibt: Alwine in die Chronik, Alwine als Brief (vom Greif gebracht), oder die Wacht selbst. */
export type Voice = 'chronicle' | 'letter' | 'you'

/** Bild zur Seite: ein Bauwerk (ID) oder ein Motiv. */
export type Vignette = 'key' | 'spark' | 'moon' | 'archive' | 'letter' | 'apprentice' | 'stars' | 'dawn' | 'fires' | 'tower' | (string & {})

export interface ChronicleEntry {
  id: ChronicleId
  chapter: ChapterId
  art: Vignette
  voice?: Voice
  open: (w: WorldView) => boolean
}

const turns = (w: WorldView) => prestigeState(w).layers[0].count
const nights = (w: WorldView) => prestigeState(w).layers[1]?.count ?? 0
const ages = (w: WorldView) => prestigeState(w).layers[2]?.count ?? 0

export const CHRONICLE: readonly ChronicleEntry[] = [
  { id: 'welcome', chapter: 'key', art: 'key', open: () => true },
  { id: 'firstBuild', chapter: 'key', art: 'kraeuterkate', open: (w) => ownedOf(w, 'kraeuterkate') >= 1 },
  { id: 'holzlager', chapter: 'key', art: 'holzlager', open: (w) => ownedOf(w, 'holzlager') >= 1 },
  { id: 'steinbruch', chapter: 'key', art: 'steinbruch', open: (w) => ownedOf(w, 'steinbruch') >= 1 },
  { id: 'spring', chapter: 'key', art: 'quellschrein', open: (w) => ownedOf(w, 'quellschrein') >= 1 },
  { id: 'moonturnReady', chapter: 'key', art: 'moon', open: (w) => layerStatus(w, LAYER.moonturn).ratio >= 0.6 || turns(w) > 0 },

  { id: 'afterMoonturn', chapter: 'remains', art: 'archive', open: (w) => turns(w) >= 1 },
  { id: 'schmiede', chapter: 'remains', art: 'schmiede', open: (w) => ownedOf(w, 'schmiede') >= 1 },
  { id: 'kartenstube', chapter: 'remains', art: 'kartenstube', open: (w) => ownedOf(w, 'kartenstube') >= 1 },
  { id: 'alchemistenturm', chapter: 'remains', art: 'alchemistenturm', open: (w) => ownedOf(w, 'alchemistenturm') >= 1 },
  { id: 'moonturn3', chapter: 'remains', art: 'moon', open: (w) => turns(w) >= 3 },

  { id: 'greifenhorst', chapter: 'wakes', art: 'greifenhorst', open: (w) => ownedOf(w, 'greifenhorst') >= 1 },
  { id: 'letterMoor', chapter: 'wakes', art: 'letter', voice: 'letter', open: (w) => ownedOf(w, 'greifenhorst') >= 10 },
  { id: 'runenhalle', chapter: 'wakes', art: 'runenhalle', open: (w) => ownedOf(w, 'runenhalle') >= 1 },
  { id: 'moonturn5', chapter: 'wakes', art: 'tower', open: (w) => turns(w) >= 5 },
  { id: 'apprentice', chapter: 'wakes', art: 'apprentice', open: (w) => (w.get<HelperState>(MODULE.helper)?.rank ?? 0) >= 1 },
  { id: 'sternwarte', chapter: 'wakes', art: 'sternwarte', open: (w) => ownedOf(w, 'sternwarte') >= 1 },
  { id: 'moonturn10', chapter: 'wakes', art: 'moon', open: (w) => turns(w) >= 10 },
  { id: 'nightNear', chapter: 'wakes', art: 'stars', open: (w) => layerStatus(w, LAYER.longNight).ratio >= 0.5 || nights(w) > 0 },

  { id: 'longNight', chapter: 'night', art: 'dawn', open: (w) => nights(w) >= 1 },
  { id: 'firstRealm', chapter: 'night', art: 'fires', open: (w) => openRealms(w) >= 1 },
  { id: 'letterRoad', chapter: 'night', art: 'letter', voice: 'letter', open: (w) => openRealms(w) >= 3 },
  { id: 'fiveRealms', chapter: 'night', art: 'fires', open: (w) => openRealms(w) >= 5 },
  { id: 'tenRealms', chapter: 'night', art: 'stars', open: (w) => openRealms(w) >= 10 },

  { id: 'agesNear', chapter: 'handover', art: 'apprentice', open: (w) => layerStatus(w, LAYER.ages).ratio >= 0.5 || ages(w) > 0 },
  { id: 'ages', chapter: 'handover', art: 'tower', open: (w) => ages(w) >= 1 },
  { id: 'epilogue', chapter: 'handover', art: 'key', voice: 'you', open: (w) => ages(w) >= 2 },
]

function openRealms(w: WorldView): number {
  return Object.values(w.get<RegionsState | undefined>(REGIONS_ID)?.regions ?? {}).filter((r) => r.open).length
}
