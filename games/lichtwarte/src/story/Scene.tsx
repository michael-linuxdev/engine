/** Vollbild-Szene für Prolog und Zeremonien: das Tal bei Nacht (oder im Morgenlicht), dazu ein Gestirn. */
import type { Mood } from '@engine/art'
import { Backdrop, Lights, Shade } from '../art/Backdrop'
import { BEACON, ORB, SKY3 } from '../art/palette'
import { MAP_H, MAP_W, SLOTS } from '../scene/slots'

const NONE = SLOTS.map(() => false)
const ALL = SLOTS.map(() => true)

export type SceneKind = 'prologue' | 'moonturn' | 'longNight' | 'ages'

const MOODS: Record<SceneKind, Mood> = {
  prologue: { daypart: 'night', season: 'autumn' },
  moonturn: { daypart: 'night', season: 'summer' },
  longNight: { daypart: 'night', season: 'winter' },
  ages: { daypart: 'dawn', season: 'spring' },
}

export function StoryScene({ kind }: { kind: SceneKind }) {
  const m = MOODS[kind]
  const lit = kind === 'ages' ? ALL : NONE
  const beacon = kind === 'prologue' ? 0 : 3
  const id = `scene-${kind}`
  return (
    <svg className="lw-scene" viewBox={`0 0 ${MAP_W} ${MAP_H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" style={{ background: SKY3[m.daypart][0] }}>
      <Backdrop m={m} id={id} lit={lit} beacon={beacon} orb={kind === 'prologue' || kind === 'ages'} />
      {kind === 'moonturn' || kind === 'longNight' ? (
        <g>
          <defs>
            <clipPath id={`${id}-moon`}>
              <circle cx={180} cy={84} r={40} />
            </clipPath>
          </defs>
          <circle cx={180} cy={84} r={78} fill={ORB.night[1]} opacity={0.16} />
          <circle cx={180} cy={84} r={40} fill={ORB.night[0]} />
          <g fill={BEACON.cold} opacity={0.5}>
            <circle cx={166} cy={72} r={8} />
            <circle cx={196} cy={96} r={6} />
            <circle cx={190} cy={66} r={3.5} />
          </g>
          <g clipPath={`url(#${id}-moon)`}>
            <circle className={kind === 'moonturn' ? 'lw-turn' : undefined} cx={kind === 'moonturn' ? 204 : 180} cy={84} r={kind === 'moonturn' ? 42 : 41} fill={SKY3.night[0]} opacity={0.94} />
          </g>
        </g>
      ) : null}
      <Shade m={m} id={id} />
      <Lights m={m} id={id} lit={lit} built={SLOTS.map(() => 0)} beacon={beacon} />
    </svg>
  )
}
