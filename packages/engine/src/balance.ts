/**
 * Balance overrides (simulator, experiments): dotted paths into a copy of
 * the config, e.g. `{ 'offline.softHours': '10' }`. Unknown paths throw so a
 * typo never silently tests the default.
 */
import type { BalanceConfig } from './types'

export function withOverrides(b: BalanceConfig, overrides: Record<string, string | number>): BalanceConfig {
  const out = JSON.parse(JSON.stringify(b)) as Record<string, unknown>
  for (const [path, raw] of Object.entries(overrides)) {
    const keys = path.split('.')
    let obj: Record<string, unknown> = out
    for (const k of keys.slice(0, -1)) {
      const next = obj[k]
      if (typeof next !== 'object' || next === null) throw new Error(`balance override: unknown path ${path}`)
      obj = next as Record<string, unknown>
    }
    const last = keys[keys.length - 1]
    if (!(last in obj) && keys[0] !== 'extra') throw new Error(`balance override: unknown path ${path}`)
    const v = typeof raw === 'number' ? raw : Number(raw)
    if (!Number.isFinite(v)) throw new Error(`balance override: ${path} is not a number`)
    obj[last] = v
  }
  return out as unknown as BalanceConfig
}

/** Read `BAL_<path with _ for .>` from an env-like record. */
export function overridesFromEnv(env: Record<string, string | undefined>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(env)) {
    if (!k.startsWith('BAL_') || v === undefined) continue
    out[k.slice(4).split('__').join('.')] = v
  }
  return out
}

/**
 * Reasonable defaults (taken from the reference game's tuned values). Games
 * copy and adjust; the simulator overrides single paths.
 */
export function defaultBalance(metaLayer: string): BalanceConfig {
  return {
    tickMs: 250,
    maxCatchupMs: 60_000,
    milestones: { levels: [25, 50, 100, 150, 200, 300, 400, 500, 750, 1000], factor: 2 },
    offline: { softHours: 8, hardHours: 24, decay: 0.5, minClaimMs: 15_000 },
    branches: { maxRank: 5, efficiencyPerRank: 0.04, capacityPerRank: 0.03, costFactor: 2.2, costGrowth: 1.5, capacityCostMult: 1.15, minCost: 25 },
    progression: { maxLevel: 40, xpPerUpgrade: 8, xpBase: 40, xpLinear: 25, xpQuad: 8, multPerLevel: 0.005, multCapLevels: 24, xpPerPrestige: 150, xpOfflineFactor: 0.85, xpOfflineCap: 80 },
    metaShop: {
      layer: metaLayer,
      perProducerLevel: 800,
      primarySqrtDiv: 100,
      primaryCap: 30_000,
      perPrestige: 8_000,
      firstRankBase: 12_000,
      rankBase: 28_000,
      rankStep: 32_000,
      rankStepGrowth: 3_000,
    },
    burst: { maxCharges: 3, rechargeMs: 5 * 60_000, seconds: 60 },
    surprises: { chance: 0.04, seconds: 30, minIntervalMs: 45_000 },
    helper: { ranks: [] },
  }
}
