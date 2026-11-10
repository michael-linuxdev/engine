# Parität mit dem Referenz-Spiel

Referenz: `michael-linuxdev/idlegame` @ `a187dc9` (nur gelesen). Gezählt am 2026-11-09 aus den Daten-Arrays in `src/`. Die Mengen sind **Mindestmengen** für Lichtwarte.

Status: `offen` · `Engine fertig` (Mechanik + Tests in `packages/engine`) · `im Spiel` (Daten + Texte + UI in `games/lichtwarte`) · `getestet` (E2E/Balance deckt es ab).

## Kern und Prestige

| System | Referenz-Datei(en) | Engine-Modul | Fantasy-Entsprechung | Mindestmenge | Status |
|---|---|---|---|---|---|
| Erzeuger | `generators.ts`, `state/buy.ts`, `state/garden.ts` | `producers` | 10 Bauwerke (Kräuterkate … Sternwarte) | 10 Erzeuger, 10 Meilensteine (×2), Tore bei Prestige 1/2/4/6/9/12 | im Spiel |
| Mengenkauf ×1/×10/×max | `state/garden.ts` | `producers` (`quote`, `maxAffordable`) | — | 3 Modi | im Spiel |
| Ausbaustufen-Grafik | `theme/tiers.ts` | `art-kit` (`tierFor`) | Wildnis + 4 Stufen je Bauwerk | 5 Stufen × 10 | getestet (Pixelvergleich, 50 Zustände) |
| Zweige | `branches.ts` | `branches` | Effizienz / Fassung | 2 Arten × 5 Ränge × 10 = 100 Ränge | im Spiel |
| Spieler-Level | `progression.ts` | `progression` | Wächterrang | 40 Stufen, 7 Belohnungen, +0,5 %/Stufe bis +12 % | im Spiel |
| Prestige 1 | `economy.ts` | `prestige` Schicht 0 | Mondwende → Runensplitter | Probe-Schwelle, √-Auszahlung, ≥ 3 Erzeuger ab Lauf 2 | getestet (smoke, Balance-CI) |
| Prestige 2 | `longLoop.ts` | `prestige` Schicht 1 | Lange Nacht → Nachttau | 4 Gegenstände / 41 Ränge, 3 Tage Ruhezeit | getestet (4/41, 3 Tage Ruhe, Tempo-Test) |
| Prestige 3 | `generations.ts` | `prestige` Schicht 2 | Zeitalter → Ahnenlicht | 5 Gegenstände (ohne Deckel) | getestet (5, erstes Zeitalter an Tag 28) |
| Meta-Laden | `truhe.ts` | `metaShop` | Archiv der Wächter | **10 Gegenstände, 163 Ränge, 3 Zweige**, Empfehlungs-Band 5 + 2 | im Spiel |
| Burst-Tap | `state/rewards.ts`, `economy.ts` | `burst` | Funkenruf | 60 s Ertrag, 5 min Aufladung | im Spiel |
| Helfer-Automatik | `state/garden.ts`, `state/life.ts` | `helper` | Lehrling | Stufen, Regeln (günstigster/bester/alle) | Engine fertig |
| Offline | `state/offline.ts`, `economy.ts` | `offline` | Rückkehr-Korb | 8 h voll, bis 24 h halb | im Spiel |
| Überraschungs-Sprünge | `surpriseJumps.ts` | `surprises` | Funde | Drossel | im Spiel |
| Bester Kauf | `bestBuy.ts` | `bestBuy()` | Hinweis der Chronik | 1 | im Spiel |
| Nächstes Ziel | `nextGoal.ts` | `nextGoal()` | Ziel-Leiste | 1 | im Spiel |

## Bindung (P7)

| System | Referenz-Datei(en) | Engine-Modul | Fantasy-Entsprechung | Mindestmenge | Status |
|---|---|---|---|---|---|
| Tägliche Runde | `dailyOps.ts` | `daily` | Wachrunde | 7-Tage-Serie, Einfrieren statt Verfall, 3 Rückkehr-Stufen | getestet (7 Tage, 3 Stufen) |
| Tagesziele | `quests.ts` | `quests` | Aufträge | 6 Vorlagen, 3 je Tag | im Spiel (6 Vorlagen) |
| Erfolge | `achievements.ts` | `achievements` | Taten | **10** | getestet (12) |
| Herausforderungen | `challenges.ts` | `challenges` | Prüfungen | **3** (+3 % je) | im Spiel (3) |
| Wochenend-Event | `events.ts`, `state/events.ts` | `weekendEvent` | Marktnacht | 1 (Fr 18 Uhr bis So, ×1,25) | im Spiel |
| Blitz-Event | `flashEvent.ts` | `flash` | Sternfenster | 1 Art (18 min, ×1,15) | im Spiel |
| Kalender-Feste | `fests.ts`, `state/fest.ts` | `calendarFests` | Lichterfeste | **9** (4 große, 5 kleine), Fest-Laden 6/8 Zeilen | getestet (9 Feste, Laden 3 Zeilen; Fest-Sorten mit P8) |
| Rad | `gardenLife.ts` | `wheel` | Sternenrad | 4 Arten auf 6 Feldern | getestet (4 Arten, 6 Gewichte) |
| Freischalt-Liste | `featureUnlocks.ts` | `featureUnlocks` | — | **9** Systeme | im Spiel (13) |
| Hinweise | `hints.ts` | engine-react `pickHint` | Randnotizen der Chronik | **16** | im Spiel (16) |
| FTUE | `ftue.ts` | engine-react `createSteps` + ui-kit `FtueCoach` | Erste Wache | **6 Schritte** | getestet (6 Schritte, smoke) |
| Benachrichtigungen | `notify.ts` | engine-react | — | 1 Stelle | offen |

## Sammeln und Welt (P8)

| System | Referenz-Datei(en) | Engine-Modul | Fantasy-Entsprechung | Mindestmenge | Status |
|---|---|---|---|---|---|
| Sammelbuch-Sorten | `gardenLife.ts` (`VARIETIES`) | `collections` | Bestiarium & Kräuterkunde | **37** (24 + 13 Fest), 3 Seltenheiten | getestet (49: 24 + 13 Fest + 12 Tränke) |
| Sammel-Übersicht | `collections.ts` | `collections` | — | 6 Kategorien | im Spiel (5 Kategorien + Gäste, Folio, Taten als eigene Karten) |
| Kombinieren | `crossing.ts` | `combine` | Alchemie | **12** Ergebnisse, 4 h | getestet (12) |
| Besucher | `residents.ts` | `visitors` | Talgäste | **12** Arten | getestet (12) |
| Deko | `decor.ts` | `decor` | Banner & Steine | **16** Teile (10 + 6 exklusiv), **8** Plätze | getestet (16, 8 Plätze, auf der Talkarte) |
| Album | `album.ts` | `seasonAlbum` | Jahreskreis-Folio | **12** Ziele je Jahreszeit (48/Jahr) | im Spiel (12 × 4) |
| Karten nach Prestige | `seasonCards.ts` | `layerCards` | Sternbilder | **12** (9 + 3), 1 aus 3 | im Spiel (12) |
| Entscheidungs-Ereignis | `weatherEvents.ts`, `gardenLife.ts` | `choiceEvents` (`pick`) | Omen nach Wetter | 4 Wetterarten, 3 Ereignisse × 2 Optionen | getestet (4 Wetterarten mit Kartenschicht, 3 × 2) |
| Großprojekte | `projects.ts` | `projects` | Großwerke | **6 × 3 = 18 Stufen** | im Spiel (6 × 3) |
| Stimmungen | `theme/art/mood.ts`, `theme/ambient.ts` | `art-kit` (`moodAt`) | Morgen/Tag/Abend/Nacht × 4 Jahreszeiten | 16 Zustände | getestet (16 im Spiel, 4 im Pixelvergleich) |

## Lande (P9)

| System | Referenz-Datei(en) | Engine-Modul | Fantasy-Entsprechung | Mindestmenge | Status |
|---|---|---|---|---|---|
| Regionen | `chapters.ts`, `state/chapters.ts`, `chapterPlan.ts` | `regions` | Lande | **34** ausgearbeitet (inkl. Hauptkarte), 50 geplant, je 10 Bereiche, Pflege 2 Arten × 10 Ränge | getestet (34 von 34: Hauptkarte + Wellen 1–3; Plan für 50) |

## Erzählung (P5/P10)

| System | Referenz-Datei(en) | Engine-Modul | Fantasy-Entsprechung | Mindestmenge | Status |
|---|---|---|---|---|---|
| Briefe | `notebook.ts` | `narrative` (vorerst Spiel + `createSeen`) | Chronik als Buch, 5 Kapitel | **20** | im Spiel (27) |
| Rückkehr-Brief | `story/ComebackLetter.tsx` | `offline` (`comebackMs`) | Rückkehr-Seite | 1 (≥ 48 h) | getestet (48 h, 20 Lichtkiesel) |
| Zeremonie | `story/SeasonCeremony.tsx` | ui-kit | Mondwende-Zeremonie | 1 (3 Phasen) | getestet (Zeremonie → Chronik → Sternenrad → Sternbild) |

## Markt, Plattform, Ton (P11/P12)

| System | Referenz-Datei(en) | Engine-Modul | Fantasy-Entsprechung | Mindestmenge | Status |
|---|---|---|---|---|---|
| Markt-Angebote | `monetization.ts` | `market` | Markt | **7** Angebote (Attrappen) | getestet (7, Store aus) |
| Kosmetik | `monetization.ts` | `market` | Talstile | **8** (4 + 4 Fest) | getestet (8, Fest-Stile nur im Fest) |
| Werbung (Attrappe) | `monetization.ts` | `market` | Bonus-Video | 2 Wahlen, Sperre 30/60 s | getestet (2 Wahlen, 3 min Pause, Testphase 30/60 s) |
| Premium-Woche | `monetization.ts` | `market` | Festwoche | **5** Stufen | getestet (5, frei + Plus, Wochenwechsel) |
| Zeitsprung | `monetization.ts` | `market` | Kurze Stunde, Lange Wache | **2**, Tageskontingent 6 h | getestet (2, 6 h) |
| Testgeld | `testWallet.ts` | engine-react `createTestWallet` | — | 7 Preise, 20 €/Monat | getestet (7 Preise, 20 €, Monatswechsel, E2E-Testkauf) |
| Clan | `ClanPanel`, `vereinMult` | `market` (circle) | Wächterzirkel | Boost ×1,1–×1,25 | getestet (×1,1 + 0,05 bis ×1,25) |
| Playtest-Log | `playtestCore.ts`, `playtestLog.ts` | engine-react `createPlaytestLog` | — | **40** Ereignistypen, 48 h roh, Minutenzähler | getestet (alle `playtestEvents` der Module + Kern + App, 48 h, Minutenzähler, Tage, Export, E2E) |
| Ton-Effekte | `sound.ts` | engine-react `createSfx` | — | **8** | getestet (8 Rezepte, Ereignis-Zuordnung) |
| Ambiente | `ambience.ts` | engine-react `createAmbience` | Wind, Feuer, Wasser, Nacht | **3** (Ziel 4) | getestet (4 Schichten, Mischung nach Stimmung und Wetter) |
| Install-Gate, Testphase, Prefs, Overlays, Speicher-Sperre, Sicherungscode, Datei-Speichern | `installGate.ts`, `testPhase.ts`, `prefs.ts`, `overlays.ts`, `saveGuard.ts`, `backup.ts`, `saveFile.ts` | engine-react / ui-kit / engine | — | je 1 | im Spiel |

## Qualität

| Bereich | Referenz | Ziel | Stand |
|---|---|---|---|
| UI-Komponenten | 58 Dateien | ≥ 54 Komponenten | siehe `ROADMAP.md` |
| Testdateien | 53 | ≥ 53 | siehe `ROADMAP.md` |
| E2E | smoke de/en, art (43 Bilder), axe, screens | dto. je Spiel | siehe `ROADMAP.md` |
| Texte | ~3.100 je Sprache | ≥ 3.100 | siehe `ROADMAP.md` |
| Umfang | 52.534 Zeilen TS/TSX | ≥ 52.000 | siehe `ROADMAP.md` |
