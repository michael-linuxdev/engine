import { describe, expect, it } from 'vitest'
import { chartCompleted, chartCost, chartModule, chartStatus, createManualClock, createState, dispatch, standardModules, view, type ChartConfig, type ChartState, type EngineState } from '../src'
import { T0, testGame } from './fixture'

let reached = 1
const cfg: ChartConfig = {
  groups: [
    { id: 'first', cells: 2, effect: { target: 'income', value: 1.1 } },
    { id: 'second', cells: 3, effect: { target: 'burst.seconds', value: 1.2 } },
  ],
  cost: { currency: 'gem', base: 10, growth: 2 },
  perCell: 0.01,
  // The second group opens later in the journey
  open: (_w, g) => g === 'first' || reached >= 2,
}
function setup(gems: number) {
  const def = testGame({ modules: [...standardModules(), chartModule(cfg)] })
  const clock = createManualClock(T0)
  let s = createState(def, clock)
  const wallet = s.modules.wallet as { balances: Record<string, number> }
  s = { ...s, modules: { ...s.modules, wallet: { ...wallet, balances: { ...wallet.balances, gem: gems } } } }
  return { def, clock, s }
}
const c = (s: EngineState) => s.modules.chart as ChartState
const gem = (s: EngineState) => (s.modules.wallet as { balances: Record<string, number> }).balances.gem ?? 0
const mark = (x: ReturnType<typeof setup>, s: EngineState, group: string) => dispatch(x.def, s, { module: 'chart', type: 'mark', payload: { group } }, x.clock)

describe('chart', () => {
  it('cells are marked one by one, each dearer than the last; the last one completes the group', () => {
    reached = 1
    const x = setup(100)
    const r1 = mark(x, x.s, 'first')
    expect(c(r1.state).marked.first).toBe(1)
    expect(gem(r1.state)).toBe(90)
    expect(chartCost(cfg, c(r1.state))).toBe(20)
    expect(r1.events.some((e) => e.type === 'chart.completed')).toBe(false)
    const r2 = mark(x, r1.state, 'first')
    expect(c(r2.state).marked.first).toBe(2)
    expect(gem(r2.state)).toBe(70)
    expect(r2.events.some((e) => e.type === 'chart.completed' && e.group === 'first')).toBe(true)
    expect(chartCompleted(cfg, c(r2.state))).toBe(1)
    // A full group takes no more cells
    expect(gem(mark(x, r2.state, 'first').state)).toBe(70)
  })

  it('a group that is not open yet cannot be worked on', () => {
    reached = 1
    const x = setup(100)
    expect(chartStatus(cfg, c(x.s), view(x.def, x.s), cfg.groups[1], x.clock.now()).open).toBe(false)
    expect(c(mark(x, x.s, 'second').state).marked.second).toBeUndefined()
    reached = 2
    expect(c(mark(x, x.s, 'second').state).marked.second).toBe(1)
  })

  it('not enough currency: nothing happens', () => {
    reached = 1
    const x = setup(5)
    const r = mark(x, x.s, 'first')
    expect(c(r.state).marked.first).toBeUndefined()
    expect(gem(r.state)).toBe(5)
  })

  it('every cell adds income; a completed group adds its own effect', () => {
    const m = chartModule(cfg)
    expect(m.effects?.({ marked: { first: 1 }, readyAt: 0 }, {} as never)).toEqual([{ id: 'chart:cells', target: 'income', op: 'mul', value: 1.01, labelKey: 'effect.chart' }])
    const full = m.effects?.({ marked: { first: 2, second: 3 }, readyAt: 0 }, {} as never) ?? []
    expect(full.map((e) => e.id)).toEqual(['chart:cells', 'chart:first', 'chart:second'])
    expect(full[2]).toMatchObject({ target: 'burst.seconds', value: 1.2 })
  })

  it('with a wait, the next cell has to wait whatever the group', () => {
    reached = 2
    const slow: ChartConfig = { ...cfg, cooldownMs: 3 * 86_400_000 }
    const def = testGame({ modules: [...standardModules(), chartModule(slow)] })
    const clock = createManualClock(T0)
    let s = createState(def, clock)
    const wallet = s.modules.wallet as { balances: Record<string, number> }
    s = { ...s, modules: { ...s.modules, wallet: { ...wallet, balances: { ...wallet.balances, gem: 1000 } } } }
    const go = (state: EngineState, group: string) => dispatch(def, state, { module: 'chart', type: 'mark', payload: { group } }, clock).state
    s = go(s, 'first')
    expect(c(s).marked.first).toBe(1)
    expect(c(go(s, 'first')).marked.first).toBe(1)
    expect(c(go(s, 'second')).marked.second).toBeUndefined()
    expect(chartStatus(slow, c(s), view(def, s), slow.groups[0], clock.now()).waitMs).toBe(3 * 86_400_000)
    clock.advance(3 * 86_400_000)
    expect(c(go(s, 'second')).marked.second).toBe(1)
  })

  it('parse keeps known groups within their size and drops the rest', () => {
    const m = chartModule(cfg)
    expect(m.parse({ marked: { first: 9, second: -1, other: 2 } }, {} as never, {} as never)).toEqual({ marked: { first: 2 }, readyAt: 0 })
    expect(m.parse('x', {} as never, {} as never)).toEqual({ marked: {}, readyAt: 0 })
  })
})
