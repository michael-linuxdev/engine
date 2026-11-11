import { useEffect, useRef, useState } from 'react'
import { FEATURES_ID, isFeatureOpen, layerIndex, prestigeState, WHEEL_ID, type FeatureUnlocksState, type WheelState } from '@engine/core'
import { useEngine, useOverlay } from '@engine/react'
import { Button, useUi } from '@engine/ui'
import { t } from '../runtime'
import { StoryScene, type SceneKind } from './Scene'

/** Welcher Titel zu einem freigeschalteten System gehört (wo die IDs voneinander abweichen). */
const FEATURE_TITLE: Record<string, string> = { herbal: 'collection', events: 'weekend', watch: 'daily' }

/**
 * Zeremonie nach einer Mondwende, einer Langen Nacht oder einem Zeitalter: das Tal als Vollbild,
 * drei Zeilen, dann der Lohn, was neu frei ist, und das Sternenrad gleich darin.
 */
export function Ceremony({ layer, payout, currency, onDone }: { layer: string; payout: number; currency: string; onDone: () => void }) {
  const ui = useUi()
  const ref = useRef<HTMLDivElement>(null)
  useOverlay(true, onDone)
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('button')?.focus()
  }, [])
  const { world } = useEngine(ui.rt)
  // Meilenstein der Schicht: genau jetzt erreicht, wenn die neue Zahl der Läufe einer ist
  const k = layerIndex(world.def, layer)
  const count = prestigeState(world).layers[k]?.count ?? 0
  const milestone = (world.def.prestigeLayers[k]?.milestones ?? []).some((m) => m.at === count)
  const name = ui.labels.layer(layer).name
  const kind: SceneKind = layer in t.ceremony.layers ? (layer as SceneKind) : 'moonturn'
  const l = t.ceremony.layers[kind as keyof typeof t.ceremony.layers]
  const lines = [l.l1, l.l2, l.l3]
  // Neu frei: Systeme, die seit dem Öffnen der Zeremonie dazugekommen sind (sie öffnen im Takt nach dem Neubeginn)
  const unlocked = world.get<FeatureUnlocksState | undefined>(FEATURES_ID)?.unlocked ?? []
  const before = useRef<readonly string[] | null>(null)
  const [fresh, setFresh] = useState<string[]>([])
  useEffect(() => {
    if (before.current === null) {
      before.current = unlocked
      return
    }
    const add = unlocked.filter((id) => !before.current?.includes(id))
    if (add.length > fresh.length) setFresh(add)
    // nur auf die Liste reagieren
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked.join(',')])
  const names = fresh.map((id) => ui.labels.content(`title.${FEATURE_TITLE[id] ?? id}`).name).filter((n) => !n.startsWith('title.'))
  // Sternenrad: gleich hier drehen, statt danach ein eigenes Fenster zu öffnen
  const wheel = isFeatureOpen(world, 'wheel') ? world.get<WheelState | undefined>(WHEEL_ID) : undefined
  const [spun, setSpun] = useState(false)
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
        {milestone ? (
          <p className="lw-story__line lw-story__gain" data-testid="ceremony-milestone" style={{ animationDelay: `${0.5 + 5 * 1.3}s` }}>
            {t.ceremony.milestone(String(count))}
          </p>
        ) : null}
        {names.length ? (
          <p className="lw-story__line lw-story__gain" data-testid="ceremony-new" style={{ animationDelay: `${0.5 + 4 * 1.3}s` }}>
            {t.ceremony.fresh(names.join(', '))}
          </p>
        ) : null}
        {wheel && (wheel.spins > 0 || spun) ? (
          <p className="lw-story__line lw-story__wheel" style={{ animationDelay: `${0.5 + 4 * 1.3}s` }}>
            {spun && wheel.last ? (
              <span data-testid="ceremony-wheel-result">{t.ceremony.wheelResult(ui.labels.content(`wheel.${wheel.last}`).name, ui.labels.content(`wheel.${wheel.last}`).blurb)}</span>
            ) : (
              <Button
                variant="secondary"
                size="small"
                data-testid="ceremony-wheel"
                onClick={() => {
                  if (ui.rt.dispatch(WHEEL_ID, 'spin')) setSpun(true)
                }}
              >
                {t.ceremony.wheel}
              </Button>
            )}
          </p>
        ) : null}
        <Button data-testid="ceremony-ok" className="lw-story__cta" style={{ animationDelay: `${0.5 + 4 * 1.3}s` }} onClick={onDone}>
          {t.ceremony.cta}
        </Button>
      </div>
    </div>
  )
}
