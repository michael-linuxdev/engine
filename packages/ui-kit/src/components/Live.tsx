/**
 * Live systems (retention): daily round, errands, deeds, trials, weekend and
 * flash windows, calendar fest shop, wheel, event pills, hint bubble.
 * Engine-neutral: titles and names come from `labels.content(key)`.
 */
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import {
  ACHIEVEMENTS_ID, CHALLENGES_ID, challengeAvailable, DAILY_ID, dailyStatus, FESTS_ID, festAt, festDaysLeft, festShop, FLASH_ID, nextFest, primaryCurrency, localDayKey, QUESTS_ID, WEEKEND_ID, WEEKLY_ID, weeklyDone, WHEEL_ID,
  type AchievementDef, type AchievementsState, type ChallengeConfig, type ChallengesState, type DailyConfig, type DailyState, type FestConfig, type FestsState,
  type Amount, type FlashState, type QuestConfig, type QuestsState, type WeeklyPlanConfig, type WeeklyPlanState, type WeekendState, type WheelConfig, type WheelState,
} from '@engine/core'
import { useEngine } from '@engine/react'
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

/** Percent ring for a task that is still open (instead of a dead button). */
function Ring({ ratio }: { ratio: number }) {
  const pct = Math.max(0, Math.min(100, Math.floor(ratio * 100)))
  return (
    <span className="ek-ring" style={{ '--p': pct } as CSSProperties} data-testid="ring" aria-hidden="true">
      {pct}%
    </span>
  )
}

function useAmounts() {
  const ui = useUi()
  return (list: readonly Amount[]) => list.map((g) => `${ui.fmt(g.amount)} ${ui.labels.currency(g.currency)}`)
}

export function DailyCard({ cfg }: { cfg: DailyConfig }) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const s = world.get<DailyState>(DAILY_ID)
  if (!s) return null
  const st = dailyStatus(s, localDayKey(ui.rt.clock), cfg)
  const t = ui.labels.content('title.daily')
  return (
    <Card title={t.name} testId="card-daily">
      <p className="ek-muted">{t.blurb}</p>
      <p>
        {ui.t.live.day(String(st.day))} · {ui.t.live.streak(String(s.streak))}
      </p>
      {st.comeback && st.canClaim ? <p className="ek-note">{ui.t.live.comeback}</p> : null}
      <Button data-testid="daily-claim" disabled={!st.canClaim} onClick={() => dispatch(DAILY_ID, 'claim')}>
        {st.canClaim ? ui.t.live.claim : ui.t.live.claimed}
      </Button>
    </Card>
  )
}

/** `cfg` lets each errand name its reward. Claimable errands come first, collected ones last. */
export function QuestsCard({ cfg }: { cfg?: QuestConfig }) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const amounts = useAmounts()
  const s = world.get<QuestsState>(QUESTS_ID)
  if (!s) return null
  const t = ui.labels.content('title.quests')
  const rank = (q: QuestsState['active'][number]) => (q.claimed ? 2 : q.progress >= q.goal ? 0 : 1)
  const list = [...s.active].sort((a, b) => rank(a) - rank(b))
  return (
    <Card title={t.name} testId="card-quests">
      <p className="ek-muted">{t.blurb}</p>
      <ul className="ek-list">
        {list.map((q) => {
          const l = ui.labels.content(`quest.${q.id}`)
          const tpl = cfg?.templates.find((x) => x.id === q.id)
          const reward = tpl ? [...amounts(tpl.reward), ...(tpl.rewardSeconds ? [`${ui.fmt(world.rate() * tpl.rewardSeconds)} ${ui.labels.currency(primaryCurrency(world.def))}`] : [])] : []
          const ready = !q.claimed && q.progress >= q.goal
          return (
            <li key={q.id} className={`ek-row${q.claimed ? ' is-done' : ''}`} data-testid={`quest-${q.id}`} data-state={q.claimed ? 'claimed' : ready ? 'ready' : 'open'}>
              <div className="ek-row__main">
                <strong>{l.name}</strong>
                <span className="ek-muted">{l.blurb}</span>
                <ProgressBar ratio={q.progress / q.goal} label={l.name} />
                <span className="ek-muted">{ui.t.live.progress(ui.fmt(q.progress), ui.fmt(q.goal))}</span>
                {reward.length ? <span data-testid={`quest-reward-${q.id}`}>{ui.t.live.rewardLine(reward.join(' + '))}</span> : null}
              </div>
              {ready || q.claimed ? (
                <Button size="small" data-testid={`quest-claim-${q.id}`} disabled={q.claimed} onClick={() => dispatch(QUESTS_ID, 'claim', { id: q.id })}>
                  {q.claimed ? ui.t.live.claimed : ui.t.live.claim}
                </Button>
              ) : (
                <Ring ratio={q.progress / q.goal} />
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

/** Weekly plan: a few goals for the calendar week and one bonus for all of them. Names: `weekly.<goal id>`, title `title.weekly`. */
export function WeeklyCard({ cfg }: { cfg: WeeklyPlanConfig }) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const amounts = useAmounts()
  const s = world.get<WeeklyPlanState>(WEEKLY_ID)
  if (!s) return null
  const t = ui.labels.content('title.weekly')
  const done = weeklyDone(s, cfg)
  return (
    <Card title={t.name} testId="card-weekly">
      <p className="ek-muted">{t.blurb}</p>
      <ul className="ek-list">
        {cfg.goals.map((g) => {
          const n = Math.min(g.target, s.progress[g.id] ?? 0)
          const l = ui.labels.content(`weekly.${g.id}`)
          return (
            <li key={g.id} className={`ek-row${n >= g.target ? ' is-done' : ''}`} data-testid={`weekly-${g.id}`}>
              <div className="ek-row__main">
                <strong>{l.name}</strong>
                <ProgressBar ratio={n / g.target} label={l.name} />
                <span className="ek-muted">{ui.t.live.progress(String(n), String(g.target))}</span>
              </div>
              {n >= g.target ? <span>{ui.t.live.done}</span> : <Ring ratio={n / g.target} />}
            </li>
          )
        })}
      </ul>
      <p>{ui.t.live.rewardLine(amounts(cfg.reward).join(' + '))}</p>
      <Button data-testid="weekly-claim" disabled={!done || s.claimed} onClick={() => dispatch(WEEKLY_ID, 'claim')}>
        {s.claimed ? ui.t.live.claimed : ui.t.live.claim}
      </Button>
    </Card>
  )
}

/** Deeds: open ones first (closest to done on top), finished ones below; each names its reward. */
export function AchievementsCard({ list }: { list: readonly AchievementDef[] }) {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const amounts = useAmounts()
  const done = world.get<AchievementsState>(ACHIEVEMENTS_ID)?.done ?? []
  const t = ui.labels.content('title.deeds')
  const rows = list.map((a) => ({ a, ok: done.includes(a.id), ratio: Math.min(1, a.metric(world) / a.at) }))
  rows.sort((x, y) => Number(x.ok) - Number(y.ok) || y.ratio - x.ratio)
  return (
    <Card title={`${t.name} (${done.length}/${list.length})`} testId="card-deeds">
      <ul className="ek-list">
        {rows.map(({ a, ok, ratio }) => {
          const l = ui.labels.content(`deed.${a.id}`)
          const reward = [...amounts(a.reward), ...(a.bonus ? [ui.t.live.bonusLine(String(Math.round(a.bonus * 1000) / 10))] : [])]
          return (
            <li key={a.id} className={`ek-row${ok ? ' is-done' : ''}`} data-testid={`deed-${a.id}`}>
              <div className="ek-row__main">
                <strong>{l.name}</strong>
                <span className="ek-muted">{l.blurb}</span>
                {ok ? <span>{ui.t.live.done}</span> : <ProgressBar ratio={ratio} label={l.name} />}
                {reward.length ? <span className="ek-muted">{ui.t.live.rewardLine(reward.join(' + '))}</span> : null}
              </div>
              {ok ? null : <Ring ratio={ratio} />}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

export function ChallengesCard({ cfg }: { cfg: ChallengeConfig }) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const s = world.get<ChallengesState>(CHALLENGES_ID)
  if (!s) return null
  const t = ui.labels.content('title.trials')
  return (
    <Card title={t.name} testId="card-trials">
      <p className="ek-muted">{t.blurb}</p>
      <ul className="ek-list">
        {cfg.list.map((c) => {
          const l = ui.labels.content(`trial.${c.id}`)
          const done = s.done.includes(c.id)
          const active = s.active === c.id
          const open = challengeAvailable(cfg, c, world)
          return (
            <li key={c.id} className={`ek-row${open ? '' : ' is-locked'}`} data-testid={`trial-${c.id}`}>
              <div className="ek-row__main">
                <strong>{l.name}</strong>
                <span className="ek-muted">{l.blurb}</span>
                <span>{done ? ui.t.live.done : active ? ui.t.live.active : open ? ui.t.live.open : ui.t.live.locked}</span>
              </div>
              {active ? (
                <Button size="small" variant="secondary" onClick={() => dispatch(CHALLENGES_ID, 'abandon')}>
                  {ui.t.live.abandon}
                </Button>
              ) : (
                <Button size="small" data-testid={`trial-start-${c.id}`} disabled={done || !open || !!s.active} onClick={() => dispatch(CHALLENGES_ID, 'start', { id: c.id })}>
                  {ui.t.live.start}
                </Button>
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

export function WeekendCard() {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const s = world.get<WeekendState>(WEEKEND_ID)
  if (!s || (!s.active && (s.claimed || s.goal === 0))) return null
  const t = ui.labels.content('title.weekend')
  return (
    <Card title={t.name} testId="card-weekend">
      <p className="ek-muted">{t.blurb}</p>
      <ProgressBar ratio={s.goal ? s.earned / s.goal : 0} label={t.name} />
      <p>{ui.t.live.progress(ui.fmt(s.earned), ui.fmt(s.goal))}</p>
      <Button data-testid="weekend-claim" disabled={s.claimed || s.earned < s.goal} onClick={() => dispatch(WEEKEND_ID, 'claim')}>
        {s.claimed ? ui.t.live.claimed : ui.t.live.claim}
      </Button>
    </Card>
  )
}

export function FlashCard() {
  const ui = useUi()
  const { world, dispatch, state } = useEngine(ui.rt)
  const s = world.get<FlashState>(FLASH_ID)
  if (!s || s.endsAt === 0) return null
  const t = ui.labels.content('title.flash')
  const left = Math.max(0, s.endsAt - state.core.lastSeen)
  return (
    <Card title={t.name} testId="card-flash">
      <p className="ek-muted">{t.blurb}</p>
      {left > 0 ? <p>{ui.t.live.endsIn(ui.duration(left))}</p> : null}
      <ProgressBar ratio={s.goal ? s.earned / s.goal : 0} label={t.name} />
      <Button data-testid="flash-claim" disabled={s.claimed || s.earned < s.goal} onClick={() => dispatch(FLASH_ID, 'claim')}>
        {s.claimed ? ui.t.live.claimed : ui.t.live.claim}
      </Button>
    </Card>
  )
}

/** Calendar fest: how long it runs, the shop (what is left on top), how tokens are earned, which fest comes next. */
export function FestCard({ cfg }: { cfg: FestConfig }) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const s = world.get<FestsState>(FESTS_ID)
  const fest = festAt(cfg, ui.rt.clock)
  if (!s || !fest) return null
  const l = ui.labels.content(`fest.${fest.id}`)
  const items = festShop(cfg, fest.id, world).map((item) => ({ item, n: s.bought[item.id] ?? 0 }))
  // What can still be bought stands on top, sold-out goods at the bottom
  items.sort((a, b) => Number(a.n >= a.item.max) - Number(b.n >= b.item.max))
  const next = nextFest(cfg, ui.rt.clock)
  return (
    <Card title={l.name} testId="card-fest">
      <p className="ek-muted">{l.blurb}</p>
      <p data-testid="fest-ends">
        {ui.t.live.festEnds(String(festDaysLeft(cfg, ui.rt.clock)))} {ui.t.live.festExpire}
      </p>
      <p className="ek-strong">{ui.t.live.tokens(ui.fmt(s.tokens))}</p>
      <ul className="ek-list">
        {items.map(({ item, n }) => {
          const il = ui.labels.content(`festItem.${item.id}`)
          const out = n >= item.max
          return (
            <li key={item.id} className={`ek-row${out ? ' is-done' : ''}`} data-testid={`fest-item-${item.id}`}>
              <div className="ek-row__main">
                <strong>{il.name}</strong>
                <span className="ek-muted">{il.blurb}</span>
                <span className="ek-muted">{out ? (item.max === 1 ? ui.t.live.haveIt : ui.t.live.soldOut) : ui.t.live.left(String(item.max - n))}</span>
              </div>
              <div className="ek-pay">
                <Button size="small" disabled={out || s.tokens < item.cost} onClick={() => dispatch(FESTS_ID, 'buy', { id: item.id })}>
                  {ui.t.live.cost(String(item.cost))}
                </Button>
                {!out && s.tokens < item.cost ? <span className="ek-pay__need">{ui.t.market.need(ui.fmt(item.cost - s.tokens))}</span> : null}
              </div>
            </li>
          )
        })}
      </ul>
      <div className="ek-note" data-testid="fest-earn">
        <strong>{ui.t.live.earnTitle}</strong>
        <ul className="ek-plain-list">
          {Object.entries(cfg.earn).map(([event, n]) => (
            <li key={event}>{ui.t.live.earnRow(ui.labels.content(`festEarn.${event}`).name, String(n))}</li>
          ))}
        </ul>
      </div>
      {next ? <p className="ek-muted" data-testid="fest-next">{ui.t.live.nextFest(ui.labels.content(`fest.${next.id}`).name)}</p> : null}
    </Card>
  )
}

/** Full turns before the wheel settles, and how long that takes. */
const WHEEL_TURNS = 4
const WHEEL_MS = 2600
const WHEEL_TONES = 4

function wheelPoint(deg: number, r: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180
  return [Math.round(Math.cos(a) * r * 100) / 100, Math.round(Math.sin(a) * r * 100) / 100]
}

/** Segment angles follow the weights, so the picture shows the real odds. */
function wheelSlices(cfg: WheelConfig) {
  const total = cfg.segments.reduce((a, x) => a + x.weight, 0) || 1
  let at = 0
  return cfg.segments.map((seg, i) => {
    const from = at
    at += (seg.weight / total) * 360
    return { seg, i, from, to: at, mid: (from + at) / 2 }
  })
}

function calmMotion(): boolean {
  return document.documentElement.classList.contains('ek-reduced-motion') || window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Wheel after a prestige: spin, watch it settle under the pointer, read the result. */
export function WheelSheet({ open, onClose, cfg }: { open: boolean; onClose: () => void; cfg: WheelConfig }) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const s = world.get<WheelState>(WHEEL_ID)
  const [rot, setRot] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'spinning' | 'done'>('idle')
  const [won, setWon] = useState('')
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  if (!s) return null
  const t = ui.labels.content('title.wheel')
  const slices = wheelSlices(cfg)
  const close = () => {
    window.clearTimeout(timer.current)
    setPhase('idle')
    setWon('')
    onClose()
  }
  const spin = () => {
    if (phase === 'spinning' || !dispatch(WHEEL_ID, 'spin')) return
    const id = ui.rt.world().get<WheelState>(WHEEL_ID)?.last ?? ''
    const hit = slices.find((x) => x.seg.id === id)
    setWon(id)
    if (!hit || calmMotion()) {
      if (hit) setRot(-hit.mid)
      setPhase('done')
      return
    }
    // Land the middle of the won segment under the pointer at the top
    setRot((r) => r + WHEEL_TURNS * 360 + ((360 - (((r + hit.mid) % 360) + 360) % 360) % 360))
    setPhase('spinning')
    timer.current = window.setTimeout(() => setPhase('done'), WHEEL_MS)
  }
  const shown = phase === 'done' ? won : ''
  return (
    <Sheet open={open} title={t.name} onClose={close} testId="wheel-sheet">
      <p>{t.blurb}</p>
      <div className={`ek-wheel is-${phase}`} aria-hidden="true">
        <svg viewBox="-120 -124 240 244" className="ek-wheel__svg">
          <circle r="112" className="ek-wheel__rim" />
          <g className="ek-wheel__disc" style={{ transform: `rotate(${rot}deg)`, transitionDuration: `${WHEEL_MS}ms` }}>
            {slices.map(({ seg, i, from, to, mid }) => {
              const [x0, y0] = wheelPoint(from, 100)
              const [x1, y1] = wheelPoint(to, 100)
              const [mx, my] = wheelPoint(mid, 62)
              return (
                <g key={seg.id} className={`ek-wheel__seg ek-wheel__seg--${i % WHEEL_TONES}${shown === seg.id ? ' is-won' : ''}`}>
                  <path d={`M0 0L${x0} ${y0}A100 100 0 ${to - from > 180 ? 1 : 0} 1 ${x1} ${y1}Z`} />
                  <g transform={`translate(${mx} ${my}) rotate(${mid})`} className="ek-wheel__mark">
                    {seg.kind === 'buff' ? (
                      <path d="M0 -15L4 -5L15 -4L7 3L9 14L0 8L-9 14L-7 3L-15 -4L-4 -5Z" />
                    ) : (
                      <path d="M0 -15L11 0L0 15L-11 0Z" />
                    )}
                  </g>
                </g>
              )
            })}
            {slices.map(({ seg, from }) => {
              const [x, y] = wheelPoint(from, 106)
              return <circle key={seg.id} cx={x} cy={y} r="4.5" className="ek-wheel__stud" />
            })}
            <circle r="17" className="ek-wheel__hub" />
            <circle r="6" className="ek-wheel__pin" />
          </g>
          <path d="M-13 -122L13 -122L0 -94Z" className="ek-wheel__pointer" />
        </svg>
      </div>
      <p className="ek-wheel__result" role="status" data-testid="wheel-result">
        {shown ? (
          <>
            <strong>{ui.labels.content(`wheel.${shown}`).name}</strong>
            <span>{ui.labels.content(`wheel.${shown}`).blurb}</span>
          </>
        ) : (
          <span className="ek-muted">{phase === 'spinning' ? ui.t.live.spinning : ui.t.live.spinAsk}</span>
        )}
      </p>
      {phase === 'done' && s.spins <= 0 ? (
        <Button data-testid="wheel-done" onClick={close}>
          {ui.t.live.spinDone}
        </Button>
      ) : (
        <Button data-testid="wheel-spin" disabled={s.spins <= 0 || phase === 'spinning'} onClick={spin}>
          {s.spins > 1 ? ui.t.live.spinMore(String(s.spins)) : ui.t.live.spin}
        </Button>
      )}
      <ul className="ek-wheel__legend">
        {slices.map(({ seg, i }) => (
          <li key={seg.id} className={shown === seg.id ? 'is-won' : undefined}>
            <i className={`ek-wheel__dot ek-wheel__dot--${i % WHEEL_TONES}`} aria-hidden="true" />
            <span>
              <strong>{ui.labels.content(`wheel.${seg.id}`).name}</strong> {ui.labels.content(`wheel.${seg.id}`).blurb}
            </span>
          </li>
        ))}
      </ul>
    </Sheet>
  )
}

/** Pills shown at once; the rest hides behind "+N". */
const PILLS_MAX = 3

export interface Pill {
  id: string
  text: string
  icon?: ReactNode
  onOpen?: () => void
  /** `claim`: something waits to be collected with this tap. */
  tone?: 'claim'
}

/**
 * Small status pills under the HUD: running events with their time left, plus
 * pills of the game (`extra`, shown first). At most three; the rest hides behind "+N".
 */
export function EventPills({ onOpen, extra = [], icons = {} }: { onOpen: () => void; extra?: readonly Pill[]; icons?: Readonly<Record<string, ReactNode>> }) {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const now = ui.rt.clock.now()
  const left = (until: number) => (until > now ? ` · ${ui.duration(until - now)}` : '')
  const pills: Pill[] = [...extra]
  if (world.get<WeekendState>(WEEKEND_ID)?.active) pills.push({ id: 'weekend', text: ui.labels.content('title.weekend').name })
  const flash = world.get<FlashState>(FLASH_ID)
  if (flash?.active) pills.push({ id: 'flash', text: ui.labels.content('title.flash').name + left(flash.endsAt) })
  const fest = world.get<FestsState>(FESTS_ID)
  if (fest?.boostActive) pills.push({ id: 'fest', text: ui.t.effects.fest + left(fest.boostUntil) })
  if (!pills.length) return null
  const shown = pills.slice(0, PILLS_MAX)
  const more = pills.length - shown.length
  return (
    <div className="ek-pills">
      {shown.map((p) => (
        <button key={p.id} type="button" className={`ek-pill${p.tone ? ` ek-pill--${p.tone}` : ''}`} data-testid={`pill-${p.id}`} onClick={p.onOpen ?? onOpen}>
          {p.icon ?? icons[p.id] ? <span className="ek-pill__icon" aria-hidden="true">{p.icon ?? icons[p.id]}</span> : null}
          {p.text}
        </button>
      ))}
      {more > 0 ? (
        <button type="button" className="ek-pill" data-testid="pill-more" aria-label={ui.t.live.morePills(String(more))} onClick={onOpen}>
          +{more}
        </button>
      ) : null}
    </div>
  )
}

export function HintBubble({ hint, onClose }: { hint: { title: string; body: string } | null; onClose: () => void }) {
  const ui = useUi()
  if (!hint) return null
  return (
    <aside className="ek-coach ek-hint" role="status" aria-live="polite" data-testid="hint">
      <strong className="ek-coach__title">{hint.title}</strong>
      <span>{hint.body}</span>
      <button type="button" className="ek-btn ek-btn--ghost ek-btn--small" data-testid="hint-close" onClick={onClose}>
        {ui.t.live.hintClose}
      </button>
    </aside>
  )
}
