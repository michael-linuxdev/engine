# Store-Vorbereitung

Stand P12. Was liegt bereit, was fehlt noch.

## Befehle

| Befehl | Ergebnis |
|---|---|
| `npm run store:icons` | Icons aus `public/icon-square.svg` → `public/icons/*.png`: PWA 192/512, maskable 512, Apple 180, App Store 1024, Play 512 |
| `npm run build && npm run store:shots` | Store-Screenshots, 6 Szenen je Sprache, iPhone 6,7″ (1290 × 2796) und Play (1080 × 1920) → `store-shots/` (nicht im Repo) |
| `npm run store:check` | Liste der offenen Blocker. Mit `-- --strict` endet sie mit Fehler, solange einer offen ist. |

## Bereit

- **Icons:** eigenes SVG (Warte mit Licht über dem Tal), daraus alle PNG-Größen. Manifest und `apple-touch-icon` verweisen darauf.
- **Store-Texte de/en:** `src/store/listing.ts`. Titel, Untertitel, Kurzbeschreibung, Beschreibung, Stichwörter, Neu und Datenschutz-Angabe. Die Längen prüft `test/store.test.ts`.
- **Datenschutz:**
  - Im Spiel unter „Rechtliches“ mit allen Punkten.
  - Als Seite `datenschutz.html` für die Store-Angabe, beim Build aus denselben Texten erzeugt. Auf GitHub Pages liegt sie unter `/datenschutz.html` neben dem Spiel.
- **Datenangaben im Store:** Es werden keine Daten erhoben oder geteilt. Alles bleibt auf dem Gerät.

## Offen (Blocker laut `npm run store:check`)

1. **Impressum:** Name, Anschrift und Kontakt in `src/legal.ts` (`IMPRINT`) eintragen. Danach erscheint es im Spiel und auf der Datenschutz-Seite.
2. **Eigennamen:** Alle stehen auf `ungeprüft`. Die Websuche ist gemacht, die Markenregister-Prüfung (DPMA, EUIPO, USPTO) fehlt. Erst danach auf `frei` setzen (`docs/marken/pruefung.md`).
3. **Store-Start:** `DISTRIBUTION = 'store'` und `TEST_PHASE = false` in `src/distribution.ts`. Der Test erzwingt das, sobald eine Store-Hülle (Capacitor/TWA) im Spielordner liegt.
4. **Echte Käufe:** `STORE_ENABLED` bleibt aus, bis In-App-Käufe angebunden sind. Bis dahin sind die Angebote Attrappen. In der Testphase zahlt man mit Testgeld.
