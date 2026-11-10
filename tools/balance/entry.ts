/** Simulator + env overrides + target checks (bundled together with the game: one engine copy). */
import { overridesFromEnv, withOverrides, type GameDefinition } from '@engine/core'
import type { SimResult } from './sim'

export { formatResult, registerRegions, simulate } from './sim'

export function withEnv(def: GameDefinition, env: Record<string, string | undefined>): GameDefinition {
  const o = overridesFromEnv(env)
  return Object.keys(o).length ? { ...def, balance: withOverrides(def.balance, o) } : def
}

/** A target corridor: event `kind:id` (n-th occurrence) between min and max minutes (wall clock or active). */
export interface BalanceTarget {
  label: string
  kind: 'unlock' | 'prestige'
  id: string
  nth?: number
  clock: 'active' | 'wall'
  min: number
  max: number
}

export function checkTargets(r: SimResult, targets: readonly BalanceTarget[]): string[] {
  const fails: string[] = []
  for (const t of targets) {
    const e = r.events.filter((x) => x.kind === t.kind && x.id === t.id)[(t.nth ?? 1) - 1]
    if (!e) {
      fails.push(`${t.label}: nicht erreicht`)
      continue
    }
    const v = t.clock === 'active' ? e.active : e.at
    if (v < t.min || v > t.max) fails.push(`${t.label}: ${v.toFixed(1)} min (Ziel ${t.min}–${t.max})`)
  }
  return fails
}

/**
 * "No wall": the active time to the next NEW goal (a producer unlock or the
 * first run of a prestige layer — repeated runs are the loop, not goals) is never
 * more than `factor` × the recent pace. Content tracks (`kinds`) are checked
 * separately: the valley (unlock/prestige/level) and the realms (region).
 * Gaps below `floorMin` count as
 * `floorMin`, so the quick first minutes do not make every later gap a "wall".
 */
export function checkWalls(r: SimResult, factor = 3, floorMin = 10, untilMin = Infinity, kinds: readonly string[] = ['unlock', 'prestige', 'level']): string[] {
  const seen = new Set<string>()
  const goals = r.events.filter((e) => {
    if (e.active > untilMin || !kinds.includes(e.kind)) return false
    const key = `${e.kind}:${e.id}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  const fails: string[] = []
  // Pace = largest of the last three gaps (goals come in bursts; a burst is not a wall).
  const recent: number[] = []
  for (let i = 1; i < goals.length; i++) {
    const gap = goals[i].active - goals[i - 1].active
    const pace = Math.max(floorMin, ...recent)
    if (gap > factor * pace) fails.push(`Mauer vor ${goals[i].kind} ${goals[i].id}: ${gap.toFixed(0)} min nach Tempo ${pace.toFixed(0)} min`)
    recent.push(gap)
    if (recent.length > 3) recent.shift()
  }
  return fails
}

/**
 * Late pacing: the largest wall-clock gap (minutes) between two NEW goals up
 * to `untilMin`, looking only at gaps that end after `fromMin`. Goals here: a
 * region opening, the first run of each prestige layer and every run of the
 * layers in `everyRun` (rare top-layer resets). The stretch from the last goal
 * to `untilMin` counts as a gap too, so running out of content early shows up.
 */
export function largestGoalGap(r: SimResult, fromMin: number, untilMin: number, everyRun: readonly string[] = []): { gap: number; from: number; to: number } {
  const seen = new Set<string>()
  const at: number[] = []
  for (const e of r.events) {
    if (e.at > untilMin) break
    if (e.kind === 'region') at.push(e.at)
    else if (e.kind === 'prestige' && (everyRun.includes(e.id) || !seen.has(e.id))) {
      seen.add(e.id)
      at.push(e.at)
    }
  }
  at.push(untilMin)
  let best = { gap: 0, from: fromMin, to: fromMin }
  for (let i = 1; i < at.length; i++) {
    if (at[i] <= fromMin) continue
    // A gap that straddles `fromMin` counts in full: the wait is felt as a whole.
    const gap = at[i] - at[i - 1]
    if (gap > best.gap) best = { gap, from: at[i - 1], to: at[i] }
  }
  return best
}
