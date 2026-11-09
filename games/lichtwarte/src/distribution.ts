/**
 * Auslieferung. Vor dem Store-Start: DISTRIBUTION = 'store' und TEST_PHASE = false
 * (tests/architecture.test.ts erzwingt das, sobald eine Store-Hülle im Spielordner liegt).
 */
export const DISTRIBUTION: 'web' | 'store' = 'web'
export const TEST_PHASE: boolean = true
