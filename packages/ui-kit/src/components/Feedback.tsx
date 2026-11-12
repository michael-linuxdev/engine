import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
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

/**
 * Middle of the anchor. `anchor` may list alternatives ("buy,hud"): the first one on screen wins, so a number
 * can rise where the action happened and fall back to the HUD. `data-fx-x` / `data-fx-y` (0–1, may exceed 1)
 * move the point along the element, e.g. below the HUD amount instead of across its digits.
 */
function centre(anchor: string | undefined): { x: number; y: number } {
  let el: Element | null = null
  for (const name of (anchor ?? '').split(',')) {
    const found = name ? document.querySelector(`[data-fx="${name.trim()}"]`) : null
    if (found && (found as HTMLElement).offsetParent !== null) {
      el = found
      break
    }
  }
  if (!el) return { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  const r = el.getBoundingClientRect()
  const fx = Number(el.getAttribute('data-fx-x') ?? 0.5)
  const fy = Number(el.getAttribute('data-fx-y') ?? 0.5)
  return { x: r.left + r.width * fx, y: r.top + r.height * fy }
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
  // Toasts sit right below the HUD, wherever it ends in this game and on this screen: never across its numbers or the goal
  const laneRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef(map)
  const uiRef = useRef(ui)
  useEffect(() => {
    mapRef.current = map
    uiRef.current = ui
  })
  // Measured after the render: the event that brings a toast may also make the HUD taller (a new currency row)
  useLayoutEffect(() => {
    if (!toasts.length || !laneRef.current) return
    const hud = document.querySelector('.ek-hud')?.getBoundingClientRect()
    if (hud && hud.bottom > 0) laneRef.current.style.top = `${Math.round(hud.bottom + 6)}px`
  }, [toasts])
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
      <div ref={laneRef} className="ek-fx__toasts" role="status" aria-live="polite">
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
