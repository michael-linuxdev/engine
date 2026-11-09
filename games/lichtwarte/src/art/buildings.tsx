/**
 * Die zehn Bauwerke, je in vier Ausbaustufen (1–4). Fußpunkt (0, 0), Breite ≈ 50.
 * Stufe 1: einfacher Bau · 2: fertiges Bauwerk · 3: Erweiterung · 4: prächtig, mit Lichtern.
 */
import type { Mood } from '@engine/art'
import { Banner, Base, Chimney, Door, Glow, Lantern, Roof, Tree, Wall, Window } from './parts'
import { STROKE } from './stroke'
import { isDark, P } from './palette'

export interface BuildingProps {
  tier: number
  m: Mood
}

const line = { stroke: P.outline, strokeWidth: STROKE.main, strokeLinejoin: 'round' as const }

export function Kraeuterkate({ tier, m }: BuildingProps) {
  return (
    <g>
      <Base />
      <Wall x={-14} y={-20} w={28} h={20} fill={tier >= 2 ? P.woodLight : P.wood} />
      <Roof x={-14} y={-20} w={28} h={tier >= 2 ? 16 : 12} fill={P.thatch} />
      <Door x={-4} y={0} />
      <Window x={6} y={-15} m={m} />
      {tier >= 2 ? <path d="M-12 -6 l-6 0 l0 6" fill="none" {...line} /> : null}
      {tier >= 2 ? <circle cx={-16} cy={-9} r={3} fill={P.grassLight} stroke={P.outline} strokeWidth={STROKE.fine} /> : null}
      {tier >= 3 ? (
        <g>
          <Wall x={14} y={-14} w={12} h={14} fill={P.wood} />
          <Roof x={14} y={-14} w={12} h={8} fill={P.thatchDark} />
          <path d="M-10 -26 v4 M-5 -30 v4 M2 -30 v4" stroke={P.grassDark} strokeWidth={STROKE.main} />
        </g>
      ) : null}
      {tier >= 4 ? (
        <g>
          <Chimney x={-10} y={-24} m={m} />
          <Lantern x={-18} y={-2} m={m} />
          <Glow x={0} y={-30} r={9} m={m} />
        </g>
      ) : null}
    </g>
  )
}

export function Holzlager({ tier, m }: BuildingProps) {
  const logs = (y: number, n: number) => Array.from({ length: n }, (_, i) => <circle key={`${y}-${i}`} cx={-15 + i * 6} cy={y} r={3} fill={P.woodLight} stroke={P.outline} strokeWidth={STROKE.fine} />)
  return (
    <g>
      <Base w={50} />
      <path d="M-20 0 v-20 M20 0 v-20" {...line} />
      <polygon points="-24,-20 0,-30 24,-20" fill={tier >= 2 ? P.roof : P.woodDark} {...line} />
      {logs(-3, 6)}
      {tier >= 2 ? logs(-9, 6) : null}
      {tier >= 3 ? logs(-15, 5) : null}
      {tier >= 3 ? <path d="M22 0 l8 -12 l4 3 l-8 12 z" fill={P.metal} {...line} /> : null}
      {tier >= 4 ? (
        <g>
          <Lantern x={0} y={-21} m={m} />
          <Banner x={-22} y={-20} fill={P.clothViolet} />
        </g>
      ) : null}
    </g>
  )
}

export function Steinbruch({ tier, m }: BuildingProps) {
  return (
    <g>
      <Base w={52} fill={P.stoneDark} />
      <path d="M-24 0 l6 -24 l14 -8 l16 4 l12 28 z" fill={P.stone} {...line} />
      <path d="M-14 -16 l8 4 l6 -6 M2 -24 l6 8" fill="none" stroke={P.stoneLight} strokeWidth={STROKE.main} />
      {tier >= 2 ? <rect x={-6} y={-8} width={12} height={8} fill={P.stoneLight} {...line} /> : null}
      {tier >= 2 ? <path d="M-8 -10 l4 -3 M8 -12 l2 -4" stroke={P.glow} strokeWidth={STROKE.main} /> : null}
      {tier >= 3 ? (
        <g>
          <path d="M16 0 v-26 l10 6" fill="none" {...line} />
          <line x1={26} y1={-20} x2={26} y2={-10} stroke={P.outline} strokeWidth={STROKE.fine} />
          <rect x={22} y={-10} width={8} height={6} fill={P.stoneLight} {...line} />
        </g>
      ) : null}
      {tier >= 4 ? (
        <g>
          <Glow x={-2} y={-18} r={8} m={m} />
          <path d="M-4 -22 l3 -4 l3 4" fill={P.glowSoft} stroke={P.outline} strokeWidth={STROKE.fine} />
          <Lantern x={-18} y={-2} m={m} />
        </g>
      ) : null}
    </g>
  )
}

export function Quellschrein({ tier, m }: BuildingProps) {
  return (
    <g>
      <Base w={46} fill={P.waterLight} />
      <ellipse cx={0} cy={-3} rx={16} ry={5} fill={P.water} {...line} />
      <path d="M-12 -3 v-14 M12 -3 v-14" stroke={P.stoneDark} strokeWidth={STROKE.bold} />
      <path d={tier >= 2 ? 'M-16 -17 q16 -16 32 0 z' : 'M-14 -17 h28'} fill={tier >= 2 ? P.stone : 'none'} {...line} />
      <ellipse cx={0} cy={-3} rx={8} ry={2} fill={P.waterLight} opacity={isDark(m) ? 0.9 : 0.6} />
      {tier >= 3 ? (
        <g>
          <circle cx={-20} cy={-2} r={4} fill={P.stoneLight} {...line} />
          <circle cx={20} cy={-2} r={4} fill={P.stoneLight} {...line} />
          <path d="M-4 -26 l4 -6 l4 6 z" fill={P.stoneLight} {...line} />
        </g>
      ) : null}
      {tier >= 4 ? (
        <g>
          <Glow x={0} y={-6} r={12} m={m} />
          <circle cx={-6} cy={-12} r={1.5} fill={P.glowSoft} />
          <circle cx={5} cy={-14} r={1.5} fill={P.glowSoft} />
          <circle cx={1} cy={-20} r={1.5} fill={P.glowSoft} />
        </g>
      ) : null}
    </g>
  )
}

export function Schmiede({ tier, m }: BuildingProps) {
  return (
    <g>
      <Base w={50} />
      <Wall x={-18} y={-22} w={36} h={22} fill={P.stone} />
      <Roof x={-18} y={-22} w={36} h={12} fill={tier >= 2 ? P.slate : P.woodDark} />
      <rect x={-12} y={-12} width={12} height={12} fill={P.windowDark} {...line} />
      <circle cx={-6} cy={-5} r={3} fill={P.ember} />
      <Glow x={-6} y={-6} r={7} m={m} />
      <Chimney x={8} y={-26} m={m} />
      {tier >= 2 ? <path d="M6 -3 h10 l-2 -4 h-6 z" fill={P.metal} {...line} /> : null}
      {tier >= 3 ? (
        <g>
          <Wall x={18} y={-14} w={12} h={14} fill={P.woodDark} />
          <path d="M18 -14 l6 -6 l6 6" fill={P.slate} {...line} />
          <path d="M22 -6 l6 -6" stroke={P.metalLight} strokeWidth={STROKE.main} />
        </g>
      ) : null}
      {tier >= 4 ? (
        <g>
          <Banner x={-18} y={-22} fill={P.ember} />
          <Lantern x={26} y={-16} m={m} />
          <circle cx={-2} cy={-16} r={1.2} fill={P.glowHot} />
          <circle cx={2} cy={-19} r={1.2} fill={P.glowHot} />
        </g>
      ) : null}
    </g>
  )
}

export function Kartenstube({ tier, m }: BuildingProps) {
  return (
    <g>
      <Base w={48} />
      <Wall x={-15} y={-26} w={30} h={26} fill={P.paper} />
      <path d="M-15 -14 h30" stroke={P.outline} strokeWidth={STROKE.fine} />
      <Roof x={-15} y={-26} w={30} h={14} fill={P.roof} />
      <Window x={-10} y={-22} m={m} />
      <Window x={4} y={-22} m={m} />
      <Door x={-4} y={0} />
      {tier >= 2 ? <path d="M-24 -6 h8 v-8 h-8 z" fill={P.paper} {...line} /> : null}
      {tier >= 2 ? <path d="M-22 -12 l4 2 l-2 2" fill="none" stroke={P.clothBlue} strokeWidth={STROKE.fine} /> : null}
      {tier >= 3 ? (
        <g>
          <rect x={-5} y={-48} width={10} height={10} fill={P.paper} {...line} />
          <path d="M-7 -48 l7 -8 l7 8" fill={P.roof} {...line} />
          <Window x={-2} y={-46} m={m} w={4} h={5} />
        </g>
      ) : null}
      {tier >= 4 ? (
        <g>
          <circle cx={0} cy={-60} r={3} fill="none" stroke={P.metalLight} strokeWidth={STROKE.main} />
          <path d="M0 -63 v-4 M-3 -60 h-3" stroke={P.metalLight} strokeWidth={STROKE.fine} />
          <Lantern x={18} y={-2} m={m} />
        </g>
      ) : null}
    </g>
  )
}

export function Alchemistenturm({ tier, m }: BuildingProps) {
  const h = tier >= 3 ? 48 : tier >= 2 ? 40 : 30
  return (
    <g>
      <Base w={40} />
      <path d={`M-10 0 v-${h} h20 v${h} z`} fill={P.stone} {...line} />
      <polygon points={`-13,-${h} 0,-${h + 18} 13,-${h}`} fill={P.clothViolet} {...line} />
      <Window x={-3} y={-h + 6} m={m} />
      <Window x={-3} y={-h / 2} m={m} />
      <Door x={-4} y={0} w={8} h={10} />
      {tier >= 2 ? (
        <g>
          <circle cx={16} cy={-6} r={5} fill={P.grassLight} opacity={0.8} {...line} />
          <rect x={14} y={-14} width={4} height={4} fill={P.metalLight} />
        </g>
      ) : null}
      {tier >= 3 ? <path d={`M10 -${h - 10} q10 0 10 8 v6`} fill="none" stroke={P.metal} strokeWidth={STROKE.main} /> : null}
      {tier >= 4 ? (
        <g>
          <Glow x={0} y={-h - 10} r={10} m={m} />
          <circle cx={-6} cy={-h - 24} r={2} fill={P.clothViolet} />
          <circle cx={5} cy={-h - 28} r={2} fill={P.glow} />
          <circle cx={0} cy={-h - 34} r={1.5} fill={P.waterLight} />
        </g>
      ) : null}
    </g>
  )
}

export function Greifenhorst({ tier, m }: BuildingProps) {
  return (
    <g>
      <Base w={46} fill={P.stoneDark} />
      <path d="M-18 0 l4 -24 h28 l4 24 z" fill={P.stone} {...line} />
      <path d="M-16 -24 q16 -10 32 0" fill={P.woodLight} {...line} />
      <path d="M-14 -26 l6 -3 M-2 -29 l4 -1 M8 -28 l5 2" stroke={P.woodDark} strokeWidth={STROKE.fine} />
      {tier >= 2 ? (
        <g>
          <ellipse cx={2} cy={-32} rx={8} ry={5} fill={P.feather} {...line} />
          <circle cx={9} cy={-36} r={3.5} fill={P.feather} {...line} />
          <path d="M12 -36 l4 1 l-4 1.5" fill={P.glowHot} stroke={P.outline} strokeWidth={STROKE.fine} />
          <path d="M-4 -34 q-8 -10 -14 -6 q6 2 8 8" fill={P.woodLight} {...line} />
        </g>
      ) : null}
      {tier >= 3 ? <Banner x={-16} y={-24} fill={P.clothBlue} /> : null}
      {tier >= 4 ? (
        <g>
          <path d="M-24 -46 q4 -4 8 0 q4 -4 8 0" fill="none" stroke={P.outline} strokeWidth={STROKE.main} />
          <Lantern x={16} y={-24} m={m} />
          <Glow x={6} y={-34} r={9} m={m} />
        </g>
      ) : null}
    </g>
  )
}

export function Runenhalle({ tier, m }: BuildingProps) {
  return (
    <g>
      <Base w={56} fill={P.stoneDark} />
      <rect x={-22} y={-24} width={44} height={24} fill={P.stoneLight} {...line} />
      <polygon points="-26,-24 0,-38 26,-24" fill={P.stone} {...line} />
      <path d="M-14 0 v-20 M0 0 v-20 M14 0 v-20" stroke={P.stoneDark} strokeWidth={STROKE.bold} />
      {tier >= 2 ? <path d="M-6 -30 l3 -4 l3 4 l3 -4 l3 4" fill="none" stroke={isDark(m) ? P.glow : P.clothBlue} strokeWidth={STROKE.main} /> : null}
      {tier >= 3 ? (
        <g>
          <rect x={-30} y={-14} width={8} height={14} fill={P.stone} {...line} />
          <rect x={22} y={-14} width={8} height={14} fill={P.stone} {...line} />
          <path d="M-28 -10 v6 M24 -10 l4 6" stroke={P.glow} strokeWidth={STROKE.main} />
        </g>
      ) : null}
      {tier >= 4 ? (
        <g>
          <Glow x={0} y={-30} r={12} m={m} />
          <Lantern x={-7} y={-2} m={m} />
          <Lantern x={7} y={-2} m={m} />
        </g>
      ) : null}
    </g>
  )
}

export function Sternwarte({ tier, m }: BuildingProps) {
  return (
    <g>
      <Base w={52} />
      <rect x={-16} y={-26} width={32} height={26} fill={P.stoneLight} {...line} />
      <path d="M-18 -26 a18 18 0 0 1 36 0 z" fill={tier >= 2 ? P.clothBlue : P.stoneDark} {...line} />
      <Door x={-4} y={0} />
      <Window x={-12} y={-18} m={m} />
      <Window x={6} y={-18} m={m} />
      {tier >= 2 ? <path d="M4 -38 l14 -10 l3 4 l-14 10 z" fill={P.metal} {...line} /> : null}
      {tier >= 3 ? (
        <g>
          <path d="M-22 0 v-16 h-8 v16" fill={P.stone} {...line} />
          <circle cx={-26} cy={-20} r={4} fill={P.glowSoft} stroke={P.outline} strokeWidth={STROKE.fine} />
        </g>
      ) : null}
      {tier >= 4 ? (
        <g>
          <Glow x={20} y={-48} r={10} m={m} />
          <path d="M-6 -50 l1 -3 l1 3 l3 1 l-3 1 l-1 3 l-1 -3 l-3 -1 z" fill={P.glow} />
          <path d="M10 -58 l1 -2 l1 2 l2 1 l-2 1 l-1 2 l-1 -2 l-2 -1 z" fill={P.glowSoft} />
          <Tree x={24} y={0} s={0.7} m={m} />
        </g>
      ) : null}
    </g>
  )
}
