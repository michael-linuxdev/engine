/**
 * Sammeln und Welt (P8): Bestiarium & Kräuterkunde, Alchemie, Talgäste,
 * Banner & Steine, Jahreskreis-Folio, Sternbilder, Omen, Großwerke.
 * Texte in i18n/*.ts (world.*), IDs in ids.lock.json.
 */
import {
  ownedOf, prestigeState, REGIONS_ID, type RegionsState,
  type AlbumConfig, type CardConfig, type ChoiceConfig, type CollectionConfig, type CollectionEntry, type CombineConfig, type DecorConfig,
  type FeatureDef, type ProjectDef, type VisitorConfig, type WorldView, type VoyagesConfig,
} from '@engine/core'
import { omenFor } from '../scene/weather'
import { CURRENCY, LAYER } from '../ids'

const pebbles = (amount: number) => ({ currency: CURRENCY.glowPebbles, amount })
const shards = (amount: number) => ({ currency: CURRENCY.runeShards, amount })
const glimmer = (amount: number) => ({ currency: CURRENCY.glimmer, amount })
const turns = (w: WorldView) => prestigeState(w).layers[0]?.count ?? 0

const HERBS = ['moonsage', 'lanternMoss', 'dewcup', 'starAnise', 'ashFern', 'brightRoot', 'hushLeaf', 'emberThyme'] as const
const STONES = ['dawnQuartz', 'riverAmber', 'cloudSlate', 'glowGarnet', 'frostOpal', 'mossAgate', 'runeFlint', 'duskJet'] as const
const CREATURES = ['tinyWyrm', 'lampMoth', 'pebbleToad', 'mistHeron', 'stoneBeetle', 'sparkFinch', 'nightSnail', 'thistleMouse'] as const
const FEST = ['hoarfrostBloom', 'snowdropBell', 'buddingRibbon', 'buddingSeed', 'blossomCrown', 'midsummerFlame', 'midsummerHoney', 'fireflyJar', 'lanternGourd', 'lanternApple', 'mistLantern', 'longLightCandle', 'longLightStar'] as const
const BREWS = ['glowTea', 'quietTonic', 'brightInk', 'warmSalve', 'starSyrup', 'dewElixir', 'stoneBalm', 'emberDrops', 'mossLamp', 'dawnPowder', 'frostCordial', 'runeDust'] as const

const rarity = (i: number): 0 | 1 | 2 => (i < 5 ? 0 : i < 7 ? 1 : 2)

export const COLLECTION: CollectionConfig = {
  entries: [
    ...HERBS.map((id, i): CollectionEntry => ({ id, category: 'herbal', rarity: rarity(i), source: 'buy' })),
    ...STONES.map((id, i): CollectionEntry => ({ id, category: 'minerals', rarity: rarity(i), source: 'buy' })),
    ...CREATURES.map((id, i): CollectionEntry => ({ id, category: 'bestiary', rarity: rarity(i), source: 'buy' })),
    ...FEST.map((id): CollectionEntry => ({ id, category: 'festival', rarity: 1, source: 'event' })),
    ...BREWS.map((id): CollectionEntry => ({ id, category: 'brews', rarity: 1, source: 'event' })),
  ],
  chance: [1 / 400, 1 / 2000, 1 / 8000],
  bonus: [0.005, 0.015, 0.03],
  setBonus: 0.02,
  layer: LAYER.moonturn,
}

/** Fest-Sorte(n) je Lichterfest (große Feste: zwei). Werden im Fest-Laden angeboten. */
export const FEST_VARIETIES: Record<string, readonly string[]> = {
  hoarfrost: ['hoarfrostBloom'],
  snowdrop: ['snowdropBell'],
  budding: ['buddingRibbon', 'buddingSeed'],
  blossomRound: ['blossomCrown'],
  midsummerGlow: ['midsummerFlame', 'midsummerHoney'],
  fireflyNights: ['fireflyJar'],
  lanternMoon: ['lanternGourd', 'lanternApple'],
  mistMoon: ['mistLantern'],
  longLight: ['longLightCandle', 'longLightStar'],
}

const PAIRS: [string, string][] = [
  ['moonsage', 'dewcup'],
  ['hushLeaf', 'cloudSlate'],
  ['lanternMoss', 'runeFlint'],
  ['emberThyme', 'glowGarnet'],
  ['starAnise', 'riverAmber'],
  ['dewcup', 'frostOpal'],
  ['brightRoot', 'mossAgate'],
  ['emberThyme', 'ashFern'],
  ['lanternMoss', 'mossAgate'],
  ['dawnQuartz', 'brightRoot'],
  ['frostOpal', 'hushLeaf'],
  ['runeFlint', 'duskJet'],
]

export const ALCHEMY: CombineConfig = {
  recipes: BREWS.map((result, i) => ({ id: result, a: PAIRS[i][0], b: PAIRS[i][1], result, durationMs: 4 * 3600_000 })),
  fizzle: [pebbles(5)],
  skipCost: pebbles(15),
}

function hourOf(w: WorldView): number {
  // Spielcode darf die echte Uhrzeit lesen (nur Anzeige-/Gast-Bedingung)
  return new Date(w.core.lastSeen).getHours()
}
const isNight = (w: WorldView) => hourOf(w) >= 21 || hourOf(w) < 5
const month = (w: WorldView) => new Date(w.core.lastSeen).getMonth() + 1

const HOUR = 3_600_000

/**
 * Fernfahrten der Greife (Fünf-Jahres-Plan, Jahr 1): eine Fahrt zur Zeit, Stunden echter Zeit.
 * Weitere Fahrten öffnen sich mit der Zahl der abgeschlossenen. Alle lassen sich wiederholen.
 */
export const VOYAGES: VoyagesConfig = {
  list: [
    { id: 'moorPost', durationMs: 2 * HOUR, fromDone: 0, grant: [pebbles(5)], seconds: 600 },
    { id: 'passLetters', durationMs: 4 * HOUR, fromDone: 1, grant: [pebbles(8)], seconds: 1200 },
    { id: 'coastNews', durationMs: 8 * HOUR, fromDone: 3, grant: [pebbles(12), shards(3)] },
    { id: 'oldMap', durationMs: 12 * HOUR, fromDone: 6, grant: [pebbles(20)], seconds: 3600 },
    { id: 'farFires', durationMs: 16 * HOUR, fromDone: 10, grant: [pebbles(30), shards(6)] },
    { id: 'skyRoute', durationMs: 24 * HOUR, fromDone: 15, grant: [pebbles(45)], seconds: 7200 },
  ],
}

export const GUESTS: VisitorConfig = {
  list: [
    { id: 'griffin', when: (w) => ownedOf(w, 'greifenhorst') >= 1 },
    { id: 'kobold', when: (w) => ownedOf(w, 'schmiede') >= 1 },
    { id: 'wisp', when: (w) => isNight(w) && ownedOf(w, 'quellschrein') >= 1 },
    { id: 'fox', when: (w) => ownedOf(w, 'holzlager') >= 10 },
    { id: 'hedgehog', when: (w) => ownedOf(w, 'kraeuterkate') >= 25 },
    { id: 'owl', when: (w) => isNight(w) },
    { id: 'deer', when: (w) => ownedOf(w, 'quellschrein') >= 5 },
    { id: 'otter', when: (w) => ownedOf(w, 'quellschrein') >= 25 },
    { id: 'bat', when: (w) => isNight(w) && ownedOf(w, 'runenhalle') >= 1 },
    { id: 'ibex', when: (w) => ownedOf(w, 'steinbruch') >= 25 },
    { id: 'glowBeetle', when: (w) => month(w) >= 6 && month(w) <= 8 },
    { id: 'snowHare', when: (w) => month(w) === 12 || month(w) <= 2 },
  ],
  stayMs: 60_000,
  gapMs: [3 * 60_000, 7 * 60_000],
  firstGift: [pebbles(10)],
  againSeconds: 60,
  bonusPerSpecies: 0.01,
  unseenWeight: 3,
}

export const DECOR: DecorConfig = {
  slots: 8,
  items: [
    { id: 'blueBanner', cost: pebbles(10), bonus: 0.005 },
    { id: 'violetBanner', cost: pebbles(10), bonus: 0.005 },
    { id: 'emberBanner', cost: pebbles(15), bonus: 0.007 },
    { id: 'standingStone', cost: pebbles(20), bonus: 0.008 },
    { id: 'runeStone', cost: pebbles(30), bonus: 0.01 },
    { id: 'lanternPost', cost: pebbles(25), bonus: 0.009 },
    { id: 'mossCairn', cost: pebbles(20), bonus: 0.008 },
    { id: 'wishWell', cost: pebbles(45), bonus: 0.012 },
    { id: 'starPole', cost: pebbles(50), bonus: 0.013 },
    { id: 'griffinStatue', cost: pebbles(60), bonus: 0.015 },
    // exklusiv: Jahreskreis-Folio (4) und Großwerke (2)
    { id: 'springArch', cost: null, bonus: 0.02 },
    { id: 'summerSail', cost: null, bonus: 0.02 },
    { id: 'autumnLantern', cost: null, bonus: 0.02 },
    { id: 'winterStar', cost: null, bonus: 0.02 },
    { id: 'bridgeBanner', cost: null, bonus: 0.03 },
    { id: 'beaconBrazier', cost: null, bonus: 0.03 },
  ],
}

export const FOLIO: AlbumConfig = {
  goals: [
    { id: 'build200', event: 'producer.bought', amountKey: 'count', target: 200 },
    { id: 'sparks15', event: 'burst.used', target: 15 },
    { id: 'rounds5', event: 'daily.claimed', target: 5 },
    { id: 'errands6', event: 'quest.claimed', target: 6 },
    { id: 'moonturns3', event: 'prestige.performed', where: { layer: LAYER.moonturn }, target: 3 },
    { id: 'guests5', event: 'visitor.greeted', target: 5 },
    { id: 'finds3', event: 'collection.new', target: 3 },
    { id: 'brews2', event: 'combine.done', target: 2 },
    { id: 'archive10', event: 'meta.bought', target: 10 },
    { id: 'deed1', event: 'achievement.done', target: 1 },
    { id: 'festShop3', event: 'fest.bought', target: 3 },
    { id: 'works1', event: 'project.stage', target: 1 },
  ],
  stampReward: [pebbles(3)],
  rewardAt: 10,
  seasonReward: (season) => ({ type: 'decor.granted', id: { spring: 'springArch', summer: 'summerSail', autumn: 'autumnLantern', winter: 'winterStar' }[season] }),
}

const BUILD_CARDS = ['kraeuterkate', 'holzlager', 'steinbruch', 'quellschrein', 'schmiede', 'kartenstube', 'alchemistenturm', 'greifenhorst', 'runenhalle'] as const
const CARD_IDS = ['herbStar', 'woodStar', 'stoneStar', 'springStar', 'forgeStar', 'mapStar', 'flaskStar', 'griffinStar', 'runeStar'] as const

export const CONSTELLATIONS: CardConfig = {
  layer: LAYER.moonturn,
  fromRuns: 3,
  offer: 3,
  cards: [
    ...BUILD_CARDS.map((p, i) => ({
      id: CARD_IDS[i],
      effects: [
        { target: `rate:${p}`, op: 'mul' as const, value: i < 3 ? 2 : 1.8 },
        { target: `rate:${BUILD_CARDS[(i + 4) % BUILD_CARDS.length]}`, op: 'mul' as const, value: 0.8 },
      ],
    })),
    { id: 'quietSky', effects: [{ target: 'income', op: 'mul', value: 0.8 }, { target: 'offline.softHours', op: 'add', value: 6 }] },
    { id: 'busySky', effects: [{ target: 'income', op: 'mul', value: 1.1 }, { target: 'offline.softHours', op: 'mul', value: 0.6 }] },
    { id: 'kindSky', effects: [{ target: 'income', op: 'mul', value: 1.05 }] },
  ],
}

export const OMENS: ChoiceConfig = {
  daily: 0.6,
  fromHour: 8,
  // Das Wetter des Tages entscheidet (scene/weather.ts); daily gilt nur ohne pick.
  pick: omenFor,
  list: [
    { id: 'stormNight', safe: { cost: pebbles(5), buff: { target: 'income', mult: 1.1, durationMs: 4 * 3600_000 } }, risk: { win: { target: 'income', mult: 1.2, durationMs: 2 * 3600_000 }, lose: { target: 'income', mult: 0.75, durationMs: 2 * 3600_000 }, chance: 0.5 } },
    { id: 'drySummer', safe: { cost: pebbles(5), buff: { target: 'income', mult: 1.1, durationMs: 4 * 3600_000 } }, risk: { win: { target: 'income', mult: 1.2, durationMs: 2 * 3600_000 }, lose: { target: 'income', mult: 0.7, durationMs: 2 * 3600_000 }, chance: 0.5 } },
    { id: 'earlyFrost', safe: { cost: pebbles(5), buff: { target: 'burst.seconds', mult: 1.5, durationMs: 4 * 3600_000 } }, risk: { win: { target: 'burst.seconds', mult: 2, durationMs: 4 * 3600_000 }, lose: { target: 'burst.seconds', mult: 0.5, durationMs: 2 * 3600_000 }, chance: 0.5 } },
  ],
}

const stages = (base: number, decor?: string) => [
  { cost: [glimmer(base), shards(20)], reward: [pebbles(20)] },
  { cost: [glimmer(base * 100), shards(60)], reward: [pebbles(40)] },
  { cost: [glimmer(base * 10_000), shards(150)], reward: [pebbles(80)], ...(decor ? { event: { type: 'decor.granted', id: decor } } : {}) },
]

export const GREAT_WORKS: ProjectDef[] = [
  { id: 'riverBridge', stages: stages(1e9, 'bridgeBanner'), bonusPerStage: 0.02 },
  { id: 'beaconChain', stages: stages(3e9, 'beaconBrazier'), bonusPerStage: 0.02 },
  { id: 'valleyMill', stages: stages(1e10), bonusPerStage: 0.02 },
  { id: 'starRoad', stages: stages(3e10), bonusPerStage: 0.02 },
  { id: 'wardensLibrary', stages: stages(1e11), bonusPerStage: 0.02 },
  { id: 'skyGarden', stages: stages(3e11), bonusPerStage: 0.02 },
]

export const WORLD_FEATURES: FeatureDef[] = [
  // Gestaffelt (Lückenliste 1.2): Sammlung nach der 1. Mondwende, dann je Mondwende höchstens zwei neue Systeme
  { id: 'herbal', when: (w) => turns(w) >= 1 },
  { id: 'guests', when: (w) => turns(w) >= 2 },
  { id: 'decor', when: (w) => turns(w) >= 3 },
  { id: 'folio', when: (w) => turns(w) >= 4 },
  { id: 'alchemy', when: (w) => turns(w) >= 5 },
  { id: 'constellations', when: (w) => turns(w) >= 6 },
  { id: 'omens', when: (w) => turns(w) >= 4 },
  { id: 'greatWorks', when: (w) => turns(w) >= 7 },
  // Fernfahrten: sobald die Greife Briefe tragen (wie die Chronik-Seite „Ein Brief aus dem Moor“)
  { id: 'voyages', when: (w) => ownedOf(w, 'greifenhorst') >= 10 },
  { id: 'realms', when: (w) => Object.values(w.get<RegionsState | undefined>(REGIONS_ID)?.regions ?? {}).some((r) => r.open) },
]
