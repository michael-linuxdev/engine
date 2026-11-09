/** Wacht-Tab: Wachrunde, Aufträge, laufende Ereignisse, Lichterfest, Prüfungen, Taten. */
import { isFeatureOpen } from '@engine/core'
import { useEngine } from '@engine/react'
import { AchievementsCard, ChallengesCard, DailyCard, FestCard, FlashCard, QuestsCard, useUi, WeekendCard } from '@engine/ui'
import { DAILY, DEEDS, FESTIVALS, TRIALS } from '../content/live'

export function WatchView() {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  return (
    <section className="ek-panel" aria-label={ui.labels.content('title.daily').name} data-testid="watch-view">
      <DailyCard cfg={DAILY} />
      <QuestsCard />
      {isFeatureOpen(world, 'events') ? (
        <>
          <WeekendCard />
          <FlashCard />
        </>
      ) : null}
      {isFeatureOpen(world, 'festivals') ? <FestCard cfg={FESTIVALS} /> : null}
      {isFeatureOpen(world, 'trials') ? <ChallengesCard cfg={TRIALS} /> : null}
      <AchievementsCard list={DEEDS} />
    </section>
  )
}
