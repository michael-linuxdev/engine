/**
 * Bindungs-Systeme des Spiels (P7): Wachrunde, Aufträge, Taten, Prüfungen,
 * Marktnacht, Sternfenster, Lichterfeste, Sternenrad, Freischaltungen, Hinweise.
 * Texte in i18n/*.ts (live.*), IDs in ids.lock.json.
 */
import {
  burstMax, isFeatureOpen, layerStatus, levelOf, MODULE, ownedOf, prestigeState, producerLevelsTotal, producersOnline, REGIONS_ID, totalRegionStars,
  type AchievementDef, type WeeklyPlanConfig, type BurstState, type ChallengeConfig, type DailyConfig, type FeatureDef, type FestConfig, type FestItem, type FlashConfig, type ProgressionState,
  type QuestConfig, type RegionsState, type WeekendConfig, type WheelConfig, type WorldView,
} from '@engine/core'
import type { HintDef } from '@engine/react'
import { CURRENCY, LAYER } from '../ids'
import { REALMS } from './realms'
import { FEST_VARIETIES } from './world'

const pebbles = (amount: number) => ({ currency: CURRENCY.glowPebbles, amount })
const shards = (amount: number) => ({ currency: CURRENCY.runeShards, amount })
const turns = (w: WorldView) => prestigeState(w).layers[0]?.count ?? 0
/** Sterne der Meisterschaft über alle Lande. */
const stars = (w: WorldView) => totalRegionStars(REALMS, w.get<RegionsState>(REGIONS_ID)).have
const rank = (w: WorldView) => levelOf(w.get<ProgressionState>(MODULE.progression)?.xp ?? 0, w.def.balance).level

export const DAILY: DailyConfig = {
  rewards: [
    { seconds: 60 },
    { seconds: 90 },
    { seconds: 120, grant: [pebbles(5)] },
    { seconds: 150 },
    { seconds: 180, grant: [shards(1)] },
    { seconds: 240 },
    { seconds: 300, grant: [shards(1), pebbles(40)] },
  ],
  minPrimary: 50,
  comeback: [
    { minGap: 2, seconds: 60 },
    { minGap: 3, seconds: 180 },
    { minGap: 5, seconds: 600, grant: [pebbles(10)] },
  ],
}

export const QUESTS: QuestConfig = {
  perDay: 3,
  templates: [
    { id: 'build25', kind: 'buy', target: 25, reward: [pebbles(3)], rewardSeconds: 60, group: 'buy' },
    { id: 'build60', kind: 'buy', target: 60, reward: [pebbles(5)], rewardSeconds: 120, group: 'buy' },
    { id: 'gather5', kind: 'earn', target: 300, reward: [pebbles(3)], group: 'earn' },
    { id: 'gather20', kind: 'earn', target: 1200, reward: [pebbles(6)], group: 'earn' },
    { id: 'sparks3', kind: 'burst', target: 3, reward: [pebbles(4)], rewardSeconds: 60 },
    { id: 'watchRound', kind: 'daily', target: 1, reward: [pebbles(2)], rewardSeconds: 60 },
  ],
}

export const DEEDS: AchievementDef[] = [
  { id: 'firstLight', metric: (w) => ownedOf(w, 'kraeuterkate'), at: 1, reward: [pebbles(5)], bonus: 0.01 },
  { id: 'hundredLevels', metric: producerLevelsTotal, at: 100, reward: [pebbles(10)], bonus: 0.01 },
  { id: 'fiveHundredLevels', metric: producerLevelsTotal, at: 500, reward: [pebbles(20)], bonus: 0.01 },
  { id: 'thousandLevels', metric: producerLevelsTotal, at: 1500, reward: [shards(10)], bonus: 0.01 },
  { id: 'firstMoonturn', metric: turns, at: 1, reward: [pebbles(10)], bonus: 0.01 },
  { id: 'fiveMoonturns', metric: turns, at: 5, reward: [shards(5)], bonus: 0.01 },
  { id: 'fifteenMoonturns', metric: turns, at: 15, reward: [shards(20)], bonus: 0.02 },
  { id: 'firstLongNight', metric: (w) => prestigeState(w).layers[1]?.count ?? 0, at: 1, reward: [pebbles(50)], bonus: 0.02 },
  { id: 'sparkSinger', metric: (w) => w.get<BurstState>(MODULE.burst)?.uses ?? 0, at: 25, reward: [pebbles(10)], bonus: 0.01 },
  { id: 'rankTen', metric: rank, at: 10, reward: [pebbles(15)], bonus: 0.01 },
  { id: 'rankTwentyFive', metric: rank, at: 25, reward: [shards(15)], bonus: 0.02 },
  { id: 'wholeValley', metric: producersOnline, at: 10, reward: [pebbles(30)], bonus: 0.02 },
  // Meisterschaft der Lande (nur anhängen)
  { id: 'firstStar', metric: stars, at: 1, reward: [pebbles(10)], bonus: 0.01 },
  { id: 'tenStars', metric: stars, at: 10, reward: [pebbles(30)], bonus: 0.01 },
  { id: 'starPerRealm', metric: stars, at: REALMS.regions.length, reward: [pebbles(60)], bonus: 0.02 },
  { id: 'allStars', metric: stars, at: REALMS.regions.length * 3, reward: [pebbles(200)], bonus: 0.03 },
]

export const TRIALS: ChallengeConfig = {
  layer: LAYER.moonturn,
  list: [
    { id: 'withoutWoodshed', restriction: { kind: 'banProducer', id: 'holzlager' }, fromRuns: 5, bonus: 0.03 },
    { id: 'fiveOnly', restriction: { kind: 'maxProducers', n: 5 }, fromRuns: 6, bonus: 0.03 },
    { id: 'silentSparks', restriction: { kind: 'noBurst' }, fromRuns: 7, bonus: 0.03 },
  ],
}

/** Wochenplan: drei Ziele je Kalenderwoche, ein Bonus für alle zusammen (Lückenliste 8.4). */
export const WEEKLY: WeeklyPlanConfig = {
  goals: [
    { id: 'rounds', event: 'daily.claimed', target: 5 },
    { id: 'errands', event: 'quest.claimed', target: 9 },
    { id: 'turns', event: 'prestige.performed', target: 2 },
  ],
  reward: [pebbles(40)],
}

export const MARKET_NIGHT: WeekendConfig = { from: { weekday: 5, hour: 18 }, to: { weekday: 1, hour: 0 }, mult: 1.25, goalSeconds: 1800, reward: [pebbles(15)] }

export const STAR_WINDOW: FlashConfig = { durationMs: 18 * 60_000, cooldownMs: 150 * 60_000, chance: 0.55, checkMs: 10 * 60_000, mult: 1.15, goalSeconds: 360, graceMs: 10 * 60_000, reward: [pebbles(12)] }

const BASE_SHOP: FestItem[] = [
  { id: 'festBoost', cost: 20, max: 3, kind: 'boost', mult: 2, durationMs: 30 * 60_000 },
  { id: 'festPebbles', cost: 15, max: 3, kind: 'grant', grant: [pebbles(10)] },
  { id: 'festShards', cost: 25, max: 2, kind: 'grant', grant: [shards(5)] },
]

/** Fest-Laden: Grundangebot plus die Fest-Sorte(n) fürs Bestiarium & Kräuterkunde (P8). */
function festShops(): Record<string, readonly FestItem[]> {
  const out: Record<string, readonly FestItem[]> = { default: BASE_SHOP }
  for (const [fest, ids] of Object.entries(FEST_VARIETIES)) {
    out[fest] = [...BASE_SHOP, ...ids.map((id, i): FestItem => ({ id: `variety_${id}`, cost: i === 0 ? 60 : 160, max: 1, kind: 'item', event: { type: 'collection.found', id, source: 'fest' } }))]
  }
  return out
}

/** ?fest=<id> erzwingt ein Fest (Tests, Screenshots). */
function festOverride(): string | null {
  try {
    return typeof location !== 'undefined' ? new URLSearchParams(location.search).get('fest') : null
  } catch {
    return null
  }
}

export const FESTIVALS: FestConfig = {
  fests: [
    { id: 'hoarfrost', from: [1, 1], to: [2, 5], major: false },
    { id: 'snowdrop', from: [2, 6], to: [3, 19], major: false },
    { id: 'budding', from: [3, 20], to: [4, 30], major: true },
    { id: 'blossomRound', from: [5, 1], to: [6, 14], major: false },
    { id: 'midsummerGlow', from: [6, 15], to: [7, 31], major: true },
    { id: 'fireflyNights', from: [8, 1], to: [9, 14], major: false },
    { id: 'lanternMoon', from: [9, 15], to: [10, 31], major: true },
    { id: 'mistMoon', from: [11, 1], to: [12, 14], major: false },
    { id: 'longLight', from: [12, 15], to: [12, 31], major: true },
  ],
  shop: festShops(),
  earn: { 'daily.claimed': 10, 'burst.used': 2, 'prestige.performed': 15, 'quest.claimed': 5 },
  override: festOverride,
}

export const STAR_WHEEL: WheelConfig = {
  layer: LAYER.moonturn,
  segments: [
    { id: 'brightRun', weight: 2, kind: 'buff', target: 'income', mult: 1.25 },
    { id: 'longSparks', weight: 2, kind: 'buff', target: 'burst.seconds', mult: 2 },
    { id: 'pebbleRain', weight: 1, kind: 'grant', grant: [pebbles(30)] },
    { id: 'shardGift', weight: 1, kind: 'grant', grant: [shards(10)] },
  ],
}

/** Systeme öffnen sich nach und nach (bleiben offen). */
export const FEATURES: FeatureDef[] = [
  { id: 'watch', when: (w) => ownedOf(w, 'kraeuterkate') >= 10 },
  // Gestaffelt: etwa ein neues System je Mondwende statt sechs auf einmal (Lückenliste 1.2).
  // Bereits freigeschaltete Systeme bleiben bestehenden Spielständen erhalten (die Liste ist gespeichert).
  { id: 'events', when: (w) => turns(w) >= 2 },
  { id: 'festivals', when: (w) => turns(w) >= 3 },
  { id: 'wheel', when: (w) => turns(w) >= 1 },
  { id: 'trials', when: (w) => turns(w) >= 6 },
  // Der Markt steht von Anfang an offen (wie in der Referenz): Tagesgeschenk, Stile und Testgeld sollen sofort zu finden sein
  { id: 'market', when: () => true },
]

export function featureOpen(w: WorldView, id: string): boolean {
  return isFeatureOpen(w, id)
}

/** 16 einmalige Hinweise (Randnotizen der Chronik), Reihenfolge = Priorität. */
export const HINTS: HintDef<WorldView>[] = [
  { id: 'wilds', when: (w) => ownedOf(w, 'kraeuterkate') >= 3 },
  { id: 'milestone', when: (w) => ownedOf(w, 'kraeuterkate') >= 20 },
  { id: 'buyMode', when: (w) => producerLevelsTotal(w) >= 40 },
  { id: 'branches', when: (w) => producerLevelsTotal(w) >= 60 },
  { id: 'bonuses', when: (w) => producersOnline(w) >= 3 },
  { id: 'burstRecharge', when: (w) => (w.get<BurstState>(MODULE.burst)?.charges ?? 3) < burstMax(w) },
  { id: 'watchTab', when: (w) => isFeatureOpen(w, 'watch') },
  { id: 'moonturnNear', when: (w) => layerStatus(w, LAYER.moonturn).ratio >= 0.5 },
  { id: 'archive', when: (w) => turns(w) >= 1 },
  { id: 'wheel', when: (w) => isFeatureOpen(w, 'wheel') },
  { id: 'festivals', when: (w) => isFeatureOpen(w, 'festivals') },
  { id: 'producersNeeded', when: (w) => layerStatus(w, LAYER.moonturn).block === 'producers' },
  { id: 'apprentice', when: (w) => w.balance(CURRENCY.glowPebbles) >= 30 },
  { id: 'offlineCaps', when: (w) => turns(w) >= 3 },
  { id: 'trials', when: (w) => isFeatureOpen(w, 'trials') },
  { id: 'longNight', when: (w) => turns(w) >= 8 },
]
