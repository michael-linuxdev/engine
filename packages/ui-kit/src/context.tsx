import type { ReactNode } from 'react'
import { formatNumber, NUMBER_LOCALES } from '@engine/core'
import { usePrefs } from '@engine/react'
import { UiContext, type UiValue } from './uiContext'

export type { UiLabels, UiValue } from './uiContext'

export function UiProvider(props: Omit<UiValue, 'nl' | 'fmt' | 'duration'> & { children: ReactNode }) {
  const prefs = usePrefs(props.prefs)
  const nl = NUMBER_LOCALES[props.locale]
  const t = props.t
  const value: UiValue = {
    ...props,
    nl,
    fmt: (n) => formatNumber(n, nl, { style: prefs.numberStyle }),
    duration: (ms) => {
      const s = Math.max(0, Math.round(ms / 1000))
      if (s < 90) return t.time.seconds(String(s))
      const m = Math.round(s / 60)
      if (m < 120) return t.time.minutes(String(m))
      const h = Math.round(m / 6) / 10
      if (h < 48) return t.time.hours(formatNumber(h, nl, { smallDigits: 1 }))
      return t.time.days(String(Math.round(h / 24)))
    },
  }
  return <UiContext.Provider value={value}>{props.children}</UiContext.Provider>
}

