import type { ReactNode } from 'react'
import type { Mood } from './mood'

export interface ArtEntry {
  id: string
  /** Render the piece for a mood (square viewBox expected). */
  render: (mood: Mood) => ReactNode
  viewBox?: string
}

/**
 * ?artsheet — every art piece in every given mood on one page, fixed cell
 * size, no text inside the cells (pixel comparison in tools/e2e/art.mjs).
 */
export function ArtSheet({ entries, moods, cell = 120 }: { entries: readonly ArtEntry[]; moods: readonly Mood[]; cell?: number }) {
  return (
    <main className="art-sheet" style={{ display: 'grid', gap: 8, padding: 8, gridTemplateColumns: `repeat(${moods.length}, ${cell}px)`, background: '#ffffff' }}>
      <h1 style={{ position: 'absolute', left: -9999 }}>Art sheet</h1>
      {entries.flatMap((e) =>
        moods.map((m) => (
          <svg key={`${e.id}-${m.daypart}-${m.season}`} data-art={`${e.id}--${m.daypart}-${m.season}`} viewBox={e.viewBox ?? '0 0 100 100'} width={cell} height={cell} role="img" aria-label={e.id}>
            {e.render(m)}
          </svg>
        )),
      )}
    </main>
  )
}
