# Inhalte für fünf Jahre

Stand 2026-11-11. Plan mit den Entscheidungen vom selben Tag, noch nichts davon gebaut. Entscheidung Michael: Die Jahre 1 bis 5 werden geplant und gebaut, alles danach bleibt Gerüst. Gefüllt wird mit Geschichte, neuen Landen, neuen Systemen und dem Jahreskreis; alle Texte entstehen hier auf Deutsch und Englisch.

## Wo wir stehen

| | Heute |
|---|---|
| Gemessene Spielzeit | bis Tag 90 (nur Profil „regular“) |
| Lande | 34, das letzte öffnet an Tag 90 |
| Chronik | 27 Seiten in 5 Kapiteln, die Erzählung ist mit dem zweiten Zeitalter zu Ende |
| Zeitalter | etwa eines je 4 bis 5 Wochen, Meilensteine bis zum 50. |
| Jahreskreis | 9 Lichterfeste, 13 Fest-Sorten, ein Folio mit 12 Zielen je Jahreszeit |

Nach Tag 90 tragen nur Meisterschafts-Sterne, Schicht-Meilensteine und der Wochenplan. Das ist nicht gemessen.

## Messung über fünf Jahre (heutiger Stand, Profil „regular“)

`SUMMARY=1 npm run balance -- lichtwarte regular 43800`, gemessen 2026-11-11. Der Lauf dauert nur wenige Minuten, nicht wie geschätzt 17.

| | Ergebnis |
|---|---|
| Letztes neues Land | Tag 90 (Land 34). Danach keines mehr. |
| Zeitalter | 9 in fünf Jahren: Tag 28, 46, 79, 120, 182, 292, 479, 724, 1.135. Die Abstände wachsen von 3 Wochen auf über ein Jahr. |
| Lange Nächte | 56 |
| Mondwenden | 4.591 |
| Größte Zahl | 1,6 · 10²¹ Glimmer insgesamt. Die Grenze von 10³⁰⁰ ist weit weg. |

**Folgen:**
- Der Zahlenraum ist kein Risiko. Die späten Wellen dürfen normal weiterwachsen.
- **Ab etwa Tag 120 gibt es kein neues Ziel mehr.** Nach dem vierten Zeitalter liegen zwei, dann drei, dann sechs Monate zwischen zwei Zeitaltern. Fünf Jahre trägt heute nichts.
- Die Meilensteine der Zeitalter (bis zum 50.) sind unerreichbar: In fünf Jahren fallen neun.
- Die Taktung der Zeitalter muss neu gesetzt werden (Ziel aus dem Plan: eines je vier bis fünf Wochen, also etwa zehn im Jahr).

## Nach dem ersten Baustein (2026-11-11)

- **Lande 35 bis 50** sind gebaut. Gemessen öffnen sie sich alle drei Tage von Tag 93 bis Tag 138. Fester Inhalt reicht damit bis Tag 138.
- **Zeitalter:** Die Schwelle wächst ab dem vierten flach (Knie 3, danach 1,35). Zwei Jahre gemessen (vor der Änderung an den Funden): 15 Zeitalter an Tag 28, 46, 79, 120, 162, 200, 236, 270, 313, 363, 408, 458, 507, 562, 625. Im ersten Jahr liegt der Abstand bei fünf bis sechs Wochen, im zweiten wächst er auf neun. Ziel waren vier bis fünf Wochen; für die Jahre 3 bis 5 muss der Faktor noch kleiner werden.
- **Fernfahrten** sind gebaut: Sobald die Greife Briefe tragen (Greifenhorst Stufe 10), fliegt je ein Greif eine von sechs Fahrten (2 bis 24 Stunden) und bringt Lichtkiesel, Runensplitter oder Glimmer mit. Spätere Fahrten öffnen sich mit der Zahl der abgeschlossenen (1, 3, 6, 10, 15).
- **Kapitel 6 „Das erste Jahr“** ist geschrieben: sechs Seiten nach 1, 3, 6, 10, 15 und 20 Fernfahrten. Bei einer Fahrt am Tag fällt die letzte Seite nach etwa drei Wochen; „ein Jahr“ ist es nur dem Namen nach.
- Nach Tag 138 tragen Zeitalter, Sterne, Meilensteine, der Wochenplan und die Fernfahrten. **Jahr 1 hat damit weiterhin ein Loch ab etwa Tag 140 bis Tag 365**: Dort gibt es nur wiederkehrende Ziele, kein neues Land und keine neue Seite. Der Simulator spielt die Fernfahrten noch nicht.

## Jahr 2, erstes Paket (2026-11-11)

Entscheidung Michael: Jahr 2 wird gebaut, in derselben Qualität wie Jahr 1. Es kommt in vier Paketen; dies ist das erste.

- **Welle 5 · Die Hochlande:** 25 Lande (51 bis 75) mit beschreibenden Namen, je einer Figur ohne Eigennamen, Einleitung, zehn Bereichen und eigenem Bild, de/en. Sie haben einen eigenen Bildrahmen (steile Gipfel mit Schnee, Wolkenband, steiniger Boden). Das letzte ist „Die Erste Warte“.
- **Taktung (gemessen, „regular“, 225 Tage):** Das erste Hochland öffnet sich an Tag 141, danach alle 11 bis 14 Tage eines (Tag 152, 165, 179, 192, 206, 220). Hochgerechnet reicht die Welle bis etwa Tag 466. Stellschraube: `REALM_TUNING.highCost = 3`.
- **Feuerstraße (neues System, Engine-Modul `links`):** 25 Verbindungen vom letzten Land des ersten Jahres bis zur Ersten Warte, je drei Stufen. Eine Stufe braucht entsprechend viele Sterne in beiden Landen und kostet Lichtkiesel (15, je Stufe 3 % mehr; alle 75 Stufen zusammen rund 4.100). Jede Stufe gibt +2 % Ertrag, jedes Glied der längsten lückenlosen Kette noch +1 %. Voll ausgebaut sind das +175 %.
- **Lande-Liste:** nach Wellen gegliedert und aufklappbar; die neueste Welle steht offen.
- **Noch offen in Jahr 2:** Buch 2 der Chronik (40 Seiten), Fest-Jahrgang 2, Taktung der Zeitalter für die Jahre 3 bis 5. Nicht gemessen: wie viele Lichtkiesel im zweiten Jahr anfallen (der Preis der Feuerstraße ist geschätzt), und der Simulator spielt weder Feuerstraße noch Fernfahrten.

## Jahr 2, zweites Paket (2026-11-11)

- **Buch 2 „Der Weg der Feuer“** ist geschrieben: 40 Seiten in fünf Kapiteln, de/en. Inhalt und Bogen stehen in `welt.md`.
- Die Seiten gehen mit den Hochlanden (25), den Stufen der Feuerstraße (10) und ihrer längsten Kette (5) auf. Bei einem Hochland alle 11 bis 14 Tage kommt damit im Schnitt etwa alle 8 Tage eine Seite; wie dicht die Seiten der Feuerstraße dazwischen fallen, ist nicht gemessen.
- Die Chronik ist nach Büchern gegliedert. Buch 2 steht bis zum ersten Hochland nur als eine Zeile im Inhalt; die Seitenzahl zählt erst dann bis 73.
- Seiten aus den Hochlanden zeigen das Bild ihres Landes.
- **Noch offen in Jahr 2:** Fest-Jahrgang 2, Taktung der Zeitalter für die Jahre 3 bis 5.

## Jahr 2, drittes Paket (2026-11-11)

- **Fest-Jahrgang 2:** Jedes der neun Lichterfeste hat eine neue Sorte (90 Festmarken) und ein neues Schmuckstück (140 Festmarken). Beides steht erst im Fest-Laden, wenn das erste Hochland offen ist.
- Die neuen Sorten bilden eine eigene Sammlung („Festschätze · Jahrgang 2“). Die erste Fest-Sammlung bleibt für sich vollständig; wer sie schon voll hat, verliert den Satz-Bonus nicht.
- Ein Schmuckstück verschwindet aus dem Laden, sobald man es hat.
- Engine: Waren im Fest-Laden können eine Bedingung tragen (`when`).
- **Nicht gemessen:** ob die Festmarken eines Festes für Sorte und Schmuckstück im selben Jahr reichen. Die Preise sind an Jahrgang 1 angelehnt (60 und 160).

## Jahr 2, Messung über das ganze Jahr (2026-11-11)

`SUMMARY=1 npm run balance -- lichtwarte regular 11400` (475 Tage, Profil „regular“).

| | Ergebnis |
|---|---|
| Hochlande | Tag 141, 152, 165, 179, 192, 206, 220, 233, 247, 259, 274, 289, 302, 314, 328, 340, 352, 367, 382, 398, 410, 424, 438, 452, 467. Abstand 11 bis 15 Tage, im Schnitt 13,6. |
| Ende der Welle | „Die Erste Warte“ öffnet sich an Tag 467. Jahr 2 dauert damit 326 Tage. |
| Zeitalter | 12 bis Tag 475: Tag 27, 46, 77, 117, 158, 197, 232, 266, 308, 357, 400, 446. In Jahr 2 liegen 34 bis 49 Tage dazwischen, also fünf bis sieben Wochen. |
| Lange Nächte | 65 |

**Folgen:**
- Die Hochrechnung aus dem ersten Paket (bis etwa Tag 466) stimmt.
- Das Ziel „kein Loch über 7 Tage“ halten die Lande allein nicht (11 bis 15 Tage). Dazwischen liegen die Seiten von Buch 2, die Stufen der Feuerstraße, die Sterne, die Feste und die Fernfahrten. Wie dicht diese fallen, ist nicht gemessen, weil der Simulator sie nicht spielt.
- Die Zeitalter liegen in Jahr 2 bei fünf bis sieben Wochen, über dem Ziel von vier bis fünf. Für die Jahre 3 bis 5 muss der späte Faktor (heute 1,35) kleiner werden; das gehört zum Paket für Jahr 3.

## Messung mit mitgespielten Systemen (2026-11-11)

Der Simulator kann jetzt die eigenen Systeme des Spiels mitspielen: `PLAY=1 npm run balance -- lichtwarte regular <stunden>` (Wachrunde, Aufträge, Wochenplan, Tagesgeschenk, Fernfahrten, Feuerstraße, Himmelskarte). Er meldet jede neue Chronik-Seite, jede Stufe der Feuerstraße, die Festmarken je Fest und alle 30 Tage den Stand der Lichtkiesel. Die Zielkorridore (`CHECK=1`) laufen weiter ohne `PLAY`.

Gemessen über 475 Tage, „regular“:

| | Ergebnis |
|---|---|
| Lichtkiesel | rund 74 am Tag, 33.800 bis Tag 450 (der Simulator gibt nur für die Feuerstraße welche aus). Der Preis der Feuerstraße (zusammen rund 4.100) bremst also nicht. |
| Feuerstraße | **Erstes Feuer erst an Tag 231**, 90 Tage nach dem ersten Hochland; bis Tag 475 nur 19 Stufen, alle Stufe 1. Der erste Stern eines Hochlands braucht rund 90 Tage. |
| Seiten von Buch 2 | Bis Tag 231 nur mit jedem Hochland eine (alle 11 bis 15 Tage). Die Seiten für 22, 28, 36, 45 und 60 Stufen wären bis Tag 475 nicht aufgegangen. |
| Festmarken | 4.500 bis 14.500 je Fest (jede Mondwende gibt 15, und es sind rund zwölf am Tag). Preise von 60 bis 160 Marken sind dagegen bedeutungslos. |
| Fernfahrten | 480 abgeschlossen |

**Geändert nach dieser Messung:**
- **Feuerstraße:** Die erste Stufe einer Verbindung braucht in beiden Landen nur noch den siebten Bereich auf Stufe 25 (etwa auf halbem Weg zum nächsten Land), die zweite einen Stern, die dritte zwei Sterne. Vorher: ein, zwei, drei Sterne.
- **Buch 2:** Die Seiten der Feuerstraße gehen bei 1, 2, 5, 10, 14, 18, 23, 28, 34 und 40 Stufen auf (vorher bis 60).
- **Nicht geändert:** die Festmarken. Sie fließen so reichlich, dass der Fest-Laden kein Ziel ist. Das betrifft schon Jahr 1 und braucht eine eigene Entscheidung (weniger Marken je Mondwende oder höhere Preise).
- Die neue Regel ist noch nicht nachgemessen; die Messung über die Jahre 2 und 3 läuft.

## Jahr 3, erste Pakete (2026-11-11)

- **Welle 6 · Die Fernen Küsten:** 25 Lande (76 bis 100) jenseits der Ersten Warte, vom Langen Abstieg bis zur Warte der vier Strahlen. Beschreibende Namen, Figuren ohne Eigennamen, je zehn Bereiche, eigenes Bild, eigener Bildrahmen (Meer bis zum Horizont, Strand), de/en. Taktung wie die Hochlande (`highCost`), noch nicht gemessen.
- **Himmelskarte (neues System, Engine-Modul `chart`):** zwölf Sternbilder mit zusammen 74 Sternen. Ein Stern kostet Nachttau (2, je Stern 3,5 % mehr; zusammen rund 670). Jeder Stern gibt +0,5 % Ertrag, jedes vollständige Sternbild wirkt dauerhaft (Ertrag, Baukosten oder Funkenruf). Ein Sternbild lässt sich eintragen, sobald jedes zweite Küstenland offen ist. Ob der Nachttau dafür reicht, ist nicht gemessen.
- **Buch 3 „Die tiefe Zeit“:** 40 Seiten in fünf Kapiteln, de/en. Briefe von Alwine und erstmals von Fenno, dazu Seiten der Wacht aus der Sternwarte. Die Seiten gehen mit den Küstenlanden (25), den Sternen der Karte (8) und vollständigen Sternbildern (7) auf.
- **Fest-Jahrgang 3:** je Lichterfest eine neue Sorte (110 Festmarken) und ein neues Schmuckstück (170 Festmarken) von der Küste, eigene Sammlung „Festschätze · Jahrgang 3“, erst ab dem ersten Küstenland im Fest-Laden. Die Jahrgänge stehen jetzt als Liste im Inhalt (`FEST_YEARS`); ein weiterer Jahrgang ist ein Eintrag.
- **Zeitalter:** In der Messung mit mitgespielten Systemen liegen sie in Jahr 2 stabil 32 bis 40 Tage auseinander (Tag 154, 192, 227, 259, 297, 337, 373, 409, 444). Das sind rund fünf Wochen; der Abstand wächst nicht mehr. Die Taktung bleibt deshalb, wie sie ist.
- **Noch offen in Jahr 3:** die Messung über Jahr 3 (läuft).

## Messung über die Jahre 2 und 3 (2026-11-11)

`PLAY=1 npm run balance -- lichtwarte regular 19700` (821 Tage, „regular“, alle Systeme mitgespielt).

| | Ergebnis |
|---|---|
| Feuerstraße (neue Regel) | Erstes Feuer an Tag 145, vier Tage nach dem ersten Hochland; danach etwa alle 13 Tage eine erste Stufe, ab Tag 231 dazu die zweiten Stufen. 43 Stufen bis Tag 475, 50 bis Tag 565. |
| Seiten von Buch 2 | Tag 141 bis 467, Abstand 2 bis 14 Tage, meist 6 bis 7. Alle 40 Seiten gehen in Jahr 2 auf. |
| Küstenlande | Tag 482, 496, 511, 527, 543, … 811 (Land 24 der Welle): eines alle 14 bis 17 Tage. Hochgerechnet endet die Welle um Tag 842; Jahr 3 dauert rund 360 Tage. |
| Himmelskarte (ohne Wartezeit) | Nachttau bremst nicht (rund fünf am Tag, die Karte kostet zusammen rund 670). **Jedes Sternbild war am Tag seines Erscheinens voll**, die Seiten von Buch 3 fielen in Bündeln. |
| Zeitalter | 23 bis Tag 811. Abstand in Jahr 2 rund 31 bis 38 Tage, in Jahr 3 36 bis 46 Tage. |
| Nachttau | 3.666 verdient bis Tag 811 |
| Größte Zahl | 7,8 · 10¹⁸ Glimmer; weit unter der Grenze |

**Geändert nach dieser Messung:**
- **Himmelskarte:** Nach jedem Stern braucht die Sternwarte drei Tage, bis der nächste eingetragen werden kann (`SKY_CHART_TUNING.waitDays`, Engine: `cooldownMs`). Ein Sternbild mit sechs Sternen trägt so gut zwei Wochen; das nächste erscheint nach etwa 31 Tagen.
- **Buch 3:** Die Stern-Seiten gehen bei 1, 4, 9, 14, 20, 28, 34 und 43 Sternen auf (vorher 8, 13, 19, 26), damit sie nicht auf den Tag fallen, an dem ein Sternbild erscheint. Die Zahlen in den Texten sind angepasst.
- **Buch 2:** Die letzte Seite geht erst auf, wenn auch die Erste Warte erreicht ist; gemessen wären die 40 Stufen 17 Tage früher gefallen als das Ende der Geschichte.
- **Nicht geändert:** die Zeitalter. In Jahr 3 wächst der Abstand auf gut sechs Wochen; für die Jahre 4 und 5 sollte der späte Faktor (1,35) sinken.
- **Nachgemessen (675 Tage, mit Wartezeit):** ein Stern alle drei Tage. Die Leiter ist an Tag 500 vollständig, der Schlüssel an Tag 523, die Laterne an Tag 562, der Greif an Tag 596, die Glocke an Tag 619, das Boot an Tag 652. Die Seiten von Buch 3 liegen bis Tag 668 3 bis 16 Tage auseinander, meist etwa eine Woche; nur am ersten Tag von Jahr 3 gehen zwei zugleich auf (ein Brief und die erste Stern-Seite).

## Erster Testlauf und Bindung (2026-11-11)

Ein Tester, ein Tag: 9 Sitzungen, knapp 80 Minuten, 3 Mondwenden. Auffällig: nach der dritten Mondwende vier Besuche ohne neues Ziel, an neun Besuchen eine Wachrunde und drei Aufträge, zwei Blicke in die Sammlung bei fünf Funden, 17 von 44 Gästen nie begrüßt.

Daraus umgesetzt (Entscheidung Michael):
1. **Ziel-Zeile mit Ausblick:** Unter dem Ziel steht, was die nächste Mondwende öffnet und wie lange es etwa noch dauert.
2. **Was wartet, steht im Tal:** Marken für Wachrunde, fertige Aufträge, Wochenplan, Tagesgeschenk und zurückgekehrten Greif; ein Tipp sammelt ein.
3. **Aufträge im Tal:** als Marke, nur wenn einer fertig ist.
4. **Funde:** Die Meldung nennt den Stand des Satzes; neue Funde stehen als Marke im Tal und beim Betreten oben in der Sammlung.
5. **Gäste warten**, bis man sie begrüßt.
6. **Sternenrad:** Das laufende Ergebnis steht als Marke im Tal; Antippen zeigt die Wirkung.

Dazu: **Festmarken knapper.** Eine Mondwende gibt 1 statt 15 Marken. Erwartet sind damit 600 bis 1.200 je Fest statt 4.500 bis 14.500; nicht nachgemessen.

## Jahr 4 und 5 (2026-11-11)

Gebaut in zwei Paketen (PR #41 und der folgende):

- **Jahr 4 · Die Lehrlinge:** 25 Inseln, **Wächterschule** (Engine-Modul `stewards`): bis zu 20 Lehrlinge, einer nach dem anderen ausgebildet (200 Lichtkiesel und vier Tage, jeder weitere 15 % teurer und 12,5 % länger; zusammen rund 305 Tage), dann einem Land zugeteilt, das sie von selbst weiterbauen (ein Schritt alle zehn Minuten, bis zu zwölf Stunden nachgeholt). Ein neu entsandter Lehrling baut sofort einen Schritt. Buch 4 (40 Seiten), Fest-Jahrgang 4 (130 und 200 Festmarken).
- **Jahr 5 · Das große Licht:** 25 Lande am Rand der Karte, **Großes Leuchtfeuer** (Engine-Modul `monument`): 30 Stufen, für jede gibt jedes Land einmal sechs Stunden seines Ertrags; Stufe n braucht 8 + 3·n Lande, danach ruht der Bau acht Tage. Buch 5 (40 Seiten), Fest-Jahrgang 5 (150 und 230 Festmarken).
- **Sperre in der Engine:** Schule und Leuchtfeuer prüfen ihre Freischaltung jetzt selbst (`open`). Vorher sperrte nur die Oberfläche; der Simulator bildete an Tag 7 den ersten Lehrling aus.

### Zeitalter: etwa alle fünf Wochen

Entscheidung: Die späte Schwelle wächst mit 1,25 statt 1,35; die ersten vier Zeitalter bleiben, wo sie waren. Gemessen mit `PLAY=1`, Profil „regular“ (Abstand zwischen zwei Zeitaltern in Tagen):

| Faktor | Jahr 2 | Jahr 3 | Jahr 4 | Jahr 5 |
|---|---|---|---|---|
| 1,35 (vorher) | 31 bis 38 | 36 bis 46 | nicht gemessen | nicht gemessen |
| 1,30 | 26 bis 40, im Mittel 32 | 40 bis 57, im Mittel 45 | 61 bis 84, im Mittel 75 | 84 bis 106, im Mittel 94 |
| 1,25 allein | 23 bis 33, im Mittel 27 | 34 bis 48, im Mittel 38 | 53 bis 73, im Mittel 64 | 66 bis 89, im Mittel 73 |
| **1,25 mit Knicken (jetzt)** | 23 bis 33, im Mittel 27 | 34 bis 42, im Mittel 36 | 36 bis 44, im Mittel 40 | 32 bis 41, im Mittel 37 |

Ein einzelner Faktor hält die fünf Wochen nicht: Der Ertrag wächst mit den Jahren langsamer, und der größte Teil der Zeit zwischen zwei Zeitaltern ist Wiederaufbau nach dem Neubeginn. Die Schwelle hat deshalb weitere Knicke (`gate.bends`, neu in der Engine): ab dem 32. Zeitalter wächst sie mit 1,1, ab dem 43. mit 1,12 (das Leuchtfeuer hebt den Ertrag), ab dem 50. mit 1,08. Bis zum 32. Zeitalter (Tag 920) ändert sich nichts. Ein erster Versuch mit 1,2 / 1,15 / 1,12 / 1,1 war zu schwach (Jahr 4: 49 bis 57 Tage).

Über fünf Jahre sind es damit 55 Zeitalter (mit 1,25 allein 46). In Jahr 4 liegt der Abstand mit im Mittel 40 Tagen eher bei knapp sechs als bei fünf Wochen; er wächst aber nicht mehr. Die Lande fallen bei allen Faktoren am selben Tag: Die Zeitalter verschieben die Lande nicht.

### Festmarken

Entscheidung: knapper. Eine Marke je Mondwende allein reichte nicht: gemessen fielen weiter 4.000 bis 5.900 Marken je Fest an, zwei Drittel davon aus den Funken (rund 40 am Tag). Jetzt zählen Funken nicht mehr, die Wachrunde gibt 5 (vorher 10), ein Auftrag 2 (vorher 5), die Mondwende 1. Nachgemessen: 676 Marken im ersten Fest (36 Tage), hochgerechnet rund 850 für ein Fest von 45 Tagen. Der ganze Fest-Laden kostet im ersten Jahr 375 Marken, mit allen fünf Jahrgängen rund 1.600. Im ersten Jahr reicht es also noch für alles, ab Jahr 3 muss man wählen. Ob das knapp genug ist, zeigt der Testlauf.

### Jahre 4 und 5: Messung

Läufe über 1.825 Tage mit `PLAY=1`, Profil „regular“; der Simulator spielt Schule und Leuchtfeuer mit und gibt Ereignisse laufend aus (`STREAM=1`).

| Was | Gemessen |
|---|---|
| Inseln (Jahr 4) | Tag 876 bis 1.295, alle 16 bis 18 Tage |
| Rand der Karte (Jahr 5) | Tag 1.313 bis 1.797, alle 19 bis 22 Tage; das letzte Land öffnet vier Wochen vor dem Ende von Jahr 5 |
| Lehrlinge | Mit zwei Tagen Ausbildung (+12 % je Lehrling) waren alle zwanzig nach 128 Tagen fertig (Tag 1.004). **Nachgestellt** auf vier Tage und +12,5 %: jetzt ist der zwanzigste an Tag 1.146 ausgebildet und an Tag 1.184 entsandt. Die Schule trägt damit gut zehn Monate; die letzten 111 Tage des Jahres tragen die Inseln allein. |
| Lichtkiesel | bremsen nicht: an Tag 1.800 liegen rund 107.000 ungenutzt (der Simulator kauft nichts im Markt), alle zwanzig Lehrlinge kosten zusammen rund 20.500. |
| Großes Leuchtfeuer | alle 30 Stufen von Tag 1.313 bis 1.545, eine Stufe alle acht Tage: Die Ruhezeit bestimmt den Takt, die Gaben der Lande bremsen nie. Danach tragen bis Tag 1.797 nur noch die Lande. |
| Seiten von Buch 4 | 40 Seiten von Tag 876 bis 1.295, größter Abstand 18 Tage, viermal zwei am selben Tag |
| Seiten von Buch 5 | 40 Seiten von Tag 1.313 bis 1.797, größter Abstand 22 Tage, einmal zwei am selben Tag |

**Bewusst nicht geändert:** Das Leuchtfeuer ist nach gut sieben Monaten fertig. Eine längere Ruhezeit würde es über das Jahr strecken, nähme aber Ertrag weg und schöbe die Lande am Rand über das Ende von Jahr 5 hinaus. Die Zeit danach füllt seit dem 12.11. das Nähren des Feuers (siehe unten).

### Das Feuer nähren (2026-11-12)

Steht die letzte Stufe des Leuchtfeuers, wird das Feuer genährt: 30-mal, alle acht Tage einmal, gegen Lichtkiesel (300 + 100 je Mal, zusammen 52.500), je +1 % Ertrag. In der Engine ist das die Pflege eines fertigen Werks (`MonumentConfig.tend`, neues gespeichertes Feld `tended` mit Startwert 0).

- **Wozu:** Es füllt die 240 Tage zwischen der letzten Stufe (Tag 1.545) und dem letzten Land (Tag 1.797), und die Lichtkiesel bekommen ein spätes Ziel. Der Simulator hatte bis Tag 1.800 rund 107.000 Lichtkiesel ungenutzt; das ist eine Obergrenze, weil er nichts im Markt kauft.
- **Nicht gemessen:** Der Lauf über fünf Jahre mit dem Nähren läuft noch. Zu prüfen ist, ob die bis zu +30 % Ertrag die letzten Lande am Rand spürbar vorziehen.

### Testlog vom 11. und 12.11. (ein Tester, 26 Stunden)

13 Sitzungen, 2 Stunden 3 Minuten Spielzeit am ersten Tag, knapp 4 Minuten am zweiten Morgen. Fünf Mondwenden am ersten Tag (die erste nach 2,5 Stunden), Rang 19, 10 Funde, noch keine Lange Nacht.

| Beobachtung | Zahl | Folgerung |
|---|---|---|
| Besuchte Tabs | Tal 131, Markt 74, Mondwende 69, Wacht 11, Laden 7, Sammlung 2 | Der Markt wird fast so oft geöffnet wie die Mondwende. Wacht und Sammlung liegen im Menü und werden kaum gefunden. Die Lande waren noch nicht offen (keine Lange Nacht); in einer ersten Fassung dieser Tabelle stand hier fälschlich „Lande 2“. |
| Bonus-Video | 19-mal Glimmer, nie Lichtkiesel | 6 Lichtkiesel sind gegen zehn Minuten Ertrag keine Wahl. Entschieden: Wahl gestrichen. |
| Werbung | zweimal nach drei Sekunden abgebrochen, direkt danach „Werbung entfernen“ geöffnet; später gekauft | Der Wunsch, Werbung loszuwerden, ist echt. Ein 60-Sekunden-Video lief über fünf Minuten (App im Hintergrund, Uhr läuft nach Wanduhr; nur aus dem Code geschlossen). |
| Testkäufe | 4 von 6 Angeboten, 8,96 € von 20 € Testgeld | Stilpaket, Werbefrei, Startpaket, Fest-Pass. Den Fest-Pass erst beim dritten Anlauf. |
| Rad | 4 von 5 Drehungen dasselbe Feld | Zufall ist geprüft und in Ordnung; es wirkt trotzdem eintönig. |
| Korb mit Ertrag | 50-mal eingesammelt, 14-mal davon nach weniger als zwei Minuten | Der Korb erscheint schon nach 15 Sekunden Abwesenheit. Entschieden: erst nach einigen Minuten. |
| Zweiter Tag | drei Sitzungen von zusammen knapp vier Minuten, keine Mondwende | Einsammeln und wieder gehen. Ein Vormittag ist zu wenig für ein Urteil. |

**Entschieden und umgesetzt (Michael, 2026-11-12):**

- **Bonus-Video:** nur noch eine Belohnung (zehn Minuten Glimmer). Die Kiesel-Wahl ist stillgelegt (`retired`), ihre ID bleibt gesperrt erhalten. Ohne Ertrag sagt die Karte, warum es gerade nichts gibt.
- **Korb:** Eine Abwesenheit unter fünf Minuten wird sofort gutgeschrieben (`balance.offline.directBelowMs`), ohne Korb. Ab fünf Minuten kommt wie bisher das Willkommens-Fenster. Der Knopf auf der Karte bleibt für einen Korb, der schon wartet (nach „Später“).
- **Wacht und Lande:** Die Lande stehen ab der ersten Langen Nacht als fünfter Knopf in der Leiste (Tal, Mondwende, Lande, Markt, Menü). Der Knopf unten rechts auf der Karte, der schon immer zur Wacht führte, heißt jetzt „Wacht“ statt „Heute“. Die Sammlung bleibt im Menü.

## Was „fünf Jahre“ hier heißt

Maßstab ist eine Spielerin, die täglich kurz spielt (Profil „regular“). Über 1.825 Tage soll gelten:

- **Alle 3 bis 4 Tage ein neues Ziel.** Als neues Ziel zählt: ein Land, eine Chronik-Seite, ein Zeitalter, ein Fest, eine Stufe eines Jahres-Systems.
- **Kein Loch über 7 Tage.**
- **Jedes Jahr etwas, das es vorher nicht gab:** ein Buch der Chronik, eine Welle Lande, ein System, ein Fest-Jahrgang.

Rechnung je Jahr: 25 Lande (alle 14 bis 15 Tage) + 40 Chronik-Seiten (alle 9 Tage) + 9 Feste + etwa 10 Zeitalter + rund 20 Stufen des Jahres-Systems = etwa 105 Ziele, also eines alle 3,5 Tage.

## Die fünf Jahre

Jedes Jahr ist ein **Buch** der Chronik mit eigener Frage, einer **Welle** Lande mit eigenem Landschaftsbild und einem **System**, das im Jahr danach bleibt.

| Jahr | Buch und Frage | Lande | Neues System | Jahreskreis |
|---|---|---|---|---|
| 1 · Die Wacht | „Wo ist Alwine, und warum glimmt das Feuer nur noch?“ (vorhanden) Dazu ein sechstes Kapitel: das erste Jahr der neuen Wacht mit Fenno. | 35 bis 50 fertigstellen (Tag 90 bis 180), danach alle zwei Wochen eines | **Fernfahrten:** Die Greife fliegen Aufträge in ferne Lande (8 bis 24 Stunden), bringen Funde, Briefe und Kartenstücke. | Jahrgang 1 (vorhanden) |
| 2 · Der Weg der Feuer | „Wer hat die anderen Feuer entzündet?“ Alwine findet Spuren einer Wacht vor ihrer Lehrerin. | Welle 2: die Hochlande (25) | **Feuerstraße:** Benachbarte Lande werden verbunden. Jede Verbindung braucht Sterne in beiden Landen und stärkt die ganze Kette. | Jahrgang 2: je Fest eine neue Sorte und ein neues Stück Schmuck |
| 3 · Die tiefe Zeit | „Was sah die Sternwarte, bevor die Sterne fehlten?“ | Welle 3: die Küstenlande (25) | **Himmelskarte:** Die Sternwarte füllt eine Karte des Himmels, Feld für Feld, über Monate. Jedes Sternbild darauf ist dauerhaft. | Jahrgang 3, dazu Sternschnuppen-Nächte |
| 4 · Die Lehrlinge | „Wem gibt man eine Wacht?“ Fenno bildet selbst aus. | Welle 4: die Inseln (25) | **Wächterschule:** Lehrlinge werden ausgebildet und einem Land zugeteilt, das sie dann selbst pflegen. | Jahrgang 4, dazu ein Schulfest |
| 5 · Das große Licht | „Was geschieht, wenn alle Feuer zugleich brennen?“ Die Lange Nacht kehrt zurück, diesmal für alle Lande. | Welle 5: der Rand der Karte (25) | **Großes Leuchtfeuer:** ein Bauwerk über das ganze Jahr, an dem alle Lande mitbauen. Sein Abschluss ist das Ende von Buch 5. | Jahrgang 5, dazu die Nacht aller Feuer |

**Jahre 6 und später (nur Gerüst):** dieselbe Form. Ein Jahr besteht aus einem Buch (5 Kapitel, 40 Seiten), einer Welle (25 Lande), einem System und einem Fest-Jahrgang. Die Engine bekommt dafür eine Jahres-Tabelle; ein neues Jahr ist dann Inhalt, kein Umbau.

## Was dafür gebaut werden muss

1. **Messung bis Tag 1.825:** erledigt, siehe oben. Sie gehört nach jedem Paket wiederholt.
2. **Taktung der Zeitalter** über Tag 120 hinaus (heute brechen sie ab).
3. **Jahres-Tabelle** in der Engine (Wellen, Bücher, Jahrgänge anhängbar; IDs nur anhängen).
4. **Vier neue Systeme** (Feuerstraße, Himmelskarte, Wächterschule, Großes Leuchtfeuer) und die Fernfahrten. Jedes ist ein eigenes Engine-Modul mit Tests und Spielstand-Startwert.
5. **Texte:** etwa 200 Chronik-Seiten, 116 Lande mit Namen, Figur und Einleitung, je zwei Sprachen.
6. **Bilder:** je Welle ein Landschaftsrahmen (heute gibt es einen), je System ein Fenster.

## Risiken

- **Namen.** Jeder Eigenname braucht eine Websuche und eine Zeile in `docs/marken/pruefung.md`. Für 116 Lande ist das der größte Einzelposten; heute stehen dort schon 45 Namen als ungeprüft. Ausweg: Lande späterer Wellen bekommen beschreibende Namen („Das Dritte Hochmoor“) statt Eigennamen.
- **Textmenge.** 200 Seiten im Ton der ersten 27 sind machbar, aber nicht in einem Zug zu prüfen. Vorschlag: buchweise liefern und lesen.
- **Spielstände.** Jedes neue Modul und jede neue Welle muss alte Stände verlustfrei laden (Fixture je Format-Änderung).
- **Nur „regular“ ist gemessen.** Wer viel spielt, ist schneller durch; wer selten spielt, sieht das Ende von Jahr 1 vielleicht nie.

## Vorgeschlagene Reihenfolge

1. Messung auf 5 Jahre erweitern und den heutigen Stand messen (zeigt das wahre Loch nach Tag 90).
2. Jahr 1 schließen: Lande 35 bis 50, Fernfahrten, sechstes Kapitel.
3. Jahres-Tabelle bauen und Jahr 2 als erstes ganzes Jahr liefern (Buch, Welle, Feuerstraße, Jahrgang).
4. Jahre 3 bis 5 je als eigenes Paket, jeweils mit Messung.

## Entscheidungen (Michael, 2026-11-11)

1. **Ein neues Jahr öffnet sich durch Fortschritt:** mit dem letzten Land der Welle, nicht durch den Kalender.
2. **Lande späterer Wellen tragen beschreibende Namen** („Das Hohe Moor“), keine Eigennamen. Damit entfällt für sie die Namensprüfung.
3. **Zuerst wird gemessen:** Simulator auf fünf Jahre, heutiger Stand, erst dann wird gebaut.
