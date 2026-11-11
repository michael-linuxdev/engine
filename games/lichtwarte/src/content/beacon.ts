/**
 * Großes Leuchtfeuer (Jahr 5): ein Bauwerk in 30 Stufen, an dem alle Lande mitbauen. Für eine Stufe gibt
 * jedes Land einmal aus seinem eigenen Vorrat (sechs Stunden seines Ertrags); die Stufe ist fertig, wenn
 * genug Lande gegeben haben. Danach muss sie acht Tage ruhen. Jede Stufe gibt Ertrag.
 */
import { regionRate, REGIONS_ID, type MonumentConfig, type RegionsState, type WorldView } from '@engine/core'
import { REALM_IDS, REALMS } from './realms'

const realmDef = new Map(REALMS.regions.map((r) => [r.id, r]))

/** Stellschrauben: Stufe n braucht 8 + 3·n Lande (8 bis 95); zusammen 1.545 Gaben über 30 Stufen und mindestens 232 Tage Ruhezeit. */
export const BEACON_TUNING = { stages: 30, needBase: 8, needStep: 3, shareHours: 6, setDays: 8, perStage: 0.03 }

const TAG = 'beacon'

/** Kann das Land gerade seinen Teil geben (offen, mit Ertrag, Vorrat reicht)? */
export function realmCanGive(w: WorldView, id: string): boolean {
  const def = realmDef.get(id)
  const r = w.get<RegionsState | undefined>(REGIONS_ID)?.regions[id]
  if (!def || !r?.open) return false
  const share = regionRate(REALMS, def, r, w) * BEACON_TUNING.shareHours * 3600
  return share > 0 && r.balance >= share
}

export const BEACON_PLACES: readonly string[] = REALM_IDS

export const GREAT_BEACON: MonumentConfig = {
  stages: BEACON_TUNING.stages,
  need: (stage) => BEACON_TUNING.needBase + BEACON_TUNING.needStep * stage,
  setMs: BEACON_TUNING.setDays * 86_400_000,
  perStage: BEACON_TUNING.perStage,
  pay: (w, place) => (realmCanGive(w, place) ? { module: REGIONS_ID, type: 'pay', payload: { region: place, seconds: BEACON_TUNING.shareHours * 3600, tag: TAG } } : null),
  paid: { type: 'region.paid', place: (e) => (e.tag === TAG && typeof e.region === 'string' ? e.region : null) },
}
