import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { contrast, CONTRAST_PAIRS, cssTokens } from '@engine/testing'

describe('Token-Vertrag', () => {
  const css = readFileSync(join(__dirname, '..', 'src', 'styles', 'tokens.css'), 'utf8')
  const tokens = cssTokens(css)
  it('Rückfallwerte erfüllen Kontrast ≥ 4,5:1', () => {
    const bad = CONTRAST_PAIRS.filter(([a, b]) => contrast(tokens[a], tokens[b]) < 4.5).map(([a, b]) => `${a}/${b}: ${contrast(tokens[a], tokens[b]).toFixed(2)}`)
    expect(bad).toEqual([])
  })
  it('ui.css nutzt nur Token-Farben (keine festen Hex-Werte)', () => {
    const ui = readFileSync(join(__dirname, '..', 'src', 'styles', 'ui.css'), 'utf8')
    expect(ui.match(/#[0-9a-fA-F]{3,6}\b/g) ?? []).toEqual([])
  })
})
