/**
 * Leben im Tal: Glühwürmchen, Vögel, Falter, Glimmer über den Bauwerken,
 * der Lehrling auf dem Weg und der Talgast. Bewegung kommt aus dem CSS
 * (theme/game.css) und ruht bei „Bewegung reduzieren“.
 */
import type { ReactNode } from 'react'
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

/** Igel. */
function Hedgehog() {
  return (
    <g>
      <path d="M-8 0 q-2 -10 6 -10 q8 0 9 7 l3 3 z" fill={P.woodDark} {...fine} />
      <path d="M-6 -7 l-1 -4 l3 2 M-2 -9 l0 -4 l3 3 M2 -9 l2 -3 l1 4 M-7 -3 l-3 -2" fill="none" stroke={P.outline} strokeWidth={0.9} strokeLinecap="round" />
      <path d="M5 -5 q5 1 5 5 h-5 z" fill={P.feather} {...fine} />
      <circle cx={6.4} cy={-2.6} r={0.6} fill={P.outline} />
      <circle cx={10} cy={-0.4} r={0.8} fill={P.outline} />
    </g>
  )
}

/** Greif: Adlerkopf, Flügel, Löwenleib. */
function GriffinGuest() {
  return (
    <g>
      <path d="M-4 -6 q-9 -10 -14 -5 q6 2 8 8 z" fill={P.woodLight} {...fine} />
      <ellipse cx={0} cy={-5} rx={8} ry={5} fill={P.feather} {...fine} />
      <path d="M-6 0 v-3 M-1 0 v-3 M4 0 v-3" stroke={P.outline} strokeWidth={1.6} strokeLinecap="round" />
      <path d="M-8 -5 q-5 0 -6 -5" fill="none" stroke={P.woodLight} strokeWidth={1.5} strokeLinecap="round" />
      <circle cx={7} cy={-10} r={3.8} fill={P.white} {...fine} />
      <path d="M10 -10.5 l4.5 1.2 l-4.5 1.6 z" fill={P.glowHot} {...fine} />
      <circle cx={7.6} cy={-10.8} r={0.7} fill={P.outline} />
    </g>
  )
}

/** Kobold: kleiner Kerl mit Zipfelmütze und Hämmerchen. */
function Kobold() {
  return (
    <g>
      <path d="M-4 0 v-3 M3 0 v-3" stroke={P.outline} strokeWidth={2} strokeLinecap="round" />
      <path d="M-6 -3 q-1 -8 5.5 -8 q6.5 0 5.5 8 z" fill={P.grassDark} {...fine} />
      <circle cx={0} cy={-13} r={4} fill={FIGURE.skin} {...fine} />
      <path d="M-4.4 -14 q4 -4 8.8 0 l-1 -9 q-5 2 -7.800000000000001 9 z" fill={P.roof} {...fine} />
      <path d="M-6 -13.5 l-2.5 -1.5 M6 -13.5 l2.5 -1.5" stroke={FIGURE.skin} strokeWidth={1.6} strokeLinecap="round" />
      <circle cx={-1.4} cy={-12.8} r={0.6} fill={P.outline} />
      <circle cx={1.6} cy={-12.8} r={0.6} fill={P.outline} />
      <path d="M5 -7 l5 -4" stroke={P.woodDark} strokeWidth={1.2} strokeLinecap="round" />
      <rect x={8.5} y={-13.5} width={4} height={3} rx={0.6} fill={P.metalLight} {...fine} transform="rotate(-38 10.5 -12)" />
    </g>
  )
}

/** Reh. */
function Deer() {
  return (
    <g>
      <path d="M-7 0 v-6 M-3 0 v-6 M4 0 v-6 M8 0 v-6" stroke={P.woodDark} strokeWidth={1.5} strokeLinecap="round" />
      <ellipse cx={0} cy={-8.5} rx={9} ry={4.5} fill={P.woodLight} {...fine} />
      <circle cx={-3} cy={-9.5} r={0.8} fill={P.paper} />
      <circle cx={1} cy={-8} r={0.8} fill={P.paper} />
      <path d="M7 -10 l3 -8" stroke={P.woodLight} strokeWidth={3} strokeLinecap="round" />
      <ellipse cx={11} cy={-19} rx={3.6} ry={2.6} fill={P.woodLight} {...fine} />
      <path d="M9 -21 l-2 -3 M11 -21.5 l1 -3.5" stroke={P.woodLight} strokeWidth={1.6} strokeLinecap="round" />
      <circle cx={12} cy={-19.4} r={0.6} fill={P.outline} />
      <circle cx={14.4} cy={-18.4} r={0.7} fill={P.outline} />
    </g>
  )
}

/** Otter: langer Leib, aufgerichtet, helle Brust. */
function Otter() {
  return (
    <g>
      <path d="M-4 0 q-8 1 -11 -4" fill="none" stroke={P.woodDark} strokeWidth={3} strokeLinecap="round" />
      <path d="M-5 0 q-2 -15 3 -17 q6 1 5 17 z" fill={P.wood} {...fine} />
      <path d="M-2 -1 q-1 -9 1.5 -12 q2.5 3 1.5 12 z" fill={P.feather} />
      <circle cx={-0.5} cy={-18} r={4} fill={P.wood} {...fine} />
      <circle cx={-3.6} cy={-21} r={1.2} fill={P.wood} {...fine} />
      <circle cx={2.6} cy={-21} r={1.2} fill={P.wood} {...fine} />
      <ellipse cx={-0.5} cy={-16.6} rx={2.2} ry={1.5} fill={P.feather} />
      <circle cx={-2} cy={-18.8} r={0.6} fill={P.outline} />
      <circle cx={1} cy={-18.8} r={0.6} fill={P.outline} />
      <circle cx={-0.5} cy={-17.2} r={0.7} fill={P.outline} />
    </g>
  )
}

/** Fledermaus im Flug. */
function Bat() {
  return (
    <g className="lw-bob">
      <path d="M0 -14 q-5 -7 -13 -4 q4 1 4 5 q3 -2 5 1 q2 -2 4 -1 z" fill={P.thorn} {...fine} />
      <path d="M0 -14 q5 -7 13 -4 q-4 1 -4 5 q-3 -2 -5 1 q-2 -2 -4 -1 z" fill={P.thorn} {...fine} />
      <ellipse cx={0} cy={-12} rx={3} ry={4} fill={P.stoneDark} {...fine} />
      <path d="M-2.4 -15.4 l-0.6 -3 l2 2 M2.4 -15.4 l0.6 -3 l-2 2" fill={P.stoneDark} {...fine} />
      <circle cx={-1} cy={-12.8} r={0.6} fill={P.glowSoft} />
      <circle cx={1.2} cy={-12.8} r={0.6} fill={P.glowSoft} />
    </g>
  )
}

/** Steinbock: gedrungen, mit großen, nach hinten geschwungenen Hörnern. */
function Ibex() {
  return (
    <g>
      <path d="M-7 0 v-6 M-3 0 v-6 M4 0 v-6 M8 0 v-6" stroke={P.stoneDark} strokeWidth={1.8} strokeLinecap="round" />
      <path d="M-10 -6 q0 -7 9 -7 q10 0 10 7 q-9 3 -19 0 z" fill={P.stone} {...fine} />
      <path d="M-10 -8 l-3 -1" stroke={P.stone} strokeWidth={1.6} strokeLinecap="round" />
      <path d="M6 -11 l3 -6" stroke={P.stone} strokeWidth={3.4} strokeLinecap="round" />
      <path d="M7 -19 q4 -1 6 3 l-1 3 q-5 0 -6 -3 z" fill={P.stone} {...fine} />
      <path d="M8 -19 q-2 -9 -10 -9 M10.5 -19 q-1 -8 -8 -10.5" fill="none" stroke={P.woodDark} strokeWidth={1.8} strokeLinecap="round" />
      <path d="M11.5 -14 l0.5 3" stroke={P.stoneLight} strokeWidth={1.4} strokeLinecap="round" />
      <circle cx={10.4} cy={-17.4} r={0.6} fill={P.outline} />
    </g>
  )
}

/** Leuchtkäfer: runder Käfer mit glimmendem Hinterleib. */
function GlowBeetle() {
  return (
    <g className="lw-bob">
      <circle cx={-2} cy={-9} r={8} fill={BEACON.warm} opacity={0.35} />
      <ellipse cx={0} cy={-9} rx={5.5} ry={4} fill={P.thorn} {...fine} />
      <path d="M0 -13 v8" stroke={P.outline} strokeWidth={0.7} />
      <ellipse cx={-3.5} cy={-9} rx={2.6} ry={3} fill={BEACON.core} stroke={BEACON.hot} strokeWidth={0.6} />
      <circle cx={5.5} cy={-9.5} r={2.2} fill={P.outline} />
      <path d="M6.5 -11 l2.5 -3 M6.8 -9 l3 -1" stroke={P.outline} strokeWidth={0.7} strokeLinecap="round" />
      <path d="M-1 -13 q2 -5 6 -4 M-1 -13 q-3 -5 -7 -3" fill={P.waterLight} opacity={0.6} stroke={P.outline} strokeWidth={0.5} />
    </g>
  )
}

/** Schneehase: weiß, lange Ohren mit dunkler Spitze. */
function SnowHare() {
  return (
    <g>
      <ellipse cx={-1} cy={-5} rx={8} ry={5.5} fill={P.snow} {...fine} />
      <circle cx={-9} cy={-5} r={2} fill={P.white} {...fine} />
      <circle cx={6.5} cy={-10} r={4} fill={P.snow} {...fine} />
      <path d="M5 -13 q-2 -8 0.6 -9 q2 1 1.6 9 z M8 -13 q0 -8 2.6 -8.4 q1.6 1.4 0 9 z" fill={P.snow} {...fine} />
      <path d="M5.2 -21 q0.6 -1 1 0 M10 -20.6 q0.6 -0.8 0.9 0.2" stroke={P.outline} strokeWidth={1.4} strokeLinecap="round" />
      <circle cx={7.6} cy={-10.6} r={0.7} fill={P.outline} />
      <circle cx={10.4} cy={-9} r={0.6} fill={P.blossom} />
      <path d="M-5 0 h6 M3 0 h4" stroke={P.outline} strokeWidth={1.4} strokeLinecap="round" />
    </g>
  )
}

/** Jede Art hat ihr eigenes Bild (Rückmeldung 2026-11-11: „Steinbock“ zeigte den Fuchs). */
const GUESTS: Record<string, () => ReactNode> = {
  griffin: GriffinGuest,
  kobold: Kobold,
  wisp: Wisp,
  fox: Fox,
  hedgehog: Hedgehog,
  owl: Owl,
  deer: Deer,
  otter: Otter,
  bat: Bat,
  ibex: Ibex,
  glowBeetle: GlowBeetle,
  snowHare: SnowHare,
}
/** Talgast auf der Karte, je Art ein eigenes Bild. */
export function GuestArt({ id }: { id: string }) {
  const Art = GUESTS[id] ?? Hedgehog
  return (
    <g className="lw-guest" data-guest={id}>
      <ellipse cx={0} cy={0} rx={9} ry={2} fill={P.outline} opacity={0.2} />
      <Art />
    </g>
  )
}
