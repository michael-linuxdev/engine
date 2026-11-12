# Balance-Ziele

Werkzeug: `npm run balance -- lichtwarte <engaged|regular|casual> <stunden>` (Simulator gegen die echte Engine). Mit `CHECK=1` prüft er die Korridore aus `balanceTargets` in `src/game.ts`. Stellschrauben lassen sich per `BAL_<pfad>` überschreiben.

## Ziele (an der Referenz orientiert, alle in der CI: `tools/balance/tempo.test.ts`)

| Ziel | Profil | Korridor | Begründung | Stand (P6) |
|---|---|---|---|---|
| Bauwerk 2 (Holzlager) | engaged | in den ersten 2 min | erster „Aha“-Moment sofort (wie die Vorlage) | 0,5 min ✓ |
| Bauwerk 3 (Steinbruch) | engaged | 1–5 min aktiv | zweite Neuheit | 2,3 min ✓ |
| Bauwerk 4 (Quellschrein) | engaged | 3–9 min aktiv | dritte Neuheit vor der ersten Mondwende | 5,0 min ✓ |
| Erste Mondwende | engaged | 15–20 min aktiv | Probe-Schwelle: Prestige in der ersten Sitzung erleben | 18,3 min ✓ |
| Zweite Mondwende | engaged | ≥ 20 min nach der ersten | kein Zwei-Minuten-Kreislauf | +72 min ✓ |
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

## Langzeit: Meisterschaft und Meilensteine

Ziel: Auch nach dem letzten Land und über Jahre gibt es Ziele, die man sieht und die langsam fallen. Beides wird aus dem Spielstand **berechnet**, nichts wird zusätzlich gespeichert. Alte Stände bekommen Sterne und Boni sofort.

### Meisterschaft der Lande (drei Sterne je Land, 102 insgesamt)

Es zählt der **schwächste** der zehn Bereiche eines Landes: Stern 1 bei Stufe 25, Stern 2 bei Stufe 50, Stern 3 bei Stufe 100 (`REALMS.mastery`). Je Stern +5 % Ertrag im eigenen Land und einmalig 5 Lichtkiesel. Vier Taten zählen die Sterne (1, 10, 34, 102).

Messung (regular, Simulator kauft reihum alles Bezahlbare):

| Stand | Schwächster Bereich im ältesten Land | Stärkster Bereich | Pflege „Wachstum“ |
|---|---|---|---|
| Tag 45 | Stufe 41 | Stufe 177 | Rang 10 von 10 |
| Tag 90 | Stufe 49 | Stufe 182 | Rang 10 von 10 |

- **Warum der schwächste Bereich:** Er wächst sehr langsam (8 Stufen in 45 Tagen im ältesten Land). Stern 2 fällt im ältesten Land um Tag 90, Stern 3 liegt weit dahinter. Geschätzt, nicht gemessen: bei gleichem Wachstum rund ein Jahr.
- **Warum nicht die Pflege:** Sie ist nach wenigen Tagen voll und taugt deshalb nicht als Langzeit-Ziel.
- Die Korridore der frühen und der späten Taktung halten mit der Meisterschaft unverändert (`tempo.test.ts`, `late.test.ts`).

### Meilensteine der Schichten (`milestones` je Schicht in `game.ts`)

| Schicht | Meilensteine bei … Läufen | Belohnung | Dauerhaft |
|---|---|---|---|
| Mondwende | 1.000, 2.500, 5.000, 10.000, 25.000 | 30–90 Lichtkiesel | je +1 % Ertrag |
| Lange Nacht | 15, 20, 30, 40, 50, 75, 100, 150 | 30–100 Lichtkiesel | je +1 % Ertrag |
| Zeitalter | 2–10, 12, 15, 20, 25, 30, 40, 50 | 25–100 Lichtkiesel | je +2 % Ertrag |

Die Schwellen von Mondwende und Langer Nacht liegen bewusst hinter dem gemessenen Zeitraum (regular an Tag 90: rund 730 Mondwenden, 13 Lange Nächte, 3 Zeitalter). Nur die Zeitalter-Meilensteine 2 und 3 fallen hinein; die Korridore halten.

**Nicht gemessen:** alles nach Tag 90, also wann die späteren Meilensteine und die dritten Sterne tatsächlich fallen.

## Funde am Wegrand

Seit dem **Abgleich mit der Vorlage (2026-11-12)** gelten Häufigkeit **und Beträge** der Vorlage:

| Fund | Wann | Betrag |
|---|---|---|
| Sicherer Fund | jede fünfte von Hand gebaute Stufe | 45 s Ertrag |
| Glücksfund | 7 % je Ausbau | 90 bis 210 s Ertrag |
| „Fast geschafft“ | bei 72 / 88 / 97 % der Mondwende-Schwelle, je einmal im Lauf | 25 s Ertrag |
| Glück bei der Rückkehr | 15 % Chance nach mindestens 30 min Abwesenheit | +35 % auf den eingesammelten Ertrag |

„Fast geschafft“ meldet sich nie gestapelt: Überspringt der Ertrag mehrere Marken auf einmal (Rückkehr nach einer Pause), gibt es einen Fund für die höchste; ist die Schwelle schon erreicht, gibt es keinen mehr (Testlog 2026-11-12: drei Meldungen auf einmal, als die Mondwende längst bereit war).

Höchstens ein Fund vom Ausbauen je 5 Sekunden. Deckel: 12 % des Ertrags dieses Laufs plus einer Minute; mindestens 8 s Ertrag.

**Vorher** waren die Beträge ein Fünftel davon (8 s und 20 bis 45 s), und die beiden unteren Funde gab es nicht. Die kleinen Beträge sollten die Korridore „alle Bauwerke um Tag 5“ halten; gemessen bleiben die Korridore auch mit den Beträgen der Vorlage eingehalten (alle Bauwerke an Tag 4,1, Lange Nacht an Tag 7,0), weil zugleich die Schwellen der Vorlage gelten (siehe unten).


## Abgleich mit der Vorlage (2026-11-12)

**Anlass:** Michael nach zwei eigenen Tests: Lichtwarte fühlt sich zäh an, die Vorlage „macht süchtig“. Eine erste Runde am selben Tag („Tempo-Runde“, PR #47: halbe Stufen bleiben nach der Mondwende, Funkenruf alle 45 s, Funken auf der Karte) ging in die falsche Richtung und ist zurückgenommen: In der Vorlage setzt die Mondwende alles zurück, und so soll es hier auch sein.

**Befund aus dem Code der Vorlage:** Die Schleifen (Schwellen, Leiter, Funkenruf) waren in Lichtwarte gleich oder sogar kürzer. Anders waren die Stellen, die eine Sitzung dicht und überraschend machen:

| Was | Vorlage | Lichtwarte vorher | Jetzt |
|---|---|---|---|
| Bauwerk 2 öffnet sich nach | 600 Ertrag oder Stufe 10 | 4.000 oder Stufe 25 | wie Vorlage |
| Bauwerk 3 öffnet sich nach | 50.000 oder Stufe 10 | 90.000 oder Stufe 25 | wie Vorlage |
| Sicherer Fund (jede 5. Stufe) | 45 s Ertrag | 8 s | wie Vorlage |
| Glücksfund (7 %) | 90 bis 210 s | 20 bis 45 s | wie Vorlage |
| „Fast geschafft“ vor der Mondwende | 3 Funde je Lauf | fehlte | wie Vorlage |
| Glück bei der Rückkehr | 15 % auf +35 % | fehlte | wie Vorlage |
| Probe-Schwelle / zweite Schwelle | 5 Mio. / 25 Mio. | 1 Mio. / 10 Mio. | wie Vorlage |
| Mondwenden-Tore der Bauwerke 7 bis 9 | 4 / 6 / 9 | 3 / 5 / 8 | bleibt 3 / 5 / 8 |

Die letzte Zeile bleibt bewusst anders: Mit den Toren der Vorlage liegt nach der dritten Mondwende eine Lücke von 92 Minuten ohne neues Ziel, und die Mauer-Prüfung schlägt an.

**Gemessen** (Simulator):

| | Vorher | Jetzt |
|---|---|---|
| Bauwerk 2 / 3 / 4 (engaged) | 3,7 / 10,0 / 11,7 min | 0,5 / 2,3 / 5,0 min |
| Käufe in den ersten 5 Minuten | 34 | 41 |
| Erste Mondwende | 18,5 min | 18,3 min |
| Zweite Mondwende | Minute 76 | Minute 90 |
| Alle 10 Bauwerke (regular) | Tag 4,1 | Tag 4,1 |
| Erste Lange Nacht (regular) | Tag 7,3 | Tag 7,0 |

Die ersten fünf Minuten sind deutlich dichter, die Tage danach unverändert. **Nicht gemessen** ist, ob es sich damit wie die Vorlage anfühlt: Der Simulator zählt Ereignisse, und die Vorlage selbst ließ sich in dieser Umgebung nur lesen, nicht ausführen. Was sich außerhalb der Zahlen unterscheidet (Töne, Bewegung, Texte), ist nicht verglichen.
