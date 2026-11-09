/** Banner & Steine: kleine Stücke für die 8 Schmuck-Plätze der Talkarte. Fußpunkt (0, 0), Höhe ≤ 30. */
import type { Mood } from '@engine/art'
import { Banner, Glow, Lantern } from './parts'
import { P } from './palette'
import { STROKE } from './stroke'

const line = { stroke: P.outline, strokeWidth: STROKE.main, strokeLinejoin: 'round' as const }

export function DecorArt({ id, m }: { id: string; m: Mood }) {
  switch (id) {
    case 'blueBanner':
      return <Banner x={0} y={0} fill={P.clothBlue} />
    case 'violetBanner':
      return <Banner x={0} y={0} fill={P.clothViolet} />
    case 'emberBanner':
      return <Banner x={0} y={0} fill={P.ember} />
    case 'bridgeBanner':
      return (
        <g>
          <Banner x={-4} y={0} fill={P.clothBlue} />
          <Banner x={4} y={0} fill={P.ember} />
        </g>
      )
    case 'standingStone':
      return <path d="M-5 0 l1 -20 q4 -4 8 0 l1 20 z" fill={P.stone} {...line} />
    case 'runeStone':
      return (
        <g>
          <path d="M-6 0 l1 -16 q5 -5 10 0 l1 16 z" fill={P.stoneLight} {...line} />
          <path d="M-2 -12 l2 -3 l2 3 M0 -9 v5" fill="none" stroke={P.clothBlue} strokeWidth={STROKE.fine} />
        </g>
      )
    case 'mossCairn':
      return (
        <g>
          <ellipse cx={0} cy={-3} rx={7} ry={3} fill={P.stoneDark} {...line} />
          <ellipse cx={0} cy={-8} rx={5} ry={2.5} fill={P.stone} {...line} />
          <ellipse cx={0} cy={-12} rx={3} ry={2} fill={P.grassLight} {...line} />
        </g>
      )
    case 'lanternPost':
      return (
        <g>
          <line x1={0} y1={0} x2={0} y2={-18} {...line} />
          <Lantern x={0} y={-16} m={m} />
        </g>
      )
    case 'wishWell':
      return (
        <g>
          <path d="M-8 0 v-6 h16 v6 z" fill={P.stone} {...line} />
          <path d="M-7 -6 v-10 M7 -6 v-10 M-9 -16 h18" fill="none" {...line} />
          <ellipse cx={0} cy={-6} rx={7} ry={1.5} fill={P.water} />
        </g>
      )
    case 'starPole':
      return (
        <g>
          <line x1={0} y1={0} x2={0} y2={-22} {...line} />
          <path d="M0 -28 l1.5 3.5 l3.5 0.5 l-2.5 2.5 l0.5 3.5 l-3 -1.8 l-3 1.8 l0.5 -3.5 l-2.5 -2.5 l3.5 -0.5 z" fill={P.glow} stroke={P.outline} strokeWidth={STROKE.fine} />
        </g>
      )
    case 'griffinStatue':
      return (
        <g>
          <rect x={-6} y={-6} width={12} height={6} fill={P.stoneDark} {...line} />
          <path d="M-4 -6 q0 -10 6 -12 l2 3 l-3 2 q4 2 3 7 z" fill={P.stoneLight} {...line} />
        </g>
      )
    case 'springArch':
      return <path d="M-8 0 v-12 q8 -10 16 0 v12" fill="none" stroke={P.blossom} strokeWidth={STROKE.bold} />
    case 'summerSail':
      return (
        <g>
          <line x1={-6} y1={0} x2={-6} y2={-18} {...line} />
          <path d="M-6 -18 q10 4 12 14 l-12 -2 z" fill={P.paper} {...line} />
        </g>
      )
    case 'autumnLantern':
      return (
        <g>
          <ellipse cx={0} cy={-5} rx={6} ry={5} fill={P.leafAutumn} {...line} />
          <Glow x={0} y={-5} r={6} m={m} />
        </g>
      )
    case 'winterStar':
      return <path d="M0 -20 l2 6 l6 0 l-5 4 l2 6 l-5 -4 l-5 4 l2 -6 l-5 -4 l6 0 z" fill={P.snow} stroke={P.outline} strokeWidth={STROKE.fine} />
    case 'beaconBrazier':
      return (
        <g>
          <path d="M-6 -6 h12 l-2 6 h-8 z" fill={P.metal} {...line} />
          <path d="M-4 -6 q4 -10 8 0 z" fill={P.glowHot} />
          <Glow x={0} y={-8} r={8} m={m} />
        </g>
      )
    default:
      return null
  }
}
