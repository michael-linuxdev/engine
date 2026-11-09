# 0006 — Uhr und Zufall werden injiziert

**Kontext.** Der Balance-Simulator der Referenz überschrieb `Date.now` und `Math.random` global. Das ist zerbrechlich, und Tests mussten Zeit von Hand vorspulen.

**Entscheidung.**

- **Uhr:** Alle Engine-Funktionen bekommen eine `Clock { now() }`. Die UI übergibt die echte Uhr, Tests und Simulator eine `ManualClock`.
- **Zufall:** `ctx.rng` ist ein mulberry32-Generator mit Seed. Sein Zustand liegt als Hex-Text im Spielstand (`core.rng`). Er wird zu Beginn jedes Schritts daraus erzeugt und am Ende zurückgeschrieben.
- **Verbote:** `Date.now`, `new Date()` ohne Argument, `Math.random`, `performance.now` und DOM-Globals sind in `packages/engine` verboten. Das erzwingen `tests/architecture.test.ts` und oxlint (`no-restricted-globals`).

**Alternativen.**
- Globale Überschreibung wie in der Referenz: Damit gibt es keinen Determinismus-Test.

**Folgen.**
- Gleicher Startzustand, gleiche Aktionen und gleiche Uhr ergeben einen bitgleichen Spielstand (`engine.test.ts`). Der Simulator spielt exakt die Engine des Spiels.
