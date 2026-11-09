/**
 * Challenges: voluntary runs with a restriction. Start one, finish the run
 * with a prestige of `layer` while respecting it → permanent bonus.
 * Restrictions are enforced by vetoing actions (`guard`).
 */
import { act } from '../result'
import { isRecord } from '../state'
import type { DispatchRequest, EffectSource, EngineModule, WorldView } from '../types'
import { MODULE } from './ids'
import { ownedOf, producersOnline } from './producers'
import { prestigeState } from './prestige'

export type Restriction = { kind: 'banProducer'; id: string } | { kind: 'maxProducers'; n: number } | { kind: 'noBurst' }

export interface ChallengeDef {
  id: string
  restriction: Restriction
  /** Lifetime runs of `layer` before the challenge is offered. */
  fromRuns: number
  bonus: number
}

export interface ChallengeConfig {
  layer: string
  list: readonly ChallengeDef[]
}

export interface ChallengesState {
  active: string | null
  done: string[]
}

export const CHALLENGES_ID = 'challenges'

/** Would the current run already break the restriction? */
export function violates(r: Restriction, w: WorldView): boolean {
  switch (r.kind) {
    case 'banProducer':
      return ownedOf(w, r.id) > 0
    case 'maxProducers':
      return producersOnline(w) > r.n
    case 'noBurst':
      return false
  }
}

function blocks(r: Restriction, req: DispatchRequest, w: WorldView): boolean {
  if (r.kind === 'noBurst') return req.module === MODULE.burst && req.type === 'use'
  if (req.module !== MODULE.producers || req.type !== 'buy') return false
  const id = (req.payload as { id?: string } | undefined)?.id ?? ''
  if (r.kind === 'banProducer') return id === r.id
  return ownedOf(w, id) === 0 && producersOnline(w) >= r.n
}

export function challengeAvailable(cfg: ChallengeConfig, c: ChallengeDef, w: WorldView): boolean {
  const k = w.def.prestigeLayers.findIndex((l) => l.id === cfg.layer)
  return (prestigeState(w).layers[k]?.count ?? 0) >= c.fromRuns
}

export function challengesModule(cfg: ChallengeConfig): EngineModule<ChallengesState> {
  const byId = new Map(cfg.list.map((c) => [c.id, c]))
  return {
    id: CHALLENGES_ID,
    version: 1,
    init: () => ({ active: null, done: [] }),
    parse: (raw) => {
      const r = isRecord(raw) ? raw : {}
      const done = Array.isArray(r.done) ? [...new Set(r.done.filter((x): x is string => typeof x === 'string' && byId.has(x)))] : []
      return { active: typeof r.active === 'string' && byId.has(r.active) ? r.active : null, done }
    },
    resetOn: 'keep',
    guard: (s, req, w) => {
      const c = s.active ? byId.get(s.active) : undefined
      return !c || !blocks(c.restriction, req, w)
    },
    on: (s, e) => {
      if (e.type !== 'prestige.performed' || e.layer !== cfg.layer || !s.active) return s
      const id = s.active
      return act({ active: null, done: s.done.includes(id) ? s.done : [...s.done, id] }, { events: [{ type: 'challenge.done', id }] })
    },
    effects: (s) => {
      const bonus = cfg.list.filter((c) => s.done.includes(c.id)).reduce((a, c) => a + c.bonus, 0)
      const out: EffectSource[] = []
      if (bonus > 0) out.push({ id: 'challenges', target: 'rate:*', op: 'mul', value: 1 + bonus, labelKey: 'effect.challenges' })
      return out
    },
    actions: {
      start: (s, p, _ctx, w) => {
        const c = byId.get((p as { id?: string } | undefined)?.id ?? '')
        if (!c || s.active || s.done.includes(c.id) || !challengeAvailable(cfg, c, w) || violates(c.restriction, w)) return s
        return act({ ...s, active: c.id }, { events: [{ type: 'challenge.started', id: c.id }] })
      },
      abandon: (s) => (s.active ? { ...s, active: null } : s),
    },
    playtestEvents: ['challenge.started', 'challenge.done'],
    sample: () => ({ active: cfg.list[1]?.id ?? null, done: cfg.list[0] ? [cfg.list[0].id] : [] }),
  }
}
