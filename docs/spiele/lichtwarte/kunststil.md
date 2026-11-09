# Kunststil: Holzschnitt trifft Aquarell

- **Konturen:** dunkle, warme Konturen (`outline #3b2b24`) in genau drei Strichstärken: fein 1, Haupt 1,75, kräftig 2,5 (`art/stroke.ts`).
- **Flächen:** gedeckt und warm, Dämmerfarben. Holz, Stein, Reet und Schiefer.
- **Licht:** sparsame Lichtakzente (`glow`, `glowSoft`, `glowHot`). Abends und nachts leuchten die Fenster.
- **Lasur:** Die Tageszeit liegt als halbtransparente Fläche über der Szene (`SHADE`), die Jahreszeit färbt Boden und Laub (`GROUND`, `FOLIAGE`). Im Winter liegt Schnee.
- **Kein Nachbau** eines bekannten Spiel-Looks. Keine Fremd-Assets, alles ist handgebautes SVG.

## Technik

- **Palette:** `games/lichtwarte/src/art/palette.ts` ist die einzige Datei mit Farbwerten. `hex-allow.json` listet sie, und der Test verbietet jede andere Farbe in `art/`, `scene/` und dem App-Icon.
- **Bauwerke:** `art/buildings.tsx`, je Stufe 1–4. Stufe 0 ist Wildnis (`parts.tsx` → `Wilds`). Die Stufen gelten ab Level 1/10/25/50 (`art/registry.ts`).
- **Maßtabelle:** Fußpunkt (0, 0). Ein Bauwerk ist etwa 50 breit und 30–100 hoch. Die Lehrlingsfigur ist 24 hoch und damit das Maß. Auf der Karte gilt Maßstab ×1,6 und Tiefe 0,85–1,1.
- **Talkarte:** `scene/ValleyMap.tsx`. Die SVG-Szene ist 360 × 640, oben werden 110 abgeschnitten. Darüber liegen HTML-Knöpfe je Platz (Tastatur, Screenreader, ≥ 44 px).
- **Variation:** mit Seed (`@engine/art` → `seeded`), gleich auf jedem Gerät.
- **Stimmungen:** Tageszeit × Jahreszeit (16). `?ambient=night-winter` erzwingt eine.
- **Prüfung:** `?artsheet` zeigt alle Bauwerke × Stufen 0–4 × 4 Stimmungen, `?artsheet=map` die Talkarte. `npm run art:update` erneuert die Vergleichsbilder. Das Budget liegt bei 1.500 SVG-Elementen in der Hauptszene, heute sind es etwa 270–310.
