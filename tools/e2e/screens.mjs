/**
 * Jedes Fenster im iPhone-13-Format → e2e-screens/<spiel>/<sprache>/*.png
 * und Suche nach abgeschnittenen Texten (Text breiter/höher als sein Kasten bei
 * overflow hidden, oder Ellipse). node tools/e2e/screens.mjs <spiel> <de|en> [--strict]
 *
 * Dazu drei Regeln der Bedienung (UI-Runde 4), in normaler UND in großer Schrift:
 *   - keine Schrift unter 12 px,
 *   - jede Tippfläche mindestens 44 px hoch und breit,
 *   - kein Schild der Karte liegt unter Kopfzeile, Pillen oder Knöpfen.
 * Am Ende ein Bild im Querformat: Dort muss der „Bitte drehen“-Hinweis stehen.
 */
import { mkdirSync } from 'node:fs'
import { devices } from 'playwright'
import { assert, launch, loadGameBundle, serve } from './lib.mjs'
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
  const layers = s.modules.prestige.layers.map((l, i) => (i === 0 ? { count: 6, runEarned: 1e12, sinceReset: 6 } : l))
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
      // Eine Reihe, die sich seitlich schieben lässt (Pillen über der Karte), darf über den Rand reichen: Das ist ihr Zweck
      let row = el.parentElement
      while (row && !/auto|scroll/.test(getComputedStyle(row).overflowX)) row = row.parentElement
      // (nur flache Reihen: Die Hauptfläche und Fenster scrollen senkrecht und bleiben geprüft)
      if (row && row.clientHeight < 100 && row.scrollWidth > row.clientWidth) continue
      if (r.width && r.right > w + 1 && !el.closest('svg')) bad.push(`ragt rechts heraus: ${el.tagName.toLowerCase()} „${el.textContent.trim().slice(0, 30)}“`)
    }
    return [...new Set(bad)]
  })
}

/** Schrift unter 12 px, Tippflächen unter 44 px, verdeckte Schilder der Karte. */
async function layout(p) {
  return p.evaluate(() => {
    const bad = []
    const name = (el) => el.getAttribute('data-testid') || `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}`
    const inside = (el, x, y) => {
      const hit = document.elementFromPoint(x, y)
      return !!hit && (hit === el || el.contains(hit))
    }
    for (const el of document.querySelectorAll('body *')) {
      if (!(el instanceof HTMLElement) || !el.offsetParent || el.closest('svg') || el.closest('.ek-visually-hidden')) continue
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
      if (!own) continue
      const fs = parseFloat(getComputedStyle(el).fontSize)
      if (fs < 11.95) bad.push(`Schrift ${fs.toFixed(1)} px: ${name(el)} „${el.textContent.trim().slice(0, 24)}“`)
    }
    for (const el of document.querySelectorAll('button, a[href], input, select, textarea, summary, [role="button"], [role="tab"], [role="menuitem"]')) {
      if (!(el instanceof HTMLElement) || !el.offsetParent || el.disabled) continue
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      // Nur was gerade erreichbar ist (nicht unter einem Fenster, nicht aus dem Bild gescrollt)
      if (cx < 0 || cy < 0 || cx > innerWidth || cy > innerHeight || !inside(el, cx, cy)) continue
      // Ein flacher Knopf darf seine Tippfläche unsichtbar vergrößern: gemessen wird, was den Tipp fängt.
      // Ein Kontrollkästchen zählt mit seiner Zeile (label).
      const area = el.closest('label') ?? el
      const ar = area.getBoundingClientRect()
      // 2 px Spiel: ein Knopf mit Druckpunkt (translateY beim Antippen) ist rechnerisch 42 px hoch
      const tall = ar.height >= 42 || (inside(area, cx, cy - 20) && inside(area, cx, cy + 20))
      const wide = ar.width >= 42 || (inside(area, cx - 20, cy) && inside(area, cx + 20, cy))
      if (!tall || !wide) bad.push(`Tippfläche ${Math.round(ar.width)}×${Math.round(ar.height)}: ${name(el)}`)
    }
    // Schilder der Karte: nur prüfen, wenn kein Fenster darüber liegt
    const sheetOpen = !!document.querySelector('[role="dialog"]')
    for (const el of sheetOpen ? [] : document.querySelectorAll('[data-testid^="slot-"] [class*="plaque"]')) {
      const slot = el.closest('[data-testid^="slot-"]')
      const r = el.getBoundingClientRect()
      if (!r.width || !slot) continue
      if (!inside(slot, r.left + r.width / 2, r.top + r.height / 2)) bad.push(`Schild verdeckt: ${slot.getAttribute('data-testid')}`)
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
    for (const b of await layout(p)) problems.push(`[${lang}] ${name}: ${b}`)
  }
  await shot('01-start')
  const tabs = await p.locator('[data-testid^="tab-"]').evaluateAll((els) => els.map((e) => e.getAttribute('data-testid').slice(4)).filter((x) => x !== 'play'))
  for (const tab of tabs) {
    await p.getByTestId(`tab-${tab}`).click()
    await shot(`02-tab-${tab}`)
  }
  // Views that live in the menu as tiles (beyond the tab bar)
  await p.getByTestId('menu').click()
  const menuViews = await p.locator('[data-view="true"]').evaluateAll((els) => els.map((e) => e.getAttribute('data-testid').slice(5)))
  await p.keyboard.press('Escape')
  await p.getByTestId('menu-sheet').waitFor({ state: 'detached' })
  for (const v of menuViews) {
    await p.getByTestId('menu').click()
    await p.getByTestId(`menu-${v}`).click()
    await p.getByTestId('menu-sheet').waitFor({ state: 'detached' })
    await shot(`02-view-${v}`)
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

  // Große Schrift: dieselben Regeln auf der Karte, den Tabs und einem Ausbau-Fenster
  const big = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce', locale: lang === 'en' ? 'en-US' : 'de-DE' })
  await big.addInitScript(([key, save, intro, prefsKey]) => {
    if (sessionStorage.getItem('seeded')) return
    sessionStorage.setItem('seeded', '1')
    localStorage.setItem(key, save)
    localStorage.setItem(prefsKey, JSON.stringify({ fontScale: 1.15 }))
    for (const [k, v] of Object.entries(intro)) localStorage.setItem(k, v)
  }, [def.saveKey, save, G.skipIntro, `${def.id}-prefs-v1`])
  const b = await big.newPage()
  await b.goto(URL)
  await b.getByTestId('hud-amount').waitFor()
  const bigShot = async (name) => {
    await b.waitForTimeout(150)
    await b.screenshot({ path: `${out}/${name}.png` })
    for (const x of await truncated(b)) problems.push(`[${lang}] ${name}: ${x}`)
    for (const x of await layout(b)) problems.push(`[${lang}] ${name}: ${x}`)
  }
  assert(await b.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--font-scale').trim() === '1.15'), 'große Schrift ist eingeschaltet')
  await bigShot('10-gross-start')
  for (const tab of tabs) {
    await b.getByTestId(`tab-${tab}`).click()
    await bigShot(`11-gross-tab-${tab}`)
  }
  await b.getByTestId('tab-play').click()
  await b.getByTestId(`slot-${def.producers[0].id}`).click()
  await b.getByTestId('upgrade-sheet').waitFor()
  await bigShot('12-gross-upgrade')
  await big.close()

  // Querformat am Handy: Das Spiel ist hochkant gebaut, dort steht nur der Hinweis zum Drehen
  const wide = await browser.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, reducedMotion: 'reduce', locale: lang === 'en' ? 'en-US' : 'de-DE' })
  await wide.addInitScript(([key, save, intro]) => {
    localStorage.setItem(key, save)
    for (const [k, v] of Object.entries(intro)) localStorage.setItem(k, v)
  }, [def.saveKey, save, G.skipIntro])
  const w = await wide.newPage()
  await w.goto(URL)
  await w.getByTestId('hud-amount').waitFor()
  assert(await w.getByTestId('rotate-hint').isVisible(), 'Querformat: Hinweis zum Drehen steht da')
  await w.screenshot({ path: `${out}/13-quer.png` })
  await wide.close()
} finally {
  await browser.close()
  server.close()
}
if (problems.length) {
  console.error(problems.join('\n'))
  if (strict) process.exit(1)
}
console.log(`screens ${slug} ${lang}: ${problems.length ? problems.length + ' Hinweise' : 'ok'} → ${out}`)
