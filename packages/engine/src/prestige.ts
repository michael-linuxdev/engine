/**
 * Prestige formulas for N layers (ADR 0005). Layer k measures the primary
 * earned since the last reset of any layer ≥ k (`runEarned`).
 *
 *  gate(p)   = base · growth^min(p, knee) · lateGrowth^max(0, p − knee)
 *  payout    = payoutBase · payoutGrowth^p · f(earned / gate)
 *  f(r)      = √r for r ≤ cap (default 4), then √cap + 0.5 · log2(r / cap)
 *
 * p = runs of this layer since the last reset of a higher layer.
 * A probe gate/payout replaces both for the very first run of a layer.
 */
import type { PrestigeLayerDef } from './types'

export function gateAt(l: PrestigeLayerDef, p: number, probe = false): number {
  if (probe && l.probe) return l.probe.gate
  const q = Math.max(0, p)
  const g = l.gate
  return Math.floor(g.base * Math.pow(g.growth, Math.min(q, g.knee)) * Math.pow(g.lateGrowth, Math.max(0, q - g.knee)))
}

export function payoutAtGate(l: PrestigeLayerDef, p: number, probe = false): number {
  if (probe && l.probe) return l.probe.payout
  return Math.round(l.payout.base * Math.pow(l.payout.growth, Math.max(0, p)))
}

export function payoutCurve(r: number, cap = 4): number {
  if (!(r > 0)) return 0
  if (r <= cap) return Math.sqrt(r)
  return Math.sqrt(cap) + 0.5 * Math.log2(r / cap)
}

export function rawPayout(l: PrestigeLayerDef, earned: number, p: number, probe = false): number {
  if (!(earned > 0)) return 0
  const gate = Math.max(1, gateAt(l, p, probe))
  return Math.floor(payoutAtGate(l, p, probe) * payoutCurve(earned / gate, l.payout.sqrtCap ?? 4))
}
