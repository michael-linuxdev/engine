import type { ActionResult, StepResult } from './types'

const results = new WeakSet<object>()

/**
 * Wrap a new slice with side effects (spend, grant, events, follow-ups,
 * prestige). Plain return values are treated as the new slice.
 */
export function act<S>(state: S, rest: Omit<ActionResult<S>, 'state'> = {}): ActionResult<S> {
  const r: ActionResult<S> = { ...rest, state }
  results.add(r)
  return r
}

export function isResult<S>(r: StepResult<S>): r is ActionResult<S> {
  return typeof r === 'object' && r !== null && results.has(r)
}
