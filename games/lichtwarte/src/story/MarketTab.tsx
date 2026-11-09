/** Markt-Tab: Angebote, Talstile, Bonus-Video, Festwoche, Zeitsprung, Verstärker. */
import { MarketPanel } from '@engine/ui'
import { adSeconds, MARKET, OFFER_PRICES, STORE_ENABLED, STYLE_TINT } from '../content/market'
import { testWallet } from '../runtime'

/** Kleine Vorschau eines Talstils: Himmel und Licht. */
export function StyleSwatch({ id }: { id: string }) {
  const [sky, light] = STYLE_TINT[id] ?? STYLE_TINT.duskBlue
  return (
    <svg viewBox="0 0 48 48" role="presentation">
      <rect x="2" y="2" width="44" height="44" rx="10" fill={sky} />
      <circle cx="33" cy="15" r="6" fill={light} />
      <path d="M2 36 L14 26 L22 31 L33 22 L46 32 L46 46 L2 46 Z" fill="#000" opacity="0.35" />
      <rect x="20" y="28" width="5" height="10" fill={light} opacity="0.85" />
    </svg>
  )
}

export function MarketTab() {
  return (
    <MarketPanel
      cfg={MARKET}
      storeEnabled={STORE_ENABLED}
      wallet={testWallet}
      prices={OFFER_PRICES}
      adSeconds={() => adSeconds()}
      styleArt={(id) => <StyleSwatch id={id} />}
    />
  )
}
