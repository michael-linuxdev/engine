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
  // Welle 5 (51–75): die Hochlande, Jahr 2 — nur anhängen. Beschreibende Namen, keine Eigennamen.
  'hohesMoor', 'steinerneTreppe', 'windsattel', 'schwarzerSee', 'wacholderhang', 'zerbrocheneBruecke', 'ziegenpfad', 'alterSteinkreis', 'siebenQuellen', 'adlerwand', 'schieferbruch', 'nebelkessel', 'letzteWeide', 'roteHalde', 'stillesKloster', 'laerchenwald', 'wasserscheide', 'hoehlenstadt', 'donnerschlucht', 'firnfeld', 'hirtenmarkt', 'sternplatte', 'kalterOfen', 'grenzstein', 'ersteWarte',
  // Welle 6 (76–100): die Fernen Küsten, Jahr 3 — nur anhängen. Beschreibende Namen, keine Eigennamen.
  'langerAbstieg', 'tropfenderWald', 'salzterrassen', 'gezeitenmuehle', 'weisseKlippen', 'bootsfriedhof', 'lotsenturm', 'seegraswiesen', 'glockentonne', 'netzmacherdorf', 'sturmhafen', 'leuchtschiff', 'muschelkalkofen', 'wattenweg', 'vogelinsel', 'versunkenesDorf', 'hausDerSeekarten', 'walknochenbogen', 'strandDerLichter', 'kompassrose', 'nebelhornfelsen', 'flaschenpostbucht', 'alteSternwarte', 'langerDamm', 'warteDerVierStrahlen',
  // Welle 7 (101–125): die Inseln, Jahr 4 — nur anhängen. Beschreibende Namen, keine Eigennamen.
  'schulinsel', 'kleineSchwester', 'zwillingsinseln', 'heringsinsel', 'schafinsel', 'scherbeninsel', 'inselDerZweiTuerme', 'eierinsel', 'halbeInsel', 'garteninsel', 'werftinsel', 'stilleInsel', 'weisseInsel', 'suesswasserinsel', 'muehleninsel', 'inselDerBriefe', 'seilerinsel', 'inselDerDrachen', 'robbeninsel', 'schwarzeInsel', 'inselDerNamen', 'aeussersteInsel', 'pruefungsinsel', 'inselOhneFeuer', 'neueWarte',
  // Welle 8 (126–150): der Rand der Karte, Jahr 5 — nur anhängen. Beschreibende Namen, keine Eigennamen.
  'offenesMeer', 'treibendeInsel', 'walweg', 'eisrand', 'nordlichtfeld', 'schwimmenderMarkt', 'korallengarten', 'stadtAufDerSandbank', 'wurzelwald', 'bojenkette', 'fremdeKueste', 'duenenmeer', 'brunnenstadt', 'steinernerWald', 'spiegelsee', 'windtuerme', 'terrassenDerLampen', 'haengendeBruecken', 'wolkenwald', 'kraterrand', 'stadtDerSternwarten', 'letzterHafen', 'hausDerGanzenKarte', 'bauplatz', 'grossesLeuchtfeuer',
] as const
export type RealmId = (typeof REALM_IDS)[number]

/** Wellen als aufklappbare Gruppen der Lande-Liste (Index in REALM_IDS, `to` exklusiv). Nur anhängen. */
export const REALM_GROUPS = [
  { id: 'near', from: 0, to: 11 },
  { id: 'pass', from: 11, to: 22 },
  { id: 'crafts', from: 22, to: 33 },
  { id: 'cape', from: 33, to: 49 },
  { id: 'highlands', from: 49, to: 74 },
  { id: 'coasts', from: 74, to: 99 },
  { id: 'isles', from: 99, to: 124 },
  { id: 'rim', from: 124, to: 149 },
] as const

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
  hohesMoor: ['plankTrack', 'coldCut', 'turfStack', 'heatherHut', 'ravenPost', 'blackPool', 'dryingFrames', 'sundewBank', 'oldHearth', 'moorFire'],
  steinerneTreppe: ['firstStep', 'restNiche', 'handRope', 'waterStep', 'carvedMark', 'broomHut', 'landing', 'echoBend', 'thousandthStep', 'stairFire'],
  windsattel: ['windWall', 'flagLine', 'stormHut', 'whistleStone', 'kiteLoft', 'rainGauge', 'saddleRest', 'cloudLadder', 'weatherBook', 'saddleFire'],
  schwarzerSee: ['stonePier', 'rowBoat', 'rushBelt', 'iceCellar', 'fishRacks', 'stillBay', 'islandCairn', 'divingBell', 'starMirror', 'tarnFire'],
  wacholderhang: ['berryRows', 'smokeHut', 'dryingLoft', 'resinPots', 'goatGate', 'herbBundles', 'stoneTerrace', 'oldStump', 'scentCellar', 'slopeFire'],
  zerbrocheneBruecke: ['firstArch', 'stoneCrane', 'mortarPit', 'ropeLine', 'buildersHut', 'keystone', 'gapPlank', 'farPier', 'signalHorn', 'bridgeFire'],
  ziegenpfad: ['saltStone', 'nightPen', 'cheeseShelf', 'narrowLedge', 'bellTree', 'kidShelter', 'hornGate', 'cliffSpring', 'lanternStaff', 'trackFire'],
  alterSteinkreis: ['gateStones', 'fallenStone', 'mossRing', 'shadowLine', 'countersHut', 'bowlStone', 'sunGap', 'tallStone', 'emptyPlace', 'circleFire'],
  siebenQuellen: ['sweetSpring', 'ironSpring', 'coldSpring', 'cupHouse', 'mossChannel', 'washStones', 'warmSpring', 'singingSpring', 'hiddenSpring', 'springFire'],
  adlerwand: ['ropeAnchor', 'lowEyrie', 'watchLedge', 'featherStore', 'basketLift', 'windHole', 'highEyrie', 'fledgeRock', 'skyRing', 'wallFire'],
  schieferbruch: ['quarryFace', 'splittingBench', 'slateSled', 'roofersYard', 'chalkHut', 'writingSlabs', 'spoilHeap', 'imprintWall', 'deepLevel', 'quarryFire'],
  nebelkessel: ['mistNets', 'dripTrough', 'cisternHouse', 'rimPath', 'hornPost', 'fernGarden', 'whitePond', 'ropeRail', 'clearWindow', 'hollowFire'],
  letzteWeide: ['summerHut', 'milkingStone', 'hayCrib', 'dogBench', 'butterCellar', 'stormPen', 'gentianField', 'farView', 'snowMarker', 'pastureFire'],
  roteHalde: ['washTrough', 'redKnoll', 'oldAdit', 'sortingTable', 'cartTrack', 'stampMill', 'rustPond', 'propStore', 'assayHut', 'heapFire'],
  stillesKloster: ['gateLodge', 'herbCourt', 'candleRoom', 'quietWalk', 'copyDesk', 'breadOven', 'bellCord', 'guestCell', 'windowLight', 'cloisterFire'],
  laerchenwald: ['tappingCuts', 'needleFloor', 'shingleShed', 'woodSled', 'charcoalRing', 'antHill', 'goldClearing', 'oldGiant', 'seedLoft', 'larchFire'],
  wasserscheide: ['ridgeLine', 'leftBrook', 'rightBrook', 'gaugePost', 'writersHut', 'partingStone', 'rainBarrel', 'twoBridges', 'seaMap', 'divideFire'],
  hoehlenstadt: ['mouthGate', 'lampNiches', 'rockLane', 'cisternHall', 'mushroomBeds', 'echoMarket', 'smokeShaft', 'paintedWall', 'deepSquare', 'townFire'],
  donnerschlucht: ['firstWalkway', 'sprayHut', 'chainRail', 'signLanterns', 'gorgeWheel', 'rainbowLedge', 'hangingBridge', 'deafRock', 'fallsGate', 'gorgeFire'],
  firnfeld: ['snowPoles', 'sledDepot', 'iceSteps', 'windScoop', 'trackersTent', 'layerPit', 'blueCrack', 'summerSnow', 'oldTrail', 'firnFire'],
  hirtenmarkt: ['tetherPosts', 'woolScales', 'cheeseRow', 'storyBench', 'bellStall', 'dancingFloor', 'lostChest', 'handshakeStone', 'fairPole', 'fairFire'],
  sternplatte: ['smoothRock', 'scratchedBear', 'chalkLines', 'nightDesk', 'windbreak', 'waterMirror', 'missingStar', 'sightingStones', 'skyBook', 'plateauFire'],
  kalterOfen: ['kilnMouth', 'ashPit', 'bellowsHouse', 'woodStacks', 'sootWall', 'flue', 'keepersRoom', 'firstBrick', 'warmStone', 'kilnFire'],
  grenzstein: ['markedStone', 'twoPaths', 'tollBench', 'walkersHut', 'signPost', 'exchangeTable', 'farGate', 'unknownMark', 'meetingGround', 'borderFire'],
  ersteWarte: ['foundations', 'thirdStep', 'fireBowl', 'oldChronicle', 'scaffoldRing', 'wardenStone', 'newWalls', 'lanternRoom', 'openDoor', 'firstFire'],
  langerAbstieg: ['firstBend', 'muleStable', 'brakeLog', 'waterTrough', 'packShed', 'scree', 'restWall', 'seaGlimpse', 'fourRayStone', 'descentFire'],
  tropfenderWald: ['mossSteps', 'dripLeaves', 'mushroomLog', 'fernHollow', 'rootBridge', 'dryingHut', 'snailWall', 'cloudBranch', 'glowCaps', 'woodFire'],
  salzterrassen: ['topPan', 'sluiceBoard', 'rakeRack', 'saltCones', 'brineChannel', 'whiteHut', 'mirrorPan', 'windFence', 'saltStore', 'terraceFire'],
  gezeitenmuehle: ['millPond', 'tideGate', 'wheelPit', 'grainHoist', 'stoneFloor', 'flourChute', 'tideTable', 'millersBoat', 'moonWindow', 'millFire'],
  weisseKlippen: ['cliffPath', 'chalkPit', 'flintBed', 'ropeLadder', 'gullLedge', 'whiteWash', 'carvedSign', 'lookoutChair', 'seaStack', 'cliffFire'],
  bootsfriedhof: ['oldHull', 'ribCage', 'nailBarrel', 'lanternShed', 'tarYard', 'figurehead', 'plankStack', 'nameBoards', 'lastBoat', 'wreckFire'],
  lotsenturm: ['pilotStairs', 'spyglass', 'flagLocker', 'pilotBoat', 'chartNook', 'fogBell', 'nightBunk', 'channelMarks', 'lampGallery', 'towerFire'],
  seegraswiesen: ['lowMeadow', 'scytheRack', 'dryingLines', 'crabHoles', 'balePress', 'stiltHut', 'eelPool', 'tideStakes', 'greenBarn', 'meadowFire'],
  glockentonne: ['tenderBoat', 'chainLocker', 'paintShed', 'sandbankMark', 'oilCan', 'spareBell', 'anchorStone', 'swellGauge', 'bellCage', 'buoyFire'],
  netzmacherdorf: ['netPoles', 'twineLoft', 'needleBench', 'corkStore', 'tanningVat', 'knotSchool', 'dryingLane', 'floatRack', 'greatSeine', 'villageFire'],
  sturmhafen: ['breakwater', 'harbourBook', 'mooringRings', 'stormShutters', 'soupKitchen', 'sailRepair', 'chainBoom', 'refugeHall', 'harbourLamp', 'harbourFire'],
  leuchtschiff: ['anchorChain', 'mastLamp', 'galley', 'logDesk', 'oilTank', 'stormSail', 'dinghy', 'watchBell', 'lensHouse', 'shipFire'],
  muschelkalkofen: ['shellHeap', 'kilnDoor', 'peatStack', 'slakingPit', 'limeBarrels', 'rakeFloor', 'whiteCart', 'drawHole', 'burnersBench', 'kilnFire'],
  wattenweg: ['firstStake', 'brushMarks', 'refugeCage', 'wormCasts', 'mudSled', 'tideClock', 'shellBank', 'halfwayPost', 'lastStake', 'pathFire'],
  vogelinsel: ['landingRock', 'countingHut', 'nestTerraces', 'ringBench', 'driftwoodFence', 'eggLedge', 'rainCistern', 'hide', 'ternBank', 'islandFire'],
  versunkenesDorf: ['towerTop', 'bellRope', 'wallLines', 'oldWell', 'doorStep', 'plankWalk', 'namePost', 'tideMarks', 'dryHour', 'villageLight'],
  hausDerSeekarten: ['chartTable', 'inkStand', 'copperPlates', 'rollRack', 'lightDrawer', 'dividers', 'dryingAttic', 'oldSheets', 'masterChart', 'chartFire'],
  walknochenbogen: ['ribGate', 'debtBook', 'wrackLine', 'reevesHut', 'findingsRack', 'sandLedger', 'amberJar', 'driftBench', 'highTideMark', 'archFire'],
  strandDerLichter: ['glowLine', 'darkBoat', 'netBasket', 'warmShallows', 'sandFire', 'oarRack', 'starPool', 'quietDune', 'thousandthLight', 'beachFire'],
  kompassrose: ['stoneRose', 'brassPoint', 'needleForge', 'lodestone', 'glassBlower', 'gimbalBench', 'sightLine', 'windNames', 'fourthPoint', 'roseFire'],
  nebelhornfelsen: ['windHole', 'hornLedge', 'echoWall', 'bellowsHut', 'signalBook', 'rockStairs', 'kelpBed', 'stillDay', 'answerPoint', 'rockFire'],
  flaschenpostbucht: ['bottleLine', 'readingRock', 'corkBowl', 'letterLines', 'waxPot', 'answerDesk', 'currentPost', 'glassHeap', 'oldestLetter', 'bayFire'],
  alteSternwarte: ['copperDome', 'longTube', 'twoLists', 'nightStairs', 'lensCabinet', 'clockRoom', 'coastWindow', 'skyWindow', 'emptyLine', 'domeFire'],
  langerDamm: ['firstLantern', 'stonePacking', 'keepersCart', 'oilHut', 'waveWall', 'fishingSteps', 'midwayBench', 'sprayGate', 'lastLantern', 'causewayFire'],
  warteDerVierStrahlen: ['openDoor', 'twoMugs', 'fourRayLens', 'seaStairs', 'otherChronicle', 'signalDeck', 'keyHook', 'guestBed', 'sharedTable', 'fourthRay'],
  schulinsel: ['schoolBell', 'waxedBenches', 'slateRack', 'inkWell', 'mapWall', 'dormLoft', 'practiceLamp', 'signalYard', 'firstLesson', 'schoolFire'],
  kleineSchwester: ['landingStone', 'waterBarrel', 'oneTree', 'benchRock', 'crabPool', 'netPeg', 'windShelter', 'shellPath', 'eveningSeat', 'sisterFire'],
  zwillingsinseln: ['leftHouse', 'rightHouse', 'callingRock', 'sharedWell', 'ropeFerry', 'twoGardens', 'oldQuarrel', 'sameMinute', 'middleRock', 'twinFire'],
  heringsinsel: ['staveYard', 'hoopForge', 'saltShed', 'guttingTable', 'barrelRow', 'smokeRack', 'netWinch', 'gullPost', 'springRun', 'herringFire'],
  schafinsel: ['stoneFold', 'kelpShore', 'shearingStool', 'woolLoft', 'lambShelter', 'spinningWheel', 'dyePot', 'wallWalk', 'oldEwe', 'sheepFire'],
  scherbeninsel: ['glassBeach', 'sortingTrays', 'greenJar', 'sieveLine', 'mosaicWall', 'polishDrum', 'lanternPanes', 'stormShelf', 'rarestPiece', 'shardFire'],
  inselDerZweiTuerme: ['oldTower', 'newTower', 'ropeBetween', 'oilCellar', 'keepersPath', 'lensCloth', 'logShelf', 'spareWick', 'bothLit', 'towerFire'],
  eierinsel: ['nestLedges', 'ropeSeat', 'eggBasket', 'fishBucket', 'tallyStick', 'guanoPath', 'stormCleft', 'fledglingRock', 'tenthNest', 'eggFire'],
  halbeInsel: ['dryHour', 'stiltHouse', 'tidePole', 'mudBoots', 'bellRope', 'saltMeadow', 'boatHook', 'highTideMark', 'lastCrossing', 'halfFire'],
  garteninsel: ['windWall', 'appleRows', 'beeSkeps', 'graftingBench', 'rainTank', 'fruitLoft', 'ciderJug', 'firstTree', 'valleyPips', 'gardenFire'],
  werftinsel: ['keelBlocks', 'steamBox', 'plankRack', 'adzeBench', 'caulkingPot', 'mastShed', 'launchRails', 'namingBrush', 'lastPlank', 'yardFire'],
  stilleInsel: ['softPath', 'feltShoes', 'signLantern', 'nestHollow', 'quietBench', 'slateNotes', 'whisperWell', 'coveredLamp', 'longSilence', 'silentFire'],
  weisseInsel: ['limePit', 'brushRack', 'whiteSteps', 'paintedTree', 'ladderShed', 'sunWall', 'bucketLine', 'blindingNoon', 'lastStone', 'whiteFire'],
  suesswasserinsel: ['springHead', 'stoneBasin', 'barrelRamp', 'yokeRack', 'newsBench', 'fernGrotto', 'overflowPond', 'cupChain', 'everyBoat', 'springFire'],
  muehleninsel: ['firstMill', 'sailLoft', 'grainBoat', 'millStairs', 'brakeRope', 'flourSacks', 'windVane', 'stoneDresser', 'seventhMill', 'millFire'],
  inselDerBriefe: ['sortingDesk', 'pigeonLoft', 'sealPress', 'mailBoat', 'pigeonHoles', 'lostLetters', 'stampDrawer', 'griffinPerch', 'unsentLetter', 'postFire'],
  seilerinsel: ['ropeWalk', 'hempStore', 'spinningHook', 'tarKettle', 'layingTop', 'coilShed', 'spliceBench', 'anchorCable', 'longestRope', 'ropeFire'],
  inselDerDrachen: ['kiteLoft', 'paperPress', 'bambooRack', 'stringWinch', 'tailRibbons', 'lampKite', 'windHill', 'calmDay', 'highestKite', 'kiteFire'],
  robbeninsel: ['haulOut', 'pupBay', 'watchBoat', 'fishStore', 'netCutter', 'sickPen', 'lookoutRock', 'nightCalls', 'missingOne', 'sealFire'],
  schwarzeInsel: ['blackShore', 'warmGround', 'pumpkinRows', 'steamVent', 'pumiceWall', 'hotSpring', 'ashSieve', 'glassVein', 'deepDig', 'blackFire'],
  inselDerNamen: ['firstStone', 'mossKnife', 'longRow', 'nameBook', 'chiselShed', 'fourRayMark', 'visitorsBench', 'blankStones', 'nextStone', 'namesFire'],
  aeussersteInsel: ['stormWall', 'anchoredHut', 'windGauge', 'spraySteps', 'signalGun', 'logOfLights', 'edgeChair', 'farLight', 'lastRock', 'outerFire'],
  pruefungsinsel: ['landingCove', 'fireRing', 'woodAllowance', 'nightSeat', 'coldHour', 'doubtStone', 'dawnRock', 'returnBoat', 'oneNight', 'trialFire'],
  inselOhneFeuer: ['emptyTower', 'fullCellar', 'dryWick', 'doorNote', 'dustSheets', 'unsleptBed', 'cleanLens', 'stackedWood', 'firstMatch', 'waitingFire'],
  neueWarte: ['openShutters', 'firstLog', 'trimmedWick', 'borrowedCoat', 'lettersHome', 'practiceSignals', 'secondMug', 'thirdStep', 'keyBelow', 'newFire'],
  offenesMeer: ['longSwell', 'helmBench', 'logLine', 'nightWatch', 'waterCask', 'reefedSail', 'starFix', 'driftMark', 'bowLantern', 'seaFire'],
  treibendeInsel: ['reedBundles', 'bindingRope', 'floatingHut', 'anchorStone', 'fishHole', 'dryingMat', 'steeringPole', 'newCorner', 'driftLog', 'reedFire'],
  walweg: ['callingHorn', 'spoutWatch', 'longBoat', 'songNotes', 'calfWater', 'boneMarker', 'tideLine', 'darkYears', 'greatReturn', 'roadFire'],
  eisrand: ['iceHole', 'sledHut', 'iceSaw', 'lineReel', 'windScreen', 'fishRack', 'crackWatch', 'snowWall', 'holeLantern', 'iceFire'],
  nordlichtfeld: ['readingChair', 'colourBook', 'furBlanket', 'iceLens', 'signalPole', 'stillNight', 'greenVeil', 'redVeil', 'answerLamp', 'fieldFire'],
  schwimmenderMarkt: ['boatLane', 'lanternStall', 'spiceBoat', 'scalesBoat', 'teaRaft', 'awningRow', 'mooringRing', 'nightTrade', 'threeRayLamp', 'marketFire'],
  korallengarten: ['divingRaft', 'breathStone', 'coralShelf', 'pearlBasket', 'fishCloud', 'seaFan', 'sunkenLantern', 'clearHour', 'deepGarden', 'gardenFire'],
  stadtAufDerSandbank: ['pileRam', 'plankStreet', 'stiltHouses', 'boatGarage', 'ropeBridge', 'tideBell', 'oldEnd', 'newEnd', 'townSquare', 'sandbankFire'],
  wurzelwald: ['rootGate', 'flatBoat', 'crabPots', 'mudBank', 'heronPerch', 'stiltPath', 'tideChannel', 'nightRoute', 'heartTree', 'rootFire'],
  bojenkette: ['firstBuoy', 'tenderBoat', 'chainStore', 'lampOil', 'midChannel', 'bellBuoy', 'stormLink', 'paintRaft', 'lastBuoy', 'chainFire'],
  fremdeKueste: ['landingBeach', 'wordBook', 'giftTable', 'countingBeads', 'guestHouse', 'leftHandFire', 'threeWords', 'sharedMeal', 'firstTreaty', 'shoreFire'],
  duenenmeer: ['duneCrest', 'camelLine', 'waterSkins', 'nightCamp', 'starCompass', 'woodGift', 'sandGoggles', 'wellMarker', 'highDune', 'duneFire'],
  brunnenstadt: ['wellRim', 'lanternRope', 'waterWheel', 'shadeTrees', 'clayJars', 'nightMarket', 'coolCellar', 'guardBench', 'groundStar', 'wellFire'],
  steinernerWald: ['fallenTrunk', 'ringTable', 'chipPile', 'measuringCord', 'stoneBark', 'sootLayer', 'shadeTent', 'oldestStump', 'youngShoot', 'forestFire'],
  spiegelsee: ['saltCrust', 'boardShoes', 'markerCairns', 'brineSpring', 'stillWater', 'lowerSky', 'saltBlocks', 'dawnCrossing', 'doubleMoon', 'lakeFire'],
  windtuerme: ['firstTower', 'tuningFlap', 'windSlot', 'ladderRing', 'toneBook', 'listeningPost', 'stormShutter', 'twelfthTower', 'thirteenthNote', 'towersFire'],
  terrassenDerLampen: ['lowestStep', 'polishCloth', 'oilJars', 'wickBasket', 'terraceStairs', 'windGlass', 'countingBoard', 'rehearsal', 'thousandthLamp', 'terraceFire'],
  haengendeBruecken: ['grassBundles', 'twistingYard', 'anchorPosts', 'handCables', 'floorMat', 'oldBridge', 'weavingDay', 'gorgeView', 'firstCrossing', 'bridgeFire'],
  wolkenwald: ['mossTrunks', 'airPlants', 'dripLeaves', 'plankPath', 'orchidShelf', 'frogPool', 'cloudWindow', 'holdingVine', 'canopyDeck', 'cloudFire'],
  kraterrand: ['rimPath', 'ashHut', 'warmRock', 'sulphurVent', 'glowWatch', 'rumbleBook', 'coolingField', 'companyBench', 'deepGlow', 'rimFire'],
  stadtDerSternwarten: ['domeStreet', 'listArchive', 'reckoningHall', 'abacusWall', 'lensMarket', 'messengerYard', 'nightSchool', 'theNumber', 'closedRing', 'cityFire'],
  letzterHafen: ['anchorForge', 'quenchTrough', 'chainLoft', 'lastQuay', 'farewellBench', 'returnBoard', 'oldAnchors', 'newAnchor', 'openHorizon', 'harbourFire'],
  hausDerGanzenKarte: ['floorMap', 'candleBoxes', 'messageDesk', 'feltSlippers', 'galleryRail', 'valleyCandle', 'darkPatches', 'longTaper', 'everyRealm', 'mapFire'],
  bauplatz: ['foundationPit', 'stoneYard', 'realmStones', 'liftingCrane', 'mortarMixers', 'scaffoldRing', 'plansTable', 'mealTent', 'topCourse', 'siteFire'],
  grossesLeuchtfeuer: ['doorWithoutLock', 'realmStairs', 'manyRayLens', 'commonTable', 'watchRoster', 'guestBunks', 'chronicleRoom', 'signalGallery', 'everyRay', 'greatFire'],
}

/**
 * Bereichs-Leiter eines Landes; spätere Lande sind teurer (Stellschrauben: REALM_TUNING).
 * Späte Taktung: ab `lateFrom` (Index 12 = Land 14) wächst auch der Ertrag, sonst lägen
 * zwischen zwei Landen bald über zehn Tage. `lateYieldGrowth` liegt knapp unter
 * `landGrowth`: Die Abstände wachsen nur noch von zwei auf drei Tage.
 * Lande vor `lateFrom` bleiben unverändert (frühe Taktung bis Tag 35).
 * Hochlande (Jahr 2, ab `highFrom`): `highCost` macht jeden Bereich teurer, damit ein Land dort
 * gut eine Woche trägt statt drei Tage (Messung in fuenf-jahre.md).
 */
export const REALM_TUNING = { costBase: 10, costStep: 10, costScale: 1.17, rateStep: 4.5, landGrowth: 1.15, openLevel: 25, lateFrom: 12, lateYield: 1.75, lateYieldGrowth: 1.145, highFrom: 49, highCost: 3 }
const lateYield = (land: number) => (land < REALM_TUNING.lateFrom ? 1 : REALM_TUNING.lateYield * Math.pow(REALM_TUNING.lateYieldGrowth, land - REALM_TUNING.lateFrom))
const ladder = (id: string, k: number, land: number): ProducerDef => ({
  id,
  baseCost: Math.round(REALM_TUNING.costBase * Math.pow(REALM_TUNING.costStep, k) * Math.pow(REALM_TUNING.landGrowth, land) * (land >= REALM_TUNING.highFrom ? REALM_TUNING.highCost : 1)),
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
