# 0001 — Ein Repo, npm-Workspaces, mehrere Spiele

**Kontext.** Das Referenz-Spiel ist ein einzelnes Vite-Projekt. Engine-Logik, Garten-Inhalt und Garten-Grafik liegen dort gemischt in `src/`. Zwei Themenwechsel haben gezeigt, wie teuer diese Mischung ist. Künftig sollen mehrere Spiele auf derselben Engine laufen.

**Entscheidung.** Ein Repo mit npm-Workspaces:

- `packages/engine` (`@engine/core`): reines TypeScript, ohne React und ohne DOM.
- `packages/engine-react`, `packages/ui-kit`, `packages/art-kit`, `packages/testing`.
- `games/<slug>`: je Spiel ein eigenes Vite-Projekt.
- `games/_vorlage`: Minimalspiel, das in der CI mitläuft.

Pakete werden nicht gebaut oder veröffentlicht. Sie exportieren ihre Quellen direkt (`exports: ./src/index.ts`). Typprüfung läuft über TypeScript-Projekt-Referenzen (`tsc -b`), Tests laufen in einem Vitest-Lauf mit Projekten je Paket.

**Alternativen.**
- Getrennte Repos je Paket: Versionierung und Releases bringen bei einem einzelnen Entwickler nur Reibung.
- Turborepo/Nx: Für diese Größe unnötig.
- Ein Paket mit Unterordnern: Die Grenze Engine/Spiel wäre dann nicht technisch erzwungen.

**Folgen.**
- Die Grenzen werden erzwungen. Die Engine hat `lib: ES2023` ohne DOM-Typen. `tests/architecture.test.ts` verbietet Importe aus `games/` und die Abhängigkeit der Engine von anderen Paketen.
- Ein neues Spiel ist ein neuer Ordner (`docs/engine/neues-spiel.md`).
- GitHub Pages veröffentlicht alle Spiele aus einem `dist/` (`tools/pages/assemble.mjs`).
