/**
 * i18n guards for every game (ADR 0007):
 *  - static: `t.` is never read in module scope (AST)
 *  - stale: texts copied at import time show up after a switch to a pseudo locale
 *  - complete: same keys in de and en, no empty texts
 *  - placeholders: functions use the same arguments in both languages
 */
import { readFileSync } from 'node:fs'
import { parseAst } from 'rolldown/parseAst'
import { describe, expect, it } from 'vitest'

type Node = { type: string; start: number; [k: string]: unknown }
const FN = new Set(['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'])

/** Byte offsets of `t.<x>` reads outside any function. */
export function moduleScopeTReads(src: string, lang: 'ts' | 'tsx'): number[] {
  const ast = parseAst(src, { lang }) as unknown as Node
  const hits: number[] = []
  const walk = (n: unknown, inFn: boolean): void => {
    if (!n || typeof n !== 'object') return
    if (Array.isArray(n)) {
      for (const x of n) walk(x, inFn)
      return
    }
    const node = n as Node
    if (typeof node.type !== 'string') return
    const fn = inFn || FN.has(node.type) || node.type === 'MethodDefinition' || (node.type === 'Property' && (node.kind === 'get' || node.method === true))
    if (!fn && node.type === 'MemberExpression' && (node.object as Node).type === 'Identifier' && (node.object as { name: string }).name === 't') hits.push(node.start)
    for (const [k, v] of Object.entries(node)) if (k !== 'type') walk(v, fn)
  }
  walk(ast, false)
  return hits
}


function leaves(o: unknown, path: string[] = [], out: [string, unknown][] = []): [string, unknown][] {
  if (typeof o === 'object' && o !== null && !Array.isArray(o)) for (const [k, v] of Object.entries(o)) leaves(v, [...path, k], out)
  else out.push([path.join('.'), o])
  return out
}

const MARK = (i: number) => `⟨${i}⟩`

/** Placeholders a text uses: `{name}` in strings, marker args in functions. */
export function placeholders(v: unknown): string[] {
  if (typeof v === 'string') return [...v.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()
  if (typeof v === 'function') {
    const n = Math.max(v.length, 3)
    let out = ''
    try {
      out = String((v as (...a: unknown[]) => unknown)(...Array.from({ length: n }, (_, i) => MARK(i))))
    } catch {
      // numeric functions: try numbers
      out = String((v as (...a: unknown[]) => unknown)(...Array.from({ length: n }, (_, i) => i + 2)))
      return ['num']
    }
    return Array.from({ length: n }, (_, i) => i).filter((i) => out.includes(MARK(i))).map(String)
  }
  return []
}

/** Deep pseudo copy: every text gets a marker prefix (functions wrapped). */
export function pseudo<S>(s: S, mark = '⟦'): S {
  const map = (v: unknown): unknown => {
    if (typeof v === 'string') return mark + v
    if (typeof v === 'function') return (...a: unknown[]) => mark + String((v as (...x: unknown[]) => unknown)(...a))
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, map(x)]))
    return v
  }
  return map(s) as S
}

export interface I18nGuardOptions<S extends object> {
  name: string
  de: S
  en: S
  /** Absolute paths of source files to scan for module-scope `t.` reads. */
  files: readonly string[]
  /** Runtime check: switch to pseudo strings, collect every visible text from data modules. */
  stale?: { set: (s: S) => void; restore: () => void; probe: () => readonly string[] }
}

export function describeI18nGuards<S extends object>(o: I18nGuardOptions<S>): void {
  describe(`${o.name}: Texte (de/en)`, () => {
    it('t wird nie im Modul-Gültigkeitsbereich gelesen', () => {
      const bad: string[] = []
      for (const f of o.files) {
        const src = readFileSync(f, 'utf8')
        if (!/\bt\./.test(src)) continue
        for (const pos of moduleScopeTReads(src, f.endsWith('x') ? 'tsx' : 'ts')) bad.push(`${f}:${src.slice(0, pos).split('\n').length}`)
      }
      expect(bad).toEqual([])
    })
    it('gleiche Schlüssel in beiden Sprachen', () => {
      expect(leaves(o.en).map(([k]) => k).sort()).toEqual(leaves(o.de).map(([k]) => k).sort())
    })
    it('keine leeren Texte', () => {
      const empty = [...leaves(o.de).map((x) => ['de', ...x] as const), ...leaves(o.en).map((x) => ['en', ...x] as const)].filter(([, , v]) => typeof v === 'string' && v.trim() === '').map(([l, k]) => `${l}:${k}`)
      expect(empty).toEqual([])
    })
    it('Platzhalter in beiden Sprachen gleich', () => {
      const en = new Map(leaves(o.en))
      const diff: string[] = []
      for (const [k, v] of leaves(o.de)) {
        const a = placeholders(v).join(',')
        const b = placeholders(en.get(k)).join(',')
        if (a !== b) diff.push(`${k}: de[${a}] en[${b}]`)
      }
      expect(diff).toEqual([])
    })
    if (o.stale) {
      const stale = o.stale
      it('keine beim Import kopierten Texte (Sprachwechsel live)', () => {
        stale.set(pseudo(o.de))
        try {
          const texts = stale.probe()
          expect(texts.length).toBeGreaterThan(0)
          expect(texts.filter((x) => !x.includes('⟦'))).toEqual([])
        } finally {
          stale.restore()
        }
      })
    }
  })
}

/** WCAG contrast ratio of two #rrggbb colours. */
export function contrast(a: string, b: string): number {
  const lum = (hex: string) => {
    const n = hex.replace('#', '')
    const c = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4))
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
  }
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

/** `--name: #hex;` pairs from a CSS file (first block that defines them). */
export function cssTokens(css: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const m of css.matchAll(/(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{6})\b/g)) if (!(m[1] in out)) out[m[1]] = m[2].toLowerCase()
  return out
}

export const CONTRAST_PAIRS: readonly [string, string][] = [
  ['--ink', '--surface'],
  ['--ink', '--surface-2'],
  ['--ink', '--bg'],
  ['--ink-muted', '--surface'],
  ['--ink-muted', '--surface-2'],
  ['--on-accent', '--accent'],
  ['--on-accent', '--accent-2'],
  ['--on-danger', '--danger'],
  ['--accent', '--surface'],
]
