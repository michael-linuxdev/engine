/** Build tiers: level → visible stage (0 = still wild/locked). */
export function tierFor(level: number, thresholds: readonly number[]): number {
  let t = 0
  for (const th of thresholds) if (level >= th) t += 1
  return t
}
