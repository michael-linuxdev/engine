/**
 * npm run balance -- <spiel> <profil> <stunden>
 *   SUMMARY=1  gekürzte Ausgabe + Zusammenfassung
 *   PLAY=1     das Spiel spielt seine eigenen Systeme mit (export `simPlay` aus src/game.ts); ändert die Taktung,
 *              deshalb nicht zusammen mit CHECK
 *   STREAM=1   jedes Ereignis sofort ausgeben (lange Läufe: Das Ergebnis bleibt, auch wenn der Lauf abbricht)
 *   CHECK=1    Zielkorridore des Spiels prüfen (export `balanceTargets` aus src/game.ts)
 *   BAL_<pfad>=<wert>  Stellschraube überschreiben, Punkt als __ (BAL_offline__softHours=10)
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { loadTs } from '../lib/load-ts.mjs'

const [slug = 'lichtwarte', profile = 'engaged', hours = '24'] = process.argv.slice(2)
const dir = slug === 'vorlage' ? '_vorlage' : slug
// Ein Bündel für Simulator und Spiel, damit beide dieselbe Engine-Kopie nutzen
mkdirSync('node_modules/.cache', { recursive: true })
const entry = 'node_modules/.cache/sim-entry.ts'
writeFileSync(entry, `export * from '../../tools/balance/entry.ts'\nexport * as game from '../../games/${dir}/src/game.ts'\n`)
const sim = await loadTs(entry)
const def = sim.withEnv(sim.game.game, process.env)
if (sim.game.REALMS) sim.registerRegions(def, sim.game.REALMS.regions)
const play = process.env.PLAY && sim.game.simPlay ? sim.game.simPlay() : undefined
const onEvent = process.env.STREAM ? (e) => console.log(`Tag ${(e.at / 1440).toFixed(1)}\t${e.kind}\t${e.id}\t${e.detail ?? ''}`) : undefined
const r = sim.simulate(def, { profile, hours: Number(hours), play, onEvent })
console.log(`${slug} · ${profile} · ${hours} h`)
console.log(sim.formatResult(r, !!process.env.SUMMARY))
if (process.env.CHECK) {
  const fails = [...sim.checkTargets(r, sim.game.balanceTargets?.[profile] ?? []), ...sim.checkWalls(r), ...sim.checkWalls(r, 3, 120, Infinity, ['region'])]
  for (const f of fails) console.error('ZIEL VERFEHLT: ' + f)
  if (fails.length) process.exit(1)
  console.log('Zielkorridore eingehalten.')
}
