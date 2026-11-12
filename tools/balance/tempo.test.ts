/**
 * Tempo-Test: der Simulator spielt das Spiel und prüft die Zielkorridore
 * (docs/spiele/lichtwarte/balance.md) und dass es keine Mauer gibt.
 */
import { describe, expect, it } from 'vitest'
import { balanceTargets, game, REALMS } from '../../games/lichtwarte/src/game'
import { checkTargets, checkWalls, registerRegions, simulate, type BalanceTarget } from './entry'

// Wie `npm run balance`: der Simulator spielt auch die Lande
registerRegions(game, REALMS.regions)

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
    // Lande als eigener Strang: Tempo mindestens zwei aktive Stunden je Land
    expect(checkWalls(r, 3, 120, Infinity, ['region'])).toEqual([])
  })
  it('regular lang: erstes Zeitalter nach drei bis fünf Wochen, Lange Nacht hat Ruhezeit', () => {
    const r = simulate(game, { profile: 'regular', hours: 35 * 24 })
    expect(checkTargets(r, balanceTargets.regularLong as readonly BalanceTarget[])).toEqual([])
    const nights = r.events.filter((e) => e.kind === 'prestige' && e.id === 'longNight').map((e) => e.at)
    for (let i = 1; i < nights.length; i++) expect(nights[i] - nights[i - 1]).toBeGreaterThanOrEqual(3 * 1440)
  })
  it('casual: Fortschritt auch bei kurzen Besuchen (erste Mondwende am ersten Tag, alle Bauwerke in 3 Wochen)', () => {
    const r = simulate(game, { profile: 'casual', hours: 21 * 24 })
    const first = r.events.find((e) => e.kind === 'prestige')
    expect(first && first.at < 24 * 60).toBe(true)
    expect(r.events.some((e) => e.kind === 'unlock' && e.id === 'sternwarte')).toBe(true)
  })
})
