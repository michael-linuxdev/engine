import { describe, expect, it } from 'vitest'
import {
  addNum, clampNum, createRng, formatInt, formatMult, formatMultPercent, formatNumber, MAX_NUM, mulNum, NUMBER_LOCALES, powNum,
  resolve, resolveValue, rngFromString, rngToString, targetMatches, type EffectSource,
} from '../src'

const de = NUMBER_LOCALES.de
const en = NUMBER_LOCALES.en

describe('Num', () => {
  it('clamps into [0, MAX_NUM]', () => {
    expect(clampNum(NaN)).toBe(0)
    expect(clampNum(-5)).toBe(0)
    expect(clampNum(Infinity)).toBe(MAX_NUM)
    expect(addNum(MAX_NUM, MAX_NUM)).toBe(MAX_NUM)
    expect(mulNum(1e200, 1e200)).toBe(MAX_NUM)
    expect(powNum(10, 400)).toBe(MAX_NUM)
  })
})

describe('format', () => {
  it('small numbers and grouping', () => {
    expect(formatNumber(0, de)).toBe('0')
    expect(formatNumber(5.25, de)).toBe('5,2')
    expect(formatNumber(5.25, en)).toBe('5.2')
    expect(formatNumber(999, en)).toBe('999')
    expect(formatInt(1234567, de)).toBe('1.234.567')
    expect(formatInt(1234567, en)).toBe('1,234,567')
  })
  it('compact suffixes per locale', () => {
    expect(formatNumber(1234, de)).toBe('1,23 Tsd.')
    expect(formatNumber(1234, en)).toBe('1.23K')
    expect(formatNumber(2.5e6, de)).toBe('2,5 Mio.')
    expect(formatNumber(999_999, en)).toBe('999K')
    expect(formatNumber(1e6, en)).toBe('1M')
    expect(formatNumber(3e9, en)).toBe('3B')
  })
  it('stays short and finite up to 1e300', () => {
    for (let e = 3; e <= 300; e++) {
      for (const loc of [de, en]) {
        const s = formatNumber(1.5 * 10 ** e > MAX_NUM ? MAX_NUM : 1.5 * 10 ** e, loc)
        expect(s).not.toMatch(/Infinity|NaN|e\+|undefined/)
        expect(s.length).toBeLessThanOrEqual(12)
      }
    }
    expect(formatNumber(Infinity, en)).toBe('∞')
    expect(formatNumber(MAX_NUM, en, { style: 'scientific' })).toBe('1e300')
    expect(formatNumber(-1500, en)).toBe('−1.5K')
  })
  it('multipliers', () => {
    expect(formatMultPercent(1.25, de)).toBe('+25 %')
    expect(formatMultPercent(1.25, en)).toBe('+25%')
    expect(formatMult(2.5, de)).toBe('×2,5')
  })
})

describe('rng', () => {
  it('is deterministic and serialisable', () => {
    const a = createRng(7)
    const b = createRng(7)
    const xs = Array.from({ length: 20 }, () => a.next())
    expect(Array.from({ length: 20 }, () => b.next())).toEqual(xs)
    for (const x of xs) expect(x >= 0 && x < 1).toBe(true)
    const c = createRng(rngFromString(rngToString(a.state())))
    expect(c.next()).toBe(a.next())
    expect(rngFromString('zz', 5)).toBe(5)
  })
})

describe('effect pipeline', () => {
  const src: EffectSource[] = [
    { id: 'p', target: 'rate:*', op: 'pow', value: 2, labelKey: 'x' },
    { id: 'm', target: 'rate:*', op: 'mul', value: 3, labelKey: 'x' },
    { id: 'a', target: 'rate:a', op: 'add', value: 1, labelKey: 'x' },
    { id: 'o', target: 'rate:b', op: 'mul', value: 100, labelKey: 'x' },
    { id: 'n', target: 'rate:*', op: 'mul', value: NaN, labelKey: 'x' },
  ]
  it('applies add → mul → pow, wildcard and exact targets', () => {
    // (1 + 1) · 3 = 6, ^2 = 36
    expect(resolveValue('rate:a', 1, src)).toBe(36)
    const r = resolve('rate:a', 1, src)
    expect(r.value).toBe(36)
    expect(r.parts.map((p) => p.id)).toEqual(['a', 'm', 'p'])
    expect(targetMatches('rate:*', 'rate:x')).toBe(true)
    expect(targetMatches('rate:*', 'cost:x')).toBe(false)
    expect(targetMatches('rate:x', 'rate:y')).toBe(false)
  })
  it('never returns Infinity', () => {
    expect(Number.isFinite(resolveValue('t', 1e300, [{ id: 'x', target: 't', op: 'mul', value: 1e300, labelKey: '' }]))).toBe(true)
  })
})
