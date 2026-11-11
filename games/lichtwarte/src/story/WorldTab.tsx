/** Tal-Tab: Bestiarium & Kräuterkunde, Alchemie, Talgäste, Banner & Steine, Jahreskreis-Folio, Großwerke. */
import { useEffect, useState } from 'react'
import { collectionProgress, COLLECTIONS_ID, isFeatureOpen, type CollectionsState } from '@engine/core'
import { useEngine } from '@engine/react'
import { CollectionCard, CombineCard, DecorCard, FolioCard, GuestsCard, useUi, VoyagesCard, WorksCard } from '@engine/ui'
import { ALCHEMY, COLLECTION, DECOR, FOLIO, GREAT_WORKS, GUESTS, VOYAGES } from '../content/world'
import { findsSeen, t } from '../runtime'
import { newFinds } from './waiting'

export function WorldTab({ onDecorEdit }: { onDecorEdit?: () => void }) {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const open = (id: string) => isFeatureOpen(world, id)
  // Neue Funde stehen beim Betreten oben, mit dem Stand ihres Satzes; mit dem Ansehen gelten sie als gesehen
  const [fresh] = useState(() => newFinds(world))
  useEffect(() => {
    for (const id of fresh) findsSeen.add(id)
  }, [fresh])
  const found = world.get<CollectionsState | undefined>(COLLECTIONS_ID)
  return (
    <section className="ek-panel" aria-label={ui.labels.content('title.world').name} data-testid="world-view">
      {fresh.length ? (
        <div className="ek-card lw-finds" data-testid="new-finds">
          <h3 className="ek-h3">{t.waiting.findsTitle}</h3>
          <ul>
            {fresh.map((id) => {
              const cat = COLLECTION.entries.find((e) => e.id === id)?.category ?? ''
              const pr = collectionProgress(found, COLLECTION, cat)
              const set = ui.labels.content(`category.${cat}`).name
              return (
                <li key={id}>
                  <strong>{ui.labels.content(`entry.${id}`).name}</strong>
                  <span className="ek-muted">{ui.labels.content(`entry.${id}`).blurb}</span>
                  <span>{pr.found >= pr.total ? t.waiting.setDone(set) : t.waiting.setLeft(String(pr.total - pr.found), set)}</span>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
      {open('voyages') ? <VoyagesCard cfg={VOYAGES} /> : null}
      <CollectionCard cfg={COLLECTION} />
      {open('alchemy') ? <CombineCard cfg={ALCHEMY} entries={COLLECTION} /> : null}
      {open('guests') ? <GuestsCard cfg={GUESTS} /> : null}
      {open('decor') ? <DecorCard cfg={DECOR} onEdit={onDecorEdit} /> : null}
      {open('folio') ? <FolioCard cfg={FOLIO} /> : null}
      {open('greatWorks') ? <WorksCard list={GREAT_WORKS} /> : null}
    </section>
  )
}
