# 0005 — N Prestige-Schichten als Daten

**Kontext.** Das Referenz-Spiel hat drei Prestige-Schichten von Hand gebaut, je mit eigener Datei, eigenem Zustand und eigener UI. Eine vierte Schicht wäre erneut Handarbeit.

**Entscheidung.** `PrestigeLayerDef[]` in der Spieldefinition, geordnet von innen nach außen. Je Schicht gilt:

- **Schwelle:** `gate(p) = base · growth^min(p, knee) · lateGrowth^max(0, p − knee)`.
  - `p` zählt die Läufe dieser Schicht seit dem letzten Reset einer höheren Schicht.
  - Eine optionale Probe-Schwelle ersetzt Schwelle und Auszahlung für den allerersten Lauf.
- **Messgröße:** `runEarned[k]` ist die Primär-Währung, die seit dem letzten Reset einer Schicht ≥ k verdient wurde.
- **Auszahlung:** `payoutBase · payoutGrowth^p · f(verdient/gate)`. Dabei gilt `f = √r` bis `sqrtCap` (Standard 4), danach +0,5 je Verdopplung. Zusätzlich wirkt der Effekt `prestige.payout:<id>`.
- **Mindestbedingungen:** aktive Erzeuger (ab einer Zahl von Läufen) und Läufe der nächstniedrigeren Schicht.
- **Reset:** Jedes Modul legt mit `resetOn` je Schicht fest, was passiert: `'keep' | 'reset' | (s, layer, ctx, world) => s`. Die Engine führt den Reset für alle Module aus. Die Welt-Sicht stammt von **vor** dem Reset, so können Startboni aus dem Meta-Laden wirken. Danach zahlt sie aus.

**Alternativen.**
- Eine Klasse je Schicht: Wäre wieder Code statt Daten.

**Folgen.**
- Eine weitere Schicht bedeutet einen weiteren Eintrag (IDs nur anhängen).
- Die Freischalt-Tore der Erzeuger nutzen die Lebenszeit-Zählung, die Schwelle nutzt `sinceReset`. Nach einer höheren Schicht wird die niedrigere Schwelle also wieder leichter, freigeschaltete Bauwerke bleiben aber offen. Das ist eine Spielentscheidung und wird in P10 überprüft.
- Tests: drei Schichten nacheinander (`prestige.test.ts`).
