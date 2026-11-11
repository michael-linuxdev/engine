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
import { readKey, useEngine, useStore, writeKey, type TestWallet } from '@engine/react'
import { useUi } from '../useUi'
import { Button } from './Button'
import { ProgressBar } from './ProgressBar'
import { Sheet } from './Sheet'

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
  /** Called for every answer in the test purchase dialog (playtest log), with the test money left before it. */
  onTestPurchase?: (offer: string, cents: number, answer: TestBuyAnswer, leftCents: number) => void
  /** Called when a bonus video starts and when it ends or is cancelled (playtest log). */
  onAd?: (choice: string, seconds: number, phase: 'start' | 'done' | 'cancelled') => void
  /** Show a style on the game's own scene before buying (optional): adds a "look" button to each style. */
  onPreviewStyle?: (id: string) => void
  /** Storage key that remembers the last sub tab (optional). */
  rememberKey?: string
}

/** Answers of the test purchase dialog: bought, declined, would have bought (money short), closed without answer. */
export type TestBuyAnswer = 'yes' | 'no' | 'wouldBuy' | 'closed'

const MARKET_TABS = ['free', 'boosts', 'styles', 'offers'] as const
type MarketTab = (typeof MARKET_TABS)[number]

/** Pay button for the soft currency; while the balance is short, the missing amount stands below it. */
function PayButton({ cfg, cost, disabled, onPay, testId }: { cfg: MarketConfig; cost: number; disabled?: boolean; onPay: () => void; testId?: string }) {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const cur = ui.labels.currency(cfg.currency)
  const missing = cost - world.balance(cfg.currency)
  return (
    <div className="ek-pay">
      <Button size="small" data-testid={testId} disabled={disabled || missing > 0} onClick={onPay}>
        {ui.t.market.pay(ui.fmt(cost), cur)}
      </Button>
      {missing > 0 && !disabled ? <span className="ek-pay__need">{ui.t.market.need(ui.fmt(missing))}</span> : null}
    </div>
  )
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
export function AdOverlay({ seconds, onDone, onCancel, testPhase }: { seconds: number; onDone: () => void; onCancel?: () => void; testPhase: boolean }) {
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
        {onCancel ? (
          <Button variant="secondary" size="small" data-testid="ad-cancel" onClick={onCancel}>
            {ui.t.market.adCancel}
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export function MarketPanel(props: MarketProps) {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const s = world.get<MarketState>(MARKET_ID)
  const [tab, setTab] = useState<MarketTab>(() => {
    const saved = props.rememberKey ? readKey(props.rememberKey) : null
    return MARKET_TABS.find((x) => x === saved) ?? 'free'
  })
  if (!s) return null
  const pick = (x: MarketTab) => {
    setTab(x)
    if (props.rememberKey) writeKey(props.rememberKey, x)
  }
  const { cfg } = props
  return (
    <section className="ek-panel" aria-label={ui.labels.content('title.market').name} data-testid="market-view">
      {/* Always in view: what the player owns, then the four shelves */}
      <div className="ek-market-head">
        <p className="ek-market-balance" data-testid="market-balance">
          {ui.t.market.balance(ui.fmt(world.balance(cfg.currency)), ui.labels.currency(cfg.currency))}
        </p>
        <div className="ek-segmented ek-market-tabs" role="tablist" aria-label={ui.labels.content('title.market').name}>
          {MARKET_TABS.map((x) => (
            <button key={x} type="button" role="tab" aria-selected={tab === x} className={tab === x ? 'is-active' : ''} data-testid={`market-tab-${x}`} onClick={() => pick(x)}>
              {ui.t.market.tabs[x]}
            </button>
          ))}
        </div>
      </div>
      {tab === 'free' ? (
        <>
          <GiftCard cfg={cfg} s={s} />
          <AdCard {...props} s={s} />
          <PassCard cfg={cfg} s={s} />
        </>
      ) : null}
      {tab === 'boosts' ? (
        <>
          <BoostCard cfg={cfg} s={s} />
          <SkipCard cfg={cfg} s={s} />
        </>
      ) : null}
      {tab === 'styles' ? <StylesCard cfg={cfg} s={s} styleArt={props.styleArt} onPreview={props.onPreviewStyle} /> : null}
      {tab === 'offers' ? <OffersCard {...props} s={s} /> : null}
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
  const { dispatch, world } = useEngine(ui.rt)
  const reward = useRewardText()
  const [running, setRunning] = useState<{ choice: string; seconds: number } | null>(null)
  // A choice that only pays income time is worth nothing while there is no income: leave it out.
  const choices = cfg.ad.choices.filter((c) => (c.grant?.length ?? 0) > 0 || world.rate() > 0)
  const wait = adCooldownLeft(s, cfg, ui.rt.clock.now())
  return (
    <Card title={ui.t.market.ad} testId="card-ad">
      {/* Without ads the bonus stays: it is handed out right away, no video */}
      <p className="ek-muted">{s.adsRemoved ? ui.t.market.adRemoved : ui.t.market.adBlurb}</p>
      <div className="ek-row-actions">
        {choices.map((c) => (
          <Button key={c.id} size="small" data-testid={`ad-${c.id}`} title={ui.labels.content(`adChoice.${c.id}`).blurb} disabled={wait > 0 || !!running} onClick={() => {
              if (s.adsRemoved) return void dispatch(MARKET_ID, 'watchAd', { choice: c.id })
              const seconds = adSeconds()
              onAd?.(c.id, seconds, 'start')
              setRunning({ choice: c.id, seconds })
            }}>
            {s.adsRemoved ? ui.t.market.adClaim(reward(c)) : ui.t.market.adWatch(reward(c))}
          </Button>
        ))}
      </div>
      {wait > 0 ? <p className="ek-muted">{s.adsRemoved ? ui.t.market.adClaimCooldown(ui.duration(wait)) : ui.t.market.adCooldown(ui.duration(wait))}</p> : null}
      {running ? (
        <AdOverlay
          seconds={running.seconds}
          testPhase={!!wallet}
          onDone={() => {
            onAd?.(running.choice, running.seconds, 'done')
            dispatch(MARKET_ID, 'watchAd', { choice: running.choice })
            setRunning(null)
          }}
          onCancel={() => {
            onAd?.(running.choice, running.seconds, 'cancelled')
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
              <PayButton cfg={cfg} cost={k.cost} disabled={hours <= 0} onPay={() => dispatch(MARKET_ID, 'skip', { id: k.id })} />
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

function BoostCard({ cfg, s }: { cfg: MarketConfig; s: MarketState }) {
  const ui = useUi()
  const { dispatch } = useEngine(ui.rt)
  const now = ui.rt.clock.now()
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
              <PayButton cfg={cfg} cost={r.cost} onPay={() => dispatch(MARKET_ID, r.action)} />
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

function StylesCard({ cfg, s, styleArt, onPreview }: { cfg: MarketConfig; s: MarketState; styleArt?: (id: string) => ReactNode; onPreview?: (id: string) => void }) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
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
                {onPreview && s.equipped !== c.id ? (
                  <button type="button" className="ek-link" data-testid={`style-look-${c.id}`} onClick={() => onPreview(c.id)}>
                    {ui.t.market.look}
                  </button>
                ) : null}
              </div>
              {owned ? (
                <Button size="small" variant="secondary" data-testid={`style-equip-${c.id}`} disabled={s.equipped === c.id} onClick={() => dispatch(MARKET_ID, 'equip', { id: c.id })}>
                  {s.equipped === c.id ? ui.t.market.equipped : ui.t.market.equip}
                </Button>
              ) : (
                <PayButton cfg={cfg} cost={c.cost} disabled={!open} testId={`style-buy-${c.id}`} onPay={() => dispatch(MARKET_ID, 'buyCosmetic', { id: c.id })} />
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
  const [asking, setAsking] = useState<string | null>(null)
  const [bought, setBought] = useState<string | null>(null)
  const now = ui.rt.clock.now()
  const left = wallet ? wallet.left(now) : 0
  const askCents = asking ? (prices[asking] ?? 0) : 0
  // Every answer goes to the log; only "yes" spends test money and hands out the offer
  const answer = (a: TestBuyAnswer) => {
    if (!asking || !wallet) return
    const id = asking
    setAsking(null)
    onTestPurchase?.(id, askCents, a, left)
    if (a !== 'yes' || !wallet.spend(askCents, ui.rt.clock.now())) return
    dispatch(MARKET_ID, 'buyOffer', { id })
    setBought(id)
  }
  return (
    <Card title={ui.t.market.offers} testId="card-offers">
      <p className="ek-muted">{ui.t.market.offersBlurb}</p>
      {wallet ? (
        <>
          <p data-testid="wallet" data-spent={w.spentCents}>{ui.t.market.wallet(price(left), price(wallet.budgetCents))}</p>
          <p className="ek-muted">{ui.t.market.walletNote}</p>
        </>
      ) : null}
      {bought ? (
        <p role="status" className="ek-note" data-testid="offer-bought">
          {ui.t.market.testBought(ui.labels.content(`offer.${bought}`).name)}
        </p>
      ) : null}
      <ul className="ek-list">
        {cfg.offers.map((o) => {
          const l = ui.labels.content(`offer.${o.id}`)
          const cents = prices[o.id] ?? 0
          const done = (o.once && s.offers.includes(o.id)) || (o.removeAds && s.adsRemoved) || (o.passPremium && s.passPremium)
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
                disabled={!!done || (!storeEnabled && !wallet)}
                onClick={() => {
                  if (storeEnabled) return void dispatch(MARKET_ID, 'buyOffer', { id: o.id })
                  // Test phase: never book on the first tap, ask first
                  setBought(null)
                  setAsking(o.id)
                }}
              >
                {done ? ui.t.market.owned : storeEnabled ? price(cents) : wallet ? ui.t.market.testBuy(price(cents)) : ui.t.market.soon}
              </Button>
            </li>
          )
        })}
      </ul>
      <Sheet open={!!asking} title={ui.t.market.ask.title} onClose={() => answer('closed')} testId="testbuy-sheet">
        {asking ? (
          <>
            <p className="ek-strong">{ui.t.market.ask.question(ui.labels.content(`offer.${asking}`).name, price(askCents))}</p>
            <p className="ek-muted">{ui.t.market.ask.honest}</p>
            <p data-testid="testbuy-left">{ui.t.market.ask.left(price(left))}</p>
            {askCents <= left ? (
              <div className="ek-row-actions">
                <Button data-testid="testbuy-yes" onClick={() => answer('yes')}>{ui.t.market.ask.yes}</Button>
                <Button variant="secondary" data-testid="testbuy-no" onClick={() => answer('no')}>{ui.t.market.ask.no}</Button>
              </div>
            ) : (
              <>
                <p className="ek-note">{ui.t.market.ask.short}</p>
                <div className="ek-row-actions">
                  <Button data-testid="testbuy-would" onClick={() => answer('wouldBuy')}>{ui.t.market.ask.wouldBuy}</Button>
                  <Button variant="secondary" data-testid="testbuy-no" onClick={() => answer('no')}>{ui.t.market.ask.no}</Button>
                </div>
              </>
            )}
          </>
        ) : null}
      </Sheet>
    </Card>
  )
}

const NO_WALLET = { get: () => ({ month: '', spentCents: 0, totalCents: 0, purchases: 0 }), set: () => {}, subscribe: () => () => {} }
