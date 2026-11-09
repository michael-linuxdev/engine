/** Pick the one goal the HUD shows next. */
import { gateProgress, nextMilestone } from './producers'
import { gateInput, isUnlocked, ownedOf } from './modules/producers'
import { layerStatus } from './modules/prestige'
import type { WorldView } from './types'

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
