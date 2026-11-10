# Idle-Engine + Spiele — Arbeitsregeln

Kurz und verbindlich. Hintergrund: `docs/adr/`, Engine-Handbuch: `docs/engine/`.

## Spielstände gehen nie verloren

**Stichtag:** `<NOCH NICHT GESETZT>` (trägt Michael ein, sobald der erste echte Tester spielt). Bis dahin darf das Format frei geändert werden. Die Mechanik und die Tests gelten aber schon jetzt.

- Gespeicherte Felder **nie still umbenennen oder entfernen**. Neue Felder bekommen im Parser des Moduls einen Startwert (`parse` ist tolerant).
- **Inkompatible Änderung:** Version erhöhen und einen Migrationsschritt ergänzen, auf der richtigen Ebene:
  - Hülle: `ENGINE_VERSION`/`ENGINE_MIGRATIONS`;
  - Spielinhalt: `contentVersion`/`contentMigrations`;
  - Modul: `version`/`migrations`.
  - Dazu einen echten Stand als `games/<spiel>/test/fixtures/save-v<N>.json` und die Erwartung als `save-v<N>.expect.json` ablegen. Der Fixture-Läufer muss alle alten Fixtures verlustfrei laden.
- **IDs:** Modul-IDs, Währungen, Erzeuger, Schichten, Meta-Gegenstände, Regionen und Erfolge stehen in `games/<spiel>/ids.lock.json`. IDs werden nur angehängt, nie geändert oder entfernt (`npm run ids:update` ergänzt neue).
- **Regionen:** Neue Regionen nur anhängen, IDs nie ändern. Fehlende Regionen füllt der Parser automatisch.
- **Neuerer Stand:** Ein Stand aus einer neueren App wird geladen, aber nie überschrieben (`SaveGuard`).

## Engine und Spiel sind getrennt

- **Engine:** `packages/engine` kennt kein Thema: keine Spielwörter, keine sichtbaren Texte, kein React, kein DOM, kein `Date.now()`, kein `Math.random()`. Uhr und Zufall kommen über `ctx`.
- **Feldnamen:** Gespeicherte Engine-Feldnamen sind neutrales Englisch (`primary`, `meta`, `layers[0].count`). Spielbegriffe stehen nur in Texten und in Inhalts-IDs im Spielordner.
- **Wächter:** `packages/*` importiert nie aus `games/`. Begriffe aus `games/*/terms.txt` kommen in `packages/` nicht vor (`tests/architecture.test.ts`, `tests/names.test.ts`).
- **Kommentare:** In der Engine auf Englisch, im Spiel und in der Doku auf Deutsch. Bezeichner immer Englisch, außer Inhalts-IDs im Spielordner (camelCase, ohne Umlaute).

## Zwei Sprachen (Deutsch + Englisch)

- Jeder sichtbare Text steht auf Deutsch und Englisch, beide mit demselben Typ (sonst bricht `tsc`).
  - Engine-UI-Texte: `packages/ui-kit/src/i18n/`.
  - Spieltexte: `games/<spiel>/src/i18n/`.
  - Begriffe: `docs/spiele/<spiel>/glossar.md`.
- Texte nie beim Import aus `t` kopieren (Getter oder Funktion). Der Sprachwechsel läuft live.
- Zahlen über `formatNumber`/`formatInt` der Engine, nie über `toLocaleString`.
- Die Sprache wird nicht im Spielstand gespeichert (Prefs).

## Marken und Namen

- **Keine bestehenden Markennamen**, nirgends: Spiele, Bücher, Filme, Marken und eigene frühere Projekte (`docs/marken/denylist.txt`, Namens-Wächter in `tests/names.test.ts`).
- **Eigennamen:** Jeder Eigenname steht in `games/<spiel>/src/content/names.ts` und hat eine Zeile in `docs/marken/pruefung.md`. Vor jedem neuen Namen eine kurze Websuche machen. Bei Treffer einen anderen Namen wählen.
- **Titel:** Der Spieltitel steht nur in `games/<spiel>/src/brand.ts`.
- **Assets:** Keine Fremd-Assets. Grafik ist SVG im Code, Ton ist WebAudio-Synthese. Schriften nur unter OFL, eingetragen in `docs/lizenzen.md`.

## Web-Fassung vs. Store-Fassung

- `games/<spiel>/src/distribution.ts`: `DISTRIBUTION: 'web' | 'store'`, `TEST_PHASE`.
- Ein Handy oder Tablet im Browser zeigt „Zuerst die App installieren“ mit der Schritt-Anleitung für den erkannten Browser. „Im Browser weiter“ gilt 6 Stunden. Die installierte App zeigt in der Testphase beim ersten Start den Hinweis zur Aufzeichnung.
- In der Testphase ist das Playtest-Log standardmäßig an (`defaultOn`), abschaltbar in den Einstellungen.
- **Vor dem Store-Start:** `'store'` und `TEST_PHASE = false` setzen. Der Test schlägt fehl, sobald eine Store-Hülle im Spielordner liegt und das noch nicht gesetzt ist. Der Store-Start ist außerdem gesperrt, solange ein Eigenname `ungeprüft` ist.

## Checks

- Vor jedem Commit: `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`.
- Vor dem Merge zusätzlich: `npm run e2e` und ein kurzer Balance-Durchlauf (`npm run balance -- lichtwarte engaged 2`).
- Tests nie überspringen, deaktivieren oder abschwächen. Kein `any` ohne begründenden Kommentar, kein `@ts-ignore`.
- Commit-Nachrichten auf Deutsch: was und warum.
