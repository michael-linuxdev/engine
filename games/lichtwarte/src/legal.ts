/**
 * Impressum. Noch leer: Die Angaben (Name, Anschrift, Kontakt) trägt Michael
 * vor dem Store-Start ein. Solange es fehlt, zeigt das Spiel „Das Impressum
 * folgt vor dem Store-Start.“ und `npm run store:check` meldet einen Blocker.
 */
export const IMPRINT: { de: string; en: string } | null = null

/** Statische Datenschutz-Seite (für die Store-Angabe), beim Build erzeugt (vite.config.mjs). */
export const PRIVACY_PAGE = 'datenschutz.html'
