import type { AnyModule } from '../types'
import { branchesModule } from './branches'
import { burstModule } from './burst'
import { helperModule } from './helper'
import { metaShopModule } from './metaShop'
import { offlineModule } from './offline'
import { prestigeModule } from './prestige'
import { producersModule } from './producers'
import { progressionModule } from './progression'
import { surprisesModule } from './surprises'
import { walletModule } from './wallet'

export * from './branches'
export * from './burst'
export * from './helper'
export * from './ids'
export * from './metaShop'
export * from './offline'
export * from './prestige'
export * from './producers'
export * from './progression'
export * from './surprises'
export * from './wallet'

/**
 * The standard module set in its fixed order (ticks and events run in this
 * order). Games append their own modules after these.
 */
export function standardModules(): AnyModule[] {
  return [
    walletModule(),
    producersModule(),
    branchesModule(),
    progressionModule(),
    prestigeModule(),
    metaShopModule(),
    offlineModule(),
    burstModule(),
    helperModule(),
    surprisesModule(),
  ]
}
export * from './achievements'
export * from './calendarFests'
export * from './challenges'
export * from './daily'
export * from './featureUnlocks'
export * from './quests'
export * from './timedEvents'
export * from './wheel'
export * from './choiceEvents'
export * from './collections'
export * from './combine'
export * from './decor'
export * from './layerCards'
export * from './projects'
export * from './seasonAlbum'
export * from './visitors'
export * from './regions'
export * from './market'
export * from './weeklyPlan'
export * from './chart'
export * from './links'
export * from './monument'
export * from './stewards'
export * from './voyages'
