# Lande (Regionen): Plan für 50

Engine-Modul `regions` (P9): eigene Unterwirtschaft mit eigener Währung, 10 Bereichen, Pflege (2 Arten × 10 Ränge), Figur, Intro und Öffnungszeit.
- IDs werden nur **angehängt** und ändern sich nie.
- `parseRegions` füllt neue Lande automatisch auf.
- Größen-Test: 50 voll ausgebaute Lande < 100 KB.

**Wellen** wie in der Referenz: Welle 1 = Lande 2–7, Welle 2 = 8–13, Welle 3 = 14–19 … bis Land 34 (Parität). Lande 35–50 sind geplant und folgen später. Jede Welle bringt Grafik, Figur, Texte de/en, Chronik-Seiten und ein Großwerk über mehrere Lande.

**Namen sind Entwürfe (Status ungeprüft).** Erst beim Ausarbeiten einer Welle kommen sie in `names.ts` und `docs/marken/pruefung.md`, jeweils nach einer Websuche. Figuren tragen gewöhnliche Vornamen.

| Nr. | ID | Deutsch | English | Währung | Figur | Thema | Welle |
|---|---|---|---|---|---|---|---|
| 1 | `talwarte` | Talwarte | Dale Watch | Glimmer | Alwine | Die Hauptkarte: Turmwarte und zehn Bauwerke | Hauptkarte (P5) |
| 2 | `moorgrund` | Moorgrund | Fenmoor | Torflicht | Moorhüterin Ragna | Nebel, Stege, Irrlichter | Welle 1 |
| 3 | `kieselbach` | Kieselbach | Pebblebrook | Bachglanz | Müller Tewes | Mühlen und Furten | Welle 1 |
| 4 | `birkenhang` | Birkenhang | Birch Slope | Rindenfaser | Köhlerin Imke | Köhlerei und Harz | Welle 1 |
| 5 | `felsenkamm` | Felsenkamm | Rock Ridge | Kristallstaub | Steinmetz Oddo | Kristallhöhlen | Welle 1 |
| 6 | `heidegrund` | Heidegrund | Heathland | Heidehonig | Imkerin Swaantje | Bienen und Heide | Welle 1 |
| 7 | `schilfufer` | Schilfufer | Reedshore | Schilfrohr | Fährmann Lorenz | Fähren und Netze | Welle 1 |
| 8 | `apfelhain` | Apfelhain | Apple Grove | Apfelglut | Mosterin Wiebke | Obstwiesen | Welle 2 |
| 9 | `eulenwald` | Eulenwald | Owlwood | Federlicht | Waldhüter Bertil | Alte Eichen | Welle 2 |
| 10 | `salzquelle` | Salzquelle | Saltspring | Salzkristall | Siederin Hedda | Salinen | Welle 2 |
| 11 | `windmark` | Windmark | Windmark | Windhauch | Müllerin Edda | Windmühlen auf der Höhe | Welle 2 |
| 12 | `sternweiher` | Sternweiher | Star Pond | Spiegellicht | Sternseher Arvid | Spiegelnde Teiche | Welle 2 |
| 13 | `nebelpass` | Nebelpass | Mist Pass | Passglimmer | Säumer Jorin | Bogen I: Über den Pass | Welle 2 |
| 14 | `hochalm` | Hochalm | High Pasture | Almtau | Sennerin Gesa | Almen und Glocken | Welle 3 |
| 15 | `gletscherblick` | Gletscherblick | Glacier View | Eislicht | Bergführer Halvar | Eis und Spalten | Welle 3 |
| 16 | `tannengrat` | Tannengrat | Firridge | Harzglanz | Flößerin Mette | Flöße und Holz | Welle 3 |
| 17 | `murmelstein` | Murmelstein | Marmot Rock | Steinsalz | Hirte Tamme | Murmeltiere und Weiden | Welle 3 |
| 18 | `kristallgrotte` | Kristallgrotte | Crystal Grotto | Grottenlicht | Höhlenmalerin Liv | Bogen I Ende: Leuchtende Grotte | Welle 3 |
| 19 | `hangdorf` | Hangdorf | Hillside Hamlet | Dorfglut | Schulzin Frauke | Ein Dorf am Hang | Welle 3 |
| 20 | `auenland` | Talauen | Water Meadows | Auentau | Hirtin Telse | Flussauen | Welle 4 |
| 21 | `muehlenbach` | Mühlenbach | Millbrook | Mehlglanz | Bäcker Ubbo | Bogen II: Handwerk | Welle 4 |
| 22 | `toepferwinkel` | Töpferwinkel | Potter's Nook | Tonglanz | Töpferin Rieke | Lehm und Brennöfen | Welle 4 |
| 23 | `glaserhuette` | Glaserhütte | Glassworks | Glasfunken | Glasbläser Detlev | Bunte Scheiben | Welle 4 |
| 24 | `weberdorf` | Weberdorf | Weavers' Village | Garnlicht | Weberin Almut | Webstühle | Welle 4 |
| 25 | `faerberbach` | Färberbach | Dyers' Brook | Farbtropfen | Färber Kalle | Bunte Bäche | Welle 4 |
| 26 | `glockengiesserei` | Glockengießerei | Bell Foundry | Glockenklang | Gießerin Wanda | Glocken für das Tal | Welle 5 |
| 27 | `papiermuehle` | Papiermühle | Paper Mill | Bütten | Papiermacher Eike | Bücher der Chronik | Welle 5 |
| 28 | `uhrmacherturm` | Uhrmacherturm | Clockmaker's Tower | Zahnradglanz | Uhrmacherin Hiltrud | Zeit und Räder | Welle 5 |
| 29 | `brueckenstadt` | Brückenstadt | Bridgetown | Brückenzoll | Brückenmeister Gerd | Viele Brücken | Welle 5 |
| 30 | `markthafen` | Markthafen | Market Harbour | Hafenlicht | Hafenmeisterin Ylva | Bogen II Ende: Markt am Wasser | Welle 5 |
| 31 | `leuchtfeuer` | Leuchtfeuerküste | Beacon Coast | Küstenglanz | Feuerwärter Hinnerk | Bogen III: Die Küste | Welle 5 |
| 32 | `muschelbucht` | Muschelbucht | Shell Bay | Perlmutt | Taucherin Okka | Muscheln und Riffe | Welle 6 |
| 33 | `duenenland` | Dünenland | Dunelands | Sandglas | Strandvogt Fokko | Dünen und Strandhafer | Welle 6 |
| 34 | `seehundbank` | Seehundsbank | Seal Bank | Gischt | Wattführerin Kea | Watt und Seehunde | Welle 6 |
| 35 | `sturmkap` | Sturmkap | Storm Cape | Sturmfunken | Lotse Reimer | Wind und Wellen | Welle später |
| 36 | `nordlichtinsel` | Nordlichtinsel | Northlight Isle | Polarschimmer | Sternfischerin Inga | Nordlichter | Welle später |
| 37 | `bernsteinstrand` | Bernsteinstrand | Amber Strand | Bernstein | Sammler Momme | Bernstein im Sand | Welle später |
| 38 | `treibholzhafen` | Treibholzhafen | Driftwood Haven | Treibholz | Bootsbauerin Tjarda | Boote aus Treibholz | Welle später |
| 39 | `nebelinseln` | Nebelinseln | Mist Isles | Inselnebel | Einsiedler Brar | Verborgene Inseln | Welle später |
| 40 | `walgesang` | Walgesangbucht | Whalesong Bay | Tiefenklang | Sängerin Elske | Bogen III Ende: Lieder im Meer | Welle später |
| 41 | `rosenhof` | Rosenhof | Rose Court | Rosenduft | Gärtnerin Adelheid | Bogen IV: Die alten Höfe | Welle später |
| 42 | `hirschgarten` | Hirschgarten | Stag Park | Geweihlicht | Wildhüter Tönnies | Wildgehege | Welle später |
| 43 | `schlossruine` | Schlossruine | Castle Ruin | Mauerglanz | Baumeisterin Gerlinde | Eine Ruine wird bewohnt | Welle später |
| 44 | `bibliotheksberg` | Bibliotheksberg | Library Hill | Tintenlicht | Bibliothekar Wendelin | Bücher bis zur Decke | Welle später |
| 45 | `orgelklause` | Orgelklause | Organ Hermitage | Pfeifenklang | Organistin Mechthild | Musik im Fels | Welle später |
| 46 | `teehaus` | Teehausgarten | Teahouse Garden | Teeblatt | Teemeisterin Okke | Stille und Dampf | Welle später |
| 47 | `kuppelstadt` | Kuppelstadt | Dome Town | Kuppelglanz | Glaserin Reinhild | Kuppeln aus Glas | Welle später |
| 48 | `wolkenmarkt` | Wolkenmarkt | Cloud Market | Wolkenperle | Händler Fiete | Märkte in luftiger Höhe | Welle später |
| 49 | `sternenpfad` | Sternenpfad | Starpath | Pfadlicht | Wanderin Lene | Bogen IV Ende: Der Weg nach oben | Welle später |
| 50 | `himmelswarte` | Himmelswarte | Sky Watch | Himmelslicht | Alwine (Rückkehr) | Finale: Die Warte über den Wolken | Welle später |

## Bögen

| Bogen | Lande | Thema |
|---|---|---|
| 0 | 1–12 | Das Tal und seine Ränder |
| I | 13–18 | Über den Pass in die Berge |
| II | 19–30 | Handwerk und Markt |
| III | 31–40 | Die Küste |
| IV | 41–49 | Die alten Höfe und der Weg nach oben |
| Finale | 50 | Die Himmelswarte |

## Freischaltung (Vorschlag, an der Referenz orientiert)

- Land 2 nach der ersten Langen Nacht, Land 3 nach dem ersten Zeitalter.
- Lande 4–12: Zeitalter-Fortschritt und Land davor mit 8 Bereichen.
- Ab Land 13: das vorige Land voll ausgebaut.
