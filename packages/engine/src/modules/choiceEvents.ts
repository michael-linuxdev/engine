/**
 * Choice events: at most one per local day. The player picks the safe
 * option (costs currency) or the risky one (coin flip between a strong
 * boost and a short malus). Results are timed buffs.
 */
import { hashKey, localDayKey } from '../clock'
import { act } from '../result'
import { isRecord, parseNum, parseTime } from '../state'
import type { Amount, EffectSource, EngineModule } from '../types'

export interface ChoiceBuff {
  target: string
  mult: number
  durationMs: number
}

export interface ChoiceDef {
  id: string
  safe: { cost: Amount; buff: ChoiceBuff }
  risk: { win: ChoiceBuff; lose: ChoiceBuff; chance: number }
}

export interface ChoiceConfig {
  list: readonly ChoiceDef[]
  /** Chance per day that an event appears (rolled from the day key). */
  daily: number
  /** Earliest hour of the local day. */
  fromHour: number
  /** Optional: the game picks the day's event (e.g. from its weather); '' = none. Replaces the daily roll. */
  pick?: (day: string) => string
}

export interface ChoiceState {
  day: string
  pending: string
  buffTarget: string
  buffMult: number
  until: number
  active: boolean
}

export const CHOICES_ID = 'choiceEvents'

export function choiceEventsModule(cfg: ChoiceConfig): EngineModule<ChoiceState> {
  const byId = new Map(cfg.list.map((c) => [c.id, c]))
  const buff = (s: ChoiceState, b: ChoiceBuff, now: number): ChoiceState => ({ ...s, pending: '', buffTarget: b.target, buffMult: b.mult, until: now + b.durationMs, active: true })
  return {
    id: CHOICES_ID,
    version: 1,
    init: () => ({ day: '', pending: '', buffTarget: '', buffMult: 1, until: 0, active: false }),
    parse: (raw) => {
      const r = isRecord(raw) ? raw : {}
      return {
        day: typeof r.day === 'string' ? r.day : '',
        pending: typeof r.pending === 'string' && byId.has(r.pending) ? r.pending : '',
        buffTarget: typeof r.buffTarget === 'string' ? r.buffTarget : '',
        buffMult: parseNum(r.buffMult, 1),
        until: parseTime(r.until, 0),
        active: r.active === true,
      }
    },
    resetOn: 'keep',
    tick: (s, _dt, ctx) => {
      const now = ctx.clock.now()
      let next = s
      if (s.active && now >= s.until) next = { ...next, active: false }
      const day = localDayKey(ctx.clock)
      const hour = new Date(now + (ctx.clock.offsetMin?.() ?? 0) * 60_000).getUTCHours()
      if (day !== s.day && hour >= cfg.fromHour) {
        const h = hashKey(`choice:${day}`)
        const picked = cfg.pick?.(day)
        const pending =
          picked !== undefined ? (byId.has(picked) ? picked : '') : (h % 1000) / 1000 < cfg.daily && cfg.list.length ? cfg.list[(h >>> 10) % cfg.list.length].id : ''
        next = { ...next, day, pending }
        if (pending) return act(next, { events: [{ type: 'choice.offered', id: pending }] })
      }
      return next
    },
    effects: (s): EffectSource[] => (s.active && s.buffTarget ? [{ id: 'choice', target: s.buffTarget, op: 'mul', value: s.buffMult, labelKey: 'effect.choice' }] : []),
    actions: {
      choose: (s, p, ctx) => {
        const c = byId.get(s.pending)
        const option = (p as { option?: string } | undefined)?.option
        if (!c) return s
        const now = ctx.clock.now()
        if (option === 'safe') return act(buff(s, c.safe.buff, now), { spend: [c.safe.cost], events: [{ type: 'choice.made', id: c.id, option }] })
        if (option === 'risk') {
          const win = ctx.rng.next() < c.risk.chance
          return act(buff(s, win ? c.risk.win : c.risk.lose, now), { events: [{ type: 'choice.made', id: c.id, option, win }] })
        }
        return s
      },
    },
    playtestEvents: ['choice.made'],
    sample: () => ({ day: '2026-11-09', pending: cfg.list[0]?.id ?? '', buffTarget: 'income', buffMult: 1.1, until: 1_800_000_100_000, active: true }),
  }
}
