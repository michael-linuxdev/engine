/**
 * Player level / XP. XP from upgrades; level gives a small permanent rate
 * bonus and one-time rewards (game data `levelRewards`).
 */
import { act } from '../result'
import { isRecord, parseInt0, parseNum } from '../state'
import type { Amount, BalanceConfig, EngineEvent, EngineModule, WorldView } from '../types'
import { MODULE } from './ids'

export interface ProgressionState {
  xp: number
  /** Levels whose reward was granted. */
  rewarded: number[]
}

export function xpForLevel(level: number, b: BalanceConfig): number {
  const p = b.progression
  const L = Math.max(1, Math.min(p.maxLevel, level))
  return Math.floor(p.xpBase + p.xpLinear * L + p.xpQuad * L * L)
}

export function levelOf(xp: number, b: BalanceConfig): { level: number; into: number; need: number; ratio: number } {
  let rest = Math.max(0, Math.floor(xp))
  let level = 1
  const max = b.progression.maxLevel
  while (level < max) {
    const need = xpForLevel(level, b)
    if (rest < need) return { level, into: rest, need, ratio: need > 0 ? rest / need : 1 }
    rest -= need
    level += 1
  }
  const need = xpForLevel(max, b)
  return { level: max, into: need, need, ratio: 1 }
}

export function levelMult(level: number, b: BalanceConfig): number {
  return 1 + Math.max(0, Math.min(b.progression.multCapLevels, level - 1)) * b.progression.multPerLevel
}

/** XP an event is worth (0 = none). Sources: upgrades, prestige, offline claims, explicit grants. */
export function xpFor(e: EngineEvent, world: WorldView): number {
  const p = world.def.balance.progression
  switch (e.type) {
    case 'producer.bought':
      return p.xpPerUpgrade * (Number(e.count) || 0)
    case 'prestige.performed': {
      const k = world.def.prestigeLayers.findIndex((l) => l.id === e.layer)
      return p.xpPerPrestige * (k + 1)
    }
    case 'offline.claimed': {
      const a = Number(e.amount) || 0
      return a > 0 ? Math.max(5, Math.min(p.xpOfflineCap, Math.floor(Math.sqrt(a) * p.xpOfflineFactor))) : 0
    }
    case 'xp.add':
      return Number(e.amount) || 0
    default:
      return 0
  }
}

export function progressionModule(): EngineModule<ProgressionState> {
  return {
    id: MODULE.progression,
    version: 1,
    init: () => ({ xp: 0, rewarded: [] }),
    parse: (raw) => {
      const r = isRecord(raw) ? raw : {}
      const rewarded = Array.isArray(r.rewarded) ? [...new Set(r.rewarded.map((x) => parseInt0(x, -1)).filter((x) => x >= 1))].sort((a, b) => a - b) : []
      return { xp: parseNum(r.xp), rewarded }
    },
    resetOn: 'keep',
    effects: (s, view) => {
      const m = levelMult(levelOf(s.xp, view.def.balance).level, view.def.balance)
      return m > 1 ? [{ id: 'level', target: 'rate:*', op: 'mul', value: m, labelKey: 'effect.level' }] : []
    },
    on: (s, e, _ctx, world) => {
      const b = world.def.balance
      const gain = xpFor(e, world) * (e.type === 'xp.add' ? 1 : world.value('xp.mult', 1))
      if (gain <= 0) return s
      const before = levelOf(s.xp, b).level
      const xp = s.xp + gain
      const after = levelOf(xp, b).level
      if (after === before) return { ...s, xp }
      const rewarded = [...s.rewarded]
      const grant: Amount[] = []
      for (const r of world.def.levelRewards) {
        if (r.level > before && r.level <= after && !rewarded.includes(r.level)) {
          rewarded.push(r.level)
          grant.push(...r.grant)
        }
      }
      return act({ xp, rewarded: rewarded.sort((a, c) => a - c) }, { grant: grant.map((g) => ({ ...g, source: 'level' })), events: [{ type: 'level.up', level: after, from: before }] })
    },
    playtestEvents: ['level.up'],
    sample: () => ({ xp: 5000, rewarded: [2, 3] }),
  }
}
