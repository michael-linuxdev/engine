/**
 * Sound without files: WebAudio synthesis. Games describe effects as data
 * (`SfxRecipe`: tones and filtered noise bursts) and ambience as layers (a
 * looping noise bed plus sporadic small sounds), mixed by a game function
 * (time of day, weather …). Respects the device prefs `sound`/`ambient`,
 * pauses while the app is hidden and starts only after a user gesture.
 */
import type { EngineEvent } from '@engine/core'
import type { PrefsStore } from './prefs'
import type { EngineRuntime } from './useEngine'

export type SfxStep =
  | { kind: 'tone'; at: number; freq: number; dur: number; vol: number; wave?: OscillatorType; glideTo?: number }
  | { kind: 'noise'; at: number; dur: number; vol: number; filter: BiquadFilterType; freq: number; freqTo?: number; q?: number }

export type SfxRecipe = readonly SfxStep[]

export interface AmbienceLayer {
  id: string
  /** Continuous bed of filtered noise, gently swelling. */
  bed?: { filter: BiquadFilterType; freq: number; q?: number; gain: number; lfoHz?: number; lfoDepth?: number }
  /** Small sounds now and then (birds, crackles, drops …). */
  sporadic?: { everyMs: number; chance: number; recipes: readonly SfxRecipe[] }
}

/** Recipe sanity for tests: finite, audible, short. */
export function recipeProblems(r: SfxRecipe, maxSeconds = 3): string[] {
  const out: string[] = []
  if (!r.length) out.push('empty')
  for (const s of r) {
    const nums = s.kind === 'tone' ? [s.at, s.freq, s.dur, s.vol, s.glideTo ?? 1] : [s.at, s.dur, s.vol, s.freq, s.freqTo ?? 1, s.q ?? 1]
    if (nums.some((n) => !Number.isFinite(n) || n < 0)) out.push('not finite')
    if (s.at + s.dur > maxSeconds) out.push('too long')
    if (s.vol <= 0 || s.vol > 0.2) out.push('volume out of range')
    if (s.kind === 'tone' && (s.freq < 20 || s.freq > 12000)) out.push('frequency out of range')
  }
  return out
}

type AC = AudioContext
let shared: AC | null = null
let noiseBuf: AudioBuffer | null = null

function audioContext(): AC | null {
  if (typeof window === 'undefined') return null
  const C = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!C) return null
  shared ??= new C()
  return shared
}

function noise(ac: AC): AudioBuffer {
  if (noiseBuf && noiseBuf.sampleRate === ac.sampleRate) return noiseBuf
  const len = Math.floor(ac.sampleRate * 1.5)
  const buf = ac.createBuffer(1, len, ac.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  noiseBuf = buf
  return buf
}

function envelope(ac: AC, at: number, dur: number, vol: number): GainNode {
  const g = ac.createGain()
  g.gain.setValueAtTime(0.0001, at)
  g.gain.exponentialRampToValueAtTime(vol, at + Math.min(0.03, dur / 4))
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur)
  return g
}

/** Play a recipe into `out` (exported for ambience and tests). */
export function playRecipe(ac: AC, out: AudioNode, r: SfxRecipe, start = ac.currentTime + 0.01): void {
  for (const s of r) {
    const at = start + s.at
    const g = envelope(ac, at, s.dur, s.vol)
    g.connect(out)
    if (s.kind === 'tone') {
      const o = ac.createOscillator()
      o.type = s.wave ?? 'sine'
      o.frequency.setValueAtTime(s.freq, at)
      if (s.glideTo) o.frequency.exponentialRampToValueAtTime(s.glideTo, at + s.dur * 0.8)
      o.connect(g)
      o.start(at)
      o.stop(at + s.dur + 0.02)
    } else {
      const src = ac.createBufferSource()
      src.buffer = noise(ac)
      const f = ac.createBiquadFilter()
      f.type = s.filter
      f.Q.value = s.q ?? 1
      f.frequency.setValueAtTime(s.freq, at)
      if (s.freqTo) f.frequency.exponentialRampToValueAtTime(s.freqTo, at + s.dur)
      src.connect(f)
      f.connect(g)
      src.start(at)
      src.stop(at + s.dur + 0.05)
    }
  }
}

export interface Sfx {
  play(id: string): void
}

export function createSfx(prefs: PrefsStore, recipes: Readonly<Record<string, SfxRecipe>>, vibrate: Readonly<Record<string, number>> = {}): Sfx {
  return {
    play: (id) => {
      const r = recipes[id]
      if (!r || !prefs.get().sound) return
      const ms = vibrate[id]
      if (ms && typeof navigator !== 'undefined' && !prefs.get().reducedMotion) navigator.vibrate?.(ms)
      const ac = audioContext()
      if (!ac) return
      void ac.resume().catch(() => undefined)
      const out = ac.createGain()
      out.gain.value = 0.9
      out.connect(ac.destination)
      playRecipe(ac, out, r)
    },
  }
}

/** Play effects for engine events; returns the unsubscribe function. */
export function connectSfx(rt: EngineRuntime, sfx: Sfx, map: Readonly<Record<string, string | ((e: EngineEvent) => string | null)>>): () => void {
  return rt.onEvents((events) => {
    const played = new Set<string>()
    for (const e of events) {
      const m = map[e.type]
      const id = typeof m === 'function' ? m(e) : m
      // One sound per kind per batch (a "buy 100" is one click, not 100).
      if (id && !played.has(id)) {
        played.add(id)
        sfx.play(id)
      }
    }
  })
}

export interface Ambience {
  /** Start if prefs allow (call from a user gesture or later). */
  start(): void
  stop(): void
  /** Wire prefs, visibility and the first gesture; returns a stop function. */
  attach(): () => void
}

/**
 * Ambience: one bed per layer and sporadic sounds; `mix()` returns the level
 * of each layer (0–1) and is re-read every `mixEveryMs`.
 */
export function createAmbience(prefs: PrefsStore, layers: readonly AmbienceLayer[], mix: () => Readonly<Record<string, number>>, mixEveryMs = 10_000): Ambience {
  let running: { stop(): void } | null = null
  const allowed = () => prefs.get().ambient && prefs.get().sound
  const start = () => {
    if (running || !allowed()) return
    const ac = audioContext()
    if (!ac) return
    void ac.resume().catch(() => undefined)
    const master = ac.createGain()
    master.gain.value = 0.0001
    master.gain.exponentialRampToValueAtTime(0.6, ac.currentTime + 2)
    master.connect(ac.destination)
    const levels = new Map<string, GainNode>()
    const stops: (() => void)[] = []
    for (const l of layers) {
      const lg = ac.createGain()
      lg.gain.value = 0
      lg.connect(master)
      levels.set(l.id, lg)
      if (l.bed) {
        const src = ac.createBufferSource()
        src.buffer = noise(ac)
        src.loop = true
        const f = ac.createBiquadFilter()
        f.type = l.bed.filter
        f.frequency.value = l.bed.freq
        f.Q.value = l.bed.q ?? 1
        const bg = ac.createGain()
        bg.gain.value = l.bed.gain
        src.connect(f)
        f.connect(bg)
        bg.connect(lg)
        src.start()
        stops.push(() => src.stop())
        if (l.bed.lfoHz) {
          const lfo = ac.createOscillator()
          const lfoGain = ac.createGain()
          lfo.frequency.value = l.bed.lfoHz
          lfoGain.gain.value = l.bed.lfoDepth ?? l.bed.gain / 2
          lfo.connect(lfoGain)
          lfoGain.connect(bg.gain)
          lfo.start()
          stops.push(() => lfo.stop())
        }
      }
      if (l.sporadic) {
        const sp = l.sporadic
        const id = window.setInterval(() => {
          if ((levels.get(l.id)?.gain.value ?? 0) <= 0.01 || Math.random() >= sp.chance) return
          playRecipe(ac, lg, sp.recipes[Math.floor(Math.random() * sp.recipes.length)])
        }, sp.everyMs)
        stops.push(() => window.clearInterval(id))
      }
    }
    const applyMix = () => {
      const m = mix()
      for (const [id, g] of levels) g.gain.setTargetAtTime(Math.max(0, Math.min(1, m[id] ?? 0)), ac.currentTime, 1.5)
    }
    applyMix()
    const mixTimer = window.setInterval(applyMix, mixEveryMs)
    running = {
      stop: () => {
        window.clearInterval(mixTimer)
        master.gain.setTargetAtTime(0.0001, ac.currentTime, 0.2)
        window.setTimeout(() => {
          for (const s of stops) {
            try {
              s()
            } catch {
              /* already stopped */
            }
          }
          master.disconnect()
        }, 800)
      },
    }
  }
  const stop = () => {
    running?.stop()
    running = null
  }
  return {
    start,
    stop,
    attach: () => {
      const sync = () => (allowed() ? start() : stop())
      const offPrefs = prefs.subscribe(sync)
      const onGesture = () => sync()
      const onVis = () => {
        const ac = shared
        if (!ac) return
        if (document.hidden) void ac.suspend().catch(() => undefined)
        else void ac.resume().catch(() => undefined)
      }
      window.addEventListener('pointerdown', onGesture, { once: true })
      document.addEventListener('visibilitychange', onVis)
      return () => {
        offPrefs()
        window.removeEventListener('pointerdown', onGesture)
        document.removeEventListener('visibilitychange', onVis)
        stop()
      }
    },
  }
}
