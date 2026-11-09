/**
 * Eigennamen-Register: JEDER Eigenname des Spiels mit Art und beiden Sprachen.
 * Zu jedem Eintrag gehört eine Zeile in docs/marken/pruefung.md (test/names.test.ts).
 * Gattungswörter (Glimmer, Schmiede, Greif …) sind keine Eigennamen, stehen aber
 * als Spielwährungen/-begriffe trotzdem hier, damit ihre Prüfung dokumentiert ist.
 */
import { BRAND } from '../brand'

export type NameKind = 'title' | 'figure' | 'place' | 'currency' | 'layer' | 'system' | 'item' | 'building'

export interface ProperName {
  id: string
  de: string
  en: string
  kind: NameKind
}

export const NAMES: readonly ProperName[] = [
  { id: 'title', de: BRAND.de, en: BRAND.en, kind: 'title' },
  { id: 'valley', de: 'Dämmertal', en: 'Duskvale', kind: 'place' },
  { id: 'warden', de: 'Alwine', en: 'Alwine', kind: 'figure' },
  { id: 'apprentice', de: 'Fenno', en: 'Fenno', kind: 'figure' },
  { id: 'glimmer', de: 'Glimmer', en: 'Glimmer', kind: 'currency' },
  { id: 'runeShards', de: 'Runensplitter', en: 'Rune Shards', kind: 'currency' },
  { id: 'glowPebbles', de: 'Lichtkiesel', en: 'Glowpebbles', kind: 'currency' },
  { id: 'nightDew', de: 'Nachttau', en: 'Nightdew', kind: 'currency' },
  { id: 'forebearLight', de: 'Ahnenlicht', en: 'Forebear Light', kind: 'currency' },
  { id: 'moonturn', de: 'Mondwende', en: 'Moonturn', kind: 'layer' },
  { id: 'longNight', de: 'Lange Nacht', en: 'Long Night', kind: 'layer' },
  { id: 'ages', de: 'Zeitalter', en: 'Ages', kind: 'layer' },
  { id: 'archive', de: 'Archiv der Wächter', en: "Wardens' Archive", kind: 'system' },
  { id: 'sparkCall', de: 'Funkenruf', en: 'Spark Call', kind: 'system' },
  { id: 'wardenRank', de: 'Wächterrang', en: 'Warden Rank', kind: 'system' },
  { id: 'chronicle', de: 'Chronik der Wächterin', en: "The Warden's Chronicle", kind: 'system' },
]
