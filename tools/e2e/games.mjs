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
      // Danach öffnet sich die neue Chronik-Seite, dann das Sternenrad
      await p.getByTestId('chronicle').waitFor()
      await p.keyboard.press('Escape')
      await p.getByTestId('chronicle').waitFor({ state: 'detached' })
      await p.getByTestId('wheel-sheet').waitFor()
      await p.getByTestId('wheel-spin').click()
      const spun = await p.evaluate(() => window.__engine.get().modules.wheel.total)
      if (spun !== 1) throw new Error('E2E: Sternenrad gedreht')
      await p.keyboard.press('Escape')
      await p.getByTestId('wheel-sheet').waitFor({ state: 'detached' })
    },
    /** Spielspezifisch: Chronik beim ersten Start, geführter Einstieg, Talkarte. */
    extraSmoke: async ({ browser, phone, URL, T, assert }) => {
      // Datenschutz-Seite für den Store (beim Build erzeugt) und Link im Spiel
      const privacy = await fetch(new globalThis.URL('datenschutz.html', URL))
      assert(privacy.ok && (await privacy.text()).includes('<section lang="en">'), 'Datenschutz-Seite ausgeliefert')
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

      // Wacht: Wachrunde, Aufträge, Lichterfest (?fest=budding), Taten
      const w = await browser.newContext(phone)
      await w.addInitScript(() => {
        if (sessionStorage.getItem('seeded')) return
        sessionStorage.setItem('seeded', '1')
        localStorage.setItem('lichtwarte-chronicle-v1', '["welcome"]')
        localStorage.setItem('lichtwarte-ftue-v1', '{"completed":[],"dismissed":true}')
        localStorage.setItem('lichtwarte-hints-v1', '["wilds","milestone","buyMode","branches","bonuses","burstRecharge","watchTab","moonturnNear","archive","wheel","festivals","producersNeeded","apprentice","offlineCaps","trials","longNight"]')
      })
      const r = await w.newPage()
      r.on('pageerror', (e) => errs.push(e.message))
      await r.goto(URL + '?installGate=0&fest=budding')
      await r.getByTestId('hud-amount').waitFor()
      await r.evaluate(() => {
        const rt = window.__engine
        const s = rt.get()
        rt.replace({ ...s, core: { ...s.core, primary: 1e9 }, modules: { ...s.modules, prestige: { layers: [{ count: 6, runEarned: 0, sinceReset: 6 }, ...s.modules.prestige.layers.slice(1)] } } })
        rt.dispatch('burst', 'use')
        rt.dispatch('producers', 'buy', { id: 'kraeuterkate', count: 30 })
      })
      await r.getByTestId('tab-watch').click()
      await r.getByTestId('daily-claim').click()
      assert(await r.getByTestId('daily-claim').isDisabled(), 'Wachrunde nur einmal am Tag')
      await r.getByTestId('card-fest').getByText(T.watch.fests.budding.name).waitFor()
      await r.getByTestId('card-trials').waitFor()
      const deeds = await r.evaluate(() => window.__engine.get().modules.achievements.done)
      assert(deeds.includes('firstLight'), 'Tat „Erstes Licht“ erreicht')
      await r.getByTestId('deed-firstLight').waitFor()

      // Tal: Sammlung, Alchemie, Banner & Steine, Talgast, Omen
      await r.evaluate(() => {
        const rt = window.__engine
        const s = rt.get()
        rt.replace({
          ...s,
          modules: {
            ...s.modules,
            wallet: { ...s.modules.wallet, balances: { ...s.modules.wallet.balances, glowPebbles: 500, runeShards: 500 } },
            collections: { found: { moonsage: 1, dewcup: 1 } },
            visitors: { ...s.modules.visitors, current: 'fox', until: Date.now() + 60_000 },
            // Tag = heute, sonst wählt der nächste Takt das Omen neu (nach dem Wetter)
            choiceEvents: { ...s.modules.choiceEvents, day: (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` })(), pending: 'stormNight' },
          },
        })
        rt.dispatch('producers', 'buy', { id: 'kraeuterkate', count: 1 })
      })
      await r.getByTestId('tab-world').click()
      await r.getByTestId('card-collection').waitFor()
      await r.getByTestId('brew-a').selectOption('moonsage')
      await r.getByTestId('brew-b').selectOption('dewcup')
      await r.getByTestId('brew').click()
      assert((await r.evaluate(() => window.__engine.get().modules.combine.recipe)) === 'glowTea', 'Alchemie: Rezept braut')
      await r.getByTestId('decor-blueBanner').getByRole('button').click()
      await r.getByTestId('decor-slot-0').selectOption('blueBanner')
      assert((await r.evaluate(() => window.__engine.get().modules.decor.placed[0])) === 'blueBanner', 'Banner aufgestellt')
      await r.getByTestId('visitor-greet').click()
      assert((await r.evaluate(() => window.__engine.get().modules.visitors.seen.fox)) === 1, 'Talgast begrüßt')
      await r.getByTestId('omen-safe').click()
      assert((await r.evaluate(() => window.__engine.get().modules.choiceEvents.active)) === true, 'Omen gewählt')
      await r.getByTestId('tab-play').click()
      assert((await r.locator('[data-decor="blueBanner"]').count()) === 1, 'Banner auf der Talkarte')

      // Rückkehr-Brief nach 50 Stunden: Brief + Geschenk (20 Lichtkiesel)
      const pebblesBefore = await r.evaluate(() => window.__engine.get().modules.wallet.balances.glowPebbles)
      await r.evaluate(() => {
        const rt = window.__engine
        const s = rt.get()
        rt.replace({ ...s, modules: { ...s.modules, offline: { pending: { gained: 1000, elapsedMs: 50 * 3600_000, capped: true, at: Date.now() }, claims: 0 } } })
      })
      await r.getByTestId('comeback-letter').getByText(T.chronicle.comeback.title).waitFor()
      await r.getByTestId('welcome-claim').click()
      const pebblesAfter = await r.evaluate(() => window.__engine.get().modules.wallet.balances.glowPebbles)
      assert(pebblesAfter - pebblesBefore >= 20, `Rückkehr-Geschenk (${pebblesBefore} → ${pebblesAfter})`)

      // Lande: nach der ersten Langen Nacht öffnet sich Moorgrund
      await r.evaluate(() => {
        const rt = window.__engine
        const s = rt.get()
        const layers = s.modules.prestige.layers.map((l, i) => (i === 1 ? { count: 1, runEarned: 0, sinceReset: 1 } : l))
        rt.replace({ ...s, modules: { ...s.modules, prestige: { layers } } })
        rt.dispatch('producers', 'buy', { id: 'kraeuterkate', count: 1 })
      })
      await r.getByTestId('tab-realms').click()
      await r.getByTestId('realm-open-moorgrund').click()
      await r.getByTestId('realm-sheet').getByText(T.realms.lands.moorgrund.areas.boardwalk, { exact: true }).waitFor()
      await r.getByTestId('area-buy-moorgrund_boardwalk').click()
      assert((await r.evaluate(() => window.__engine.get().modules.regions.regions.moorgrund.owned.moorgrund_boardwalk)) === 1, 'Land: erster Bereich gebaut')
      await r.keyboard.press('Escape')

      // Markt: Tagesgeschenk, Talstil kaufen und anlegen, Testkauf mit Testgeld
      await r.getByTestId('tab-market').click()
      await r.getByTestId('card-gift').waitFor()
      const pebbles = () => r.evaluate(() => window.__engine.get().modules.wallet.balances.glowPebbles)
      const p0 = await pebbles()
      await r.getByTestId('gift-claim').click()
      assert((await pebbles()) === p0 + 3, 'Markt: Tagesgeschenk')
      await r.getByTestId('style-emberRed').getByRole('button').click()
      await r.getByTestId('style-equip-emberRed').click()
      assert((await r.evaluate(() => window.__engine.get().modules.market.equipped)) === 'emberRed', 'Talstil angelegt')
      const p1 = await pebbles()
      await r.getByTestId('offer-buy-pebbles50').click()
      assert((await pebbles()) === p1 + 50, 'Testkauf: 50 Lichtkiesel')
      assert((await r.getByTestId('wallet').getAttribute('data-spent')) === '99', 'Testgeld: 0,99 € gebucht')
      await r.getByTestId('tab-play').click()
      assert((await r.locator('.lw-map[data-style="emberRed"]').count()) === 1, 'Talstil auf der Karte')

      // Playtest-Log: in den Einstellungen einschalten, Tab-Wechsel landet im Log, Export-Knopf aktiv
      await r.getByTestId('menu').click()
      await r.getByTestId('menu-settings').click()
      await r.getByTestId('pref-playtest').check()
      await r.keyboard.press('Escape')
      await r.getByTestId('tab-market').click()
      await r.getByTestId('tab-play').click()
      await r.evaluate(() => window.dispatchEvent(new Event('pagehide')))
      const live = await r.evaluate(() => localStorage.getItem('lichtwarte-playtest-live-v1') ?? '')
      assert(live.includes('app.tab') && live.includes('session.start'), 'Playtest-Log zeichnet auf')
      await r.getByTestId('menu').click()
      await r.getByTestId('menu-settings').click()
      assert(await r.getByTestId('playtest-export').isEnabled(), 'Playtest-Export möglich')
      await r.keyboard.press('Escape')
      await r.getByTestId('menu').click()
      await r.getByTestId('menu-legal').click()
      assert((await r.getByTestId('legal-sheet').locator('a[href$="datenschutz.html"]').count()) === 1, 'Rechtliches verlinkt die Datenschutz-Seite')
      await r.keyboard.press('Escape')
      if (errs.length) throw new Error(errs.join('\n'))
      await w.close()
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
