/**
 * Links: a chain of connections between neighbouring places (e.g. regions).
 * Each link has levels; a level needs a rating in BOTH places (the game says
 * how a place is rated, e.g. mastery stars) and costs a currency. Every level
 * adds income, and the longest unbroken run of lit links adds more on top,
 * so closing a gap is worth more than starting a new end.
 */
import { act } from '../result'
import { isRecord, parseInt0 } from '../state'
import type { EffectSource, EngineModule, WorldView } from '../types'

export interface LinkDef {
  id: string
  /** The two places this link connects. */
  a: string
  b: string
}

export interface LinksConfig {
  /** In chain order: link n connects to link n+1. IDs are append-only. */
  list: readonly LinkDef[]
  /** Rating both places need for level 1, 2, … (length = highest level). */
  needs: readonly number[]
  cost: { currency: string; base: number; growth: number }
  /** Income added per lit level (0.02 = +2 %). */
  perLevel: number
  /** Income added per link in the longest unbroken run. */
  perChain: number
  /** Rating of a place right now. */
  rating: (w: WorldView, place: string) => number
}

export interface LinksState {
  levels: Record<string, number>
}

export const LINKS_ID = 'links'

export function linkLevels(s: LinksState | undefined): number {
  let sum = 0
  for (const n of Object.values(s?.levels ?? {})) sum += n
  return sum
}

/** Longest run of neighbouring links that are lit at all. */
export function longestChain(cfg: LinksConfig, s: LinksState | undefined): number {
  let best = 0
  let run = 0
  for (const l of cfg.list) {
    run = (s?.levels[l.id] ?? 0) > 0 ? run + 1 : 0
    if (run > best) best = run
  }
  return best
}

export function linksMult(cfg: LinksConfig, s: LinksState | undefined): number {
  return 1 + cfg.perLevel * linkLevels(s) + cfg.perChain * longestChain(cfg, s)
}

export function linkCost(cfg: LinksConfig, s: LinksState | undefined): number {
  return Math.round(cfg.cost.base * Math.pow(cfg.cost.growth, linkLevels(s)))
}

export interface LinkStatus {
  level: number
  max: number
  /** Rating both places need for the next level, `null` at the highest level. */
  need: number | null
  haveA: number
  haveB: number
  cost: number
  /** Next level can be lit now (rating and currency). */
  ready: boolean
}

export function linkStatus(cfg: LinksConfig, s: LinksState | undefined, w: WorldView, def: LinkDef): LinkStatus {
  const level = s?.levels[def.id] ?? 0
  const need = cfg.needs[level] ?? null
  const haveA = cfg.rating(w, def.a)
  const haveB = cfg.rating(w, def.b)
  const cost = linkCost(cfg, s)
  const ready = need !== null && haveA >= need && haveB >= need && w.balance(cfg.cost.currency) >= cost
  return { level, max: cfg.needs.length, need, haveA, haveB, cost, ready }
}

/** At least one link could be lit right now. */
export function linkReady(cfg: LinksConfig, s: LinksState | undefined, w: WorldView): boolean {
  return cfg.list.some((l) => linkStatus(cfg, s, w, l).ready)
}

export function linksModule(cfg: LinksConfig): EngineModule<LinksState> {
  const byId = new Map(cfg.list.map((l) => [l.id, l]))
  return {
    id: LINKS_ID,
    version: 1,
    init: () => ({ levels: {} }),
    parse: (raw) => {
      const src = isRecord(raw) && isRecord(raw.levels) ? raw.levels : {}
      const levels: Record<string, number> = {}
      for (const l of cfg.list) {
        const n = parseInt0(src[l.id], 0, cfg.needs.length)
        if (n > 0) levels[l.id] = n
      }
      return { levels }
    },
    resetOn: 'keep',
    effects: (s): EffectSource[] => {
      const mult = linksMult(cfg, s)
      return mult > 1 ? [{ id: 'links', target: 'income', op: 'mul', value: mult, labelKey: 'effect.links' }] : []
    },
    actions: {
      light: (s, p, _ctx, world) => {
        const def = byId.get((p as { id?: string } | undefined)?.id ?? '')
        if (!def) return s
        const st = linkStatus(cfg, s, world, def)
        if (!st.ready) return s
        const next: LinksState = { levels: { ...s.levels, [def.id]: st.level + 1 } }
        return act(next, {
          spend: [{ currency: cfg.cost.currency, amount: st.cost }],
          events: [{ type: 'link.lit', id: def.id, level: st.level + 1, total: linkLevels(next), chain: longestChain(cfg, next) }],
        })
      },
    },
    playtestEvents: ['link.lit'],
    sample: () => ({ levels: cfg.list[0] ? { [cfg.list[0].id]: 1 } : {} }),
  }
}
