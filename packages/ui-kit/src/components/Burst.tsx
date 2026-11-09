import type { ReactNode } from 'react'
import { burstMax, burstSeconds, MODULE, type BurstState } from '@engine/core'
import { useEngine } from '@engine/react'
import { useUi } from '../useUi'

/** Burst tap button with charges; `label` is the game's name for it. */
export function BurstButton({ label, icon }: { label: string; icon?: ReactNode }) {
  const ui = useUi()
  const { world, dispatch, state } = useEngine(ui.rt)
  const b = world.get<BurstState>(MODULE.burst)
  const max = burstMax(world)
  const charges = b?.charges ?? 0
  const wait = b && b.nextAt > 0 ? Math.max(0, b.nextAt - state.core.lastSeen) : 0
  return (
    <button
      type="button"
      className="ek-burst"
      data-testid="burst"
      disabled={charges <= 0}
      onClick={() => dispatch(MODULE.burst, 'use')}
    >
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      <span className="ek-burst__label">{label}</span>
      <span className="ek-visually-hidden">+{ui.fmt(world.rate() * burstSeconds(world))}</span>
      <span className="ek-burst__charges">
        {charges}/{max}
        {charges < max && wait > 0 ? ` · ${ui.duration(wait)}` : ''}
      </span>
    </button>
  )
}
