/**
 * Markt (P11, Attrappen): 7 Angebote, 8 Talstile (4 + 4 Fest), Bonus-Video,
 * Festwoche (5 Stufen), Zeitsprung (6 h am Tag), Tagesgeschenk, Verstärker und
 * Wächterzirkel. Echtgeld-Angebote sind aus, bis es echte Store-Käufe gibt.
 * In der Testphase werden sie mit Testgeld bezahlt (20 € im Monat, nichts wird
 * abgebucht). Texte: i18n/*.ts (market.*). Preise: docs/spiele/lichtwarte/markt.md.
 */
import { festAt, type MarketConfig } from '@engine/core'
import { TEST_PHASE } from '../distribution'
import { CURRENCY } from '../ids'
import { FESTIVALS } from './live'

const pebbles = (amount: number) => ({ currency: CURRENCY.glowPebbles, amount })

/** Echte Käufe gibt es erst mit dem Store. Bis dahin verschenken die Angebote nichts. */
export const STORE_ENABLED = false
/** Testgeld: nur in der Testphase und solange es keine echten Käufe gibt. */
export const TEST_WALLET_ENABLED = TEST_PHASE && !STORE_ENABLED
export const TEST_BUDGET_CENTS = 2000

/** Preise je Angebot in Cent (Vorschlag, docs/spiele/lichtwarte/markt.md). */
export const OFFER_PRICES: Readonly<Record<string, number>> = {
  starterBundle: 199,
  removeAds: 399,
  pebbles50: 99,
  pebbles150: 249,
  pebbles500: 699,
  stylePack: 299,
  festWeekPlus: 199,
}

/** Länge des Bonus-Videos: in der Testphase wie ein echtes (30 oder 60 s), sonst 2 s. */
export function adSeconds(rand = Math.random()): number {
  if (!TEST_WALLET_ENABLED) return 2
  return rand < 0.5 ? 30 : 60
}

/** Fest-Stil: nur während seines Festes zu kaufen (gekauft bleibt er). */
const duringFest = (id: string): NonNullable<MarketConfig['cosmetics'][number]['when']> => (_w, clock) => festAt(FESTIVALS, clock)?.id === id

export const MARKET: MarketConfig = {
  currency: CURRENCY.glowPebbles,
  cosmetics: [
    { id: 'duskBlue', cost: 0 },
    { id: 'emberRed', cost: 80 },
    { id: 'iceBlue', cost: 120 },
    { id: 'amber', cost: 200 },
    { id: 'budWreath', cost: 150, when: duringFest('budding') },
    { id: 'solsticeSheen', cost: 150, when: duringFest('midsummerGlow') },
    { id: 'lanternParade', cost: 150, when: duringFest('lanternMoon') },
    { id: 'starOfLights', cost: 150, when: duringFest('longLight') },
  ],
  offers: [
    { id: 'starterBundle', grant: [pebbles(200)], cosmetics: ['emberRed'], once: true },
    { id: 'removeAds', removeAds: true, once: true },
    { id: 'pebbles50', grant: [pebbles(50)] },
    { id: 'pebbles150', grant: [pebbles(150)] },
    { id: 'pebbles500', grant: [pebbles(500)] },
    { id: 'stylePack', cosmetics: ['iceBlue', 'amber'], once: true },
    { id: 'festWeekPlus', passPremium: true },
  ],
  ad: {
    cooldownMs: 3 * 60_000,
    choices: [
      // Nur noch eine Belohnung (Entscheidung 2026-11-12): Im Testlog fiel die Wahl 19-mal auf Glimmer und nie auf 6 Lichtkiesel.
      // Die Kiesel-Wahl bleibt als stillgelegter Eintrag stehen: IDs verschwinden nie (ids.lock.json).
      { id: 'glimmer', seconds: 10 * 60 },
      { id: 'pebbles', grant: [pebbles(6)], retired: true },
    ],
  },
  pass: {
    tiers: [
      { xp: 0, free: { grant: [pebbles(5)] }, premium: { grant: [pebbles(20)] } },
      { xp: 25, free: { seconds: 90 }, premium: { seconds: 300 } },
      { xp: 50, free: { grant: [pebbles(10)] }, premium: { grant: [pebbles(40)] } },
      { xp: 75, free: { seconds: 180 }, premium: { seconds: 600 } },
      { xp: 100, free: { grant: [pebbles(15)] }, premium: { grant: [pebbles(60)] } },
    ],
    dailyXp: 25,
    adXp: 10,
    maxXp: 100,
  },
  skips: [
    { id: 'shortHour', hours: 1, cost: 40 },
    { id: 'longWatch', hours: 4, cost: 120 },
  ],
  skipCapHours: 6,
  gift: [pebbles(3)],
  boost: { cost: 45, mult: 1.15, durationMs: 30 * 60_000 },
  circle: { cost: 60, mult: 1.1, step: 0.05, max: 1.25, durationMs: 60 * 60_000 },
}
