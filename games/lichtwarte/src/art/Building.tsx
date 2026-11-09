import type { Mood } from '@engine/art'
import { BUILDINGS } from './registry'
import { Wilds } from './parts'

/** Ein Platz: Wildnis (Stufe 0) oder das Bauwerk in seiner Ausbaustufe. */
export function BuildingArt({ id, tier, m, variant = 0 }: { id: string; tier: number; m: Mood; variant?: number }) {
  if (tier <= 0) return <Wilds variant={variant} m={m} />
  const B = BUILDINGS[id]
  return B ? <>{B({ tier, m })}</> : null
}
