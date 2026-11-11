/**
 * Was der Simulator für dieses Spiel zusätzlich spielt (`PLAY=1 npm run balance …`): Wachrunde, Aufträge,
 * Wochenplan, Tagesgeschenk, Fernfahrten, die Feuerstraße und die Himmelskarte. Er meldet dabei, was sonst niemand misst:
 * jede neue Chronik-Seite, jede Stufe der Feuerstraße, die Festmarken je Fest und den Stand der Lichtkiesel.
 * Nur zum Messen; ändert die Taktung (mehr Belohnungen), deshalb nicht für die Zielkorridore.
 */
import { CHART_ID, chartStatus, FESTS_ID, LINKS_ID, linkStatus, type ChartState, QUESTS_ID, voyageBack, voyageOpen, VOYAGES_ID, WALLET_ID, type EngineState, type FestsState, type LinksState, type QuestsState, type VoyagesState, type WalletState, type WorldView } from '@engine/core'
import { CHRONICLE } from './content/chronicle'
import { FIRE_ROAD } from './content/fireRoad'
import { SKY_CHART } from './content/skyChart'
import { VOYAGES } from './content/world'
import { CURRENCY } from './ids'

interface Api {
  act: (module: string, type: string, payload?: unknown) => boolean
  state: () => EngineState
  world: () => WorldView
  record: (id: string, detail?: string) => void
  minutes: () => number
}

const DAY = 1440

export function simPlay(): (api: Api) => void {
  const pages = new Set<string>()
  let fest = ''
  let festMax = 0
  let month = 0
  return (api) => {
    api.act('daily', 'claim')
    api.act('weeklyPlan', 'claim')
    api.act('market', 'claimGift')
    for (const q of (api.state().modules[QUESTS_ID] as QuestsState | undefined)?.active ?? []) if (!q.claimed && q.progress >= q.goal) api.act(QUESTS_ID, 'claim', { id: q.id })

    // Fernfahrten: abholen, dann die längste offene Fahrt losschicken
    const v = api.state().modules[VOYAGES_ID] as VoyagesState | undefined
    if (v) {
      if (v.active && voyageBack(v, api.state().core.lastSeen) && api.act(VOYAGES_ID, 'collect')) api.record('voyage', `#${v.done + 1}`)
      const now = api.state().modules[VOYAGES_ID] as VoyagesState
      if (!now.active) {
        const best = [...VOYAGES.list].filter((x) => voyageOpen(now, x)).sort((a, b) => b.durationMs - a.durationMs)[0]
        if (best) api.act(VOYAGES_ID, 'send', { id: best.id })
      }
    }

    // Feuerstraße: jede Stufe entzünden, die geht (in Reihenfolge der Kette)
    for (const l of FIRE_ROAD.list) {
      const st = linkStatus(FIRE_ROAD, api.state().modules[LINKS_ID] as LinksState | undefined, api.world(), l)
      if (st.ready && api.act(LINKS_ID, 'light', { id: l.id })) api.record('road', `${l.id} Stufe ${st.level + 1} für ${st.cost}`)
    }

    // Himmelskarte: jeden Stern eintragen, der geht
    for (const g of SKY_CHART.groups) {
      const st = chartStatus(SKY_CHART, api.state().modules[CHART_ID] as ChartState | undefined, api.world(), g)
      if (st.ready && api.act(CHART_ID, 'mark', { group: g.id })) api.record('sky', `${g.id} ${st.marked + 1}/${st.cells} für ${st.cost}`)
    }

    // Chronik: neue Seiten
    const w = api.world()
    for (const e of CHRONICLE) {
      if (!pages.has(e.id) && e.open(w)) {
        pages.add(e.id)
        api.record(`page:${e.id}`)
      }
    }

    // Festmarken: höchster Stand je Fest (der Simulator kauft nichts)
    const f = api.state().modules[FESTS_ID] as FestsState | undefined
    if (f) {
      if (f.key !== fest) {
        if (fest) api.record(`fest:${fest}`, `${festMax} Marken`)
        fest = f.key
        festMax = 0
      }
      festMax = Math.max(festMax, f.tokens)
    }

    // Lichtkiesel: Stand und Summe alle 30 Tage
    const m = Math.floor(api.minutes() / (30 * DAY))
    if (m > month) {
      month = m
      const wallet = api.state().modules[WALLET_ID] as WalletState
      api.record(`pebbles:Tag${m * 30}`, `Stand ${Math.round(wallet.balances[CURRENCY.glowPebbles] ?? 0)}, verdient ${Math.round(wallet.earned[CURRENCY.glowPebbles] ?? 0)}; Nachttau Stand ${Math.round(wallet.balances[CURRENCY.nightDew] ?? 0)}, verdient ${Math.round(wallet.earned[CURRENCY.nightDew] ?? 0)}`)
    }
  }
}
