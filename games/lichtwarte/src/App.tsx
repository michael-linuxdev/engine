import { useEffect, useState } from 'react'
import { DAILY_ID, dailyStatus, isFeatureOpen, localDayKey, MODULE, QUESTS_ID, type DailyState, type ProducerDef, type QuestsState, type WorldView } from '@engine/core'
import { connectSfx, currentStep, useEngine, useStore, useSteps } from '@engine/react'
import { CardPicker, FtueCoach, GameShell, Hud, UpgradeSheet, useUi, WheelSheet } from '@engine/ui'
import { tierFor } from '@engine/art'
import { BuildingArt } from './art/Building'
import { IconArchive, IconBook, IconLantern, IconLeaf, IconMap, IconMenu, IconMoon, IconPouch, IconTower } from './art/icons'
import { SparkDock } from './scene/SparkDock'
import { TIER_LEVELS } from './art/registry'
import { DISTRIBUTION, TEST_PHASE } from './distribution'
import { CHRONICLE } from './content/chronicle'
import { DAILY } from './content/live'
import { Notices } from './story/Notices'
import { WatchView } from './story/Watch'
import { WorldTab } from './story/WorldTab'
import { RealmsTab } from './story/RealmsTab'
import { MarketTab } from './story/MarketTab'
import { ftueSteps } from './content/ftue'
import { CURRENCY, game } from './game'
import { ambience, chronicleRead, ftue, i18n, labels, playtest, prefs, rt, sfx, t, tabsSeen } from './runtime'
import { SFX_EVENTS } from './audio/sfx'
import { IMPRINT, PRIVACY_PAGE } from './legal'
import { ValleyMap } from './scene/ValleyMap'
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

function Play({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <ValleyMap onOpen={onOpen}>
      <SparkDock />
    </ValleyMap>
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

function NoticeArea({ onEvents, compact }: { onEvents: () => void; compact: boolean }) {
  const active = useCoachActive()
  return (
    <div className="lw-notices">
      <Notices coach={active ? <Coach /> : null} onEvents={onEvents} compact={compact} />
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
      <UpgradeSheet p={p} open={!!p} onClose={onClose} art={p ? <ProducerArt p={p} /> : null} note={p ? (t.producers as Record<string, { note: string }>)[p.id]?.note : undefined} />
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
            <button type="button" className="lw-hud-btn" data-testid="hud-chronicle" onClick={() => setChronicle(true)}>
              <IconBook />
              <span>{t.chronicle.menu}</span>
              {unread ? <span className="ek-badge" aria-label={t.chronicle.unread} /> : null}
            </button>
          }
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
      play={<Play onOpen={setSelected} />}
      navIcons={{ play: <IconTower />, prestige: <IconMoon />, shop: <IconArchive />, menu: <IconMenu /> }}
      menu={[{ id: 'chronicle', label: t.chronicle.menu, onSelect: () => setChronicle(true), badge: unread }]}
      tabs={[
        ...(isFeatureOpen(world, 'watch') ? [{ item: { id: 'watch', label: t.watch.tab, icon: <IconLantern />, badge: watchBadge(world) }, view: <WatchView /> }] : []),
        ...(isFeatureOpen(world, 'herbal') ? [{ item: { id: 'world', label: t.world.tab, icon: <IconLeaf /> }, view: <WorldTab /> }] : []),
        ...(isFeatureOpen(world, 'realms') ? [{ item: { id: 'realms', label: t.realms.tab, icon: <IconMap /> }, view: <RealmsTab /> }] : []),
        ...(isFeatureOpen(world, 'market') ? [{ item: { id: 'market', label: t.trade.tab, icon: <IconPouch /> }, view: <MarketTab /> }] : []),
      ]}
      notice={<NoticeArea onEvents={() => setTab('watch')} compact={tab === 'play'} />}
      metaBranchVisible={(b) => {
        // Läden der Langen Nacht und des Zeitalters erst zeigen, wenn es ihre Währung schon gab
        const earned = (rt.get().modules.wallet as { earned: Record<string, number> }).earned
        if (b === 'night') return (earned[CURRENCY.nightDew] ?? 0) > 0
        if (b === 'ages') return (earned[CURRENCY.forebearLight] ?? 0) > 0
        return true
      }}
      welcomeArt={<ComebackLetter />}
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
          <CardPicker open={!wheelOpen && !ceremony && !chronicleOpen && cardsWaiting(world)} onClose={() => rt.dispatch('layerCards', 'pick', { id: (rt.get().modules.layerCards as { offer: string[] }).offer[0] })} />
        </>
      }
    />
  )
}
