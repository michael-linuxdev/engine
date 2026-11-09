/** Tiny external store for useSyncExternalStore. */
import { useSyncExternalStore } from 'react'

export interface Store<T> {
  get(): T
  set(next: T | ((prev: T) => T)): void
  subscribe(cb: () => void): () => void
}

export function createStore<T>(initial: T): Store<T> {
  let value = initial
  const listeners = new Set<() => void>()
  return {
    get: () => value,
    set: (next) => {
      const v = typeof next === 'function' ? (next as (p: T) => T)(value) : next
      if (Object.is(v, value)) return
      value = v
      for (const l of listeners) l()
    },
    subscribe: (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
  }
}

export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.get)
}
