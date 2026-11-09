/** Map grid: slots as percent positions of the map box (layout stays responsive). */
export interface Slot {
  id: string
  /** Percent of width / height (centre of the footprint). */
  x: number
  y: number
  /** Relative scale (depth). */
  scale: number
}

/** Sort by y so nearer slots paint last. */
export function paintOrder<T extends { y: number }>(slots: readonly T[]): T[] {
  return [...slots].sort((a, b) => a.y - b.y)
}

/** Position in a viewBox of width × height. */
export function at(slot: Slot, width: number, height: number): { x: number; y: number } {
  return { x: (slot.x / 100) * width, y: (slot.y / 100) * height }
}
