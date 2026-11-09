# Ein Engine-Modul schreiben

Ein Modul ist ein System mit eigenem Speicher-Ausschnitt. Beispiele: `packages/engine/src/modules/*.ts`.

```ts
export function fooModule(): EngineModule<FooState> {
  return {
    id: 'foo',            // Speicher-Schlüssel, nie umbenennen
    version: 1,           // Format des Ausschnitts
    migrations: {},       // migrations[v]: v → v + 1
    init: (ctx, def) => ({ … }),
    parse: (raw, ctx, def) => ({ … }),   // tolerant, wirft nie
    serialize: (s) => ({ … }),           // optional, Standard: s ohne `transient`
    transient: ['carryMs'],              // wird nie gespeichert
    derived: [],                         // wird beim Laden berechnet
    resetOn: 'keep' | 'reset' | fn | { l1: 'reset', '*': 'keep' },
    tick: (s, dtMs, ctx, world) => s,
    onOffline: (s, elapsedMs, ctx, world) => s,
    on: (s, event, ctx, world) => s,     // Ereignisse anderer Module
    effects: (s, view) => [ … ],         // EffectSource[]
    actions: { doIt: (s, payload, ctx, world) => s },
    playtestEvents: ['foo.done'],
    sample: (ctx, def) => ({ … }),       // reicher Zustand für die Speicher-Wächter
  }
}
```

## Regeln

1. **Rein:** keine Systemuhr, kein `Math.random`. Zeit kommt aus `ctx.clock.now()`, Zufall aus `ctx.rng`.
2. **Unveränderlich:** nie den Ausschnitt verändern, immer einen neuen zurückgeben. Wer nichts ändert, gibt **dasselbe Objekt** zurück, dann ist die Aktion ein No-op (`ok: false`).
3. **Nebenwirkungen über `act`:**
   ```ts
   return act(next, {
     spend: [{ currency, amount }],     // fehlt Geld, verwirft die Engine das ganze Ergebnis
     grant: [{ currency, amount, source }],
     events: [{ type: 'foo.done' }],
     dispatch: [{ module: 'producers', type: 'buy', payload: { … } }],
     prestige: 'layerId',
   })
   ```
   Module ändern nie direkt den Ausschnitt eines anderen Moduls. Sie nutzen `dispatch` (Aktion des anderen Moduls) oder Ereignisse (`on`).
4. **Ereignisse der Engine:**
   - `primary.gained` (amount, source), `currency.gained`, `currency.spent`;
   - `producer.bought` (id, count, level, cost, source);
   - `prestige.performed` (layer, payout), `level.up`, `burst.used`, `offline.claimed`, `surprise.found`, `meta.bought`, `branch.bought`, `helper.upgraded`.
5. **Effekte** hängen nur von Ausschnitten und der Definition ab, nie vom Kern. Sie werden je Ausschnitt-Satz zwischengespeichert.
6. **Parser** sind tolerant: Jedes Feld fällt bei Müll auf den Startwert zurück. Helfer: `parseNum`, `parseInt0`, `parseBool`, `parseStr`, `parseTime`, `parseNumRecord`.
7. **Reihenfolge:** Takt und Ereignisse laufen in der Reihenfolge von `def.modules`. `standardModules()` liefert die Engine-Module in fester Reihenfolge, Spiele hängen eigene dahinter an.
8. **Tests:** init, parse (Müll/fehlend), tick, offline, Reset je Schicht, Effekte, Aktionen, Randfälle (0, 1e300, negative Zeit, Uhr läuft rückwärts). Die Speicher-Wächter laufen automatisch für jedes Spiel, das das Modul nutzt.
