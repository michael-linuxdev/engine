/** One window saves: Web Locks; a second window waits and reloads once the first closes. */
import type { SaveGuard } from '@engine/core'

interface LockManagerLike {
  request: (name: string, options: { ifAvailable?: boolean }, cb: (lock: unknown) => Promise<unknown> | unknown) => Promise<unknown>
}

export function startSaveLock(guard: SaveGuard, name: string, reload: () => void = () => location.reload()): void {
  const locks = (navigator as Navigator & { locks?: LockManagerLike }).locks
  if (!locks?.request) return
  guard.set('pending')
  const forever = () => new Promise<void>(() => {})
  locks
    .request(name, { ifAvailable: true }, (lock) => {
      if (lock) {
        if (guard.get() === 'pending') guard.set(null)
        return forever()
      }
      guard.set('otherTab')
      void locks.request(name, {}, () => {
        reload()
        return forever()
      })
      return undefined
    })
    .catch(() => {
      if (guard.get() === 'pending') guard.set(null)
    })
}
