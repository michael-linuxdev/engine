import type { ReactNode } from 'react'
import { nextGoal } from '@engine/core'
import { useEngine } from '@engine/react'
import { useUi } from '../useUi'
import { ProgressBar } from './ProgressBar'

/** Top HUD: primary amount + rate (tap opens the bonus breakdown), goal strip, slots for game extras. */
export function Hud({ primaryId, icon, extra, goalText }: { primaryId: string; icon?: ReactNode; extra?: ReactNode; goalText?: (g: ReturnType<typeof nextGoal>) => string | null }) {
  const ui = useUi()
  const { state, world } = useEngine(ui.rt)
  const goal = nextGoal(world)
  const text = goalText?.(goal) ?? null
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
      {text ? (
        <div className="ek-goal" data-testid="goal">
          <span className="ek-goal__text">{text}</span>
          <ProgressBar ratio={ratio} label={text} />
        </div>
      ) : null}
    </header>
  )
}
