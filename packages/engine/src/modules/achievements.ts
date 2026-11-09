/**
 * Deeds: conditions on the world, checked after events. Each grants its
 * reward once and adds a small permanent bonus (`bonus`, rate:* linear).
 */
import { act } from '../result'
import { isRecord } from '../state'
import type { Amount, EffectSource, EngineModule, WorldView } from '../types'

export interface AchievementDef {
  id: string
  /** Progress value of the world (e.g. total producer levels). */
  metric: (w: WorldView) => number
  at: number
  reward: readonly Amount[]
  /** Permanent rate bonus (0.01 = +1 %). */
  bonus?: number
}

export interface AchievementsState {
  done: string[]
}

export const ACHIEVEMENTS_ID = 'achievements'

export function achievementsModule(list: readonly AchievementDef[]): EngineModule<AchievementsState> {
  const ids = new Set(list.map((a) => a.id))
  return {
    id: ACHIEVEMENTS_ID,
    version: 1,
    init: () => ({ done: [] }),
    parse: (raw) => {
      const r = isRecord(raw) && Array.isArray(raw.done) ? raw.done : []
      return { done: [...new Set(r.filter((x): x is string => typeof x === 'string' && ids.has(x)))] }
    },
    resetOn: 'keep',
    on: (s, e, _ctx, world) => {
      if (e.type === 'achievement.done' || e.type === 'currency.gained') return s
      const fresh = list.filter((a) => !s.done.includes(a.id) && a.metric(world) >= a.at)
      if (!fresh.length) return s
      return act(
        { done: [...s.done, ...fresh.map((a) => a.id)] },
        { grant: fresh.flatMap((a) => a.reward.map((r) => ({ ...r, source: 'achievement' }))), events: fresh.map((a) => ({ type: 'achievement.done', id: a.id })) },
      )
    },
    effects: (s) => {
      const out: EffectSource[] = []
      const bonus = list.filter((a) => s.done.includes(a.id)).reduce((x, a) => x + (a.bonus ?? 0), 0)
      if (bonus > 0) out.push({ id: 'achievements', target: 'rate:*', op: 'mul', value: 1 + bonus, labelKey: 'effect.achievements' })
      return out
    },
    playtestEvents: ['achievement.done'],
    sample: () => ({ done: list.slice(0, 2).map((a) => a.id) }),
  }
}
