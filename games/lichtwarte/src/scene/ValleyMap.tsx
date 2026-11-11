/**
 * Die Talkarte: bildschirmfüllende SVG-Szene (Himmel, Berge, Weg, Bauwerke, Lichter,
 * Leben) und darüber HTML-Knöpfe je Platz (Tastatur, Screenreader, ≥ 44 px).
 * Gesperrte Plätze sind Wildnis. Die Bühne hängt am unteren Rand: Hohe Bildschirme
 * zeigen mehr Himmel, niedrige schneiden oben Himmel ab — nie ein Bauwerk.
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { tierFor } from '@engine/art'
import { bestBuy, DECOR_ID, gateInput, gateProgress, isUnlocked, MARKET_ID, MODULE, nextMilestone, ownedOf, prestigeState, quote, VISITORS_ID, type DecorState, type HelperState, type MarketState, type VisitorsState } from '@engine/core'
import { useEngine } from '@engine/react'
import { useUi } from '@engine/ui'
import { Backdrop, Foreground, Lights, Shade, Snow } from '../art/Backdrop'
import { BuildingArt } from '../art/Building'
import { DecorArt } from '../art/decor'
import { AlwineOnBench, ApprenticeOnTrail, Birds, Butterflies, Fireflies, GuestArt, Motes } from '../art/life'
import { SKY3 } from '../art/palette'
import { WeatherLayer } from '../art/weather'
import { TIER_LEVELS } from '../art/registry'
import { GUESTS } from '../content/world'
import { CURRENCY } from '../ids'
import { game } from '../game'
import { t } from '../runtime'
import { currentMood } from './mood'
import { currentWeather } from './weather'
import { FennoBubble } from './FennoBubble'
import { IconLantern } from '../art/icons'
import { beaconLevel, BUILD_SCALE, DECOR_SLOTS, guestSpot, LETTER_SPOT, MAP_H, MAP_W, SLOTS, slotView } from './slots'

/** Ab so vielen fehlenden Stufen zeigt ein Platz „Noch N bis ★“. */
const NEAR_STAR = 5
/** Alle so viele ms geht der Lehrling zum nächsten Halt. */
const WALK_EVERY_MS = 14_000
/** Dauer (ms) des Funkenkranzes, wenn ein Bauwerk wächst. */
const BURST_MS = 1500

const BURST_DOTS = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2
  const r = 30 + (i % 3) * 12
  return { '--dx': `${Math.round(Math.cos(a) * r)}px`, '--dy': `${Math.round(Math.sin(a) * r - 14)}px`, animationDelay: `${(i % 4) * 0.05}s` } as CSSProperties
})

export interface MapExtras {
  /** „Heute“-Knopf unten links: bündelt das Tägliche; `dot` = dort wartet etwas. */
  today?: { dot: boolean; onOpen: () => void; /** Wartender Ertrag: Der Knopf sammelt ihn ein. */ collect?: number }
  /** Ein Brief wartet: Umschlag am Fuß der Warte. */
  letter?: { onOpen: () => void }
  /** Talstil nur zur Ansicht (aus dem Markt): Die Karte zeigt ihn, bis die Vorschau endet. */
  preview?: { style: string; onEnd: () => void }
}

export function ValleyMap({ onOpen, children, today, letter, preview }: { onOpen: (id: string) => void; children?: ReactNode } & MapExtras) {
  const ui = useUi()
  const { world, state } = useEngine(ui.rt)
  const [mood, setMood] = useState(currentMood)
  const [weather, setWeather] = useState(currentWeather)
  const [minute, setMinute] = useState(() => new Date().getMinutes())
  const [step, setStep] = useState(() => new Date().getMinutes())
  useEffect(() => {
    const id = setInterval(() => {
      setMood(currentMood())
      setWeather(currentWeather())
      setMinute(new Date().getMinutes())
    }, 60_000)
    const walk = setInterval(() => setStep((x) => x + 1), WALK_EVERY_MS)
    return () => {
      clearInterval(id)
      clearInterval(walk)
    }
  }, [])
  const levels = SLOTS.map((s) => ownedOf(world, s.id))
  const tiers = levels.map((l) => tierFor(l, TIER_LEVELS))
  const lit = levels.map((l) => l > 0)
  const beacon = beaconLevel(lit.filter(Boolean).length, prestigeState(world).layers[0]?.count ?? 0)
  const visitors = world.get<VisitorsState>(VISITORS_ID)
  const guest = visitors?.current && visitors.until > state.core.lastSeen ? visitors.current : null
  const helper = (world.get<HelperState>(MODULE.helper)?.rank ?? 0) >= 1
  // Nach dem ersten Zeitalter sitzt Alwine auf der Bank vor der Kräuterkate
  const alwine = (prestigeState(world).layers[2]?.count ?? 0) >= 1
  const money = state.core.primary
  const spot = guest && visitors ? guestSpot(visitors.until) : null
  // Nur ein Platz trägt den Pfeil: der beste Kauf. Nur der nächste gesperrte Platz zeigt, wie weit es noch ist.
  const best = bestBuy(world)
  const nextLocked = game.producers.find((p) => !isUnlocked(world, p))
  const lockedRatio = nextLocked ? gateProgress(nextLocked.unlock, gateInput(world)) : 0
  // Funkenkranz, wenn ein Bauwerk eine Wachstumsstufe erreicht (nicht beim Laden der Karte)
  const tierKey = tiers.join(',')
  const prevTiers = useRef(tiers)
  const [bursts, setBursts] = useState<{ id: string; key: number; big: boolean }[]>([])
  useEffect(() => {
    const grown = SLOTS.flatMap((sl, i) => (tiers[i] > (prevTiers.current[i] ?? 0) ? [{ id: sl.id, key: Date.now() + i, big: tiers[i] >= TIER_LEVELS.length }] : []))
    prevTiers.current = tiers
    if (!grown.length) return
    setBursts(grown)
    const id = setTimeout(() => setBursts([]), BURST_MS)
    return () => clearTimeout(id)
    // nur auf geänderte Stufen reagieren
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [tierKey])
  // Dank nach dem Begrüßen: kurz als Sprechblase am Platz des Gasts
  const [thanks, setThanks] = useState<{ key: number; text: string; y: number } | null>(null)
  useEffect(() => {
    if (!thanks) return
    const id = setTimeout(() => setThanks(null), 2800)
    return () => clearTimeout(id)
  }, [thanks])
  const greet = (id: string) => {
    const at = spot?.y ?? MAP_H
    // Was der Gast dalässt, steht in der Blase: beim ersten Mal das Geschenk, sonst ein Schwung Glimmer
    const first = !(visitors?.seen[id] ?? 0)
    const gift = first ? GUESTS.firstGift.map((g) => `+${ui.fmt(g.amount)} ${ui.labels.currency(g.currency)}`).join(', ') : `+${ui.fmt(world.rate() * GUESTS.againSeconds)} ${ui.labels.currency(CURRENCY.glimmer)}`
    if (ui.rt.dispatch(VISITORS_ID, 'greet')) setThanks({ key: Date.now(), y: at, text: t.world.guestThanks(ui.labels.content(`guest.${id}`).name, gift) })
  }
  return (
    <section className="lw-map" data-fx="map" style={{ background: SKY3[mood.daypart][0] }} aria-label={t.play.map} data-mood={`${mood.daypart}-${mood.season}`} data-weather={weather} data-style={preview?.style ?? world.get<MarketState>(MARKET_ID)?.equipped ?? 'duskBlue'}>
      <div className="lw-stage" style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}>
        <svg className="lw-map__svg" viewBox={`0 0 ${MAP_W} ${MAP_H}`} preserveAspectRatio="xMidYMax meet" role="img" aria-label={t.play.map} data-testid="valley-svg">
          <Backdrop m={mood} lit={lit} beacon={beacon} />
          <Birds m={mood} />
          {(world.get<DecorState>(DECOR_ID)?.placed ?? []).map((id, i) =>
            id && DECOR_SLOTS[i] ? (
              <g key={`decor-${i}`} transform={`translate(${(DECOR_SLOTS[i].x / 100) * MAP_W} ${(DECOR_SLOTS[i].y / 100) * MAP_H}) scale(1.15)`} data-decor={id}>
                <DecorArt id={id} m={mood} />
              </g>
            ) : null,
          )}
          {[...SLOTS.keys()].reverse().map((i) => {
            const s = SLOTS[i]
            const p = game.producers.find((x) => x.id === s.id)!
            return (
              <g key={s.id} transform={`translate(${(s.x / 100) * MAP_W} ${(s.y / 100) * MAP_H}) scale(${s.scale * BUILD_SCALE})`} opacity={tiers[i] === 0 && !isUnlocked(world, p) ? 0.8 : 1}>
                <g key={tiers[i]} className={tiers[i] > 0 ? 'lw-rise' : undefined}>
                  <BuildingArt id={s.id} tier={tiers[i]} m={mood} variant={i} />
                </g>
              </g>
            )
          })}
          {alwine ? (
            <g transform={`translate(${(SLOTS[0].x / 100) * MAP_W + 32} ${(SLOTS[0].y / 100) * MAP_H + 44}) scale(1.3)`}>
              <AlwineOnBench m={mood} />
            </g>
          ) : null}
          {helper ? <ApprenticeOnTrail m={mood} step={step} /> : null}
          {guest && spot ? (
            <g transform={`translate(${spot.x} ${spot.y}) scale(1.5)`}>
              <GuestArt id={guest} />
            </g>
          ) : null}
          <Butterflies m={mood} />
          <Snow m={mood} />
          <WeatherLayer w={weather} />
          <Foreground m={mood} />
          <Shade m={mood} />
          <Lights m={mood} lit={lit} built={tiers} beacon={beacon} />
          <Motes built={tiers} />
          <Fireflies m={mood} />
        </svg>
        {SLOTS.map((s, i) => {
          const p = game.producers.find((x) => x.id === s.id)!
          const level = levels[i]
          const open = isUnlocked(world, p)
          const name = ui.labels.producer(s.id).name
          const can = open && quote(world, s.id, 1).cost <= money
          const isBest = can && best?.id === s.id
          const m = level > 0 ? nextMilestone(level, game.balance) : null
          const toStar = m && m.at - level <= NEAR_STAR ? m.at - level : 0
          const isNext = !open && level === 0 && nextLocked?.id === s.id
          const burst = bursts.find((x) => x.id === s.id)
          return (
            <button
              key={s.id}
              type="button"
              className={`lw-slot${open ? '' : ' is-wild'}${level > 0 ? ' is-built' : ''}${can ? ' can-buy' : ''}${isBest ? ' is-best' : ''}`}
              style={{ left: `${slotView(s).left}%`, top: `${slotView(s).top}%` }}
              data-testid={`slot-${s.id}`}
              data-best={isBest ? 'true' : undefined}
              onClick={() => onOpen(s.id)}
            >
              {burst ? (
                <span key={burst.key} className={`lw-burst${burst.big ? ' lw-burst--big' : ''}`} aria-hidden="true" data-testid="slot-burst">
                  {BURST_DOTS.map((st, k) => (
                    <i key={k} style={st} />
                  ))}
                </span>
              ) : null}
              {open || level > 0 ? (
                <span className="lw-slot__plaque">
                  {isBest ? <span className="lw-slot__up" aria-hidden="true" /> : null}
                  <span className="lw-slot__name">{name}</span>
                  {level > 0 ? (
                    <span className="lw-slot__level">
                      <span className="ek-visually-hidden">{t.play.slotLevel(String(level))}</span>
                      <span aria-hidden="true">{level}</span>
                    </span>
                  ) : (
                    <span className="ek-visually-hidden">{t.play.clear}</span>
                  )}
                  {isBest ? <span className="ek-visually-hidden">{t.play.best}</span> : null}
                  {toStar > 0 ? (
                    <span className="lw-slot__star" data-testid={`slot-star-${s.id}`}>
                      {t.play.toStar(String(toStar))}
                    </span>
                  ) : null}
                </span>
              ) : isNext ? (
                <span className="lw-slot__plaque lw-slot__plaque--next" data-testid="slot-next">
                  <span className="lw-slot__name">{name}</span>
                  <span className="lw-slot__bar" aria-hidden="true">
                    <i style={{ width: `${Math.round(lockedRatio * 100)}%` }} />
                  </span>
                  <span className="ek-visually-hidden">{t.play.nextUp(String(Math.round(lockedRatio * 100)))}</span>
                </span>
              ) : (
                <span className="lw-slot__plaque lw-slot__plaque--lock">
                  <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden="true">
                    <path d="M3 5.5 h6 v4.5 h-6 z M4.2 5.5 V4 a1.8 1.8 0 0 1 3.6 0 v1.5" />
                  </svg>
                  <span className="ek-visually-hidden">
                    {t.play.wild} · {t.common.locked}
                  </span>
                </span>
              )}
            </button>
          )
        })}
        {guest && spot ? (
          <button
            type="button"
            className="lw-guest-btn"
            style={{ left: `${(spot.x / MAP_W) * 100}%`, top: `${(spot.y / MAP_H) * 100}%` }}
            data-testid="guest-greet"
            onClick={() => greet(guest)}
          >
            <span className="lw-guest-sparkle" aria-hidden="true" />
            <span className="ek-visually-hidden">
              {t.world.visitorHere(ui.labels.content(`guest.${guest}`).name)} {t.world.greet}
            </span>
          </button>
        ) : null}
        {thanks ? (
          <p key={thanks.key} className="lw-bubble lw-bubble--guest" role="status" data-testid="guest-thanks" style={{ top: `${(thanks.y / MAP_H) * 100}%` }}>
            {thanks.text}
          </p>
        ) : null}
        {helper ? <FennoBubble m={mood} w={weather} minute={minute} step={step} /> : null}
        {letter ? (
          <button type="button" className="lw-letter" style={{ left: `${(LETTER_SPOT.x / MAP_W) * 100}%`, top: `${(LETTER_SPOT.y / MAP_H) * 100}%` }} data-testid="map-letter" onClick={letter.onOpen}>
            <svg viewBox="0 0 24 18" width="26" height="20" aria-hidden="true">
              <rect x="1" y="1" width="22" height="16" rx="2.5" fill="currentColor" stroke="var(--night)" strokeWidth="1.5" />
              <path d="M2 3 l10 7 l10 -7" fill="none" stroke="var(--night)" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <span className="ek-visually-hidden">{t.play.letter}</span>
          </button>
        ) : null}
        {preview ? (
          <button type="button" className="lw-preview" data-testid="style-preview" onClick={preview.onEnd}>
            {t.trade.previewing(ui.labels.content(`cosmetic.${preview.style}`).name)}
          </button>
        ) : null}
        {today ? (
          <button type="button" className={`lw-today${today.collect ? ' lw-today--collect' : ''}`} data-testid={today.collect ? 'map-collect' : 'map-today'} onClick={today.onOpen}>
            <IconLantern />
            <span>{today.collect ? t.play.collect(ui.fmt(today.collect)) : t.play.today}</span>
            {today.dot ? <span className="ek-badge" aria-label={ui.t.common.ready} /> : null}
          </button>
        ) : null}
        {children}
      </div>
    </section>
  )
}
