# Regeln der Bedienung (UI-Runde 4)

Stand 2026-11-12. Ergebnis eines Durchgangs durch alle Fenster (Handy, 320 px, Tablet, Desktop, Querformat, Erststart, Nacht, große Schrift, beide Sprachen). `bedien-luecken.md` vergleicht mit der Referenz; diese Datei hält fest, was seitdem **immer** gilt und wer es prüft.

## Geprüft von `npm run e2e` (`tools/e2e/screens.mjs --strict`)

Jedes Fenster, in normaler und in großer Schrift, Deutsch und Englisch:

| Regel | Maß |
|---|---|
| Keine Schrift unter 12 px | berechnete Größe jedes sichtbaren Textes |
| Jede Tippfläche mindestens 44 px | gemessen wird, was den Tipp fängt: Ein flacher Knopf darf seine Fläche unsichtbar vergrößern (`::after`) |
| Kein Schild der Karte liegt unter Kopfzeile, Pillen oder Knöpfen | Mittelpunkt jedes Schilds muss sein Platz sein |
| Kein Text ist abgeschnitten | wie bisher |
| Querformat am Handy zeigt „Bitte halte das Gerät hochkant“ | Bild `13-quer.png` |

## Schrift

Alle Größen kommen aus acht Stufen in `packages/ui-kit/src/styles/tokens.css` (`--fs-xs` 12 px bis `--fs-display` 36 px). Neue Größen nicht erfinden: die nächste Stufe nehmen.

Die Bühne ist auf ein 390 px breites Handy gezeichnet. Ist sie breiter (großes Handy, Tablet, Desktop), wächst die Grundschrift mit, bis höchstens 24 px (`html:has(.lw-app)` in `game.css`). Die Leiste unten ist so breit wie die Bühne.

## Punkte und Marken

- **Voller Glutpunkt** = jetzt abholbar (Mondwende bereit, Tagesgeschenk, Wachrunde, Brief, Greif zurück).
- **Leiser Ring** (`.ek-badge--quiet`) = neu oder „etwas wäre kaufbar“ (neue Chronik-Seite, neue Kachel im Menü, Archiv bezahlbar).

Nie beides für dasselbe. Wenn alles ruft, ruft nichts.

## Einstieg

- Erst bauen, dann lesen: Prolog → Kräuterkate → die erste Chronik-Seite öffnet sich, sobald die Kate steht und ihr Fenster zu ist.
- Solange der Einstieg auf ein Bauwerk oder den Funkenruf zeigt, schweigt die Ziel-Zeile (eine Ansage, nicht zwei).
- Die Zeile „Die nächste Mondwende öffnet …“ kommt erst, wenn die Mondwende bereit oder höchstens 30 Minuten entfernt ist, oder wenn schon eine gefeiert wurde.

## Ziel-Zeile (Abgleich mit der Vorlage, 2026-11-12)

Beide Spiele liefen dafür nebeneinander im Testbrowser. Die Zahlen der ersten Minuten waren danach gleich oder besser; der sichtbare Unterschied war die Ziel-Zeile. Die Vorlage zeigt immer das Ziel, das am weitesten ist, mit Zahl und „… % geschafft“. Hier stand ein festes Ziel ohne Zahl („Als Nächstes: Holzlager freilegen“), auch wenn noch gar nichts gebaut war.

Jetzt wie die Vorlage (Engine: `pressingGoal`):

- Zur Wahl stehen der nächste Ausbau, das nächste Bauwerk, der nächste Wächterrang und die Mondwende. Es gewinnt, was am nächsten dran ist. Ein bezahlbarer Ausbau schlägt alles außer einer bereiten Mondwende.
- Rechts steht die Zahl dazu: der Preis, „Kräuterkate 8/10“, „63/122 Erfahrung“ oder „noch 1,2 Mio. Glimmer“.
- Ab 78 % steht „… % geschafft“ dabei, und der Balken pulst.
- Antippen führt dorthin: zum Bauwerk, zum Rang oder in den Mondwende-Tab.
- Die Zeile darunter („Die nächste Mondwende öffnet …“) bleibt, wie sie war.

## Start und Rang (Abgleich mit der Vorlage, 2026-11-12)

- **Das erste Bauwerk steht von der ersten Sekunde an** auf Stufe 1 und bringt Ertrag, auch nach jeder Mondwende; der erste Ausbau ist sofort bezahlbar (Engine: `startProducers`). Vorher begann man bei 0/s und legte die Kräuterkate erst frei.
- Der erste Schritt des Einstiegs ist deshalb der erste **Ausbau**; die erste Chronik-Seite, die Seite zur Kate und die Tat „Erstes Licht“ gehören zu Stufe 2.
- **Der Wächterrang** steht mit Namen und breitem Balken in der Kopfzeile („Wächterrang 2“), nicht mehr als kleine Zahl.

## Aufbau

- **Kopf über der Karte:** Kontostand, Vorräte, eine schmale Ziel-Zeile mit dünnem Balken, eine Reihe Pillen. Die Reihe läuft rechts weich aus (scrollbar).
- **Vorräte:** Jede Währung hat eine eigene Form (Kiesel, Splitter, Tropfen, Stern), nicht nur eine Farbe.
- **Mondwende-Tab:** echte Reiter (Mondwende · Archiv · Prüfungen), je Reiter eine kurze Seite. Der Tab öffnet immer auf der Mondwende.
- **Seiten aus dem Menü** (Wacht, Sammlung) tragen ihren Titel und „Zurück“.
- **Preise** stehen nie als nackte Zahl: Am Zweig-Knopf steht die Glimmer-Münze davor.
- **Boni-Fenster:** Gesamtsumme oben; Zeilen, die „×1“ zeigen, entfallen.
- **Sichern:** zwei Knöpfe (kopieren, als Datei); der Code selbst steht hinter „Code anzeigen“.
- **Install-Hinweis:** „Im Browser weiter“ steht direkt unter der Anleitung.

## Offen

- Der Leuchtturm ist auf dem Handy jetzt etwa zur Hälfte zu sehen (vorher gar nicht), auf 320 px, Tablet und Desktop ganz. Ganz frei wird er auf dem Handy erst, wenn die Karte ihn tiefer setzt; das ändert die Grafik-Vorlagen (`npm run art:update`) und ist eine eigene Runde.
- Die Meldung „Tat vollbracht“ liegt kurz über dem Kopf eines offenen Fensters.
