/**
 * Die Talkarte: bildschirmfüllende SVG-Szene (Himmel, Berge, Weg, Bauwerke, Lichter,
 * Leben) und darüber HTML-Knöpfe je Platz (Tastatur, Screenreader, ≥ 44 px).
 * Gesperrte Plätze sind Wildnis. Die Bühne hängt am unteren Rand: Hohe Bildschirme
 * zeigen mehr Himmel, niedrige schneiden oben Himmel ab — nie ein Bauwerk.
 */
import { useEffect, useState, type ReactNode } from 'react'
import { tierFor } from '@engine/art'
import { DECOR_ID, isUnlocked, MARKET_ID, MODULE, ownedOf, prestigeState, quote, VISITORS_ID, type DecorState, type HelperState, type MarketState, type VisitorsState } from '@engine/core'
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
import { beaconLevel, BUILD_SCALE, DECOR_SLOTS, GUEST_SPOT, MAP_H, MAP_W, SLOTS, slotView } from './slots'

export function ValleyMap({ onOpen, children }: { onOpen: (id: string) => void; children?: ReactNode }) {
  const ui = useUi()
  const { world, state } = useEngine(ui.rt)
  const [mood, setMood] = useState(currentMood)
  const [weather, setWeather] = useState(currentWeather)
  const [minute, setMinute] = useState(() => new Date().getMinutes())
  useEffect(() => {
    const id = setInterval(() => {
      setMood(currentMood())
      setWeather(currentWeather())
      setMinute(new Date().getMinutes())
    }, 60_000)
    return () => clearInterval(id)
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
  // Dank nach dem Begrüßen: kurz als Sprechblase am Platz des Gasts
  const [thanks, setThanks] = useState<{ key: number; text: string } | null>(null)
  useEffect(() => {
    if (!thanks) return
    const id = setTimeout(() => setThanks(null), 2800)
    return () => clearTimeout(id)
  }, [thanks])
  const greet = (id: string) => {
    // Was der Gast dalässt, steht in der Blase: beim ersten Mal das Geschenk, sonst ein Schwung Glimmer
    const first = !(visitors?.seen[id] ?? 0)
    const gift = first ? GUESTS.firstGift.map((g) => `+${ui.fmt(g.amount)} ${ui.labels.currency(g.currency)}`).join(', ') : `+${ui.fmt(world.rate() * GUESTS.againSeconds)} ${ui.labels.currency(CURRENCY.glimmer)}`
    if (ui.rt.dispatch(VISITORS_ID, 'greet')) setThanks({ key: Date.now(), text: t.world.guestThanks(ui.labels.content(`guest.${id}`).name, gift) })
  }
  return (
    <section className="lw-map" style={{ background: SKY3[mood.daypart][0] }} aria-label={t.play.map} data-mood={`${mood.daypart}-${mood.season}`} data-weather={weather} data-style={world.get<MarketState>(MARKET_ID)?.equipped ?? 'duskBlue'}>
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
          {helper ? <ApprenticeOnTrail m={mood} minute={minute} /> : null}
          {guest ? (
            <g transform={`translate(${GUEST_SPOT.x} ${GUEST_SPOT.y}) scale(1.5)`}>
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
          return (
            <button
              key={s.id}
              type="button"
              className={`lw-slot${open ? '' : ' is-wild'}${level > 0 ? ' is-built' : ''}${can ? ' can-buy' : ''}`}
              style={{ left: `${slotView(s).left}%`, top: `${slotView(s).top}%` }}
              data-testid={`slot-${s.id}`}
              onClick={() => onOpen(s.id)}
            >
              {open || level > 0 ? (
                <span className="lw-slot__plaque">
                  {can ? <span className="lw-slot__up" aria-hidden="true" /> : null}
                  <span className="lw-slot__name">{name}</span>
                  {level > 0 ? (
                    <span className="lw-slot__level">
                      <span className="ek-visually-hidden">{t.play.slotLevel(String(level))}</span>
                      <span aria-hidden="true">{level}</span>
                    </span>
                  ) : (
                    <span className="ek-visually-hidden">{t.play.clear}</span>
                  )}
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
        {guest ? (
          <button
            type="button"
            className="lw-guest-btn"
            style={{ left: `${(GUEST_SPOT.x / MAP_W) * 100}%`, top: `${(GUEST_SPOT.y / MAP_H) * 100}%` }}
            data-testid="guest-greet"
            onClick={() => greet(guest)}
          >
            <span className="ek-visually-hidden">
              {t.world.visitorHere(ui.labels.content(`guest.${guest}`).name)} {t.world.greet}
            </span>
          </button>
        ) : null}
        {thanks ? (
          <p key={thanks.key} className="lw-bubble lw-bubble--guest" role="status" data-testid="guest-thanks" style={{ left: `${(GUEST_SPOT.x / MAP_W) * 100}%`, top: `${(GUEST_SPOT.y / MAP_H) * 100}%` }}>
            {thanks.text}
          </p>
        ) : null}
        {helper ? <FennoBubble m={mood} w={weather} minute={minute} /> : null}
        {children}
      </div>
    </section>
  )
}
