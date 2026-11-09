/**
 * Number formatting per locale, without `toLocaleString` (results differ
 * between runtimes). The locale tables are formatting conventions, not game
 * copy; the UI picks one via the active language.
 *
 * Range: 0 … 1e300. Named short scales first, then two-letter group codes
 * (aa, ab, …) so every value up to MAX_NUM stays short.
 */
import { clampNum } from './num'

export interface NumberLocale {
  decimal: string
  group: string
  /** Suffix per thousand-group (index 1 = 10^3). */
  suffixes: readonly string[]
}

export const NUMBER_LOCALES = {
  de: {
    decimal: ',',
    group: '.',
    suffixes: ['', ' Tsd.', ' Mio.', ' Mrd.', ' Bio.', ' Brd.', ' Trio.', ' Trd.', ' Qio.', ' Qrd.', ' Qui.', ' Qtd.'],
  },
  en: {
    decimal: '.',
    group: ',',
    suffixes: ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'],
  },
} as const satisfies Record<string, NumberLocale>

export type NumberStyle = 'compact' | 'scientific'

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'

/** Two-letter code for groups beyond the named suffixes. */
function groupCode(index: number, named: number): string {
  const k = index - named
  return LETTERS[Math.floor(k / 26) % 26] + LETTERS[k % 26]
}

function groupInt(intPart: string, sep: string): string {
  let out = ''
  for (let i = 0; i < intPart.length; i++) {
    if (i > 0 && (intPart.length - i) % 3 === 0) out += sep
    out += intPart[i]
  }
  return out
}

/** Fixed digits, trailing zeros removed. */
function fixed(v: number, digits: number, loc: NumberLocale): string {
  const s = v.toFixed(digits)
  const [i, f = ''] = s.split('.')
  const frac = f.replace(/0+$/, '')
  return groupInt(i, loc.group) + (frac ? loc.decimal + frac : '')
}

/** Whole number with grouping, e.g. 1.234.567 / 1,234,567. Falls back to compact above 1e15. */
export function formatInt(n: number, loc: NumberLocale): string {
  const v = Math.floor(clampNum(n))
  if (v >= 1e15) return formatNumber(v, loc)
  return groupInt(String(v), loc.group)
}

/**
 * Compact amount: < 1000 with up to `smallDigits` decimals, above that three
 * significant digits and a suffix (1,23 Mio. / 1.23M).
 */
export function formatNumber(n: number, loc: NumberLocale, opts: { style?: NumberStyle; smallDigits?: number } = {}): string {
  if (Number.isNaN(n)) return '0'
  if (n === Infinity) return '∞'
  const neg = n < 0
  const v = clampNum(Math.abs(n))
  const sign = neg ? '−' : ''
  if (v < 1000) {
    const d = opts.smallDigits ?? (v < 10 ? 1 : 0)
    return sign + fixed(Math.floor(v * 10 ** d) / 10 ** d, d, loc)
  }
  if (opts.style === 'scientific') {
    let exp = Math.floor(Math.log10(v))
    let mant = v / 10 ** exp
    if (mant >= 9.995) {
      mant /= 10
      exp += 1
    }
    return `${sign}${fixed(mant, 2, loc)}e${exp}`
  }
  // Amounts are floored, never rounded up: the display never shows more than the player has.
  let index = Math.floor(Math.log10(v) / 3)
  let scaled = v / 10 ** (index * 3)
  // log10 imprecision right at a power of 1000
  if (scaled < 1) {
    index -= 1
    scaled *= 1000
  }
  const digits = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2
  const named = loc.suffixes.length
  const suffix = index < named ? loc.suffixes[index] : (loc.suffixes[1].startsWith(' ') ? ' ' : '') + groupCode(index, named)
  const shown = Math.floor(scaled * 10 ** digits) / 10 ** digits
  return sign + fixed(shown, digits, loc) + suffix
}

/** Percent from a multiplier: 1.25 → "+25 %" / "+25%". */
export function formatMultPercent(mult: number, loc: NumberLocale): string {
  const pct = (mult - 1) * 100
  const space = loc.decimal === ',' ? ' ' : ''
  const body = fixed(Math.round(Math.abs(pct) * 10) / 10, 1, loc)
  return `${pct < 0 ? '−' : '+'}${body}${space}%`
}

/** Multiplier: 2.5 → "×2,5". */
export function formatMult(mult: number, loc: NumberLocale): string {
  if (mult >= 1000) return '×' + formatNumber(mult, loc)
  return '×' + fixed(Math.round(mult * 100) / 100, 2, loc)
}
