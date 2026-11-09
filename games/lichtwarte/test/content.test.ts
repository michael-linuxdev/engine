/** Inhalt, Marken, Titel, Grafik-Palette, Kontrast. */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { contrast, CONTRAST_PAIRS, cssTokens, walk } from '@engine/testing'
import { BRAND } from '../src/brand'
import { NAMES } from '../src/content/names'
import { DISTRIBUTION } from '../src/distribution'
import { game, PRODUCER_IDS } from '../src/game'
import { BUILDINGS } from '../src/art/registry'
import { SLOTS } from '../src/scene/slots'

const GAME = join(__dirname, '..')
const ROOT = join(GAME, '..', '..')
const read = (rel: string) => readFileSync(join(ROOT, rel), 'utf8')

describe('Spiel: Inhalt', () => {
  it('10 Bauwerke mit Grafik und Platz, 3 Schichten, Archiv mit 10 Gegenständen / 163 Rängen', () => {
    expect(game.producers.map((p) => p.id)).toEqual([...PRODUCER_IDS])
    for (const id of PRODUCER_IDS) {
      expect(BUILDINGS[id], id).toBeDefined()
      expect(SLOTS.find((s) => s.id === id), id).toBeDefined()
    }
    expect(game.prestigeLayers).toHaveLength(3)
    expect(game.metaShop).toHaveLength(10)
    expect(game.metaShop.reduce((a, m) => a + m.maxRank, 0)).toBe(163)
  })
})

describe('Spiel: Titel und Eigennamen', () => {
  it('der Spieltitel steht nur in brand.ts', () => {
    const hits = walk(ROOT, 'games/lichtwarte')
      .filter((f) => !f.endsWith('src/brand.ts') && !f.endsWith('terms.txt') && !f.includes('/test/fixtures/'))
      .filter((f) => read(f).includes(BRAND.de) || read(f).includes(BRAND.en))
    expect(hits).toEqual([])
  })
  it('jeder Eigenname hat eine Zeile im Prüfprotokoll', () => {
    const protocol = read('docs/marken/pruefung.md')
    const missing = NAMES.filter((n) => !protocol.includes(`| ${n.id} |`))
    expect(missing.map((n) => n.id)).toEqual([])
  })
  it('Store-Fassung nur, wenn alle Eigennamen „frei“ sind', () => {
    const protocol = read('docs/marken/pruefung.md')
    const rows = NAMES.map((n) => protocol.split('\n').find((l) => l.startsWith(`| ${n.id} |`)) ?? '')
    const status = rows.map((r) => r.split('|').map((x) => x.trim()).filter(Boolean).at(-1))
    for (const st of status) expect(['ungeprüft', 'frei', 'konflikt']).toContain(st)
    if (DISTRIBUTION === 'store') expect(status.every((s) => s === 'frei')).toBe(true)
    expect(status).not.toContain('konflikt')
  })
})

describe('Spiel: Grafik', () => {
  const allow = new Set((JSON.parse(read('games/lichtwarte/src/art/hex-allow.json')) as string[]).map((x) => x.toLowerCase()))
  it('keine Farbe außerhalb der Palette (hex-allow.json)', () => {
    const files = [...walk(ROOT, 'games/lichtwarte/src/art'), ...walk(ROOT, 'games/lichtwarte/src/scene'), 'games/lichtwarte/public/icon.svg'].filter((f) => /\.(tsx?|svg)$/.test(f))
    const bad: string[] = []
    for (const f of files) for (const m of read(f).matchAll(/#[0-9a-fA-F]{6}\b/g)) if (!allow.has(m[0].toLowerCase())) bad.push(`${f}: ${m[0]}`)
    expect(bad).toEqual([])
  })
  it('Farben stehen nur in palette.ts (Bauwerke nutzen die Palette)', () => {
    const files = walk(ROOT, 'games/lichtwarte/src/art').filter((f) => /\.tsx$/.test(f))
    expect(files.filter((f) => /#[0-9a-fA-F]{6}\b/.test(read(f)))).toEqual([])
  })
  it('Kontrast der Theme-Tokens ≥ 4,5:1', () => {
    const tokens = { ...cssTokens(read('packages/ui-kit/src/styles/tokens.css')), ...cssTokens(read('games/lichtwarte/src/theme/tokens.css')) }
    const bad = CONTRAST_PAIRS.filter(([a, b]) => contrast(tokens[a], tokens[b]) < 4.5).map(([a, b]) => `${a}/${b} ${contrast(tokens[a], tokens[b]).toFixed(2)}`)
    expect(bad).toEqual([])
  })
  it('Baseline-Ordner für den Pixelvergleich existiert', () => {
    expect(existsSync(join(ROOT, 'tools/e2e/art-baseline/lichtwarte'))).toBe(true)
  })
})
