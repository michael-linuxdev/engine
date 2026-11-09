import { defineConfig } from 'vitest/config'

/** One Vitest run over every package, game, tool and the repo-wide guards. */
export default defineConfig({
  test: {
    projects: [
      { test: { name: 'engine', root: 'packages/engine', include: ['test/**/*.test.ts'] } },
      { test: { name: 'testing', root: 'packages/testing', include: ['test/**/*.test.ts'] } },
      { test: { name: 'art-kit', root: 'packages/art-kit', include: ['test/**/*.test.{ts,tsx}'] } },
      { test: { name: 'ui-kit', root: 'packages/ui-kit', include: ['test/**/*.test.{ts,tsx}'] } },
      { test: { name: 'engine-react', root: 'packages/engine-react', include: ['test/**/*.test.{ts,tsx}'] } },
      { test: { name: 'vorlage', root: 'games/_vorlage', include: ['test/**/*.test.{ts,tsx}'] } },
      { test: { name: 'lichtwarte', root: 'games/lichtwarte', include: ['test/**/*.test.{ts,tsx}'], testTimeout: 60_000 } },
      { test: { name: 'repo', root: '.', include: ['tests/**/*.test.ts', 'tools/**/*.test.ts'], testTimeout: 60_000 } },
    ],
    passWithNoTests: true,
  },
})
