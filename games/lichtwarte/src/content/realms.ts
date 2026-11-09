/**
 * Lande (P9): Unterwirtschaften in Wellen. IDs werden NUR angehängt (ids.lock.json),
 * der Parser füllt neue Lande automatisch. Texte: i18n/realms.*.ts.
 * Welle 1 = Lande 2–12 (Land 1 ist die Talkarte selbst).
 */
import { prestigeState, REGIONS_ID, type ProducerDef, type RegionConfig, type RegionDef, type RegionsState, type WorldView } from '@engine/core'

export const REALM_IDS = ['moorgrund', 'kieselbach', 'birkenhang', 'felsenkamm', 'heidegrund', 'schilfufer', 'apfelhain', 'eulenwald', 'salzquelle', 'windmark', 'sternweiher'] as const
export type RealmId = (typeof REALM_IDS)[number]

/** Bereichs-IDs je Land (10, in Reihenfolge). */
export const REALM_AREAS: Record<RealmId, readonly string[]> = {
  moorgrund: ['boardwalk', 'peatCut', 'reedHut', 'wispBridge', 'bogBirches', 'cottonMeadow', 'mistTower', 'bogSpring', 'dragonflyPond', 'peatBeacon'],
  kieselbach: ['ford', 'watermill', 'pebbleBank', 'footbridge', 'fisherHut', 'willowBank', 'millPond', 'weir', 'granary', 'brookWatch'],
  birkenhang: ['charcoalClearing', 'resinStore', 'birchGrove', 'barkShed', 'mushroomGlade', 'woodcutterHut', 'kilnRow', 'slopeStairs', 'tarBoilery', 'lookoutRock'],
  felsenkamm: ['masonHut', 'crystalGallery', 'ridgePath', 'winch', 'storehall', 'polishingRoom', 'caveSpring', 'gemChamber', 'mountainForge', 'ridgeBeacon'],
  heidegrund: ['apiary', 'heathFold', 'juniperGrove', 'honeyCottage', 'sandTrack', 'boulderRing', 'waxHall', 'heathSpring', 'beekeeperHouse', 'bloomWatch'],
  schilfufer: ['ferryLanding', 'netShed', 'thatchedHouse', 'reedCutting', 'boatwright', 'smokehouse', 'shorePath', 'lilyBay', 'lightPost', 'ferryHouse'],
  apfelhain: ['orchardSlope', 'ciderPress', 'appleCellar', 'dryingHouse', 'pickingLadders', 'treeNursery', 'pressYard', 'appleMarket', 'beeMeadow', 'lanternTree'],
  eulenwald: ['forestHut', 'owlTower', 'oakCircle', 'mossPath', 'deerMeadow', 'mushroomRing', 'treehouse', 'forestSpring', 'forestersLodge', 'moonGlade'],
  salzquelle: ['boilingHouse', 'graduationTower', 'brineWell', 'saltStore', 'panHall', 'cartYard', 'saltScales', 'woodpile', 'crystalGarden', 'saltworksTower'],
  windmark: ['postMill', 'windWheel', 'grainField', 'kiteMeadow', 'weathervane', 'storageYard', 'bakehouse', 'stoneWall', 'windChimes', 'stormWatch'],
  sternweiher: ['mirrorPond', 'lilyHouse', 'telescopeJetty', 'glowwormBank', 'starChartHouse', 'nightGarden', 'puntHire', 'dewMeadow', 'moonBridge', 'skyMirror'],
}

const ladder = (id: string, k: number): ProducerDef => ({ id, baseCost: Math.round(10 * Math.pow(8, k)), costScale: 1.15, baseRate: Math.pow(6, k) })

const longNights = (w: WorldView) => prestigeState(w).layers[1]?.count ?? 0
const moonturns = (w: WorldView) => prestigeState(w).layers[0]?.count ?? 0

/** Land davor hat seinen 8. Bereich gebaut. */
function previousAt8(w: WorldView, prev: RealmId): boolean {
  const r = w.get<RegionsState | undefined>(REGIONS_ID)?.regions[prev]
  return !!r?.open && (r.owned[REALM_AREAS[prev][7]] ?? 0) >= 1
}

export const REALMS: RegionConfig = {
  regions: REALM_IDS.map(
    (id, i): RegionDef => ({
      id,
      startBalance: 20,
      areas: REALM_AREAS[id].map((a, k) => ladder(`${id}_${a}`, k)),
      // Land 2: nach der ersten Langen Nacht oder 20 Mondwenden; danach: voriges Land mit 8 Bereichen.
      opens: (w) => (i === 0 ? longNights(w) >= 1 || moonturns(w) >= 20 : previousAt8(w, REALM_IDS[i - 1])),
    }),
  ),
  care: { maxRank: 10, growPerRank: 0.1, thriftPerRank: 0.03, costBase: 200, costGrowth: 2.2 },
  bonus: { cap: 1.5, l0: 600 },
}
