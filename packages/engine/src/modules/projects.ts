/** Great projects: multi-stage builds paid in several currencies; every finished stage adds a permanent bonus and may grant something. */
import { act } from '../result'
import { isRecord, parseNumRecord } from '../state'
import type { Amount, EffectSource, EngineEvent, EngineModule } from '../types'

export interface ProjectStage {
  cost: readonly Amount[]
  reward?: readonly Amount[]
  event?: EngineEvent
}

export interface ProjectDef {
  id: string
  stages: readonly ProjectStage[]
  bonusPerStage: number
}

export interface ProjectsState {
  stage: Record<string, number>
}

export const PROJECTS_ID = 'projects'

export function projectsModule(list: readonly ProjectDef[]): EngineModule<ProjectsState> {
  const byId = new Map(list.map((p) => [p.id, p]))
  return {
    id: PROJECTS_ID,
    version: 1,
    init: () => ({ stage: {} }),
    parse: (raw) => {
      const st = parseNumRecord(isRecord(raw) ? raw.stage : undefined, list.map((p) => p.id), true)
      for (const [id, n] of Object.entries(st)) st[id] = Math.min(n, byId.get(id)!.stages.length)
      return { stage: st }
    },
    resetOn: 'keep',
    effects: (s): EffectSource[] => {
      const bonus = list.reduce((a, p) => a + (s.stage[p.id] ?? 0) * p.bonusPerStage, 0)
      return bonus > 0 ? [{ id: 'projects', target: 'rate:*', op: 'mul', value: 1 + bonus, labelKey: 'effect.projects' }] : []
    },
    actions: {
      build: (s, p) => {
        const def = byId.get((p as { id?: string } | undefined)?.id ?? '')
        if (!def) return s
        const n = s.stage[def.id] ?? 0
        const st = def.stages[n]
        if (!st) return s
        return act(
          { stage: { ...s.stage, [def.id]: n + 1 } },
          { spend: st.cost, grant: (st.reward ?? []).map((r) => ({ ...r, source: 'project' })), events: [{ type: 'project.stage', id: def.id, stage: n + 1 }, ...(st.event ? [st.event] : [])] },
        )
      },
    },
    playtestEvents: ['project.stage'],
    sample: () => ({ stage: Object.fromEntries(list.slice(0, 2).map((p) => [p.id, 1])) }),
  }
}
