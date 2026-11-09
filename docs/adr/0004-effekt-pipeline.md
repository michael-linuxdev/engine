# 0004 — Eine Effekt-Pipeline (add → mul → pow) mit Aufschlüsselung

**Kontext.** Im Referenz-Spiel verteilten sich die Multiplikatoren auf viele Funktionen (`prestigeMultiplier`, Kapitel-Bonus, Wetter, Karten, Verein …). Die Aufschlüsselung im Boni-Fenster musste jede Quelle von Hand nachbauen.

**Entscheidung.**

- **Quellen:** Jedes Modul liefert über `effects(slice, view)` eine Liste von `EffectSource { id, target, op, value, labelKey }`.
- **Auflösung:** `resolve(target, base, sources)` wendet alle passenden Quellen in fester Reihenfolge an:
  - **add:** Summe zur Basis.
  - **mul:** Produkt.
  - **pow:** Exponent, zuletzt.
- **Platzhalter:** `rate:*` gilt für jedes `rate:<id>`.
- **Aufschlüsselung:** Neben dem Wert liefert `resolve` die einzelnen Anteile. Die UI zeigt sie mit `labelKey` an. Die Engine kennt keine Texte.
- **Ziele (offene Liste):**
  - `rate:*`, `rate:<erzeuger>`, `income` (auf die Summe), `cost:*`, `cost:<erzeuger>`;
  - `offline.softHours`, `offline.hardHours`;
  - `burst.seconds`, `burst.maxCharges`, `burst.rechargeMs`;
  - `prestige.payout:<schicht>`, `start.primary`, `start.producer:<id>`;
  - `helper.speed`, `surprise.chance`, `surprise.seconds`, `xp.mult`.
- **Cache:** Effekte hängen nur von den Modul-Ausschnitten ab, nicht vom Kern. Sie werden deshalb je Ausschnitt-Satz zwischengespeichert. Ein Tick, der nur den Kontostand ändert, rechnet die Effekte nicht neu.

**Alternativen.**
- Multiplikator-Funktionen je System: Die Referenz zeigte, dass sie schwer zu überblicken sind.
- Eine Formelsprache: Zu viel Aufwand für den Nutzen.

**Folgen.**
- Eine neue Bonusquelle bedeutet einen neuen Eintrag, keine neue Formel. Die Reihenfolge ist dokumentiert (`docs/engine/effekte.md`) und getestet.
