/** Mini-Simulator-Lauf: beweist, dass der Simulator spielunabhängig ist und die Vorlage bis zur ersten Prestige-Schicht kommt. */
import { describe, expect, it } from 'vitest'
import { simulate } from '../../../tools/balance/sim'
import { game } from '../src/game'

describe('Vorlage im Simulator', () => {
  it('engaged erreicht die erste Prestige-Schicht und alle Erzeuger', () => {
    const r = simulate(game, { profile: 'engaged', hours: 1 })
    const first = r.events.find((e) => e.kind === 'prestige')
    expect(first, 'keine Prestige-Schicht erreicht').toBeDefined()
    expect(first!.active).toBeLessThan(30)
    expect(r.events.filter((e) => e.kind === 'unlock').map((e) => e.id)).toEqual(['p1', 'p2', 'p3'])
  })
  it('casual spielt mit Offline-Phasen weiter (Fortschritt auch abwesend)', () => {
    const r = simulate(game, { profile: 'casual', hours: 24 })
    expect(r.final.core.primaryLifetime).toBeGreaterThan(1000)
    expect((r.final.modules.offline as { claims: number }).claims).toBeGreaterThan(0)
  })
})
