/**
 * Himmelskarte (Jahr 3): zwölf Sternbilder, die Stern für Stern eingetragen werden. Bezahlt wird mit
 * Nachttau; jeder Stern gibt etwas Ertrag, ein vollständiges Sternbild wirkt dauerhaft. Ein Sternbild
 * lässt sich eintragen, sobald das zugehörige Küstenland offen ist (jedes zweite). IDs nur anhängen.
 */
import type { ChartConfig, WorldView } from '@engine/core'
import { CURRENCY } from '../ids'
import { realmOpen } from './fireRoad'
import { REALM_GROUPS, REALM_IDS } from './realms'

const COAST = REALM_GROUPS[5]

/** Sterne eines Sternbilds im Feld 100 × 70; die Linie verbindet sie in dieser Reihenfolge. */
export const CONSTELLATION_STARS: Record<string, readonly (readonly [number, number])[]> = {
  ladder: [[28, 64], [34, 46], [40, 28], [46, 10], [64, 14], [58, 32], [52, 50]],
  key: [[18, 36], [42, 36], [62, 36], [76, 22], [76, 50]],
  lantern: [[50, 8], [36, 22], [36, 50], [50, 62], [64, 50], [64, 22]],
  griffin: [[12, 42], [28, 30], [44, 34], [56, 20], [74, 12], [64, 36], [82, 46], [52, 56]],
  bell: [[50, 10], [34, 30], [28, 56], [72, 56], [66, 30]],
  boat: [[14, 40], [30, 60], [70, 60], [86, 40], [50, 40], [50, 10]],
  herder: [[50, 8], [50, 26], [32, 36], [68, 36], [50, 44], [40, 64], [60, 64]],
  bridge: [[8, 52], [26, 34], [44, 26], [60, 27], [76, 36], [92, 54]],
  whale: [[10, 38], [26, 24], [48, 20], [68, 26], [80, 40], [92, 26], [92, 54]],
  rose: [[50, 6], [60, 28], [90, 35], [60, 42], [50, 64], [40, 42], [10, 35], [40, 28]],
  horn: [[14, 46], [34, 42], [54, 34], [72, 22], [86, 8]],
  watch: [[50, 10], [50, 36], [36, 62], [64, 62]],
}

/** Stellschrauben: 74 Sterne; der erste kostet 2 Nachttau, der letzte rund 25, alle zusammen rund 670. */
export const SKY_CHART_TUNING = { costBase: 2, costGrowth: 1.035, perCell: 0.005 }

const EFFECTS: Record<string, { target: string; value: number }> = {
  ladder: { target: 'income', value: 1.05 },
  key: { target: 'cost:*', value: 0.97 },
  lantern: { target: 'burst.seconds', value: 1.25 },
  griffin: { target: 'income', value: 1.05 },
  bell: { target: 'income', value: 1.05 },
  boat: { target: 'income', value: 1.05 },
  herder: { target: 'cost:*', value: 0.97 },
  bridge: { target: 'income', value: 1.06 },
  whale: { target: 'income', value: 1.06 },
  rose: { target: 'burst.seconds', value: 1.25 },
  horn: { target: 'income', value: 1.07 },
  watch: { target: 'income', value: 1.1 },
}

export const CONSTELLATION_IDS = Object.keys(CONSTELLATION_STARS)

/** Das Küstenland, mit dem sich ein Sternbild eintragen lässt (jedes zweite; das letzte mit der Warte der vier Strahlen). */
export function constellationRealm(id: string): string {
  const i = CONSTELLATION_IDS.indexOf(id)
  return REALM_IDS[Math.min(COAST.to - 1, COAST.from + i * 2 + (i === CONSTELLATION_IDS.length - 1 ? 2 : 0))]
}

export const SKY_CHART: ChartConfig = {
  groups: CONSTELLATION_IDS.map((id) => ({ id, cells: CONSTELLATION_STARS[id].length, effect: EFFECTS[id] })),
  cost: { currency: CURRENCY.nightDew, base: SKY_CHART_TUNING.costBase, growth: SKY_CHART_TUNING.costGrowth },
  perCell: SKY_CHART_TUNING.perCell,
  open: (w: WorldView, id: string) => realmOpen(w, constellationRealm(id)),
}
