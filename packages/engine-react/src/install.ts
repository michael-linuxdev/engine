/**
 * Web vs. store build. On phones/tablets in the browser the web build shows
 * "Install the app first" with step-by-step instructions for the detected
 * browser (the game is meant to run installed). "Continue in the browser"
 * holds for six hours. Desktop browsers and the installed app play directly.
 * `?installGate=1` forces it (tests), `?installGate=0` disables it.
 */
export type Distribution = 'web' | 'store'

export interface InstallEnv {
  ua: string
  maxTouchPoints: number
  standalone: boolean
  search: string
  /** Automated browsers (tests, store screenshots) see the gate only with `?installGate=1`. */
  webdriver?: boolean
}

export type GateOs = 'ios' | 'android' | 'desktop'
export type GateBrowser = 'safari' | 'chrome' | 'firefox' | 'edge' | 'samsung' | 'opera' | 'inapp' | 'other'

/** "Continue in the browser" holds for six hours, then the gate returns. */
export const INSTALL_SKIP_MS = 6 * 3600_000

/** Operating system and browser, to show the matching step-by-step instructions. */
export function detectPlatform(ua: string, maxTouchPoints = 0): { os: GateOs; browser: GateBrowser } {
  const ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && maxTouchPoints > 1)
  const android = /Android/.test(ua)
  const inapp = /Instagram|FBAN|FBAV|Line\/|Telegram|WhatsApp|TikTok|; wv\)/i.test(ua)
  let browser: GateBrowser = 'other'
  if (inapp) browser = 'inapp'
  else if (ios) browser = /CriOS/.test(ua) ? 'chrome' : /FxiOS/.test(ua) ? 'firefox' : /EdgiOS/.test(ua) ? 'edge' : /Safari/.test(ua) ? 'safari' : 'other'
  else if (android) browser = /SamsungBrowser/.test(ua) ? 'samsung' : /Firefox/.test(ua) ? 'firefox' : /EdgA/.test(ua) ? 'edge' : /OPR|Opera/.test(ua) ? 'opera' : /Chrome/.test(ua) ? 'chrome' : 'other'
  return { os: ios ? 'ios' : android ? 'android' : 'desktop', browser }
}

export const INSTALL_STEP_KEYS = ['iosSafari', 'iosChrome', 'iosFirefox', 'iosEdge', 'iosOther', 'androidChrome', 'androidSamsung', 'androidFirefox', 'androidEdge', 'androidOpera', 'androidOther', 'inapp'] as const
export type InstallStepsKey = (typeof INSTALL_STEP_KEYS)[number]

/** Which instruction list fits this platform. */
export function installStepsKey(os: GateOs, browser: GateBrowser): InstallStepsKey {
  if (browser === 'inapp') return 'inapp'
  if (os === 'ios') return browser === 'safari' ? 'iosSafari' : browser === 'chrome' ? 'iosChrome' : browser === 'firefox' ? 'iosFirefox' : browser === 'edge' ? 'iosEdge' : 'iosOther'
  return browser === 'chrome' ? 'androidChrome' : browser === 'samsung' ? 'androidSamsung' : browser === 'firefox' ? 'androidFirefox' : browser === 'edge' ? 'androidEdge' : browser === 'opera' ? 'androidOpera' : 'androidOther'
}

/** Skipped less than six hours ago? */
export function installSkippedRecently(skippedAt: number | undefined, now: number): boolean {
  return typeof skippedAt === 'number' && skippedAt > 0 && now - skippedAt < INSTALL_SKIP_MS
}

export function isMobileUa(ua: string, maxTouchPoints = 0): boolean {
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) return true
  return /Macintosh/.test(ua) && maxTouchPoints > 1
}

export function shouldShowInstallGate(distribution: Distribution, env: InstallEnv): boolean {
  const q = new URLSearchParams(env.search).get('installGate')
  if (q === '0') return false
  if (q === '1') return true
  if (distribution === 'store' || env.standalone || env.webdriver) return false
  return isMobileUa(env.ua, env.maxTouchPoints)
}

export function currentInstallEnv(): InstallEnv {
  const standalone =
    (typeof matchMedia !== 'undefined' && matchMedia('(display-mode: standalone)').matches) ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  return { ua: navigator.userAgent, maxTouchPoints: navigator.maxTouchPoints ?? 0, standalone, search: location.search, webdriver: navigator.webdriver === true }
}

export function isStandalone(): boolean {
  return currentInstallEnv().standalone
}

/** Test-phase notice: shown once in the installed app (or with ?testPhase=1). */
export function shouldShowTestPhase(testPhase: boolean, acknowledged: boolean, env: InstallEnv): boolean {
  const q = new URLSearchParams(env.search).get('testPhase')
  if (q === '1') return !acknowledged
  if (q === '0') return false
  return testPhase && env.standalone && !acknowledged
}
