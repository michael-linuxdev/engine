# Prestige-Schichten und Meta-Laden

## Schichten (ADR 0005)

`def.prestigeLayers` ist von innen nach außen geordnet. Index 0 ist die häufigste Schicht. IDs werden nur angehängt.

```ts
{
  id: 'moonturn', currency: 'runeShards',
  gate:   { base: 25e6, growth: 3.2, knee: 13, lateGrowth: 1.12 },
  probe:  { gate: 5e6, payout: 70 },          // allererster Lauf
  payout: { base: 100, growth: 1.12, sqrtCap: 4 },
  minimum: { producersOnline: 3, producersFromCount: 1, lowerRuns: 0 },
}
```

Die Schwelle wächst bis zum Knie (`knee`) mit `growth`, danach mit `lateGrowth`. Optional flachen weitere Knicke sie später noch einmal ab: `gate.bends: [{ from: 32, growth: 1.2 }, …]` (aufsteigend nach `from`; ab Lauf `from` gilt deren `growth`).

| Begriff | Bedeutung |
|---|---|
| `layers[k].count` | Läufe dieser Schicht insgesamt (für Freischalt-Tore) |
| `layers[k].sinceReset` | Läufe seit dem letzten Reset einer höheren Schicht. Das ist `p` in der Schwelle. |
| `layers[k].runEarned` | Primär-Währung seit dem letzten Reset einer Schicht ≥ k (Messgröße) |
| Probe | Gilt nur, solange diese Schicht und alle höheren noch nie liefen |
| `block` | `earned` (Schwelle), `producers` (zu wenige aktiv), `lowerRuns` (zu wenige Läufe der Schicht darunter) |

`layerStatus(world, layer)` liefert Schwelle, Fortschritt, Auszahlung und Sperrgrund für die UI.

## Ablauf eines Prestige

1. Prüfung (`prestigePayout` > 0).
2. Jedes Modul wendet seine Reset-Regel `resetOn[layer]` an. Die Welt-Sicht ist dabei die **vor** dem Reset, so wirken Startboni (`start.producer:<id>`, `start.primary`).
3. Im Kern: `primary` wird `max(startPrimary, start.primary)`, `primaryRun` wird 0.
4. Die Währungen mit `resetOn` enthalten die Schicht → 0.
5. Auszahlung in die Schicht-Währung, Ereignis `prestige.performed`.

## Meta-Laden

Gegenstände sind Daten (`def.metaShop`):

```ts
{ id: 'shears', currency: 'runeShards', branch: 'yield', maxRank: 40,
  cost: { base: 25, growth: 1.3 },
  effects: [{ target: 'rate:*', kind: 'mulLinear', perRank: 0.05 }],
  unlock: { tip: 'immediate', offset: 0 } }
```

- **Effekt-Arten:**
  - `add`: perRank · Rang;
  - `mulLinear`: 1 + perRank · Rang;
  - `mulCompound`: perRank^Rang.
- **Freischaltung beim Wiederaufbau:** Der Fortschritt ist Σ Erzeuger-Stufen · `perProducerLevel` + min(`primaryCap`, √(primaryRun / `primarySqrtDiv`)). Der Bedarf eines Rangs folgt `firstRankBase`/`rankBase`/`rankStep`/`rankStepGrowth` plus dem Versatz `offset` des Gegenstands, abzüglich `perPrestige` · Läufe. Mit `linear` gilt eine eigene Kurve.
- **Empfehlungs-Band (Tip):**
  - `immediate`: Die ersten `max(1, Läufe)` Ränge sind sofort offen.
  - `wave2`: ab dem 2. Lauf, einen Rang weniger.
  - `free`: immer offen.
- **Hilfen für die UI:** `nextLockedMeta`, `countAffordableMeta`, `canBuyMeta`.

## Meilensteine je Schicht

`PrestigeLayerDef.milestones`: Liste aus `{ at, reward?, bonus? }`. Erreicht die Zahl der Läufe einer Schicht `at`, gibt es die Belohnung einmal (Ereignis `prestige.milestone`) und `bonus` dauerhaft auf jeden Ertrag (Effekt `effect.layerMilestones`). Alles folgt aus der gespeicherten Zahl der Läufe, es gibt kein eigenes Feld. Die Liste darf deshalb später wachsen; ein alter Stand, der einen Meilenstein schon hinter sich hat, bekommt den Bonus sofort, die Belohnung aber nicht nachträglich. Abfrage: `layerMilestones(world, layer)`.
