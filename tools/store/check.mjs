/**
 * Store-Bereitschaft je Spiel: listet, was vor dem Store-Start noch fehlt.
 * Aufruf: node tools/store/check.mjs [spiel] [--strict]   (npm run store:check)
 * --strict: Exit-Code 1, solange ein Blocker offen ist (für den Release-Lauf).
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { loadTs } from '../lib/load-ts.mjs'

const args = process.argv.slice(2)
const strict = args.includes('--strict')
const slug = args.find((a) => !a.startsWith('--')) ?? 'lichtwarte'
const dir = join('games', slug)
const blockers = []
const ok = []

const dist = await loadTs(join(dir, 'src/distribution.ts'))
;(dist.DISTRIBUTION === 'store' ? ok : blockers).push(`DISTRIBUTION = '${dist.DISTRIBUTION}' (für den Store: 'store')`)
;(dist.TEST_PHASE === false ? ok : blockers).push(`TEST_PHASE = ${dist.TEST_PHASE} (für den Store: false)`)

const legal = await loadTs(join(dir, 'src/legal.ts'))
;(legal.IMPRINT ? ok : blockers).push(`Impressum ${legal.IMPRINT ? 'eingetragen' : 'fehlt'} (src/legal.ts)`)

const market = existsSync(join(dir, 'src/content/market.ts')) ? await loadTs(join(dir, 'src/content/market.ts')) : null
if (market) ok.push(`Echtgeld-Käufe: ${market.STORE_ENABLED ? 'an' : 'aus (Angebote bleiben Attrappen, bis IAP angebunden ist)'}`)

const rows = readFileSync('docs/marken/pruefung.md', 'utf8').split('\n').filter((l) => l.startsWith('| ') && /\| (ungeprüft|frei|Konflikt) \|$/.test(l))
const open = rows.filter((l) => !l.endsWith('| frei |'))
;(open.length ? blockers : ok).push(`Eigennamen: ${rows.length - open.length} frei, ${open.length} noch nicht als „frei“ geprüft (docs/marken/pruefung.md)`)

for (const f of ['icons/store-ios-1024.png', 'icons/store-play-512.png', 'icons/maskable-512.png'])
  (existsSync(join(dir, 'public', f)) ? ok : blockers).push(`public/${f} ${existsSync(join(dir, 'public', f)) ? 'vorhanden' : 'fehlt'}`)

const listing = await loadTs(join(dir, 'src/store/listing.ts'))
ok.push(`Store-Texte: ${Object.keys(listing.LISTING).join(', ')}`)

console.log(`Store-Bereitschaft ${slug}\n`)
for (const x of ok) console.log(`  ✓ ${x}`)
for (const x of blockers) console.log(`  ✗ ${x}`)
console.log(blockers.length ? `\n${blockers.length} Blocker offen.` : '\nBereit für den Store.')
if (strict && blockers.length) process.exit(1)
