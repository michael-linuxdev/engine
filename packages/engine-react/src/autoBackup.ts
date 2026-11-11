/**
 * Automatic backups on the device and the reminder to make a real one.
 * They live next to the save (own key) and guard against a wrong restore or
 * a lost state, not against cleared browser data: for that the player keeps
 * the backup code. The decisions are pure functions; the store only reads and writes.
 */
import { readJson, writeKey } from './storage'

export interface AutoBackup {
  at: number
  code: string
  /** Lifetime income at that moment (for the preview). */
  progress: number
}

export const AUTO_BACKUP_KEEP = 3
export const AUTO_BACKUP_EVERY_MS = 24 * 3_600_000
export const BACKUP_REMIND_EVERY_MS = 7 * 86_400_000
/** The reminder returns only after this much more progress (×). */
export const BACKUP_REMIND_GROWTH = 10

/** New list after offering `entry`: at most one per day (unless forced), newest first, the oldest drop out. */
export function addAutoBackup(list: readonly AutoBackup[], entry: AutoBackup, force = false): AutoBackup[] {
  const newest = list[0]
  if (!force && newest && entry.at - newest.at < AUTO_BACKUP_EVERY_MS) return [...list]
  if (newest && newest.code === entry.code) return [...list]
  return [entry, ...list].slice(0, AUTO_BACKUP_KEEP)
}

export interface ReminderInput {
  now: number
  /** Sessions on this device, including the current one. */
  sessions: number
  /** Last time the player copied or saved the code (0 = never). */
  lastBackupAt: number
  /** Last time the reminder showed (0 = never). */
  lastRemindAt: number
  /** First start on this device. */
  firstSeenAt: number
  progress: number
  /** Progress when the reminder last showed. */
  progressAtRemind: number
}

/** Remind at most every 7 days, only after big progress, never in the first session. */
export function backupReminderDue(i: ReminderInput): boolean {
  if (i.sessions < 2 || i.progress <= 0) return false
  const since = Math.max(i.lastBackupAt, i.lastRemindAt, i.firstSeenAt)
  if (i.now - since < BACKUP_REMIND_EVERY_MS) return false
  return i.progressAtRemind <= 0 || i.progress >= i.progressAtRemind * BACKUP_REMIND_GROWTH
}

export interface AutoBackupStore {
  list(): AutoBackup[]
  add(entry: AutoBackup, force?: boolean): void
}

function parse(raw: unknown): AutoBackup[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((x): x is AutoBackup => typeof x === 'object' && x !== null && typeof (x as AutoBackup).code === 'string' && typeof (x as AutoBackup).at === 'number')
    .map((x) => ({ at: x.at, code: x.code, progress: typeof x.progress === 'number' ? x.progress : 0 }))
    .slice(0, AUTO_BACKUP_KEEP)
}

export function createAutoBackups(gameId: string): AutoBackupStore {
  const key = `${gameId}-autobackup-v1`
  const list = () => parse(readJson<unknown>(key, []))
  return {
    list,
    add: (entry, force) => {
      const next = addAutoBackup(list(), entry, force)
      writeKey(key, JSON.stringify(next))
    },
  }
}
