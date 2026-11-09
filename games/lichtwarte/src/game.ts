/**
 * Spieldefinition (Daten statt Code).
 * Zahlen der Erzeuger-Leiter und des Archivs folgen dem gestimmten Referenz-Spiel
 * (docs/referenz/paritaet.md); P6 stimmt sie mit dem Simulator nach.
 * Inhalts-IDs sind stabil und stehen in ids.lock.json — nie ändern, nur anhängen.
 */
import { defaultBalance, standardModules, type GameDefinition, type GateAtom, type MetaItemDef, type ProducerDef } from '@engine/core'
import { BRAND } from './brand'

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

export const LAYER = { moonturn: 'moonturn', longNight: 'longNight', ages: 'ages' } as const
export const CURRENCY = { glimmer: 'glimmer', runeShards: 'runeShards', glowPebbles: 'glowPebbles', nightDew: 'nightDew', forebearLight: 'forebearLight' } as const

/** Leiter: [Kosten C0, Wachstum g, Ertrag r0, Laufertrag-Tor, Mondwenden-Tor, Wächterrang-Tor, Stufe des Vorgängers] */
const LADDER: [number, number, number, number, number, number, number][] = [
  [20, 1.18, 1, 0, 0, 0, 0],
  [150, 1.17, 4, 4000, 0, 0, 25],
  [1_800, 1.16, 25, 90_000, 0, 0, 25],
  [25_000, 1.15, 150, 500_000, 0, 6, 10],
  [200_000, 1.14, 900, 4_000_000, 1, 9, 10],
  [1_500_000, 1.13, 5_000, 25_000_000, 2, 12, 10],
  [12_000_000, 1.12, 30_000, 150_000_000, 4, 16, 10],
  [90_000_000, 1.115, 180_000, 1_000_000_000, 6, 20, 10],
  [700_000_000, 1.11, 1_100_000, 8_000_000_000, 9, 25, 10],
  [5_000_000_000, 1.105, 7_000_000, 50_000_000_000, 13, 30, 10],
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
]

const balance = defaultBalance(LAYER.moonturn)
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
      gate: { base: 25_000_000, growth: 3.2, knee: 13, lateGrowth: 1.12 },
      probe: { gate: 1_000_000, payout: 70 },
      payout: { base: 100, growth: 1.12 },
      minimum: { producersOnline: 3, producersFromCount: 1 },
    },
    {
      id: LAYER.longNight,
      currency: CURRENCY.nightDew,
      gate: { base: 1e16, growth: 6, knee: 8, lateGrowth: 1.5 },
      payout: { base: 5, growth: 1.08 },
      minimum: { lowerRuns: 14 },
    },
    {
      id: LAYER.ages,
      currency: CURRENCY.forebearLight,
      gate: { base: 1e24, growth: 10, knee: 6, lateGrowth: 2 },
      payout: { base: 3, growth: 1.1 },
      minimum: { lowerRuns: 3 },
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
  modules: standardModules(),
  balance,
  startPrimary: 25,
  seed: 0x1c47a2e1,
}

/** Zielkorridore für den Simulator (CHECK=1), begründet in docs/spiele/lichtwarte/balance.md. */
export const balanceTargets = {
  engaged: [
    { label: 'Holzlager nach 3–5 min', kind: 'unlock', id: 'holzlager', clock: 'active', min: 3, max: 5 },
    { label: 'Steinbruch nach 8–15 min', kind: 'unlock', id: 'steinbruch', clock: 'active', min: 8, max: 15 },
    { label: 'Erste Mondwende nach 15–20 min', kind: 'prestige', id: LAYER.moonturn, nth: 1, clock: 'active', min: 15, max: 20 },
  ],
} as const
