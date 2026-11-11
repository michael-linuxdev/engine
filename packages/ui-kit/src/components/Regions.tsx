/**
 * Regions: overview (open + next locked) and a sheet per region with intro,
 * balance, areas (buy ×1 / max) and care. Names via labels.content:
 * `realm.<id>` (blurb = intro), `realmCurrency.<id>`, `realmFigure.<id>`, `realmArea.<areaId>`.
 */
import { useState, type ReactNode } from 'react'
import { areaOpen, bulkCost, careCost, regionCostMult, regionRate, regionStarProgress, REGIONS_ID, totalRegionStars, type RegionConfig, type RegionsState } from '@engine/core'
import { useEngine } from '@engine/react'
import { useUi } from '../useUi'
import { Button } from './Button'
import { Sheet } from './Sheet'

/** Mastery stars as filled and empty marks, with the count as accessible text. */
export function Stars({ n, max, testId }: { n: number; max: number; testId?: string }) {
  const ui = useUi()
  if (max <= 0) return null
  return (
    <span className="ek-stars" data-testid={testId} data-stars={n}>
      <span aria-hidden="true">
        <span className="ek-stars__on">{'★'.repeat(n)}</span>
        <span className="ek-stars__off">{'★'.repeat(max - n)}</span>
      </span>
      <span className="ek-visually-hidden">{ui.t.live.stars(String(n), String(max))}</span>
    </span>
  )
}

export function RegionsPanel({ cfg, lockedText, art }: { cfg: RegionConfig; lockedText: (id: string, i: number) => string; art?: (id: string) => ReactNode }) {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const s = world.get<RegionsState>(REGIONS_ID)
  const [open, setOpen] = useState<string | null>(null)
  if (!s) return null
  const firstLocked = cfg.regions.findIndex((r) => !s.regions[r.id]?.open)
  const visible = cfg.regions.filter((r, i) => s.regions[r.id]?.open || i === firstLocked)
  const all = totalRegionStars(cfg, s)
  return (
    <section className="ek-panel" aria-label={ui.labels.content('title.realms').name} data-testid="realms">
      {all.total > 0 ? (
        <p className="ek-strong" data-testid="stars-total">
          {ui.t.live.starsAll(String(all.have), String(all.total))}
        </p>
      ) : null}
      <ul className="ek-list">
        {visible.map((r) => {
          const i = cfg.regions.indexOf(r)
          const st = s.regions[r.id]
          const l = ui.labels.content(`realm.${r.id}`)
          return (
            <li key={r.id} className={`ek-row${st?.open ? '' : ' is-locked'}`} data-testid={`realm-${r.id}`}>
              {art ? <div className="ek-row__art">{art(r.id)}</div> : null}
              <div className="ek-row__main">
                <strong>
                  {l.name} {st?.open ? <Stars n={regionStarProgress(cfg, r, st).stars} max={regionStarProgress(cfg, r, st).max} testId={`stars-${r.id}`} /> : null}
                </strong>
                <span className="ek-muted">{st?.open ? ui.t.live.regionRate(ui.fmt(regionRate(cfg, r, st, world)), ui.labels.content(`realmCurrency.${r.id}`).name) : lockedText(r.id, i)}</span>
              </div>
              {st?.open ? (
                <Button size="small" data-testid={`realm-open-${r.id}`} onClick={() => setOpen(r.id)}>
                  {ui.t.live.openRegion}
                </Button>
              ) : null}
            </li>
          )
        })}
      </ul>
      <RegionSheet cfg={cfg} id={open} onClose={() => setOpen(null)} art={art} />
    </section>
  )
}

export function RegionSheet({ cfg, id, onClose, art }: { cfg: RegionConfig; id: string | null; onClose: () => void; art?: (id: string) => ReactNode }) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const def = cfg.regions.find((r) => r.id === id)
  const r = def ? world.get<RegionsState>(REGIONS_ID)?.regions[def.id] : undefined
  if (!def || !r) return null
  const l = ui.labels.content(`realm.${def.id}`)
  const cur = ui.labels.content(`realmCurrency.${def.id}`).name
  const m = regionCostMult(cfg, r)
  const sp = regionStarProgress(cfg, def, r)
  return (
    <Sheet open title={l.name} onClose={onClose} testId="realm-sheet">
      {art?.(def.id)}
      <blockquote className="ek-quote">
        {l.blurb} — {ui.labels.content(`realmFigure.${def.id}`).name}
      </blockquote>
      <p className="ek-strong" data-testid="realm-balance">
        {ui.fmt(r.balance)} {cur} · {ui.t.live.regionRate(ui.fmt(regionRate(cfg, def, r, world)), cur)}
      </p>
      {sp.max > 0 && cfg.mastery ? (
        <div className="ek-card" data-testid="mastery">
          <strong>
            {ui.t.live.mastery} <Stars n={sp.stars} max={sp.max} />
          </strong>
          <span>{sp.nextLevel === null ? ui.t.live.starsDone : ui.t.live.starNext(String(sp.nextLevel), String(sp.have), String(sp.total))}</span>
          <span className="ek-muted">{ui.t.live.starBonus(String(Math.round(cfg.mastery.yieldPerStar * 100)))}</span>
        </div>
      ) : null}
      <ul className="ek-list">
        {def.areas.map((a, i) => {
          const n = r.owned[a.id] ?? 0
          const ok = areaOpen(def, r, i)
          const cost = bulkCost(a, n, 1, m)
          return (
            <li key={a.id} className={`ek-row${ok ? '' : ' is-locked'}`} data-testid={`area-${a.id}`}>
              <div className="ek-row__main">
                <strong>{ui.labels.content(`realmArea.${a.id}`).name}</strong>
                <span className="ek-muted">{ui.t.common.level(String(n))}</span>
              </div>
              {ok ? (
                <>
                  <Button size="small" data-testid={`area-buy-${a.id}`} disabled={r.balance < cost} onClick={() => dispatch(REGIONS_ID, 'buy', { region: def.id, area: a.id, count: 1 })}>
                    {ui.fmt(cost)}
                  </Button>
                  <Button size="small" variant="secondary" disabled={r.balance < cost} onClick={() => dispatch(REGIONS_ID, 'buy', { region: def.id, area: a.id, count: 'max' })}>
                    {ui.t.common.max}
                  </Button>
                </>
              ) : (
                <span className="ek-muted">{ui.t.common.locked}</span>
              )}
            </li>
          )
        })}
      </ul>
      <h3 className="ek-h3">{ui.t.live.care}</h3>
      <div className="ek-grid2">
        {(['grow', 'thrift'] as const).map((k) => {
          const rank = r[k]
          const full = rank >= cfg.care.maxRank
          const c = careCost(cfg, rank)
          return (
            <div key={k} className="ek-card">
              <strong>{k === 'grow' ? ui.t.live.careGrow : ui.t.live.careThrift}</strong>
              <span className="ek-muted">{k === 'grow' ? ui.t.live.careGrowBlurb : ui.t.live.careThriftBlurb}</span>
              <span>{ui.t.common.rank(String(rank), String(cfg.care.maxRank))}</span>
              <Button size="small" variant="secondary" disabled={full || r.balance < c} onClick={() => dispatch(REGIONS_ID, 'care', { region: def.id, kind: k })}>
                {full ? ui.t.meta.maxed : ui.fmt(c)}
              </Button>
            </div>
          )
        })}
      </div>
    </Sheet>
  )
}
