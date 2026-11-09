# ROADMAP

Ziel: eine wiederverwendbare Idle-Engine für mehrere Spiele und darauf **Lichtwarte** (Arbeitstitel), ein gemütliches Fantasy-Idle-Spiel. Es soll mindestens die Tiefe, Systeme, Inhalte und Qualitätssicherung des Referenz-Spiels erreichen (`docs/referenz/paritaet.md`).

**Paritäts-Fortschritt:** siehe Tabelle unten. Gezählt wird je System aus `paritaet.md`: `im Spiel`/`getestet` zählt voll, `Engine fertig` halb.

| Phase | Inhalt | Status |
|---|---|---|
| P0 | Fundament | fertig |
| P1 | Engine-Kern | fertig |
| P2 | Speichern | in Arbeit |
| P3 | Prestige und Meta | offen |
| P4 | React, UI-Kit, i18n | offen |
| P5 | Lichtwarte: spielbarer Kern | offen |
| P6 | Balance-Pass 1 | offen |
| P7 | Bindung | offen |
| P8 | Sammeln und Welt | offen |
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

- [ ] Hülle, Modul-Ausschnitte, drei Migrationsketten, tolerante Parser, Vorwärts-Toleranz
- [ ] Speicher-Sperre, Sicherungscode mit Prüfsumme, Datei-Adapter
- [ ] Wächter: Abdeckung, Fixtures, Größe, Fuzz, Determinismus, ID-Sperre
- [ ] `games/_vorlage/test/fixtures/save-v1.json`

## P3 — Prestige und Meta

- [ ] N Schichten als Daten, Probe-Schwelle, √-Auszahlung, Mindestbedingungen, Reset je Modul
- [ ] Meta-Laden (Freischaltung beim Wiederaufbau, Empfehlungs-Band)
- [ ] Burst, Helfer, Überraschungen, Bester Kauf, Nächstes Ziel
- [ ] Drei Schichten nacheinander getestet, Mini-Simulator der Vorlage bis zur ersten Schicht

## P4 — React, UI-Kit, i18n

- [ ] `useEngine`, Overlays, Prefs, i18n-Laufzeit mit Live-Wechsel
- [ ] Token-Vertrag, Navigation, Sheets, HUD, Ausbau-Sheet, Prestige-Panel, Meta-Laden, Speichern, Einstellungen
- [ ] Install-Gate, Testphasen-Hinweis, Fehlergrenze, Speicher-Sperre-Banner
- [ ] i18n-Wächter; Vorlage läuft im Browser de/en; `smoke` + `axe` für die Vorlage

## P5 — Lichtwarte: spielbarer Kern

- [ ] Spieldaten: 10 Bauwerke, 3 Schichten, Meta-Laden-Grundstock (10 Gegenstände)
- [ ] Texte de/en, Glossar, Welt, Kunststil, Inhaltsplan, 50 Lande skizziert
- [ ] `art-kit`, Talkarte mit Slots, 10 Bauwerk-Grafiken (Ziel: 4 Stufen), Stimmungen Tag/Abend/Nacht
- [ ] FTUE, Chronik-Einstieg, Eigennamen-Register + Prüfprotokoll
- [ ] `smoke` de/en, `axe`, `screens --strict`, `art`, Balance-Simulator für das Spiel
- [ ] Web-Fassung auf GitHub Pages

## P6 — Balance-Pass 1

- [ ] Ziele aus `docs/spiele/lichtwarte/balance.md` erreicht (erste Mondwende 15–20 min, Bauwerk 2 nach 3–5 min, Bauwerk 3 nach 8–15 min, keine Mondwende unter 20 min aktiv, Lange Nacht bei `regular` um Tag 9 ± 2, alle 10 Bauwerke bei `regular` um Tag 5 ± 1, keine Mauer)
- [ ] `tools/balance/tempo.test.ts` mit Zielkorridoren in der CI

## P7 — Bindung

- [ ] Engine-Module: `daily`, `quests`, `achievements`, `challenges`, `weekendEvent`, `flash`, `calendarFests`, `wheel`, `hints`, `featureUnlocks` (je mit Tests)
- [ ] Inhalte: Wachrunde (7-Tage-Serie), 6 Auftrags-Vorlagen, ≥ 10 Taten, 3 Prüfungen, Marktnacht, Sternfenster, 9 Lichterfeste, Rad (eigener Name), 16 Hinweise, 9 Freischaltungen
- [ ] Rückkehr-Korb-Fenster, Benachrichtigungen

## P8 — Sammeln und Welt

- [ ] Engine-Module: `collections`, `combine`, `visitors`, `decor`, `seasonAlbum`, `layerCards`, `choiceEvents`, `projects`
- [ ] Inhalte: ≥ 37 Einträge Bestiarium/Kräuterkunde, 12 Alchemie-Ergebnisse, 12 Talgäste, 16 Banner & Steine (8 Plätze), 48 Folio-Ziele, 12 Sternbilder, 3 Omen × 2, 6 Großwerke × 3 Stufen
- [ ] Jahreszeiten × Tageszeit (16 Stimmungen)

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

1. **Arbeitstitel:** de *Lichtwarte*, en *Beaconwatch*. Die Websuche ergab keinen Treffer als Spiel oder App. Die Markenprüfung (DPMA/EUIPO/…) steht aus.
2. **Stichtag** für „Spielstände gehen nie verloren“ in `CLAUDE.md` eintragen.
3. **Rechtliches:** Impressum-Angaben fehlen (P12).
