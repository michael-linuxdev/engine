/** Lande: Kette der Öffnungen, Daten vollständig, Taktung im Simulator. */
import { describe, expect, it } from 'vitest'
import { createManualClock, createState, tick, type RegionsState } from '@engine/core'
import { game } from '../src/game'
import { REALM_AREAS, REALM_IDS, REALMS } from '../src/content/realms'
import { realmsDe } from '../src/i18n/realms.de'
import { realmsEn } from '../src/i18n/realms.en'
import { registerRegions, simulate } from '../../../tools/balance/sim'

describe('Lande', () => {
  it('99 Lande (+ Talkarte = 100) mit je 10 Bereichen und Texten de/en', () => {
    expect(REALM_IDS).toHaveLength(99)
    for (const id of REALM_IDS) {
      expect(REALM_AREAS[id]).toHaveLength(10)
      for (const a of REALM_AREAS[id]) {
        expect(realmsDe.lands[id].areas[a as keyof (typeof realmsDe.lands)[typeof id]['areas']], `${id}.${a} de`).toBeTruthy()
        expect((realmsEn.lands[id].areas as Record<string, string>)[a], `${id}.${a} en`).toBeTruthy()
      }
    }
  })
  it('ein Land öffnet das nächste, wenn dort der 8. Bereich auf Stufe 25 steht', () => {
    const clock = createManualClock(Date.UTC(2026, 10, 9, 8))
    let s = createState(game, clock)
    const layers = (s.modules.prestige as { layers: { count: number; runEarned: number; sinceReset: number }[] }).layers.map((l, i) => (i === 1 ? { ...l, count: 1 } : l))
    s = { ...s, modules: { ...s.modules, prestige: { layers } } }
    s = tick(game, s, 250, clock).state
    const r = s.modules.regions as RegionsState
    expect(r.regions.moorgrund.open).toBe(true)
    expect(r.regions.kieselbach.open).toBe(false)
    const owned = Object.fromEntries(REALMS.regions[0].areas.map((a, i) => [a.id, i <= 7 ? 25 : 0]))
    s = { ...s, modules: { ...s.modules, regions: { regions: { ...r.regions, moorgrund: { ...r.regions.moorgrund, owned } } } } }
    s = tick(game, s, 250, clock).state
    expect((s.modules.regions as RegionsState).regions.kieselbach.open).toBe(true)
  })
  it('Taktung: bei regular öffnen sich nach der Langen Nacht weitere Lande über Tage', () => {
    registerRegions(game, [...REALMS.regions])
    const r = simulate(game, { profile: 'regular', hours: 21 * 24 })
    const opened = r.events.filter((e) => e.kind === 'region')
    expect(opened.length).toBeGreaterThanOrEqual(3)
    // nicht alle auf einmal: zwischen dem ersten und dritten Land liegt mindestens ein halber Tag
    expect(opened[2].at - opened[0].at).toBeGreaterThan(12 * 60)
  })
})
