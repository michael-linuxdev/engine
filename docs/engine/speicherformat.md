# Speicherformat

Implementierung: `packages/engine/src/save/envelope.ts` (ADR 0003).

```json
{
  "format": "engine-save",
  "engineVersion": 1,
  "game": "lichtwarte",
  "contentVersion": 1,
  "savedAt": 1800000000000,
  "core": { "primary": 0, "primaryRun": 0, "primaryLifetime": 0, "lastSeen": 0, "createdAt": 0, "rng": "2545f491" },
  "modules": { "producers": { "v": 1, "data": { "owned": { "kraeuterkate": 12 } } } }
}
```

- **`core`:** neutraler Kern. `primary` ist die Primär-Währung, `primaryRun` wird bei jedem Prestige auf 0 gesetzt, `rng` ist der Zustand des Zufallsgenerators.
- **`modules.<id>`:** ein Ausschnitt je Modul, mit eigener Version `v`. Feldnamen sind neutrales Englisch.
- **Laden:** `loadState(def, input, clock)` → `{ state, status, migrated }`. Werte für `status`:
  - `new`: nichts gespeichert;
  - `ok`: geladen;
  - `newer`: Stand aus einer neueren App, geladen, aber das Schreiben ist zu sperren;
  - `corrupt`: unlesbar. Neuer Zustand, die UI legt eine Kopie des Rohtexts ab;
  - `foreign`: anderes Spiel. Nie überschreiben.
- **Vorwärts-Toleranz:** Unbekannte Module, unbekannte Felder in bekannten Ausschnitten und unbekannte Hüllenfelder landen in `state.extras` und werden beim nächsten Speichern unverändert mitgeschrieben.
- **Speicher-Sperre (`createSaveGuard`):**
  - `pending`: kurz beim Start;
  - `otherTab`: ein anderes Fenster speichert;
  - `newer` und `foreign`: bleiben bestehen, bis die Seite neu geladen wird.
- **Sicherungscode:**
  - `encodeBackup(prefix, app, data, at)` erzeugt `PREFIX` + Base64 eines Bündels aller Speicherschlüssel des Spiels, mit FNV-1a-Prüfsumme.
  - `decodeBackup` lehnt manipulierte Codes ab (`checksum`), ebenso fremde Spiele (`app`) und neuere Bündel (`newer`).
  - Die Datei-Variante (Rohes JSON) wird ebenfalls akzeptiert.
- **Datei-Speichern:** `FileAdapter` (Engine-Schnittstelle). Die Browser-Umsetzung in `@engine/react` nutzt unter iOS zuerst das Teilen-Menü und gibt die Blob-URL erst nach 60 s frei.

## Wächter (`@engine/testing`, `describeSaveGuards`)

| Wächter | Prüft |
|---|---|
| Speicher-Abdeckung | Jeder Zahlen- und Ja/Nein-Wert jedes Ausschnitts (aus `sample`) überlebt Speichern → Laden, auch geändert. Ausnahmen nur über `transient`/`derived`. |
| Beispiel-Pflicht | Jedes Modul hat `sample`. |
| Vorwärts-Toleranz | Unbekanntes bleibt erhalten. |
| Neuerer Stand | `contentVersion`/`engineVersion` höher → `newer`. |
| Größe | Worst-Case-Stand < 100 KB. |
| Fuzz | 500 kaputte Stände: kein Absturz, Ergebnis stabil (zweimal laden = einmal laden). |
| Determinismus | Gleicher Seed und gleiche Eingaben → identischer Spielstand. |
| Fixtures | `test/fixtures/save-v*.json` laden mit den Werten aus `save-v*.expect.json`. |
| ID-Sperre | Keine ID aus `ids.lock.json` verschwindet, neue IDs sind eingetragen. |
