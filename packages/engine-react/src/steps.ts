/**
 * Guided steps (FTUE) and one-time flags, stored on the device (not in the
 * save). A step is done once its condition holds; the coach shows the first
 * step that is not done. Dismissing ends the guide for good.
 */
import { createStore, useStore } from './store'
import { readJson, writeKey } from './storage'

export interface StepDef<W> {
  id: string
  done: (world: W) => boolean
}

export interface StepsState {
  completed: string[]
  dismissed: boolean
}

export interface StepsStore {
  get(): StepsState
  complete(id: string): void
  dismiss(): void
  subscribe(cb: () => void): () => void
}

export function createSteps(key: string): StepsStore {
  const raw = readJson<Partial<StepsState>>(key, {})
  const store = createStore<StepsState>({
    completed: Array.isArray(raw.completed) ? raw.completed.filter((x): x is string => typeof x === 'string') : [],
    dismissed: raw.dismissed === true,
  })
  const persist = () => writeKey(key, JSON.stringify(store.get()))
  return {
    get: store.get,
    subscribe: store.subscribe,
    complete: (id) => {
      if (store.get().completed.includes(id)) return
      store.set((s) => ({ ...s, completed: [...s.completed, id] }))
      persist()
    },
    dismiss: () => {
      store.set((s) => ({ ...s, dismissed: true }))
      persist()
    },
  }
}

/** Current step (marks finished ones as completed on the way). */
export function currentStep<W>(steps: readonly StepDef<W>[], store: StepsStore, world: W): StepDef<W> | null {
  const s = store.get()
  if (s.dismissed) return null
  for (const step of steps) {
    if (s.completed.includes(step.id)) continue
    if (step.done(world)) {
      store.complete(step.id)
      continue
    }
    return step
  }
  return null
}

export function useSteps(store: StepsStore): StepsState {
  return useStore({ get: store.get, set: () => {}, subscribe: store.subscribe })
}

/** Set of read/seen ids on the device (chronicle pages, hints). */
export function createSeen(key: string) {
  const raw = readJson<unknown>(key, [])
  const store = createStore<string[]>(Array.isArray(raw) ? raw.filter((x): x is string => typeof x === 'string') : [])
  return {
    ...store,
    has: (id: string) => store.get().includes(id),
    add: (id: string) => {
      if (store.get().includes(id)) return
      store.set((s) => [...s, id])
      writeKey(key, JSON.stringify(store.get()))
    },
  }
}
