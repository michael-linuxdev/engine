/**
 * Jedes Fenster im iPhone-13-Format → e2e-screens/<spiel>/<sprache>/*.png
 * und Suche nach abgeschnittenen Texten (Text breiter/höher als sein Kasten bei
 * overflow hidden, oder Ellipse). node tools/e2e/screens.mjs <spiel> <de|en> [--strict]
 */
import { mkdirSync } from 'node:fs'
import { devices } from 'playwright'
import { launch, loadGameBundle, serve } from './lib.mjs'
import { gameBySlug } from './games.mjs'

const args = process.argv.slice(2)
const strict = args.includes('--strict')
const [slug = 'lichtwarte', lang = 'de'] = args.filter((a) => !a.startsWith('--'))
const G = gameBySlug(slug)
const B = await loadGameBundle(G.dir)
const def = B.G.game
const E = B.E
const out = `e2e-screens/${slug}/${lang}`
mkdirSync(out, { recursive: true })
const server = await serve('dist', 4900 + Math.floor(Math.random() * 90))
const URL = server.url + G.path + `?installGate=0&lang=${lang}&ambient=day-summer`
const browser = await launch()
const problems = []

/** Ein Stand, in dem alles sichtbar ist: alle Bauwerke, eine Mondwende, Geld fürs Archiv. */
function richSave() {
  const clock = E.createManualClock(Date.now())
  let s = E.createState(def, clock)
  const owned = {}
  def.producers.forEach((p, i) => (owned[p.id] = Math.max(1, 60 - i * 6)))
  const layers = s.modules.prestige.layers.map((l, i) => (i === 0 ? { count: 3, runEarned: 1e12, sinceReset: 3 } : l))
  const balances = { ...s.modules.wallet.balances }
  for (const c of Object.keys(balances)) balances[c] = 5000
  s = { ...s, core: { ...s.core, primary: 1e12, primaryRun: 1e12, primaryLifetime: 1e13 }, modules: { ...s.modules, producers: { owned }, prestige: { layers }, wallet: { balances, earned: balances } } }
  return E.serializeState(def, s, Date.now())
}

async function truncated(p) {
  return p.evaluate(() => {
    const bad = []
    for (const el of document.querySelectorAll('body *')) {
      if (!(el instanceof HTMLElement) || !el.offsetParent || el.closest('svg') || el.classList.contains('ek-visually-hidden')) continue
      const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
      if (!hasText) continue
      const cs = getComputedStyle(el)
      const clips = cs.overflowX !== 'visible' || cs.overflowY !== 'visible' || cs.textOverflow === 'ellipsis'
      if (!clips || el.tagName === 'TEXTAREA') continue
      if (el.scrollWidth > el.clientWidth + 1 || (cs.overflowY !== 'auto' && cs.overflowY !== 'scroll' && el.scrollHeight > el.clientHeight + 1)) bad.push(`${el.tagName.toLowerCase()}.${el.className}: „${el.textContent.trim().slice(0, 40)}“`)
    }
    // Texte, die rechts aus dem Bildschirm laufen
    const w = document.documentElement.clientWidth
    for (const el of document.querySelectorAll('button, h1, h2, h3, p, span, strong, li')) {
      const r = el.getBoundingClientRect()
      if (r.width && r.right > w + 1 && !el.closest('svg')) bad.push(`ragt rechts heraus: ${el.tagName.toLowerCase()} „${el.textContent.trim().slice(0, 30)}“`)
    }
    return [...new Set(bad)]
  })
}

try {
  const ctx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce', locale: lang === 'en' ? 'en-US' : 'de-DE' })
  const save = richSave()
  await ctx.addInitScript(([key, save, intro]) => {
    if (sessionStorage.getItem('seeded')) return
    sessionStorage.setItem('seeded', '1')
    localStorage.setItem(key, save)
    for (const [k, v] of Object.entries(intro)) localStorage.setItem(k, v)
  }, [def.saveKey, save, G.skipIntro])
  const p = await ctx.newPage()
  await p.goto(URL)
  await p.getByTestId('hud-amount').waitFor()
  const shot = async (name) => {
    await p.waitForTimeout(150)
    await p.screenshot({ path: `${out}/${name}.png` })
    for (const b of await truncated(p)) problems.push(`[${lang}] ${name}: ${b}`)
  }
  await shot('01-start')
  for (const tab of ['prestige', 'shop']) {
    await p.getByTestId(`tab-${tab}`).click()
    await shot(`02-tab-${tab}`)
  }
  await p.getByTestId('tab-play').click()
  for (const prod of def.producers) {
    const slot = p.getByTestId(`slot-${prod.id}`)
    if (await slot.isVisible().catch(() => false)) await slot.click()
    else continue
    await p.getByTestId('upgrade-sheet').waitFor()
    await shot(`03-upgrade-${prod.id}`)
    await p.keyboard.press('Escape')
    await p.getByTestId('upgrade-sheet').waitFor({ state: 'detached' })
  }
  await p.getByTestId('hud-amount-btn').click()
  await shot('04-boni')
  await p.keyboard.press('Escape')
  await p.getByTestId('menu').click()
  await shot('05-menu')
  const items = await p.locator('[data-testid^="menu-"]').evaluateAll((els) => els.map((e) => e.getAttribute('data-testid')).filter((x) => x !== 'menu-sheet'))
  await p.keyboard.press('Escape')
  for (const id of items) {
    await p.getByTestId('menu').click()
    await p.getByTestId(id).click()
    await p.waitForTimeout(200)
    await shot(`06-${id}`)
    await p.keyboard.press('Escape')
  }
  await ctx.close()
} finally {
  await browser.close()
  server.close()
}
if (problems.length) {
  console.error(problems.join('\n'))
  if (strict) process.exit(1)
}
console.log(`screens ${slug} ${lang}: ${problems.length ? problems.length + ' Hinweise' : 'ok'} → ${out}`)
