# Balance-Ziele

Werkzeug: `npm run balance -- lichtwarte <engaged|regular|casual> <stunden>` (Simulator gegen die echte Engine). Mit `CHECK=1` prüft er die Korridore aus `balanceTargets` in `src/game.ts`. Stellschrauben lassen sich per `BAL_<pfad>` überschreiben.

## Ziele (an der Referenz orientiert, alle in der CI: `tools/balance/tempo.test.ts`)

| Ziel | Profil | Korridor | Begründung | Stand (P6) |
|---|---|---|---|---|
| Bauwerk 2 (Holzlager) | engaged | 3–5 min aktiv | erster „Aha“-Moment in der ersten Sitzung | 3,3 min ✓ |
| Bauwerk 3 (Steinbruch) | engaged | 8–15 min aktiv | zweite Neuheit, bevor es eintönig wird | 10,0 min ✓ |
| Erste Mondwende | engaged | 15–20 min aktiv | Probe-Schwelle: Prestige in der ersten Sitzung erleben | 20,0 min ✓ |
| Zweite Mondwende | engaged | ≥ 20 min nach der ersten | kein Zwei-Minuten-Kreislauf | +58 min ✓ |
| Alle 10 Bauwerke | regular | Tag 5 ± 1 | Inhaltstempo | Tag 4,5 ✓ |
| Lange Nacht | regular | Tag 9 ± 2 | lange Schleife | Tag 10,4 ✓ |
| Keine Mauer | engaged 72 h, regular 12 Tage | Zeit bis zum nächsten **neuen** Ziel ≤ 3 × Tempo | Motivation | ✓ |
| Fortschritt bei kurzen Besuchen | casual 21 Tage | erste Mondwende am ersten Tag, alle Bauwerke | Gelegenheitsspieler | Tag 1 / Tag 9 ✓ |

**Neue Ziele:** Freischaltung eines Bauwerks, erster Lauf jeder Prestige-Schicht, jeder Wächterrang-Aufstieg (bringt Belohnungen, steht im HUD). Wiederholte Mondwenden sind der Kreislauf, kein neues Ziel.

**Tempo:** die größte der letzten drei Lücken (mindestens 10 min). Ziele kommen in Schüben; ein Schub ist keine Mauer, eine Lücke über dem Dreifachen des Tempos schon.

| Erstes Zeitalter | regular 35 Tage | Tag 28 ± 7 | lange Schleife | Tag 28,4 ✓ |
| Ruhezeit der Langen Nacht | regular 35 Tage | ≥ 3 Tage zwischen zwei Langen Nächten | Referenz | ✓ |
| Lande öffnen sich nach und nach | regular | Land 3 mindestens 12 h nach Land 2, mindestens 3 Lande in 21 Tagen | Taktung der Lande | ✓ (`realms.test.ts`) |

## Späte Taktung (Tag 35 bis Tag 90, Profil regular)

Messung: `SUMMARY=1 npm run balance -- lichtwarte regular 2160` (90 Tage, etwa 50 s). In der CI: `tools/balance/late.test.ts`, Korridore in `balanceTargets.regularLate` und `lateTargets` (`src/game.ts`).

**Durststrecke:** mehr als 4 Tage ohne neues Ziel. Als neues Ziel zählen hier ein neues Land, der erste Lauf einer Schicht und jedes weitere Zeitalter. „Land n“ zählt die Talkarte als Land 1 mit. Offene Lande gelten am Ende des Tages.

| Ziel | Korridor | Begründung | Vorher (P13) | Stand |
|---|---|---|---|---|
| Zweites Zeitalter | Tag 47 ± 8 | deutlich vor Tag 60 | Tag 71,1 ✗ | Tag 47,2 ✓ |
| Drittes Zeitalter | Tag 80 ± 10 | ein Zeitalter je vier bis fünf Wochen | nicht bis Tag 90 ✗ | Tag 80,0 ✓ |
| Offene Lande an Tag 60 | 22–27 von 34 | alle zwei bis drei Tage ein Land, aber nicht alles auf einmal | 17 ✗ | 24 ✓ |
| Offene Lande an Tag 90 | ≥ 30 von 34 | Inhalt reicht bis Tag 90 und wird auch erreicht | 19 ✗ | 34 ✓ |
| Letztes Land | nicht vor Tag 75 | danach fehlen Ziele, bis die Lande 35–50 da sind | — | Tag 90,0 ✓ |
| Längstes Loch nach Tag 35 | ≤ 4 Tage | Motivation | 10,7 Tage (Tag 59,6 → 70,3) ✗ | 3,5 Tage (Tag 83,5 → 87,0) ✓ |
| Abstand der Lande, Tag 35–90 | im Schnitt 2–3,2 Tage | Taktung der Lande | 11 Tage | 2,75 Tage ✓ |

Tag, an dem sich ein Land öffnet (bis Land 14 unverändert):

| Land | 2 | 5 | 10 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 25 | 30 | 34 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Vorher | 8,0 | 11,3 | 20,4 | 29,1 | 33,3 | 40,6 | 50,0 | 59,6 | 70,3 | 81,6 | — | — | — | — |
| Jetzt | 8,0 | 11,3 | 20,4 | 29,1 | 33,3 | 36,0 | 38,0 | 40,6 | 43,3 | 46,0 | 49,0 | 63,4 | 77,6 | 90,0 |

- Die frühe Taktung ist unberührt: Das Ereignisprotokoll des Simulators ist bis Tag 35 Zeile für Zeile gleich.
- Die Abstände der Lande rasten im Simulator auf ganze Tage ein (das Land öffnet sich meist in der ersten Sitzung am Morgen). Deshalb springt die Taktung zwischen zwei und drei Tagen und wächst nicht stetig.
- Offen: Land 13 → 14 dauert 4,2 Tage (Tag 29,1 → 33,3). Das liegt vor Tag 35 und bleibt deshalb unverändert; das erste Zeitalter (Tag 28,4) fällt in dieselbe Zeit.
- Offen: Ab Tag 90 gibt es bei regular kein neues Land mehr. Die Lande 35–50 müssen bis dahin folgen.
- Nur `regular` ist bis Tag 90 gemessen, `engaged` und `casual` nicht.

## Stellschrauben

- **Leiter** (`LADDER` in `game.ts`): C0, g und r0 wie in der Referenz. Frühe Tore sind angepasst: Holzlager braucht 4.000 verdient oder Kräuterkate Stufe 25, Steinbruch 90.000 oder Holzlager Stufe 25.
- **Mondwende:** Schwelle 10 Mio. · 3,2^p (Knie 13, danach 1,12), Auszahlung 100 · 1,12^p. Die Probe-Schwelle liegt bei 1 Mio. und zahlt 70, ab Lauf 2 braucht es mindestens 3 aktive Bauwerke. P6 hat die Grundschwelle von 25 Mio. gesenkt: Der Sprung von der Probe zur 2. Mondwende war eine Mauer.
- **Mondwende-Tore der Bauwerke 5–10:** 1/2/3/5/8/12 abgeschlossene Mondwenden (P6, vorher 1/2/4/6/9/13).
- **Lange Nacht:** Schwelle 6 · 10¹⁴ seit der letzten Langen Nacht, mindestens 12 Mondwenden seit der letzten, 3 Tage Ruhe.
- **Zeitalter:** Schwelle 5 · 10¹⁶ · 3^p, mindestens 3 Lange Nächte seit dem letzten Zeitalter. Das Wachstum lag bis P13 bei 10; damit kam das zweite Zeitalter erst an Tag 71.
- **Lande** (`REALM_TUNING` in `src/content/realms.ts`): Kosten × 1,15 je Land. Ab Land 14 (`lateFrom: 12`) steigt auch der Ertrag: × 1,75 (`lateYield`) und × 1,145 je weiterem Land (`lateYieldGrowth`). Ohne das lagen ab Land 15 sieben bis elf Tage zwischen zwei Landen. Die Lande 2–13 sind unverändert.
- **Wächterrang:** XP aus Ausbau (8 je Stufe), Prestige (150 × Schicht) und Rückkehr-Korb (√ Betrag × 0,85, höchstens 80). Die beiden letzten Quellen kamen mit P6 hinzu, weil die Ränge ab Rang 20 zu langsam kamen.
- **Offline:** 8 h voll, bis 24 h halb (Archiv: Sanduhr, Nachtkerze).
