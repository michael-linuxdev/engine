/**
 * Headless balance simulator — plays the REAL engine with a virtual clock.
 * Game-agnostic: any GameDefinition works (the Vorlage proves it).
 *
 * Profiles:
 *  - engaged: plays 08–24 continuously, decides every 10 s
 *  - regular: 15 min every 2 h (08–23), offline in between
 *  - casual:  4 min every 3 h (08–23)
 *
 * Policy (deliberately simple, tuned in P6): burst when charged, claim the
 * offline basket, buy the best-payback producer while affordable, buy every
 * affordable meta rank (cheapest first), hire/upgrade the helper, perform a
 * prestige layer once its payout reaches `prestigeAt` × the gate payout
 * (or right away for a probe run).
 */
import {
  applyOffline, bestBuy, bulkCost, canBuyMeta, createManualClock, createState, dispatch, layerStatus, metaCost, payoutAtGate, prestigeState, rankOf, tick,
  view, type EngineState, type GameDefinition, type ProducerDef,
} from '@engine/core'

export type Profile = 'engaged' | 'regular' | 'casual'

export interface SimOptions {
  profile: Profile
  hours: number
  /** Start (UTC used as local time). Default: Monday 2026-11-09 08:00. */
  start?: number
  /** Payout factor at which a (non-probe) prestige is taken. */
  prestigeAt?: number
  /** Decision interval while playing (ms). */
  stepMs?: number
}

export interface SimEvent {
  /** Minutes since start (wall clock). */
  at: number
  /** Active minutes played until then. */
  active: number
  kind: 'unlock' | 'prestige' | 'level' | 'region'
  id: string
  detail?: string
}

export interface SimResult {
  events: SimEvent[]
  activeMinutes: number
  final: EngineState
  maxPrimary: number
}

const SESSIONS: Record<Profile, { every: number; len: number } | null> = {
  engaged: null,
  regular: { every: 120, len: 15 },
  casual: { every: 180, len: 4 },
}

function isPlaying(profile: Profile, minuteOfDay: number, minuteSinceStart: number): boolean {
  if (minuteOfDay < 8 * 60) return false
  const s = SESSIONS[profile]
  if (!s) return true
  if (minuteOfDay >= 23 * 60) return false
  return minuteSinceStart % s.every < s.len
}

/** A region as the simulator sees it; with cost data the buy loop can skip hopeless attempts. */
interface SimRegion {
  id: string
  areas: readonly ({ id: string } & Partial<ProducerDef>)[]
}
interface SimRegionSlice {
  open: boolean
  owned?: Record<string, number>
  balance?: number
  thrift?: number
}

const regionDefs = new WeakMap<GameDefinition, readonly SimRegion[]>()

/** Let the simulator know the region list (the module keeps it private). */
export function registerRegions(def: GameDefinition, regions: readonly SimRegion[]): void {
  regionDefs.set(def, regions)
}

/**
 * Speed only (long runs with many open regions): true when a single level of
 * this area certainly costs more than the region's balance, so the dispatch
 * would be refused anyway. Uses the engine's own cost formula; without cost
 * data or with a cost discount (thrift) it never skips.
 */
function tooExpensive(a: SimRegion['areas'][number], r: SimRegionSlice): boolean {
  if (a.baseCost === undefined || a.costScale === undefined || a.baseRate === undefined || r.thrift !== 0 || r.balance === undefined || !r.owned) return false
  return bulkCost(a as ProducerDef, r.owned[a.id] ?? 0, 1) > r.balance
}

export function simulate(def: GameDefinition, opts: SimOptions): SimResult {
  const start = opts.start ?? Date.UTC(2026, 10, 9, 8, 0, 0)
  const clock = createManualClock(start)
  const step = opts.stepMs ?? 10_000
  const prestigeAt = opts.prestigeAt ?? 1.6
  let s = createState(def, clock)
  const events: SimEvent[] = []
  const seen = new Set<string>()
  let activeMs = 0
  let maxPrimary = 0
  const end = start + opts.hours * 3_600_000
  let wasPlaying = true
  const minutes = () => (clock.now() - start) / 60_000
  const record = (kind: SimEvent['kind'], id: string, detail?: string) => events.push({ at: minutes(), active: activeMs / 60_000, kind, id, detail })
  const levelUps = (events: readonly { type: string; level?: unknown }[]) => {
    for (const e of events) if (e.type === 'level.up') record('level', `rang${Number(e.level)}`)
  }
  const act = (module: string, type: string, payload?: unknown): boolean => {
    const r = dispatch(def, s, { module, type, payload }, clock)
    s = r.state
    levelUps(r.events)
    return r.ok
  }

  while (clock.now() < end) {
    const d = new Date(clock.now())
    const mod = d.getUTCHours() * 60 + d.getUTCMinutes()
    if (!isPlaying(opts.profile, mod, Math.floor(minutes()))) {
      wasPlaying = false
      clock.advance(60_000)
      continue
    }
    if (!wasPlaying) {
      s = applyOffline(def, s, clock).state
      wasPlaying = true
    }
    // --- decisions ---
    act('offline', 'claim')
    act('burst', 'use')
    for (let i = 0; i < 200; i++) {
      const b = bestBuy(view(def, s))
      if (!b?.affordable || !act('producers', 'buy', { id: b.id, count: 1 })) break
    }
    act('helper', 'upgrade')
    // Lande: in jedem offenen Land so viel wie möglich ausbauen (günstigste offene Bereiche)
    const slices = () => (s.modules.regions as { regions?: Record<string, SimRegionSlice> } | undefined)?.regions
    const regions = slices()
    if (regions) {
      for (const [id, r] of Object.entries(regions)) {
        if (!r.open) continue
        const rdef = (regionDefs.get(def) ?? []).find((x) => x.id === id)
        if (!rdef) continue
        for (let i = 0; i < 40; i++) {
          let bought = false
          for (const a of rdef.areas) {
            const now = slices()?.[id]
            if (now && tooExpensive(a, now)) continue
            if (act('regions', 'buy', { region: id, area: a.id, count: 1 })) bought = true
          }
          if (!bought) break
        }
        act('regions', 'care', { region: id, kind: 'grow' })
      }
    }
    for (let i = 0; i < 50; i++) {
      const w = view(def, s)
      const open = def.metaShop.filter((it) => canBuyMeta(w, it)).sort((a, b) => metaCost(a, rankOf(w, a.id)) - metaCost(b, rankOf(w, b.id)))
      if (!open.length || !act('metaShop', 'buy', { id: open[0].id })) break
    }
    for (let k = def.prestigeLayers.length - 1; k >= 0; k--) {
      const l = def.prestigeLayers[k]
      const st = layerStatus(view(def, s), l.id)
      if (st.block !== null) continue
      const p = prestigeState(view(def, s)).layers[k]
      if (st.probe || st.payout >= payoutAtGate(l, p.sinceReset) * prestigeAt) {
        if (act('prestige', 'perform', { layer: l.id })) record('prestige', l.id, `#${p.count + 1} +${st.payout}`)
        break
      }
    }
    for (const p of def.producers) {
      const n = (s.modules.producers as { owned: Record<string, number> }).owned[p.id] ?? 0
      if (n > 0 && !seen.has(p.id)) {
        seen.add(p.id)
        record('unlock', p.id)
      }
    }
    for (const [id, r] of Object.entries((s.modules.regions as { regions?: Record<string, { open: boolean }> } | undefined)?.regions ?? {})) {
      if (r.open && !seen.has(`region:${id}`)) {
        seen.add(`region:${id}`)
        record('region', id)
      }
    }
    // --- time passes ---
    clock.advance(step)
    const t = tick(def, s, step, clock)
    s = t.state
    levelUps(t.events)
    activeMs += step
    maxPrimary = Math.max(maxPrimary, s.core.primary)
  }
  return { events, activeMinutes: activeMs / 60_000, final: s, maxPrimary }
}

export function formatResult(r: SimResult, summary: boolean): string {
  const lines: string[] = []
  const fmt = (m: number) => (m < 120 ? `${m.toFixed(1)} min` : m < 2880 ? `${(m / 60).toFixed(1)} h` : `Tag ${(m / 1440 + 1).toFixed(1)}`)
  const shown = summary ? r.events.filter((e) => e.kind !== 'level').filter((e, i, all) => e.kind === 'unlock' || all.findIndex((x) => x.id === e.id) === i || i === all.length - 1 || (e.kind === 'prestige' && Number(e.detail?.slice(1).split(' ')[0]) <= 15)) : r.events
  for (const e of shown) lines.push(`${fmt(e.at).padStart(10)}  aktiv ${e.active.toFixed(1).padStart(7)} min  ${e.kind.padEnd(8)} ${e.id} ${e.detail ?? ''}`)
  const pr = (r.final.modules.prestige as { layers: { count: number }[] }).layers.map((l) => l.count)
  lines.push(`SUMMARY aktiv=${r.activeMinutes.toFixed(0)} min  lebenszeit=${r.final.core.primaryLifetime.toExponential(2)}  prestige=${pr.join('/')}  erzeuger=${r.events.filter((e) => e.kind === 'unlock').length}  max=${r.maxPrimary.toExponential(2)}`)
  if (r.maxPrimary > 1e200) lines.push('WARNUNG: Wirtschaft über 1e200 (ADR 0002)')
  return lines.join('\n')
}
