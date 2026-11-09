/**
 * Shared Vite config for every game: React, PWA (manifest + service worker),
 * relative base (works at / and under /<path>/ on GitHub Pages), build version.
 */
import { execSync } from 'node:child_process'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

function buildVersion() {
  const day = new Date().toISOString().slice(0, 10)
  try {
    return `${day} · ${execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()}`
  } catch {
    return day
  }
}

/** @param {{ name: string, shortName?: string, description: string, themeColor: string, background: string, icons?: object[], port?: number }} o */
export function gameConfig(o) {
  return {
    base: './',
    define: { __APP_VERSION__: JSON.stringify(buildVersion()) },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon.svg'],
        manifest: {
          name: o.name,
          short_name: o.shortName ?? o.name,
          description: o.description,
          theme_color: o.themeColor,
          background_color: o.background,
          lang: 'de',
          display: 'standalone',
          orientation: 'portrait',
          start_url: './',
          scope: './',
          icons: o.icons ?? [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
        },
        workbox: { globPatterns: ['**/*.{js,css,html,svg,png,woff2}'] },
      }),
    ],
    server: { host: true, port: o.port ?? 5173 },
    preview: { port: o.port ?? 4173 },
  }
}
