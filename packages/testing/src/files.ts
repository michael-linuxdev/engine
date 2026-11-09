/** File walking for the repo guards (node only). */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

export const TEXT_EXT = /\.(ts|tsx|js|mjs|cjs|json|md|txt|css|html|svg|ya?ml)$/

export const SKIP_DIRS = new Set(['node_modules', 'dist', '.tsbuild', '.git', 'e2e-screens', 'art-diff', 'art-baseline', '.vite'])

/** All text files below `dir`, as repo-relative posix paths. */
export function walk(root: string, dir: string, out: string[] = []): string[] {
  let names: string[]
  try {
    names = readdirSync(join(root, dir))
  } catch {
    return out
  }
  for (const name of names) {
    if (SKIP_DIRS.has(name)) continue
    const rel = dir ? `${dir}/${name}` : name
    const abs = join(root, rel)
    if (statSync(abs).isDirectory()) walk(root, rel, out)
    else if (TEXT_EXT.test(name)) out.push(rel)
  }
  return out
}

export function read(root: string, rel: string): string {
  return readFileSync(join(root, rel), 'utf8')
}

export function toPosix(root: string, abs: string): string {
  return relative(root, abs).split(sep).join('/')
}
