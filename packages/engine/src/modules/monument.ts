/**
 * Monument: one great work built in stages over a long time. A stage is
 * finished when enough different places have each given their share; after
 * that the work has to set for a while before the next stage opens. The share
 * itself is paid by another module (the game says how: a follow-up action),
 * which answers with a `paid` event that this module counts.
 */
import { act } from '../result'
import { isRecord, parseInt0, parseTime } from '../state'
import type { DispatchRequest, EffectSource, EngineEvent, EngineModule, WorldView } from '../types'

export interface MonumentConfig {
  stages: number
  /** Places that have to give for stage n (0-based). */
  need: (stage: number) => number
  /** Wait after a finished stage. */
  setMs: number
  /** Income added per finished stage (0.03 = +3 %). */
  perStage: number
  /** The payment of one place (follow-up action), or null if the place cannot give right now. */
  pay: (w: WorldView, place: string) => DispatchRequest | null
  /** Event that confirms a payment, and how to read the place from it. */
  paid: { type: string; place: (e: EngineEvent) => string | null }
}

export interface MonumentState {
  stage: number
  /** Places that have given for the running stage. */
  given: string[]
  /** Earliest time the running stage takes gifts (0 = now). */
  readyAt: number
}

export const MONUMENT_ID = 'monument'

export interface MonumentStatus {
  stage: number
  stages: number
  done: boolean
  given: number
  need: number
  /** Time left until the stage opens (0 = open). */
  waitMs: number
}

export function monumentStatus(cfg: MonumentConfig, s: MonumentState | undefined, now: number): MonumentStatus {
  const stage = Math.min(cfg.stages, s?.stage ?? 0)
  const done = stage >= cfg.stages
  return { stage, stages: cfg.stages, done, given: s?.given.length ?? 0, need: done ? 0 : Math.max(1, cfg.need(stage)), waitMs: done ? 0 : Math.max(0, (s?.readyAt ?? 0) - now) }
}

/** Places that could give right now (stage open, not given yet, able to pay). */
export function monumentGivers(cfg: MonumentConfig, s: MonumentState | undefined, w: WorldView, places: readonly string[], now: number): string[] {
  const st = monumentStatus(cfg, s, now)
  if (st.done || st.waitMs > 0) return []
  return places.filter((p) => !s?.given.includes(p) && cfg.pay(w, p) !== null)
}

export function monumentModule(cfg: MonumentConfig): EngineModule<MonumentState> {
  return {
    id: MONUMENT_ID,
    version: 1,
    init: () => ({ stage: 0, given: [], readyAt: 0 }),
    parse: (raw) => {
      const r = isRecord(raw) ? raw : {}
      const stage = parseInt0(r.stage, 0, cfg.stages)
      const given = Array.isArray(r.given) ? [...new Set(r.given.filter((x): x is string => typeof x === 'string'))] : []
      return { stage, given: stage >= cfg.stages ? [] : given, readyAt: parseTime(r.readyAt, 0) }
    },
    resetOn: 'keep',
    on: (s, e, ctx) => {
      if (e.type !== cfg.paid.type || s.stage >= cfg.stages) return s
      const place = cfg.paid.place(e)
      if (!place || s.given.includes(place) || ctx.clock.now() < s.readyAt) return s
      const given = [...s.given, place]
      if (given.length < Math.max(1, cfg.need(s.stage))) return act({ ...s, given }, { events: [{ type: 'monument.given', place, given: given.length }] })
      const stage = s.stage + 1
      return act({ stage, given: [], readyAt: stage >= cfg.stages ? 0 : ctx.clock.now() + cfg.setMs }, { events: [{ type: 'monument.given', place, given: given.length }, { type: 'monument.stage', stage, done: stage >= cfg.stages }] })
    },
    effects: (s): EffectSource[] => (s.stage > 0 ? [{ id: 'monument', target: 'income', op: 'mul', value: 1 + cfg.perStage * s.stage, labelKey: 'effect.monument' }] : []),
    actions: {
      /** Ask the named places for their share; each payment is counted when its `paid` event arrives. */
      give: (s, p, ctx, w) => {
        const places = ((p as { places?: unknown } | undefined)?.places ?? []) as unknown[]
        const list = monumentGivers(cfg, s, w, places.filter((x): x is string => typeof x === 'string'), ctx.clock.now())
        // Not more than the stage still needs: nobody pays for nothing
        const left = Math.max(0, Math.max(1, cfg.need(s.stage)) - s.given.length)
        const dispatch = list.slice(0, left).map((place) => cfg.pay(w, place)).filter((x): x is DispatchRequest => x !== null)
        return dispatch.length ? act(s, { dispatch }) : s
      },
    },
    playtestEvents: ['monument.stage'],
    sample: () => ({ stage: Math.min(2, cfg.stages), given: [], readyAt: 1_800_000_100_000 }),
  }
}
