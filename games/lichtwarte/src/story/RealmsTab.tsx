/** Lande-Tab: offene Lande und das nächste gesperrte, je mit eigener Landschaft; darüber das System des laufenden Jahres (Feuerstraße, Himmelskarte, Wächterschule, Großes Leuchtfeuer); frühere sind eingeklappt. */
import type { ReactNode } from 'react'
import { isFeatureOpen, LINKS_ID, type LinksState } from '@engine/core'
import { useEngine } from '@engine/react'
import { ChartCard, LinksCard, MonumentCard, RegionsPanel, StewardsCard, useUi } from '@engine/ui'
import { ConstellationArt } from '../art/constellation'
import { FireRoadArt } from '../art/fireRoad'
import { GreatBeaconArt } from '../art/greatBeacon'
import { RealmArt } from '../art/realm'
import { BEACON_PLACES, GREAT_BEACON } from '../content/beacon'
import { FIRE_ROAD, realmOpen } from '../content/fireRoad'
import { SCHOOL } from '../content/school'
import { REALM_GROUPS, REALM_IDS, REALMS } from '../content/realms'
import { constellationRealm, SKY_CHART } from '../content/skyChart'
import { t } from '../runtime'
import { currentMood } from '../scene/mood'

export function RealmsTab() {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const road = world.get<LinksState | undefined>(LINKS_ID)
  // Die Systeme der Jahre, älteste zuerst. Das neueste steht offen oben, die früheren sind eingeklappt darunter.
  const systems: { id: string; title: string; node: ReactNode }[] = []
  if (isFeatureOpen(world, 'fireRoad')) {
    systems.push({
      id: 'fireRoad',
      title: 'links',
      node: (
        <LinksCard
          cfg={FIRE_ROAD}
          placeKey="realm"
          needLabel={(need) => t.world.roadNeed[need] ?? ''}
          // Sichtbar ist eine Verbindung, sobald das Land davor offen ist: Man sieht, wohin die Straße als Nächstes führt
          visible={(l) => realmOpen(world, l.a)}
          art={<FireRoadArt levels={FIRE_ROAD.list.map((l) => road?.levels[l.id] ?? 0)} m={currentMood()} />}
        />
      ),
    })
  }
  if (isFeatureOpen(world, 'skyChart')) {
    systems.push({
      id: 'skyChart',
      title: 'chart',
      node: (
        <ChartCard
          cfg={SKY_CHART}
          art={(g, marked) => <ConstellationArt id={g.id} marked={marked} hidden={!realmOpen(world, constellationRealm(g.id))} />}
          lockedText={(g) => t.world.chartLocked(t.realms.lands[constellationRealm(g.id) as keyof typeof t.realms.lands].name)}
        />
      ),
    })
  }
  // Lehrlinge gehen zuerst in die neuesten Lande: Dort gibt es am meisten zu bauen
  if (isFeatureOpen(world, 'school')) systems.push({ id: 'school', title: 'stewards', node: <StewardsCard cfg={SCHOOL} places={[...REALM_IDS].reverse()} placeKey="realm" /> })
  if (isFeatureOpen(world, 'greatBeacon')) {
    systems.push({
      id: 'greatBeacon',
      title: 'monument',
      node: <MonumentCard cfg={GREAT_BEACON} places={BEACON_PLACES} art={(stage) => <GreatBeaconArt stage={stage} stages={GREAT_BEACON.stages} m={currentMood()} />} />,
    })
  }
  const newest = systems[systems.length - 1]
  const earlier = systems.slice(0, -1).reverse()
  return (
    <>
      {newest?.node}
      {earlier.length ? (
        <details className="ek-details lw-systems" data-testid="systems-earlier">
          <summary>
            <span className="ek-details__head">
              {t.world.systemsEarlier}: {earlier.map((x) => ui.labels.content(`title.${x.title}`).name).join(', ')}
            </span>
          </summary>
          {earlier.map((x) => (
            <div key={x.id}>{x.node}</div>
          ))}
        </details>
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
