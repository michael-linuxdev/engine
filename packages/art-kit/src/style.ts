/**
 * Style rules and size table. One unit (U) = the height of the reference
 * figure of a game (e.g. its helper character); everything else is measured
 * in U so scenes stay consistent. Stroke widths come in three weights only.
 */
export interface StyleRules {
  /** px per unit at scale 1 */
  unit: number
  stroke: { fine: number; main: number; bold: number }
  /** Heights in U */
  sizes: Record<string, number>
}

export function defineStyle(r: StyleRules): StyleRules {
  return r
}

export function u(style: StyleRules, n: number): number {
  return Math.round(style.unit * n * 2) / 2
}
