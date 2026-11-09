/**
 * Bausteine der Bauwerke. Koordinaten: Fußpunkt (0, 0) unten Mitte,
 * Gebäude wachsen nach oben (negative y). Maßeinheit: 1 = 1 px bei Maßstab 1;
 * die Lehrlingsfigur ist 24 hoch (kunststil.md, Maßtabelle).
 */
import type { Mood } from '@engine/art'
import { FOLIAGE, isDark, P, windowColor } from './palette'
import { STROKE } from './stroke'

const o = { stroke: P.outline, strokeWidth: STROKE.main, strokeLinejoin: 'round' as const }

export function Wall({ x, y, w, h, fill = P.wood }: { x: number; y: number; w: number; h: number; fill?: string }) {
  return <rect x={x} y={y} width={w} height={h} fill={fill} {...o} />
}

/** Satteldach: Traufe bei y, First bei y − h. */
export function Roof({ x, y, w, h, fill = P.roof }: { x: number; y: number; w: number; h: number; fill?: string }) {
  return <polygon points={`${x - 3},${y} ${x + w / 2},${y - h} ${x + w + 3},${y}`} fill={fill} {...o} />
}

export function Window({ x, y, m, w = 6, h = 7 }: { x: number; y: number; m: Mood; w?: number; h?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx={1} fill={windowColor(m)} stroke={P.outline} strokeWidth={STROKE.fine} />
}

export function Door({ x, y, w = 8, h = 12 }: { x: number; y: number; w?: number; h?: number }) {
  return <path d={`M${x} ${y} v${-h + w / 2} a${w / 2} ${w / 2} 0 0 1 ${w} 0 v${h - w / 2} z`} fill={P.woodDark} {...o} />
}

export function Chimney({ x, y, m, smoke = true }: { x: number; y: number; m: Mood; smoke?: boolean }) {
  return (
    <g>
      <rect x={x} y={y - 10} width={5} height={10} fill={P.stoneDark} stroke={P.outline} strokeWidth={STROKE.fine} />
      {smoke ? <path d={`M${x + 2.5} ${y - 12} q-4 -5 0 -9 q4 -4 0 -9`} fill="none" stroke={isDark(m) ? P.stoneLight : P.mist} strokeWidth={STROKE.main} strokeLinecap="round" opacity={0.8} /> : null}
    </g>
  )
}

export function Banner({ x, y, fill = P.clothBlue }: { x: number; y: number; fill?: string }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y - 16} stroke={P.outline} strokeWidth={STROKE.main} />
      <path d={`M${x} ${y - 16} h9 l-3 4 l3 4 h-9 z`} fill={fill} stroke={P.outline} strokeWidth={STROKE.fine} />
    </g>
  )
}

/** Warmer Lichtschein (sparsamer Akzent), nachts stärker. */
export function Glow({ x, y, r = 10, m }: { x: number; y: number; r?: number; m: Mood }) {
  return <circle cx={x} cy={y} r={r} fill={P.glow} opacity={isDark(m) ? 0.45 : 0.18} />
}

export function Lantern({ x, y, m }: { x: number; y: number; m: Mood }) {
  return (
    <g>
      <Glow x={x} y={y - 3} r={6} m={m} />
      <rect x={x - 2} y={y - 6} width={4} height={6} fill={P.glow} stroke={P.outline} strokeWidth={STROKE.fine} />
    </g>
  )
}

/** Bodenplatte unter jedem Bauwerk (Aquarell-Fleck). */
export function Base({ w = 44, fill = P.grassDark }: { w?: number; fill?: string }) {
  return <ellipse cx={0} cy={0} rx={w / 2} ry={5} fill={fill} opacity={0.55} />
}

export function Tree({ x, y, s = 1, m }: { x: number; y: number; s?: number; m: Mood }) {
  const [a, b] = FOLIAGE[m.season]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-1.5} y={-8} width={3} height={8} fill={P.woodDark} />
      <circle cx={0} cy={-14} r={8} fill={a} stroke={P.outline} strokeWidth={STROKE.fine} />
      <circle cx={4} cy={-11} r={4} fill={b} opacity={0.8} />
    </g>
  )
}

/** Wildnis: Dornen, Geröll und Nebel auf einem noch gesperrten Platz. */
export function Wilds({ variant, m }: { variant: number; m: Mood }) {
  const k = variant % 3
  return (
    <g>
      <ellipse cx={0} cy={-2} rx={22} ry={7} fill={P.rubble} opacity={0.6} />
      <circle cx={-12} cy={-4} r={4} fill={P.stoneDark} stroke={P.outline} strokeWidth={STROKE.fine} />
      <circle cx={10} cy={-3} r={3} fill={P.stone} stroke={P.outline} strokeWidth={STROKE.fine} />
      <path d={k === 0 ? 'M-16 -2 q6 -20 14 -6 q4 -16 12 -2 q6 -14 8 2' : k === 1 ? 'M-14 -2 q4 -16 10 -4 q6 -18 14 -2' : 'M-18 -2 q8 -14 12 -2 q4 -20 10 -4 q6 -12 10 4'} fill="none" stroke={P.thorn} strokeWidth={STROKE.bold} strokeLinecap="round" />
      <path d="M-6 -12 l-3 -2 M4 -14 l3 -2 M12 -8 l3 -1" stroke={P.thorn} strokeWidth={STROKE.fine} />
      <ellipse cx={2} cy={-8} rx={20} ry={6} fill={P.mist} opacity={m.daypart === 'night' ? 0.25 : 0.45} />
    </g>
  )
}
