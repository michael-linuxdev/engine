/** Register der Bauwerk-Grafiken und Ausbaustufen. */
import type { ReactNode } from 'react'
import * as B from './buildings'
import type { BuildingProps } from './buildings'

export const BUILDINGS: Record<string, (p: BuildingProps) => ReactNode> = {
  kraeuterkate: B.Kraeuterkate,
  holzlager: B.Holzlager,
  steinbruch: B.Steinbruch,
  quellschrein: B.Quellschrein,
  schmiede: B.Schmiede,
  kartenstube: B.Kartenstube,
  alchemistenturm: B.Alchemistenturm,
  greifenhorst: B.Greifenhorst,
  runenhalle: B.Runenhalle,
  sternwarte: B.Sternwarte,
}

/** Ausbaustufen ab Stufe 1 / 10 / 25 / 50 (Referenz: 5 Stufen, hier 4 + Wildnis). */
export const TIER_LEVELS = [1, 10, 25, 50] as const
