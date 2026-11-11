/**
 * Chronik: Seiten erscheinen nach Fortschritt (Bedingung auf dem Spielstand). Texte in i18n/story.*.ts.
 * Buch 1 (sechs Kapitel) und Buch 2 „Der Weg der Feuer“ (fünf Kapitel, Jahr 2). Die ersten fünf Kapitel erzählen einen Bogen (docs/spiele/lichtwarte/welt.md): Alwines Aufbruch, die Mondwenden,
 * die Lange Nacht, der Weg aus Feuern durch die Lande, die Weitergabe der Wacht.
 * IDs nie ändern: Die gelesenen Seiten stehen als Gerätemerker unter diesen IDs.
 */
import { layerStatus, MODULE, ownedOf, prestigeState, REGIONS_ID, type HelperState, type RegionsState, type WorldView, VOYAGES_ID, type VoyagesState, linkLevels, LINKS_ID, longestChain, type LinksState, CHART_ID, chartCells, chartCompleted, type ChartState } from '@engine/core'
import { FIRE_ROAD } from './fireRoad'
import { SKY_CHART } from './skyChart'
import { REALM_GROUPS, REALM_IDS } from './realms'
import { LAYER } from '../ids'

const HIGHLAND_IDS = REALM_IDS.slice(REALM_GROUPS[4].from, REALM_GROUPS[4].to)
const COAST_IDS = REALM_IDS.slice(REALM_GROUPS[5].from, REALM_GROUPS[5].to)

export type ChronicleId =
  | 'welcome' | 'firstBuild' | 'holzlager' | 'steinbruch' | 'spring' | 'moonturnReady'
  | 'afterMoonturn' | 'schmiede' | 'kartenstube' | 'alchemistenturm' | 'moonturn3'
  | 'greifenhorst' | 'letterMoor' | 'runenhalle' | 'moonturn5' | 'apprentice' | 'sternwarte' | 'moonturn10' | 'nightNear'
  | 'longNight' | 'firstRealm' | 'letterRoad' | 'fiveRealms' | 'tenRealms'
  | 'agesNear' | 'ages' | 'epilogue'
  // Kapitel 6 (nur anhängen)
  | 'voyageFirst' | 'voyageMaps' | 'voyageFenno' | 'voyageCoast' | 'voyageFires' | 'voyageYear'
  // Buch 2 · Der Weg der Feuer (Jahr 2, nur anhängen)
  | 'highFirst' | 'roadFirst' | 'highStair' | 'roadThree' | 'highSaddle' | 'chainThree' | 'highTarn' | 'highJuniper' | 'highBridge' | 'roadEight' | 'highGoat' | 'highCircle' | 'roadTwelve' | 'highSprings' | 'chainEight' | 'highEagle' | 'highSlate' | 'roadSixteen' | 'highMist' | 'highPasture' | 'roadTwentyTwo' | 'highHeaps' | 'chainThirteen' | 'highCloister' | 'highLarch' | 'roadTwentyEight' | 'highWatershed' | 'highCave' | 'highGorge' | 'roadThirtySix' | 'chainEighteen' | 'highFirn' | 'highFair' | 'highPlateau' | 'roadFortyFive' | 'highKiln' | 'highBoundary' | 'chainTwentyFour' | 'highFirstWatch' | 'roadSixty'
  // Buch 3 · Die tiefe Zeit (Jahr 3, nur anhängen)
  | 'coastDescent' | 'skyFirst' | 'coastWood' | 'coastSalt' | 'conLadder' | 'coastMill' | 'skyEdge' | 'coastCliffs' | 'coastBoats' | 'coastPilot' | 'skyOldChart' | 'coastSeagrass' | 'conSecond' | 'coastBuoy' | 'coastNets' | 'skyTwoSkies' | 'coastHarbour' | 'conThird' | 'coastLightship' | 'coastKiln' | 'skyLow' | 'coastPath' | 'coastBirds' | 'conFifth' | 'coastVillage' | 'coastCharts' | 'skyCount' | 'coastArch' | 'coastGlow' | 'conSeventh' | 'coastRose' | 'skyRing' | 'coastHorn' | 'coastBottles' | 'conNinth' | 'coastObservatory' | 'skyReturn' | 'coastCauseway' | 'coastFourRays' | 'conAll'

export type ChapterId = 'key' | 'remains' | 'wakes' | 'night' | 'handover' | 'firstYear' | 'upward' | 'traces' | 'otherFires' | 'coldKiln' | 'firstWatch' | 'descent' | 'lights' | 'twoLists' | 'deepTime' | 'fourRays'
export const CHAPTERS: readonly ChapterId[] = ['key', 'remains', 'wakes', 'night', 'handover', 'firstYear', 'upward', 'traces', 'otherFires', 'coldKiln', 'firstWatch', 'descent', 'lights', 'twoLists', 'deepTime', 'fourRays']

/** Bücher der Chronik: je Jahr eines (Kapitel in Reihenfolge). Neue Bücher nur anhängen. */
export const BOOKS: readonly { id: 'watch' | 'wayOfFires' | 'deepTime'; chapters: readonly ChapterId[] }[] = [
  { id: 'watch', chapters: ['key', 'remains', 'wakes', 'night', 'handover', 'firstYear'] },
  { id: 'wayOfFires', chapters: ['upward', 'traces', 'otherFires', 'coldKiln', 'firstWatch'] },
  { id: 'deepTime', chapters: ['descent', 'lights', 'twoLists', 'deepTime', 'fourRays'] },
]

/** Wer schreibt: Alwine in die Chronik, Alwine als Brief (vom Greif gebracht), Fenno als Brief (ab Buch 3), oder die Wacht selbst. */
export type Voice = 'chronicle' | 'letter' | 'letterFenno' | 'you'

/** Bild zur Seite: ein Bauwerk (ID), ein Motiv oder das Bild eines Landes (`realm:<id>`). */
export type Vignette = 'key' | 'spark' | 'moon' | 'archive' | 'letter' | 'apprentice' | 'stars' | 'dawn' | 'fires' | 'tower' | (string & {})

export interface ChronicleEntry {
  id: ChronicleId
  chapter: ChapterId
  art: Vignette
  voice?: Voice
  open: (w: WorldView) => boolean
  /** Wie sich die Seite öffnet (für das Inhaltsverzeichnis; verrät weder Titel noch Text). */
  clue?: Clue
}

export type Clue =
  | { kind: 'build'; id: string; level?: number }
  | { kind: 'turns'; layer: string; n: number }
  | { kind: 'near'; layer: string }
  | { kind: 'realms'; n: number }
  | { kind: 'helper' }
  | { kind: 'voyages'; n: number }
  | { kind: 'highlands'; n: number }
  | { kind: 'road'; n: number }
  | { kind: 'chain'; n: number }
  | { kind: 'coasts'; n: number }
  | { kind: 'sky'; n: number }
  | { kind: 'constellations'; n: number }

const turns = (w: WorldView) => prestigeState(w).layers[0].count
const nights = (w: WorldView) => prestigeState(w).layers[1]?.count ?? 0
const ages = (w: WorldView) => prestigeState(w).layers[2]?.count ?? 0

export const CHRONICLE: readonly ChronicleEntry[] = [
  { id: 'welcome', chapter: 'key', art: 'key', open: () => true },
  { id: 'firstBuild', chapter: 'key', art: 'kraeuterkate', open: (w) => ownedOf(w, 'kraeuterkate') >= 1, clue: { kind: 'build', id: 'kraeuterkate' } },
  { id: 'holzlager', chapter: 'key', art: 'holzlager', open: (w) => ownedOf(w, 'holzlager') >= 1, clue: { kind: 'build', id: 'holzlager' } },
  { id: 'steinbruch', chapter: 'key', art: 'steinbruch', open: (w) => ownedOf(w, 'steinbruch') >= 1, clue: { kind: 'build', id: 'steinbruch' } },
  { id: 'spring', chapter: 'key', art: 'quellschrein', open: (w) => ownedOf(w, 'quellschrein') >= 1, clue: { kind: 'build', id: 'quellschrein' } },
  { id: 'moonturnReady', chapter: 'key', art: 'moon', open: (w) => layerStatus(w, LAYER.moonturn).ratio >= 0.6 || turns(w) > 0, clue: { kind: 'near', layer: LAYER.moonturn } },

  { id: 'afterMoonturn', chapter: 'remains', art: 'archive', open: (w) => turns(w) >= 1, clue: { kind: 'turns', layer: LAYER.moonturn, n: 1 } },
  { id: 'schmiede', chapter: 'remains', art: 'schmiede', open: (w) => ownedOf(w, 'schmiede') >= 1, clue: { kind: 'build', id: 'schmiede' } },
  { id: 'kartenstube', chapter: 'remains', art: 'kartenstube', open: (w) => ownedOf(w, 'kartenstube') >= 1, clue: { kind: 'build', id: 'kartenstube' } },
  { id: 'alchemistenturm', chapter: 'remains', art: 'alchemistenturm', open: (w) => ownedOf(w, 'alchemistenturm') >= 1, clue: { kind: 'build', id: 'alchemistenturm' } },
  { id: 'moonturn3', chapter: 'remains', art: 'moon', open: (w) => turns(w) >= 3, clue: { kind: 'turns', layer: LAYER.moonturn, n: 3 } },

  { id: 'greifenhorst', chapter: 'wakes', art: 'greifenhorst', open: (w) => ownedOf(w, 'greifenhorst') >= 1, clue: { kind: 'build', id: 'greifenhorst' } },
  { id: 'letterMoor', chapter: 'wakes', art: 'letter', voice: 'letter', open: (w) => ownedOf(w, 'greifenhorst') >= 10, clue: { kind: 'build', id: 'greifenhorst', level: 10 } },
  { id: 'runenhalle', chapter: 'wakes', art: 'runenhalle', open: (w) => ownedOf(w, 'runenhalle') >= 1, clue: { kind: 'build', id: 'runenhalle' } },
  { id: 'moonturn5', chapter: 'wakes', art: 'tower', open: (w) => turns(w) >= 5, clue: { kind: 'turns', layer: LAYER.moonturn, n: 5 } },
  { id: 'apprentice', chapter: 'wakes', art: 'apprentice', open: (w) => (w.get<HelperState>(MODULE.helper)?.rank ?? 0) >= 1, clue: { kind: 'helper' } },
  { id: 'sternwarte', chapter: 'wakes', art: 'sternwarte', open: (w) => ownedOf(w, 'sternwarte') >= 1, clue: { kind: 'build', id: 'sternwarte' } },
  { id: 'moonturn10', chapter: 'wakes', art: 'moon', open: (w) => turns(w) >= 10, clue: { kind: 'turns', layer: LAYER.moonturn, n: 10 } },
  { id: 'nightNear', chapter: 'wakes', art: 'stars', open: (w) => layerStatus(w, LAYER.longNight).ratio >= 0.5 || nights(w) > 0, clue: { kind: 'near', layer: LAYER.longNight } },

  { id: 'longNight', chapter: 'night', art: 'dawn', open: (w) => nights(w) >= 1, clue: { kind: 'turns', layer: LAYER.longNight, n: 1 } },
  { id: 'firstRealm', chapter: 'night', art: 'fires', open: (w) => openRealms(w) >= 1, clue: { kind: 'realms', n: 1 } },
  { id: 'letterRoad', chapter: 'night', art: 'letter', voice: 'letter', open: (w) => openRealms(w) >= 3, clue: { kind: 'realms', n: 3 } },
  { id: 'fiveRealms', chapter: 'night', art: 'fires', open: (w) => openRealms(w) >= 5, clue: { kind: 'realms', n: 5 } },
  { id: 'tenRealms', chapter: 'night', art: 'stars', open: (w) => openRealms(w) >= 10, clue: { kind: 'realms', n: 10 } },

  { id: 'agesNear', chapter: 'handover', art: 'apprentice', open: (w) => layerStatus(w, LAYER.ages).ratio >= 0.5 || ages(w) > 0, clue: { kind: 'near', layer: LAYER.ages } },
  { id: 'ages', chapter: 'handover', art: 'tower', open: (w) => ages(w) >= 1, clue: { kind: 'turns', layer: LAYER.ages, n: 1 } },
  { id: 'epilogue', chapter: 'handover', art: 'key', voice: 'you', open: (w) => ages(w) >= 2, clue: { kind: 'turns', layer: LAYER.ages, n: 2 } },

  // Kapitel 6 · Das erste Jahr: mit den Fernfahrten der Greife
  { id: 'voyageFirst', chapter: 'firstYear', art: 'letter', voice: 'letter', open: (w) => voyagesDone(w) >= 1, clue: { kind: 'voyages', n: 1 } },
  { id: 'voyageMaps', chapter: 'firstYear', art: 'archive', open: (w) => voyagesDone(w) >= 3, clue: { kind: 'voyages', n: 3 } },
  { id: 'voyageFenno', chapter: 'firstYear', art: 'apprentice', open: (w) => voyagesDone(w) >= 6, clue: { kind: 'voyages', n: 6 } },
  { id: 'voyageCoast', chapter: 'firstYear', art: 'letter', voice: 'letter', open: (w) => voyagesDone(w) >= 10, clue: { kind: 'voyages', n: 10 } },
  { id: 'voyageFires', chapter: 'firstYear', art: 'fires', open: (w) => voyagesDone(w) >= 15, clue: { kind: 'voyages', n: 15 } },
  { id: 'voyageYear', chapter: 'firstYear', art: 'dawn', voice: 'you', open: (w) => voyagesDone(w) >= 20, clue: { kind: 'voyages', n: 20 } },

  // Buch 2 · Der Weg der Feuer: mit den Hochlanden (high), den Stufen der Feuerstraße (road) und ihrer längsten Kette (chain).
  // Die Seiten-IDs tragen noch die ersten Schwellen im Namen (roadEight …); nach der Messung liegen sie tiefer (fuenf-jahre.md).
  { id: 'highFirst', chapter: 'upward', art: 'realm:hohesMoor', open: (w) => highlandsOpen(w) >= 1, clue: { kind: 'highlands', n: 1 } },
  { id: 'roadFirst', chapter: 'upward', art: 'fires', voice: 'you', open: (w) => roadLevels(w) >= 1, clue: { kind: 'road', n: 1 } },
  { id: 'highStair', chapter: 'upward', art: 'realm:steinerneTreppe', voice: 'letter', open: (w) => highlandsOpen(w) >= 2, clue: { kind: 'highlands', n: 2 } },
  { id: 'roadThree', chapter: 'upward', art: 'apprentice', voice: 'you', open: (w) => roadLevels(w) >= 2, clue: { kind: 'road', n: 2 } },
  { id: 'highSaddle', chapter: 'upward', art: 'realm:windsattel', open: (w) => highlandsOpen(w) >= 3, clue: { kind: 'highlands', n: 3 } },
  { id: 'chainThree', chapter: 'upward', art: 'fires', voice: 'you', open: (w) => roadChain(w) >= 3, clue: { kind: 'chain', n: 3 } },
  { id: 'highTarn', chapter: 'upward', art: 'realm:schwarzerSee', voice: 'letter', open: (w) => highlandsOpen(w) >= 4, clue: { kind: 'highlands', n: 4 } },
  { id: 'highJuniper', chapter: 'upward', art: 'realm:wacholderhang', open: (w) => highlandsOpen(w) >= 5, clue: { kind: 'highlands', n: 5 } },

  { id: 'highBridge', chapter: 'traces', art: 'realm:zerbrocheneBruecke', voice: 'letter', open: (w) => highlandsOpen(w) >= 6, clue: { kind: 'highlands', n: 6 } },
  { id: 'roadEight', chapter: 'traces', art: 'apprentice', voice: 'you', open: (w) => roadLevels(w) >= 5, clue: { kind: 'road', n: 5 } },
  { id: 'highGoat', chapter: 'traces', art: 'realm:ziegenpfad', open: (w) => highlandsOpen(w) >= 7, clue: { kind: 'highlands', n: 7 } },
  { id: 'highCircle', chapter: 'traces', art: 'realm:alterSteinkreis', open: (w) => highlandsOpen(w) >= 8, clue: { kind: 'highlands', n: 8 } },
  { id: 'roadTwelve', chapter: 'traces', art: 'fires', voice: 'you', open: (w) => roadLevels(w) >= 10, clue: { kind: 'road', n: 10 } },
  { id: 'highSprings', chapter: 'traces', art: 'realm:siebenQuellen', voice: 'letter', open: (w) => highlandsOpen(w) >= 9, clue: { kind: 'highlands', n: 9 } },
  { id: 'chainEight', chapter: 'traces', art: 'fires', voice: 'you', open: (w) => roadChain(w) >= 8, clue: { kind: 'chain', n: 8 } },
  { id: 'highEagle', chapter: 'traces', art: 'realm:adlerwand', open: (w) => highlandsOpen(w) >= 10, clue: { kind: 'highlands', n: 10 } },

  { id: 'highSlate', chapter: 'otherFires', art: 'realm:schieferbruch', open: (w) => highlandsOpen(w) >= 11, clue: { kind: 'highlands', n: 11 } },
  { id: 'roadSixteen', chapter: 'otherFires', art: 'apprentice', voice: 'you', open: (w) => roadLevels(w) >= 14, clue: { kind: 'road', n: 14 } },
  { id: 'highMist', chapter: 'otherFires', art: 'realm:nebelkessel', voice: 'letter', open: (w) => highlandsOpen(w) >= 12, clue: { kind: 'highlands', n: 12 } },
  { id: 'highPasture', chapter: 'otherFires', art: 'realm:letzteWeide', open: (w) => highlandsOpen(w) >= 13, clue: { kind: 'highlands', n: 13 } },
  { id: 'roadTwentyTwo', chapter: 'otherFires', art: 'fires', voice: 'you', open: (w) => roadLevels(w) >= 18, clue: { kind: 'road', n: 18 } },
  { id: 'highHeaps', chapter: 'otherFires', art: 'realm:roteHalde', open: (w) => highlandsOpen(w) >= 14, clue: { kind: 'highlands', n: 14 } },
  { id: 'chainThirteen', chapter: 'otherFires', art: 'stars', voice: 'you', open: (w) => roadChain(w) >= 13, clue: { kind: 'chain', n: 13 } },
  { id: 'highCloister', chapter: 'otherFires', art: 'realm:stillesKloster', voice: 'letter', open: (w) => highlandsOpen(w) >= 15, clue: { kind: 'highlands', n: 15 } },

  { id: 'highLarch', chapter: 'coldKiln', art: 'realm:laerchenwald', open: (w) => highlandsOpen(w) >= 16, clue: { kind: 'highlands', n: 16 } },
  { id: 'roadTwentyEight', chapter: 'coldKiln', art: 'apprentice', voice: 'you', open: (w) => roadLevels(w) >= 23, clue: { kind: 'road', n: 23 } },
  { id: 'highWatershed', chapter: 'coldKiln', art: 'realm:wasserscheide', voice: 'letter', open: (w) => highlandsOpen(w) >= 17, clue: { kind: 'highlands', n: 17 } },
  { id: 'highCave', chapter: 'coldKiln', art: 'realm:hoehlenstadt', open: (w) => highlandsOpen(w) >= 18, clue: { kind: 'highlands', n: 18 } },
  { id: 'highGorge', chapter: 'coldKiln', art: 'realm:donnerschlucht', open: (w) => highlandsOpen(w) >= 19, clue: { kind: 'highlands', n: 19 } },
  { id: 'roadThirtySix', chapter: 'coldKiln', art: 'fires', voice: 'you', open: (w) => roadLevels(w) >= 28, clue: { kind: 'road', n: 28 } },
  { id: 'chainEighteen', chapter: 'coldKiln', art: 'fires', voice: 'you', open: (w) => roadChain(w) >= 18, clue: { kind: 'chain', n: 18 } },
  { id: 'highFirn', chapter: 'coldKiln', art: 'realm:firnfeld', voice: 'letter', open: (w) => highlandsOpen(w) >= 20, clue: { kind: 'highlands', n: 20 } },

  { id: 'highFair', chapter: 'firstWatch', art: 'realm:hirtenmarkt', open: (w) => highlandsOpen(w) >= 21, clue: { kind: 'highlands', n: 21 } },
  { id: 'highPlateau', chapter: 'firstWatch', art: 'realm:sternplatte', open: (w) => highlandsOpen(w) >= 22, clue: { kind: 'highlands', n: 22 } },
  { id: 'roadFortyFive', chapter: 'firstWatch', art: 'apprentice', voice: 'you', open: (w) => roadLevels(w) >= 34, clue: { kind: 'road', n: 34 } },
  { id: 'highKiln', chapter: 'firstWatch', art: 'realm:kalterOfen', open: (w) => highlandsOpen(w) >= 23, clue: { kind: 'highlands', n: 23 } },
  { id: 'highBoundary', chapter: 'firstWatch', art: 'realm:grenzstein', voice: 'letter', open: (w) => highlandsOpen(w) >= 24, clue: { kind: 'highlands', n: 24 } },
  { id: 'chainTwentyFour', chapter: 'firstWatch', art: 'fires', voice: 'you', open: (w) => roadChain(w) >= 24, clue: { kind: 'chain', n: 24 } },
  { id: 'highFirstWatch', chapter: 'firstWatch', art: 'realm:ersteWarte', open: (w) => highlandsOpen(w) >= 25, clue: { kind: 'highlands', n: 25 } },
  { id: 'roadSixty', chapter: 'firstWatch', art: 'dawn', voice: 'you', open: (w) => roadLevels(w) >= 40, clue: { kind: 'road', n: 40 } },

  // Buch 3 · Die tiefe Zeit: mit den Fernen Küsten (coast), den Sternen der Himmelskarte (sky) und ihren vollständigen Sternbildern (con)
  { id: 'coastDescent', chapter: 'descent', art: 'realm:langerAbstieg', voice: 'letter', open: (w) => coastsOpen(w) >= 1, clue: { kind: 'coasts', n: 1 } },
  { id: 'skyFirst', chapter: 'descent', art: 'stars', voice: 'you', open: (w) => skyStars(w) >= 1, clue: { kind: 'sky', n: 1 } },
  { id: 'coastWood', chapter: 'descent', art: 'realm:tropfenderWald', voice: 'letterFenno', open: (w) => coastsOpen(w) >= 2, clue: { kind: 'coasts', n: 2 } },
  { id: 'coastSalt', chapter: 'descent', art: 'realm:salzterrassen', voice: 'letter', open: (w) => coastsOpen(w) >= 3, clue: { kind: 'coasts', n: 3 } },
  { id: 'conLadder', chapter: 'descent', art: 'stars', voice: 'you', open: (w) => skyDone(w) >= 1, clue: { kind: 'constellations', n: 1 } },
  { id: 'coastMill', chapter: 'descent', art: 'realm:gezeitenmuehle', voice: 'letterFenno', open: (w) => coastsOpen(w) >= 4, clue: { kind: 'coasts', n: 4 } },
  { id: 'skyEdge', chapter: 'descent', art: 'stars', voice: 'you', open: (w) => skyStars(w) >= 4, clue: { kind: 'sky', n: 4 } },
  { id: 'coastCliffs', chapter: 'descent', art: 'realm:weisseKlippen', voice: 'letter', open: (w) => coastsOpen(w) >= 5, clue: { kind: 'coasts', n: 5 } },

  { id: 'coastBoats', chapter: 'lights', art: 'realm:bootsfriedhof', voice: 'letterFenno', open: (w) => coastsOpen(w) >= 6, clue: { kind: 'coasts', n: 6 } },
  { id: 'coastPilot', chapter: 'lights', art: 'realm:lotsenturm', voice: 'letter', open: (w) => coastsOpen(w) >= 7, clue: { kind: 'coasts', n: 7 } },
  { id: 'skyOldChart', chapter: 'lights', art: 'archive', voice: 'you', open: (w) => skyStars(w) >= 8, clue: { kind: 'sky', n: 8 } },
  { id: 'coastSeagrass', chapter: 'lights', art: 'realm:seegraswiesen', voice: 'letterFenno', open: (w) => coastsOpen(w) >= 8, clue: { kind: 'coasts', n: 8 } },
  { id: 'conSecond', chapter: 'lights', art: 'key', voice: 'you', open: (w) => skyDone(w) >= 2, clue: { kind: 'constellations', n: 2 } },
  { id: 'coastBuoy', chapter: 'lights', art: 'realm:glockentonne', voice: 'letter', open: (w) => coastsOpen(w) >= 9, clue: { kind: 'coasts', n: 9 } },
  { id: 'coastNets', chapter: 'lights', art: 'realm:netzmacherdorf', voice: 'letterFenno', open: (w) => coastsOpen(w) >= 10, clue: { kind: 'coasts', n: 10 } },
  { id: 'skyTwoSkies', chapter: 'lights', art: 'stars', voice: 'you', open: (w) => skyStars(w) >= 13, clue: { kind: 'sky', n: 13 } },

  { id: 'coastHarbour', chapter: 'twoLists', art: 'realm:sturmhafen', voice: 'letter', open: (w) => coastsOpen(w) >= 11, clue: { kind: 'coasts', n: 11 } },
  { id: 'conThird', chapter: 'twoLists', art: 'stars', voice: 'you', open: (w) => skyDone(w) >= 3, clue: { kind: 'constellations', n: 3 } },
  { id: 'coastLightship', chapter: 'twoLists', art: 'realm:leuchtschiff', voice: 'letterFenno', open: (w) => coastsOpen(w) >= 12, clue: { kind: 'coasts', n: 12 } },
  { id: 'coastKiln', chapter: 'twoLists', art: 'realm:muschelkalkofen', voice: 'letter', open: (w) => coastsOpen(w) >= 13, clue: { kind: 'coasts', n: 13 } },
  { id: 'skyLow', chapter: 'twoLists', art: 'stars', voice: 'you', open: (w) => skyStars(w) >= 19, clue: { kind: 'sky', n: 19 } },
  { id: 'coastPath', chapter: 'twoLists', art: 'realm:wattenweg', voice: 'letterFenno', open: (w) => coastsOpen(w) >= 14, clue: { kind: 'coasts', n: 14 } },
  { id: 'coastBirds', chapter: 'twoLists', art: 'realm:vogelinsel', voice: 'letter', open: (w) => coastsOpen(w) >= 15, clue: { kind: 'coasts', n: 15 } },
  { id: 'conFifth', chapter: 'twoLists', art: 'stars', voice: 'you', open: (w) => skyDone(w) >= 5, clue: { kind: 'constellations', n: 5 } },

  { id: 'coastVillage', chapter: 'deepTime', art: 'realm:versunkenesDorf', voice: 'letter', open: (w) => coastsOpen(w) >= 16, clue: { kind: 'coasts', n: 16 } },
  { id: 'coastCharts', chapter: 'deepTime', art: 'realm:hausDerSeekarten', voice: 'letterFenno', open: (w) => coastsOpen(w) >= 17, clue: { kind: 'coasts', n: 17 } },
  { id: 'skyCount', chapter: 'deepTime', art: 'archive', voice: 'you', open: (w) => skyStars(w) >= 26, clue: { kind: 'sky', n: 26 } },
  { id: 'coastArch', chapter: 'deepTime', art: 'realm:walknochenbogen', voice: 'letter', open: (w) => coastsOpen(w) >= 18, clue: { kind: 'coasts', n: 18 } },
  { id: 'coastGlow', chapter: 'deepTime', art: 'realm:strandDerLichter', voice: 'letterFenno', open: (w) => coastsOpen(w) >= 19, clue: { kind: 'coasts', n: 19 } },
  { id: 'conSeventh', chapter: 'deepTime', art: 'stars', voice: 'you', open: (w) => skyDone(w) >= 7, clue: { kind: 'constellations', n: 7 } },
  { id: 'coastRose', chapter: 'deepTime', art: 'realm:kompassrose', voice: 'letter', open: (w) => coastsOpen(w) >= 20, clue: { kind: 'coasts', n: 20 } },
  { id: 'skyRing', chapter: 'deepTime', art: 'stars', voice: 'you', open: (w) => skyStars(w) >= 34, clue: { kind: 'sky', n: 34 } },

  { id: 'coastHorn', chapter: 'fourRays', art: 'realm:nebelhornfelsen', voice: 'letterFenno', open: (w) => coastsOpen(w) >= 21, clue: { kind: 'coasts', n: 21 } },
  { id: 'coastBottles', chapter: 'fourRays', art: 'realm:flaschenpostbucht', voice: 'letter', open: (w) => coastsOpen(w) >= 22, clue: { kind: 'coasts', n: 22 } },
  { id: 'conNinth', chapter: 'fourRays', art: 'stars', voice: 'you', open: (w) => skyDone(w) >= 9, clue: { kind: 'constellations', n: 9 } },
  { id: 'coastObservatory', chapter: 'fourRays', art: 'realm:alteSternwarte', voice: 'letter', open: (w) => coastsOpen(w) >= 23, clue: { kind: 'coasts', n: 23 } },
  { id: 'skyReturn', chapter: 'fourRays', art: 'stars', voice: 'you', open: (w) => skyStars(w) >= 43, clue: { kind: 'sky', n: 43 } },
  { id: 'coastCauseway', chapter: 'fourRays', art: 'realm:langerDamm', voice: 'letterFenno', open: (w) => coastsOpen(w) >= 24, clue: { kind: 'coasts', n: 24 } },
  { id: 'coastFourRays', chapter: 'fourRays', art: 'realm:warteDerVierStrahlen', voice: 'letter', open: (w) => coastsOpen(w) >= 25, clue: { kind: 'coasts', n: 25 } },
  { id: 'conAll', chapter: 'fourRays', art: 'dawn', voice: 'you', open: (w) => skyDone(w) >= 12, clue: { kind: 'constellations', n: 12 } },
]

function voyagesDone(w: WorldView): number {
  return w.get<VoyagesState | undefined>(VOYAGES_ID)?.done ?? 0
}

function openRealms(w: WorldView): number {
  return Object.values(w.get<RegionsState | undefined>(REGIONS_ID)?.regions ?? {}).filter((r) => r.open).length
}

function highlandsOpen(w: WorldView): number {
  const regions = w.get<RegionsState | undefined>(REGIONS_ID)?.regions ?? {}
  return HIGHLAND_IDS.filter((id) => regions[id]?.open).length
}

function roadLevels(w: WorldView): number {
  return linkLevels(w.get<LinksState | undefined>(LINKS_ID))
}

function roadChain(w: WorldView): number {
  return longestChain(FIRE_ROAD, w.get<LinksState | undefined>(LINKS_ID))
}

function coastsOpen(w: WorldView): number {
  const regions = w.get<RegionsState | undefined>(REGIONS_ID)?.regions ?? {}
  return COAST_IDS.filter((id) => regions[id]?.open).length
}

function skyStars(w: WorldView): number {
  return chartCells(w.get<ChartState | undefined>(CHART_ID))
}

function skyDone(w: WorldView): number {
  return chartCompleted(SKY_CHART, w.get<ChartState | undefined>(CHART_ID))
}
