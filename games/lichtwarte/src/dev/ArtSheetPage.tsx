/** ?artsheet — alle Grafiken in vier Stimmungen (Pixelvergleich tools/e2e/art.mjs). ?artsheet=map nur die Talkarte. */
import { ArtSheet } from '@engine/art'
import { ART_ENTRIES, SHEET_MOODS } from './artEntries'
import { Backdrop, Shade, Snow } from '../art/Backdrop'
import { MAP_H, MAP_W } from '../scene/slots'

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
              <g>
                <Backdrop m={m} id={`${m.daypart}-${m.season}`} />
                <Snow m={m} />
                <Shade m={m} />
              </g>
            ),
          },
        ]}
      />
    )
  }
  return <ArtSheet entries={ART_ENTRIES} moods={SHEET_MOODS} cell={96} />
}
