/** Store-Vorbereitung: Texte (Längen), Icons (Größen), Datenschutz-Seite synchron, Manifest. */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { privacyHtml } from '@engine/ui'
import { engineDe } from '../../../packages/ui-kit/src/i18n/de'
import { engineEn } from '../../../packages/ui-kit/src/i18n/en'
import { BRAND } from '../src/brand'
import { IMPRINT, PRIVACY_PAGE } from '../src/legal'
import { LISTING } from '../src/store/listing'

const PUB = join(__dirname, '..', 'public')

/** Breite × Höhe aus dem PNG-Kopf. */
function pngSize(file: string): [number, number] {
  const b = readFileSync(file)
  expect(b.subarray(1, 4).toString()).toBe('PNG')
  return [b.readUInt32BE(16), b.readUInt32BE(20)]
}

describe('Store: Texte', () => {
  for (const lang of ['de', 'en'] as const) {
    it(`${lang}: Längen der Store-Felder`, () => {
      const l = LISTING[lang]
      expect(l.title).toBe(BRAND[lang])
      expect(l.title.length).toBeLessThanOrEqual(30)
      expect(l.subtitle.length).toBeLessThanOrEqual(30)
      expect(l.short.length).toBeLessThanOrEqual(80)
      expect(l.description.length).toBeLessThanOrEqual(4000)
      expect(l.description.length).toBeGreaterThan(800)
      expect(l.keywords.length).toBeLessThanOrEqual(100)
      expect(l.whatsNew.length).toBeLessThanOrEqual(500)
      for (const [k, v] of Object.entries(l)) expect(v.trim(), k).not.toBe('')
    })
  }
  it('beide Sprachen haben gleich viele Absätze und Punkte', () => {
    const shape = (s: string) => s.split('\n').map((x) => (x.startsWith('•') ? '•' : x ? 'T' : '')).join('')
    expect(shape(LISTING.de.description)).toBe(shape(LISTING.en.description))
  })
})

describe('Store: Icons', () => {
  it('PWA-, Apple- und Store-Icons in den richtigen Größen', () => {
    const want: Record<string, number> = { 'icon-192.png': 192, 'icon-512.png': 512, 'maskable-512.png': 512, 'apple-touch-180.png': 180, 'store-ios-1024.png': 1024, 'store-play-512.png': 512 }
    for (const [f, n] of Object.entries(want)) expect(pngSize(join(PUB, 'icons', f)), f).toEqual([n, n])
  })
  it('Manifest und HTML verweisen auf die Icons', () => {
    const cfg = readFileSync(join(__dirname, '..', 'vite.config.mjs'), 'utf8')
    for (const f of ['icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png']) expect(cfg).toContain(f)
    expect(readFileSync(join(__dirname, '..', 'index.html'), 'utf8')).toContain('icons/apple-touch-180.png')
  })
})

describe('Store: Rechtliches', () => {
  it('die Datenschutz-Seite (beim Build erzeugt) enthält alle Punkte beider Sprachen und das Impressum bzw. den Hinweis', () => {
    const html = privacyHtml({ title: { de: BRAND.de, en: BRAND.en }, de: engineDe.legal, en: engineEn.legal, imprint: IMPRINT })
    for (const x of [...engineDe.legal.privacyItems, ...engineEn.legal.privacyItems]) expect(html).toContain(x.replace(/&/g, '&amp;').replace(/"/g, '&quot;'))
    expect(html).toContain(IMPRINT ? IMPRINT.de.split('\n')[0] : engineDe.legal.imprintMissing)
    expect(html).toContain('<section lang="en">')
    expect(readFileSync(join(__dirname, '..', 'vite.config.mjs'), 'utf8')).toContain('PRIVACY_PAGE')
    expect(PRIVACY_PAGE).toBe('datenschutz.html')
  })
  it('Datenschutz in beiden Sprachen gleich lang gegliedert', () => {
    expect(engineDe.legal.privacyItems.length).toBe(engineEn.legal.privacyItems.length)
    expect(engineDe.legal.privacyItems.length).toBeGreaterThanOrEqual(5)
  })
})
