/** Die Feuerstraße als Band: ein Kamm mit einem Feuer je Verbindung; entzündete leuchten, ihre Stufe macht sie größer. viewBox 0 0 320 76. */
import type { Mood } from '@engine/art'
import { seeded, vary } from '@engine/art'
import { BEACON, isDark, P, RANGES, SKY3 } from './palette'
import { STROKE } from './stroke'

export function FireRoadArt({ levels, m }: { levels: readonly number[]; m: Mood }) {
  const [top, mid, low] = SKY3[m.daypart]
  const [rFar, rMid] = RANGES[m.daypart]
  const rnd = seeded('fire-road')
  const n = levels.length
  const dark = isDark(m)
  // Der Kamm steigt von links (Tal) nach rechts (Erste Warte) und wellt sich
  const pts = levels.map((_, i) => {
    const x = 14 + (i * 292) / Math.max(1, n - 1)
    const y = 58 - (i / Math.max(1, n - 1)) * 26 + Math.sin(i * 1.3) * 4
    return [Math.round(x * 10) / 10, Math.round(y * 10) / 10] as const
  })
  const ridge = `M0 66 ${pts.map(([x, y]) => `L${x} ${y + 6}`).join(' ')} L320 ${pts[n - 1][1] + 4} V76 H0 Z`
  const road = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y + 3}`).join(' ')
  let far = 'M0 40'
  for (let x = 0; x < 320; x += 40) far += ` L${x + 20} ${12 + vary(rnd, 0, 16)} L${x + 40} ${34 + vary(rnd, 0, 8)}`
  return (
    <svg viewBox="0 0 320 76" role="img" aria-hidden="true" className="lw-fireroad">
      <defs>
        <linearGradient id="lw-fr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="0.6" stopColor={mid} />
          <stop offset="1" stopColor={low} />
        </linearGradient>
        <radialGradient id="lw-fr-fire">
          <stop offset="0" stopColor={BEACON.core} stopOpacity="0.95" />
          <stop offset="0.45" stopColor={BEACON.warm} stopOpacity="0.5" />
          <stop offset="1" stopColor={BEACON.hot} stopOpacity="0" />
        </radialGradient>
        <clipPath id="lw-fr-clip">
          <rect x={1} y={1} width={318} height={74} rx={9} />
        </clipPath>
      </defs>
      <g clipPath="url(#lw-fr-clip)">
        <rect width={320} height={76} fill="url(#lw-fr-sky)" />
        <path d={`${far} V76 H0 Z`} fill={rFar} />
        <path d={ridge} fill={rMid} />
        <path d={ridge} fill={P.stoneDark} opacity={dark ? 0.35 : 0.15} />
        <path d={road} fill="none" stroke={P.paper} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 4" opacity={0.8} />
        {pts.map(([x, y], i) => {
          const lv = levels[i]
          return (
            <g key={i}>
              {lv > 0 ? <circle cx={x} cy={y - 2} r={7 + lv * 3} fill="url(#lw-fr-fire)" opacity={dark ? 1 : 0.75} /> : null}
              <path d={`M${x - 2.2} ${y + 3} h4.4 l-0.8 -2.6 h-2.8 z`} fill={lv > 0 ? P.metal : P.stoneDark} stroke={P.outline} strokeWidth={0.5} />
              {lv > 0 ? <path d={`M${x - 1.4} ${y + 0.4} q1.4 ${-4 - lv * 1.6} 2.8 0 z`} fill={P.glowHot} /> : null}
            </g>
          )
        })}
      </g>
      <rect x={1} y={1} width={318} height={74} rx={9} fill="none" stroke={P.outline} strokeWidth={STROKE.main} />
    </svg>
  )
}
