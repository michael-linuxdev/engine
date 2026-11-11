/**
 * Feuerstraße (Jahr 2): Benachbarte Hochlande werden verbunden, vom letzten Land des ersten Jahres
 * bis zur Ersten Warte. Jede Verbindung hat drei Stufen und braucht dafür je einen Stern mehr in
 * BEIDEN Landen. Jede Stufe gibt Ertrag, die längste lückenlose Kette noch einmal obendrauf.
 * IDs (`road_<land>`) werden nur angehängt.
 */
import { regionStars, REGIONS_ID, type LinksConfig, type RegionsState, type WorldView } from '@engine/core'
import { CURRENCY } from '../ids'
import { REALM_GROUPS, REALM_IDS, REALMS } from './realms'

const HIGH = REALM_GROUPS[4]
const realmDef = new Map(REALMS.regions.map((r) => [r.id, r]))

/** Sterne eines Landes (0, solange es nicht offen ist). */
export function realmStars(w: WorldView, id: string): number {
  const def = realmDef.get(id)
  return def ? regionStars(REALMS, def, w.get<RegionsState | undefined>(REGIONS_ID)?.regions[id]) : 0
}

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
  rating: realmStars,
}
