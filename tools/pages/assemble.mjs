/**
 * Setzt die Web-Fassung aller Spiele zu einem dist/ zusammen (GitHub Pages):
 *   /          → games/lichtwarte (das Hauptspiel)
 *   /vorlage/  → games/_vorlage
 * Fehlt das Hauptspiel noch, liegt an der Wurzel eine kleine Übersicht.
 */
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'

export const SITES = [
  { slug: 'lichtwarte', dir: 'games/lichtwarte/dist', path: '' },
  { slug: 'vorlage', dir: 'games/_vorlage/dist', path: 'vorlage' },
]

rmSync('dist', { recursive: true, force: true })
mkdirSync('dist', { recursive: true })
for (const s of SITES) {
  if (!existsSync(s.dir)) continue
  cpSync(s.dir, s.path ? `dist/${s.path}` : 'dist', { recursive: true })
  console.log(`dist/${s.path} ← ${s.dir}`)
}
if (!existsSync('dist/index.html')) {
  writeFileSync('dist/index.html', `<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Idle-Engine</title><body style="font-family:system-ui;padding:24px"><h1>Idle-Engine</h1><ul><li><a href="./vorlage/">Vorlage</a></li></ul></body></html>\n`)
}
writeFileSync('dist/.nojekyll', '')
