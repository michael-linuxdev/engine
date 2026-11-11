/**
 * Bausteine der Bauwerke. Koordinaten: Fußpunkt (0, 0) unten Mitte,
 * Gebäude wachsen nach oben (negative y). Maßeinheit: 1 = 1 px bei Maßstab 1;
 * die Lehrlingsfigur ist 24 hoch (kunststil.md, Maßtabelle).
 * Jede Fläche hat eine Lichtseite (links) und eine Schattenseite (rechts): Das Licht kommt von der Warte.
 */
import type { Mood } from '@engine/art'
import { FOLIAGE, isDark, P, windowColor } from './palette'
import { STROKE } from './stroke'

const o = { stroke: P.outline, strokeWidth: STROKE.main, strokeLinejoin: 'round' as const }
const fine = { stroke: P.outline, strokeWidth: STROKE.fine, strokeLinejoin: 'round' as const }

export function Wall({ x, y, w, h, fill = P.wood }: { x: number; y: number; w: number; h: number; fill?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} {...o} />
      {/* Lichtseite, Schattenseite, Sockel */}
      <rect x={x + 1} y={y + 1} width={w * 0.3} height={h - 2} fill={P.white} opacity={0.14} />
      <rect x={x + w * 0.68} y={y + 1} width={w * 0.32 - 1} height={h - 2} fill={P.outline} opacity={0.14} />
      <rect x={x + 1} y={y + h - 3.5} width={w - 2} height={2.5} fill={P.outline} opacity={0.22} />
    </g>
  )
}

/** Satteldach: Traufe bei y, First bei y − h. Rechte Hälfte im Schatten, helle Firstkante. */
export function Roof({ x, y, w, h, fill = P.roof }: { x: number; y: number; w: number; h: number; fill?: string }) {
  const mx = x + w / 2
  return (
    <g>
      <polygon points={`${x - 3},${y} ${mx},${y - h} ${x + w + 3},${y}`} fill={fill} {...o} />
      <polygon points={`${mx},${y - h + 1.5} ${x + w + 1},${y - 1} ${mx},${y - 1}`} fill={P.outline} opacity={0.18} />
      <path d={`M${x + w * 0.16} ${y - h * 0.28} l${w * 0.14} ${-h * 0.3} M${x + w * 0.06} ${y - 2.5} h${w * 0.3}`} fill="none" stroke={P.white} strokeWidth={STROKE.fine} strokeLinecap="round" opacity={0.3} />
    </g>
  )
}

export function Window({ x, y, m, w = 6, h = 7 }: { x: number; y: number; m: Mood; w?: number; h?: number }) {
  const lit = isDark(m)
  return (
    <g>
      {lit ? <rect x={x - 1.5} y={y - 1.5} width={w + 3} height={h + 3} rx={2.5} fill={P.glowHot} opacity={0.35} /> : null}
      <rect x={x} y={y} width={w} height={h} rx={1} fill={windowColor(m)} {...fine} />
      <path d={`M${x + w / 2} ${y + 0.5} v${h - 1} M${x + 0.5} ${y + h * 0.45} h${w - 1}`} stroke={P.outline} strokeWidth={0.6} opacity={0.7} />
      {lit ? null : <path d={`M${x + 1} ${y + h - 1.5} l${w * 0.35} ${-h * 0.5}`} stroke={P.white} strokeWidth={0.8} strokeLinecap="round" opacity={0.35} />}
      <rect x={x - 1} y={y + h} width={w + 2} height={1.4} fill={P.woodDark} />
    </g>
  )
}

export function Door({ x, y, w = 8, h = 12 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <path d={`M${x} ${y} v${-h + w / 2} a${w / 2} ${w / 2} 0 0 1 ${w} 0 v${h - w / 2} z`} fill={P.woodDark} {...o} />
      <path d={`M${x + w / 2} ${y - 1} v${-h + 2}`} stroke={P.outline} strokeWidth={0.6} opacity={0.6} />
      <circle cx={x + w - 2} cy={y - h * 0.42} r={0.8} fill={P.glow} />
      <rect x={x - 1.5} y={y - 0.6} width={w + 3} height={1.6} rx={0.6} fill={P.stoneLight} stroke={P.outline} strokeWidth={0.6} />
    </g>
  )
}

export function Chimney({ x, y, m, smoke = true }: { x: number; y: number; m: Mood; smoke?: boolean }) {
  return (
    <g>
      {smoke ? (
        <g className="lw-smoke" fill={isDark(m) ? P.stoneLight : P.mist}>
          <circle cx={x + 2.5} cy={y - 14} r={2.2} opacity={0.7} />
          <circle cx={x + 4.5} cy={y - 19} r={3} opacity={0.5} />
          <circle cx={x + 2} cy={y - 25} r={3.8} opacity={0.32} />
        </g>
      ) : null}
      <rect x={x} y={y - 10} width={5} height={10} fill={P.stoneDark} {...fine} />
      <rect x={x - 1} y={y - 11.5} width={7} height={2.2} fill={P.stone} {...fine} />
    </g>
  )
}

export function Banner({ x, y, fill = P.clothBlue }: { x: number; y: number; fill?: string }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y - 16} stroke={P.outline} strokeWidth={STROKE.main} strokeLinecap="round" />
      <path className="lw-flag" d={`M${x} ${y - 16} h9 l-3 4 l3 4 h-9 z`} fill={fill} {...fine} />
      <circle cx={x} cy={y - 16.5} r={1.1} fill={P.glow} stroke={P.outline} strokeWidth={0.5} />
    </g>
  )
}

/** Warmer Lichtschein (sparsamer Akzent), nachts stärker. */
export function Glow({ x, y, r = 10, m }: { x: number; y: number; r?: number; m: Mood }) {
  return (
    <g className="lw-glow">
      <circle cx={x} cy={y} r={r} fill={P.glow} opacity={isDark(m) ? 0.3 : 0.12} />
      <circle cx={x} cy={y} r={r * 0.55} fill={P.glowSoft} opacity={isDark(m) ? 0.4 : 0.14} />
    </g>
  )
}

export function Lantern({ x, y, m }: { x: number; y: number; m: Mood }) {
  return (
    <g>
      <Glow x={x} y={y - 3} r={6} m={m} />
      <path d={`M${x - 2.5} ${y - 6.5} h5 l-1 -2 h-3 z`} fill={P.metal} stroke={P.outline} strokeWidth={0.6} />
      <rect x={x - 2} y={y - 6} width={4} height={6} rx={0.6} fill={isDark(m) ? P.glowSoft : P.glow} {...fine} />
    </g>
  )
}

/** Bodenplatte unter jedem Bauwerk: Schlagschatten und Aquarell-Fleck. */
export function Base({ w = 44, fill = P.grassDark }: { w?: number; fill?: string }) {
  return (
    <g>
      <ellipse cx={3} cy={1.5} rx={w / 2 + 3} ry={6} fill={P.outline} opacity={0.16} />
      <ellipse cx={0} cy={0} rx={w / 2} ry={5} fill={fill} opacity={0.6} />
    </g>
  )
}

/** Laubbaum: drei Kronen-Ballen, Lichtfleck, Schatten am Boden. */
export function Tree({ x, y, s = 1, m }: { x: number; y: number; s?: number; m: Mood }) {
  const [a, b] = FOLIAGE[m.season]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={2} cy={0} rx={8} ry={2.2} fill={P.outline} opacity={0.16} />
      <path d="M-1.5 0 l0.5 -9 h2 l0.5 9 z" fill={P.woodDark} stroke={P.outline} strokeWidth={0.7} />
      <circle cx={-4.5} cy={-12} r={5.5} fill={a} {...fine} />
      <circle cx={4.5} cy={-12.5} r={5} fill={a} {...fine} />
      <circle cx={0} cy={-17} r={6.5} fill={a} {...fine} />
      <circle cx={0} cy={-13} r={5} fill={a} />
      <circle cx={3.5} cy={-12} r={3.4} fill={b} opacity={0.75} />
      <circle cx={-2.5} cy={-18.5} r={2.4} fill={P.white} opacity={0.22} />
    </g>
  )
}

/** Tanne: drei gestufte Dreiecke, rechts im Schatten. */
export function Fir({ x, y, s = 1, m }: { x: number; y: number; s?: number; m: Mood }) {
  const fill = m.season === 'winter' ? P.slate : P.grassDark
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={2} cy={0} rx={6.5} ry={1.8} fill={P.outline} opacity={0.16} />
      <rect x={-1} y={-4} width={2} height={4} fill={P.woodDark} />
      <path d="M-7 -3 L0 -14 L7 -3 Z M-5.5 -10 L0 -20 L5.5 -10 Z M-4 -16 L0 -25 L4 -16 Z" fill={fill} {...fine} />
      <path d="M0 -14 L7 -3 H0 Z M0 -20 L5.5 -10 H0 Z M0 -25 L4 -16 H0 Z" fill={P.outline} opacity={0.2} />
      {m.season === 'winter' ? <path d="M-4 -16 L0 -25 L4 -16 Q0 -18 -4 -16 Z M-5.5 -10 L-2.5 -15.5 Q0 -12 2.5 -15.5 L5.5 -10 Q0 -12.5 -5.5 -10 Z" fill={P.snow} /> : null}
    </g>
  )
}

/** Busch mit Beeren oder Blüten. */
export function Bush({ x, y, s = 1, m }: { x: number; y: number; s?: number; m: Mood }) {
  const [a, b] = FOLIAGE[m.season]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-7 0 q-2 -6 3 -7 q2 -4 6 -1 q5 0 4 8 z" fill={m.season === 'winter' ? P.snowShade : P.grassDark} {...fine} />
      <circle cx={-2} cy={-4} r={1} fill={b} />
      <circle cx={2.5} cy={-3} r={1} fill={a} />
    </g>
  )
}

/** Wildnis: Dornen, Geröll und Nebel auf einem noch gesperrten Platz. */
/**
 * Wildnis eines gesperrten Platzes, in drei deutlich verschiedenen Arten:
 * 0 Dornendickicht, 1 Geröllhalde mit Findling, 2 Nebelsenke mit kahlem Baum.
 */
export function Wilds({ variant, m }: { variant: number; m: Mood }) {
  const k = variant % 3
  const night = m.daypart === 'night'
  const mist = (
    <g className="lw-wildmist" fill={P.mist}>
      <ellipse cx={-4} cy={-7} rx={17} ry={5} opacity={night ? 0.22 : 0.4} />
      <ellipse cx={7} cy={-11} rx={13} ry={4} opacity={night ? 0.16 : 0.3} />
    </g>
  )
  if (k === 1) {
    return (
      <g>
        <ellipse cx={0} cy={-1} rx={24} ry={7} fill={P.rubble} opacity={0.6} />
        <path d="M-10 -1 l3 -13 l9 -5 l8 6 l2 12 z" fill={P.stone} {...fine} />
        <path d="M-7 -14 l9 -5 l3 8 l-8 3 z" fill={P.stoneLight} opacity={0.7} />
        <path d="M-20 -1 l2 -6 l6 -1 l3 5 z" fill={P.stoneDark} {...fine} />
        <path d="M11 -1 l2 -7 l6 0 l3 6 z" fill={P.stoneDark} {...fine} />
        <path d="M-2 -8 l4 3 M3 -12 l-2 5" stroke={P.outline} strokeWidth={STROKE.fine} opacity={0.5} strokeLinecap="round" />
        <path d="M-23 0 q1 -5 3 0 M20 0 q2 -6 3 0" fill="none" stroke={P.grassDark} strokeWidth={STROKE.fine} strokeLinecap="round" />
      </g>
    )
  }
  if (k === 2) {
    return (
      <g>
        <ellipse cx={0} cy={-1} rx={24} ry={7} fill={P.rubble} opacity={0.45} />
        <path d="M2 -1 v-16 M2 -11 l-7 -6 M2 -13 l6 -7 M-5 -17 l-3 -1 M8 -20 l3 0 M2 -17 l-2 -5" fill="none" stroke={P.thorn} strokeWidth={STROKE.bold} strokeLinecap="round" />
        <path d="M-16 -1 l2 -4 l4 0 l2 4 z" fill={P.stoneDark} {...fine} />
        <path d="M-22 0 q1 -5 3 0 M16 0 q2 -6 3 0 M10 0 q1 -4 2 0" fill="none" stroke={P.grassDark} strokeWidth={STROKE.fine} strokeLinecap="round" />
        <g className="lw-wildmist" fill={P.mist}>
          <ellipse cx={-2} cy={-5} rx={22} ry={6} opacity={night ? 0.3 : 0.55} />
          <ellipse cx={8} cy={-10} rx={16} ry={5} opacity={night ? 0.22 : 0.42} />
          <ellipse cx={-10} cy={-12} rx={11} ry={3.5} opacity={night ? 0.16 : 0.32} />
        </g>
      </g>
    )
  }
  return (
    <g>
      <ellipse cx={0} cy={-1} rx={23} ry={7} fill={P.rubble} opacity={0.55} />
      <path d="M-15 -1 l2 -6 l5 -1 l3 4 l-1 3 z" fill={P.stoneDark} {...fine} />
      <path d="M7 -1 l1 -4 l4 -1 l3 3 l-1 2 z" fill={P.stone} {...fine} />
      <path d="M-16 -2 q6 -20 14 -6 q4 -16 12 -2 q6 -14 8 2" fill="none" stroke={P.thorn} strokeWidth={STROKE.bold} strokeLinecap="round" />
      <path d="M-6 -12 l-3 -2 M4 -14 l3 -2 M12 -8 l3 -1 M-11 -9 l-2 -3 M0 -9 l1 -4" stroke={P.thorn} strokeWidth={STROKE.fine} strokeLinecap="round" />
      <path d="M-20 0 q1 -5 3 0 M17 0 q2 -6 3 0" fill="none" stroke={P.grassDark} strokeWidth={STROKE.fine} strokeLinecap="round" />
      {mist}
    </g>
  )
}
