/** Laufzeit: Engine, Geräte-Einstellungen, Sprache, Gerätemerker (Chronik, Einstieg). */
import { createI18n, createPrefs, createRuntime, createSeen, createSteps, createTestWallet } from '@engine/react'
import type { UiLabels } from '@engine/ui'
import { TEST_BUDGET_CENTS, TEST_WALLET_ENABLED } from './content/market'
import { game } from './game'
import { stringsDe, type Strings } from './i18n/de'

export const prefs = createPrefs(game.id)
export const i18n = createI18n<Strings>({
  de: stringsDe,
  load: { en: () => import('./i18n/en').then((m) => m.stringsEn) },
  prefs,
  onApply: (s) => {
    if (typeof document === 'undefined') return
    document.title = s.app.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', s.app.description)
  },
})
export const t = i18n.t

export const STORAGE = {
  chronicle: `${game.id}-chronicle-v1`,
  ftue: `${game.id}-ftue-v1`,
  tabs: `${game.id}-tabs-v1`,
  hints: `${game.id}-hints-v1`,
} as const

export const rt = createRuntime(game)
export const chronicleRead = createSeen(STORAGE.chronicle)
export const tabsSeen = createSeen(STORAGE.tabs)
export const hintsSeen = createSeen(STORAGE.hints)
export const ftue = createSteps(STORAGE.ftue)
/** Testgeld (nur Testphase, eigener Schlüssel, nicht im Spielstand). */
export const testWallet = TEST_WALLET_ENABLED ? createTestWallet(game.id, TEST_BUDGET_CENTS, () => rt.clock.now()) : null
if (typeof window !== 'undefined') (window as unknown as { __engine?: unknown }).__engine = rt

type Keyed<T> = Record<string, T>

const NAMESPACES: Record<string, () => Keyed<{ name: string; blurb: string }>> = {
  title: () => ({ ...t.watch.titles, ...t.world.titles, realms: { name: t.realms.tab, blurb: t.realms.opensFirst }, market: t.trade.title }),
  cosmetic: () => t.trade.cosmetics,
  offer: () => t.trade.offers,
  skip: () => t.trade.skips,
  adChoice: () => t.trade.adChoices,
  market: () => t.trade.boosts,
  quest: () => t.watch.quests,
  deed: () => t.watch.deeds,
  trial: () => t.watch.trials,
  fest: () => t.watch.fests,
  festItem: () => t.watch.festItems,
  wheel: () => t.watch.wheel,
  hint: () => t.watch.hints,
  category: () => t.world.categories,
  entry: () => t.world.entries,
  guest: () => t.world.guests,
  decor: () => t.world.decor,
  folio: () => t.world.folio,
  card: () => t.world.cards,
  omen: () => t.world.omens,
  work: () => t.world.works,
}

type Land = { name: string; currency: string; figure: string; intro: string; areas: Record<string, string> }
const land = (id: string): Land | undefined => (t.realms.lands as Record<string, Land>)[id]

/** Inhalts-Namen der Lande: realm.<id>, realmCurrency.<id>, realmFigure.<id>, realmArea.<land>_<bereich>. */
function realmContent(ns: string, rest: string): { name: string; blurb: string } | null {
  if (ns === 'realmArea') {
    const i = rest.indexOf('_')
    const name = land(rest.slice(0, i))?.areas[rest.slice(i + 1)]
    return name ? { name, blurb: '' } : null
  }
  const l = land(rest)
  if (!l) return null
  if (ns === 'realm') return { name: l.name, blurb: l.intro }
  if (ns === 'realmCurrency') return { name: l.currency, blurb: '' }
  if (ns === 'realmFigure') return { name: l.figure, blurb: '' }
  return null
}

export const labels: UiLabels = {
  content: (key) => {
    const i = key.indexOf('.')
    const realm = key.startsWith('realm') ? realmContent(key.slice(0, i), key.slice(i + 1)) : null
    if (realm) return realm
    const table = NAMESPACES[key.slice(0, i)]?.()
    return table?.[key.slice(i + 1)] ?? { name: key, blurb: '' }
  },
  currency: (id) => (t.currencies as Keyed<string>)[id] ?? id,
  producer: (id) => (t.producers as Keyed<{ name: string; blurb: string }>)[id] ?? { name: id, blurb: '' },
  layer: (id) => (t.layers as Keyed<{ name: string; action: string; blurb: string }>)[id] ?? { name: id, action: id, blurb: '' },
  metaItem: (id) => (t.archive as Keyed<{ name: string; blurb: string; effect: (r: number) => string }>)[id] ?? { name: id, blurb: '', effect: () => '' },
  metaBranch: (id) => (t.branches as Keyed<string>)[id] ?? id,
  effect: (key) => {
    if (key.startsWith('meta.')) return `${t.effectLabels.archive}: ${labels.metaItem(key.slice(5)).name}`
    if (key.startsWith('card.')) return labels.content(key).name
    const k = key.replace('effect.', '') as keyof typeof t.effects
    return t.effects[k] ?? key
  },
}
