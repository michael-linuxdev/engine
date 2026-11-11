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
