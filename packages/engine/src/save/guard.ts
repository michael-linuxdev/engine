/**
 * When must the save NOT be written?
 *  - 'newer':    stored save comes from a newer app version → never overwrite
 *  - 'otherTab': the game already runs in another window (first one saves)
 *  - 'foreign':  stored data belongs to something else → never overwrite
 *  - 'pending':  briefly at start until the lock is settled
 * 'newer' and 'foreign' are sticky.
 */
export type SaveBlock = null | 'pending' | 'newer' | 'otherTab' | 'foreign'

export interface SaveGuard {
  get(): SaveBlock
  set(next: SaveBlock): void
  subscribe(cb: (b: SaveBlock) => void): () => void
  canWrite(): boolean
}

export function createSaveGuard(): SaveGuard {
  let block: SaveBlock = null
  const listeners = new Set<(b: SaveBlock) => void>()
  return {
    get: () => block,
    set: (next) => {
      if ((block === 'newer' || block === 'foreign') && next !== block) return
      if (block === next) return
      block = next
      for (const cb of listeners) cb(block)
    },
    subscribe: (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    canWrite: () => block === null,
  }
}

/** Adapter for saving a file (browser implementation lives in @engine/react). */
export type FileSaveResult = 'shared' | 'downloaded' | 'cancelled' | 'failed'
export interface FileAdapter {
  save(name: string, content: string, type: string): Promise<FileSaveResult>
}
