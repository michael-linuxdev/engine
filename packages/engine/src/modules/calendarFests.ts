/**
 * Calendar fests on the real calendar (local date). While a fest runs,
 * actions earn fest tokens; the fest shop sells boosts, currencies and
 * one-off items (emitted as events for other modules, e.g. collections).
 * Tokens and purchases belong to one fest instance (`key` = id + year).
 */
import { localParts } from '../clock'
import type { Clock } from '../clock'
import { act } from '../result'
import { isRecord, parseNum, parseNumRecord, parseTime } from '../state'
import type { Amount, EffectSource, EngineEvent, EngineModule } from '../types'

export interface FestDef {
  id: string
  /** Inclusive month/day range; may wrap the year end (12-20 → 01-06). */
  from: [number, number]
  to: [number, number]
  major: boolean
}

export type FestItem =
  | { id: string; cost: number; max: number; kind: 'boost'; mult: number; durationMs: number }
  | { id: string; cost: number; max: number; kind: 'grant'; grant: readonly Amount[] }
  | { id: string; cost: number; max: number; kind: 'item'; event: EngineEvent }

export interface FestConfig {
  fests: readonly FestDef[]
  /** Shop per fest id (falls back to `default`). */
  shop: Readonly<Record<string, readonly FestItem[]>>
  /** Tokens per event type. */
  earn: Readonly<Record<string, number>>
  /** Test hook (?fest=…): forced fest id or null. */
  override?: () => string | null
}

export interface FestsState {
  key: string
  tokens: number
  bought: Record<string, number>
  boostUntil: number
  boostMult: number
  boostActive: boolean
}

export const FESTS_ID = 'calendarFests'

function md(m: number, d: number): number {
  return m * 100 + d
}

export function festAt(cfg: FestConfig, clock: Clock): FestDef | null {
  const forced = cfg.override?.()
  if (forced) return cfg.fests.find((f) => f.id === forced) ?? null
  const p = localParts(clock)
  const x = md(p.month, p.day)
  return (
    cfg.fests.find((f) => {
      const a = md(...f.from)
      const b = md(...f.to)
      return a <= b ? x >= a && x <= b : x >= a || x <= b
    }) ?? null
  )
}

export function festKey(f: FestDef | null, clock: Clock): string {
  if (!f) return ''
  const p = localParts(clock)
  // A fest that wraps the year end belongs to the year it started in.
  const year = md(...f.from) > md(...f.to) && md(p.month, p.day) <= md(...f.to) ? p.year - 1 : p.year
  return `${f.id}:${year}`
}

export function festShop(cfg: FestConfig, festId: string): readonly FestItem[] {
  return cfg.shop[festId] ?? cfg.shop.default ?? []
}

export function calendarFestsModule(cfg: FestConfig): EngineModule<FestsState> {
  const update = (s: FestsState, clock: Clock): FestsState => {
    const key = festKey(festAt(cfg, clock), clock)
    let next = s
    if (key !== s.key) next = { ...next, key, tokens: 0, bought: {} }
    const boostActive = next.boostUntil > clock.now()
    return boostActive === next.boostActive ? next : { ...next, boostActive }
  }
  return {
    id: FESTS_ID,
    version: 1,
    init: () => ({ key: '', tokens: 0, bought: {}, boostUntil: 0, boostMult: 1, boostActive: false }),
    parse: (raw) => {
      const r = isRecord(raw) ? raw : {}
      return {
        key: typeof r.key === 'string' ? r.key : '',
        tokens: parseNum(r.tokens),
        bought: parseNumRecord(r.bought, undefined, true),
        boostUntil: parseTime(r.boostUntil, 0),
        boostMult: Math.max(1, parseNum(r.boostMult, 1)),
        boostActive: r.boostActive === true,
      }
    },
    resetOn: 'keep',
    tick: (s, _dt, ctx) => update(s, ctx.clock),
    onOffline: (s, _ms, ctx) => update(s, ctx.clock),
    on: (s, e) => {
      const add = cfg.earn[e.type]
      return add && s.key ? { ...s, tokens: s.tokens + add } : s
    },
    effects: (s): EffectSource[] => (s.boostActive ? [{ id: 'fest.boost', target: 'income', op: 'mul', value: s.boostMult, labelKey: 'effect.fest' }] : []),
    actions: {
      buy: (s, p, ctx) => {
        const fest = festAt(cfg, ctx.clock)
        const cur = update(s, ctx.clock)
        if (!fest || !cur.key) return s
        const item = festShop(cfg, fest.id).find((i) => i.id === (p as { id?: string } | undefined)?.id)
        if (!item || cur.tokens < item.cost || (cur.bought[item.id] ?? 0) >= item.max) return s
        const next: FestsState = { ...cur, tokens: cur.tokens - item.cost, bought: { ...cur.bought, [item.id]: (cur.bought[item.id] ?? 0) + 1 } }
        const ev: EngineEvent = { type: 'fest.bought', fest: fest.id, item: item.id }
        if (item.kind === 'boost') {
          const now = ctx.clock.now()
          return act({ ...next, boostUntil: Math.max(now, next.boostUntil) + item.durationMs, boostMult: item.mult, boostActive: true }, { events: [ev] })
        }
        if (item.kind === 'grant') return act(next, { grant: item.grant.map((g) => ({ ...g, source: 'fest' })), events: [ev] })
        return act(next, { events: [ev, item.event] })
      },
    },
    playtestEvents: ['fest.bought'],
    sample: () => ({ key: 'sample:2026', tokens: 42, bought: { a: 1 }, boostUntil: 1_800_000_100_000, boostMult: 2, boostActive: true }),
  }
}

/** Days left in the running fest (UI). */
export function festDaysLeft(cfg: FestConfig, clock: Clock): number {
  const f = festAt(cfg, clock)
  if (!f) return 0
  const p = localParts(clock)
  const end = Date.UTC(p.month > f.to[0] ? p.year + 1 : p.year, f.to[0] - 1, f.to[1])
  const today = Date.UTC(p.year, p.month - 1, p.day)
  return Math.max(0, Math.round((end - today) / 86_400_000)) + 1
}

