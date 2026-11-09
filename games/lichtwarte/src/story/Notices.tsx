/** Bereich unter dem HUD: Einstiegs-Hinweis, Ereignis-Pillen, einmalige Randnotizen der Chronik. */
import type { ReactNode } from 'react'
import { useEngine, useStore, pickHint } from '@engine/react'
import { EventPills, HintBubble, useUi } from '@engine/ui'
import { HINTS } from '../content/live'
import { hintsSeen } from '../runtime'

export function Notices({ coach, onEvents }: { coach: ReactNode; onEvents: () => void }) {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  useStore(hintsSeen)
  const hint = coach ? null : pickHint(HINTS, (id) => hintsSeen.has(id), world)
  const text = hint ? ui.labels.content(`hint.${hint.id}`) : null
  return (
    <>
      {coach}
      <EventPills onOpen={onEvents} />
      <HintBubble hint={text ? { title: text.name, body: text.blurb } : null} onClose={() => hint && hintsSeen.add(hint.id)} />
    </>
  )
}
