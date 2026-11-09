/**
 * Time is injected (ADR 0006). The engine never reads the system clock;
 * the React layer passes a real clock, tests and the simulator a virtual one.
 */
export interface Clock {
  /** Milliseconds since the epoch. */
  now(): number
  /** Local offset east of UTC in minutes (calendar features); default 0. */
  offsetMin?(): number
}

/** A clock that only moves when told to (tests, balance simulator). */
export interface ManualClock extends Clock {
  set(ms: number): void
  advance(ms: number): void
}

export function createManualClock(start: number, offsetMin = 0): ManualClock {
  let t = start
  return {
    now: () => t,
    offsetMin: () => offsetMin,
    set: (ms) => {
      t = ms
    },
    advance: (ms) => {
      t += ms
    },
  }
}

/** Local calendar parts for a timestamp at a fixed UTC offset (minutes). */
export interface DayParts {
  year: number
  month: number
  day: number
  weekday: number
  hour: number
  minute: number
}

/**
 * Day key `YYYY-MM-DD` for a timestamp. `offsetMin` is the local offset east
 * of UTC (e.g. +60 for CET); the UI passes the device offset.
 */
export function dayKey(ms: number, offsetMin = 0): string {
  const p = dayParts(ms, offsetMin)
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`
}

export function dayParts(ms: number, offsetMin = 0): DayParts {
  // `new Date(value)` with an explicit argument is deterministic.
  const d = new Date(ms + offsetMin * 60_000)
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    weekday: d.getUTCDay(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
  }
}

/** Local calendar parts of the clock's current time. */
export function localParts(clock: Clock): DayParts {
  return dayParts(clock.now(), clock.offsetMin?.() ?? 0)
}

export function localDayKey(clock: Clock): string {
  return dayKey(clock.now(), clock.offsetMin?.() ?? 0)
}

/** Whole days since 1970-01-01 for a `YYYY-MM-DD` key (NaN if invalid). */
export function dayNumber(key: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key)
  if (!m) return NaN
  return Math.floor(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) / 86_400_000)
}

/** ISO week key `YYYY-Www` (Monday start) of a local day key. */
export function weekKey(key: string): string {
  const n = dayNumber(key)
  if (!Number.isFinite(n)) return ''
  const d = new Date(n * 86_400_000)
  const wd = (d.getUTCDay() + 6) % 7
  const thursday = new Date((n - wd + 3) * 86_400_000)
  const year = thursday.getUTCFullYear()
  const jan4 = Date.UTC(year, 0, 4)
  const week = 1 + Math.round(((thursday.getTime() - jan4) / 86_400_000 - 3 + ((new Date(jan4).getUTCDay() + 6) % 7)) / 7)
  return `${year}-W${String(week).padStart(2, '0')}`
}

/** Small deterministic hash of a string (calendar-seeded choices, no RNG state). */
export function hashKey(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
