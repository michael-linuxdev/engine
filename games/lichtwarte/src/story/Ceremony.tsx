import { useEffect, useRef } from 'react'
import { useOverlay } from '@engine/react'
import { Button, useUi } from '@engine/ui'
import { t } from '../runtime'
import { StoryScene, type SceneKind } from './Scene'

/** Zeremonie nach einer Mondwende, einer Langen Nacht oder einem Zeitalter: das Tal als Vollbild, drei Zeilen, der Lohn. */
export function Ceremony({ layer, payout, currency, onDone }: { layer: string; payout: number; currency: string; onDone: () => void }) {
  const ui = useUi()
  const ref = useRef<HTMLDivElement>(null)
  useOverlay(true, onDone)
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('button')?.focus()
  }, [])
  const name = ui.labels.layer(layer).name
  const kind: SceneKind = layer in t.ceremony.layers ? (layer as SceneKind) : 'moonturn'
  const l = t.ceremony.layers[kind as keyof typeof t.ceremony.layers]
  const lines = [l.l1, l.l2, l.l3]
  return (
    <div ref={ref} className={`lw-story lw-story--${kind}`} role="dialog" aria-modal="true" aria-labelledby="lw-ceremony-title" data-testid="ceremony">
      <StoryScene kind={kind} />
      <div className="lw-story__text">
        <h2 id="lw-ceremony-title" className="lw-story__title">
          {t.ceremony.title(name)}
        </h2>
        {lines.map((x, i) => (
          <p key={i} className="lw-story__line" style={{ animationDelay: `${0.5 + i * 1.3}s` }}>
            {x}
          </p>
        ))}
        <p className="lw-story__line lw-story__gain" style={{ animationDelay: `${0.5 + 3 * 1.3}s` }}>
          {t.ceremony.body(ui.fmt(payout), ui.labels.currency(currency))}
        </p>
        <Button data-testid="ceremony-ok" className="lw-story__cta" style={{ animationDelay: `${0.5 + 4 * 1.3}s` }} onClick={onDone}>
          {t.ceremony.cta}
        </Button>
      </div>
    </div>
  )
}
