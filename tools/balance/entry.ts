/** Simulator + env overrides + target checks (bundled together with the game: one engine copy). */
import { overridesFromEnv, withOverrides, type GameDefinition } from '@engine/core'
import type { SimResult } from './sim'

export { formatResult, simulate } from './sim'

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
 * more than `factor` × the previous gap. Gaps below `floorMin` count as
 * `floorMin`, so the quick first minutes do not make every later gap a "wall".
 */
export function checkWalls(r: SimResult, factor = 3, floorMin = 10, untilMin = Infinity): string[] {
  const seen = new Set<string>()
  const goals = r.events.filter((e) => {
    if (e.active > untilMin) return false
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
