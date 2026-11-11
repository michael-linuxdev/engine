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
    // ── Fest-Jahrgang 2 ──
    case 'frostPillar':
      return (
        <g>
          <path d="M-4 0 l1 -22 l3 -4 l3 4 l1 22 z" fill={P.snow} {...line} />
          <path d="M-2 -6 l4 -3 M-2 -13 l4 -3" stroke={P.snowShade} strokeWidth={STROKE.fine} />
        </g>
      )
    case 'snowdropBed':
      return (
        <g>
          <ellipse cx={0} cy={-1} rx={9} ry={3} fill={P.snow} {...line} />
          {[-5, 0, 5].map((x) => (
            <g key={x}>
              <path d={`M${x} -2 q0 -8 2 -10`} fill="none" stroke={P.grassDark} strokeWidth={STROKE.fine} />
              <path d={`M${x + 2} -12 q3 2 1 5 q-3 -1 -1 -5 z`} fill={P.white} stroke={P.outline} strokeWidth={0.6} />
            </g>
          ))}
        </g>
      )
    case 'budPole':
      return (
        <g>
          <line x1={0} y1={0} x2={0} y2={-24} {...line} />
          {[-7, -13, -19].map((y, i) => (
            <path key={y} d={`M0 ${y} q${i % 2 ? -6 : 6} -1 ${i % 2 ? -7 : 7} -6 q${i % 2 ? 5 : -5} 0 ${i % 2 ? 7 : -7} 6 z`} fill={P.grassLight} stroke={P.outline} strokeWidth={0.6} />
          ))}
          <circle cx={0} cy={-26} r={2.5} fill={P.blossom} stroke={P.outline} strokeWidth={0.6} />
        </g>
      )
    case 'ribbonTree':
      return (
        <g>
          <line x1={0} y1={0} x2={0} y2={-14} {...line} />
          <circle cx={0} cy={-19} r={8} fill={P.grass} {...line} />
          <path d="M-5 -16 q-2 6 -4 10" fill="none" stroke={P.ember} strokeWidth={STROKE.fine * 1.5} strokeLinecap="round" />
          <path d="M1 -13 q1 6 -1 10" fill="none" stroke={P.clothBlue} strokeWidth={STROKE.fine * 1.5} strokeLinecap="round" />
          <path d="M6 -17 q3 5 3 10" fill="none" stroke={P.glow} strokeWidth={STROKE.fine * 1.5} strokeLinecap="round" />
        </g>
      )
    case 'sunWheel':
      return (
        <g>
          <line x1={0} y1={0} x2={0} y2={-6} {...line} />
          <circle cx={0} cy={-15} r={9} fill={P.glow} {...line} />
          <path d="M0 -24 v18 M-9 -15 h18 M-6.4 -21.4 l12.8 12.8 M6.4 -21.4 l-12.8 12.8" stroke={P.outline} strokeWidth={STROKE.fine} />
          <circle cx={0} cy={-15} r={2.5} fill={P.glowHot} stroke={P.outline} strokeWidth={0.6} />
          <Glow x={0} y={-15} r={10} m={m} />
        </g>
      )
    case 'fireflyLamp':
      return (
        <g>
          <line x1={0} y1={0} x2={0} y2={-12} {...line} />
          <path d="M-5 -12 h10 v-10 q-5 -5 -10 0 z" fill={P.waterLight} opacity={0.75} {...line} />
          <circle cx={-2} cy={-17} r={1} fill={P.glowHot} />
          <circle cx={2} cy={-20} r={1} fill={P.glowHot} />
          <circle cx={1} cy={-15} r={0.8} fill={P.glowSoft} />
          <Glow x={0} y={-18} r={8} m={m} />
        </g>
      )
    case 'kiteMast':
      return (
        <g>
          <line x1={-5} y1={0} x2={-5} y2={-22} {...line} />
          <path d="M-5 -22 q6 -2 9 -4" fill="none" stroke={P.woodDark} strokeWidth={STROKE.fine} />
          <path d="M4 -32 l5 6 l-5 8 l-5 -8 z" fill={P.ember} {...line} />
          <circle cx={4} cy={-25} r={1.6} fill={P.glowHot} />
          <path d="M4 -18 q2 3 0 6" fill="none" stroke={P.clothBlue} strokeWidth={STROKE.fine} />
        </g>
      )
    case 'mistHorn':
      return (
        <g>
          <path d="M-6 0 v-8 M4 0 v-8" {...line} />
          <path d="M-9 -8 q2 -8 12 -9 l6 -4 v14 l-6 -3 q-6 0 -8 4 z" fill={P.metalLight} {...line} />
          <ellipse cx={11} cy={-14} rx={6} ry={2.5} fill={P.mist} opacity={0.7} />
        </g>
      )
    case 'candleRing':
      return (
        <g>
          <ellipse cx={0} cy={-2} rx={10} ry={3.5} fill={P.stoneLight} {...line} />
          {[-7, -3.5, 0, 3.5, 7].map((x, i) => (
            <g key={x}>
              <rect x={x - 0.9} y={-9 - (i % 2)} width={1.8} height={6 + (i % 2)} fill={P.paper} stroke={P.outline} strokeWidth={0.5} />
              <path d={`M${x - 0.9} ${-9 - (i % 2)} q0.9 -3.4 1.8 0 z`} fill={P.glowHot} />
            </g>
          ))}
          <Glow x={0} y={-10} r={10} m={m} />
        </g>
      )
    default:
      return null
  }
}
