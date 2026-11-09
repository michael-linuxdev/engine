import { defineConfig } from 'vite'
import { gameConfig } from '../../tools/vite/game-config.mjs'

export default defineConfig(gameConfig({ name: 'Vorlage', description: 'Minimales Beispielspiel der Idle-Engine · Minimal example game of the idle engine', themeColor: '#2f5d50', background: '#f4f4f2', port: 5174 }))
