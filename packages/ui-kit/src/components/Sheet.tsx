import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode, type TouchEvent } from 'react'
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
  const drag = useRef<{ y: number; dy: number } | null>(null)
  if (!open) return null
  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const el = ref.current
    const body = el?.querySelector<HTMLElement>('.ek-sheet__body')
    const inBody = !!body && body.contains(e.target as Node)
    // Inside scrolled content the gesture scrolls; only from the very top it drags the sheet
    drag.current = e.touches.length === 1 && (!inBody || (body?.scrollTop ?? 0) <= 0) ? { y: e.touches[0].clientY, dy: 0 } : null
  }
  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    const d = drag.current
    const el = ref.current
    if (!d || !el) return
    d.dy = Math.max(0, e.touches[0].clientY - d.y)
    el.style.transform = d.dy > 0 ? `translateY(${d.dy}px)` : ''
    el.style.transition = 'none'
  }
  const onTouchEnd = () => {
    const d = drag.current
    const el = ref.current
    drag.current = null
    if (!d || !el) return
    el.style.transition = ''
    el.style.transform = ''
    if (d.dy >= SWIPE_CLOSE_PX) onClose()
  }
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
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
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
