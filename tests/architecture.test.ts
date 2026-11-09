/**
 * Architecture guards: import direction (engine → game is forbidden), a
 * pure engine (no React/DOM/system clock/Math.random), and store shells.
 */
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { checkImports, checkPatterns, walk } from '@engine/testing'

const ROOT = join(__dirname, '..')
const pkgFiles = walk(ROOT, 'packages')
const engineFiles = walk(ROOT, 'packages/engine/src')

describe('Import-Richtung', () => {
  it('packages/ importiert nie aus games/', () => {
    const bad = checkImports(ROOT, pkgFiles, (spec) => spec.startsWith('@game/') || /(^|\/)games\//.test(spec))
    expect(bad).toEqual([])
  })
  it('die Engine hängt von keinem anderen Paket ab', () => {
    const bad = checkImports(ROOT, engineFiles, (spec) => !spec.startsWith('.'))
    expect(bad).toEqual([])
  })
  it('art-kit und testing hängen nicht von React-Paketen der Engine ab', () => {
    const bad = checkImports(ROOT, [...walk(ROOT, 'packages/art-kit/src'), ...walk(ROOT, 'packages/testing/src')], (spec) => spec.startsWith('@engine/react') || spec.startsWith('@engine/ui'))
    expect(bad).toEqual([])
  })
})

describe('reine Engine', () => {
  it('kein Date.now, new Date() ohne Argument, Math.random, DOM', () => {
    const bad = checkPatterns(ROOT, engineFiles, [
      /\bDate\.now\b/,
      /new Date\(\s*\)/,
      /\bMath\.random\b/,
      /\b(window|document|navigator|localStorage|sessionStorage)\s*\./,
      /\bperformance\.now\b/,
    ])
    expect(bad).toEqual([])
  })
  it('die Prüfung selbst erkennt Verstöße', () => {
    // Prüft die Regex an einem Text, nicht an Dateien
    expect(/\bMath\.random\b/.test('const x = ' + 'Math' + '.random()')).toBe(true)
  })
})

describe('Store-Hülle erzwingt Store-Einstellungen', () => {
  for (const g of readdirSync(join(ROOT, 'games'))) {
    it(`${g}: keine Store-Hülle mit Web-/Testphasen-Schalter`, async () => {
      const dir = join(ROOT, 'games', g)
      const shells = ['capacitor.config.ts', 'capacitor.config.json', 'android', 'ios', 'twa-manifest.json'].filter((f) => existsSync(join(dir, f)))
      if (!existsSync(join(dir, 'src', 'distribution.ts'))) return
      const mod = (await import(join(dir, 'src', 'distribution.ts'))) as { DISTRIBUTION: string; TEST_PHASE: boolean }
      if (shells.length) {
        expect(mod.DISTRIBUTION, `${g}: Store-Hülle (${shells.join(', ')}) gefunden`).toBe('store')
        expect(mod.TEST_PHASE).toBe(false)
      } else {
        expect(['web', 'store']).toContain(mod.DISTRIBUTION)
      }
    })
  }
})
