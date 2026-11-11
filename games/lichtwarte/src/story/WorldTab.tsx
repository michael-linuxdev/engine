/** Tal-Tab: Bestiarium & Kräuterkunde, Alchemie, Talgäste, Banner & Steine, Jahreskreis-Folio, Großwerke. */
import { isFeatureOpen } from '@engine/core'
import { useEngine } from '@engine/react'
import { CollectionCard, CombineCard, DecorCard, FolioCard, GuestsCard, useUi, VoyagesCard, WorksCard } from '@engine/ui'
import { ALCHEMY, COLLECTION, DECOR, FOLIO, GREAT_WORKS, GUESTS, VOYAGES } from '../content/world'

export function WorldTab({ onDecorEdit }: { onDecorEdit?: () => void }) {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const open = (id: string) => isFeatureOpen(world, id)
  return (
    <section className="ek-panel" aria-label={ui.labels.content('title.world').name} data-testid="world-view">
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
