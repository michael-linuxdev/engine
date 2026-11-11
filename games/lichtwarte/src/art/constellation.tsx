/** Ein Sternbild der Himmelskarte: eingetragene Sterne leuchten und sind verbunden, die übrigen sind nur Kreise. viewBox 0 0 100 70. */
import { CONSTELLATION_STARS } from '../content/skyChart'
import { P, SKY3 } from './palette'
import { STROKE } from './stroke'

export function ConstellationArt({ id, marked, hidden = false }: { id: string; marked: number; hidden?: boolean }) {
  const stars = CONSTELLATION_STARS[id] ?? []
  const [top, , low] = SKY3.night
  const done = marked >= stars.length
  const lit = stars.slice(0, marked)
  return (
    <svg viewBox="0 0 100 70" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`lw-con-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={low} />
        </linearGradient>
      </defs>
      <rect x={1} y={1} width={98} height={68} rx={8} fill={`url(#lw-con-${id})`} stroke={P.outline} strokeWidth={STROKE.main} />
      {hidden ? null : (
        <>
          {/* Noch nicht eingetragen: die ganze Figur als blasse Vorzeichnung */}
          <polyline points={stars.map(([x, y]) => `${x},${y}`).join(' ')} fill="none" stroke={P.white} strokeWidth={0.6} strokeDasharray="1.5 2.5" opacity={0.28} />
          {lit.length > 1 ? <polyline points={lit.map(([x, y]) => `${x},${y}`).join(' ')} fill="none" stroke={P.glowSoft} strokeWidth={1.1} opacity={0.85} strokeLinejoin="round" /> : null}
          {stars.map(([x, y], i) =>
            i < marked ? (
              <g key={i}>
                <circle cx={x} cy={y} r={done ? 5 : 4} fill={P.glowSoft} opacity={0.3} />
                <path d={`M${x} ${y - 3} l0.9 2.1 l2.1 0.9 l-2.1 0.9 l-0.9 2.1 l-0.9 -2.1 l-2.1 -0.9 l2.1 -0.9 z`} fill={done ? P.glow : P.glowSoft} />
              </g>
            ) : (
              <circle key={i} cx={x} cy={y} r={1.6} fill="none" stroke={P.white} strokeWidth={0.7} opacity={0.55} />
            ),
          )}
        </>
      )}
    </svg>
  )
}
