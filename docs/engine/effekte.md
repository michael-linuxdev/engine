# Effekte

Jeder Bonus und Malus läuft durch **eine** Funktion: `resolve(target, base, sources)` in `packages/engine/src/effects.ts` (ADR 0004).

## Reihenfolge

1. **add**: Summe aller `add`-Werte zur Basis.
2. **mul**: Produkt aller `mul`-Werte.
3. **pow**: Exponenten, zuletzt.

`value = ((base + Σadd) · Πmul) ^ Πpow`. Werte, die nicht endlich sind, werden übersprungen. Das Ergebnis ist nie `Infinity`.

## Ziele

| Ziel | Basis | Wer setzt es (Beispiele) |
|---|---|---|
| `rate:<erzeuger>` / `rate:*` | r0 · n | Meilensteine (×2), Zweig-Effizienz, Spieler-Level, Meta-Laden |
| `income` | Summe aller Erzeuger | Buffs auf den Gesamtertrag |
| `cost:<erzeuger>` / `cost:*` | 1 (Faktor) | Zweig-Fassung, Meta-Laden |
| `offline.softHours`, `offline.hardHours` | 8 / 24 | Meta-Laden |
| `burst.seconds`, `burst.maxCharges`, `burst.rechargeMs` | Balance | Meta-Laden |
| `prestige.payout:<schicht>` | Rohauszahlung | Meta-Laden, Karten |
| `start.primary`, `start.producer:<id>` | 0 | Meta-Laden (Start nach dem Prestige) |
| `helper.speed`, `surprise.chance`, `surprise.seconds`, `xp.mult` | 1 / Balance | beliebig |

Neue Ziele brauchen keine Engine-Änderung. Es genügt eine Stelle, die `world.value('<ziel>', basis)` fragt.

## Aufschlüsselung

`explain(def, state, target, base)` liefert `{ base, value, parts[] }`. Jeder Teil trägt `labelKey` (i18n-Schlüssel) und `op`. Das Boni-Fenster der UI rendert diese Liste.
