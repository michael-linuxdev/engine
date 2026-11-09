/**
 * Tempo-Test: der Simulator spielt das Spiel und prüft die Zielkorridore
 * (docs/spiele/lichtwarte/balance.md) und dass es keine Mauer gibt.
 */
import { describe, expect, it } from 'vitest'
import { balanceTargets, game } from '../../games/lichtwarte/src/game'
import { checkTargets, checkWalls, simulate, type BalanceTarget } from './entry'

describe('Tempo (Simulator gegen die echte Engine)', () => {
  it('engaged: frühe Ziele und keine Mauer in 72 h', () => {
    const r = simulate(game, { profile: 'engaged', hours: 72 })
    expect(checkTargets(r, balanceTargets.engaged as readonly BalanceTarget[])).toEqual([])
    expect(checkWalls(r)).toEqual([])
  })
  it('regular: alle Bauwerke um Tag 5, Lange Nacht um Tag 9, keine Mauer', () => {
    const r = simulate(game, { profile: 'regular', hours: 12 * 24 })
    expect(checkTargets(r, balanceTargets.regular as readonly BalanceTarget[])).toEqual([])
    expect(checkWalls(r)).toEqual([])
  })
  it('casual: Fortschritt auch bei kurzen Besuchen (erste Mondwende am ersten Tag, alle Bauwerke in 3 Wochen)', () => {
    const r = simulate(game, { profile: 'casual', hours: 21 * 24 })
    const first = r.events.find((e) => e.kind === 'prestige')
    expect(first && first.at < 24 * 60).toBe(true)
    expect(r.events.some((e) => e.kind === 'unlock' && e.id === 'sternwarte')).toBe(true)
  })
})
