# 0003 — Hülle mit Modul-Ausschnitten, drei Migrationsketten

**Kontext.** Im Referenz-Spiel ist der `GameState` ein Monolith mit etwa 400 Zeilen Typ und `parseExpansion`. Jedes neue System berührte fünf Dateien. Gespeicherte Feldnamen trugen Spielbegriffe und mussten nach Themenwechseln umbenannt werden.

**Entscheidung.**

```json
{ "format": "engine-save", "engineVersion": 1, "game": "<slug>", "contentVersion": 1, "savedAt": 0,
  "core": { "primary": 0, "primaryRun": 0, "primaryLifetime": 0, "lastSeen": 0, "createdAt": 0, "rng": "…" },
  "modules": { "<id>": { "v": 1, "data": {} } } }
```

- **Felder:** Gespeicherte Feldnamen der Engine sind neutrales Englisch. Spielbegriffe gibt es nur in Texten und Inhalts-IDs.
- **Migrationen auf drei Ebenen:**
  - Hülle: `ENGINE_MIGRATIONS[v]`.
  - Spielinhalt: `def.contentMigrations[v]`, arbeitet auf der ganzen Hülle und darf zwischen Modulen umziehen.
  - Modul: `module.migrations[v]`.
- **Vorwärts-Toleranz:** Unbekannte Module, unbekannte Felder in bekannten Modulen und unbekannte Hüllenfelder werden geladen und unverändert zurückgeschrieben (`state.extras`).
- **Neuerer Stand:** Ein Stand aus einer neueren App (`isNewerSave`) wird geladen, das Schreiben ist aber gesperrt. Die UI zeigt dann ein Banner (`SaveGuard`).
- **Tolerante Parser:** `NaN`, negative Werte, falsche Typen und fehlende Felder ergeben den Startwert. `loadState` wirft nie.
- **Wächter** in `@engine/testing` laufen für jedes Spiel: Speicher-Abdeckung, Fixtures, Größe, Fuzz, Determinismus und ID-Sperre.

**Alternativen.**
- Flacher Zustand mit Präfixen: Bei neuen Systemen hätte er dieselben Konflikte wie die Referenz.
- IndexedDB: Für weniger als 100 KB unnötig komplex. localStorage reicht und ist synchron.

**Folgen.**
- Jedes Modul ist selbstständig: Zustand, Parser, Reset-Regel und Migrationen liegen in einer Datei.
- Ein Modul darf nie umbenannt werden. Seine ID ist der Speicher-Schlüssel und steht in `ids.lock.json`.
