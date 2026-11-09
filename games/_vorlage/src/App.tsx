import { BurstButton, GameShell, Hud, ProducerList } from '@engine/ui'
import { DISTRIBUTION, TEST_PHASE } from './distribution'
import { game } from './game'
import { i18n, labels, prefs, rt, t } from './runtime'

declare const __APP_VERSION__: string

export function App() {
  return (
    <GameShell
      rt={rt}
      i18n={i18n}
      prefs={prefs}
      labels={labels}
      title={() => t.app.title}
      distribution={DISTRIBUTION}
      testPhase={TEST_PHASE}
      version={__APP_VERSION__}
      backup={{ prefix: 'VORLAGE1:', keys: [game.saveKey], fileName: (d) => `vorlage-${d}.txt` }}
      hud={
        <Hud
          primaryId="coins"
          extra={<BurstButton label={t.play.burst} />}
          goalText={(g) =>
            g.kind === 'unlock' ? t.play.goalUnlock(labels.producer(g.id).name) : g.kind === 'milestone' ? t.play.goalMilestone(labels.producer(g.id).name, String(g.at)) : g.kind === 'prestige' ? t.play.goalPrestige : null
          }
        />
      }
      play={<ProducerList />}
    />
  )
}
