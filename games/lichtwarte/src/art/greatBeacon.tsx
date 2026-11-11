/** Das Große Leuchtfeuer im Bau: Der Turm wächst mit jeder Stufe, erst das Gerüst, am Ende das Feuer mit vielen Strahlen. viewBox 0 0 320 120. */
import type { Mood } from '@engine/art'
import { BEACON, isDark, P, RANGES, SKY3 } from './palette'
import { STROKE } from './stroke'

export function GreatBeaconArt({ stage, stages, m }: { stage: number; stages: number; m: Mood }) {
  const [top, mid, low] = SKY3[m.daypart]
  const [rFar, rMid] = RANGES[m.daypart]
  const dark = isDark(m)
  const k = Math.max(0, Math.min(1, stage / Math.max(1, stages)))
  const done = stage >= stages
  // Turmfuß bei y 104; volle Höhe 78
  const h = 6 + k * 72
  const topY = 104 - h
  const courses = Math.floor(h / 6)
  const line = { stroke: P.outline, strokeWidth: STROKE.fine, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="0 0 320 120" role="img" aria-hidden="true" className="lw-greatbeacon">
      <defs>
        <linearGradient id="lw-gb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="0.6" stopColor={mid} />
          <stop offset="1" stopColor={low} />
        </linearGradient>
        <radialGradient id="lw-gb-fire">
          <stop offset="0" stopColor={BEACON.core} stopOpacity="0.95" />
          <stop offset="0.45" stopColor={BEACON.warm} stopOpacity="0.5" />
          <stop offset="1" stopColor={BEACON.hot} stopOpacity="0" />
        </radialGradient>
        <clipPath id="lw-gb-clip">
          <rect x={1} y={1} width={318} height={118} rx={9} />
        </clipPath>
      </defs>
      <g clipPath="url(#lw-gb-clip)">
        <rect width={320} height={120} fill="url(#lw-gb-sky)" />
        <path d="M0 78 L40 56 L84 76 L130 50 L180 74 L232 54 L280 76 L320 60 V120 H0 Z" fill={rFar} />
        <path d="M0 96 Q160 82 320 96 V120 H0 Z" fill={rMid} />
        <path d="M0 106 Q160 98 320 106 V120 H0 Z" fill={P.stoneDark} opacity={dark ? 0.5 : 0.3} />
        {/* Steine der Lande am Fuß */}
        {[96, 108, 118, 204, 214, 226].map((x, i) => (
          <rect key={x} x={x} y={100 + (i % 2)} width={8} height={5} fill={i % 2 ? P.stone : P.stoneLight} {...line} />
        ))}
        <g transform="translate(160 104) scale(1.3) translate(-160 -104)">
        {/* Turm: Lagen in zwei Steinfarben */}
        <path d={`M${148 - k * 2} 104 L${152 + k * 2} ${topY} H${168 - k * 2} L${172 + k * 2} 104 Z`} fill={P.stoneLight} {...line} />
        {Array.from({ length: courses }, (_, i) => (
          <path key={i} d={`M${150} ${104 - (i + 1) * 6} H170`} stroke={i % 2 ? P.stone : P.stoneDark} strokeWidth={0.8} opacity={0.7} />
        ))}
        {/* Gerüst, solange gebaut wird */}
        {!done ? (
          <g stroke={P.woodDark} strokeWidth={STROKE.fine}>
            <path d={`M140 104 V${topY - 4} M180 104 V${topY - 4} M140 ${topY - 4} H180`} fill="none" />
            {Array.from({ length: Math.max(1, Math.floor(h / 14)) }, (_, i) => (
              <path key={i} d={`M140 ${100 - i * 14} H180`} />
            ))}
          </g>
        ) : (
          <>
            <path d={`M146 ${topY} h28 l-3 -8 h-22 z`} fill={P.stone} {...line} />
            {[-110, -74, -40, 40, 74, 110].map((dx) => (
              <path key={dx} d={`M160 ${topY - 10} l${dx} ${-14 + Math.abs(dx) * 0.16}`} stroke={P.glowSoft} strokeWidth={3} opacity={dark ? 0.6 : 0.4} strokeLinecap="round" />
            ))}
            <circle cx={160} cy={topY - 10} r={26} fill="url(#lw-gb-fire)" />
            <circle cx={160} cy={topY - 10} r={5} fill={P.glowHot} />
          </>
        )}
        </g>
        {/* Baufeuer am Fuß, solange gebaut wird */}
        {!done && stage > 0 ? (
          <>
            <circle cx={196} cy={100} r={9} fill="url(#lw-gb-fire)" opacity={dark ? 0.9 : 0.6} />
            <path d="M194 102 q2 -7 4 0 z" fill={P.glowHot} />
          </>
        ) : null}
      </g>
      <rect x={1} y={1} width={318} height={118} rx={9} fill="none" stroke={P.outline} strokeWidth={STROKE.main} />
    </svg>
  )
}
