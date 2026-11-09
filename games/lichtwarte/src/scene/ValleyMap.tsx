/**
 * Die Talkarte: SVG-Szene (Hintergrund + Bauwerke) und darüber HTML-Knöpfe
 * je Platz (Tastatur, Screenreader, ≥ 44 px). Gesperrte Plätze sind Wildnis.
 */
import { useEffect, useState } from 'react'
import { tierFor } from '@engine/art'
import { isUnlocked, ownedOf } from '@engine/core'
import { useEngine } from '@engine/react'
import { useUi } from '@engine/ui'
import { Backdrop, Shade, Snow } from '../art/Backdrop'
import { BuildingArt } from '../art/Building'
import { TIER_LEVELS } from '../art/registry'
import { game } from '../game'
import { t } from '../runtime'
import { currentMood } from './mood'
import { BUILD_SCALE, MAP_CROP, MAP_H, MAP_W, SLOTS, slotView } from './slots'

export function ValleyMap({ onOpen }: { onOpen: (id: string) => void }) {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const [mood, setMood] = useState(currentMood)
  useEffect(() => {
    const id = setInterval(() => setMood(currentMood()), 60_000)
    return () => clearInterval(id)
  }, [])
  return (
    <section className="lw-map" style={{ aspectRatio: `${MAP_W} / ${MAP_H - MAP_CROP}` }} aria-label={t.play.map} data-mood={`${mood.daypart}-${mood.season}`}>
      <svg className="lw-map__svg" viewBox={`0 ${MAP_CROP} ${MAP_W} ${MAP_H - MAP_CROP}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label={t.play.map} data-testid="valley-svg">
        <Backdrop m={mood} />
        {SLOTS.map((s, i) => {
          const p = game.producers.find((x) => x.id === s.id)!
          const level = ownedOf(world, s.id)
          const tier = tierFor(level, TIER_LEVELS)
          return (
            <g key={s.id} transform={`translate(${(s.x / 100) * MAP_W} ${(s.y / 100) * MAP_H}) scale(${s.scale * BUILD_SCALE})`} opacity={tier === 0 && !isUnlocked(world, p) ? 0.85 : 1}>
              <BuildingArt id={s.id} tier={tier} m={mood} variant={i} />
            </g>
          )
        })}
        <Snow m={mood} />
        <Shade m={mood} />
      </svg>
      {SLOTS.map((s) => {
        const p = game.producers.find((x) => x.id === s.id)!
        const level = ownedOf(world, s.id)
        const open = isUnlocked(world, p)
        const name = ui.labels.producer(s.id).name
        return (
          <button
            key={s.id}
            type="button"
            className={`lw-slot${open ? '' : ' is-wild'}${level > 0 ? ' is-built' : ''}`}
            style={{ left: `${slotView(s).left}%`, top: `${slotView(s).top}%` }}
            data-testid={`slot-${s.id}`}
            onClick={() => onOpen(s.id)}
          >
            <span className="lw-slot__plaque">
              <span className="lw-slot__name">{open || level > 0 ? name : t.play.wild}</span>
              <span className="lw-slot__level">{level > 0 ? t.play.slotLevel(String(level)) : open ? t.play.clear : t.common.locked}</span>
            </span>
          </button>
        )
      })}
    </section>
  )
}
