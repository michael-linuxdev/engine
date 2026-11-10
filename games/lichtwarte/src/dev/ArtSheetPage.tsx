/** ?artsheet — alle Grafiken in vier Stimmungen (Pixelvergleich tools/e2e/art.mjs). ?artsheet=map nur die Talkarte. */
import { ArtSheet, type Mood } from '@engine/art'
import { ART_ENTRIES, SHEET_MOODS } from './artEntries'
import { Backdrop, Foreground, Lights, Shade, Snow } from '../art/Backdrop'
import { MAP_H, MAP_W } from '../scene/slots'
import { WeatherLayer } from '../art/weather'
import { WEATHERS } from '../scene/weather'

export function ArtSheetPage({ only }: { only: string | null }) {
  if (only === 'map') {
    return (
      <ArtSheet
        cell={180}
        moods={SHEET_MOODS}
        entries={[
          {
            id: 'map',
            viewBox: `0 0 ${MAP_W} ${MAP_H}`,
            render: (m) => (
              <g style={{ clipPath: `path('M0 0 H${MAP_W} V${MAP_H} H0 Z')` }}>
                <Backdrop m={m} id={`${m.daypart}-${m.season}`} />
                <Snow m={m} />
                <Foreground m={m} />
                <Shade m={m} id={`${m.daypart}-${m.season}`} />
                <Lights m={m} id={`${m.daypart}-${m.season}`} />
              </g>
            ),
          },
          // Wetterschichten über der Karte (Regen, Nebel, Wind)
          ...WEATHERS.filter((w) => w !== 'clear').map((w) => ({
            id: `map-${w}`,
            viewBox: `0 0 ${MAP_W} ${MAP_H}`,
            render: (m: Mood) => (
              <g style={{ clipPath: `path('M0 0 H${MAP_W} V${MAP_H} H0 Z')` }}>
                <Backdrop m={m} id={`${w}-${m.daypart}-${m.season}`} />
                <WeatherLayer w={w} />
              </g>
            ),
          })),
        ]}
      />
    )
  }
  return <ArtSheet entries={ART_ENTRIES} moods={SHEET_MOODS} cell={96} />
}
