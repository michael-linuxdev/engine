# Idle-Engine

Eine wiederverwendbare Idle-Engine für mehrere Spiele. Darauf läuft als erstes Spiel ein gemütliches Fantasy-Idle-Spiel (Arbeitstitel in `games/lichtwarte/src/brand.ts`): Du richtest eine verfallene Turmwarte wieder auf, und das Licht kehrt ins Tal zurück, auch wenn du nicht da bist.

Plan und Stand: [`ROADMAP.md`](./ROADMAP.md) · Arbeitsregeln: [`CLAUDE.md`](./CLAUDE.md) · Architektur: [`docs/adr/`](./docs/adr/) · Engine-Handbuch: [`docs/engine/`](./docs/engine/) · Spiel: [`docs/spiele/lichtwarte/`](./docs/spiele/lichtwarte/) · Abgleich mit der Referenz: [`docs/referenz/paritaet.md`](./docs/referenz/paritaet.md)

## Aufbau

| Pfad | Inhalt |
|---|---|
| `packages/engine` (`@engine/core`) | Reines TypeScript: Zustand, Formeln, Module, Effekt-Pipeline, Speicherformat mit Migrationen, Takt. Kein React, kein DOM, keine Systemuhr, kein `Math.random`. |
| `packages/engine/src/modules/` | Engine-Module mit eigenem Speicher-Ausschnitt: `wallet`, `producers`, `branches`, `progression`, `prestige` (N Schichten), `metaShop`, `offline`, `burst`, `helper`, `surprises` |
| `packages/engine-react` (`@engine/react`) | Runtime/`useEngine` (Laden, Takt, Speichern), i18n-Laufzeit, Prefs, Overlay-Stapel, Install-Gate, Testphase, Datei-Speichern, Einstiegs-Schritte |
| `packages/ui-kit` (`@engine/ui`) | Neutrale Komponenten (`GameShell`, HUD, Ausbau, Prestige, Meta-Laden, Sicherung, Einstellungen …), Token-Vertrag `styles/tokens.css`, Engine-Texte de/en |
| `packages/art-kit` (`@engine/art`) | SVG-Werkzeug: Raster, `Place`, Seed-Variation, Stilregeln, Stimmungen, Ausbaustufen, `ArtSheet` |
| `packages/testing` (`@engine/testing`) | Wächter: Namen/Marken, Importe, Speicher (`describeSaveGuards`), i18n (`describeI18nGuards`), Kontrast |
| `games/lichtwarte` | Das Fantasy-Spiel: `game.ts` (Daten), `i18n/`, `art/` (Palette, Bauwerke), `scene/` (Talkarte), `content/` (Chronik, Einstieg, Eigennamen), `story/` |
| `games/_vorlage` | Minimalspiel (3 Erzeuger, 1 Schicht), beweist die Themen-Neutralität |
| `tools/balance` | Simulator gegen die echte Engine (virtuelle Uhr, Profile engaged/regular/casual) |
| `tools/e2e` | Playwright: `smoke`, `axe`, `screens`, `art` (Pixelvergleich, SVG-Budget) |
| `tools/pages` | Setzt `dist/` für GitHub Pages zusammen (Spiel unter `/`, Vorlage unter `/vorlage/`) |
| `tests/` | Repo-weite Wächter (Namens-Wächter, Architektur, Store-Hülle) |

## Befehle

```bash
npm install
npm run dev                  # Spiel (http://localhost:5173)
npm run dev:vorlage          # Vorlage
npm test                     # Vitest über alle Pakete, Spiele und Werkzeuge
npm run lint                 # oxlint
npm run typecheck            # tsc -b (Projekt-Referenzen)
npm run build                # Typprüfung + Build aller Spiele → dist/
npm run e2e                  # alle Spiele, de + en: smoke, axe, screens --strict, art (setzt npm run build voraus)
npm run screens -- lichtwarte en [--strict]   # jedes Fenster → e2e-screens/lichtwarte/en/
npm run art:update -- lichtwarte              # Vergleichsbilder nach gewollter Grafik-Änderung erneuern
SUMMARY=1 npm run balance -- lichtwarte regular 336          # Balance-Simulator (Spiel, Profil, Stunden)
SUMMARY=1 CHECK=1 npm run balance -- lichtwarte engaged 72   # mit Zielkorridoren
BAL_offline__softHours=10 npm run balance -- lichtwarte casual 48   # Stellschraube überschreiben
npm run ids:update           # neue Inhalts-IDs in ids.lock.json eintragen (nie entfernen)
node tools/fixture-make.mjs lichtwarte        # echten Spielstand als Fixture ablegen (überschreibt nie)
```

## URL-Parameter

| Parameter | Wirkung |
|---|---|
| `?lang=de` / `?lang=en` | Sprache erzwingen (sonst Gerätewahl, dann Browser) |
| `?ambient=night-winter` | Stimmung erzwingen: `dawn` / `day` / `evening` / `night`, optional `-spring` / `-summer` / `-autumn` / `-winter` |
| `?artsheet` / `?artsheet=map` | Alle Grafiken in vier Stimmungen bzw. die Talkarte |
| `?installGate=1` / `?installGate=0` | Hinweis „Zuerst die App installieren“ erzwingen bzw. aus |
| `?testPhase=1` | Testphasen-Hinweis zeigen |
| `?fest=…`, `?region=all` | folgen mit P7 (Feste) und P9 (Lande) |

## Hosting

GitHub Pages, Deploy bei Push auf `main` (`.github/workflows/deploy-pages.yml`, Domain dort eingetragen). Spiel unter `/`, Vorlage unter `/vorlage/`.
