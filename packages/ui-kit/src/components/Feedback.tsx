import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useUi } from '../useUi'
import { collectFeedback, FLOAT_MAX, FLOAT_MS, TOAST_MAX, TOAST_MS, type FeedbackItem, type FeedbackMap } from '../feedback'

interface Toast {
  key: number
  text: string
  tone: NonNullable<FeedbackItem['tone']>
}
interface Float {
  key: number
  kind: 'float' | 'fly'
  text: string
  tone: NonNullable<FeedbackItem['tone']>
  style: CSSProperties
}

/** Delay (ms) between numbers that start in the same batch. */
const FLOAT_GAP_MS = 280

/** Middle of the anchor; `data-fx-x` (0–1) moves the point along its width, e.g. into the free part of the HUD. */
function centre(anchor: string | undefined): { x: number; y: number } {
  const el = anchor ? document.querySelector(`[data-fx="${anchor}"]`) : null
  if (!el) return { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  const r = el.getBoundingClientRect()
  const fx = Number(el.getAttribute('data-fx-x') ?? 0.5)
  return { x: r.left + r.width * fx, y: r.top + r.height / 2 }
}

/**
 * The shared feedback layer: every reward answers on screen. The game maps
 * engine events to toasts, rising numbers and flights to the HUD.
 * Purely visual (pointer-events: none); toasts are announced politely.
 */
export function FeedbackLayer({ map }: { map: FeedbackMap }) {
  const ui = useUi()
  const [toasts, setToasts] = useState<Toast[]>([])
  const [floats, setFloats] = useState<Float[]>([])
  const mapRef = useRef(map)
  const uiRef = useRef(ui)
  useEffect(() => {
    mapRef.current = map
    uiRef.current = ui
  })
  useEffect(() => {
    let n = 0
    // Time from which the next number may start (numbers take turns, also across event batches)
    let freeAt = 0
    const timers = new Set<ReturnType<typeof setTimeout>>()
    const later = (ms: number, fn: () => void) => {
      const id = setTimeout(() => {
        timers.delete(id)
        fn()
      }, ms)
      timers.add(id)
    }
    const off = ui.rt.onEvents((events) => {
      const items = collectFeedback(events, (e) => mapRef.current(e, uiRef.current))
      if (!items.length) return
      const newToasts: Toast[] = []
      const newFloats: Float[] = []
      for (const item of items) {
        const key = ++n
        const tone = item.tone ?? 'gain'
        if (item.kind === 'toast') {
          if (item.text) newToasts.push({ key, text: item.text, tone })
          continue
        }
        const from = centre(item.anchor)
        // Several numbers in a row take turns instead of covering each other
        let delay = 0
        if (item.kind === 'float') {
          const now = performance.now()
          delay = Math.min(Math.max(0, freeAt - now), 3 * FLOAT_GAP_MS)
          freeAt = Math.max(now, freeAt) + FLOAT_GAP_MS
        }
        const style: Record<string, string> = { left: `${from.x}px`, top: `${from.y}px`, animationDelay: `${delay}ms` }
        if (item.kind === 'fly') {
          const to = centre(document.querySelector('[data-fx="hud-icon"]') ? 'hud-icon' : 'hud')
          style['--fx-dx'] = `${to.x - from.x}px`
          style['--fx-dy'] = `${to.y - from.y}px`
          later(FLOAT_MS * 0.6, () => {
            const hud = document.querySelector('[data-fx="hud"]')
            hud?.classList.add('is-flash')
            later(450, () => hud?.classList.remove('is-flash'))
          })
        }
        newFloats.push({ key, kind: item.kind, text: item.text ?? '', tone, style: style as CSSProperties })
      }
      if (newToasts.length) {
        setToasts((cur) => [...cur, ...newToasts].slice(-TOAST_MAX))
        const keys = new Set(newToasts.map((x) => x.key))
        later(TOAST_MS, () => setToasts((cur) => cur.filter((x) => !keys.has(x.key))))
      }
      if (newFloats.length) {
        setFloats((cur) => [...cur, ...newFloats].slice(-FLOAT_MAX))
        const keys = new Set(newFloats.map((x) => x.key))
        later(FLOAT_MS + 3 * FLOAT_GAP_MS, () => setFloats((cur) => cur.filter((x) => !keys.has(x.key))))
      }
    })
    return () => {
      off()
      for (const id of timers) clearTimeout(id)
    }
  }, [ui.rt])
  return (
    <div className="ek-fx" data-testid="fx">
      <div className="ek-fx__toasts" role="status" aria-live="polite">
        {toasts.map((x) => (
          <p key={x.key} className={`ek-toast ek-toast--${x.tone}`} data-testid="toast">
            {x.text}
          </p>
        ))}
      </div>
      <div aria-hidden="true">
        {floats.map((x) => (
          <span key={x.key} className={`ek-fx__${x.kind} ek-fx--${x.tone}`} style={x.style} data-testid={`fx-${x.kind}`}>
            {x.text}
          </span>
        ))}
      </div>
    </div>
  )
}
