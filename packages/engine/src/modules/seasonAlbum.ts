/**
 * Season album: the same goals every real season (local date); each goal
 * counts events of one type within the season. Every stamp grants a small
 * reward; at `rewardAt` stamps the season's exclusive item is granted (event).
 */
import { localParts } from '../clock'
import type { Clock } from '../clock'
import { act } from '../result'
import { isRecord, parseNumRecord } from '../state'
import type { Amount, EngineEvent, EngineModule } from '../types'

export interface AlbumGoal {
  id: string
  /** Event type counted; `amountKey` sums that field instead of counting. */
  event: string
  amountKey?: string
  /** Only events whose field equals this value (e.g. source = 'manual'). */
  where?: Readonly<Record<string, unknown>>
  target: number
}

export interface AlbumConfig {
  goals: readonly AlbumGoal[]
  stampReward: readonly Amount[]
  rewardAt: number
  /** Event emitted when `rewardAt` is reached, per season. */
  seasonReward: (season: 'spring' | 'summer' | 'autumn' | 'winter') => EngineEvent
}

export interface AlbumState {
  season: string
  progress: Record<string, number>
  stamped: string[]
  rewarded: boolean
}

export const ALBUM_ID = 'seasonAlbum'

export function seasonKey(clock: Clock): string {
  const p = localParts(clock)
  const season = p.month >= 3 && p.month <= 5 ? 'spring' : p.month >= 6 && p.month <= 8 ? 'summer' : p.month >= 9 && p.month <= 11 ? 'autumn' : 'winter'
  // December belongs to the winter of the following year
  return `${p.month === 12 ? p.year + 1 : p.year}-${season}`
}

export function seasonAlbumModule(cfg: AlbumConfig): EngineModule<AlbumState> {
  const ids = cfg.goals.map((g) => g.id)
  const roll = (s: AlbumState, clock: Clock): AlbumState => {
    const key = seasonKey(clock)
    return key === s.season ? s : { season: key, progress: {}, stamped: [], rewarded: false }
  }
  return {
    id: ALBUM_ID,
    version: 1,
    init: () => ({ season: '', progress: {}, stamped: [], rewarded: false }),
    parse: (raw) => {
      const r = isRecord(raw) ? raw : {}
      return {
        season: typeof r.season === 'string' ? r.season : '',
        progress: parseNumRecord(r.progress, ids),
        stamped: Array.isArray(r.stamped) ? [...new Set(r.stamped.filter((x): x is string => typeof x === 'string' && ids.includes(x)))] : [],
        rewarded: r.rewarded === true,
      }
    },
    resetOn: 'keep',
    tick: (s, _dt, ctx) => roll(s, ctx.clock),
    on: (s0, e, ctx) => {
      const s = roll(s0, ctx.clock)
      let progress = s.progress
      const fresh: string[] = []
      for (const g of cfg.goals) {
        if (g.event !== e.type || s.stamped.includes(g.id)) continue
        if (g.where && Object.entries(g.where).some(([k, v]) => e[k] !== v)) continue
        const add = g.amountKey ? Number(e[g.amountKey]) || 0 : 1
        if (add <= 0) continue
        const v = Math.min(g.target, (progress[g.id] ?? 0) + add)
        progress = { ...progress, [g.id]: v }
        if (v >= g.target) fresh.push(g.id)
      }
      if (progress === s.progress) return s === s0 ? s0 : s
      const stamped = [...s.stamped, ...fresh]
      const reward = !s.rewarded && stamped.length >= cfg.rewardAt
      const season = s.season.split('-')[1] as 'spring' | 'summer' | 'autumn' | 'winter'
      if (!fresh.length) return { ...s, progress }
      return act(
        { ...s, progress, stamped, rewarded: s.rewarded || reward },
        {
          grant: fresh.flatMap(() => cfg.stampReward.map((r) => ({ ...r, source: 'album' }))),
          events: [...fresh.map((id) => ({ type: 'album.stamped', id })), ...(reward ? [cfg.seasonReward(season)] : [])],
        },
      )
    },
    playtestEvents: ['album.stamped'],
    sample: () => ({ season: '2026-autumn', progress: Object.fromEntries(ids.slice(0, 3).map((id) => [id, 2])), stamped: ids.slice(0, 1), rewarded: false }),
  }
}
