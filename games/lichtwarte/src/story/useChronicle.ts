import { useEngine, useStore } from '@engine/react'
import { useUi } from '@engine/ui'
import { CHRONICLE } from '../content/chronicle'
import { chronicleRead } from '../runtime'

export function useChronicle() {
  const ui = useUi()
  const { world } = useEngine(ui.rt)
  const read = useStore(chronicleRead)
  const open = CHRONICLE.filter((e) => e.open(world))
  return { open, unread: open.filter((e) => !read.includes(e.id)) }
}
