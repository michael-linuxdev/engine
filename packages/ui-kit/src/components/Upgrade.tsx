import { useEffect, useRef, useState, type ReactNode } from 'react'
import { baseRate, branchCost, isUnlocked, milestoneMult, milestonesReached, MODULE, nextMilestone, ownedOf, primaryCurrency, quote, type BranchesState, type ProducerDef } from '@engine/core'
import { useEngine } from '@engine/react'
import { buyCount, useBuyMode } from '../buyMode'
import { useUi } from '../useUi'
import { gateChecks, gateLines, type GateCheck } from '../gates'
import { Button } from './Button'
import { BuyModeToggle } from './BuyModeToggle'
import { ProgressBar } from './ProgressBar'
import { Sheet } from './Sheet'

function useProducer(p: ProducerDef) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const mode = useBuyMode()
  const level = ownedOf(world, p.id)
  const unlocked = isUnlocked(world, p)
  const q = quote(world, p.id, buyCount(mode))
  // In max mode with nothing affordable show the single-level price.
  const shown = q.levels > 0 ? q : quote(world, p.id, 1)
  const affordable = q.levels > 0 && world.balance(primaryCurrency(world.def)) >= q.cost
  const buy = () => dispatch(MODULE.producers, 'buy', { id: p.id, count: buyCount(mode) })
  return { ui, world, level, unlocked, quote: shown, affordable, buy, dispatch }
}

/**
 * Buy button for one producer (×1/×10/max from the toggle). While the price is
 * not yet affordable the button fills up like a loading bar, so the player sees
 * how close the next level is. A purchase flashes briefly.
 */
export function BuyButton({ p, label }: { p: ProducerDef; label?: string }) {
  const { ui, world, level, quote: q, affordable, buy, unlocked } = useProducer(p)
  const money = world.balance(primaryCurrency(world.def))
  const ratio = !unlocked ? 0 : q.cost > 0 ? Math.max(0, Math.min(1, money / q.cost)) : 1
  // Flash when the level rises (also through press-and-hold)
  const [flash, setFlash] = useState(false)
  const before = useRef(level)
  useEffect(() => {
    if (level > before.current) {
      setFlash(true)
      const id = setTimeout(() => setFlash(false), 220)
      before.current = level
      return () => clearTimeout(id)
    }
    before.current = level
  }, [level])
  const count = q.levels || 1
  return (
    <Button data-testid={`buy-${p.id}`} className={`ek-buy${affordable ? ' is-ready' : ''}${flash ? ' is-bought' : ''}`} repeat disabled={!unlocked || !affordable} onClick={buy}>
      <span className="ek-buy__fill" style={{ width: `${Math.round(ratio * 100)}%` }} data-testid="buy-fill" data-ratio={Math.round(ratio * 100)} aria-hidden="true" />
      <span className="ek-buy__label">{ui.t.upgrade.buy(count > 1 ? `×${count}` : '').trim()}</span>
      <span className="ek-visually-hidden">{label ?? ui.labels.producer(p.id).name}</span>
      <span className="ek-btn__cost">{ui.fmt(q.cost)}</span>
    </Button>
  )
}

/** Plain list of all producers (template game; themed games use a map + UpgradeSheet). */
export function ProducerList() {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  return (
    <section className="ek-panel" aria-label={ui.t.nav.play}>
      <BuyModeToggle />
      <ul className="ek-list">
        {world.def.producers.map((p) => {
          const level = ownedOf(world, p.id)
          const unlocked = isUnlocked(world, p)
          const l = ui.labels.producer(p.id)
          return (
            <li key={p.id} className={`ek-row${unlocked ? '' : ' is-locked'}`} data-testid={`producer-${p.id}`}>
              <div className="ek-row__main">
                <strong>{l.name}</strong>
                <span className="ek-muted">
                  {unlocked ? `${ui.t.common.level(String(level))} · ${ui.t.common.perSecond(ui.fmt(world.producerRate(p.id)))}` : gateLines(p.unlock, ui).any.concat(gateLines(p.unlock, ui).all).join(' · ')}
                </span>
              </div>
              {unlocked ? <BuyButton p={p} /> : <span className="ek-muted">{ui.t.common.locked}</span>}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/** Conditions of a gate as a checklist. `done`: for "one of these", the group is fulfilled as a whole. */
function GateList({ title, items, testId, done }: { title: string; items: GateCheck[]; testId: string; done?: boolean }) {
  const ui = useUi()
  return (
    <div className="ek-gate" data-testid={testId}>
      <strong>{title}</strong>
      <ul className="ek-gate__list">
        {items.map((x, i) => {
          const ok = x.ok
          // In a fulfilled "one of these" group the other conditions no longer matter
          const moot = !ok && done === true
          return (
            <li key={i} className={ok ? 'is-ok' : moot ? 'is-moot' : 'is-missing'} data-ok={ok}>
              <span className="ek-gate__mark" aria-hidden="true">
                {ok ? '✓' : moot ? '–' : '✗'}
              </span>
              <span>{x.text}</span>
              <span className="ek-visually-hidden">{ok ? ui.t.upgrade.gateOk : moot ? '' : ui.t.upgrade.gateMissing}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Rank as filled and empty pips, with the numbers as accessible text. */
export function Pips({ n, max }: { n: number; max: number }) {
  const ui = useUi()
  return (
    <span className="ek-pips">
      <span aria-hidden="true">
        {Array.from({ length: max }, (_, i) => (
          <i key={i} className={i < n ? 'is-on' : ''} />
        ))}
      </span>
      <span className="ek-visually-hidden">{ui.t.common.rank(String(n), String(max))}</span>
    </span>
  )
}

/**
 * Detail sheet of one producer: level, yield, next milestone, buy, branches; `art` is the game's picture.
 * `buyModes: false` hides the ×1/×10/max toggle: one level per tap, press and hold to keep building.
 */
export function UpgradeSheet({ p, open, onClose, art, note, buyModes = true }: { p: ProducerDef | null; open: boolean; onClose: () => void; art?: ReactNode; note?: string; buyModes?: boolean }) {
  const ui = useUi()
  if (!p) return null
  return (
    <Sheet open={open} title={ui.labels.producer(p.id).name} onClose={onClose} testId="upgrade-sheet" className="ek-upgrade" dim={false}>
      <UpgradeBody p={p} art={art} note={note} buyModes={buyModes} />
    </Sheet>
  )
}

function UpgradeBody({ p, art, note, buyModes }: { p: ProducerDef; art?: ReactNode; note?: string; buyModes: boolean }) {
  const { ui, world, level, unlocked, dispatch } = useProducer(p)
  const l = ui.labels.producer(p.id)
  const m = nextMilestone(level, world.def.balance)
  if (!unlocked) {
    const g = gateChecks(p.unlock, ui, world)
    return (
      <div className="ek-stack">
        <div className="ek-upgrade__top">
          <div className="ek-upgrade__hero">{art}</div>
          <div className="ek-upgrade__info">
            <span>{l.blurb}</span>
          </div>
        </div>
        <h3 className="ek-h3">{ui.t.upgrade.unlockTitle}</h3>
        {/* Checklist: what already holds and what is still missing */}
        {g.all.length ? <GateList title={ui.t.upgrade.gateAll} items={g.all} testId="gate-all" /> : null}
        {g.any.length ? <GateList title={ui.t.upgrade.gateAny} items={g.any} testId="gate-any" done={g.any.some((x) => x.ok)} /> : null}
      </div>
    )
  }
  const branches = world.get<BranchesState>(MODULE.branches)?.ranks[p.id] ?? { efficiency: 0, capacity: 0 }
  const max = world.def.balance.branches.maxRank
  const milestone = m ? ui.t.upgrade.nextMilestone(String(m.at)) : ui.t.upgrade.allMilestones
  const reached = milestonesReached(level, world.def.balance)
  const rate = world.producerRate(p.id)
  // What one more level adds (same bonuses, next level's base yield and milestone factor)
  const base = baseRate(p, level) * milestoneMult(level, world.def.balance)
  const gain = level > 0 && base > 0 ? rate * ((baseRate(p, level + 1) * milestoneMult(level + 1, world.def.balance)) / base - 1) : 0
  const money = world.balance(primaryCurrency(world.def))
  const next = quote(world, p.id, 1).cost
  const missing = Math.max(0, next - money)
  return (
    <div className="ek-stack">
      {/* Compact like a card over the map: picture with level badge, yield and a short line beside it */}
      <div className="ek-upgrade__top">
        <div className="ek-upgrade__hero">
          {art}
          <span className="ek-upgrade__badge">
            <span className="ek-visually-hidden">{ui.t.common.level('').trim()}</span>
            <strong data-testid="upgrade-level">{level}</strong>
          </span>
        </div>
        <div className="ek-upgrade__info">
          {reached > 0 ? (
            <span className="ek-stars" data-testid="upgrade-stars" data-stars={reached}>
              <span aria-hidden="true">
                <span className="ek-stars__on">{'★'.repeat(Math.min(5, reached))}</span>
                <span className="ek-stars__off">{'★'.repeat(Math.max(0, 5 - reached))}</span>
                {reached > 5 ? ` +${reached - 5}` : ''}
              </span>
              <span className="ek-visually-hidden">{ui.t.upgrade.milestonesReached(String(reached))}</span>
            </span>
          ) : null}
          <strong className="ek-upgrade__rate">
            {ui.t.common.perSecond(ui.fmt(rate))}
            {gain > 0 ? <span className="ek-upgrade__gain"> +{ui.t.common.perSecond(ui.fmt(gain))}</span> : null}
          </strong>
          <span className="ek-muted">{note ?? l.blurb}</span>
        </div>
      </div>
      <div className="ek-upgrade__milestone">
        <span className="ek-muted">{milestone}</span>
        <ProgressBar ratio={m ? Math.max(0, Math.min(1, (level - m.from) / Math.max(1, m.at - m.from))) : 1} label={milestone} />
      </div>
      {buyModes ? <BuyModeToggle /> : null}
      <BuyButton p={p} />
      {buyModes ? null : (
        <p className="ek-muted ek-hold-hint" data-testid="buy-hint">
          {missing > 0 ? ui.t.upgrade.needMore(ui.fmt(missing), ui.labels.currency(primaryCurrency(world.def))) : ui.t.upgrade.holdHint}
        </p>
      )}
      {level >= 1 ? (
        <section className="ek-upgrade__branches" aria-label={ui.t.upgrade.branches}>
          {(['efficiency', 'capacity'] as const).map((kind) => {
            const rank = branches[kind]
            const cost = branchCost(p, kind, rank, world.def.balance)
            const full = rank >= max
            return (
              <div key={kind} className="ek-card ek-branch">
                <span className="ek-branch__head">
                  <strong>{ui.t.upgrade[kind]}</strong>
                  <Pips n={rank} max={max} />
                </span>
                <span className="ek-muted ek-branch__blurb">{kind === 'efficiency' ? ui.t.upgrade.efficiencyBlurb : ui.t.upgrade.capacityBlurb}</span>
                <Button size="small" variant="secondary" data-testid={`branch-${kind}`} disabled={full || world.balance(primaryCurrency(world.def)) < cost} onClick={() => dispatch(MODULE.branches, 'buy', { id: p.id, kind })}>
                  {full ? ui.t.meta.maxed : ui.fmt(cost)}
                </Button>
              </div>
            )
          })}
        </section>
      ) : null}
    </div>
  )
}
