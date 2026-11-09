import { defineConfig } from 'vite'
import { gameConfig } from '../../tools/vite/game-config.mjs'
import { BRAND } from './src/brand.ts'

export default defineConfig(gameConfig({ name: BRAND.de, shortName: BRAND.de, description: `Gemütliches Fantasy-Idle-Spiel · Cosy fantasy idle game (${BRAND.en})`, themeColor: '#2f4f66', background: '#efe6d6', port: 5173 }))
