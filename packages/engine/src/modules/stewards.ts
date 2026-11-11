/**
 * Stewards: helpers that are trained one at a time (cost and time grow) and
 * then posted to a place, where they do one step of work per interval — also
 * for the time the game was closed, up to a cap. What "work" is, the game
 * decides (a follow-up action, e.g. building the weakest area of a region).
 * Every trained steward adds a little income.
 */
import { act } from '../result'
import { isRecord, parseInt0, parseTime } from '../state'
import type { DispatchRequest, EffectSource, EngineModule, WorldView } from '../types'

export interface StewardsConfig {
  max: number
  /** Price to start training steward n (0-based): base × growth^n. */
  cost: { currency: string; base: number; growth: number }
  /** Training time of steward n: base × growth^n. */
  trainMs: { base: number; growth: number }
  /** One step of work per posted steward every so often. */
  everyMs: number
  /** Most steps made up for at once (after a long absence). */
  maxSteps: number
  /** Income added per trained steward (0.01 = +1 %). */
  perSteward: number
  /** May a steward be posted here? */
  canPost: (w: WorldView, place: string) => boolean
  /** The work of one steward at its place for `steps` steps, or null if there is nothing to do. */
  work: (w: WorldView, place: string, steps: number) => DispatchRequest | null
}

export interface StewardsState {
  trained: number
  /** End of the running training (0 = none). */
  until: number
  /** Place of each trained steward ('' = not posted). */
  posts: string[]
  /** Time up to which work has been done. */
  workedAt: number
}

export const STEWARDS_ID = 'stewards'

export function stewardCost(cfg: StewardsConfig, s: StewardsState): number {
  return Math.round(cfg.cost.base * Math.pow(cfg.cost.growth, s.trained))
}

export function stewardTrainMs(cfg: StewardsConfig, s: StewardsState): number {
  return Math.round(cfg.trainMs.base * Math.pow(cfg.trainMs.growth, s.trained))
}

/** A new training can start now (none running, not at the limit, price covered). */
export function stewardCanTrain(cfg: StewardsConfig, s: StewardsState, w: WorldView): boolean {
  return s.until === 0 && s.trained < cfg.max && w.balance(cfg.cost.currency) >= stewardCost(cfg, s)
}

/** A trained steward without a post. */
export function stewardIdle(s: StewardsState): boolean {
  return s.posts.slice(0, s.trained).some((p) => !p) || s.posts.length < s.trained
}

export function stewardsModule(cfg: StewardsConfig): EngineModule<StewardsState> {
  const posts = (s: StewardsState) => Array.from({ length: s.trained }, (_, i) => s.posts[i] ?? '')
  return {
    id: STEWARDS_ID,
    version: 1,
    init: (ctx) => ({ trained: 0, until: 0, posts: [], workedAt: ctx.clock.now() }),
    parse: (raw, ctx) => {
      const r = isRecord(raw) ? raw : {}
      const trained = parseInt0(r.trained, 0, cfg.max)
      const src = Array.isArray(r.posts) ? r.posts : []
      const seen = new Set<string>()
      const list = Array.from({ length: trained }, (_, i) => {
        const p = typeof src[i] === 'string' ? (src[i] as string) : ''
        if (!p || seen.has(p)) return ''
        seen.add(p)
        return p
      })
      return { trained, until: trained < cfg.max ? parseTime(r.until, 0) : 0, posts: list, workedAt: parseTime(r.workedAt, ctx.clock.now()) }
    },
    resetOn: 'keep',
    tick: (s, _dt, ctx, w) => {
      const now = ctx.clock.now()
      let next = s
      const events = []
      if (next.until > 0 && now >= next.until && next.trained < cfg.max) {
        next = { ...next, trained: next.trained + 1, until: 0, posts: [...posts(next), ''] }
        events.push({ type: 'steward.trained', n: next.trained })
      }
      const steps = Math.min(cfg.maxSteps, Math.floor((now - next.workedAt) / cfg.everyMs))
      if (steps <= 0) return events.length ? act(next, { events }) : next
      const dispatch: DispatchRequest[] = []
      for (const place of posts(next)) {
        if (!place) continue
        const job = cfg.work(w, place, steps)
        if (job) dispatch.push(job)
      }
      // Time moves on even without work, so an idle hour is not made up for later
      next = { ...next, workedAt: now }
      return act(next, { events, dispatch })
    },
    effects: (s): EffectSource[] => (s.trained > 0 ? [{ id: 'stewards', target: 'income', op: 'mul', value: 1 + cfg.perSteward * s.trained, labelKey: 'effect.stewards' }] : []),
    actions: {
      train: (s, _p, ctx, w) => {
        if (!stewardCanTrain(cfg, s, w)) return s
        return act({ ...s, until: ctx.clock.now() + stewardTrainMs(cfg, s) }, { spend: [{ currency: cfg.cost.currency, amount: stewardCost(cfg, s) }], events: [{ type: 'steward.training', n: s.trained + 1 }] })
      },
      post: (s, p, _ctx, w) => {
        const { slot, place } = (p ?? {}) as { slot?: number; place?: string }
        const i = Math.floor(Number(slot))
        if (!(i >= 0 && i < s.trained)) return s
        const list = posts(s)
        const to = place ?? ''
        if (to && (list.includes(to) || !cfg.canPost(w, to))) return s
        if (list[i] === to) return s
        list[i] = to
        return act({ ...s, posts: list }, { events: [{ type: 'steward.posted', slot: i, place: to }] })
      },
    },
    playtestEvents: ['steward.training', 'steward.trained', 'steward.posted'],
    sample: () => ({ trained: Math.min(2, cfg.max), until: 1_800_000_100_000, posts: Array.from({ length: Math.min(2, cfg.max) }, () => ''), workedAt: 1_800_000_000_000 }),
  }
}
