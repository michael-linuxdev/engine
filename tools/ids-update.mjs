/**
 * npm run ids:update [-- <spiel>] — trägt neue Inhalts-IDs in games/<spiel>/ids.lock.json ein.
 * Entfernen ist nie erlaubt: die Datei wird nur ergänzt (Vereinigung).
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { loadTs } from './lib/load-ts.mjs'

const engine = await loadTs('packages/engine/src/index.ts')
const only = process.argv[2]
for (const dir of readdirSync('games')) {
  const slug = dir === '_vorlage' ? 'vorlage' : dir
  if (only && only !== slug) continue
  if (!existsSync(`games/${dir}/src/game.ts`)) continue
  const mod = await loadTs(`games/${dir}/src/game.ts`)
  const file = `games/${dir}/ids.lock.json`
  const lock = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {}
  const current = engine.collectIds(mod.game, mod.extraIds ?? {})
  const diff = engine.diffIdLock(current, lock)
  if (diff.missing.length) {
    console.error(`${slug}: IDs fehlen in der Spieldefinition (nie entfernen!):\n  ${diff.missing.join('\n  ')}`)
    process.exitCode = 1
  }
  writeFileSync(file, JSON.stringify(engine.mergeIdLock(current, lock), null, 2) + '\n')
  console.log(`${slug}: ${diff.added.length} neue IDs eingetragen`)
}
