/** npm run e2e — alle Spiele, beide Sprachen: smoke, axe, (screens --strict, art). Voraussetzung: npm run build. */
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { GAMES } from './games.mjs'

if (!existsSync('dist/index.html')) {
  console.error('dist/ fehlt — zuerst npm run build')
  process.exit(1)
}
const run = (script, ...args) => {
  console.log(`\n▶ ${script} ${args.join(' ')}`)
  const r = spawnSync('node', [`tools/e2e/${script}`, ...args], { stdio: 'inherit' })
  if (r.status !== 0) process.exit(r.status ?? 1)
}
for (const g of GAMES) {
  for (const lang of ['de', 'en']) {
    run('smoke.mjs', g.slug, lang)
    run('axe.mjs', g.slug, lang)
    if (g.screens) run('screens.mjs', g.slug, lang, '--strict')
  }
  if (g.art) run('art.mjs', g.slug)
}
console.log('\nE2E: alles grün')
