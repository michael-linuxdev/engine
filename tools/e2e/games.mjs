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
    /** Kein ×10/Max im Ausbau-Fenster: eine Stufe je Tippen, Halten baut weiter. */
    holdToBuy: true,
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
      // Prolog (nur beim allerersten Start), danach schlägt sich die Chronik von selbst auf
      await q.getByTestId('intro').waitFor({ timeout: 10_000 })
      assert((await q.getByTestId('intro').innerText()).includes(T.intro.l1), 'Prolog beim ersten Start')
      await q.getByTestId('intro-start').click()
      await q.getByTestId('intro').waitFor({ state: 'detached' })
      await q.getByTestId('chronicle').waitFor({ timeout: 10_000 })
      assert(await q.getByText(T.chronicle.entries.welcome.title).isVisible(), 'erste Chronik-Seite öffnet sich')
      await q.keyboard.press('Escape')
      await q.getByTestId('chronicle').waitFor({ state: 'detached' })
      await q.getByTestId('ftue').waitFor()
      assert((await q.getByTestId('ftue').innerText()).includes(T.ftue.steps.build.title), 'Einstieg: Schritt Kräuterkate')
      await q.getByTestId('slot-kraeuterkate').click()
      await q.getByTestId('upgrade-sheet').waitFor()
      await q.getByTestId('buy-kraeuterkate').click()
      // Nach dem Kauf reicht das Geld nicht: Der Knopf zeigt als Ladebalken, wie weit es noch ist, darunter steht der fehlende Betrag
      const fill = Number(await q.getByTestId('buy-fill').getAttribute('data-ratio'))
      assert((await q.getByTestId('buy-kraeuterkate').isDisabled()) && fill >= 0 && fill < 100, `Ausbau-Knopf füllt sich als Ladebalken (${fill} %)`)
      assert((await q.getByTestId('buy-hint').innerText()).includes(T.currencies.glimmer), 'unter dem Knopf steht, wie viel noch fehlt')
      await q.keyboard.press('Escape')
      await q.getByTestId('ftue').getByText(T.ftue.steps.burst.title).waitFor()
      await q.getByTestId('burst').click()
      await q.getByTestId('ftue').getByText(T.ftue.steps.unlock.title).waitFor()
      await q.getByTestId('ftue-skip').click()
      assert(!(await q.getByTestId('ftue').isVisible().catch(() => false)), 'Einstieg lässt sich überspringen')
      // Gesperrtes Bauwerk: Die Bedingungen stehen als Checkliste da, das Fehlende ist erkennbar (hier: die Mondwende)
      await q.getByTestId('slot-schmiede').click()
      await q.getByTestId('gate-all').waitFor()
      assert((await q.getByTestId('gate-all').locator('li[data-ok="false"]').count()) >= 1, 'Freilegen: fehlende Bedingung ist markiert')
      assert((await q.getByTestId('gate-all').innerText()).includes(T.layers.moonturn.name), 'Freilegen: die Mondwende steht als Bedingung da')
      await q.keyboard.press('Escape')
      await q.getByTestId('upgrade-sheet').waitFor({ state: 'detached' })
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
      // Talgast auf der Karte: sichtbar neben dem Funkenruf, Antippen begrüßt, danach ist er fort (und kommt nicht sofort wieder)
      await r.evaluate(() => {
        const rt = window.__engine
        const s = rt.get()
        rt.replace({ ...s, modules: { ...s.modules, visitors: { ...s.modules.visitors, current: 'fox', until: Date.now() + 60_000, nextAt: 0 } } })
      })
      await r.getByTestId('guest-greet').click()
      assert((await r.evaluate(() => window.__engine.get().modules.visitors.seen.fox)) === 2, 'Talgast auf der Karte begrüßt')
      await r.waitForTimeout(600)
      assert((await r.getByTestId('guest-greet').count()) === 0 && (await r.evaluate(() => window.__engine.get().modules.visitors.current)) === '', 'Talgast bleibt nach dem Begrüßen fort')
      // Ausbau-Karte: klein über der Leiste, dunkelt die Kopfzeile nicht ab, Wisch nach unten schließt sie
      await r.getByTestId('slot-kraeuterkate').click()
      const card = await r.getByTestId('upgrade-sheet').boundingBox()
      // Die Karte ist nur so hoch wie ihr Inhalt und lässt die Zahl oben links frei
      const amount = await r.getByTestId('hud-amount').boundingBox()
      assert(card.y >= amount.y + amount.height, `Ausbau-Karte verdeckt die Zahl oben nicht (Karte ab ${Math.round(card.y)}, Zahl bis ${Math.round(amount.y + amount.height)})`)
      assert((await r.locator('.ek-sheet-backdrop--clear').count()) === 1, 'Ausbau-Karte dunkelt die Talkarte und die Kopfzeile nicht ab')
      // In der Karte wird nicht gescrollt, die Zweige sind immer sichtbar (nichts zum Aufklappen)
      const inner = await r.evaluate(() => {
        const b = document.querySelector('.ek-upgrade .ek-sheet__body')
        return { fits: b.scrollHeight <= b.clientHeight, overflow: getComputedStyle(b).overflowY }
      })
      assert(inner.fits && inner.overflow === 'hidden', `Ausbau-Karte scrollt nicht (${JSON.stringify(inner)})`)
      assert((await r.getByTestId('branch-efficiency').isVisible()) && (await r.locator('.ek-upgrade details').count()) === 0, 'Zweige sind immer aufgeklappt')
      const cdp = await w.newCDPSession(r)
      const sx = card.x + card.width / 2
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: sx, y: card.y + 20 }] })
      for (let i = 1; i <= 6; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: sx, y: card.y + 20 + i * 25 }] })
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      await r.getByTestId('upgrade-sheet').waitFor({ state: 'detached' })

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
      // Meisterschaft: Der Kauf, der den schwächsten Bereich auf Stufe 25 bringt, gibt den ersten Stern und 5 Lichtkiesel
      const pebblesBeforeStar = await r.evaluate(() => {
        const rt = window.__engine
        const s = rt.get()
        const areas = ['boardwalk', 'peatCut', 'reedHut', 'wispBridge', 'bogBirches', 'cottonMeadow', 'mistTower', 'bogSpring', 'dragonflyPond', 'peatBeacon']
        const owned = Object.fromEntries(areas.map((a) => [`moorgrund_${a}`, a === 'boardwalk' ? 24 : 25]))
        const moor = { ...s.modules.regions.regions.moorgrund, owned, balance: 1e15 }
        rt.replace({ ...s, modules: { ...s.modules, regions: { regions: { ...s.modules.regions.regions, moorgrund: moor } } } })
        return s.modules.wallet.balances.glowPebbles
      })
      await r.getByTestId('mastery').getByText(T.live.starNext('25', '9', '10')).waitFor()
      await r.getByTestId('area-buy-moorgrund_boardwalk').click()
      await r.getByTestId('mastery').getByText(T.live.starNext('50', '0', '10')).waitFor()
      assert((await r.evaluate(() => window.__engine.get().modules.wallet.balances.glowPebbles)) - pebblesBeforeStar >= 5, 'Meisterschaft: Stern belohnt')
      await r.keyboard.press('Escape')
      assert((await r.getByTestId('stars-moorgrund').getAttribute('data-stars')) === '1', 'Meisterschaft: Stern in der Lande-Liste')
      // Meilensteine der Schichten stehen im Neubeginn-Tab
      await r.getByTestId('tab-prestige').click()
      assert((await r.getByTestId('milestones-ages').getAttribute('data-reached')) === '0', 'Meilensteine des Zeitalters sichtbar')

      // Markt: Tagesgeschenk, Talstil kaufen und anlegen, Testkauf mit Testgeld
      await r.getByTestId('tab-market').click()
      // Die Seite selbst scrollt nie (kein Wandern des Hintergrunds hinter Fenstern); nur die Ansicht scrollt
      const scroll = await r.evaluate(() => {
        const main = document.getElementById('main')
        window.scrollTo(0, 500)
        main.scrollTop = 300
        return { page: window.scrollY, pageFits: document.documentElement.scrollHeight <= window.innerHeight, main: main.scrollTop, bodyFixed: getComputedStyle(document.body).position }
      })
      assert(scroll.page === 0 && scroll.pageFits && scroll.bodyFixed === 'fixed', `Seite scrollt nicht (${JSON.stringify(scroll)})`)
      assert(scroll.main > 0, 'die Ansicht selbst scrollt')
      await r.evaluate(() => (document.getElementById('main').scrollTop = 0))
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
      assert(await r.getByTestId('app-update').isVisible(), 'Einstellungen: „Jetzt aktualisieren“ vorhanden')
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
