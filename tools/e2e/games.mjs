/**
 * E2E-Konfiguration je Spiel. Die Tests selbst sind spielunabhängig (data-testid
 * aus @engine/ui); hier stehen nur Pfad, Präfix und spielspezifische Vorbereitung.
 */
/** Systeme jenseits der vier Tabs liegen als Kacheln im Menü. */
const viaMenu = async (p, id) => {
  await p.getByTestId('menu').click()
  await p.getByTestId(`menu-${id}`).click()
  await p.getByTestId('menu-sheet').waitFor({ state: 'detached' })
}

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
      // Das Archiv erscheint erst nach der ersten Mondwende: dafür einen solchen Stand setzen
      await p.evaluate(() => {
        const rt = window.__engine
        const s = rt.get()
        const layers = s.modules.prestige.layers.map((l, i) => (i === 0 ? { ...l, count: 1, sinceReset: 1 } : l))
        rt.replace({ ...s, modules: { ...s.modules, prestige: { layers }, wallet: { ...s.modules.wallet, balances: { ...s.modules.wallet.balances, runeShards: 100 }, earned: { ...s.modules.wallet.earned, runeShards: 100 } } } })
      })
      await p.getByTestId('tab-prestige').click()
      await p.getByTestId('ptab-layers').waitFor()
      await check('Mondwende-Tab')
      await p.getByTestId('ptab-jump-archive').click()
      await p.getByTestId('ptab-archive').waitFor()
      await check('Mondwende-Tab mit Archiv')
      await p.getByTestId('tab-play').click()
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
      // Das Rad nennt den Gewinn mit Namen und Wirkung und bietet dann „Weiter“ an
      if ((await p.getByTestId('wheel-result').locator('strong').innerText()).trim() === '') throw new Error('E2E: Sternenrad nennt den Gewinn')
      await p.getByTestId('wheel-done').click()
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
      // Prolog (nur beim allerersten Start), danach kommt gleich die erste Handlung: Der Einstieg zeigt auf die Kräuterkate.
      // Die Chronik schlägt sich erst auf, wenn die Kate steht (erst bauen, dann lesen).
      await q.getByTestId('intro').waitFor({ timeout: 10_000 })
      assert((await q.getByTestId('intro').innerText()).includes(T.intro.l1), 'Prolog beim ersten Start')
      await q.getByTestId('intro-start').click()
      await q.getByTestId('intro').waitFor({ state: 'detached' })
      await q.getByTestId('ftue').waitFor()
      assert((await q.getByTestId('chronicle').count()) === 0, 'vor dem ersten Bau bleibt die Chronik zu')
      assert((await q.getByTestId('ftue').innerText()).includes(T.ftue.steps.build.title), 'Einstieg: Schritt Kräuterkate')
      // Der Einstieg nennt den Schritt, hebt sein Ziel hervor und bietet die Aktion als Knopf an
      assert((await q.getByTestId('ftue-step').innerText()).includes('1'), 'Einstieg: „Schritt 1 von 6“')
      assert(await q.getByTestId('slot-kraeuterkate').evaluate((el) => el.classList.contains('ek-coach-target')), 'Einstieg: Ziel ist hervorgehoben')
      assert((await q.getByTestId('ftue-act').innerText()) === T.ftue.act.build, 'Einstieg: Aktions-Knopf')
      // Solange der Einstieg auf ein Bauwerk zeigt, schweigt die Ziel-Zeile: eine Ansage, nicht zwei
      assert((await q.getByTestId('goal').count()) === 0, 'Einstieg: keine zweite Ansage in der Ziel-Zeile')
      await q.getByTestId('slot-kraeuterkate').click()
      await q.getByTestId('upgrade-sheet').waitFor()
      await q.getByTestId('buy-kraeuterkate').click()
      // Nach dem Kauf reicht das Geld nicht: Der Knopf zeigt als Ladebalken, wie weit es noch ist, darunter steht der fehlende Betrag
      const fill = Number(await q.getByTestId('buy-fill').getAttribute('data-ratio'))
      assert((await q.getByTestId('buy-kraeuterkate').isDisabled()) && fill >= 0 && fill < 100, `Ausbau-Knopf füllt sich als Ladebalken (${fill} %)`)
      assert((await q.getByTestId('buy-hint').innerText()).includes(T.currencies.glimmer), 'unter dem Knopf steht, wie viel noch fehlt')
      await q.keyboard.press('Escape')
      // Die Kate steht, ihr Fenster ist zu: Jetzt öffnet sich die erste Chronik-Seite als Lohn
      await q.getByTestId('chronicle').waitFor({ timeout: 10_000 })
      assert(await q.getByText(T.chronicle.entries.welcome.title).isVisible(), 'erste Chronik-Seite öffnet sich nach dem ersten Bau')
      // Inhaltsverzeichnis: verschlossene Seiten nennen nur, wie sie sich öffnen; „Weiterlesen“ führt zurück
      await q.getByTestId('chronicle-contents').click()
      await q.getByTestId('chronicle-index').waitFor()
      assert((await q.getByTestId('toc-locked-holzlager').innerText()).includes(T.producers.holzlager.name), 'Chronik-Inhalt: Hinweis, wie die Seite aufgeht')
      // Buch 2 zeigt vor Jahr 2 nur, womit es beginnt, nicht seine vierzig verschlossenen Seiten
      assert((await q.getByTestId('toc-book-wayOfFires').innerText()).includes(T.chronicle.bookLocked.wayOfFires), 'Chronik-Inhalt: Buch 2 ist noch zu')
      assert((await q.getByTestId('toc-locked-highFirst').count()) === 0, 'Chronik-Inhalt: Seiten von Buch 2 bleiben verborgen')
      await q.getByTestId('chronicle-resume').click()
      // „Weiterlesen“ führt zur ersten ungelesenen Seite (die Kate steht schon: Ihre Seite ist inzwischen offen)
      await q.locator('article.lw-page').waitFor()
      assert((await q.getByTestId('chronicle-index').count()) === 0, 'Chronik: „Weiterlesen“ führt aus dem Inhalt zurück auf eine Seite')
      await q.keyboard.press('Escape')
      await q.getByTestId('chronicle').waitFor({ state: 'detached' })
      await q.getByTestId('ftue').getByText(T.ftue.steps.burst.title).waitFor()
      await q.getByTestId('burst').click()
      await q.getByTestId('ftue').getByText(T.ftue.steps.unlock.title).waitFor()
      await q.getByTestId('ftue-skip').click()
      assert(!(await q.getByTestId('ftue').isVisible().catch(() => false)), 'Einstieg lässt sich überspringen')
      // Karte und Kopfzeile: höchstens ein Pfeil (bester Kauf), der nächste gesperrte Platz zeigt Namen und Balken,
      // der Wächterrang ist sichtbar, und die Ziel-Zeile führt zum Bauwerk
      assert((await q.locator('[data-best="true"]').count()) <= 1, 'Karte: höchstens ein „bester Kauf“')
      assert((await q.getByTestId('slot-next').count()) === 1, 'Karte: genau der nächste gesperrte Platz zeigt den Balken')
      await q.getByTestId('hud-rank').click()
      await q.getByTestId('rank-sheet').waitFor()
      await q.keyboard.press('Escape')
      await q.getByTestId('rank-sheet').waitFor({ state: 'detached' })
      // Vor der ersten Mondwende nennt die Ziel-Zeile nur das Ziel: „Mondwende, Schmiede, Sternenrad“ wären hier lauter fremde Wörter.
      // Wer schon eine Mondwende gefeiert hat, liest darunter, was die nächste öffnet.
      assert((await q.getByTestId('goal-note').count()) === 0, 'Ziel-Zeile: vor der ersten Mondwende ohne Vorschau')
      await q.evaluate(() => {
        const rt = window.__engine
        const s = rt.get()
        window.__before = s
        rt.replace({ ...s, modules: { ...s.modules, prestige: { layers: s.modules.prestige.layers.map((l, i) => (i === 0 ? { ...l, count: 1, sinceReset: 1 } : l)) } } })
      })
      await q.getByTestId('goal-note').waitFor()
      assert((await q.getByTestId('goal-note').innerText()).trim().length > 0, 'Ziel-Zeile nennt nach der ersten Mondwende, was die nächste öffnet')
      await q.evaluate(() => window.__engine.replace(window.__before))
      await q.getByTestId('goal-note').waitFor({ state: 'detached' })
      await q.getByTestId('goal').click()
      await q.getByTestId('upgrade-sheet').waitFor()
      await q.keyboard.press('Escape')
      await q.getByTestId('upgrade-sheet').waitFor({ state: 'detached' })
      // Gesperrtes Bauwerk: Die Bedingungen stehen als Checkliste da, das Fehlende ist erkennbar (hier: die Mondwende)
      await q.getByTestId('slot-schmiede').click()
      await q.getByTestId('gate-all').waitFor()
      assert((await q.getByTestId('gate-all').locator('li[data-ok="false"]').count()) >= 1, 'Freilegen: fehlende Bedingung ist markiert')
      assert((await q.getByTestId('gate-all').innerText()).includes(T.layers.moonturn.name), 'Freilegen: die Mondwende steht als Bedingung da')
      await q.keyboard.press('Escape')
      await q.getByTestId('upgrade-sheet').waitFor({ state: 'detached' })
      // Der Markt ist von Anfang an da, das Archiv erst nach der ersten Mondwende; in den Einstellungen gibt es kein Zahlenformat mehr
      // Die Leiste hat genau vier Knöpfe (Tal, Mondwende, Markt, Menü); das Archiv gibt es noch nicht
      assert((await q.locator('.ek-tabbar .ek-tab').count()) === 4 && (await q.getByTestId('tab-market').count()) === 1, 'Leiste: vier Knöpfe, Markt ab Start')
      await q.getByTestId('tab-prestige').click()
      assert((await q.getByTestId('ptab-jump-archive').count()) === 0 && (await q.getByTestId('keeps-moonturn').count()) === 1, 'Mondwende-Tab: „Bleibt/Geht“ da, Archiv noch nicht')
      await q.getByTestId('tab-market').click()
      await q.getByTestId('card-gift').waitFor()
      assert((await q.getByTestId('ad-glimmer').count()) === 1, 'Bonus-Video: mit Ertrag gibt es die Glimmer-Wahl')
      // Ohne Ertrag wäre der Bonus „0 Glimmer“ wert: Der Knopf fehlt dann, und die Karte sagt warum
      const bare = await browser.newContext(phone)
      const z = await bare.newPage()
      await z.goto(URL + '?installGate=0')
      await z.getByTestId('intro-start').click()
      await z.getByTestId('intro').waitFor({ state: 'detached' })
      // Ein frischer Stand hat seit dem Abgleich schon Ertrag (die erste Kate steht): für diese Regel einen Stand ohne Bauwerk setzen
      await z.evaluate(() => {
        const rt = window.__engine
        const s = rt.get()
        rt.replace({ ...s, modules: { ...s.modules, producers: { owned: {} } } })
      })
      await z.getByTestId('tab-market').click()
      await z.getByTestId('ad-none').waitFor()
      assert((await z.getByTestId('ad-glimmer').count()) === 0 && (await z.getByTestId('ad-pebbles').count()) === 0, 'Bonus-Video: ohne Ertrag kein Knopf mit 0 Glimmer, und keine Kiesel-Wahl mehr')
      await bare.close()
      await q.getByTestId('tab-play').click()
      await q.getByTestId('menu').click()
      await q.getByTestId('menu-settings').click()
      assert((await q.getByTestId('numbers-scientific').count()) === 0 && (await q.getByTestId('pref-bigtext').count()) === 1, 'Einstellungen aufgeräumt')
      await q.keyboard.press('Escape')
      await q.getByTestId('settings-sheet').waitFor({ state: 'detached' })
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
      await viaMenu(r, 'watch')
      await r.getByTestId('daily-claim').click()
      assert(await r.getByTestId('daily-claim').isDisabled(), 'Wachrunde nur einmal am Tag')
      await r.getByTestId('card-fest').getByRole('heading', { name: T.watch.fests.budding.name }).waitFor()
      // Fest: wie lange es läuft, wie man Marken verdient, welches Fest folgt; offene Aufträge zeigen einen Prozent-Ring und ihre Belohnung
      assert((await r.getByTestId('fest-ends').count()) === 1 && (await r.getByTestId('fest-earn').count()) === 1 && (await r.getByTestId('fest-next').count()) === 1, 'Fest: Ende, Marken-Liste, nächstes Fest')
      // Jahrgang 2 (neue Sorte, neues Schmuckstück) steht erst im Laden, wenn die Hochlande offen sind
      assert((await r.getByTestId('fest-item-variety_buddingSeed').count()) === 1 && (await r.getByTestId('fest-item-variety_buddingWhistle').count()) === 0 && (await r.getByTestId('fest-item-decor_budPole').count()) === 0, 'Fest-Laden: Jahrgang 2 bleibt im ersten Jahr verborgen')
      // Welche Aufträge heute dran sind, hängt vom Tag ab: An manchen Tagen sind nach dem Aufbau oben schon alle drei fertig.
      // Geprüft wird deshalb die Regel selbst: jeder offene Auftrag zeigt einen Ring, kein offener einen Knopf.
      const quests = r.getByTestId('card-quests')
      const openQuests = await quests.locator('li[data-state="open"]').count()
      assert((await quests.locator('li[data-state]').count()) === 3, 'Aufträge: drei am Tag')
      assert((await quests.getByTestId('ring').count()) === openQuests && (await quests.locator('li[data-state="open"] button').count()) === 0, 'Aufträge: Prozent-Ring statt totem Knopf')
      assert((await r.getByTestId('card-quests').locator('[data-testid^="quest-reward-"]').count()) >= 1, 'Aufträge nennen ihre Belohnung')
      await r.getByTestId('deed-firstLight').waitFor()
      // Die Prüfungen und das Archiv stehen im Mondwende-Tab, jedes als eigener Reiter (eine kurze Seite statt elf Bildschirme)
      await r.getByTestId('tab-prestige').click()
      assert((await r.getByTestId('ptab-jump-layers').getAttribute('aria-selected')) === 'true' && (await r.getByTestId('ptab-archive').count()) === 0, 'Mondwende-Tab öffnet auf der Mondwende selbst')
      await r.getByTestId('ptab-jump-trials').click()
      await r.getByTestId('card-trials').waitFor()
      assert((await r.getByTestId('ptab-jump-trials').getAttribute('aria-selected')) === 'true', 'Reiter „Prüfungen“ ist als aktiv markiert')
      await r.getByTestId('ptab-jump-archive').click()
      await r.getByTestId('ptab-archive').waitFor()
      assert((await r.getByTestId('card-trials').count()) === 0, 'je Reiter eine Seite')
      await viaMenu(r, 'watch')
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
      await viaMenu(r, 'world')
      await r.getByTestId('card-collection').waitFor()
      // Sammlung: Gesamtstand in Prozent; Unbekanntes nennt, was es bringt; der Kessel zeigt alle Rezepte
      assert((await r.getByTestId('collection-total').innerText()).includes('%'), 'Sammlung: Gesamtstand in Prozent')
      assert((await r.getByTestId('recipes').count()) === 1, 'Kessel: Rezeptliste')
      await r.getByTestId('brew-a').selectOption('moonsage')
      await r.getByTestId('brew-b').selectOption('dewcup')
      await r.getByTestId('brew').click()
      assert((await r.evaluate(() => window.__engine.get().modules.combine.recipe)) === 'glowTea', 'Alchemie: Rezept braut')
      await r.getByTestId('decor-blueBanner').getByRole('button').click()
      // Fernfahrten: ein Greif fliegt los, kommt nach seiner Zeit zurück und bringt etwas mit; die erste Fahrt öffnet eine Chronik-Seite
      await r.evaluate(() => {
        const rt = window.__engine
        const s = rt.get()
        rt.replace({ ...s, modules: { ...s.modules, featureUnlocks: { unlocked: [...new Set([...s.modules.featureUnlocks.unlocked, 'voyages'])] } } })
      })
      await r.getByTestId('voyage-send-moorPost').click()
      await r.getByTestId('voyage-running').waitFor()
      assert(await r.getByTestId('voyage-send-passLetters').isDisabled(), 'Fernfahrten: nur eine zur Zeit, spätere erst nach abgeschlossenen')
      await r.evaluate(() => {
        const rt = window.__engine
        const s = rt.get()
        rt.replace({ ...s, modules: { ...s.modules, voyages: { ...s.modules.voyages, until: Date.now() - 1000 } } })
      })
      await r.getByTestId('voyage-collect').click()
      assert((await r.evaluate(() => window.__engine.get().modules.voyages.done)) === 1, 'Fernfahrt abgeschlossen und gezählt')
      await r.getByTestId('toast').filter({ hasText: T.world.voyages.moorPost.name }).waitFor()
      // Schmuck wird auf der Karte selbst aufgestellt: Platz antippen, Stück wählen, „Fertig“ führt zurück
      await r.getByTestId('decor-edit').click()
      await r.getByTestId('decor-bar').waitFor()
      await r.getByTestId('decor-spot-0').click()
      await r.getByTestId('decor-put-blueBanner').click()
      assert((await r.evaluate(() => window.__engine.get().modules.decor.placed[0])) === 'blueBanner', 'Banner aufgestellt')
      assert((await r.locator('[data-decor="blueBanner"]').count()) === 1, 'Banner steht sofort auf der Karte')
      await r.getByTestId('decor-done').click()
      await r.getByTestId('world-view').waitFor()
      // Der Talgast hat keine Meldung mehr: Er wird auf der Karte selbst angetippt (weiter unten)
      assert((await r.getByTestId('visitor-greet').count()) === 0 && (await r.getByTestId('chip-visitor').count()) === 0, 'keine Meldung zum Talgast')
      // Omen und Randnotizen gehören zur Karte: Außerhalb bleibt die Kopfzeile schlank
      assert(!(await r.getByTestId('chip-omen').isVisible().catch(() => false)), 'Omen-Marke nur auf der Karte')
      await r.getByTestId('tab-play').click()
      await r.getByTestId('chip-omen').click()
      await r.getByTestId('omen-safe').click()
      assert((await r.evaluate(() => window.__engine.get().modules.choiceEvents.active)) === true, 'Omen gewählt')
      assert((await r.locator('[data-decor="blueBanner"]').count()) === 1, 'Banner auf der Talkarte')
      // Talgast auf der Karte: sichtbar neben dem Funkenruf, Antippen begrüßt, danach ist er fort (und kommt nicht sofort wieder)
      await r.evaluate(() => {
        const rt = window.__engine
        const s = rt.get()
        rt.replace({ ...s, modules: { ...s.modules, visitors: { ...s.modules.visitors, current: 'fox', until: Date.now() + 60_000, nextAt: 0 } } })
      })
      assert((await r.locator('[data-guest="fox"]').count()) === 1, 'der Fuchs ist als Fuchs zu sehen')
      await r.getByTestId('guest-greet').click()
      assert((await r.evaluate(() => window.__engine.get().modules.visitors.seen.fox)) === 1, 'Talgast auf der Karte begrüßt')
      await r.getByTestId('guest-thanks').waitFor()
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
      // Beim Ziehen folgt die Karte sichtbar dem Finger und verblasst (auch gegen die Einblend-Animation des Spiels)
      const pulled = await r.evaluate(() => {
        const el = document.querySelector('[data-testid="upgrade-sheet"]')
        return { y: el.getBoundingClientRect().y, opacity: Number(getComputedStyle(el).opacity) }
      })
      assert(pulled.y > card.y + 100 && pulled.opacity < 0.9, `Karte folgt dem Wisch und verblasst (${JSON.stringify(pulled)}, Start ${card.y})`)
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      await r.getByTestId('upgrade-sheet').waitFor({ state: 'detached' })

      // Ein wartender Korb unter 5 Minuten (etwa nach „Später“): kein Fenster, nur ein Einsammeln-Knopf auf der Karte.
      // Eine frische Abwesenheit unter 5 Minuten wird sofort gutgeschrieben (Engine-Test), sie macht keinen Korb mehr.
      await r.getByTestId('tab-play').click()
      await r.evaluate(() => {
        const rt = window.__engine
        const s = rt.get()
        rt.replace({ ...s, modules: { ...s.modules, offline: { pending: { gained: 500, elapsedMs: 60_000, capped: false, at: Date.now() }, claims: 0 } } })
      })
      await r.getByTestId('map-collect').waitFor()
      assert((await r.getByTestId('welcome-back').count()) === 0, 'Rückkehr: unter 5 Minuten kein Fenster')
      await r.getByTestId('map-collect').click()
      assert((await r.evaluate(() => window.__engine.get().modules.offline.pending)) === null, 'Rückkehr: Knopf auf der Karte sammelt ein')
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
      // Ab der ersten Langen Nacht stehen die Lande in der Leiste (fünf Knöpfe), nicht mehr im Menü
      await r.getByTestId('tab-realms').waitFor()
      assert((await r.locator('.ek-tabbar .ek-tab').count()) === 5, 'Leiste: fünf Knöpfe, sobald die Lande offen sind')
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
      // Jahr 2: Mit dem ersten Hochland öffnet sich die Feuerstraße; ein Feuer braucht einen Stern auf beiden Seiten
      await r.evaluate((areas) => {
        const rt = window.__engine
        const s = rt.get()
        const full = (id) => ({ open: true, owned: Object.fromEntries(areas[id].map((a) => [`${id}_${a}`, 25])), balance: 0, grow: 0, thrift: 0, introSeen: true, openedAt: Date.now() })
        const regions = { ...s.modules.regions.regions, himmelswarte: full('himmelswarte'), hohesMoor: full('hohesMoor') }
        rt.replace({ ...s, modules: { ...s.modules, regions: { regions }, wallet: { ...s.modules.wallet, balances: { ...s.modules.wallet.balances, glowPebbles: 300 } } } })
        // Systeme öffnen sich beim nächsten Ereignis
        rt.dispatch('producers', 'buy', { id: 'kraeuterkate', count: 1 })
      }, { himmelswarte: Object.keys(T.realms.lands.himmelswarte.areas), hohesMoor: Object.keys(T.realms.lands.hohesMoor.areas) })
      await r.getByTestId('card-links').waitFor()
      // Die Lande-Liste ist nach Wellen gegliedert; die neueste steht offen, ältere sind zugeklappt
      assert(await r.getByTestId('realm-hohesMoor').isVisible(), 'Lande: die neueste Welle steht offen')
      assert(!(await r.getByTestId('realm-moorgrund').isVisible().catch(() => false)), 'Lande: ältere Wellen sind zugeklappt')
      await r.getByTestId('link-light-road_hohesMoor').click()
      assert((await r.getByTestId('link-road_hohesMoor').getAttribute('data-level')) === '1', 'Feuerstraße: erstes Feuer entzündet')
      assert((await r.getByTestId('links-total').innerText()).includes('3'), 'Feuerstraße: +3 % Ertrag (Stufe und Kette)')
      // Beide Lande haben einen Stern: Stufe 2 geht, Stufe 3 braucht zwei Sterne
      await r.getByTestId('link-light-road_hohesMoor').click()
      assert((await r.getByTestId('link-road_hohesMoor').getAttribute('data-level')) === '2', 'Feuerstraße: zweite Stufe mit einem Stern')
      assert(await r.getByTestId('link-light-road_hohesMoor').isDisabled(), 'Feuerstraße: Stufe 3 braucht zwei Sterne')
      assert((await r.getByTestId('link-road_hohesMoor').innerText()).includes(T.world.roadNeed[3]), 'Feuerstraße: nennt, was für die nächste Stufe fehlt')
      // Buch 2 beginnt: Das erste Hochland und das erste Feuer schreiben je eine Seite
      await r.getByTestId('hud-chronicle').click()
      await r.getByTestId('chronicle-contents').click()
      await r.getByTestId('toc-highFirst').waitFor()
      await r.getByTestId('toc-roadFirst').waitFor()
      assert((await r.getByTestId('toc-locked-highSaddle').innerText()).includes('3'), 'Chronik: Die nächste Seite von Buch 2 nennt ihre Bedingung')
      await r.getByTestId('toc-highFirst').click()
      assert(await r.getByTestId('chronicle-highFirst').getByText(T.chronicle.entries.highFirst.title).isVisible(), 'Chronik: erste Seite von Buch 2')
      await r.keyboard.press('Escape')
      await r.getByTestId('chronicle').waitFor({ state: 'detached' })
      // Jahr 3: Mit dem ersten Küstenland öffnet sich die Himmelskarte; ein Stern kostet Nachttau und Zeit, das nächste Sternbild bleibt verdeckt
      await r.evaluate((areas) => {
        const rt = window.__engine
        const s = rt.get()
        const land = { open: true, owned: Object.fromEntries(areas.map((a) => [`langerAbstieg_${a}`, 1])), balance: 0, grow: 0, thrift: 0, introSeen: true, openedAt: Date.now() }
        rt.replace({ ...s, modules: { ...s.modules, regions: { regions: { ...s.modules.regions.regions, langerAbstieg: land } }, wallet: { ...s.modules.wallet, balances: { ...s.modules.wallet.balances, nightDew: 30 } } } })
        rt.dispatch('producers', 'buy', { id: 'kraeuterkate', count: 1 })
      }, Object.keys(T.realms.lands.langerAbstieg.areas))
      await r.getByTestId('card-chart').waitFor()
      await r.getByTestId('chart-mark-ladder').click()
      assert((await r.getByTestId('chart-ladder').getAttribute('data-marked')) === '1', 'Himmelskarte: erster Stern eingetragen')
      // Nachttau ist genug da: Die Sternwarte braucht nach jedem Stern Zeit, bis der nächste eingetragen werden kann
      assert((await r.getByTestId('chart-mark-ladder').isDisabled()) && (await r.getByTestId('chart-wait').isVisible()), 'Himmelskarte: nach einem Stern heißt es warten')
      assert((await r.getByTestId('chart-key').innerText()).includes(T.realms.lands.salzterrassen.name) && (await r.getByTestId('chart-mark-key').count()) === 0, 'Himmelskarte: Das nächste Sternbild nennt nur, von wo es sich zeigt')
      // Jahr 4: Mit der Schulinsel öffnet sich die Wächterschule; ein ausgebildeter Lehrling bekommt ein Land und baut dort von selbst
      await r.evaluate((areas) => {
        const rt = window.__engine
        const s = rt.get()
        const land = { open: true, owned: Object.fromEntries(areas.map((a) => [`schulinsel_${a}`, 1])), balance: 1e12, grow: 0, thrift: 0, introSeen: true, openedAt: Date.now() }
        rt.replace({ ...s, modules: { ...s.modules, regions: { regions: { ...s.modules.regions.regions, schulinsel: land } }, stewards: { trained: 1, until: 0, posts: [''], workedAt: Date.now() - 3_600_000 } } })
        rt.dispatch('producers', 'buy', { id: 'kraeuterkate', count: 1 })
      }, Object.keys(T.realms.lands.schulinsel.areas))
      await r.getByTestId('card-stewards').waitFor()
      // Die früheren Systeme (Himmelskarte, Feuerstraße) sind jetzt eingeklappt
      assert((await r.getByTestId('systems-earlier').count()) === 1 && !(await r.getByTestId('card-chart').isVisible().catch(() => false)), 'Lande: frühere Systeme sind eingeklappt')
      await r.getByTestId('steward-post-0').click()
      await r.getByTestId('steward-to-schulinsel').click()
      assert((await r.getByTestId('steward-0').getAttribute('data-post')) === 'schulinsel', 'Wächterschule: Lehrling hat seinen Posten')
      await r.waitForFunction(() => Object.values(window.__engine.get().modules.regions.regions.schulinsel.owned).some((n) => n > 1), null, { timeout: 5000 })
      // Jahr 5: Das Große Leuchtfeuer nimmt je Stufe von jedem Land einmal; „Alle fragen“ sammelt ein
      await r.evaluate((areas) => {
        const rt = window.__engine
        const s = rt.get()
        const land = { open: true, owned: Object.fromEntries(areas.map((a) => [`offenesMeer_${a}`, 5])), balance: 1e30, grow: 0, thrift: 0, introSeen: true, openedAt: Date.now() }
        const regions = Object.fromEntries(Object.entries(s.modules.regions.regions).map(([id, x]) => [id, x.open ? { ...x, balance: 1e30 } : x]))
        rt.replace({ ...s, modules: { ...s.modules, regions: { regions: { ...regions, offenesMeer: land } } } })
        rt.dispatch('producers', 'buy', { id: 'kraeuterkate', count: 1 })
      }, Object.keys(T.realms.lands.offenesMeer.areas))
      await r.getByTestId('card-monument').waitFor()
      await r.getByTestId('monument-give').click()
      const given = await r.evaluate(() => window.__engine.get().modules.monument.given.length)
      assert(given >= 3, `Großes Leuchtfeuer: mehrere Lande haben gegeben (${given})`)
      assert(await r.getByTestId('monument-give').isDisabled(), 'Großes Leuchtfeuer: jedes Land gibt nur einmal je Stufe')
      // Bücher 4 und 5: Die Schulinsel, der erste Lehrling und sein Posten sowie das Offene Meer haben je eine Seite geschrieben
      await r.getByTestId('hud-chronicle').click()
      await r.getByTestId('chronicle-contents').click()
      for (const id of ['isleSchool', 'trainedFirst', 'postedFirst', 'rimOpenSea']) await r.getByTestId(`toc-${id}`).waitFor()
      assert((await r.getByTestId('toc-locked-stageOne').count()) === 1, 'Chronik: Die Seite der ersten Stufe des Leuchtfeuers ist noch zu')
      await r.getByTestId('toc-rimOpenSea').click()
      assert(await r.getByTestId('chronicle-rimOpenSea').getByText(T.chronicle.entries.rimOpenSea.title, { exact: true }).isVisible(), 'Chronik: erste Seite von Buch 5')
      await r.keyboard.press('Escape')
      await r.getByTestId('chronicle').waitFor({ state: 'detached' })
      // Steht die letzte Stufe, wird das Feuer genährt: kostet Lichtkiesel, zählt hoch und ruht dann
      await r.evaluate(() => {
        const rt = window.__engine
        const s = rt.get()
        rt.replace({ ...s, modules: { ...s.modules, monument: { stage: 30, given: [], readyAt: 0, tended: 0 }, wallet: { ...s.modules.wallet, balances: { ...s.modules.wallet.balances, glowPebbles: 1000 } } } })
        rt.dispatch('producers', 'buy', { id: 'kraeuterkate', count: 1 })
      })
      await r.getByTestId('monument-tend').click()
      await r.getByTestId('monument-tend-wait').waitFor()
      const fed = await r.evaluate(() => ({ n: window.__engine.get().modules.monument.tended, pebbles: window.__engine.get().modules.wallet.balances.glowPebbles }))
      assert(fed.n === 1 && fed.pebbles === 700, `Großes Leuchtfeuer: Nähren kostet 300 Lichtkiesel und zählt (${JSON.stringify(fed)})`)
      // Meilensteine der Schichten stehen im Neubeginn-Tab
      await r.getByTestId('tab-prestige').click()
      assert((await r.getByTestId('milestones-ages').getAttribute('data-reached')) === '0', 'Meilensteine des Zeitalters sichtbar')

      // Vorräte-Fenster: liegt über der Leiste, und der Text bricht in der Kachel um (er lief auf dem Handy hinaus)
      await r.getByTestId('hud-purse').click()
      await r.getByTestId('purse-sheet').waitFor()
      const purse = await r.evaluate(() => {
        const sheet = document.querySelector('[data-testid="purse-sheet"]')
        const rows = [...sheet.querySelectorAll('.ek-row__main span')]
        return { inApp: sheet.parentElement.parentElement.classList.contains('ek-app'), wraps: rows.every((x) => x.scrollWidth <= x.clientWidth + 1 && x.getBoundingClientRect().right <= innerWidth), bottom: sheet.getBoundingClientRect().bottom, vh: innerHeight }
      })
      assert(purse.inApp && purse.wraps && purse.bottom <= purse.vh + 1, `Vorräte-Fenster vollständig und umbrochen (${JSON.stringify(purse)})`)
      await r.keyboard.press('Escape')
      await r.getByTestId('purse-sheet').waitFor({ state: 'detached' })
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
      // Was wartet, lässt sich schon im Tal mit einem Tipp einsammeln: Das Tagesgeschenk steht dort als Marke
      await r.getByTestId('tab-play').click()
      await r.getByTestId('pill-gift').click()
      assert((await pebbles()) === p0 + 3, 'Tal: Tagesgeschenk über die Marke eingesammelt')
      await r.getByTestId('pill-gift').waitFor({ state: 'detached' })
      await r.getByTestId('tab-market').click()
      assert(await r.getByTestId('gift-claim').isDisabled(), 'Markt: Tagesgeschenk ist danach abgeholt')
      // Jede Belohnung meldet sich: eine Meldung und die Gutschrift als aufsteigende Zahl
      await r.getByTestId('toast').filter({ hasText: T.fx.gift }).waitFor()
      await r.getByTestId('fx-float').filter({ hasText: T.currencies.glowPebbles }).last().waitFor()
      // Der Kiesel-Stand steht oben, die vier Regale sind Unterreiter; der zuletzt offene bleibt gemerkt
      assert((await r.getByTestId('market-balance').innerText()).includes(T.currencies.glowPebbles), 'Markt: Lichtkiesel-Stand steht oben')
      await r.getByTestId('market-tab-styles').click()
      // Vor dem Kauf lässt sich ein Stil auf der Karte ansehen; die Vorschau führt zurück zum Markt und kauft nichts
      await r.getByTestId('style-look-emberRed').click()
      await r.getByTestId('style-preview').waitFor()
      assert((await r.locator('.lw-map[data-style="emberRed"]').count()) === 1 && (await r.evaluate(() => window.__engine.get().modules.market.owned.includes('emberRed'))) === false, 'Stil-Vorschau zeigt den Stil, ohne ihn zu kaufen')
      await r.getByTestId('style-preview').click()
      await r.getByTestId('style-buy-emberRed').click()
      await r.getByTestId('style-equip-emberRed').click()
      assert((await r.evaluate(() => window.__engine.get().modules.market.equipped)) === 'emberRed', 'Talstil angelegt')
      // Testkauf: Der erste Tipp bucht nichts ab, erst die Antwort „Ja, kaufen“
      const p1 = await pebbles()
      await r.getByTestId('market-tab-offers').click()
      await r.getByTestId('offer-buy-pebbles50').click()
      await r.getByTestId('testbuy-sheet').waitFor()
      // Das Fenster liegt über der Leiste unten: Seine Knöpfe sind sichtbar und treffbar (auf dem Handy lagen sie dahinter)
      const ask = await r.evaluate(() => {
        const b = document.querySelector('[data-testid="testbuy-yes"]').getBoundingClientRect()
        const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2)
        return { inApp: !!document.querySelector('.ek-app > .ek-sheet-backdrop [data-testid="testbuy-sheet"]'), hit: hit?.closest('[data-testid]')?.getAttribute('data-testid'), bottom: b.bottom, vh: innerHeight }
      })
      assert(ask.inApp && ask.hit === 'testbuy-yes' && ask.bottom <= ask.vh, `Testkauf-Knopf ist frei sichtbar (${JSON.stringify(ask)})`)
      assert((await r.evaluate(() => getComputedStyle(document.querySelector('.ek-app')).userSelect)) === 'none', 'Text lässt sich nicht markieren')
      assert((await pebbles()) === p1 && (await r.getByTestId('wallet').getAttribute('data-spent')) === '0', 'Testkauf fragt erst nach')
      await r.getByTestId('testbuy-no').click()
      await r.getByTestId('testbuy-sheet').waitFor({ state: 'detached' })
      assert((await pebbles()) === p1, 'Testkauf: „Eher nicht“ bucht nichts')
      await r.getByTestId('offer-buy-pebbles50').click()
      await r.getByTestId('testbuy-yes').click()
      await r.getByTestId('offer-bought').waitFor()
      assert((await pebbles()) === p1 + 50, 'Testkauf: 50 Lichtkiesel')
      assert((await r.getByTestId('wallet').getAttribute('data-spent')) === '99', 'Testgeld: 0,99 € gebucht')
      // „Ohne Werbung“: Der Bonus bleibt und kommt sofort, ohne Video
      await r.getByTestId('offer-buy-removeAds').click()
      await r.getByTestId('testbuy-yes').click()
      await r.getByTestId('market-tab-free').click()
      const adsBefore = await r.evaluate(() => window.__engine.get().core.primary)
      await r.getByTestId('ad-glimmer').click()
      assert((await r.getByTestId('ad-overlay').count()) === 0 && (await r.evaluate(() => window.__engine.get().core.primary)) > adsBefore, 'Ohne Werbung: Bonus sofort')
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
