/**
 * Template game: the smallest complete game on the engine — three
 * producers, one prestige layer, a tiny meta shop. Neutral placeholder
 * names on purpose: it proves the engine carries no theme assumptions.
 */
import { defaultBalance, standardModules, type GameDefinition } from '@engine/core'

const balance = defaultBalance('reset')
balance.helper = { ranks: [{ cost: { currency: 'meta', amount: 5 }, intervalMs: 8_000 }] }

export const game: GameDefinition = {
  id: 'vorlage',
  saveKey: 'vorlage-save-v1',
  contentVersion: 1,
  contentMigrations: {},
  currencies: [
    { id: 'coins', role: 'primary' },
    { id: 'meta', role: 'meta' },
    { id: 'gems', role: 'premium' },
  ],
  producers: [
    { id: 'p1', baseCost: 10, costScale: 1.15, baseRate: 1 },
    { id: 'p2', baseCost: 120, costScale: 1.15, baseRate: 6, unlock: { any: [{ kind: 'producer', id: 'p1', level: 10 }, { kind: 'primaryRun', amount: 500 }] } },
    { id: 'p3', baseCost: 1_500, costScale: 1.14, baseRate: 40, unlock: { any: [{ kind: 'producer', id: 'p2', level: 10 }, { kind: 'primaryRun', amount: 15_000 }] } },
  ],
  prestigeLayers: [
    {
      id: 'reset',
      currency: 'meta',
      gate: { base: 200_000, growth: 3, knee: 10, lateGrowth: 1.2 },
      probe: { gate: 50_000, payout: 10 },
      payout: { base: 10, growth: 1.1 },
      minimum: { producersOnline: 2, producersFromCount: 1 },
    },
  ],
  metaShop: [
    { id: 'boost', currency: 'meta', branch: 'yield', maxRank: 20, cost: { base: 5, growth: 1.3 }, effects: [{ target: 'rate:*', kind: 'mulLinear', perRank: 0.1 }], unlock: { tip: 'immediate' } },
    { id: 'discount', currency: 'meta', branch: 'yield', maxRank: 10, cost: { base: 8, growth: 1.35 }, effects: [{ target: 'cost:*', kind: 'mulCompound', perRank: 0.97 }], unlock: { tip: 'immediate' } },
    { id: 'head', currency: 'meta', branch: 'start', maxRank: 5, cost: { base: 6, growth: 1.4 }, effects: [{ target: 'start.primary', kind: 'add', perRank: 50 }], unlock: { tip: 'free' } },
  ],
  levelRewards: [{ level: 3, grant: [{ currency: 'gems', amount: 5 }] }],
  modules: standardModules(),
  balance,
  seed: 1,
}
