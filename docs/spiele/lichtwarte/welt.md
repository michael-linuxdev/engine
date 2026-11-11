# Welt und Ton

Der Spieltitel steht nur in `games/lichtwarte/src/brand.ts` und ist ein Arbeitstitel. Hier heißt das Spiel deshalb „das Spiel“.

## Prämisse

Du übernimmst eine verfallene Turmwarte am Rand des **Dämmertals**. Das alte Licht des Tals ist fast erloschen. Mit jedem Bauwerk, das du wieder aufrichtest, kehrt ein Stück davon zurück. Das geschieht auch, wenn du nicht da bist: Die Warte glimmt weiter.

## Erzählstimme

Die **Chronik der Wächterin Alwine**. Sie war deine Vorgängerin und hat jahrzehntelang über das Tal gewacht. Ihre Chronik entspricht dem Notizbuch der Referenz: Einführung, Meilensteine, Freischaltungen, Rückkehr-Briefe und Zeremonien.

- **Ton:** warm, knapp, mit leisem Humor, nie belehrend. Kurze Sätze, keine Fachsprache.
- **Haltung:** Alwine erklärt nicht die Mechanik, sondern was die Mechanik *bedeutet*. Ein Beispiel: „Was du baust, vergeht — was du lernst, bleibt im Archiv.“

## Die Erzählung (sechs Kapitel, 33 Seiten)

Texte: `games/lichtwarte/src/i18n/story.de.ts` / `story.en.ts`. Bedingungen und Kapitel: `src/content/chronicle.ts`.

**Die Frage, die trägt:** Wo ist Alwine, und warum glimmt das Feuer nur noch? Die Chronik beantwortet das Stück für Stück, immer zum passenden Fortschritt.

| Kapitel | Fortschritt | Was die Spielerin erfährt |
|---|---|---|
| 1 · Der Schlüssel | erste Bauwerke bis zur ersten Mondwende | Alwine hat den Schlüssel unter der dritten Stufe gelassen. Sie lebt, ist aber zu alt, um das Feuer allein zu hüten. Sie ist dem Bach gefolgt. |
| 2 · Was bleibt | Mondwenden, Schmiede bis Alchemistenturm | Das Licht steckt im Können, nicht in den Balken (Archiv). Das leere Fach der Kartenstube: Alwine sucht in den Landen nach anderen Feuern. Erste Erwähnung der Langen Nacht. |
| 3 · Das Tal erwacht | Greifenhorst bis Sternwarte, Lehrling | Die Greife bringen Alwines Briefe. Fenno kehrt zurück. Am Rand des Himmels fehlen Sterne: Die Lange Nacht kommt, einmal in jedem Menschenalter. |
| 4 · Die Lange Nacht | erste Lange Nacht, Lande | Die Wacht trägt das Feuer durch die Nacht. Am Morgen antworten Feuer auf den Hügeln: „Ein Feuer allein ist nur ein Feuer. Viele Feuer sind ein Weg.“ |
| 5 · Die Wacht weitergeben | Zeitalter | Fenno übernimmt. Alwine kommt den Weg herunter, an allen Laternen vorbei, und ist diesmal der Gast. Die letzte Seite schreibt die Wacht selbst — es ist wieder die erste Seite. |
| 6 · Das erste Jahr | Fernfahrten der Greife (1 bis 20) | Briefe zurück aus den Landen, das leere Fach der Kartenstube füllt sich Stück für Stück, Fenno und die Greife. Die letzte Seite schreibt die Wacht selbst: Hinter den Bergen liegt Land, das auf keiner Karte steht. |

**Regeln:**

- Die Spielerin heißt „die Wacht“ (kein Geschlecht, kein Name).
- Alwine schreibt in die Chronik (Initiale, Kursive). Briefe „vom Greif gebracht“ sehen wie Briefe aus. Die letzte Seite ist von der Wacht selbst.
- Keine neuen Eigennamen ohne Eintrag in `names.ts` und Prüfung. Die Erzählung nutzt nur vorhandene (Alwine, Fenno, Ragna, Dämmertal).
- Die Karte erzählt mit: Für jedes stehende Bauwerk brennt eine Laterne am Weg. Das Leuchtfeuer der Warte wächst (verglommen → Glut → Feuer) und brennt nach der ersten Mondwende voll.

**Auftritte:**

- **Prolog** beim allerersten Start (`story/Intro.tsx`): das dunkle Tal, vier Zeilen, „Die Warte aufschließen“.
- **Chronik als Buch** (`story/Chronicle.tsx`): eine Seite auf einmal, mit Kapitel, Bild und Blättern. Knopf in der Kopfzeile.
- **Zeremonien** als Vollbild (`story/Ceremony.tsx`): Mondwende (der Mond dreht sich), Lange Nacht, Zeitalter (Morgenlicht), je drei Zeilen.
- **Fenno** geht den Weg ab und sagt alle paar Atemzüge einen Satz, passend zu Tageszeit und Wetter (`scene/FennoBubble.tsx`).

## Figuren

| Figur | Rolle | Status |
|---|---|---|
| Alwine | Frühere Wächterin, Stimme der Chronik und der Briefe. Kehrt mit dem ersten Zeitalter zurück und sitzt dann auf der Bank vor der Kräuterkate (`AlwineOnBench`). | im Spiel |
| Fenno | Lehrling, die Helfer-Automatik (Maßfigur der Grafik, 24 Einheiten hoch). Geht auf der Karte den Weg ab und spricht. | im Spiel |
| Ragna | Moorhüterin im ersten Land; Alwines erste Station | im Spiel |
| Talgäste | Greif, Kobold, Irrlicht, Fuchs, Igel, Eule … Der Gast steht auf der Karte am Weg. | im Spiel |

## Ton der Welt

Gemütliche Fantasy („cozy“): Wunder, Handwerk, Jahreszeiten, Sternenhimmel. Keine Gewalt-Ästhetik, kein Grimdark. Gefahr gibt es höchstens als Wetter, Nebel oder Dornen. **Gesperrte Plätze sind Wildnis** (Dornen, Nebel, Geröll). Freischalten heißt freilegen und aufbauen.

## Bogen

1. **Turmwarte:** die ersten Bauwerke (Kräuterkate bis Quellschrein).
2. **Weiler:** Schmiede, Kartenstube, Alchemistenturm (nach den ersten Mondwenden).
3. **Marktflecken:** Greifenhorst, Runenhalle; Marktnacht und Lichterfeste (P7).
4. **Tal der Lichter:** Sternwarte; Lange Nacht (P10).
5. **Angrenzende Lande:** 50 Regionen in Wellen (P9, `regionen.md`).

## Zeit

- **Mondwende** (Prestige 1): Der Mond dreht sich, das Tal ruht, du beginnst neu.
- **Lange Nacht** (Prestige 2): eine Nacht, die Tage dauert.
- **Zeitalter** (Prestige 3): Du gibst die Wacht weiter.

Kalender-Feste folgen dem realen Kalender, mit eigenen Fantasy-Namen und ohne Bezug auf reale religiöse Feste (P7).
