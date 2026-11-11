# Bedienung und Spielgefühl: Was Lichtwarte gegenüber der Referenz fehlt

Stand 2026-11-11. Grundlage: der Code des Referenz-Spiels (alle Fenster, Karte, Kopfzeile, Navigation, Markt, Besucher, Einstieg, Sichern) und seine Playtest-Befunde, verglichen mit Lichtwarte auf `main` plus PR #21. `paritaet.md` vergleicht die **Systeme**; diese Liste vergleicht das **sichtbare Verhalten**.

**Wirkung:** A = fällt jedem Spieler in der ersten Sitzung auf · B = fällt nach einigen Tagen auf · C = Feinschliff.
**Nicht im Detail verglichen:** Großwerke und Folio (nur überflogen), Tastenkürzel und Breitbild.

## Erledigt (PR #14 bis #21)

Ausbau-Karte (klein, hell, Ladebalken am Knopf, „Noch … fehlt“, Ertragsvorschau, Sterne, Halten baut weiter, kein ×10/Max) · Wisch nach unten schließt Fenster · Seite scrollt nicht · Markt ab Start · Talgast antippen statt Meldung, eigenes Bild je Art · Einstellungen in drei Gruppen ohne Zahlenformat · „Jetzt aktualisieren“ · Installationsanleitung je Browser · Hinweise als kleine Marke.

## 1. Navigation und Menü

| # | Referenz | Lichtwarte | Wirkung |
|---|---|---|---|
| 1.1 | Immer genau 4 Tabs. Neue Systeme kommen als Kachel ins Menü, mit „Neu“ bis zum ersten Öffnen. | Die Leiste wächst auf bis zu 8 Knöpfe (Archiv, Wacht, Tal, Lande kommen dazu). Kein „Neu“. | erledigt |
| 1.2 | Etwa ein neues System je Sitzung. | Nach der ersten Mondwende öffnen sechs Systeme auf einmal. | erledigt |
| 1.3 | Der Neubeginn-Tab enthält alles dazu: Fortschritt, Helfer, Meta-Laden, Herausforderungen, höhere Schichten, mit Sprungknöpfen und fester Leiste für den Knopf. | Neubeginn zeigt nur die Schichten. Archiv ist ein eigener Tab, Prüfungen stehen in der Wacht. | erledigt |
| 1.4 | Menü oben „Bald fertig“ (laufende Zeiten), dann Kacheln der Systeme, darunter ruhige Zeilen (Sichern, Rechtliches, Einstellungen). | Vier Kacheln: Chronik, Sichern, Einstellungen, Rechtliches. | erledigt |
| 1.5 | Tabs heißen in der Sprache des Spiels. | „Spiel“ und „Neubeginn“ sind Engine-Wörter. | erledigt |

## 2. Talkarte

| # | Referenz | Lichtwarte | Wirkung |
|---|---|---|---|
| 2.1 | Nur der **nächste** gesperrte Platz zeigt, was fehlt, mit Fortschrittsbalken. | Jeder gesperrte Platz zeigt nur ein Schloss. | erledigt |
| 2.2 | Eine Marke am besten Kauf; ein Pfeil nur dort. | Pfeil an jedem bezahlbaren Platz, keine Empfehlung. | erledigt |
| 2.3 | „Noch 3 bis ★“ am Platz kurz vor einem Meilenstein. | Fehlt. | erledigt |
| 2.4 | Partikel beim Freilegen, beim ersten Bau und bei jeder Wachstumsstufe; große Feier bei der höchsten. | Nur ein kurzes Aufwachsen. | erledigt |
| 2.5 | Ein Knopf „Heute“ unten links bündelt alles Tägliche und wird zum Einsammeln-Knopf, wenn Ertrag wartet. | Dafür gibt es nur den Wacht-Tab. | erledigt |
| 2.6 | Der Helfer geht mit Laufbildern den Weg ab und bleibt an den Bereichen stehen. | Der Lehrling steht und wippt; sein Platz wechselt je Minute. | erledigt |
| 2.7 | Ein Umschlag am Haus, wenn ein Brief wartet. | Nur ein Punkt am Chronik-Knopf. | erledigt |
| 2.8 | Besucher an einer von sechs zufälligen Stellen, mit Funkeln. | Immer derselbe Platz, kein Funkeln. | erledigt |

## 3. Kopfzeile

| # | Referenz | Lichtwarte | Wirkung |
|---|---|---|---|
| 3.1 | Die Ziel-Zeile ist ein Knopf: Sie öffnet das empfohlene Bauwerk oder den Neubeginn-Tab. | Nicht antippbar. | erledigt |
| 3.2 | Kachel mit Stufe und Erfahrungsbalken; Antippen öffnet die Fortschritts-Seite. Puls beim Aufstieg. | Der Wächterrang ist nirgends zu sehen. | erledigt |
| 3.3 | Nebenwährungen stehen klein in der Kopfzeile. | Nur Glimmer. | erledigt |
| 3.4 | Ereignis-Pillen mit Symbol und Restzeit, höchstens drei, Rest hinter „+N“; Antippen zeigt Details oder holt ab. | Pillen nur mit Namen, ohne Restzeit, ohne Obergrenze; jede springt in die Wacht. | erledigt |
| 3.5 | Eine Pille „Neubeginn: +X in 12 min“. | Fehlt. | erledigt |

## 4. Rückmeldung (das eigentliche Spielgefühl)

| # | Referenz | Lichtwarte | Wirkung |
|---|---|---|---|
| 4.1 | Eine gemeinsame Meldungs-Ebene und aufsteigende Zahlen für jede Belohnung: Kauf (−Kosten), Meilenstein „×2 erreicht“, Stufenaufstieg, Tagesrunde, Auftrag, Überraschung, Wetter-Ergebnis. | Eine aufsteigende Zahl gibt es nur beim Funkenruf, sonst nur Ton. | erledigt |
| 4.2 | Der Ertrag fliegt sichtbar zum Korb in der Kopfzeile (Tippen, Einsammeln). Der Korb blitzt bei großen Sprüngen. | Kein Flug, kein Blitzen. | erledigt |
| 4.3 | Überraschungen sind sichtbar und hörbar. | Überraschungen laufen, sind aber völlig stumm und unsichtbar. | erledigt |

## 5. Markt

| # | Referenz | Lichtwarte | Wirkung |
|---|---|---|---|
| 5.1 | Jeder Testkauf fragt nach: „Würdest du X für Y € kaufen?“ mit Testgeld-Stand. Vier Antworten gehen samt Spielstand ins Log. | Der erste Tipp bucht ab. Ins Log geht nur „gekauft“. Bei der Referenz hatte ein Tester ohne Rückfrage 20 € in zwei Minuten ausgegeben. | erledigt |
| 5.2 | Wer „Ohne Werbung“ hat, bekommt den Bonus sofort ohne Video. | Der Bonus verschwindet ganz: nur noch „Werbung ist abgeschaltet“. **Fehler.** | erledigt |
| 5.3 | Guthaben als feste Plakette oben; „Noch X“ unter jedem gesperrten Knopf. | Der Lichtkiesel-Stand steht nirgends; gesperrte Knöpfe sind ohne Grund grau. | erledigt |
| 5.4 | Vier Unterreiter (Gratis · Schübe · Stile · Echtgeld), der letzte bleibt gemerkt. | Eine lange Liste mit sieben Karten. | erledigt |
| 5.5 | Punkt am Markt-Tab, wenn Geschenk oder Bonus bereit ist. | Fehlt. | erledigt |
| 5.6 | Stil antippen zeigt ihn als Vorschau auf der Karte. | Nur ein kleines Farbfeld. | C |
| 5.7 | Bonus-Video lässt sich abbrechen (ohne Belohnung); das Log hält fest, ob durchgehalten wurde. | Kein Abbrechen. | erledigt |

## 6. Neubeginn und Zeremonie

| # | Referenz | Lichtwarte | Wirkung |
|---|---|---|---|
| 6.1 | Vor dem Knopf: Zeit bis zur Schwelle, „in 10 Minuten wären es Y“, Kästen „Bleibt“ und „Geht“. Der Knopf nennt den Lohn. | Balken, Lohn, ein allgemeiner Satz. Tester der Referenz öffneten den Tab 15-mal ohne Abschluss, bevor es die Vorschau gab. | erledigt |
| 6.2 | Punkt am Tab, wenn bereit oder im Meta-Laden etwas kaufbar ist. | Fehlt. | erledigt |
| 6.3 | Höhere Schichten erst nach zweitem Tippen. | Lange Nacht und Zeitalter starten beim ersten Tipp. | erledigt |
| 6.4 | Zeremonie in drei Phasen; die letzte nennt Lohn und „neu frei“, das Glücksrad läuft darin mit. Danach öffnet sich das empfohlene erste Bauwerk. | Szene, danach nacheinander drei Fenster (Chronik, Sternenrad, Sternbild). Kein „neu frei“, kein Einstieg danach. | B |
| 6.5 | Jahreskarten zeigen je Karte, was sie für **diesen** Garten bringt, und es gibt „ohne Karte weiter“. | Sternbilder ohne Vorschau. Wer das Fenster schließt, bekommt ungefragt das erste. | B |
| 6.6 | Meta-Laden: Text über die ganze Breite, Knopf darunter rechts; bei Rang 0 „Noch nicht gekauft“; das nächste freischaltbare Teil oben mit Balken. | Text und Knopf nebeneinander; bei Rang 0 steht „+0 % Glimmer“. | erledigt |

## 7. Rückkehr

| # | Referenz | Lichtwarte | Wirkung |
|---|---|---|---|
| 7.1 | Das Willkommens-Fenster kommt erst ab 5 Minuten. Darunter liegt nur ein Einsammeln-Knopf auf der Karte. | Das Fenster kommt schon ab 15 Sekunden. | erledigt |
| 7.2 | Das Fenster zeigt, was inzwischen fertig ist, bis zu drei jetzt bezahlbare Bereiche zum Antippen und „Später“. | Nur Dauer und Ertrag. | erledigt |

## 8. Tägliches (Wacht)

| # | Referenz | Lichtwarte | Wirkung |
|---|---|---|---|
| 8.1 | Aufgaben sortiert: Abholbares zuerst, Erledigtes unten. | Feste Reihenfolge. | B |
| 8.2 | Offene Aufgaben zeigen einen Prozent-Ring statt eines toten Knopfs. | Grauer Knopf „Einsammeln“. | B |
| 8.3 | Jede Aufgabe nennt ihre Belohnung. | Aufträge und Taten nennen keine Belohnung. | B |
| 8.4 | Wochenplan mit Bonus für alle erledigten Aufgaben. | Fehlt (die Festwoche im Markt ist etwas anderes). | C |

## 9. Feste

| # | Referenz | Lichtwarte | Wirkung |
|---|---|---|---|
| 9.1 | Kopf mit „endet in N Tagen“ und dem Hinweis, dass Marken verfallen. | Nur Name, Text, Markenstand. | B |
| 9.2 | Waren sortiert: Verfügbares oben, Ausverkauftes unten, je Ware „noch N“ bzw. „hast du schon“. | Feste Reihenfolge, „2/3 gekauft“. | C |
| 9.3 | Liste „So verdienst du Marken“ und das nächste Fest mit Namen. | Steht nur im Fließtext der Wacht. | C |
| 9.4 | Kauf wird kurz bestätigt („… gekauft“). | Keine Bestätigung. | erledigt |

## 10. Sammlung, Chronik, Gäste

| # | Referenz | Lichtwarte | Wirkung |
|---|---|---|---|
| 10.1 | Eine Seite „Sammlung & Ziele“: Gesamt-Prozent, je Sammlung ein Balken, „noch 2 bis zum Satz“. | Je System eine eigene Karte im Tal-Tab, kein Gesamtbild, kein „fast voll“. | B |
| 10.2 | Unbekannte Bewohner nennen, was sie anlockt (Deko, Bereich ab Stufe, Jahreszeit). | „?“ und „Noch nicht gefunden“. | B |
| 10.3 | Notizbuch als Liste aller Seiten: gesperrte mit Hinweis, wie sie aufgehen; Knopf „Weiterlesen: …“. | Buch zum Blättern ohne Inhaltsverzeichnis; künftige Seiten sind unsichtbar. | B |
| 10.4 | Kreuzen: Balken mit Restzeit, Ergebnis als Meldung, Raster aller Kreuzungen mit Hinweis, aus welchen Bereichen sie entstehen. | Alchemie: zwei Auswahllisten und eine Restzeit. Keine Rezeptliste, kein Hinweis, keine Ergebnis-Meldung. | B |
| 10.5 | Deko wird auf der Karte platziert (Bearbeiten-Modus). | Auswahlliste je Platz im Tal-Tab. | B |

## 11. Einstieg und Hinweise

| # | Referenz | Lichtwarte | Wirkung |
|---|---|---|---|
| 11.1 | Der Einstieg hebt sein Ziel hervor (Platz, Tab, Knopf), zeigt „Schritt 2 von 6“, hat einen Aktions-Knopf und weicht dem Ziel aus. | Titel, Text, „Überspringen“. | erledigt |
| 11.2 | Hinweise warten, solange ein Fenster, eine Meldung oder die Zeremonie läuft, und stehen neben dem, was sie erklären. | Eine Marke unter der Kopfzeile, ohne Rücksicht auf Laufendes. | teils: Hinweise warten, solange ein Fenster offen ist; sie stehen weiter unter der Kopfzeile |
| 11.3 | Omen nennen die Folge in Ertrag für diesen Stand und melden danach das Ergebnis. | Nur Faktoren („×1,2 oder ×0,75“), keine Ergebnis-Meldung. | erledigt |

## 12. Sichern und Erinnern

| # | Referenz | Lichtwarte | Wirkung |
|---|---|---|---|
| 12.1 | Wiederherstellen mit Vorschau (Datum, Stand), zweitem Tippen und vorheriger automatischer Sicherung; Datei-Auswahl. | Ein Tipp auf „Wiederherstellen“ überschreibt sofort. | B |
| 12.2 | Automatische Sicherungen und beim Start mit leerem Stand das Angebot, eine davon zurückzuholen. | Fehlt. | B |
| 12.3 | Erinnerung an die Sicherung: höchstens alle 7 Tage, nur nach großem Fortschritt, nie in der ersten Sitzung. | Fehlt. | C |
| 12.4 | Einstellungen: eigener Schalter für Vibration, Erinnerungen, „Schilder immer zeigen“. | Vibration hängt an „Ruhige Bewegung“; die anderen fehlen. | C |
| 12.5 | Benachrichtigungen mit Regeln (höchstens zwei am Tag, nie nachts). | Zurückgestellt (Entscheidung 2026-11-10). | — |

## 13. Was die Referenz hat und Lichtwarte gar nicht

- Wöchentlicher Wettbewerb gegen Nachbarn (offline, mit ehrlichem Hinweis, dass es keine echten Spieler sind).
- Tagesrezept (drei Bereiche liefern Zutaten).

## Vorgeschlagene Reihenfolge

1. **Markt fertig** (5.1, 5.2, 5.3): Die Tester sind gerade dort, 5.2 ist ein Fehler.
2. **Rückmeldung** (4.1, 4.2, 4.3): größte Wirkung aufs Spielgefühl, braucht eine gemeinsame Meldungs-Ebene in der Engine.
3. **Vier Tabs** (1.1 bis 1.4) zusammen mit dem Neubeginn-Tab (6.1 bis 6.3).
4. **Karte und Kopfzeile** (2.1 bis 2.5, 3.1 bis 3.5).
5. **Rückkehr und Einstieg** (7.1, 7.2, 11.1).
6. Rest nach Wirkung.
