/**
 * Web vs. store build. On phones/tablets in the browser the web build shows
 * "Install the app first" (the game is meant to run installed). Desktop
 * browsers and the installed app play directly. `?installGate=1` forces it
 * (tests), `?installGate=0` disables it.
 */
export type Distribution = 'web' | 'store'

export interface InstallEnv {
  ua: string
  maxTouchPoints: number
  standalone: boolean
  search: string
}

export function isMobileUa(ua: string, maxTouchPoints = 0): boolean {
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) return true
  return /Macintosh/.test(ua) && maxTouchPoints > 1
}

export function shouldShowInstallGate(distribution: Distribution, env: InstallEnv): boolean {
  const q = new URLSearchParams(env.search).get('installGate')
  if (q === '0') return false
  if (q === '1') return true
  if (distribution === 'store' || env.standalone) return false
  return isMobileUa(env.ua, env.maxTouchPoints)
}

export function currentInstallEnv(): InstallEnv {
  const standalone =
    (typeof matchMedia !== 'undefined' && matchMedia('(display-mode: standalone)').matches) ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  return { ua: navigator.userAgent, maxTouchPoints: navigator.maxTouchPoints ?? 0, standalone, search: location.search }
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
