import { beforeEach, describe, expect, it } from 'vitest'
import { createTestWallet, monthKey, parseWallet } from '../src/testWallet'

// Node has no localStorage: a tiny in-memory stand-in.
const mem = new Map<string, string>()
beforeEach(() => {
  mem.clear()
  ;(globalThis as { localStorage?: unknown }).localStorage = {
    getItem: (k: string) => mem.get(k) ?? null,
    setItem: (k: string, v: string) => void mem.set(k, v),
    removeItem: (k: string) => void mem.delete(k),
  }
})

const NOV = Date.UTC(2026, 10, 15, 12)
const DEC = Date.UTC(2026, 11, 15, 12)

describe('test wallet', () => {
  it('spends from the monthly budget and refuses beyond it', () => {
    const w = createTestWallet('g', 2000, () => NOV)
    expect(w.left(NOV)).toBe(2000)
    expect(w.spend(1500, NOV)).toBe(true)
    expect(w.spend(699, NOV)).toBe(false)
    expect(w.left(NOV)).toBe(500)
    expect(w.get().purchases).toBe(1)
  })
  it('a new month refills the budget and keeps the totals', () => {
    const w = createTestWallet('g', 2000, () => NOV)
    w.spend(1999, NOV)
    expect(w.left(DEC)).toBe(2000)
    expect(w.get().totalCents).toBe(1999)
    expect(w.get().month).toBe(monthKey(DEC))
  })
  it('survives a reload and tolerates garbage', () => {
    createTestWallet('g', 2000, () => NOV).spend(299, NOV)
    expect(createTestWallet('g', 2000, () => NOV).left(NOV)).toBe(1701)
    expect(parseWallet({ spentCents: -5, totalCents: 'x', month: 3 }, NOV)).toEqual({ month: monthKey(NOV), spentCents: 0, totalCents: 0, purchases: 0 })
  })
})
