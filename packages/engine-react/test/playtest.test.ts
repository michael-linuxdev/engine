import { beforeEach, describe, expect, it } from 'vitest'
import { addPlayTime, DAYS_BUDGET, emptyLog, exportLines, fitDaysBudget, parseDay, parseEvent, RAW_KEEP_MS, recordEvent, sessionShow, SESSION_GAP_MS, type DaySummary } from '../src/playtestCore'
import { createPlaytestLog } from '../src/playtestLog'

const T = new Date(2026, 10, 10, 12).getTime()
const high = new Set(['producer.bought'])

describe('playtest core', () => {
  it('a session starts only after a 30-minute pause', () => {
    let log = sessionShow(emptyLog(), T).log
    expect(log.today?.sessions).toBe(1)
    log = sessionShow(log, T + 10 * 60_000).log
    expect(log.today?.sessions).toBe(1)
    log = sessionShow(log, T + 10 * 60_000 + SESSION_GAP_MS).log
    expect(log.today?.sessions).toBe(2)
  })
  it('high-frequency events become minute counters; others stay single with detail counts', () => {
    let log = emptyLog()
    for (let i = 0; i < 50; i++) log = recordEvent(log, 'producer.bought', { id: 'a' }, T + i * 100, { highFrequency: high })
    log = recordEvent(log, 'prestige.performed', { layer: 'moon' }, T + 6000, { highFrequency: high })
    expect(log.raw).toHaveLength(2)
    expect(log.raw[0]).toEqual({ t: Math.floor(T / 60_000) * 60_000, type: 'minute', data: { 'producer.bought': 50 } })
    expect(log.today?.counts['producer.bought']).toBe(50)
    expect(log.today?.counts['prestige.performed:moon']).toBe(1)
  })
  it('raw events are kept for 48 h only; day summaries stay', () => {
    let log = recordEvent(emptyLog(), 'a.b', undefined, T)
    log = recordEvent(log, 'a.b', undefined, T + RAW_KEEP_MS + 1)
    expect(log.raw).toHaveLength(1)
    expect(log.days).toHaveLength(1)
    expect(log.days[0].counts['a.b']).toBe(1)
  })
  it('play time is credited (at most 2 h per slice)', () => {
    let log = addPlayTime(emptyLog(), T, T + 5 * 60_000)
    log = addPlayTime(log, T, T + 10 * 3600_000)
    expect(log.today?.playMs).toBe(5 * 60_000 + 2 * 3600_000)
  })
  it('too many days lose their details first, totals stay', () => {
    const fat: DaySummary[] = Array.from({ length: 40 }, (_, i) => ({
      day: `2026-01-${String(i + 1).padStart(2, '0')}`, sessions: 1, playMs: 1, first: 0, last: 0,
      counts: Object.fromEntries(Array.from({ length: 200 }, (_, k) => [`x:${'y'.repeat(180)}${k}`, 1]).concat([['x', 200]])),
    }))
    const slim = fitDaysBudget(fat)
    expect(JSON.stringify(slim).length).toBeLessThanOrEqual(DAYS_BUDGET)
    expect(slim[0].counts).toEqual({ x: 200 })
    expect(slim.at(-1)?.counts.x).toBe(200)
  })
  it('export: header, days, raw; parsing tolerates garbage', () => {
    let log = sessionShow(emptyLog(), T).log
    log = recordEvent(log, 'app.tab', { tab: 'market' }, T + 1)
    const lines = exportLines(log, T + 2, 'game', '1.0').trim().split('\n').map((l) => JSON.parse(l))
    expect(lines[0]).toMatchObject({ kind: 'header', app: 'game', days: 1, raw: 2 })
    expect(lines[1].kind).toBe('day')
    expect(parseEvent({ t: 'x' })).toBeNull()
    expect(parseEvent({ t: 1, type: 'a', data: { n: Infinity, s: 'ok' } })).toEqual({ t: 1, type: 'a', data: { s: 'ok' } })
    expect(parseDay({ day: 'd', counts: { a: 'x', b: 2 } })?.counts).toEqual({ b: 2 })
  })
})

describe('playtest log (browser)', () => {
  const mem = new Map<string, string>()
  beforeEach(() => {
    mem.clear()
    ;(globalThis as { localStorage?: unknown }).localStorage = {
      getItem: (k: string) => mem.get(k) ?? null,
      setItem: (k: string, v: string) => void mem.set(k, v),
      removeItem: (k: string) => void mem.delete(k),
    }
  })
  it('is off by default (opt-in) and records nothing until switched on', () => {
    const log = createPlaytestLog({ gameId: 'g', version: '1', now: () => T })
    log.record('app.tab', { tab: 'x' })
    expect(log.count()).toBe(0)
    log.setEnabled(true)
    log.record('app.tab', { tab: 'x' })
    log.flush()
    expect(mem.get('g-playtest-on')).toBe('1')
    const again = createPlaytestLog({ gameId: 'g', version: '1', now: () => T })
    expect(again.enabled.get()).toBe(true)
    expect(again.exportText()).toContain('"tab":"x"')
    again.clear()
    expect(again.count()).toBe(0)
  })
})
