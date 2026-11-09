# Ein neues Spiel anlegen

Am Beispiel `games/_vorlage`, dem kleinsten vollständigen Spiel.

1. **Ordner** `games/<slug>/` anlegen, mit `package.json` (`"name": "@game/<slug>"`, Skripte `dev`/`build`), `tsconfig.json` (Referenzen auf engine, engine-react, ui-kit), `vite.config.mjs` (`gameConfig()` aus `tools/vite/game-config.mjs`) und `index.html`.
2. **Titel:** nur in `src/brand.ts`. Dazu `src/distribution.ts` (`DISTRIBUTION`, `TEST_PHASE`).
3. **Spieldefinition** `src/game.ts`:
   ```ts
   export const game: GameDefinition = {
     id, saveKey, contentVersion: 1, contentMigrations: {},
     currencies, producers, prestigeLayers, metaShop, levelRewards,
     modules: standardModules(), balance: defaultBalance('<schicht-0-id>'), startPrimary: 15,
   }
   ```
   IDs sind stabil und kommen später in `ids.lock.json`. Inhalts-IDs dürfen dem Spielbegriff folgen (camelCase, ohne Umlaute).
4. **Texte** `src/i18n/de.ts` (`{ ...engineDe, ...gameDe }`, Typ `Strings`) und `src/i18n/en.ts` (`{ ...engineEn, … }: Strings`). Spieltexte nicht unter Schlüsseln der Engine-Texte ablegen (`common`, `nav`, `meta` …). Zum Beispiel `app` für Titel und Beschreibung.
5. **Laufzeit** `src/runtime.ts`: `createPrefs`, `createI18n`, `createRuntime`, dazu `labels` (UiLabels: Namen für Währungen, Erzeuger, Schichten, Meta-Gegenstände, Effekte).
6. **App** `src/App.tsx`: `<GameShell … play={…} hud={<Hud …/>} />`. Navigation, Prestige, Laden, Rückkehr-Korb, Sicherung, Einstellungen, Rechtliches, Install-Gate und Testphase kommen aus `@engine/ui`.
7. **Begriffe** `terms.txt`: die Spielwörter, damit sie nie in `packages/` landen.
8. **Tests** `test/`:
   - `guards.test.ts`: `describeSaveGuards({ def, fixturesDir, idLockFile })`
   - `i18n.test.ts`: `describeI18nGuards({ de, en, files, stale })`
   - `npm run ids:update -- <slug>` und `node tools/fixture-make.mjs <slug>` (erste Fixture)
9. **Einbinden:** Spiel in `tools/pages/assemble.mjs` (Pfad auf Pages), `tools/e2e/games.mjs` (E2E), Root-`tsconfig.json`/`tsconfig.tests.json` (Referenzen) und den Root-`build`-Skript eintragen.
10. **Balance:** `npm run balance -- <slug> engaged 2`. Mit `export const balanceTargets` in `game.ts` und `CHECK=1` prüft der Simulator die Zielkorridore.
