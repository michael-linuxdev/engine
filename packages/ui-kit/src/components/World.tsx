/**
 * World systems: collection, combining, visitors, decor, season album,
 * great projects, layer-card picker and choice events. Names via labels.content:
 * `title.<system>`, `category.<id>`, `entry.<id>`, `guest.<id>`, `decor.<id>`,
 * `folio.<id>`, `card.<id>`, `omen.<id>`, `work.<id>`.
 */
import { useState, type ReactNode } from 'react'
import {
  ALBUM_ID, CARDS_ID, CHOICES_ID, collectionProgress, COLLECTIONS_ID, COMBINE_ID, DECOR_ID, PROJECTS_ID, VISITORS_ID,
  type AlbumConfig, type AlbumState, type CardsState, type ChoiceState, type CollectionConfig, type CollectionsState, type CombineConfig, type CombineState,
  type DecorConfig, type DecorState, type ProjectDef, type ProjectsState, type VisitorConfig, type VisitorsState,
} from '@engine/core'
import { useEngine } from '@engine/react'
import { useUi } from '../useUi'
import { Button } from './Button'
import { ProgressBar } from './ProgressBar'
import { Sheet } from './Sheet'

function Card({ id, children }: { id: string; children: ReactNode }) {
  const ui = useUi()
  const t = ui.labels.content(`title.${id}`)
  return (
    <section className="ek-card" data-testid={`card-${id}`} aria-label={t.name}>
      <h3 className="ek-h3">{t.name}</h3>
      {t.blurb ? <p className="ek-muted">{t.blurb}</p> : null}
      {children}
    </section>
  )
}

export function CollectionCard({ cfg }: { cfg: CollectionConfig }) {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const s = world.get<CollectionsState>(COLLECTIONS_ID)
  const cats = [...new Set(cfg.entries.map((e) => e.category))]
  const all = collectionProgress(s, cfg)
  return (
    <Card id="collection">
      <p className="ek-strong">{ui.t.live.found(String(all.found), String(all.total))}</p>
      {cats.map((c) => {
        const pr = collectionProgress(s, cfg, c)
        return (
          <details key={c} className="ek-details" data-testid={`category-${c}`}>
            <summary>
              {ui.labels.content(`category.${c}`).name} · {pr.found}/{pr.total}
            </summary>
            <ul className="ek-grid-list">
              {cfg.entries
                .filter((e) => e.category === c)
                .map((e) => {
                  const n = s?.found[e.id] ?? 0
                  const l = ui.labels.content(`entry.${e.id}`)
                  return (
                    <li key={e.id} className={`ek-tile${n ? '' : ' is-locked'}`} data-testid={`entry-${e.id}`}>
                      <strong>{n ? l.name : '?'}</strong>
                      <span className="ek-muted">{n ? l.blurb : ui.t.live.unknownEntry}</span>
                    </li>
                  )
                })}
            </ul>
          </details>
        )
      })}
    </Card>
  )
}

export function CombineCard({ cfg, entries }: { cfg: CombineConfig; entries: CollectionConfig }) {
  const ui = useUi()
  const { world, dispatch, state } = useEngine(ui.rt)
  const s = world.get<CombineState>(COMBINE_ID)
  const found = world.get<CollectionsState>(COLLECTIONS_ID)?.found ?? {}
  const own = entries.entries.filter((e) => found[e.id])
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  if (!s) return null
  const select = (v: string, set: (x: string) => void, label: string, testId: string) => (
    <label className="ek-field">
      <span>{label}</span>
      <select className="ek-select" value={v} onChange={(e) => set(e.target.value)} data-testid={testId}>
        <option value="">—</option>
        {own.map((e) => (
          <option key={e.id} value={e.id}>
            {ui.labels.content(`entry.${e.id}`).name}
          </option>
        ))}
      </select>
    </label>
  )
  return (
    <Card id="alchemy">
      {s.recipe ? (
        <>
          <p>{ui.t.live.brewing(ui.duration(Math.max(0, s.until - state.core.lastSeen)))}</p>
          <Button variant="secondary" onClick={() => dispatch(COMBINE_ID, 'skip')}>
            {ui.t.live.finishNow} ({cfg.skipCost.amount} {ui.labels.currency(cfg.skipCost.currency)})
          </Button>
        </>
      ) : (
        <>
          <div className="ek-grid2">
            {select(a, setA, ui.t.live.pickA, 'brew-a')}
            {select(b, setB, ui.t.live.pickB, 'brew-b')}
          </div>
          <Button data-testid="brew" disabled={!a || !b || a === b} onClick={() => dispatch(COMBINE_ID, 'start', { a, b })}>
            {ui.t.live.brew}
          </Button>
        </>
      )}
    </Card>
  )
}

export function GuestsCard({ cfg }: { cfg: VisitorConfig }) {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const s = world.get<VisitorsState>(VISITORS_ID)
  return (
    <Card id="guests">
      <ul className="ek-grid-list">
        {cfg.list.map((v) => {
          const n = s?.seen[v.id] ?? 0
          const l = ui.labels.content(`guest.${v.id}`)
          return (
            <li key={v.id} className={`ek-tile${n ? '' : ' is-locked'}`} data-testid={`guest-${v.id}`}>
              <strong>{n ? l.name : '?'}</strong>
              <span className="ek-muted">{n ? ui.t.live.seenTimes(String(n)) : ui.t.live.unknownEntry}</span>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

/** Notice while a guest is here (greet within the visit). */
export function VisitorNotice({ name }: { name: (guest: string) => string }) {
  const ui = useUi()
  const { world, dispatch, state } = useEngine(ui.rt)
  const s = world.get<VisitorsState>(VISITORS_ID)
  if (!s?.current || s.until <= state.core.lastSeen) return null
  return (
    <aside className="ek-coach ek-visitor" role="status" data-testid="visitor">
      <strong className="ek-coach__title">{name(s.current)}</strong>
      <Button size="small" data-testid="visitor-greet" onClick={() => dispatch(VISITORS_ID, 'greet')}>
        {ui.t.live.greet}
      </Button>
    </aside>
  )
}

export function DecorCard({ cfg }: { cfg: DecorConfig }) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const s = world.get<DecorState>(DECOR_ID)
  if (!s) return null
  return (
    <Card id="decor">
      <div className="ek-grid2">
        {s.placed.map((id, slot) => (
          <label key={slot} className="ek-field">
            <span>{ui.t.live.slot(String(slot + 1))}</span>
            <select className="ek-select" value={id} data-testid={`decor-slot-${slot}`} onChange={(e) => dispatch(DECOR_ID, 'place', { slot, id: e.target.value })}>
              <option value="">{ui.t.live.emptySlot}</option>
              {s.owned.map((o) => (
                <option key={o} value={o}>
                  {ui.labels.content(`decor.${o}`).name}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <ul className="ek-list">
        {cfg.items
          .filter((i) => i.cost || s.owned.includes(i.id))
          .map((i) => {
            const l = ui.labels.content(`decor.${i.id}`)
            const owned = s.owned.includes(i.id)
            return (
              <li key={i.id} className="ek-row" data-testid={`decor-${i.id}`}>
                <div className="ek-row__main">
                  <strong>{l.name}</strong>
                  <span className="ek-muted">{l.blurb}</span>
                </div>
                {owned ? (
                  <span className="ek-muted">{ui.t.live.owned}</span>
                ) : i.cost ? (
                  <Button size="small" disabled={world.balance(i.cost.currency) < i.cost.amount} onClick={() => dispatch(DECOR_ID, 'buy', { id: i.id })}>
                    {i.cost.amount} {ui.labels.currency(i.cost.currency)}
                  </Button>
                ) : null}
              </li>
            )
          })}
      </ul>
    </Card>
  )
}

export function FolioCard({ cfg }: { cfg: AlbumConfig }) {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const s = world.get<AlbumState>(ALBUM_ID)
  return (
    <Card id="folio">
      <p className="ek-strong">{ui.t.live.progress(String(s?.stamped.length ?? 0), String(cfg.goals.length))}</p>
      <ul className="ek-grid-list">
        {cfg.goals.map((g) => {
          const done = s?.stamped.includes(g.id)
          const l = ui.labels.content(`folio.${g.id}`)
          return (
            <li key={g.id} className={`ek-tile${done ? ' is-done' : ''}`} data-testid={`folio-${g.id}`}>
              <strong>{l.name}</strong>
              <span className="ek-muted">{l.blurb}</span>
              <ProgressBar ratio={(s?.progress[g.id] ?? 0) / g.target} label={l.name} />
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

export function WorksCard({ list }: { list: readonly ProjectDef[] }) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const s = world.get<ProjectsState>(PROJECTS_ID)
  return (
    <Card id="greatWorks">
      <ul className="ek-list">
        {list.map((p) => {
          const n = s?.stage[p.id] ?? 0
          const st = p.stages[n]
          const l = ui.labels.content(`work.${p.id}`)
          const can = !!st && st.cost.every((c) => world.balance(c.currency) >= c.amount)
          return (
            <li key={p.id} className="ek-row" data-testid={`work-${p.id}`}>
              <div className="ek-row__main">
                <strong>{l.name}</strong>
                <span className="ek-muted">{l.blurb}</span>
                <span>{ui.t.live.stage(String(n), String(p.stages.length))}</span>
                {st ? <span className="ek-muted">{st.cost.map((c) => `${ui.fmt(c.amount)} ${ui.labels.currency(c.currency)}`).join(' · ')}</span> : null}
              </div>
              <Button size="small" disabled={!can} onClick={() => dispatch(PROJECTS_ID, 'build', { id: p.id })}>
                {st ? ui.t.live.build : ui.t.live.done}
              </Button>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

/** Picker for the layer cards offered after a prestige. */
export function CardPicker({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const s = world.get<CardsState>(CARDS_ID)
  if (!s?.offer.length) return null
  const t = ui.labels.content('title.constellations')
  return (
    <Sheet open={open} title={t.name} onClose={onClose} testId="card-picker">
      <p>{t.blurb}</p>
      <ul className="ek-list">
        {s.offer.map((id) => {
          const l = ui.labels.content(`card.${id}`)
          return (
            <li key={id} className="ek-row" data-testid={`pick-${id}`}>
              <div className="ek-row__main">
                <strong>{l.name}</strong>
                <span className="ek-muted">{l.blurb}</span>
              </div>
              <Button size="small" onClick={() => dispatch(CARDS_ID, 'pick', { id })}>
                {ui.t.live.choose}
              </Button>
            </li>
          )
        })}
      </ul>
    </Sheet>
  )
}

/** A pending choice event (shown under the HUD). */
export function ChoiceNotice({ option }: { option: (id: string, o: 'safe' | 'risk') => string }) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const s = world.get<ChoiceState>(CHOICES_ID)
  if (!s?.pending) return null
  const l = ui.labels.content(`omen.${s.pending}`)
  return (
    <aside className="ek-coach" role="status" data-testid="omen">
      <strong className="ek-coach__title">{l.name}</strong>
      <span>{l.blurb}</span>
      <div className="ek-row-actions">
        <Button size="small" variant="secondary" data-testid="omen-safe" onClick={() => dispatch(CHOICES_ID, 'choose', { option: 'safe' })}>
          {ui.t.live.safe}: {option(s.pending, 'safe')}
        </Button>
        <Button size="small" data-testid="omen-risk" onClick={() => dispatch(CHOICES_ID, 'choose', { option: 'risk' })}>
          {ui.t.live.risk}: {option(s.pending, 'risk')}
        </Button>
      </div>
    </aside>
  )
}
