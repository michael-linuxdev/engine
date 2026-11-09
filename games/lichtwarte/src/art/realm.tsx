/** Kleine Landschaft je Land (Übersicht, Land-Fenster, ?artsheet). viewBox 0 0 120 90. */
import type { Mood } from '@engine/art'
import { Glow, Tree } from './parts'
import { FOLIAGE, GROUND, isDark, MOUNTAIN, P, SKY } from './palette'
import { STROKE } from './stroke'

const line = { stroke: P.outline, strokeWidth: STROKE.fine, strokeLinejoin: 'round' as const }

function Landmark({ id, m }: { id: string; m: Mood }) {
  const [leaf] = FOLIAGE[m.season]
  switch (id) {
    case 'moorgrund':
      return (
        <g>
          <path d="M20 70 h80" stroke={P.woodDark} strokeWidth={4} />
          <path d="M28 70 v6 M48 70 v6 M68 70 v6 M88 70 v6" {...line} />
          <ellipse cx={60} cy={58} rx={40} ry={8} fill={P.mist} opacity={0.6} />
          <circle cx={40} cy={50} r={2} fill={P.glowSoft} />
          <circle cx={78} cy={46} r={2} fill={P.glowSoft} />
        </g>
      )
    case 'kieselbach':
      return (
        <g>
          <path d="M0 72 q30 -8 60 0 t60 0 v18 h-120 z" fill={P.water} />
          <rect x={52} y={40} width={22} height={24} fill={P.woodLight} {...line} />
          <polygon points="50,40 63,30 76,40" fill={P.roof} {...line} />
          <circle cx={80} cy={58} r={9} fill="none" stroke={P.woodDark} strokeWidth={STROKE.main} />
          <path d="M80 49 v18 M71 58 h18" stroke={P.woodDark} strokeWidth={STROKE.fine} />
        </g>
      )
    case 'birkenhang':
      return (
        <g>
          {[24, 40, 58, 76, 92].map((x, i) => (
            <g key={x}>
              <rect x={x} y={34 + (i % 2) * 6} width={4} height={36} fill={P.white} {...line} />
              <circle cx={x + 2} cy={32 + (i % 2) * 6} r={8} fill={leaf} {...line} />
            </g>
          ))}
          <path d="M60 22 q-4 -6 0 -12" stroke={P.stoneLight} strokeWidth={STROKE.main} fill="none" />
        </g>
      )
    case 'felsenkamm':
      return (
        <g>
          <polygon points="10,72 40,26 62,58 80,30 110,72" fill={P.stone} {...line} />
          <polygon points="58,70 62,56 66,70" fill={P.waterLight} {...line} />
          <polygon points="70,72 74,60 78,72" fill={P.blossom} {...line} />
        </g>
      )
    case 'heidegrund':
      return (
        <g>
          <ellipse cx={60} cy={74} rx={58} ry={10} fill={P.clothViolet} opacity={0.7} />
          <rect x={50} y={52} width={14} height={14} rx={6} fill={P.thatch} {...line} />
          <path d="M52 58 h10 M52 62 h10" stroke={P.thatchDark} strokeWidth={STROKE.fine} />
          <circle cx={74} cy={48} r={1.5} fill={P.outline} />
          <circle cx={80} cy={52} r={1.5} fill={P.outline} />
        </g>
      )
    case 'schilfufer':
      return (
        <g>
          <rect x={0} y={66} width={120} height={24} fill={P.water} />
          {[10, 16, 22, 96, 102, 108].map((x) => (
            <path key={x} d={`M${x} 72 v-22`} stroke={P.thatchDark} strokeWidth={STROKE.main} />
          ))}
          <path d="M44 70 h34 l-6 6 h-22 z" fill={P.wood} {...line} />
          <line x1={60} y1={70} x2={60} y2={50} {...line} />
        </g>
      )
    case 'apfelhain':
      return (
        <g>
          {[30, 60, 90].map((x) => (
            <g key={x}>
              <Tree x={x} y={70} s={1.4} m={m} />
              <circle cx={x - 3} cy={50} r={2} fill={P.roof} />
              <circle cx={x + 4} cy={47} r={2} fill={P.roof} />
            </g>
          ))}
        </g>
      )
    case 'eulenwald':
      return (
        <g>
          <Tree x={36} y={72} s={2} m={m} />
          <Tree x={84} y={72} s={1.8} m={m} />
          <ellipse cx={60} cy={46} rx={6} ry={8} fill={P.feather} {...line} />
          <circle cx={58} cy={44} r={1.5} fill={P.outline} />
          <circle cx={62} cy={44} r={1.5} fill={P.outline} />
        </g>
      )
    case 'salzquelle':
      return (
        <g>
          <rect x={24} y={44} width={70} height={22} fill={P.thatch} {...line} />
          <path d="M24 50 h70 M24 56 h70 M24 62 h70" stroke={P.thatchDark} strokeWidth={STROKE.fine} />
          <rect x={94} y={36} width={12} height={30} fill={P.stoneLight} {...line} />
          <ellipse cx={40} cy={74} rx={16} ry={4} fill={P.snow} {...line} />
        </g>
      )
    case 'windmark':
      return (
        <g>
          <polygon points="52,70 56,42 64,42 68,70" fill={P.woodLight} {...line} />
          <g transform="translate(60 42)">
            {[0, 90, 180, 270].map((a) => (
              <rect key={a} x={-2} y={-24} width={4} height={22} fill={P.paper} {...line} transform={`rotate(${a + 20})`} />
            ))}
          </g>
          <path d="M0 74 q60 -10 120 0" stroke={P.thatch} strokeWidth={6} fill="none" />
        </g>
      )
    case 'sternweiher':
      return (
        <g>
          <ellipse cx={60} cy={70} rx={44} ry={10} fill={isDark(m) ? P.slate : P.water} {...line} />
          <circle cx={46} cy={68} r={1.5} fill={P.glowSoft} />
          <circle cx={66} cy={72} r={1.5} fill={P.glowSoft} />
          <circle cx={80} cy={67} r={1.5} fill={P.glowSoft} />
          <path d="M84 60 l10 -14 l3 2 l-10 14 z" fill={P.metal} {...line} />
        </g>
      )
    default:
      return null
  }
}

export function RealmArt({ id, m }: { id: string; m: Mood }) {
  const [top, bottom] = SKY[m.daypart]
  const [far, near] = GROUND[m.season]
  const gid = `realm-sky-${id}-${m.daypart}`
  return (
    <svg viewBox="0 0 120 90" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={120} height={90} fill={`url(#${gid})`} />
      <polygon points="0,52 30,30 60,46 90,26 120,48 120,90 0,90" fill={MOUNTAIN[1]} />
      <path d="M0 60 Q60 48 120 60 V90 H0 Z" fill={far} />
      <path d="M0 74 Q60 66 120 74 V90 H0 Z" fill={near} />
      <Landmark id={id} m={m} />
      {isDark(m) ? <Glow x={100} y={20} r={10} m={m} /> : null}
    </svg>
  )
}
