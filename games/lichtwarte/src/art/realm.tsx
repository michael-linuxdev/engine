/** Kleine Landschaft je Land (Übersicht, Land-Fenster, ?artsheet). viewBox 0 0 120 90. */
import type { Mood } from '@engine/art'
import { seeded, vary } from '@engine/art'
import { Glow, Tree } from './parts'
import { BEACON, FOLIAGE, GROUND, isDark, ORB, P, RANGES, SHADE, SKY3 } from './palette'
import { STROKE } from './stroke'
import { REALM_IDS } from '../content/realms'

/** Die Hochlande (Welle 5, ab Land 51) bekommen einen eigenen Rahmen: steile Gipfel mit Schnee, Wolkenband, steiniger Boden. */
const HIGHLAND_FROM = 49
const HIGHLANDS: ReadonlySet<string> = new Set(REALM_IDS.slice(HIGHLAND_FROM))

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
    // ── Welle 4 (35–50) ──
    case 'sturmkap':
      return (
        <g>
          <path d="M0 76 q20 -8 40 0 t40 0 t40 0 v14 h-120 z" fill={P.water} />
          <path d="M70 76 l10 -26 l14 0 l10 26 z" fill={P.stoneDark} {...line} />
          <rect x={84} y={40} width={6} height={12} fill={P.white} {...line} />
          <path d="M87 40 l-10 -6 l10 -2 z" fill={P.ember} {...line} />
        </g>
      )
    case 'nordlichtinsel':
      return (
        <g>
          <path d="M10 30 q25 -14 50 0 t50 0" fill="none" stroke={P.glowSoft} strokeWidth={4} opacity={0.7} />
          <path d="M14 38 q25 -12 46 0 t46 0" fill="none" stroke={P.waterLight} strokeWidth={3} opacity={0.6} />
          <rect x={0} y={74} width={120} height={16} fill={P.water} />
          <path d="M36 74 q24 -18 48 0 z" fill={P.snow} {...line} />
          <path d="M54 66 q6 -8 12 0 v6 h-12 z" fill={P.white} {...line} />
        </g>
      )
    case 'bernsteinstrand':
      return (
        <g>
          <path d="M0 72 q60 -10 120 0 v18 h-120 z" fill={P.thatch} {...line} />
          <path d="M0 80 q60 -6 120 0 v10 h-120 z" fill={P.water} />
          {[30, 52, 78].map((x) => (
            <path key={x} d={`M${x} 72 l4 -6 l4 6 l-4 4 z`} fill={P.glowHot} {...line} />
          ))}
        </g>
      )
    case 'treibholzhafen':
      return (
        <g>
          <rect x={0} y={76} width={120} height={14} fill={P.water} />
          <path d="M34 76 q26 12 52 0 l-4 -8 h-44 z" fill={P.woodLight} {...line} />
          <path d="M60 68 v-26" stroke={P.woodDark} strokeWidth={STROKE.fine * 2} />
          <path d="M60 44 l18 20 h-18 z" fill={P.paper} {...line} />
        </g>
      )
    case 'nebelinseln':
      return (
        <g>
          <rect x={0} y={74} width={120} height={16} fill={P.water} />
          {[24, 62, 96].map((x, i) => (
            <path key={x} d={`M${x - 14} 76 q14 ${-16 - i * 4} 28 0 z`} fill={P.grassDark} {...line} />
          ))}
          <rect x={0} y={60} width={120} height={10} fill={P.mist} opacity={0.7} />
        </g>
      )
    case 'walgesang':
      return (
        <g>
          <rect x={0} y={70} width={120} height={20} fill={P.water} />
          <path d="M36 72 q24 -18 48 0 z" fill={P.slate} {...line} />
          <path d="M84 72 q8 -14 14 -10 q-6 2 -6 10 z" fill={P.slate} {...line} />
          <path d="M52 58 q-2 -10 -8 -12 M52 58 q2 -10 8 -12" fill="none" stroke={P.waterLight} strokeWidth={STROKE.fine * 1.5} />
        </g>
      )
    case 'rosenhof':
      return (
        <g>
          <path d="M40 78 v-22 q20 -18 40 0 v22" fill="none" stroke={P.woodDark} strokeWidth={STROKE.fine * 2} />
          {[42, 50, 60, 70, 78].map((x, i) => (
            <circle key={x} cx={x} cy={i % 2 ? 46 : 54} r={4} fill={P.blossom} {...line} />
          ))}
          <path d="M20 78 h80" stroke={P.grassDark} strokeWidth={STROKE.fine * 2} />
        </g>
      )
    case 'hirschgarten':
      return (
        <g>
          <ellipse cx={60} cy={68} rx={14} ry={7} fill={P.woodLight} {...line} />
          <path d="M70 64 l6 -10 v10 z" fill={P.woodLight} {...line} />
          <path d="M74 54 l-4 -10 M74 54 l4 -10 M72 48 l-4 -2 M76 48 l4 -2" stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
          <path d="M50 74 v8 M56 74 v8 M64 74 v8 M70 74 v8" stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
        </g>
      )
    case 'schlossruine':
      return (
        <g>
          <path d="M30 80 v-30 h8 v6 h8 v-6 h8 v30 z" fill={P.stone} {...line} />
          <path d="M62 80 v-40 h6 v5 h6 v-5 h6 v5 h6 v-5 h4 v40 z" fill={P.stoneLight} {...line} />
          <path d="M70 80 v-12 q6 -8 12 0 v12 z" fill={P.stoneDark} {...line} />
          <path d="M30 60 q6 -6 10 2" fill="none" stroke={P.grassDark} strokeWidth={STROKE.fine * 2} />
        </g>
      )
    case 'bibliotheksberg':
      return (
        <g>
          <path d="M34 80 v-34 l26 -12 l26 12 v34 z" fill={P.paper} {...line} />
          {[52, 62, 72].map((y) => (
            <path key={y} d={`M40 ${y} h40`} stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
          ))}
          {[44, 50, 56, 64, 70, 76].map((x, i) => (
            <rect key={x} x={x} y={54} width={4} height={8} fill={i % 2 ? P.clothBlue : P.roof} />
          ))}
        </g>
      )
    case 'orgelklause':
      return (
        <g>
          <path d="M20 80 q40 -52 80 0 z" fill={P.stoneDark} {...line} />
          {[44, 51, 58, 65, 72].map((x, i) => (
            <rect key={x} x={x} y={52 - (2 - Math.abs(i - 2)) * 6} width={5} height={28 + (2 - Math.abs(i - 2)) * 6} fill={P.metal} {...line} />
          ))}
        </g>
      )
    case 'teehaus':
      return (
        <g>
          <path d="M34 60 l26 -14 l26 14 z" fill={P.roof} {...line} />
          <rect x={40} y={60} width={40} height={18} fill={P.paper} {...line} />
          <path d="M60 60 v18 M40 69 h40" stroke={P.woodDark} strokeWidth={STROKE.fine} />
          <path d="M92 78 v-22 M96 78 v-28 M100 78 v-18" stroke={P.grassDark} strokeWidth={STROKE.fine * 2} />
        </g>
      )
    case 'kuppelstadt':
      return (
        <g>
          <path d="M26 80 q0 -30 22 -30 q22 0 22 30 z" fill={P.waterLight} opacity={0.8} {...line} />
          <path d="M62 80 q0 -22 16 -22 q16 0 16 22 z" fill={P.waterLight} opacity={0.8} {...line} />
          <path d="M48 50 v30 M36 56 q12 10 24 0" fill="none" stroke={P.outline} strokeWidth={STROKE.fine} />
        </g>
      )
    case 'wolkenmarkt':
      return (
        <g>
          <path d="M10 50 q50 14 100 0" fill="none" stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
          {[34, 60, 86].map((x, i) => (
            <g key={x}>
              <path d={`M${x} ${56 - Math.abs(i - 1) * 3} v8`} stroke={P.woodDark} strokeWidth={STROKE.fine} />
              <path d={`M${x - 8} ${64 - Math.abs(i - 1) * 3} h16 l-3 10 h-10 z`} fill={i % 2 ? P.clothViolet : P.clothBlue} {...line} />
            </g>
          ))}
          <ellipse cx={30} cy={82} rx={22} ry={5} fill={P.white} opacity={0.8} />
          <ellipse cx={86} cy={84} rx={26} ry={5} fill={P.white} opacity={0.8} />
        </g>
      )
    case 'sternenpfad':
      return (
        <g>
          <path d="M20 84 q20 -10 30 -20 t26 -18 t24 -16" fill="none" stroke={P.paper} strokeWidth={4} strokeLinecap="round" />
          {[[50, 64], [76, 46], [100, 30]].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r={2.5} fill={P.glowHot} />
          ))}
          <path d="M96 22 l2 4 l4 1 l-3 3 l1 4 l-4 -2 l-4 2 l1 -4 l-3 -3 l4 -1 z" fill={P.glowSoft} />
        </g>
      )
    case 'himmelswarte':
      return (
        <g>
          <ellipse cx={34} cy={80} rx={30} ry={6} fill={P.white} opacity={0.85} />
          <ellipse cx={88} cy={82} rx={30} ry={6} fill={P.white} opacity={0.85} />
          <path d="M52 78 l4 -34 h8 l4 34 z" fill={P.stoneLight} {...line} />
          <path d="M52 44 h16 l-2 -6 h-12 z" fill={P.stone} {...line} />
          <circle cx={60} cy={34} r={4} fill={P.glowHot} />
          <circle cx={60} cy={34} r={9} fill={P.glowSoft} opacity={0.45} />
        </g>
      )
    // ── Welle 5 (51–75): die Hochlande ──
    case 'hohesMoor':
      return (
        <g>
          <ellipse cx={46} cy={76} rx={30} ry={6} fill={P.windowDark} opacity={0.75} />
          <ellipse cx={40} cy={75} rx={10} ry={2} fill={P.waterLight} opacity={0.5} />
          <path d="M14 70 h70" stroke={P.woodDark} strokeWidth={3} />
          <path d="M22 70 v5 M38 70 v5 M54 70 v5 M70 70 v5" {...line} />
          <path d="M70 64 h12 v-4 h-12 z M72 60 h10 v-4 h-10 z" fill={P.woodDark} {...line} />
          <ellipse cx={56} cy={58} rx={44} ry={5} fill={P.mist} opacity={0.5} />
        </g>
      )
    case 'steinerneTreppe':
      return (
        <g>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <rect key={i} x={22 + i * 9} y={78 - i * 6} width={12} height={6} fill={i % 2 ? P.stone : P.stoneLight} {...line} />
          ))}
          <path d="M20 74 q30 -26 68 -40" fill="none" stroke={P.woodDark} strokeWidth={STROKE.fine} strokeDasharray="3 2" />
        </g>
      )
    case 'windsattel':
      return (
        <g>
          <path d="M10 84 q20 -44 34 -16 q14 -30 30 2 l6 14 z" fill={P.stone} {...line} />
          <path d="M46 68 v-26" stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
          <path d="M46 42 q10 2 16 -2 q-6 6 -16 8 z" fill={P.ember} {...line} />
          <path d="M60 30 q10 -4 20 0 M64 38 q8 -3 16 0" fill="none" stroke={P.white} strokeWidth={1.2} opacity={0.7} strokeLinecap="round" />
        </g>
      )
    case 'schwarzerSee':
      return (
        <g>
          <ellipse cx={56} cy={74} rx={42} ry={10} fill={P.windowDark} {...line} />
          {[[36, 72], [52, 77], [66, 71], [74, 76]].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r={0.9} fill={P.glowSoft} />
          ))}
          <path d="M18 70 h16 v3 h-16 z" fill={P.stoneLight} {...line} />
          <path d="M40 68 q6 5 14 0 z" fill={P.woodLight} {...line} />
        </g>
      )
    case 'wacholderhang':
      return (
        <g>
          <path d="M0 86 L90 52 V90 H0 Z" fill={P.grassDark} opacity={0.6} />
          {[[22, 76], [40, 69], [58, 62]].map(([x, y]) => (
            <path key={x} d={`M${x} ${y} q-5 -12 0 -20 q5 8 0 20 z`} fill={P.grassDark} {...line} />
          ))}
          <rect x={66} y={50} width={14} height={11} fill={P.woodLight} {...line} />
          <polygon points="64,50 73,43 82,50" fill={P.thatch} {...line} />
          <path d="M73 43 q-3 -6 1 -10 q-2 6 2 8" fill="none" stroke={P.mist} strokeWidth={1.6} strokeLinecap="round" />
        </g>
      )
    case 'zerbrocheneBruecke':
      return (
        <g>
          <path d="M8 66 h44 v6 h-6 q-8 -10 -16 0 h-6 q-8 -10 -16 0 z" fill={P.stoneLight} {...line} />
          <path d="M84 66 h28 v6 h-10 q-6 -8 -12 0 h-6 z" fill={P.stone} {...line} />
          <path d="M52 66 l5 2 M84 66 l-4 3" stroke={P.outline} strokeWidth={STROKE.fine} />
          <path d="M40 66 v-14 h14" fill="none" stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
          <path d="M54 52 v8" stroke={P.woodDark} strokeWidth={STROKE.fine} />
          <rect x={51} y={60} width={6} height={4} fill={P.stoneDark} {...line} />
        </g>
      )
    case 'ziegenpfad':
      return (
        <g>
          <path d="M10 86 q20 -4 26 -14 t24 -12 t22 -14" fill="none" stroke={P.paper} strokeWidth={2.4} strokeLinecap="round" />
          <path d="M44 66 h9 v-4 h-9 z M44 62 l-2 -3 M53 62 l1 -4 M46 66 v4 M51 66 v4" fill={P.white} {...line} />
          <path d="M66 54 v-12" stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
          <circle cx={66} cy={40} r={2.5} fill={P.glowHot} />
          <circle cx={66} cy={40} r={6} fill={P.glowSoft} opacity={0.4} />
        </g>
      )
    case 'alterSteinkreis':
      return (
        <g>
          <ellipse cx={56} cy={76} rx={38} ry={8} fill={P.grassLight} opacity={0.5} />
          {[[22, 74, 12], [34, 68, 15], [50, 65, 17], [66, 66, 14], [80, 70, 13], [70, 80, 10], [38, 82, 9]].map(([x, y, h]) => (
            <path key={x} d={`M${x - 3} ${y} l1 -${h} q2 -3 4 0 l1 ${h} z`} fill={P.stone} {...line} />
          ))}
          <path d="M52 78 h8 l-1 2 h-6 z" fill={P.stoneDark} {...line} />
        </g>
      )
    case 'siebenQuellen':
      return (
        <g>
          <path d="M14 60 l14 -8 l12 6 l14 -8 l14 6 l14 -6 v14 h-68 z" fill={P.stone} {...line} />
          {[20, 30, 40, 50, 60, 70, 78].map((x, i) => (
            <path key={x} d={`M${x} ${58 + (i % 2) * 3} q${i % 2 ? 3 : -3} 12 0 ${22 - (i % 3) * 2}`} fill="none" stroke={P.waterLight} strokeWidth={1.6} strokeLinecap="round" />
          ))}
          <ellipse cx={48} cy={84} rx={36} ry={4} fill={P.water} opacity={0.8} />
        </g>
      )
    case 'adlerwand':
      return (
        <g>
          <path d="M30 88 l6 -52 l14 -8 l12 6 l8 54 z" fill={P.stone} {...line} />
          <path d="M40 60 h10 M52 46 h9" stroke={P.stoneDark} strokeWidth={STROKE.fine * 1.5} />
          <path d="M40 59 q5 -4 10 0 z M52 45 q4 -4 9 0 z" fill={P.thatchDark} {...line} />
          <path d="M72 30 q6 -5 10 0 q4 -5 10 0" fill="none" stroke={P.outline} strokeWidth={1.6} strokeLinecap="round" />
          <path d="M36 36 v40" stroke={P.woodLight} strokeWidth={STROKE.fine} strokeDasharray="2 2" />
        </g>
      )
    case 'schieferbruch':
      return (
        <g>
          <path d="M14 84 v-30 h18 v-8 h20 v-8 h22 v46 z" fill={P.slate} {...line} />
          <path d="M14 62 h60 M32 54 h42 M14 72 h60" stroke={P.outline} strokeWidth={STROKE.fine * 0.7} opacity={0.6} />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M${24 + i * 4} 84 l8 -12 l2 1 l-8 12 z`} fill={P.stoneDark} {...line} />
          ))}
        </g>
      )
    case 'nebelkessel':
      return (
        <g>
          <ellipse cx={56} cy={75} rx={48} ry={12} fill={P.stone} opacity={0.6} />
          <ellipse cx={56} cy={72} rx={40} ry={9} fill={P.mist} opacity={0.85} />
          <ellipse cx={46} cy={66} rx={26} ry={5} fill={P.white} opacity={0.6} />
          {[26, 44, 62].map((x) => (
            <g key={x}>
              <path d={`M${x} 62 v-18 M${x + 12} 62 v-18`} stroke={P.woodDark} strokeWidth={STROKE.fine} />
              <path d={`M${x} 46 h12 v12 h-12 z`} fill={P.waterLight} opacity={0.35} stroke={P.outline} strokeWidth={0.5} />
            </g>
          ))}
        </g>
      )
    case 'letzteWeide':
      return (
        <g>
          <path d="M0 78 Q50 62 120 76 V90 H0 Z" fill={P.grassLight} />
          <rect x={24} y={58} width={22} height={13} fill={P.woodLight} {...line} />
          <polygon points="21,58 35,48 49,58" fill={P.stoneDark} {...line} />
          {[[58, 74], [68, 70], [76, 77]].map(([x, y]) => (
            <path key={x} d={`M${x} ${y} h7 v-4 h-7 z M${x + 7} ${y - 4} l2 -2`} fill={P.white} {...line} />
          ))}
          {[[54, 82], [64, 84], [84, 82]].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r={1.2} fill={P.clothBlue} />
          ))}
        </g>
      )
    case 'roteHalde':
      return (
        <g>
          <path d="M10 84 q16 -30 30 -8 q10 -22 26 0 q6 -10 14 8 z" fill={P.roofDark} {...line} />
          <path d="M22 74 q8 -6 14 0 M52 72 q6 -5 12 0" fill="none" stroke={P.roof} strokeWidth={1.4} />
          <path d="M40 84 v-10 q5 -6 10 0 v10 z" fill={P.windowDark} {...line} />
          <path d="M38 74 h14" stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
          <path d="M62 78 h18 l-3 5 h-12 z" fill={P.woodLight} {...line} />
        </g>
      )
    case 'stillesKloster':
      return (
        <g>
          <rect x={24} y={54} width={50} height={26} fill={P.stoneLight} {...line} />
          <polygon points="22,54 49,42 76,54" fill={P.slate} {...line} />
          <rect x={60} y={36} width={10} height={18} fill={P.stoneLight} {...line} />
          <polygon points="59,36 65,28 71,36" fill={P.slate} {...line} />
          {[32, 44, 56].map((x) => (
            <path key={x} d={`M${x} 74 v-9 q3 -4 6 0 v9 z`} fill={P.windowDark} {...line} />
          ))}
          <rect x={45.5} y={67} width={3} height={5} fill={P.glowHot} />
          <circle cx={47} cy={66} r={5} fill={P.glowSoft} opacity={0.45} />
        </g>
      )
    case 'laerchenwald':
      return (
        <g>
          {[[20, 80, 26], [36, 76, 32], [52, 80, 28], [68, 75, 34], [80, 82, 24]].map(([x, y, h]) => (
            <g key={x}>
              <path d={`M${x} ${y} v-6`} stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
              <path d={`M${x - 7} ${y - 5} l7 -${h} l7 ${h} z`} fill={m.season === 'autumn' ? P.glow : m.season === 'winter' ? P.woodLight : leaf} {...line} />
            </g>
          ))}
        </g>
      )
    case 'wasserscheide':
      return (
        <g>
          <path d="M10 86 L56 44 L102 86 Z" fill={P.stone} {...line} />
          <path d="M54 50 q-10 14 -30 34" fill="none" stroke={P.waterLight} strokeWidth={2} strokeLinecap="round" />
          <path d="M58 50 q8 16 24 34" fill="none" stroke={P.water} strokeWidth={2} strokeLinecap="round" />
          <path d="M56 44 v-12" stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
          <path d="M50 34 h12" stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
        </g>
      )
    case 'hoehlenstadt':
      return (
        <g>
          <path d="M12 86 q4 -46 44 -48 q40 2 44 48 z" fill={P.stoneDark} {...line} />
          <path d="M26 86 q2 -30 30 -32 q28 2 30 32 z" fill={P.windowDark} />
          {[[38, 76], [48, 66], [58, 74], [66, 64], [72, 78], [44, 82]].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <rect x={x - 1.5} y={y - 2} width={3} height={4} fill={P.glowHot} />
              <circle cx={x} cy={y} r={4} fill={P.glowSoft} opacity={0.3} />
            </g>
          ))}
        </g>
      )
    case 'donnerschlucht':
      return (
        <g>
          <path d="M8 88 v-50 l22 8 l6 42 z M104 88 v-52 l-24 10 l-6 42 z" fill={P.stone} {...line} />
          <path d="M50 40 q4 24 0 46 h16 q-4 -22 0 -46 z" fill={P.waterLight} opacity={0.9} />
          <path d="M54 44 v36 M60 46 v34" stroke={P.white} strokeWidth={1} opacity={0.7} />
          <ellipse cx={58} cy={86} rx={18} ry={4} fill={P.white} opacity={0.7} />
          <path d="M32 60 q26 8 46 0" fill="none" stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
        </g>
      )
    case 'firnfeld':
      return (
        <g>
          <path d="M0 70 Q40 56 120 66 V90 H0 Z" fill={P.snow} />
          <path d="M0 78 Q50 68 120 76" fill="none" stroke={P.snowShade} strokeWidth={1.6} />
          <path d="M44 72 q14 4 26 0" fill="none" stroke={P.waterLight} strokeWidth={2} />
          {[22, 40, 58, 76].map((x, i) => (
            <path key={x} d={`M${x} ${74 - i} v-14`} stroke={P.ember} strokeWidth={STROKE.fine * 1.5} />
          ))}
          <path d="M20 84 l4 -1 M30 83 l4 -1 M40 82 l4 -1 M50 81 l4 -1" stroke={P.snowShade} strokeWidth={1.4} strokeLinecap="round" />
        </g>
      )
    case 'hirtenmarkt':
      return (
        <g>
          <path d="M56 80 v-40" stroke={P.woodDark} strokeWidth={STROKE.main} />
          <path d="M56 42 q-14 4 -30 0 M56 42 q14 4 28 0" fill="none" stroke={P.woodDark} strokeWidth={STROKE.fine} />
          {[30, 38, 46, 64, 72, 80].map((x, i) => (
            <path key={x} d={`M${x} 44 l3 5 l-6 0 z`} fill={[P.ember, P.clothBlue, P.glow][i % 3]} {...line} />
          ))}
          <path d="M22 80 h18 v-8 h-18 z M20 72 h22 l-3 -5 h-16 z" fill={P.clothViolet} {...line} />
          <path d="M68 82 h16 v-8 h-16 z M66 74 h20 l-3 -5 h-14 z" fill={P.clothBlue} {...line} />
        </g>
      )
    case 'sternplatte':
      return (
        <g>
          <path d="M8 84 l10 -14 h76 l10 14 z" fill={P.stoneLight} {...line} />
          <path d="M28 78 l10 -4 l12 3 l10 -5 l14 4" fill="none" stroke={P.stoneDark} strokeWidth={1} />
          {[[28, 78], [38, 74], [50, 77], [60, 72], [74, 76]].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r={1.3} fill={P.glowSoft} stroke={P.outline} strokeWidth={0.4} />
          ))}
          <path d="M40 30 l1.4 3 l3 .6 l-2.2 2.2 l.6 3 l-2.8 -1.5 l-2.8 1.5 l.6 -3 l-2.2 -2.2 l3 -.6 z" fill={P.glowSoft} />
        </g>
      )
    case 'kalterOfen':
      return (
        <g>
          <path d="M26 84 v-22 q0 -24 26 -24 q26 0 26 24 v22 z" fill={P.stoneDark} {...line} />
          <path d="M42 84 v-14 q10 -12 20 0 v14 z" fill={P.windowDark} {...line} />
          <path d="M34 60 h36 M30 70 h10 M64 70 h10" stroke={P.outline} strokeWidth={STROKE.fine * 0.7} opacity={0.6} />
          <rect x={48} y={30} width={8} height={10} fill={P.stoneDark} {...line} />
          <ellipse cx={52} cy={84} rx={8} ry={2} fill={P.rubble} />
        </g>
      )
    case 'grenzstein':
      return (
        <g>
          <path d="M0 84 q30 -6 56 -4 M56 80 q30 -8 64 -2" fill="none" stroke={P.paper} strokeWidth={2.4} strokeLinecap="round" />
          <path d="M48 80 l2 -30 q6 -6 12 0 l2 30 z" fill={P.stoneLight} {...line} />
          <path d="M53 62 h6 v6 h-6 z M56 62 v-3" fill={P.glow} stroke={P.outline} strokeWidth={0.6} />
          <path d="M52 72 q4 -4 8 0 q-4 4 -8 0 z" fill="none" stroke={P.stoneDark} strokeWidth={1} />
        </g>
      )
    case 'ersteWarte':
      return (
        <g>
          <path d="M34 82 v-14 h6 v-6 h6 v8 h8 v-12 h6 v8 h6 v16 z" fill={P.stoneLight} {...line} />
          <path d="M26 82 h56 M30 86 h48" stroke={P.stoneDark} strokeWidth={STROKE.fine * 1.5} />
          <path d="M50 58 h12 l-2 5 h-8 z" fill={P.metal} {...line} />
          <path d="M53 58 q3 -8 6 0 z" fill={P.glowHot} />
          <circle cx={56} cy={54} r={9} fill={P.glowSoft} opacity={0.4} />
          <path d="M22 70 h4 M22 74 h4 M22 78 h4" stroke={P.woodDark} strokeWidth={STROKE.fine} />
          <path d="M22 66 v16 M26 66 v16" stroke={P.woodDark} strokeWidth={STROKE.fine} />
        </g>
      )
    default:
      return null
  }
}

/**
 * Rahmen jedes Lande-Bilds im Stil der Talkarte: Himmel in drei Stufen, Gestirn mit Hof,
 * zwei Bergketten (je Land anders geschnitten), Boden mit Lichtkante, abends die Lasur
 * und darüber das Feuer des Landes — jedes Land hütet sein eigenes.
 */
export function RealmArt({ id, m }: { id: string; m: Mood }) {
  const [top, mid, low] = SKY3[m.daypart]
  const [far, near] = GROUND[m.season]
  const [rFar, rMid] = RANGES[m.daypart]
  const [disc, halo] = ORB[m.daypart]
  const [shade, alpha] = SHADE[m.daypart]
  const uid = `realm-${id}-${m.daypart}-${m.season}`
  const rnd = seeded(`realm-${id}`)
  const peaks = (base: number, amp: number) => {
    let d = `M0 ${base}`
    for (let x = 0; x <= 120; x += 20) d += ` L${x + 10} ${base - vary(rnd, amp * 0.4, amp)} L${x + 20} ${base - vary(rnd, 0, amp * 0.3)}`
    return `${d} V90 H0 Z`
  }
  const high = HIGHLANDS.has(id)
  // Hochland: wenige hohe, spitze Gipfel; die Schneekappe folgt derselben Spitze
  const crags = (() => {
    let far = 'M0 52'
    let caps = ''
    if (high) {
      for (let x = 0; x < 120; x += 30) {
        const px = x + 15 + vary(rnd, -5, 5)
        const py = 14 + vary(rnd, 0, 14)
        far += ` L${px} ${py} L${x + 30} ${44 + vary(rnd, 0, 8)}`
        caps += `M${px} ${py} l-5 9 l3 -1.5 l2 2.5 l2.5 -3 l3 2 z `
      }
    }
    return { far: `${far} V90 H0 Z`, caps }
  })()
  const dark = isDark(m)
  const ox = 22 + vary(rnd, 0, 76)
  const fx = 96 - vary(rnd, 0, 8)
  return (
    <svg viewBox="0 0 120 90" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="0.45" stopColor={mid} />
          <stop offset="0.7" stopColor={low} />
        </linearGradient>
        <radialGradient id={`${uid}-halo`}>
          <stop offset="0" stopColor={halo} stopOpacity="0.7" />
          <stop offset="1" stopColor={halo} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-fire`}>
          <stop offset="0" stopColor={BEACON.core} stopOpacity="0.95" />
          <stop offset="0.4" stopColor={BEACON.warm} stopOpacity="0.5" />
          <stop offset="1" stopColor={BEACON.hot} stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${uid}-clip`}>
          <rect x={1} y={1} width={118} height={88} rx={9} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid}-clip)`}>
        <rect x={0} y={0} width={120} height={90} fill={`url(#${uid}-sky)`} />
        {m.daypart === 'night' ? (
          <g fill={P.glowSoft}>
            {Array.from({ length: 12 }, (_, i) => (
              <circle key={i} cx={vary(rnd, 3, 117)} cy={vary(rnd, 3, 34)} r={i % 4 === 0 ? 1 : 0.6} />
            ))}
          </g>
        ) : null}
        <circle cx={ox} cy={16} r={15} fill={`url(#${uid}-halo)`} />
        <circle cx={ox} cy={16} r={5} fill={disc} />
        {high ? (
          <>
            <path d={crags.far} fill={rFar} />
            <path d={crags.caps} fill={P.snow} opacity={0.9} />
            <path d={peaks(54, 20)} fill={rMid} />
            <ellipse cx={30 + vary(rnd, 0, 20)} cy={52} rx={34} ry={3.5} fill={P.white} opacity={0.5} />
            <ellipse cx={92} cy={56} rx={30} ry={3} fill={P.white} opacity={0.4} />
            <path d="M0 62 L24 58 L50 62 L82 57 L120 62 V90 H0 Z" fill={far} />
            <path d="M0 62 L24 58 L50 62 L82 57 L120 62 V90 H0 Z" fill={P.stone} opacity={0.35} />
            <path d="M0 76 Q60 68 120 76 V90 H0 Z" fill={near} />
            <path d="M0 76 Q60 68 120 76 V90 H0 Z" fill={P.stoneLight} opacity={0.22} />
          </>
        ) : (
          <>
            <path d={peaks(50, 24)} fill={rFar} />
            <path d={peaks(56, 16)} fill={rMid} />
            <path d="M0 60 Q60 48 120 60 V90 H0 Z" fill={far} />
            <path d="M0 61 Q60 49 120 61" fill="none" stroke={P.white} strokeWidth={1.4} opacity={0.18} />
            <path d="M0 74 Q60 66 120 74 V90 H0 Z" fill={near} />
          </>
        )}
        <Landmark id={id} m={m} />
        {alpha > 0 ? <rect x={0} y={44} width={120} height={46} fill={shade} opacity={alpha * 0.75} /> : null}
        {/* Das Feuer des Landes */}
        <path d={`M${fx - 2.5} 72 h5 l-1 -3 h-3 z`} fill={P.metal} stroke={P.outline} strokeWidth={0.6} />
        <path d={`M${fx - 1.6} 69 q1.6 -5 3.2 0 z`} fill={P.glowHot} />
        <circle cx={fx} cy={67} r={dark ? 13 : 6} fill={`url(#${uid}-fire)`} opacity={dark ? 0.95 : 0.6} />
      </g>
      <rect x={1} y={1} width={118} height={88} rx={9} fill="none" stroke={P.outline} strokeWidth={STROKE.main} />
    </svg>
  )
}
