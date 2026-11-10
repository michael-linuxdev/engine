/**
 * Store-Screenshots je Sprache: 6 Szenen in zwei Formaten
 *   ios-67   1290 × 2796 (iPhone 6,7″, Pflichtformat im App Store)
 *   play     1080 × 1920 (Google Play, Telefon)
 * → store-shots/<spiel>/<sprache>/<format>-<nr>-<szene>.png (nicht im Repo).
 * Aufruf (nach npm run build): node tools/store/shots.mjs [spiel] [de|en …]
 */
import { mkdirSync } from 'node:fs'
import { launch, loadGameBundle, serve } from '../e2e/lib.mjs'
import { gameBySlug } from '../e2e/games.mjs'

const [slug = 'lichtwarte', ...langsArg] = process.argv.slice(2)
const langs = langsArg.length ? langsArg : ['de', 'en']
const G = gameBySlug(slug)
const B = await loadGameBundle(G.dir)
const def = B.G.game
const E = B.E

export const FORMATS = {
  'ios-67': { width: 430, height: 932, scale: 3 },
  play: { width: 360, height: 640, scale: 3 },
}

/** Szenen: Stimmung/Wetter per URL, dann optional ein Tab. */
const SCENES = [
  { id: 'tal-tag', query: 'ambient=day-summer&weather=clear', tab: null },
  { id: 'tal-abend', query: 'ambient=evening-autumn&weather=mist', tab: null },
  { id: 'tal-winter', query: 'ambient=night-winter&weather=clear', tab: null },
  { id: 'wacht', query: 'ambient=day-spring', tab: 'watch' },
  { id: 'lande', query: 'ambient=day-summer', tab: 'realms' },
  { id: 'welt', query: 'ambient=dawn-spring', tab: 'world' },
]

/** Fortgeschrittener Stand: alle Bauwerke, Mondwenden, eine Lange Nacht, Geld. */
function storeSave() {
  const clock = E.createManualClock(Date.now())
  let s = E.createState(def, clock)
  const owned = {}
  def.producers.forEach((p, i) => (owned[p.id] = Math.max(5, 160 - i * 14)))
  const layers = s.modules.prestige.layers.map((l, i) => (i === 0 ? { ...l, count: 14, runEarned: 1e14, sinceReset: 14 } : i === 1 ? { ...l, count: 1, sinceReset: 1 } : l))
  const balances = { ...s.modules.wallet.balances }
  for (const c of Object.keys(balances)) balances[c] = 5000
  s = { ...s, core: { ...s.core, primary: 4.2e15, primaryRun: 1e15, primaryLifetime: 1e16 }, modules: { ...s.modules, producers: { owned }, prestige: { layers }, wallet: { balances, earned: balances } } }
  return E.serializeState(def, s, Date.now())
}

const server = await serve('dist', 4800 + Math.floor(Math.random() * 90))
const browser = await launch()
try {
  for (const lang of langs) {
    const out = `store-shots/${slug}/${lang}`
    mkdirSync(out, { recursive: true })
    for (const [fmt, f] of Object.entries(FORMATS)) {
      const ctx = await browser.newContext({ viewport: { width: f.width, height: f.height }, deviceScaleFactor: f.scale, isMobile: true, hasTouch: true, reducedMotion: 'reduce', locale: lang === 'en' ? 'en-US' : 'de-DE' })
      await ctx.addInitScript(([key, save, intro]) => {
        localStorage.setItem(key, save)
        for (const [k, v] of Object.entries(intro)) localStorage.setItem(k, v)
      }, [def.saveKey, storeSave(), G.skipIntro])
      const p = await ctx.newPage()
      for (const [i, sc] of SCENES.entries()) {
        await p.goto(`${server.url}${G.path}?installGate=0&lang=${lang}&${sc.query}`)
        await p.getByTestId('hud-amount').waitFor()
        // Begrüßung/Hinweise schließen
        for (const id of ['welcome-claim', 'test-phase-ok', 'hint-close']) if (await p.getByTestId(id).isVisible().catch(() => false)) await p.getByTestId(id).click()
        if (sc.tab) await p.getByTestId(`tab-${sc.tab}`).click()
        await p.waitForTimeout(300)
        await p.screenshot({ path: `${out}/${fmt}-${String(i + 1).padStart(2, '0')}-${sc.id}.png` })
      }
      await ctx.close()
      console.log(`${slug} ${lang} ${fmt}: ${SCENES.length} Bilder → ${out}`)
    }
  }
} finally {
  await browser.close()
  server.close()
}
