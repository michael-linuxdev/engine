/**
 * Späte Taktung (Tag 35 bis Tag 90, Profil regular): Lande öffnen sich weiter alle
 * zwei bis drei Tage, kein Loch über vier Tage, das zweite Zeitalter kommt deutlich
 * vor Tag 60 (docs/spiele/lichtwarte/balance.md).
 * Eigene Datei, damit der lange Lauf neben tempo.test.ts in einem eigenen Worker läuft.
 */
import { describe, expect, it } from 'vitest'
import { balanceTargets, game, lateTargets, REALMS } from '../../games/lichtwarte/src/game'
import { LAYER } from '../../games/lichtwarte/src/ids'
import { checkTargets, largestGoalGap, registerRegions, simulate, type BalanceTarget } from './entry'

registerRegions(game, REALMS.regions)

const DAY = 1440
/** „Tag N“ beginnt bei Minute (N − 1) · 1440 und endet bei N · 1440. */
const endOfDay = (n: number) => n * DAY

describe('Späte Taktung (Simulator gegen die echte Engine)', () => {
  it('regular 90 Tage: Lande alle zwei bis drei Tage, kein Loch über vier Tage, Zeitalter 2 und 3', { timeout: 240_000 }, () => {
    const r = simulate(game, { profile: 'regular', hours: 90 * 24 })
    // Zeitalter 2 und 3 im Korridor
    expect(checkTargets(r, balanceTargets.regularLate as readonly BalanceTarget[])).toEqual([])

    const lands = r.events.filter((e) => e.kind === 'region')
    // + 1: die Talkarte ist Land 1
    const openAt = (day: number) => lands.filter((e) => e.at <= endOfDay(day)).length + 1
    expect(openAt(60)).toBeGreaterThanOrEqual(lateTargets.landsDay60.min)
    expect(openAt(60)).toBeLessThanOrEqual(lateTargets.landsDay60.max)
    expect(openAt(90)).toBeGreaterThanOrEqual(lateTargets.landsDay90.min)
    // Die Lande sind nicht zu früh aufgebraucht
    if (lands.length === REALMS.regions.length) expect(lands[lands.length - 1].at).toBeGreaterThanOrEqual((lateTargets.lastLandNotBeforeDay - 1) * DAY)

    // Kein Loch: neues Land, erster Lauf einer Schicht oder ein weiteres Zeitalter
    const hole = largestGoalGap(r, endOfDay(35), endOfDay(90), [LAYER.ages])
    expect(hole.gap, `Loch von Tag ${(hole.from / DAY + 1).toFixed(1)} bis Tag ${(hole.to / DAY + 1).toFixed(1)}`).toBeLessThanOrEqual(lateTargets.maxGapDays * DAY)

    // Im Schnitt alle zwei bis drei Tage ein Land (Tag 35 bis Tag 90)
    const late = lands.filter((e) => e.at > endOfDay(35) && e.at <= endOfDay(90)).length
    const perLand = (90 - 35) / late
    expect(perLand).toBeGreaterThanOrEqual(2)
    expect(perLand).toBeLessThanOrEqual(3.2)
  })
})
