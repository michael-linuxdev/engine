import { useEffect, useRef, useState, type ReactNode } from 'react'
import { nextGoal, pressingGoal, type PressingGoal } from '@engine/core'
import { useEngine } from '@engine/react'
import type { UiValue } from '../uiContext'
import { useUi } from '../useUi'
import { ProgressBar } from './ProgressBar'

/** Top HUD: primary amount + rate (tap opens the bonus breakdown), goal strip, slots for game extras. */
export function Hud({ primaryId, icon, extra, sub, goalText, goalNote, onGoal, pressing }: { primaryId: string; icon?: ReactNode; extra?: ReactNode; /** Slim row below the amount (side currencies …). */ sub?: ReactNode; goalText?: (g: ReturnType<typeof nextGoal>) => string | null; /** Second, quieter line of the goal strip (what comes after, how long it takes). */ goalNote?: (g: ReturnType<typeof nextGoal>, ui: UiValue) => string | null; /** Makes the goal strip a button: it leads to what the goal names. */ onGoal?: (g: ReturnType<typeof nextGoal>) => void
  /**
   * The pressing goal instead of the fixed order above: of next upgrade, next unlock, next level and the first
   * prestige layer, the strip shows whatever is closest to done, with its numbers on the right.
   */
  pressing?: { text: (g: PressingGoal, ui: UiValue) => { title: string; detail?: string } | null; note?: (g: PressingGoal, ui: UiValue) => string | null; onGoal?: (g: PressingGoal) => void }
}) {
  const ui = useUi()
  const { state, world } = useEngine(ui.rt)
  const goal = nextGoal(world)
  const text = goalText?.(goal) ?? null
  const note = text ? (goalNote?.(goal, ui) ?? null) : null
  const ratio = goal.kind === 'unlock' || goal.kind === 'milestone' || goal.kind === 'prestigeProgress' ? goal.ratio : 1
  return (
    <header className="ek-hud">
      <button type="button" className="ek-hud__amount" data-fx="hud" data-fx-x="0.5" data-fx-y="1.7" data-testid="hud-amount-btn" onClick={() => ui.open('mult')}>
        {icon ? <span className="ek-hud__icon" data-fx="hud-icon" aria-hidden="true">{icon}</span> : null}
        <Amount value={state.core.primary} />
        <span className="ek-visually-hidden">{ui.labels.currency(primaryId)}</span>
        <span className="ek-hud__rate">{ui.t.common.perSecond(ui.fmt(world.rate()))}</span>
        <span className="ek-visually-hidden">{ui.t.mult.title}</span>
      </button>
      {extra ? <div className="ek-hud__extra">{extra}</div> : null}
      {sub ? <div className="ek-hud__sub">{sub}</div> : null}
      {pressing ? <PressingStrip {...pressing} /> : null}
      {pressing ? null : text && onGoal ? (
        <button type="button" className="ek-goal ek-goal--btn" data-testid="goal" onClick={() => onGoal(goal)}>
          <span className="ek-goal__text">{text}</span>
          <ProgressBar ratio={ratio} label={text} />
          {note ? <span className="ek-goal__note" data-testid="goal-note">{note}</span> : null}
        </button>
      ) : text ? (
        <div className="ek-goal" data-testid="goal">
          <span className="ek-goal__text">{text}</span>
          <ProgressBar ratio={ratio} label={text} />
          {note ? <span className="ek-goal__note" data-testid="goal-note">{note}</span> : null}
        </div>
      ) : null}
    </header>
  )
}

/** Goal strip for the pressing goal: title left, numbers right, bar below; pulses while the goal is almost there. */
function PressingStrip({ text, note, onGoal }: NonNullable<Parameters<typeof Hud>[0]['pressing']>) {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const goal = pressingGoal(world)
  const x = text(goal, ui)
  if (!x) return null
  const line = note?.(goal, ui) ?? null
  const cls = `ek-goal ek-goal--split${goal.near ? ' is-near' : ''}${goal.ratio >= 1 ? ' is-ready' : ''}`
  const body = (
    <>
      <span className="ek-goal__head">
        <span className="ek-goal__text">{x.title}</span>
        {x.detail ? <span className="ek-goal__detail" data-testid="goal-detail">{x.detail}</span> : null}
      </span>
      <ProgressBar ratio={goal.ratio} label={x.title} />
      {line ? <span className="ek-goal__note" data-testid="goal-note">{line}</span> : null}
    </>
  )
  return onGoal ? (
    <button type="button" className={`${cls} ek-goal--btn`} data-testid="goal" data-kind={goal.kind} onClick={() => onGoal(goal)}>
      {body}
    </button>
  ) : (
    <div className={cls} data-testid="goal" data-kind={goal.kind}>
      {body}
    </div>
  )
}

/** Time (ms) the amount takes to count to a new value. */
const COUNT_MS = 260
/** A jump by more than this share makes the amount bump. */
const BUMP_SHARE = 0.25

/**
 * The amount counts toward its value instead of jumping, and bumps when it leaps (a find, a claim).
 * With reduced motion it shows the value at once.
 */
function Amount({ value }: { value: number }) {
  const ui = useUi()
  const [shown, setShown] = useState(value)
  const [bump, setBump] = useState(0)
  const from = useRef(value)
  const still = typeof document !== 'undefined' && (document.documentElement.classList.contains('ek-reduced-motion') || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const start = from.current
    from.current = value
    if (still || !Number.isFinite(value) || start === value) {
      setShown(value)
      return
    }
    if (value > start && value - start > Math.max(1, Math.abs(start)) * BUMP_SHARE) setBump((n) => n + 1)
    const t0 = performance.now()
    let raf = 0
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / COUNT_MS)
      setShown(start + (value - start) * k)
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, still])
  return (
    <span key={bump} className={`ek-hud__value${bump ? ' is-bump' : ''}`} data-testid="hud-amount" data-value={value}>
      {ui.fmt(shown)}
    </span>
  )
}
