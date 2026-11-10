/** Funkenruf auf der Karte: großer Knopf unten in der Mitte; beim Ruf fliegen Funken auf und der Gewinn steigt als Zahl hoch. */
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

export function SparkDock() {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const uses = world.get<BurstState>(MODULE.burst)?.uses ?? 0
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
    <div className="lw-dock">
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
  )
}
