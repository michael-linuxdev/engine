import { useContext } from 'react'
import { UiContext, type UiValue } from './uiContext'

export function useUi(): UiValue {
  const v = useContext(UiContext)
  if (!v) throw new Error('useUi outside <UiProvider>')
  return v
}
