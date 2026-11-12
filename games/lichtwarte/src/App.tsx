import { useEffect, useState } from 'react'
import { layerForecast, ownedOf, WHEEL_ID, type WheelState, voyageBack, VOYAGES_ID, bestBuy, countAffordableMeta, formatNumber, NUMBER_LOCALES, DAILY_ID, dailyStatus, isFeatureOpen, prestigeReady, MARKET_ID, marketReady, prestigeState, localDayKey, MODULE, QUESTS_ID, type DailyState, type MarketState, type OfflineState, type VoyagesState, type ProducerDef, type QuestsState, type WorldView, COLLECTIONS_ID, type CollectionsState, REGIONS_ID, type RegionsState } from '@engine/core'
import { connectSfx, currentStep, useEngine, useStore, useSteps } from '@engine/react'
import { CardPicker, ChallengesCard, FtueCoach, GameShell, Hud, MetaShopPanel, Sheet, UpgradeSheet, useUi, WheelSheet } from '@engine/ui'
import { tierFor } from '@engine/art'
import { BuildingArt } from './art/Building'
import { IconBook, IconGear, IconLantern, IconLeaf, IconMap, IconMenu, IconMoon, IconPouch, IconSave, IconScroll, IconTower } from './art/icons'
import { SparkDock } from './scene/SparkDock'
import { TIER_LEVELS } from './art/registry'
import { DISTRIBUTION, TEST_PHASE } from './distribution'
import { CHRONICLE } from './content/chronicle'
import { DAILY, STAR_WHEEL, TRIALS } from './content/live'
import { COLLECTION, CONSTELLATIONS } from './content/world'
import { REALM_IDS } from './content/realms'
import { MARKET } from './content/market'
import { Notices } from './story/Notices'
import { WatchView } from './story/Watch'
import { WorldTab } from './story/WorldTab'
import { RealmsTab } from './story/RealmsTab'
import { MarketTab } from './story/MarketTab'
import { feedback } from './story/feedback'
import { Soon } from './story/Soon'
import { ftueSteps } from './content/ftue'
import { CURRENCY, game, LAYER } from './game'
import { nextTurnOpens } from './content/turns'
import { waitingPills, type WaitingActs } from './story/waiting'
import { ambience, chronicleRead, findsSeen, ftue, i18n, labels, playtest, prefs, rt, sfx, t, tabsSeen } from './runtime'
import { SFX_EVENTS } from './audio/sfx'
import { IMPRINT, PRIVACY_PAGE } from './legal'
import { ValleyMap, type MapExtras } from './scene/ValleyMap'
import { RankSheet, RankTile } from './story/Rank'
import { currentMood } from './scene/mood'
import { Ceremony } from './story/Ceremony'
import { Intro } from './story/Intro'
import { ChronicleSheet, ComebackLetter } from './story/Chronicle'
import { useChronicle } from './story/useChronicle'

declare const __APP_VERSION__: string

/** Sternbilder warten auf eine Wahl (erst nach der Freischaltung). */
function cardsWaiting(w: WorldView): boolean {
  return isFeatureOpen(w, 'constellations') && ((w.get<{ offer: string[] }>('layerCards')?.offer.length ?? 0) > 0)
}

/** Ein Greif ist von seiner Fernfahrt zurück und wartet (Punkt an der Sammlung). */
function voyageWaiting(w: WorldView): boolean {
  const v = w.get<VoyagesState | undefined>(VOYAGES_ID)
  return !!v && voyageBack(v, rt.clock.now())
}

/** Abzeichen am Wacht-Tab: Wachrunde offen oder Auftrag fertig. */
function foundCount(w: WorldView): number {
  return Object.values(w.get<CollectionsState | undefined>(COLLECTIONS_ID)?.found ?? {}).filter((n) => n > 0).length
}
function openRealmCount(w: WorldView): number {
  return Object.values(w.get<RegionsState | undefined>(REGIONS_ID)?.regions ?? {}).filter((r) => r.open).length
}
function watchBadge(w: WorldView): boolean {
  const d = w.get<DailyState>(DAILY_ID)
  const q = w.get<QuestsState>(QUESTS_ID)
  return (!!d && dailyStatus(d, localDayKey(rt.clock), DAILY).canClaim) || (q?.active.some((x) => !x.claimed && x.progress >= x.goal) ?? false)
}

/** Das Archiv erscheint erst, wenn es dort etwas zu holen gibt: nach der ersten Mondwende. */
function archiveVisible(w: WorldView): boolean {
  return (prestigeState(w).layers[0]?.count ?? 0) >= 1 || (w.get<{ earned: Record<string, number> }>(MODULE.wallet)?.earned[CURRENCY.runeShards] ?? 0) > 0
}

/** Kurze Zahl in der aktiven Sprache, für Texte außerhalb der UI-Hülle (Ziel-Zeile). */
const fmtShort = (n: number) => formatNumber(n, NUMBER_LOCALES[i18n.getLocale() === 'en' ? 'en' : 'de'])

/** Gerätemerker „Prolog gesehen“ (steht neben den gelesenen Chronik-Seiten). */
const PROLOGUE = 'prologue'

const steps = ftueSteps((id) => chronicleRead.has(id), (id) => tabsSeen.has(id))

function Play({ onOpen, today, letter, preview, decorEdit }: { onOpen: (id: string) => void } & MapExtras) {
  return (
    <ValleyMap onOpen={onOpen} today={today} letter={letter} preview={preview} decorEdit={decorEdit}>
      <SparkDock />
    </ValleyMap>
  )
}

/** Nebenwährungen klein unter dem Glimmer, sobald es sie einmal gab. Antippen erklärt, was sie sind. */
function SideCurrencies() {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const [open, setOpen] = useState(false)
  const earned = world.get<{ earned: Record<string, number> }>(MODULE.wallet)?.earned ?? {}
  const list = [CURRENCY.glowPebbles, CURRENCY.runeShards, CURRENCY.nightDew, CURRENCY.forebearLight].filter((c) => (earned[c] ?? 0) > 0)
  if (!list.length) return null
  // Eine Zeile: farbiger Punkt und Zahl; die Namen stehen im Fenster dahinter
  return (
    <>
      <button type="button" className="lw-purse" data-fx="purse" data-fx-x="0.5" data-fx-y="1.6" data-testid="hud-purse" onClick={() => setOpen(true)}>
        <span className="ek-visually-hidden">{t.purse.title}:</span>
        {list.map((c) => (
          <span key={c} className={`lw-cur lw-cur--${c}`} data-testid={`hud-${c}`}>
            <i aria-hidden="true" />
            <strong>{ui.fmt(world.balance(c))}</strong>
            <span className="ek-visually-hidden">{ui.labels.currency(c)}</span>
          </span>
        ))}
      </button>
      <Sheet open={open} title={t.purse.title} onClose={() => setOpen(false)} testId="purse-sheet">
        <ul className="ek-list">
          {list.map((c) => (
            <li key={c} className="ek-row">
              <span className={`lw-cur lw-cur--${c}`} aria-hidden="true">
                <i />
              </span>
              <div className="ek-row__main">
                <strong>
                  {ui.fmt(world.balance(c))} {ui.labels.currency(c)}
                </strong>
                <span className="ek-muted">{(t.purse.what as Record<string, string>)[c]}</span>
              </div>
            </li>
          ))}
        </ul>
      </Sheet>
    </>
  )
}

/** Vergrößerung des Bauwerks im Ausbau-Fenster je Wachstumsstufe (Fußpunkt bleibt unten in der Mitte). */
const HERO_ZOOM: Readonly<Record<number, number>> = { 1: 1.7, 2: 1.4, 3: 1.2 }

function ProducerArt({ p }: { p: ProducerDef }) {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const level = (world.get<{ owned: Record<string, number> }>(MODULE.producers)?.owned[p.id] ?? 0)
  return (
    <svg className="lw-upgrade-art" viewBox="-42 -84 84 92" role="img" aria-label={ui.labels.producer(p.id).name}>
      {/* Kleine Stufen größer zeigen: Das Bauwerk füllt sein Bild, statt in der Ecke zu stehen */}
      <g transform={`scale(${HERO_ZOOM[Math.max(1, tierFor(level, TIER_LEVELS))] ?? 1})`}>
        <BuildingArt id={p.id} tier={Math.max(1, tierFor(level, TIER_LEVELS))} m={currentMood()} />
      </g>
    </svg>
  )
}

function useCoachActive(): boolean {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  useSteps(ftue)
  return currentStep(steps, ftue, world) !== null
}

type CoachActs = Partial<Record<string, () => void>>

function NoticeArea({ onEvents, onPrestige, compact, acts, waiting }: { onEvents: () => void; onPrestige: () => void; compact: boolean; acts: CoachActs; waiting: WaitingActs }) {
  const active = useCoachActive()
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  useStore(findsSeen)
  return (
    <div className="lw-notices">
      {/* Solange der Einstieg läuft, bleibt es bei ihm: keine Marken daneben */}
      <Notices coach={active ? <Coach acts={acts} /> : null} onEvents={onEvents} onPrestige={onPrestige} compact={compact} waiting={active ? [] : waitingPills(world, waiting)} />
    </div>
  )
}

/** Worauf ein Schritt des Einstiegs zeigt (data-testid des Ziels). */
const COACH_TARGET: Partial<Record<string, string>> = { welcome: 'hud-chronicle', build: 'slot-kraeuterkate', burst: 'burst', unlock: 'slot-holzlager', prestige: 'tab-prestige' }

function Coach({ acts }: { acts: CoachActs }) {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  useSteps(ftue)
  useStore(chronicleRead)
  useStore(tabsSeen)
  const step = currentStep(steps, ftue, world)
  if (!step) return null
  const s = t.ftue.steps[step.id as keyof typeof t.ftue.steps]
  const act = acts[step.id]
  const label = (t.ftue.act as Record<string, string>)[step.id]
  return (
    <FtueCoach
      title={s.title}
      body={s.body}
      skipLabel={t.ftue.skip}
      onSkip={() => ftue.dismiss()}
      step={[steps.findIndex((x) => x.id === step.id) + 1, steps.length]}
      target={COACH_TARGET[step.id]}
      action={act && label ? { label, onAct: act } : undefined}
    />
  )
}

function GameOverlays({ selected, onClose, chronicleOpen, setChronicle, ceremony, endCeremony }: {
  selected: string | null
  onClose: () => void
  chronicleOpen: boolean
  setChronicle: (v: boolean) => void
  ceremony: { layer: string; payout: number } | null
  endCeremony: () => void
}) {
  const { unread } = useChronicle()
  const p = game.producers.find((x) => x.id === selected) ?? null
  const read = useStore(chronicleRead)
  const { world } = useEngine(rt)
  // Erster Start: erst der Prolog, dann gleich die erste Handlung. Die erste Chronik-Seite öffnet sich
  // als Lohn, sobald die Kräuterkate steht und ihr Fenster wieder zu ist (vorher lagen drei Tipps und
  // eine Buchseite vor dem ersten Bau).
  const intro = !read.includes('welcome') && !read.includes(PROLOGUE)
  // (die Kate steht von Anfang an auf Stufe 1: „gebaut“ heißt hier, einmal ausgebaut)
  const built = ownedOf(world, game.producers[0].id) >= 2
  useEffect(() => {
    if (!intro && built && !selected && unread.some((e) => e.id === 'welcome')) setChronicle(true)
  }, [intro, built, selected, unread, setChronicle])
  const ldef = ceremony ? game.prestigeLayers.find((l) => l.id === ceremony.layer) : null
  return (
    <>
      <UpgradeSheet p={p} open={!!p} onClose={onClose} buyModes={false} art={p ? <ProducerArt p={p} /> : null} note={p ? (t.producers as Record<string, { note: string }>)[p.id]?.note : undefined} />
      <ChronicleSheet open={chronicleOpen} onClose={() => setChronicle(false)} />
      {intro ? <Intro onDone={() => chronicleRead.add(PROLOGUE)} /> : null}
      {ceremony && ldef ? (
        <Ceremony
          layer={ceremony.layer}
          payout={ceremony.payout}
          currency={ldef.currency}
          onDone={() => {
            if (unread.length) setChronicle(true)
            endCeremony()
          }}
        />
      ) : null}
    </>
  )
}

/** „Nächste Mondwende (in etwa 40 min): öffnet Omen, Jahreskreis-Folio“; ist sie schon bereit, nur „Öffnet: …“. */
function turnNote(w: WorldView, ready: boolean, duration: (ms: number) => string): string | null {
  const o = nextTurnOpens(w)
  if (!o) return null
  // Vor der ersten Mondwende sind das lauter unbekannte Wörter: Die Zeile kommt erst, wenn die Mondwende
  // bereit oder in Reichweite ist. Wer schon eine gefeiert hat, sieht sie immer (Befund aus dem ersten Testlauf).
  const known = (prestigeState(w).layers[0]?.count ?? 0) >= 1
  const near = layerForecast(w, LAYER.moonturn, 0)
  if (!known && !ready && !(near && near.secondsToGate > 0 && near.secondsToGate <= TURN_NEAR_S)) return null
  const names = [...o.producers.map((id) => labels.producer(id).name), ...o.systems.map((id) => labels.content(`title.${id}`).name)].join(', ')
  if (ready) return t.play.turnOpensNow(names)
  const fc = layerForecast(w, LAYER.moonturn, 0)
  const eta = fc && fc.secondsToGate > 0 && Number.isFinite(fc.secondsToGate) ? duration(fc.secondsToGate * 1000) : null
  return eta ? t.play.turnOpensIn(eta, names) : t.play.turnOpens(names)
}

/** Ab so vielen Sekunden bis zur Schwelle gilt die erste Mondwende als „in Reichweite“ (wie die Pille in Notices). */
const TURN_NEAR_S = 30 * 60

/** Solange der Einstieg auf ein bestimmtes Bauwerk oder den Funkenruf zeigt, schweigt die Ziel-Zeile: eine Ansage, nicht zwei. */
const COACH_LEADS: readonly string[] = ['build', 'welcome', 'burst']

/** Was das Sternenrad gerade bewirkt (aus der Marke im Tal). */
function WheelBuffSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const buff = world.get<WheelState | undefined>(WHEEL_ID)?.buff
  if (!buff) return null
  const l = labels.content(`wheel.${buff}`)
  return (
    <Sheet open={open} title={labels.content('title.wheel').name} onClose={onClose} testId="wheel-buff-sheet">
      <p className="ek-strong">{l.name}</p>
      <p>{l.blurb}</p>
    </Sheet>
  )
}

export function App() {
  const [selected, setSelected] = useState<string | null>(null)
  const [chronicleOpen, setChronicle] = useState(false)
  const [ceremony, setCeremony] = useState<{ layer: string; payout: number } | null>(null)
  const [wheelOpen, setWheelOpen] = useState(false)
  const [wheelInfo, setWheelInfo] = useState(false)
  const [tab, setTab] = useState('play')
  const read = useStore(chronicleRead)
  const { world } = useEngine(rt)
  const unread = CHRONICLE.some((e) => e.open(world) && !read.includes(e.id))
  const unreadLetter = CHRONICLE.some((e) => e.voice === 'letter' && e.open(world) && !read.includes(e.id))
  const [rankOpen, setRankOpen] = useState(false)
  const [previewStyle, setPreviewStyle] = useState<string | null>(null)
  const [decorEdit, setDecorEdit] = useState(false)
  const basket = world.get<OfflineState>(MODULE.offline)?.pending ?? null
  const openTab = (id: string) => {
    setTab(id)
    tabsSeen.add(id)
  }
  const seen = useStore(tabsSeen)
  useSteps(ftue)
  const coachStep = currentStep(steps, ftue, world)?.id
  const coachLeads = !!coachStep && COACH_LEADS.includes(coachStep)
  const turnReady = prestigeReady(world)
  const metaWaiting = archiveVisible(world) && countAffordableMeta(world) > 0
  const archiveOpen = archiveVisible(world)
  const branchVisible = (b: string) => {
        // Läden der Langen Nacht und des Zeitalters erst zeigen, wenn es ihre Währung schon gab
        const earned = (rt.get().modules.wallet as { earned: Record<string, number> }).earned
        if (b === 'night') return (earned[CURRENCY.nightDew] ?? 0) > 0
        if (b === 'ages') return (earned[CURRENCY.forebearLight] ?? 0) > 0
        return true
      }
  useEffect(() => connectSfx(rt, sfx, SFX_EVENTS), [])
  useEffect(() => ambience.attach(), [])
  useEffect(() => {
    if (chronicleOpen) sfx.play('letter')
  }, [chronicleOpen])
  return (
    <GameShell
      rt={rt}
      i18n={i18n}
      prefs={prefs}
      labels={labels}
      className="lw-app"
      playtest={playtest}
      legal={{ imprint: () => IMPRINT?.[i18n.getLocale() === 'en' ? 'en' : 'de'], privacyUrl: `./${PRIVACY_PAGE}` }}
      title={() => t.app.title}
      distribution={DISTRIBUTION}
      testPhase={TEST_PHASE}
      version={__APP_VERSION__}
      backup={{ prefix: 'LW1:', keys: [game.saveKey, `${game.id}-chronicle-v1`, `${game.id}-ftue-v1`], fileName: (d) => `${game.id}-sicherung-${d}.txt` }}
      hud={
        <Hud
          primaryId={CURRENCY.glimmer}
          icon={<span className="lw-glimmer-icon" />}
          extra={
            <>
              <RankTile onOpen={() => setRankOpen(true)} />
              <button type="button" className="lw-hud-btn" data-testid="hud-chronicle" onClick={() => setChronicle(true)}>
                <IconBook />
                <span>{t.chronicle.menu}</span>
                {/* Laut nur, wenn ein Brief wartet; eine neue Seite ist ein leiser Ring */}
                {unread ? <span className={`ek-badge${unreadLetter ? '' : ' ek-badge--quiet'}`} aria-label={t.chronicle.unread} /> : null}
              </button>
            </>
          }
          // Nebenwährungen klein unter dem Glimmer, sobald es sie einmal gab
          sub={<SideCurrencies />}
          // Ziel-Zeile wie in der Vorlage: Sie zeigt immer das Ziel, das am weitesten ist (nächster Ausbau, nächstes
          // Bauwerk, nächster Wächterrang oder die Mondwende), mit Zahl rechts. Kurz vor dem Ziel steht „… % geschafft“.
          // Solange der Einstieg auf etwas zeigt, schweigt sie (eine Ansage, nicht zwei).
          pressing={{
            text: (g, ui) => {
              if (coachLeads || g.kind === 'none') return null
              const cur = labels.currency(CURRENCY.glimmer)
              const near = g.near ? ` · ${t.play.goal.done(String(Math.min(99, Math.round(g.ratio * 100))))}` : ''
              if (g.kind === 'upgrade') return { title: (g.first ? t.play.goal.first : t.play.goal.upgrade)(labels.producer(g.id).name), detail: t.play.goal.cost(ui.fmt(g.cost), cur) + near }
              if (g.kind === 'unlock') {
                const v = g.via
                const detail = v.kind === 'primaryRun' ? t.play.goal.left(ui.fmt(v.left), cur) : v.kind === 'producer' ? t.play.goal.needLevel(labels.producer(v.id).name, ui.fmt(v.have), ui.fmt(v.need)) : t.play.goal.needRank(ui.fmt(v.have), ui.fmt(v.need))
                return { title: t.play.goal.unlock(labels.producer(g.id).name), detail: detail + near }
              }
              if (g.kind === 'level') return { title: t.play.goal.rank(ui.fmt(g.next)), detail: t.play.goal.xp(ui.fmt(g.into), ui.fmt(g.need)) + near }
              const layer = labels.layer(g.layer).name
              if (g.ready) return { title: t.play.goalPrestige(layer, fmtShort(g.payout), labels.currency(game.prestigeLayers.find((l) => l.id === g.layer)?.currency ?? '')) }
              return { title: t.play.goal.turn(layer), detail: t.play.goal.left(ui.fmt(g.left), cur) + near }
            },
            // Zweite Zeile: was die nächste Mondwende öffnet und wie weit sie noch weg ist (Befund aus dem ersten Testlauf:
            // nach der dritten Mondwende vier Besuche ohne neues Ziel vor Augen). Vor der ersten bleibt sie weg (turnNote).
            note: (g, ui) => turnNote(world, g.kind === 'prestige' && g.ready, ui.duration),
            // Die Zeile führt dorthin, wovon sie spricht
            onGoal: (g) => {
              if (g.kind === 'upgrade' || g.kind === 'unlock') setSelected(g.id)
              else if (g.kind === 'level') setRankOpen(true)
              else if (g.kind === 'prestige') openTab('prestige')
            },
          }}
        />
      }
      play={
        <Play
          onOpen={setSelected}
          // Wartet Ertrag (kurze Abwesenheit oder „Später“), sammelt der Knopf ein; sonst führt er zur Wacht
          today={
            basket
              ? { dot: true, collect: basket.gained, onOpen: () => rt.dispatch(MODULE.offline, 'claim') }
              : isFeatureOpen(world, 'watch')
                ? { dot: watchBadge(world), onOpen: () => openTab('watch') }
                : undefined
          }
          letter={unreadLetter ? { onOpen: () => setChronicle(true) } : undefined}
          decorEdit={decorEdit ? { onEnd: () => { setDecorEdit(false); openTab('world') } } : undefined}
          preview={previewStyle ? { style: previewStyle, onEnd: () => { setPreviewStyle(null); openTab('market') } } : undefined}
        />
      }
      feedback={feedback}
      navIcons={{ play: <IconTower />, prestige: <IconMoon />, menu: <IconMenu /> }}
      // Die Leiste hat vier Knöpfe (Tal, Mondwende, Markt, Menü), ab der ersten Langen Nacht fünf (dazu die Lande). Weitere Systeme sind Kacheln im Menü.
      navLabels={{ play: t.app.tabPlay, prestige: t.layers.moonturn.name }}
      // Der laute Punkt heißt „jetzt abholbar“ (Mondwende bereit, Geschenk da). „Etwas wäre kaufbar“ und „neu“ sind ein leiser Ring.
      navBadges={{ prestige: turnReady || metaWaiting }}
      navQuiet={{ prestige: !turnReady }}
      shopVisible={false}
      tabs={[
        // Die Lande sind ab der ersten Langen Nacht das größte System: Sie stehen in der Leiste, nicht im Menü (Entscheidung 2026-11-12)
        ...(isFeatureOpen(world, 'realms') ? [{ item: { id: 'realms', label: t.realms.tab, icon: <IconMap />, badge: !seen.includes('realms'), quiet: true, hint: t.app.menuHint.realms(fmtShort(openRealmCount(world)), fmtShort(REALM_IDS.length)) }, view: <RealmsTab /> }] : []),
        { item: { id: 'market', label: t.trade.tab, icon: <IconPouch />, badge: marketReady(world.get<MarketState>(MARKET_ID), MARKET, rt.clock) }, view: <MarketTab onPreviewStyle={(id) => { setPreviewStyle(id); setTab('play') }} /> },
      ]}
      menuViews={[
        ...(isFeatureOpen(world, 'watch') ? [{ item: { id: 'watch', label: t.watch.tab, icon: <IconLantern />, badge: !seen.includes('watch'), dot: watchBadge(world), hint: watchBadge(world) ? t.app.menuHint.watchWaiting : t.app.menuHint.watchDone }, view: <WatchView /> }] : []),
        ...(isFeatureOpen(world, 'herbal') ? [{ item: { id: 'world', label: t.world.tab, icon: <IconLeaf />, badge: !seen.includes('world'), dot: voyageWaiting(world), hint: t.app.menuHint.world(fmtShort(foundCount(world)), fmtShort(COLLECTION.entries.length)) }, view: <WorldTab onDecorEdit={() => { setDecorEdit(true); setTab('play') }} /> }] : []),
      ]}
      menu={[{ id: 'chronicle', label: t.chronicle.menu, icon: <IconBook />, onSelect: () => setChronicle(true), badge: unread, hint: t.app.menuHint.chronicle(fmtShort(CHRONICLE.filter((e) => e.open(world)).length)) }]}
      menuTop={<Soon />}
      menuIcons={{ save: <IconSave />, settings: <IconGear />, legal: <IconScroll /> }}
      // Alles zum Neubeginn steht im Mondwende-Tab: das Archiv (sobald es dort etwas gibt) und die Prüfungen
      prestigeSections={[
        ...(archiveOpen ? [{ id: 'archive', label: t.effectLabels.archive, dot: metaWaiting, view: <MetaShopPanel title={t.effectLabels.archive} branchVisible={branchVisible} /> }] : []),
        ...(isFeatureOpen(world, 'trials') ? [{ id: 'trials', label: labels.content('title.trials').name, view: <ChallengesCard cfg={TRIALS} /> }] : []),
      ]}
      notice={<NoticeArea onEvents={() => openTab('watch')} onPrestige={() => openTab('prestige')} compact waiting={{ openWorld: () => openTab('world'), openWheel: () => setWheelInfo(true) }} acts={{ welcome: () => setChronicle(true), build: () => setSelected('kraeuterkate'), unlock: () => setSelected('holzlager'), prestige: () => openTab('prestige') }} />}
      welcomeArt={<ComebackLetter />}
      welcomeExtra={<Soon />}
      onWelcomePick={setSelected}
      installArt={<img src="./icons/icon-192.png" alt="" width={72} height={72} className="lw-install-icon" />}
      tab={tab}
      onTab={(id) => {
        setTab(id)
        tabsSeen.add(id)
      }}
      onPrestige={(layer, payout) => setCeremony({ layer, payout })}
      overlays={
        <>
          <GameOverlays
            selected={selected}
            onClose={() => setSelected(null)}
            chronicleOpen={chronicleOpen}
            setChronicle={setChronicle}
            ceremony={ceremony}
            endCeremony={() => {
              setCeremony(null)
              // Das Sternenrad dreht man in der Zeremonie; wer es dort ausließ, bekommt es danach noch einmal angeboten
              if (isFeatureOpen(rt.world(), 'wheel') && (rt.get().modules.wheel as { spins: number }).spins > 0) setWheelOpen(true)
              // Danach liegt das erste lohnende Bauwerk gleich auf (wenn keine Chronik-Seite wartet)
              else if (!CHRONICLE.some((e) => e.open(rt.world()) && !chronicleRead.has(e.id))) setSelected(bestBuy(rt.world())?.id ?? game.producers[0].id)
            }}
          />
          <WheelSheet open={wheelOpen && !ceremony && !chronicleOpen} onClose={() => setWheelOpen(false)} cfg={STAR_WHEEL} />
          <WheelBuffSheet open={wheelInfo} onClose={() => setWheelInfo(false)} />
          <RankSheet open={rankOpen} onClose={() => setRankOpen(false)} />
          <CardPicker open={!wheelOpen && !ceremony && !chronicleOpen && cardsWaiting(world)} cfg={CONSTELLATIONS} />
        </>
      }
    />
  )
}
