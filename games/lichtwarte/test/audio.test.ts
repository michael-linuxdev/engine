/** Ton (8 Effekte), Umgebungsklang (4 Schichten), Wetter (4 Arten) und Omen. */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { recipeProblems } from '@engine/react'
import { AMBIENCE, ambienceMix } from '../src/audio/ambience'
import { SFX, SFX_EVENTS } from '../src/audio/sfx'
import { OMENS } from '../src/content/world'
import { omenFor, weatherOf, weatherOverride, WEATHERS } from '../src/scene/weather'

const walk = (dir: string): string[] => readdirSync(dir).flatMap((n) => (statSync(join(dir, n)).isDirectory() ? walk(join(dir, n)) : n.endsWith('.ts') ? [join(dir, n)] : []))

const days = (year: number) =>
  Array.from({ length: 365 }, (_, i) => {
    const d = new Date(Date.UTC(year, 0, 1 + i))
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
  })

describe('Ton', () => {
  it('8 Effekte, alle hörbar, kurz und endlich', () => {
    expect(Object.keys(SFX)).toHaveLength(8)
    for (const [id, r] of Object.entries(SFX)) expect(recipeProblems(r), id).toEqual([])
  })
  it('jedes Ereignis spielt einen vorhandenen Effekt und kommt in der Engine wirklich vor', () => {
    // Alle Ereignis-Typen, die die Engine erzeugt (aus dem Quelltext gelesen)
    const known = new Set<string>()
    for (const f of walk(join(__dirname, '../../../packages/engine/src'))) for (const m of readFileSync(f, 'utf8').matchAll(/type: '([a-z]+\.[a-zA-Z]+)'/g)) known.add(m[1])
    for (const [type, id] of Object.entries(SFX_EVENTS)) {
      if (typeof id === 'string') expect(SFX[id], type).toBeDefined()
      expect(known.has(type), type).toBe(true)
    }
  })
  it('4 Ambiente-Schichten (Wind, Feuer, Wasser, Nacht), Pegel 0–1 in jeder Stimmung', () => {
    expect(AMBIENCE.map((l) => l.id)).toEqual(['wind', 'fire', 'water', 'night'])
    for (const l of AMBIENCE) for (const r of l.sporadic?.recipes ?? []) expect(recipeProblems(r), l.id).toEqual([])
    for (const daypart of ['dawn', 'day', 'evening', 'night'] as const)
      for (const season of ['winter', 'spring', 'summer', 'autumn'] as const)
        for (const w of WEATHERS) {
          const m = ambienceMix({ daypart, season }, w)
          for (const l of AMBIENCE) expect(m[l.id]).toBeGreaterThanOrEqual(0)
          for (const l of AMBIENCE) expect(m[l.id]).toBeLessThanOrEqual(1)
        }
  })
})

describe('Wetter', () => {
  it('4 Arten, je Tag fest; übers Jahr kommen alle vor, klar am häufigsten', () => {
    const year = days(2027).map(weatherOf)
    for (const w of WEATHERS) expect(year.filter((x) => x === w).length, w).toBeGreaterThan(15)
    expect(year.filter((x) => x === 'clear').length).toBeGreaterThan(year.filter((x) => x === 'mist').length)
    expect(weatherOf('2027-03-14')).toBe(weatherOf('2027-03-14'))
    expect(weatherOverride('?weather=rain', 'clear')).toBe('rain')
    expect(weatherOverride('?weather=hail', 'clear')).toBe('clear')
  })
  it('das Wetter bestimmt das Omen: nur bekannte Omen, Regen ohne Omen, alle drei kommen vor', () => {
    const ids = new Set(OMENS.list.map((o) => o.id))
    const seen = new Set<string>()
    for (const d of days(2027)) {
      const o = omenFor(d)
      if (weatherOf(d) === 'rain') expect(o).toBe('')
      if (o) {
        expect(ids.has(o), o).toBe(true)
        seen.add(o)
      }
    }
    expect([...seen].sort()).toEqual([...ids].sort())
    expect(OMENS.pick).toBe(omenFor)
  })
})
