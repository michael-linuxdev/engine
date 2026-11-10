/** Sprechblase des Lehrlings auf der Karte: alle paar Atemzüge ein Satz, passend zu Tageszeit und Wetter. Reine Zierde (für Screenreader stumm). */
import { useEffect, useState } from 'react'
import type { Mood } from '@engine/art'
import { fennoLines } from './fenno'
import { apprenticeSpot, MAP_H, MAP_W } from './slots'
import type { Weather } from './weather'

const FIRST_MS = 5_000
const SHOW_MS = 7_000
const PAUSE_MS = 38_000

export function FennoBubble({ m, w, minute }: { m: Mood; w: Weather; minute: number }) {
  const [n, setN] = useState(-1)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const id = setTimeout(
      () => {
        if (!shown) setN((x) => x + 1)
        setShown(!shown)
      },
      shown ? SHOW_MS : n < 0 ? FIRST_MS : PAUSE_MS,
    )
    return () => clearTimeout(id)
  }, [shown, n])
  if (!shown || n < 0) return null
  const lines = fennoLines(m, w)
  const spot = apprenticeSpot(minute)
  const left = Math.min(34, Math.max(4, (spot.x / MAP_W) * 100 - 6))
  return (
    <p className="lw-bubble" aria-hidden="true" style={{ left: `${left}%`, bottom: `${100 - ((spot.y - 30 * spot.scale) / MAP_H) * 100}%` }}>
      {lines[(n + minute) % lines.length]}
    </p>
  )
}
