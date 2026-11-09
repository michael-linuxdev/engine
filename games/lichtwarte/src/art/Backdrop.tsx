/** Hintergrund der Talkarte: Himmel, Gestirn, Berge, Hügel, Fluss, Pfad, Bäume, die alte Turmwarte. */
import type { Mood } from '@engine/art'
import { paintOrder, seeded, vary } from '@engine/art'
import { MAP_H, MAP_W, SLOTS } from '../scene/slots'
import { Tree } from './parts'
import { STROKE } from './stroke'
import { GROUND, isDark, MOUNTAIN, P, SHADE, SKY } from './palette'

const W = MAP_W
const H = MAP_H

export function Sky({ m, id }: { m: Mood; id: string }) {
  const [top, bottom] = SKY[m.daypart]
  return (
    <g>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H * 0.35} fill={`url(#sky-${id})`} />
      {m.daypart === 'night' ? (
        <g>
          <circle cx={290} cy={150} r={16} fill={P.glowSoft} />
          <circle cx={298} cy={145} r={14} fill={top} />
          {[30, 80, 140, 200, 250, 330, 110, 180].map((x, i) => (
            <circle key={x} cx={x} cy={60 + ((i * 37) % 120)} r={1.2} fill={P.glowSoft} />
          ))}
        </g>
      ) : (
        <circle cx={m.daypart === 'evening' ? 300 : m.daypart === 'dawn' ? 60 : 280} cy={m.daypart === 'day' ? 140 : 175} r={18} fill={m.daypart === 'day' ? P.glowSoft : P.glowHot} opacity={0.9} />
      )}
    </g>
  )
}

function Mountains() {
  return (
    <g>
      <polygon points={`0,190 60,120 110,170 170,100 230,165 290,115 ${W},175 ${W},230 0,230`} fill={MOUNTAIN[0]} stroke={P.outline} strokeWidth={STROKE.fine} />
      <polygon points={`0,215 80,165 150,205 220,160 300,200 ${W},180 ${W},240 0,240`} fill={MOUNTAIN[1]} />
    </g>
  )
}

function Hills({ m }: { m: Mood }) {
  const [far, near, meadow] = GROUND[m.season]
  return (
    <g>
      <path d={`M0 230 Q90 200 180 225 T${W} 215 V${H} H0 Z`} fill={far} />
      <path d={`M0 300 Q120 260 220 290 T${W} 280 V${H} H0 Z`} fill={near} />
      <path d={`M0 380 Q140 350 240 370 T${W} 360 V${H} H0 Z`} fill={meadow} />
    </g>
  )
}

function River({ m }: { m: Mood }) {
  const water = m.season === 'winter' ? P.snowShade : P.water
  return <path d={`M${W} 300 C 300 330, 330 380, 280 420 S 330 520, 300 ${H}`} fill="none" stroke={water} strokeWidth={14} strokeLinecap="round" opacity={0.85} />
}

/** Pfad: verbindet die Plätze in Reihenfolge (von unten nach oben). */
function Path() {
  const pts = SLOTS.map((s) => `${(s.x / 100) * W} ${(s.y / 100) * H + 4}`)
  return <path d={`M ${W / 2} ${H} L ${pts.join(' L ')}`} fill="none" stroke={P.thatch} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
}

/** Die alte Turmwarte (Wahrzeichen, oben links). */
function Watchtower({ m }: { m: Mood }) {
  return (
    <g transform="translate(46 232)">
      <path d="M-10 0 l3 -54 h14 l3 54 z" fill={P.stoneDark} stroke={P.outline} strokeWidth={STROKE.main} />
      <path d="M-12 -54 h24 l-4 -8 h-16 z" fill={P.stone} stroke={P.outline} strokeWidth={STROKE.main} />
      <rect x={-3} y={-50} width={6} height={7} fill={isDark(m) ? P.glow : P.windowDark} stroke={P.outline} strokeWidth={STROKE.fine} />
      {isDark(m) ? <circle cx={0} cy={-47} r={10} fill={P.glow} opacity={0.35} /> : null}
    </g>
  )
}

function Trees({ m }: { m: Mood }) {
  const rnd = seeded('valley-trees')
  const trees = Array.from({ length: 14 }, (_, i) => ({ x: vary(rnd, 10, W - 10), y: vary(rnd, 250, H - 20), s: vary(rnd, 0.7, 1.2), i }))
  // Keine Bäume auf den Plätzen
  const free = trees.filter((t) => SLOTS.every((s) => Math.hypot((s.x / 100) * W - t.x, (s.y / 100) * H - t.y) > 34))
  return (
    <g>
      {paintOrder(free).map((t) => (
        <Tree key={t.i} x={t.x} y={t.y} s={t.s} m={m} />
      ))}
    </g>
  )
}

export function Backdrop({ m, id = 'map' }: { m: Mood; id?: string }) {
  return (
    <g>
      <Sky m={m} id={id} />
      <Mountains />
      <Hills m={m} />
      <River m={m} />
      <Path />
      <Watchtower m={m} />
      <Trees m={m} />
    </g>
  )
}

/** Tageszeit-Licht über allem (Aquarell-Lasur). */
export function Shade({ m }: { m: Mood }) {
  const [c, a] = SHADE[m.daypart]
  return a > 0 ? <rect x={0} y={0} width={W} height={H} fill={c} opacity={a} pointerEvents="none" /> : null
}

export function Snow({ m }: { m: Mood }) {
  if (m.season !== 'winter') return null
  const rnd = seeded('snow')
  return (
    <g opacity={0.9}>
      {Array.from({ length: 24 }, (_, i) => (
        <circle key={i} cx={vary(rnd, 0, W)} cy={vary(rnd, 0, H)} r={1.5} fill={P.snow} />
      ))}
    </g>
  )
}
