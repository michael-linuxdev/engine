import type { ReactNode } from 'react'

/** Position + scale a piece of art (crisp half-pixel rounding). */
export function Place({ x, y, s = 1, children, flip }: { x: number; y: number; s?: number; flip?: boolean; children: ReactNode }) {
  const r = (n: number) => Math.round(n * 2) / 2
  return <g transform={`translate(${r(x)} ${r(y)}) scale(${flip ? -s : s} ${s})`}>{children}</g>
}
