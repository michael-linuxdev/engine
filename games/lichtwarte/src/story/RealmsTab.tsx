/** Lande-Tab: offene Lande und das nächste gesperrte, je mit eigener Landschaft; ab Jahr 2 darüber die Feuerstraße. */
import { isFeatureOpen, LINKS_ID, type LinksState } from '@engine/core'
import { useEngine } from '@engine/react'
import { LinksCard, RegionsPanel, useUi } from '@engine/ui'
import { FireRoadArt } from '../art/fireRoad'
import { RealmArt } from '../art/realm'
import { FIRE_ROAD, realmOpen } from '../content/fireRoad'
import { REALM_GROUPS, REALM_IDS, REALMS } from '../content/realms'
import { t } from '../runtime'
import { currentMood } from '../scene/mood'

export function RealmsTab() {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const road = world.get<LinksState | undefined>(LINKS_ID)
  return (
    <>
      {isFeatureOpen(world, 'fireRoad') ? (
        <LinksCard
          cfg={FIRE_ROAD}
          placeKey="realm"
          // Sichtbar ist eine Verbindung, sobald das Land davor offen ist: Man sieht, wohin die Straße als Nächstes führt
          visible={(l) => realmOpen(world, l.a)}
          art={<FireRoadArt levels={FIRE_ROAD.list.map((l) => road?.levels[l.id] ?? 0)} m={currentMood()} />}
        />
      ) : null}
      <RegionsPanel
        max={false}
        cfg={REALMS}
        groups={REALM_GROUPS}
        art={(id) => <RealmArt id={id} m={currentMood()} />}
        lockedText={(_id, i) => (i === 0 ? t.realms.opensFirst : t.realms.opensAfter(t.realms.lands[REALM_IDS[i - 1]].name))}
      />
    </>
  )
}
