/**
 * Meta shop: items bought with a meta currency, kept across prestige.
 *
 * Ranks open gradually during each rebuild: "unlock progress" counts
 * producer levels (primary clock) plus a √-capped share of the run's primary,
 * so a late snowball cannot open the whole tree at once. A tip band — ranks
 * open right after a prestige — grows with the layer count, so the shop is
 * never empty after a prestige (recommendation band).
 */
import { act } from '../result'
import { isRecord, parseInt0 } from '../state'
import type { EffectSource, EngineModule, MetaItemDef, StateView, WorldView } from '../types'
import { MODULE } from './ids'
import { layerIndex, prestigeState } from './prestige'
import { producerLevelsTotal, producersOnline } from './producers'

export interface MetaShopState {
  ranks: Record<string, number>
}

export function metaCost(item: MetaItemDef, rank: number): number {
  return Math.ceil(item.cost.base * Math.pow(item.cost.growth, Math.max(0, rank)))
}

/** Lifetime runs of the layer that drives the meta shop. */
export function metaLayerCount(view: StateView): number {
  const k = layerIndex(view.def, view.def.balance.metaShop.layer)
  return k >= 0 ? (prestigeState(view).layers[k]?.count ?? 0) : 0
}

export function tipDepth(count: number): number {
  return Math.max(1, Math.floor(Math.max(0, count)))
}

export function isTipRank(item: MetaItemDef, rank: number, count: number): boolean {
  if (rank < 0) return false
  const tip = item.unlock?.tip
  if (tip === 'free') return true
  const depth = tipDepth(count)
  if (tip === 'immediate') return rank < depth
  if (tip === 'wave2') return count >= 2 && rank < depth - 1
  return false
}

/** Unlock progress needed before buying `rank` (0-based). */
export function rankUnlockNeed(item: MetaItemDef, rank: number, count: number, view: StateView): number {
  if (isTipRank(item, rank, count)) return 0
  const c = view.def.balance.metaShop
  const credit = Math.max(0, count) * c.perPrestige
  const lin = item.unlock?.linear
  if (lin) return Math.max(0, lin.base + rank * lin.step - credit)
  const offset = item.unlock?.offset ?? 0
  const raw = rank === 0 ? c.firstRankBase + Math.floor(offset / 2) : offset + c.rankBase + (rank - 1) * (c.rankStep + rank * c.rankStepGrowth)
  return Math.max(0, raw - credit)
}

export function unlockProgress(view: StateView): number {
  const c = view.def.balance.metaShop
  const levels = producerLevelsTotal(view) * c.perProducerLevel
  const prim = Math.min(c.primaryCap, Math.floor(Math.sqrt(Math.max(0, view.core.primaryRun) / c.primarySqrtDiv)))
  return levels + prim
}

export function rankOf(view: StateView, id: string): number {
  return view.get<MetaShopState | undefined>(MODULE.metaShop)?.ranks[id] ?? 0
}

export function isRankUnlocked(view: StateView, item: MetaItemDef, rank: number): boolean {
  if (rank < 0 || rank >= item.maxRank) return false
  if (item.unlock?.producersOnline && producersOnline(view) < item.unlock.producersOnline) return false
  return unlockProgress(view) >= rankUnlockNeed(item, rank, metaLayerCount(view), view)
}

export function canBuyMeta(view: StateView, item: MetaItemDef): boolean {
  const rank = rankOf(view, item.id)
  return isRankUnlocked(view, item, rank) && view.balance(item.currency) >= metaCost(item, rank)
}

export function countAffordableMeta(view: StateView): number {
  return view.def.metaShop.filter((i) => canBuyMeta(view, i)).length
}

export interface NextMetaUnlock {
  item: MetaItemDef
  rank: number
  need: number
  have: number
  ratio: number
}

export function nextLockedMeta(view: StateView): NextMetaUnlock | null {
  const have = unlockProgress(view)
  const count = metaLayerCount(view)
  let best: NextMetaUnlock | null = null
  for (const item of view.def.metaShop) {
    const rank = rankOf(view, item.id)
    if (rank >= item.maxRank) continue
    const need = rankUnlockNeed(item, rank, count, view)
    if (have >= need && !(item.unlock?.producersOnline && producersOnline(view) < item.unlock.producersOnline)) continue
    const cand = { item, rank, need: Math.max(1, need), have, ratio: need > 0 ? Math.min(1, have / need) : 0 }
    if (!best || cand.need < best.need) best = cand
  }
  return best
}

/** Effect value of an item at a rank. */
export function metaEffects(item: MetaItemDef, rank: number): EffectSource[] {
  if (rank <= 0) return []
  return item.effects.map((e, i) => ({
    id: `meta:${item.id}:${i}`,
    target: e.target,
    op: e.kind === 'add' ? 'add' : 'mul',
    value: e.kind === 'add' ? e.perRank * rank : e.kind === 'mulLinear' ? 1 + e.perRank * rank : Math.pow(e.perRank, rank),
    labelKey: `meta.${item.id}`,
  }))
}

export function metaShopModule(): EngineModule<MetaShopState> {
  return {
    id: MODULE.metaShop,
    version: 1,
    init: () => ({ ranks: {} }),
    parse: (raw, _ctx, def) => {
      const r = isRecord(raw) && isRecord(raw.ranks) ? raw.ranks : {}
      const ranks: Record<string, number> = {}
      for (const item of def.metaShop) {
        const n = parseInt0(r[item.id], 0, item.maxRank)
        if (n > 0) ranks[item.id] = n
      }
      return { ranks }
    },
    resetOn: 'keep',
    effects: (s, view) => view.def.metaShop.flatMap((item) => metaEffects(item, s.ranks[item.id] ?? 0)),
    actions: {
      buy: (s, payload, _ctx, world: WorldView) => {
        const id = (payload as { id?: string } | undefined)?.id
        const item = world.def.metaShop.find((i) => i.id === id)
        if (!item || !canBuyMeta(world, item)) return s
        const rank = s.ranks[item.id] ?? 0
        return act(
          { ranks: { ...s.ranks, [item.id]: rank + 1 } },
          { spend: [{ currency: item.currency, amount: metaCost(item, rank) }], events: [{ type: 'meta.bought', id: item.id, rank: rank + 1 }] },
        )
      },
    },
    playtestEvents: ['meta.bought'],
    sample: (_ctx, def) => {
      const ranks: Record<string, number> = {}
      for (const i of def.metaShop) ranks[i.id] = Math.min(i.maxRank, 1)
      return { ranks }
    },
  }
}
