/**
 * Market (mocks): real-money offers, cosmetic styles, an optional rewarded ad
 * with cooldown, a weekly pass with free and premium tracks, time skips with a
 * daily cap, a daily gift, a personal boost and a stacking group boost.
 *
 * There is no payment backend: `buyOffer` simply grants. Whoever calls it
 * (store purchase, test wallet) is responsible for having taken the money.
 * Soft progress stays free; the ad is optional and never blocks play.
 */
import { localDayKey, weekKey, type Clock } from '../clock'
import { act } from '../result'
import { isRecord, parseBool, parseInt0, parseNum, parseTime, primaryCurrency } from '../state'
import type { Amount, EffectSource, EngineModule, WorldView } from '../types'

type Payload = { id?: unknown; choice?: unknown; tier?: unknown; premium?: unknown }
const pl = (p: unknown): Payload => (isRecord(p) ? (p as Payload) : {})

export interface MarketCosmetic {
  id: string
  /** Cost in the market currency; 0 = owned from the start. */
  cost: number
  /** Only purchasable while this returns true (e.g. during a fest). */
  when?: (world: WorldView, clock: Clock) => boolean
}

export interface MarketOffer {
  id: string
  grant?: readonly Amount[]
  cosmetics?: readonly string[]
  removeAds?: boolean
  passPremium?: boolean
  /** Can be bought only once (bundles, packs, ad removal). */
  once?: boolean
}

/** A reward: seconds of current primary income and/or fixed amounts. */
export interface MarketReward {
  seconds?: number
  grant?: readonly Amount[]
}

export interface MarketPassTier {
  xp: number
  free: MarketReward
  premium: MarketReward
}

export interface MarketConfig {
  /** Premium currency paid for cosmetics, skips and boosts. */
  currency: string
  cosmetics: readonly MarketCosmetic[]
  offers: readonly MarketOffer[]
  ad: { cooldownMs: number; choices: readonly ({ id: string } & MarketReward)[] }
  pass: { tiers: readonly MarketPassTier[]; dailyXp: number; adXp: number; maxXp: number }
  skips: readonly { id: string; hours: number; cost: number }[]
  skipCapHours: number
  gift: readonly Amount[]
  boost: { cost: number; mult: number; durationMs: number }
  /** Group boost: first purchase gives `mult`, each one while active adds `step` up to `max`. */
  circle: { cost: number; mult: number; step: number; max: number; durationMs: number }
}

export interface MarketState {
  owned: string[]
  equipped: string
  /** Once-offers already bought. */
  offers: string[]
  purchases: number
  adsRemoved: boolean
  adAt: number
  ads: number
  giftDay: string
  skipDay: string
  skipHours: number
  passWeek: string
  passXp: number
  passPremium: boolean
  /** Claimed tiers as bit masks. */
  passFree: number
  passPaid: number
  boostUntil: number
  circleUntil: number
  circleMult: number
  /** Mirrors of the timers for `effects` (which cannot read the clock). */
  boostOn: boolean
  circleOn: boolean
}

export const MARKET_ID = 'market'

export function adCooldownLeft(s: MarketState, cfg: MarketConfig, now: number): number {
  return s.adAt <= 0 ? 0 : Math.max(0, cfg.ad.cooldownMs - (now - s.adAt))
}

export function skipHoursLeft(s: MarketState, cfg: MarketConfig, clock: Clock): number {
  return Math.max(0, cfg.skipCapHours - (s.skipDay === localDayKey(clock) ? s.skipHours : 0))
}

export function giftReady(s: MarketState, clock: Clock): boolean {
  return s.giftDay !== localDayKey(clock)
}

export function passTierClaimable(s: MarketState, cfg: MarketConfig, tier: number, premium: boolean): boolean {
  const t = cfg.pass.tiers[tier]
  if (!t || s.passXp < t.xp) return false
  if (premium && !s.passPremium) return false
  return ((premium ? s.passPaid : s.passFree) & (1 << tier)) === 0
}

function rewardGrant(r: MarketReward, world: WorldView, source: string): (Amount & { source: string })[] {
  const out: (Amount & { source: string })[] = (r.grant ?? []).map((g) => ({ ...g, source }))
  if (r.seconds) out.push({ currency: primaryCurrency(world.def), amount: world.rate() * r.seconds, source })
  return out
}

function sync(s: MarketState, clock: Clock): MarketState {
  const now = clock.now()
  const week = weekKey(localDayKey(clock))
  let next = s
  if (s.passWeek !== week) next = { ...next, passWeek: week, passXp: 0, passFree: 0, passPaid: 0, passPremium: false }
  const boostOn = now < next.boostUntil
  const circleOn = now < next.circleUntil
  if (boostOn !== next.boostOn || circleOn !== next.circleOn) next = { ...next, boostOn, circleOn, circleMult: circleOn ? next.circleMult : 1 }
  return next
}

export function marketModule(cfg: MarketConfig): EngineModule<MarketState> {
  const cosmetics = new Map(cfg.cosmetics.map((c) => [c.id, c]))
  const offers = new Map(cfg.offers.map((o) => [o.id, o]))
  const starter = cfg.cosmetics.filter((c) => c.cost <= 0).map((c) => c.id)
  const ids = (v: unknown, known: Map<string, unknown>) => (Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === 'string' && known.has(x)))] : [])
  const mask = (v: unknown) => parseInt0(v, 0, 2 ** 30)
  const fresh = (): MarketState => ({
    owned: [...starter], equipped: starter[0] ?? '', offers: [], purchases: 0, adsRemoved: false, adAt: 0, ads: 0, giftDay: '', skipDay: '', skipHours: 0,
    passWeek: '', passXp: 0, passPremium: false, passFree: 0, passPaid: 0, boostUntil: 0, circleUntil: 0, circleMult: 1, boostOn: false, circleOn: false,
  })
  return {
    id: MARKET_ID,
    version: 1,
    init: fresh,
    parse: (raw) => {
      const r = isRecord(raw) ? raw : {}
      const owned = [...new Set([...starter, ...ids(r.owned, cosmetics)])]
      const equipped = typeof r.equipped === 'string' && owned.includes(r.equipped) ? r.equipped : (starter[0] ?? '')
      return {
        owned, equipped, offers: ids(r.offers, offers), purchases: parseInt0(r.purchases), adsRemoved: parseBool(r.adsRemoved), adAt: parseTime(r.adAt, 0), ads: parseInt0(r.ads),
        giftDay: typeof r.giftDay === 'string' ? r.giftDay : '', skipDay: typeof r.skipDay === 'string' ? r.skipDay : '', skipHours: Math.max(0, parseNum(r.skipHours)),
        passWeek: typeof r.passWeek === 'string' ? r.passWeek : '', passXp: Math.min(cfg.pass.maxXp, parseInt0(r.passXp)), passPremium: parseBool(r.passPremium),
        passFree: mask(r.passFree), passPaid: mask(r.passPaid), boostUntil: parseTime(r.boostUntil, 0), circleUntil: parseTime(r.circleUntil, 0),
        circleMult: Math.max(1, parseNum(r.circleMult, 1)), boostOn: parseBool(r.boostOn), circleOn: parseBool(r.circleOn),
      }
    },
    resetOn: 'keep',
    tick: (s, _dt, ctx) => sync(s, ctx.clock),
    onOffline: (s, _ms, ctx) => sync(s, ctx.clock),
    on: (s, e, ctx) => {
      if (e.type !== 'daily.claimed') return s
      const cur = sync(s, ctx.clock)
      return { ...cur, passXp: Math.min(cfg.pass.maxXp, cur.passXp + cfg.pass.dailyXp) }
    },
    effects: (s): EffectSource[] => [
      ...(s.boostOn ? [{ id: 'market:boost', target: 'income', op: 'mul' as const, value: cfg.boost.mult, labelKey: 'effect.boost' }] : []),
      ...(s.circleOn && s.circleMult > 1 ? [{ id: 'market:circle', target: 'income', op: 'mul' as const, value: Math.min(cfg.circle.max, s.circleMult), labelKey: 'effect.circle' }] : []),
    ],
    actions: {
      buyCosmetic: (s, p, ctx, world) => {
        const c = cosmetics.get(String(pl(p).id))
        if (!c || s.owned.includes(c.id) || (c.when && !c.when(world, ctx.clock))) return s
        return act({ ...s, owned: [...s.owned, c.id] }, { spend: c.cost > 0 ? [{ currency: cfg.currency, amount: c.cost }] : [], events: [{ type: 'market.cosmetic', id: c.id }] })
      },
      equip: (s, p) => {
        const id = String(pl(p).id)
        return s.owned.includes(id) && s.equipped !== id ? { ...s, equipped: id } : s
      },
      buyOffer: (s, p, ctx) => {
        const o = offers.get(String(pl(p).id))
        if (!o) return s
        const cur = sync(s, ctx.clock)
        if ((o.once && cur.offers.includes(o.id)) || (o.removeAds && cur.adsRemoved) || (o.passPremium && cur.passPremium)) return s
        const next: MarketState = {
          ...cur,
          owned: [...new Set([...cur.owned, ...(o.cosmetics ?? []).filter((c) => cosmetics.has(c))])],
          offers: o.once ? [...cur.offers, o.id] : cur.offers,
          purchases: cur.purchases + 1,
          adsRemoved: cur.adsRemoved || !!o.removeAds,
          passPremium: cur.passPremium || !!o.passPremium,
        }
        return act(next, { grant: (o.grant ?? []).map((g) => ({ ...g, source: 'market' })), events: [{ type: 'market.offer', id: o.id }] })
      },
      watchAd: (s, p, ctx, world) => {
        const choice = cfg.ad.choices.find((c) => c.id === pl(p).choice) ?? cfg.ad.choices[0]
        const now = ctx.clock.now()
        if (!choice || s.adsRemoved || adCooldownLeft(s, cfg, now) > 0) return s
        const cur = sync(s, ctx.clock)
        return act(
          { ...cur, adAt: now, ads: cur.ads + 1, passXp: Math.min(cfg.pass.maxXp, cur.passXp + cfg.pass.adXp) },
          { grant: rewardGrant(choice, world, 'ad'), events: [{ type: 'market.ad', choice: choice.id }] },
        )
      },
      claimGift: (s, _p, ctx) => {
        if (!giftReady(s, ctx.clock)) return s
        return act({ ...s, giftDay: localDayKey(ctx.clock) }, { grant: cfg.gift.map((g) => ({ ...g, source: 'gift' })), events: [{ type: 'market.gift' }] })
      },
      skip: (s, p, ctx, world) => {
        const def = cfg.skips.find((x) => x.id === pl(p).id)
        if (!def) return s
        const today = localDayKey(ctx.clock)
        const used = s.skipDay === today ? s.skipHours : 0
        const hours = Math.min(def.hours, cfg.skipCapHours - used)
        if (hours <= 0) return s
        const amount = world.rate() * hours * 3600
        return act(
          { ...s, skipDay: today, skipHours: used + hours },
          { spend: [{ currency: cfg.currency, amount: def.cost }], grant: [{ currency: primaryCurrency(world.def), amount, source: 'skip' }], events: [{ type: 'market.skip', id: def.id, hours, amount }] },
        )
      },
      boost: (s, _p, ctx) => {
        const now = ctx.clock.now()
        const until = Math.max(now, s.boostUntil) + cfg.boost.durationMs
        return act({ ...s, boostUntil: until, boostOn: true }, { spend: [{ currency: cfg.currency, amount: cfg.boost.cost }], events: [{ type: 'market.boost' }] })
      },
      circle: (s, _p, ctx) => {
        const now = ctx.clock.now()
        const active = now < s.circleUntil
        const mult = active ? Math.min(cfg.circle.max, s.circleMult + cfg.circle.step) : cfg.circle.mult
        const until = Math.max(now, s.circleUntil) + cfg.circle.durationMs
        return act(
          { ...s, circleUntil: until, circleMult: Math.round(mult * 1000) / 1000, circleOn: true },
          { spend: [{ currency: cfg.currency, amount: cfg.circle.cost }], events: [{ type: 'market.circle', mult }] },
        )
      },
      passClaim: (s, p, ctx, world) => {
        const cur = sync(s, ctx.clock)
        const tier = parseInt0(pl(p).tier, -1, 30)
        const premium = pl(p).premium === true
        if (!passTierClaimable(cur, cfg, tier, premium)) return cur === s ? s : cur
        const t = cfg.pass.tiers[tier]
        const bit = 1 << tier
        const next = premium ? { ...cur, passPaid: cur.passPaid | bit } : { ...cur, passFree: cur.passFree | bit }
        return act(next, { grant: rewardGrant(premium ? t.premium : t.free, world, 'pass'), events: [{ type: 'market.pass', tier, premium }] })
      },
    },
    playtestEvents: ['market.cosmetic', 'market.offer', 'market.ad', 'market.gift', 'market.skip', 'market.boost', 'market.circle', 'market.pass'],
    sample: () => ({
      ...fresh(), owned: [...new Set([...starter, ...cfg.cosmetics.slice(0, 2).map((c) => c.id)])], offers: cfg.offers.filter((o) => o.once).slice(0, 1).map((o) => o.id),
      purchases: 2, adAt: 1_800_000_000_000, ads: 3, giftDay: '2026-11-08', skipDay: '2026-11-08', skipHours: 2, passWeek: '2026-W45', passXp: 35, passFree: 3, passPaid: 1, passPremium: true,
      boostUntil: 1_800_000_100_000, circleUntil: 1_800_000_100_000, circleMult: 1.15, boostOn: true, circleOn: true,
    }),
  }
}
