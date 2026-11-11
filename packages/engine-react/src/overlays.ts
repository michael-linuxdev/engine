/**
 * Overlay stack: the topmost open window closes on Escape or the system back
 * gesture. While any overlay is open there is exactly ONE extra history
 * entry, so "back" closes the top overlay instead of leaving the app.
 *
 * History changes are batched in a microtask: closing one overlay and opening
 * the next in the same render must not race `history.back()` against
 * `pushState()` (that used to navigate away from the page).
 */
import { useEffect, useRef, useSyncExternalStore } from 'react'

interface Entry {
  id: number
  close: () => void
}

const stack: Entry[] = []
const listeners = new Set<() => void>()
const changed = () => listeners.forEach((l) => l())
let nextId = 1
let installed = false
let hasEntry = false
let ignorePop = 0
let scheduled = false

function sync(): void {
  if (scheduled) return
  scheduled = true
  queueMicrotask(() => {
    scheduled = false
    const want = stack.length > 0
    try {
      if (want && !hasEntry) {
        history.pushState({ overlay: true }, '')
        hasEntry = true
      } else if (!want && hasEntry) {
        hasEntry = false
        ignorePop += 1
        history.back()
      }
    } catch {
      /* no history (tests) */
    }
  })
}

function install(): void {
  if (installed || typeof window === 'undefined') return
  installed = true
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !stack.length) return
    e.preventDefault()
    stack[stack.length - 1].close()
  })
  window.addEventListener('popstate', () => {
    if (ignorePop > 0) {
      ignorePop -= 1
      return
    }
    // The system back gesture consumed our entry: close the top overlay;
    // if others remain open, sync() pushes a fresh entry.
    hasEntry = false
    stack[stack.length - 1]?.close()
    sync()
  })
}

export function openOverlayCount(): number {
  return stack.length
}

/** True while any overlay (sheet, dialog) is open; lets hints wait until the screen is free. */
export function useOverlayOpen(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => stack.length > 0,
    () => false,
  )
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
    changed()
    sync()
    return () => {
      const i = stack.indexOf(entry)
      if (i >= 0) stack.splice(i, 1)
      changed()
      sync()
    }
  }, [open])
}
