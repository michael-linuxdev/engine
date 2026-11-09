import type { ActionResult, StepResult } from './types'

/**
 * Brand of action results. A registry symbol (not a WeakSet) so results stay
 * recognisable even if the engine is bundled twice (tools, tests).
 */
const RESULT = Symbol.for('idle-engine.result')

/**
 * Wrap a new slice with side effects (spend, grant, events, follow-ups,
 * prestige). Plain return values are treated as the new slice.
 */
export function act<S>(state: S, rest: Omit<ActionResult<S>, 'state'> = {}): ActionResult<S> {
  const r: ActionResult<S> = { ...rest, state }
  Object.defineProperty(r, RESULT, { value: true, enumerable: false })
  return r
}

export function isResult<S>(r: StepResult<S>): r is ActionResult<S> {
  return typeof r === 'object' && r !== null && (r as Record<symbol, unknown>)[RESULT] === true
}
