/**
 * Sichtbare Rückmeldung: Welches Engine-Ereignis welche Meldung, aufsteigende Zahl oder welchen Flug
 * zur Kopfzeile auslöst (Lückenliste 4.1 bis 4.3). Der Ton dazu steht in audio/sfx.ts.
 */
import type { EngineEvent } from '@engine/core'
import type { FeedbackItem, FeedbackMap } from '@engine/ui'
import { OMENS } from '../content/world'
import { CURRENCY, game } from '../game'
import { t } from '../runtime'

const toast = (text: string): FeedbackItem => ({ kind: 'toast', text })
const str = (v: unknown): string => (typeof v === 'string' ? v : '')
const num = (v: unknown): number => (typeof v === 'number' ? v : 0)

export const feedback: FeedbackMap = (e: EngineEvent, ui) => {
  const name = (key: string) => ui.labels.content(key).name
  const glimmer = ui.labels.currency(CURRENCY.glimmer)
  switch (e.type) {
    case 'producer.bought': {
      if (e.source !== 'manual') return null
      const level = num(e.level)
      const out: FeedbackItem[] = [{ kind: 'float', text: t.fx.spent(ui.fmt(num(e.cost))), anchor: 'hud', tone: 'spend' }]
      // Meilenstein in diesem Kauf überschritten: Das ist der Moment, der gefeiert wird
      const m = game.balance.milestones
      const crossed = m.levels.filter((l) => l > level - num(e.count) && l <= level).pop()
      if (crossed) out.push(toast(t.fx.milestone(ui.labels.producer(str(e.id)).name, ui.fmt(crossed), ui.fmt(m.factor))))
      return out
    }
    case 'burst.used':
      return { kind: 'fly', anchor: 'burst' }
    case 'surprise.found':
      // Der sichere Fund (jede fünfte Stufe) kommt oft: nur Zahl und Flug. Der seltene Glücksfund bekommt die Meldung.
      return e.kind === 'lucky'
        ? [toast(t.fx.surprise(ui.fmt(num(e.amount)), glimmer)), { kind: 'fly', anchor: 'map' }]
        : [{ kind: 'float', text: t.fx.gained(ui.fmt(num(e.amount)), glimmer), anchor: 'hud' }, { kind: 'fly', anchor: 'map' }]
    case 'offline.claimed':
      return [toast(t.fx.offline(ui.fmt(num(e.amount)), glimmer)), { kind: 'fly' }]
    case 'currency.gained':
      // Nebenwährungen: Jede Gutschrift steigt als Zahl an der Kopfzeile auf
      return { kind: 'float', text: t.fx.gained(ui.fmt(num(e.amount)), ui.labels.currency(str(e.currency))), anchor: 'hud' }
    case 'level.up':
      return toast(t.fx.rank(ui.fmt(num(e.level))))
    case 'daily.claimed':
      return toast(t.fx.daily)
    case 'quest.claimed':
      return toast(t.fx.quest(name(`quest.${str(e.id)}`)))
    case 'achievement.done':
      return toast(t.fx.deed(name(`deed.${str(e.id)}`)))
    case 'challenge.done':
      return toast(t.fx.trial(name(`trial.${str(e.id)}`)))
    case 'collection.found':
      return toast(t.fx.found(name(`entry.${str(e.id)}`)))
    case 'region.mastered':
      return toast(t.fx.star(name(`realm.${str(e.region)}`), ui.fmt(num(e.stars))))
    case 'fest.bought':
      return toast(t.fx.bought(name(`festItem.${str(e.item)}`)))
    case 'decor.bought':
      return toast(t.fx.bought(name(`decor.${str(e.id)}`)))
    case 'choice.made': {
      const c = OMENS.list.find((x) => x.id === e.id)
      if (!c) return null
      if (e.option === 'safe') return toast(t.fx.omenSafe(ui.fmt(c.safe.buff.mult)))
      return toast(e.win ? t.fx.omenWin(ui.fmt(c.risk.win.mult)) : t.fx.omenLose(ui.fmt(c.risk.lose.mult)))
    }
    case 'combine.done':
      return null // die Meldung kommt mit collection.found (Quelle: Kessel)
    case 'combine.fizzle':
      return toast(t.fx.brewFizzle)
    case 'market.gift':
      return toast(t.fx.gift)
    case 'market.boost':
    case 'market.circle':
      return toast(t.fx.boost)
    case 'market.skip':
      return [toast(t.fx.skip(ui.fmt(num(e.amount)), glimmer)), { kind: 'fly' }]
    case 'market.cosmetic':
      return toast(t.fx.style(name(`cosmetic.${str(e.id)}`)))
    case 'market.pass':
      return toast(t.fx.pass)
    case 'weekend.claimed':
    case 'flash.claimed':
      return toast(t.fx.window)
    case 'weekly.claimed':
      return toast(t.fx.weekly)
    case 'wheel.spun':
      return toast(t.fx.wheel(name(`wheel.${str(e.segment)}`)))
    default:
      return null
  }
}
