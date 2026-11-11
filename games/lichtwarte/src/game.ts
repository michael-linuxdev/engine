/**
 * Spieldefinition (Daten statt Code).
 * Zahlen der Erzeuger-Leiter und des Archivs folgen dem gestimmten Referenz-Spiel
 * (docs/referenz/paritaet.md); P6 stimmt sie mit dem Simulator nach.
 * Inhalts-IDs sind stabil und stehen in ids.lock.json — nie ändern, nur anhängen.
 */
import {
  achievementsModule, calendarFestsModule, challengesModule, choiceEventsModule, collectionsModule, combineModule, dailyModule, regionsModule, marketModule, decorModule, layerCardsModule, projectsModule, seasonAlbumModule, visitorsModule, defaultBalance, featureUnlocksModule, flashModule, questsModule, standardModules, linksModule, voyagesModule, weeklyPlanModule,
  weekendModule, wheelModule, type GameDefinition, type GateAtom, type MetaItemDef, type ProducerDef,
} from '@engine/core'
import { BRAND } from './brand'
import { DAILY, DEEDS, FEATURES, FESTIVALS, MARKET_NIGHT, QUESTS, STAR_WHEEL, STAR_WINDOW, TRIALS, WEEKLY } from './content/live'
import { MARKET } from './content/market'
import { REALMS } from './content/realms'

export { REALMS }
import { FIRE_ROAD } from './content/fireRoad'
import { ALCHEMY, COLLECTION, CONSTELLATIONS, DECOR, FOLIO, GREAT_WORKS, GUESTS, OMENS, WORLD_FEATURES, VOYAGES } from './content/world'

export const PRODUCER_IDS = [
  'kraeuterkate',
  'holzlager',
  'steinbruch',
  'quellschrein',
  'schmiede',
  'kartenstube',
  'alchemistenturm',
  'greifenhorst',
  'runenhalle',
  'sternwarte',
] as const
export type ProducerId = (typeof PRODUCER_IDS)[number]

export { CURRENCY, LAYER } from './ids'
import { CURRENCY, LAYER } from './ids'

/** Leiter: [Kosten C0, Wachstum g, Ertrag r0, Laufertrag-Tor, Mondwenden-Tor, Wächterrang-Tor, Stufe des Vorgängers] */
const LADDER: [number, number, number, number, number, number, number][] = [
  [20, 1.18, 1, 0, 0, 0, 0],
  [150, 1.17, 4, 4000, 0, 0, 25],
  [1_800, 1.16, 25, 90_000, 0, 0, 25],
  [25_000, 1.15, 150, 500_000, 0, 6, 10],
  [200_000, 1.14, 900, 4_000_000, 1, 9, 10],
  [1_500_000, 1.13, 5_000, 25_000_000, 2, 12, 10],
  [12_000_000, 1.12, 30_000, 150_000_000, 3, 16, 10],
  [90_000_000, 1.115, 180_000, 1_000_000_000, 5, 20, 10],
  [700_000_000, 1.11, 1_100_000, 8_000_000_000, 8, 25, 10],
  [5_000_000_000, 1.105, 7_000_000, 50_000_000_000, 12, 30, 10],
]

export const producers: ProducerDef[] = PRODUCER_IDS.map((id, i) => {
  const [baseCost, costScale, baseRate, run, turns, rank, prevLevel] = LADDER[i]
  if (i === 0) return { id, baseCost, costScale, baseRate }
  const any: GateAtom[] = [
    { kind: 'primaryRun', amount: run },
    { kind: 'producer', id: PRODUCER_IDS[i - 1], level: prevLevel },
  ]
  if (rank) any.push({ kind: 'level', level: rank })
  return {
    id,
    baseCost,
    costScale,
    baseRate,
    unlock: { all: turns ? [{ kind: 'prestige', layer: LAYER.moonturn, count: turns }, { kind: 'producer', id: PRODUCER_IDS[i - 1], level: 1 }] : [{ kind: 'producer', id: PRODUCER_IDS[i - 1], level: 1 }], any },
  }
})

const shards = CURRENCY.runeShards
/** Archiv der Wächter: 10 Gegenstände, 163 Ränge, 3 Zweige (wie der Meta-Laden der Referenz). */
export const archive: MetaItemDef[] = [
  { id: 'oldLantern', currency: shards, branch: 'glow', maxRank: 40, cost: { base: 25, growth: 1.3 }, effects: [{ target: 'rate:*', kind: 'mulLinear', perRank: 0.05 }], unlock: { tip: 'immediate', offset: 0 } },
  { id: 'builderChalk', currency: shards, branch: 'glow', maxRank: 20, cost: { base: 18, growth: 1.28 }, effects: [{ target: 'cost:*', kind: 'mulCompound', perRank: 0.98 }], unlock: { tip: 'immediate', offset: 5_000 } },
  { id: 'wardenCloak', currency: shards, branch: 'glow', maxRank: 25, cost: { base: 36, growth: 1.32 }, effects: [{ target: 'rate:*', kind: 'mulLinear', perRank: 0.02 }], unlock: { tip: 'wave2', offset: 20_000 } },
  { id: 'starChart', currency: shards, branch: 'glow', maxRank: 20, cost: { base: 60, growth: 1.34 }, effects: [{ target: 'rate:*', kind: 'mulLinear', perRank: 0.015 }], unlock: { linear: { base: 48_000, step: 32_000 } } },
  {
    id: 'hourglass',
    currency: shards,
    branch: 'watch',
    maxRank: 8,
    cost: { base: 30, growth: 1.4 },
    effects: [
      { target: 'offline.softHours', kind: 'add', perRank: 1 },
      { target: 'offline.hardHours', kind: 'add', perRank: 2 },
    ],
    unlock: { tip: 'immediate', offset: 8_000 },
  },
  { id: 'sparkBell', currency: shards, branch: 'watch', maxRank: 12, cost: { base: 20, growth: 1.32 }, effects: [{ target: 'burst.seconds', kind: 'add', perRank: 15 }], unlock: { tip: 'wave2', offset: 14_000 } },
  {
    id: 'nightCandle',
    currency: shards,
    branch: 'watch',
    maxRank: 15,
    cost: { base: 34, growth: 1.34 },
    effects: [
      { target: 'offline.softHours', kind: 'add', perRank: 0.5 },
      { target: 'offline.hardHours', kind: 'add', perRank: 1 },
    ],
    unlock: { offset: 24_000 },
  },
  { id: 'stackedWood', currency: shards, branch: 'setout', maxRank: 1, cost: { base: 60, growth: 1 }, effects: [{ target: 'start.producer:holzlager', kind: 'add', perRank: 1 }], unlock: { tip: 'free' } },
  { id: 'travelPurse', currency: shards, branch: 'setout', maxRank: 12, cost: { base: 20, growth: 1.36 }, effects: [{ target: 'start.primary', kind: 'add', perRank: 80 }], unlock: { tip: 'immediate', offset: 3_000 } },
  { id: 'foundationStone', currency: shards, branch: 'setout', maxRank: 10, cost: { base: 45, growth: 1.38 }, effects: [{ target: 'start.producer:kraeuterkate', kind: 'add', perRank: 1 }], unlock: { offset: 22_000, producersOnline: 1 } },
  // Laden der Langen Nacht (Nachttau): 4 Gegenstände, 41 Ränge (wie die Referenz)
  { id: 'deepFoundations', currency: CURRENCY.nightDew, branch: 'night', maxRank: 20, cost: { base: 3, growth: 1.25 }, effects: [{ target: 'rate:*', kind: 'mulLinear', perRank: 0.1 }], unlock: { tip: 'free' } },
  {
    id: 'weatherShutters',
    currency: CURRENCY.nightDew,
    branch: 'night',
    maxRank: 8,
    cost: { base: 4, growth: 1.4 },
    effects: [
      { target: 'offline.softHours', kind: 'add', perRank: 1 },
      { target: 'offline.hardHours', kind: 'add', perRank: 2 },
    ],
    unlock: { tip: 'free' },
  },
  { id: 'larder', currency: CURRENCY.nightDew, branch: 'night', maxRank: 10, cost: { base: 5, growth: 1.3 }, effects: [{ target: `prestige.payout:${LAYER.moonturn}`, kind: 'mulLinear', perRank: 0.1 }], unlock: { tip: 'free' } },
  { id: 'wardenLore', currency: CURRENCY.nightDew, branch: 'night', maxRank: 3, cost: { base: 12, growth: 2 }, effects: [{ target: 'cost:*', kind: 'mulCompound', perRank: 0.9 }], unlock: { tip: 'free' } },
  // Laden des Zeitalters (Ahnenlicht): 5 Gegenstände ohne echten Deckel (wie die Referenz)
  { id: 'lineage', currency: CURRENCY.forebearLight, branch: 'ages', maxRank: 99, cost: { base: 1, growth: 1.15 }, effects: [{ target: 'rate:*', kind: 'mulLinear', perRank: 0.15 }], unlock: { tip: 'free' } },
  { id: 'starLore', currency: CURRENCY.forebearLight, branch: 'ages', maxRank: 99, cost: { base: 1, growth: 1.15 }, effects: [{ target: 'rate:sternwarte', kind: 'mulLinear', perRank: 0.25 }], unlock: { tip: 'free' } },
  { id: 'nightRoots', currency: CURRENCY.forebearLight, branch: 'ages', maxRank: 99, cost: { base: 2, growth: 1.2 }, effects: [{ target: `prestige.payout:${LAYER.longNight}`, kind: 'mulLinear', perRank: 0.1 }], unlock: { tip: 'free' } },
  { id: 'hearthRecipe', currency: CURRENCY.forebearLight, branch: 'ages', maxRank: 99, cost: { base: 1, growth: 1.2 }, effects: [{ target: 'burst.seconds', kind: 'mulLinear', perRank: 0.1 }], unlock: { tip: 'free' } },
  { id: 'deftHand', currency: CURRENCY.forebearLight, branch: 'ages', maxRank: 99, cost: { base: 2, growth: 1.25 }, effects: [{ target: 'cost:*', kind: 'mulCompound', perRank: 0.97 }], unlock: { tip: 'free' } },
]

const balance = defaultBalance(LAYER.moonturn)
// Rückkehr-Brief: nach mindestens 48 Stunden Abwesenheit ein Geschenk
// Funde am Wegrand so OFT wie in der Referenz: jede fünfte Stufe ein sicherer Fund, dazu 7 % Glücksfund je Ausbau,
// höchstens einer je 5 s. Die BETRÄGE sind kleiner als dort (8 s bzw. 20 bis 45 s Ertrag statt 45 s bzw. 90 bis 210 s):
// Mit den Beträgen der Referenz lief das gemessene Tempo davon (alle Bauwerke an Tag 2,6 statt Tag 5, zweite Mondwende
// nach 57 statt 81 Minuten). Deckel: 12 % des Ertrags dieses Laufs plus einer Minute.
balance.surprises = { chance: 0.07, seconds: 20, secondsMax: 45, minIntervalMs: 5000, every: { count: 5, seconds: 8 }, floorSeconds: 3, capShare: 0.12 }
balance.offline = { ...balance.offline, comebackMs: 48 * 3600_000, comebackGrant: [{ currency: CURRENCY.glowPebbles, amount: 20 }] }
balance.helper = {
  ranks: [
    { cost: { currency: CURRENCY.glowPebbles, amount: 30 }, intervalMs: 20_000 },
    { cost: { currency: CURRENCY.glowPebbles, amount: 60 }, intervalMs: 10_000 },
    { cost: { currency: CURRENCY.glowPebbles, amount: 120 }, intervalMs: 5_000 },
  ],
}

export const game: GameDefinition = {
  id: BRAND.slug,
  saveKey: `${BRAND.slug}-save-v1`,
  contentVersion: 1,
  contentMigrations: {},
  currencies: [
    { id: CURRENCY.glimmer, role: 'primary' },
    { id: CURRENCY.runeShards, role: 'meta' },
    { id: CURRENCY.glowPebbles, role: 'premium' },
    { id: CURRENCY.nightDew, role: 'layer', resetOn: [LAYER.ages] },
    { id: CURRENCY.forebearLight, role: 'layer' },
  ],
  producers,
  prestigeLayers: [
    {
      id: LAYER.moonturn,
      currency: CURRENCY.runeShards,
      gate: { base: 10_000_000, growth: 3.2, knee: 13, lateGrowth: 1.12 },
      probe: { gate: 1_000_000, payout: 70 },
      payout: { base: 100, growth: 1.12 },
      minimum: { producersOnline: 3, producersFromCount: 1 },
      // Meilensteine erst weit nach Tag 90 (regular: rund 730 Mondwenden an Tag 90): Die gemessene Taktung bleibt unberührt.
      milestones: [1000, 2500, 5000, 10_000, 25_000].map((at, i) => ({ at, reward: [{ currency: CURRENCY.glowPebbles, amount: 30 + i * 15 }], bonus: 0.01 })),
    },
    {
      id: LAYER.longNight,
      currency: CURRENCY.nightDew,
      gate: { base: 6e14, growth: 6, knee: 8, lateGrowth: 1.5 },
      payout: { base: 5, growth: 1.08 },
      // Nach jeder Langen Nacht drei Tage Ruhe (wie die Referenz)
      minimum: { lowerRuns: 12, restMs: 3 * 86_400_000 },
      // Ab der 15. Langen Nacht (regular: 13 an Tag 90)
      milestones: [15, 20, 30, 40, 50, 75, 100, 150].map((at, i) => ({ at, reward: [{ currency: CURRENCY.glowPebbles, amount: 30 + i * 10 }], bonus: 0.01 })),
    },
    {
      id: LAYER.ages,
      currency: CURRENCY.forebearLight,
      // Wachstum 3 (vorher 10): das zweite Zeitalter kommt bei regular um Tag 47 statt Tag 71 (späte Taktung, balance.md)
      // Ab dem vierten Zeitalter wächst die Schwelle flach (Knie 3, danach 1,35): Über fünf Jahre gemessen lagen sonst
      // erst Monate, dann über ein Jahr zwischen zwei Zeitaltern (fuenf-jahre.md). Die ersten vier bleiben, wo sie waren.
      gate: { base: 5e16, growth: 3, knee: 3, lateGrowth: 1.35 },
      payout: { base: 3, growth: 1.1 },
      minimum: { lowerRuns: 3 },
      // Jedes Zeitalter bis zum zwölften ist ein Meilenstein, danach in größeren Schritten: ein Ziel ohne nahes Ende.
      milestones: [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30, 40, 50].map((at, i) => ({ at, reward: [{ currency: CURRENCY.glowPebbles, amount: 25 + i * 5 }], bonus: 0.02 })),
    },
  ],
  metaShop: archive,
  levelRewards: [
    { level: 2, grant: [{ currency: CURRENCY.glimmer, amount: 40 }] },
    { level: 3, grant: [{ currency: CURRENCY.glowPebbles, amount: 10 }] },
    { level: 5, grant: [{ currency: CURRENCY.runeShards, amount: 1 }] },
    { level: 7, grant: [{ currency: CURRENCY.glimmer, amount: 250 }] },
    { level: 10, grant: [{ currency: CURRENCY.glowPebbles, amount: 20 }] },
    { level: 15, grant: [{ currency: CURRENCY.glowPebbles, amount: 25 }] },
    { level: 20, grant: [{ currency: CURRENCY.glowPebbles, amount: 40 }] },
  ],
  modules: [
    ...standardModules(),
    // P7 Bindung (Inhalte: content/live.ts; Import erst hier, um Zirkel zu vermeiden)
    ...liveModules(),
  ],
  balance,
  startPrimary: 25,
  seed: 0x1c47a2e1,
}

function liveModules() {
  return [
    dailyModule(DAILY),
    questsModule(QUESTS),
    achievementsModule(DEEDS),
    challengesModule(TRIALS),
    weekendModule(MARKET_NIGHT),
    flashModule(STAR_WINDOW),
    calendarFestsModule(FESTIVALS),
    wheelModule(STAR_WHEEL),
    weeklyPlanModule(WEEKLY),
    featureUnlocksModule([...FEATURES, ...WORLD_FEATURES]),
    // P8 Sammeln und Welt
    collectionsModule(COLLECTION),
    combineModule(ALCHEMY),
    visitorsModule(GUESTS),
    decorModule(DECOR),
    seasonAlbumModule(FOLIO),
    layerCardsModule(CONSTELLATIONS),
    choiceEventsModule(OMENS),
    projectsModule(GREAT_WORKS),
    voyagesModule(VOYAGES),
    linksModule(FIRE_ROAD),
    // P9 Lande
    regionsModule(REALMS),
    marketModule(MARKET),
  ]
}

/** Weitere gespeicherte Inhalts-IDs (für ids.lock.json). */
export const extraIds = {
  quests: QUESTS.templates.map((q) => q.id),
  deeds: DEEDS.map((d) => d.id),
  trials: TRIALS.list.map((c) => c.id),
  fests: FESTIVALS.fests.map((f) => f.id),
  festItems: Object.values(FESTIVALS.shop).flatMap((items) => items.map((i) => i.id)),
  wheel: STAR_WHEEL.segments.map((s) => s.id),
  features: [...FEATURES, ...WORLD_FEATURES].map((f) => f.id),
  collection: COLLECTION.entries.map((e) => e.id),
  recipes: ALCHEMY.recipes.map((r) => r.id),
  guests: GUESTS.list.map((v) => v.id),
  decor: DECOR.items.map((d) => d.id),
  folio: FOLIO.goals.map((g) => g.id),
  constellations: CONSTELLATIONS.cards.map((c) => c.id),
  omens: OMENS.list.map((o) => o.id),
  greatWorks: GREAT_WORKS.map((p) => p.id),
  realms: REALMS.regions.map((r) => r.id),
  realmAreas: REALMS.regions.flatMap((r) => r.areas.map((a) => a.id)),
  cosmetics: MARKET.cosmetics.map((c) => c.id),
  offers: MARKET.offers.map((o) => o.id),
  skips: MARKET.skips.map((k) => k.id),
  adChoices: MARKET.ad.choices.map((c) => c.id),
}

/** Zielkorridore für den Simulator (CHECK=1), begründet in docs/spiele/lichtwarte/balance.md. */
export const balanceTargets = {
  engaged: [
    { label: 'Holzlager nach 3–5 min', kind: 'unlock', id: 'holzlager', clock: 'active', min: 3, max: 5 },
    { label: 'Steinbruch nach 8–15 min', kind: 'unlock', id: 'steinbruch', clock: 'active', min: 8, max: 15 },
    { label: 'Erste Mondwende nach 15–20 min', kind: 'prestige', id: LAYER.moonturn, nth: 1, clock: 'active', min: 15, max: 20 },
    { label: 'Zweite Mondwende frühestens 20 min später', kind: 'prestige', id: LAYER.moonturn, nth: 2, clock: 'active', min: 40, max: 200 },
  ],
  // „Tag N“ beginnt bei Minute (N − 1) · 1440
  regular: [
    { label: 'Alle 10 Bauwerke um Tag 5 ± 1', kind: 'unlock', id: 'sternwarte', clock: 'wall', min: (4 - 1) * 1440, max: (6 - 1) * 1440 },
    { label: 'Lange Nacht um Tag 9 ± 2', kind: 'prestige', id: LAYER.longNight, nth: 1, clock: 'wall', min: (7 - 1) * 1440, max: (11 - 1) * 1440 },
  ],
  /** Langer Lauf (35 Tage): erstes Zeitalter nach drei bis fünf Wochen. */
  regularLong: [{ label: 'Erstes Zeitalter um Tag 28 ± 7', kind: 'prestige', id: LAYER.ages, nth: 1, clock: 'wall', min: (21 - 1) * 1440, max: (35 - 1) * 1440 }],
  /** Späte Taktung (90 Tage): zweites Zeitalter deutlich vor Tag 60, drittes vor Tag 90. */
  regularLate: [
    { label: 'Zweites Zeitalter um Tag 47 ± 8', kind: 'prestige', id: LAYER.ages, nth: 2, clock: 'wall', min: (39 - 1) * 1440, max: (55 - 1) * 1440 },
    { label: 'Drittes Zeitalter um Tag 80 ± 10', kind: 'prestige', id: LAYER.ages, nth: 3, clock: 'wall', min: (70 - 1) * 1440, max: (90 - 1) * 1440 },
  ],
} as const

/**
 * Späte Taktung der Lande bei regular (Tag 35 bis Tag 90), begründet in balance.md.
 * Lande zählen mit der Talkarte (Land 1), Stichzeit ist das Ende des Tages.
 */
export const lateTargets = {
  /** Offene Lande am Ende von Tag 60: nicht zu wenige, aber auch nicht schon fast alle. */
  landsDay60: { min: 22, max: 27 },
  /** Offene Lande am Ende von Tag 90 (von 34). */
  landsDay90: { min: 30 },
  /** Das letzte Land öffnet sich nicht vor diesem Tag, sonst fehlen danach die Ziele. */
  lastLandNotBeforeDay: 75,
  /** Längste Zeit ohne neues Land oder Zeitalter zwischen Tag 35 und Tag 90, in Tagen. */
  maxGapDays: 4,
} as const
