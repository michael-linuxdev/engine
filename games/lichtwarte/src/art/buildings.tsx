/**
 * Die zehn Bauwerke, je in vier Ausbaustufen (1–4). Fußpunkt (0, 0), Breite bis ≈ 64, Höhe bis ≈ 84.
 * Jede Stufe ist sichtbar mehr Bauwerk, nicht nur ein Zusatz:
 * Stufe 1: ein Anfang · 2: fertiges Haus · 3: Anbau und Hof · 4: prächtig, mit Lichtern.
 */
import type { ReactNode } from 'react'
import type { Mood } from '@engine/art'
import { Banner, Base, Chimney, Door, Glow, Lantern, Roof, Tree, Wall, Window } from './parts'
import { STROKE } from './stroke'
import { isDark, P, windowColor } from './palette'

export interface BuildingProps {
  tier: number
  m: Mood
}

const line = { stroke: P.outline, strokeWidth: STROKE.main, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }
const fine = { stroke: P.outline, strokeWidth: STROKE.fine, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }

const at = (tier: number, n: number, node: ReactNode) => (tier >= n ? node : null)

/** Fachwerk-Balken auf einer Wand. */
function Timber({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <path d={`M${x} ${y + h / 2} h${w} M${x + w / 3} ${y} v${h} M${x + (2 * w) / 3} ${y} v${h}`} stroke={P.woodDark} strokeWidth={1.2} opacity={0.8} />
}

/** Mauerfugen: ein paar versetzte Steine. */
function Bricks({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <path
      d={`M${x + w * 0.1} ${y + h * 0.25} h${w * 0.25} M${x + w * 0.55} ${y + h * 0.4} h${w * 0.3} M${x + w * 0.2} ${y + h * 0.6} h${w * 0.3} M${x + w * 0.6} ${y + h * 0.78} h${w * 0.25}`}
      stroke={P.outline}
      strokeWidth={0.7}
      strokeLinecap="round"
      opacity={0.35}
    />
  )
}

function Fence({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g stroke={P.woodDark} strokeWidth={1.2} strokeLinecap="round">
      <path d={`M${x} ${y - 3.5} h${n * 4}`} />
      {Array.from({ length: n + 1 }, (_, i) => (
        <path key={i} d={`M${x + i * 4} ${y} v-6`} />
      ))}
    </g>
  )
}

function Barrel({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 3} y={y - 7} width={6} height={7} rx={1.5} fill={P.wood} {...fine} />
      <path d={`M${x - 3} ${y - 5} h6 M${x - 3} ${y - 2} h6`} stroke={P.metal} strokeWidth={0.8} />
    </g>
  )
}

function Crate({ x, y, fill = P.woodLight }: { x: number; y: number; fill?: string }) {
  return (
    <g>
      <rect x={x - 3.5} y={y - 6} width={7} height={6} fill={fill} {...fine} />
      <path d={`M${x - 3.5} ${y - 6} l7 6 M${x + 3.5} ${y - 6} l-7 6`} stroke={P.woodDark} strokeWidth={0.6} />
    </g>
  )
}

/** Blumen- oder Kräuterbeet. */
function Bed({ x, y, w, bloom = P.blossom }: { x: number; y: number; w: number; bloom?: string }) {
  const n = Math.max(2, Math.round(w / 4))
  return (
    <g>
      <rect x={x} y={y - 2.5} width={w} height={2.5} rx={1} fill={P.woodDark} {...fine} />
      {Array.from({ length: n }, (_, i) => {
        const cx = x + 2 + (i * (w - 4)) / (n - 1)
        return (
          <g key={i}>
            <path d={`M${cx} ${y - 2.5} v-3`} stroke={P.grassDark} strokeWidth={1} />
            <circle cx={cx} cy={y - 6} r={1.5} fill={i % 2 ? bloom : P.grassLight} stroke={P.outline} strokeWidth={0.5} />
          </g>
        )
      })}
    </g>
  )
}

function Star({ x, y, s = 1, fill = P.glow }: { x: number; y: number; s?: number; fill?: string }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -3 l0.9 2.1 l2.1 0.9 l-2.1 0.9 l-0.9 2.1 l-0.9 -2.1 l-2.1 -0.9 l2.1 -0.9 z" fill={fill} />
}

export function Kraeuterkate({ tier, m }: BuildingProps) {
  const big = tier >= 3
  const w = tier >= 2 ? 30 : 24
  const h = big ? 24 : tier >= 2 ? 20 : 16
  return (
    <g>
      <Base w={tier >= 3 ? 62 : 46} />
      {at(tier, 4, <Glow x={0} y={-h - 8} r={16} m={m} />)}
      {/* Anbau mit Trockenboden */}
      {at(
        tier,
        3,
        <g>
          <Wall x={w / 2 - 1} y={-15} w={15} h={15} fill={P.wood} />
          <Roof x={w / 2 - 1} y={-15} w={15} h={9} fill={P.thatchDark} />
          <Window x={w / 2 + 4} y={-11} m={m} w={5} h={5} />
        </g>,
      )}
      <Wall x={-w / 2} y={-h} w={w} h={h} fill={tier >= 2 ? P.paper : P.woodLight} />
      {at(tier, 2, <Timber x={-w / 2} y={-h} w={w} h={h} />)}
      <Roof x={-w / 2} y={-h} w={w} h={tier >= 2 ? 17 : 12} fill={P.thatch} />
      {at(tier, 2, <path d={`M${-w / 2 + 4} ${-h - 2} l3 -4 M${-w / 2 + 9} ${-h - 2} l3 -6 M${w / 2 - 9} ${-h - 2} l-3 -6`} stroke={P.thatchDark} strokeWidth={0.9} strokeLinecap="round" />)}
      <Door x={-4} y={0} />
      <Window x={tier >= 2 ? 6 : 5} y={-h + 5} m={m} />
      {at(tier, 2, <Window x={-13} y={-h + 5} m={m} />)}
      {/* Kräuterbündel unter der Traufe */}
      <g stroke={P.outline} strokeWidth={0.5}>
        <path d={`M-9 ${-h + 1} l-1.5 5 h3 z`} fill={P.grassLight} />
        {at(tier, 2, <path d={`M2 ${-h + 1} l-1.5 5 h3 z`} fill={P.blossom} />)}
        {at(tier, 3, <path d={`M-3.5 ${-h + 1} l-1.5 5 h3 z`} fill={P.clothViolet} />)}
      </g>
      {at(tier, 2, <Bed x={-w / 2 - 12} y={0} w={11} />)}
      {at(tier, 3, <Chimney x={-9} y={-h - 9} m={m} />)}
      {at(tier, 3, <Fence x={-w / 2 - 14} y={2} n={3} />)}
      {at(
        tier,
        4,
        <g>
          {/* Gaube, Ranken, Laterne, Schild */}
          <rect x={-5} y={-h - 13} width={10} height={8} fill={P.paper} {...fine} />
          <polygon points={`-7,${-h - 13} 0,${-h - 20} 7,${-h - 13}`} fill={P.thatch} {...fine} />
          <rect x={-2} y={-h - 11} width={4} height={4.5} rx={0.8} fill={windowColor(m)} {...fine} />
          <path d={`M${w / 2} -2 q-3 -8 0 -14 q2 -5 -1 -8`} fill="none" stroke={P.grassDark} strokeWidth={1.4} strokeLinecap="round" />
          <circle cx={w / 2 - 1} cy={-9} r={1.3} fill={P.blossom} />
          <circle cx={w / 2 + 0.5} cy={-17} r={1.3} fill={P.blossom} />
          <Lantern x={-w / 2 - 3} y={-7} m={m} />
          <Bed x={w / 2 + 16} y={0} w={10} bloom={P.glow} />
        </g>,
      )}
    </g>
  )
}

export function Holzlager({ tier, m }: BuildingProps) {
  const logs = (x: number, y: number, n: number) =>
    Array.from({ length: n }, (_, i) => (
      <g key={`${x}-${y}-${i}`}>
        <circle cx={x + i * 5.4} cy={y} r={2.7} fill={P.woodLight} {...fine} />
        <circle cx={x + i * 5.4} cy={y} r={1} fill="none" stroke={P.woodDark} strokeWidth={0.5} />
      </g>
    ))
  const wide = tier >= 3
  return (
    <g>
      <Base w={wide ? 62 : 48} />
      {tier === 1 ? (
        <g>
          {/* Stapel unter freiem Himmel, Hackklotz mit Axt */}
          {logs(-13, -3, 5)}
          {logs(-10.3, -8, 4)}
          <rect x={14} y={-5} width={7} height={5} rx={1} fill={P.wood} {...fine} />
          <path d="M17 -5 l5 -9" stroke={P.woodDark} strokeWidth={1.4} strokeLinecap="round" />
          <path d="M20 -15 l4 1 l-1 4 l-3 -1 z" fill={P.metalLight} {...fine} />
        </g>
      ) : (
        <g>
          <path d={`M${wide ? -26 : -20} 0 v-22 M${wide ? 26 : 20} 0 v-22 M0 0 v-22`} stroke={P.woodDark} strokeWidth={2.4} strokeLinecap="round" />
          <path d={`M${wide ? -26 : -20} -15 l5 -6 M${wide ? 26 : 20} -15 l-5 -6`} stroke={P.woodDark} strokeWidth={1.2} />
          {logs(wide ? -22 : -16, -3, wide ? 4 : 3)}
          {logs(wide ? -19.3 : -13.3, -8, wide ? 3 : 2)}
          {logs(4, -3, wide ? 4 : 3)}
          {logs(6.7, -8, wide ? 3 : 2)}
          {at(tier, 3, logs(-16.6, -13, 2))}
          {at(tier, 3, logs(9.4, -13, 2))}
          <polygon points={`${wide ? -31 : -25},-21 0,${wide ? -36 : -32} ${wide ? 31 : 25},-21`} fill={tier >= 3 ? P.roof : P.woodDark} {...line} />
          <polygon points={`0,${wide ? -34.5 : -30.5} ${wide ? 29 : 23},-22 0,-22`} fill={P.outline} opacity={0.18} />
        </g>
      )}
      {at(
        tier,
        3,
        <g>
          {/* Karren */}
          <path d="M28 -4 h12 l2 -5 h-13 z" fill={P.wood} {...fine} />
          <circle cx={33} cy={-2} r={2.6} fill={P.woodLight} {...fine} />
          <path d="M40 -6 l5 -3" stroke={P.woodDark} strokeWidth={1.2} strokeLinecap="round" />
          <Crate x={35} y={-9} />
        </g>,
      )}
      {at(
        tier,
        4,
        <g>
          {/* Sägegatter, Banner, Laternen */}
          <path d="M-40 0 v-16 h10 v16" fill="none" stroke={P.woodDark} strokeWidth={2} strokeLinejoin="round" />
          <circle cx={-35} cy={-9} r={5} fill={P.metalLight} {...fine} />
          <path d="M-35 -14 l1.5 2.5 M-30 -9 l-2.5 1.5 M-35 -4 l-1.5 -2.5 M-40 -9 l2.5 -1.5" stroke={P.outline} strokeWidth={0.8} />
          <circle cx={-35} cy={-9} r={1.2} fill={P.metal} />
          <Banner x={0} y={-35} fill={P.clothViolet} />
          <Lantern x={-13} y={-22} m={m} />
          <Lantern x={13} y={-22} m={m} />
          <Glow x={0} y={-16} r={14} m={m} />
        </g>,
      )}
    </g>
  )
}

export function Steinbruch({ tier, m }: BuildingProps) {
  const tall = tier >= 3
  return (
    <g>
      <Base w={tall ? 62 : 52} fill={P.stoneDark} />
      {/* Felswand */}
      <path d={tall ? 'M-28 0 l5 -28 l12 -12 l14 -4 l14 8 l8 36 z' : 'M-24 0 l6 -22 l13 -9 l16 4 l11 27 z'} fill={P.stone} {...line} />
      <path d={tall ? 'M3 -44 l14 8 l8 36 h-14 z' : 'M-5 -31 l16 4 l11 27 h-18 z'} fill={P.outline} opacity={0.16} />
      <path d={tall ? 'M-18 -22 l9 5 l7 -8 M-4 -36 l5 9 l8 -3 M8 -16 l8 4' : 'M-14 -15 l8 4 l6 -6 M2 -24 l6 8'} fill="none" stroke={P.stoneLight} strokeWidth={STROKE.main} strokeLinecap="round" />
      {at(tier, 2, <path d={tall ? 'M-12 -26 l3 -4 M4 -30 l3 3 M12 -12 l3 -3' : 'M-8 -10 l3 -3 M8 -14 l2 -4'} stroke={P.glow} strokeWidth={1.6} strokeLinecap="round" />)}
      {/* Spitzhacke am Fels */}
      {tier === 1 ? (
        <g>
          <path d="M12 0 l8 -12" stroke={P.woodDark} strokeWidth={1.4} strokeLinecap="round" />
          <path d="M16 -14 q5 -1 8 4" fill="none" stroke={P.metalLight} strokeWidth={2} strokeLinecap="round" />
        </g>
      ) : null}
      {at(
        tier,
        2,
        <g>
          {/* Gebrochene Blöcke */}
          <rect x={-8} y={-7} width={11} height={7} fill={P.stoneLight} {...fine} />
          <rect x={4} y={-5} width={8} height={5} fill={P.stoneLight} {...fine} />
          <rect x={-3} y={-12} width={8} height={5} fill={P.stoneLight} {...fine} />
        </g>,
      )}
      {at(
        tier,
        3,
        <g>
          {/* Kran mit Seil und Block, Lore auf Schienen */}
          <path d="M24 0 v-34 l-16 6" fill="none" stroke={P.woodDark} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
          <path d="M24 -24 l-8 -6" stroke={P.woodDark} strokeWidth={1.2} />
          <line x1={10} y1={-28} x2={10} y2={-17} stroke={P.outline} strokeWidth={0.8} />
          <rect x={6} y={-17} width={8} height={6} fill={P.stoneLight} {...fine} />
          <path d="M-34 1 h16" stroke={P.metal} strokeWidth={1.2} />
          <path d="M-32 -1 h10 l-1.5 -5 h-7 z" fill={P.wood} {...fine} />
          <circle cx={-30} cy={0} r={1.6} fill={P.metalLight} {...fine} />
          <circle cx={-24} cy={0} r={1.6} fill={P.metalLight} {...fine} />
        </g>,
      )}
      {at(
        tier,
        4,
        <g>
          {/* Lichtadern und Kristalle, Laternen */}
          <Glow x={-6} y={-24} r={14} m={m} />
          <path d="M-10 -16 l3 -9 l4 9 z M-2 -13 l2 -6 l3 6 z" fill={P.glowSoft} {...fine} />
          <path d="M14 -30 l2 -6 l3 6 z" fill={P.waterLight} {...fine} />
          <Lantern x={-22} y={-2} m={m} />
          <Lantern x={24} y={-34} m={m} />
        </g>,
      )}
    </g>
  )
}

export function Quellschrein({ tier, m }: BuildingProps) {
  const lit = isDark(m)
  return (
    <g>
      <Base w={tier >= 3 ? 58 : 46} fill={P.waterLight} />
      {at(tier, 4, <Glow x={0} y={-14} r={20} m={m} />)}
      {/* Becken */}
      {at(tier, 3, <ellipse cx={0} cy={-2} rx={24} ry={6.5} fill={P.stoneLight} {...line} />)}
      <ellipse cx={0} cy={-3} rx={tier >= 3 ? 19 : 16} ry={5} fill={P.stone} {...line} />
      <ellipse cx={0} cy={-3.6} rx={tier >= 3 ? 15.5 : 12.5} ry={3.4} fill={P.water} {...fine} />
      <ellipse cx={-2} cy={-4} rx={tier >= 3 ? 8 : 6} ry={1.5} fill={P.waterLight} opacity={lit ? 0.95 : 0.7} />
      {tier === 1 ? (
        <g>
          {/* Nur moosige Steine um die Quelle */}
          <path d="M-18 -4 l2 -6 l5 -1 l2 5 z M11 -5 l2 -5 l5 1 l1 5 z" fill={P.stoneLight} {...fine} />
          <path d="M-15 -10 q2 -2 4 -1" stroke={P.grassLight} strokeWidth={1.6} strokeLinecap="round" fill="none" />
        </g>
      ) : (
        <g>
          {/* Säulen und Dach */}
          <rect x={-14} y={-24} width={4} height={20} fill={P.stoneLight} {...fine} />
          <rect x={10} y={-24} width={4} height={20} fill={P.stoneLight} {...fine} />
          {at(tier, 3, <rect x={-2} y={-24} width={4} height={19} fill={P.stoneLight} {...fine} opacity={0.9} />)}
          <rect x={-17} y={-27} width={34} height={4} fill={P.stone} {...fine} />
          {tier >= 4 ? (
            <g>
              <path d="M-16 -27 a16 14 0 0 1 32 0 z" fill={P.clothBlue} {...line} />
              <path d="M0 -41 a16 14 0 0 1 16 14 h-16 z" fill={P.outline} opacity={0.18} />
              <path d="M-3 -41 l3 -7 l3 7 z" fill={P.glowSoft} {...fine} />
            </g>
          ) : (
            <g>
              <polygon points="-19,-27 0,-38 19,-27" fill={P.slate} {...line} />
              <polygon points="0,-36.5 17,-27.6 0,-27.6" fill={P.outline} opacity={0.18} />
            </g>
          )}
        </g>
      )}
      {at(
        tier,
        3,
        <g>
          {/* Krüge und Blumen am Rand */}
          <path d="M-26 -3 q-3 -5 0 -8 h4 q3 3 0 8 z" fill={P.ember} {...fine} />
          <path d="M22 -3 q-3 -5 0 -8 h4 q3 3 0 8 z" fill={P.ember} {...fine} />
          <circle cx={-24} cy={-13} r={1.6} fill={P.blossom} stroke={P.outline} strokeWidth={0.5} />
          <circle cx={24} cy={-13} r={1.6} fill={P.blossom} stroke={P.outline} strokeWidth={0.5} />
          {/* Wasserstrahl */}
          <path d="M0 -20 q-5 6 -4 15 M0 -20 q5 6 4 15" fill="none" stroke={P.waterLight} strokeWidth={1.2} strokeLinecap="round" />
        </g>,
      )}
      {at(
        tier,
        4,
        <g fill={P.glowSoft}>
          <circle cx={-9} cy={-14} r={1.4} />
          <circle cx={7} cy={-17} r={1.4} />
          <circle cx={2} cy={-10} r={1.1} />
          <circle cx={-22} cy={-22} r={1.1} />
          <circle cx={21} cy={-25} r={1.1} />
        </g>,
      )}
    </g>
  )
}

export function Schmiede({ tier, m }: BuildingProps) {
  const w = tier >= 3 ? 40 : tier >= 2 ? 34 : 28
  const h = tier >= 3 ? 24 : 20
  const x = -w / 2
  return (
    <g>
      <Base w={tier >= 3 ? 64 : 50} />
      {at(tier, 4, <Glow x={x + 9} y={-8} r={16} m={m} />)}
      {/* Großer Schlot */}
      <Chimney x={x + w - 11} y={-h - (tier >= 2 ? 10 : 6)} m={m} />
      {at(tier, 4, <Chimney x={x + 4} y={-h - 9} m={m} />)}
      <Wall x={x} y={-h} w={w} h={h} fill={P.stone} />
      <Bricks x={x} y={-h} w={w} h={h} />
      <Roof x={x} y={-h} w={w} h={tier >= 2 ? 15 : 11} fill={tier >= 2 ? P.slate : P.woodDark} />
      {/* Esse */}
      <path d={`M${x + 3} 0 v-11 a6 6 0 0 1 12 0 v11 z`} fill={P.windowDark} {...line} />
      <path d={`M${x + 5} 0 q4 -11 8 0 z`} fill={P.ember} />
      <path d={`M${x + 7} 0 q2 -6 4 0 z`} fill={P.glow} />
      <Window x={x + w - 12} y={-h + 6} m={m} />
      {at(tier, 3, <Window x={x + 19} y={-h + 6} m={m} />)}
      {at(
        tier,
        2,
        <g>
          {/* Amboss vor der Tür */}
          <path d={`M${x + w + 2} 0 h8 v-3 h3 l-2 -3 h-10 l1 3 h0 z`} fill={P.metal} {...fine} />
          <rect x={x + w + 4} y={-3} width={4} height={3} fill={P.woodDark} {...fine} />
        </g>,
      )}
      {at(
        tier,
        3,
        <g>
          {/* Werkstatt-Anbau, Wassertrog, Werkzeug */}
          <Wall x={x - 13} y={-14} w={13} h={14} fill={P.wood} />
          <Roof x={x - 13} y={-14} w={13} h={8} fill={P.slate} />
          <path d={`M${x - 10} -3 v-8 M${x - 7} -3 v-7 M${x - 4} -3 v-8`} stroke={P.metalLight} strokeWidth={1.2} strokeLinecap="round" />
          <Barrel x={x + w + 16} y={0} />
        </g>,
      )}
      {at(
        tier,
        4,
        <g>
          <Banner x={x + w / 2} y={-h - 14} fill={P.ember} />
          <Lantern x={x + w + 1} y={-11} m={m} />
          <g fill={P.glowHot}>
            <circle cx={x + 7} cy={-16} r={1} />
            <circle cx={x + 12} cy={-19} r={0.8} />
            <circle cx={x + 4} cy={-21} r={0.8} />
          </g>
        </g>,
      )}
    </g>
  )
}

export function Kartenstube({ tier, m }: BuildingProps) {
  const h = tier >= 2 ? 28 : 20
  return (
    <g>
      <Base w={tier >= 3 ? 58 : 46} />
      {at(tier, 4, <Glow x={-18} y={-44} r={12} m={m} />)}
      {/* Eckturm */}
      {at(
        tier,
        3,
        <g>
          <Wall x={-26} y={-40} w={12} h={40} fill={P.paper} />
          <Timber x={-26} y={-40} w={12} h={40} />
          <polygon points="-28,-40 -20,-54 -12,-40" fill={P.roof} {...line} />
          <polygon points="-20,-52.5 -13,-40.6 -20,-40.6" fill={P.outline} opacity={0.18} />
          <Window x={-22.5} y={-34} m={m} w={5} h={6} />
          <path d="M-20 -54 v-6 M-23 -58 h6" stroke={P.outline} strokeWidth={1} />
        </g>,
      )}
      <Wall x={-15} y={-h} w={32} h={h} fill={P.paper} />
      {at(tier, 2, <Timber x={-15} y={-h} w={32} h={h} />)}
      <Roof x={-15} y={-h} w={32} h={15} fill={P.roof} />
      <Door x={-3} y={0} />
      <Window x={-11} y={-h + 4} m={m} />
      <Window x={7} y={-h + 4} m={m} />
      {at(tier, 2, <Window x={7} y={-12} m={m} />)}
      {at(
        tier,
        2,
        <g>
          {/* Aushängeschild: eine Karte */}
          <path d="M17 -18 h9" stroke={P.woodDark} strokeWidth={1.4} strokeLinecap="round" />
          <rect x={18.5} y={-17} width={8} height={7} fill={P.paper} {...fine} />
          <path d="M20 -12 l2 -3 l2 2 l1.5 -2" fill="none" stroke={P.clothBlue} strokeWidth={0.8} />
        </g>,
      )}
      {at(
        tier,
        3,
        <g>
          {/* Kartenrollen, Globus */}
          <path d="M20 -1 h9 M20 -3 h9" stroke={P.paper} strokeWidth={2} strokeLinecap="round" />
          <path d="M20 -1 h9 M20 -3 h9" stroke={P.outline} strokeWidth={0.5} opacity={0.5} />
          <circle cx={-32} cy={-7} r={3.5} fill={P.clothBlue} {...fine} />
          <path d="M-35.5 -7 h7 M-32 -3 v3 M-34.5 0 h5" stroke={P.woodDark} strokeWidth={1} />
        </g>,
      )}
      {at(
        tier,
        4,
        <g>
          {/* Fernrohr auf dem Turm, Fahnen, Laterne */}
          <path d="M-20 -60 l9 -5 l1.4 2.4 l-9 5 z" fill={P.metal} {...fine} />
          <Banner x={1} y={-h - 14} fill={P.clothBlue} />
          <Lantern x={-9} y={-9} m={m} />
          <Lantern x={6} y={-1} m={m} />
        </g>,
      )}
    </g>
  )
}

export function Alchemistenturm({ tier, m }: BuildingProps) {
  const h = [0, 30, 42, 52, 60][Math.min(4, Math.max(1, tier))]
  const lit = isDark(m)
  return (
    <g>
      <Base w={tier >= 3 ? 52 : 40} />
      {at(tier, 4, <Glow x={0} y={-h - 10} r={16} m={m} />)}
      {/* Nebenlabor */}
      {at(
        tier,
        3,
        <g>
          <Wall x={10} y={-18} w={14} h={18} fill={P.stoneLight} />
          <path d="M8 -18 a9 8 0 0 1 18 0 z" fill={P.clothViolet} {...line} />
          <circle cx={17} cy={-9} r={3} fill={lit ? P.glow : P.grassLight} {...fine} />
        </g>,
      )}
      {/* Turm, nach oben leicht verjüngt */}
      <path d={`M-11 0 L-9 ${-h} H9 L11 0 Z`} fill={P.stone} {...line} />
      <path d={`M2 ${-h + 1} H8 L10 -1 H2 Z`} fill={P.outline} opacity={0.15} />
      <Bricks x={-9} y={-h} w={18} h={h} />
      <path d={`M-12 ${-h} h24 l-1.5 -3 h-21 z`} fill={P.stoneDark} {...fine} />
      <polygon points={`-13,${-h - 3} 0,${-h - 23} 13,${-h - 3}`} fill={P.clothViolet} {...line} />
      <polygon points={`0,${-h - 21.5} 11,${-h - 3.6} 0,${-h - 3.6}`} fill={P.outline} opacity={0.18} />
      <Door x={-4} y={0} w={8} h={10} />
      <Window x={-3} y={-h + 5} m={m} />
      {at(tier, 2, <Window x={-3} y={-h + 18} m={m} />)}
      {at(tier, 3, <Window x={-3} y={-h + 31} m={m} />)}
      {at(
        tier,
        2,
        <g>
          {/* Kolben mit grünem Sud */}
          <path d="M-20 -1 q-5 -1 -4 -6 q1 -3 3 -4 v-3 h3 v3 q2 1 3 4 q1 5 -5 6 z" fill={P.grassLight} {...fine} />
          <path d="M-22.5 -5 h5" stroke={P.white} strokeWidth={0.8} opacity={0.6} />
        </g>,
      )}
      {at(tier, 3, <path d={`M9 ${-h + 12} q9 0 9 8 v${h - 38 > 0 ? h - 38 : 2}`} fill="none" stroke={P.metal} strokeWidth={2} strokeLinecap="round" />)}
      {at(
        tier,
        4,
        <g>
          {/* Erker-Balkon, bunte Blasen, Stern auf der Spitze */}
          <path d={`M-9 ${-h + 14} h-7 v5 h7`} fill={P.woodLight} {...fine} />
          <path d={`M-16 ${-h + 14} v-4 M-12.5 ${-h + 14} v-4`} stroke={P.woodDark} strokeWidth={1} />
          <circle cx={-7} cy={-h - 28} r={2.4} fill={P.clothViolet} {...fine} />
          <circle cx={6} cy={-h - 33} r={2} fill={P.glow} {...fine} />
          <circle cx={0} cy={-h - 39} r={1.6} fill={P.waterLight} {...fine} />
          <circle cx={19} cy={-27} r={1.6} fill={P.grassLight} {...fine} />
          <Star x={0} y={-h - 24.5} s={1.1} fill={P.glowSoft} />
          <Lantern x={-13} y={-1} m={m} />
        </g>,
      )}
    </g>
  )
}

function Griffin({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-5 -2 q-10 -11 -16 -6 q7 2 9 9 z" fill={P.woodLight} {...fine} />
      <ellipse cx={1} cy={0} rx={8} ry={5} fill={P.feather} {...fine} />
      <path d="M-6 2 q-6 2 -8 -2" fill="none" stroke={P.woodLight} strokeWidth={1.6} strokeLinecap="round" />
      <circle cx={8} cy={-4.5} r={3.6} fill={P.feather} {...fine} />
      <path d="M11 -5 l4.5 1 l-4.5 1.6 z" fill={P.glowHot} {...fine} />
      <circle cx={8.6} cy={-5.2} r={0.7} fill={P.outline} />
      <path d="M5.5 -8 l1 -2.5 l1.5 2" fill={P.feather} {...fine} />
    </g>
  )
}

export function Greifenhorst({ tier, m }: BuildingProps) {
  const h = tier >= 3 ? 38 : 24
  return (
    <g>
      <Base w={tier >= 3 ? 56 : 46} fill={P.stoneDark} />
      {at(tier, 4, <Glow x={2} y={-h - 10} r={16} m={m} />)}
      {/* Felsnadel */}
      <path d={tier >= 3 ? 'M-20 0 l3 -22 l5 -4 l2 -12 h20 l2 12 l5 4 l3 22 z' : 'M-18 0 l4 -24 h28 l4 24 z'} fill={P.stone} {...line} />
      <path d={tier >= 3 ? 'M2 -38 h8 l2 12 l5 4 l3 22 h-18 z' : 'M2 -24 h12 l4 24 h-16 z'} fill={P.outline} opacity={0.15} />
      <path d={tier >= 3 ? 'M-12 -14 l6 3 M-8 -28 l5 2 M6 -8 l6 -3' : 'M-10 -12 l6 3 M4 -8 l6 -2'} stroke={P.stoneLight} strokeWidth={1.4} strokeLinecap="round" />
      {/* Nest */}
      <path d={`M-16 ${-h} q16 -9 32 0 q-16 7 -32 0 z`} fill={P.woodLight} {...line} />
      <path d={`M-13 ${-h - 1} l6 -3 M-2 ${-h - 4} l5 -1 M8 ${-h - 3} l5 2 M-8 ${-h + 2} l7 1`} stroke={P.woodDark} strokeWidth={0.9} strokeLinecap="round" />
      {tier === 1 ? <ellipse cx={0} cy={-h - 2} rx={3} ry={3.6} fill={P.paper} {...fine} /> : <Griffin x={0} y={-h - 6} />}
      {at(
        tier,
        3,
        <g>
          {/* Leiter und Ausguck */}
          <path d="M-24 0 v-20 M-19 0 v-20 M-24 -4 h5 M-24 -9 h5 M-24 -14 h5" stroke={P.woodDark} strokeWidth={1.2} strokeLinecap="round" />
          <path d="M14 -22 h12 v-4 h-12 z" fill={P.wood} {...fine} />
          <path d="M24 -22 v22" stroke={P.woodDark} strokeWidth={1.6} />
          <Banner x={-14} y={-h} fill={P.clothBlue} />
        </g>,
      )}
      {at(
        tier,
        4,
        <g>
          {/* Zweiter Greif auf dem Ausguck, Laternen, ein Greif im Flug */}
          <Griffin x={21} y={-30} s={0.62} />
          <Lantern x={15} y={-26} m={m} />
          <Lantern x={-21} y={-21} m={m} />
          <path d="M-30 -52 q5 -5 9 0 q4 -5 9 0" fill="none" stroke={P.outline} strokeWidth={STROKE.main} strokeLinecap="round" />
        </g>,
      )}
    </g>
  )
}

export function Runenhalle({ tier, m }: BuildingProps) {
  const rune = isDark(m) || tier >= 4 ? P.glow : P.clothBlue
  const h = tier >= 3 ? 28 : 24
  return (
    <g>
      <Base w={tier >= 3 ? 66 : 56} fill={P.stoneDark} />
      {at(tier, 4, <Glow x={0} y={-h - 10} r={18} m={m} />)}
      {/* Seitenflügel */}
      {at(
        tier,
        3,
        <g>
          <Wall x={-33} y={-16} w={11} h={16} fill={P.stone} />
          <Wall x={22} y={-16} w={11} h={16} fill={P.stone} />
          <path d="M-35 -16 h15 l-2 -4 h-11 z M20 -16 h15 l-2 -4 h-11 z" fill={P.stoneDark} {...fine} />
          <path d="M-29 -11 v6 l3 -3 M26 -11 l4 3 l-4 3" fill="none" stroke={rune} strokeWidth={1.4} strokeLinecap="round" />
        </g>,
      )}
      {/* Stufen, Halle, Säulen */}
      <path d="M-26 0 h52 l-2 -3 h-48 z" fill={P.stoneDark} {...fine} />
      <rect x={-22} y={-h} width={44} height={h - 3} fill={P.stoneLight} {...line} />
      <rect x={-21} y={-h + 1} width={42} height={h - 5} fill={P.windowDark} opacity={0.5} />
      {[-18, -7, 4, 15].map((x) => (
        <g key={x}>
          <rect x={x} y={-h + 1} width={4.5} height={h - 4} fill={P.stoneLight} {...fine} />
          <rect x={x + 3} y={-h + 2} width={1.2} height={h - 6} fill={P.outline} opacity={0.2} />
        </g>
      ))}
      {at(tier, 2, <path d="M-2 -3 v-12 a4 4 0 0 1 8 0 v12 z" fill={isDark(m) ? P.glowHot : P.windowDark} opacity={0.75} {...fine} />)}
      {/* Giebel mit Zeichen */}
      <polygon points={`-26,${-h} 0,${-h - (tier >= 3 ? 17 : 14)} 26,${-h}`} fill={P.stone} {...line} />
      <polygon points={`0,${-h - (tier >= 3 ? 15.5 : 12.5)} 24,${-h - 0.6} 0,${-h - 0.6}`} fill={P.outline} opacity={0.16} />
      {at(tier, 2, <path d={`M-7 ${-h - 4} l3 -5 l3 5 l3 -5 l3 5`} fill="none" stroke={rune} strokeWidth={STROKE.main} strokeLinecap="round" />)}
      {at(
        tier,
        3,
        <g>
          {/* Stehende Runensteine */}
          <path d="M-42 0 l1 -12 q3 -3 6 0 l1 12 z" fill={P.stoneLight} {...fine} />
          <path d="M-39.5 -9 v5 M-41 -7 l3 -1" stroke={rune} strokeWidth={1} strokeLinecap="round" />
        </g>,
      )}
      {at(
        tier,
        4,
        <g>
          {/* Feuerschalen, zweiter Stein, Zeichen am First */}
          <path d="M-13 -3 h6 l-1 -3 h-4 z M7 -3 h6 l-1 -3 h-4 z" fill={P.metal} {...fine} />
          <path d="M-12 -6 q2 -6 4 0 z M8 -6 q2 -6 4 0 z" fill={P.glowHot} />
          <path d="M34 0 l1 -14 q3 -3 6 0 l1 14 z" fill={P.stoneLight} {...fine} />
          <path d="M37.5 -11 l-1.5 3 h3 l-1.5 3" fill="none" stroke={rune} strokeWidth={1} strokeLinecap="round" />
          <Star x={0} y={-h - 21} s={1.3} fill={P.glowSoft} />
        </g>,
      )}
    </g>
  )
}

export function Sternwarte({ tier, m }: BuildingProps) {
  const h = tier >= 3 ? 30 : 24
  const r = tier >= 3 ? 20 : 17
  return (
    <g>
      <Base w={tier >= 3 ? 62 : 50} />
      {at(tier, 4, <Glow x={0} y={-h - 12} r={20} m={m} />)}
      {/* Nebenturm mit Messkugel */}
      {at(
        tier,
        3,
        <g>
          <Wall x={-31} y={-22} w={11} h={22} fill={P.stone} />
          <polygon points="-33,-22 -25.5,-32 -18,-22" fill={P.clothBlue} {...line} />
          <Window x={-28} y={-17} m={m} w={5} h={6} />
        </g>,
      )}
      <Wall x={-r + 2} y={-h} w={2 * r - 4} h={h} fill={P.stoneLight} />
      <Bricks x={-r + 2} y={-h} w={2 * r - 4} h={h} />
      <rect x={-r} y={-h - 2} width={2 * r} height={3.5} fill={P.stone} {...fine} />
      {/* Kuppel */}
      <path d={`M${-r} ${-h - 2} a${r} ${r} 0 0 1 ${2 * r} 0 z`} fill={tier >= 2 ? P.clothBlue : P.stoneDark} {...line} />
      <path d={`M0 ${-h - 2 - r} a${r} ${r} 0 0 1 ${r} ${r} h${-r} z`} fill={P.outline} opacity={0.18} />
      {at(tier, 2, <path d={`M-3 ${-h - 2} v${-r + 1.5} h6 v${r - 1.5} z`} fill={isDark(m) || tier >= 4 ? P.glow : P.windowDark} {...fine} />)}
      <Door x={-4} y={0} />
      <Window x={-r + 6} y={-h + 7} m={m} />
      <Window x={r - 12} y={-h + 7} m={m} />
      {at(tier, 2, <path d={`M1 ${-h - r + 4} l15 -11 l3 4 l-15 11 z`} fill={P.metal} {...line} />)}
      {at(tier, 2, <path d={`M15 ${-h - r - 6.5} l3 4`} stroke={P.metalLight} strokeWidth={1.6} strokeLinecap="round" />)}
      {at(
        tier,
        3,
        <g>
          {/* Armillarsphäre vor dem Haus */}
          <path d="M26 0 v-8" stroke={P.woodDark} strokeWidth={1.6} />
          <circle cx={26} cy={-12} r={4.5} fill="none" stroke={P.glow} strokeWidth={1.2} />
          <ellipse cx={26} cy={-12} rx={4.5} ry={1.8} fill="none" stroke={P.glow} strokeWidth={0.9} />
          <circle cx={26} cy={-12} r={1.2} fill={P.glowSoft} />
        </g>,
      )}
      {at(
        tier,
        4,
        <g>
          {/* Sterne über der Kuppel, Laternen, Baum */}
          <Star x={-12} y={-h - r - 12} s={1.3} />
          <Star x={7} y={-h - r - 20} s={1} fill={P.glowSoft} />
          <Star x={24} y={-h - r - 8} s={0.8} fill={P.glowSoft} />
          <Lantern x={-9} y={-1} m={m} />
          <Lantern x={9} y={-1} m={m} />
          <Tree x={-40} y={0} s={0.8} m={m} />
        </g>,
      )}
    </g>
  )
}
