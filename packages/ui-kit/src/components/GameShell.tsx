import { useEffect, useState, type ReactNode } from 'react'
import {
  currentInstallEnv, readJson, shouldShowInstallGate, shouldShowTestPhase, usePrefs, useRuntimeLoop, writeKey,
  type Distribution, type EngineRuntime, type I18n, type PlaytestLog, type PrefsStore,
} from '@engine/react'
import { UiProvider, type UiLabels } from '../context'
import type { EngineStrings } from '../i18n/de'
import { AppNav, type MenuItem, type NavItem } from './AppNav'
import { MetaShopPanel } from './MetaShop'
import { ErrorBoundary, InstallGate, MultSheet, SaveGuardBanner, TestPhaseNotice, WelcomeBack } from './Overlays'
import { PrestigePanel } from './Prestige'
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
  /** Icons for the built-in tabs (`play`, `prestige`, `shop`) and the menu button (`menu`). */
  navIcons?: Partial<Record<'play' | 'prestige' | 'shop' | 'menu', ReactNode>>
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
  prestigeArt?: (layer: string) => ReactNode
  /** Open a named overlay from outside (FTUE …). */
  openRef?: (open: (id: string) => void) => void
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
  const [flags, setFlags] = useState(() => readJson<{ installSkipped?: boolean; testPhaseOk?: boolean; record?: boolean }>(flagsKey(p.rt), {}))
  const saveFlags = (f: typeof flags) => {
    setFlags(f)
    writeKey(flagsKey(p.rt), JSON.stringify(f))
  }
  useEffect(() => p.openRef?.(setOverlay), [p])
  const playtest = p.playtest
  useEffect(() => playtest?.attach(p.rt), [playtest, p.rt])
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', String(prefs.fontScale))
    document.documentElement.classList.toggle('ek-reduced-motion', prefs.reducedMotion)
  }, [prefs.fontScale, prefs.reducedMotion])
  const env = currentInstallEnv()
  const gate = !flags.installSkipped && shouldShowInstallGate(p.distribution, env)
  const testPhase = !gate && shouldShowTestPhase(p.testPhase, !!flags.testPhaseOk, env)
  const t = p.i18n.t
  const items: NavItem[] = [
    { id: 'play', label: t.nav.play, icon: p.navIcons?.play },
    { id: 'prestige', label: t.nav.prestige, icon: p.navIcons?.prestige },
    { id: 'shop', label: t.nav.shop, icon: p.navIcons?.shop },
    ...(p.tabs ?? []).map((x) => x.item),
  ]
  const menu: MenuItem[] = [
    ...(p.menu ?? []),
    { id: 'save', label: t.save.menu, onSelect: () => setOverlay('save') },
    { id: 'settings', label: t.settings.menu, onSelect: () => setOverlay('settings') },
    { id: 'legal', label: t.legal.menu, onSelect: () => setOverlay('legal') },
  ]
  const views: Record<string, ReactNode> = {
    play: p.play,
    prestige: <PrestigePanel onPerformed={p.onPrestige} art={p.prestigeArt} />,
    shop: <MetaShopPanel branchVisible={p.metaBranchVisible} />,
  }
  for (const x of p.tabs ?? []) views[x.item.id] = x.view
  const close = () => setOverlay(null)
  return (
    <ErrorBoundary strings={() => t}>
      <UiProvider t={t} locale={locale} labels={p.labels} prefs={p.prefs} rt={p.rt} setLocale={(l) => {
          playtest?.record('app.language', { to: l })
          void p.i18n.setLocale(l, { persist: true })
        }} open={setOverlay}>
        {gate ? (
          <InstallGate title={p.title()} art={p.installArt} onSkip={() => saveFlags({ ...flags, installSkipped: true })} />
        ) : (
          <div className={['ek-app', p.className ?? ''].join(' ').trim()} data-locale={locale} data-tab={tab}>
            <SaveGuardBanner />
            {p.hud}
            {p.notice}
            <main className="ek-main" id="main" data-testid={`view-${tab}`}>
              {views[tab] ?? p.play}
            </main>
            <AppNav
              items={items}
              active={tab}
              onChange={(id) => {
                setTab(id)
                p.onTab?.(id)
                playtest?.record('app.tab', { tab: id })
              }}
              menu={menu}
              menuIcon={p.navIcons?.menu}
            />
            {testPhase ? <TestPhaseNotice onDone={(record) => {
                  saveFlags({ ...flags, testPhaseOk: true, record })
                  playtest?.setEnabled(record)
                }} /> : <WelcomeBack art={p.welcomeArt} />}
            <SaveSheet open={overlay === 'save'} onClose={close} prefix={p.backup.prefix} app={p.rt.def.id} keys={p.backup.keys} fileName={p.backup.fileName} />
            <SettingsSheet open={overlay === 'settings'} onClose={close} version={p.version} playtest={playtest} />
            <LegalSheet open={overlay === 'legal'} onClose={close} imprint={p.legal?.imprint?.()} privacyUrl={p.legal?.privacyUrl} />
            <MultSheet open={overlay === 'mult'} onClose={close} />
            {p.overlays}
          </div>
        )}
      </UiProvider>
    </ErrorBoundary>
  )
}
