import { useEffect, useState, type ReactNode } from 'react'
import { layerForecast, layerMilestones, layerStatus, MODULE, prestigeState } from '@engine/core'
import { useEngine } from '@engine/react'
import { useUi } from '../useUi'
import { Button } from './Button'
import { ProgressBar } from './ProgressBar'

/** Seconds the outlook looks ahead ("in 10 minutes it would be …"). */
const FORECAST_SECONDS = 600
/** Time (ms) the second tap of a higher layer stays armed. */
const CONFIRM_MS = 4000

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
  const ms = layerMilestones(world, layer)
  const pct = (x: number) => String(Math.round(x * 1000) / 10)
  const cur = ui.labels.currency(ldef.currency)
  const forecast = layerForecast(world, layer, FORECAST_SECONDS)
  // Higher layers reset far more: they start only on the second tap
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    if (!armed) return
    const id = setTimeout(() => setArmed(false), CONFIRM_MS)
    return () => clearTimeout(id)
  }, [armed])
  const ready = st.block === null
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
      {/* Outlook: when the gate is reached, and what a little patience would add */}
      {forecast && st.block === 'earned' && Number.isFinite(forecast.secondsToGate) && forecast.secondsToGate > 0 ? (
        <p data-testid={`forecast-gate-${layer}`}>{ui.t.prestige.toGate(ui.duration(forecast.secondsToGate * 1000))}</p>
      ) : null}
      <p className="ek-strong">{ui.t.prestige.payout(ui.fmt(st.payout), cur)}</p>
      {forecast && ready && forecast.payoutLater > st.payout ? (
        <p className="ek-muted" data-testid={`forecast-later-${layer}`}>{ui.t.prestige.later(ui.fmt(forecast.payoutLater), cur)}</p>
      ) : null}
      {reason ? <p className="ek-muted">{reason}</p> : null}
      {l.keeps?.length || l.loses?.length ? (
        <div className="ek-keeps" data-testid={`keeps-${layer}`}>
          <div className="ek-keeps__box ek-keeps__box--stay">
            <strong>{ui.t.prestige.keeps}</strong>
            <ul>{(l.keeps ?? []).map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className="ek-keeps__box ek-keeps__box--go">
            <strong>{ui.t.prestige.loses}</strong>
            <ul>{(l.loses ?? []).map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
      ) : reason ? null : (
        <p className="ek-muted">{ui.t.prestige.resetInfo}</p>
      )}
      <Button
        data-testid={`prestige-${layer}`}
        disabled={!ready}
        onClick={() => {
          if (st.index > 0 && !armed) return setArmed(true)
          setArmed(false)
          const payout = st.payout
          if (dispatch(MODULE.prestige, 'perform', { layer })) onPerformed?.(layer, payout)
        }}
      >
        {armed ? ui.t.prestige.confirm : ready ? ui.t.prestige.actionWith(l.action, ui.fmt(st.payout), cur) : l.action}
      </Button>
      <p className="ek-muted">{ui.t.prestige.count(String(count))}</p>
      {ms.total > 0 ? (
        <div className="ek-note ek-milestones" data-testid={`milestones-${layer}`} data-reached={ms.reached}>
          <strong>{ui.t.prestige.milestones(String(ms.reached), String(ms.total))}</strong>
          <ProgressBar ratio={ms.next ? Math.min(1, count / ms.next.at) : 1} label={ui.t.prestige.milestones(String(ms.reached), String(ms.total))} />
          {ms.next ? (
            <>
              <span>{ui.t.prestige.milestoneNext(String(ms.next.at))}</span>
              {ms.next.reward?.length ? <span className="ek-muted">{ui.t.prestige.milestoneReward(ms.next.reward.map((r) => `${ui.fmt(r.amount)} ${ui.labels.currency(r.currency)}`).join(', '))}</span> : null}
              {ms.next.bonus ? <span className="ek-muted">{ui.t.prestige.milestoneBonus(pct(ms.next.bonus))}</span> : null}
            </>
          ) : (
            <span>{ui.t.prestige.milestonesDone}</span>
          )}
          {ms.bonus > 0 ? <span className="ek-muted">{ui.t.prestige.milestoneTotal(pct(ms.bonus))}</span> : null}
        </div>
      ) : null}
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

export interface PrestigeSection {
  id: string
  label: string
  view: ReactNode
}

/**
 * The whole new-beginning tab: jump buttons, the layers, further sections of
 * the game (meta shop, challenges …) and a fixed bar with the button of the
 * first layer once it is ready.
 */
export function PrestigeTab({ onPerformed, art, sections, title }: { onPerformed?: (layer: string, payout: number) => void; art?: (layer: string) => ReactNode; sections: readonly PrestigeSection[]; /** Label of the jump button to the layers (default: the engine's word). */ title?: string }) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const first = world.def.prestigeLayers[0]
  const st = first ? layerStatus(world, first.id) : null
  const jump = (id: string) => document.getElementById(`ptab-${id}`)?.scrollIntoView({ block: 'start' })
  return (
    <div className="ek-ptab" data-testid="prestige-tab">
      {sections.length ? (
        <div className="ek-segmented ek-ptab__jump" role="group" aria-label={ui.t.prestige.title}>
          <button type="button" data-testid="ptab-jump-layers" onClick={() => jump('layers')}>
            {title ?? ui.t.prestige.title}
          </button>
          {sections.map((x) => (
            <button key={x.id} type="button" data-testid={`ptab-jump-${x.id}`} onClick={() => jump(x.id)}>
              {x.label}
            </button>
          ))}
        </div>
      ) : null}
      <div id="ptab-layers">
        <PrestigePanel onPerformed={onPerformed} art={art} />
      </div>
      {sections.map((x) => (
        <div key={x.id} id={`ptab-${x.id}`} data-testid={`ptab-${x.id}`}>
          {x.view}
        </div>
      ))}
      {first && st && st.block === null ? (
        <div className="ek-ptab__bar">
          <Button
            data-testid="prestige-bar"
            onClick={() => {
              const payout = st.payout
              if (dispatch(MODULE.prestige, 'perform', { layer: first.id })) onPerformed?.(first.id, payout)
            }}
          >
            {ui.t.prestige.actionWith(ui.labels.layer(first.id).action, ui.fmt(st.payout), ui.labels.currency(first.currency))}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
