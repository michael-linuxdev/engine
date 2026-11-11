import { describe, expect, it } from 'vitest'
import { join } from 'node:path'
import { describeI18nGuards, walk } from '@engine/testing'
import { extraIds, game } from '../src/game'
import { gameDe, stringsDe } from '../src/i18n/de'
import { engineDe } from '@engine/ui'
import { stringsEn } from '../src/i18n/en'
import { i18n, labels, t } from '../src/runtime'
import { CHRONICLE } from '../src/content/chronicle'

const ROOT = join(__dirname, '..', '..', '..')
const files = [...walk(ROOT, 'games/lichtwarte/src'), ...walk(ROOT, 'packages/ui-kit/src')].filter((f) => /\.tsx?$/.test(f)).map((f) => join(ROOT, f))

describeI18nGuards({
  name: 'lichtwarte',
  de: stringsDe,
  en: stringsEn,
  files,
  engine: engineDe,
  gameKeys: Object.keys(gameDe),
  stale: {
    set: (s) => i18n.__setStrings(s),
    restore: () => i18n.__setStrings(stringsDe, 'de'),
    probe: () => [
      ...game.producers.flatMap((p) => [labels.producer(p.id).name, labels.producer(p.id).blurb]),
      ...game.currencies.map((c) => labels.currency(c.id)),
      ...game.prestigeLayers.flatMap((l) => [labels.layer(l.id).name, labels.layer(l.id).action, labels.layer(l.id).blurb]),
      ...game.metaShop.flatMap((m) => [labels.metaItem(m.id).name, labels.metaItem(m.id).blurb, labels.metaItem(m.id).effect(3)]),
      ...['glow', 'watch', 'setout'].map((b) => labels.metaBranch(b)),
      ...CHRONICLE.flatMap((e) => [t.chronicle.entries[e.id].title, t.chronicle.entries[e.id].body]),
      labels.effect('meta.oldLantern'),
      t.app.title,
    ],
  },
})

// Jede Inhalts-ID, die ein Fenster anzeigt, braucht einen Namen; sonst steht der rohe Schlüssel im Spiel.
describe('Inhalts-Namen', () => {
  const NS: Record<string, string> = {
    quests: 'quest', deeds: 'deed', trials: 'trial', fests: 'fest', festItems: 'festItem', wheel: 'wheel',
    collection: 'entry', guests: 'guest', decor: 'decor', folio: 'folio', constellations: 'card', omens: 'omen',
    greatWorks: 'work', realms: 'realm', cosmetics: 'cosmetic', offers: 'offer', skips: 'skip', adChoices: 'adChoice',
  }
  const ids = extraIds as Record<string, readonly string[]>
  for (const [group, ns] of Object.entries(NS)) {
    it(`${group}: alle Namen vorhanden (de + en)`, () => {
      for (const strings of [stringsDe, stringsEn]) {
        i18n.__setStrings(strings)
        const missing = [...new Set(ids[group])].filter((id) => labels.content(`${ns}.${id}`).name === `${ns}.${id}`)
        expect(missing).toEqual([])
      }
      i18n.__setStrings(stringsDe, 'de')
    })
  }
})
