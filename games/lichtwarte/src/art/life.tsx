/**
 * Leben im Tal: Glühwürmchen, Vögel, Falter, Glimmer über den Bauwerken,
 * der Lehrling auf dem Weg und der Talgast. Bewegung kommt aus dem CSS
 * (theme/game.css) und ruht bei „Bewegung reduzieren“.
 */
import type { Mood } from '@engine/art'
import { seeded, vary } from '@engine/art'
import { apprenticeSpot, HORIZON, MAP_H, MAP_W, SLOTS } from '../scene/slots'
import { BEACON, FIGURE, isDark, P } from './palette'
import { STROKE } from './stroke'

const fine = { stroke: P.outline, strokeWidth: STROKE.fine, strokeLinejoin: 'round' as const }

/** Glühwürmchen: abends und nachts, außer im Winter. */
export function Fireflies({ m }: { m: Mood }) {
  if (!isDark(m) || m.season === 'winter') return null
  const rnd = seeded('fireflies')
  return (
    <g pointerEvents="none">
      {Array.from({ length: 16 }, (_, i) => {
        const x = vary(rnd, 12, MAP_W - 12)
        const y = vary(rnd, HORIZON + 40, MAP_H - 30)
        return (
          <g key={i} className={`lw-firefly lw-firefly--${i % 4}`}>
            <circle cx={x} cy={y} r={3.2} fill={BEACON.warm} opacity={0.3} />
            <circle cx={x} cy={y} r={1.1} fill={BEACON.core} />
          </g>
        )
      })}
    </g>
  )
}

/** Vögel ziehen tagsüber über die Berge. */
export function Birds({ m }: { m: Mood }) {
  if (m.daypart === 'night') return null
  return (
    <g className="lw-birds" fill="none" stroke={P.outline} strokeWidth={1.2} strokeLinecap="round" opacity={0.7} pointerEvents="none">
      <path d="M96 150 q3 -4 6 0 q3 -4 6 0" />
      <path d="M112 142 q2.5 -3.5 5 0 q2.5 -3.5 5 0" />
      <path d="M84 140 q2 -3 4 0 q2 -3 4 0" />
    </g>
  )
}

/** Falter: tagsüber im Frühling und Sommer. */
export function Butterflies({ m }: { m: Mood }) {
  if (isDark(m) || m.season === 'winter' || m.season === 'autumn') return null
  const rnd = seeded('butterflies')
  return (
    <g pointerEvents="none">
      {Array.from({ length: 5 }, (_, i) => {
        const x = vary(rnd, 30, MAP_W - 30)
        const y = vary(rnd, HORIZON + 80, MAP_H - 60)
        return (
          <g key={i} className={`lw-butterfly lw-firefly--${i % 4}`}>
            <path d={`M${x} ${y} q-4 -5 -5 0 q1 4 5 0 q4 -5 5 0 q-1 4 -5 0`} fill={i % 2 ? P.blossom : P.glowSoft} stroke={P.outline} strokeWidth={0.5} />
          </g>
        )
      })}
    </g>
  )
}

/** Glimmer steigt über jedem stehenden Bauwerk auf (Ertrag wird sichtbar). */
export function Motes({ built }: { built: readonly number[] }) {
  return (
    <g pointerEvents="none">
      {SLOTS.map((s, i) =>
        (built[i] ?? 0) > 0
          ? [0, 1].map((k) => (
              <circle key={`${s.id}-${k}`} className={`lw-mote lw-mote--${(i + k * 2) % 4}`} cx={(s.x / 100) * MAP_W + (k ? 9 : -8)} cy={(s.y / 100) * MAP_H - 30 * s.scale} r={1.6} fill={BEACON.warm} stroke={BEACON.core} strokeWidth={0.5} />
            ))
          : null,
      )}
    </g>
  )
}

/** Der Lehrling (24 hoch, Maßfigur): Kapuzenmantel, Laterne in der Hand. */
export function Apprentice({ m }: { m: Mood }) {
  return (
    <g>
      <ellipse cx={1} cy={0} rx={6} ry={1.6} fill={P.outline} opacity={0.2} />
      <path d="M-2.5 0 v-5 M2.5 0 v-5" stroke={P.outline} strokeWidth={2.2} strokeLinecap="round" />
      <path d="M-6 -4 q-1 -10 3 -13 h6 q4 3 3 13 z" fill={FIGURE.cloak} {...fine} />
      <path d="M1 -17 h2 q4 3 3 13 h-4 z" fill={P.outline} opacity={0.18} />
      <circle cx={0} cy={-19} r={4.2} fill={FIGURE.skin} {...fine} />
      <path d="M-4.6 -18.5 q0 -6 4.6 -6 q4.6 0 4.6 6 q-2 -3 -4.6 -3 q-2.6 0 -4.6 3 z" fill={FIGURE.hood} {...fine} />
      <circle cx={-1.5} cy={-18.6} r={0.6} fill={P.outline} />
      <circle cx={1.7} cy={-18.6} r={0.6} fill={P.outline} />
      <path d="M-0.8 -16.8 q0.9 0.8 1.8 0" fill="none" stroke={P.outline} strokeWidth={0.6} strokeLinecap="round" />
      {/* Laterne am Stab */}
      <path d="M6 -12 l5 -6" stroke={P.outline} strokeWidth={1.1} strokeLinecap="round" />
      <circle cx={11} cy={-15} r={5} fill={P.glow} opacity={isDark(m) ? 0.45 : 0.18} />
      <rect x={9.4} y={-17.5} width={3.2} height={4.4} rx={0.8} fill={P.glowSoft} {...fine} />
    </g>
  )
}

/** Der Lehrling geht den Weg ab: Seine Stelle wechselt mit der Minute. */
export function ApprenticeOnTrail({ m, minute }: { m: Mood; minute: number }) {
  const { x, y, scale } = apprenticeSpot(minute)
  return (
    <g className="lw-walker" transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="lw-bob">
        <Apprentice m={m} />
      </g>
    </g>
  )
}

/**
 * Alwine auf der Bank vor der Kräuterkate: Mit dem ersten Zeitalter kommt sie den Weg
 * herunter und bleibt — „diesmal bin ich der Gast“ (Chronik, Seite „Ein neues Zeitalter“).
 */
export function AlwineOnBench({ m }: { m: Mood }) {
  return (
    <g data-figure="alwine">
      <ellipse cx={0} cy={0.5} rx={13} ry={2.2} fill={P.outline} opacity={0.2} />
      {/* Bank */}
      <path d="M-11 0 v-6 M11 0 v-6" stroke={P.woodDark} strokeWidth={1.6} strokeLinecap="round" />
      <rect x={-12.5} y={-8} width={25} height={2.6} rx={1} fill={P.woodLight} {...fine} />
      <path d="M-11 -8 v-9 M11 -8 v-9 M-11 -14 h22" fill="none" stroke={P.woodDark} strokeWidth={1.4} strokeLinecap="round" />
      {/* Alwine: Rock, Schultertuch, grauer Dutt, Becher */}
      <path d="M-6 -1 q-1 -6 1 -8 h7 q2 2 1 8 z" fill={P.slate} {...fine} />
      <path d="M-3.5 0 v-2 M1.5 0 v-2" stroke={P.outline} strokeWidth={1.6} strokeLinecap="round" />
      <path d="M-5.5 -8 q-1 -8 4 -9 q5 1 4.5 9 z" fill={P.clothViolet} {...fine} />
      <path d="M-5 -12 q4 3 8.5 0" fill="none" stroke={P.blossom} strokeWidth={1.2} strokeLinecap="round" />
      <circle cx={-0.8} cy={-19.5} r={3.8} fill={FIGURE.skin} {...fine} />
      <path d="M-4.8 -19.5 q-0.3 -5 4 -5 q4.4 0 4 5 q-1.6 -2.4 -4 -2.4 q-2.6 0 -4 2.4 z" fill={P.stoneLight} {...fine} />
      <circle cx={-0.8} cy={-25} r={1.8} fill={P.stoneLight} {...fine} />
      <circle cx={-2.2} cy={-19.2} r={0.55} fill={P.outline} />
      <circle cx={0.8} cy={-19.2} r={0.55} fill={P.outline} />
      <path d="M-1.8 -17.4 q1.1 1 2.2 0" fill="none" stroke={P.outline} strokeWidth={0.6} strokeLinecap="round" />
      <path d="M2.5 -11 l3.5 1.5" stroke={P.outline} strokeWidth={1.2} strokeLinecap="round" />
      <rect x={5.5} y={-11.5} width={3} height={3.2} rx={0.6} fill={P.paper} {...fine} />
      <path className="lw-smoke" d="M7 -13 q-1.5 -2 0 -4" fill="none" stroke={isDark(m) ? P.stoneLight : P.white} strokeWidth={0.9} strokeLinecap="round" opacity={0.8} />
    </g>
  )
}

function Fox() {
  return (
    <g>
      <path d="M-9 -3 q-7 -1 -8 -8 q5 2 9 4 z" fill={FIGURE.fox} {...fine} />
      <path d="M-17 -11 q2 1 3 3" fill="none" stroke={FIGURE.foxLight} strokeWidth={1.6} strokeLinecap="round" />
      <path d="M-9 0 v-6 q0 -4 6 -4 h5 q4 0 4 5 v5 h-3 v-4 h-6 v4 z" fill={FIGURE.fox} {...fine} />
      <path d="M3 -8 l1 -6 l3 3 l3 -3 l1 6 q0 4 -4 4 q-4 0 -4 -4 z" fill={FIGURE.fox} {...fine} />
      <path d="M5 -6 q2 3 4 0 l-2 2 z" fill={FIGURE.foxLight} />
      <circle cx={5.4} cy={-8.4} r={0.6} fill={P.outline} />
      <circle cx={8.6} cy={-8.4} r={0.6} fill={P.outline} />
    </g>
  )
}

function Owl() {
  return (
    <g>
      <path d="M-5 0 q-2 -14 5 -14 q7 0 5 14 z" fill={FIGURE.owl} {...fine} />
      <path d="M-4 -13 l1 -3 l2 2 M4 -13 l-1 -3 l-2 2" fill={FIGURE.owl} {...fine} />
      <circle cx={-2.2} cy={-9.5} r={2.2} fill={P.glowSoft} {...fine} />
      <circle cx={2.2} cy={-9.5} r={2.2} fill={P.glowSoft} {...fine} />
      <circle cx={-2.2} cy={-9.5} r={0.8} fill={P.outline} />
      <circle cx={2.2} cy={-9.5} r={0.8} fill={P.outline} />
      <path d="M-1 -7 l1 1.6 l1 -1.6 z" fill={P.glowHot} />
      <path d="M-2 -4 q2 2 4 0 M-2 -1.5 q2 2 4 0" fill="none" stroke={FIGURE.foxLight} strokeWidth={0.7} />
    </g>
  )
}

function Wisp() {
  return (
    <g className="lw-bob">
      <circle cx={0} cy={-12} r={9} fill={FIGURE.wisp} opacity={0.3} />
      <path d="M0 -20 q5 5 3 9 q-1 4 -3 4 q-4 0 -4 -4 q0 -4 4 -9 z" fill={FIGURE.wisp} stroke={P.waterLight} strokeWidth={0.8} />
      <circle cx={-1} cy={-11.5} r={0.6} fill={P.outline} />
      <circle cx={1.4} cy={-11.5} r={0.6} fill={P.outline} />
    </g>
  )
}

function Critter() {
  return (
    <g>
      <path d="M-7 0 q-2 -9 6 -9 q8 0 8 6 l2 3 z" fill={P.feather} {...fine} />
      <path d="M-5 -6 l-1 -4 l3 2 M-1 -8 l0 -4 l3 3 M3 -8 l2 -3 l1 4" fill="none" stroke={P.woodDark} strokeWidth={0.9} strokeLinecap="round" />
      <circle cx={5} cy={-3.4} r={0.6} fill={P.outline} />
      <circle cx={9} cy={-0.6} r={0.8} fill={P.outline} />
    </g>
  )
}

/** Talgast auf der Karte: Fuchs, Eule, Irrlicht oder ein kleines Tier. Steht am Weg nahe der Kate. */
export function GuestArt({ id }: { id: string }) {
  const art = id === 'fox' || id === 'deer' || id === 'ibex' || id === 'otter' ? <Fox /> : id === 'owl' || id === 'griffin' || id === 'bat' ? <Owl /> : id === 'wisp' || id === 'glowBeetle' ? <Wisp /> : <Critter />
  return (
    <g className="lw-guest" data-guest={id}>
      <ellipse cx={0} cy={0} rx={9} ry={2} fill={P.outline} opacity={0.2} />
      {art}
    </g>
  )
}
