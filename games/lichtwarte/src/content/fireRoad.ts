/**
 * Feuerstraße (Jahr 2): Benachbarte Hochlande werden verbunden, vom letzten Land des ersten Jahres
 * bis zur Ersten Warte. Jede Verbindung hat drei Stufen; die erste braucht in BEIDEN Landen den siebten
 * Bereich auf Stufe 25, die zweite einen Stern, die dritte zwei Sterne. Jede Stufe gibt Ertrag, die längste lückenlose Kette noch einmal obendrauf.
 * IDs (`road_<land>`) werden nur angehängt.
 */
import { regionStars, REGIONS_ID, type LinksConfig, type RegionsState, type WorldView } from '@engine/core'
import { CURRENCY } from '../ids'
import { REALM_GROUPS, REALM_IDS, REALM_TUNING, REALMS } from './realms'

const HIGH = REALM_GROUPS[4]
const realmDef = new Map(REALMS.regions.map((r) => [r.id, r]))

/** Sterne eines Landes (0, solange es nicht offen ist). */
export function realmStars(w: WorldView, id: string): number {
  const def = realmDef.get(id)
  return def ? regionStars(REALMS, def, w.get<RegionsState | undefined>(REGIONS_ID)?.regions[id]) : 0
}

/**
 * Wie weit ein Land für die Feuerstraße ist: 1 = der siebte Bereich steht auf Stufe 25 (etwa auf halbem Weg
 * zum nächsten Land), 2 = ein Stern, 3 = zwei Sterne. Gemessen kam der erste Stern eines Hochlands erst rund
 * 90 Tage nach dem Öffnen; mit Sternen allein brannte bis Tag 231 kein einziges Feuer (fuenf-jahre.md).
 */
export function roadRating(w: WorldView, id: string): number {
  const def = realmDef.get(id)
  const r = w.get<RegionsState | undefined>(REGIONS_ID)?.regions[id]
  if (!def || !r?.open) return 0
  const stars = regionStars(REALMS, def, r)
  if (stars > 0) return Math.min(3, stars + 1)
  return (r.owned[def.areas[ROAD_AREA].id] ?? 0) >= REALM_TUNING.openLevel ? 1 : 0
}
/** Bereich (Index), der für die erste Stufe einer Verbindung auf Stufe 25 stehen muss. */
export const ROAD_AREA = 6

export function realmOpen(w: WorldView, id: string): boolean {
  return !!w.get<RegionsState | undefined>(REGIONS_ID)?.regions[id]?.open
}

/** Stellschrauben: 25 Verbindungen × 3 Stufen = 75 Schritte; die letzte Stufe kostet rund 130 Lichtkiesel, alle zusammen rund 4.100. */
export const FIRE_ROAD_TUNING = { costBase: 15, costGrowth: 1.03, perLevel: 0.02, perChain: 0.01 }

export const FIRE_ROAD: LinksConfig = {
  // Die erste Verbindung führt vom letzten Land des ersten Jahres hinauf ins erste Hochland
  list: REALM_IDS.slice(HIGH.from, HIGH.to).map((id, i) => ({ id: `road_${id}`, a: REALM_IDS[HIGH.from + i - 1], b: id })),
  needs: [1, 2, 3],
  cost: { currency: CURRENCY.glowPebbles, base: FIRE_ROAD_TUNING.costBase, growth: FIRE_ROAD_TUNING.costGrowth },
  perLevel: FIRE_ROAD_TUNING.perLevel,
  perChain: FIRE_ROAD_TUNING.perChain,
  rating: roadRating,
}
