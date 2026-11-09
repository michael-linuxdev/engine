# ROADMAP

Ziel: eine wiederverwendbare Idle-Engine für mehrere Spiele und darauf **Lichtwarte** (Arbeitstitel), ein gemütliches Fantasy-Idle-Spiel. Es soll mindestens die Tiefe, Systeme, Inhalte und Qualitätssicherung des Referenz-Spiels erreichen (`docs/referenz/paritaet.md`).

**Paritäts-Fortschritt (2026-11-10): 72 %** der Systeme aus `paritaet.md`. 36 von 52 Zeilen sind `im Spiel`/`getestet`, 3 sind `Engine fertig`. Gezählt wird `im Spiel`/`getestet` voll, `Engine fertig` halb.
Der Inhaltsumfang (Lande, Feste, Sammlungen …) liegt deutlich darunter: Lande 1/34, Chronik 6/20, Taten 12/10 ✓, Feste 9/9 ✓.

**Web-Fassung:** GitHub Pages, Deploy bei Push auf `main`. Das Spiel liegt unter `/`, die Vorlage unter `/vorlage/`. Die eigene Domain ist in `.github/workflows/deploy-pages.yml` eingetragen.

| Phase | Inhalt | Status |
|---|---|---|
| P0 | Fundament | fertig |
| P1 | Engine-Kern | fertig |
| P2 | Speichern | fertig |
| P3 | Prestige und Meta | fertig |
| P4 | React, UI-Kit, i18n | fertig |
| P5 | Lichtwarte: spielbarer Kern | fertig |
| P6 | Balance-Pass 1 | fertig |
| P7 | Bindung | fertig |
| P8 | Sammeln und Welt | fertig |
| P9 | Lande, Wellen 1–3 (… bis ≥ 34) | offen |
| P10 | Lange Nacht und Zeitalter | offen |
| P11 | Markt-Attrappen, Testgeld, Festwoche, Talstile, Zirkel | offen |
| P12 | Ton, Ambiente, Playtest-Log, Store-Vorbereitung | offen |

---

## P0 — Fundament

- [x] npm-Workspaces, TS-Projekt-Referenzen (`tsc -b`), Vitest-Projekte, oxlint, Wurzel-Skripte
- [x] CI (`.github/workflows/ci.yml`: lint, typecheck, test, build). E2E, Balance-Smoke und Pages-Deploy kommen mit den Phasen dazu, in denen es sie gibt (P3/P4/P5).
- [x] `CLAUDE.md`, `README.md`, `ROADMAP.md`, ADR 0001–0009, `docs/referenz/*`, `docs/marken/*`, `docs/lizenzen.md`
- [x] `packages/testing`: Namens-Wächter, Neutralitäts-Test, Import-Richtungs-Test, reine Engine
- [x] Wächter-Beweis: Ein eingefügtes Denylist-Wort lässt den Test fehlschlagen (`tests/names.test.ts`)
- [x] `games/lichtwarte/src/brand.ts` (Arbeitstitel)

## P1 — Engine-Kern

- [x] `Ctx` (Uhr, RNG), `Num`, `format` (de/en, kompakt, bis 1e300)
- [x] Erzeuger-Formeln, Mengenkauf geschlossen, Freischalt-Tore
- [x] Effekt-Pipeline mit Aufschlüsselung
- [x] Takt mit Akkumulator, Offline in geschlossener Form, Progression/XP, Zweige
- [x] Determinismus-Test, Engine-Handbuch `docs/engine/*`

## P2 — Speichern

- [x] Hülle, Modul-Ausschnitte, drei Migrationsketten, tolerante Parser, Vorwärts-Toleranz
- [x] Speicher-Sperre, Sicherungscode mit Prüfsumme, Datei-Adapter
- [x] Wächter: Abdeckung, Fixtures, Größe, Fuzz, Determinismus, ID-Sperre
- [x] `games/_vorlage/test/fixtures/save-v1.json`

## P3 — Prestige und Meta

- [x] N Schichten als Daten, Probe-Schwelle, √-Auszahlung, Mindestbedingungen, Reset je Modul
- [x] Meta-Laden (Freischaltung beim Wiederaufbau, Empfehlungs-Band)
- [x] Burst, Helfer, Überraschungen, Bester Kauf, Nächstes Ziel
- [x] Drei Schichten nacheinander getestet, Mini-Simulator der Vorlage bis zur ersten Schicht

## P4 — React, UI-Kit, i18n

- [x] `useEngine`, Overlays, Prefs, i18n-Laufzeit mit Live-Wechsel
- [x] Token-Vertrag, Navigation, Sheets, HUD, Ausbau-Sheet, Prestige-Panel, Meta-Laden, Speichern, Einstellungen
- [x] Install-Gate, Testphasen-Hinweis, Fehlergrenze, Speicher-Sperre-Banner
- [x] i18n-Wächter; Vorlage läuft im Browser de/en; `smoke` + `axe` für die Vorlage

## P5 — Lichtwarte: spielbarer Kern

- [x] Spieldaten: 10 Bauwerke, 3 Schichten (Mondwende, Lange Nacht, Zeitalter), Archiv der Wächter mit 10 Gegenständen und 163 Rängen, 7 Rang-Belohnungen
- [x] Texte de/en, Glossar, Welt, Kunststil, Inhaltsplan, 50 Lande skizziert (`docs/spiele/lichtwarte/`)
- [x] `art-kit` (Raster, Place, Seed, Stilregeln, Stimmungen, Stufen, Grafikübersicht). Talkarte mit 10 Plätzen, Wildnis + 4 Stufen je Bauwerk, 16 Stimmungen (Tageszeit × Jahreszeit)
- [x] Einstieg (6 Schritte, Hinweis verdeckt nie sein Ziel), Chronik mit 6 Seiten, Zeremonie nach der Mondwende
- [x] Eigennamen-Register und Prüfprotokoll. Zwei Konflikte gefunden und ersetzt (Nachttau, Lichtkiesel).
- [x] `smoke` de/en (inkl. Einstieg, Chronik, Talkarte), `axe` de/en, `screens --strict` de/en, `art` (51 Vergleichsbilder, Budget ≤ 1.500 SVG-Elemente: ~300), Balance-Simulator mit Zielkorridoren in der CI
- [x] Web-Fassung auf GitHub Pages

## P6 — Balance-Pass 1

- [x] Alle Ziele aus `docs/spiele/lichtwarte/balance.md` erreicht: engaged, regular, casual sowie die Prüfung „keine Mauer“
- [x] `tools/balance/tempo.test.ts` läuft mit `npm test` in der CI, dazu `CHECK=1 npm run balance -- lichtwarte engaged 72` (inklusive Mauer-Prüfung)
- [x] Wächterrang bekommt XP auch aus Prestige und Rückkehr-Korb (Engine, `progression`)

## P7 — Bindung

- [x] Engine-Module mit Tests: `daily`, `quests`, `achievements`, `challenges` (mit `guard`-Hook für Einschränkungen), `weekendEvent`, `flash`, `calendarFests`, `wheel`, `featureUnlocks`. Dazu `pickHint` (engine-react), lokale Kalenderzeit über `Clock.offsetMin`.
- [x] Inhalte: Wachrunde (7 Tage, Einfrieren statt Verfall, 3 Rückkehr-Stufen), 6 Auftrags-Vorlagen (3 je Tag), 12 Taten, 3 Prüfungen, Marktnacht, Sternfenster, 9 Lichterfeste mit Laden, Sternenrad (4 Arten), 5 Freischaltungen, 16 Hinweise
- [x] UI: Wacht-Tab (öffnet sich nach Kräuterkate Stufe 10), Ereignis-Pillen, Hinweisblase, Sternenrad nach der Zeremonie. Neue Eigennamen sind geprüft und eingetragen.
- [x] Overlay-Stapel: genau ein History-Eintrag, Änderungen gebündelt. Vorher konnte Escape nach „Fenster zu, neues Fenster auf“ die Seite verlassen.
- [ ] Rückkehr-Brief (≥ 48 h) und Benachrichtigungen: folgen mit P10 bzw. P12

## P8 — Sammeln und Welt

- [x] Engine-Module mit Tests: `collections`, `combine`, `visitors`, `decor`, `seasonAlbum`, `layerCards`, `choiceEvents`, `projects`
- [x] Inhalte:
  - Bestiarium & Kräuterkunde mit 49 Einträgen in 5 Kategorien und 3 Seltenheiten; die Fest-Sorten gibt es im Fest-Laden.
  - 12 Alchemie-Rezepte (4 h, auch offline), 12 Talgäste, 16 Banner & Steine auf 8 Plätzen der Talkarte.
  - 12 Folio-Ziele je Jahreszeit, 12 Sternbilder (1 aus 3), 3 Omen × 2, 6 Großwerke × 3 Stufen.
- [x] UI: Tal-Tab, Gast- und Omen-Hinweis (höchstens ein Hinweis gleichzeitig), Sternbild-Wahl nach dem Sternenrad. Deko ist auf der Karte und im Pixelvergleich (67 Bilder).
- [x] Jahreszeiten × Tageszeit: 16 Stimmungen (seit P5)
- [ ] Wetterarten (4) als tägliche Stimmung: offen, eingeplant mit P12 (Ambiente)

## P9 — Lande

- [ ] Engine-Modul `regions` (Unterwirtschaft, Pflege, Intro, Öffnungszeit, `parseRegions` füllt auf; Größen-Test 50 Regionen < 100 KB)
- [ ] Welle 1–3: Lande 2–12; danach Wellen bis ≥ 34 (Parität), geplant bis 50 (`docs/spiele/lichtwarte/regionen.md`)

## P10 — Lange Nacht und Zeitalter

- [ ] Läden der Schichten 2/3 (≥ 4 bzw. 5 Gegenstände), Ruhezeit, Zeremonien, Chronik-Briefe (gesamt ≥ 20), Rückkehr-Brief

## P11 — Markt (Attrappen)

- [ ] `market`, `testWallet`, `clan`: 7 Angebote, 8 Talstile, Werbe-Attrappe (30/60 s), Festwoche (5 Stufen), Zeitsprung (Tageskontingent), Zirkel-Boost

## P12 — Ton, Ambiente, Playtest-Log, Store

- [ ] 8 Effekte, 4 Ambiente-Schichten, Playtest-Log (opt-in, 48 h roh, Minutenzähler, Export)
- [ ] App-Icons, Store-Texte de/en, Store-Screenshots, Rechtstexte
- [ ] Alle Eigennamen `frei`, `DISTRIBUTION`/`TEST_PHASE` geprüft

---

## Offene Fragen an Michael

1. **Arbeitstitel:** Das Spiel hat einen deutschen und einen englischen Titel (`games/lichtwarte/src/brand.ts`). Die Websuche ergab keinen Treffer als Spiel oder App. Die Markenprüfung (DPMA/EUIPO/…) steht für alle Eigennamen aus (`docs/marken/pruefung.md`).
2. **Stichtag** für „Spielstände gehen nie verloren“ in `CLAUDE.md` eintragen.
3. **Rechtliches:** Impressum-Angaben fehlen (P12).
4. **Mondwende-Tore der Bauwerke 5–10** (Annahme, „mach wie du denkst“): gezählt als abgeschlossene Mondwenden. Nach P6 gilt 1/2/3/5/8/12, das trifft „alle Bauwerke um Tag 5“.
5. **Lange Nacht** (Annahme): Runensplitter und Archiv bleiben erhalten. Nur das Zeitalter setzt Nachttau zurück.
6. **Schriften** (Annahme): weiter Systemschriften, keine gebündelte Schrift. Eine OFL-Schrift kann in P12 dazukommen, eingetragen in `docs/lizenzen.md`.
