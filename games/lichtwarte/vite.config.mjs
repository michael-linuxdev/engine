import { defineConfig } from 'vite'
import { gameConfig } from '../../tools/vite/game-config.mjs'
import { BRAND } from './src/brand.ts'
import { IMPRINT, PRIVACY_PAGE } from './src/legal.ts'
import { privacyHtml } from '../../packages/ui-kit/src/legalPage.ts'
import { engineDe } from '../../packages/ui-kit/src/i18n/de.ts'
import { engineEn } from '../../packages/ui-kit/src/i18n/en.ts'

export default defineConfig(gameConfig({ name: BRAND.de, shortName: BRAND.de, description: `Gemütliches Fantasy-Idle-Spiel · Cosy fantasy idle game (${BRAND.en})`, themeColor: '#172040', background: '#efe6d6', port: 5173,
  // Datenschutz-Seite für die Store-Angabe, aus denselben Texten wie im Spiel
  extraFiles: () => ({ [PRIVACY_PAGE]: privacyHtml({ title: { de: BRAND.de, en: BRAND.en }, de: engineDe.legal, en: engineEn.legal, imprint: IMPRINT }) }),
  icons: [
  { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
  { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
  { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
  { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
] }))
