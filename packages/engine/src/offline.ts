/**
 * Offline income in closed form: full rate up to the soft cap, `decay` × rate
 * between soft and hard cap, nothing beyond the hard cap.
 */
export function offlineGain(ratePerSec: number, elapsedSec: number, softHours: number, hardHours: number, decay: number): number {
  if (!(ratePerSec > 0) || !(elapsedSec > 0)) return 0
  const soft = Math.max(0, softHours) * 3600
  const hard = Math.max(soft, hardHours * 3600)
  const t = Math.min(elapsedSec, hard)
  if (t <= soft) return ratePerSec * t
  return ratePerSec * soft + ratePerSec * decay * (t - soft)
}

/** Effective seconds counted (for the return summary). */
export function offlineCountedSec(elapsedSec: number, softHours: number, hardHours: number): number {
  return Math.min(Math.max(0, elapsedSec), Math.max(softHours, hardHours) * 3600)
}
