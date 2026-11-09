/**
 * Combine ("alchemy"): pick two found collection entries; a known recipe
 * brews in real time (also offline) and yields a new entry. Unknown pairs
 * fizzle into a small consolation grant. Skipping the wait costs currency.
 */
import { act } from '../result'
import { isRecord, parseInt0, parseTime } from '../state'
import type { Amount, EngineModule } from '../types'
import { COLLECTIONS_ID, type CollectionsState } from './collections'

export interface Recipe {
  id: string
  a: string
  b: string
  result: string
  durationMs: number
}

export interface CombineConfig {
  recipes: readonly Recipe[]
  fizzle: readonly Amount[]
  skipCost: Amount
}

export interface CombineState {
  recipe: string
  until: number
  brewed: number
}

export const COMBINE_ID = 'combine'

export function findRecipe(cfg: CombineConfig, a: string, b: string): Recipe | undefined {
  return cfg.recipes.find((r) => (r.a === a && r.b === b) || (r.a === b && r.b === a))
}

export function combineModule(cfg: CombineConfig): EngineModule<CombineState> {
  const byId = new Map(cfg.recipes.map((r) => [r.id, r]))
  const finish = (s: CombineState, now: number) => {
    const r = byId.get(s.recipe)
    if (!r || now < s.until) return s
    return act({ recipe: '', until: 0, brewed: s.brewed + 1 }, { events: [{ type: 'collection.found', id: r.result, source: 'combine' }, { type: 'combine.done', id: r.id }] })
  }
  return {
    id: COMBINE_ID,
    version: 1,
    init: () => ({ recipe: '', until: 0, brewed: 0 }),
    parse: (raw) => {
      const r = isRecord(raw) ? raw : {}
      const recipe = typeof r.recipe === 'string' && byId.has(r.recipe) ? r.recipe : ''
      return { recipe, until: recipe ? parseTime(r.until, 0) : 0, brewed: parseInt0(r.brewed) }
    },
    resetOn: 'keep',
    tick: (s, _dt, ctx) => (s.recipe ? finish(s, ctx.clock.now()) : s),
    onOffline: (s, _ms, ctx) => (s.recipe ? finish(s, ctx.clock.now()) : s),
    actions: {
      start: (s, p, ctx, w) => {
        const { a, b } = (p ?? {}) as { a?: string; b?: string }
        if (s.recipe || !a || !b || a === b) return s
        const found = w.get<CollectionsState | undefined>(COLLECTIONS_ID)?.found ?? {}
        if (!found[a] || !found[b]) return s
        const r = findRecipe(cfg, a, b)
        if (!r) return act(s, { grant: cfg.fizzle.map((g) => ({ ...g, source: 'combine' })), events: [{ type: 'combine.fizzle' }] })
        return act({ ...s, recipe: r.id, until: ctx.clock.now() + r.durationMs }, { events: [{ type: 'combine.started', id: r.id }] })
      },
      skip: (s, _p, ctx) => (s.recipe ? act({ ...s, until: ctx.clock.now() }, { spend: [cfg.skipCost] }) : s),
    },
    playtestEvents: ['combine.started', 'combine.done'],
    sample: () => ({ recipe: cfg.recipes[0]?.id ?? '', until: cfg.recipes[0] ? 1_800_000_100_000 : 0, brewed: 3 }),
  }
}
