/**
 * Regions: sub-economies with their own currency, areas (producer-like),
 * care upgrades and an opening condition. Regions are only ever APPENDED;
 * the parser fills new ones in automatically and never drops data of known
 * ones. Region progress adds a soft-capped bonus to the main economy.
 *
 * Saved per region: owned area levels, balance, care ranks, intro flag, openedAt.
 */
import { offlineGain } from '../offline'
import { bulkCost, maxAffordable, milestoneMult } from '../producers'
import { act } from '../result'
import { isRecord, parseBool, parseInt0, parseNum, parseNumRecord, parseTime } from '../state'
import type { Amount, EffectSource, EngineModule, ProducerDef, WorldView } from '../types'
import { offlineCaps } from './offline'

export interface RegionDef {
  id: string
  areas: readonly ProducerDef[]
  /** Starting balance when the region opens (first area is affordable). */
  startBalance: number
  /** Opening condition (game data). */
  opens: (w: WorldView) => boolean
}

export interface RegionConfig {
  regions: readonly RegionDef[]
  care: { maxRank: number; growPerRank: number; thriftPerRank: number; costBase: number; costGrowth: number }
  /** Main bonus: 1 + cap · (1 − e^(−levels / l0)). */
  bonus: { cap: number; l0: number }
  /**
   * Mastery: one star per entry of `levels`, earned when the WEAKEST area of a
   * region reaches that level. Each star raises the region's own yield and
   * grants `reward` once. Stars follow from the saved area levels (which
   * never drop) — nothing extra is stored.
   */
  mastery?: { levels: readonly number[]; yieldPerStar: number; reward?: readonly Amount[] }
}

export interface RegionSlice {
  open: boolean
  owned: Record<string, number>
  balance: number
  grow: number
  thrift: number
  introSeen: boolean
  openedAt: number
}

export interface RegionsState {
  regions: Record<string, RegionSlice>
}

export const REGIONS_ID = 'regions'

const emptySlice = (): RegionSlice => ({ open: false, owned: {}, balance: 0, grow: 0, thrift: 0, introSeen: false, openedAt: 0 })

/** Mastery stars of a region (0 … levels.length); closed regions have none. */
export function regionStars(cfg: RegionConfig, def: RegionDef, r: RegionSlice | undefined): number {
  if (!cfg.mastery || !r?.open) return 0
  let weakest = Infinity
  for (const a of def.areas) weakest = Math.min(weakest, r.owned[a.id] ?? 0)
  let stars = 0
  for (const level of cfg.mastery.levels) if (weakest >= level) stars += 1
  return stars
}

export interface StarProgress {
  stars: number
  max: number
  /** Level every area needs for the next star, `null` once all stars are earned. */
  nextLevel: number | null
  /** Areas already at that level. */
  have: number
  total: number
}

export function regionStarProgress(cfg: RegionConfig, def: RegionDef, r: RegionSlice | undefined): StarProgress {
  const levels = cfg.mastery?.levels ?? []
  const stars = regionStars(cfg, def, r)
  const nextLevel = levels[stars] ?? null
  const total = def.areas.length
  const have = nextLevel === null ? total : def.areas.filter((a) => (r?.owned[a.id] ?? 0) >= nextLevel).length
  return { stars, max: levels.length, nextLevel, have, total }
}

/** All stars over all regions and the maximum. */
export function totalRegionStars(cfg: RegionConfig, s: RegionsState | undefined): { have: number; total: number } {
  let have = 0
  for (const def of cfg.regions) have += regionStars(cfg, def, s?.regions[def.id])
  return { have, total: cfg.regions.length * (cfg.mastery?.levels.length ?? 0) }
}

export function regionRate(cfg: RegionConfig, def: RegionDef, r: RegionSlice, w: WorldView): number {
  let sum = 0
  for (const a of def.areas) {
    const n = r.owned[a.id] ?? 0
    if (n > 0) sum += a.baseRate * n * milestoneMult(n, w.def.balance)
  }
  return sum * (1 + cfg.care.growPerRank * r.grow) * (1 + (cfg.mastery?.yieldPerStar ?? 0) * regionStars(cfg, def, r))
}

export function regionCostMult(cfg: RegionConfig, r: RegionSlice): number {
  return Math.pow(1 - cfg.care.thriftPerRank, r.thrift)
}

export function careCost(cfg: RegionConfig, rank: number): number {
  return Math.ceil(cfg.care.costBase * Math.pow(cfg.care.costGrowth, rank))
}

/** Area unlock inside a region: previous area at level 5 (first is always open). */
export function areaOpen(def: RegionDef, r: RegionSlice, i: number): boolean {
  return i === 0 || (r.owned[def.areas[i - 1].id] ?? 0) >= 5 || (r.owned[def.areas[i].id] ?? 0) > 0
}

export function totalRegionLevels(s: RegionsState): number {
  let n = 0
  for (const r of Object.values(s.regions)) for (const v of Object.values(r.owned)) n += v
  return n
}

export function regionsModule(cfg: RegionConfig): EngineModule<RegionsState> {
  const byId = new Map(cfg.regions.map((r) => [r.id, r]))
  const fill = (s: RegionsState): RegionsState => {
    const missing = cfg.regions.filter((r) => !s.regions[r.id])
    if (!missing.length) return s
    const regions = { ...s.regions }
    for (const r of missing) regions[r.id] = emptySlice()
    return { regions }
  }
  const openNew = (s0: RegionsState, w: WorldView, now: number): { s: RegionsState; fresh: string[] } => {
    const s = fill(s0)
    const fresh = cfg.regions.filter((r) => !s.regions[r.id].open && r.opens(w))
    if (!fresh.length) return { s, fresh: [] }
    const regions = { ...s.regions }
    for (const r of fresh) regions[r.id] = { ...regions[r.id], open: true, openedAt: now, balance: Math.max(regions[r.id].balance, r.startBalance) }
    return { s: { regions }, fresh: fresh.map((r) => r.id) }
  }
  const withEvents = (s: RegionsState, fresh: string[]) => (fresh.length ? act(s, { events: fresh.map((id) => ({ type: 'region.opened', id })) }) : s)
  const earn = (s: RegionsState, w: WorldView, seconds: number, offline: boolean): RegionsState => {
    let regions: Record<string, RegionSlice> | null = null
    for (const def of cfg.regions) {
      const r = s.regions[def.id]
      if (!r?.open) continue
      const rate = regionRate(cfg, def, r, w)
      if (rate <= 0) continue
      let gain = rate * seconds
      if (offline) {
        const caps = offlineCaps(w)
        gain = offlineGain(rate, seconds, caps.soft, caps.hard, w.def.balance.offline.decay)
      }
      regions ??= { ...s.regions }
      regions[def.id] = { ...r, balance: Math.min(1e300, r.balance + gain) }
    }
    return regions ? { regions } : s
  }
  const update = (s: RegionsState, r: string, patch: Partial<RegionSlice>): RegionsState => ({ regions: { ...s.regions, [r]: { ...s.regions[r], ...patch } } })
  return {
    id: REGIONS_ID,
    version: 1,
    init: () => fill({ regions: {} }),
    parse: (raw) => {
      const src = isRecord(raw) && isRecord(raw.regions) ? raw.regions : {}
      const regions: Record<string, RegionSlice> = {}
      for (const def of cfg.regions) {
        const x = src[def.id]
        if (!isRecord(x)) {
          regions[def.id] = emptySlice()
          continue
        }
        regions[def.id] = {
          open: parseBool(x.open),
          owned: parseNumRecord(x.owned, def.areas.map((a) => a.id), true),
          balance: parseNum(x.balance),
          grow: parseInt0(x.grow, 0, cfg.care.maxRank),
          thrift: parseInt0(x.thrift, 0, cfg.care.maxRank),
          introSeen: parseBool(x.introSeen),
          openedAt: parseTime(x.openedAt, 0),
        }
      }
      return { regions }
    },
    resetOn: 'keep',
    tick: (s, dt, ctx, w) => {
      const o = openNew(s, w, ctx.clock.now())
      return withEvents(earn(o.s, w, dt / 1000, false), o.fresh)
    },
    onOffline: (s, ms, _ctx, w) => earn(fill(s), w, ms / 1000, true),
    on: (s, e, ctx, w) => {
      if (e.type !== 'prestige.performed' && e.type !== 'feature.unlocked') return s
      const o = openNew(s, w, ctx.clock.now())
      return o.fresh.length ? withEvents(o.s, o.fresh) : s
    },
    effects: (s): EffectSource[] => {
      const n = totalRegionLevels(s)
      if (n <= 0) return []
      return [{ id: 'regions', target: 'rate:*', op: 'mul', value: 1 + cfg.bonus.cap * (1 - Math.exp(-n / cfg.bonus.l0)), labelKey: 'effect.regions' }]
    },
    actions: {
      buy: (s, p) => {
        const { region, area, count } = (p ?? {}) as { region?: string; area?: string; count?: number | 'max' }
        const def = byId.get(region ?? '')
        const r = def && s.regions[def.id]
        const i = def ? def.areas.findIndex((a) => a.id === area) : -1
        if (!def || !r?.open || i < 0 || !areaOpen(def, r, i)) return s
        const a = def.areas[i]
        const n = r.owned[a.id] ?? 0
        const m = regionCostMult(cfg, r)
        const k = count === 'max' ? maxAffordable(a, n, r.balance, m) : Math.max(1, Math.floor(Number(count) || 1))
        const cost = bulkCost(a, n, k, m)
        if (k <= 0 || cost > r.balance) return s
        const next = update(s, def.id, { owned: { ...r.owned, [a.id]: n + k }, balance: r.balance - cost })
        const events = [{ type: 'region.bought', region: def.id, area: a.id, count: k }]
        // New mastery stars: reward once per star (levels never drop, so a star is earned exactly here)
        const before = regionStars(cfg, def, r)
        const after = regionStars(cfg, def, next.regions[def.id])
        if (after <= before) return act(next, { events })
        const grant = Array.from({ length: after - before }, () => (cfg.mastery?.reward ?? []).map((x) => ({ ...x, source: 'mastery' }))).flat()
        return act(next, { grant, events: [...events, { type: 'region.mastered', region: def.id, stars: after }] })
      },
      care: (s, p) => {
        const { region, kind } = (p ?? {}) as { region?: string; kind?: 'grow' | 'thrift' }
        const r = s.regions[region ?? '']
        if (!r?.open || (kind !== 'grow' && kind !== 'thrift') || r[kind] >= cfg.care.maxRank) return s
        const cost = careCost(cfg, r[kind])
        if (r.balance < cost) return s
        return update(s, region!, { [kind]: r[kind] + 1, balance: r.balance - cost })
      },
      seeIntro: (s, p) => {
        const id = (p as { region?: string } | undefined)?.region ?? ''
        return s.regions[id] && !s.regions[id].introSeen ? update(s, id, { introSeen: true }) : s
      },
    },
    playtestEvents: ['region.opened', 'region.bought', 'region.mastered'],
    sample: () => {
      const s = fill({ regions: {} })
      const first = cfg.regions[0]
      if (!first) return s
      return update(s, first.id, { open: true, owned: { [first.areas[0].id]: 12 }, balance: 500, grow: 2, thrift: 1, introSeen: true, openedAt: 1_800_000_000_000 })
    },
  }
}
