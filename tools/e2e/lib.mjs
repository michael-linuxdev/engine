/** Gemeinsame E2E-Helfer: statischer Server für dist/, Browser, Spielstände bauen, Texte laden. */
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'
import { chromium } from 'playwright'
import { loadTs } from '../lib/load-ts.mjs'

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' }

export function serve(root = 'dist', port = 4321) {
  const server = createServer((req, res) => {
    let p = normalize(decodeURIComponent((req.url ?? '/').split('?')[0])).replace(/^(\.\.[/\\])+/, '')
    let file = join(root, p)
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html')
    if (!existsSync(file)) {
      res.writeHead(404)
      res.end('not found')
      return
    }
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' })
    createReadStream(file).pipe(res)
  })
  return new Promise((resolve) => server.listen(port, () => resolve({ url: `http://localhost:${port}`, close: () => server.close() })))
}

export async function launch() {
  return chromium.launch({ executablePath: process.env.PW_EXECUTABLE || undefined })
}

export function assert(cond, msg) {
  if (!cond) throw new Error('E2E: ' + msg)
}

/** Engine + Spiel + Texte in einem Bündel (eine Engine-Kopie). */
export async function loadGameBundle(dir) {
  const { mkdirSync, writeFileSync } = await import('node:fs')
  mkdirSync('node_modules/.cache', { recursive: true })
  const entry = `node_modules/.cache/e2e-${dir.replace(/\W/g, '')}.ts`
  writeFileSync(
    entry,
    `export * as E from '../../packages/engine/src/index.ts'\nexport * as G from '../../games/${dir}/src/game.ts'\nexport { stringsDe as de } from '../../games/${dir}/src/i18n/de.ts'\nexport { stringsEn as en } from '../../games/${dir}/src/i18n/en.ts'\n`,
  )
  return loadTs(entry)
}

export const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
