/**
 * Playtest log: local only, nothing is sent. Off by default; a game in its
 * test phase may switch it on by default (`defaultOn`) — the player's own
 * choice in the settings always wins.
 * Storage: two localStorage keys (closed days rarely, the running day + raw
 * rest every 12 s). If space runs short the raw rest is halved first; the
 * save always wins. Engine events are recorded automatically when a module
 * lists them in `playtestEvents` (plus the always-logged core types).
 */
import type { EngineEvent } from '@engine/core'
import {
  addPlayTime, emptyLog, exportLines, parseDay, parseEvent, recordEvent, sessionShow, setSnapshot,
  type DaySummary, type LogState, type PlaytestPayload,
} from './playtestCore'
import { createStore, type Store } from './store'
import { readKey, removeKey, writeKey } from './storage'
import type { EngineRuntime } from './useEngine'

export interface PlaytestOptions {
  gameId: string
  version: string
  /** Counted per minute only (never stored one by one). */
  highFrequency?: readonly string[]
  /** Small progress snapshot, stored once per flush on the running day. */
  snapshot?: () => Record<string, number | string>
  now?: () => number
  /** Record unless the player switched it off (test phase). Default: off until switched on. */
  defaultOn?: boolean
}

export interface PlaytestLog {
  enabled: Store<boolean>
  setEnabled(on: boolean): void
  record(type: string, data?: PlaytestPayload): void
  /** Wire engine events, visibility and the flush timer; returns a stop function. */
  attach(rt: EngineRuntime): () => void
  /** Days + raw events (for the settings line). */
  count(): number
  exportText(): string
  fileName(): string
  clear(): void
  /** Test hook: write pending changes now. */
  flush(): void
}

/** Always logged (core): the rest comes from the modules' `playtestEvents`. */
export const CORE_PLAYTEST_EVENTS = ['producer.bought', 'prestige.performed', 'meta.bought', 'level.up', 'offline.claimed', 'branch.bought', 'helper.upgraded', 'feature.unlocked'] as const

const FLUSH_MS = 12_000

/** Flatten an engine event into a log payload (only primitive fields). */
function payloadOf(e: EngineEvent): PlaytestPayload | undefined {
  const out: PlaytestPayload = {}
  for (const [k, v] of Object.entries(e)) {
    if (k === 'type') continue
    if (typeof v === 'string' || typeof v === 'boolean' || v === null) out[k] = v
    else if (typeof v === 'number') out[k] = Math.abs(v) >= 1e6 ? Number(v.toPrecision(4)) : v
  }
  return Object.keys(out).length ? out : undefined
}

export function createPlaytestLog(o: PlaytestOptions): PlaytestLog {
  const now = o.now ?? (() => Date.now())
  const KEY_ON = `${o.gameId}-playtest-on`
  const KEY_DAYS = `${o.gameId}-playtest-days-v1`
  const KEY_LIVE = `${o.gameId}-playtest-live-v1`
  const high = new Set(o.highFrequency ?? [])
  const stored = readKey(KEY_ON)
  const enabled = createStore(stored === '1' || (stored === null && o.defaultOn === true))
  let log: LogState | null = null
  let daysWritten = -1
  let dirty = false
  let visibleSince = 0

  const load = (): LogState => {
    if (log) return log
    const next = emptyLog()
    try {
      const days: unknown = JSON.parse(readKey(KEY_DAYS) ?? '[]')
      if (Array.isArray(days)) next.days = days.map(parseDay).filter((d): d is DaySummary => d !== null)
      const live: unknown = JSON.parse(readKey(KEY_LIVE) ?? '{}')
      if (live && typeof live === 'object') {
        const l = live as Record<string, unknown>
        next.today = parseDay(l.today)
        next.raw = Array.isArray(l.raw) ? l.raw.map(parseEvent).filter((e) => e !== null) : []
        next.lastActive = typeof l.lastActive === 'number' ? l.lastActive : 0
      }
    } catch {
      /* broken log storage: start fresh, the save is untouched */
    }
    daysWritten = next.days.length
    log = next
    return next
  }
  const persist = () => {
    if (!dirty || !log) return
    dirty = false
    const cur = log
    if (cur.days.length !== daysWritten && writeKey(KEY_DAYS, JSON.stringify(cur.days))) daysWritten = cur.days.length
    if (!writeKey(KEY_LIVE, JSON.stringify({ today: cur.today, raw: cur.raw, lastActive: cur.lastActive }))) {
      log = { ...cur, raw: cur.raw.slice(Math.floor(cur.raw.length / 2)) }
      writeKey(KEY_LIVE, JSON.stringify({ today: log.today, raw: log.raw, lastActive: log.lastActive }))
    }
  }
  const credit = (t = now()) => {
    if (!enabled.get() || visibleSince <= 0) return
    log = addPlayTime(load(), visibleSince, t, o.version)
    visibleSince = t
    if (o.snapshot) {
      try {
        log = setSnapshot(log, o.snapshot(), t)
      } catch {
        /* snapshot is optional */
      }
    }
    dirty = true
  }
  const show = () => {
    if (!enabled.get()) return
    const t = now()
    log = sessionShow(load(), t, o.version).log
    visibleSince = t
    dirty = true
  }
  const record = (type: string, data?: PlaytestPayload) => {
    if (!enabled.get()) return
    log = recordEvent(load(), type, data, now(), { version: o.version, highFrequency: high })
    dirty = true
  }

  return {
    enabled,
    setEnabled: (on) => {
      if (on === enabled.get()) return
      if (!on) record('playtest.off')
      persist()
      enabled.set(on)
      writeKey(KEY_ON, on ? '1' : '0')
      if (on) {
        show()
        record('playtest.on')
      } else visibleSince = 0
    },
    record,
    attach: (rt) => {
      const wanted = new Set<string>([...CORE_PLAYTEST_EVENTS, ...rt.def.modules.flatMap((m) => m.playtestEvents ?? [])])
      const offEvents = rt.onEvents((events) => {
        for (const e of events) if (wanted.has(e.type)) record(e.type, payloadOf(e))
      })
      const onVis = () => {
        if (document.hidden) {
          credit()
          visibleSince = 0
          persist()
        } else show()
      }
      const onError = (e: ErrorEvent) => record('app.error', { message: String(e.message).slice(0, 64) })
      if (!document.hidden) show()
      document.addEventListener('visibilitychange', onVis)
      window.addEventListener('pagehide', persist)
      window.addEventListener('error', onError)
      const timer = window.setInterval(() => {
        credit()
        persist()
      }, FLUSH_MS)
      return () => {
        offEvents()
        document.removeEventListener('visibilitychange', onVis)
        window.removeEventListener('pagehide', persist)
        window.removeEventListener('error', onError)
        window.clearInterval(timer)
        credit()
        persist()
      }
    },
    count: () => {
      const l = load()
      return l.raw.length + l.days.length + (l.today ? 1 : 0)
    },
    exportText: () => {
      credit()
      return exportLines(load(), now(), o.gameId, o.version)
    },
    fileName: () => {
      const d = new Date(now())
      return `${o.gameId}-playtest-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}.jsonl`
    },
    clear: () => {
      log = emptyLog()
      daysWritten = -1
      removeKey(KEY_DAYS)
      removeKey(KEY_LIVE)
    },
    flush: () => {
      credit()
      persist()
    },
  }
}
