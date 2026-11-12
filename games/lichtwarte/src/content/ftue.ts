/**
 * Geführter Einstieg (6 Schritte wie die Referenz). Bedingungen auf dem Spielstand bzw. Gerätemerkern.
 * Erst wird gebaut, dann gelesen: Die erste Chronik-Seite ist der Lohn für die Kräuterkate, nicht ihr Eintrittspreis.
 */
import { MODULE, ownedOf, type BurstState, type WorldView } from '@engine/core'

export type FtueId = 'welcome' | 'build' | 'burst' | 'unlock' | 'offline' | 'prestige'

export function ftueSteps(chronicleRead: (id: string) => boolean, tabSeen: (id: string) => boolean): { id: FtueId; done: (w: WorldView) => boolean }[] {
  return [
    { id: 'build', done: (w) => ownedOf(w, 'kraeuterkate') >= 1 },
    { id: 'welcome', done: () => chronicleRead('welcome') },
    { id: 'burst', done: (w) => (w.get<BurstState>(MODULE.burst)?.uses ?? 0) >= 1 },
    { id: 'unlock', done: (w) => ownedOf(w, 'holzlager') >= 1 },
    { id: 'offline', done: (w) => ownedOf(w, 'holzlager') >= 1 && w.core.primaryLifetime > 2_000 },
    { id: 'prestige', done: () => tabSeen('prestige') },
  ]
}
