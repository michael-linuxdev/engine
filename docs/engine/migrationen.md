# Migrationen

Drei Ketten, jede in der Form `MIGRATIONS[v]: v → v + 1`:

| Ebene | Version | Kette | Arbeitet auf |
|---|---|---|---|
| Hülle | `engineVersion` | `ENGINE_MIGRATIONS` (`save/envelope.ts`) | ganze Hülle |
| Spielinhalt | `contentVersion` | `def.contentMigrations` | ganze Hülle (darf zwischen Modulen umziehen) |
| Modul | `modules.<id>.v` | `module.migrations` | `data` des Ausschnitts |

Reihenfolge beim Laden: Hülle → Inhalt → Module → Parser.

## Ablauf bei einer inkompatiblen Änderung

1. Die passende Version erhöhen und einen Schritt `MIGRATIONS[alt]` ergänzen. Felder nie still umbenennen oder entfernen.
2. Einen **echten** Stand der alten Version als Fixture ablegen. `node tools/fixture-make.mjs <spiel>` legt `save-v<contentVersion>.json` und `.expect.json` an und überschreibt nie.
3. `npm test`: Der Fixture-Läufer lädt alle `save-v*.json` und prüft die Erwartungswerte.
4. Die Erwartungen bleiben inhaltlich gleich. Verschiebt eine Migration ein Feld, ändert sich nur der Pfad in `.expect.json`, der Wert nie.

## Neue Felder

Neue Felder brauchen keine Migration. Der tolerante Parser setzt den Startwert ein. Die Speicher-Abdeckung prüft, dass das Feld gespeichert wird.

## IDs

`games/<spiel>/ids.lock.json` listet alle gespeicherten Inhalts-IDs (Module, Währungen, Erzeuger, Schichten, Meta-Gegenstände und Spiel-IDs aus `extraIds`). `npm run ids:update` trägt neue IDs ein und bricht ab, wenn eine fehlt. Entfernen ist nie erlaubt.
