import { atomHolds, gateInput, type GateAtom, type UnlockGate, type WorldView } from '@engine/core'
import type { UiValue } from './context'

/** Unlock gate as short texts for the UI. */
export function gateLines(gate: UnlockGate | undefined, ui: UiValue): { all: string[]; any: string[] } {
  const atom = (a: NonNullable<UnlockGate['all']>[number]): string => {
    switch (a.kind) {
      case 'prestige':
        return ui.t.upgrade.gatePrestige(ui.labels.layer(a.layer).name, String(a.count))
      case 'primaryRun':
        return ui.t.upgrade.gatePrimary(ui.fmt(a.amount))
      case 'producer':
        return ui.t.upgrade.gateProducer(ui.labels.producer(a.id).name, String(a.level))
      case 'level':
        return ui.t.upgrade.gateLevel(String(a.level))
    }
  }
  return { all: (gate?.all ?? []).map(atom), any: (gate?.any ?? []).map(atom) }
}

export interface GateCheck {
  text: string
  ok: boolean
}

/** The same gate as a checklist: each condition with whether it already holds. */
export function gateChecks(gate: UnlockGate | undefined, ui: UiValue, world: WorldView): { all: GateCheck[]; any: GateCheck[] } {
  const lines = gateLines(gate, ui)
  const input = gateInput(world)
  const check = (atoms: readonly GateAtom[] | undefined, texts: string[]): GateCheck[] => (atoms ?? []).map((a, i) => ({ text: texts[i], ok: atomHolds(a, input) }))
  return { all: check(gate?.all, lines.all), any: check(gate?.any, lines.any) }
}
