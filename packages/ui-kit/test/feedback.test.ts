import { describe, expect, it } from 'vitest'
import { collectFeedback } from '../src/feedback'

describe('collectFeedback', () => {
  it('flattens the items of a batch and drops exact repeats', () => {
    const events = [{ type: 'buy' }, { type: 'buy' }, { type: 'gift' }, { type: 'quiet' }]
    const items = collectFeedback(events, (e) => {
      if (e.type === 'buy') return [{ kind: 'float', text: '−10', anchor: 'hud' }, { kind: 'toast', text: 'Milestone' }]
      if (e.type === 'gift') return { kind: 'toast', text: 'Gift' }
      return null
    })
    expect(items.map((x) => x.text)).toEqual(['−10', 'Milestone', 'Gift'])
  })

  it('keeps items that differ in text or anchor', () => {
    const items = collectFeedback([{ type: 'a', n: 1 }, { type: 'a', n: 2 }], (e) => ({ kind: 'float', text: `+${String(e.n)}` }))
    expect(items).toHaveLength(2)
  })
})
