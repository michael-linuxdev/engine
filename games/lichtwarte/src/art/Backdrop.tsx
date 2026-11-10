/**
 * Hintergrund der Talkarte: Himmel mit Gestirn, Sternen und Wolken, drei Bergketten,
 * Hügel, Bach, der Weg hinauf zur Warte, Laternen am Weg, Bäume.
 * Das Tal erzählt den Fortschritt: Jede Laterne brennt, sobald ihr Bauwerk steht,
 * und das Leuchtfeuer der Warte wächst mit (`lit`, `beacon`).
 */
import type { Mood } from '@engine/art'
import { paintOrder, seeded, vary } from '@engine/art'
import { HORIZON, LANTERNS, MAP_H, MAP_W, SLOTS, TOWER, trailX } from '../scene/slots'
import { Bush, Fir, Tree } from './parts'
import { STROKE } from './stroke'
import { BEACON, CLOUD, FOLIAGE, GROUND, isDark, ORB, P, RANGES, SHADE, SKY3, TRAIL } from './palette'

const W = MAP_W
const H = MAP_H
/** So weit reicht der Himmel über die Szene hinaus (hohe Bildschirme zeigen mehr Himmel). */
const SKY_UP = 520
const fine = { stroke: P.outline, strokeWidth: STROKE.fine, strokeLinejoin: 'round' as const }

function Cloud({ x, y, s, m, k }: { x: number; y: number; s: number; m: Mood; k: number }) {
  const [fill, edge] = CLOUD[m.daypart]
  return (
    <g className={`lw-cloud lw-cloud--${k % 3}`} opacity={m.daypart === 'night' ? 0.55 : 0.92}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-26 6 q-8 -1 -6 -8 q2 -6 9 -5 q2 -9 12 -8 q8 -5 14 3 q9 -2 10 6 q8 1 6 8 q-1 5 -8 4 z" fill={edge} />
        <path d="M-25 3 q-6 -1 -4 -6 q2 -5 8 -4 q2 -8 11 -7 q8 -4 13 3 q8 -2 9 5 q6 1 5 6 q-1 4 -7 3 z" fill={fill} />
      </g>
    </g>
  )
}

export function Sky({ m, id, orb = true }: { m: Mood; id: string; orb?: boolean }) {
  const [top, mid, low] = SKY3[m.daypart]
  const [disc, halo] = ORB[m.daypart]
  const night = m.daypart === 'night'
  const rnd = seeded('valley-stars')
  const stars = night ? 54 : m.daypart === 'evening' ? 14 : 0
  const ox = night ? 288 : m.daypart === 'evening' ? 296 : m.daypart === 'dawn' ? 58 : 276
  const oy = night ? 92 : m.daypart === 'day' ? 78 : 168
  return (
    <g>
      <defs>
        <linearGradient id={`sky-${id}`} gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2={HORIZON}>
          <stop offset="0" stopColor={top} />
          <stop offset="0.6" stopColor={mid} />
          <stop offset="1" stopColor={low} />
        </linearGradient>
        <radialGradient id={`orb-${id}`}>
          <stop offset="0" stopColor={halo} stopOpacity="0.75" />
          <stop offset="1" stopColor={halo} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x={-W} y={-SKY_UP} width={W * 3} height={SKY_UP + HORIZON + 14} fill={`url(#sky-${id})`} />
      {stars ? (
        <g fill={P.glowSoft}>
          {Array.from({ length: stars }, (_, i) => {
            const big = i % 9 === 0
            return <circle key={i} className={i % 4 === 0 ? `lw-star lw-star--${i % 3}` : undefined} cx={vary(rnd, 4, W - 4)} cy={vary(rnd, -SKY_UP * 0.5, 200)} r={big ? 1.5 : vary(rnd, 0.5, 1)} opacity={night ? (big ? 1 : 0.8) : 0.5} />
          })}
        </g>
      ) : null}
      {night && m.season === 'winter' ? (
        <g className="lw-aurora" fill="none" strokeLinecap="round">
          <path d="M-10 120 C 60 60, 130 150, 200 96 S 320 70, 370 118" stroke={BEACON.cold} strokeWidth={26} opacity={0.1} />
          <path d="M-10 132 C 70 80, 140 158, 210 112 S 320 92, 370 136" stroke={P.waterLight} strokeWidth={12} opacity={0.14} />
        </g>
      ) : null}
      {orb ? <circle cx={ox} cy={oy} r={night ? 46 : 58} fill={`url(#orb-${id})`} /> : null}
      {orb ? <circle cx={ox} cy={oy} r={night ? 15 : 17} fill={disc} /> : null}
      {night && orb ? (
        <g fill={BEACON.cold} opacity={0.55}>
          <circle cx={ox - 5} cy={oy - 4} r={3.2} />
          <circle cx={ox + 5} cy={oy + 4} r={2.2} />
          <circle cx={ox + 3} cy={oy - 7} r={1.4} />
        </g>
      ) : null}
      <Cloud x={70} y={m.daypart === 'dawn' ? 120 : 64} s={1.25} m={m} k={0} />
      <Cloud x={228} y={112} s={0.9} m={m} k={1} />
      <Cloud x={318} y={26} s={1.05} m={m} k={2} />
      <Cloud x={140} y={-70} s={1.5} m={m} k={1} />
    </g>
  )
}

function Mountains({ m }: { m: Mood }) {
  const [far, mid, near] = RANGES[m.daypart]
  const cap = m.daypart === 'night' ? BEACON.cold : P.snow
  return (
    <g>
      <polygon points={`0,208 30,172 62,190 100,142 140,184 178,152 215,188 250,130 292,178 330,152 ${W},174 ${W},250 0,250`} fill={far} />
      <path d="M100 142 l-9 14 l6 -3 l4 6 l5 -7 l6 4 z M250 130 l-10 16 l7 -4 l4 7 l5 -8 l7 5 z" fill={cap} opacity={0.75} />
      <polygon points={`0,224 40,180 78,208 122,160 160,206 205,172 240,210 286,162 325,206 ${W},184 ${W},252 0,252`} fill={mid} />
      <path d="M122 160 l-9 12 l6 -2 l4 6 l5 -6 l5 3 z M286 162 l-9 12 l6 -2 l4 6 l5 -6 l5 3 z M40 180 l-6 8 l5 -1 l3 4 l4 -5 z" fill={cap} opacity={0.9} />
      <path d="M122 160 L160 206 H122 Z M286 162 L325 206 H286 Z M40 180 L78 208 H40 Z M205 172 L240 210 H205 Z" fill={P.outline} opacity={0.12} />
      <ellipse cx={W / 2} cy={236} rx={230} ry={11} fill={P.mist} opacity={m.daypart === 'night' ? 0.14 : 0.42} />
      <polygon points={`0,240 28,210 66,232 104,202 140,234 220,234 258,198 296,230 332,206 ${W},228 ${W},256 0,256`} fill={near} />
      <path d="M104 202 L140 234 H104 Z M258 198 L296 230 H258 Z M28 210 L66 232 H28 Z M332 206 L360 228 V234 H332 Z" fill={P.outline} opacity={0.14} />
      {/* Wasserfall: Hier entspringt der Bach */}
      <path d="M312 214 q3 10 1 24" fill="none" stroke={m.season === 'winter' ? P.snow : P.waterLight} strokeWidth={2.2} strokeLinecap="round" opacity={0.85} />
    </g>
  )
}

/** Waldsaum am Fuß der Berge (eine Silhouette). */
function Treeline({ m }: { m: Mood }) {
  const rnd = seeded('treeline')
  let d = `M-4 ${HORIZON + 16}`
  for (let x = -4; x < W + 8; x += 7) {
    if (Math.abs(x - TOWER.x) < 26) {
      d += ` L${x + 7} ${HORIZON + 16}`
      continue
    }
    const h = vary(rnd, 9, 19)
    d += ` L${x} ${HORIZON + 10} L${x + 3.5} ${HORIZON + 10 - h} L${x + 7} ${HORIZON + 10}`
  }
  return <path d={`${d} L${W + 8} ${HORIZON + 22} L-4 ${HORIZON + 22} Z`} fill={m.season === 'winter' ? P.slate : P.grassDark} opacity={m.season === 'winter' ? 0.75 : 0.9} />
}

function Hills({ m }: { m: Mood }) {
  const [far, near, meadow] = GROUND[m.season]
  const rnd = seeded('valley-tufts')
  const [, bloom] = FOLIAGE[m.season]
  const tufts = Array.from({ length: 26 }, () => {
    const x = vary(rnd, 6, W - 6)
    const y = vary(rnd, HORIZON + 40, H - 30)
    return `M${x - 2} ${y} l1 -4 M${x} ${y} v-5 M${x + 2} ${y} l1.5 -3.5`
  }).join(' ')
  return (
    <g>
      <path d={`M-2 ${HORIZON + 8} Q90 ${HORIZON - 6} 180 ${HORIZON + 10} T${W + 2} ${HORIZON + 4} V${H + 2} H-2 Z`} fill={far} />
      <path d={`M-2 332 Q110 300 214 326 T${W + 2} 316 V${H + 2} H-2 Z`} fill={near} />
      <path d={`M-2 334 Q110 302 214 328 T${W + 2} 318`} fill="none" stroke={P.white} strokeWidth={2.5} opacity={0.16} />
      <path d={`M-2 432 Q130 400 236 424 T${W + 2} 412 V${H + 2} H-2 Z`} fill={meadow} />
      <path d={`M-2 434 Q130 402 236 426 T${W + 2} 414`} fill="none" stroke={P.white} strokeWidth={2.5} opacity={0.14} />
      <path d={`M-2 548 Q100 520 200 540 T${W + 2} 530 V${H + 2} H-2 Z`} fill={P.outline} opacity={0.07} />
      <path d={tufts} fill="none" stroke={m.season === 'winter' ? P.stone : P.grassDark} strokeWidth={STROKE.fine} strokeLinecap="round" opacity={0.5} />
      {m.season === 'winter' ? null : (
        <g fill={m.season === 'autumn' ? P.glowHot : bloom}>
          {Array.from({ length: 18 }, (_, i) => (
            <circle key={i} cx={vary(rnd, 8, W - 8)} cy={vary(rnd, HORIZON + 50, H - 24)} r={i % 3 === 0 ? 1.6 : 1.1} opacity={0.9} />
          ))}
        </g>
      )}
    </g>
  )
}

const RIVER = `M314 ${HORIZON + 2} C 300 262, 348 288, 338 324 S 352 404, 334 442 S 358 520, 340 574 S 352 622, 344 ${H + 6}`

function River({ m }: { m: Mood }) {
  const frozen = m.season === 'winter'
  return (
    <g fill="none" strokeLinecap="round">
      <path d={RIVER} stroke={P.outline} strokeWidth={15} opacity={0.2} />
      <path d={RIVER} stroke={frozen ? P.snowShade : P.water} strokeWidth={11.5} />
      <path className="lw-river" d={RIVER} stroke={frozen ? P.white : P.waterLight} strokeWidth={2.4} strokeDasharray="7 15" opacity={0.85} />
    </g>
  )
}

/** Der Weg: Schlangenlinie vom Tor (unten) zur Warte, mit einem Abzweig zu jedem Platz. */
function Trail() {
  let spine = `M${trailX(H + 6)} ${H + 6}`
  for (let y = H - 6; y >= TOWER.y + 2; y -= 10) spine += ` L${trailX(y)} ${y}`
  const branches = SLOTS.map((s) => {
    const fx = (s.x / 100) * W
    const fy = (s.y / 100) * H + 3
    const sx = trailX(fy + 8)
    return `M${sx} ${fy + 8} Q${(sx + fx) / 2} ${fy + 9} ${fx} ${fy}`
  }).join(' ')
  const line = { fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <g>
      <path d={branches} {...line} stroke={TRAIL[0]} strokeWidth={9} opacity={0.8} />
      <path d={spine} {...line} stroke={TRAIL[0]} strokeWidth={15} opacity={0.85} />
      <path d={branches} {...line} stroke={TRAIL[1]} strokeWidth={6.5} />
      <path d={spine} {...line} stroke={TRAIL[1]} strokeWidth={12} />
      <path d={spine} {...line} stroke={TRAIL[2]} strokeWidth={1.4} strokeDasharray="2 9" opacity={0.9} />
    </g>
  )
}

/**
 * Die Warte (Wahrzeichen): der alte Leuchtturm des Tals auf seiner Kuppe.
 * `beacon` 0–3: verglommen → Glut → Feuer → volles Licht.
 */
export function Watchtower({ m, beacon }: { m: Mood; beacon: number }) {
  const fire = beacon >= 3 ? BEACON.core : beacon === 2 ? BEACON.warm : beacon === 1 ? BEACON.hot : P.windowDark
  return (
    <g transform={`translate(${TOWER.x} ${TOWER.y})`}>
      <ellipse cx={0} cy={2} rx={46} ry={10} fill={GROUND[m.season][1]} />
      <ellipse cx={4} cy={1} rx={22} ry={4.5} fill={P.outline} opacity={0.2} />
      <path d="M-28 2 q8 -9 16 -4 M14 -1 q8 -6 16 2" fill="none" stroke={P.stoneDark} strokeWidth={STROKE.main} strokeLinecap="round" opacity={0.6} />
      {/* Anbau */}
      <rect x={9} y={-16} width={15} height={16} fill={P.stone} stroke={P.outline} strokeWidth={STROKE.main} />
      <polygon points="7,-16 16.5,-25 26,-16" fill={P.slate} stroke={P.outline} strokeWidth={STROKE.main} strokeLinejoin="round" />
      <rect x={14} y={-11} width={5} height={6} rx={0.8} fill={beacon > 0 && isDark(m) ? P.glow : P.windowDark} {...fine} />
      {/* Turm */}
      <path d="M-12 0 L-8.5 -58 H8.5 L12 0 Z" fill={P.stoneLight} stroke={P.outline} strokeWidth={STROKE.main} strokeLinejoin="round" />
      <path d="M2 -57 H8 L11 -1 H3 Z" fill={P.outline} opacity={0.16} />
      <path d="M-10 -14 h7 M-3 -24 h9 M-9.5 -34 h6 M0 -44 h7 M-9 -50 h5 M2 -10 h7" stroke={P.stoneDark} strokeWidth={0.8} strokeLinecap="round" opacity={0.7} />
      <path d="M-4 0 v-8 a4 4 0 0 1 8 0 v8 z" fill={P.woodDark} stroke={P.outline} strokeWidth={STROKE.fine} />
      <rect x={-2.5} y={-30} width={5} height={7} rx={2.5} fill={beacon > 0 && isDark(m) ? P.glow : P.windowDark} {...fine} />
      <rect x={-2.5} y={-47} width={5} height={7} rx={2.5} fill={beacon > 1 && isDark(m) ? P.glow : P.windowDark} {...fine} />
      {/* Umgang und Laternenhaus */}
      <path d="M-13 -58 h26 l-2 -4 h-22 z" fill={P.stoneDark} stroke={P.outline} strokeWidth={STROKE.main} strokeLinejoin="round" />
      <path d="M-12 -62 v-5 M-6 -62 v-5 M6 -62 v-5 M12 -62 v-5 M-12 -67 h24" fill="none" stroke={P.outline} strokeWidth={STROKE.fine} />
      <rect x={-7} y={-74} width={14} height={12} fill={fire} stroke={P.outline} strokeWidth={STROKE.main} />
      <path d="M-2.5 -74 v12 M2.5 -74 v12" stroke={P.outline} strokeWidth={0.8} />
      {beacon > 0 ? <circle className="lw-ember" cx={0} cy={-68} r={beacon + 1.5} fill={BEACON.hot} opacity={0.85} /> : null}
      <polygon points="-10,-74 0,-88 10,-74" fill={P.roofDark} stroke={P.outline} strokeWidth={STROKE.main} strokeLinejoin="round" />
      <path d="M0 -88 L10 -74 H0 Z" fill={P.outline} opacity={0.2} />
      <path d="M0 -88 v-7" stroke={P.outline} strokeWidth={STROKE.fine} />
      <path className="lw-flag" d="M0 -95 h8 l-2.5 3 l2.5 3 h-8 z" fill={beacon >= 2 ? P.clothBlue : P.stoneDark} {...fine} />
    </g>
  )
}

function LanternPost({ x, y, on, m }: { x: number; y: number; on: boolean; m: Mood }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={1} cy={0} rx={4} ry={1.2} fill={P.outline} opacity={0.2} />
      <path d="M0 0 v-15 q0 -4 4 -4" fill="none" stroke={P.outline} strokeWidth={STROKE.main} strokeLinecap="round" />
      <path d="M2 -17.5 h4 l-0.6 -1.8 h-2.8 z" fill={P.metal} stroke={P.outline} strokeWidth={0.6} />
      <rect x={2.2} y={-17.5} width={3.6} height={5} rx={0.8} fill={on ? (isDark(m) ? P.glowSoft : P.glow) : P.windowDark} {...fine} />
    </g>
  )
}

function Trees({ m }: { m: Mood }) {
  const rnd = seeded('valley-trees-2')
  const all = Array.from({ length: 44 }, (_, i) => ({ x: vary(rnd, 6, W - 6), y: vary(rnd, HORIZON + 30, H - 6), k: rnd(), i }))
  const free = all.filter(
    (t) =>
      Math.abs(t.x - trailX(t.y)) > 24 &&
      !(t.x > 308 && t.x < 356) &&
      Math.hypot(TOWER.x - t.x, TOWER.y - t.y) > 52 &&
      SLOTS.every((s) => {
        const dx = Math.abs((s.x / 100) * W - t.x)
        const dy = (s.y / 100) * H - t.y
        return dx > 44 || dy < -16 || dy > 74
      }),
  )
  return (
    <g>
      {paintOrder(free).map((t) => {
        const s = 0.6 + ((t.y - HORIZON) / (H - HORIZON)) * 0.75
        const high = t.y < 330
        return t.k < (high ? 0.6 : 0.3) ? <Fir key={t.i} x={t.x} y={t.y} s={s} m={m} /> : t.k < 0.8 ? <Tree key={t.i} x={t.x} y={t.y} s={s} m={m} /> : <Bush key={t.i} x={t.x} y={t.y} s={s * 1.2} m={m} />
      })}
    </g>
  )
}

/** Laub im Vordergrund (unten links und rechts): rahmt die Szene, gibt Tiefe. */
export function Foreground({ m }: { m: Mood }) {
  const [a] = FOLIAGE[m.season]
  const dark = m.season === 'winter' ? P.slate : P.grassDark
  return (
    <g pointerEvents="none">
      <path d={`M-14 ${H + 4} V${H - 62} q14 -16 26 -2 q16 -8 20 10 q16 0 12 18 q12 8 2 20 q4 12 -8 ${20} z`} fill={dark} />
      <path d={`M-14 ${H + 4} V${H - 44} q12 -10 22 0 q14 -4 14 12 q12 4 6 16 q4 10 -6 ${20} z`} fill={a} opacity={0.85} />
      <path d={`M${W + 14} ${H + 4} V${H - 52} q-12 -14 -24 -2 q-14 -6 -18 10 q-14 2 -10 16 q-10 8 -2 18 q-2 10 8 ${14} z`} fill={dark} />
      <path d={`M${W + 14} ${H + 4} V${H - 36} q-10 -8 -20 0 q-12 -2 -12 12 q-10 4 -4 14 q-2 8 6 ${14} z`} fill={a} opacity={0.85} />
    </g>
  )
}

export interface BackdropProps {
  m: Mood
  id?: string
  /** Laternen am Weg, eine je Bauwerk (Vorgabe: alle brennen). */
  lit?: readonly boolean[]
  /** Leuchtfeuer 0–3 (Vorgabe: 2). */
  beacon?: number
  /** Sonne oder Mond am Himmel zeigen (Vorgabe: ja). */
  orb?: boolean
}

export function Backdrop({ m, id = 'map', lit, beacon = 2, orb = true }: BackdropProps) {
  return (
    <g>
      <Sky m={m} id={id} orb={orb} />
      <Mountains m={m} />
      <Hills m={m} />
      <Treeline m={m} />
      <River m={m} />
      <Trail />
      <Watchtower m={m} beacon={beacon} />
      <Trees m={m} />
      {LANTERNS.map((l, i) => (
        <LanternPost key={i} x={l.x} y={l.y} on={lit ? !!lit[i] : true} m={m} />
      ))}
    </g>
  )
}

/** Tageszeit-Licht über dem Land (Aquarell-Lasur). Der Himmel bleibt frei, damit Sterne und Mond klar stehen. */
export function Shade({ m, id = 'map' }: { m: Mood; id?: string }) {
  const [c, a] = SHADE[m.daypart]
  if (a <= 0) return null
  return (
    <g pointerEvents="none">
      <defs>
        <linearGradient id={`shade-${id}`} gradientUnits="userSpaceOnUse" x1="0" y1={HORIZON - 34} x2="0" y2={HORIZON + 30}>
          <stop offset="0" stopColor={c} stopOpacity="0" />
          <stop offset="1" stopColor={c} stopOpacity={a} />
        </linearGradient>
      </defs>
      <rect x={-W} y={HORIZON - 34} width={W * 3} height={H - HORIZON + 44} fill={`url(#shade-${id})`} />
    </g>
  )
}

/**
 * Lichter über der Lasur: Abends und nachts leuchten Leuchtfeuer, Laternen und
 * die Fenster der stehenden Bauwerke wirklich, statt mit abgedunkelt zu werden.
 * `built`: Ausbaustufe 0–4 je Platz.
 */
export function Lights({ m, id = 'map', lit, built, beacon = 2 }: { m: Mood; id?: string; lit?: readonly boolean[]; built?: readonly number[]; beacon?: number }) {
  if (!isDark(m) && m.daypart !== 'dawn') return null
  const k = m.daypart === 'night' ? 1 : m.daypart === 'evening' ? 0.7 : 0.3
  return (
    <g pointerEvents="none">
      <defs>
        <radialGradient id={`lamp-${id}`}>
          <stop offset="0" stopColor={BEACON.core} stopOpacity="0.95" />
          <stop offset="0.35" stopColor={BEACON.warm} stopOpacity="0.5" />
          <stop offset="1" stopColor={BEACON.hot} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`beam-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={BEACON.core} stopOpacity="0.9" />
          <stop offset="1" stopColor={BEACON.warm} stopOpacity="0" />
        </linearGradient>
      </defs>
      {SLOTS.map((s, i) => {
        const tier = built ? (built[i] ?? 0) : 2
        if (tier <= 0) return null
        const r = 30 + tier * 6
        return <ellipse key={s.id} className="lw-glow" cx={(s.x / 100) * W} cy={(s.y / 100) * H - 20 * s.scale} rx={r * s.scale} ry={r * 0.8 * s.scale} fill={`url(#lamp-${id})`} opacity={0.62 * k} />
      })}
      {LANTERNS.map((l, i) => ((lit ? lit[i] : true) ? <circle key={i} cx={l.x + 4} cy={l.y - 15} r={15} fill={`url(#lamp-${id})`} opacity={0.9 * k} /> : null))}
      {beacon > 0 ? (
        <g transform={`translate(${TOWER.x} ${TOWER.y - 68})`}>
          {beacon >= 2 && m.daypart !== 'dawn' ? (
            <g className="lw-beam" opacity={0.2 + beacon * 0.05}>
              <path d="M0 0 L190 -34 L190 30 Z" fill={`url(#beam-${id})`} transform="scale(-1 1)" />
              <path d="M0 0 L190 -30 L190 34 Z" fill={`url(#beam-${id})`} />
            </g>
          ) : null}
          <circle className="lw-glow" r={22 + beacon * 16} fill={`url(#lamp-${id})`} opacity={Math.min(1, (0.6 + beacon * 0.15) * k)} />
        </g>
      ) : null}
    </g>
  )
}

export function Snow({ m }: { m: Mood }) {
  if (m.season !== 'winter') return null
  const rnd = seeded('snow')
  return (
    <g className="lw-snowfall" fill={P.snow} opacity={0.9} pointerEvents="none">
      {Array.from({ length: 34 }, (_, i) => (
        <circle key={i} cx={vary(rnd, 0, W)} cy={vary(rnd, -40, H)} r={i % 4 === 0 ? 2 : 1.3} />
      ))}
    </g>
  )
}
