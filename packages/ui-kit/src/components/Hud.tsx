import type { ReactNode } from 'react'
import { nextGoal } from '@engine/core'
import { useEngine } from '@engine/react'
import type { UiValue } from '../uiContext'
import { useUi } from '../useUi'
import { ProgressBar } from './ProgressBar'

/** Top HUD: primary amount + rate (tap opens the bonus breakdown), goal strip, slots for game extras. */
export function Hud({ primaryId, icon, extra, sub, goalText, goalNote, onGoal }: { primaryId: string; icon?: ReactNode; extra?: ReactNode; /** Slim row below the amount (side currencies …). */ sub?: ReactNode; goalText?: (g: ReturnType<typeof nextGoal>) => string | null; /** Second, quieter line of the goal strip (what comes after, how long it takes). */ goalNote?: (g: ReturnType<typeof nextGoal>, ui: UiValue) => string | null; /** Makes the goal strip a button: it leads to what the goal names. */ onGoal?: (g: ReturnType<typeof nextGoal>) => void }) {
  const ui = useUi()
  const { state, world } = useEngine(ui.rt)
  const goal = nextGoal(world)
  const text = goalText?.(goal) ?? null
  const note = text ? (goalNote?.(goal, ui) ?? null) : null
  const ratio = goal.kind === 'unlock' || goal.kind === 'milestone' || goal.kind === 'prestigeProgress' ? goal.ratio : 1
  return (
    <header className="ek-hud">
      <button type="button" className="ek-hud__amount" data-fx="hud" data-fx-x="0.72" data-testid="hud-amount-btn" onClick={() => ui.open('mult')}>
        {icon ? <span className="ek-hud__icon" data-fx="hud-icon" aria-hidden="true">{icon}</span> : null}
        <span className="ek-hud__value" data-testid="hud-amount">
          {ui.fmt(state.core.primary)}
        </span>
        <span className="ek-visually-hidden">{ui.labels.currency(primaryId)}</span>
        <span className="ek-hud__rate">{ui.t.common.perSecond(ui.fmt(world.rate()))}</span>
        <span className="ek-visually-hidden">{ui.t.mult.title}</span>
      </button>
      {extra ? <div className="ek-hud__extra">{extra}</div> : null}
      {sub ? <div className="ek-hud__sub">{sub}</div> : null}
      {text && onGoal ? (
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
