/**
 * Device preferences — stored separately from the save (never in the game
 * state): language, sound, ambience, reduced motion, font size, number style.
 */
import { createStore, useStore, type Store } from './store'
import { readJson, writeKey } from './storage'

export interface Prefs {
  lang: 'de' | 'en' | null
  sound: boolean
  ambient: boolean
  reducedMotion: boolean
  fontScale: 1 | 1.15 | 1.3
  numberStyle: 'compact' | 'scientific'
}

export const DEFAULT_PREFS: Prefs = { lang: null, sound: true, ambient: false, reducedMotion: false, fontScale: 1, numberStyle: 'compact' }

export function parsePrefs(raw: unknown): Prefs {
  const r = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>
  return {
    lang: r.lang === 'de' || r.lang === 'en' ? r.lang : null,
    sound: typeof r.sound === 'boolean' ? r.sound : DEFAULT_PREFS.sound,
    ambient: typeof r.ambient === 'boolean' ? r.ambient : DEFAULT_PREFS.ambient,
    reducedMotion: typeof r.reducedMotion === 'boolean' ? r.reducedMotion : DEFAULT_PREFS.reducedMotion,
    fontScale: r.fontScale === 1.15 || r.fontScale === 1.3 ? r.fontScale : 1,
    numberStyle: r.numberStyle === 'scientific' ? 'scientific' : 'compact',
  }
}

export interface PrefsStore extends Store<Prefs> {
  key: string
  update(patch: Partial<Prefs>): void
}

export function createPrefs(gameId: string): PrefsStore {
  const key = `${gameId}-prefs-v1`
  const store = createStore(parsePrefs(readJson(key, {})))
  return {
    ...store,
    key,
    update: (patch) => {
      store.set((p) => ({ ...p, ...patch }))
      writeKey(key, JSON.stringify(store.get()))
    },
  }
}

export function usePrefs(p: PrefsStore): Prefs {
  return useStore(p)
}
