/**
 * Wächterschule (Jahr 4): Lehrlinge werden einzeln ausgebildet (Lichtkiesel und Zeit, beides wächst) und dann
 * einem Land zugeteilt. Dort bauen sie von selbst weiter: immer den schwächsten Bereich, den sich das Land
 * leisten kann, auch für die Zeit der Abwesenheit (bis zu zwölf Stunden). IDs gibt es keine; gezählt wird.
 */
import { areaOpen, bulkCost, regionCostMult, REGIONS_ID, type RegionsState, type StewardsConfig, type WorldView } from '@engine/core'
import { CURRENCY } from '../ids'
import { realmOpen } from './fireRoad'
import { REALMS } from './realms'

const realmDef = new Map(REALMS.regions.map((r) => [r.id, r]))

/**
 * Stellschrauben: 20 Lehrlinge. Der erste kostet 200 Lichkiesel und zwei Tage, jeder weitere 15 % mehr Kiesel
 * und 12 % mehr Zeit (der zwanzigste rund 2.800 Kiesel und 17 Tage; alle zusammen rund 20.500 Kiesel und
 * 144 Tage Ausbildung). Ein Schritt alle zehn Minuten, höchstens 72 Schritte nachgeholt (zwölf Stunden).
 */
export const SCHOOL_TUNING = { max: 20, costBase: 200, costGrowth: 1.15, trainDays: 2, trainGrowth: 1.12, everyMin: 10, maxSteps: 72, perSteward: 0.01 }

/** Der schwächste offene Bereich eines Landes, von dem sich mindestens eine Stufe bezahlen lässt, und wie viele Stufen (bis `steps`). */
export function stewardJob(w: WorldView, id: string, steps: number): { area: string; count: number } | null {
  const def = realmDef.get(id)
  const r = w.get<RegionsState | undefined>(REGIONS_ID)?.regions[id]
  if (!def || !r?.open) return null
  const mult = regionCostMult(REALMS, r)
  let best: { area: string; level: number; index: number } | null = null
  def.areas.forEach((a, i) => {
    if (!areaOpen(def, r, i)) return
    const n = r.owned[a.id] ?? 0
    if (bulkCost(a, n, 1, mult) > r.balance) return
    if (!best || n < best.level) best = { area: a.id, level: n, index: i }
  })
  if (!best) return null
  const pick = best as { area: string; level: number; index: number }
  const a = def.areas[pick.index]
  let count = 1
  while (count < steps && bulkCost(a, pick.level, count + 1, mult) <= r.balance) count += 1
  return { area: pick.area, count }
}

export const SCHOOL: StewardsConfig = {
  max: SCHOOL_TUNING.max,
  cost: { currency: CURRENCY.glowPebbles, base: SCHOOL_TUNING.costBase, growth: SCHOOL_TUNING.costGrowth },
  trainMs: { base: SCHOOL_TUNING.trainDays * 86_400_000, growth: SCHOOL_TUNING.trainGrowth },
  everyMs: SCHOOL_TUNING.everyMin * 60_000,
  maxSteps: SCHOOL_TUNING.maxSteps,
  perSteward: SCHOOL_TUNING.perSteward,
  canPost: realmOpen,
  work: (w, place, steps) => {
    const job = stewardJob(w, place, steps)
    return job ? { module: REGIONS_ID, type: 'buy', payload: { region: place, area: job.area, count: job.count } } : null
  },
}
