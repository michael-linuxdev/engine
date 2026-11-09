import { Component, useState, type ErrorInfo, type ReactNode } from 'react'
import { explain, MODULE, primaryCurrency, type OfflineState, type SaveBlock } from '@engine/core'
import { useEngine, useSaveBlock } from '@engine/react'
import { useUi } from '../useUi'
import type { EngineStrings } from '../i18n/de'
import { Button } from './Button'
import { Sheet } from './Sheet'

/** Return summary ("offline basket"): shown while the offline module holds a pending basket. */
export function WelcomeBack({ art }: { art?: ReactNode }) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const pending = world.get<OfflineState>(MODULE.offline)?.pending
  if (!pending) return null
  const claim = () => dispatch(MODULE.offline, 'claim')
  return (
    <Sheet open title={ui.t.welcome.title} onClose={claim} testId="welcome-back">
      {art}
      <p>{ui.t.welcome.away(ui.duration(pending.elapsedMs))}</p>
      <p className="ek-strong">
        {ui.t.welcome.gained(ui.fmt(pending.gained))} {ui.labels.currency(primaryCurrency(world.def))}
      </p>
      {pending.capped ? <p className="ek-muted">{ui.t.welcome.capped}</p> : null}
      <Button data-testid="welcome-claim" onClick={claim}>
        {ui.t.welcome.claim}
      </Button>
    </Sheet>
  )
}

/** Bonus breakdown of the total income (one effect pipeline). */
export function MultSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ui = useUi()
  const { state, world } = useEngine(ui.rt)
  if (!open) return null
  const rows = world.def.producers
    .filter((p) => world.producerRate(p.id) > 0)
    .map((p) => {
      const n = (state.modules.producers as { owned: Record<string, number> }).owned[p.id] ?? 0
      return { p, r: explain(world.def, state, `rate:${p.id}`, p.baseRate * n) }
    })
  return (
    <Sheet open={open} title={ui.t.mult.title} onClose={onClose} testId="mult-sheet">
      {rows.length === 0 ? <p>{ui.t.mult.none}</p> : null}
      {rows.map(({ p, r }) => (
        <div key={p.id} className="ek-card">
          <strong>{ui.labels.producer(p.id).name}</strong>
          <table className="ek-table">
            <tbody>
              <tr>
                <th scope="row">{ui.t.mult.base}</th>
                <td>{ui.t.common.perSecond(ui.fmt(r.base))}</td>
              </tr>
              {r.parts.map((x) => (
                <tr key={x.id}>
                  <th scope="row">{ui.labels.effect(x.labelKey)}</th>
                  <td>{x.op === 'add' ? `+${ui.fmt(x.value)}` : x.op === 'mul' ? `×${ui.fmt(x.value)}` : `^${x.value}`}</td>
                </tr>
              ))}
              <tr>
                <th scope="row">{ui.t.mult.total}</th>
                <td className="ek-strong">{ui.t.common.perSecond(ui.fmt(r.value))}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </Sheet>
  )
}

/** Banner when saving is blocked (newer save, other tab, foreign data). */
export function SaveGuardBanner() {
  const ui = useUi()
  const block: SaveBlock = useSaveBlock(ui.rt.guard)
  if (block !== 'newer' && block !== 'otherTab' && block !== 'foreign') return null
  return (
    <div className="ek-banner" role="alert" data-testid={`save-guard-${block}`}>
      <span>{ui.t.saveGuard[block]}</span>
      <Button size="small" variant="secondary" onClick={() => location.reload()}>
        {ui.t.saveGuard.reload}
      </Button>
    </div>
  )
}

/** Full-screen "install the app first" for phones/tablets in the browser. */
export function InstallGate({ title, onSkip, art, onInstall }: { title: string; onSkip: () => void; art?: ReactNode; onInstall?: () => void }) {
  const { t } = useUi()
  return (
    <div className="ek-fullscreen" role="dialog" aria-modal="true" aria-labelledby="ek-install-title" data-testid="install-gate">
      {art}
      <p className="ek-muted">{title}</p>
      <h1 id="ek-install-title" className="ek-h1">
        {t.install.title}
      </h1>
      <p>{t.install.body}</p>
      <ul className="ek-steps">
        <li>{t.install.ios}</li>
        <li>{t.install.android}</li>
      </ul>
      {onInstall ? <Button onClick={onInstall}>{t.install.install}</Button> : null}
      <Button variant="ghost" data-testid="install-skip" onClick={onSkip}>
        {t.install.skip}
      </Button>
    </div>
  )
}

/** Test-phase notice (first start of the installed app): recording opt-out checkbox. */
export function TestPhaseNotice({ onDone }: { onDone: (record: boolean) => void }) {
  const { t } = useUi()
  const [record, setRecord] = useState(true)
  return (
    <Sheet open title={t.testPhase.title} onClose={() => onDone(record)} testId="test-phase">
      <p>{t.testPhase.body}</p>
      <label className="ek-check">
        <input type="checkbox" checked={record} onChange={(e) => setRecord(e.target.checked)} data-testid="test-phase-record" />
        <span>{t.testPhase.record}</span>
      </label>
      <Button data-testid="test-phase-ok" onClick={() => onDone(record)}>
        {t.testPhase.cta}
      </Button>
    </Sheet>
  )
}

/** Error boundary; the strings are passed in because it cannot use hooks. */
export class ErrorBoundary extends Component<{ strings: () => EngineStrings; children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('UI error', error, info.componentStack)
  }
  render() {
    if (!this.state.error) return this.props.children
    const t = this.props.strings()
    return (
      <div className="ek-fullscreen" role="alert" data-testid="error-boundary">
        <h1 className="ek-h1">{t.error.title}</h1>
        <p>{t.error.body}</p>
        <button type="button" className="ek-btn ek-btn--primary" onClick={() => location.reload()}>
          {t.error.reload}
        </button>
      </div>
    )
  }
}
