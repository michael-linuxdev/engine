/** Texte der Vorlage (bewusst neutrale Platzhalter). */
import { engineDe } from '@engine/ui'

export const gameDe = {
  app: { title: 'Vorlage', description: 'Minimales Beispielspiel der Idle-Engine' },
  currencies: { coins: 'Münzen', meta: 'Punkte', gems: 'Steine' },
  producers: {
    p1: { name: 'Erzeuger 1', blurb: 'Der erste, kleinste Erzeuger.' },
    p2: { name: 'Erzeuger 2', blurb: 'Zweite Stufe der Leiter.' },
    p3: { name: 'Erzeuger 3', blurb: 'Dritte Stufe der Leiter.' },
  },
  layers: { reset: { name: 'Neustart', action: 'Neu beginnen', blurb: 'Setzt den Lauf zurück und zahlt Punkte aus.' } },
  metaItems: {
    boost: { name: 'Verstärker', blurb: 'Mehr Ertrag überall.', effect: (r: number) => `+${r * 10} % Ertrag` },
    discount: { name: 'Rabatt', blurb: 'Günstigere Erzeuger.', effect: (r: number) => `−${Math.round((1 - 0.97 ** r) * 100)} % Kosten` },
    head: { name: 'Vorsprung', blurb: 'Startguthaben nach dem Neustart.', effect: (r: number) => `+${r * 50} beim Start` },
  },
  branches: { yield: 'Ertrag', start: 'Start' },
  play: { burst: 'Schub', goalUnlock: (name: string) => `Nächstes Ziel: ${name} freischalten`, goalMilestone: (name: string, at: string) => `${name} auf Stufe ${at}`, goalPrestige: 'Neustart möglich!' },
  effectLabels: { meta: 'Laden' },
}

export const stringsDe = { ...engineDe, ...gameDe }
export type Strings = typeof stringsDe
