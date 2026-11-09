/**
 * Name guard: brand names, franchise coinages and names of earlier projects
 * must not appear anywhere in the repo (docs/marken/denylist.txt).
 *
 * List format, one entry per line:
 *   - `# …` comment; `## @<category>` starts a category (e.g. `## @own`)
 *   - plain entries are regexes matched case-insensitively
 *   - `cs:` prefix → case-sensitive (e.g. `cs:\bEnts?\b`)
 */
import { read, walk } from './files'

export interface DenyEntry {
  re: RegExp
  source: string
  category: string
  line: number
}

export interface Hit {
  file: string
  line: number
  entry: string
  category: string
  text: string
}

export function parseDenylist(text: string): DenyEntry[] {
  const out: DenyEntry[] = []
  let category = 'general'
  text.split('\n').forEach((raw, i) => {
    const line = raw.trim()
    if (!line) return
    const cat = /^##\s*@(\S+)/.exec(line)
    if (cat) {
      category = cat[1]
      return
    }
    if (line.startsWith('#')) return
    const cs = line.startsWith('cs:')
    const src = cs ? line.slice(3) : line
    out.push({ re: new RegExp(src, cs ? 'u' : 'iu'), source: line, category, line: i + 1 })
  })
  return out
}

export interface ScanOptions {
  root: string
  /** Repo-relative directories (or files) to scan. */
  include: readonly string[]
  /** Path prefixes to skip. */
  exclude?: readonly string[]
  /** Per path prefix: categories allowed there (e.g. the reference docs may name the reference game). */
  allowCategories?: Readonly<Record<string, readonly string[]>>
}

export function listFiles(opts: ScanOptions): string[] {
  const files: string[] = []
  for (const inc of opts.include) {
    if (/\.[a-z]+$/i.test(inc)) files.push(inc)
    else walk(opts.root, inc, files)
  }
  return files.filter((f) => !(opts.exclude ?? []).some((e) => f === e || f.startsWith(e.endsWith('/') ? e : e + '/')))
}

export function scan(entries: readonly DenyEntry[], opts: ScanOptions): Hit[] {
  const hits: Hit[] = []
  for (const file of listFiles(opts)) {
    let text: string
    try {
      text = read(opts.root, file)
    } catch {
      continue
    }
    const allowed = Object.entries(opts.allowCategories ?? {})
      .filter(([prefix]) => file.startsWith(prefix))
      .flatMap(([, cats]) => cats)
    const lines = text.split('\n')
    lines.forEach((line, i) => {
      for (const e of entries) {
        if (allowed.includes(e.category)) continue
        if (e.re.test(line)) {
          hits.push({ file, line: i + 1, entry: e.source, category: e.category, text: line.trim().slice(0, 120) })
          break
        }
      }
    })
  }
  return hits
}

/** Plain word list (games/<game>/terms.txt): one term per line, `#` comments; matched case-sensitively as whole words. */
export function parseTerms(text: string): DenyEntry[] {
  return text
    .split('\n')
    .map((l, i) => ({ l: l.trim(), i }))
    .filter(({ l }) => l && !l.startsWith('#'))
    .map(({ l, i }) => {
      const esc = l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      return { re: new RegExp(`(?<![\\p{L}])${esc}(?![\\p{L}])`, 'u'), source: l, category: 'term', line: i + 1 }
    })
}

export function formatHits(hits: readonly Hit[]): string[] {
  return hits.map((h) => `${h.file}:${h.line} [${h.category}] ${h.entry} → ${h.text}`)
}
