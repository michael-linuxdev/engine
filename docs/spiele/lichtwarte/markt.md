# Markt (Attrappen)

Stand P11. Es gibt keine echten Käufe und keine Werbe-SDK. Alles läuft lokal.

## Grundsätze

- Fortschritt bleibt kostenlos. Lichtkiesel gibt es auch über Tagesrunde, Aufträge, Taten, Sternenrad, Feste und das Tagesgeschenk.
- Das Bonus-Video ist freiwillig. Die Belohnung steht vor dem Ansehen fest. Es gibt keine Energie-Mauern.
- `STORE_ENABLED = false` (`src/content/market.ts`): Echtgeld-Angebote verschenken nichts, solange es keinen Store gibt.

## Testphase: Testgeld

- Solange `TEST_PHASE` gilt und `STORE_ENABLED` aus ist, zahlt man Angebote mit **Testgeld**: 20 € je Kalendermonat.
- Es wird nichts abgebucht. Das Guthaben liegt in einem eigenen Schlüssel (`lichtwarte-testwallet-v1`), **nicht** im Spielstand.
- Das Bonus-Video dauert in der Testphase so lange wie ein echtes (zufällig 30 oder 60 s) und sperrt das Spiel währenddessen. Außerhalb der Testphase dauert es 2 s.

## Preise (Vorschlag)

| Angebot | Inhalt | Preis |
|---|---|---|
| Willkommenspaket | 200 Lichtkiesel + Stil Glutrot, einmal | 1,99 € |
| Ohne Werbung | Keine Bonus-Videos, einmal | 3,99 € |
| Beutel Lichtkiesel | 50 | 0,99 € |
| Kiste Lichtkiesel | 150 | 2,49 € |
| Fass Lichtkiesel | 500 | 6,99 € |
| Stil-Paket | Eisblau + Bernstein, einmal | 2,99 € |
| Festwoche Plus | Zweite Belohnungsreihe dieser Woche | 1,99 € |

## Lichtkiesel-Senken

| Was | Kosten | Wirkung |
|---|---|---|
| Talstil Glutrot / Eisblau / Bernstein | 80 / 120 / 200 | Nur Aussehen der Karte |
| Fest-Stile (4) | je 150 | Nur während ihres Festes zu kaufen |
| Kurze Stunde / Lange Wache | 40 / 120 | 1 h / 4 h Ertrag, höchstens 6 h am Tag |
| Leuchtöl | 45 | Ertrag ×1,15 für 30 min |
| Wächterzirkel | 60 | ×1,1, je weitere Runde +0,05 bis ×1,25, je 1 h |

## Festwoche

- Wöchentlicher Pass mit 5 Stufen (0/25/50/75/100 Punkte).
- Punkte: Tagesrunde +25, Bonus-Video +10.
- Freie Reihe: 5 Lichtkiesel, 90 s Ertrag, 10 Lichtkiesel, 180 s Ertrag, 15 Lichtkiesel.
- Plus-Reihe: 20 Lichtkiesel, 300 s Ertrag, 40 Lichtkiesel, 600 s Ertrag, 60 Lichtkiesel.
- Neue Woche: Punkte, Abholungen und Plus werden zurückgesetzt.
