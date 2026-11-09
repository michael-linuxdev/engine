# Balance-Ziele

Werkzeug: `npm run balance -- lichtwarte <engaged|regular|casual> <stunden>` (Simulator gegen die echte Engine). Mit `CHECK=1` prüft er die Korridore aus `balanceTargets` in `src/game.ts`. Stellschrauben lassen sich per `BAL_<pfad>` überschreiben.

## Ziele (an der Referenz orientiert)

| Ziel | Profil | Korridor | Begründung | Stand (P5) |
|---|---|---|---|---|
| Bauwerk 2 (Holzlager) | engaged | 3–5 min aktiv | erster „Aha“-Moment in der ersten Sitzung | 3,3 min ✓ (CI) |
| Bauwerk 3 (Steinbruch) | engaged | 8–15 min aktiv | zweite Neuheit, bevor es eintönig wird | 10,0 min ✓ (CI) |
| Erste Mondwende | engaged | 15–20 min aktiv | Probe-Schwelle: Prestige in der ersten Sitzung erleben | 20,0 min ✓ (CI, am Rand) |
| Jede weitere Mondwende | engaged | ≥ 20 min aktiv | kein Zwei-Minuten-Kreislauf | ~60–80 min ✓ (ohne CI-Prüfung) |
| Lange Nacht | regular | Tag 9 ± 2 | lange Schleife | offen (P6/P10) |
| Alle 10 Bauwerke | regular | Tag 5 ± 1 | Inhaltstempo | offen (P6) |
| Keine Mauer | alle | Abstand zum nächsten Ziel ≤ 3× des vorigen | Motivation | offen (P6, Prüfung im Tempo-Test) |

## Stellschrauben

- **Leiter** (`LADDER` in `game.ts`): C0, g und r0 wie in der Referenz. Frühe Tore sind angepasst: Holzlager braucht 4.000 verdient oder Kräuterkate Stufe 25, Steinbruch 90.000 oder Holzlager Stufe 25.
- **Mondwende:** Schwelle 25 Mio. · 3,2^p (Knie 13, danach 1,12), Auszahlung 100 · 1,12^p. Die Probe-Schwelle liegt bei 1 Mio. und zahlt 70, ab Lauf 2 braucht es mindestens 3 aktive Bauwerke.
- **Lange Nacht und Zeitalter:** vorläufige Werte. P10 stimmt sie zusammen mit ihren Läden.
- **Offline:** 8 h voll, bis 24 h halb (Archiv: Sanduhr, Nachtkerze).
