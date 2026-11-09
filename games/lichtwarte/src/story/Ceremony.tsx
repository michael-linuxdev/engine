import { Button, Sheet, useUi } from '@engine/ui'
import { t } from '../runtime'

/** Kurze Zeremonie nach einer Mondwende (bzw. höheren Schicht). */
export function Ceremony({ layer, payout, currency, onDone }: { layer: string; payout: number; currency: string; onDone: () => void }) {
  const ui = useUi()
  const name = ui.labels.layer(layer).name
  return (
    <Sheet open title={t.ceremony.title(name)} onClose={onDone} testId="ceremony" className="lw-ceremony">
      <div className="lw-ceremony__moon" aria-hidden="true" />
      <p>{t.ceremony.body(ui.fmt(payout), ui.labels.currency(currency))}</p>
      <Button data-testid="ceremony-ok" onClick={onDone}>
        {t.ceremony.cta}
      </Button>
    </Sheet>
  )
}
