/**
 * Weekly plan: a few goals per calendar week (ISO week, local time), each
 * counted from an event type. When all are met, one bonus can be claimed.
 * A new week starts empty; an unclaimed bonus of the old week is gone.
 */
import { localDayKey, weekKey, type Clock } from '../clock'
import { act } from '../result'
import { isRecord, parseBool, parseInt0 } from '../state'
import type { Amount, EngineModule } from '../types'

export interface WeeklyGoal {
  id: string
  /** Event type that counts one step (e.g. `daily.claimed`). */
  event: string
  target: number
}

export interface WeeklyPlanConfig {
  goals: readonly WeeklyGoal[]
  reward: readonly Amount[]
}

export interface WeeklyPlanState {
  week: string
  /** Steps per goal id this week. */
  progress: Record<string, number>
  claimed: boolean
}

export const WEEKLY_ID = 'weeklyPlan'

export function weeklyDone(s: WeeklyPlanState, cfg: WeeklyPlanConfig): boolean {
  return cfg.goals.every((g) => (s.progress[g.id] ?? 0) >= g.target)
}

export function weeklyPlanModule(cfg: WeeklyPlanConfig): EngineModule<WeeklyPlanState> {
  const fresh = (week: string): WeeklyPlanState => ({ week, progress: {}, claimed: false })
  const ensure = (s: WeeklyPlanState, clock: Clock): WeeklyPlanState => {
    const week = weekKey(localDayKey(clock))
    return s.week === week ? s : fresh(week)
  }
  return {
    id: WEEKLY_ID,
    version: 1,
    init: () => fresh(''),
    parse: (raw) => {
      const r = isRecord(raw) ? raw : {}
      const src = isRecord(r.progress) ? r.progress : {}
      const progress: Record<string, number> = {}
      for (const g of cfg.goals) {
        const v = parseInt0(src[g.id])
        if (v > 0) progress[g.id] = v
      }
      return { week: typeof r.week === 'string' ? r.week : '', progress, claimed: parseBool(r.claimed) }
    },
    resetOn: 'keep',
    tick: (s, _dt, ctx) => ensure(s, ctx.clock),
    onOffline: (s, _ms, ctx) => ensure(s, ctx.clock),
    on: (s, e, ctx) => {
      const cur = ensure(s, ctx.clock)
      const hit = cfg.goals.filter((g) => g.event === e.type && (cur.progress[g.id] ?? 0) < g.target)
      if (!hit.length) return cur
      const progress = { ...cur.progress }
      for (const g of hit) progress[g.id] = (progress[g.id] ?? 0) + 1
      return { ...cur, progress }
    },
    actions: {
      claim: (s, _p, ctx) => {
        const cur = ensure(s, ctx.clock)
        if (cur.claimed || !weeklyDone(cur, cfg)) return cur
        return act({ ...cur, claimed: true }, { grant: cfg.reward.map((g) => ({ ...g, source: 'weekly' })), events: [{ type: 'weekly.claimed', week: cur.week }] })
      },
    },
    playtestEvents: ['weekly.claimed'],
    sample: () => ({ week: '2026-W10', progress: Object.fromEntries(cfg.goals.map((g) => [g.id, 1])), claimed: false }),
  }
}
