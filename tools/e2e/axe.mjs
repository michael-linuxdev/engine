/**
 * axe (WCAG 2 A/AA) je Spiel und Sprache: Startansicht, jede Registerkarte, Menü,
 * Einstellungen, Sicherung und — falls vorhanden — die Spiel-Fenster aus games.mjs.
 */
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { devices } from 'playwright'
import { launch, loadGameBundle, serve } from './lib.mjs'
import { gameBySlug } from './games.mjs'

const [slug = 'vorlage', lang = 'de'] = process.argv.slice(2)
const G = gameBySlug(slug)
const B = await loadGameBundle(G.dir)
const def = B.G.game
const axeSource = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8')
const server = await serve('dist', 4700 + Math.floor(Math.random() * 200))
const URL = server.url + G.path
const browser = await launch()
const problems = []
try {
  const ctx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce', locale: lang === 'en' ? 'en-US' : 'de-DE' })
  await ctx.addInitScript((intro) => {
    for (const [k, v] of Object.entries(intro)) localStorage.setItem(k, v)
  }, G.skipIntro)
  const p = await ctx.newPage()
  await p.goto(URL + `?installGate=0&lang=${lang}`)
  await p.getByTestId('hud-amount').waitFor()
  const check = async (label) => {
    await p.addScriptTag({ content: axeSource })
    const r = await p.evaluate(async () => {
      // eslint-disable-next-line no-undef
      const res = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } })
      return res.violations.map((v) => `${v.id}: ${v.nodes.length}× ${v.nodes[0]?.target?.join(' ')}`)
    })
    for (const v of r) problems.push(`[${lang}] ${label}: ${v}`)
  }
  await check('Start')
  // Alle Tabs, die es in diesem Stand gibt (ein Spiel kann Tabs erst später zeigen), zuletzt zurück zur Spielansicht
  const tabs = await p.locator('[data-testid^="tab-"]').evaluateAll((els) => els.map((e) => e.getAttribute('data-testid').slice(4)).filter((x) => x !== 'play'))
  for (const tab of [...tabs, 'play']) {
    await p.getByTestId(`tab-${tab}`).click()
    await check(`Tab ${tab}`)
  }
  for (const m of ['settings', 'save', 'legal']) {
    await p.getByTestId('menu').click()
    await p.getByTestId(`menu-${m}`).click()
    await p.waitForTimeout(100)
    await check(`Menü ${m}`)
    await p.keyboard.press('Escape')
  }
  if (G.axeExtra) await G.axeExtra(p, check, def)
  await ctx.close()
} finally {
  await browser.close()
  server.close()
}
if (problems.length) {
  console.error(problems.join('\n'))
  process.exit(1)
}
console.log(`axe ${slug} ${lang}: ok`)
