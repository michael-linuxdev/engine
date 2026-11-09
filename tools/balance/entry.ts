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
