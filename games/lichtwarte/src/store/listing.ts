/**
 * Store-Texte (App Store / Google Play), Deutsch und Englisch.
 * Grenzen: Titel ≤ 30, Untertitel ≤ 30, Kurzbeschreibung ≤ 80 (Play),
 * Beschreibung ≤ 4000, Stichwörter ≤ 100 (iOS), Neu ≤ 500 (test/store.test.ts).
 * Der Titel kommt nur aus brand.ts. Ton: docs/spiele/lichtwarte/glossar.md.
 */
import { BRAND } from '../brand'

export interface Listing {
  title: string
  subtitle: string
  short: string
  description: string
  keywords: string
  whatsNew: string
  /** Datenschutz-Kurzfassung für die Store-Angaben („Daten, die erhoben werden“). */
  dataSafety: string
}

export const LISTING: Record<'de' | 'en', Listing> = {
  de: {
    title: BRAND.de,
    subtitle: 'Ein Tal voller Licht',
    short: 'Gemütliches Fantasy-Idle: Tal aufbauen, Leuchtfeuer entzünden, Chronik lesen.',
    description: [
      `Im Dämmertal ist es still geworden. Als neue Wächterin der ${BRAND.de} entzündest du das erste Licht – und Stück für Stück erwacht das Tal wieder.`,
      '',
      'BAUE DEIN TAL',
      '• Zehn Bauwerke von der Kräuterkate bis zur Sternwarte, jedes mit eigener Grafik in fünf Stufen.',
      '• Das Tal wächst sichtbar mit dir: Tageszeit, Jahreszeit und Wetter verändern die Karte.',
      '• Wer offline ist, sammelt trotzdem weiter. Beim Zurückkommen wartet der Ertrag.',
      '',
      'MONDWENDEN, LANGE NÄCHTE, ZEITALTER',
      '• Drei Ebenen des Neubeginns. Jede bringt neue Schätze und macht das Tal dauerhaft heller.',
      '• Das Archiv der Wächter mit drei Zweigen. Du entscheidest, wohin dein Wissen fließt.',
      '',
      'ENTDECKE DIE WELT',
      '• 34 Lande jenseits des Passes, jedes mit eigener Währung und eigener Figur.',
      '• Bestiarium & Kräuterkunde, Alchemie, Talgäste, Banner und Steine, Sternbilder und Großbauten.',
      '• Die Chronik der Wächterin erzählt in 20 Seiten, was im Tal geschieht.',
      '',
      'JEDEN TAG EIN WENIG',
      '• Wachrunde, Aufträge, Taten und Prüfungen.',
      '• Marktnacht am Wochenende, Sternfenster und neun Lichterfeste im Jahr.',
      '• Omen nach dem Wetter des Tages: sicher oder gewagt?',
      '',
      'FAIR UND RUHIG',
      '• Kein Energie-System, keine Wartesperren. Bonus-Videos sind freiwillig.',
      '• Dein Spielstand bleibt auf deinem Gerät. Sicherungscode zum Mitnehmen.',
      '• Deutsch und Englisch, große Schrift, reduzierte Bewegung, ruhiger Umgebungsklang.',
    ].join('\n'),
    keywords: 'idle,aufbau,fantasy,gemütlich,leuchtturm,tal,inkrementell,offline,chronik,wächter',
    whatsNew: 'Erste Testversion: Tal, drei Neubeginn-Ebenen, 34 Lande, Chronik, Lichterfeste, Markt, Wetter, Ton und Umgebungsklang.',
    dataSafety: 'Keine Daten werden erhoben oder geteilt. Spielstand, Einstellungen und eine freiwillige Spielaufzeichnung bleiben auf dem Gerät.',
  },
  en: {
    title: BRAND.en,
    subtitle: 'A valley full of light',
    short: 'Cosy fantasy idle: build a valley, light the beacons, read the chronicle.',
    description: [
      `Duskvale has gone quiet. As the new warden of ${BRAND.en} you light the first lamp – and bit by bit the valley wakes again.`,
      '',
      'BUILD YOUR VALLEY',
      '• Ten buildings from the Herb Cottage to the Observatory, each drawn in five stages.',
      '• The valley grows with you: time of day, season and weather change the map.',
      '• Away for a while? The valley keeps gathering. Your yield waits for you.',
      '',
      'MOONTURNS, LONG NIGHTS, AGES',
      '• Three layers of new beginnings. Each brings new treasures and makes the valley brighter for good.',
      '• The Wardens\' Archive with three branches. You decide where your knowledge flows.',
      '',
      'DISCOVER THE WORLD',
      '• 34 realms beyond the pass, each with its own currency and its own figure.',
      '• Bestiary & herbal lore, alchemy, valley guests, banners and stones, constellations and great works.',
      '• The Warden\'s Chronicle tells what happens in the valley, in 20 pages.',
      '',
      'A LITTLE EVERY DAY',
      '• Watch Round, errands, deeds and trials.',
      '• Market Night at the weekend, Star Windows and nine Festivals of Light a year.',
      '• Omens that follow the day\'s weather: play it safe or take the chance?',
      '',
      'FAIR AND CALM',
      '• No energy system, no waiting walls. Bonus videos are optional.',
      '• Your progress stays on your device. Take it along with a backup code.',
      '• German and English, large text, reduced motion, calm ambience.',
    ].join('\n'),
    keywords: 'idle,builder,fantasy,cozy,beacon,valley,incremental,offline,chronicle,warden',
    whatsNew: 'First test version: valley, three layers of new beginnings, 34 realms, chronicle, festivals, market, weather, sound and ambience.',
    dataSafety: 'No data is collected or shared. Progress, settings and an optional play recording stay on the device.',
  },
}
