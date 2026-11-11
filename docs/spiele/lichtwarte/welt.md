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

## Buch 2 · Der Weg der Feuer (Jahr 2)

Frage des Buchs: **Wer hat die anderen Feuer entzündet?** 40 Seiten in fünf Kapiteln, Deutsch und Englisch.

| Kapitel | Inhalt |
|---|---|
| 1 · Über der Baumgrenze | Hinter der Himmelswarte geht der Weg weiter. Alwine steigt in die Hochlande und findet Spuren einer älteren Wacht: die Laterne an der Treppe, die Feuerschale im See, den Wacholder in Reihe. |
| 2 · Spuren im Stein | Die Brücke, an der jemand von drüben mitbaut. Der zwanzigste Stein, der ein Feuer war. Der Laternendeckel im Adlerhorst. |
| 3 · Die Feuer der anderen | Oben brennen drei Feuer, die niemand von uns entzündet hat. Ein Schlüssel mit vier Zacken. Die Kerze im Kloster brennt seit 211 Jahren. |
| 4 · Der kalte Ofen | Die Feuer laufen den Grat entlang und auf der anderen Seite hinunter: Wer sie baute, kam zu uns. Die Kette antwortet in den Zeichen, die Fenno vom Turm gibt. |
| 5 · Die Erste Warte | Am Kalten Ofen wurden alle Laternen gemacht. Am Grenzstein stehen zwei Zeichen. Unter der dritten Stufe der Ersten Warte liegt ein Schlüssel und der Satz von der allerersten Seite der Chronik. |

**Antwort:** Niemand allein. Eine Wacht hat angefangen, eine hat weitergemacht, eine hat den Schlüssel unter die Stufe gelegt. Jenseits der Hochlande gibt es eine zweite Wacht (Laterne mit vier Strahlen), die ihre Feuer nie ausgehen ließ. Das ist der Aufbruch für Buch 3.

**Stimmen:** Seiten aus den Hochlanden schreibt Alwine (Chronik oder Brief). Seiten vom Turm (Fenno, die Kette von unten) schreibt die Wacht selbst.

**Wie die Seiten aufgehen:** 25 mit je einem Hochland, 10 mit Stufen der Feuerstraße (1, 3, 8, 12, 16, 22, 28, 36, 45, 60), 5 mit der längsten Kette (3, 8, 13, 18, 24). Im Inhaltsverzeichnis steht Buch 2 bis zum ersten Hochland nur als eine Zeile.

## Buch 3 · Die tiefe Zeit (Jahr 3)

Frage des Buchs: **Was sah die Sternwarte, bevor die Sterne fehlten?** 40 Seiten in fünf Kapiteln, Deutsch und Englisch.

| Kapitel | Inhalt |
|---|---|
| 1 · Der andere Hang | Alwine und Fenno steigen jenseits der Ersten Warte ab. Die Wacht bleibt und beginnt in der Sternwarte eine Himmelskarte. Am Rand steht ein „Stern“, der im Wind flackert. |
| 2 · Lichter am Wasser | An der Küste: dreihundert Laternen, die niemand anzündet, eine Liste erloschener Feuer. Die alte Karte der Sternwarte hat am Rand einen Kranz gelber Sterne. |
| 3 · Zwei Listen | Die flackernden Sterne stehen nicht am Himmel, sondern hinter dem Grat: Es sind die Feuer der Küste. Was vor einer Langen Nacht „fehlt“, sind keine Sterne. |
| 4 · Die tiefe Zeit | Die Seekarten zeigen die Küste über Jahrhunderte: Die Feuer werden weniger und wieder mehr, als atme sie. Ein Zeitalter ist ein Atemzug. Die älteste Karte zeigt einen geschlossenen Ring. |
| 5 · Vier Strahlen | Die Laterne mit vier Strahlen meint vier Feuer, die nie ausgehen dürfen; das vierte ist unser Tal. In der Warte der vier Strahlen hält ein Mädchen in Fennos Alter das Feuer allein. |

**Antwort:** Nachbarn. Die „Sterne am Rand“ waren immer die Lichter anderer Wachten; die Lange Nacht ist der Moment, in dem zu viele davon erloschen sind. Aufbruch für Buch 4 („Die Lehrlinge“): Alwine und Fenno bleiben den Winter über und lehren das Mädchen.

**Stimmen:** Briefe von Alwine, Briefe von Fenno (neu, eigene Unterschrift), Seiten der Wacht aus der Sternwarte.

**Wie die Seiten aufgehen:** 25 mit je einem Küstenland, 8 mit Sternen der Himmelskarte (1, 4, 9, 14, 20, 28, 34, 43), 7 mit vollständigen Sternbildern (1, 2, 3, 5, 7, 9, 12). Die Zahlen in den Texten folgen diesen Schwellen.

## Buch 4 · Die Lehrlinge (Jahr 4)

Frage des Buchs: **Wem gibt man eine Wacht?** 40 Seiten in fünf Kapiteln, Deutsch und Englisch.

| Kapitel | Inhalt |
|---|---|
| 1 · Die Schulinsel | Alwine, Fenno und das Mädchen vom Damm fahren ins Inselmeer und finden eine Schule ohne Schüler. Im Tal bildet die Wacht ihren ersten Lehrling aus und merkt, wie wenig sie über die eigene Arbeit sagen kann. |
| 2 · Wer kommt | Niemand kommt, weil er eine Wacht haben will. Sie kommen, weil sie eine gesehen haben. Auf einer Insel weit draußen wächst die saure Apfelsorte aus dem Tal: Wer vor 211 Jahren den Berg hinaufging, kam von hier. |
| 3 · Was man nicht lehren kann | Geschick lässt sich lehren, das Hinübersehen zum Nachbarn nicht. Auf der Stillen Insel gibt es dreißig Laternenzeichen statt drei („Ich sehe dich“, „Schlaf ruhig, ich bin wach“). Das erste Feuer eines Lehrlings fällt aus, der Nachbar ruft hinüber. |
| 4 · Namen | Vierzig unbeantwortete Briefe „an die Wacht“; die zwölfte Schülerin ist zweiundsechzig. Eine Wacht ist kein Turm: Laterne im Baum, auf dem Boot, am Drachen. Die Wacht kennt jedes Feuer und den, der es hält. |
| 5 · Die Neue Warte | Die Insel der Namen (ein Stein für jede Wacht, einer ist leer), ein Licht hinter der Äußersten Insel, das nicht antwortet, und ein fertiger Turm, der nie gebrannt hat: „Für die Erste, die bleibt.“ Das Mädchen vom Damm und Fenno halten ihn gemeinsam. |

**Antwort:** Dem, der bleibt, und der am Morgen jemandem zeigen will, dass sie noch brennt. Alwine kündigt an, nach Hause zu kommen. Aufbruch für Buch 5: das Licht weit draußen.

**Stimmen:** Briefe von Alwine und Fenno aus dem Inselmeer, Seiten der Wacht aus der Küche der Warte. Das Mädchen vom Damm bekommt bewusst keinen Namen („die vom Damm“).

**Wie die Seiten aufgehen:** 25 mit je einer Insel, 8 mit ausgebildeten Lehrlingen (1, 2, 4, 6, 9, 12, 16, 20), 7 mit Lehrlingen in einem eigenen Land (1, 3, 5, 8, 11, 15, 19).

## Buch 5 · Das große Licht (Jahr 5)

Frage des Buchs: **Was geschieht, wenn alle Feuer zugleich brennen?** 40 Seiten in fünf Kapiteln, Deutsch und Englisch.

| Kapitel | Inhalt |
|---|---|
| 1 · Hinter der Karte | Alwine war einen Winter zu Hause; dann hat das Licht weit draußen geantwortet, und sie fährt wieder. Aus der Mitte der Karte kommt die Bitte um einen Stein aus jedem Land. Der Stein des Tals ist der von der dritten Stufe. |
| 2 · Fremde Feuer | Draußen kennt man die Wacht schon („Es ist heller geworden da hinten“). Unter den Steinen liegt ein roter, den kein eigenes Land geschickt hat: vier Strahlen und ein fünfter. Von der Bojenkette lernt die Feuerstraße, dass Nachbarn doppelt brennen, wenn eines ausfällt. |
| 3 · Ein Stein aus jedem Land | Die Fremde Küste hat drei Wörter für „Wacht“ und keines für „allein“. Der Turm gehört allen, die gegeben haben, und keinem mehr als dem kleinsten Land. Wer einmal nicht geben kann, fehlt nicht. |
| 4 · Tausend Lampen | Zwölf Windtürme ergeben einen dreizehnten Ton, den niemand gebaut hat. Die Rechenmeisterin: Brennen genug Feuer, sieht man von jedem zwei andere, und es gibt keinen dunklen Weg mehr zwischen zwei Menschen. Das Feuer oben bekommt keinen Vorrat; jedes Land bringt sein Holz jedes Jahr selbst. Fenno fährt heim zur Neuen Warte. |
| 5 · Das große Licht | Im Haus der Ganzen Karte brennt für das Tal die älteste Kerze. Die letzte Stufe wird gesetzt, alle Feuer brennen, und hinter dem Rand antwortet eine ganze Kette. Alwine bleibt beim Leuchtfeuer. Die Wacht legt den Schlüssel wieder unter die dritte Stufe, mit dem Zettel vom Anfang. |

**Antwort:** Man sieht, dass man nie die Einzigen war. Dahinter beginnt eine Karte, die noch niemand gezeichnet hat (Aufbruch für spätere Jahre). Das Ende schließt an die erste Seite von Buch 1 an („Für wen auch immer“).

**Stimmen:** Briefe von Alwine, Briefe von Fenno (er und das Mädchen vom Damm wechseln sich an der Neuen Warte ab), Seiten der Wacht.

**Wie die Seiten aufgehen:** 25 mit je einem Land am Rand der Karte, 15 mit Stufen des Großen Leuchtfeuers (1, 2, 3, 5, 7, 9, 11, 13, 15, 18, 21, 24, 27, 29, 30). Die letzte Seite geht mit der dreißigsten Stufe auf.

**Abweichung vom ersten Plan:** Die Lange Nacht kehrt in Buch 5 nicht zurück. Das Buch erzählt den Bau und das Licht von draußen; die dunklen Jahre kommen als Erinnerung vor (Walweg, Steinerner Wald, die Kerze im Haus der Ganzen Karte).
