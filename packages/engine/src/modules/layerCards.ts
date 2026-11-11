/**
 * Layer cards: after a run of `layer` (from `fromRuns` on) three cards are
 * offered; the picked one shapes the next run (effects), never the same card
 * twice in a row.
 */
import { isRecord } from '../state'
import type { EffectSource, EngineModule } from '../types'
import { prestigeState } from './prestige'

export interface CardDef {
  id: string
  effects: readonly { target: string; op: 'add' | 'mul'; value: number }[]
}

export interface CardConfig {
  layer: string
  fromRuns: number
  offer: number
  cards: readonly CardDef[]
}

export interface CardsState {
  offer: string[]
  active: string
  last: string
}

export const CARDS_ID = 'layerCards'

export function layerCardsModule(cfg: CardConfig): EngineModule<CardsState> {
  const byId = new Map(cfg.cards.map((c) => [c.id, c]))
  const valid = (v: unknown) => (typeof v === 'string' && byId.has(v) ? v : '')
  return {
    id: CARDS_ID,
    version: 1,
    init: () => ({ offer: [], active: '', last: '' }),
    parse: (raw) => {
      const r = isRecord(raw) ? raw : {}
      return { offer: Array.isArray(r.offer) ? r.offer.map(valid).filter(Boolean) : [], active: valid(r.active), last: valid(r.last) }
    },
    resetOn: 'keep',
    on: (s, e, ctx, w) => {
      if (e.type !== 'prestige.performed' || e.layer !== cfg.layer) return s
      const k = w.def.prestigeLayers.findIndex((l) => l.id === cfg.layer)
      // The card of the finished run ends here
      const base: CardsState = { offer: [], active: '', last: s.active || s.last }
      if ((prestigeState(w).layers[k]?.count ?? 0) < cfg.fromRuns) return base
      const pool = cfg.cards.filter((c) => c.id !== base.last)
      const offer: string[] = []
      while (offer.length < cfg.offer && pool.length) offer.push(pool.splice(ctx.rng.int(pool.length), 1)[0].id)
      return { ...base, offer }
    },
    effects: (s): EffectSource[] => (byId.get(s.active)?.effects ?? []).map((e, i) => ({ id: `card:${s.active}:${i}`, target: e.target, op: e.op, value: e.value, labelKey: `card.${s.active}` })),
    actions: {
      pick: (s, p) => {
        const id = (p as { id?: string } | undefined)?.id ?? ''
        return s.offer.includes(id) ? { offer: [], active: id, last: s.last } : s
      },
      // Go on without a card: the offer ends, nothing is active this run
      skip: (s) => (s.offer.length ? { offer: [], active: '', last: s.last } : s),
    },
    playtestEvents: [],
    sample: () => ({ offer: cfg.cards.slice(1, 1 + cfg.offer).map((c) => c.id), active: cfg.cards[0]?.id ?? '', last: '' }),
  }
}
