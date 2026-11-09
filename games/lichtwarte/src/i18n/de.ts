/**
 * Spieltexte (Deutsch, Ausgangssprache). Ton: gemütlich, warm, knapp,
 * nie belehrend (docs/spiele/lichtwarte/glossar.md). Der Titel kommt aus brand.ts.
 */
import { engineDe } from '@engine/ui'
import { BRAND } from '../brand'

export const gameDe = {
  app: {
    title: BRAND.de as string,
    tagline: 'Richte die alte Turmwarte wieder auf — das Licht kehrt zurück, auch wenn du fort bist.',
    description: 'Gemütliches Fantasy-Idle-Spiel: Bauwerke aufrichten, das Tal erhellen, offline weiterwachsen.',
  },
  currencies: {
    glimmer: 'Glimmer',
    runeShards: 'Runensplitter',
    glowPebbles: 'Lichtkiesel',
    nightDew: 'Nachttau',
    forebearLight: 'Ahnenlicht',
  },
  producers: {
    kraeuterkate: { name: 'Kräuterkate', blurb: 'Ein windschiefes Häuschen voller Bündel. Hier fängt das Glimmen an.', note: 'Die Kräuter wissen, wann es Zeit ist. Lass sie trocknen, dann leuchten sie.' },
    holzlager: { name: 'Holzlager', blurb: 'Gestapelte Scheite für Feuer, Balken und lange Winter.', note: 'Wer im Herbst stapelt, sitzt im Winter warm. So war es immer.' },
    steinbruch: { name: 'Steinbruch', blurb: 'Grauer Fels mit hellen Adern. Jeder Block trägt ein wenig Licht.', note: 'Klopf zweimal, bevor du brichst. Der Berg mag Höflichkeit.' },
    quellschrein: { name: 'Quellschrein', blurb: 'Klares Wasser unter moosigen Steinen, das nachts leise schimmert.', note: 'Die Quelle hat nie gefragt, wer trinkt. Wir sollten es auch nicht.' },
    schmiede: { name: 'Schmiede', blurb: 'Glut, Hammer, Amboss — hier bekommt das Licht eine Form.', note: 'Heißes Eisen ist geduldiger, als man denkt. Ungeduldig sind nur Schmiede.' },
    kartenstube: { name: 'Kartenstube', blurb: 'Pergamente, Zirkel und Tinte. Wer das Tal kennt, findet sein Licht.', note: 'Jede Karte lügt ein bisschen. Die guten sagen dir, wo.' },
    alchemistenturm: { name: 'Alchemistenturm', blurb: 'Gläser, Dampf und bunte Flammen hinter schmalen Fenstern.', note: 'Nicht alles, was blubbert, ist gefährlich. Das meiste aber schon.' },
    greifenhorst: { name: 'Greifenhorst', blurb: 'Ein Nest hoch oben. Die Greife tragen das Glimmen bis ins letzte Gehöft.', note: 'Greife merken sich jedes Gesicht. Und jeden vergessenen Leckerbissen.' },
    runenhalle: { name: 'Runenhalle', blurb: 'Steinerne Hallen, in denen alte Zeichen wieder zu sprechen beginnen.', note: 'Die Runen sind nicht stumm. Sie warten nur, bis jemand zuhört.' },
    sternwarte: { name: 'Sternwarte', blurb: 'Die Kuppel über dem Tal. Von hier aus schaut das Licht zurück.', note: 'Als die Sternwarte noch brannte, schlief niemand im Tal im Dunkeln.' },
  },
  layers: {
    moonturn: { name: 'Mondwende', action: 'Mondwende feiern', blurb: 'Der Mond dreht sich, das Tal ruht. Du beginnst neu und behältst, was die Wächter im Archiv bewahren.' },
    longNight: { name: 'Lange Nacht', action: 'Die Lange Nacht beginnen', blurb: 'Eine Nacht, die Tage dauert. Danach steht die Warte stärker als je zuvor.' },
    ages: { name: 'Zeitalter', action: 'Ein neues Zeitalter', blurb: 'Du gibst die Wacht weiter. Was du gelernt hast, bleibt als Ahnenlicht.' },
  },
  archive: {
    oldLantern: { name: 'Alte Laterne', blurb: 'Das erste Licht der Warte, frisch geputzt.', effect: (r: number) => `+${r * 5} % Glimmer` },
    builderChalk: { name: 'Baumeisterkreide', blurb: 'Wer vorher anzeichnet, verschwendet weniger.', effect: (r: number) => `−${Math.round((1 - 0.98 ** r) * 100)} % Baukosten` },
    wardenCloak: { name: 'Wächtermantel', blurb: 'Schwer, warm und voller Taschen.', effect: (r: number) => `+${r * 2} % Glimmer` },
    starChart: { name: 'Sternkarte', blurb: 'Zeigt, wo das Licht am liebsten wohnt.', effect: (r: number) => `+${Math.round(r * 15) / 10} % Glimmer` },
    hourglass: { name: 'Sanduhr', blurb: 'Die Warte arbeitet länger, während du fort bist.', effect: (r: number) => `+${r} h volle, +${r * 2} h halbe Abwesenheit` },
    sparkBell: { name: 'Funkenglocke', blurb: 'Ein heller Ton, und die Funken fliegen weiter.', effect: (r: number) => `+${r * 15} s Funkenruf` },
    nightCandle: { name: 'Nachtkerze', blurb: 'Brennt die ganze Nacht, wenn man sie lässt.', effect: (r: number) => `+${r * 30} min volle, +${r} h halbe Abwesenheit` },
    stackedWood: { name: 'Gestapeltes Holz', blurb: 'Nach jeder Mondwende steht das Holzlager schon.', effect: (r: number): string => (r > 0 ? 'Holzlager steht beim Neubeginn' : 'Holzlager beim Neubeginn') },
    travelPurse: { name: 'Reisebeutel', blurb: 'Ein paar Funken für den Anfang.', effect: (r: number) => `+${r * 80} Glimmer beim Neubeginn` },
    foundationStone: { name: 'Grundstein', blurb: 'Die Kräuterkate beginnt nicht mehr bei null.', effect: (r: number) => `Kräuterkate startet auf Stufe ${r}` },
  },
  branches: { glow: 'Glanz', watch: 'Wacht', setout: 'Aufbruch' },
  play: {
    burst: 'Funkenruf',
    map: 'Talkarte',
    wild: 'Wildnis',
    clear: 'Freilegen',
    goalUnlock: (name: string) => `Als Nächstes: ${name} freilegen`,
    goalMilestone: (name: string, at: string) => `${name} auf Stufe ${at} bringen`,
    goalPrestige: (layer: string) => `${layer} ist bereit!`,
    goalProgress: (layer: string) => `Auf dem Weg zur ${layer}`,
    slotLevel: (n: string) => `Stufe ${n}`,
    open: (name: string) => `${name} öffnen`,
  },
  chronicle: {
    menu: 'Chronik',
    title: 'Chronik der Wächterin',
    unread: 'Neue Seite',
    empty: 'Noch steht nichts darin.',
    signature: '— Alwine',
    entries: {
      welcome: { title: 'Für wen auch immer', body: 'Wenn du das liest, hast du den Schlüssel gefunden. Die Warte ist alt, das Tal ist müde, und ich bin es auch. Fang bei der Kräuterkate an. Das Licht kommt nicht auf einmal, aber es kommt — sogar, wenn du schläfst.' },
      firstBuild: { title: 'Der erste Funke', body: 'Siehst du das Glimmen über der Kate? So hat es bei mir auch angefangen. Ruf die Funken ruhig, wenn du ungeduldig bist. Sie mögen das.' },
      holzlager: { title: 'Holz für den Winter', body: 'Mit dem Holzlager wird aus einem Häuschen ein Anfang. Bau weiter, aber vergiss nicht hinzusehen: Das Tal verändert sich mit jedem Balken.' },
      steinbruch: { title: 'Stein auf Stein', body: 'Der Berg gibt nicht gern, aber er gibt. Aus diesen Steinen stand einmal die ganze Warte. Sie wird wieder stehen.' },
      moonturnReady: { title: 'Wenn der Mond sich dreht', body: 'Die erste Mondwende ist nah. Hab keine Angst davor. Was du baust, vergeht — was du lernst, bleibt im Archiv. Danach geht alles leichter.' },
      afterMoonturn: { title: 'Das Archiv', body: 'Im Archiv der Wächter liegt, was wir über die Jahre bewahrt haben. Nimm dir, was du brauchst. Jede Wache fügt etwas hinzu, auch deine.' },
    },
  },
  ftue: {
    skip: 'Überspringen',
    next: 'Weiter',
    steps: {
      welcome: { title: `Willkommen in der ${BRAND.de}`, body: 'Eine Seite aus der Chronik wartet auf dich.' },
      build: { title: 'Die Kräuterkate', body: 'Tippe auf die Kräuterkate und richte sie auf.' },
      burst: { title: 'Funkenruf', body: 'Ruf die Funken: Sie bringen dir sofort Glimmer.' },
      unlock: { title: 'Wildnis freilegen', body: 'Mit genug Glimmer legst du das Holzlager frei.' },
      offline: { title: 'Auch wenn du fort bist', body: 'Die Warte glimmt weiter. Komm später zurück und sammle ein.' },
      prestige: { title: 'Die Mondwende', body: 'Unter „Neubeginn“ siehst du, wie nah die erste Mondwende ist.' },
    },
  },
  ceremony: {
    title: (layer: string) => `${layer}`,
    body: (amount: string, currency: string) => `Das Tal ruht. Im Archiv liegen jetzt ${amount} ${currency} mehr.`,
    cta: 'Ein neuer Morgen',
  },
  effectLabels: { archive: 'Archiv' },
}

export const stringsDe = { ...engineDe, ...gameDe }
export type Strings = typeof stringsDe
