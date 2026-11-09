import type { ArtEntry, Mood } from '@engine/art'
import { BuildingArt } from '../art/Building'
import { DecorArt } from '../art/decor'
import { DECOR } from '../content/world'
import { PRODUCER_IDS } from '../game'

export const SHEET_MOODS: Mood[] = [
  { daypart: 'day', season: 'summer' },
  { daypart: 'dawn', season: 'spring' },
  { daypart: 'evening', season: 'autumn' },
  { daypart: 'night', season: 'winter' },
]

export const ART_ENTRIES: ArtEntry[] = [
  ...PRODUCER_IDS.flatMap((id, i) =>
    [0, 1, 2, 3, 4].map((tier) => ({
      id: `${id}-t${tier}`,
      viewBox: '-48 -112 96 118',
      render: (m: Mood) => <BuildingArt id={id} tier={tier} m={m} variant={i} />,
    })),
  ),
  ...DECOR.items.map((d) => ({
    id: `decor-${d.id}`,
    viewBox: '-16 -32 32 36',
    render: (m: Mood) => <DecorArt id={d.id} m={m} />,
  })),
]
