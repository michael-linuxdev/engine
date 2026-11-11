import { useEffect, useRef, type ButtonHTMLAttributes, type MouseEvent, type PointerEvent } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'normal' | 'small'
  /** Press and hold repeats the click (buying level after level); a short tap is one click. */
  repeat?: boolean
}

const HOLD_START_MS = 380
const HOLD_FIRST_MS = 140
const HOLD_FASTEST_MS = 45

/** Touch target ≥ 44 px (tokens.css), focus ring from the token contract. */
export function Button({ variant = 'primary', size = 'normal', className, type = 'button', repeat, onClick, onPointerDown, onPointerUp, onPointerLeave, onPointerCancel, ...rest }: ButtonProps) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const held = useRef(false)
  const click = useRef(onClick)
  useEffect(() => {
    click.current = onClick
  })
  const stop = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
  }
  useEffect(() => stop, [])
  const start = (e: PointerEvent<HTMLButtonElement>) => {
    onPointerDown?.(e)
    if (!repeat || e.button > 0) return
    held.current = false
    const target = e.currentTarget
    let wait = HOLD_FIRST_MS
    const fire = () => {
      if (target.disabled) return stop()
      held.current = true
      // Same handler as a tap; the event object is not used by repeat buttons
      click.current?.({ currentTarget: target, target } as unknown as MouseEvent<HTMLButtonElement>)
      wait = Math.max(HOLD_FASTEST_MS, wait * 0.9)
      timer.current = setTimeout(fire, wait)
    }
    stop()
    timer.current = setTimeout(fire, HOLD_START_MS)
  }
  return (
    <button
      type={type}
      className={['ek-btn', `ek-btn--${variant}`, size === 'small' ? 'ek-btn--small' : '', className ?? ''].join(' ').trim()}
      {...rest}
      onPointerDown={start}
      onPointerUp={(e) => {
        stop()
        onPointerUp?.(e)
      }}
      onPointerLeave={(e) => {
        stop()
        onPointerLeave?.(e)
      }}
      onPointerCancel={(e) => {
        stop()
        onPointerCancel?.(e)
      }}
      onContextMenu={repeat ? (e) => e.preventDefault() : rest.onContextMenu}
      onClick={(e) => {
        // The click that ends a hold already fired through the repeat
        if (held.current) {
          held.current = false
          return
        }
        onClick?.(e)
      }}
    />
  )
}
