# Idle-Engine

Eine wiederverwendbare Idle-Engine für mehrere Spiele. Darauf läuft als erstes Spiel **Lichtwarte** (Arbeitstitel, en *Beaconwatch*), ein gemütliches Fantasy-Idle-Spiel.

Plan und Stand: [`ROADMAP.md`](./ROADMAP.md) · Arbeitsregeln: [`CLAUDE.md`](./CLAUDE.md) · Architektur: [`docs/adr/`](./docs/adr/) · Engine-Handbuch: [`docs/engine/`](./docs/engine/)

## Aufbau

| Pfad | Inhalt |
|---|---|
| `packages/engine` (`@engine/core`) | Reines TypeScript: Zustand, Formeln, Module, Speicherformat, Takt. Kein React, kein DOM, keine Systemuhr. |
| `packages/testing` (`@engine/testing`) | Wiederverwendbare Wächter: Namen, Neutralität, Importe, Speicher, i18n |
| `games/_vorlage` | Minimalspiel (3 Erzeuger, 1 Prestige-Schicht), beweist die Themen-Neutralität |
| `games/lichtwarte` | Das Fantasy-Spiel |
| `tests/` | Repo-weite Wächter (Namens-Wächter, Architektur) |
| `docs/` | ADRs, Engine-Handbuch, Spiel-Doku, Marken, Referenz-Abgleich, Lizenzen |

## Befehle

```bash
npm install
npm test            # Vitest über alle Pakete und Spiele
npm run lint        # oxlint
npm run typecheck   # tsc -b (Projekt-Referenzen)
npm run build       # Typprüfung + Build aller Spiele nach dist/
```
