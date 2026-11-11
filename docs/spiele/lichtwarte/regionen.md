# Lande (Regionen): Plan für 50

Engine-Modul `regions` (P9): eigene Unterwirtschaft mit eigener Währung, 10 Bereichen, Pflege (2 Arten × 10 Ränge), Figur, Intro und Öffnungszeit.
- IDs werden nur **angehängt** und ändern sich nie.
- `parseRegions` füllt neue Lande automatisch auf.
- Größen-Test: 50 voll ausgebaute Lande < 100 KB.

**Wellen:** Welle 1 = Lande 2–12, Welle 2 = Lande 13–23, Welle 3 = Lande 24–34 (Parität). Alle drei sind fertig. Lande 35–50 sind geplant und folgen später. Jede Welle bringt Grafik, Figur, Texte de/en, Chronik-Seiten und ein Großwerk über mehrere Lande.

**Namen sind Entwürfe (Status ungeprüft).** Erst beim Ausarbeiten einer Welle kommen sie in `names.ts` und `docs/marken/pruefung.md`, jeweils nach einer Websuche. Figuren tragen gewöhnliche Vornamen.

| Nr. | ID | Deutsch | English | Währung | Figur | Thema | Welle |
|---|---|---|---|---|---|---|---|
| 1 | `talwarte` | Talwarte | Dale Watch | Glimmer | Alwine | Die Hauptkarte: Turmwarte und zehn Bauwerke | Hauptkarte (P5) |
| 2 | `moorgrund` | Moorgrund | Fenmoor | Torflicht | Moorhüterin Ragna | Nebel, Stege, Irrlichter | Welle 1 ✓ |
| 3 | `kieselbach` | Kieselbach | Pebblebrook | Bachglanz | Müller Tewes | Mühlen und Furten | Welle 1 ✓ |
| 4 | `birkenhang` | Birkenhang | Birch Slope | Rindenfaser | Köhlerin Imke | Köhlerei und Harz | Welle 1 ✓ |
| 5 | `felsenkamm` | Felsenkamm | Rock Ridge | Kristallstaub | Steinmetz Oddo | Kristallhöhlen | Welle 1 ✓ |
| 6 | `heidegrund` | Heidegrund | Heathland | Heidehonig | Imkerin Swaantje | Bienen und Heide | Welle 1 ✓ |
| 7 | `schilfufer` | Schilfufer | Reedshore | Schilfrohr | Fährmann Lorenz | Fähren und Netze | Welle 1 ✓ |
| 8 | `apfelhain` | Apfelhain | Apple Grove | Apfelglut | Mosterin Wiebke | Obstwiesen | Welle 1 ✓ |
| 9 | `eulenwald` | Eulenwald | Owlwood | Federlicht | Waldhüter Bertil | Alte Eichen | Welle 1 ✓ |
| 10 | `salzquelle` | Salzquelle | Saltspring | Salzkristall | Siederin Hedda | Salinen | Welle 1 ✓ |
| 11 | `windmark` | Windmark | Windmark | Windhauch | Müllerin Edda | Windmühlen auf der Höhe | Welle 1 ✓ |
| 12 | `sternweiher` | Sternweiher | Star Pond | Spiegellicht | Sternseher Arvid | Spiegelnde Teiche | Welle 1 ✓ |
| 13 | `nebelpass` | Nebelpass | Mist Pass | Passglimmer | Säumer Jorin | Bogen I: Über den Pass | Welle 2 ✓ |
| 14 | `hochalm` | Hochalm | High Pasture | Almtau | Sennerin Gesa | Almen und Glocken | Welle 2 ✓ |
| 15 | `gletscherblick` | Gletscherblick | Glacier View | Eislicht | Bergführer Halvar | Eis und Spalten | Welle 2 ✓ |
| 16 | `tannengrat` | Tannengrat | Firridge | Harzglanz | Flößerin Mette | Flöße und Holz | Welle 2 ✓ |
| 17 | `murmelstein` | Murmelstein | Marmot Rock | Steinsalz | Hirte Tamme | Murmeltiere und Weiden | Welle 2 ✓ |
| 18 | `kristallgrotte` | Kristallgrotte | Crystal Grotto | Grottenlicht | Höhlenmalerin Liv | Bogen I Ende: Leuchtende Grotte | Welle 2 ✓ |
| 19 | `hangdorf` | Hangdorf | Hillside Hamlet | Dorfglut | Schulzin Frauke | Ein Dorf am Hang | Welle 2 ✓ |
| 20 | `talauen` | Talauen | Water Meadows | Auentau | Hirtin Telse | Flussauen | Welle 2 ✓ |
| 21 | `muehlenbach` | Mühlenbach | Millbrook | Mehlglanz | Bäcker Ubbo | Bogen II: Handwerk | Welle 2 ✓ |
| 22 | `toepferwinkel` | Töpferwinkel | Potter's Nook | Tonglanz | Töpferin Rieke | Lehm und Brennöfen | Welle 2 ✓ |
| 23 | `glaserhuette` | Glaserhütte | Glassworks | Glasfunken | Glasbläser Detlev | Bunte Scheiben | Welle 2 ✓ |
| 24 | `weberdorf` | Weberdorf | Weavers' Village | Garnlicht | Weberin Almut | Webstühle | Welle 3 ✓ |
| 25 | `faerberbach` | Färberbach | Dyers' Brook | Farbtropfen | Färber Kalle | Bunte Bäche | Welle 3 ✓ |
| 26 | `glockengiesserei` | Glockengießerei | Bell Foundry | Glockenklang | Gießerin Wanda | Glocken für das Tal | Welle 3 ✓ |
| 27 | `papiermuehle` | Papiermühle | Paper Mill | Bütten | Papiermacher Eike | Bücher der Chronik | Welle 3 ✓ |
| 28 | `uhrmacherturm` | Uhrmacherturm | Clockmaker's Tower | Zahnradglanz | Uhrmacherin Hiltrud | Zeit und Räder | Welle 3 ✓ |
| 29 | `brueckenstadt` | Brückenstadt | Bridgetown | Brückenzoll | Brückenmeister Gerd | Viele Brücken | Welle 3 ✓ |
| 30 | `markthafen` | Markthafen | Market Harbour | Hafenlicht | Hafenmeisterin Ylva | Bogen II Ende: Markt am Wasser | Welle 3 ✓ |
| 31 | `leuchtfeuer` | Leuchtfeuerküste | Beacon Coast | Küstenglanz | Feuerwärter Hinnerk | Bogen III: Die Küste | Welle 3 ✓ |
| 32 | `muschelbucht` | Muschelbucht | Shell Bay | Perlmutt | Taucherin Okka | Muscheln und Riffe | Welle 3 ✓ |
| 33 | `duenenland` | Dünenland | Dunelands | Sandglas | Strandvogt Fokko | Dünen und Strandhafer | Welle 3 ✓ |
| 34 | `seehundbank` | Seehundsbank | Seal Bank | Gischt | Wattführerin Kea | Watt und Seehunde | Welle 3 ✓ |
| 35 | `sturmkap` | Sturmkap | Storm Cape | Sturmfunken | Lotse Reimer | Wind und Wellen | Welle 4 ✓ |
| 36 | `nordlichtinsel` | Nordlichtinsel | Northlight Isle | Polarschimmer | Sternfischerin Inga | Nordlichter | Welle 4 ✓ |
| 37 | `bernsteinstrand` | Bernsteinstrand | Amber Strand | Bernstein | Sammler Momme | Bernstein im Sand | Welle 4 ✓ |
| 38 | `treibholzhafen` | Treibholzhafen | Driftwood Haven | Treibholz | Bootsbauerin Tjarda | Boote aus Treibholz | Welle 4 ✓ |
| 39 | `nebelinseln` | Nebelinseln | Mist Isles | Inselnebel | Einsiedler Brar | Verborgene Inseln | Welle 4 ✓ |
| 40 | `walgesang` | Walgesangbucht | Whalesong Bay | Tiefenklang | Sängerin Elske | Bogen III Ende: Lieder im Meer | Welle 4 ✓ |
| 41 | `rosenhof` | Rosenhof | Rose Court | Rosenduft | Gärtnerin Adelheid | Bogen IV: Die alten Höfe | Welle 4 ✓ |
| 42 | `hirschgarten` | Hirschgarten | Stag Park | Geweihlicht | Wildhüter Tönnies | Wildgehege | Welle 4 ✓ |
| 43 | `schlossruine` | Schlossruine | Castle Ruin | Mauerglanz | Baumeisterin Gerlinde | Eine Ruine wird bewohnt | Welle 4 ✓ |
| 44 | `bibliotheksberg` | Bibliotheksberg | Library Hill | Tintenlicht | Bibliothekar Wendelin | Bücher bis zur Decke | Welle 4 ✓ |
| 45 | `orgelklause` | Orgelklause | Organ Hermitage | Pfeifenklang | Organistin Mechthild | Musik im Fels | Welle 4 ✓ |
| 46 | `teehaus` | Teehausgarten | Teahouse Garden | Teeblatt | Teemeisterin Okke | Stille und Dampf | Welle 4 ✓ |
| 47 | `kuppelstadt` | Kuppelstadt | Dome Town | Kuppelglanz | Glaserin Reinhild | Kuppeln aus Glas | Welle 4 ✓ |
| 48 | `wolkenmarkt` | Wolkenmarkt | Cloud Market | Wolkenperle | Händler Fiete | Märkte in luftiger Höhe | Welle 4 ✓ |
| 49 | `sternenpfad` | Sternenpfad | Starpath | Pfadlicht | Wanderin Lene | Bogen IV Ende: Der Weg nach oben | Welle 4 ✓ |
| 50 | `himmelswarte` | Himmelswarte | Sky Watch | Himmelslicht | Alwine (Rückkehr) | Finale: Die Warte über den Wolken | Welle 4 ✓ |

## Bögen

| Bogen | Lande | Thema |
|---|---|---|
| 0 | 1–12 | Welle 1 ✓ |
| I | 13–18 | Über den Pass in die Berge |
| II | 19–30 | Handwerk und Markt |
| III | 31–40 | Die Küste |
| IV | 41–49 | Die alten Höfe und der Weg nach oben |
| Finale | 50 | Die Himmelswarte |

## Welle 5 · Die Hochlande (Jahr 2) ✓

Lande 51 bis 75, IDs in `content/realms.ts`: `hohesMoor`, `steinerneTreppe`, `windsattel`, `schwarzerSee`, `wacholderhang`, `zerbrocheneBruecke`, `ziegenpfad`, `alterSteinkreis`, `siebenQuellen`, `adlerwand`, `schieferbruch`, `nebelkessel`, `letzteWeide`, `roteHalde`, `stillesKloster`, `laerchenwald`, `wasserscheide`, `hoehlenstadt`, `donnerschlucht`, `firnfeld`, `hirtenmarkt`, `sternplatte`, `kalterOfen`, `grenzstein`, `ersteWarte`.

- Beschreibende Namen („Das Hohe Moor“), Figuren ohne Eigennamen („Die Torfstecherin“). Damit entfällt die Namensprüfung.
- Roter Faden: In jedem Hochland findet sich eine Spur einer Wacht, die älter ist als die im Tal. Das letzte Land ist die Erste Warte.
- Taktung: ein Hochland alle 11 bis 14 Tage (`REALM_TUNING.highCost`), Messung in `fuenf-jahre.md`.
- Die Lande-Liste zeigt die Wellen als aufklappbare Gruppen (`REALM_GROUPS`).

## Welle 6 · Die Fernen Küsten (Jahr 3) ✓

Lande 76 bis 100, IDs in `content/realms.ts` (`langerAbstieg` … `warteDerVierStrahlen`). Beschreibende Namen, Figuren ohne Eigennamen. Roter Faden: Jedes Küstenland hat ein Licht, das auf den Seekarten als Feuer steht; die Küste zählte einmal dreimal so viele. Das letzte Land ist die Warte der vier Strahlen. Eigener Bildrahmen (Meer, Landzungen, Strand).

## Freischaltung und Taktung (umgesetzt)

- **Land 2:** nach der ersten Langen Nacht (oder nach 20 Mondwenden).
- **Jedes weitere Land:** wenn im vorigen Land der 8. Bereich auf Stufe 25 steht.
- **Kosten:** Spätere Lande sind teurer (`REALM_TUNING.landGrowth = 1,15` je Land). Ab Land 14 steigt auch der Ertrag (`lateYield`, `lateYieldGrowth`).
- **Simulator (regular):** Land 2 an Tag 8, die Lande 3–10 bis Tag 20, danach alle zwei bis drei Tage, Land 34 an Tag 90. Messwerte und Korridore der späten Taktung: `balance.md`.

## Freischaltung (ursprünglicher Vorschlag)

- Land 2 nach der ersten Langen Nacht, Land 3 nach dem ersten Zeitalter.
- Lande 4–12: Zeitalter-Fortschritt und Land davor mit 8 Bereichen.
- Ab Land 13: das vorige Land voll ausgebaut.
