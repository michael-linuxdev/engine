/** Wacht: Wachrunde, Aufträge, laufende Ereignisse, Lichterfest, Taten. Die Prüfungen stehen im Mondwende-Tab. */
import { isFeatureOpen } from '@engine/core'
import { useEngine } from '@engine/react'
import { AchievementsCard, DailyCard, FestCard, FlashCard, QuestsCard, useUi, WeekendCard, WeeklyCard } from '@engine/ui'
import { DAILY, DEEDS, FESTIVALS, QUESTS, WEEKLY } from '../content/live'

export function WatchView() {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  return (
    <section className="ek-panel" aria-label={ui.labels.content('title.daily').name} data-testid="watch-view">
      <DailyCard cfg={DAILY} />
      <QuestsCard cfg={QUESTS} />
      <WeeklyCard cfg={WEEKLY} />
      {isFeatureOpen(world, 'events') ? (
        <>
          <WeekendCard />
          <FlashCard />
        </>
      ) : null}
      {isFeatureOpen(world, 'festivals') ? <FestCard cfg={FESTIVALS} /> : null}
      <AchievementsCard list={DEEDS} />
    </section>
  )
}
