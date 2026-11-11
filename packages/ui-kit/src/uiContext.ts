/**
 * UI context: engine strings (live proxy), number locale, the game's labels
 * for its content ids and device prefs. Components never import game code.
 */
import { createContext } from 'react'
import type { NumberLocale } from '@engine/core'
import type { EngineRuntime, Locale, PrefsStore } from '@engine/react'
import type { EngineStrings } from './i18n/de'

export interface UiLabels {
  currency(id: string): string
  producer(id: string): { name: string; blurb: string }
  /** `keeps` / `loses`: short lists of what a run of this layer leaves and takes (optional). */
  layer(id: string): { name: string; action: string; blurb: string; keeps?: readonly string[]; loses?: readonly string[] }
  metaItem(id: string): { name: string; blurb: string; effect(rank: number): string }
  metaBranch(id: string): string
  /** Effect breakdown label for a labelKey (fallback: the key). */
  effect(labelKey: string): string
  /** Names of further content ids, namespaced: `quest.<id>`, `deed.<id>`, `trial.<id>`, `fest.<id>`, `festItem.<id>`, `wheel.<id>`, `title.<system>`, `hint.<id>` … */
  content(key: string): { name: string; blurb: string }
}

export interface UiValue {
  t: EngineStrings
  locale: Locale
  nl: NumberLocale
  labels: UiLabels
  prefs: PrefsStore
  rt: EngineRuntime
  fmt(n: number): string
  /** Duration in ms → short text. */
  duration(ms: number): string
  setLocale(l: Locale): void
  /** Opens a named overlay of the app shell (save, settings, mult …). */
  open(id: string): void
}

export const UiContext = createContext<UiValue | null>(null)

