export function ProgressBar({ ratio, label }: { ratio: number; label: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, ratio)) * 100)
  return (
    <div className="ek-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={label}>
      <div className="ek-progress__fill" style={{ width: `${pct}%` }} />
    </div>
  )
}
