/**
 * Smoke-Test je Spiel und Sprache: node tools/e2e/smoke.mjs <spiel> <de|en>
 *  1. Neustart, Erzeuger kaufen, Mengenkauf ×10, Funken/Burst
 *  2. Offline-Rückkehr mit vorgespultem lastSeen → Rückkehr-Korb einsammeln
 *  3. Prestige-Schicht 1 an der Schwelle, danach im Meta-Laden kaufen
 *  4. Sicherungscode: erzeugen, in frischem Browser einspielen
 *  5. Sprachwechsel live (ohne Neuladen), Wahl übersteht Neuladen, ?lang= hat Vorrang
 *  6. Escape schließt das oberste Fenster
 *  7. Install-Gate auf dem Handy (?installGate=1), Testphasen-Hinweis (?testPhase=1)
 * Bricht bei jedem Seitenfehler ab. Voraussetzung: npm run build.
 */
import { devices } from 'playwright'
import { assert, esc, launch, loadGameBundle, serve } from './lib.mjs'
import { gameBySlug } from './games.mjs'

const [slug = 'vorlage', lang = 'de'] = process.argv.slice(2)
const G = gameBySlug(slug)
const B = await loadGameBundle(G.dir)
const T = lang === 'en' ? B.en : B.de
const other = lang === 'en' ? B.de : B.en
const def = B.G.game
const E = B.E
const server = await serve('dist', 4300 + Math.floor(Math.random() * 400))
const URL = server.url + G.path
const errors = []
const phone = { ...devices['iPhone 13'], reducedMotion: 'reduce', locale: lang === 'en' ? 'en-US' : 'de-DE' }

/** Gespeicherter Stand für einen Abschnitt (Spielstand per localStorage vor dem Laden). */
function seed(mutate) {
  const clock = E.createManualClock(Date.now())
  let s = E.createState(def, clock)
  s = mutate(s, clock) ?? s
  return E.serializeState(def, s, Date.now())
}

async function page(browser, save, extra = {}) {
  const ctx = await browser.newContext({ ...phone, ...extra })
  await ctx.addInitScript(
    ([key, save, intro]) => {
      if (sessionStorage.getItem('seeded')) return
      sessionStorage.setItem('seeded', '1')
      if (save) localStorage.setItem(key, save)
      for (const [k, v] of Object.entries(intro)) localStorage.setItem(k, v)
    },
    [def.saveKey, save, G.skipIntro],
  )
  const p = await ctx.newPage()
  p.on('pageerror', (e) => errors.push(e.message))
  return { ctx, p }
}

async function openBuy(p, id) {
  const btn = p.getByTestId(`buy-${id}`)
  if (!(await btn.isVisible().catch(() => false))) await p.getByTestId(`slot-${id}`).click()
  await btn.waitFor()
  return btn
}

let browser
try {
  browser = await launch()
  const first = def.producers[0].id
  const layer = def.prestigeLayers[0].id

  // 1 — Neustart, Kaufen, Mengenkauf, Burst
  {
    const { ctx, p } = await page(browser, null)
    await p.goto(URL + '?installGate=0')
    await p.getByTestId('hud-amount').waitFor({ timeout: 15_000 })
    const buy = await openBuy(p, first)
    await buy.click()
    await p.waitForFunction(() => window.__engine.get().modules.producers.owned[Object.keys(window.__engine.get().modules.producers.owned)[0]] >= 1)
    // Ein Ausbau-Fenster (Karten-Spiele) wieder schließen
    if (await p.getByTestId('upgrade-sheet').isVisible().catch(() => false)) {
      await p.keyboard.press('Escape')
      await p.getByTestId('upgrade-sheet').waitFor({ state: 'detached' })
    }
    const before = await p.getByTestId('hud-amount').innerText()
    await p.getByTestId('burst').click()
    await p.waitForTimeout(300)
    // Burst bei kleinem Ertrag: Ladung wurde verbraucht
    const charges = await p.evaluate(() => window.__engine.get().modules.burst.charges)
    assert(charges === def.balance.burst.maxCharges - 1, `Burst verbraucht eine Ladung (${charges})`)
    void before
    await ctx.close()
  }
  {
    const save = seed((s) => ({ ...s, core: { ...s.core, primary: 1e6 } }))
    const { ctx, p } = await page(browser, save)
    await p.goto(URL + '?installGate=0')
    await p.getByTestId('hud-amount').waitFor()
    await openBuy(p, first)
    await p.getByTestId('buymode-10').click()
    await p.getByTestId(`buy-${first}`).click()
    const n = await p.evaluate((id) => window.__engine.get().modules.producers.owned[id], first)
    assert(n === 10, `Mengenkauf ×10 (${n})`)
    await ctx.close()
  }

  // 2 — Offline-Rückkehr
  {
    const save = seed((s) => {
      const t = { ...s, modules: { ...s.modules, producers: { owned: { [first]: 20 } } } }
      return { ...t, core: { ...t.core, lastSeen: Date.now() - 2 * 3_600_000 } }
    })
    const { ctx, p } = await page(browser, save)
    await p.goto(URL + '?installGate=0')
    await p.getByTestId('welcome-back').waitFor({ timeout: 10_000 })
    assert(await p.getByText(new RegExp(esc(T.welcome.title))).first().isVisible(), 'Rückkehr-Titel in der Sprache')
    const before = await p.evaluate(() => window.__engine.get().core.primary)
    await p.getByTestId('welcome-claim').click()
    const after = await p.evaluate(() => window.__engine.get().core.primary)
    assert(after > before + 1000, `Rückkehr-Korb gutgeschrieben (${before} → ${after})`)
    await ctx.close()
  }

  // 3 — Prestige + Meta-Laden
  {
    const l0 = def.prestigeLayers[0]
    const gate = l0.probe ? l0.probe.gate : l0.gate.base
    const save = seed((s) => {
      const owned = {}
      def.producers.slice(0, 4).forEach((p) => (owned[p.id] = 30))
      const layers = s.modules.prestige.layers.map((x, i) => (i === 0 ? { ...x, runEarned: gate * 1.5 } : x))
      return { ...s, core: { ...s.core, primaryRun: gate * 1.5 }, modules: { ...s.modules, producers: { owned }, prestige: { layers } } }
    })
    const { ctx, p } = await page(browser, save)
    await p.goto(URL + '?installGate=0')
    await p.getByTestId('tab-prestige').click()
    const btn = p.getByTestId(`prestige-${layer}`)
    assert(await btn.isEnabled(), 'Prestige an der Schwelle möglich')
    await btn.click()
    if (G.afterPrestige) await G.afterPrestige(p)
    const count = await p.evaluate(() => window.__engine.get().modules.prestige.layers[0].count)
    assert(count === 1, 'Prestige gezählt')
    await p.getByTestId('tab-shop').click()
    const item = def.metaShop.find((i) => i.unlock?.tip)
    const metaBtn = p.getByTestId(`meta-buy-${item.id}`)
    assert(await metaBtn.isEnabled(), `Meta-Gegenstand ${item.id} kaufbar`)
    await metaBtn.click()
    const rank = await p.evaluate((id) => window.__engine.get().modules.metaShop.ranks[id], item.id)
    assert(rank === 1, 'Meta-Kauf gezählt')
    await ctx.close()
  }

  // 4 — Sicherungscode
  let code
  {
    const save = seed((s) => ({ ...s, core: { ...s.core, primary: 4242 }, modules: { ...s.modules, producers: { owned: { [first]: 7 } } } }))
    const { ctx, p } = await page(browser, save)
    await p.goto(URL + '?installGate=0')
    await p.getByTestId('menu').click()
    await p.getByTestId('menu-save').click()
    code = await p.getByTestId('save-code').inputValue()
    assert(code.startsWith(G.backupPrefix), 'Sicherungscode mit Präfix')
    await ctx.close()
  }
  {
    const { ctx, p } = await page(browser, null)
    await p.goto(URL + '?installGate=0')
    await p.getByTestId('menu').click()
    await p.getByTestId('menu-save').click()
    await p.getByTestId('save-import').fill(code)
    await p.getByTestId('save-restore').click()
    await p.waitForFunction((id) => window.__engine?.get().modules.producers.owned[id] === 7, first, { timeout: 10_000 })
    await ctx.close()
  }

  // 5 — Sprache live
  {
    const { ctx, p } = await page(browser, null)
    await p.goto(URL + '?installGate=0')
    assert((await p.getByTestId('tab-play').innerText()).includes(T.nav.play), 'Startsprache folgt dem Browser')
    await p.getByTestId('menu').click()
    await p.getByTestId('menu-settings').click()
    await p.getByTestId(`lang-${lang === 'en' ? 'de' : 'en'}`).click()
    await p.keyboard.press('Escape')
    await p.getByTestId('tab-play').getByText(other.nav.play).waitFor()
    assert(await p.evaluate(() => document.documentElement.lang) === (lang === 'en' ? 'de' : 'en'), 'html lang wechselt live')
    await p.reload()
    await p.getByTestId('tab-play').getByText(other.nav.play).waitFor()
    await p.goto(URL + `?installGate=0&lang=${lang}`)
    await p.getByTestId('tab-play').getByText(T.nav.play).waitFor()
    // 6 — Escape schließt das oberste Fenster
    await p.getByTestId('menu').click()
    await p.getByTestId('menu-sheet').waitFor()
    await p.keyboard.press('Escape')
    await p.getByTestId('menu-sheet').waitFor({ state: 'detached' })
    await ctx.close()
  }

  // 7 — Install-Gate und Testphase
  {
    const { ctx, p } = await page(browser, null)
    await p.goto(URL + '?installGate=1')
    await p.getByTestId('install-gate').waitFor()
    // Schritt-Anleitung passend zum Browser, Hinweis kommt nach „Im Browser weiter“ nicht sofort wieder
    assert((await p.getByTestId('install-steps').locator('li').count()) >= 2, 'Install-Gate zeigt eine Schritt-Anleitung')
    await p.getByTestId('install-skip').click()
    await p.getByTestId('hud-amount').waitFor()
    await ctx.close()
    const desk = await page(browser, null, { ...devices['Desktop Chrome'], locale: phone.locale })
    await desk.p.goto(URL + '?testPhase=1')
    await desk.p.getByTestId('test-phase').waitFor()
    await desk.p.getByTestId('test-phase-ok').click()
    await desk.p.reload()
    await desk.p.getByTestId('hud-amount').waitFor()
    assert(!(await desk.p.getByTestId('test-phase').isVisible().catch(() => false)), 'Testphasen-Hinweis nur einmal')
    await desk.ctx.close()
  }

  if (G.extraSmoke) await G.extraSmoke({ browser, page, phone, URL, T, def, E, seed, assert })
  if (errors.length) throw new Error('Seitenfehler:\n' + errors.join('\n'))
  console.log(`smoke ${slug} ${lang}: ok`)
} finally {
  await browser?.close()
  server.close()
}
