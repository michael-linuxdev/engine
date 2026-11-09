/**
 * Backup code: every stored key of a game bundled into one copyable text
 * with a checksum. `PREFIX` + base64(UTF-8 JSON). No server: the code is the
 * backup. Pure (no DOM): UTF-8 and base64 are implemented here.
 */
export const BUNDLE_VERSION = 1

export interface BackupBundle {
  app: string
  v: number
  at: number
  data: Record<string, string>
  /** FNV-1a 32 of JSON.stringify(data), hex. */
  sum: string
}

export type DecodeResult =
  | { ok: true; bundle: BackupBundle }
  | { ok: false; reason: 'format' | 'checksum' | 'app' | 'newer' }

export function fnv1a(text: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16).padStart(8, '0')
}

function utf8(text: string): number[] {
  const out: number[] = []
  for (const ch of text) {
    let c = ch.codePointAt(0)!
    if (c < 0x80) out.push(c)
    else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63))
    else if (c < 0x10000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63))
    else {
      out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63))
    }
  }
  return out
}

function fromUtf8(bytes: number[]): string {
  let s = ''
  for (let i = 0; i < bytes.length; ) {
    const b = bytes[i]
    let c: number
    if (b < 0x80) {
      c = b
      i += 1
    } else if (b < 0xe0) {
      c = ((b & 31) << 6) | (bytes[i + 1] & 63)
      i += 2
    } else if (b < 0xf0) {
      c = ((b & 15) << 12) | ((bytes[i + 1] & 63) << 6) | (bytes[i + 2] & 63)
      i += 3
    } else {
      c = ((b & 7) << 18) | ((bytes[i + 1] & 63) << 12) | ((bytes[i + 2] & 63) << 6) | (bytes[i + 3] & 63)
      i += 4
    }
    s += String.fromCodePoint(c)
  }
  return s
}

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

export function toBase64(text: string): string {
  const b = utf8(text)
  let out = ''
  for (let i = 0; i < b.length; i += 3) {
    const n = (b[i] << 16) | ((b[i + 1] ?? 0) << 8) | (b[i + 2] ?? 0)
    out += B64[(n >> 18) & 63] + B64[(n >> 12) & 63] + (i + 1 < b.length ? B64[(n >> 6) & 63] : '=') + (i + 2 < b.length ? B64[n & 63] : '=')
  }
  return out
}

export function fromBase64(code: string): string {
  const clean = code.replace(/[^A-Za-z0-9+/]/g, '')
  const bytes: number[] = []
  for (let i = 0; i < clean.length; i += 4) {
    const n = (B64.indexOf(clean[i]) << 18) | (B64.indexOf(clean[i + 1]) << 12) | ((B64.indexOf(clean[i + 2] ?? 'A') & 63) << 6) | (B64.indexOf(clean[i + 3] ?? 'A') & 63)
    bytes.push((n >> 16) & 255)
    if (clean[i + 2] !== undefined) bytes.push((n >> 8) & 255)
    if (clean[i + 3] !== undefined) bytes.push(n & 255)
  }
  return fromUtf8(bytes)
}

export function encodeBackup(prefix: string, app: string, data: Record<string, string>, at: number): string {
  const bundle: BackupBundle = { app, v: BUNDLE_VERSION, at, data, sum: fnv1a(JSON.stringify(data)) }
  return prefix + toBase64(JSON.stringify(bundle))
}

/** Accepts the code or the raw JSON of a bundle (file import). */
export function decodeBackup(prefix: string, app: string, input: string): DecodeResult {
  try {
    const t = input.trim()
    const json = t.startsWith(prefix) ? fromBase64(t.slice(prefix.length)) : t
    const b = JSON.parse(json) as Partial<BackupBundle>
    if (typeof b !== 'object' || b === null || typeof b.data !== 'object' || b.data === null) return { ok: false, reason: 'format' }
    if (b.app !== app) return { ok: false, reason: 'app' }
    if (typeof b.v !== 'number' || b.v < 1) return { ok: false, reason: 'format' }
    if (b.v > BUNDLE_VERSION) return { ok: false, reason: 'newer' }
    for (const v of Object.values(b.data)) if (typeof v !== 'string') return { ok: false, reason: 'format' }
    if (b.sum !== fnv1a(JSON.stringify(b.data))) return { ok: false, reason: 'checksum' }
    return { ok: true, bundle: b as BackupBundle }
  } catch {
    return { ok: false, reason: 'format' }
  }
}
