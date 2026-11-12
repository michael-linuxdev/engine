/**
 * World systems: collection, combining, visitors, decor, season album,
 * great projects, layer-card picker and choice events. Names via labels.content:
 * `title.<system>`, `category.<id>`, `entry.<id>`, `guest.<id>`, `decor.<id>`,
 * `folio.<id>`, `card.<id>`, `omen.<id>`, `work.<id>`.
 */
import { useState, type ReactNode } from 'react'
import { noBreak } from '../text'
import {
  ALBUM_ID, CARDS_ID, CHOICES_ID, collectionProgress, COLLECTIONS_ID, COMBINE_ID, DECOR_ID, PROJECTS_ID, VISITORS_ID,
  type AlbumConfig, type AlbumState, type CardConfig, type CardsState, type ChoiceState, type CollectionConfig, type CollectionsState, type CombineConfig, type CombineState,
  type DecorConfig, type DecorState, type ProjectDef, type ProjectsState, type VisitorConfig, type VisitorsState,
  primaryCurrency, voyageBack, voyageOpen, VOYAGES_ID, type VoyagesConfig, type VoyagesState,
  CHART_ID, chartCells, chartCompleted, chartStatus, type ChartConfig, type ChartGroup, type ChartState,
  MONUMENT_ID, monumentCanTend, monumentGivers, monumentStatus, monumentTendCost, type MonumentConfig, type MonumentState,
  STEWARDS_ID, stewardCanTrain, stewardCost, stewardTrainMs, type StewardsConfig, type StewardsState,
  LINKS_ID, linksMult, linkStatus, longestChain, type LinkDef, type LinksConfig, type LinksState,
} from '@engine/core'
import { useEngine } from '@engine/react'
import { useUi } from '../useUi'
import { Button } from './Button'
import { ProgressBar } from './ProgressBar'
import { Sheet } from './Sheet'
import { Stars } from './Regions'

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

/** From this many missing entries on a category says how close the set is. */
const NEAR_SET = 3

/**
 * Collection overview: total in percent, one bar per category with "N more for the set".
 * Unknown entries tell what brings them (`entryHint.<id>` from the game), never their name.
 */
export function CollectionCard({ cfg }: { cfg: CollectionConfig }) {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const s = world.get<CollectionsState>(COLLECTIONS_ID)
  const cats = [...new Set(cfg.entries.map((e) => e.category))]
  const all = collectionProgress(s, cfg)
  return (
    <Card id="collection">
      <p className="ek-strong" data-testid="collection-total">
        {ui.t.live.found(String(all.found), String(all.total))} · {ui.t.live.percent(String(Math.floor((all.found / Math.max(1, all.total)) * 100)))}
      </p>
      <ProgressBar ratio={all.found / Math.max(1, all.total)} label={ui.labels.content('title.collection').name} />
      {cats.map((c) => {
        const pr = collectionProgress(s, cfg, c)
        const left = pr.total - pr.found
        return (
          <details key={c} className="ek-details" data-testid={`category-${c}`}>
            <summary>
              <span className="ek-details__head">
                {ui.labels.content(`category.${c}`).name} · {pr.found}/{pr.total}
                {left === 0 ? <span className="ek-badge ek-badge--inline">{ui.t.live.setDone}</span> : left <= NEAR_SET ? <span className="ek-muted" data-testid={`set-left-${c}`}> · {ui.t.live.setLeft(String(left))}</span> : null}
              </span>
              <ProgressBar ratio={pr.found / Math.max(1, pr.total)} label={ui.labels.content(`category.${c}`).name} />
            </summary>
            <ul className="ek-grid-list">
              {cfg.entries
                .filter((e) => e.category === c)
                .map((e) => {
                  const n = s?.found[e.id] ?? 0
                  const l = ui.labels.content(`entry.${e.id}`)
                  const hint = ui.labels.content(`entryHint.${e.id}`)
                  return (
                    <li key={e.id} className={`ek-tile${n ? '' : ' is-locked'}`} data-testid={`entry-${e.id}`}>
                      <strong>{n ? l.name : '?'}</strong>
                      <span className="ek-muted">{n ? l.blurb : hint.name === `entryHint.${e.id}` ? ui.t.live.unknownEntry : hint.name}</span>
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

/**
 * Combining two finds: while it runs a bar with the time left; below, all recipes as a grid.
 * A known recipe shows its parts and result; an unknown one only hints at where its parts come from.
 */
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
  const running = cfg.recipes.find((r) => r.id === s.recipe)
  const left = Math.max(0, s.until - state.core.lastSeen)
  const name = (id: string) => ui.labels.content(`entry.${id}`).name
  const category = (id: string) => ui.labels.content(`category.${entries.entries.find((e) => e.id === id)?.category ?? ''}`).name
  // A part the player owns is named; an unknown part only by where it belongs
  const part = (id: string) => (found[id] ? name(id) : ui.t.live.partFrom(category(id)))
  return (
    <Card id="alchemy">
      {s.recipe ? (
        <>
          <p data-testid="brew-running">{ui.t.live.brewing(ui.duration(left))}</p>
          <ProgressBar ratio={running ? 1 - left / Math.max(1, running.durationMs) : 0} label={ui.t.live.brewing(ui.duration(left))} />
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
      <details className="ek-details" data-testid="recipes">
        <summary>{ui.t.live.recipes(String(cfg.recipes.filter((r) => found[r.result]).length), String(cfg.recipes.length))}</summary>
        <ul className="ek-grid-list">
          {cfg.recipes.map((r) => {
            const known = !!found[r.result]
            return (
              <li key={r.id} className={`ek-tile${known ? '' : ' is-locked'}`} data-testid={`recipe-${r.id}`}>
                <strong>{known ? name(r.result) : '?'}</strong>
                <span className="ek-muted">
                  {known ? `${name(r.a)} + ${name(r.b)}` : `${part(r.a)} + ${part(r.b)}`}
                </span>
                {!known && found[r.a] && found[r.b] && !s.recipe ? (
                  <Button size="small" variant="secondary" data-testid={`recipe-try-${r.id}`} onClick={() => dispatch(COMBINE_ID, 'start', { a: r.a, b: r.b })}>
                    {ui.t.live.brew}
                  </Button>
                ) : null}
              </li>
            )
          })}
        </ul>
      </details>
    </Card>
  )
}

/**
 * Voyages: one errand at a time. While it runs, a bar with the time left; once back, a collect
 * button; otherwise the list of voyages, later ones locked until enough are completed.
 * Names: `voyage.<id>`, card title `title.voyages`.
 */
export function VoyagesCard({ cfg }: { cfg: VoyagesConfig }) {
  const ui = useUi()
  const { world, dispatch, state } = useEngine(ui.rt)
  const s = world.get<VoyagesState>(VOYAGES_ID)
  if (!s) return null
  const now = state.core.lastSeen
  const running = cfg.list.find((v) => v.id === s.active)
  const back = voyageBack(s, now)
  const reward = (v: VoyagesConfig['list'][number]) =>
    [...(v.grant ?? []).map((g) => `${ui.fmt(g.amount)} ${ui.labels.currency(g.currency)}`), ...(v.seconds ? [`${ui.fmt(world.rate() * v.seconds)} ${ui.labels.currency(primaryCurrency(world.def))}`] : [])].map(noBreak).join(' + ')
  return (
    <Card id="voyages">
      <p className="ek-muted" data-testid="voyages-done">{ui.t.live.voyagesDone(String(s.done))}</p>
      {running ? (
        <div className="ek-note" data-testid="voyage-running" data-back={back ? 'true' : 'false'}>
          <strong>{ui.labels.content(`voyage.${running.id}`).name}</strong>
          {back ? (
            <Button data-testid="voyage-collect" onClick={() => dispatch(VOYAGES_ID, 'collect')}>
              {ui.t.live.claim}: {reward(running)}
            </Button>
          ) : (
            <>
              <ProgressBar ratio={1 - (s.until - now) / Math.max(1, running.durationMs)} label={ui.labels.content(`voyage.${running.id}`).name} />
              <span>{ui.t.live.voyageLeft(ui.duration(Math.max(0, s.until - now)))}</span>
            </>
          )}
        </div>
      ) : null}
      <ul className="ek-list">
        {cfg.list.map((v) => {
          const l = ui.labels.content(`voyage.${v.id}`)
          const open = voyageOpen(s, v)
          return (
            <li key={v.id} className={`ek-row ek-row--stack${open ? '' : ' is-locked'}`} data-testid={`voyage-${v.id}`}>
              <div className="ek-row__main">
                <strong>{l.name}</strong>
                <span className="ek-muted">{l.blurb}</span>
                <span>
                  {ui.duration(v.durationMs)} · {ui.t.live.rewardLine(reward(v))}
                </span>
                {open ? null : <span className="ek-muted">{ui.t.live.voyageLocked(String(v.fromDone))}</span>}
              </div>
              <Button size="small" data-testid={`voyage-send-${v.id}`} disabled={!open || !!s.active} onClick={() => dispatch(VOYAGES_ID, 'send', { id: v.id })}>
                {ui.t.live.voyageSend}
              </Button>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

/**
 * Chain of links between places. `placeKey` is the label namespace of the places (`realm` → `realm.<id>`),
 * `visible` hides links the player cannot know yet, `art` is the game's picture of the chain.
 */
export function LinksCard({ cfg, placeKey, visible, art, needLabel }: { cfg: LinksConfig; placeKey: string; visible?: (def: LinkDef) => boolean; art?: ReactNode; /** What a rating means in the game's words (e.g. "1 star"); without it the rating is shown as stars. */ needLabel?: (need: number) => string }) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const s = world.get<LinksState>(LINKS_ID)
  if (!s) return null
  const shown = cfg.list.filter((l) => !visible || visible(l))
  const open = shown.filter((l) => (s.levels[l.id] ?? 0) < cfg.needs.length)
  const full = shown.length - open.length
  const cur = ui.labels.currency(cfg.cost.currency)
  const pct = Math.round((linksMult(cfg, s) - 1) * 100)
  return (
    <Card id="links">
      {art}
      <p className="ek-strong" data-testid="links-total">
        {ui.t.live.linksBonus(String(pct))} · {ui.t.live.linksChain(String(longestChain(cfg, s)))}
      </p>
      <p className="ek-muted">{ui.t.live.linksRule(String(Math.round(cfg.perLevel * 100)), String(Math.round(cfg.perChain * 100)))}</p>
      {full > 0 ? <p className="ek-muted" data-testid="links-full">{ui.t.live.linksFull(String(full))}</p> : null}
      <ul className="ek-list">
        {open.map((l) => {
          const st = linkStatus(cfg, s, world, l)
          const need = st.need ?? 0
          const starsOk = st.haveA >= need && st.haveB >= need
          const a = ui.labels.content(`${placeKey}.${l.a}`).name
          const b = ui.labels.content(`${placeKey}.${l.b}`).name
          return (
            <li key={l.id} className="ek-row ek-row--stack" data-testid={`link-${l.id}`} data-level={st.level}>
              <div className="ek-row__main">
                <strong>
                  {a} ↔ {b} <Stars n={st.level} max={st.max} testId={`link-level-${l.id}`} />
                </strong>
                <span className={starsOk ? undefined : 'ek-muted'}>
                  {needLabel
                    ? ui.t.live.linkNeedLabel(needLabel(need), a, st.haveA >= need, b, st.haveB >= need)
                    : ui.t.live.linkNeed(String(need), a, String(Math.min(st.haveA, need)), b, String(Math.min(st.haveB, need)))}
                </span>
              </div>
              <Button size="small" data-testid={`link-light-${l.id}`} disabled={!st.ready} onClick={() => dispatch(LINKS_ID, 'light', { id: l.id })}>
                {ui.t.live.linkLight(ui.fmt(st.cost), cur)}
              </Button>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

/**
 * Chart of groups (e.g. constellations): `art` draws a group with its marked cells, `lockedText` says what opens a group.
 * Names: `chart.<id>` (blurb = what the completed group gives).
 */
export function ChartCard({ cfg, art, lockedText }: { cfg: ChartConfig; art?: (group: ChartGroup, marked: number) => ReactNode; lockedText?: (group: ChartGroup) => string }) {
  const ui = useUi()
  const { world, dispatch, state } = useEngine(ui.rt)
  const s = world.get<ChartState>(CHART_ID)
  if (!s) return null
  const cur = ui.labels.currency(cfg.cost.currency)
  const pct = Math.round(cfg.perCell * chartCells(s) * 1000) / 10
  const now = state.core.lastSeen
  const waitMs = Math.max(0, s.readyAt - now)
  const firstLocked = cfg.groups.find((g) => !chartStatus(cfg, s, world, g, now).open)
  // Open groups, plus the next locked one as a goal
  const shown = cfg.groups.filter((g) => chartStatus(cfg, s, world, g, now).open || g === firstLocked)
  return (
    <Card id="chart">
      <p className="ek-strong" data-testid="chart-total">
        {ui.t.live.chartDone(String(chartCompleted(cfg, s)), String(cfg.groups.length))} · {ui.t.live.linksBonus(ui.fmt(pct))}
      </p>
      <p className="ek-muted">{ui.t.live.chartRule(ui.fmt(Math.round(cfg.perCell * 1000) / 10))}</p>
      {waitMs > 0 ? (
        <p className="ek-note" data-testid="chart-wait">
          {ui.t.live.chartWait(ui.duration(waitMs))}
        </p>
      ) : null}
      <ul className="ek-list">
        {shown.map((g) => {
          const st = chartStatus(cfg, s, world, g, now)
          const l = ui.labels.content(`chart.${g.id}`)
          return (
            <li key={g.id} className={`ek-row ek-row--stack ek-chart${st.open ? '' : ' is-locked'}`} data-done={st.done ? 'true' : 'false'} data-testid={`chart-${g.id}`} data-marked={st.marked}>
              <div className="ek-chart__head">
                {art ? <div className="ek-chart__art">{art(g, st.marked)}</div> : null}
                <div className="ek-row__main">
                  <strong>
                    {st.open ? l.name : ui.t.live.chartUnknown}
                    {st.done ? <span className="ek-badge ek-badge--inline">{ui.t.live.chartFull}</span> : null}
                  </strong>
                  {st.open ? (
                    <>
                      <span>{ui.t.live.chartCells(String(st.marked), String(st.cells))}</span>
                      <span className={st.done ? undefined : 'ek-muted'}>{l.blurb}</span>
                    </>
                  ) : (
                    <span className="ek-muted">{lockedText?.(g) ?? ''}</span>
                  )}
                </div>
              </div>
              {st.open && !st.done ? (
                <Button size="small" data-testid={`chart-mark-${g.id}`} disabled={!st.ready} onClick={() => dispatch(CHART_ID, 'mark', { group: g.id })}>
                  {ui.t.live.chartMark(ui.fmt(st.cost), cur)}
                </Button>
              ) : null}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

/**
 * Stewards: train one at a time, then post each to a place. `places` are the candidates (the game filters),
 * `placeKey` their label namespace. Names: `title.stewards`, `title.steward` (one of them).
 */
export function StewardsCard({ cfg, places, placeKey }: { cfg: StewardsConfig; places: readonly string[]; placeKey: string }) {
  const ui = useUi()
  const { world, dispatch, state } = useEngine(ui.rt)
  const s = world.get<StewardsState>(STEWARDS_ID)
  const [pick, setPick] = useState<number | null>(null)
  if (!s) return null
  const now = state.core.lastSeen
  const cur = ui.labels.currency(cfg.cost.currency)
  const one = ui.labels.content('title.steward').name
  const posts = Array.from({ length: s.trained }, (_, i) => s.posts[i] ?? '')
  const free = places.filter((p) => !posts.includes(p) && cfg.canPost(world, p))
  const training = s.until > 0
  return (
    <Card id="stewards">
      <p className="ek-strong" data-testid="stewards-total">
        {ui.t.live.stewardsTrained(String(s.trained), String(cfg.max))} · {ui.t.live.linksBonus(String(Math.round(cfg.perSteward * s.trained * 100)))}
      </p>
      {training ? (
        <div className="ek-note" data-testid="steward-training">
          <ProgressBar ratio={1 - (s.until - now) / Math.max(1, stewardTrainMs(cfg, s))} label={one} />
          <span>{ui.t.live.stewardLeft(ui.duration(Math.max(0, s.until - now)))}</span>
        </div>
      ) : s.trained < cfg.max ? (
        <div className="ek-pass__line">
          <span className="ek-muted">{ui.t.live.stewardTakes(ui.duration(stewardTrainMs(cfg, s)))}</span>
          <Button size="small" data-testid="steward-train" disabled={!stewardCanTrain(cfg, s, world)} onClick={() => dispatch(STEWARDS_ID, 'train')}>
            {ui.t.live.stewardTrain(ui.fmt(stewardCost(cfg, s)), cur)}
          </Button>
        </div>
      ) : null}
      <ul className="ek-list">
        {posts.map((place, i) => (
          <li key={i} className="ek-row" data-testid={`steward-${i}`} data-post={place}>
            <div className="ek-row__main">
              <strong>
                {one} {i + 1}
              </strong>
              <span className={place ? undefined : 'ek-muted'}>{place ? ui.t.live.stewardAt(ui.labels.content(`${placeKey}.${place}`).name) : ui.t.live.stewardNoPost}</span>
            </div>
            <Button size="small" variant={place ? 'secondary' : 'primary'} data-testid={`steward-post-${i}`} onClick={() => setPick(i)}>
              {place ? ui.t.live.stewardMove : ui.t.live.stewardPost}
            </Button>
          </li>
        ))}
      </ul>
      <Sheet open={pick !== null} title={pick !== null ? `${one} ${pick + 1}` : one} onClose={() => setPick(null)} testId="steward-sheet">
        <p className="ek-muted">{ui.t.live.stewardRule}</p>
        <ul className="ek-list">
          {pick !== null && posts[pick] ? (
            <li className="ek-row">
              <div className="ek-row__main">
                <strong>{ui.t.live.stewardRecall}</strong>
              </div>
              <Button size="small" variant="secondary" data-testid="steward-recall" onClick={() => { dispatch(STEWARDS_ID, 'post', { slot: pick, place: '' }); setPick(null) }}>
                {ui.t.live.stewardRecall}
              </Button>
            </li>
          ) : null}
          {free.map((p) => (
            <li key={p} className="ek-row">
              <div className="ek-row__main">
                <strong>{ui.labels.content(`${placeKey}.${p}`).name}</strong>
              </div>
              <Button size="small" data-testid={`steward-to-${p}`} onClick={() => { if (pick !== null) dispatch(STEWARDS_ID, 'post', { slot: pick, place: p }); setPick(null) }}>
                {ui.t.live.stewardPost}
              </Button>
            </li>
          ))}
        </ul>
      </Sheet>
    </Card>
  )
}

/** Monument: the stage, who has given, the wait, and one button that asks every place that can give. `art` shows the work at its stage. */
export function MonumentCard({ cfg, places, art }: { cfg: MonumentConfig; places: readonly string[]; art?: (stage: number) => ReactNode }) {
  const ui = useUi()
  const { world, dispatch, state } = useEngine(ui.rt)
  const s = world.get<MonumentState>(MONUMENT_ID)
  if (!s) return null
  const now = state.core.lastSeen
  const st = monumentStatus(cfg, s, now)
  const givers = monumentGivers(cfg, s, world, places, now)
  const tendCost = monumentTendCost(cfg, s)
  const bonus = cfg.perStage * st.stage + (cfg.tend?.perLevel ?? 0) * st.tended
  return (
    <Card id="monument">
      {art?.(st.stage)}
      <p className="ek-strong" data-testid="monument-stage">
        {ui.t.live.monumentStage(String(st.stage), String(st.stages))} · {ui.t.live.linksBonus(String(Math.round(bonus * 100)))}
      </p>
      {st.done ? (
        <>
          <p data-testid="monument-done">{ui.t.live.monumentDone}</p>
          {cfg.tend && st.tendMax > 0 ? (
            <>
              <ProgressBar ratio={st.tended / st.tendMax} label={ui.t.live.monumentTended(String(st.tended), String(st.tendMax))} />
              <div className="ek-pass__line">
                <span data-testid="monument-tended">{ui.t.live.monumentTended(String(st.tended), String(st.tendMax))}</span>
                {tendCost && st.waitMs === 0 ? (
                  <Button size="small" data-testid="monument-tend" disabled={!monumentCanTend(cfg, s, world, now)} onClick={() => dispatch(MONUMENT_ID, 'tend')}>
                    {ui.t.live.monumentTend(ui.fmt(tendCost.amount), ui.labels.currency(tendCost.currency))}
                  </Button>
                ) : null}
              </div>
              {tendCost && st.waitMs > 0 ? (
                <p className="ek-note" data-testid="monument-tend-wait">
                  {ui.t.live.monumentTendWait(ui.duration(st.waitMs))}
                </p>
              ) : null}
              <p className="ek-muted">{ui.t.live.monumentTendRule(String(Math.round(cfg.tend.perLevel * 1000) / 10))}</p>
            </>
          ) : null}
        </>
      ) : st.waitMs > 0 ? (
        <p className="ek-note" data-testid="monument-wait">
          {ui.t.live.monumentWait(ui.duration(st.waitMs))}
        </p>
      ) : (
        <>
          <ProgressBar ratio={st.given / st.need} label={ui.labels.content('title.monument').name} />
          <div className="ek-pass__line">
            <span>{ui.t.live.monumentGiven(String(st.given), String(st.need))}</span>
            <Button size="small" data-testid="monument-give" disabled={givers.length === 0} onClick={() => dispatch(MONUMENT_ID, 'give', { places: givers })}>
              {ui.t.live.monumentAsk(String(Math.min(givers.length, st.need - st.given)))}
            </Button>
          </div>
          <p className="ek-muted">{ui.t.live.monumentRule}</p>
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
          // What draws an unknown guest (from the game), never its name
          const hint = ui.labels.content(`guestHint.${v.id}`)
          return (
            <li key={v.id} className={`ek-tile${n ? '' : ' is-locked'}`} data-testid={`guest-${v.id}`}>
              <strong>{n ? l.name : '?'}</strong>
              <span className="ek-muted">{n ? ui.t.live.seenTimes(String(n)) : hint.name === `guestHint.${v.id}` ? ui.t.live.unknownEntry : hint.name}</span>
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

/** `onEdit`: the game places decor on its own scene; the card then offers that instead of the slot lists. */
export function DecorCard({ cfg, onEdit }: { cfg: DecorConfig; onEdit?: () => void }) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const s = world.get<DecorState>(DECOR_ID)
  if (!s) return null
  return (
    <Card id="decor">
      {onEdit ? (
        <Button variant="secondary" data-testid="decor-edit" disabled={!s.owned.length} onClick={onEdit}>
          {ui.t.live.decorEdit}
        </Button>
      ) : (
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
      )}
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
/**
 * Pick one card for the run. Each card says what it would change for this very state
 * (income per second); closing the sheet or "go on without" picks none.
 */
export function CardPicker({ open, cfg }: { open: boolean; /** With the config each card shows its effect on the current income. */ cfg?: CardConfig }) {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const s = world.get<CardsState>(CARDS_ID)
  if (!s?.offer.length) return null
  const t = ui.labels.content('title.constellations')
  const skip = () => dispatch(CARDS_ID, 'skip')
  // Change of the total income if this card were active now (rate and income multipliers only)
  const delta = (id: string): number | null => {
    const card = cfg?.cards.find((c) => c.id === id)
    if (!card) return null
    let d = 0
    let known = false
    for (const e of card.effects) {
      if (e.op !== 'mul') continue
      if (e.target === 'income' || e.target === 'rate:*') {
        d += world.rate() * (e.value - 1)
        known = true
      } else if (e.target.startsWith('rate:')) {
        d += world.producerRate(e.target.slice(5)) * (e.value - 1)
        known = true
      }
    }
    return known ? d : null
  }
  return (
    <Sheet open={open} title={t.name} onClose={skip} testId="card-picker">
      <p>{t.blurb}</p>
      <ul className="ek-list">
        {s.offer.map((id) => {
          const l = ui.labels.content(`card.${id}`)
          const d = delta(id)
          return (
            <li key={id} className="ek-row ek-row--stack" data-testid={`pick-${id}`}>
              <div className="ek-row__main">
                <strong>{l.name}</strong>
                <span className="ek-muted">{l.blurb}</span>
                {d !== null ? (
                  <span className="ek-strong" data-testid={`pick-delta-${id}`}>
                    {ui.t.live.cardNow(ui.t.common.perSecond(`${d >= 0 ? '+' : '−'}${ui.fmt(Math.abs(d))}`))}
                  </span>
                ) : null}
              </div>
              <Button size="small" data-testid={`pick-btn-${id}`} onClick={() => dispatch(CARDS_ID, 'pick', { id })}>
                {ui.t.live.choose}
              </Button>
            </li>
          )
        })}
      </ul>
      <Button variant="ghost" data-testid="pick-skip" onClick={skip}>
        {ui.t.live.cardSkip}
      </Button>
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
