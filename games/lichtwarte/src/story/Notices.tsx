/**
 * Bereich unter dem HUD: höchstens EIN Hinweis gleichzeitig (Handy-Platz).
 * Reihenfolge: Einstieg → Omen → Randnotiz der Chronik. Der Talgast hat keine Meldung: Er steht auf der Karte und wird dort angetippt. Ereignis-Pillen sind klein und immer da.
 */
import { useState, type ReactNode } from 'react'
import { CHOICES_ID, isFeatureOpen, type ChoiceState } from '@engine/core'
import { pickHint, useEngine, useStore } from '@engine/react'
import { ChoiceNotice, EventPills, HintBubble, useUi } from '@engine/ui'
import { HINTS } from '../content/live'
import { hintsSeen, t } from '../runtime'

/**
 * `compact`: Omen und Randnotizen erscheinen als kleine Marke und klappen erst beim Antippen auf.
 * So bleibt die Karte frei, und auf den anderen Tabs schiebt kein Hinweis den Inhalt nach unten.
 */
export function Notices({ coach, onEvents, compact = false }: { coach: ReactNode; onEvents: () => void; compact?: boolean }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  useStore(hintsSeen)
  const omen = isFeatureOpen(world, 'omens') && !!world.get<ChoiceState>(CHOICES_ID)?.pending
  let notice: ReactNode = null
  if (coach) notice = coach
  else if (omen && compact && expanded !== 'omen') notice = <Chip id="omen" text={`${ui.labels.content('title.omens').name}: ${ui.labels.content(`omen.${world.get<ChoiceState>(CHOICES_ID)?.pending}`).name}`} onOpen={setExpanded} />
  else if (omen) notice = <ChoiceNotice option={(id, o) => t.world.omens[id as keyof typeof t.world.omens][o]} />
  else {
    const hint = pickHint(HINTS, (id) => hintsSeen.has(id), world)
    const text = hint ? ui.labels.content(`hint.${hint.id}`) : null
    // Auf der Karte verdeckt eine offene Blase die oberen Bauwerke: erst als Marke zeigen
    if (text && compact && expanded !== `hint:${hint?.id}`) notice = <Chip id={`hint:${hint?.id}`} text={text.name} onOpen={setExpanded} testId="chip-hint" />
    else notice = <HintBubble hint={text ? { title: text.name, body: text.blurb } : null} onClose={() => hint && hintsSeen.add(hint.id)} />
  }
  return (
    <>
      <EventPills onOpen={onEvents} />
      {notice}
    </>
  )
}

function Chip({ id, text, onOpen, testId }: { id: string; text: string; onOpen: (id: string) => void; testId?: string }) {
  return (
    <button type="button" className="lw-chip" data-testid={testId ?? `chip-${id}`} onClick={() => onOpen(id)}>
      {text}
    </button>
  )
}
