# 0002 — Zahlentyp `Num` = Double bis 1e300

**Kontext.** Idle-Spiele wachsen exponentiell. Das Referenz-Spiel nutzt `number` und kam damit gut aus. Seine Werte liegen bei voll ausgebautem Spiel bei etwa 1e20 bis 1e40. Big-Number-Bibliotheken kosten Leistung im Takt und erschweren das Speichern.

**Entscheidung.** `Num = number` (IEEE-754-Double), gekapselt in `packages/engine/src/num.ts`:

- Obergrenze `MAX_NUM = 1e300`. Jeder Wert, der in den Zustand gelangt, wird auf [0, MAX_NUM] begrenzt (`clampNum`, `addNum`, `mulNum`, `powNum`). Kosten über MAX_NUM gelten als „nicht bezahlbar“.
- Grund: `JSON.stringify(Infinity)` ergibt `null`, und `null` würde beim Laden zu 0. Ein Spielstand darf nie `Infinity` enthalten.
- Formatierung (`format.ts`): benannte Kurzskalen je Sprache, danach zweistellige Gruppen-Codes (aa, ab …). Alle Werte bis 1e300 bleiben kurz.
- Tests: `core.test.ts` prüft die Formatierung bis 1e300, `producers.test.ts` Kosten bis zur Sättigung, `save.test.ts` das Speichern von 1e300.

**Alternativen.**
- `break_infinity`/`decimal.js`: Bei Werten bis 1e300 kein Bedarf. Sie kosten pro Tick Objekt-Zuweisungen und machen eigene JSON-Behandlung nötig.

**Folgen.**
- Der Inhalt muss so gestimmt sein, dass die Wirtschaft unter etwa 1e250 bleibt. Der Simulator meldet Werte über 1e200.
- Ein späterer Wechsel betrifft `num.ts`, die Formeln in `producers.ts`/`prestige.ts` und die Parser in `state.ts`. Die Formeln nutzen dafür schon heute nur die Helfer.
