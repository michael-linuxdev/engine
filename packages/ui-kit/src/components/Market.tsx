/**
 * Market panel (mocks): daily gift, optional bonus video with a blocking
 * countdown, weekly pass, time skips, boosts, cosmetic styles and real-money
 * offers. Offers are disabled until a store exists; in the test phase they are
 * paid from the test wallet instead. Names come from `labels.content`:
 * `cosmetic.<id>`, `offer.<id>`, `skip.<id>`, `adChoice.<id>`, `market.boost`, `market.circle`.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  adCooldownLeft, giftReady, MARKET_ID, passTierClaimable, primaryCurrency, skipHoursLeft,
  type Amount, type MarketConfig, type MarketReward, type MarketState,
} from '@engine/core'
import { useEngine, useStore, type TestWallet } from '@engine/react'
import { useUi } from '../useUi'
import { Button } from './Button'
import { ProgressBar } from './ProgressBar'

function Card({ title, children, testId }: { title: string; children: ReactNode; testId: string }) {
  return (
    <section className="ek-card" data-testid={testId} aria-label={title}>
      <h3 className="ek-h3">{title}</h3>
      {children}
    </section>
  )
}

export interface MarketProps {
  cfg: MarketConfig
  /** Real store purchases available (IAP). */
  storeEnabled: boolean
  /** Test phase: pay offers with test money (null = off). */
  wallet: TestWallet | null
  /** Price per offer id in cents. */
  prices: Readonly<Record<string, number>>
  /** Length of the bonus video in seconds (test phase: 30/60, else short). */
  adSeconds: () => number
  /** Small preview of a style (optional). */
  styleArt?: (id: string) => ReactNode
  /** Called for every test purchase decision (playtest log). */
  onTestPurchase?: (offer: string, cents: number, ok: boolean) => void
  /** Called when a bonus video starts (playtest log). */
  onAd?: (choice: string, seconds: number) => void
}

function usePrice() {
  const ui = useUi()
  return (cents: number) => ui.t.market.price(String(Math.floor(cents / 100)), String(cents % 100).padStart(2, '0'))
}

function useRewardText() {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  return (r: MarketReward) => {
    const parts: string[] = []
    if (r.seconds) parts.push(`${ui.fmt(world.rate() * r.seconds)} ${ui.labels.currency(primaryCurrency(world.def))}`)
    for (const g of r.grant ?? []) parts.push(amountText(ui, g))
    return parts.join(' + ')
  }
}

function amountText(ui: ReturnType<typeof useUi>, g: Amount): string {
  return `${ui.fmt(g.amount)} ${ui.labels.currency(g.currency)}`
}

/** Blocking countdown of the mock video; the reward follows when it ends. */
export function AdOverlay({ seconds, onDone, testPhase }: { seconds: number; onDone: () => void; testPhase: boolean }) {
  const ui = useUi()
  const [left, setLeft] = useState(seconds)
  const done = useRef(onDone)
  useEffect(() => {
    done.current = onDone
  }, [onDone])
  useEffect(() => {
    const end = Date.now() + seconds * 1000
    const id = setInterval(() => {
      const l = Math.max(0, Math.ceil((end - Date.now()) / 1000))
      setLeft(l)
      if (l <= 0) {
        clearInterval(id)
        done.current()
      }
    }, 250)
    return () => clearInterval(id)
  }, [seconds])
  return (
    <div className="ek-adlock" role="alertdialog" aria-modal="true" aria-label={ui.t.market.adRunning} data-testid="ad-overlay">
      <div className="ek-adlock__box">
        <h2 className="ek-h3">{ui.t.market.adRunning}</h2>
        <ProgressBar ratio={1 - left / Math.max(1, seconds)} label={ui.t.market.adRunning} />
        <p aria-live="polite">{ui.t.market.adLeft(String(left))}</p>
        {testPhase ? <p className="ek-muted">{ui.t.market.adTestNote}</p> : null}
      </div>
    </div>
  )
}

export function MarketPanel(props: MarketProps) {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const s = world.get<MarketState>(MARKET_ID)
  if (!s) return null
  return (
    <section className="ek-panel" aria-label={ui.labels.content('title.market').name} data-testid="market-view">
      {/* What can be bought comes first: the gift, then the offers (with the test wallet), then the looks */}
      <GiftCard cfg={props.cfg} s={s} />
      <OffersCard {...props} s={s} />
      <StylesCard cfg={props.cfg} s={s} styleArt={props.styleArt} />
      <AdCard {...props} s={s} />
      <BoostCard cfg={props.cfg} s={s} />
      <SkipCard cfg={props.cfg} s={s} />
      <PassCard cfg={props.cfg} s={s} />
    </section>
  )
}

function GiftCard({ cfg, s }: { cfg: MarketConfig; s: MarketState }) {
  const ui = useUi()
  const { dispatch } = useEngine(ui.rt)
  const ready = giftReady(s, ui.rt.clock)
  return (
    <Card title={ui.t.market.gift} testId="card-gift">
      <p className="ek-muted">{ui.t.market.giftBlurb} {cfg.gift.map((g) => amountText(ui, g)).join(' + ')}</p>
      <Button data-testid="gift-claim" disabled={!ready} onClick={() => dispatch(MARKET_ID, 'claimGift')}>
        {ready ? ui.t.live.claim : ui.t.live.claimed}
      </Button>
    </Card>
  )
}

function AdCard({ cfg, s, adSeconds, wallet, onAd }: MarketProps & { s: MarketState }) {
  const ui = useUi()
  const { dispatch } = useEngine(ui.rt)
  const reward = useRewardText()
  const [running, setRunning] = useState<{ choice: string; seconds: number } | null>(null)
  const wait = adCooldownLeft(s, cfg, ui.rt.clock.now())
  return (
    <Card title={ui.t.market.ad} testId="card-ad">
      <p className="ek-muted">{ui.t.market.adBlurb}</p>
      {s.adsRemoved ? (
        <p>{ui.t.market.adRemoved}</p>
      ) : (
        <div className="ek-row-actions">
          {cfg.ad.choices.map((c) => (
            <Button key={c.id} size="small" data-testid={`ad-${c.id}`} title={ui.labels.content(`adChoice.${c.id}`).blurb} disabled={wait > 0 || !!running} onClick={() => {
                const seconds = adSeconds()
                onAd?.(c.id, seconds)
                setRunning({ choice: c.id, seconds })
              }}>
              {ui.t.market.adWatch(reward(c))}
            </Button>
          ))}
        </div>
      )}
      {wait > 0 && !s.adsRemoved ? <p className="ek-muted">{ui.t.market.adCooldown(ui.duration(wait))}</p> : null}
      {running ? (
        <AdOverlay
          seconds={running.seconds}
          testPhase={!!wallet}
          onDone={() => {
            dispatch(MARKET_ID, 'watchAd', { choice: running.choice })
            setRunning(null)
          }}
        />
      ) : null}
    </Card>
  )
}

function PassCard({ cfg, s }: { cfg: MarketConfig; s: MarketState }) {
  const ui = useUi()
  const { dispatch } = useEngine(ui.rt)
  const reward = useRewardText()
  return (
    <Card title={ui.t.market.pass} testId="card-pass">
      <p className="ek-muted">{ui.t.market.passBlurb}</p>
      <ProgressBar ratio={s.passXp / Math.max(1, cfg.pass.maxXp)} label={ui.t.market.pass} />
      <p>{ui.t.market.passXp(ui.fmt(s.passXp), ui.fmt(cfg.pass.maxXp))}</p>
      <ul className="ek-list">
        {cfg.pass.tiers.map((tier, i) => {
          const reached = s.passXp >= tier.xp
          return (
            <li key={i} className={`ek-row${reached ? '' : ' is-locked'}`} data-testid={`pass-tier-${i + 1}`}>
              <div className="ek-row__main">
                <strong>{ui.t.market.passTier(String(i + 1))}</strong>
                <span className="ek-muted">{ui.t.market.passFree}: {reward(tier.free)}</span>
                <span className="ek-muted">{ui.t.market.passPremium}: {reward(tier.premium)}</span>
              </div>
              <div className="ek-row-actions">
                <Button size="small" data-testid={`pass-free-${i + 1}`} disabled={!passTierClaimable(s, cfg, i, false)} onClick={() => dispatch(MARKET_ID, 'passClaim', { tier: i, premium: false })}>
                  {(s.passFree & (1 << i)) !== 0 ? ui.t.live.claimed : ui.t.market.passFree}
                </Button>
                {s.passPremium ? (
                  <Button size="small" variant="secondary" disabled={!passTierClaimable(s, cfg, i, true)} onClick={() => dispatch(MARKET_ID, 'passClaim', { tier: i, premium: true })}>
                    {(s.passPaid & (1 << i)) !== 0 ? ui.t.live.claimed : ui.t.market.passPremium}
                  </Button>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

function SkipCard({ cfg, s }: { cfg: MarketConfig; s: MarketState }) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const left = skipHoursLeft(s, cfg, ui.rt.clock)
  const cur = ui.labels.currency(cfg.currency)
  return (
    <Card title={ui.t.market.skips} testId="card-skips">
      <p className="ek-muted">{ui.t.market.skipsBlurb}</p>
      <p>{ui.t.market.skipLeft(ui.fmt(left))}</p>
      <ul className="ek-list">
        {cfg.skips.map((k) => {
          const l = ui.labels.content(`skip.${k.id}`)
          const hours = Math.min(k.hours, left)
          return (
            <li key={k.id} className="ek-row" data-testid={`skip-${k.id}`}>
              <div className="ek-row__main">
                <strong>{l.name}</strong>
                <span className="ek-muted">{l.blurb}</span>
                <span className="ek-muted">{ui.t.market.hours(ui.fmt(k.hours))} · {ui.fmt(world.rate() * Math.max(0, hours) * 3600)}</span>
              </div>
              <Button size="small" disabled={hours <= 0 || world.balance(cfg.currency) < k.cost} onClick={() => dispatch(MARKET_ID, 'skip', { id: k.id })}>
                {ui.t.market.pay(ui.fmt(k.cost), cur)}
              </Button>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

function BoostCard({ cfg, s }: { cfg: MarketConfig; s: MarketState }) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const now = ui.rt.clock.now()
  const cur = ui.labels.currency(cfg.currency)
  const rows = [
    { id: 'boost', action: 'boost', cost: cfg.boost.cost, until: s.boostUntil, mult: cfg.boost.mult },
    { id: 'circle', action: 'circle', cost: cfg.circle.cost, until: s.circleUntil, mult: s.circleOn ? s.circleMult : cfg.circle.mult },
  ]
  return (
    <Card title={ui.t.market.boosts} testId="card-boosts">
      <ul className="ek-list">
        {rows.map((r) => {
          const l = ui.labels.content(`market.${r.id}`)
          return (
            <li key={r.id} className="ek-row" data-testid={`boost-${r.id}`}>
              <div className="ek-row__main">
                <strong>{l.name}</strong>
                <span className="ek-muted">{l.blurb}</span>
                <span>{ui.t.live.boost(`×${ui.fmt(r.mult)}`)}</span>
                {r.until > now ? <span className="ek-note">{ui.t.market.boostActive(ui.duration(r.until - now))}</span> : null}
              </div>
              <Button size="small" disabled={world.balance(cfg.currency) < r.cost} onClick={() => dispatch(MARKET_ID, r.action)}>
                {ui.t.market.pay(ui.fmt(r.cost), cur)}
              </Button>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

function StylesCard({ cfg, s, styleArt }: { cfg: MarketConfig; s: MarketState; styleArt?: (id: string) => ReactNode }) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const cur = ui.labels.currency(cfg.currency)
  return (
    <Card title={ui.t.market.styles} testId="card-styles">
      <p className="ek-muted">{ui.t.market.stylesBlurb}</p>
      <ul className="ek-list">
        {cfg.cosmetics.map((c) => {
          const l = ui.labels.content(`cosmetic.${c.id}`)
          const owned = s.owned.includes(c.id)
          const open = !c.when || c.when(world, ui.rt.clock)
          return (
            <li key={c.id} className={`ek-row${owned || open ? '' : ' is-locked'}`} data-testid={`style-${c.id}`}>
              {styleArt ? <span className="ek-row__art" aria-hidden="true">{styleArt(c.id)}</span> : null}
              <div className="ek-row__main">
                <strong>{l.name}</strong>
                <span className="ek-muted">{l.blurb}</span>
                {!owned && !open ? <span className="ek-muted">{ui.t.market.festOnly}</span> : null}
              </div>
              {owned ? (
                <Button size="small" variant="secondary" data-testid={`style-equip-${c.id}`} disabled={s.equipped === c.id} onClick={() => dispatch(MARKET_ID, 'equip', { id: c.id })}>
                  {s.equipped === c.id ? ui.t.market.equipped : ui.t.market.equip}
                </Button>
              ) : (
                <Button size="small" disabled={!open || world.balance(cfg.currency) < c.cost} onClick={() => dispatch(MARKET_ID, 'buyCosmetic', { id: c.id })}>
                  {ui.t.market.pay(ui.fmt(c.cost), cur)}
                </Button>
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

function OffersCard({ cfg, s, storeEnabled, wallet, prices, onTestPurchase }: MarketProps & { s: MarketState }) {
  const ui = useUi()
  const { dispatch } = useEngine(ui.rt)
  const price = usePrice()
  const w = useStore(wallet ?? NO_WALLET)
  const now = ui.rt.clock.now()
  const left = wallet ? wallet.left(now) : 0
  return (
    <Card title={ui.t.market.offers} testId="card-offers">
      <p className="ek-muted">{ui.t.market.offersBlurb}</p>
      {wallet ? (
        <>
          <p data-testid="wallet" data-spent={w.spentCents}>{ui.t.market.wallet(price(left), price(wallet.budgetCents))}</p>
          <p className="ek-muted">{ui.t.market.walletNote}</p>
        </>
      ) : null}
      <ul className="ek-list">
        {cfg.offers.map((o) => {
          const l = ui.labels.content(`offer.${o.id}`)
          const cents = prices[o.id] ?? 0
          const done = (o.once && s.offers.includes(o.id)) || (o.removeAds && s.adsRemoved) || (o.passPremium && s.passPremium)
          const canTest = !!wallet && cents <= left
          return (
            <li key={o.id} className="ek-row" data-testid={`offer-${o.id}`}>
              <div className="ek-row__main">
                <strong>{l.name}</strong>
                <span className="ek-muted">{l.blurb}</span>
                <span>{price(cents)}</span>
              </div>
              <Button
                size="small"
                data-testid={`offer-buy-${o.id}`}
                disabled={!!done || (!storeEnabled && !canTest)}
                onClick={() => {
                  if (storeEnabled) return void dispatch(MARKET_ID, 'buyOffer', { id: o.id })
                  if (!wallet) return
                  const ok = wallet.spend(cents, ui.rt.clock.now())
                  onTestPurchase?.(o.id, cents, ok)
                  if (ok) dispatch(MARKET_ID, 'buyOffer', { id: o.id })
                }}
              >
                {done ? ui.t.market.owned : storeEnabled ? price(cents) : wallet ? (canTest ? ui.t.market.testBuy(price(cents)) : ui.t.market.walletEmpty) : ui.t.market.soon}
              </Button>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

const NO_WALLET = { get: () => ({ month: '', spentCents: 0, totalCents: 0, purchases: 0 }), set: () => {}, subscribe: () => () => {} }
