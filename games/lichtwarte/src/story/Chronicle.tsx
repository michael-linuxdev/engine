import { useEffect, useState } from 'react'
import { MODULE, type OfflineState } from '@engine/core'
import { useEngine } from '@engine/react'
import { Button, Sheet, useUi } from '@engine/ui'
import { VignetteArt } from '../art/vignettes'
import { CHAPTERS } from '../content/chronicle'
import { chronicleRead, t } from '../runtime'
import { useChronicle } from './useChronicle'

/**
 * Chronik der Wächterin als Buch: eine Seite auf einmal, mit Kapitel, Bild und Blättern.
 * Beim Öffnen liegt die erste ungelesene Seite auf (sonst die neueste); gezeigt heißt gelesen.
 */
export function ChronicleSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { open: entries, unread } = useChronicle()
  const [at, setAt] = useState(0)
  const [fresh, setFresh] = useState<readonly string[]>([])
  const firstUnread = unread[0]?.id
  useEffect(() => {
    if (!open) return
    const i = firstUnread ? entries.findIndex((e) => e.id === firstUnread) : entries.length - 1
    setAt(Math.max(0, i))
    setFresh(unread.map((e) => e.id))
    // nur beim Öffnen aufschlagen
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [open])
  const e = entries[Math.min(at, entries.length - 1)]
  useEffect(() => {
    if (open && e) chronicleRead.add(e.id)
  }, [open, e])
  if (!e) {
    return (
      <Sheet open={open} title={t.chronicle.title} onClose={onClose} testId="chronicle" className="lw-chronicle">
        <p>{t.chronicle.empty}</p>
      </Sheet>
    )
  }
  const text = t.chronicle.entries[e.id]
  const voice = e.voice ?? 'chronicle'
  const last = at >= entries.length - 1
  return (
    <Sheet
      open={open}
      title={t.chronicle.title}
      onClose={onClose}
      testId="chronicle"
      className="lw-chronicle"
      footer={
        <nav className="lw-book-nav" aria-label={t.chronicle.title}>
          <Button variant="secondary" size="small" disabled={at <= 0} data-testid="chronicle-prev" onClick={() => setAt(at - 1)}>
            {t.chronicle.prev}
          </Button>
          <span className="ek-muted" data-testid="chronicle-pos">
            {t.chronicle.page(String(at + 1), String(entries.length))}
          </span>
          {last ? (
            <Button size="small" data-testid="chronicle-close" onClick={onClose}>
              {t.chronicle.close}
            </Button>
          ) : (
            <Button size="small" data-testid="chronicle-next" onClick={() => setAt(at + 1)}>
              {t.chronicle.next}
            </Button>
          )}
        </nav>
      }
    >
      <article key={e.id} className={`lw-page lw-page--${voice}`} data-testid={`chronicle-${e.id}`}>
        <p className="lw-page__chapter">
          {voice === 'letter' ? t.chronicle.letter : t.chronicle.chapter(String(CHAPTERS.indexOf(e.chapter) + 1), t.chronicle.chapters[e.chapter])}
          {fresh.includes(e.id) ? <span className="ek-badge ek-badge--inline">{t.chronicle.unread}</span> : null}
        </p>
        <VignetteArt art={e.art} uid={e.id} />
        <h3 className="lw-page__title">{text.title}</h3>
        {text.body.split('\n\n').map((para, i) => (
          <p key={i} className={`lw-page__text${i === 0 && voice === 'chronicle' ? ' lw-page__text--first' : ''}`}>
            {para}
          </p>
        ))}
        <p className="lw-signature">{voice === 'you' ? t.chronicle.signatureYou : t.chronicle.signature}</p>
      </article>
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
    <article className="lw-page lw-page--letter" data-testid="comeback-letter">
      <h3 className="lw-page__title">{t.chronicle.comeback.title}</h3>
      <p className="lw-page__text">{t.chronicle.comeback.body}</p>
      <p className="lw-signature">{t.chronicle.signature}</p>
    </article>
  )
}
