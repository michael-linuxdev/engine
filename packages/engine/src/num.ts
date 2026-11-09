/**
 * Number type of the engine (ADR 0002).
 *
 * All amounts are IEEE-754 doubles. The alias `Num` is the single place a
 * later switch to a big-number library would start from: formulas use the
 * helpers below instead of raw `Infinity` checks.
 *
 * Upper bound: MAX_NUM (1e300). Every value that enters the state is clamped
 * to [0, MAX_NUM] (or [-MAX_NUM, MAX_NUM] for signed values) so a save never
 * contains `Infinity`, which JSON would turn into `null`.
 */
export type Num = number

export const MAX_NUM: Num = 1e300

/** True for finite numbers (rejects NaN and ±Infinity). */
export function isNum(v: unknown): v is Num {
  return typeof v === 'number' && Number.isFinite(v)
}

/** Clamp into [0, MAX_NUM]; NaN becomes 0, +Infinity becomes MAX_NUM. */
export function clampNum(v: Num): Num {
  if (Number.isNaN(v)) return 0
  if (v <= 0) return 0
  if (v >= MAX_NUM) return MAX_NUM
  return v
}

/** Saturating addition that stays inside [0, MAX_NUM]. */
export function addNum(a: Num, b: Num): Num {
  return clampNum(a + b)
}

/** Saturating subtraction, never below 0. */
export function subNum(a: Num, b: Num): Num {
  return clampNum(a - b)
}

/** Saturating multiplication. */
export function mulNum(a: Num, b: Num): Num {
  return clampNum(a * b)
}

/** base^exp, saturating at MAX_NUM. */
export function powNum(base: Num, exp: Num): Num {
  return clampNum(Math.pow(base, exp))
}

/** Non-negative integer (floors, clamps). */
export function toCount(v: Num): number {
  return Math.floor(clampNum(v))
}
