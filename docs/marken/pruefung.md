# Prüfprotokoll Eigennamen

Jeder Eintrag in `games/<spiel>/src/content/names.ts` hat hier eine Zeile (`test/content.test.ts` prüft das).

**Status:**
- `ungeprüft`: Kurz-Websuche ohne Treffer, aber noch keine Markenrecherche.
- `frei`: Markenrecherche ohne Konflikt.
- `konflikt`: Treffer, sofort ersetzen.

Der Store-Start ist gesperrt, solange ein Name nicht `frei` ist (`DISTRIBUTION === 'store'` → Test).

**Quellen für die volle Prüfung:** DPMA (DPMAregister), EUIPO (eSearch plus), WIPO Global Brand Database, USPTO (Trademark Search), App Store, Google Play, Steam, itch.io, allgemeine Websuche.

## Lichtwarte

| id | de | en | Art | Datum | Geprüfte Quellen | Ergebnis | Status |
|---|---|---|---|---|---|---|---|
| title | Lichtwarte | Beaconwatch | Titel | 2026-11-09 | Websuche (Spiel/App) | Kein Spiel und keine App mit diesem Namen gefunden. Nur ähnlich: „Lichtspeer“, „Beacon Patrol“. Markenregister noch offen. | ungeprüft |
| valley | Dämmertal | Duskvale | Ort | 2026-11-09 | Websuche | Kein Treffer. Ähnlich: „Duskwood“ (itch.io), „Duskenvald“ (Rollenspiel-Welt). | ungeprüft |
| warden | Alwine | Alwine | Figur | 2026-11-09 | — | Gewöhnlicher Vorname, kein Werkbezug | ungeprüft |
| apprentice | Fenno | Fenno | Figur | 2026-11-09 | — | Gewöhnlicher (friesischer) Vorname | ungeprüft |
| glimmer | Glimmer | Glimmer | Währung | 2026-11-09 | Websuche | Gattungswort (Mineral, Schimmer) | ungeprüft |
| runeShards | Runensplitter | Rune Shards | Währung | 2026-11-09 | Websuche | Kein Spieltitel. Gattungswörter. | ungeprüft |
| glowPebbles | Lichtkiesel | Glowpebbles | Währung | 2026-11-09 | Websuche | Nur Spielzeug „Glow Pebbles“ (Gattungsbezeichnung), kein Spiel. **Ersetzt „Mondperlen/Moonpearls“**, weil „Moon Pearls“ ein Gegenstand in Bayonetta 3 ist. | ungeprüft |
| nightDew | Nachttau | Nightdew | Währung | 2026-11-09 | Websuche | Kein Treffer. **Ersetzt „Nachtsilber/Nightsilver“**, weil „Nightsilver Woods“ ein Ort in Dota 2 ist (Konflikt). | ungeprüft |
| forebearLight | Ahnenlicht | Forebear Light | Währung | 2026-11-09 | Websuche | Kein Treffer. Ähnlich, aber verschieden: „Ancient Light“ (Sky). Bewusst nicht „Ancestral Light“. | ungeprüft |
| moonturn | Mondwende | Moonturn | Schicht | 2026-11-09 | Websuche | Kein Spiel-, Buch- oder Markentreffer | ungeprüft |
| longNight | Lange Nacht | Long Night | Schicht | 2026-11-09 | Websuche | Gattungsausdruck (u. a. Episodentitel einer Serie). Als Fachbegriff im Spiel unbedenklich, Markenprüfung offen. | ungeprüft |
| ages | Zeitalter | Ages | Schicht | 2026-11-09 | — | Gattungswort | ungeprüft |
| archive | Archiv der Wächter | Wardens' Archive | System | 2026-11-09 | — | Gattungswörter | ungeprüft |
| sparkCall | Funkenruf | Spark Call | System | 2026-11-09 | — | Gattungswörter | ungeprüft |
| wardenRank | Wächterrang | Warden Rank | System | 2026-11-09 | — | Gattungswörter | ungeprüft |
| chronicle | Chronik der Wächterin | The Warden's Chronicle | System | 2026-11-09 | — | Gattungswörter | ungeprüft |
| watchRound | Wachrunde | Watch Round | System | 2026-11-09 | Websuche | Websuche (idle game): kein Treffer | ungeprüft |
| errands | Aufträge | Errands | System | 2026-11-09 | — | Gattungswort | ungeprüft |
| deeds | Taten | Deeds | System | 2026-11-09 | — | Gattungswort | ungeprüft |
| trials | Prüfungen | Trials | System | 2026-11-09 | — | Gattungswort | ungeprüft |
| marketNight | Marktnacht | Market Night | System | 2026-11-09 | Websuche | Websuche: kein Spiel dieses Namens; ähnlich ein Steam-Idle mit „night market“ (anderer Name) | ungeprüft |
| starWindow | Sternfenster | Star Window | System | 2026-11-09 | Websuche | Websuche: kein Treffer | ungeprüft |
| starWheel | Sternenrad | Star Wheel | System | 2026-11-09 | Websuche | Websuche: kein Spiel; ersetzt das geschützte TV-Format für das Rad | ungeprüft |
| fireRoad | Feuerstraße | Road of Fires | System | 2026-11-11 | Websuche | „Feuerstraße“: kein Spiel, keine Marke gefunden. Englisch nicht „Fire Road“ (kleines Tower-Defense-Spiel auf Steam und ein Browser-Läufer dieses Namens); „Road of Fires“: kein Treffer. | ungeprüft |
| skyChart | Himmelskarte | Sky Chart | System | 2026-11-11 | Websuche | Gattungswort (Sternkarte). Kommt als Beschreibung vieler Sternen-Apps vor, kein Spiel dieses Namens gefunden. | ungeprüft |
| festivalsOfLight | Lichterfeste | Festivals of Light | System | 2026-11-09 | — | Gattungsausdruck; kein Bezug zu einem bestimmten religiösen Fest | ungeprüft |
| festHoarfrost | Raureifnächte | Hoarfrost Nights | Fest | 2026-11-09 | — | Gattungswörter | ungeprüft |
| festSnowdrop | Schneeglöckchentage | Snowdrop Days | Fest | 2026-11-09 | — | Gattungswörter | ungeprüft |
| festBudding | Knospenfest | Budding Fair | Fest | 2026-11-09 | — | Gattungswörter | ungeprüft |
| festBlossomRound | Blütenreigen | Blossom Round | Fest | 2026-11-09 | — | Gattungswörter | ungeprüft |
| festMidsummerGlow | Mittsommerglanz | Midsummer Glow | Fest | 2026-11-09 | — | Gattungswörter (Jahreszeit, kein Kirchenfest) | ungeprüft |
| festFirefly | Glühwürmchennächte | Firefly Nights | Fest | 2026-11-09 | — | Gattungswörter | ungeprüft |
| festLantern | Laternenherbst | Lantern Autumn | Fest | 2026-11-09 | Websuche | „Lantern Moon (Festival)“ ist ein traditioneller Festname → ersetzt | ungeprüft |
| festMistMoon | Nebelmond | Mist Moon | Fest | 2026-11-09 | — | Gattungswörter | ungeprüft |
| festLongLight | Fest des langen Lichts | Feast of the Long Light | Fest | 2026-11-09 | — | Gattungswörter (Wintersonnenwende, ohne religiösen Bezug) | ungeprüft |
| festWeek | Festwoche | Festival Week | System | 2026-11-10 | Websuche | Gattungsausdruck (Festwoche einer Stadt). Kein Spiel- oder Markentreffer für „Festival Week Plus“. | ungeprüft |
| wardenCircle | Wächterzirkel | Warden Circle | System | 2026-11-10 | Websuche | Kein Spieltitel „Warden Circle“ gefunden. Nur „Warden Defense“, „The Warden’s Rite“ (verschieden). | ungeprüft |
| lampOil | Leuchtöl | Lamp Oil | Gegenstand | 2026-11-10 | Websuche | Gattungswort | ungeprüft |
| styleDuskBlue | Dämmerblau | Dusk Blue | Gegenstand | 2026-11-10 | Websuche | Farbname, Gattungswort | ungeprüft |
| styleEmberRed | Glutrot | Ember Red | Gegenstand | 2026-11-10 | Websuche | Farbname, Gattungswort | ungeprüft |
| styleIceBlue | Eisblau | Ice Blue | Gegenstand | 2026-11-10 | Websuche | Farbname, Gattungswort | ungeprüft |
| styleAmber | Bernstein | Amber | Gegenstand | 2026-11-10 | Websuche | Gattungswort (Material, Farbe) | ungeprüft |
| styleBudWreath | Knospenkranz | Bud Wreath | Gegenstand | 2026-11-10 | Websuche | Kein Treffer als Spielgegenstand | ungeprüft |
| styleSolsticeSheen | Sonnwendschein | Solstice Sheen | Gegenstand | 2026-11-10 | Websuche | Kein Treffer. **Statt „Mittsommerkrone/Midsummer Crown“**, das ein Gegenstand in Valheim ist. | ungeprüft |
| styleLanternParade | Laternenzug | Lantern Parade | Gegenstand | 2026-11-10 | Websuche | Gattungsausdruck (Brauch). Kein Spielgegenstand. | ungeprüft |
| styleStarOfLights | Lichterstern | Star of Lights | Gegenstand | 2026-11-10 | Websuche | Kein Treffer als Spielgegenstand | ungeprüft |

## Beschreibende Gattungsnamen (ohne Einzelzeile)

Die folgenden Inhalte tragen beschreibende Namen aus Gattungswörtern, zum Beispiel „Glimmertee“, „Moossteinmann“, „Flussbrücke“, „Der Kräuterstern“ oder „Fuchs“. Sie gelten nicht als Eigennamen im Sinne des Registers. Der Namens-Wächter prüft sie trotzdem gegen die Denylist, und vor dem Store-Start werden sie einmal gesammelt per Websuche geprüft.

| Bereich | Anzahl | Quelle |
|---|---:|---|
| Bestiarium & Kräuterkunde (Kräuter, Steine, Wesen, Festschätze, Tränke) | 49 | `games/lichtwarte/src/i18n/*.ts` → `world.entries` |
| Talgäste (Tiere und Sagengestalten als Gattungswort) | 12 | `world.guests` |
| Banner & Steine | 16 | `world.decor` |
| Jahreskreis-Folio-Ziele | 12 | `world.folio` |
| Sternbilder | 12 | `world.cards` |
| Omen | 3 | `world.omens` |
| Großwerke | 6 | `world.works` |
| Taten, Aufträge, Prüfungen, Fest-Laden, Sternenrad-Felder | 12 + 6 + 3 + 3 + 4 | `watch.*` |

## Verworfene Namen

| Name | Grund |
|---|---|
| Nachtsilber / Nightsilver | „Nightsilver Woods“ (Dota 2) |
| Mondperlen / Moonpearls | „Moon Pearls“ (Gegenstand in Bayonetta 3) |
| Ancestral Light | zu nah an „Ancient Light“ (Sky: Children of the Light) |
| Fire Road | Spieltitel (Tower Defense auf Steam, Browser-Läufer) → Road of Fires |
| Schicksalsrad / Wheel of Fortune | geschütztes TV-Format → Sternenrad / Star Wheel |
| Laternenmond / Lantern Moon | traditioneller Festname (Mondfest) → Laternenherbst / Lantern Autumn |
| Mittsommerkrone / Midsummer Crown | Gegenstand in Valheim → Sonnwendschein / Solstice Sheen |
