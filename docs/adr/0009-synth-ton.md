# 0009 — Synthetischer Ton statt Samples

**Kontext.** Keine Fremd-Assets, auch keine Klänge. Das Referenz-Spiel synthetisiert Effekte und Ambiente mit WebAudio.

**Entscheidung.**

- **Klänge als Daten:** Klang-Presets sind Daten (Hüllkurve, Oszillator, Filter, Rauschen). Abspielen und Ambiente-Schichten liegen in `@engine/react`, die Presets im Spiel.
- **Schalter:** Ton ist standardmäßig an, Ambiente aus. Beides ist abschaltbar und wird als Prefs gespeichert. Bei `prefers-reduced-motion` gibt es keine automatischen Ambiente-Wechsel.

**Folgen.**
- Ton und Ambiente sind Phase P12. Bis dahin gibt es nur die Schnittstelle und den Ton-Schalter.
