import type { EngineEvent } from '@engine/core'
import type { UiValue } from './uiContext'

/**
 * One piece of visible feedback for an engine event.
 *  toast  short message below the HUD (named rewards, results)
 *  float  number or word that rises at an anchor and fades
 *  fly    glowing dot that flies from an anchor to the HUD amount, which flashes on arrival
 * `anchor` names an element marked `data-fx="<anchor>"`; without one the middle of the screen is used.
 */
export interface FeedbackItem {
  kind: 'toast' | 'float' | 'fly'
  text?: string
  anchor?: string
  tone?: 'gain' | 'spend' | 'info'
}

/** The game's mapping; `ui` brings number formatting and content names in the active language. */
export type FeedbackMap = (e: EngineEvent, ui: UiValue) => FeedbackItem | readonly FeedbackItem[] | null

/** Toasts shown at once; older ones leave first. */
export const TOAST_MAX = 3
export const TOAST_MS = 3200
export const FLOAT_MS = 1300
/** Floats and flights alive at once (holding a buy button fires many events). */
export const FLOAT_MAX = 8

/** Flatten the items of one event batch and drop exact repeats (a held button buys many times per batch). */
export function collectFeedback(events: readonly EngineEvent[], map: (e: EngineEvent) => FeedbackItem | readonly FeedbackItem[] | null): FeedbackItem[] {
  const out: FeedbackItem[] = []
  const seen = new Set<string>()
  for (const e of events) {
    const r = map(e)
    if (!r) continue
    for (const item of Array.isArray(r) ? (r as readonly FeedbackItem[]) : [r as FeedbackItem]) {
      const key = `${item.kind}|${item.anchor ?? ''}|${item.text ?? ''}`
      if (seen.has(key)) continue
      seen.add(key)
      out.push(item)
    }
  }
  return out
}
