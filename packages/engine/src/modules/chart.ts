/**
 * Chart: groups of cells that are filled in one by one for a currency (e.g. a
 * sky map of constellations). Every cell adds a little income; a completed
 * group switches on its own lasting effect. A group can be tied to a
 * condition of the game (`open`), so the chart grows with the journey.
 */
import { act } from '../result'
import { isRecord, parseInt0 } from '../state'
import type { EffectSource, EngineEvent, EngineModule, WorldView } from '../types'

export interface ChartGroup {
  id: string
  cells: number
  /** Lasting effect once every cell is marked (multiplier on `target`). */
  effect: { target: string; value: number }
}

export interface ChartConfig {
  /** IDs are append-only. */
  groups: readonly ChartGroup[]
  /** Price of the next cell: base × growth^(cells marked so far, all groups). */
  cost: { currency: string; base: number; growth: number }
  /** Income added per marked cell (0.005 = +0.5 %). */
  perCell: number
  /** Whether a group can be worked on yet. Default: always. */
  open?: (w: WorldView, group: string) => boolean
}

export interface ChartState {
  marked: Record<string, number>
}

export const CHART_ID = 'chart'

export function chartCells(s: ChartState | undefined): number {
  let sum = 0
  for (const n of Object.values(s?.marked ?? {})) sum += n
  return sum
}

export function chartCompleted(cfg: ChartConfig, s: ChartState | undefined): number {
  return cfg.groups.filter((g) => (s?.marked[g.id] ?? 0) >= g.cells).length
}

export function chartCost(cfg: ChartConfig, s: ChartState | undefined): number {
  return Math.round(cfg.cost.base * Math.pow(cfg.cost.growth, chartCells(s)))
}

export interface ChartStatus {
  marked: number
  cells: number
  done: boolean
  open: boolean
  cost: number
  /** The next cell can be marked now. */
  ready: boolean
}

export function chartStatus(cfg: ChartConfig, s: ChartState | undefined, w: WorldView, g: ChartGroup): ChartStatus {
  const marked = Math.min(g.cells, s?.marked[g.id] ?? 0)
  const done = marked >= g.cells
  const open = cfg.open ? cfg.open(w, g.id) : true
  const cost = chartCost(cfg, s)
  return { marked, cells: g.cells, done, open, cost, ready: open && !done && w.balance(cfg.cost.currency) >= cost }
}

/** At least one cell could be marked right now. */
export function chartReady(cfg: ChartConfig, s: ChartState | undefined, w: WorldView): boolean {
  return cfg.groups.some((g) => chartStatus(cfg, s, w, g).ready)
}

export function chartModule(cfg: ChartConfig): EngineModule<ChartState> {
  const byId = new Map(cfg.groups.map((g) => [g.id, g]))
  return {
    id: CHART_ID,
    version: 1,
    init: () => ({ marked: {} }),
    parse: (raw) => {
      const src = isRecord(raw) && isRecord(raw.marked) ? raw.marked : {}
      const marked: Record<string, number> = {}
      for (const g of cfg.groups) {
        const n = parseInt0(src[g.id], 0, g.cells)
        if (n > 0) marked[g.id] = n
      }
      return { marked }
    },
    resetOn: 'keep',
    effects: (s): EffectSource[] => {
      const out: EffectSource[] = []
      const cells = chartCells(s)
      if (cells > 0) out.push({ id: 'chart:cells', target: 'income', op: 'mul', value: 1 + cfg.perCell * cells, labelKey: 'effect.chart' })
      for (const g of cfg.groups) {
        if ((s.marked[g.id] ?? 0) >= g.cells) out.push({ id: `chart:${g.id}`, target: g.effect.target, op: 'mul', value: g.effect.value, labelKey: 'effect.chart' })
      }
      return out
    },
    actions: {
      mark: (s, p, _ctx, world) => {
        const g = byId.get((p as { group?: string } | undefined)?.group ?? '')
        if (!g) return s
        const st = chartStatus(cfg, s, world, g)
        if (!st.ready) return s
        const next: ChartState = { marked: { ...s.marked, [g.id]: st.marked + 1 } }
        const events: EngineEvent[] = [{ type: 'chart.marked', group: g.id, cell: st.marked + 1, total: chartCells(next) }]
        if (st.marked + 1 >= g.cells) events.push({ type: 'chart.completed', group: g.id, completed: chartCompleted(cfg, next) })
        return act(next, { spend: [{ currency: cfg.cost.currency, amount: st.cost }], events })
      },
    },
    playtestEvents: ['chart.marked', 'chart.completed'],
    sample: () => ({ marked: cfg.groups[0] ? { [cfg.groups[0].id]: Math.min(2, cfg.groups[0].cells) } : {} }),
  }
}
