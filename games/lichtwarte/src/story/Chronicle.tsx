import { MODULE, type OfflineState } from '@engine/core'
import { useEngine, useStore } from '@engine/react'
import { Sheet, useUi } from '@engine/ui'
import { chronicleRead, t } from '../runtime'
import { useChronicle } from './useChronicle'

/** Chronik der Wächterin: alle freigeschalteten Seiten, neueste oben; Öffnen markiert als gelesen. */
export function ChronicleSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { open: entries } = useChronicle()
  const read = useStore(chronicleRead)
  const close = () => {
    for (const e of entries) chronicleRead.add(e.id)
    onClose()
  }
  return (
    <Sheet open={open} title={t.chronicle.title} onClose={close} testId="chronicle" className="lw-chronicle">
      {entries.length === 0 ? <p>{t.chronicle.empty}</p> : null}
      {[...entries].reverse().map((e) => {
        const text = t.chronicle.entries[e.id]
        return (
          <article key={e.id} className="lw-page" data-testid={`chronicle-${e.id}`}>
            <h3 className="ek-h3">
              {text.title} {!read.includes(e.id) ? <span className="ek-badge ek-badge--inline">{t.chronicle.unread}</span> : null}
            </h3>
            <p>{text.body}</p>
            <p className="lw-signature">{t.chronicle.signature}</p>
          </article>
        )
      })}
    </Sheet>
  )
}

/** Rückkehr-Brief im Willkommen-Fenster (ab 48 h Abwesenheit, mit Geschenk beim Einsammeln). */
export function ComebackLetter() {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const pending = world.get<OfflineState>(MODULE.offline)?.pending
  const min = world.def.balance.offline.comebackMs ?? Infinity
  if (!pending || pending.elapsedMs < min) return null
  return (
    <article className="lw-page" data-testid="comeback-letter">
      <h3 className="ek-h3">{t.chronicle.comeback.title}</h3>
      <p>{t.chronicle.comeback.body}</p>
      <p className="lw-signature">{t.chronicle.signature}</p>
    </article>
  )
}
