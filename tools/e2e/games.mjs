/**
 * E2E-Konfiguration je Spiel. Die Tests selbst sind spielunabhängig (data-testid
 * aus @engine/ui); hier stehen nur Pfad, Präfix und spielspezifische Vorbereitung.
 */
export const GAMES = [
  {
    slug: 'lichtwarte',
    dir: 'lichtwarte',
    path: '/',
    backupPrefix: 'LW1:',
    skipIntro: { 'lichtwarte-chronicle-v1': '["welcome"]', 'lichtwarte-ftue-v1': '{"completed":[],"dismissed":true}' },
    screens: true,
    art: true,
    /** axe auch für die Spiel-Fenster. */
    axeExtra: async (p, check) => {
      await p.getByTestId('slot-kraeuterkate').click()
      await p.getByTestId('upgrade-sheet').waitFor()
      await check('Ausbau Kräuterkate')
      await p.keyboard.press('Escape')
      await p.getByTestId('slot-sternwarte').click()
      await p.getByTestId('upgrade-sheet').waitFor()
      await check('Ausbau gesperrt')
      await p.keyboard.press('Escape')
      await p.getByTestId('menu').click()
      await p.getByTestId('menu-chronicle').click()
      await p.getByTestId('chronicle').waitFor()
      await check('Chronik')
      await p.keyboard.press('Escape')
    },
    /** Nach dem Prestige: Zeremonie bestätigen. */
    afterPrestige: async (p) => {
      await p.getByTestId('ceremony').waitFor()
      await p.getByTestId('ceremony-ok').click()
      // Danach öffnet sich die neue Chronik-Seite
      await p.getByTestId('chronicle').waitFor()
      await p.keyboard.press('Escape')
      await p.getByTestId('chronicle').waitFor({ state: 'detached' })
    },
    /** Spielspezifisch: Chronik beim ersten Start, geführter Einstieg, Talkarte. */
    extraSmoke: async ({ browser, phone, URL, T, assert }) => {
      // Frischer Start ohne übersprungene Einstiegsfenster
      const fresh = await browser.newContext(phone)
      const q = await fresh.newPage()
      const errs = []
      q.on('pageerror', (e) => errs.push(e.message))
      await q.goto(URL + '?installGate=0')
      await q.getByTestId('chronicle').waitFor({ timeout: 10_000 })
      assert(await q.getByText(T.chronicle.entries.welcome.title).isVisible(), 'erste Chronik-Seite öffnet sich')
      await q.keyboard.press('Escape')
      await q.getByTestId('chronicle').waitFor({ state: 'detached' })
      await q.getByTestId('ftue').waitFor()
      assert((await q.getByTestId('ftue').innerText()).includes(T.ftue.steps.build.title), 'Einstieg: Schritt Kräuterkate')
      await q.getByTestId('slot-kraeuterkate').click()
      await q.getByTestId('upgrade-sheet').waitFor()
      await q.getByTestId('buy-kraeuterkate').click()
      await q.keyboard.press('Escape')
      await q.getByTestId('ftue').getByText(T.ftue.steps.burst.title).waitFor()
      await q.getByTestId('burst').click()
      await q.getByTestId('ftue').getByText(T.ftue.steps.unlock.title).waitFor()
      await q.getByTestId('ftue-skip').click()
      assert(!(await q.getByTestId('ftue').isVisible().catch(() => false)), 'Einstieg lässt sich überspringen')
      // Chronik im Menü
      await q.getByTestId('menu').click()
      await q.getByTestId('menu-chronicle').click()
      await q.getByTestId('chronicle-firstBuild').waitFor()
      await q.keyboard.press('Escape')
      if (errs.length) throw new Error(errs.join('\n'))
      await fresh.close()
    },
  },
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
