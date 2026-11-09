/** Deterministic variation for art (same id → same look on every device). */
export function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Seeded generator for art: `seeded('roof-3')()` → [0, 1). */
export function seeded(key: string): () => number {
  let s = hashString(key) || 1
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let x = s
    x = Math.imul(x ^ (x >>> 15), x | 1)
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

/** Value in [min, max] from a seeded generator, rounded to 0.5 (crisp SVG). */
export function vary(rnd: () => number, min: number, max: number): number {
  return Math.round((min + (max - min) * rnd()) * 2) / 2
}
