# Ton, Umgebungsklang, Playtest-Log, Markt

## Ton (`@engine/react`: `createSfx`, `connectSfx`)

- Effekte sind **Daten**: `SfxRecipe` ist eine Liste von Tönen (`tone`: Frequenz, Dauer, Lautstärke, Wellenform, Gleiten) und gefilterten Rauschstößen (`noise`).
- Es gibt keine Dateien. Alles ist WebAudio-Synthese.
- `connectSfx(rt, sfx, map)` spielt Effekte zu Engine-Ereignissen. Je Takt klingt jede Art nur einmal: „100 kaufen“ ist ein Klick.
- Die Geräte-Einstellung `sound` schaltet alles ab. Bei „Bewegung reduzieren“ vibriert nichts.
- `recipeProblems(r)` prüft ein Rezept in Tests: endlich, hörbar, ≤ 3 s, Frequenz 20–12 000 Hz.

## Umgebungsklang (`createAmbience`)

- Schichten (`AmbienceLayer`) bestehen aus einem Rausch-Bett (Filter, Pegel, langsames LFO) und gelegentlichen kleinen Klängen (`sporadic`).
- `mix()` des Spiels liefert je Schicht einen Pegel (0–1). Die Engine liest ihn alle 10 s neu, etwa nach Tageszeit, Jahreszeit und Wetter.
- Der Klang startet erst nach einer Geste (Browser-Regel) und nur mit `ambient` **und** `sound`.
- Ist die App verborgen, pausiert er.

## Playtest-Log (`createPlaytestLog`)

- **Opt-in**, nur lokal, nichts wird gesendet. In der Testphase setzt der Testphasen-Hinweis den Schalter. Abschalten geht in den Einstellungen.
- **Was aufgezeichnet wird:** Engine-Ereignisse, die ein Modul in `playtestEvents` nennt, die Kern-Ereignisse (`CORE_PLAYTEST_EVENTS`) und App-Ereignisse (`app.tab`, `app.language`, `app.ad`, `app.testPurchase`, `app.error`).
- **Aufbewahrung:**
  - Roh-Ereignisse bleiben 48 h (höchstens 3000).
  - Häufige Ereignisse (`highFrequency`) werden nur je Minute gezählt.
  - Je Kalendertag bleibt eine Zusammenfassung: Zähler, Sitzungen, Spielzeit, Schnappschuss.
  - Wird es zu groß, verlieren die ältesten Tage zuerst ihre Detail-Zähler.
- **Sitzung:** Eine neue beginnt erst nach 30 min Pause.
- **Export:** JSONL (Kopfzeile, Tage, Roh-Ereignisse) über das Teilen-Menü bzw. als Download.
- **Speicher:** eigene Schlüssel (`<spiel>-playtest-*`), **nie** im Spielstand. Bei Platzmangel wird zuerst der Roh-Rest halbiert.

## Markt (`marketModule`, `createTestWallet`, `MarketPanel`)

- **Modul:** Angebote, kosmetische Stile, Bonus-Video mit Pause, Wochen-Pass (frei und Plus), Zeitsprung mit Tagesgrenze, Tagesgeschenk, persönlicher Verstärker und Gruppen-Verstärker.
- **Kein Bezahl-Backend:** `buyOffer` gewährt einfach. Wer es aufruft, zahlt vorher: der Store oder das Testgeld.
- **Testgeld:** Monatsbudget in einem eigenen Schlüssel, nicht im Spielstand. Es wird nichts abgebucht. Gedacht für die Testphase, um echte Kaufentscheidungen zu messen.
