# Kunststil: Holzschnitt trifft Aquarell

- **Konturen:** dunkle, warme Konturen (`outline #3b2b24`) in genau drei Strichstärken: fein 1, Haupt 1,75, kräftig 2,5 (`art/stroke.ts`).
- **Flächen:** gedeckt und warm, Dämmerfarben. Holz, Stein, Reet und Schiefer.
- **Licht:** sparsame Lichtakzente (`glow`, `glowSoft`, `glowHot`). Abends und nachts leuchten die Fenster.
- **Licht und Schatten:** Jede Fläche hat eine Lichtseite (links) und eine Schattenseite (rechts), dazu einen Schlagschatten am Boden.
- **Lasur:** Die Tageszeit liegt als halbtransparente Fläche über dem Land (`SHADE`), nie über dem Himmel. Die Jahreszeit färbt Boden und Laub (`GROUND`, `FOLIAGE`). Im Winter liegt Schnee.
- **Lichter über der Lasur:** Abends und nachts liegen Leuchtfeuer, Laternen und der Schein der stehenden Bauwerke *über* der Lasur (`Lights`). So leuchtet das Tal wirklich, statt mit abgedunkelt zu werden.
- **Himmel:** drei Farbstufen je Tageszeit (`SKY3`), Sonne oder Mond mit Hof, Sterne, Wolken, im Winter nachts ein Polarlicht. Drei Bergketten in Luftperspektive (`RANGES`).
- **Leben:** Glühwürmchen, Vögel, Falter, Rauch, wehende Banner, fließender Bach, aufsteigender Glimmer über jedem stehenden Bauwerk, der Lehrling auf dem Weg, der Talgast (`art/life.tsx`). Alle Bewegung kommt aus dem CSS und ruht bei „Bewegung reduzieren“.
- **Schrift:** Alegreya (OFL) für Überschriften, Schilder und die Chronik; Fließtext der Bedienung in der Systemschrift.
- **Kein Nachbau** eines bekannten Spiel-Looks. Keine Fremd-Assets, alles ist handgebautes SVG.

## Technik

- **Palette:** `games/lichtwarte/src/art/palette.ts` ist die einzige Datei mit Farbwerten. `hex-allow.json` listet sie, und der Test verbietet jede andere Farbe in `art/`, `scene/` und dem App-Icon.
- **Bauwerke:** `art/buildings.tsx`, je Stufe 1–4. Stufe 0 ist Wildnis (`parts.tsx` → `Wilds`). Die Stufen gelten ab Level 1/10/25/50 (`art/registry.ts`).
- **Maßtabelle:** Fußpunkt (0, 0). Ein Bauwerk ist etwa 50 breit und 30–100 hoch. Die Lehrlingsfigur ist 24 hoch und damit das Maß. Auf der Karte gilt Maßstab ×1,5 und Tiefe 0,82–1,08.
- **Talkarte:** `scene/ValleyMap.tsx`. Die SVG-Szene ist 360 × 640 und füllt den Bildschirm. Die Bühne hängt am unteren Rand: Hohe Bildschirme zeigen mehr Himmel, niedrige schneiden oben Himmel ab, nie ein Bauwerk. Kopfzeile und Hinweise schweben über der Karte, der Funkenruf ist der runde Knopf unten in der Mitte. Darüber liegen HTML-Knöpfe je Platz (Tastatur, Screenreader, ≥ 44 px).
- **Weg und Warte:** Der Weg schlängelt sich vom Tor hinauf zur Warte (`trailX`), mit einem Abzweig und einer Laterne je Bauwerk (`LANTERNS`).
- **Variation:** mit Seed (`@engine/art` → `seeded`), gleich auf jedem Gerät.
- **Stimmungen:** Tageszeit × Jahreszeit (16). `?ambient=night-winter` erzwingt eine.
- **Prüfung:** `?artsheet` zeigt alle Bauwerke × Stufen 0–4 × 4 Stimmungen, `?artsheet=map` die Talkarte. `npm run art:update` erneuert die Vergleichsbilder. Das Budget liegt bei 1.500 SVG-Elementen in der Hauptszene, heute sind es etwa 680–790.
