/** Pick the one goal the HUD shows next. */
import { gateProgress, nextMilestone, unitCost } from './producers'
import { costMult, gateInput, isUnlocked, ownedOf } from './modules/producers'
import { layerStatus } from './modules/prestige'
import { levelOf, type ProgressionState } from './modules/progression'
import { MODULE } from './modules/ids'
import { primaryCurrency } from './state'
import type { GateAtom, WorldView } from './types'

export type NextGoal =
  | { kind: 'prestige'; layer: string; payout: number }
  | { kind: 'unlock'; id: string; ratio: number }
  | { kind: 'milestone'; id: string; at: number; level: number; ratio: number }
  | { kind: 'prestigeProgress'; layer: string; ratio: number }
  | { kind: 'none' }

export function nextGoal(world: WorldView): NextGoal {
  const layers = world.def.prestigeLayers
  for (let k = layers.length - 1; k >= 0; k--) {
    const st = layerStatus(world, layers[k].id)
    if (st.block === null) return { kind: 'prestige', layer: st.layer, payout: st.payout }
  }
  const locked = world.def.producers.find((p) => !isUnlocked(world, p))
  if (locked) {
    const ratio = gateProgress(locked.unlock, gateInput(world))
    // A gate that cannot move this run (prestige count) is not a useful goal.
    const blockedByPrestige = (locked.unlock?.all ?? []).some((a) => a.kind === 'prestige' && gateInput(world).prestigeCount(a.layer) < a.count)
    if (!blockedByPrestige) return { kind: 'unlock', id: locked.id, ratio }
  }
  let best: NextGoal | null = null
  let bestLeft = Infinity
  for (const p of world.def.producers) {
    const n = ownedOf(world, p.id)
    if (n <= 0) continue
    const m = nextMilestone(n, world.def.balance)
    if (!m) continue
    const left = m.at - n
    if (left < bestLeft) {
      bestLeft = left
      best = { kind: 'milestone', id: p.id, at: m.at, level: n, ratio: (n - m.from) / Math.max(1, m.at - m.from) }
    }
  }
  if (best) return best
  if (layers[0]) return { kind: 'prestigeProgress', layer: layers[0].id, ratio: layerStatus(world, layers[0].id).ratio }
  return { kind: 'none' }
}

/* ------------------------------------------------------------------ */
/* The pressing goal: whatever is closest to done                      */
/* ------------------------------------------------------------------ */

/** From this share on a goal counts as "almost there": it gains urgency and the strip may pulse. */
export const NEAR_RATIO = 0.78
/** From this share on it is hot: more urgency still. */
export const NEAR_HOT_RATIO = 0.92

/** What stands in the way of an unlock, as the best (most advanced) condition. */
export type UnlockVia =
  | { kind: 'primaryRun'; left: number }
  | { kind: 'producer'; id: string; have: number; need: number }
  | { kind: 'level'; have: number; need: number }

export type PressingGoal = (
  | { kind: 'upgrade'; id: string; cost: number; first: boolean }
  | { kind: 'unlock'; id: string; via: UnlockVia }
  | { kind: 'level'; next: number; into: number; need: number }
  | { kind: 'prestige'; layer: string; ready: boolean; left: number; payout: number }
  | { kind: 'none' }
) & {
  /** 0…1 fill of the bar. */
  ratio: number
  /** Higher wins. */
  urgency: number
  /** Close but not there: `ratio` in [NEAR_RATIO, 1). */
  near: boolean
}

function scored<G extends { ratio: number; urgency: number }>(g: G): G & { near: boolean } {
  const near = g.ratio >= NEAR_RATIO && g.ratio < 0.999
  if (!near) return { ...g, near: false }
  return { ...g, near: true, urgency: g.urgency + 0.16 + (g.ratio >= NEAR_HOT_RATIO ? 0.12 : 0) }
}

/** Progress toward a locked producer along its best condition, or null while a prestige gate blocks it. */
function unlockVia(world: WorldView, gate: { all?: readonly GateAtom[]; any?: readonly GateAtom[] } | undefined): { ratio: number; via: UnlockVia } | null {
  if (!gate) return null
  const g = gateInput(world)
  for (const a of gate.all ?? []) if (a.kind === 'prestige' && g.prestigeCount(a.layer) < a.count) return null
  const measure = (a: GateAtom): { ratio: number; via: UnlockVia } | null => {
    const clamp = (r: number) => Math.max(0, Math.min(1, r))
    if (a.kind === 'primaryRun') return { ratio: clamp(a.amount > 0 ? g.primaryRun / a.amount : 1), via: { kind: 'primaryRun', left: Math.max(0, a.amount - g.primaryRun) } }
    if (a.kind === 'producer') return { ratio: clamp(a.level > 0 ? g.producerLevel(a.id) / a.level : 1), via: { kind: 'producer', id: a.id, have: g.producerLevel(a.id), need: a.level } }
    if (a.kind === 'level') return { ratio: clamp(a.level > 0 ? g.playerLevel / a.level : 1), via: { kind: 'level', have: g.playerLevel, need: a.level } }
    return null
  }
  // Every `all` condition must hold: the one furthest behind is what stands in the way
  let worst: { ratio: number; via: UnlockVia } | null = null
  for (const a of gate.all ?? []) {
    const m = measure(a)
    if (m && m.ratio < 1 && (!worst || m.ratio < worst.ratio)) worst = m
  }
  if (worst) return worst
  // Of the `any` conditions one is enough: the most advanced one is the way in
  let best: { ratio: number; via: UnlockVia } | null = null
  for (const a of gate.any ?? []) {
    const m = measure(a)
    if (m && (!best || m.ratio > best.ratio)) best = m
  }
  return best
}

/**
 * The one goal the HUD strip shows: of the next upgrade, the next locked
 * producer, the next player level and the first prestige layer, the one that
 * is closest to done wins ("one more"). An affordable upgrade beats
 * everything except a ready prestige.
 */
export function pressingGoal(world: WorldView): PressingGoal {
  const out: PressingGoal[] = []
  const money = world.balance(primaryCurrency(world.def))

  let upgrade: PressingGoal | null = null
  for (const p of world.def.producers) {
    if (!isUnlocked(world, p)) continue
    const owned = ownedOf(world, p.id)
    const cost = unitCost(p, owned, costMult(world, p.id))
    if (!Number.isFinite(cost) || cost <= 0) continue
    const ratio = Math.min(1, money / cost)
    const urgency = ratio >= 1 ? 0.95 + (1 / (cost + 1)) * 0.04 : 0.35 + ratio * 0.45 + (ratio >= NEAR_RATIO ? 0.1 : 0)
    const g = scored({ kind: 'upgrade' as const, id: p.id, cost, first: owned === 0, ratio, urgency })
    if (!upgrade || g.urgency > upgrade.urgency) upgrade = g
  }
  if (upgrade) out.push(upgrade)

  const locked = world.def.producers.find((p) => !isUnlocked(world, p))
  const via = locked ? unlockVia(world, locked.unlock) : null
  if (locked && via) out.push(scored({ kind: 'unlock' as const, id: locked.id, via: via.via, ratio: via.ratio, urgency: 0.4 + via.ratio * 0.5 }))

  const pg = world.get<ProgressionState | undefined>(MODULE.progression)
  if (pg) {
    const l = levelOf(pg.xp, world.def.balance)
    if (l.level < world.def.balance.progression.maxLevel) out.push(scored({ kind: 'level' as const, next: l.level + 1, into: l.into, need: l.need, ratio: l.ratio, urgency: 0.35 + l.ratio * 0.48 }))
  }

  const layer = world.def.prestigeLayers[0]
  if (layer) {
    const st = layerStatus(world, layer.id)
    const ready = st.block === null
    const ratio = Math.max(0, Math.min(1, st.ratio))
    const urgency = ready ? 0.9 : 0.28 + ratio * 0.55 + (ratio >= NEAR_RATIO ? 0.14 : 0) + (ratio >= NEAR_HOT_RATIO ? 0.1 : 0)
    // Ready counts as done, not as "almost": no extra pull on top
    const g = { kind: 'prestige' as const, layer: layer.id, ready, left: Math.max(0, st.gate - st.earned), payout: st.payout, ratio: ready ? 1 : ratio, urgency }
    out.push(ready ? { ...g, near: false } : scored(g))
  }

  out.sort((a, b) => b.urgency - a.urgency)
  return out[0] ?? { kind: 'none', ratio: 0, urgency: 0, near: false }
}
