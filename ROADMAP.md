# ROADMAP

Ziel: eine wiederverwendbare Idle-Engine für mehrere Spiele und darauf **Lichtwarte** (Arbeitstitel), ein gemütliches Fantasy-Idle-Spiel. Es soll mindestens die Tiefe, Systeme, Inhalte und Qualitätssicherung des Referenz-Spiels erreichen (`docs/referenz/paritaet.md`).

**Paritäts-Fortschritt (2026-11-10): 97 %** der Systeme aus `paritaet.md`. 50 von 52 Zeilen sind `im Spiel`/`getestet`, 1 sind `Engine fertig`. Gezählt wird `im Spiel`/`getestet` voll, `Engine fertig` halb.
Der Inhaltsumfang (Lande, Feste, Sammlungen …) liegt deutlich darunter: Lande 34/34 ✓, Chronik 27/20 ✓, Taten 12/10 ✓, Feste 9/9 ✓, Sammlung 49/37 ✓.

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
| P9 | Lande, Wellen 1–3 (… bis ≥ 34) | fertig (34/34; Lande 35–50 geplant) |
| P10 | Lange Nacht und Zeitalter | fertig |
| P11 | Markt-Attrappen, Testgeld, Festwoche, Talstile, Zirkel | fertig |
| P12 | Ton, Ambiente, Playtest-Log, Store-Vorbereitung | fertig (offen: Markenprüfung, Impressum) |
| P13 | Atmosphäre und Erzählung (Karte, Oberfläche, Chronik, Zeremonien) | fertig (offen: Feinschliff der einzelnen Bauwerke) |

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

- [x] Engine-Modul `regions`:
  - je Land eigene Währung und 10 Bereiche (Kauf ×1/Max), Pflege mit 2 Arten × 10 Rängen;
  - Öffnungsbedingung, Offline-Ertrag mit denselben Deckeln;
  - weich gedeckelter Bonus aufs Tal;
  - der Parser füllt neue Lande auf; Größen-Test: 50 voll ausgebaute Lande bleiben unter 100 KB.
- [x] UI: Lande-Tab (Übersicht + nächstes gesperrtes Land), Land-Fenster mit Einleitung der Figur, Bereichen und Pflege
- [x] Welle 1: Lande 2–12 (Moorgrund … Sternweiher) mit Landschaftsgrafik, Figur, Währung, Einleitung und 10 Bereichen de/en. Land 2 öffnet nach der ersten Langen Nacht, jedes weitere, wenn im vorigen der 8. Bereich steht.
- [x] Wellen 2–3: Lande 13–34 (Parität), je mit eigener Landschaft, Figur, Währung, Einleitung und 10 Bereichen de/en
- [x] Der Balance-Simulator spielt die Lande. Er hat einen Fehler gefunden: Die Öffnungsbedingung fragte die falsche Bereichs-ID ab.
- [x] Taktung bei regular: Land 2 an Tag 8, danach etwa jeden ein bis zwei Tage, später alle zwei bis drei Tage. Stellschrauben in `REALM_TUNING`, Test in `games/lichtwarte/test/realms.test.ts`.
- [ ] Lande 35–50 (Plan: `docs/spiele/lichtwarte/regionen.md`). Späte Taktung zusammen mit P10 (ab Land 14 werden die Abstände groß).

## P10 — Lange Nacht und Zeitalter

- [x] Laden der Langen Nacht: 4 Gegenstände, 41 Ränge. Laden des Zeitalters: 5 Gegenstände ohne echten Deckel. Beide Zweige erscheinen erst, wenn es ihre Währung schon gab.
- [x] Engine: Ruhezeit je Schicht (`minimum.restMs`, Lange Nacht: 3 Tage) und Rückkehr-Geschenk ab 48 h (`offline.comebackMs`)
- [x] Chronik mit 20 Seiten (Bauwerke 5–10, Mondwenden 3/5/10, Lehrling, Lange Nacht, Lande, Zeitalter), Rückkehr-Brief. Die Zeremonie läuft für jede Schicht.
- [x] Taktung bei regular: Lange Nacht an Tag 8, erstes Zeitalter an Tag 28 (Tempo-Test über 35 Tage). Die Mauer-Prüfung läuft getrennt für Tal und Lande.

## P11 — Markt (Attrappen)

- [x] Engine-Modul `market`: 7 Angebote, 8 Talstile (4 + 4 Fest), Bonus-Video mit Pause, Festwoche (5 Stufen, frei + Plus), Zeitsprung (6 h am Tag), Tagesgeschenk, Leuchtöl, Wächterzirkel (×1,1 bis ×1,25). Echtgeld ist aus (`STORE_ENABLED = false`).
- [x] Testgeld (engine-react `createTestWallet`): 20 € im Monat, eigener Schlüssel, nicht im Spielstand. Das Bonus-Video sperrt in der Testphase 30 oder 60 s.
- [x] Markt-Tab ab der ersten Mondwende. Talstile tönen die Karte. Preise und Senken: `docs/spiele/lichtwarte/markt.md`.

## P12 — Ton, Ambiente, Playtest-Log, Store

- [x] 8 Effekte, 4 Ambiente-Schichten (Wind, Feuer, Wasser, Nacht), Playtest-Log (opt-in, 48 h roh, Minutenzähler, Tage, Export). Dazu 4 Wetterarten mit Kartenschicht und Omen nach Wetter (`docs/engine/ton-und-playtest.md`).
- [x] App-Icons (SVG → alle PNG-Größen), Store-Texte de/en mit Längen-Test, Store-Screenshots (`npm run store:shots`), Datenschutz im Spiel und als Seite, Store-Prüfung (`npm run store:check`). Details: `docs/spiele/lichtwarte/store.md`.
- [ ] Alle Eigennamen `frei` (Markenregister-Prüfung durch Michael), Impressum. `DISTRIBUTION`/`TEST_PHASE` sind geprüft: Der Test erzwingt den Wechsel, sobald eine Store-Hülle im Spielordner liegt.

## P13 — Atmosphäre und Erzählung

Ziel: Das Spiel soll der Referenz in Erzählung, Grafik und Stimmung überlegen sein, nicht nur ebenbürtig in den Systemen.

- [x] **Talkarte bildschirmfüllend:** Himmel mit Gestirn, Sternen, Wolken und Polarlicht, drei Bergketten, Bach mit Wasserfall, geschwungener Weg hinauf zur Warte. Kopfzeile und Hinweise schweben, Funkenruf als runder Knopf unten. Omen und Talgast klappen auf der Karte erst beim Antippen auf.
- [x] **Die Karte erzählt:** eine Laterne je stehendem Bauwerk, das Leuchtfeuer der Warte wächst mit. Nachts liegen die Lichter über der Lasur.
- [x] **Leben:** Glühwürmchen, Vögel, Falter, Rauch, Banner, Bach, Glimmer über den Bauwerken, Fenno auf dem Weg mit Sprechblase, Talgast auf der Karte. Alles ruht bei „Bewegung reduzieren“.
- [x] **Oberfläche:** Nachtblau, Pergament, Laternengold; Zeichen in der Leiste (`navIcons` in der Hülle); Schrift Alegreya (OFL, `docs/lizenzen.md`); Schilder zeigen, was sich gerade leisten lässt.
- [x] **Erzählung:** Prolog, Chronik als Buch mit 27 Seiten in fünf Kapiteln und Bildern, Briefe von Alwine, Zeremonien als Vollbild je Schicht, 16 Sätze von Fenno. Bogen: `docs/spiele/lichtwarte/welt.md`.
- [x] **Klang:** fünfte Ambiente-Schicht „Windspiel“ (Fünftonleiter, keine feste Melodie).
- [ ] Feinschliff der zehn Bauwerke je Stufe (eigene Details statt nur gemeinsamer Bausteine), Lande-Bilder im neuen Stil, Figur für Alwine auf der Bank nach dem ersten Zeitalter.

---

## Offene Fragen an Michael

1. **Arbeitstitel:** Das Spiel hat einen deutschen und einen englischen Titel (`games/lichtwarte/src/brand.ts`). Die Websuche ergab keinen Treffer als Spiel oder App. Die Markenprüfung (DPMA/EUIPO/…) steht für alle Eigennamen aus (`docs/marken/pruefung.md`).
2. **Stichtag** für „Spielstände gehen nie verloren“ in `CLAUDE.md` eintragen.
3. **Rechtliches:** Die Impressum-Angaben fehlen noch (`games/lichtwarte/src/legal.ts`). Die Datenschutz-Texte sind fertig.
4. **Mondwende-Tore der Bauwerke 5–10** (Annahme, „mach wie du denkst“): gezählt als abgeschlossene Mondwenden. Nach P6 gilt 1/2/3/5/8/12, das trifft „alle Bauwerke um Tag 5“.
5. **Lange Nacht** (Annahme): Runensplitter und Archiv bleiben erhalten. Nur das Zeitalter setzt Nachttau zurück.
6. **Schriften:** Seit P13 ist Alegreya (OFL) gebündelt, eingetragen in `docs/lizenzen.md`. Fließtext bleibt Systemschrift.
