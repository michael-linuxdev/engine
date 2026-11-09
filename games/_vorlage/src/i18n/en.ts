import { engineEn } from '@engine/ui/i18n/en.ts'
import type { Strings } from './de'

export const stringsEn: Strings = {
  ...engineEn,
  app: { title: 'Template', description: 'Minimal example game of the idle engine' },
  currencies: { coins: 'Coins', meta: 'Points', gems: 'Gems' },
  producers: {
    p1: { name: 'Producer 1', blurb: 'The first, smallest producer.' },
    p2: { name: 'Producer 2', blurb: 'Second step of the ladder.' },
    p3: { name: 'Producer 3', blurb: 'Third step of the ladder.' },
  },
  layers: { reset: { name: 'Restart', action: 'Start over', blurb: 'Resets the run and pays out points.' } },
  metaItems: {
    boost: { name: 'Booster', blurb: 'More yield everywhere.', effect: (r) => `+${r * 10}% yield` },
    discount: { name: 'Discount', blurb: 'Cheaper producers.', effect: (r) => `−${Math.round((1 - 0.97 ** r) * 100)}% cost` },
    head: { name: 'Head start', blurb: 'Starting coins after a restart.', effect: (r) => `+${r * 50} at start` },
  },
  branches: { yield: 'Yield', start: 'Start' },
  play: { burst: 'Boost', goalUnlock: (name) => `Next goal: unlock ${name}`, goalMilestone: (name, at) => `${name} to level ${at}`, goalPrestige: 'Restart available!' },
  effectLabels: { meta: 'Shop' },
}
