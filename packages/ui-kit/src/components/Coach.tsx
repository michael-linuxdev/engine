import { useUi } from '../useUi'

/** FTUE coach: small card above the tab bar with title, text and skip. Never covers the HUD. */
export function FtueCoach({ title, body, skipLabel, onSkip, testId = 'ftue' }: { title: string; body: string; skipLabel: string; onSkip: () => void; testId?: string }) {
  void useUi()
  return (
    <aside className="ek-coach" role="status" aria-live="polite" data-testid={testId}>
      <strong className="ek-coach__title">{title}</strong>
      <span>{body}</span>
      <button type="button" className="ek-btn ek-btn--ghost ek-btn--small" data-testid={`${testId}-skip`} onClick={onSkip}>
        {skipLabel}
      </button>
    </aside>
  )
}
