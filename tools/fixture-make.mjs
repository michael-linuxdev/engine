/**
 * node tools/fixture-make.mjs <spiel> — legt einen echten, gespielten Stand als
 * games/<spiel>/test/fixtures/save-v<contentVersion>.json ab, dazu die Erwartung
 * (*.expect.json). Bestehende Fixtures werden NIE überschrieben.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { loadGame, loadTs } from './lib/load-ts.mjs'

const slug = process.argv[2] ?? 'vorlage'
const E = await loadTs('packages/engine/src/index.ts')
const { def, dir } = await loadGame(slug)
const out = `${dir}/test/fixtures`
mkdirSync(out, { recursive: true })
const file = `${out}/save-v${def.contentVersion}.json`
if (existsSync(file)) {
  console.error(`${file} existiert schon — Fixtures werden nie überschrieben.`)
  process.exit(1)
}
const clock = E.createManualClock(Date.UTC(2026, 10, 9, 8))
let s = E.createState(def, clock)
const buy = (id, count = 1) => (s = E.dispatch(def, s, { module: 'producers', type: 'buy', payload: { id, count } }, clock).state)
// Etwa 40 Minuten spielen: Kaufen, Funkenruf, bis zur ersten Prestige-Schicht
const layer = def.prestigeLayers[0].id
for (let i = 0; i < 2400; i++) {
  clock.advance(1000)
  s = E.advance(def, s, 1000, 0, clock).state
  const best = E.bestBuy(E.view(def, s))
  if (best?.affordable) buy(best.id)
  if (i % 300 === 0) s = E.dispatch(def, s, { module: 'burst', type: 'use' }, clock).state
  const st = E.layerStatus(E.view(def, s), layer)
  if (st.block === null && (s.modules.prestige.layers[0].count === 0 || i > 2000)) {
    s = E.dispatch(def, s, { module: 'prestige', type: 'perform', payload: { layer } }, clock).state
    for (const item of def.metaShop) s = E.dispatch(def, s, { module: 'metaShop', type: 'buy', payload: { id: item.id } }, clock).state
  }
}
clock.advance(3 * 3600_000)
s = E.applyOffline(def, s, clock).state
const text = E.serializeState(def, s, clock.now())
writeFileSync(file, JSON.stringify(JSON.parse(text), null, 2) + '\n')
const values = {
  'core.primary': s.core.primary,
  'core.primaryRun': s.core.primaryRun,
  'core.primaryLifetime': s.core.primaryLifetime,
  'core.lastSeen': s.core.lastSeen,
  'core.rng': s.core.rng,
}
for (const [id, n] of Object.entries(s.modules.producers.owned)) values[`modules.producers.owned.${id}`] = n
s.modules.prestige.layers.forEach((l, i) => (values[`modules.prestige.layers.${i}.count`] = l.count))
for (const [id, n] of Object.entries(s.modules.metaShop.ranks)) values[`modules.metaShop.ranks.${id}`] = n
for (const [id, n] of Object.entries(s.modules.wallet.balances)) values[`modules.wallet.balances.${id}`] = n
values['modules.progression.xp'] = s.modules.progression.xp
values['modules.offline.pending.gained'] = s.modules.offline.pending?.gained ?? null
writeFileSync(file.replace('.json', '.expect.json'), JSON.stringify({ note: 'Werte, die nach dem Laden gelten müssen. Nie anpassen, außer eine Migration verschiebt ein Feld (dann Pfad ändern, Wert behalten).', values }, null, 2) + '\n')
console.log(`${file}: prestige ${s.modules.prestige.layers[0].count}, owned ${JSON.stringify(s.modules.producers.owned)}`)
