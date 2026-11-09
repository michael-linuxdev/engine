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
  { id: 'watchRound', de: 'Wachrunde', en: "Watch Round", kind: 'system' },
  { id: 'errands', de: 'Aufträge', en: "Errands", kind: 'system' },
  { id: 'deeds', de: 'Taten', en: "Deeds", kind: 'system' },
  { id: 'trials', de: 'Prüfungen', en: "Trials", kind: 'system' },
  { id: 'marketNight', de: 'Marktnacht', en: "Market Night", kind: 'system' },
  { id: 'starWindow', de: 'Sternfenster', en: "Star Window", kind: 'system' },
  { id: 'starWheel', de: 'Sternenrad', en: "Star Wheel", kind: 'system' },
  { id: 'festivalsOfLight', de: 'Lichterfeste', en: "Festivals of Light", kind: 'system' },
  { id: 'festHoarfrost', de: 'Raureifnächte', en: "Hoarfrost Nights", kind: 'item' },
  { id: 'festSnowdrop', de: 'Schneeglöckchentage', en: "Snowdrop Days", kind: 'item' },
  { id: 'festBudding', de: 'Knospenfest', en: "Budding Fair", kind: 'item' },
  { id: 'festBlossomRound', de: 'Blütenreigen', en: "Blossom Round", kind: 'item' },
  { id: 'festMidsummerGlow', de: 'Mittsommerglanz', en: "Midsummer Glow", kind: 'item' },
  { id: 'festFirefly', de: 'Glühwürmchennächte', en: "Firefly Nights", kind: 'item' },
  { id: 'festLantern', de: 'Laternenherbst', en: "Lantern Autumn", kind: 'item' },
  { id: 'festMistMoon', de: 'Nebelmond', en: "Mist Moon", kind: 'item' },
  { id: 'festLongLight', de: 'Fest des langen Lichts', en: "Feast of the Long Light", kind: 'item' },
]
