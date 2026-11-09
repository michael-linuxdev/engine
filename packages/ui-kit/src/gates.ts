import type { UnlockGate } from '@engine/core'
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
