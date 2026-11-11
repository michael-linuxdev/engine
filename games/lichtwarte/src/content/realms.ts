/**
 * Lande (P9): Unterwirtschaften in Wellen. IDs werden NUR angehängt (ids.lock.json),
 * der Parser füllt neue Lande automatisch. Texte: i18n/realms.*.ts.
 * Welle 1 = Lande 2–12, Welle 2 = 13–23, Welle 3 = 24–34 (Land 1 ist die Talkarte selbst).
 */
import { CURRENCY } from '../ids'
import { prestigeState, REGIONS_ID, type ProducerDef, type RegionConfig, type RegionDef, type RegionsState, type WorldView } from '@engine/core'

export const REALM_IDS = ['moorgrund', 'kieselbach', 'birkenhang', 'felsenkamm', 'heidegrund', 'schilfufer', 'apfelhain', 'eulenwald', 'salzquelle', 'windmark', 'sternweiher',
  // Welle 2 (13–23) und Welle 3 (24–34) — nur anhängen
  'nebelpass', 'hochalm', 'gletscherblick', 'tannengrat', 'murmelstein', 'kristallgrotte', 'hangdorf', 'talauen', 'muehlenbach', 'toepferwinkel', 'glaserhuette', 'weberdorf', 'faerberbach', 'glockengiesserei', 'papiermuehle', 'uhrmacherturm', 'brueckenstadt', 'markthafen', 'leuchtfeuer', 'muschelbucht', 'duenenland', 'seehundbank',
  // Welle 4 (35–50): Küste, alte Höfe und der Weg nach oben — nur anhängen
  'sturmkap', 'nordlichtinsel', 'bernsteinstrand', 'treibholzhafen', 'nebelinseln', 'walgesang', 'rosenhof', 'hirschgarten', 'schlossruine', 'bibliotheksberg', 'orgelklause', 'teehaus', 'kuppelstadt', 'wolkenmarkt', 'sternenpfad', 'himmelswarte',
] as const
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
  nebelpass: ['tollhouse', 'muleStable', 'cairnPath', 'mistShelter', 'passInn', 'ropeBridge', 'watchHut', 'snowGate', 'beaconCairn', 'summitStone'],
  hochalm: ['alpHut', 'cheeseCellar', 'bellMeadow', 'milkStream', 'hayBarn', 'flowerSlope', 'wellTrough', 'herdersRest', 'butterChurn', 'cloudTerrace'],
  gletscherblick: ['guideHut', 'iceCave', 'crevasseBridge', 'meltwaterPool', 'moraineWall', 'blueSeracs', 'iceWorkshop', 'starCamp', 'frostBeacon', 'glacierGate'],
  tannengrat: ['raftLanding', 'sawpit', 'firGrove', 'resinTap', 'loggersCamp', 'slideTrack', 'ropeWorks', 'riverBend', 'timberYard', 'ridgeHall'],
  murmelstein: ['shepherdHut', 'saltLick', 'burrowField', 'sunRocks', 'stoneFold', 'whistleRidge', 'herbTerrace', 'springBasin', 'woolShed', 'lookoutHorn'],
  kristallgrotte: ['caveMouth', 'paintersNook', 'echoHall', 'crystalPool', 'glowTunnel', 'dripGarden', 'mirrorChamber', 'deepStair', 'prismVault', 'heartCrystal'],
  hangdorf: ['villageWell', 'stairLane', 'bakery', 'schoolhouse', 'dancingGreen', 'smithy', 'gossipBench', 'terraceGardens', 'townHall', 'lanternSquare'],
  talauen: ['storkNest', 'floodMeadow', 'willowHut', 'ditchBridge', 'hayricks', 'reedBeds', 'herdPen', 'frogPond', 'riverIsle', 'meadowTower'],
  muehlenbach: ['upperMill', 'middleMill', 'lowerMill', 'flourStore', 'bakehouseOven', 'grainCarts', 'sieveRoom', 'millRace', 'breadMarket', 'millersHall'],
  toepferwinkel: ['clayPit', 'wheelShed', 'dryingRacks', 'kilnYard', 'glazeHut', 'jugMarket', 'tileWorks', 'washBasin', 'potteryLane', 'singingJar'],
  glaserhuette: ['sandYard', 'furnaceHall', 'pipeRack', 'colourRoom', 'paneShop', 'beadStall', 'lensBench', 'coolingTunnel', 'windowGallery', 'glassTower'],
  weberdorf: ['spinningRoom', 'loomHouse', 'woolWash', 'yarnStore', 'patternHall', 'tapestryWall', 'threadMarket', 'dyeBasket', 'tailorShop', 'storyLoom'],
  faerberbach: ['woadField', 'madderBeds', 'dyeVats', 'rinsingSteps', 'dryingLines', 'mordantHut', 'colourStore', 'weldMeadow', 'pigmentMill', 'rainbowBridge'],
  glockengiesserei: ['moldPit', 'bronzeStore', 'castingFloor', 'tuningShed', 'clapperForge', 'bellCart', 'soundTower', 'chimeGarden', 'patinaYard', 'greatBell'],
  papiermuehle: ['ragStore', 'pulpVat', 'sieveFrames', 'pressRoom', 'dryingLoft', 'sizingTub', 'cuttingTable', 'inkHouse', 'bindery', 'watermarkHall'],
  uhrmacherturm: ['gearRoom', 'springWorks', 'pendulumHall', 'dialWorkshop', 'chimeRoom', 'escapementBench', 'weightShaft', 'sundialGarden', 'starClock', 'towerFace'],
  brueckenstadt: ['stoneBridge', 'woodBridge', 'tollGate', 'boatHouse', 'bridgeMarket', 'arcadeLane', 'lockGate', 'towerBridge', 'lanternBridge', 'grandSpan'],
  markthafen: ['quay', 'warehouse', 'fishMarket', 'craneYard', 'spiceStalls', 'harbourInn', 'ropewalk', 'dryDock', 'harbourOffice', 'harbourLight'],
  leuchtfeuer: ['cliffPath', 'keepersCottage', 'oilStore', 'foghorn', 'signalMast', 'gullRock', 'tideStairs', 'lensRoom', 'stormShelter', 'coastBeacon'],
  muschelbucht: ['beachHut', 'shellSands', 'divingRock', 'pearlBeds', 'tidePools', 'nacreWorkshop', 'reefGarden', 'boatMooring', 'coralArch', 'pearlHall'],
  duenenland: ['marramBeds', 'duneFence', 'sandPath', 'wreckwood', 'driftHut', 'windDune', 'hollowDune', 'sandGlassworks', 'dunePond', 'duneTower'],
  seehundbank: ['mudflatPath', 'sealBank', 'tideHouse', 'wormFlats', 'priel', 'lookoutPost', 'sealNursery', 'driftMarkers', 'shellRidge', 'tideBeacon'],
  sturmkap: ['pilotHouse', 'windVane', 'breakwater', 'signalMast', 'netLoft', 'stormBell', 'rescueShed', 'cliffStairs', 'gullRock', 'capeBeacon'],
  nordlichtinsel: ['iceJetty', 'lightNets', 'snowHut', 'driftIce', 'sledTrack', 'smokeHouse', 'skyDeck', 'frostWell', 'auroraStones', 'northBeacon'],
  bernsteinstrand: ['tideLine', 'amberSieve', 'beachHut', 'polishBench', 'kelpRack', 'findersPost', 'lampWorkshop', 'pineDune', 'resinCellar', 'amberBeacon'],
  treibholzhafen: ['slipway', 'woodPile', 'ropeWalk', 'tarPot', 'sailLoft', 'craneArm', 'boatShed', 'carvingBench', 'mooringRow', 'havenBeacon'],
  nebelinseln: ['fogHorn', 'stiltPath', 'hermitHut', 'reedBoat', 'herbPatch', 'echoRock', 'ropeFerry', 'mossWell', 'hiddenCove', 'mistBeacon'],
  walgesang: ['songPier', 'listeningShell', 'choirSteps', 'hornWorkshop', 'tidePool', 'whaleGate', 'driftChimes', 'singersHouse', 'deepWatch', 'songBeacon'],
  rosenhof: ['roseArch', 'hedgeMaze', 'pottingShed', 'sundial', 'orangery', 'stillRoom', 'lilyPond', 'gardenWall', 'seedVault', 'courtBeacon'],
  hirschgarten: ['deerFence', 'feedRack', 'keepersLodge', 'saltLick', 'oakAvenue', 'hayBarn', 'watchStand', 'brookFord', 'antlerHall', 'parkBeacon'],
  schlossruine: ['gateArch', 'scaffold', 'oldKitchen', 'stoneYard', 'wellHouse', 'greatHall', 'towerStump', 'ivyWall', 'roofTruss', 'ruinBeacon'],
  bibliotheksberg: ['readingRoom', 'ladderRail', 'scriptorium', 'bindery', 'mapDrawer', 'inkCellar', 'lanternNook', 'catalogue', 'rareVault', 'hillBeacon'],
  orgelklause: ['windPipes', 'bellows', 'keyDesk', 'echoCave', 'tuningRoom', 'pipeForge', 'choirLedge', 'quietCell', 'greatStop', 'hermitBeacon'],
  teehaus: ['teaTerrace', 'dryingMats', 'kettleHouse', 'steppingStones', 'bambooGrove', 'cupShelf', 'mossGarden', 'springSpout', 'quietPavilion', 'teaBeacon'],
  kuppelstadt: ['glassDome', 'leadWorks', 'paneStore', 'winterGarden', 'rainGutter', 'mirrorHall', 'domeStairs', 'lightCourt', 'prismRoom', 'domeBeacon'],
  wolkenmarkt: ['ropeBridge', 'hangingStall', 'basketLift', 'kiteMast', 'scalesHouse', 'awningRow', 'cloudCistern', 'balloonDock', 'nightBazaar', 'marketBeacon'],
  sternenpfad: ['trailHead', 'cairnRow', 'restHut', 'starSteps', 'windGap', 'lanternLine', 'highBridge', 'silentTarn', 'lastCamp', 'pathBeacon'],
  himmelswarte: ['cloudGate', 'oldStairs', 'windRoom', 'starLens', 'keepersBench', 'logRoom', 'skyGarden', 'bellLoft', 'firePan', 'skyBeacon'],
}

/**
 * Bereichs-Leiter eines Landes; spätere Lande sind teurer (Stellschrauben: REALM_TUNING).
 * Späte Taktung: ab `lateFrom` (Index 12 = Land 14) wächst auch der Ertrag, sonst lägen
 * zwischen zwei Landen bald über zehn Tage. `lateYieldGrowth` liegt knapp unter
 * `landGrowth`: Die Abstände wachsen nur noch von zwei auf drei Tage.
 * Lande vor `lateFrom` bleiben unverändert (frühe Taktung bis Tag 35).
 */
export const REALM_TUNING = { costBase: 10, costStep: 10, costScale: 1.17, rateStep: 4.5, landGrowth: 1.15, openLevel: 25, lateFrom: 12, lateYield: 1.75, lateYieldGrowth: 1.145 }
const lateYield = (land: number) => (land < REALM_TUNING.lateFrom ? 1 : REALM_TUNING.lateYield * Math.pow(REALM_TUNING.lateYieldGrowth, land - REALM_TUNING.lateFrom))
const ladder = (id: string, k: number, land: number): ProducerDef => ({
  id,
  baseCost: Math.round(REALM_TUNING.costBase * Math.pow(REALM_TUNING.costStep, k) * Math.pow(REALM_TUNING.landGrowth, land)),
  costScale: REALM_TUNING.costScale,
  baseRate: Math.pow(REALM_TUNING.rateStep, k) * lateYield(land),
})

const longNights = (w: WorldView) => prestigeState(w).layers[1]?.count ?? 0
const moonturns = (w: WorldView) => prestigeState(w).layers[0]?.count ?? 0

/** Land davor hat seinen 8. Bereich auf Stufe `openLevel` gebracht. */
function previousAt8(w: WorldView, prev: RealmId): boolean {
  const r = w.get<RegionsState | undefined>(REGIONS_ID)?.regions[prev]
  return !!r?.open && (r.owned[`${prev}_${REALM_AREAS[prev][7]}`] ?? 0) >= REALM_TUNING.openLevel
}

export const REALMS: RegionConfig = {
  regions: REALM_IDS.map(
    (id, i): RegionDef => ({
      id,
      // Der erste Bereich ist beim Öffnen immer bezahlbar
      startBalance: Math.ceil(ladder('x', 0, i).baseCost) + 5,
      areas: REALM_AREAS[id].map((a, k) => ladder(`${id}_${a}`, k, i)),
      // Land 2: nach der ersten Langen Nacht oder 20 Mondwenden; danach: voriges Land mit 8 Bereichen.
      opens: (w) => (i === 0 ? longNights(w) >= 1 || moonturns(w) >= 20 : previousAt8(w, REALM_IDS[i - 1])),
    }),
  ),
  care: { maxRank: 10, growPerRank: 0.1, thriftPerRank: 0.03, costBase: 200, costGrowth: 2.2 },
  bonus: { cap: 1.5, l0: 600 },
  // Meisterschaft: drei Sterne je Land, es zählt der schwächste der zehn Bereiche (Messung in balance.md).
  // Die Pflege taugt nicht als Maß: Sie ist nach wenigen Tagen voll.
  mastery: { levels: [25, 50, 100], yieldPerStar: 0.05, reward: [{ currency: CURRENCY.glowPebbles, amount: 5 }] },
}
