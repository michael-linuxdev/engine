import { describe, expect, it } from 'vitest'
import { detectPlatform, INSTALL_SKIP_MS, INSTALL_STEP_KEYS, installSkippedRecently, installStepsKey, shouldShowInstallGate, shouldShowTestPhase, type InstallEnv } from '../src/install'

const IPHONE_SAFARI = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1'
const IPHONE_CHROME = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/124.0.0.0 Mobile/15E148 Safari/604.1'
const IPAD_DESKTOP_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15'
const ANDROID_CHROME = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
const ANDROID_SAMSUNG = 'Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36'
const ANDROID_FIREFOX = 'Mozilla/5.0 (Android 14; Mobile; rv:125.0) Gecko/125.0 Firefox/125.0'
const ANDROID_WEBVIEW = 'Mozilla/5.0 (Linux; Android 14; Pixel 8; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.0.0 Mobile Safari/537.36'
const DESKTOP = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

const env = (o: Partial<InstallEnv>): InstallEnv => ({ ua: ANDROID_CHROME, maxTouchPoints: 5, standalone: false, search: '', ...o })

describe('install gate', () => {
  it('detects operating system and browser', () => {
    expect(detectPlatform(IPHONE_SAFARI, 5)).toEqual({ os: 'ios', browser: 'safari' })
    expect(detectPlatform(IPHONE_CHROME, 5)).toEqual({ os: 'ios', browser: 'chrome' })
    expect(detectPlatform(IPAD_DESKTOP_UA, 5)).toEqual({ os: 'ios', browser: 'safari' })
    expect(detectPlatform(IPAD_DESKTOP_UA, 0).os).toBe('desktop')
    expect(detectPlatform(ANDROID_CHROME, 5)).toEqual({ os: 'android', browser: 'chrome' })
    expect(detectPlatform(ANDROID_SAMSUNG, 5)).toEqual({ os: 'android', browser: 'samsung' })
    expect(detectPlatform(ANDROID_FIREFOX, 5)).toEqual({ os: 'android', browser: 'firefox' })
    expect(detectPlatform(ANDROID_WEBVIEW, 5).browser).toBe('inapp')
    expect(detectPlatform(DESKTOP, 0)).toEqual({ os: 'desktop', browser: 'other' })
  })
  it('every platform maps to a known instruction list', () => {
    const keys = new Set<string>(INSTALL_STEP_KEYS)
    for (const os of ['ios', 'android'] as const)
      for (const b of ['safari', 'chrome', 'firefox', 'edge', 'samsung', 'opera', 'inapp', 'other'] as const) expect(keys.has(installStepsKey(os, b)), `${os}/${b}`).toBe(true)
    expect(installStepsKey('ios', 'safari')).toBe('iosSafari')
    expect(installStepsKey('ios', 'samsung')).toBe('iosOther')
    expect(installStepsKey('android', 'safari')).toBe('androidOther')
    expect(installStepsKey('android', 'inapp')).toBe('inapp')
  })
  it('shows on phones in the browser only; never installed, on a desktop, in the store build or for automated browsers', () => {
    expect(shouldShowInstallGate('web', env({}))).toBe(true)
    expect(shouldShowInstallGate('web', env({ standalone: true }))).toBe(false)
    expect(shouldShowInstallGate('store', env({}))).toBe(false)
    expect(shouldShowInstallGate('web', env({ ua: DESKTOP, maxTouchPoints: 0 }))).toBe(false)
    expect(shouldShowInstallGate('web', env({ webdriver: true }))).toBe(false)
    expect(shouldShowInstallGate('web', env({ webdriver: true, search: '?installGate=1' }))).toBe(true)
    expect(shouldShowInstallGate('web', env({ search: '?installGate=0' }))).toBe(false)
  })
  it('"continue in the browser" holds for six hours', () => {
    const t = 1_800_000_000_000
    expect(installSkippedRecently(undefined, t)).toBe(false)
    expect(installSkippedRecently(t, t + INSTALL_SKIP_MS - 1)).toBe(true)
    expect(installSkippedRecently(t, t + INSTALL_SKIP_MS)).toBe(false)
  })
  it('test-phase notice: once, in the installed app', () => {
    expect(shouldShowTestPhase(true, false, env({ standalone: true }))).toBe(true)
    expect(shouldShowTestPhase(true, true, env({ standalone: true }))).toBe(false)
    expect(shouldShowTestPhase(true, false, env({}))).toBe(false)
    expect(shouldShowTestPhase(false, false, env({ standalone: true }))).toBe(false)
  })
})
