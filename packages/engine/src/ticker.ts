/**
 * Fixed-step logic clock (accumulator). Rendering runs separately in the UI;
 * long gaps (background tab, sleep) go through `applyOffline` instead of
 * thousands of ticks.
 */
import type { Clock } from './clock'
import { applyOffline, tick } from './engine'
import type { EngineState } from './state'
import type { EngineEvent, GameDefinition } from './types'

export interface AdvanceResult {
  state: EngineState
  acc: number
  steps: number
  events: EngineEvent[]
  /** True when the gap was handled as offline time. */
  offline: boolean
}

export function advance(def: GameDefinition, state: EngineState, realDtMs: number, acc: number, clock: Clock): AdvanceResult {
  const step = def.balance.tickMs
  const dt = Math.max(0, realDtMs)
  if (dt > def.balance.maxCatchupMs) {
    const r = applyOffline(def, state, clock)
    return { state: r.state, acc: 0, steps: 0, events: r.events, offline: true }
  }
  let a = acc + dt
  let s = state
  let steps = 0
  const events: EngineEvent[] = []
  while (a >= step) {
    const r = tick(def, s, step, clock)
    s = r.state
    events.push(...r.events)
    a -= step
    steps += 1
  }
  return { state: s, acc: a, steps, events, offline: false }
}
