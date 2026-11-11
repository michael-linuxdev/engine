/** Wächterrang: kleine Kachel in der Kopfzeile (Rang und Balken) und das Fenster dazu. */
import { useEffect, useRef, useState } from 'react'
import { levelMult, levelOf, MODULE, type ProgressionState } from '@engine/core'
import { useEngine } from '@engine/react'
import { ProgressBar, Sheet, useUi } from '@engine/ui'
import { game } from '../game'
import { t } from '../runtime'

function useRank() {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const xp = world.get<ProgressionState | undefined>(MODULE.progression)?.xp ?? 0
  return levelOf(xp, game.balance)
}

/** Kachel in der Kopfzeile; pulsiert kurz beim Aufstieg. */
export function RankTile({ onOpen }: { onOpen: () => void }) {
  const r = useRank()
  const seen = useRef(r.level)
  const [pulse, setPulse] = useState(0)
  useEffect(() => {
    if (r.level > seen.current) setPulse(r.level)
    seen.current = r.level
  }, [r.level])
  return (
    <button type="button" key={pulse} className={`lw-hud-btn lw-rank${pulse ? ' is-up' : ''}`} data-testid="hud-rank" data-level={r.level} onClick={onOpen}>
      <strong aria-hidden="true">{r.level}</strong>
      <span>{t.rank.short}</span>
      <span className="lw-rank__bar" aria-hidden="true">
        <i style={{ width: `${Math.round(r.ratio * 100)}%` }} />
      </span>
      <span className="ek-visually-hidden">{t.rank.title(String(r.level))}</span>
    </button>
  )
}

export function RankSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ui = useUi()
  const r = useRank()
  const mult = levelMult(r.level, game.balance)
  const next = game.levelRewards.find((x) => x.level > r.level)
  return (
    <Sheet open={open} title={t.rank.title(String(r.level))} onClose={onClose} testId="rank-sheet">
      <p>{t.rank.blurb}</p>
      <ProgressBar ratio={r.ratio} label={t.rank.progress(ui.fmt(r.into), ui.fmt(r.need))} />
      <p className="ek-muted">{t.rank.progress(ui.fmt(r.into), ui.fmt(r.need))}</p>
      <p className="ek-strong">{t.rank.bonus(ui.fmt(mult))}</p>
      {next ? (
        <p className="ek-note" data-testid="rank-next">
          {t.rank.next(String(next.level), next.grant.map((g) => `${ui.fmt(g.amount)} ${ui.labels.currency(g.currency)}`).join(', '))}
        </p>
      ) : null}
    </Sheet>
  )
}
