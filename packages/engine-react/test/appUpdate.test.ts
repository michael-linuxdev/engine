import { describe, expect, it } from 'vitest'
import { checkForUpdate, type UpdateEnv } from '../src/appUpdate'

function worker(state: string) {
  const cbs: (() => void)[] = []
  const w = { state, posted: [] as unknown[], postMessage: (m: unknown) => void w.posted.push(m), addEventListener: (_t: 'statechange', cb: () => void) => void cbs.push(cb), set: (s: string) => { w.state = s; for (const cb of cbs) cb() } }
  return w
}

describe('update now', () => {
  it('without a service worker there is nothing to update', async () => {
    let reloads = 0
    expect(await checkForUpdate({ online: true, reload: () => void reloads++ })).toBe('unsupported')
    expect(await checkForUpdate({ online: true, reload: () => void reloads++, serviceWorker: { getRegistration: async () => undefined } })).toBe('unsupported')
    expect(reloads).toBe(0)
  })
  it('no new version: current (offline when the check cannot reach the server)', async () => {
    const env = (online: boolean, fail: boolean): UpdateEnv => ({ online, reload: () => { throw new Error('must not reload') }, serviceWorker: { getRegistration: async () => ({ update: async () => { if (fail) throw new Error('net') } }) } })
    expect(await checkForUpdate(env(true, false))).toBe('current')
    expect(await checkForUpdate(env(false, true))).toBe('offline')
    expect(await checkForUpdate(env(false, false))).toBe('offline')
  })
  it('a new version is activated and the page reloads once', async () => {
    let reloads = 0
    const w = worker('installed')
    const p = checkForUpdate({ online: true, reload: () => void reloads++, serviceWorker: { getRegistration: async () => ({ update: async () => {}, waiting: w }) } })
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    w.set('activated')
    expect(await p).toBe('reloading')
    expect(w.posted).toEqual([{ type: 'SKIP_WAITING' }])
    expect(reloads).toBe(1)
  })
  it('a worker that never reports back does not block the reload', async () => {
    let reloads = 0
    const w = worker('installing')
    expect(await checkForUpdate({ online: true, timeoutMs: 5, reload: () => void reloads++, serviceWorker: { getRegistration: async () => ({ update: async () => {}, installing: w }) } })).toBe('reloading')
    expect(reloads).toBe(1)
  })
})
