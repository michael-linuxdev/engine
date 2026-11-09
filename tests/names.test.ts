/**
 * Name guard over the whole repo (docs/marken/denylist.txt) plus the game
 * term lists (engine neutrality) and reference-game terms (neutralised port).
 */
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { formatHits, parseDenylist, parseTerms, scan } from '@engine/testing'

const ROOT = join(__dirname, '..')
const deny = parseDenylist(readFileSync(join(ROOT, 'docs/marken/denylist.txt'), 'utf8'))
const games = readdirSync(join(ROOT, 'games'))

describe('Namens-Wächter', () => {
  it('keine Marken-, Franchise- oder Altnamen im Repo', () => {
    const hits = scan(deny, {
      root: ROOT,
      include: ['packages', 'games', 'tools', 'docs', 'tests', 'CLAUDE.md', 'README.md', 'ROADMAP.md', 'index.html', 'package.json'],
      exclude: ['docs/marken', 'tests/names.test.ts'],
      // Die Referenz-Doku darf das Referenz-Spiel beim Namen nennen.
      allowCategories: { 'docs/referenz/': ['own', 'shows'] },
    })
    expect(formatHits(hits)).toEqual([])
  })

  it('schlägt bei einem absichtlich eingefügten Denylist-Wort an', () => {
    const dir = mkdtempSync(join(tmpdir(), 'nameguard-'))
    mkdirSync(join(dir, 'games'))
    // Zusammengesetzt, damit diese Datei selbst sauber bleibt
    writeFileSync(join(dir, 'games', 'x.ts'), `export const title = '${'War' + 'craft'} Idle'\n`)
    writeFileSync(join(dir, 'games', 'ok.ts'), `export const ents = 'clients and ${'ents'}'\n`)
    writeFileSync(join(dir, 'games', 'cs.ts'), `export const t = 'The ${'E' + 'nts'} walk'\n`)
    const hits = scan(deny, { root: dir, include: ['games'] })
    expect(hits.map((h) => h.file).sort()).toEqual(['games/cs.ts', 'games/x.ts'])
  })

  it('Engine-Pakete enthalten keine Spielbegriffe (Neutralität)', () => {
    for (const g of games) {
      let text = ''
      try {
        text = readFileSync(join(ROOT, 'games', g, 'terms.txt'), 'utf8')
      } catch {
        throw new Error(`games/${g}/terms.txt fehlt`)
      }
      const hits = scan(parseTerms(text), { root: ROOT, include: ['packages'] })
      expect(formatHits(hits), g).toEqual([])
    }
  })

  it('keine Garten-Begriffe aus dem Referenz-Spiel in Code', () => {
    const terms = parseTerms(readFileSync(join(ROOT, 'docs/marken/referenz-begriffe.txt'), 'utf8'))
    const hits = scan(terms, { root: ROOT, include: ['packages', 'games', 'tools'] })
    expect(formatHits(hits)).toEqual([])
  })
})
