import { useEffect, useRef, useState } from 'react'
import { decodeBackup, encodeBackup, type BackupBundle } from '@engine/core'
import { browserFiles, checkForUpdate, copyText, readKey, usePrefs, useStore, writeKey, type AutoBackupStore, type PlaytestLog, type Prefs } from '@engine/react'
import { useUi } from '../useUi'
import { dateParts } from '../welcome'
import { Button } from './Button'
import { Sheet } from './Sheet'

/** Lifetime income stored in a backup (engine field `core.primaryLifetime`), 0 if it cannot be read. */
function progressOf(bundle: BackupBundle, saveKey: string): number {
  try {
    const raw = JSON.parse(bundle.data[saveKey] ?? '{}') as { core?: { primaryLifetime?: unknown } }
    const v = raw.core?.primaryLifetime
    return typeof v === 'number' && Number.isFinite(v) ? v : 0
  } catch {
    return 0
  }
}

/**
 * Backup code (copy / file) and restore. Restoring never happens on the first tap:
 * the code is checked, a preview shows its date and progress, a second tap replaces
 * the save, and the current one is backed up automatically first.
 * `keys` = every storage key of the game that belongs to the backup.
 */
export function SaveSheet({ open, onClose, prefix, app, keys, fileName, auto, onBackedUp, remind }: {
  open: boolean
  onClose: () => void
  prefix: string
  app: string
  keys: readonly string[]
  fileName: (date: string) => string
  /** Automatic backups on this device (listed for restoring; one more is taken before a restore). */
  auto?: AutoBackupStore
  /** The player copied or saved the code. */
  onBackedUp?: () => void
  /** Show the reminder line. */
  remind?: boolean
}) {
  const ui = useUi()
  const [msg, setMsg] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [preview, setPreview] = useState<BackupBundle | null>(null)
  if (!open) return null
  ui.rt.save()
  const data: Record<string, string> = {}
  for (const k of keys) {
    const v = readKey(k)
    if (v) data[k] = v
  }
  const now = ui.rt.clock.now()
  const code = encodeBackup(prefix, app, data, now)
  const saveKey = ui.rt.def.saveKey
  const date = (at: number) => ui.t.common.date(...dateParts(at))
  const check = (text: string) => {
    const r = decodeBackup(prefix, app, text)
    if (!r.ok) {
      setPreview(null)
      setMsg({ format: ui.t.save.errFormat, checksum: ui.t.save.errChecksum, app: ui.t.save.errApp, newer: ui.t.save.errNewer }[r.reason])
      return
    }
    setMsg(null)
    setPreview(r.bundle)
  }
  const restore = (bundle: BackupBundle) => {
    // The state that is about to be replaced is kept as an automatic backup
    auto?.add({ at: now, code, progress: ui.rt.get().core.primaryLifetime }, true)
    ui.rt.guard.set('foreign') // never write the old state over the restored one
    for (const k of keys) {
      const v = bundle.data[k]
      if (v) writeKey(k, v)
    }
    setPreview(null)
    setMsg(ui.t.save.importOk)
    setTimeout(() => location.reload(), 600)
  }
  const backups = auto?.list() ?? []
  return (
    <Sheet open={open} title={ui.t.save.title} onClose={onClose} testId="save-sheet">
      {remind ? (
        <p className="ek-note" data-testid="save-remind">
          {ui.t.save.remind}
        </p>
      ) : null}
      <p>{ui.t.save.intro}</p>
      <div className="ek-row-actions">
        <Button
          variant="secondary"
          data-testid="save-copy"
          onClick={async () => {
            const ok = await copyText(code)
            if (ok) onBackedUp?.()
            setMsg(ok ? ui.t.save.copied : ui.t.save.copyFailed)
          }}
        >
          {ui.t.save.copy}
        </Button>
        <Button
          variant="secondary"
          data-testid="save-file"
          onClick={async () => {
            const r = await browserFiles.save(fileName(new Date(now).toISOString().slice(0, 10)), code, 'text/plain')
            if (r === 'shared' || r === 'downloaded') {
              onBackedUp?.()
              setMsg(ui.t.save.fileSaved)
            }
          }}
        >
          {ui.t.save.file}
        </Button>
      </div>
      {/* The two buttons are the way; the raw code stays available but does not invite selecting it by hand */}
      <details className="ek-details">
        <summary data-testid="save-show">{ui.t.save.showCode}</summary>
        <label className="ek-field">
          <span>{ui.t.save.code}</span>
          <textarea className="ek-code" readOnly value={code} rows={4} data-testid="save-code" onFocus={(e) => e.currentTarget.select()} />
        </label>
      </details>
      <h3 className="ek-h3">{ui.t.save.importTitle}</h3>
      <label className="ek-field">
        <span>{ui.t.save.importHint}</span>
        <textarea
          className="ek-code"
          rows={3}
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setPreview(null)
          }}
          data-testid="save-import"
        />
      </label>
      <div className="ek-row-actions">
        <Button variant="secondary" data-testid="save-restore" disabled={!input.trim()} onClick={() => check(input)}>
          {ui.t.save.check}
        </Button>
        <label className="ek-btn ek-btn--secondary ek-file">
          {ui.t.save.file2}
          <input
            type="file"
            accept=".txt,text/plain"
            className="ek-visually-hidden"
            data-testid="save-pick"
            onChange={async (e) => {
              const f = e.target.files?.[0]
              if (!f) return
              const text = (await f.text()).trim()
              setInput(text)
              check(text)
            }}
          />
        </label>
      </div>
      {backups.length ? (
        <>
          <h3 className="ek-h3">{ui.t.save.autoTitle}</h3>
          <ul className="ek-list" data-testid="save-auto">
            {backups.map((x) => (
              <li key={x.at} className="ek-row">
                <div className="ek-row__main">{ui.t.save.autoRow(date(x.at), ui.fmt(x.progress))}</div>
                <Button size="small" variant="secondary" onClick={() => check(x.code)}>
                  {ui.t.save.autoUse}
                </Button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {preview ? (
        <div className="ek-note ek-restore" role="alertdialog" aria-label={ui.t.save.importTitle} data-testid="save-preview">
          <strong>{ui.t.save.preview(date(preview.at), ui.fmt(progressOf(preview, saveKey)))}</strong>
          <span>{ui.t.save.previewWarn}</span>
          <div className="ek-row-actions">
            <Button variant="danger" data-testid="save-confirm" onClick={() => restore(preview)}>
              {ui.t.save.confirm}
            </Button>
            <Button variant="ghost" data-testid="save-cancel" onClick={() => setPreview(null)}>
              {ui.t.save.cancel}
            </Button>
          </div>
        </div>
      ) : null}
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
/** Playtest log: on/off and export (only when the game passes a log). */
function PlaytestBlock({ log }: { log: PlaytestLog }) {
  const ui = useUi()
  const on = useStore(log.enabled)
  const [msg, setMsg] = useState('')
  const s = ui.t.settings
  return (
    <>
      <Toggle label={s.playtest} value={on} onChange={(v) => log.setEnabled(v)} testId="pref-playtest" />
      <p className="ek-muted">{s.playtestHint}</p>
      <Button
        variant="secondary"
        data-testid="playtest-export"
        disabled={log.count() === 0}
        onClick={async () => {
          const r = await browserFiles.save(log.fileName(), log.exportText(), 'application/x-ndjson')
          setMsg(r === 'cancelled' ? '' : s.playtestExported)
        }}
      >
        {s.playtestExport(ui.fmt(log.count()))}
      </Button>
      {msg ? <p role="status">{msg}</p> : null}
    </>
  )
}

/** Shortest time (ms) the update check shows as running. */
const UPDATE_MIN_MS = 700

/** Version line with "update now": pulls a new version right away and reloads into it. */
function UpdateBlock({ version }: { version: string }) {
  const ui = useUi()
  const s = ui.t.settings
  const [state, setState] = useState<'idle' | 'checking' | 'reloading' | 'current' | 'offline'>('idle')
  const note = useRef<HTMLParagraphElement>(null)
  // The answer appears below the button, at the very end of the sheet: bring it into view
  useEffect(() => {
    if (state !== 'idle') note.current?.scrollIntoView({ block: 'nearest' })
  }, [state])
  const run = async () => {
    setState('checking')
    // The check often answers within milliseconds; keep "checking" visible long enough to be seen
    const [r] = await Promise.all([checkForUpdate().catch(() => 'offline' as const), new Promise((done) => setTimeout(done, UPDATE_MIN_MS))])
    if (r === 'unsupported') {
      // No service worker (plain browser tab): a reload fetches the current version
      setState('reloading')
      location.reload()
      return
    }
    setState(r)
  }
  const busy = state === 'checking' || state === 'reloading'
  const text = state === 'checking' ? s.updateChecking : state === 'reloading' ? s.updateFound : state === 'offline' ? s.updateOffline : state === 'current' ? s.updateCurrent : ''
  return (
    <>
      <p className="ek-muted">{s.version(version)}</p>
      <Button variant="secondary" data-testid="app-update" disabled={busy} onClick={() => void run()}>
        {busy ? <span className="ek-spinner" aria-hidden="true" /> : null}
        {busy ? s.updateBusy : s.update}
      </Button>
      {text ? (
        <p ref={note} role="status" className={`ek-note ek-update-note ek-update-note--${state}`} data-testid="app-update-note" data-state={state}>
          {text}
        </p>
      ) : null}
    </>
  )
}

export function SettingsSheet({ open, onClose, version, playtest }: { open: boolean; onClose: () => void; version: string; playtest?: PlaytestLog }) {
  const ui = useUi()
  const p: Prefs = usePrefs(ui.prefs)
  const s = ui.t.settings
  return (
    <Sheet open={open} title={s.title} onClose={onClose} testId="settings-sheet">
      {/* Three short groups: display, sound, system. No number format, no font steps. */}
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
      <Toggle label={s.bigText} value={p.fontScale > 1} onChange={(v) => ui.prefs.update({ fontScale: v ? 1.15 : 1 })} testId="pref-bigtext" />
      <Toggle label={s.reducedMotion} value={p.reducedMotion} onChange={(v) => ui.prefs.update({ reducedMotion: v })} testId="pref-motion" />
      <Toggle label={s.vibration} value={p.vibration} onChange={(v) => ui.prefs.update({ vibration: v })} testId="pref-vibration" />
      <h3 className="ek-h3">{s.soundGroup}</h3>
      <Toggle label={s.sound} value={p.sound} onChange={(v) => ui.prefs.update({ sound: v })} testId="pref-sound" />
      <Toggle label={s.ambient} value={p.ambient} onChange={(v) => ui.prefs.update({ ambient: v })} testId="pref-ambient" />
      <h3 className="ek-h3">{s.system}</h3>
      <Toggle label={s.backupReminder} value={p.backupReminder} onChange={(v) => ui.prefs.update({ backupReminder: v })} testId="pref-backup-reminder" />
      {playtest ? <PlaytestBlock log={playtest} /> : null}
      <UpdateBlock version={version} />
    </Sheet>
  )
}

export function LegalSheet({ open, onClose, imprint, privacyUrl }: { open: boolean; onClose: () => void; imprint?: string; privacyUrl?: string }) {
  const { t } = useUi()
  return (
    <Sheet open={open} title={t.legal.title} onClose={onClose} testId="legal-sheet">
      <h3 className="ek-h3">{t.legal.privacyTitle}</h3>
      <p>{t.legal.privacy}</p>
      <ul className="ek-legal-list">
        {t.legal.privacyItems.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      {privacyUrl ? (
        <p>
          <a href={privacyUrl} target="_blank" rel="noopener">
            {t.legal.privacyPage}
          </a>
        </p>
      ) : null}
      <h3 className="ek-h3">{t.legal.imprintTitle}</h3>
      <p>{imprint ?? t.legal.imprintMissing}</p>
    </Sheet>
  )
}
