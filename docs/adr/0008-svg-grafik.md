# 0008 — Handgebautes SVG statt Bitmaps

**Kontext.** Fremd-Assets sind ausgeschlossen (Marken- und Lizenzrisiko). Das Referenz-Spiel baute seine Grafik aus SVG-Bausteinen mit Paletten-Allowlist und Pixelvergleich.

**Entscheidung.**

- **art-kit:** `@engine/art` liefert Raster, `Place`, Seeded-Variation, Stilregeln (Strichstärken, Maßtabelle), Stimmungen (Tageszeit × Jahreszeit) und einen Paletten-Wächter.
- **Spielgrafik:** Jedes Spiel baut seine Grafik als React-SVG-Komponenten mit eigener Palette (`hex-allow.json`).
- **Prüfung:** `?artsheet` zeigt alle Grafiken. `tools/e2e/art.mjs` vergleicht sie pixelgenau mit `tools/e2e/art-baseline/<spiel>/`. Die Hauptszene hat höchstens 1.500 SVG-Elemente.

**Alternativen.**
- PNG/WebP von Hand: Dafür bräuchte es Werkzeuge außerhalb des Repos.
- Canvas: Weniger zugänglich, Pixelvergleich und Screenshots wären schwerer.

**Folgen.**
- App-Icons und Store-Grafiken werden aus denselben Bausteinen gerendert (`tools/art`).
