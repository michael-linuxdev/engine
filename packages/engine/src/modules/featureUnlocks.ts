/** Systems unlock step by step; once unlocked they stay (stored), with an event for the UI badge. */
import { act } from '../result'
import { isRecord } from '../state'
import type { EngineModule, WorldView } from '../types'

export interface FeatureDef {
  id: string
  when: (w: WorldView) => boolean
}

export interface FeatureUnlocksState {
  unlocked: string[]
}

export const FEATURES_ID = 'featureUnlocks'

export function featureUnlocksModule(list: readonly FeatureDef[]): EngineModule<FeatureUnlocksState> {
  const ids = new Set(list.map((f) => f.id))
  const check = (s: FeatureUnlocksState, w: WorldView) => {
    const fresh = list.filter((f) => !s.unlocked.includes(f.id) && f.when(w)).map((f) => f.id)
    return fresh.length ? act({ unlocked: [...s.unlocked, ...fresh] }, { events: fresh.map((id) => ({ type: 'feature.unlocked', id })) }) : s
  }
  return {
    id: FEATURES_ID,
    version: 1,
    init: () => ({ unlocked: [] }),
    parse: (raw) => ({ unlocked: isRecord(raw) && Array.isArray(raw.unlocked) ? [...new Set(raw.unlocked.filter((x): x is string => typeof x === 'string' && ids.has(x)))] : [] }),
    resetOn: 'keep',
    on: (s, e, _ctx, w) => (e.type === 'feature.unlocked' ? s : check(s, w)),
    onOffline: (s, _ms, _ctx, w) => check(s, w),
    playtestEvents: ['feature.unlocked'],
    sample: () => ({ unlocked: list.slice(0, 2).map((f) => f.id) }),
  }
}

export function isFeatureOpen(w: WorldView, id: string): boolean {
  return w.get<FeatureUnlocksState | undefined>(FEATURES_ID)?.unlocked.includes(id) ?? false
}
