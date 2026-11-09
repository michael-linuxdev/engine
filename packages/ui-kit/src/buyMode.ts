import { createStore, useStore } from '@engine/react'
import type { BuyCount } from '@engine/core'

export type BuyMode = 1 | 10 | 'max'
export const buyModeStore = createStore<BuyMode>(1)
export function useBuyMode(): BuyMode {
  return useStore(buyModeStore)
}
export function buyCount(m: BuyMode): BuyCount {
  return m
}
