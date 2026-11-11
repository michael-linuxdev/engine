import { useEffect, useRef, useState } from 'react'
import { useUi } from '../useUi'

/** Class put on the element a coach step points at. */
const TARGET_CLASS = 'ek-coach-target'

/**
 * FTUE coach: one step at a time. It can name its place ("step 2 of 6"),
 * highlight its target (an element found by `data-testid`), offer the action
 * itself as a button, and it moves to the bottom when it would cover the target.
 */
export function FtueCoach({ title, body, skipLabel, onSkip, testId = 'ftue', step, target, action }: {
  title: string
  body: string
  skipLabel: string
  onSkip: () => void
  testId?: string
  /** Position in the sequence, e.g. [2, 6]. */
  step?: readonly [number, number]
  /** `data-testid` of the element this step is about. */
  target?: string
  action?: { label: string; onAct: () => void }
}) {
  const ui = useUi()
  const ref = useRef<HTMLElement>(null)
  const [low, setLow] = useState(false)
  useEffect(() => {
    if (!target) return
    let el: Element | null = null
    const mark = () => {
      const found = document.querySelector(`[data-testid="${target}"]`)
      if (found !== el) {
        el?.classList.remove(TARGET_CLASS)
        el = found
        el?.classList.add(TARGET_CLASS)
      }
      // Give way when the coach would cover its own target
      const a = ref.current?.getBoundingClientRect()
      const b = el?.getBoundingClientRect()
      if (a && b && !low) setLow(a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top)
    }
    mark()
    // The target may appear a little later (another tab, a sheet closing)
    const id = setInterval(mark, 500)
    return () => {
      clearInterval(id)
      el?.classList.remove(TARGET_CLASS)
    }
  }, [target, low])
  return (
    <aside ref={ref} className={`ek-coach${low ? ' ek-coach--low' : ''}`} role="status" aria-live="polite" data-testid={testId} data-target={target}>
      {step ? (
        <span className="ek-coach__step" data-testid={`${testId}-step`}>
          {ui.t.live.coachStep(String(step[0]), String(step[1]))}
        </span>
      ) : null}
      <strong className="ek-coach__title">{title}</strong>
      <span>{body}</span>
      <div className="ek-row-actions ek-coach__actions">
        <button type="button" className="ek-btn ek-btn--ghost ek-btn--small" data-testid={`${testId}-skip`} onClick={onSkip}>
          {skipLabel}
        </button>
        {action ? (
          <button type="button" className="ek-btn ek-btn--primary ek-btn--small" data-testid={`${testId}-act`} onClick={action.onAct}>
            {action.label}
          </button>
        ) : null}
      </div>
    </aside>
  )
}
