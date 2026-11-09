# Gartenerbe → Engine: Welche Datei gehört wohin?

Stand: 2026-11-09, Quelle: `michael-linuxdev/idlegame` @ `a187dc9` (nur gelesen).

**Legende**

| Kürzel | Bedeutung |
|---|---|
| **E** | **Engine.** Neutral, wird portiert. Namen werden neutralisiert (`ernte` → `primary`, `saisonenden` → `prestigeCount[0]` …), die Logik bleibt. |
| **E/D** | **Engine-Mechanik plus Spieldaten.** Der Mechanismus geht in die Engine. Die Liste darin (Gegenstände, Feste, Texte …) wird Spieldatei des jeweiligen Spiels. |
| **M** | **Muster.** Wird nicht als Code übernommen. Das Prinzip bzw. der Test wird für die Engine neu geschrieben. |
| **X** | **Fällt weg.** Garten-Inhalt, Garten-Grafik oder Garten-Text. Bekommt im Fantasy-Spiel einen eigenen, neuen Ersatz. |

Größenordnung: Etwa 17.000 der rund 52.000 Zeilen in `src/` sind E oder E/D. Etwa 35.000 Zeilen fallen weg; davon sind rund 30.000 Grafik und rund 7.000 Texte.

---

## 1. Spielkern `src/game/`

### 1.1 Wirtschaft und Fortschritt

| Datei | Zeilen | Ziel | Bemerkung |
|---|---:|---|---|
| `economy.ts` | 178 | **E** | Prestige-Schwelle `gate(p)`, Auszahlung √-gedeckelt, Offline-Abklingen. `BALANCE` wird zur Spielkonfiguration. Bei Garten-Bezügen (`isProbeYear`) die Namen neutralisieren. |
| `generators.ts` | 384 | **E/D** | `C(n)=C0·g^n`, `R(n)`, `UnlockGate` → Engine. Die 10 Module, Slots und Notizbuch-Zitate → Spieldaten. Die feste ID-Union (`GeneratorId`) wird zu `string`-IDs aus den Daten. |
| `progression.ts` | 133 | **E** | Spieler-Level und XP, `LEVEL_MODULE_GATES` als Konfiguration |
| `branches.ts` | 46 | **E** | Zweig-Ausbau je Erzeuger (Effizienz/Kapazität) |
| `truhe.ts` | 573 | **E/D** | Meta-Laden: Kosten, Freischaltung, Effekte → Engine (Effekt-Deskriptoren). Gegenstände (`gartenschere` …) → Spieldaten. |
| `longLoop.ts` | 123 | **E** | Prestige-Schicht 2 → in der Engine **generisch: N Prestige-Schichten** |
| `generations.ts` | 84 | **E** | Prestige-Schicht 3 → dasselbe N-Schichten-Modell |
| `surpriseJumps.ts` | 119 | **E** | Ratenskalierte Überraschungs-Sprünge, Drossel |
| `bestBuy.ts` | 110 | **E** | Hinweis „bester nächster Kauf“ |
| `nextGoal.ts` | 238 | **E** | Ziel-Auswahl (Freischalten/Level/Prestige/Ausbau) |
| `featureUnlocks.ts` | 150 | **E/D** | Systeme nach und nach freischalten: Mechanik in die Engine, Liste ins Spiel |
| `format.ts` | 104 | **E** | Kompakte Zahlen je Sprache. Die Locale wird injiziert, nicht importiert. |

### 1.2 Spielstand und Sicherheit

| Datei | Zeilen | Ziel | Bemerkung |
|---|---:|---|---|
| `storage.ts` | 409 | **E** | `SAVE_VERSION`/`MIGRATIONS`/`migrateSave`. Neu mit **zwei Ketten** (Engine-Format und Spiel-Format) und einem Hüllenformat. `parseGameState` wird aus Modul-Parsern zusammengesetzt. |
| `saveFields.ts` | 322 | **E** | Feld-Parser (`parseNum`, `parseOwned` …). `parseExpansion` wird modulweise aufgeteilt. |
| `saveGuard.ts` | 71 | **E** | Sperre gegen Überschreiben (neuerer Stand, anderer Tab) |
| `backup.ts` | 107 | **E** | Sicherungscode Export/Import (`BUNDLE_VERSION`) |
| `saveFile.ts` | 78 | **E** | Datei speichern, auch in der installierten iOS-App |
| `state.ts` | 162 | **M** | Öffentliche Fassade → `packages/engine/src/index.ts` |
| `state/types.ts` | 406 | **M** | `GameState` wird **nicht** portiert: Die Engine baut den Zustand aus Modul-Ausschnitten (`EngineState` + `modules.<id>`). |
| `state/create.ts` | 197 | **E** | Startzustand und Zustand nach dem Prestige → je Modul `init()` + `onPrestige(layer)` |
| `state/tick.ts` | 68 | **E** | Takt, Prestige-Schwelle |
| `state/offline.ts` | 104 | **E** | Offline-Ertrag mit Soft/Hard-Deckel |
| `state/core.ts` | 246 | **E** | Stufe, Multiplikatoren, Rate/s → **eine** Multiplikator-Pipeline mit Aufschlüsselung |
| `state/buy.ts` | 238 | **E** | Ausbauen, Zweige, Aufgaben und Erfolge gutschreiben |
| `state/garden.ts` | 169 | **E** | Käufe planen, Mehrfach-/Max-Kauf, Helfer-Automatik (Garten-Namen raus) |
| `state/prestige.ts` | 102 | **E** | Prestige je Schicht, Meta-Laden |
| `state/rewards.ts` | 147 | **E** | Burst-Tap („Gießen“), Glücksrad, Multiplikator-Aufschlüsselung |
| `state/market.ts` | 387 | **E** | Markt, Tagesrunde, Wochenend-Event, Werbung, Premium-Woche, Burst-Aufladung |
| `state/events.ts` | 119 | **E** | Wochenend-Event-Fortschritt, Blitz-Fenster, Prestige-Hinweise |
| `state/chapters.ts` | 263 | **E/D** | Regionen mit eigener Unterwirtschaft → Engine-Modul `regions`. Figuren (Oma Ilse, Weinlese) → Spiel. |
| `state/fest.ts` | 64 | **E** | Feste und Festmarken (Mechanik) |
| `state/generation.ts` | 57 | **E** | Geht in das N-Schichten-Prestige auf |
| `state/life.ts` | 260 | **E/D** | Helfer, Wetter, Album, Projekte, Kreuzen, Bewohner, Deko: Die Mechaniken werden einzelne Engine-Module. |
| `state/extras.ts` | 124 | **E/D** | Belohnungen gutschreiben → Engine. Rezept/Himmel/Kürbis → Spiel. |

### 1.3 Bindungs- und Inhaltssysteme

| Datei | Zeilen | Ziel | Bemerkung |
|---|---:|---|---|
| `dailyOps.ts` | 186 | **E** | Tägliche Belohnung mit Serie (Einfrieren statt Verfall) |
| `quests.ts` | 174 | **E/D** | 2–3 rotierende Tagesziele; Vorlagen kommen aus dem Spiel |
| `achievements.ts` | 163 | **E/D** | Mechanik in die Engine, Liste ins Spiel |
| `challenges.ts` | 48 | **E/D** | Freiwillige Runs mit Einschränkung |
| `events.ts` | 84 | **E** | Wochenend-Fenster nach lokaler Uhr |
| `flashEvent.ts` | 138 | **E** | Kurze Blitz-Events mit fairer Frist |
| `fests.ts` | 162 | **E/D** | Kalender-Feste: Mechanik in die Engine, Fest-Liste ins Spiel |
| `seasonCards.ts` | 129 | **E/D** | Karte nach dem Prestige wählen |
| `weatherEvents.ts` | 59 | **E/D** | Entscheidungs-Ereignisse („Wetter fragt“) |
| `album.ts` | 105 | **E/D** | 12 Ziele je realer Jahreszeit |
| `collections.ts` | 68 | **E/D** | Sammel-Übersicht |
| `crossing.ts` | 88 | **E/D** | Zwei Funde kombinieren mit Echtzeit-Wartezeit |
| `residents.ts` | 118 | **E/D** | Besucher kommen bei erfüllten Bedingungen |
| `decor.ts` | 98 | **E/D** | Deko frei platzieren (Slots) |
| `projects.ts` | 71 | **E/D** | Großprojekte über Regionen hinweg, in Stufen |
| `chapters.ts` | 418 | **E/D** | `parseChapters` (füllt fehlende Regionen) → Engine. Kapitel-Daten → Spiel. |
| `chapterPlan.ts` | 84 | **X** | Garten-Kapitel 13–50 |
| `notebook.ts` | 177 | **E/D** | Erzähl-Briefe nach Fortschritt: Mechanik in die Engine, Briefe ins Spiel |
| `hints.ts` | 98 | **E/D** | Einmalige Erklärungen |
| `ftue.ts` | 155 | **E/D** | Geführte erste 10 Minuten: Ablauf in die Engine, Schritte ins Spiel |
| `extrasCore.ts` | 166 | **E/D** | Truhen-Belohnung und Wettbewerb → Engine. Rezept/Himmel → Spiel. |
| `extras.ts` | 138 | **E/D** | Extras außerhalb des Spielstands |
| `gardenLife.ts` | 182 | **E/D** | Rad-Buffs → Engine; Garten-Namen raus |

### 1.4 Plattform, Auslieferung, Monetarisierung, Test

| Datei | Zeilen | Ziel | Bemerkung |
|---|---:|---|---|
| `distribution.ts` | 38 | **E** | `DISTRIBUTION` und `TEST_PHASE` je Spiel konfigurierbar |
| `installGate.ts` | 98 | **E** | Vollbild-Hinweis „zuerst installieren“ (Herkunftsdomain nicht übernehmen) |
| `installPrompt.ts` | 67 | **E** | PWA-Installationsanstoß |
| `appUpdate.ts` | 45 | **E** | „Nach Updates suchen“ |
| `testPhase.ts` | 58 | **E** | Hinweis zur Aufzeichnung beim ersten Start |
| `testWallet.ts` | 101 | **E** | Testgeld mit echten Preisen |
| `monetization.ts` | 467 | **E/D** | Attrappen, Werbe-Sperre 30/60 s, Zeitsprung, Kosmetik → Engine. Pakete und Stile → Spiel. |
| `playtestCore.ts` | 358 | **E** | Log über Monate: 48 h roh, Minutenzähler, Tagesübersicht. `LOG_NAMES`-Altnamen raus. |
| `playtestLog.ts` | 283 | **E** | Opt-in, nur lokal |
| `prefs.ts` | 114 | **E** | Geräte-Einstellungen (nicht im Spielstand) |
| `overlays.ts` | 127 | **E** | Offenes Fenster erkennen, Escape/Zurück schließt das oberste |
| `idle.ts` | 46 | **E** | Ruhemodus |
| `notify.ts` | 90 | **E** | Benachrichtigungen an einer Stelle |
| `sound.ts` | 190 | **E/D** | WebAudio-Synthese → Engine; Klang-Presets (Garten) → Spiel |
| `ambience.ts` | 128 | **E/D** | Synthetisches Ambiente; Naturgeräusche → Spiel |

### 1.5 React-Anbindung

| Datei | Zeilen | Ziel | Bemerkung |
|---|---:|---|---|
| `hooks/useGameLoop.ts` | 196 | **E** | Laden, Offline-Gutschrift beim Start, Takt, Speichern → `engine-react` |
| `useGame.ts` | 463 | **M** | Fassade je Spiel, aus Engine-Hooks zusammengesetzt |
| `hooks/useGardenActions.ts` | 401 | **M** | Aktionen werden pro Engine-Modul als Hook erzeugt |
| `hooks/useShopActions.ts` | 283 | **M** | dto. |
| `hooks/useChapterActions.ts` | 100 | **M** | dto. |

---

## 2. Oberfläche `src/components/` (58 Dateien)

| Ziel | Dateien |
|---|---|
| **E** → `ui-kit` (neutral, Texte über Engine-i18n) | `ErrorBoundary`, `InstallGate`, `InstallPrompt`, `TestPhaseNotice`, `PlaytestLogControls`, `TestPurchaseDialog`, `AdOverlay`, `SaveSheet`, `SaveGuardBanner`, `LegalSheet`, `MuteToggle`, `AppNav`, `lazy`, `FloatPops`, `SpeechBubble`, `FtueCoach`, `hud/BottomBar`, `hud/EventPills`, `hud/GoalStrip`, `hud/MultSheet`, `hud/WelcomeBack`, `map/hudGoal`, `map/usePrestigeCta` |
| **E/D** → `ui-kit` mit Slots für Spiel-Grafik | `UpgradeSheet`, `ShopPanel`, `PrestigePanel`, `prestige/DeepWinterBlock` + `prestige/GenerationBlock` (→ ein `PrestigeLayerBlock`), `ProgressSheet`, `CollectionSheet`, `AlbumSheet`, `ProjectSheet`, `CrossSheet`, `DecorSheet`, `SeasonCardPicker`, `WeatherDecision`, `FestSheet`, `ClanPanel`, `story/NotebookSheet`, `story/ComebackLetter`, `story/SeasonCeremony`, `map/MapHud` |
| **X** (Garten-Szene) | `GardenMap`, `map/GardenPlot`, `GardenCritters`, `GardenExtras`, `Residents`, `Visitors`, `HelperWalker`, `PlotFx`, `PlotPicker`, `WeatherLayer`, `DecorLayer`, `HarvestFlight`, `ChapterMap`, `ChapterCritters`, `chapterCopy`, `OmaHint` |

Aus den X-Dateien bleiben **Muster** erhalten: Karte mit Slots, Prozent-Positionen, Ernteflug-Animation und Besucher-Läufer. Das Fantasy-Spiel baut dafür eigene Szene-Komponenten.

---

## 3. Grafik und Styles `src/theme/`

| Ziel | Dateien |
|---|---|
| **E** → `art-kit` | `art/parts/style.ts` (Strichstärken, Maßtabelle als Muster; Werte je Spiel), `art/parts/grid.ts`, `art/parts/seeded.ts`, `art/parts/Place.tsx`, `art/parts/ArtDefs.tsx`, `art/parts/season.ts`, `art/parts/index.ts`, `svgId.ts`, `tiers.ts`, `ArtSvg.tsx` |
| **E/D** (Mechanik neutral, Werte je Spiel) | `art/palette.ts` + `art/hex-allow.json` (Paletten-Wächter), `art/mood.ts` + `ambient.ts` (Tag/Abend/Nacht × Jahreszeit), `art/registry.tsx` (Grafik-Register), `icons.tsx` (Mechanik; die Garten-Icons fallen weg), `fonts.ts`/`fonts.css`, `tokens.css` (Token-Vertrag bleibt, Werte neu), `legal.ts` |
| **E** → `ui-kit`-CSS | `ux/01-bausteine`, `ux/02-tabbar`, `ux/03-menue`, `ux/04-einstellungen`, `ux/05-breitbild`, `ux/06-einstellungen-wirkung`, `ux/07-panels`, `ux/08-installations-hinweis`, `ux/09-testphase`, `app/01-shell`, `app/03-fenster`, `app/06-knoepfe`, `app/08-navigation`, `app/09-installation`, `app/13-effekte`, `app/14-vollbild`, `ux.css`, `panels.css`, `hud.css`, `polish.css` |
| **E/D** (Aufbau bleibt, Optik neu) | `app/02-karte`, `app/04-ausbau`, `app/05-notizbuch`, `app/07-verein`, `app/10-markt`, `app/11-fortschritt`, `app/12-zweige`, `story.css` |
| **X** | `art/parts/plants.tsx`, `art/parts/animals.tsx`, `art/parts/buildings.tsx`, `art/parts/ground.tsx`, `art/garden/*` (11), `art/chapters/*` (49), `art/kapitel/*` (35), `art/chapterArt.ts`, `chapterArtSpecs.ts`, `careNames.ts`, `ChapterArt`, `ChapterPaths`, `DecorArt`, `FestDecor`, `HandArt`, `HandArtA`, `HandArtB`, `HandParts`, `MapBackdrop`, `ModuleArt`, `OrchardArt`, `OrchardBackdrop`, `PlotArt`, `ResidentArt`, `SeedPacket`, `VineyardArt`, `WinterScene`, `garden.css`, `expansion.css`, `expansion/*` (19 Dateien) |

---

## 4. Texte `src/i18n/`

| Ziel | Dateien |
|---|---|
| **E** → `engine-react/i18n` | `index.ts` (Proxy `t`, Live-Wechsel, Nachladen bei Bedarf), `types.ts` (Mechanik; der Typ `Strings` wird generisch: Engine-Texte + Spiel-Texte) |
| **E/D** | `de/count.ts`, `en/count.ts` (Plural/Zählformen), `de/legal.ts`, `en/legal.ts` (Gerüst; Inhalt je Spiel), `de/manifest.ts`, `en/manifest.ts` (PWA-Manifest-Texte) |
| **E/D** (die Engine-UI-Texte herauslösen, z. B. Einstellungen, Speichern, Installation, Testphase; der Rest fällt weg) | `de/strings.ts`, `en/strings.ts`, `de/stringsUx.ts`, `en/stringsUx.ts` |
| **X** | `stringsChapters*.ts`, `stringsExpansion.ts`, `stringsLife.ts`, `careNames.ts` (je de/en) |

---

## 5. Tests `src/test/` (53 Dateien)

| Ziel | Dateien |
|---|---|
| **E** → Engine-Tests (neutralisiert) | `format`, `storage`, `saveFields`, `saveGuard`, `saveCoverage`, `saveSize`, `migration`, `progression`, `branches`, `truhe`, `deep`, `dailyOps`, `quests`, `achievements`, `challenges`, `flashEvent`, `surpriseThrottle`, `offlineBasket`, `market`, `testWallet`, `testPhase`, `installGate`, `distribution`, `notify`, `playtestLog`, `featureUnlocks`, `hintsFtue`, `goals`, `erntefest` (→ Wochenend-Event), `seasonCards`, `weatherEvents`, `album`, `collections`, `crossing`, `residents`, `decor`, `projects`, `expansion` (→ Regionen), `helperAreas`, `helperPro`, `gardenLife`, `ux` |
| **M** → `packages/testing` (generische Wächter) | `i18n`, `i18nStatic` (kein `t` im Modul-Gültigkeitsbereich), `i18nStale`, `legacyNames` (→ **Namens-Wächter gegen Marken- und Altnamen**), `artPalette`, `art`, `artTiers` |
| **X** | `careNames`, `chapters` (Garten-Kapitelinhalt), `notebook` (Inhalt), `balance` (Werte; der Rahmen wird **M**) |
| Fixtures | `fixtures/save-v1.json` → **X** (Garten-Stand). Das Fantasy-Spiel bekommt eigene Fixtures ab v1. |

---

## 6. Werkzeuge, Build, CI, Doku

| Ziel | Dateien |
|---|---|
| **E** → `tools/` | `scripts/balance/sim.ts`, `simFlags.ts`, `run.sh`, `tempo.test.ts` (Simulator gegen die echte Engine mit virtueller Uhr, Spielerprofile engaged/regular/casual), `scripts/e2e/smoke.mjs`, `axe.mjs`, `screens.mjs` (abgeschnittene Texte), `art.mjs` (Pixelvergleich), `scripts/art/cpu.mjs`, `scripts/art/shots.mjs`, `scripts/art/render-icon.mjs`, `scripts/generate-pwa-icons.py`, `scripts/store/screenshots.cjs`, `scripts/store/feature-graphic.mjs` |
| **E** → Repo-Wurzel | `vite.config.ts` (PWA-Konfiguration), `tsconfig*.json`, `.oxlintrc.json`, `.github/workflows/ci.yml`, `.github/workflows/deploy-pages.yml`, `index.html` (Gerüst) |
| **X** | `scripts/e2e/art-baseline/*.png` (45 Garten-Bilder), `public/*` (Icons, `CNAME`), `docs/store/*` (Listing, Grafiken, Screenshots), `docs/kapitel/*`, `docs/playtest/*`, `docs/prompts/*`, `docs/plan-nacht.md`, `docs/cleanup/balance-*.txt`, `docs/cleanup/bundle-*.txt` |
| **M** | `CLAUDE.md` (Arbeitsregeln), `docs/cleanup/namen.md` (Namens-Wörterbuch), `docs/i18n/technik.md`, `docs/i18n/glossar.md`, `ROADMAP.md` (Aufbau), `README.md` (Aufbau), `src/dev/ArtSheet.tsx` + `IconScene.tsx` + `artsheet.css` (Grafik-Übersicht `?artsheet` → `art-kit`-Werkzeug) |

---

## 7. Lehren aus diesem Repo (fließen in den Prompt ein)

1. **Umbenennungs-Schmerz:** Das Repo hat zwei Themenwechsel hinter sich (TurmFarm/Orbit Rack/Ash Dominion → Garten). Dafür brauchte es ein Wörterbuch (`namen.md`) und einen Altnamen-Test. Die Engine speichert deshalb **nur neutrale englische Feldnamen**; Spielbegriffe gibt es nur in Texten und Inhalts-IDs.
2. **`GameState` als 400-Zeilen-Monolith** mit `parseExpansion`: Jedes neue System berührt fünf Dateien. Die Engine nutzt daher **Module mit eigenem Speicher-Ausschnitt**, eigenem Parser, eigener Reset-Regel je Prestige-Schicht und eigenen Migrationen.
3. **Prestige-Schichten** sind dreimal von Hand gebaut (Saisonende, Tiefer Winter, Generationen). In der Engine werden sie **eine generische Schicht-Liste**.
4. **Gute Wächter, die bleiben:** Speicher-Abdeckung, Migrations-Fixtures, Spielstand-Größe, kein `t` im Modul-Gültigkeitsbereich, Paletten-Allowlist, höchstens 1.500 SVG-Elemente, axe, abgeschnittene Texte, Balance-Simulator in der CI.
