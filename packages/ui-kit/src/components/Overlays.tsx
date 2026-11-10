import { Component, useEffect, useRef, useState, type ErrorInfo, type ReactNode } from 'react'
import { explain, MODULE, primaryCurrency, type OfflineState, type SaveBlock } from '@engine/core'
import { copyText, detectPlatform, installStepsKey, useEngine, useSaveBlock } from '@engine/react'
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

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/** Instruction text with the share icon in place of `{S}`. */
function StepText({ text, label }: { text: string; label: string }) {
  const parts = text.split('{S}')
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 ? (
            <svg className="ek-install__share" viewBox="0 0 24 24" width="18" height="18" role="img" aria-label={label}>
              <path d="M12 3v12M8 7l4-4 4 4M5 12v8h14v-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : null}
        </span>
      ))}
    </>
  )
}

/**
 * Full-screen "install the app first" for phones/tablets in the browser:
 * step-by-step instructions for the detected browser, the native install
 * prompt where the browser offers one, and the backup code to carry
 * progress over (`carryCode`, only passed when there is progress).
 */
export function InstallGate({ title, onSkip, art, carryCode }: { title: string; onSkip: () => void; art?: ReactNode; carryCode?: () => string }) {
  const { t } = useUi()
  const [platform] = useState(() => detectPlatform(typeof navigator === 'undefined' ? '' : navigator.userAgent, typeof navigator === 'undefined' ? 0 : navigator.maxTouchPoints))
  const [canNative, setCanNative] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const deferred = useRef<BeforeInstallPromptEvent | null>(null)
  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault()
      deferred.current = e as BeforeInstallPromptEvent
      setCanNative(true)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onSkip)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onSkip)
    }
  }, [onSkip])
  const g = t.install
  // On a desktop (forced by ?installGate=1) the Android/Chrome steps are the closest match
  const steps = g.steps[installStepsKey(platform.os === 'desktop' ? 'android' : platform.os, platform.os === 'desktop' ? 'chrome' : platform.browser)]
  const nativeInstall = async () => {
    const evt = deferred.current
    if (!evt) return
    await evt.prompt()
    const r = await evt.userChoice
    deferred.current = null
    setCanNative(false)
    if (r.outcome === 'accepted') onSkip()
  }
  const copy = async (text: string, ok: string) => setNote((await copyText(text)) ? ok : text)
  return (
    <div className="ek-fullscreen ek-install" role="dialog" aria-modal="true" aria-labelledby="ek-install-title" data-testid="install-gate">
      {art}
      <p className="ek-muted">{title}</p>
      <h1 id="ek-install-title" className="ek-h1">
        {g.title}
      </h1>
      <p>{g.body}</p>
      <section className="ek-card ek-install__card">
        <h2 className="ek-h3">{g.howTo}</h2>
        <p className="ek-muted" data-testid="install-detected">
          {g.detected(g.os[platform.os], g.browser[platform.browser])}
        </p>
        {canNative ? (
          <Button data-testid="install-native" onClick={() => void nativeInstall()}>
            {g.install}
          </Button>
        ) : null}
        <ol className="ek-steps" data-testid="install-steps">
          {steps.map((step, i) => (
            <li key={i}>
              <StepText text={step} label={g.share} />
            </li>
          ))}
        </ol>
        {platform.browser === 'inapp' || platform.browser === 'other' ? (
          <Button variant="secondary" size="small" onClick={() => void copy(location.origin + location.pathname, g.urlCopied)}>
            {g.copyUrl}
          </Button>
        ) : null}
      </section>
      <ul className="ek-steps ek-install__why">
        {g.why.map((w, i) => (
          <li key={i}>{w}</li>
        ))}
      </ul>
      {platform.os === 'ios' && platform.browser !== 'inapp' ? <p className="ek-note">{g.iosWarning}</p> : null}
      {carryCode ? (
        <section className="ek-card ek-install__card" data-testid="install-carry">
          <h2 className="ek-h3">{g.carryTitle}</h2>
          <p>{g.carryBody}</p>
          <Button variant="secondary" size="small" onClick={() => void copy(carryCode(), g.carryCopied)}>
            {g.carryCopy}
          </Button>
        </section>
      ) : null}
      {note ? (
        <p className="ek-note ek-install__note" role="status">
          {note}
        </p>
      ) : null}
      <Button variant="ghost" data-testid="install-skip" onClick={onSkip}>
        {g.skip}
      </Button>
      <p className="ek-muted">{g.skipNote}</p>
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
