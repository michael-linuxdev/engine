/** Lande-Tab: offene Lande und das nächste gesperrte, je mit eigener Landschaft. */
import { RegionsPanel } from '@engine/ui'
import { RealmArt } from '../art/realm'
import { REALM_IDS, REALMS } from '../content/realms'
import { t } from '../runtime'
import { currentMood } from '../scene/mood'

export function RealmsTab() {
  return (
    <RegionsPanel
      cfg={REALMS}
      art={(id) => <RealmArt id={id} m={currentMood()} />}
      lockedText={(_id, i) => (i === 0 ? t.realms.opensFirst : t.realms.opensAfter(t.realms.lands[REALM_IDS[i - 1]].name))}
    />
  )
}
