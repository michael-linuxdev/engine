import { join } from 'node:path'
import { describeI18nGuards, walk } from '@engine/testing'
import { gameDe, stringsDe } from '../src/i18n/de'
import { engineDe } from '@engine/ui'
import { stringsEn } from '../src/i18n/en'
import { game } from '../src/game'
import { i18n, labels } from '../src/runtime'

const ROOT = join(__dirname, '..', '..', '..')
const files = [...walk(ROOT, 'games/_vorlage/src'), ...walk(ROOT, 'packages/ui-kit/src')].filter((f) => /\.tsx?$/.test(f)).map((f) => join(ROOT, f))

describeI18nGuards({
  name: 'vorlage',
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
      ...game.prestigeLayers.flatMap((l) => Object.values(labels.layer(l.id))),
      ...game.metaShop.flatMap((m) => [labels.metaItem(m.id).name, labels.metaItem(m.id).effect(2)]),
      labels.effect('effect.milestones'),
    ],
  },
})
