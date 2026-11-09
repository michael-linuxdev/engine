/**
 * Seeded, serialisable random numbers (mulberry32). The state is a single
 * uint32, stored in the save as an 8-digit hex string so two runs with the
 * same seed produce bit-identical saves.
 */
export interface Rng {
  /** Uniform float in [0, 1). */
  next(): number
  /** Integer in [0, n). */
  int(n: number): number
  /** Current internal state (uint32). */
  state(): number
}

export function createRng(seed: number): Rng {
  let s = seed >>> 0
  const next = (): number => {
    s = (s + 0x6d2b79f5) >>> 0
    let x = s
    x = Math.imul(x ^ (x >>> 15), x | 1)
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
  return {
    next,
    int: (n) => Math.floor(next() * Math.max(0, Math.floor(n))),
    state: () => s,
  }
}

export function rngToString(state: number): string {
  return (state >>> 0).toString(16).padStart(8, '0')
}

export function rngFromString(v: unknown, fallback = 0x9e3779b9): number {
  if (typeof v === 'string' && /^[0-9a-f]{1,8}$/i.test(v)) return parseInt(v, 16) >>> 0
  if (typeof v === 'number' && Number.isFinite(v)) return Math.floor(v) >>> 0
  return fallback >>> 0
}
