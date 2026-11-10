/** Wetterschicht der Talkarte: Regen, Nebel, Wind (Blätter). Klar = nichts. Bewegung nur ohne „Bewegung reduzieren“ (CSS). */
import { seeded, vary } from '@engine/art'
import { MAP_H, MAP_W } from '../scene/slots'
import type { Weather } from '../scene/weather'
import { WEATHER_TINT } from './palette'

export function WeatherLayer({ w }: { w: Weather }) {
  if (w === 'clear') return null
  const rnd = seeded(`weather-${w}`)
  if (w === 'rain') {
    return (
      <g className="lw-weather lw-weather--rain" data-weather="rain" stroke={WEATHER_TINT.rain} strokeWidth={1.6} strokeLinecap="round" opacity={0.6}>
        {Array.from({ length: 46 }, (_, i) => {
          const x = vary(rnd, -20, MAP_W)
          const y = vary(rnd, 0, MAP_H)
          return <line key={i} x1={x} y1={y} x2={x + 5} y2={y + 16} />
        })}
      </g>
    )
  }
  if (w === 'mist') {
    return (
      <g className="lw-weather lw-weather--mist" data-weather="mist" fill={WEATHER_TINT.mist}>
        {Array.from({ length: 5 }, (_, i) => (
          <ellipse key={i} cx={vary(rnd, 40, MAP_W - 40)} cy={260 + i * 80} rx={vary(rnd, 140, 220)} ry={vary(rnd, 14, 24)} opacity={0.3} />
        ))}
      </g>
    )
  }
  return (
    <g className="lw-weather lw-weather--wind" data-weather="wind" fill={WEATHER_TINT.leaf} opacity={0.75}>
      {Array.from({ length: 14 }, (_, i) => (
        <path key={i} transform={`translate(${vary(rnd, 0, MAP_W)} ${vary(rnd, 140, MAP_H - 40)}) rotate(${vary(rnd, -40, 40)})`} d="M0 0 Q6 -6 13 0 Q6 6 0 0 Z" />
      ))}
    </g>
  )
}
