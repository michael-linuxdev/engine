/** „Bald fertig“ oben im Menü: laufende Zeiten auf einen Blick (Kessel, Verstärker, Omen, Sternenfenster). */
import { CHOICES_ID, COMBINE_ID, FLASH_ID, MARKET_ID, VOYAGES_ID, type ChoiceState, type CombineState, type FlashState, type MarketState, type VoyagesState } from '@engine/core'
import { useEngine } from '@engine/react'
import { useUi } from '@engine/ui'
import { t } from '../runtime'

export function Soon() {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const now = ui.rt.clock.now()
  const rows: { id: string; text: string }[] = []
  const brew = world.get<CombineState | undefined>(COMBINE_ID)
  if (brew?.recipe) rows.push({ id: 'brew', text: brew.until > now ? t.soon.brew(ui.duration(brew.until - now)) : t.soon.brewDone })
  const m = world.get<MarketState | undefined>(MARKET_ID)
  if (m && m.boostUntil > now) rows.push({ id: 'boost', text: t.soon.boost(ui.duration(m.boostUntil - now)) })
  if (m && m.circleUntil > now) rows.push({ id: 'circle', text: t.soon.circle(ui.duration(m.circleUntil - now)) })
  const omen = world.get<ChoiceState | undefined>(CHOICES_ID)
  if (omen?.active && omen.until > now) rows.push({ id: 'omen', text: t.soon.omen(ui.duration(omen.until - now)) })
  const flash = world.get<FlashState | undefined>(FLASH_ID)
  if (flash?.active && flash.endsAt > now) rows.push({ id: 'flash', text: t.soon.flash(ui.duration(flash.endsAt - now)) })
  const voyage = world.get<VoyagesState | undefined>(VOYAGES_ID)
  if (voyage?.active) rows.push({ id: 'voyage', text: voyage.until > now ? t.soon.voyage(ui.duration(voyage.until - now)) : t.soon.voyageBack })
  if (!rows.length) return null
  return (
    <section className="lw-soon" aria-label={ui.t.nav.soon} data-testid="menu-soon">
      <h3 className="ek-h3">{ui.t.nav.soon}</h3>
      <ul>
        {rows.map((r) => (
          <li key={r.id} data-testid={`soon-${r.id}`}>{r.text}</li>
        ))}
      </ul>
    </section>
  )
}
