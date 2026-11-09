/**
 * Browser FileAdapter: on iOS the share sheet first ("Save to Files"), else a
 * download whose blob URL is only revoked after a minute (iOS opens it in its
 * own view; revoking early shows "WebKitBlobResource error 1").
 */
import type { FileAdapter, FileSaveResult } from '@engine/core'

export const BLOB_URL_KEEP_MS = 60_000

interface ShareNav {
  share?: (data: ShareData) => Promise<void>
  canShare?: (data: ShareData) => boolean
}

export function prefersShare(ua: string, maxTouchPoints = 0): boolean {
  if (/iPhone|iPad|iPod/.test(ua)) return true
  return /Macintosh/.test(ua) && maxTouchPoints > 1
}

export const browserFiles: FileAdapter = {
  async save(name, content, type): Promise<FileSaveResult> {
    const blob = new Blob([content], { type })
    const nav = navigator as Navigator & ShareNav
    const file = typeof File !== 'undefined' ? new File([blob], name, { type }) : null
    if (file && prefersShare(nav.userAgent, nav.maxTouchPoints) && nav.share && nav.canShare?.({ files: [file] })) {
      try {
        await nav.share({ files: [file] })
        return 'shared'
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled'
      }
    }
    try {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = name
      a.rel = 'noopener'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), BLOB_URL_KEEP_MS)
      return 'downloaded'
    } catch {
      return 'failed'
    }
  },
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
