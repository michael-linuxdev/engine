/**
 * Grafik-Vergleich: ?artsheet (alle Bauwerke × Stufen × Stimmungen) und
 * ?artsheet=map werden je Eintrag fotografiert und mit
 * tools/e2e/art-baseline/<spiel>/*.png verglichen (Toleranz 0,5 % Pixel).
 * Dazu das SVG-Budget: Hauptszene mit allen Bauwerken in Stufe 4 ≤ 1.500 Elemente.
 *   node tools/e2e/art.mjs <spiel>            prüfen
 *   node tools/e2e/art.mjs <spiel> --update   Vergleichsbilder erneuern (npm run art:update)
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { launch, loadGameBundle, serve } from './lib.mjs'
import { GAMES, gameBySlug } from './games.mjs'

const args = process.argv.slice(2)
const update = args.includes('--update')
const slugs = args.filter((a) => !a.startsWith('--'))
const targets = slugs.length ? slugs.map(gameBySlug) : GAMES.filter((g) => g.art)
const server = await serve('dist', 5200 + Math.floor(Math.random() * 90))
const browser = await launch()
const fails = []
const MAX_DIFF = 0.005
const BUDGET = 1500

async function diffRatio(page, a, b) {
  return page.evaluate(
    async ([a64, b64]) => {
      const load = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = 'data:image/png;base64,' + src })
      const [ia, ib] = await Promise.all([load(a64), load(b64)])
      if (ia.width !== ib.width || ia.height !== ib.height) return 1
      const c = (img) => { const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height; const x = cv.getContext('2d'); x.drawImage(img, 0, 0); return x.getImageData(0, 0, img.width, img.height).data }
      const da = c(ia), db = c(ib)
      let n = 0
      for (let i = 0; i < da.length; i += 4) if (Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]) > 48) n++
      return n / (da.length / 4)
    },
    [a.toString('base64'), b.toString('base64')],
  )
}

try {
  for (const G of targets) {
    const dir = `tools/e2e/art-baseline/${G.slug}`
    const diffDir = `tools/e2e/art-diff/${G.slug}`
    mkdirSync(dir, { recursive: true })
    mkdirSync(diffDir, { recursive: true })
    const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' })
    const p = await ctx.newPage()
    for (const sheet of ['', 'map']) {
      await p.goto(server.url + G.path + `?artsheet${sheet ? '=' + sheet : ''}`)
      await p.locator('svg[data-art]').first().waitFor()
      const ids = await p.locator('svg[data-art]').evaluateAll((els) => [...new Set(els.map((e) => e.getAttribute('data-art').split('--')[0]))])
      for (const id of ids) {
        const cells = p.locator(`svg[data-art^="${id}--"]`)
        // Seitenkoordinaten (Bildschirm-Box + Scroll), Foto der ganzen Seite
        const boxes = await cells.evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return { x: r.x + scrollX, y: r.y + scrollY, right: r.right + scrollX, bottom: r.bottom + scrollY } }))
        const clip = { x: Math.min(...boxes.map((b) => b.x)), y: Math.min(...boxes.map((b) => b.y)), width: 0, height: 0 }
        clip.width = Math.max(...boxes.map((b) => b.right)) - clip.x
        clip.height = Math.max(...boxes.map((b) => b.bottom)) - clip.y
        const png = await p.screenshot({ clip, fullPage: true })
        const file = `${dir}/${id}.png`
        if (update || !existsSync(file)) {
          writeFileSync(file, png)
          if (!update) fails.push(`${G.slug}/${id}: Vergleichsbild fehlte (angelegt — prüfen und committen)`)
          continue
        }
        const r = await diffRatio(p, readFileSync(file), png)
        if (r > MAX_DIFF) {
          writeFileSync(`${diffDir}/${id}.png`, png)
          fails.push(`${G.slug}/${id}: ${(r * 100).toFixed(2)} % Pixel anders`)
        }
      }
    }
    // SVG-Budget der Hauptszene
    const B = await loadGameBundle(G.dir)
    const E = B.E
    const def = B.G.game
    const clock = E.createManualClock(Date.now())
    let s = E.createState(def, clock)
    const owned = Object.fromEntries(def.producers.map((x) => [x.id, 100]))
    s = { ...s, modules: { ...s.modules, producers: { owned } } }
    await ctx.addInitScript(([k, v, intro]) => {
      localStorage.setItem(k, v)
      for (const [a, b] of Object.entries(intro)) localStorage.setItem(a, b)
    }, [def.saveKey, E.serializeState(def, s, Date.now()), G.skipIntro])
    for (const mood of ['day-summer', 'night-winter']) {
      await p.goto(server.url + G.path + `?installGate=0&ambient=${mood}`)
      const svg = p.getByTestId('valley-svg')
      await svg.waitFor()
      const n = await svg.evaluate((e) => e.querySelectorAll('*').length)
      console.log(`${G.slug}: Hauptszene ${mood}: ${n} SVG-Elemente (Budget ${BUDGET})`)
      if (n > BUDGET) fails.push(`${G.slug}: Hauptszene ${mood} hat ${n} SVG-Elemente (> ${BUDGET})`)
    }
    await ctx.close()
  }
} finally {
  await browser.close()
  server.close()
}
if (fails.length) {
  console.error(fails.join('\n'))
  process.exit(1)
}
console.log(update ? 'art: Vergleichsbilder erneuert' : 'art: ok')
