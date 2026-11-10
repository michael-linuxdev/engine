/**
 * Playtest log, browser-free core. Built to run for months:
 *  - raw events only for the last 48 h (and capped);
 *  - high-frequency events are never stored one by one, only counted per minute;
 *  - one small summary per local calendar day that stays;
 *  - a session starts only after a pause of ≥ 30 min (a reload does not count).
 * Event types are free strings: engine events (`producer.bought` …) and app
 * events (`app.tab`, `app.testPurchase` …).
 */

export type PlaytestPayload = Record<string, string | number | boolean | null | undefined>

export interface PlaytestEvent {
  t: number
  type: string
  data?: PlaytestPayload
}

export interface DaySummary {
  /** Local calendar day YYYY-MM-DD. */
  day: string
  /** Counters per type and per `type:detail`. */
  counts: Record<string, number>
  sessions: number
  /** Visible play time in ms. */
  playMs: number
  first: number
  last: number
  version?: string
  /** Last progress snapshot of the day. */
  snap?: Record<string, number | string>
}

export interface LogState {
  days: DaySummary[]
  today: DaySummary | null
  raw: PlaytestEvent[]
  /** Last activity (session border). */
  lastActive: number
}

export const LOG_SCHEMA = 1
export const SESSION_GAP_MS = 30 * 60_000
export const RAW_KEEP_MS = 48 * 3600_000
export const RAW_MAX = 3000
export const DAY_MAX_KEYS = 200
/** Budget for all closed days (JSON characters). */
export const DAYS_BUDGET = 1_500_000
const PLAY_SLICE_MAX_MS = 2 * 3600_000

export function emptyLog(): LogState {
  return { days: [], today: null, raw: [], lastActive: 0 }
}

export function localDay(t: number): string {
  const d = new Date(t)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function cleanPayload(data?: PlaytestPayload): PlaytestPayload | undefined {
  if (!data) return undefined
  const out: PlaytestPayload = {}
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined) continue
    if (typeof v === 'number' && !Number.isFinite(v)) continue
    out[k] = typeof v === 'string' ? v.slice(0, 64) : v
  }
  return Object.keys(out).length > 0 ? out : undefined
}

function detailOf(data?: PlaytestPayload): string | null {
  if (!data) return null
  for (const k of ['id', 'layer', 'tab', 'choice', 'option', 'kind', 'to'] as const) {
    const v = data[k]
    if (typeof v === 'string' && v.length > 0) return v.slice(0, 32)
  }
  return null
}

function newDay(t: number, version?: string): DaySummary {
  return { day: localDay(t), counts: {}, sessions: 0, playMs: 0, first: t, last: t, version }
}

/** Make `today` match the day of `t`; closes the previous day. */
export function rollDay(log: LogState, t: number, version?: string): LogState {
  const key = localDay(t)
  if (log.today && log.today.day === key) return log
  const days = log.today ? [...log.days, log.today] : log.days
  return { ...log, days: fitDaysBudget(days), today: newDay(t, version) }
}

function bump(counts: Record<string, number>, key: string, n = 1): void {
  if (counts[key] !== undefined || Object.keys(counts).length < DAY_MAX_KEYS) counts[key] = (counts[key] ?? 0) + n
  else {
    const other = `${key.split(':')[0]}:…`
    counts[other] = (counts[other] ?? 0) + n
  }
}

/** Record one event at time `t`. Pure. */
export function recordEvent(log: LogState, type: string, data: PlaytestPayload | undefined, t: number, opts: { version?: string; highFrequency?: ReadonlySet<string> } = {}): LogState {
  const rolled = rollDay(log, t, opts.version)
  const clean = cleanPayload(data)
  const today: DaySummary = { ...rolled.today!, counts: { ...rolled.today!.counts }, last: t }
  bump(today.counts, type)
  const detail = detailOf(clean)
  if (detail) bump(today.counts, `${type}:${detail}`)
  let raw = rolled.raw
  if (opts.highFrequency?.has(type)) {
    const minute = Math.floor(t / 60_000) * 60_000
    const last = raw[raw.length - 1]
    if (last && last.type === 'minute' && last.t === minute) {
      const d = { ...(last.data ?? {}) }
      d[type] = (typeof d[type] === 'number' ? (d[type] as number) : 0) + 1
      raw = [...raw.slice(0, -1), { ...last, data: d }]
    } else raw = [...raw, { t: minute, type: 'minute', data: { [type]: 1 } }]
  } else {
    const entry: PlaytestEvent = { t, type }
    if (clean) entry.data = clean
    raw = [...raw, entry]
  }
  return { ...rolled, today, raw: trimRaw(raw, t) }
}

export function trimRaw(raw: PlaytestEvent[], now: number): PlaytestEvent[] {
  const cut = now - RAW_KEEP_MS
  let start = 0
  while (start < raw.length && raw[start].t < cut) start++
  let out = start > 0 ? raw.slice(start) : raw
  if (out.length > RAW_MAX) out = out.slice(-RAW_MAX)
  return out
}

/** Too big → the oldest days lose their detail keys and snapshots (type totals stay). */
export function fitDaysBudget(days: DaySummary[]): DaySummary[] {
  let size = JSON.stringify(days).length
  if (size <= DAYS_BUDGET) return days
  const out = [...days]
  for (let i = 0; i < out.length && size > DAYS_BUDGET; i++) {
    const d = out[i]
    const counts: Record<string, number> = {}
    for (const [k, v] of Object.entries(d.counts)) if (!k.includes(':')) counts[k] = v
    const slim: DaySummary = { day: d.day, counts, sessions: d.sessions, playMs: d.playMs, first: d.first, last: d.last, version: d.version }
    size -= JSON.stringify(d).length - JSON.stringify(slim).length
    out[i] = slim
  }
  return out
}

/** The app became visible: a new session only after a real pause. */
export function sessionShow(log: LogState, t: number, version?: string, meta?: PlaytestPayload): { log: LogState; isNew: boolean } {
  const isNew = log.lastActive <= 0 || t - log.lastActive >= SESSION_GAP_MS
  let next = rollDay(log, t, version)
  if (isNew) {
    const gapMin = log.lastActive > 0 ? Math.round((t - log.lastActive) / 60_000) : null
    next = recordEvent(next, 'session.start', { ...meta, gapMin }, t, { version })
    next = { ...next, today: { ...next.today!, sessions: next.today!.sessions + 1 } }
  }
  return { log: { ...next, lastActive: t }, isNew }
}

/** Credit visible play time [from, to). */
export function addPlayTime(log: LogState, from: number, to: number, version?: string): LogState {
  if (!(to > from)) return log
  const span = Math.min(to - from, PLAY_SLICE_MAX_MS)
  const next = rollDay(log, to, version)
  return { ...next, today: { ...next.today!, playMs: next.today!.playMs + span, last: to }, lastActive: to }
}

export function setSnapshot(log: LogState, snap: Record<string, number | string>, t: number): LogState {
  const next = rollDay(log, t)
  return { ...next, today: { ...next.today!, snap } }
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null

export function parseEvent(item: unknown): PlaytestEvent | null {
  if (!isRecord(item) || typeof item.t !== 'number' || !Number.isFinite(item.t) || typeof item.type !== 'string') return null
  const ev: PlaytestEvent = { t: item.t, type: item.type.slice(0, 64) }
  const data = isRecord(item.data) ? cleanPayload(item.data as PlaytestPayload) : undefined
  if (data) ev.data = data
  return ev
}

export function parseDay(item: unknown): DaySummary | null {
  if (!isRecord(item) || typeof item.day !== 'string') return null
  const counts: Record<string, number> = {}
  if (isRecord(item.counts)) for (const [k, v] of Object.entries(item.counts)) if (typeof v === 'number' && Number.isFinite(v)) counts[k] = v
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0)
  const day: DaySummary = { day: item.day, counts, sessions: num(item.sessions), playMs: num(item.playMs), first: num(item.first), last: num(item.last) }
  if (typeof item.version === 'string') day.version = item.version
  if (isRecord(item.snap)) day.snap = item.snap as Record<string, number | string>
  return day
}

/** JSONL: header, then days, then raw events of the last 48 h. */
export function exportLines(log: LogState, now: number, app: string, version: string): string {
  const days = log.today ? [...log.days, log.today] : log.days
  const header = { kind: 'header', app, schema: LOG_SCHEMA, version, exportedAt: now, from: days[0]?.day ?? null, to: days[days.length - 1]?.day ?? null, days: days.length, raw: log.raw.length }
  const lines = [JSON.stringify(header)]
  for (const d of days) lines.push(JSON.stringify({ kind: 'day', ...d }))
  for (const e of log.raw) lines.push(JSON.stringify(e))
  return `${lines.join('\n')}\n`
}
