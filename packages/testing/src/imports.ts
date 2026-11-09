/** Static import checks (direction, forbidden APIs). */
import { read } from './files'

const IMPORT_RE = /(?:^|\s)(?:import|export)\s[^'"]*?from\s+['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)|^\s*import\s+['"]([^'"]+)['"]/gm

export function importsOf(text: string): string[] {
  const out: string[] = []
  for (const m of text.matchAll(IMPORT_RE)) out.push(m[1] ?? m[2] ?? m[3])
  return out
}

export interface Violation {
  file: string
  detail: string
}

/** Files under `files` must not import specifiers matching `forbidden`. */
export function checkImports(root: string, files: readonly string[], forbidden: (spec: string, file: string) => boolean): Violation[] {
  const out: Violation[] = []
  for (const f of files) {
    if (!/\.(ts|tsx|mjs|js)$/.test(f)) continue
    for (const spec of importsOf(read(root, f))) if (forbidden(spec, f)) out.push({ file: f, detail: spec })
  }
  return out
}

/** Lines matching any pattern (comments stripped first). */
export function checkPatterns(root: string, files: readonly string[], patterns: readonly RegExp[]): Violation[] {
  const out: Violation[] = []
  for (const f of files) {
    if (!/\.(ts|tsx)$/.test(f)) continue
    const code = read(root, f)
      .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
      .replace(/(^|[^:'"`])\/\/.*$/gm, '$1')
    code.split('\n').forEach((line, i) => {
      for (const p of patterns) if (p.test(line)) out.push({ file: `${f}:${i + 1}`, detail: line.trim().slice(0, 100) })
    })
  }
  return out
}
