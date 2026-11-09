/** A neutral 3-layer test game used by the engine unit tests. */
import { defaultBalance, standardModules, type GameDefinition } from '../src'

export const T0 = 1_800_000_000_000

export function testGame(over: Partial<GameDefinition> = {}): GameDefinition {
  const balance = defaultBalance('l1')
  balance.helper = { ranks: [{ cost: { currency: 'm1', amount: 1 }, intervalMs: 1000 }, { cost: { currency: 'm1', amount: 2 }, intervalMs: 500 }] }
  balance.surprises = { chance: 0, seconds: 10, minIntervalMs: 1000 }
  return {
    id: 'test',
    saveKey: 'test-save',
    contentVersion: 1,
    contentMigrations: {},
    currencies: [
      { id: 'c', role: 'primary' },
      { id: 'm1', role: 'meta' },
      { id: 'm2', role: 'layer', resetOn: ['l3'] },
      { id: 'm3', role: 'layer' },
      { id: 'gem', role: 'premium' },
    ],
    producers: [
      { id: 'a', baseCost: 10, costScale: 1.15, baseRate: 1 },
      { id: 'b', baseCost: 100, costScale: 1.15, baseRate: 5, unlock: { any: [{ kind: 'producer', id: 'a', level: 5 }] } },
      { id: 'c3', baseCost: 1000, costScale: 1.15, baseRate: 30, unlock: { all: [{ kind: 'prestige', layer: 'l1', count: 1 }] } },
    ],
    prestigeLayers: [
      { id: 'l1', currency: 'm1', gate: { base: 1000, growth: 2, knee: 5, lateGrowth: 1.1 }, probe: { gate: 500, payout: 3 }, payout: { base: 10, growth: 1.1 } },
      { id: 'l2', currency: 'm2', gate: { base: 1e5, growth: 3, knee: 5, lateGrowth: 1.1 }, payout: { base: 5, growth: 1 }, minimum: { lowerRuns: 2 } },
      { id: 'l3', currency: 'm3', gate: { base: 1e7, growth: 3, knee: 5, lateGrowth: 1.1 }, payout: { base: 1, growth: 1 }, minimum: { lowerRuns: 1 } },
    ],
    metaShop: [
      { id: 'mult', currency: 'm1', branch: 'y', maxRank: 10, cost: { base: 1, growth: 1.2 }, effects: [{ target: 'rate:*', kind: 'mulLinear', perRank: 0.5 }], unlock: { tip: 'free' } },
      { id: 'startA', currency: 'm1', branch: 's', maxRank: 3, cost: { base: 1, growth: 1 }, effects: [{ target: 'start.producer:a', kind: 'add', perRank: 2 }], unlock: { tip: 'free' } },
      { id: 'gated', currency: 'm1', branch: 'y', maxRank: 5, cost: { base: 1, growth: 1 }, effects: [{ target: 'cost:*', kind: 'mulCompound', perRank: 0.9 }] },
    ],
    levelRewards: [{ level: 2, grant: [{ currency: 'gem', amount: 7 }] }],
    modules: standardModules(),
    balance,
    startPrimary: 0,
    seed: 42,
    ...over,
  }
}
