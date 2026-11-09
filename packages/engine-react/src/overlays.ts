/**
 * Overlay stack: the topmost open window closes on Escape or the system back
 * gesture. Each open overlay pushes one history entry so "back" closes it
 * instead of leaving the app.
 */
import { useEffect, useRef } from 'react'

interface Entry {
  id: number
  close: () => void
}

const stack: Entry[] = []
let nextId = 1
let installed = false
let ignorePop = 0

function install(): void {
  if (installed || typeof window === 'undefined') return
  installed = true
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !stack.length) return
    e.preventDefault()
    closeTop()
  })
  window.addEventListener('popstate', () => {
    if (ignorePop > 0) {
      ignorePop -= 1
      return
    }
    const top = stack.pop()
    top?.close()
  })
}

function closeTop(): void {
  const top = stack[stack.length - 1]
  if (!top) return
  // Going back pops our history entry; popstate then closes the overlay.
  history.back()
}

export function openOverlayCount(): number {
  return stack.length
}

/** Register an open overlay; `onClose` is called on Escape/back. */
export function useOverlay(open: boolean, onClose: () => void): void {
  const closeRef = useRef(onClose)
  useEffect(() => {
    closeRef.current = onClose
  })
  useEffect(() => {
    if (!open) return
    install()
    const entry: Entry = { id: nextId++, close: () => closeRef.current() }
    stack.push(entry)
    try {
      history.pushState({ overlay: entry.id }, '')
    } catch {
      /* ignore */
    }
    return () => {
      const i = stack.indexOf(entry)
      if (i >= 0) {
        // Closed by the app (button): drop our history entry without closing another overlay.
        stack.splice(i, 1)
        ignorePop += 1
        try {
          history.back()
        } catch {
          ignorePop -= 1
        }
      }
    }
  }, [open])
}
