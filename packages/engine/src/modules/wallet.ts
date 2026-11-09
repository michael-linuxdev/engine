/**
 * Wallet: balances of every non-primary currency (the primary lives in the
 * core). Reset per prestige layer follows `CurrencyDef.resetOn`.
 */
import { clampNum } from '../num'
import { isRecord, parseNumRecord } from '../state'
import type { EngineModule, GameDefinition } from '../types'

export interface WalletState {
  balances: Record<string, number>
  /** Lifetime amounts received per currency. */
  earned: Record<string, number>
}

export const WALLET_ID = 'wallet'

function ids(def: GameDefinition): string[] {
  return def.currencies.filter((c) => c.role !== 'primary').map((c) => c.id)
}

function zero(def: GameDefinition): Record<string, number> {
  const out: Record<string, number> = {}
  for (const id of ids(def)) out[id] = 0
  return out
}

export function walletModule(): EngineModule<WalletState> {
  return {
    id: WALLET_ID,
    version: 1,
    init: (_ctx, def) => ({ balances: zero(def), earned: zero(def) }),
    parse: (raw, _ctx, def) => {
      const r = isRecord(raw) ? raw : {}
      return {
        balances: { ...zero(def), ...parseNumRecord(r.balances, ids(def)) },
        earned: { ...zero(def), ...parseNumRecord(r.earned, ids(def)) },
      }
    },
    resetOn: (s, layer, _ctx, world) => {
      const balances = { ...s.balances }
      for (const c of world.def.currencies) {
        if (c.resetOn?.includes(layer) && c.id in balances) balances[c.id] = 0
      }
      return { ...s, balances }
    },
    sample: (_ctx, def) => {
      const b = zero(def)
      for (const k of Object.keys(b)) b[k] = 1234
      return { balances: b, earned: { ...b } }
    },
  }
}

export function walletAdd(s: WalletState, currency: string, amount: number): WalletState {
  return {
    balances: { ...s.balances, [currency]: clampNum((s.balances[currency] ?? 0) + amount) },
    earned: amount > 0 ? { ...s.earned, [currency]: clampNum((s.earned[currency] ?? 0) + amount) } : s.earned,
  }
}
