/** Laufzeit der Vorlage: Engine, Prefs, i18n (einmal je Seite). */
import { createI18n, createPrefs, createRuntime } from '@engine/react'
import type { UiLabels } from '@engine/ui'
import { game } from './game'
import { stringsDe, type Strings } from './i18n/de'

export const prefs = createPrefs(game.id)
export const i18n = createI18n<Strings>({
  de: stringsDe,
  load: { en: () => import('./i18n/en').then((m) => m.stringsEn) },
  prefs,
  onApply: (s) => {
    if (typeof document !== 'undefined') document.title = s.app.title
  },
})
export const t = i18n.t
export const rt = createRuntime(game)
// Für E2E-Tests und Fehlersuche
;if (typeof window !== 'undefined') (window as unknown as { __engine?: unknown }).__engine = rt

type Keyed<T> = Record<string, T>

export const labels: UiLabels = {
  content: (key) => ({ name: key, blurb: '' }),
  currency: (id) => (t.currencies as Keyed<string>)[id] ?? id,
  producer: (id) => (t.producers as Keyed<{ name: string; blurb: string }>)[id] ?? { name: id, blurb: '' },
  layer: (id) => (t.layers as Keyed<{ name: string; action: string; blurb: string }>)[id] ?? { name: id, action: id, blurb: '' },
  metaItem: (id) => (t.metaItems as Keyed<{ name: string; blurb: string; effect: (r: number) => string }>)[id] ?? { name: id, blurb: '', effect: () => '' },
  metaBranch: (id) => (t.branches as Keyed<string>)[id] ?? id,
  effect: (key) => {
    if (key.startsWith('meta.')) return labels.metaItem(key.slice(5)).name
    const k = key.replace('effect.', '') as keyof typeof t.effects
    return t.effects[k] ?? key
  },
}
