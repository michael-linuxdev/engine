/**
 * Time is injected (ADR 0006). The engine never reads the system clock;
 * the React layer passes a real clock, tests and the simulator a virtual one.
 */
export interface Clock {
  /** Milliseconds since the epoch. */
  now(): number
}

/** A clock that only moves when told to (tests, balance simulator). */
export interface ManualClock extends Clock {
  set(ms: number): void
  advance(ms: number): void
}

export function createManualClock(start: number): ManualClock {
  let t = start
  return {
    now: () => t,
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
  }
}
