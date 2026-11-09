/**
 * Test wallet for the test phase: real-money offers show real prices and are
 * paid from a monthly test budget. Nothing is charged; every decision is a
 * playtest event, so we can estimate what players would really spend.
 *
 * Deliberately NOT part of the save (no progress, no migration): own key.
 */
import { createStore, type Store } from './store'
import { readJson, writeKey } from './storage'

export interface WalletState {
  /** Calendar month `YYYY-MM` that `spentCents` refers to. */
  month: string
  spentCents: number
  totalCents: number
  purchases: number
}

export interface TestWallet extends Store<WalletState> {
  budgetCents: number
  /** Remaining budget this month (rolls the month over first). */
  left(now: number): number
  /** Spend `cents`; false (and nothing changes) if the budget is not enough. */
  spend(cents: number, now: number): boolean
}

export function monthKey(now: number): string {
  const d = new Date(now)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function parseWallet(raw: unknown, now: number): WalletState {
  const r = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>
  const n = (x: unknown) => (typeof x === 'number' && Number.isFinite(x) && x >= 0 ? Math.floor(x) : 0)
  const month = monthKey(now)
  // New month: full budget again.
  return { month, spentCents: r.month === month ? n(r.spentCents) : 0, totalCents: n(r.totalCents), purchases: n(r.purchases) }
}

export function createTestWallet(gameId: string, budgetCents: number, now: () => number): TestWallet {
  const key = `${gameId}-testwallet-v1`
  const store = createStore(parseWallet(readJson(key, {}), now()))
  const roll = (t: number) => {
    const cur = store.get()
    if (cur.month !== monthKey(t)) store.set(parseWallet(cur, t))
    return store.get()
  }
  return {
    ...store,
    budgetCents,
    left: (t) => Math.max(0, budgetCents - roll(t).spentCents),
    spend: (cents, t) => {
      const cur = roll(t)
      if (cents > budgetCents - cur.spentCents) return false
      const next = { ...cur, spentCents: cur.spentCents + cents, totalCents: cur.totalCents + cents, purchases: cur.purchases + 1 }
      store.set(next)
      writeKey(key, JSON.stringify(next))
      return true
    },
  }
}
