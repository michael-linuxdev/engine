import { useEffect, useRef } from 'react'
import { Button } from '@engine/ui'
import { t } from '../runtime'
import { StoryScene } from './Scene'

/** Prolog beim allerersten Start: das dunkle Tal, vier Zeilen, dann der Schlüssel. */
export function Intro({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('button')?.focus()
  }, [])
  const lines = [t.intro.l1, t.intro.l2, t.intro.l3, t.intro.l4]
  return (
    <div ref={ref} className="lw-story lw-story--intro" role="dialog" aria-modal="true" aria-labelledby="lw-intro-title" data-testid="intro">
      <StoryScene kind="prologue" />
      <div className="lw-story__text">
        <h1 id="lw-intro-title" className="lw-story__title">
          {t.app.title}
        </h1>
        {lines.map((l, i) => (
          <p key={i} className="lw-story__line" style={{ animationDelay: `${0.6 + i * 1.5}s` }}>
            {l}
          </p>
        ))}
        <Button data-testid="intro-start" className="lw-story__cta" style={{ animationDelay: `${0.6 + lines.length * 1.5}s` }} onClick={onDone}>
          {t.intro.cta}
        </Button>
      </div>
    </div>
  )
}
