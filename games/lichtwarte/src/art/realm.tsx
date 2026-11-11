/** Kleine Landschaft je Land (Übersicht, Land-Fenster, ?artsheet). viewBox 0 0 120 90. */
import type { Mood } from '@engine/art'
import { seeded, vary } from '@engine/art'
import { Glow, Tree } from './parts'
import { BEACON, FOLIAGE, GROUND, isDark, ORB, P, RANGES, SHADE, SKY3 } from './palette'
import { STROKE } from './stroke'
import { REALM_IDS } from '../content/realms'

/** Die Hochlande (Welle 5, ab Land 51) bekommen einen eigenen Rahmen: steile Gipfel mit Schnee, Wolkenband, steiniger Boden. */
const HIGHLAND_FROM = 49
const COAST_FROM = 74
const HIGHLANDS: ReadonlySet<string> = new Set(REALM_IDS.slice(HIGHLAND_FROM, COAST_FROM))
/** Die Fernen Küsten (Welle 6, ab Land 76): Meer bis zum Horizont, ferne Landzungen, Sandstrand. */
const ISLE_FROM = 99
const RIM_FROM = 124
const COASTS: ReadonlySet<string> = new Set(REALM_IDS.slice(COAST_FROM, ISLE_FROM))
/** Die Inseln (Welle 7): Meer ringsum, das Land ist ein Fleck Sand und Gras im Vordergrund. */
const ISLES: ReadonlySet<string> = new Set(REALM_IDS.slice(ISLE_FROM, RIM_FROM))
/** Der Rand der Karte (Welle 8): der gewohnte Rahmen, dazu ein fernes Licht und ein Schleier am Himmel. */
const RIM: ReadonlySet<string> = new Set(REALM_IDS.slice(RIM_FROM))
/** Lande, die ganz auf dem Wasser liegen: Meer bis zum unteren Rand, kein Ufer. */
const OPEN_SEA: ReadonlySet<string> = new Set(['offenesMeer', 'treibendeInsel', 'walweg', 'schwimmenderMarkt', 'korallengarten', 'bojenkette', 'stadtAufDerSandbank', 'wurzelwald'])
/** Lande am Rand der Karte, die am Ufer liegen (Küsten-Rahmen). */
const RIM_SHORE: ReadonlySet<string> = new Set(['letzterHafen', 'fremdeKueste'])

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
    // ── Welle 6 (76–100): die Fernen Küsten ──
    case 'langerAbstieg':
      return (
        <g>
          <path d="M0 40 L70 88 H0 Z" fill={P.stone} {...line} />
          <path d="M6 48 l18 8 l-12 8 l22 8 l-14 8 l20 6" fill="none" stroke={P.paper} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M30 70 h8 v-4 h-8 z M38 66 l2 -3 M32 70 v3 M36 70 v3" fill={P.woodLight} {...line} />
        </g>
      )
    case 'tropfenderWald':
      return (
        <g>
          {[[18, 82, 30], [38, 84, 36], [60, 82, 32], [80, 85, 28]].map(([x, y, h]) => (
            <g key={x}>
              <path d={`M${x} ${y} v-${h}`} stroke={P.woodDark} strokeWidth={3} />
              <ellipse cx={x} cy={y - h} rx={13} ry={9} fill={P.grassDark} {...line} />
              <path d={`M${x - 6} ${y - h + 8} v5 M${x + 5} ${y - h + 8} v7`} stroke={P.waterLight} strokeWidth={1.2} strokeLinecap="round" />
            </g>
          ))}
          <ellipse cx={50} cy={50} rx={46} ry={5} fill={P.mist} opacity={0.5} />
        </g>
      )
    case 'salzterrassen':
      return (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <path d={`M${10 + i * 6} ${84 - i * 7} h${70 - i * 4} l4 -5 h-${70 - i * 4} z`} fill={P.waterLight} opacity={0.85} {...line} />
            </g>
          ))}
          {[[30, 60], [44, 58], [58, 60]].map(([x, y]) => (
            <path key={x} d={`M${x - 4} ${y} l4 -7 l4 7 z`} fill={P.white} {...line} />
          ))}
        </g>
      )
    case 'gezeitenmuehle':
      return (
        <g>
          <rect x={30} y={52} width={30} height={26} fill={P.stoneLight} {...line} />
          <polygon points="27,52 45,40 63,52" fill={P.roof} {...line} />
          <circle cx={66} cy={72} r={10} fill="none" stroke={P.woodDark} strokeWidth={STROKE.main} />
          <path d="M66 62 v20 M56 72 h20 M59 65 l14 14 M73 65 l-14 14" stroke={P.woodDark} strokeWidth={STROKE.fine} />
          <rect x={40} y={60} width={7} height={8} fill={P.windowDark} {...line} />
        </g>
      )
    case 'weisseKlippen':
      return (
        <g>
          <path d="M0 86 V46 l20 -6 l14 4 l10 -6 l14 6 l6 42 z" fill={P.white} {...line} />
          <path d="M10 56 h30 M6 68 h44 M14 78 h40" stroke={P.snowShade} strokeWidth={1} />
          <path d="M70 86 l2 -16 l4 -2 l3 18 z" fill={P.white} {...line} />
        </g>
      )
    case 'bootsfriedhof':
      return (
        <g>
          <path d="M16 80 q18 10 40 0 l-4 -8 h-32 z" fill={P.woodDark} {...line} />
          {[24, 30, 36, 42, 48].map((x) => (
            <path key={x} d={`M${x} 72 q2 -12 0 -16`} fill="none" stroke={P.woodLight} strokeWidth={STROKE.fine * 1.5} />
          ))}
          <path d="M60 84 l18 -10 l4 4 l-16 10 z" fill={P.woodLight} {...line} />
          <rect x={68} y={60} width={5} height={7} fill={P.glow} {...line} />
        </g>
      )
    case 'lotsenturm':
      return (
        <g>
          <path d="M50 84 l2 -40 h8 l2 40 z" fill={P.white} {...line} />
          <path d="M50 70 h12 M51 56 h10" stroke={P.ember} strokeWidth={4} />
          <rect x={48} y={38} width={16} height={6} fill={P.metal} {...line} />
          <polygon points="48,38 56,30 64,38" fill={P.roofDark} {...line} />
          <path d="M64 41 l14 -3" stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
        </g>
      )
    case 'seegraswiesen':
      return (
        <g>
          <path d="M0 76 Q60 68 120 78 V90 H0 Z" fill={P.grassDark} opacity={0.8} />
          {[14, 26, 38, 50, 62, 74].map((x, i) => (
            <path key={x} d={`M${x} ${82 - (i % 2) * 2} q-3 -8 0 -12 M${x + 3} ${82 - (i % 2) * 2} q3 -7 1 -11`} fill="none" stroke={P.grassLight} strokeWidth={1.4} strokeLinecap="round" />
          ))}
          <path d="M44 66 h16 v-8 h-16 z M42 58 h20 l-3 -5 h-14 z M46 66 v8 M58 66 v8" fill={P.thatch} {...line} />
        </g>
      )
    case 'glockentonne':
      return (
        <g>
          <path d="M44 76 l4 -10 h12 l4 10 z" fill={P.ember} {...line} />
          <path d="M48 66 l6 -18 l6 18" fill="none" stroke={P.metal} strokeWidth={STROKE.main} />
          <path d="M51 56 q3 -4 6 0 v5 h-6 z" fill={P.glow} {...line} />
          <path d="M34 78 q10 -4 20 0 t20 0" fill="none" stroke={P.white} strokeWidth={1.4} opacity={0.8} />
        </g>
      )
    case 'netzmacherdorf':
      return (
        <g>
          <rect x={14} y={62} width={18} height={16} fill={P.woodLight} {...line} />
          <polygon points="12,62 23,53 34,62" fill={P.roofDark} {...line} />
          <rect x={64} y={60} width={18} height={18} fill={P.woodLight} {...line} />
          <polygon points="62,60 73,51 84,60" fill={P.roof} {...line} />
          <path d="M32 58 q16 12 32 0" fill="none" stroke={P.woodDark} strokeWidth={STROKE.fine} />
          <path d="M34 60 l6 12 M40 63 l4 10 M46 64 l2 10 M52 63 l-2 10 M58 61 l-4 12 M36 66 h22 M39 71 h16" stroke={P.thatchDark} strokeWidth={0.8} />
        </g>
      )
    case 'sturmhafen':
      return (
        <g>
          <path d="M6 74 h44 v6 h-44 z M50 74 q10 -12 26 -12 v6 q-12 0 -20 12 z" fill={P.stoneDark} {...line} />
          <path d="M24 72 l2 -16 h3 l2 16 z" fill={P.woodDark} {...line} />
          <path d="M27 56 l10 6 l-10 4 z" fill={P.paper} {...line} />
          <path d="M14 84 q6 -5 12 0 t12 0 t12 0" fill="none" stroke={P.white} strokeWidth={1.4} opacity={0.8} />
        </g>
      )
    case 'leuchtschiff':
      return (
        <g>
          <path d="M20 76 q30 12 62 0 l-6 -9 h-50 z" fill={P.ember} {...line} />
          <path d="M50 67 v-30" stroke={P.woodDark} strokeWidth={STROKE.main} />
          <rect x={46} y={32} width={8} height={7} fill={P.glowHot} {...line} />
          <circle cx={50} cy={35} r={10} fill={P.glowSoft} opacity={0.4} />
          <rect x={36} y={60} width={12} height={7} fill={P.white} {...line} />
        </g>
      )
    case 'muschelkalkofen':
      return (
        <g>
          <path d="M34 82 v-18 q0 -16 16 -16 q16 0 16 16 v18 z" fill={P.white} {...line} />
          <path d="M44 82 v-10 q6 -8 12 0 v10 z" fill={P.windowDark} {...line} />
          <path d="M46 80 q4 -8 8 0 z" fill={P.glowHot} />
          <circle cx={50} cy={76} r={8} fill={P.glowSoft} opacity={0.4} />
          <ellipse cx={22} cy={82} rx={10} ry={4} fill={P.paper} {...line} />
          <path d="M50 46 q-3 -6 1 -10" fill="none" stroke={P.mist} strokeWidth={1.8} strokeLinecap="round" />
        </g>
      )
    case 'wattenweg':
      return (
        <g>
          <path d="M0 74 Q60 68 120 76 V90 H0 Z" fill={P.stone} opacity={0.5} />
          {[14, 30, 46, 62, 78].map((x, i) => (
            <g key={x}>
              <path d={`M${x} ${84 - i * 2} v-12`} stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
              <path d={`M${x} ${72 - i * 2} l-3 -4 M${x} ${72 - i * 2} l3 -4 M${x} ${72 - i * 2} v-5`} stroke={P.thatchDark} strokeWidth={0.9} />
            </g>
          ))}
          <path d="M8 86 q40 -8 80 -12" fill="none" stroke={P.paper} strokeWidth={1.4} strokeDasharray="2 3" />
        </g>
      )
    case 'vogelinsel':
      return (
        <g>
          <path d="M22 80 q8 -22 26 -24 q20 2 28 24 z" fill={P.stone} {...line} />
          <rect x={44} y={50} width={10} height={8} fill={P.woodLight} {...line} />
          <polygon points="42,50 49,44 56,50" fill={P.roofDark} {...line} />
          {[[30, 36], [44, 30], [62, 34], [74, 42], [20, 46]].map(([x, y]) => (
            <path key={x} d={`M${x - 4} ${y} q2 -3 4 0 q2 -3 4 0`} fill="none" stroke={P.outline} strokeWidth={1.2} strokeLinecap="round" />
          ))}
        </g>
      )
    case 'versunkenesDorf':
      return (
        <g>
          <path d="M0 76 Q60 70 120 78 V90 H0 Z" fill={P.stone} opacity={0.45} />
          <path d="M46 80 v-26 h10 v26 z" fill={P.stoneLight} {...line} />
          <polygon points="45,54 51,40 57,54" fill={P.slate} {...line} />
          <path d="M49 64 h4 v6 h-4 z" fill={P.windowDark} {...line} />
          <path d="M20 80 h14 M66 82 h18 M26 80 v-4 M72 82 v-5" stroke={P.stoneDark} strokeWidth={STROKE.fine * 1.5} />
        </g>
      )
    case 'hausDerSeekarten':
      return (
        <g>
          <rect x={26} y={50} width={44} height={30} fill={P.woodLight} {...line} />
          <polygon points="23,50 48,36 73,50" fill={P.slate} {...line} />
          <rect x={34} y={58} width={28} height={16} fill={P.paper} {...line} />
          <path d="M38 70 q6 -8 10 -2 t10 -4" fill="none" stroke={P.clothBlue} strokeWidth={1.2} />
          {[[40, 62], [50, 66], [57, 61]].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r={1.2} fill={P.ember} />
          ))}
        </g>
      )
    case 'walknochenbogen':
      return (
        <g>
          <path d="M34 84 q2 -44 22 -46" fill="none" stroke={P.white} strokeWidth={5} strokeLinecap="round" />
          <path d="M78 84 q-2 -44 -22 -46" fill="none" stroke={P.white} strokeWidth={5} strokeLinecap="round" />
          <path d="M34 84 q2 -44 22 -46 M78 84 q-2 -44 -22 -46" fill="none" stroke={P.outline} strokeWidth={0.8} />
          <path d="M20 86 h72" stroke={P.thatchDark} strokeWidth={1.2} strokeDasharray="3 4" />
        </g>
      )
    case 'strandDerLichter':
      return (
        <g>
          <path d="M0 70 Q60 62 120 72 V90 H0 Z" fill={P.windowDark} opacity={0.6} />
          {Array.from({ length: 22 }, (_, i) => (
            <circle key={i} cx={8 + ((i * 37) % 104)} cy={70 + ((i * 13) % 16)} r={i % 3 === 0 ? 1.4 : 0.9} fill={i % 2 ? P.glowSoft : P.waterLight} />
          ))}
          <path d="M40 78 q10 5 22 0 l-2 -4 h-18 z" fill={P.woodDark} {...line} />
        </g>
      )
    case 'kompassrose':
      return (
        <g>
          <ellipse cx={52} cy={76} rx={36} ry={10} fill={P.stoneLight} {...line} />
          <path d="M52 66 l3 10 l-3 10 l-3 -10 z M22 76 l30 -3 l30 3 l-30 3 z" fill={P.stoneDark} stroke={P.outline} strokeWidth={0.6} />
          <path d="M52 66 l3 10 h-6 z" fill={P.glow} stroke={P.outline} strokeWidth={0.6} />
          <path d="M30 70 l22 6 M74 70 l-22 6 M30 82 l22 -6 M74 82 l-22 -6" stroke={P.metal} strokeWidth={1} />
        </g>
      )
    case 'nebelhornfelsen':
      return (
        <g>
          <path d="M26 86 q0 -40 26 -44 q22 4 24 44 z" fill={P.stoneDark} {...line} />
          <ellipse cx={52} cy={62} rx={8} ry={6} fill={P.windowDark} {...line} />
          <path d="M62 60 q10 -4 18 0 M64 66 q10 -2 20 2" fill="none" stroke={P.white} strokeWidth={1.4} opacity={0.75} strokeLinecap="round" />
          <ellipse cx={86} cy={62} rx={16} ry={4} fill={P.mist} opacity={0.6} />
        </g>
      )
    case 'flaschenpostbucht':
      return (
        <g>
          <path d="M0 78 Q40 66 90 80 V90 H0 Z" fill={P.paper} opacity={0.55} />
          {[[24, 80, -20], [44, 76, 15], [62, 82, -35]].map(([x, y, r]) => (
            <g key={x} transform={`translate(${x} ${y}) rotate(${r})`}>
              <path d="M-3 0 v-8 q0 -2 1.5 -3 v-3 h3 v3 q1.5 1 1.5 3 v8 z" fill={P.grassLight} opacity={0.85} stroke={P.outline} strokeWidth={0.7} />
              <rect x={-1.5} y={-7} width={3} height={5} fill={P.paper} />
            </g>
          ))}
          <path d="M70 60 v20 M64 64 h14" stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
          <path d="M66 64 v7 h3 v-7 M72 64 v9 h3 v-9" fill={P.paper} stroke={P.outline} strokeWidth={0.6} />
        </g>
      )
    case 'alteSternwarte':
      return (
        <g>
          <rect x={36} y={60} width={32} height={22} fill={P.stoneLight} {...line} />
          <path d="M34 60 q18 -26 36 0 z" fill={P.grass} {...line} />
          <path d="M52 47 v13" stroke={P.outline} strokeWidth={2.4} />
          <path d="M52 50 l16 -12" stroke={P.metal} strokeWidth={3.4} strokeLinecap="round" />
          <rect x={48} y={68} width={8} height={14} fill={P.windowDark} {...line} />
          <path d="M80 28 l1.2 2.6 l2.8 .5 l-2 2 l.5 2.8 l-2.5 -1.4 l-2.5 1.4 l.5 -2.8 l-2 -2 l2.8 -.5 z" fill={P.glowSoft} />
        </g>
      )
    case 'langerDamm':
      return (
        <g>
          <path d="M0 84 L96 62 l2 4 L0 90 Z" fill={P.stone} {...line} />
          {[16, 36, 56, 76, 94].map((x, i) => (
            <g key={x}>
              <path d={`M${x} ${80 - i * 4.4} v-9`} stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
              <circle cx={x} cy={70 - i * 4.4} r={1.8} fill={P.glowHot} />
              <circle cx={x} cy={70 - i * 4.4} r={4.5} fill={P.glowSoft} opacity={0.35} />
            </g>
          ))}
        </g>
      )
    case 'warteDerVierStrahlen':
      return (
        <g>
          <path d="M50 84 l3 -36 h10 l3 36 z" fill={P.stoneLight} {...line} />
          <path d="M49 48 h18 l-2 -7 h-14 z" fill={P.stone} {...line} />
          <polygon points="51,41 58,32 65,41" fill={P.roof} {...line} />
          <path d="M58 44 l-34 -10 M58 44 l34 -10 M58 44 l-36 6 M58 44 l36 6" stroke={P.glowSoft} strokeWidth={2.2} opacity={0.55} strokeLinecap="round" />
          <circle cx={58} cy={44} r={3.5} fill={P.glowHot} />
          <circle cx={58} cy={44} r={9} fill={P.glowSoft} opacity={0.45} />
          <rect x={55} y={72} width={6} height={12} fill={P.windowDark} {...line} />
        </g>
      )
    // ── Welle 7 (101–125): die Inseln ──
    case 'schulinsel':
      return (
        <g>
          <rect x={34} y={56} width={36} height={22} fill={P.paper} {...line} />
          <polygon points="31,56 52,42 73,56" fill={P.roof} {...line} />
          <rect x={48} y={34} width={8} height={8} fill="none" {...line} />
          <path d="M50 40 q2 -4 4 0 z" fill={P.glow} {...line} />
          <rect x={40} y={62} width={7} height={8} fill={P.windowDark} {...line} />
          <rect x={56} y={64} width={7} height={14} fill={P.woodDark} {...line} />
        </g>
      )
    case 'kleineSchwester':
      return (
        <g>
          <path d="M52 76 v-18" stroke={P.woodDark} strokeWidth={STROKE.main} />
          <circle cx={52} cy={52} r={9} fill={leaf} {...line} />
          <path d="M36 78 h12 v-3 h-12 z" fill={P.stoneLight} {...line} />
          <ellipse cx={64} cy={78} rx={4} ry={3} fill={P.woodLight} {...line} />
        </g>
      )
    case 'zwillingsinseln':
      return (
        <g>
          {[28, 76].map((x, i) => (
            <g key={x}>
              <ellipse cx={x} cy={80} rx={20} ry={5} fill={P.grass} {...line} />
              <rect x={x - 7} y={64} width={14} height={12} fill={P.woodLight} {...line} />
              <polygon points={`${x - 9},64 ${x},56 ${x + 9},64`} fill={i ? P.roofDark : P.roof} {...line} />
              <rect x={x - 2} y={67} width={4} height={4} fill={P.glowHot} />
            </g>
          ))}
          <path d="M35 72 q17 6 34 0" fill="none" stroke={P.woodDark} strokeWidth={STROKE.fine} strokeDasharray="2 2" />
        </g>
      )
    case 'heringsinsel':
      return (
        <g>
          {[30, 44, 58].map((x) => (
            <g key={x}>
              <path d={`M${x - 6} 80 q-2 -8 0 -16 h12 q2 8 0 16 z`} fill={P.woodLight} {...line} />
              <path d={`M${x - 7} 69 h14 M${x - 7} 76 h14`} stroke={P.metal} strokeWidth={STROKE.fine} />
            </g>
          ))}
          <path d="M72 60 h16 M74 60 v20 M86 60 v20" stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
          {[77, 81, 85].map((x) => (
            <path key={x} d={`M${x} 61 q-2 5 0 10 q2 -5 0 -10 z`} fill={P.metalLight} stroke={P.outline} strokeWidth={0.5} />
          ))}
        </g>
      )
    case 'schafinsel':
      return (
        <g>
          <path d="M18 78 h70" stroke={P.stoneDark} strokeWidth={3} strokeDasharray="6 2" />
          {[[30, 70], [46, 66], [62, 72], [76, 68]].map(([x, y]) => (
            <g key={x}>
              <ellipse cx={x} cy={y} rx={6} ry={4} fill={P.white} {...line} />
              <circle cx={x + 6} cy={y - 1} r={2} fill={P.outline} />
              <path d={`M${x - 3} ${y + 4} v3 M${x + 3} ${y + 4} v3`} stroke={P.outline} strokeWidth={0.9} />
            </g>
          ))}
        </g>
      )
    case 'scherbeninsel':
      return (
        <g>
          {[[24, 80, P.grassLight], [34, 76, P.waterLight], [46, 81, P.glow], [56, 77, P.grassLight], [68, 80, P.clothBlue], [78, 76, P.waterLight], [40, 84, P.ember]].map(([x, y, c]) => (
            <path key={`${x}`} d={`M${x} ${y} l4 -3 l3 3 l-2 4 l-4 0 z`} fill={c as string} opacity={0.85} stroke={P.outline} strokeWidth={0.6} />
          ))}
          <rect x={46} y={56} width={18} height={12} fill={P.woodLight} {...line} />
          <path d="M48 62 h14" stroke={P.outline} strokeWidth={0.6} />
        </g>
      )
    case 'inselDerZweiTuerme':
      return (
        <g>
          <path d="M30 82 l2 -30 h8 l2 30 z" fill={P.stone} {...line} />
          <polygon points="31,52 36,44 41,52" fill={P.roofDark} {...line} />
          <path d="M62 82 l2 -40 h8 l2 40 z" fill={P.white} {...line} />
          <polygon points="63,42 68,34 73,42" fill={P.roof} {...line} />
          <circle cx={36} cy={50} r={2.4} fill={P.glowHot} />
          <circle cx={68} cy={40} r={2.4} fill={P.glowHot} />
          <path d="M38 50 q14 6 28 -9" fill="none" stroke={P.woodDark} strokeWidth={STROKE.fine} />
        </g>
      )
    case 'eierinsel':
      return (
        <g>
          <path d="M26 84 l8 -34 l12 -6 l14 4 l10 36 z" fill={P.stone} {...line} />
          {[[38, 62], [50, 56], [56, 70], [42, 74]].map(([x, y]) => (
            <g key={`${x}`}>
              <path d={`M${x - 4} ${y} q4 3 8 0`} fill="none" stroke={P.thatchDark} strokeWidth={1.6} />
              <ellipse cx={x} cy={y - 1.5} rx={1.6} ry={2} fill={P.white} stroke={P.outline} strokeWidth={0.4} />
            </g>
          ))}
        </g>
      )
    case 'halbeInsel':
      return (
        <g>
          <path d="M22 82 q30 -22 62 0 z" fill={P.grass} {...line} />
          <rect x={46} y={56} width={14} height={10} fill={P.woodLight} {...line} />
          <polygon points="44,56 53,49 62,56" fill={P.thatch} {...line} />
          <path d="M48 66 v12 M58 66 v12" stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
          <path d="M14 84 q10 -3 20 0 t20 0 t20 0 t20 0" fill="none" stroke={P.white} strokeWidth={1.3} opacity={0.7} />
        </g>
      )
    case 'garteninsel':
      return (
        <g>
          <path d="M16 80 q4 -18 14 -20 v20 z" fill={P.stoneLight} {...line} />
          {[40, 56, 72].map((x) => (
            <g key={x}>
              <path d={`M${x} 80 v-10`} stroke={P.woodDark} strokeWidth={STROKE.main} />
              <circle cx={x} cy={64} r={8} fill={leaf} {...line} />
              <circle cx={x - 3} cy={63} r={1.4} fill={P.ember} />
              <circle cx={x + 3} cy={66} r={1.4} fill={P.ember} />
            </g>
          ))}
        </g>
      )
    case 'werftinsel':
      return (
        <g>
          <path d="M24 78 q28 12 56 0 l-6 -12 h-44 z" fill={P.woodLight} {...line} />
          {[34, 42, 50, 58, 66].map((x) => (
            <path key={x} d={`M${x} 66 v12`} stroke={P.woodDark} strokeWidth={STROKE.fine} />
          ))}
          <path d="M26 84 h52 M32 84 v-6 M72 84 v-6" stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
          <path d="M70 66 l10 -14" stroke={P.paper} strokeWidth={3} strokeLinecap="round" />
        </g>
      )
    case 'stilleInsel':
      return (
        <g>
          <ellipse cx={52} cy={78} rx={30} ry={6} fill={P.grassDark} opacity={0.7} />
          <path d="M52 78 v-16" stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
          <rect x={48.5} y={54} width={7} height={8} fill={P.windowDark} {...line} />
          <rect x={48.5} y={54} width={3.5} height={8} fill={P.glowHot} />
          {[[30, 72], [70, 74], [40, 80]].map(([x, y]) => (
            <path key={`${x}`} d={`M${x - 3} ${y} q3 -5 6 0 l2 1 l-2 1 q-3 2 -6 -2 z`} fill={P.white} stroke={P.outline} strokeWidth={0.6} />
          ))}
        </g>
      )
    case 'weisseInsel':
      return (
        <g>
          <rect x={28} y={64} width={16} height={14} fill={P.white} {...line} />
          <rect x={48} y={58} width={18} height={20} fill={P.white} {...line} />
          <rect x={70} y={66} width={12} height={12} fill={P.white} {...line} />
          <path d="M26 64 h20 M46 58 h22 M68 66 h16" stroke={P.snowShade} strokeWidth={3} />
          <rect x={54} y={66} width={5} height={12} fill={P.clothBlue} {...line} />
        </g>
      )
    case 'suesswasserinsel':
      return (
        <g>
          <path d="M34 64 l10 -8 l12 4 l8 -4 l6 10 v6 h-36 z" fill={P.stone} {...line} />
          <path d="M52 62 q2 10 0 18" fill="none" stroke={P.waterLight} strokeWidth={2.4} strokeLinecap="round" />
          <ellipse cx={52} cy={82} rx={14} ry={3.5} fill={P.waterLight} {...line} />
          <path d="M74 84 q-2 -6 0 -10 h8 q2 4 0 10 z" fill={P.woodLight} {...line} />
        </g>
      )
    case 'muehleninsel':
      return (
        <g>
          {[[28, 80, 0.8], [54, 78, 1], [78, 82, 0.7]].map(([x, y, k]) => (
            <g key={x} transform={`translate(${x} ${y}) scale(${k})`}>
              <path d="M-6 0 l2 -20 h8 l2 20 z" fill={P.white} {...line} />
              <polygon points="-5,-20 0,-26 5,-20" fill={P.roofDark} {...line} />
              <path d="M0 -22 l-12 -8 M0 -22 l12 -8 M0 -22 l-10 10 M0 -22 l10 10" stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
            </g>
          ))}
        </g>
      )
    case 'inselDerBriefe':
      return (
        <g>
          <rect x={34} y={56} width={36} height={24} fill={P.woodLight} {...line} />
          <polygon points="31,56 52,44 73,56" fill={P.slate} {...line} />
          <rect x={44} y={64} width={16} height={10} fill={P.paper} {...line} />
          <path d="M44 64 l8 6 l8 -6" fill="none" stroke={P.outline} strokeWidth={0.8} />
          <circle cx={52} cy={70} r={1.8} fill={P.ember} />
          <path d="M76 54 q4 -3 6 0 q4 -3 6 0" fill="none" stroke={P.outline} strokeWidth={1.2} strokeLinecap="round" />
        </g>
      )
    case 'seilerinsel':
      return (
        <g>
          <path d="M16 78 h76" stroke={P.thatchDark} strokeWidth={2.2} />
          <path d="M16 74 h76" stroke={P.thatch} strokeWidth={1.2} strokeDasharray="3 1.5" />
          {[20, 44, 68, 90].map((x) => (
            <path key={x} d={`M${x} 82 v-12 M${x - 3} 70 h6`} stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
          ))}
          <ellipse cx={58} cy={84} rx={7} ry={3} fill="none" stroke={P.thatchDark} strokeWidth={2} />
        </g>
      )
    case 'inselDerDrachen':
      return (
        <g>
          <path d="M22 84 q30 -18 62 0 z" fill={P.grass} {...line} />
          {[[34, 30, P.ember], [58, 22, P.clothBlue], [80, 34, P.glow]].map(([x, y, c]) => (
            <g key={`${x}`}>
              <path d={`M${x} ${y} l5 6 l-5 9 l-5 -9 z`} fill={c as string} {...line} />
              <path d={`M${x} ${Number(y) + 15} q4 14 ${52 - Number(x)} ${72 - Number(y) - 15}`} fill="none" stroke={P.outline} strokeWidth={0.5} />
              <circle cx={x} cy={Number(y) + 7} r={1.2} fill={P.glowHot} />
            </g>
          ))}
        </g>
      )
    case 'robbeninsel':
      return (
        <g>
          <path d="M20 82 q32 -14 66 0 z" fill={P.stoneLight} {...line} />
          {[[34, 74], [52, 70], [68, 75]].map(([x, y]) => (
            <g key={x}>
              <path d={`M${x - 8} ${y + 3} q4 -8 12 -5 q4 -4 6 0 q-1 5 -6 5 z`} fill={P.stoneDark} {...line} />
              <circle cx={x + 7} cy={y - 2} r={0.7} fill={P.white} />
            </g>
          ))}
        </g>
      )
    case 'schwarzeInsel':
      return (
        <g>
          <path d="M18 84 l18 -30 l10 6 l10 -10 l22 34 z" fill={P.windowDark} {...line} />
          <path d="M52 52 q-3 -6 1 -10 q-2 6 2 8" fill="none" stroke={P.mist} strokeWidth={1.6} strokeLinecap="round" />
          {[[36, 80], [50, 82], [64, 80]].map(([x, y]) => (
            <ellipse key={x} cx={x} cy={y} rx={5} ry={3.5} fill={P.ember} {...line} />
          ))}
        </g>
      )
    case 'inselDerNamen':
      return (
        <g>
          {[[22, 80, 12], [34, 78, 14], [46, 77, 15], [58, 77, 14], [70, 78, 13], [82, 80, 11]].map(([x, y, h], i) => (
            <g key={x}>
              <path d={`M${x - 4} ${y} v-${h} q4 -4 8 0 v${h} z`} fill={i > 3 ? P.stoneLight : P.stone} {...line} />
              {i <= 3 ? <path d={`M${x - 2} ${y - h + 4} h4 M${x - 2} ${y - h + 7} h3`} stroke={P.outline} strokeWidth={0.6} /> : null}
            </g>
          ))}
        </g>
      )
    case 'aeussersteInsel':
      return (
        <g>
          <path d="M40 84 l4 -16 l12 -4 l10 6 l4 14 z" fill={P.stoneDark} {...line} />
          <rect x={50} y={58} width={10} height={8} fill={P.woodLight} {...line} />
          <path d="M48 58 h14 M52 58 l-8 -4 M60 58 l8 -4" stroke={P.woodDark} strokeWidth={STROKE.fine} />
          <path d="M14 76 q8 -8 16 0 M78 74 q8 -8 16 0" fill="none" stroke={P.white} strokeWidth={1.6} opacity={0.8} />
          <circle cx={104} cy={50} r={1.6} fill={P.glowHot} />
          <circle cx={104} cy={50} r={5} fill={P.glowSoft} opacity={0.4} />
        </g>
      )
    case 'pruefungsinsel':
      return (
        <g>
          <ellipse cx={52} cy={80} rx={26} ry={5} fill={P.grassDark} opacity={0.7} />
          <ellipse cx={52} cy={76} rx={9} ry={3} fill="none" stroke={P.stoneDark} strokeWidth={2.4} />
          <path d="M48 76 q4 -12 8 0 z" fill={P.glowHot} />
          <circle cx={52} cy={70} r={10} fill={P.glowSoft} opacity={0.4} />
          <path d="M70 78 q0 -8 5 -8 q5 0 5 8 z" fill={P.stone} {...line} />
        </g>
      )
    case 'inselOhneFeuer':
      return (
        <g>
          <path d="M46 84 l3 -36 h10 l3 36 z" fill={P.stoneLight} {...line} />
          <path d="M45 48 h18 l-2 -7 h-14 z" fill={P.stone} {...line} />
          <polygon points="47,41 54,32 61,41" fill={P.roofDark} {...line} />
          <rect x={51} y={43} width={6} height={4} fill={P.windowDark} {...line} />
          <rect x={51} y={70} width={6} height={14} fill={P.woodDark} {...line} />
          <rect x={52.5} y={74} width={3} height={4} fill={P.paper} />
        </g>
      )
    case 'neueWarte':
      return (
        <g>
          <path d="M46 84 l3 -36 h10 l3 36 z" fill={P.stoneLight} {...line} />
          <path d="M45 48 h18 l-2 -7 h-14 z" fill={P.stone} {...line} />
          <polygon points="47,41 54,32 61,41" fill={P.roof} {...line} />
          <circle cx={54} cy={45} r={3} fill={P.glowHot} />
          <circle cx={54} cy={45} r={10} fill={P.glowSoft} opacity={0.45} />
          <rect x={51} y={70} width={6} height={14} fill={P.woodDark} {...line} />
          <rect x={50} y={58} width={8} height={5} fill={P.glow} {...line} />
        </g>
      )
    // ── Welle 8 (126–150): der Rand der Karte ──
    case 'offenesMeer':
      return (
        <g>
          <path d="M34 78 q20 10 44 0 l-5 -8 h-34 z" fill={P.woodDark} {...line} />
          <path d="M56 70 v-34" stroke={P.woodDark} strokeWidth={STROKE.main} />
          <path d="M56 38 q18 10 16 28 h-16 z" fill={P.paper} {...line} />
          <circle cx={37} cy={66} r={2} fill={P.glowHot} />
          <path d="M10 84 q10 -4 20 0 M84 84 q10 -4 20 0" fill="none" stroke={P.white} strokeWidth={1.4} opacity={0.7} />
        </g>
      )
    case 'treibendeInsel':
      return (
        <g>
          <path d="M24 80 q30 -8 60 0 q-30 8 -60 0 z" fill={P.thatch} {...line} />
          <path d="M30 80 h48 M36 77 h36" stroke={P.thatchDark} strokeWidth={0.8} />
          <rect x={46} y={62} width={16} height={12} fill={P.thatch} {...line} />
          <polygon points="44,62 54,54 64,62" fill={P.thatchDark} {...line} />
          {[30, 76].map((x) => (
            <path key={x} d={`M${x} 78 v-12 M${x + 3} 78 v-9`} stroke={P.grassDark} strokeWidth={1.4} />
          ))}
        </g>
      )
    case 'walweg':
      return (
        <g>
          <path d="M26 78 q24 -18 50 -2 q-8 4 -14 2 q-18 4 -36 0 z" fill={P.windowDark} {...line} />
          <path d="M76 76 l8 -8 l-2 10 z" fill={P.windowDark} {...line} />
          <path d="M46 62 q-3 -10 -8 -12 M46 62 q3 -10 8 -12" fill="none" stroke={P.white} strokeWidth={1.6} strokeLinecap="round" opacity={0.85} />
          <circle cx={36} cy={72} r={0.9} fill={P.white} />
        </g>
      )
    case 'eisrand':
      return (
        <g>
          <path d="M0 72 l20 -4 l22 3 l26 -5 l26 4 l26 -2 V90 H0 Z" fill={P.snow} />
          <ellipse cx={50} cy={80} rx={7} ry={2.6} fill={P.windowDark} {...line} />
          <path d="M60 80 v-12" stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
          <rect x={57.5} y={62} width={5} height={6} fill={P.glowHot} {...line} />
          <circle cx={60} cy={65} r={7} fill={P.glowSoft} opacity={0.4} />
          <path d="M28 78 h12 v-6 h-12 z M26 72 h16 l-4 -5 h-8 z" fill={P.woodLight} {...line} />
        </g>
      )
    case 'nordlichtfeld':
      return (
        <g>
          <path d="M8 34 q24 -18 50 -4 t54 -8" fill="none" stroke={P.grassLight} strokeWidth={5} opacity={0.5} strokeLinecap="round" />
          <path d="M14 42 q24 -14 46 -2 t48 -6" fill="none" stroke={P.clothViolet} strokeWidth={3.5} opacity={0.45} strokeLinecap="round" />
          <path d="M0 76 Q60 68 120 76 V90 H0 Z" fill={P.snow} />
          <path d="M46 80 h10 v-6 h-10 z M50 74 v-6 h3" fill={P.woodDark} {...line} />
        </g>
      )
    case 'schwimmenderMarkt':
      return (
        <g>
          {[[24, 80, P.ember], [46, 76, P.clothBlue], [68, 81, P.glow], [86, 76, P.clothViolet]].map(([x, y, c]) => (
            <g key={`${x}`}>
              <path d={`M${Number(x) - 9} ${y} q9 5 18 0 l-2 -4 h-14 z`} fill={P.woodLight} {...line} />
              <path d={`M${Number(x) - 6} ${Number(y) - 4} v-7 h12 v7`} fill="none" stroke={P.woodDark} strokeWidth={STROKE.fine} />
              <path d={`M${Number(x) - 7} ${Number(y) - 11} h14 l-2 -3 h-10 z`} fill={c as string} {...line} />
            </g>
          ))}
        </g>
      )
    case 'korallengarten':
      return (
        <g>
          <rect x={0} y={62} width={120} height={28} fill={P.water} opacity={0.6} />
          {[[26, 84, P.ember], [44, 86, P.blossom], [62, 84, P.ember], [80, 86, P.blossom]].map(([x, y, c]) => (
            <path key={`${x}`} d={`M${x} ${y} v-8 M${x} ${Number(y) - 4} l-4 -6 M${x} ${Number(y) - 5} l4 -6 M${Number(x) - 4} ${Number(y) - 10} l-1 -4 M${Number(x) + 4} ${Number(y) - 11} l1 -4`} fill="none" stroke={c as string} strokeWidth={2} strokeLinecap="round" />
          ))}
          <rect x={51} y={74} width={5} height={6} fill={P.glow} {...line} />
          <path d="M44 60 h18 v3 h-18 z" fill={P.woodLight} {...line} />
        </g>
      )
    case 'stadtAufDerSandbank':
      return (
        <g>
          {[26, 46, 66].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 84 v-14 M${x + 12} 84 v-14`} stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
              <rect x={x - 2} y={58 - (i % 2) * 3} width={16} height={12 + (i % 2) * 3} fill={P.woodLight} {...line} />
              <polygon points={`${x - 4},${58 - (i % 2) * 3} ${x + 6},${50 - (i % 2) * 3} ${x + 16},${58 - (i % 2) * 3}`} fill={i % 2 ? P.roofDark : P.thatch} {...line} />
            </g>
          ))}
          <path d="M22 72 h64" stroke={P.woodDark} strokeWidth={2} />
        </g>
      )
    case 'wurzelwald':
      return (
        <g>
          {[28, 52, 76].map((x) => (
            <g key={x}>
              <path d={`M${x} 60 v-10`} stroke={P.woodDark} strokeWidth={STROKE.main} />
              <circle cx={x} cy={46} r={10} fill={P.grassDark} {...line} />
              <path d={`M${x} 60 q-8 8 -10 22 M${x} 60 q-3 10 -3 22 M${x} 60 q3 10 4 22 M${x} 60 q8 8 10 22`} fill="none" stroke={P.woodDark} strokeWidth={1.6} />
            </g>
          ))}
          <circle cx={40} cy={74} r={1.8} fill={P.glowHot} />
        </g>
      )
    case 'bojenkette':
      return (
        <g>
          <path d="M10 80 q50 -8 100 0" fill="none" stroke={P.metal} strokeWidth={1.2} strokeDasharray="2 2" />
          {[20, 42, 64, 86].map((x, i) => (
            <g key={x}>
              <path d={`M${x - 4} ${80 - (i % 2)} l2 -8 h4 l2 8 z`} fill={i % 2 ? P.clothBlue : P.ember} {...line} />
              <circle cx={x} cy={69 - (i % 2)} r={1.6} fill={P.glowHot} />
              <circle cx={x} cy={69 - (i % 2)} r={4.5} fill={P.glowSoft} opacity={0.35} />
            </g>
          ))}
        </g>
      )
    case 'fremdeKueste':
      return (
        <g>
          <path d="M30 80 l6 -26 h10 l6 26 z" fill={P.clothViolet} {...line} />
          <path d="M36 54 l5 -8 l5 8" fill={P.glow} {...line} />
          <path d="M62 80 l5 -20 h8 l5 20 z" fill={P.clothBlue} {...line} />
          <path d="M67 60 l4 -6 l4 6" fill={P.ember} {...line} />
          <path d="M39 70 h4 v10 h-4 z M70 72 h3 v8 h-3 z" fill={P.windowDark} />
          <path d="M20 84 h70" stroke={P.paper} strokeWidth={2} />
        </g>
      )
    case 'duenenmeer':
      return (
        <g>
          <path d="M0 74 q20 -16 40 -4 q16 -18 40 -2 q18 -10 40 2 V90 H0 Z" fill={P.thatch} />
          <path d="M0 80 q30 -10 60 -2 t60 -2 V90 H0 Z" fill={P.paper} opacity={0.7} />
          <path d="M58 62 q-1.6 -5 1.6 -8 q-1 4 2 6" fill={P.glowHot} />
          <circle cx={60} cy={58} r={7} fill={P.glowSoft} opacity={0.4} />
          {[26, 34, 42].map((x) => (
            <path key={x} d={`M${x} 82 h5 v-3 h-5 z M${x + 5} 79 l1.5 -3`} fill={P.woodDark} stroke={P.outline} strokeWidth={0.5} />
          ))}
        </g>
      )
    case 'brunnenstadt':
      return (
        <g>
          <rect x={18} y={62} width={16} height={18} fill={P.paper} {...line} />
          <rect x={70} y={58} width={18} height={22} fill={P.paper} {...line} />
          <ellipse cx={52} cy={78} rx={11} ry={4} fill={P.stoneLight} {...line} />
          <ellipse cx={52} cy={78} rx={7} ry={2.4} fill={P.windowDark} />
          <circle cx={52} cy={78} r={1.8} fill={P.glowHot} />
          <circle cx={52} cy={78} r={6} fill={P.glowSoft} opacity={0.4} />
          <path d="M44 78 v-14 h16 v14 M52 64 v10" fill="none" stroke={P.woodDark} strokeWidth={STROKE.fine * 1.5} />
        </g>
      )
    case 'steinernerWald':
      return (
        <g>
          <path d="M18 80 h36 v6 h-36 z" fill={P.stone} {...line} />
          <circle cx={54} cy={83} r={3} fill={P.stoneLight} {...line} />
          <circle cx={54} cy={83} r={1.4} fill="none" stroke={P.outline} strokeWidth={0.5} />
          <path d="M66 86 v-22 q4 -3 8 0 v22 z" fill={P.stoneDark} {...line} />
          <path d="M82 86 v-12 l3 -3 l3 3 v12 z" fill={P.stone} {...line} />
          <path d="M68 72 h4 M68 78 h4" stroke={P.outline} strokeWidth={0.6} />
        </g>
      )
    case 'spiegelsee':
      return (
        <g>
          <rect x={0} y={64} width={120} height={26} fill={P.waterLight} opacity={0.75} />
          {[[20, 70], [44, 76], [70, 68], [92, 78], [58, 84]].map(([x, y]) => (
            <circle key={`${x}`} cx={x} cy={y} r={0.9} fill={P.white} />
          ))}
          <path d="M50 64 l2 -10 l2 10 z" fill={P.outline} />
          <path d="M50 64 l2 9 l2 -9 z" fill={P.outline} opacity={0.35} />
        </g>
      )
    case 'windtuerme':
      return (
        <g>
          {[18, 32, 46, 60, 74, 88].map((x, i) => (
            <g key={x}>
              <path d={`M${x - 3} 84 v-${20 + (i % 3) * 8} h6 v${20 + (i % 3) * 8} z`} fill={P.paper} {...line} />
              <path d={`M${x - 3} ${84 - 14 - (i % 3) * 5} h6`} stroke={P.windowDark} strokeWidth={2} />
            </g>
          ))}
          <path d="M10 44 q10 -4 20 0 M70 40 q10 -4 20 0" fill="none" stroke={P.white} strokeWidth={1.2} opacity={0.7} strokeLinecap="round" />
        </g>
      )
    case 'terrassenDerLampen':
      return (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <path d={`M${14 + i * 8} ${84 - i * 7} h${86 - i * 14}`} stroke={P.stoneDark} strokeWidth={2} />
              {Array.from({ length: 6 - i }, (_, k) => (
                <circle key={k} cx={22 + i * 8 + k * 14} cy={81 - i * 7} r={1.5} fill={P.glowHot} />
              ))}
            </g>
          ))}
          <ellipse cx={58} cy={68} rx={40} ry={18} fill={P.glowSoft} opacity={0.14} />
        </g>
      )
    case 'haengendeBruecken':
      return (
        <g>
          <path d="M6 88 v-34 l16 4 l4 30 z M114 88 v-36 l-18 6 l-4 30 z" fill={P.stone} {...line} />
          <path d="M22 60 q36 18 74 0" fill="none" stroke={P.thatchDark} strokeWidth={2} />
          <path d="M22 54 q36 16 74 0" fill="none" stroke={P.thatchDark} strokeWidth={1} />
          {[34, 46, 58, 70, 84].map((x) => (
            <path key={x} d={`M${x} ${59 + (1 - Math.abs(x - 59) / 37) * 4} v${5 + (1 - Math.abs(x - 59) / 37) * 3}`} stroke={P.thatchDark} strokeWidth={0.8} />
          ))}
        </g>
      )
    case 'wolkenwald':
      return (
        <g>
          {[26, 50, 76].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 86 v-${30 + i * 3}`} stroke={P.woodDark} strokeWidth={4} />
              <ellipse cx={x} cy={52 - i * 3} rx={14} ry={9} fill={P.grassDark} {...line} />
              <path d={`M${x - 2} ${70 - i * 2} q-6 2 -8 8 M${x + 2} ${64 - i * 2} q6 2 8 8`} fill="none" stroke={P.grassLight} strokeWidth={1.6} />
            </g>
          ))}
          <ellipse cx={40} cy={66} rx={34} ry={5} fill={P.white} opacity={0.55} />
          <ellipse cx={84} cy={56} rx={26} ry={4} fill={P.white} opacity={0.45} />
        </g>
      )
    case 'kraterrand':
      return (
        <g>
          <path d="M10 86 l28 -34 h30 l30 34 z" fill={P.stoneDark} {...line} />
          <path d="M38 52 q15 10 30 0 z" fill={P.ember} />
          <ellipse cx={53} cy={50} rx={20} ry={9} fill={P.glowSoft} opacity={0.4} />
          <path d="M50 46 q-4 -8 2 -14 q-2 8 3 10" fill="none" stroke={P.mist} strokeWidth={2} strokeLinecap="round" />
        </g>
      )
    case 'stadtDerSternwarten':
      return (
        <g>
          {[[22, 82, 9], [42, 80, 12], [64, 82, 10], [84, 80, 8]].map(([x, y, r]) => (
            <g key={x}>
              <rect x={x - r} y={y - r} width={r * 2} height={r} fill={P.stoneLight} {...line} />
              <path d={`M${x - r} ${y - r} q${r} -${r * 1.5} ${r * 2} 0 z`} fill={P.metalLight} {...line} />
              <path d={`M${x} ${y - r * 1.7} l${r * 0.8} -${r * 0.6}`} stroke={P.outline} strokeWidth={1.6} strokeLinecap="round" />
            </g>
          ))}
        </g>
      )
    case 'letzterHafen':
      return (
        <g>
          <path d="M10 78 h56 v6 h-56 z" fill={P.stone} {...line} />
          <path d="M40 72 v-18 M34 58 h12 M32 68 q8 8 16 0" fill="none" stroke={P.metal} strokeWidth={STROKE.bold} strokeLinecap="round" />
          <circle cx={40} cy={52} r={2.4} fill="none" stroke={P.metal} strokeWidth={STROKE.main} />
          <path d="M74 84 q14 -6 34 0" fill="none" stroke={P.white} strokeWidth={1.4} opacity={0.7} />
        </g>
      )
    case 'hausDerGanzenKarte':
      return (
        <g>
          <path d="M18 84 l12 -20 h56 l12 20 z" fill={P.paper} {...line} />
          <path d="M30 78 q10 -8 20 -2 t22 -4 t14 4" fill="none" stroke={P.clothBlue} strokeWidth={1} />
          {[[34, 76], [46, 70], [56, 78], [66, 72], [78, 78], [50, 82], [72, 68]].map(([x, y], i) => (
            <g key={`${x}`}>
              <circle cx={x} cy={y} r={1.2} fill={i < 5 ? P.glowHot : P.stoneDark} />
              {i < 5 ? <circle cx={x} cy={y} r={3.5} fill={P.glowSoft} opacity={0.35} /> : null}
            </g>
          ))}
        </g>
      )
    case 'bauplatz':
      return (
        <g>
          <path d="M38 84 v-14 h8 v-6 h8 v6 h10 v14 z" fill={P.stoneLight} {...line} />
          <path d="M30 84 v-34 M30 52 h34 M64 52 v10" fill="none" stroke={P.woodDark} strokeWidth={STROKE.main} />
          <rect x={60} y={62} width={8} height={6} fill={P.stone} {...line} />
          <path d="M24 84 h56 M74 84 v-26 M82 84 v-26 M74 66 h8 M74 74 h8" stroke={P.woodDark} strokeWidth={STROKE.fine} />
        </g>
      )
    case 'grossesLeuchtfeuer':
      return (
        <g>
          <path d="M44 86 l5 -46 h14 l5 46 z" fill={P.stoneLight} {...line} />
          <path d="M46 70 h20 M47 58 h18" stroke={P.stone} strokeWidth={3} />
          <path d="M42 40 h28 l-3 -8 h-22 z" fill={P.stone} {...line} />
          {[-40, -26, -12, 12, 26, 40].map((dx) => (
            <path key={dx} d={`M56 34 l${dx} ${-10 + Math.abs(dx) * 0.25}`} stroke={P.glowSoft} strokeWidth={2} opacity={0.55} strokeLinecap="round" />
          ))}
          <circle cx={56} cy={34} r={5} fill={P.glowHot} />
          <circle cx={56} cy={34} r={14} fill={P.glowSoft} opacity={0.45} />
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
  const coast = COASTS.has(id) || RIM_SHORE.has(id)
  const sea = OPEN_SEA.has(id)
  const isle = ISLES.has(id)
  const rim = RIM.has(id)
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
        {sea ? (
          <>
            <rect x={0} y={52} width={120} height={38} fill={P.water} />
            <rect x={0} y={52} width={120} height={38} fill={top} opacity={0.35} />
            <path d="M0 53 H120" stroke={P.white} strokeWidth={1} opacity={0.35} />
            <path d="M10 59 h18 M60 57 h22 M92 62 h16 M6 70 h14 M98 68 h16 M40 64 h12" stroke={P.white} strokeWidth={1} opacity={0.3} strokeLinecap="round" />
          </>
        ) : isle ? (
          <>
            <path d={`M${60 + vary(rnd, 0, 30)} 52 l10 -4 l12 4 Z`} fill={rMid} />
            <rect x={0} y={52} width={120} height={38} fill={P.water} />
            <rect x={0} y={52} width={120} height={38} fill={top} opacity={0.35} />
            <path d="M0 53 H120" stroke={P.white} strokeWidth={1} opacity={0.35} />
            <path d="M10 59 h18 M60 57 h22 M92 62 h16 M6 86 h14 M98 84 h16" stroke={P.white} strokeWidth={1} opacity={0.35} strokeLinecap="round" />
            <ellipse cx={54} cy={82} rx={46} ry={9} fill={P.paper} />
            <ellipse cx={54} cy={80} rx={38} ry={6.5} fill={near} />
            <path d="M12 84 q42 12 84 0" fill="none" stroke={P.white} strokeWidth={1.4} opacity={0.5} />
          </>
        ) : coast ? (
          <>
            <path d={`M0 52 L${20 + vary(rnd, 0, 10)} 46 L${48 + vary(rnd, 0, 8)} 52 Z`} fill={rFar} />
            <path d={`M${70 + vary(rnd, 0, 10)} 52 L${98 + vary(rnd, 0, 8)} 45 L120 49 V52 Z`} fill={rMid} />
            <rect x={0} y={52} width={120} height={18} fill={P.water} />
            <rect x={0} y={52} width={120} height={18} fill={top} opacity={0.35} />
            <path d="M0 53 H120" stroke={P.white} strokeWidth={1} opacity={0.35} />
            <path d="M14 58 h18 M52 61 h26 M86 57 h16 M30 65 h20 M74 66 h22" stroke={P.white} strokeWidth={1} opacity={0.35} strokeLinecap="round" />
            <path d="M0 70 Q60 64 120 72 V90 H0 Z" fill={near} />
            <path d="M0 70 Q60 64 120 72 V90 H0 Z" fill={P.paper} opacity={0.45} />
            <path d="M0 70 Q60 64 120 72" fill="none" stroke={P.white} strokeWidth={1.6} opacity={0.5} />
          </>
        ) : high ? (
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
        {rim ? (
          <>
            <path d="M-4 30 q30 -14 62 -4 t66 -8" fill="none" stroke={P.glowSoft} strokeWidth={6} opacity={dark ? 0.22 : 0.12} strokeLinecap="round" />
            <circle cx={112 - ox * 0.2} cy={47} r={1.2} fill={P.glowHot} />
            <circle cx={112 - ox * 0.2} cy={47} r={4} fill={P.glowSoft} opacity={0.4} />
          </>
        ) : null}
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
