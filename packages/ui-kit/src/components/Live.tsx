/**
 * Live systems (retention): daily round, errands, deeds, trials, weekend and
 * flash windows, calendar fest shop, wheel, event pills, hint bubble.
 * Engine-neutral: titles and names come from `labels.content(key)`.
 */
import type { ReactNode } from 'react'
import {
  ACHIEVEMENTS_ID, CHALLENGES_ID, challengeAvailable, DAILY_ID, dailyStatus, FESTS_ID, festAt, festShop, FLASH_ID, localDayKey, QUESTS_ID, WEEKEND_ID, WHEEL_ID,
  type AchievementDef, type AchievementsState, type ChallengeConfig, type ChallengesState, type DailyConfig, type DailyState, type FestConfig, type FestsState,
  type FlashState, type QuestsState, type WeekendState, type WheelState,
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

export function QuestsCard() {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const s = world.get<QuestsState>(QUESTS_ID)
  if (!s) return null
  const t = ui.labels.content('title.quests')
  return (
    <Card title={t.name} testId="card-quests">
      <p className="ek-muted">{t.blurb}</p>
      <ul className="ek-list">
        {s.active.map((q) => {
          const l = ui.labels.content(`quest.${q.id}`)
          return (
            <li key={q.id} className="ek-row" data-testid={`quest-${q.id}`}>
              <div className="ek-row__main">
                <strong>{l.name}</strong>
                <span className="ek-muted">{l.blurb}</span>
                <ProgressBar ratio={q.progress / q.goal} label={l.name} />
                <span className="ek-muted">{ui.t.live.progress(ui.fmt(q.progress), ui.fmt(q.goal))}</span>
              </div>
              <Button size="small" data-testid={`quest-claim-${q.id}`} disabled={q.claimed || q.progress < q.goal} onClick={() => dispatch(QUESTS_ID, 'claim', { id: q.id })}>
                {q.claimed ? ui.t.live.claimed : ui.t.live.claim}
              </Button>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

export function AchievementsCard({ list }: { list: readonly AchievementDef[] }) {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const done = world.get<AchievementsState>(ACHIEVEMENTS_ID)?.done ?? []
  const t = ui.labels.content('title.deeds')
  return (
    <Card title={`${t.name} (${done.length}/${list.length})`} testId="card-deeds">
      <ul className="ek-list">
        {list.map((a) => {
          const l = ui.labels.content(`deed.${a.id}`)
          const ok = done.includes(a.id)
          const v = Math.min(a.at, a.metric(world))
          return (
            <li key={a.id} className={`ek-row${ok ? '' : ' is-locked'}`} data-testid={`deed-${a.id}`}>
              <div className="ek-row__main">
                <strong>{l.name}</strong>
                <span className="ek-muted">{l.blurb}</span>
                {ok ? <span>{ui.t.live.done}</span> : <ProgressBar ratio={v / a.at} label={l.name} />}
              </div>
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

export function FestCard({ cfg }: { cfg: FestConfig }) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const s = world.get<FestsState>(FESTS_ID)
  const fest = festAt(cfg, ui.rt.clock)
  if (!s || !fest) return null
  const l = ui.labels.content(`fest.${fest.id}`)
  return (
    <Card title={l.name} testId="card-fest">
      <p className="ek-muted">{l.blurb}</p>
      <p className="ek-strong">{ui.t.live.tokens(ui.fmt(s.tokens))}</p>
      <ul className="ek-list">
        {festShop(cfg, fest.id).map((item) => {
          const il = ui.labels.content(`festItem.${item.id}`)
          const n = s.bought[item.id] ?? 0
          return (
            <li key={item.id} className="ek-row" data-testid={`fest-item-${item.id}`}>
              <div className="ek-row__main">
                <strong>{il.name}</strong>
                <span className="ek-muted">{il.blurb}</span>
                <span className="ek-muted">{ui.t.live.bought(String(n), String(item.max))}</span>
              </div>
              <Button size="small" disabled={n >= item.max || s.tokens < item.cost} onClick={() => dispatch(FESTS_ID, 'buy', { id: item.id })}>
                {ui.t.live.cost(String(item.cost))}
              </Button>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

/** Wheel after a prestige: spin, see the result. */
export function WheelSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const s = world.get<WheelState>(WHEEL_ID)
  if (!s) return null
  const t = ui.labels.content('title.wheel')
  return (
    <Sheet open={open} title={t.name} onClose={onClose} testId="wheel-sheet">
      <p>{t.blurb}</p>
      <div className={`ek-wheel${s.last ? ' is-spun' : ''}`} aria-hidden="true" />
      <p>{ui.t.live.spins(String(s.spins))}</p>
      {s.last ? <p className="ek-strong">{ui.t.live.result(ui.labels.content(`wheel.${s.last}`).name)}</p> : null}
      <Button data-testid="wheel-spin" disabled={s.spins <= 0} onClick={() => dispatch(WHEEL_ID, 'spin')}>
        {ui.t.live.spin}
      </Button>
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
        <button key={p.id} type="button" className="ek-pill" data-testid={`pill-${p.id}`} onClick={p.onOpen ?? onOpen}>
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
