import type { ReactNode } from 'react'
import { branchCost, isUnlocked, MODULE, nextMilestone, ownedOf, primaryCurrency, quote, type BranchesState, type ProducerDef } from '@engine/core'
import { useEngine } from '@engine/react'
import { buyCount, useBuyMode } from '../buyMode'
import { useUi } from '../useUi'
import { gateLines } from '../gates'
import { Button } from './Button'
import { BuyModeToggle } from './BuyModeToggle'
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

/** Buy button for one producer (×1/×10/max from the toggle). */
export function BuyButton({ p, label }: { p: ProducerDef; label?: string }) {
  const { ui, quote: q, affordable, buy, unlocked } = useProducer(p)
  return (
    <Button data-testid={`buy-${p.id}`} disabled={!unlocked || !affordable} onClick={buy}>
      <span>{ui.t.upgrade.buy(`×${q.levels || 1}`)}</span>
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

/** Detail sheet of one producer: level, yield, next milestone, buy, branches; `art` is the game's picture. */
export function UpgradeSheet({ p, open, onClose, art, note }: { p: ProducerDef | null; open: boolean; onClose: () => void; art?: ReactNode; note?: string }) {
  const ui = useUi()
  if (!p) return null
  return (
    <Sheet open={open} title={ui.labels.producer(p.id).name} onClose={onClose} testId="upgrade-sheet" className="ek-upgrade">
      <UpgradeBody p={p} art={art} note={note} />
    </Sheet>
  )
}

function UpgradeBody({ p, art, note }: { p: ProducerDef; art?: ReactNode; note?: string }) {
  const { ui, world, level, unlocked, dispatch } = useProducer(p)
  const l = ui.labels.producer(p.id)
  const m = nextMilestone(level, world.def.balance)
  if (!unlocked) {
    const g = gateLines(p.unlock, ui)
    return (
      <div className="ek-stack">
        {art}
        <p>{l.blurb}</p>
        <h3 className="ek-h3">{ui.t.upgrade.unlockTitle}</h3>
        {g.all.length ? <p>{ui.t.upgrade.gateAll}: {g.all.join(' · ')}</p> : null}
        {g.any.length ? <p>{ui.t.upgrade.gateAny}: {g.any.join(' · ')}</p> : null}
      </div>
    )
  }
  const branches = world.get<BranchesState>(MODULE.branches)?.ranks[p.id] ?? { efficiency: 0, capacity: 0 }
  const max = world.def.balance.branches.maxRank
  return (
    <div className="ek-stack">
      {art}
      <p>{l.blurb}</p>
      {note ? <blockquote className="ek-quote">{note}</blockquote> : null}
      <dl className="ek-facts">
        <dt>{ui.t.common.level('')}</dt>
        <dd data-testid="upgrade-level">{level}</dd>
        <dt>{ui.t.upgrade.rate}</dt>
        <dd>{ui.t.common.perSecond(ui.fmt(world.producerRate(p.id)))}</dd>
      </dl>
      <p className="ek-muted">{m ? ui.t.upgrade.nextMilestone(String(m.at)) : ui.t.upgrade.allMilestones}</p>
      <BuyModeToggle />
      <BuyButton p={p} />
      {level >= 1 ? (
        <>
          <h3 className="ek-h3">{ui.t.upgrade.branches}</h3>
          <div className="ek-grid2">
            {(['efficiency', 'capacity'] as const).map((kind) => {
              const rank = branches[kind]
              const cost = branchCost(p, kind, rank, world.def.balance)
              const full = rank >= max
              return (
                <div key={kind} className="ek-card">
                  <strong>{ui.t.upgrade[kind]}</strong>
                  <span className="ek-muted">{kind === 'efficiency' ? ui.t.upgrade.efficiencyBlurb : ui.t.upgrade.capacityBlurb}</span>
                  <span>{ui.t.common.rank(String(rank), String(max))}</span>
                  <Button size="small" variant="secondary" data-testid={`branch-${kind}`} disabled={full || world.balance(primaryCurrency(world.def)) < cost} onClick={() => dispatch(MODULE.branches, 'buy', { id: p.id, kind })}>
                    {full ? ui.t.meta.maxed : ui.fmt(cost)}
                  </Button>
                </div>
              )
            })}
          </div>
        </>
      ) : null}
    </div>
  )
}
