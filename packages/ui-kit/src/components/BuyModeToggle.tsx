import { buyModeStore, useBuyMode, type BuyMode } from '../buyMode'
import { useUi } from '../useUi'

export function BuyModeToggle() {
  const { t } = useUi()
  const mode = useBuyMode()
  const opts: [BuyMode, string][] = [
    [1, t.buyMode.one],
    [10, t.buyMode.ten],
    ['max', t.buyMode.max],
  ]
  return (
    <div className="ek-segmented" role="radiogroup" aria-label={t.buyMode.label}>
      {opts.map(([m, label]) => (
        <button key={String(m)} type="button" role="radio" aria-checked={mode === m} className={mode === m ? 'is-active' : ''} data-testid={`buymode-${m}`} onClick={() => buyModeStore.set(m)}>
          {label}
        </button>
      ))}
    </div>
  )
}
