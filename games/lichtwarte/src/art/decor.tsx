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
    // ── Fest-Jahrgang 3 (Küste) ──
    case 'frostAnchor':
      return (
        <g>
          <path d="M0 -24 v20 M-8 -10 q0 8 8 8 q8 0 8 -8 M-5 -18 h10" fill="none" stroke={P.outline} strokeWidth={STROKE.bold + 2} strokeLinecap="round" />
          <path d="M0 -24 v20 M-8 -10 q0 8 8 8 q8 0 8 -8 M-5 -18 h10" fill="none" stroke={P.snow} strokeWidth={STROKE.bold} strokeLinecap="round" />
          <circle cx={0} cy={-26} r={2.5} fill={P.snow} stroke={P.outline} strokeWidth={STROKE.fine} />
          <path d="M-8 -10 l-2 3 M8 -10 l2 3" stroke={P.snow} strokeWidth={STROKE.fine} />
        </g>
      )
    case 'iceBuoy':
      return (
        <g>
          <path d="M-6 0 l2 -12 h8 l2 12 z" fill={P.waterLight} {...line} />
          <path d="M-4 -12 l4 -10 l4 10" fill="none" stroke={P.metal} strokeWidth={STROKE.main} />
          <circle cx={0} cy={-23} r={2} fill={P.snow} stroke={P.outline} strokeWidth={0.6} />
          <path d="M-5 -6 h10" stroke={P.snow} strokeWidth={STROKE.fine * 1.5} />
        </g>
      )
    case 'kelpArch':
      return (
        <g>
          <path d="M-9 0 q-2 -22 9 -24 q11 2 9 24" fill="none" stroke={P.grassDark} strokeWidth={STROKE.bold} strokeLinecap="round" />
          {[[-8, -8], [-5, -18], [5, -18], [8, -8]].map(([x, y]) => (
            <ellipse key={`${x}${y}`} cx={x} cy={y} rx={2.6} ry={1.4} fill={P.grassLight} stroke={P.outline} strokeWidth={0.5} />
          ))}
        </g>
      )
    case 'netPole':
      return (
        <g>
          <line x1={-6} y1={0} x2={-6} y2={-24} {...line} />
          <path d="M-6 -22 q8 4 14 10 l-14 6 z" fill={P.paper} opacity={0.5} stroke={P.thatchDark} strokeWidth={0.7} />
          <path d="M-6 -17 l10 2 M-6 -12 l12 2 M-2 -20 l2 12 M3 -16 l1 9" stroke={P.thatchDark} strokeWidth={0.5} />
          {[[-1, -15], [4, -11], [-3, -9]].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r={1.4} fill={P.blossom} stroke={P.outline} strokeWidth={0.4} />
          ))}
        </g>
      )
    case 'tideGlass':
      return (
        <g>
          <rect x={-5} y={-22} width={10} height={20} rx={2} fill={P.waterLight} opacity={0.6} {...line} />
          <rect x={-5} y={-12} width={10} height={10} fill={P.water} opacity={0.85} />
          <path d="M-5 -16 h3 M-5 -12 h4 M-5 -8 h3" stroke={P.outline} strokeWidth={0.7} />
          <rect x={-7} y={-2} width={14} height={2.5} fill={P.woodDark} stroke={P.outline} strokeWidth={0.6} />
        </g>
      )
    case 'glowBarrel':
      return (
        <g>
          <path d="M-7 0 q-2 -8 0 -16 h14 q2 8 0 16 z" fill={P.woodLight} {...line} />
          <path d="M-8 -5 h16 M-8 -11 h16" stroke={P.metal} strokeWidth={STROKE.fine * 1.5} />
          <ellipse cx={0} cy={-16} rx={7} ry={2.4} fill={P.waterLight} stroke={P.outline} strokeWidth={0.7} />
          <Glow x={0} y={-17} r={8} m={m} />
        </g>
      )
    case 'paperBoats':
      return (
        <g>
          {[[-7, -2], [1, -6], [8, -1]].map(([x, y]) => (
            <g key={x}>
              <path d={`M${x - 4} ${y} h8 l-2 3 h-4 z`} fill={P.paper} stroke={P.outline} strokeWidth={0.7} />
              <path d={`M${x} ${y} v-5 l3 5 z`} fill={P.paper} stroke={P.outline} strokeWidth={0.6} />
              <circle cx={x} cy={y - 1} r={0.9} fill={P.glowHot} />
            </g>
          ))}
          <Glow x={1} y={-5} r={9} m={m} />
        </g>
      )
    case 'shellHorn':
      return (
        <g>
          <path d="M-4 0 v-8" {...line} />
          <path d="M-9 -8 q0 -10 10 -12 q8 0 9 6 q-1 6 -8 6 q-5 0 -5 4 q0 3 -6 -4 z" fill={P.paper} {...line} />
          <path d="M-4 -12 q4 -5 9 -3 M-2 -9 q3 -3 7 -2" fill="none" stroke={P.thatchDark} strokeWidth={0.7} />
        </g>
      )
    case 'fourRayLamp':
      return (
        <g>
          <line x1={0} y1={0} x2={0} y2={-14} {...line} />
          <path d="M0 -20 l-12 -3 M0 -20 l12 -3 M0 -20 l-12 4 M0 -20 l12 4" stroke={P.glowSoft} strokeWidth={STROKE.fine * 1.5} strokeLinecap="round" opacity={0.8} />
          <Lantern x={0} y={-14} m={m} />
          <Glow x={0} y={-20} r={9} m={m} />
        </g>
      )
    // ── Fest-Jahrgang 4 (Inseln, Wächterschule) ──
    case 'frostBench':
      return (
        <g>
          <rect x={-10} y={-9} width={20} height={3} fill={P.woodLight} {...line} />
          <path d="M-8 -6 v6 M8 -6 v6" {...line} />
          <rect x={-10} y={-11} width={20} height={2} fill={P.snow} stroke={P.outline} strokeWidth={0.5} />
          <rect x={-9} y={-18} width={18} height={3} fill={P.woodDark} {...line} />
          <path d="M-7 -15 v4 M7 -15 v4" {...line} />
        </g>
      )
    case 'chalkBoard':
      return (
        <g>
          <path d="M-8 0 l3 -8 M8 0 l-3 -8" {...line} />
          <rect x={-10} y={-24} width={20} height={16} rx={1} fill={P.slate} {...line} />
          <path d="M-6 -19 h2 M-2 -19 h6 M-6 -14 h8" stroke={P.snow} strokeWidth={STROKE.fine * 1.4} strokeLinecap="round" />
        </g>
      )
    case 'appleSapling':
      return (
        <g>
          <path d="M0 0 v-14" stroke={P.woodDark} strokeWidth={STROKE.bold} strokeLinecap="round" />
          <circle cx={0} cy={-19} r={7} fill={P.grassLight} {...line} />
          {[[-3, -20], [3, -17], [1, -23]].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r={1.5} fill={P.blossom} stroke={P.outline} strokeWidth={0.4} />
          ))}
          <path d="M-4 0 l4 -3 l4 3" fill="none" stroke={P.woodLight} strokeWidth={STROKE.fine} />
        </g>
      )
    case 'ropeWalk':
      return (
        <g>
          <path d="M-9 0 l2 -14 l2 14 M5 0 l2 -14 l2 14" fill="none" {...line} />
          <path d="M-7 -13 q7 5 14 0" fill="none" stroke={P.thatch} strokeWidth={STROKE.bold} strokeLinecap="round" />
          <path d="M-5 -11.5 l1 -1.5 M-1 -10.5 l1 -1.5 M3 -11 l1 -1.5" stroke={P.thatchDark} strokeWidth={0.6} />
          <circle cx={-7} cy={-15} r={2} fill={P.metal} stroke={P.outline} strokeWidth={0.6} />
        </g>
      )
    case 'glassJar':
      return (
        <g>
          <path d="M-6 0 q-3 -8 0 -15 h12 q3 7 0 15 z" fill={P.waterLight} opacity={0.7} {...line} />
          {[[-3, -4], [2, -3], [0, -8], [-2, -11], [3, -10]].map(([x, y]) => (
            <ellipse key={`${x}${y}`} cx={x} cy={y} rx={2} ry={1.4} fill={P.grassLight} stroke={P.grassDark} strokeWidth={0.4} />
          ))}
          <rect x={-5} y={-18} width={10} height={3} rx={1} fill={P.metalLight} stroke={P.outline} strokeWidth={0.6} />
        </g>
      )
    case 'signLantern':
      return (
        <g>
          <line x1={0} y1={0} x2={0} y2={-12} {...line} />
          <Lantern x={0} y={-12} m={m} />
          <path d="M5 -20 h6 M5 -16 h3 M5 -12 h6" stroke={P.glowSoft} strokeWidth={STROKE.fine * 1.5} strokeLinecap="round" />
          <rect x={-7} y={-22} width={3} height={9} fill={P.woodDark} stroke={P.outline} strokeWidth={0.6} />
          <Glow x={0} y={-17} r={8} m={m} />
        </g>
      )
    case 'smallBoat':
      return (
        <g>
          <path d="M-8 0 l2 -4 M8 0 l-2 -4" {...line} />
          <path d="M-12 -12 q12 12 24 0 l-3 8 h-18 z" fill={P.woodLight} {...line} />
          <path d="M-9 -8 h18" stroke={P.woodDark} strokeWidth={0.7} />
          <rect x={-1} y={-9} width={5} height={4} fill={P.windowDark} stroke={P.outline} strokeWidth={0.5} />
        </g>
      )
    case 'sealRock':
      return (
        <g>
          <path d="M-11 0 q0 -10 8 -10 h8 q6 2 6 10 z" fill={P.stone} {...line} />
          <path d="M-7 -10 q2 -7 8 -6 q4 1 6 5 q-6 3 -14 1 z" fill={P.stoneDark} {...line} />
          <circle cx={4} cy={-13} r={0.8} fill={P.snow} />
          <path d="M7 -11 l3 -2" stroke={P.outline} strokeWidth={0.6} />
        </g>
      )
    case 'nameStone':
      return (
        <g>
          <path d="M-7 0 v-16 q7 -8 14 0 v16 z" fill={P.stoneLight} {...line} />
          <path d="M-3 -17 l6 4 M3 -17 l-6 4 M0 -18.5 v7 M-3.5 -15 h7" stroke={P.stoneDark} strokeWidth={STROKE.fine} strokeLinecap="round" />
          <circle cx={0} cy={-15} r={1.2} fill={P.glowSoft} />
          <path d="M-4 -7 h8" stroke={P.stoneDark} strokeWidth={0.5} strokeDasharray="1 1.5" />
        </g>
      )
    // ── Fest-Jahrgang 5 (Rand der Karte, Großes Leuchtfeuer) ──
    case 'iceLantern':
      return (
        <g>
          <path d="M-8 0 l2 -14 h12 l2 14 z" fill={P.waterLight} opacity={0.85} {...line} />
          <path d="M-4 -12 l-1 9 M3 -12 l1 8" stroke={P.snow} strokeWidth={0.7} />
          <circle cx={0} cy={-6} r={2.2} fill={P.glowHot} />
          <Glow x={0} y={-7} r={9} m={m} />
        </g>
      )
    case 'redStone':
      return (
        <g>
          <path d="M-9 0 l1 -9 q8 -5 16 0 l1 9 z" fill={P.roof} {...line} />
          <path d="M0 -6 v-4 M0 -6 h4 M0 -6 h-4 M0 -6 v3 M0 -6 l2.5 2" stroke={P.paper} strokeWidth={STROKE.fine * 1.3} strokeLinecap="round" />
        </g>
      )
    case 'reedRaft':
      return (
        <g>
          <rect x={-11} y={-5} width={22} height={5} rx={2} fill={P.thatch} {...line} />
          <path d="M-7 -5 v5 M-2 -5 v5 M3 -5 v5 M8 -5 v5" stroke={P.thatchDark} strokeWidth={0.6} />
          <path d="M-6 -5 q-1 -9 1 -14 M-3 -5 q1 -8 0 -12 M0 -5 q2 -7 3 -11" fill="none" stroke={P.grassDark} strokeWidth={STROKE.fine * 1.3} strokeLinecap="round" />
          <rect x={4} y={-8} width={6} height={3} fill={P.grassLight} stroke={P.outline} strokeWidth={0.5} />
        </g>
      )
    case 'grassBridge':
      return (
        <g>
          <path d="M-11 0 v-14 M11 0 v-14" {...line} />
          <path d="M-11 -12 q11 9 22 0" fill="none" stroke={P.thatch} strokeWidth={STROKE.bold} strokeLinecap="round" />
          <path d="M-11 -6 q11 8 22 0" fill="none" stroke={P.thatchDark} strokeWidth={STROKE.main} strokeLinecap="round" />
          <path d="M-6 -9.5 v6 M0 -7.5 v5.5 M6 -9.5 v6" stroke={P.thatchDark} strokeWidth={0.6} />
          {[[-3, -8], [3, -8]].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r={1.3} fill={P.blossom} stroke={P.outline} strokeWidth={0.4} />
          ))}
        </g>
      )
    case 'lampTerrace':
      return (
        <g>
          <path d="M-11 0 v-5 h7 v-5 h7 v-5 h8 v15 z" fill={P.stoneLight} {...line} />
          {[[-8, -7], [-1, -12], [7, -17]].map(([x, y]) => (
            <g key={x}>
              <rect x={x - 1.5} y={y} width={3} height={2} fill={P.metal} stroke={P.outline} strokeWidth={0.4} />
              <circle cx={x} cy={y - 1.5} r={1.3} fill={P.glowHot} />
            </g>
          ))}
          <Glow x={-1} y={-13} r={10} m={m} />
        </g>
      )
    case 'buoyChain':
      return (
        <g>
          <path d="M-12 -3 q6 3 12 0 q6 -3 12 0" fill="none" stroke={P.water} strokeWidth={STROKE.main} />
          {[-8, 0, 8].map((x) => (
            <g key={x}>
              <path d={`M${x - 3} -3 l1.5 -7 h3 l1.5 7 z`} fill={P.ember} stroke={P.outline} strokeWidth={0.7} />
              <circle cx={x} cy={-12} r={1.4} fill={P.glowHot} />
            </g>
          ))}
          <Glow x={0} y={-12} r={9} m={m} />
        </g>
      )
    case 'smallAnchor':
      return (
        <g>
          <path d="M0 -20 v18 M-7 -8 q0 7 7 7 q7 0 7 -7 M-4 -15 h8" fill="none" stroke={P.outline} strokeWidth={STROKE.bold + 2} strokeLinecap="round" />
          <path d="M0 -20 v18 M-7 -8 q0 7 7 7 q7 0 7 -7 M-4 -15 h8" fill="none" stroke={P.metalLight} strokeWidth={STROKE.bold} strokeLinecap="round" />
          <circle cx={0} cy={-22} r={2.3} fill="none" stroke={P.outline} strokeWidth={STROKE.main} />
          <path d="M-5 0 h10" stroke={P.grassDark} strokeWidth={STROKE.main} strokeLinecap="round" />
        </g>
      )
    case 'windPipe':
      return (
        <g>
          <path d="M-5 0 l1 -24 h8 l1 24 z" fill={P.stone} {...line} />
          <path d="M-2 -20 h4 M-2 -15 h4 M-2 -10 h4" stroke={P.windowDark} strokeWidth={STROKE.main} strokeLinecap="round" />
          <path d="M7 -20 q3 -2 5 0 M7 -15 q3 -2 6 0" fill="none" stroke={P.mist} strokeWidth={STROKE.fine * 1.3} strokeLinecap="round" />
        </g>
      )
    case 'beaconModel':
      return (
        <g>
          <path d="M-6 0 l2 -18 h8 l2 18 z" fill={P.stoneLight} {...line} />
          <path d="M-5 -6 h10 M-4.4 -12 h8.8" stroke={P.stoneDark} strokeWidth={0.6} />
          <rect x={-2} y={-5} width={3} height={3} fill={P.roof} stroke={P.outline} strokeWidth={0.4} />
          <rect x={-5} y={-21} width={10} height={3} fill={P.woodDark} stroke={P.outline} strokeWidth={0.6} />
          <path d="M0 -24 l-11 -3 M0 -24 l11 -3 M0 -24 l-12 3 M0 -24 l12 3 M0 -24 v-6" stroke={P.glowSoft} strokeWidth={STROKE.fine * 1.5} strokeLinecap="round" opacity={0.8} />
          <circle cx={0} cy={-24} r={2.4} fill={P.glowHot} />
          <Glow x={0} y={-24} r={10} m={m} />
        </g>
      )
    default:
      return null
  }
}
