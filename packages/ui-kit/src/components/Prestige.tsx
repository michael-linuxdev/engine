import type { ReactNode } from 'react'
import { layerStatus, MODULE, prestigeState } from '@engine/core'
import { useEngine } from '@engine/react'
import { useUi } from '../useUi'
import { Button } from './Button'
import { ProgressBar } from './ProgressBar'

/** One block per prestige layer: progress to the gate, payout, block reason, perform. */
export function PrestigeLayerBlock({ layer, onPerformed, art }: { layer: string; onPerformed?: (layer: string, payout: number) => void; art?: ReactNode }) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const st = layerStatus(world, layer)
  const ldef = world.def.prestigeLayers[st.index]
  const l = ui.labels.layer(layer)
  const lower = st.index > 0 ? ui.labels.layer(world.def.prestigeLayers[st.index - 1].id).name : ''
  const reason =
    st.block === 'earned'
      ? ui.t.prestige.blockedEarned
      : st.block === 'producers'
        ? ui.t.prestige.blockedProducers(String(ldef.minimum?.producersOnline ?? 0))
        : st.block === 'lowerRuns'
          ? ui.t.prestige.blockedLower(String(ldef.minimum?.lowerRuns ?? 0), lower)
          : null
  const count = prestigeState(world).layers[st.index]?.count ?? 0
  return (
    <section className="ek-card ek-layer" data-testid={`layer-${layer}`} aria-labelledby={`layer-h-${layer}`}>
      {art}
      <h3 id={`layer-h-${layer}`} className="ek-h3">
        {l.name}
      </h3>
      <p>{l.blurb}</p>
      {st.probe ? <p className="ek-note">{ui.t.prestige.probe}</p> : null}
      <ProgressBar ratio={st.ratio} label={ui.t.prestige.progress(ui.fmt(st.earned), ui.fmt(st.gate))} />
      <p className="ek-muted">{ui.t.prestige.progress(ui.fmt(st.earned), ui.fmt(st.gate))}</p>
      <p className="ek-strong">{ui.t.prestige.payout(ui.fmt(st.payout), ui.labels.currency(ldef.currency))}</p>
      {reason ? <p className="ek-muted">{reason}</p> : <p className="ek-muted">{ui.t.prestige.resetInfo}</p>}
      <Button
        data-testid={`prestige-${layer}`}
        disabled={st.block !== null}
        onClick={() => {
          const payout = st.payout
          if (dispatch(MODULE.prestige, 'perform', { layer })) onPerformed?.(layer, payout)
        }}
      >
        {l.action}
      </Button>
      <p className="ek-muted">{ui.t.prestige.count(String(count))}</p>
    </section>
  )
}

/** Prestige panel: shows layer 0 always, higher layers once the one below has run (or `showAll`). */
export function PrestigePanel({ onPerformed, showAll, art }: { onPerformed?: (layer: string, payout: number) => void; showAll?: boolean; art?: (layer: string) => ReactNode }) {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const counts = prestigeState(world).layers.map((l) => l.count)
  const visible = world.def.prestigeLayers.filter((_, i) => showAll || i === 0 || (counts[i - 1] ?? 0) > 0 || (counts[i] ?? 0) > 0)
  return (
    <section className="ek-panel" aria-label={ui.t.prestige.title}>
      {visible.map((l) => (
        <PrestigeLayerBlock key={l.id} layer={l.id} onPerformed={onPerformed} art={art?.(l.id)} />
      ))}
    </section>
  )
}
