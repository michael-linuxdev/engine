/**
 * App-Icons aus dem SVG des Spiels: games/<spiel>/public/icon-square.svg →
 * public/icons/*.png (PWA 192/512, maskable 512, Apple 180, Store 1024/512).
 * Nur abgeleitet aus dem SVG im Repo (keine Fremd-Assets). Aufruf:
 * node tools/store/icons.mjs [spiel …]   (npm run store:icons)
 */
import { mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { launch } from '../e2e/lib.mjs'

/** name → [Kantenlänge, Innenabstand-Anteil (maskable: sichere Zone)] */
export const ICONS = {
  'icon-192.png': [192, 0],
  'icon-512.png': [512, 0],
  'maskable-512.png': [512, 0.1],
  'apple-touch-180.png': [180, 0],
  'store-ios-1024.png': [1024, 0],
  'store-play-512.png': [512, 0],
}

const games = process.argv.slice(2).length ? process.argv.slice(2) : ['lichtwarte']
const browser = await launch()
for (const slug of games) {
  const dir = join('games', slug, 'public')
  const svg = readFileSync(join(dir, 'icon-square.svg'), 'utf8')
  const bg = /stop-color="(#[0-9a-f]{6})"/.exec(svg)?.[1] ?? '#000000'
  mkdirSync(join(dir, 'icons'), { recursive: true })
  for (const [name, [size, pad]] of Object.entries(ICONS)) {
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 })
    const inner = Math.round(size * (1 - 2 * pad))
    const url = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
    await page.setContent(`<html><body style="margin:0;background:${bg};width:${size}px;height:${size}px;display:grid;place-items:center"><img src="${url}" width="${inner}" height="${inner}"></body></html>`)
    await page.waitForFunction(() => document.images[0]?.complete)
    await page.screenshot({ path: join(dir, 'icons', name), omitBackground: false })
    await page.close()
    console.log(`${slug}: icons/${name} (${size}px)`)
  }
}
await browser.close()
