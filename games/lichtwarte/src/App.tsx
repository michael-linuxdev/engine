import { useEffect, useState } from 'react'
import { countAffordableMeta, DAILY_ID, dailyStatus, isFeatureOpen, prestigeReady, MARKET_ID, marketReady, prestigeState, localDayKey, MODULE, QUESTS_ID, type DailyState, type MarketState, type ProducerDef, type QuestsState, type WorldView } from '@engine/core'
import { connectSfx, currentStep, useEngine, useStore, useSteps } from '@engine/react'
import { CardPicker, ChallengesCard, FtueCoach, GameShell, Hud, MetaShopPanel, UpgradeSheet, useUi, WheelSheet } from '@engine/ui'
import { tierFor } from '@engine/art'
import { BuildingArt } from './art/Building'
import { IconBook, IconGear, IconLantern, IconLeaf, IconMap, IconMenu, IconMoon, IconPouch, IconSave, IconScroll, IconTower } from './art/icons'
import { SparkDock } from './scene/SparkDock'
import { TIER_LEVELS } from './art/registry'
import { DISTRIBUTION, TEST_PHASE } from './distribution'
import { CHRONICLE } from './content/chronicle'
import { DAILY, TRIALS } from './content/live'
import { MARKET } from './content/market'
import { Notices } from './story/Notices'
import { WatchView } from './story/Watch'
import { WorldTab } from './story/WorldTab'
import { RealmsTab } from './story/RealmsTab'
import { MarketTab } from './story/MarketTab'
import { feedback } from './story/feedback'
import { Soon } from './story/Soon'
import { ftueSteps } from './content/ftue'
import { CURRENCY, game } from './game'
import { ambience, chronicleRead, ftue, i18n, labels, playtest, prefs, rt, sfx, t, tabsSeen } from './runtime'
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

/** Abzeichen am Wacht-Tab: Wachrunde offen oder Auftrag fertig. */
function watchBadge(w: WorldView): boolean {
  const d = w.get<DailyState>(DAILY_ID)
  const q = w.get<QuestsState>(QUESTS_ID)
  return (!!d && dailyStatus(d, localDayKey(rt.clock), DAILY).canClaim) || (q?.active.some((x) => !x.claimed && x.progress >= x.goal) ?? false)
}

/** Gerätemerker „Prolog gesehen“ (steht neben den gelesenen Chronik-Seiten). */
const PROLOGUE = 'prologue'

const steps = ftueSteps((id) => chronicleRead.has(id), (id) => tabsSeen.has(id))

function Play({ onOpen, today, letter }: { onOpen: (id: string) => void } & MapExtras) {
  return (
    <ValleyMap onOpen={onOpen} today={today} letter={letter}>
      <SparkDock />
    </ValleyMap>
  )
}

/** Nebenwährungen klein unter dem Glimmer, sobald es sie einmal gab. */
function SideCurrencies() {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const earned = world.get<{ earned: Record<string, number> }>(MODULE.wallet)?.earned ?? {}
  const list = [CURRENCY.glowPebbles, CURRENCY.runeShards, CURRENCY.nightDew, CURRENCY.forebearLight].filter((c) => (earned[c] ?? 0) > 0)
  return (
    <>
      {list.map((c) => (
        <span key={c} data-testid={`hud-${c}`}>
          <strong>{ui.fmt(world.balance(c))}</strong> {ui.labels.currency(c)}
        </span>
      ))}
    </>
  )
}

function ProducerArt({ p }: { p: ProducerDef }) {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const level = (world.get<{ owned: Record<string, number> }>(MODULE.producers)?.owned[p.id] ?? 0)
  return (
    <svg className="lw-upgrade-art" viewBox="-42 -84 84 92" role="img" aria-label={ui.labels.producer(p.id).name}>
      <BuildingArt id={p.id} tier={Math.max(1, tierFor(level, TIER_LEVELS))} m={currentMood()} />
    </svg>
  )
}

function useCoachActive(): boolean {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  useSteps(ftue)
  return currentStep(steps, ftue, world) !== null
}

function NoticeArea({ onEvents, onPrestige, compact }: { onEvents: () => void; onPrestige: () => void; compact: boolean }) {
  const active = useCoachActive()
  return (
    <div className="lw-notices">
      <Notices coach={active ? <Coach /> : null} onEvents={onEvents} onPrestige={onPrestige} compact={compact} />
    </div>
  )
}

function Coach() {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  useSteps(ftue)
  useStore(chronicleRead)
  useStore(tabsSeen)
  const step = currentStep(steps, ftue, world)
  if (!step) return null
  const s = t.ftue.steps[step.id as keyof typeof t.ftue.steps]
  return <FtueCoach title={s.title} body={s.body} skipLabel={t.ftue.skip} onSkip={() => ftue.dismiss()} />
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
  // Erster Start: erst der Prolog, dann öffnet sich die erste Chronik-Seite von selbst.
  const intro = !read.includes('welcome') && !read.includes(PROLOGUE)
  useEffect(() => {
    if (!intro && unread.some((e) => e.id === 'welcome')) setChronicle(true)
  }, [intro, unread, setChronicle])
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

export function App() {
  const [selected, setSelected] = useState<string | null>(null)
  const [chronicleOpen, setChronicle] = useState(false)
  const [ceremony, setCeremony] = useState<{ layer: string; payout: number } | null>(null)
  const [wheelOpen, setWheelOpen] = useState(false)
  const [tab, setTab] = useState('play')
  const read = useStore(chronicleRead)
  const { world } = useEngine(rt)
  const unread = CHRONICLE.some((e) => e.open(world) && !read.includes(e.id))
  const unreadLetter = CHRONICLE.some((e) => e.voice === 'letter' && e.open(world) && !read.includes(e.id))
  const [rankOpen, setRankOpen] = useState(false)
  const openTab = (id: string) => {
    setTab(id)
    tabsSeen.add(id)
  }
  const seen = useStore(tabsSeen)
  // Das Archiv erscheint erst, wenn es dort etwas zu holen gibt: nach der ersten Mondwende
  const archiveOpen = (prestigeState(world).layers[0]?.count ?? 0) >= 1 || (world.get<{ earned: Record<string, number> }>(MODULE.wallet)?.earned[CURRENCY.runeShards] ?? 0) > 0
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
                {unread ? <span className="ek-badge" aria-label={t.chronicle.unread} /> : null}
              </button>
            </>
          }
          // Nebenwährungen klein unter dem Glimmer, sobald es sie einmal gab
          sub={<SideCurrencies />}
          // Die Ziel-Zeile führt dorthin, wovon sie spricht: zum Bauwerk oder zum Mondwende-Tab
          onGoal={(g) => {
            if (g.kind === 'unlock' || g.kind === 'milestone') setSelected(g.id)
            else if (g.kind === 'prestige' || g.kind === 'prestigeProgress') openTab('prestige')
          }}
          goalText={(g) =>
            g.kind === 'unlock'
              ? t.play.goalUnlock(labels.producer(g.id).name)
              : g.kind === 'milestone'
                ? t.play.goalMilestone(labels.producer(g.id).name, String(g.at))
                : g.kind === 'prestige'
                  ? t.play.goalPrestige(labels.layer(g.layer).name)
                  : g.kind === 'prestigeProgress'
                    ? t.play.goalProgress(labels.layer(g.layer).name)
                    : null
          }
        />
      }
      play={
        <Play
          onOpen={setSelected}
          today={isFeatureOpen(world, 'watch') ? { dot: watchBadge(world), onOpen: () => openTab('watch') } : undefined}
          letter={unreadLetter ? { onOpen: () => setChronicle(true) } : undefined}
        />
      }
      feedback={feedback}
      navIcons={{ play: <IconTower />, prestige: <IconMoon />, menu: <IconMenu /> }}
      // Die Leiste bleibt bei vier Knöpfen: Tal, Mondwende, Markt, Menü. Weitere Systeme sind Kacheln im Menü.
      navLabels={{ play: t.app.tabPlay, prestige: t.layers.moonturn.name }}
      navBadges={{ prestige: prestigeReady(world) || (archiveOpen && countAffordableMeta(world) > 0) }}
      shopVisible={false}
      tabs={[{ item: { id: 'market', label: t.trade.tab, icon: <IconPouch />, badge: marketReady(world.get<MarketState>(MARKET_ID), MARKET, rt.clock) }, view: <MarketTab /> }]}
      menuViews={[
        ...(isFeatureOpen(world, 'watch') ? [{ item: { id: 'watch', label: t.watch.tab, icon: <IconLantern />, badge: !seen.includes('watch'), dot: watchBadge(world) }, view: <WatchView /> }] : []),
        ...(isFeatureOpen(world, 'herbal') ? [{ item: { id: 'world', label: t.world.tab, icon: <IconLeaf />, badge: !seen.includes('world') }, view: <WorldTab /> }] : []),
        ...(isFeatureOpen(world, 'realms') ? [{ item: { id: 'realms', label: t.realms.tab, icon: <IconMap />, badge: !seen.includes('realms') }, view: <RealmsTab /> }] : []),
      ]}
      menu={[{ id: 'chronicle', label: t.chronicle.menu, icon: <IconBook />, onSelect: () => setChronicle(true), badge: unread }]}
      menuTop={<Soon />}
      menuIcons={{ save: <IconSave />, settings: <IconGear />, legal: <IconScroll /> }}
      // Alles zum Neubeginn steht im Mondwende-Tab: das Archiv (sobald es dort etwas gibt) und die Prüfungen
      prestigeSections={[
        ...(archiveOpen ? [{ id: 'archive', label: t.effectLabels.archive, view: <MetaShopPanel title={t.effectLabels.archive} branchVisible={branchVisible} /> }] : []),
        ...(isFeatureOpen(world, 'trials') ? [{ id: 'trials', label: labels.content('title.trials').name, view: <ChallengesCard cfg={TRIALS} /> }] : []),
      ]}
      notice={<NoticeArea onEvents={() => openTab('watch')} onPrestige={() => openTab('prestige')} compact />}
      welcomeArt={<ComebackLetter />}
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
              // Danach einmal am Sternenrad drehen (falls freigeschaltet) — erst wenn die Chronik zu ist
              if (isFeatureOpen(rt.world(), 'wheel') && (rt.get().modules.wheel as { spins: number }).spins > 0) setWheelOpen(true)
            }}
          />
          <WheelSheet open={wheelOpen && !ceremony && !chronicleOpen} onClose={() => setWheelOpen(false)} />
          <RankSheet open={rankOpen} onClose={() => setRankOpen(false)} />
          <CardPicker open={!wheelOpen && !ceremony && !chronicleOpen && cardsWaiting(world)} onClose={() => rt.dispatch('layerCards', 'pick', { id: (rt.get().modules.layerCards as { offer: string[] }).offer[0] })} />
        </>
      }
    />
  )
}
