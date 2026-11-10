/** Kleine Bilder zu den Chronik-Seiten (120 × 80): ein Bauwerk im Abendlicht oder ein Motiv der Erzählung. */
import type { Mood } from '@engine/art'
import { seeded, vary } from '@engine/art'
import { BuildingArt } from './Building'
import { Watchtower } from './Backdrop'
import { Apprentice } from './life'
import { BEACON, GROUND, ORB, P, RANGES, SKY3 } from './palette'
import { BUILDINGS } from './registry'
import { STROKE } from './stroke'
import { TOWER } from '../scene/slots'

const EVENING: Mood = { daypart: 'evening', season: 'summer' }
const NIGHT: Mood = { daypart: 'night', season: 'summer' }
const line = { stroke: P.outline, strokeWidth: STROKE.main, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }

function Stars({ seed, n, rim = false }: { seed: string; n: number; rim?: boolean }) {
  const rnd = seeded(seed)
  return (
    <g fill={P.glowSoft}>
      {Array.from({ length: n }, (_, i) => {
        const x = vary(rnd, rim ? 26 : 4, rim ? 94 : 116)
        const y = vary(rnd, 4, rim ? 40 : 46)
        return <circle key={i} cx={x} cy={y} r={i % 5 === 0 ? 1.3 : 0.7} />
      })}
    </g>
  )
}

function Ground({ m, y = 62 }: { m: Mood; y?: number }) {
  return <path d={`M0 ${y} Q40 ${y - 8} 70 ${y - 2} T120 ${y - 4} V80 H0 Z`} fill={GROUND[m.season][1]} />
}

function Ridge({ m }: { m: Mood }) {
  const [far, mid] = RANGES[m.daypart]
  return (
    <g>
      <path d="M0 58 L18 38 L34 52 L54 30 L76 54 L96 36 L120 56 V80 H0 Z" fill={far} />
      <path d="M0 64 L24 48 L46 62 L70 44 L94 62 L120 50 V80 H0 Z" fill={mid} />
    </g>
  )
}

function Motif({ art }: { art: string }) {
  switch (art) {
    case 'key':
      return (
        <g>
          <path d="M0 80 V60 h44 v-10 h40 v-10 h36 V80 Z" fill={P.stone} {...line} />
          <path d="M44 60 h76 M84 50 h36" stroke={P.outline} strokeWidth={STROKE.fine} />
          <circle cx={58} cy={46} r={20} fill={BEACON.warm} opacity={0.25} />
          <g transform="translate(46 46) rotate(-18)">
            <circle cx={0} cy={0} r={6} fill="none" stroke={P.glow} strokeWidth={3} />
            <circle cx={0} cy={0} r={6} fill="none" stroke={P.outline} strokeWidth={0.8} />
            <path d="M6 0 h20 M20 0 v5 M25 0 v6" fill="none" stroke={P.glow} strokeWidth={3} strokeLinecap="round" />
          </g>
        </g>
      )
    case 'moon':
      return (
        <g>
          <Stars seed="v-moon" n={16} />
          <circle cx={60} cy={30} r={24} fill={ORB.night[1]} opacity={0.25} />
          <circle cx={60} cy={30} r={15} fill={ORB.night[0]} />
          <circle cx={67} cy={26} r={13} fill={SKY3.night[1]} />
          <Ridge m={NIGHT} />
        </g>
      )
    case 'archive':
      return (
        <g>
          <Ground m={EVENING} y={66} />
          <circle cx={60} cy={44} r={30} fill={BEACON.warm} opacity={0.28} />
          <path d="M36 66 V48 a24 16 0 0 1 48 0 V66 Z" fill={P.wood} {...line} />
          <path d="M36 50 h48 M48 36 v30 M72 36 v30" stroke={P.outline} strokeWidth={STROKE.fine} />
          <path d="M36 50 h48 v5 h-48 z" fill={P.glow} {...line} />
          <rect x={56} y={48} width={8} height={10} rx={1.5} fill={P.metalLight} {...line} />
          <path d="M44 34 l-4 -10 M60 30 v-12 M76 34 l4 -10" stroke={BEACON.core} strokeWidth={1.6} strokeLinecap="round" opacity={0.8} />
        </g>
      )
    case 'letter':
      return (
        <g>
          <Ground m={EVENING} y={70} />
          <g transform="rotate(-6 60 44)">
            <rect x={32} y={26} width={56} height={38} rx={2} fill={P.paper} {...line} />
            <path d="M32 27 L60 48 L88 27" fill="none" {...line} />
            <circle cx={60} cy={50} r={6} fill={P.roof} {...line} />
            <path d="M57.5 50 h5 M60 47.5 v5" stroke={P.glowSoft} strokeWidth={1} />
          </g>
          <path d="M92 22 q10 -6 14 -14 q-2 12 -10 18 z" fill={P.feather} {...line} />
        </g>
      )
    case 'apprentice':
      return (
        <g>
          <Stars seed="v-app" n={10} />
          <Ridge m={NIGHT} />
          <Ground m={NIGHT} y={68} />
          <g transform="translate(56 70) scale(1.6)">
            <Apprentice m={NIGHT} />
          </g>
        </g>
      )
    case 'stars':
      return (
        <g>
          <Stars seed="v-stars" n={34} rim />
          <Ridge m={NIGHT} />
          <path d="M0 0 h22 q-8 30 4 60 H0 Z M120 0 h-22 q8 30 -4 60 H120 Z" fill={SKY3.night[0]} opacity={0.85} />
        </g>
      )
    case 'dawn':
      return (
        <g>
          <circle cx={60} cy={56} r={34} fill={ORB.dawn[1]} opacity={0.4} />
          <circle cx={60} cy={56} r={15} fill={ORB.dawn[0]} />
          <path d="M60 20 v-10 M30 30 l-7 -8 M90 30 l7 -8 M18 52 h-10 M102 52 h10" stroke={ORB.dawn[0]} strokeWidth={2} strokeLinecap="round" opacity={0.8} />
          <Ridge m={{ daypart: 'dawn', season: 'summer' }} />
        </g>
      )
    case 'fires':
      return (
        <g>
          <Stars seed="v-fires" n={12} />
          <Ridge m={NIGHT} />
          <Ground m={NIGHT} y={72} />
          {[
            [18, 40], [34, 52], [54, 32], [70, 46], [96, 38], [108, 54],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={7} fill={BEACON.warm} opacity={0.35} />
              <circle cx={x} cy={y} r={2} fill={BEACON.core} />
            </g>
          ))}
        </g>
      )
    default:
      return (
        <g>
          <Stars seed="v-tower" n={14} />
          <Ridge m={NIGHT} />
          <circle cx={60} cy={24} r={26} fill={BEACON.warm} opacity={0.35} />
          <g transform={`translate(${60 - TOWER.x * 0.8} ${76 - TOWER.y * 0.8}) scale(0.8)`}>
            <Watchtower m={NIGHT} beacon={3} />
          </g>
        </g>
      )
  }
}

export function VignetteArt({ art, uid }: { art: string; uid: string }) {
  const building = art in BUILDINGS
  const m = building ? EVENING : art === 'dawn' ? { daypart: 'dawn' as const, season: 'summer' as const } : art === 'key' || art === 'archive' || art === 'letter' ? EVENING : NIGHT
  const [top, mid, low] = SKY3[m.daypart]
  return (
    <svg className="lw-vignette" viewBox="0 0 120 80" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`vg-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="0.6" stopColor={mid} />
          <stop offset="1" stopColor={low} />
        </linearGradient>
        <clipPath id={`vc-${uid}`}>
          <rect x={1} y={1} width={118} height={78} rx={10} />
        </clipPath>
      </defs>
      <g clipPath={`url(#vc-${uid})`}>
        <rect width={120} height={80} fill={`url(#vg-${uid})`} />
        {building ? (
          <g>
            <Ridge m={m} />
            <Ground m={m} y={66} />
            <circle cx={60} cy={46} r={30} fill={BEACON.warm} opacity={0.22} />
            <g transform="translate(60 72) scale(1.05)">
              <BuildingArt id={art} tier={3} m={m} />
            </g>
          </g>
        ) : (
          <Motif art={art} />
        )}
      </g>
      <rect x={1} y={1} width={118} height={78} rx={10} fill="none" stroke={P.outline} strokeWidth={STROKE.main} />
    </svg>
  )
}
