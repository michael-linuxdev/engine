/**
 * Timed events that need the clock in their slice (effects only read slices):
 *  - weekendEvent: a weekly window (local time), income boost, goal + reward
 *  - flash: short random windows with a fair cooldown and a grace period
 */
import { localDayKey, localParts, weekKey } from '../clock'
import type { Clock } from '../clock'
import { act } from '../result'
import { isRecord, parseBool, parseNum, parseTime } from '../state'
import type { Amount, EffectSource, EngineModule, WorldView } from '../types'

/* ---------------- weekend ---------------- */

export interface WeekendConfig {
  /** Start weekday (0 = Sunday … 6 = Saturday) and hour, end weekday and hour (exclusive). */
  from: { weekday: number; hour: number }
  to: { weekday: number; hour: number }
  mult: number
  /** Goal in seconds of income at window start. */
  goalSeconds: number
  reward: readonly Amount[]
}

export interface WeekendState {
  week: string
  active: boolean
  earned: number
  goal: number
  claimed: boolean
}

export const WEEKEND_ID = 'weekendEvent'

/** Minutes since Sunday 00:00 local. */
function weekMinute(clock: Clock): number {
  const p = localParts(clock)
  return p.weekday * 1440 + p.hour * 60 + p.minute
}

export function inWeekend(cfg: WeekendConfig, clock: Clock): boolean {
  const m = weekMinute(clock)
  const a = cfg.from.weekday * 1440 + cfg.from.hour * 60
  const b = cfg.to.weekday * 1440 + cfg.to.hour * 60
  return a <= b ? m >= a && m < b : m >= a || m < b
}

export function weekendModule(cfg: WeekendConfig): EngineModule<WeekendState> {
  const update = (s: WeekendState, clock: Clock, w: WorldView): WeekendState => {
    const active = inWeekend(cfg, clock)
    const week = weekKey(localDayKey(clock))
    if (active && s.week !== week) return { week, active, earned: 0, goal: Math.max(1000, w.rate() * cfg.goalSeconds), claimed: false }
    return s.active === active ? s : { ...s, active }
  }
  return {
    id: WEEKEND_ID,
    version: 1,
    init: () => ({ week: '', active: false, earned: 0, goal: 0, claimed: false }),
    parse: (raw) => {
      const r = isRecord(raw) ? raw : {}
      return { week: typeof r.week === 'string' ? r.week : '', active: parseBool(r.active), earned: parseNum(r.earned), goal: parseNum(r.goal), claimed: parseBool(r.claimed) }
    },
    resetOn: 'keep',
    tick: (s, _dt, ctx, w) => update(s, ctx.clock, w),
    onOffline: (s, _ms, ctx, w) => update(s, ctx.clock, w),
    on: (s, e) => (s.active && e.type === 'primary.gained' && s.earned < s.goal ? { ...s, earned: Math.min(s.goal, s.earned + (Number(e.amount) || 0)) } : s),
    effects: (s) => (s.active ? [{ id: 'weekend', target: 'income', op: 'mul', value: cfg.mult, labelKey: 'effect.weekend' }] : []),
    actions: {
      claim: (s) => (s.claimed || s.goal <= 0 || s.earned < s.goal ? s : act({ ...s, claimed: true }, { grant: cfg.reward.map((r) => ({ ...r, source: 'weekend' })), events: [{ type: 'weekend.claimed' }] })),
    },
    playtestEvents: ['weekend.claimed'],
    sample: () => ({ week: '2026-W45', active: true, earned: 500, goal: 2000, claimed: false }),
  }
}

/* ---------------- flash ---------------- */

export interface FlashConfig {
  durationMs: number
  cooldownMs: number
  /** Chance to start when the cooldown is over (checked once per check interval). */
  chance: number
  checkMs: number
  mult: number
  goalSeconds: number
  graceMs: number
  reward: readonly Amount[]
}

export interface FlashState {
  /** Next time a window may start. */
  nextAt: number
  /** End of the running window (0 = none). */
  endsAt: number
  /** Boost running (window open and not yet over). */
  active: boolean
  earned: number
  goal: number
  claimed: boolean
  count: number
}

export const FLASH_ID = 'flash'

export function flashModule(cfg: FlashConfig): EngineModule<FlashState> {
  return {
    id: FLASH_ID,
    version: 1,
    init: (ctx) => ({ nextAt: ctx.clock.now() + cfg.cooldownMs / 2, endsAt: 0, active: false, earned: 0, goal: 0, claimed: false, count: 0 }),
    parse: (raw, ctx) => {
      const r = isRecord(raw) ? raw : {}
      return { nextAt: parseTime(r.nextAt, ctx.clock.now()), endsAt: parseTime(r.endsAt, 0), active: parseBool(r.active), earned: parseNum(r.earned), goal: parseNum(r.goal), claimed: parseBool(r.claimed), count: parseNum(r.count) }
    },
    resetOn: 'keep',
    tick: (s, _dt, ctx, w) => {
      const now = ctx.clock.now()
      if (s.endsAt > 0) {
        // Window over and grace over (or claimed) → schedule the next one.
        if (now >= s.endsAt + cfg.graceMs || (now >= s.endsAt && s.claimed)) return { ...s, endsAt: 0, active: false, nextAt: now + cfg.cooldownMs }
        return now >= s.endsAt && s.active ? { ...s, active: false } : s
      }
      if (now < s.nextAt) return s
      // The first window is guaranteed; later ones roll the chance.
      if (s.count > 0 && ctx.rng.next() >= cfg.chance) return { ...s, nextAt: now + cfg.checkMs }
      return act({ ...s, endsAt: now + cfg.durationMs, active: true, earned: 0, goal: Math.max(400, w.rate() * cfg.goalSeconds), claimed: false, count: s.count + 1 }, { events: [{ type: 'flash.started' }] })
    },
    on: (s, e) => (s.active && e.type === 'primary.gained' && s.earned < s.goal ? { ...s, earned: Math.min(s.goal, s.earned + (Number(e.amount) || 0)) } : s),
    effects: (s) => (s.active ? [{ id: 'flash', target: 'income', op: 'mul', value: cfg.mult, labelKey: 'effect.flash' } as EffectSource] : []),
    actions: {
      claim: (s, _p, ctx) =>
        s.endsAt === 0 || s.claimed || s.earned < s.goal || ctx.clock.now() > s.endsAt + cfg.graceMs ? s : act({ ...s, claimed: true }, { grant: cfg.reward.map((r) => ({ ...r, source: 'flash' })), events: [{ type: 'flash.claimed' }] }),
    },
    playtestEvents: ['flash.started', 'flash.claimed'],
    sample: () => ({ nextAt: 1_800_000_000_000, endsAt: 1_800_000_100_000, active: true, earned: 10, goal: 400, claimed: false, count: 3 }),
  }
}
