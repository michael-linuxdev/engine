/** From this absence (ms) on the return shows as a window; below it the game only offers a collect button. */
export const WELCOME_FROM_MS = 5 * 60_000

/** Day, month and year of a timestamp as zero-padded parts for `t.common.date`. */
export function dateParts(at: number): [string, string, string] {
  const d = new Date(at)
  return [String(d.getDate()).padStart(2, '0'), String(d.getMonth() + 1).padStart(2, '0'), String(d.getFullYear())]
}
