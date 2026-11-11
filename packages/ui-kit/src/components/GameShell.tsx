import { useEffect, useState, type ReactNode } from 'react'
import { encodeBackup } from '@engine/core'
import {
  currentInstallEnv, installSkippedRecently, readJson, readKey, shouldShowInstallGate, shouldShowTestPhase, usePrefs, useRuntimeLoop, writeKey,
  type Distribution, type EngineRuntime, type I18n, type PlaytestLog, type PrefsStore,
} from '@engine/react'
import { UiProvider, type UiLabels } from '../context'
import type { EngineStrings } from '../i18n/de'
import { AppNav, type MenuItem, type NavItem } from './AppNav'
import { FeedbackLayer } from './Feedback'
import type { FeedbackMap } from '../feedback'
import { MetaShopPanel } from './MetaShop'
import { ErrorBoundary, InstallGate, MultSheet, SaveGuardBanner, TestPhaseNotice, WelcomeBack } from './Overlays'
import { PrestigePanel, PrestigeTab, type PrestigeSection } from './Prestige'
import { LegalSheet, SaveSheet, SettingsSheet } from './Settings'

export interface GameShellProps<S extends EngineStrings> {
  rt: EngineRuntime
  i18n: I18n<S>
  prefs: PrefsStore
  labels: UiLabels
  title: () => string
  distribution: Distribution
  testPhase: boolean
  version: string
  backup: { prefix: string; keys: readonly string[]; fileName: (date: string) => string }
  /** Main play view. */
  play: ReactNode
  hud: ReactNode
  /** Extra tabs (id → view) after play/prestige/shop. */
  tabs?: { item: NavItem; view: ReactNode }[]
  /** Further views that live in the menu as tiles instead of tabs (the tab bar stays short). `badge` marks a tile as new. */
  menuViews?: { item: NavItem; view: ReactNode }[]
  /** Shown at the top of the menu (e.g. what is ready soon). */
  menuTop?: ReactNode
  /** Sections of the new-beginning tab below the layers (meta shop, challenges …); with them the tab gets jump buttons and a fixed action bar. */
  prestigeSections?: readonly PrestigeSection[]
  /** Dots at the built-in tabs (something is ready there). */
  navBadges?: Partial<Record<'play' | 'prestige' | 'shop', boolean>>
  /** Icons for the built-in tabs (`play`, `prestige`, `shop`) and the menu button (`menu`). */
  navIcons?: Partial<Record<'play' | 'prestige' | 'shop' | 'menu', ReactNode>>
  /** Other labels for the built-in tabs (default: the engine's own words). */
  navLabels?: Partial<Record<'play' | 'prestige' | 'shop', string>>
  /** Show the meta-shop tab (default: yes). Lets a game hide it until there is something to buy. */
  shopVisible?: boolean
  /** Icons for the built-in menu entries; with icons the menu shows as tiles. */
  menuIcons?: Partial<Record<'save' | 'settings' | 'legal', ReactNode>>
  /** Extra menu entries before save/settings/legal. */
  menu?: MenuItem[]
  /** Shop: which meta branches to show (default: all). */
  metaBranchVisible?: (branch: string) => boolean
  /** Hint area between HUD and main view (FTUE coach …). */
  notice?: ReactNode
  /** Extra overlays (game sheets) rendered on top. */
  overlays?: ReactNode
  onPrestige?: (layer: string, payout: number) => void
  installArt?: ReactNode
  welcomeArt?: ReactNode
  /** Shown in the welcome window below the income (what got ready meanwhile). */
  welcomeExtra?: ReactNode
  /** The player picked an affordable building in the welcome window. */
  onWelcomePick?: (producer: string) => void
  prestigeArt?: (layer: string) => ReactNode
  /** Open a named overlay from outside (FTUE …). */
  openRef?: (open: (id: string) => void) => void
  /** Visible feedback for engine events (toasts, rising numbers, flights to the HUD). */
  feedback?: FeedbackMap
  /** Called when the player switches tabs. */
  onTab?: (id: string) => void
  /** Controlled active tab (optional; otherwise the shell keeps its own). */
  tab?: string
  className?: string
  /** Opt-in playtest log (test phase): settings toggle, export, test-phase notice. */
  playtest?: PlaytestLog
  /** Legal: imprint text (missing → notice) and a static privacy page. */
  legal?: { imprint?: () => string | undefined; privacyUrl?: string }
}

const flagsKey = (rt: EngineRuntime) => `${rt.def.id}-device-v1`

export function GameShell<S extends EngineStrings>(p: GameShellProps<S>) {
  const locale = p.i18n.useLocale()
  const prefs = usePrefs(p.prefs)
  useRuntimeLoop(p.rt)
  const [ownTab, setTab] = useState('play')
  const tab = p.tab ?? ownTab
  const [overlay, setOverlay] = useState<string | null>(null)
  const [flags, setFlags] = useState(() => readJson<{ installSkippedAt?: number; testPhaseOk?: boolean; record?: boolean }>(flagsKey(p.rt), {}))
  const saveFlags = (f: typeof flags) => {
    setFlags(f)
    writeKey(flagsKey(p.rt), JSON.stringify(f))
  }
  useEffect(() => p.openRef?.(setOverlay), [p])
  const playtest = p.playtest
  useEffect(() => playtest?.attach(p.rt), [playtest, p.rt])
  // The scientific notation is no longer offered: a stored choice falls back to the short form
  useEffect(() => {
    if (prefs.numberStyle !== 'compact') p.prefs.update({ numberStyle: 'compact' })
  }, [prefs.numberStyle, p.prefs])
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', String(prefs.fontScale))
    document.documentElement.classList.toggle('ek-reduced-motion', prefs.reducedMotion)
  }, [prefs.fontScale, prefs.reducedMotion])
  const env = currentInstallEnv()
  // "Continue in the browser" holds for six hours, then the gate returns
  const [startedAt] = useState(() => Date.now())
  const gate = !installSkippedRecently(flags.installSkippedAt, startedAt) && shouldShowInstallGate(p.distribution, env)
  /** Backup code to carry browser progress into the installed app (only once something was earned). */
  const carryCode = () => {
    p.rt.save()
    const data: Record<string, string> = {}
    for (const k of p.backup.keys) {
      const v = readKey(k)
      if (v) data[k] = v
    }
    return encodeBackup(p.backup.prefix, p.rt.def.id, data, p.rt.clock.now())
  }
  const testPhase = !gate && shouldShowTestPhase(p.testPhase, !!flags.testPhaseOk, env)
  const t = p.i18n.t
  const items: NavItem[] = [
    { id: 'play', label: p.navLabels?.play ?? t.nav.play, icon: p.navIcons?.play, badge: p.navBadges?.play },
    { id: 'prestige', label: p.navLabels?.prestige ?? t.nav.prestige, icon: p.navIcons?.prestige, badge: p.navBadges?.prestige },
    ...(p.shopVisible === false ? [] : [{ id: 'shop', label: p.navLabels?.shop ?? t.nav.shop, icon: p.navIcons?.shop, badge: p.navBadges?.shop }]),
    ...(p.tabs ?? []).map((x) => x.item),
  ]
  const go = (id: string) => {
    setTab(id)
    p.onTab?.(id)
    playtest?.record('app.tab', { tab: id })
  }
  const menu: MenuItem[] = [
    ...(p.menuViews ?? []).map((x) => ({ id: x.item.id, label: x.item.label, icon: x.item.icon, badge: !!x.item.badge, dot: x.item.dot, view: true, onSelect: () => go(x.item.id) })),
    ...(p.menu ?? []),
    { id: 'save', label: t.save.menu, icon: p.menuIcons?.save, quiet: true, onSelect: () => setOverlay('save') },
    { id: 'settings', label: t.settings.menu, icon: p.menuIcons?.settings, quiet: true, onSelect: () => setOverlay('settings') },
    { id: 'legal', label: t.legal.menu, icon: p.menuIcons?.legal, quiet: true, onSelect: () => setOverlay('legal') },
  ]
  const views: Record<string, ReactNode> = {
    play: p.play,
    prestige: p.prestigeSections ? <PrestigeTab onPerformed={p.onPrestige} art={p.prestigeArt} sections={p.prestigeSections} title={p.navLabels?.prestige} /> : <PrestigePanel onPerformed={p.onPrestige} art={p.prestigeArt} />,
    shop: <MetaShopPanel branchVisible={p.metaBranchVisible} />,
  }
  for (const x of [...(p.tabs ?? []), ...(p.menuViews ?? [])]) views[x.item.id] = x.view
  const close = () => setOverlay(null)
  return (
    <ErrorBoundary strings={() => t}>
      <UiProvider t={t} locale={locale} labels={p.labels} prefs={p.prefs} rt={p.rt} setLocale={(l) => {
          playtest?.record('app.language', { to: l })
          void p.i18n.setLocale(l, { persist: true })
        }} open={setOverlay}>
        {gate ? (
          <InstallGate title={p.title()} art={p.installArt} onSkip={() => saveFlags({ ...flags, installSkippedAt: Date.now() })} carryCode={p.rt.get().core.primaryLifetime > 0 ? carryCode : undefined} />
        ) : (
          <div className={['ek-app', p.className ?? ''].join(' ').trim()} data-locale={locale} data-tab={tab}>
            <SaveGuardBanner />
            {p.hud}
            {p.notice}
            {/* The only scrolling area of the app; focusable so the keyboard can scroll it (axe) */}
            <main className="ek-main" id="main" data-testid={`view-${tab}`} tabIndex={0}>
              {views[tab] ?? p.play}
            </main>
            <AppNav
              items={items}
              active={tab}
              onChange={go}
              menu={menu}
              menuIcon={p.navIcons?.menu}
              menuActive={(p.menuViews ?? []).some((x) => x.item.id === tab)}
              menuTop={p.menuTop}
            />
            {testPhase ? <TestPhaseNotice onDone={(record) => {
                  saveFlags({ ...flags, testPhaseOk: true, record })
                  playtest?.setEnabled(record)
                }} /> : <WelcomeBack art={p.welcomeArt} extra={p.welcomeExtra} onPick={p.onWelcomePick} />}
            <SaveSheet open={overlay === 'save'} onClose={close} prefix={p.backup.prefix} app={p.rt.def.id} keys={p.backup.keys} fileName={p.backup.fileName} />
            <SettingsSheet open={overlay === 'settings'} onClose={close} version={p.version} playtest={playtest} />
            <LegalSheet open={overlay === 'legal'} onClose={close} imprint={p.legal?.imprint?.()} privacyUrl={p.legal?.privacyUrl} />
            <MultSheet open={overlay === 'mult'} onClose={close} />
            {p.overlays}
            {p.feedback ? <FeedbackLayer map={p.feedback} /> : null}
          </div>
        )}
      </UiProvider>
    </ErrorBoundary>
  )
}
