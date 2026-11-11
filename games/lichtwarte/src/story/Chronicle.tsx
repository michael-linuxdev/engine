import { useEffect, useState } from 'react'
import { MODULE, type OfflineState } from '@engine/core'
import { useEngine } from '@engine/react'
import { Button, Sheet, useUi } from '@engine/ui'
import { VignetteArt } from '../art/vignettes'
import { CHAPTERS, CHRONICLE, type Clue } from '../content/chronicle'
import { chronicleRead, labels, t } from '../runtime'
import { useChronicle } from './useChronicle'

/**
 * Chronik der Wächterin als Buch: eine Seite auf einmal, mit Kapitel, Bild und Blättern.
 * Beim Öffnen liegt die erste ungelesene Seite auf (sonst die neueste); gezeigt heißt gelesen.
 */
export function ChronicleSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { open: entries, unread } = useChronicle()
  const [at, setAt] = useState(0)
  const [fresh, setFresh] = useState<readonly string[]>([])
  const [index, setIndex] = useState(false)
  const firstUnread = unread[0]?.id
  useEffect(() => {
    if (!open) return
    const i = firstUnread ? entries.findIndex((e) => e.id === firstUnread) : entries.length - 1
    setAt(Math.max(0, i))
    setFresh(unread.map((e) => e.id))
    setIndex(false)
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
  if (index) {
    // Inhaltsverzeichnis: alle Seiten nach Kapiteln; verschlossene nennen nur, wie sie sich öffnen
    const openIds = entries.map((x) => x.id)
    const resume = unread[0] ?? entries[entries.length - 1]
    const go = (id: string) => {
      setAt(Math.max(0, openIds.indexOf(id as (typeof openIds)[number])))
      setIndex(false)
    }
    return (
      <Sheet open={open} title={t.chronicle.contents} onClose={onClose} testId="chronicle" className="lw-chronicle">
        <Button data-testid="chronicle-resume" onClick={() => go(resume.id)}>
          {t.chronicle.resume(t.chronicle.entries[resume.id].title)}
        </Button>
        <div data-testid="chronicle-index">
          {CHAPTERS.map((ch, ci) => (
            <section key={ch} className="lw-toc">
              <h3 className="ek-h3">{t.chronicle.chapter(String(ci + 1), t.chronicle.chapters[ch])}</h3>
              <ul>
                {CHRONICLE.filter((x) => x.chapter === ch).map((x) =>
                  openIds.includes(x.id) ? (
                    <li key={x.id}>
                      <button type="button" className="lw-toc__page" data-testid={`toc-${x.id}`} onClick={() => go(x.id)}>
                        {t.chronicle.entries[x.id].title}
                        {unread.some((u) => u.id === x.id) ? <span className="ek-badge ek-badge--inline">{t.chronicle.unread}</span> : null}
                      </button>
                    </li>
                  ) : (
                    <li key={x.id} className="lw-toc__locked" data-testid={`toc-locked-${x.id}`}>
                      <span className="lw-toc__lock" aria-hidden="true" />
                      <span>{x.clue ? clueText(x.clue) : t.chronicle.lockedPage}</span>
                    </li>
                  ),
                )}
              </ul>
            </section>
          ))}
        </div>
      </Sheet>
    )
  }
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
          <button type="button" className="lw-toc__open" data-testid="chronicle-contents" onClick={() => setIndex(true)}>
            <span data-testid="chronicle-pos">{t.chronicle.page(String(at + 1), String(CHRONICLE.length))}</span>
            <span>{t.chronicle.contents}</span>
          </button>
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

/** Wie sich eine verschlossene Seite öffnet, in Worten. */
function clueText(c: Clue): string {
  switch (c.kind) {
    case 'build':
      return c.level ? t.chronicle.clue.buildLevel(labels.producer(c.id).name, String(c.level)) : t.chronicle.clue.build(labels.producer(c.id).name)
    case 'turns':
      return t.chronicle.clue.turns(String(c.n), labels.layer(c.layer).name)
    case 'near':
      return t.chronicle.clue.near(labels.layer(c.layer).name)
    case 'realms':
      return t.chronicle.clue.realms(String(c.n))
    case 'helper':
      return t.chronicle.clue.helper
    case 'voyages':
      return t.chronicle.clue.voyages(String(c.n))
  }
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
