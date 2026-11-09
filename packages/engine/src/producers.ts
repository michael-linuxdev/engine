/**
 * Producer formulas (ADR 0002 for number limits).
 *  - Cost:  C(n) = C0 · g^n · m          (m = resolved `cost:<id>` effect)
 *  - Bulk:  Σ_{i<k} C(n+i) = C0 · g^n · (g^k − 1)/(g − 1) · m   (closed form)
 *  - Rate:  R(n) = r0 · n · factor^(milestones reached)  · effects
 */
import { MAX_NUM } from './num'
import type { BalanceConfig, GateAtom, ProducerDef, UnlockGate } from './types'

export function unitCost(p: ProducerDef, owned: number, mult = 1): number {
  const raw = p.baseCost * Math.pow(p.costScale, Math.max(0, owned)) * mult
  if (!Number.isFinite(raw) || raw >= MAX_NUM) return MAX_NUM
  return Math.max(1, Math.floor(raw))
}

/** Cost of buying `k` levels starting at `owned`. */
export function bulkCost(p: ProducerDef, owned: number, k: number, mult = 1): number {
  if (k <= 0) return 0
  if (k === 1) return unitCost(p, owned, mult)
  const g = p.costScale
  const raw = g === 1 ? p.baseCost * k * mult : p.baseCost * Math.pow(g, owned) * ((Math.pow(g, k) - 1) / (g - 1)) * mult
  if (!Number.isFinite(raw) || raw >= MAX_NUM) return MAX_NUM
  return Math.max(1, Math.floor(raw))
}

/** Most levels affordable with `money` (closed form, corrected for rounding). */
export function maxAffordable(p: ProducerDef, owned: number, money: number, mult = 1, cap = 100_000): number {
  if (money < unitCost(p, owned, mult)) return 0
  const g = p.costScale
  const first = p.baseCost * Math.pow(g, owned) * mult
  let k = g === 1 ? Math.floor(money / first) : Math.floor(Math.log(1 + (money * (g - 1)) / first) / Math.log(g))
  if (!Number.isFinite(k) || k < 0) k = 0
  k = Math.min(k, cap)
  while (k > 0 && bulkCost(p, owned, k, mult) > money) k -= 1
  while (k < cap && bulkCost(p, owned, k + 1, mult) <= money) k += 1
  return k
}

export function milestonesReached(level: number, b: BalanceConfig): number {
  let n = 0
  for (const m of b.milestones.levels) if (level >= m) n += 1
  return n
}

export function milestoneMult(level: number, b: BalanceConfig): number {
  return Math.pow(b.milestones.factor, milestonesReached(level, b))
}

export function nextMilestone(level: number, b: BalanceConfig): { at: number; from: number } | null {
  let from = 0
  for (const m of b.milestones.levels) {
    if (level < m) return { at: m, from }
    from = m
  }
  return null
}

/** Base rate before effects (milestones are an effect, see producers module). */
export function baseRate(p: ProducerDef, owned: number): number {
  return owned <= 0 ? 0 : p.baseRate * owned
}

export interface GateInput {
  prestigeCount(layer: string): number
  primaryRun: number
  producerLevel(id: string): number
  playerLevel: number
}

export function atomHolds(a: GateAtom, g: GateInput): boolean {
  switch (a.kind) {
    case 'prestige':
      return g.prestigeCount(a.layer) >= a.count
    case 'primaryRun':
      return g.primaryRun >= a.amount
    case 'producer':
      return g.producerLevel(a.id) >= a.level
    case 'level':
      return g.playerLevel >= a.level
  }
}

export function gateOpen(gate: UnlockGate | undefined, g: GateInput): boolean {
  if (!gate) return true
  for (const a of gate.all ?? []) if (!atomHolds(a, g)) return false
  const any = gate.any ?? []
  return any.length === 0 || any.some((a) => atomHolds(a, g))
}

/** 0…1 progress of the most advanced `any` atom (for hints). */
export function gateProgress(gate: UnlockGate | undefined, g: GateInput): number {
  if (gateOpen(gate, g)) return 1
  const ratio = (a: GateAtom): number => {
    switch (a.kind) {
      case 'prestige':
        return Math.min(1, g.prestigeCount(a.layer) / Math.max(1, a.count))
      case 'primaryRun':
        return Math.min(1, g.primaryRun / Math.max(1, a.amount))
      case 'producer':
        return Math.min(1, g.producerLevel(a.id) / Math.max(1, a.level))
      case 'level':
        return Math.min(1, g.playerLevel / Math.max(1, a.level))
    }
  }
  const all = gate?.all ?? []
  const allMin = all.length ? Math.min(...all.map(ratio)) : 1
  const any = gate?.any ?? []
  const anyMax = any.length ? Math.max(...any.map(ratio)) : 1
  return Math.min(allMin, anyMax) * 0.999
}
