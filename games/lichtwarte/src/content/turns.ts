/**
 * Was eine Mondwende öffnet (für die Ziel-Zeile im Tal): Systeme und Bauwerke, die an der Zahl der
 * abgeschlossenen Mondwenden hängen. Abgeleitet aus FEATURES, WORLD_FEATURES und den Toren der Bauwerke.
 */
import { prestigeState, type WorldView } from '@engine/core'
import { game } from '../game'
import { LAYER } from '../ids'

/** Systeme je Mondwende (Schlüssel = Zahl der abgeschlossenen Mondwenden, ab der es offen ist). */
const SYSTEMS: Record<number, readonly string[]> = {
  1: ['collection', 'wheel'],
  2: ['guests'],
  3: ['decor', 'festivals'],
  4: ['folio', 'omens'],
  5: ['alchemy'],
  6: ['constellations', 'trials'],
  7: ['greatWorks'],
}

export interface TurnOpens {
  /** Die wievielte Mondwende es ist. */
  turn: number
  /** `title.<id>` der Systeme. */
  systems: readonly string[]
  /** IDs der Bauwerke. */
  producers: readonly string[]
}

/** Was die nächste Mondwende öffnet; `null`, wenn nichts mehr daran hängt. */
export function nextTurnOpens(w: WorldView): TurnOpens | null {
  const turn = (prestigeState(w).layers[0]?.count ?? 0) + 1
  const producers = game.producers.filter((p) => (p.unlock?.all ?? []).some((a) => a.kind === 'prestige' && a.layer === LAYER.moonturn && a.count === turn)).map((p) => p.id)
  const systems = SYSTEMS[turn] ?? []
  return systems.length || producers.length ? { turn, systems, producers } : null
}
