import { canBuyMeta, isRankUnlocked, isTipRank, metaCost, metaLayerCount, MODULE, nextLockedMeta, rankOf } from '@engine/core'
import { useEngine } from '@engine/react'
import { useUi } from '../useUi'
import { Button } from './Button'
import { ProgressBar } from './ProgressBar'

/** Meta shop grouped by branch; shows rank, effect, cost, lock state and the next unlock. */
/** `branchVisible`: hide branches until the player can use them (e.g. layer currencies never earned). */
export function MetaShopPanel({ title, branchVisible }: { title?: string; branchVisible?: (branch: string) => boolean }) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const items = world.def.metaShop
  const branches = [...new Set(items.map((i) => i.branch))].filter((b) => !branchVisible || branchVisible(b))
  const currencies = [...new Set(items.filter((i) => branches.includes(i.branch)).map((i) => i.currency))]
  const next = nextLockedMeta(world)
  const count = metaLayerCount(world)
  return (
    <section className="ek-panel" aria-label={title ?? ui.t.meta.title} data-testid="meta-shop">
      <h2 className="ek-h2">{title ?? ui.t.meta.title}</h2>
      <p className="ek-strong">{currencies.map((c) => ui.t.meta.balance(ui.fmt(world.balance(c)), ui.labels.currency(c))).join(' · ')}</p>
      {next ? (
        <div className="ek-note">
          <span>{ui.t.meta.nextUnlock(ui.labels.metaItem(next.item.id).name, String(Math.floor(next.ratio * 100)))}</span>
          <ProgressBar ratio={next.ratio} label={ui.labels.metaItem(next.item.id).name} />
        </div>
      ) : null}
      {branches.map((b) => (
        <div key={b} className="ek-stack">
          <h3 className="ek-h3">{ui.labels.metaBranch(b)}</h3>
          <ul className="ek-list">
            {items
              .filter((i) => i.branch === b)
              .map((item) => {
                const rank = rankOf(world, item.id)
                const l = ui.labels.metaItem(item.id)
                const full = rank >= item.maxRank
                const open = isRankUnlocked(world, item, rank)
                const tip = !full && isTipRank(item, rank, count)
                return (
                  <li key={item.id} className={`ek-row${open || full ? '' : ' is-locked'}`} data-testid={`meta-${item.id}`}>
                    <div className="ek-row__main">
                      <strong>
                        {l.name} {tip ? <span className="ek-badge ek-badge--inline">{ui.t.meta.tip}</span> : null}
                      </strong>
                      <span className="ek-muted">{l.blurb}</span>
                      <span>
                        {ui.t.common.rank(String(rank), String(item.maxRank))} · {l.effect(rank)}
                      </span>
                      {!open && !full ? <span className="ek-muted">{ui.t.meta.lockedRank}</span> : null}
                    </div>
                    <Button size="small" data-testid={`meta-buy-${item.id}`} disabled={full || !canBuyMeta(world, item)} onClick={() => dispatch(MODULE.metaShop, 'buy', { id: item.id })}>
                      {full ? ui.t.meta.maxed : `${ui.fmt(metaCost(item, rank))} ${ui.labels.currency(item.currency)}`}
                    </Button>
                  </li>
                )
              })}
          </ul>
        </div>
      ))}
    </section>
  )
}
