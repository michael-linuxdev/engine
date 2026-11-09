import { useStore } from '@engine/react'
import { Sheet } from '@engine/ui'
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
