/**
 * Manual update check for the installed web app ("update now" in the
 * settings). The service worker updates on its own in the background; this
 * pulls a new version right away and reloads into it.
 */
export type UpdateResult = 'reloading' | 'current' | 'offline' | 'unsupported'

interface WorkerLike {
  state: string
  postMessage(msg: unknown): void
  addEventListener(type: 'statechange', cb: () => void): void
}

interface RegistrationLike {
  update(): Promise<unknown>
  installing?: WorkerLike | null
  waiting?: WorkerLike | null
}

export interface UpdateEnv {
  /** `navigator.serviceWorker` (missing in browsers without support). */
  serviceWorker?: { getRegistration(): Promise<RegistrationLike | undefined> }
  online: boolean
  reload: () => void
  /** Give up waiting for the new worker after this long and reload anyway. */
  timeoutMs?: number
}

function browserEnv(): UpdateEnv {
  const nav = typeof navigator === 'undefined' ? undefined : navigator
  return {
    serviceWorker: nav && 'serviceWorker' in nav ? (nav.serviceWorker as unknown as UpdateEnv['serviceWorker']) : undefined,
    online: nav ? nav.onLine !== false : false,
    reload: () => location.reload(),
  }
}

function activated(sw: WorkerLike, timeoutMs: number): Promise<void> {
  return new Promise((resolve) => {
    if (sw.state === 'activated') return resolve()
    sw.addEventListener('statechange', () => {
      if (sw.state === 'activated' || sw.state === 'redundant') resolve()
    })
    setTimeout(resolve, timeoutMs)
  })
}

/** Look for a new version; if there is one, activate it and reload. */
export async function checkForUpdate(env: UpdateEnv = browserEnv()): Promise<UpdateResult> {
  if (!env.serviceWorker) return 'unsupported'
  const reg = await env.serviceWorker.getRegistration()
  if (!reg) return 'unsupported'
  try {
    await reg.update()
  } catch {
    return env.online ? 'current' : 'offline'
  }
  const incoming = reg.installing ?? reg.waiting
  if (!incoming) return env.online ? 'current' : 'offline'
  if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' })
  await activated(incoming, env.timeoutMs ?? 10_000)
  env.reload()
  return 'reloading'
}
