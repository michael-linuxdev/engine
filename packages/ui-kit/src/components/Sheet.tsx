import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { useOverlay } from '@engine/react'
import { useUi } from '../useUi'

export interface SheetProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  /** Extra class for game styling. */
  className?: string
  testId?: string
  footer?: ReactNode
  /** Dim the page behind the sheet (default). `false` keeps it bright, e.g. for a small card over a map. */
  dim?: boolean
}

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

/** Swipe distance (px) that closes the sheet. */
const SWIPE_CLOSE_PX = 72
/** Drag distance (px) over which the sheet fades while it is pulled down. */
const SWIPE_FADE_PX = 320
/** Duration (ms) of the slide-out after a swipe that closes. */
const SWIPE_OUT_MS = 160

/**
 * Modal sheet: role=dialog, Escape/back closes it (overlay stack), focus moves
 * in on open, stays inside (Tab wraps) and returns on close. A swipe down
 * closes it too (from the head, or from the content while it is scrolled to the top).
 */
export function Sheet({ open, title, onClose, children, className, testId, footer, dim = true }: SheetProps) {
  const { t } = useUi()
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)
  useOverlay(open, onClose)
  useEffect(() => {
    if (!open) return
    const before = document.activeElement as HTMLElement | null
    const el = ref.current
    const first = el?.querySelector<HTMLElement>(FOCUSABLE)
    ;(first ?? el)?.focus()
    return () => before?.focus?.()
  }, [open])
  const close = useRef(onClose)
  useEffect(() => {
    close.current = onClose
  })
  // Swipe down to close. Native listeners, because the move must be cancellable:
  // otherwise the browser scrolls (or rubber-bands) the page behind the sheet instead.
  useEffect(() => {
    const el = ref.current
    if (!open || !el) return
    let drag: { y: number; dy: number } | null = null
    let leaving: ReturnType<typeof setTimeout> | undefined
    const start = (e: TouchEvent) => {
      const body = el.querySelector<HTMLElement>('.ek-sheet__body')
      const inBody = !!body && body.contains(e.target as Node)
      // Inside scrolled content the gesture scrolls; only from the very top it drags the sheet
      drag = e.touches.length === 1 && (!inBody || (body?.scrollTop ?? 0) <= 0) ? { y: e.touches[0].clientY, dy: 0 } : null
    }
    const backdrop = el.parentElement
    const move = (e: TouchEvent) => {
      if (!drag) return
      const dy = e.touches[0].clientY - drag.y
      // Upwards from the top the content scrolls as usual
      if (dy <= 0 && drag.dy <= 0) return
      drag.dy = Math.max(0, dy)
      if (e.cancelable) e.preventDefault()
      // A running or filled open animation would win over the inline transform: switch it off while dragging
      el.style.animation = 'none'
      el.style.transition = 'none'
      el.style.transform = `translateY(${drag.dy}px)`
      el.style.opacity = String(Math.max(0.35, 1 - drag.dy / SWIPE_FADE_PX))
      if (backdrop) {
        backdrop.style.animation = 'none'
        backdrop.style.transition = 'none'
        backdrop.style.setProperty('--ek-drag', String(Math.max(0, 1 - drag.dy / SWIPE_FADE_PX)))
      }
    }
    const end = () => {
      const d = drag
      drag = null
      if (!d || d.dy <= 0) return
      const leave = d.dy >= SWIPE_CLOSE_PX
      el.style.transition = `transform ${SWIPE_OUT_MS}ms ease-in, opacity ${SWIPE_OUT_MS}ms ease-in`
      if (!leave) {
        // Not far enough: the sheet slides back
        el.style.transform = ''
        el.style.opacity = ''
        backdrop?.style.removeProperty('--ek-drag')
        return
      }
      // Far enough: the sheet slides out and fades, then it closes
      el.style.transform = 'translateY(100%)'
      el.style.opacity = '0'
      backdrop?.style.setProperty('--ek-drag', '0')
      leaving = setTimeout(() => close.current(), SWIPE_OUT_MS)
    }
    el.addEventListener('touchstart', start, { passive: true })
    el.addEventListener('touchmove', move, { passive: false })
    el.addEventListener('touchend', end)
    el.addEventListener('touchcancel', end)
    return () => {
      clearTimeout(leaving)
      el.removeEventListener('touchstart', start)
      el.removeEventListener('touchmove', move)
      el.removeEventListener('touchend', end)
      el.removeEventListener('touchcancel', end)
    }
  }, [open])
  if (!open) return null
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !ref.current) return
    const items = [...ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
    if (!items.length) return
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
  return (
    <div className={`ek-sheet-backdrop${dim ? '' : ' ek-sheet-backdrop--clear'}`} onClick={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        tabIndex={-1}
        className={['ek-sheet', className ?? ''].join(' ').trim()}
        data-testid={testId}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKey}
      >
        <span className="ek-sheet__grip" aria-hidden="true" />
        <header className="ek-sheet__head">
          <h2 id={id} className="ek-sheet__title">
            {title}
          </h2>
          <button type="button" className="ek-icon-btn" aria-label={t.common.close} data-testid="sheet-close" onClick={onClose}>
            ×
          </button>
        </header>
        {/* Scrollable content must be reachable by keyboard (axe: scrollable-region-focusable) */}
        <div className="ek-sheet__body" role="region" aria-labelledby={id} tabIndex={0}>
          {children}
        </div>
        {footer ? <footer className="ek-sheet__foot">{footer}</footer> : null}
      </div>
    </div>
  )
}
