/** Decor: pieces bought (or granted by events), placed on a number of slots; placed pieces add bonuses. */
import { act } from '../result'
import { isRecord } from '../state'
import type { Amount, EffectSource, EngineModule } from '../types'

export interface DecorItem {
  id: string
  /** null = cannot be bought (exclusive, granted via `decor.granted`). */
  cost: Amount | null
  bonus: number
}

export interface DecorConfig {
  items: readonly DecorItem[]
  slots: number
}

export interface DecorState {
  owned: string[]
  /** Item id per slot ('' = empty). */
  placed: string[]
}

export const DECOR_ID = 'decor'

export function decorModule(cfg: DecorConfig): EngineModule<DecorState> {
  const byId = new Map(cfg.items.map((i) => [i.id, i]))
  const empty = () => Array.from({ length: cfg.slots }, () => '')
  return {
    id: DECOR_ID,
    version: 1,
    init: () => ({ owned: [], placed: empty() }),
    parse: (raw) => {
      const r = isRecord(raw) ? raw : {}
      const owned = Array.isArray(r.owned) ? [...new Set(r.owned.filter((x): x is string => typeof x === 'string' && byId.has(x)))] : []
      const placedRaw = Array.isArray(r.placed) ? r.placed : []
      const placed = empty().map((_, i) => {
        const v = placedRaw[i]
        return typeof v === 'string' && owned.includes(v) ? v : ''
      })
      // A piece sits on one slot at most
      const seen = new Set<string>()
      return { owned, placed: placed.map((v) => (v && !seen.has(v) ? (seen.add(v), v) : '')) }
    },
    resetOn: 'keep',
    on: (s, e) => (e.type === 'decor.granted' && typeof e.id === 'string' && byId.has(e.id) && !s.owned.includes(e.id) ? { ...s, owned: [...s.owned, e.id] } : s),
    effects: (s): EffectSource[] => {
      const bonus = s.placed.reduce((a, id) => a + (byId.get(id)?.bonus ?? 0), 0)
      return bonus > 0 ? [{ id: 'decor', target: 'rate:*', op: 'mul', value: 1 + bonus, labelKey: 'effect.decor' }] : []
    },
    actions: {
      buy: (s, p) => {
        const item = byId.get((p as { id?: string } | undefined)?.id ?? '')
        if (!item || !item.cost || s.owned.includes(item.id)) return s
        return act({ ...s, owned: [...s.owned, item.id] }, { spend: [item.cost], events: [{ type: 'decor.bought', id: item.id }] })
      },
      place: (s, p) => {
        const { slot, id } = (p ?? {}) as { slot?: number; id?: string }
        if (typeof slot !== 'number' || slot < 0 || slot >= cfg.slots) return s
        if (id && !s.owned.includes(id)) return s
        const placed = s.placed.map((v, i) => (i === slot ? (id ?? '') : v === id ? '' : v))
        return { ...s, placed }
      },
    },
    playtestEvents: ['decor.bought'],
    sample: () => ({ owned: cfg.items.slice(0, 2).map((i) => i.id), placed: empty().map((_, i) => (i === 0 ? (cfg.items[0]?.id ?? '') : '')) }),
  }
}
