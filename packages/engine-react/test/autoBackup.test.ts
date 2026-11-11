import { describe, expect, it } from 'vitest'
import { addAutoBackup, AUTO_BACKUP_EVERY_MS, AUTO_BACKUP_KEEP, BACKUP_REMIND_EVERY_MS, backupReminderDue, type AutoBackup } from '../src/autoBackup'

const b = (at: number, code = `c${at}`): AutoBackup => ({ at, code, progress: at })
const DAY = AUTO_BACKUP_EVERY_MS

describe('automatic backups', () => {
  it('keeps at most one per day, newest first, and drops the oldest', () => {
    let list: AutoBackup[] = []
    list = addAutoBackup(list, b(0))
    list = addAutoBackup(list, b(DAY / 2))
    expect(list.map((x) => x.at)).toEqual([0])
    for (let d = 1; d <= AUTO_BACKUP_KEEP + 1; d++) list = addAutoBackup(list, b(d * DAY))
    expect(list).toHaveLength(AUTO_BACKUP_KEEP)
    expect(list[0].at).toBe((AUTO_BACKUP_KEEP + 1) * DAY)
  })

  it('a forced backup (before a restore) is kept even on the same day, but not twice', () => {
    const list = addAutoBackup([b(0)], b(1000), true)
    expect(list.map((x) => x.at)).toEqual([1000, 0])
    expect(addAutoBackup(list, b(2000, 'c1000'), true)).toHaveLength(2)
  })
})

describe('backup reminder', () => {
  const base = { now: 30 * 86_400_000, sessions: 5, lastBackupAt: 0, lastRemindAt: 0, firstSeenAt: 0, progress: 1e6, progressAtRemind: 0 }
  it('never in the first session and never without progress', () => {
    expect(backupReminderDue({ ...base, sessions: 1 })).toBe(false)
    expect(backupReminderDue({ ...base, progress: 0 })).toBe(false)
  })
  it('at most every seven days, counted from the last backup or reminder', () => {
    expect(backupReminderDue(base)).toBe(true)
    expect(backupReminderDue({ ...base, lastBackupAt: base.now - BACKUP_REMIND_EVERY_MS + 1 })).toBe(false)
    expect(backupReminderDue({ ...base, firstSeenAt: base.now - 86_400_000 })).toBe(false)
  })
  it('returns only after big progress', () => {
    const later = { ...base, lastRemindAt: base.now - 8 * 86_400_000, progressAtRemind: 1e6 }
    expect(backupReminderDue({ ...later, progress: 5e6 })).toBe(false)
    expect(backupReminderDue({ ...later, progress: 1e7 })).toBe(true)
  })
})
