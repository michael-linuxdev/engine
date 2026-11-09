/**
 * Bereich unter dem HUD: höchstens EIN Hinweis gleichzeitig (Handy-Platz).
 * Reihenfolge: Einstieg → Talgast → Omen → Randnotiz der Chronik. Ereignis-Pillen sind klein und immer da.
 */
import type { ReactNode } from 'react'
import { CHOICES_ID, isFeatureOpen, VISITORS_ID, type ChoiceState, type VisitorsState } from '@engine/core'
import { pickHint, useEngine, useStore } from '@engine/react'
import { ChoiceNotice, EventPills, HintBubble, useUi, VisitorNotice } from '@engine/ui'
import { HINTS } from '../content/live'
import { hintsSeen, t } from '../runtime'

export function Notices({ coach, onEvents }: { coach: ReactNode; onEvents: () => void }) {
  const ui = useUi()
  const { world, state } = useEngine(ui.rt)
  useStore(hintsSeen)
  const v = world.get<VisitorsState>(VISITORS_ID)
  const visitor = !!v?.current && v.until > state.core.lastSeen
  const omen = isFeatureOpen(world, 'omens') && !!world.get<ChoiceState>(CHOICES_ID)?.pending
  let notice: ReactNode = null
  if (coach) notice = coach
  else if (visitor) notice = <VisitorNotice name={(id) => t.world.visitorHere(ui.labels.content(`guest.${id}`).name)} />
  else if (omen) notice = <ChoiceNotice option={(id, o) => t.world.omens[id as keyof typeof t.world.omens][o]} />
  else {
    const hint = pickHint(HINTS, (id) => hintsSeen.has(id), world)
    const text = hint ? ui.labels.content(`hint.${hint.id}`) : null
    notice = <HintBubble hint={text ? { title: text.name, body: text.blurb } : null} onClose={() => hint && hintsSeen.add(hint.id)} />
  }
  return (
    <>
      <EventPills onOpen={onEvents} />
      {notice}
    </>
  )
}
