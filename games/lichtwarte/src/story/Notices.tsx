/**
 * Bereich unter dem HUD: höchstens EIN Hinweis gleichzeitig (Handy-Platz).
 * Reihenfolge: Einstieg → Omen → Randnotiz der Chronik. Der Talgast hat keine Meldung: Er steht auf der Karte und wird dort angetippt. Ereignis-Pillen sind klein und immer da.
 */
import { useState, type ReactNode } from 'react'
import { CHOICES_ID, isFeatureOpen, layerForecast, layerStatus, type ChoiceState } from '@engine/core'
import { pickHint, useEngine, useOverlayOpen, useStore } from '@engine/react'
import { ChoiceNotice, EventPills, HintBubble, useUi, type Pill } from '@engine/ui'
import { OMENS } from '../content/world'
import { game } from '../game'
import { HINTS } from '../content/live'
import { hintsSeen, t } from '../runtime'

/**
 * `compact`: Omen und Randnotizen erscheinen als kleine Marke und klappen erst beim Antippen auf.
 * So bleibt die Karte frei, und auf den anderen Tabs schiebt kein Hinweis den Inhalt nach unten.
 */
/** Ab so vielen Sekunden bis zur Schwelle kündigt eine Pille die Mondwende an. */
const TURN_SOON_S = 30 * 60

export function Notices({ coach, onEvents, onPrestige, compact = false, waiting = [] }: { coach: ReactNode; onEvents: () => void; onPrestige: () => void; compact?: boolean; /** Marken für das, was auf einen Tipp wartet (stehen vorn). */ waiting?: readonly Pill[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  useStore(hintsSeen)
  // Solange ein Fenster offen ist, warten Omen und Randnotizen (der Einstieg bleibt)
  const busy = useOverlayOpen()
  // Was ein Omen für diesen Stand bedeutet: die Folge in Glimmer je Sekunde
  const omenText = (id: string, o: 'safe' | 'risk') => {
    const base = t.world.omens[id as keyof typeof t.world.omens][o]
    const c = OMENS.list.find((x) => x.id === id)
    const rate = world.rate()
    if (!c || rate <= 0) return base
    const per = (mult: number) => ui.t.common.perSecond(`${mult >= 1 ? '+' : '−'}${ui.fmt(Math.abs(rate * (mult - 1)))}`)
    if (o === 'safe') return c.safe.buff.target === 'income' ? `${base} ${t.world.omenNow(per(c.safe.buff.mult))}` : base
    return c.risk.win.target === 'income' ? `${base} ${t.world.omenNowRisk(per(c.risk.win.mult), per(c.risk.lose.mult))}` : base
  }
  const omen = isFeatureOpen(world, 'omens') && !!world.get<ChoiceState>(CHOICES_ID)?.pending
  let notice: ReactNode = null
  if (coach) notice = coach
  else if (busy) notice = null
  else if (omen && compact && expanded !== 'omen') notice = <Chip id="omen" text={`${ui.labels.content('title.omens').name}: ${ui.labels.content(`omen.${world.get<ChoiceState>(CHOICES_ID)?.pending}`).name}`} onOpen={setExpanded} />
  else if (omen) notice = <ChoiceNotice option={omenText} />
  else {
    const hint = pickHint(HINTS, (id) => hintsSeen.has(id), world)
    const text = hint ? ui.labels.content(`hint.${hint.id}`) : null
    // Auf der Karte verdeckt eine offene Blase die oberen Bauwerke: erst als Marke zeigen
    if (text && compact && expanded !== `hint:${hint?.id}`) notice = <Chip id={`hint:${hint?.id}`} text={text.name} onOpen={setExpanded} testId="chip-hint" />
    else notice = <HintBubble hint={text ? { title: text.name, body: text.blurb } : null} onClose={() => hint && hintsSeen.add(hint.id)} />
  }
  // Pille zur Mondwende: bereit (mit Lohn) oder bald (mit Restzeit); Antippen führt in den Tab
  const first = game.prestigeLayers[0]
  const st = layerStatus(world, first.id)
  const fc = layerForecast(world, first.id, 0)
  const layer = ui.labels.layer(first.id).name
  // Ist sie bereit, sagt das schon die Ziel-Zeile der Kopfzeile (mit Lohn): Die Pille kündigt nur an
  const turn: Pill[] =
    st.block === 'earned' && fc && fc.secondsToGate > 0 && fc.secondsToGate <= TURN_SOON_S
      ? [{ id: 'turn', text: t.hud.turnSoon(layer, ui.duration(fc.secondsToGate * 1000)), onOpen: onPrestige }]
      : []
  return (
    <>
      <EventPills onOpen={onEvents} extra={[...waiting, ...turn]} />
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
