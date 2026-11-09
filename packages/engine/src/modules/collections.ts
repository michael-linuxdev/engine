/**
 * Collections: entries found by chance on manual buys (by rarity), one
 * guaranteed new entry per run of `layer`, and from other systems via the
 * `collection.found` event (fest shop, alchemy). Each entry adds a small
 * permanent bonus; a complete category adds a set bonus.
 */
import { act } from '../result'
import { isRecord, parseNumRecord } from '../state'
import type { EffectSource, EngineModule } from '../types'

export interface CollectionEntry {
  id: string
  category: string
  rarity: 0 | 1 | 2
  /** Where it can come from: random buys or only via events (fest, alchemy …). */
  source: 'buy' | 'event'
}

export interface CollectionConfig {
  entries: readonly CollectionEntry[]
  /** Chance per manual buy by rarity. */
  chance: readonly [number, number, number]
  /** Bonus per entry by rarity (0.005 = +0.5 %). */
  bonus: readonly [number, number, number]
  setBonus: number
  /** Layer that grants one guaranteed new entry per run. */
  layer: string
}

export interface CollectionsState {
  found: Record<string, number>
}

export const COLLECTIONS_ID = 'collections'

export function collectionsModule(cfg: CollectionConfig): EngineModule<CollectionsState> {
  const ids = cfg.entries.map((e) => e.id)
  const byId = new Map(cfg.entries.map((e) => [e.id, e]))
  const add = (s: CollectionsState, id: string) => {
    const n = s.found[id] ?? 0
    return act({ found: { ...s.found, [id]: n + 1 } }, { events: [{ type: n === 0 ? 'collection.new' : 'collection.again', id }] })
  }
  return {
    id: COLLECTIONS_ID,
    version: 1,
    init: () => ({ found: {} }),
    parse: (raw) => ({ found: parseNumRecord(isRecord(raw) ? raw.found : undefined, ids, true) }),
    resetOn: 'keep',
    on: (s, e, ctx) => {
      if (e.type === 'collection.found' && typeof e.id === 'string' && byId.has(e.id)) return add(s, e.id)
      if (e.type === 'prestige.performed' && e.layer === cfg.layer) {
        const missing = cfg.entries.filter((x) => x.source === 'buy' && !s.found[x.id])
        if (!missing.length) return s
        return add(s, missing[ctx.rng.int(missing.length)].id)
      }
      if (e.type !== 'producer.bought' || e.source !== 'manual') return s
      // One roll per buy action: rarest first.
      const roll = ctx.rng.next()
      for (const rarity of [2, 1, 0] as const) {
        if (roll >= cfg.chance[rarity]) continue
        const pool = cfg.entries.filter((x) => x.source === 'buy' && x.rarity === rarity)
        if (pool.length) return add(s, pool[ctx.rng.int(pool.length)].id)
      }
      return s
    },
    effects: (s) => {
      let bonus = 0
      for (const e of cfg.entries) if (s.found[e.id]) bonus += cfg.bonus[e.rarity]
      const cats = new Set(cfg.entries.map((e) => e.category))
      for (const c of cats) if (cfg.entries.filter((e) => e.category === c).every((e) => s.found[e.id])) bonus += cfg.setBonus
      const out: EffectSource[] = []
      if (bonus > 0) out.push({ id: 'collections', target: 'rate:*', op: 'mul', value: 1 + bonus, labelKey: 'effect.collections' })
      return out
    },
    playtestEvents: ['collection.new'],
    sample: () => ({ found: Object.fromEntries(ids.slice(0, 3).map((id, i) => [id, i + 1])) }),
  }
}

export function collectionProgress(s: CollectionsState | undefined, cfg: CollectionConfig, category?: string): { found: number; total: number } {
  const list = cfg.entries.filter((e) => !category || e.category === category)
  return { found: list.filter((e) => (s?.found[e.id] ?? 0) > 0).length, total: list.length }
}
