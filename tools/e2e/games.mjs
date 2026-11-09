/**
 * E2E-Konfiguration je Spiel. Die Tests selbst sind spielunabhängig (data-testid
 * aus @engine/ui); hier stehen nur Pfad, Präfix und spielspezifische Vorbereitung.
 */
export const GAMES = [
  {
    slug: 'vorlage',
    dir: '_vorlage',
    path: '/vorlage/',
    backupPrefix: 'VORLAGE1:',
    /** localStorage-Einträge, die Einstiegsfenster des Spiels überspringen. */
    skipIntro: {},
    /** Weg zum Kauf-Knopf eines Erzeugers (Liste: sofort sichtbar). */
    openProducer: null,
    screens: false,
    art: false,
  },
]

export function gameBySlug(slug) {
  const g = GAMES.find((x) => x.slug === slug)
  if (!g) throw new Error(`unbekanntes Spiel: ${slug}`)
  return g
}
