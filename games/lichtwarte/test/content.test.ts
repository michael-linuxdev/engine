/** Inhalt, Marken, Titel, Grafik-Palette, Kontrast. */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createManualClock, createState, view } from '@engine/core'
import { contrast, CONTRAST_PAIRS, cssTokens, walk } from '@engine/testing'
import { BRAND } from '../src/brand'
import { NAMES } from '../src/content/names'
import { DISTRIBUTION } from '../src/distribution'
import { game, PRODUCER_IDS } from '../src/game'
import { BUILDINGS } from '../src/art/registry'
import { SLOTS } from '../src/scene/slots'
import { CHRONICLE } from '../src/content/chronicle'
import { MARKET, OFFER_PRICES, STORE_ENABLED, TEST_WALLET_ENABLED } from '../src/content/market'
import { GUESTS } from '../src/content/world'
import { STYLE_TINT } from '../src/art/palette'
import { TEST_PHASE } from '../src/distribution'

const GAME = join(__dirname, '..')
const ROOT = join(GAME, '..', '..')
const read = (rel: string) => readFileSync(join(ROOT, rel), 'utf8')

describe('Spiel: Inhalt', () => {
  it('10 Bauwerke mit Grafik und Platz, 3 Schichten, Archiv 10/163, Läden der Schichten 2/3', () => {
    expect(game.producers.map((p) => p.id)).toEqual([...PRODUCER_IDS])
    for (const id of PRODUCER_IDS) {
      expect(BUILDINGS[id], id).toBeDefined()
      expect(SLOTS.find((s) => s.id === id), id).toBeDefined()
    }
    expect(game.prestigeLayers).toHaveLength(3)
    expect(CHRONICLE).toHaveLength(73)
    const archive = game.metaShop.filter((m) => m.currency === 'runeShards')
    expect(archive).toHaveLength(10)
    expect(archive.reduce((a, m) => a + m.maxRank, 0)).toBe(163)
    // Lange Nacht: 4 Gegenstände / 41 Ränge, Zeitalter: 5 Gegenstände (wie die Referenz)
    const night = game.metaShop.filter((m) => m.currency === 'nightDew')
    expect(night).toHaveLength(4)
    expect(night.reduce((a, m) => a + m.maxRank, 0)).toBe(41)
    expect(game.metaShop.filter((m) => m.currency === 'forebearLight')).toHaveLength(5)
  })
})

describe('Spiel: Talkarte', () => {
  it('kein Bauwerk steht genau über dem nächsten: Wer nah darüber liegt, ist seitlich versetzt', () => {
    // Sonst verdeckt das Schild des oberen Bauwerks das untere (Rückmeldung 2026-11-11)
    const bad: string[] = []
    for (const a of SLOTS) for (const b of SLOTS) if (a !== b && b.y > a.y && b.y - a.y < 13 && Math.abs(a.x - b.x) < 12) bad.push(`${a.id} über ${b.id}`)
    expect(bad).toEqual([])
    // Schilder ragen nicht über den Rand: außen nur kurze Namen
    for (const s of SLOTS) expect(s.x, s.id).toBeGreaterThanOrEqual(15)
    for (const s of SLOTS) expect(s.x, s.id).toBeLessThanOrEqual(85)
  })
})

describe('Spiel: Talgäste', () => {
  it('jede Art hat ihr eigenes Bild (kein Fuchs für den Steinbock)', () => {
    const src = read('games/lichtwarte/src/art/life.tsx')
    const table = src.slice(src.indexOf('const GUESTS'), src.indexOf('export function GuestArt'))
    const arts = new Map([...table.matchAll(/^  (\w+): (\w+),$/gm)].map((m) => [m[1], m[2]]))
    for (const g of GUESTS.list) expect(arts.has(g.id), g.id).toBe(true)
    expect(new Set(arts.values()).size).toBe(arts.size)
  })
})

describe('Spiel: Markt (Attrappen)', () => {
  it('7 Angebote mit Preis, 8 Talstile (4 + 4 Fest), Festwoche 5 Stufen, 2 Zeitsprünge mit 6 h am Tag', () => {
    expect(MARKET.offers).toHaveLength(7)
    for (const o of MARKET.offers) expect(OFFER_PRICES[o.id], o.id).toBeGreaterThan(0)
    expect(MARKET.cosmetics).toHaveLength(8)
    expect(MARKET.cosmetics.filter((c) => c.when)).toHaveLength(4)
    for (const c of MARKET.cosmetics) expect(STYLE_TINT[c.id], c.id).toBeDefined()
    expect(MARKET.pass.tiers).toHaveLength(5)
    expect(MARKET.skips).toHaveLength(2)
    expect(MARKET.skipCapHours).toBe(6)
    expect(MARKET.ad.choices).toHaveLength(2)
  })
  it('Echtgeld bleibt aus; Testgeld nur in der Testphase', () => {
    expect(STORE_ENABLED).toBe(false)
    expect(TEST_WALLET_ENABLED).toBe(TEST_PHASE)
  })
  it('jeder Fest-Stil ist genau während seines Festes zu kaufen', () => {
    const at = { budWreath: [4, 1], solsticeSheen: [7, 1], lanternParade: [10, 1], starOfLights: [12, 20] } as Record<string, [number, number]>
    for (const c of MARKET.cosmetics.filter((x) => x.when)) {
      const [mo, d] = at[c.id]
      const clock = createManualClock(Date.UTC(2027, mo - 1, d, 12))
      const w = view(game, createState(game, clock))
      expect(c.when?.(w, clock), c.id).toBe(true)
      clock.advance(60 * 86_400_000)
      expect(c.when?.(w, clock), `${c.id} außerhalb`).toBe(false)
    }
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
