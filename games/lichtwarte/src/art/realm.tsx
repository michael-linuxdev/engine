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
    case 'nebelpass':
      return (
        <g>
          <polygon points="0,72 34,30 60,52 86,28 120,72" fill={P.stoneDark} {...line} />
          <path d="M40 72 q20 -24 40 0" fill="none" stroke={P.thatch} strokeWidth={STROKE.bold} />
          <ellipse cx={60} cy={50} rx={46} ry={7} fill={P.mist} opacity={0.75} />
        </g>
      )
    case 'hochalm':
      return (
        <g>
          <rect x={46} y={52} width={26} height={16} fill={P.woodLight} {...line} />
          <polygon points="42,52 59,40 76,52" fill={P.woodDark} {...line} />
          <circle cx={28} cy={68} r={4} fill={P.paper} {...line} />
          <circle cx={90} cy={66} r={4} fill={P.paper} {...line} />
        </g>
      )
    case 'gletscherblick':
      return (
        <g>
          <polygon points="10,72 50,24 90,72" fill={P.snow} {...line} />
          <polygon points="50,24 62,40 56,44 66,58 54,60 60,72 40,72 48,54 40,48 50,40" fill={P.waterLight} />
        </g>
      )
    case 'tannengrat':
      return (
        <g>
          {[20, 36, 52, 68, 84, 100].map((x, i) => (
            <polygon key={x} points={`${x - 8},70 ${x},${36 + (i % 2) * 8} ${x + 8},70`} fill={P.grassDark} {...line} />
          ))}
          <path d="M0 78 h120" stroke={P.water} strokeWidth={4} />
        </g>
      )
    case 'murmelstein':
      return (
        <g>
          <ellipse cx={46} cy={66} rx={22} ry={10} fill={P.stone} {...line} />
          <ellipse cx={76} cy={68} rx={14} ry={7} fill={P.stoneLight} {...line} />
          <ellipse cx={52} cy={52} rx={4} ry={6} fill={P.woodLight} {...line} />
          <circle cx={52} cy={46} r={3} fill={P.woodLight} {...line} />
        </g>
      )
    case 'kristallgrotte':
      return (
        <g>
          <path d="M20 74 q40 -60 80 0 z" fill={P.stoneDark} {...line} />
          <polygon points="46,74 52,54 58,74" fill={P.clothViolet} {...line} />
          <polygon points="58,74 64,50 70,74" fill={P.waterLight} {...line} />
          <Glow x={60} y={64} r={10} m={m} />
        </g>
      )
    case 'hangdorf':
      return (
        <g>
          {[[20, 58], [44, 50], [68, 44], [92, 38]].map(([x, y]) => (
            <g key={x}>
              <rect x={x} y={y} width={14} height={12} fill={P.paper} {...line} />
              <polygon points={`${x - 2},${y} ${x + 7},${y - 8} ${x + 16},${y}`} fill={P.roof} {...line} />
            </g>
          ))}
        </g>
      )
    case 'talauen':
      return (
        <g>
          <path d="M0 74 q40 -6 60 0 t60 0" stroke={P.water} strokeWidth={5} fill="none" />
          <line x1={80} y1={70} x2={80} y2={40} {...line} />
          <ellipse cx={80} cy={38} rx={8} ry={3} fill={P.woodDark} {...line} />
          <ellipse cx={80} cy={34} rx={4} ry={3} fill={P.white} {...line} />
        </g>
      )
    case 'muehlenbach':
      return (
        <g>
          {[24, 58, 92].map((x) => (
            <g key={x}>
              <rect x={x - 8} y={50} width={16} height={18} fill={P.woodLight} {...line} />
              <circle cx={x + 10} cy={62} r={6} fill="none" stroke={P.woodDark} strokeWidth={STROKE.main} />
            </g>
          ))}
          <path d="M0 76 h120" stroke={P.water} strokeWidth={4} />
        </g>
      )
    case 'toepferwinkel':
      return (
        <g>
          <path d="M40 72 q-8 -14 4 -24 h12 q12 10 4 24 z" fill={P.roof} {...line} />
          <path d="M70 72 q-6 -10 2 -18 h8 q8 8 2 18 z" fill={P.leafAutumn} {...line} />
          <path d="M84 52 q4 -8 8 -16" stroke={P.stoneLight} strokeWidth={STROKE.main} fill="none" />
        </g>
      )
    case 'glaserhuette':
      return (
        <g>
          <rect x={36} y={44} width={48} height={26} fill={P.stone} {...line} />
          <rect x={44} y={50} width={10} height={12} fill={P.waterLight} {...line} />
          <rect x={60} y={50} width={10} height={12} fill={P.blossom} {...line} />
          <Glow x={78} y={40} r={8} m={m} />
          <rect x={74} y={30} width={8} height={14} fill={P.stoneDark} {...line} />
        </g>
      )
    case 'weberdorf':
      return (
        <g>
          <rect x={40} y={44} width={40} height={26} fill={P.woodLight} {...line} />
          {[46, 52, 58, 64, 70, 76].map((x) => (
            <line key={x} x1={x} y1={46} x2={x} y2={68} stroke={P.clothBlue} strokeWidth={STROKE.fine} />
          ))}
          <path d="M42 56 h36" stroke={P.ember} strokeWidth={STROKE.main} />
        </g>
      )
    case 'faerberbach':
      return (
        <g>
          <path d="M0 66 q30 -6 60 0 t60 0" stroke={P.clothBlue} strokeWidth={4} fill="none" />
          <path d="M0 72 q30 -6 60 0 t60 0" stroke={P.thatch} strokeWidth={4} fill="none" />
          <path d="M0 78 q30 -6 60 0 t60 0" stroke={P.roof} strokeWidth={4} fill="none" />
          <path d="M30 50 h60" stroke={P.outline} strokeWidth={STROKE.fine} />
          <rect x={40} y={50} width={8} height={10} fill={P.clothViolet} />
          <rect x={64} y={50} width={8} height={10} fill={P.leafAutumn} />
        </g>
      )
    case 'glockengiesserei':
      return (
        <g>
          <path d="M44 66 q0 -26 16 -26 q16 0 16 26 z" fill={P.leafAutumnDark} {...line} />
          <rect x={40} y={66} width={40} height={4} fill={P.metal} {...line} />
          <circle cx={60} cy={70} r={3} fill={P.metal} {...line} />
        </g>
      )
    case 'papiermuehle':
      return (
        <g>
          <rect x={40} y={46} width={34} height={22} fill={P.paper} {...line} />
          <polygon points="38,46 57,36 76,46" fill={P.slate} {...line} />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={82 + i * 8} y={52 - i * 4} width={6} height={8} fill={P.white} {...line} />
          ))}
        </g>
      )
    case 'uhrmacherturm':
      return (
        <g>
          <rect x={50} y={22} width={20} height={48} fill={P.stoneLight} {...line} />
          <circle cx={60} cy={36} r={7} fill={P.paper} {...line} />
          <path d="M60 36 v-5 M60 36 h4" stroke={P.outline} strokeWidth={STROKE.fine} />
          <polygon points="48,22 60,12 72,22" fill={P.slate} {...line} />
        </g>
      )
    case 'brueckenstadt':
      return (
        <g>
          <rect x={0} y={70} width={120} height={20} fill={P.water} />
          <path d="M10 70 q15 -16 30 0 q15 -16 30 0 q15 -16 30 0" fill="none" stroke={P.stone} strokeWidth={STROKE.bold} />
          <rect x={52} y={44} width={12} height={16} fill={P.stoneLight} {...line} />
        </g>
      )
    case 'markthafen':
      return (
        <g>
          <rect x={0} y={70} width={120} height={20} fill={P.water} />
          <path d="M30 70 h40 l-6 8 h-28 z" fill={P.wood} {...line} />
          <line x1={50} y1={70} x2={50} y2={40} {...line} />
          <path d="M50 42 l16 10 l-16 6 z" fill={P.ember} {...line} />
          <rect x={80} y={50} width={24} height={20} fill={P.woodLight} {...line} />
        </g>
      )
    case 'leuchtfeuer':
      return (
        <g>
          <polygon points="70,72 80,26 92,26 100,72" fill={P.paper} {...line} />
          <path d="M74 54 h24 M77 40 h18" stroke={P.roof} strokeWidth={STROKE.bold} />
          <Glow x={86} y={22} r={12} m={m} />
          <path d="M0 74 l30 -8 l20 8 z" fill={P.stoneDark} />
        </g>
      )
    case 'muschelbucht':
      return (
        <g>
          <path d="M0 70 q60 -16 120 0 v20 h-120 z" fill={P.water} />
          <path d="M50 76 q10 -14 20 0 z" fill={P.blossom} {...line} />
          <path d="M54 76 l6 -10 M60 76 v-12 M66 76 l-6 -10" stroke={P.outline} strokeWidth={STROKE.fine} />
        </g>
      )
    case 'duenenland':
      return (
        <g>
          <path d="M0 74 q30 -24 60 0 q30 -18 60 0 v16 h-120 z" fill={P.thatch} {...line} />
          {[26, 30, 34, 84, 88].map((x) => (
            <path key={x} d={`M${x} 64 l-2 -8 M${x} 64 l2 -8`} stroke={P.grassDark} strokeWidth={STROKE.fine} />
          ))}
        </g>
      )
    case 'seehundbank':
      return (
        <g>
          <rect x={0} y={72} width={120} height={18} fill={P.water} />
          <ellipse cx={60} cy={72} rx={36} ry={6} fill={P.thatch} {...line} />
          <ellipse cx={52} cy={66} rx={10} ry={4} fill={P.stoneDark} {...line} />
          <ellipse cx={72} cy={67} rx={8} ry={3.5} fill={P.stone} {...line} />
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
