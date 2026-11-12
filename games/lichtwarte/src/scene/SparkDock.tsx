/**
 * Funkenruf auf der Karte: großer Knopf unten in der Mitte; beim Ruf fliegen Funken auf und der Gewinn steigt als Zahl hoch.
 * Dazu schwebt je geladenem Ruf ein Funke im Tal: Antippen ruft ihn. So gibt es in der aktiven Sitzung immer etwas
 * auf der Karte zu tun (vorher: sechs Rufe in zwanzig Minuten, dazwischen nur Warten). Die Funken sind reine Anzeige
 * der Ladungen des Funkenrufs: kein eigener Spielstand.
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { burstSeconds, MODULE, type BurstState } from '@engine/core'
import { useEngine } from '@engine/react'
import { BurstButton, useUi } from '@engine/ui'
import { IconSpark } from '../art/icons'
import { t } from '../runtime'

const SPARKS = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2 + (i % 2) * 0.3
  const r = 54 + (i % 3) * 22
  return { '--dx': `${Math.round(Math.cos(a) * r)}px`, '--dy': `${Math.round(Math.sin(a) * r - 40)}px`, animationDelay: `${(i % 4) * 0.04}s` } as CSSProperties
})

/** Freie Stellen im Tal (Prozent der Karte): neben den Schildern, unter der Kopfzeile, über dem Funkenruf-Knopf. */
const SPARK_SPOTS = [
  { x: 42, y: 64 },
  { x: 92, y: 72 },
  { x: 7, y: 53 },
  { x: 58, y: 61 },
  { x: 7, y: 76 },
  { x: 92, y: 50 },
  { x: 42, y: 43 },
  { x: 58, y: 39 },
] as const

/** Je geladenem Ruf ein Funke an einer freien Stelle. Wer einen antippt, ruft genau diesen. */
function MapSparks({ charges, onUse }: { charges: number; onUse: () => void }) {
  const [spots, setSpots] = useState<number[]>([])
  const next = useRef(0)
  useEffect(() => {
    setSpots((cur) => {
      if (cur.length === charges) return cur
      // Der große Knopf hat einen Ruf verbraucht: der älteste Funke verglimmt
      if (cur.length > charges) return cur.slice(cur.length - charges)
      const out = [...cur]
      while (out.length < charges && out.length < SPARK_SPOTS.length) {
        let k = next.current
        for (let i = 0; i < SPARK_SPOTS.length && out.includes(k); i++) k = (k + 3) % SPARK_SPOTS.length
        next.current = (k + 3) % SPARK_SPOTS.length
        out.push(k)
      }
      return out
    })
  }, [charges])
  return (
    <>
      {spots.map((k) => (
        <button
          key={k}
          type="button"
          className="lw-spark"
          data-testid="map-spark"
          aria-label={t.play.spark}
          style={{ left: `${SPARK_SPOTS[k].x}%`, top: `${SPARK_SPOTS[k].y}%` }}
          onClick={() => {
            setSpots((cur) => cur.filter((x) => x !== k))
            onUse()
          }}
        >
          <IconSpark />
        </button>
      ))}
    </>
  )
}

export function SparkDock() {
  const ui = useUi()
  const { world, dispatch } = useEngine(ui.rt)
  const burst = world.get<BurstState>(MODULE.burst)
  const uses = burst?.uses ?? 0
  const seen = useRef(uses)
  const [fx, setFx] = useState<{ key: number; gain: string } | null>(null)
  useEffect(() => {
    if (uses > seen.current) setFx({ key: uses, gain: `+${ui.fmt(world.rate() * burstSeconds(world))}` })
    seen.current = uses
    // nur auf neue Rufe reagieren
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [uses])
  useEffect(() => {
    if (!fx) return
    const id = setTimeout(() => setFx(null), 1200)
    return () => clearTimeout(id)
  }, [fx])
  return (
    <>
    <MapSparks charges={burst?.charges ?? 0} onUse={() => dispatch(MODULE.burst, 'use')} />
    <div className="lw-dock" data-fx="burst">
      <BurstButton label={t.play.burst} icon={<IconSpark />} />
      {fx ? (
        <span key={fx.key} aria-hidden="true">
          <span className="lw-sparks">
            {SPARKS.map((st, i) => (
              <i key={i} style={st} />
            ))}
          </span>
          <span className="lw-gain">{fx.gain}</span>
        </span>
      ) : null}
    </div>
    </>
  )
}
