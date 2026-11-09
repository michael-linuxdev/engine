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
}

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Modal sheet: role=dialog, Escape/back closes it (overlay stack), focus moves
 * in on open, stays inside (Tab wraps) and returns on close.
 */
export function Sheet({ open, title, onClose, children, className, testId, footer }: SheetProps) {
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
    <div className="ek-sheet-backdrop" onClick={onClose}>
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
        <header className="ek-sheet__head">
          <h2 id={id} className="ek-sheet__title">
            {title}
          </h2>
          <button type="button" className="ek-icon-btn" aria-label={t.common.close} data-testid="sheet-close" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="ek-sheet__body">{children}</div>
        {footer ? <footer className="ek-sheet__foot">{footer}</footer> : null}
      </div>
    </div>
  )
}
