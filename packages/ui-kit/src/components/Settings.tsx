import { useState } from 'react'
import { decodeBackup, encodeBackup } from '@engine/core'
import { browserFiles, copyText, readKey, usePrefs, writeKey, type Prefs } from '@engine/react'
import { useUi } from '../useUi'
import { Button } from './Button'
import { Sheet } from './Sheet'

/** Backup code (copy / file) and import. `keys` = every storage key of the game that belongs to the backup. */
export function SaveSheet({ open, onClose, prefix, app, keys, fileName }: { open: boolean; onClose: () => void; prefix: string; app: string; keys: readonly string[]; fileName: (date: string) => string }) {
  const ui = useUi()
  const [msg, setMsg] = useState<string | null>(null)
  const [input, setInput] = useState('')
  if (!open) return null
  ui.rt.save()
  const data: Record<string, string> = {}
  for (const k of keys) {
    const v = readKey(k)
    if (v) data[k] = v
  }
  const now = ui.rt.clock.now()
  const code = encodeBackup(prefix, app, data, now)
  const restore = () => {
    const r = decodeBackup(prefix, app, input)
    if (!r.ok) {
      setMsg({ format: ui.t.save.errFormat, checksum: ui.t.save.errChecksum, app: ui.t.save.errApp, newer: ui.t.save.errNewer }[r.reason])
      return
    }
    ui.rt.guard.set('foreign') // never write the old state over the restored one
    for (const k of keys) {
      const v = r.bundle.data[k]
      if (v) writeKey(k, v)
    }
    setMsg(ui.t.save.importOk)
    setTimeout(() => location.reload(), 600)
  }
  return (
    <Sheet open={open} title={ui.t.save.title} onClose={onClose} testId="save-sheet">
      <p>{ui.t.save.intro}</p>
      <label className="ek-field">
        <span>{ui.t.save.code}</span>
        <textarea className="ek-code" readOnly value={code} rows={4} data-testid="save-code" onFocus={(e) => e.currentTarget.select()} />
      </label>
      <div className="ek-row-actions">
        <Button variant="secondary" data-testid="save-copy" onClick={async () => setMsg((await copyText(code)) ? ui.t.save.copied : ui.t.save.copyFailed)}>
          {ui.t.save.copy}
        </Button>
        <Button
          variant="secondary"
          data-testid="save-file"
          onClick={async () => {
            const r = await browserFiles.save(fileName(new Date(now).toISOString().slice(0, 10)), code, 'text/plain')
            if (r === 'shared' || r === 'downloaded') setMsg(ui.t.save.fileSaved)
          }}
        >
          {ui.t.save.file}
        </Button>
      </div>
      <h3 className="ek-h3">{ui.t.save.importTitle}</h3>
      <label className="ek-field">
        <span>{ui.t.save.importHint}</span>
        <textarea className="ek-code" rows={3} value={input} onChange={(e) => setInput(e.target.value)} data-testid="save-import" />
      </label>
      <Button variant="danger" data-testid="save-restore" disabled={!input.trim()} onClick={restore}>
        {ui.t.save.importCta}
      </Button>
      {msg ? (
        <p role="status" className="ek-note" data-testid="save-msg">
          {msg}
        </p>
      ) : null}
    </Sheet>
  )
}

function Toggle({ label, value, onChange, testId }: { label: string; value: boolean; onChange: (v: boolean) => void; testId: string }) {
  const { t } = useUi()
  return (
    <label className="ek-toggle">
      <span>{label}</span>
      <input type="checkbox" role="switch" checked={value} onChange={(e) => onChange(e.target.checked)} data-testid={testId} aria-label={label} />
      <span className="ek-muted" aria-hidden="true">
        {value ? t.settings.on : t.settings.off}
      </span>
    </label>
  )
}

/** Device settings (prefs, never in the save). */
export function SettingsSheet({ open, onClose, version }: { open: boolean; onClose: () => void; version: string }) {
  const ui = useUi()
  const p: Prefs = usePrefs(ui.prefs)
  const s = ui.t.settings
  return (
    <Sheet open={open} title={s.title} onClose={onClose} testId="settings-sheet">
      <h3 className="ek-h3">{s.display}</h3>
      <div className="ek-field" role="radiogroup" aria-label={s.language}>
        <span>{s.language}</span>
        <div className="ek-segmented">
          {(['de', 'en'] as const).map((l) => (
            <button key={l} type="button" role="radio" aria-checked={ui.locale === l} className={ui.locale === l ? 'is-active' : ''} data-testid={`lang-${l}`} onClick={() => ui.setLocale(l)}>
              {l === 'de' ? 'Deutsch' : 'English'}
            </button>
          ))}
        </div>
      </div>
      <div className="ek-field" role="radiogroup" aria-label={s.fontSize}>
        <span>{s.fontSize}</span>
        <div className="ek-segmented">
          {([1, 1.15, 1.3] as const).map((f, i) => (
            <button key={f} type="button" role="radio" aria-checked={p.fontScale === f} className={p.fontScale === f ? 'is-active' : ''} onClick={() => ui.prefs.update({ fontScale: f })}>
              {[s.fontNormal, s.fontLarge, s.fontLarger][i]}
            </button>
          ))}
        </div>
      </div>
      <div className="ek-field" role="radiogroup" aria-label={s.numbers}>
        <span>{s.numbers}</span>
        <div className="ek-segmented">
          {(['compact', 'scientific'] as const).map((n) => (
            <button key={n} type="button" role="radio" aria-checked={p.numberStyle === n} className={p.numberStyle === n ? 'is-active' : ''} data-testid={`numbers-${n}`} onClick={() => ui.prefs.update({ numberStyle: n })}>
              {n === 'compact' ? s.numbersCompact : s.numbersScientific}
            </button>
          ))}
        </div>
      </div>
      <Toggle label={s.reducedMotion} value={p.reducedMotion} onChange={(v) => ui.prefs.update({ reducedMotion: v })} testId="pref-motion" />
      <Toggle label={s.sound} value={p.sound} onChange={(v) => ui.prefs.update({ sound: v })} testId="pref-sound" />
      <Toggle label={s.ambient} value={p.ambient} onChange={(v) => ui.prefs.update({ ambient: v })} testId="pref-ambient" />
      <p className="ek-muted">{s.version(version)}</p>
    </Sheet>
  )
}

export function LegalSheet({ open, onClose, imprint }: { open: boolean; onClose: () => void; imprint?: string }) {
  const { t } = useUi()
  return (
    <Sheet open={open} title={t.legal.title} onClose={onClose} testId="legal-sheet">
      <h3 className="ek-h3">{t.legal.privacyTitle}</h3>
      <p>{t.legal.privacy}</p>
      <h3 className="ek-h3">{t.legal.imprintTitle}</h3>
      <p>{imprint ?? t.legal.imprintMissing}</p>
    </Sheet>
  )
}
