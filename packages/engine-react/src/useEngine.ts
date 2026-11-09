/**
 * React binding: load (with offline credit), fixed-step clock, throttled
 * saving (and on visibilitychange/pagehide), typed dispatch.
 */
import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react'
import {
  advance, applyOffline, createSaveGuard, dispatch as engineDispatch, loadState, serializeState, view,
  type Clock, type EngineEvent, type EngineState, type GameDefinition, type LoadStatus, type SaveGuard, type WorldView,
} from '@engine/core'
import { startSaveLock } from './saveLock'
import { keepCopy, readKey, writeKey } from './storage'

export const realClock: Clock = { now: () => Date.now() }

export interface EngineRuntime {
  def: GameDefinition
  clock: Clock
  guard: SaveGuard
  status: LoadStatus
  get(): EngineState
  world(): WorldView
  dispatch(module: string, type: string, payload?: unknown): boolean
  /** Replace the whole state (tests, import). */
  replace(s: EngineState): void
  subscribe(cb: () => void): () => void
  onEvents(cb: (e: EngineEvent[]) => void): () => void
  save(): boolean
  start(): () => void
}

export interface RuntimeOptions {
  clock?: Clock
  saveEveryMs?: number
  frameMs?: number
}

/** Create the runtime once per page (outside React, so StrictMode cannot double it). */
export function createRuntime(def: GameDefinition, opts: RuntimeOptions = {}): EngineRuntime {
  const clock = opts.clock ?? realClock
  const guard = createSaveGuard()
  const raw = readKey(def.saveKey)
  const loaded = loadState(def, raw, clock)
  if (loaded.status === 'corrupt' && raw) keepCopy(`${def.saveKey}-unreadable`, raw)
  if (loaded.status === 'newer') guard.set('newer')
  if (loaded.status === 'foreign') guard.set('foreign')
  let state = applyOffline(def, loaded.state, clock).state
  let w: WorldView | null = null
  let acc = 0
  let lockStarted = false
  const listeners = new Set<() => void>()
  const eventListeners = new Set<(e: EngineEvent[]) => void>()
  const emit = (events: EngineEvent[]) => {
    w = null
    for (const l of listeners) l()
    if (events.length) for (const l of eventListeners) l(events)
  }
  const save = (): boolean => {
    if (!guard.canWrite()) return false
    return writeKey(def.saveKey, serializeState(def, state, clock.now()))
  }
  return {
    def,
    clock,
    guard,
    status: loaded.status,
    get: () => state,
    world: () => (w ??= view(def, state)),
    dispatch: (module, type, payload) => {
      const r = engineDispatch(def, state, { module, type, payload }, clock)
      if (!r.ok) return false
      state = r.state
      emit(r.events)
      return true
    },
    replace: (s) => {
      state = s
      emit([])
    },
    subscribe: (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    onEvents: (cb) => {
      eventListeners.add(cb)
      return () => eventListeners.delete(cb)
    },
    save,
    start: () => {
      // Once per page: a second request would see our own lock and block saving.
      if (!lockStarted) {
        lockStarted = true
        startSaveLock(guard, `${def.saveKey}-lock`)
      }
      let last = clock.now()
      let lastSave = last
      const frame = () => {
        const now = clock.now()
        const r = advance(def, state, now - last, acc, clock)
        last = now
        acc = r.acc
        if (r.steps > 0 || r.offline) {
          state = r.state
          emit(r.events.filter((e) => e.type !== 'primary.gained' || e.source !== 'tick'))
        }
        if (now - lastSave > (opts.saveEveryMs ?? 5000)) {
          lastSave = now
          save()
        }
      }
      const id = setInterval(frame, opts.frameMs ?? 100)
      const onHide = () => {
        if (document.visibilityState === 'hidden') save()
        else frame()
      }
      document.addEventListener('visibilitychange', onHide)
      window.addEventListener('pagehide', save)
      save()
      return () => {
        clearInterval(id)
        document.removeEventListener('visibilitychange', onHide)
        window.removeEventListener('pagehide', save)
      }
    },
  }
}

/** Subscribe a component to the runtime; returns state, world and dispatch. */
export function useEngine(rt: EngineRuntime) {
  const state = useSyncExternalStore(rt.subscribe, rt.get, rt.get)
  const dispatch = useCallback((module: string, type: string, payload?: unknown) => rt.dispatch(module, type, payload), [rt])
  const world = useMemo(() => {
    void state
    return rt.world()
  }, [rt, state])
  return { state, world, dispatch, rt }
}

/** Start the loop for the lifetime of the component. */
export function useRuntimeLoop(rt: EngineRuntime): void {
  // StrictMode runs effects twice (start, stop, start) — start() is safe to repeat.
  useEffect(() => rt.start(), [rt])
}

export function useSaveBlock(guard: SaveGuard) {
  return useSyncExternalStore(guard.subscribe, guard.get, guard.get)
}
