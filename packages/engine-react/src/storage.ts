/** localStorage access that never throws (private mode, blocked storage, quota). */
export function readKey(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeKey(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

export function readJson<T>(key: string, fallback: T): T {
  const raw = readKey(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

/** Keep the first copy of an unreadable save (never overwritten). */
export function keepCopy(key: string, raw: string): void {
  if (!readKey(key)) writeKey(key, raw)
}
