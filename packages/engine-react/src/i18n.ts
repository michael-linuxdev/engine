/**
 * Generic i18n runtime (ADR 0007). `t` is a proxy onto the active locale:
 * every read at render time sees the current language, so data modules must
 * never copy a text out of `t` at import time (getter or function instead).
 * German ships in the start chunk; English is loaded on demand.
 */
import { useSyncExternalStore } from 'react'
import type { PrefsStore } from './prefs'

export const LOCALES = ['de', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export interface I18n<S extends object> {
  t: S
  getLocale(): Locale
  setLocale(l: Locale, opts?: { persist?: boolean }): Promise<void>
  initLocale(): Promise<void>
  useLocale(): Locale
  detectLocale(): Locale
  /** Tests only: swap in arbitrary strings (e.g. a pseudo locale). */
  __setStrings(s: S, l?: Locale): void
}

export function browserLocale(langs: readonly string[] | undefined): Locale {
  const first = langs?.find((l) => typeof l === 'string' && l.length > 0)
  return first?.toLowerCase().startsWith('de') ? 'de' : 'en'
}

export function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (LOCALES as readonly string[]).includes(v)
}

export function createI18n<S extends object>(opts: {
  de: S
  load: { en: () => Promise<S> }
  prefs?: PrefsStore
  /** Called after every switch (document title, meta description …). */
  onApply?: (s: S, l: Locale) => void
}): I18n<S> {
  let locale: Locale = 'de'
  let current: S = opts.de
  const loaded: Partial<Record<Locale, S>> = { de: opts.de }
  const listeners = new Set<() => void>()

  const t = new Proxy({} as S, {
    get: (_, key) => Reflect.get(current, key),
    has: (_, key) => Reflect.has(current, key),
    ownKeys: () => Reflect.ownKeys(current),
    getOwnPropertyDescriptor: (_, key) => {
      const d = Reflect.getOwnPropertyDescriptor(current, key)
      return d ? { ...d, configurable: true } : undefined
    },
  })

  const apply = (l: Locale, s: S) => {
    locale = l
    current = s
    if (typeof document !== 'undefined') document.documentElement.lang = l
    opts.onApply?.(s, l)
    for (const fn of listeners) fn()
  }

  const detectLocale = (): Locale => {
    try {
      const q = new URLSearchParams(location.search).get('lang')
      if (isLocale(q)) return q
    } catch {
      /* no location */
    }
    const stored = opts.prefs?.get().lang
    if (isLocale(stored)) return stored
    try {
      return browserLocale(navigator.languages?.length ? navigator.languages : [navigator.language])
    } catch {
      return 'de'
    }
  }

  const load = async (l: Locale): Promise<S> => {
    const have = loaded[l]
    if (have) return have
    const s = await opts.load.en()
    loaded.en = s
    return s
  }

  const subscribe = (fn: () => void) => {
    listeners.add(fn)
    return () => listeners.delete(fn)
  }
  const getLocale = () => locale

  return {
    t,
    getLocale,
    detectLocale,
    setLocale: async (l, o = {}) => {
      const s = await load(l)
      if (o.persist) opts.prefs?.update({ lang: l })
      apply(l, s)
    },
    initLocale: async () => {
      const l = detectLocale()
      try {
        apply(l, await load(l))
      } catch {
        apply('de', opts.de)
      }
    },
    useLocale: () => useSyncExternalStore(subscribe, getLocale, getLocale),
    __setStrings: (s, l = locale) => apply(l, s),
  }
}
