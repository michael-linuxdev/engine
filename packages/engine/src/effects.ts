/**
 * The single effect pipeline (ADR 0004). Every multiplier of every system
 * flows through `resolve`: matching sources are applied in the fixed order
 * add → mul → pow. The result carries a breakdown for the UI.
 *
 * Matching: a source with target `x:*` applies to every `x:<id>`;
 * a source with target `x:<id>` only to that id; plain targets match exactly.
 */
import type { EffectSource, EffectTarget } from './types'

export interface EffectPart {
  id: string
  labelKey: string
  op: EffectSource['op']
  value: number
}

export interface Resolved {
  base: number
  value: number
  parts: EffectPart[]
}

export function targetMatches(sourceTarget: EffectTarget, target: EffectTarget): boolean {
  if (sourceTarget === target) return true
  if (sourceTarget.endsWith(':*')) {
    const prefix = sourceTarget.slice(0, -1)
    return target.startsWith(prefix) && target !== sourceTarget
  }
  return false
}

const ORDER: Record<EffectSource['op'], number> = { add: 0, mul: 1, pow: 2 }

export function resolve(target: EffectTarget, base: number, sources: readonly EffectSource[]): Resolved {
  const parts: EffectPart[] = []
  for (const s of sources) {
    if (!Number.isFinite(s.value)) continue
    if (targetMatches(s.target, target)) parts.push({ id: s.id, labelKey: s.labelKey, op: s.op, value: s.value })
  }
  // Stable sort by op order, keeping source order within an op.
  parts.sort((a, b) => ORDER[a.op] - ORDER[b.op])
  let value = base
  for (const p of parts) {
    if (p.op === 'add') value += p.value
    else if (p.op === 'mul') value *= p.value
    else value = Math.pow(Math.max(0, value), p.value)
  }
  if (!Number.isFinite(value)) value = value > 0 ? Number.MAX_VALUE : 0
  return { base, value, parts }
}

/** Value only (hot path). */
export function resolveValue(target: EffectTarget, base: number, sources: readonly EffectSource[]): number {
  let add = 0
  let mul = 1
  let pow = 1
  let hasPow = false
  for (const s of sources) {
    if (!Number.isFinite(s.value) || !targetMatches(s.target, target)) continue
    if (s.op === 'add') add += s.value
    else if (s.op === 'mul') mul *= s.value
    else {
      pow *= s.value
      hasPow = true
    }
  }
  let v = (base + add) * mul
  if (hasPow) v = Math.pow(Math.max(0, v), pow)
  return Number.isFinite(v) ? v : v > 0 ? Number.MAX_VALUE : 0
}
