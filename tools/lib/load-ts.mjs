/**
 * Load a TypeScript module from the workspace in plain Node: bundles the entry
 * with rolldown (workspace packages resolve to their sources) and imports it.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { rolldown } from 'rolldown'

let n = 0
export async function loadTs(entry) {
  const bundle = await rolldown({ input: resolve(entry), platform: 'node', logLevel: 'silent' })
  const { output } = await bundle.generate({ format: 'esm' })
  await bundle.close()
  const dir = join(tmpdir(), 'engine-load-ts')
  mkdirSync(dir, { recursive: true })
  const file = join(dir, `m${process.pid}-${n++}.mjs`)
  writeFileSync(file, output[0].code)
  return import(pathToFileURL(file).href)
}

/** games/<slug>/src/game.ts → the game definition. */
export async function loadGame(slug) {
  const dir = slug === 'vorlage' ? '_vorlage' : slug
  const mod = await loadTs(`games/${dir}/src/game.ts`)
  return { def: mod.game, mod, dir: `games/${dir}` }
}
