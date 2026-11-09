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

## Stellschrauben

- **Leiter** (`LADDER` in `game.ts`): C0, g und r0 wie in der Referenz. Frühe Tore sind angepasst: Holzlager braucht 4.000 verdient oder Kräuterkate Stufe 25, Steinbruch 90.000 oder Holzlager Stufe 25.
- **Mondwende:** Schwelle 10 Mio. · 3,2^p (Knie 13, danach 1,12), Auszahlung 100 · 1,12^p. Die Probe-Schwelle liegt bei 1 Mio. und zahlt 70, ab Lauf 2 braucht es mindestens 3 aktive Bauwerke. P6 hat die Grundschwelle von 25 Mio. gesenkt: Der Sprung von der Probe zur 2. Mondwende war eine Mauer.
- **Mondwende-Tore der Bauwerke 5–10:** 1/2/3/5/8/12 abgeschlossene Mondwenden (P6, vorher 1/2/4/6/9/13).
- **Lange Nacht:** Schwelle 6 · 10¹⁴ seit der letzten Langen Nacht, mindestens 12 Mondwenden seit der letzten, 3 Tage Ruhe.
- **Zeitalter:** Schwelle 5 · 10¹⁶, mindestens 3 Lange Nächte seit dem letzten Zeitalter.
- **Wächterrang:** XP aus Ausbau (8 je Stufe), Prestige (150 × Schicht) und Rückkehr-Korb (√ Betrag × 0,85, höchstens 80). Die beiden letzten Quellen kamen mit P6 hinzu, weil die Ränge ab Rang 20 zu langsam kamen.
- **Offline:** 8 h voll, bis 24 h halb (Archiv: Sanduhr, Nachtkerze).
