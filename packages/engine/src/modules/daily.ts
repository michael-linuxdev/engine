/**
 * Daily round: one claim per local calendar day. A missed day FREEZES the
 * streak instead of resetting it; after a longer break a comeback bonus
 * (tiers by gap) is added. Rewards: seconds of current income + currencies.
 */
import { dayNumber, localDayKey } from '../clock'
import { act } from '../result'
import { isRecord, parseInt0, primaryCurrency } from '../state'
import type { Amount, EngineModule, WorldView } from '../types'

export interface DailyReward {
  /** Seconds of current income. */
  seconds: number
  grant?: readonly Amount[]
}

export interface DailyConfig {
  /** Rewards for streak day 1…n (cycle repeats). */
  rewards: readonly DailyReward[]
  /** Minimum primary per claim (start of the game). */
  minPrimary: number
  /** Comeback tiers: gap in days ≥ minGap → extra seconds. */
  comeback: readonly { minGap: number; seconds: number; grant?: readonly Amount[] }[]
}

export interface DailyState {
  /** Days in the current streak (0 = never claimed). */
  streak: number
  /** Local day key of the last claim ('' = never). */
  lastDay: string
  claims: number
}

export const DAILY_ID = 'daily'

export function dailyStatus(s: DailyState, today: string, cfg: DailyConfig) {
  const gap = s.lastDay ? dayNumber(today) - dayNumber(s.lastDay) : Infinity
  const canClaim = s.lastDay !== today
  const day = (s.streak % cfg.rewards.length) + 1
  const comeback = Number.isFinite(gap) ? [...cfg.comeback].sort((a, b) => b.minGap - a.minGap).find((c) => gap >= c.minGap) ?? null : null
  return { canClaim, day, gap, comeback, reward: cfg.rewards[day - 1] }
}

export function dailyReward(world: WorldView, r: DailyReward, cfg: DailyConfig, extraSeconds = 0): number {
  return Math.max(cfg.minPrimary, world.rate() * (r.seconds + extraSeconds))
}

export function dailyModule(cfg: DailyConfig): EngineModule<DailyState> {
  return {
    id: DAILY_ID,
    version: 1,
    init: () => ({ streak: 0, lastDay: '', claims: 0 }),
    parse: (raw) => {
      const r = isRecord(raw) ? raw : {}
      return { streak: parseInt0(r.streak), lastDay: typeof r.lastDay === 'string' && Number.isFinite(dayNumber(r.lastDay)) ? r.lastDay : '', claims: parseInt0(r.claims) }
    },
    resetOn: 'keep',
    actions: {
      claim: (s, _p, ctx, world) => {
        const today = localDayKey(ctx.clock)
        const st = dailyStatus(s, today, cfg)
        if (!st.canClaim) return s
        const amount = dailyReward(world, st.reward, cfg, st.comeback?.seconds ?? 0)
        const grant = [{ currency: primaryCurrency(world.def), amount, source: 'daily' }, ...(st.reward.grant ?? []), ...(st.comeback?.grant ?? [])]
        return act(
          { streak: s.streak + 1, lastDay: today, claims: s.claims + 1 },
          { grant, events: [{ type: 'daily.claimed', day: st.day, streak: s.streak + 1, comeback: st.comeback?.minGap ?? 0 }] },
        )
      },
    },
    playtestEvents: ['daily.claimed'],
    sample: () => ({ streak: 5, lastDay: '2026-11-08', claims: 9 }),
  }
}
