/**
 * "Best next buy": the unlocked producer level with the shortest payback,
 * including the wait until it is affordable.
 */
import { milestoneMult, unitCost } from './producers'
import { costMult, isUnlocked, ownedOf } from './modules/producers'
import { primaryCurrency } from './state'
import type { WorldView } from './types'

export interface BestBuy {
  id: string
  cost: number
  /** Extra income per second after the buy. */
  gain: number
  /** Seconds until the buy has paid for itself, incl. waiting. */
  score: number
  affordable: boolean
}

export function bestBuy(world: WorldView): BestBuy | null {
  const money = world.balance(primaryCurrency(world.def))
  const rate = world.rate()
  const b = world.def.balance
  let best: BestBuy | null = null
  for (const p of world.def.producers) {
    if (!isUnlocked(world, p)) continue
    const n = ownedOf(world, p.id)
    const cost = unitCost(p, n, costMult(world, p.id))
    const now = world.producerRate(p.id)
    // Rate after the buy: scale the current effective multiplier, then the milestone jump.
    const perLevel = n > 0 ? now / (p.baseRate * n * milestoneMult(n, b)) : world.value(`rate:${p.id}`, 1)
    const after = p.baseRate * (n + 1) * milestoneMult(n + 1, b) * perLevel
    const gain = Math.max(1e-12, after - now)
    const wait = money >= cost ? 0 : rate > 0 ? (cost - money) / rate : Number.MAX_VALUE
    const score = wait + cost / gain
    if (!best || score < best.score) best = { id: p.id, cost, gain, score, affordable: money >= cost }
  }
  return best
}
