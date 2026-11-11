/**
 * Was im Tal auf einen Tipp wartet: fertige Aufträge, die Wachrunde, der Wochenplan, das Tagesgeschenk, ein
 * zurückgekehrter Greif, ein fertiger Kessel, neue Funde und das Ergebnis des Sternenrads. Jede Marke
 * erscheint nur, solange etwas wartet, und erledigt es mit einem Tipp (oder führt hin, wo es eine Wahl gibt).
 * Die Texte sind kurz: Die Farbe der Marke sagt, dass sich etwas einsammeln lässt.
 * Im ersten Testlauf wurden an neun Besuchen eine Wachrunde und drei Aufträge eingesammelt.
 */
import {
  COLLECTIONS_ID, COMBINE_ID, DAILY_ID, dailyStatus, giftReady, isFeatureOpen, localDayKey, MARKET_ID, QUESTS_ID, voyageBack, VOYAGES_ID, WEEKLY_ID, weeklyDone, WHEEL_ID,
  type CollectionsState, type CombineState, type DailyState, type MarketState, type QuestsState, type VoyagesState, type WeeklyPlanState, type WheelState, type WorldView,
} from '@engine/core'
import type { Pill } from '@engine/ui'
import { DAILY, WEEKLY } from '../content/live'
import { COLLECTION } from '../content/world'
import { findsSeen, labels, rt, t } from '../runtime'

export interface WaitingActs {
  /** Zur Sammlung (neue Funde, Kessel). */
  openWorld: () => void
  /** Zeigt, was das Sternenrad gerade bewirkt. */
  openWheel: () => void
}

/** Funde, die noch niemand in der Sammlung angesehen hat. */
export function newFinds(w: WorldView): string[] {
  const found = w.get<CollectionsState | undefined>(COLLECTIONS_ID)?.found ?? {}
  return COLLECTION.entries.filter((e) => (found[e.id] ?? 0) > 0 && !findsSeen.has(e.id)).map((e) => e.id)
}

export function waitingPills(w: WorldView, acts: WaitingActs): Pill[] {
  const out: Pill[] = []
  const now = rt.clock.now()
  const claim = (id: string, text: string, onOpen: () => void): Pill => ({ id, text, onOpen, tone: 'claim' })

  if (isFeatureOpen(w, 'watch')) {
    const q = w.get<QuestsState | undefined>(QUESTS_ID)
    const ready = q?.active.filter((x) => !x.claimed && x.progress >= x.goal) ?? []
    if (ready.length) {
      out.push(claim('quests', ready.length > 1 ? t.waiting.quests(String(ready.length)) : t.waiting.quest, () => ready.forEach((x) => rt.dispatch(QUESTS_ID, 'claim', { id: x.id }))))
    }
    const d = w.get<DailyState | undefined>(DAILY_ID)
    if (d && dailyStatus(d, localDayKey(rt.clock), DAILY).canClaim) out.push(claim('daily', t.waiting.daily, () => rt.dispatch(DAILY_ID, 'claim')))
    const wk = w.get<WeeklyPlanState | undefined>(WEEKLY_ID)
    if (wk && !wk.claimed && weeklyDone(wk, WEEKLY)) out.push(claim('weekly', t.waiting.weekly, () => rt.dispatch(WEEKLY_ID, 'claim')))
  }
  const v = w.get<VoyagesState | undefined>(VOYAGES_ID)
  if (isFeatureOpen(w, 'voyages') && v?.active && voyageBack(v, now)) out.push(claim('voyage', t.waiting.voyage, () => rt.dispatch(VOYAGES_ID, 'collect')))
  const m = w.get<MarketState | undefined>(MARKET_ID)
  if (m && giftReady(m, rt.clock)) out.push(claim('gift', t.waiting.gift, () => rt.dispatch(MARKET_ID, 'claimGift')))
  const brew = w.get<CombineState | undefined>(COMBINE_ID)
  if (isFeatureOpen(w, 'alchemy') && brew?.recipe && brew.until <= now) out.push({ id: 'brew', text: t.soon.brewDone, onOpen: acts.openWorld })

  const finds = newFinds(w)
  if (finds.length) out.push({ id: 'finds', text: finds.length > 1 ? t.waiting.finds(String(finds.length)) : t.waiting.find(labels.content(`entry.${finds[finds.length - 1]}`).name), onOpen: acts.openWorld })

  const wheel = isFeatureOpen(w, 'wheel') ? w.get<WheelState | undefined>(WHEEL_ID) : undefined
  if (wheel?.buff) out.push({ id: 'wheel', text: t.waiting.wheel(labels.content(`wheel.${wheel.buff}`).name), onOpen: acts.openWheel })
  return out
}
