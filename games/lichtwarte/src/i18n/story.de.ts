/**
 * Erzählung (Deutsch): Prolog, Chronik in fünf Kapiteln, Briefe, Zeremonien, Sprüche des Lehrlings.
 * Der Bogen steht in docs/spiele/lichtwarte/welt.md. Ton: warm, knapp, leiser Humor, nie belehrend.
 * Absätze sind durch eine Leerzeile getrennt.
 */
export const storyDe = {
  intro: {
    l1: 'Am Rand des Dämmertals steht eine alte Warte.',
    l2: 'Ihr Feuer hat das Tal behütet, länger, als irgendwer zählen kann.',
    l3: 'Jetzt glimmt es nur noch.',
    l4: 'Unter der dritten Stufe liegt ein Schlüssel. Daneben ein Buch.',
    cta: 'Die Warte aufschließen',
  },
  chronicle: {
    contents: 'Inhalt',
    resume: (title: string) => `Weiterlesen: ${title}`,
    lockedPage: 'Noch nicht geschrieben.',
    clue: {
      build: (name: string) => `Öffnet sich mit: ${name}.`,
      buildLevel: (name: string, level: string) => `Öffnet sich mit: ${name} auf Stufe ${level}.`,
      turns: (n: string, layer: string) => `Öffnet sich nach ${n}× ${layer}.`,
      near: (layer: string) => `Öffnet sich, wenn sie näher rückt: ${layer}.`,
      realms: (n: string) => `Öffnet sich mit ${n} Landen.`,
      helper: 'Öffnet sich, wenn jemand bei der Arbeit hilft.',
      voyages: (n: string) => `Öffnet sich nach ${n} Fernfahrten.`,
      highlands: (n: string) => `Öffnet sich mit ${n} Hochlanden.`,
      road: (n: string) => `Öffnet sich mit ${n} Stufen der Feuerstraße.`,
      chain: (n: string) => `Öffnet sich mit einer Kette aus ${n} Feuern.`,
    },
    menu: 'Chronik',
    title: 'Chronik der Wächterin',
    unread: 'Neue Seite',
    empty: 'Noch steht nichts darin.',
    signature: '— Alwine',
    signatureYou: '— die Wacht vor dir',
    letter: 'Ein Brief, vom Greif gebracht',
    prev: 'Zurück',
    next: 'Weiter',
    close: 'Buch schließen',
    page: (n: string, total: string) => `Seite ${n} von ${total}`,
    chapter: (n: string, name: string) => `Kapitel ${n} · ${name}`,
    books: { watch: 'Buch 1 · Die Wacht', wayOfFires: 'Buch 2 · Der Weg der Feuer' },
    bookShort: (n: string) => `Buch ${n}`,
    bookLocked: { wayOfFires: 'Beginnt mit dem ersten Hochland.' },
    chapters: {
      key: 'Der Schlüssel',
      remains: 'Was bleibt',
      wakes: 'Das Tal erwacht',
      night: 'Die Lange Nacht',
      handover: 'Die Wacht weitergeben',
      firstYear: 'Das erste Jahr',
      upward: 'Über der Baumgrenze',
      traces: 'Spuren im Stein',
      otherFires: 'Die Feuer der anderen',
      coldKiln: 'Der kalte Ofen',
      firstWatch: 'Die Erste Warte',
    },
    comeback: { title: 'Da bist du ja', body: 'Lange nichts gehört. Die Warte hat geglimmt, ich habe aufgepasst. Hier, für den Weg: ein paar Lichtkiesel.' },
    entries: {
      welcome: {
        title: 'Für wen auch immer',
        body: 'Wenn du das liest, hast du den Schlüssel unter der dritten Stufe gefunden. Gut. Dann bist du neugierig, und mehr braucht es am Anfang nicht.\n\nDie Warte ist alt, das Tal ist müde, und ich bin es auch. Das Feuer oben glimmt nur noch. Fang bei der Kräuterkate an. Das Licht kommt nicht auf einmal zurück, aber es kommt — sogar, wenn du schläfst.',
      },
      firstBuild: {
        title: 'Der erste Funke',
        body: 'Siehst du das Glimmen über der Kate? So hat es bei mir auch angefangen, vor einundvierzig Wintern.\n\nGlimmer ist kein Schatz, den man findet. Er sammelt sich dort, wo jemand etwas mit Sorgfalt tut. Ruf die Funken ruhig, wenn du ungeduldig bist. Sie mögen das.',
      },
      holzlager: {
        title: 'Holz für den Winter',
        body: 'Mit dem Holzlager wird aus einem Häuschen ein Anfang. Schau zum Weg: Für jedes Haus, das wieder steht, zündet das Tal eine Laterne an.\n\nIch habe sie früher jeden Abend gezählt. Zuletzt war ich schnell fertig.',
      },
      steinbruch: {
        title: 'Stein auf Stein',
        body: 'Der Berg gibt nicht gern, aber er gibt. Aus diesen Steinen stand einmal die ganze Warte.\n\nDu fragst dich sicher, wo ich bin. Nicht unter der Erde, keine Sorge. Ich bin nur zu alt geworden, um ein Feuer allein zu hüten — und zu stur, um zuzusehen, wie es ausgeht. Den Rest erzähle ich dir, wenn du so weit bist.',
      },
      spring: {
        title: 'Die Quelle',
        body: 'Hier habe ich jeden Morgen getrunken. Das Wasser kommt von weit oben, und nachts schimmert es, wenn im Tal genug Licht ist. Heute Nacht schimmert es wieder ein wenig. Das warst du.\n\nMerk dir den Bach. Ich bin ihm gefolgt, als ich ging.',
      },
      moonturnReady: {
        title: 'Wenn der Mond sich dreht',
        body: 'Die erste Mondwende ist nah. Du wirst erschrecken: Wenn der Mond sich dreht, verfliegt der Glimmer, und die Häuser sinken zurück in den Schlaf.\n\nHab keine Angst davor. Das Licht steckt nicht in den Balken. Es steckt in dem, was du inzwischen kannst. Was du baust, vergeht — was du lernst, bleibt im Archiv. Danach geht alles leichter.',
      },
      afterMoonturn: {
        title: 'Das Archiv',
        body: 'Da liegt es nun: das Archiv der Wächter. Jede Wacht vor dir hat etwas hineingelegt — eine Laterne, ein Stück Kreide, einen Kniff. Nimm dir, was du brauchst.\n\nUnd sieh hinauf: Das Feuer der Warte brennt wieder richtig. Man sieht es jetzt vom ganzen Tal aus. Irgendwer wird es bemerken.',
      },
      schmiede: {
        title: 'Feuer und Eisen',
        body: 'Die Schmiede glüht wieder. Ich habe ihr Klingen jahrelang vermisst. Als die Lichter weniger wurden, zogen die Leute fort, einer nach dem anderen, und zuletzt schwieg auch der Amboss.\n\nHör hin. So klingt ein Tal, in das jemand zurückkommt.',
      },
      kartenstube: {
        title: 'Das leere Fach',
        body: 'In der Kartenstube liegen Wege, die lange niemand gegangen ist. Ein Fach ist leer, das hast du sicher gesehen. Die Karte der Lande hinter den Bergen habe ich mitgenommen.\n\nEin Feuer allein ist nur ein Feuer. Viele Feuer sind ein Weg. Ich wollte nachsehen, ob drüben noch jemand eines hütet.',
      },
      alchemistenturm: {
        title: 'Bunte Flammen',
        body: 'Wenn der Alchemistenturm raucht, halte Abstand und sei neugierig. Meistens gleichzeitig.\n\nDort oben habe ich als Lehrmädchen zum ersten Mal von der Langen Nacht gehört. Ich hielt sie für ein Märchen, mit dem man Kinder ins Bett schickt. Sie ist keins.',
      },
      moonturn3: {
        title: 'Drei Monde',
        body: 'Du hast es gemerkt: Jede Mondwende geht ein Stück leichter. So ist es gedacht.\n\nDie Alten sagten: Der Mond nimmt nur, was man ohnehin nicht tragen kann. Ich fand das als Kind sehr ungerecht und finde es heute sehr klug.',
      },
      greifenhorst: {
        title: 'Die Greife kehren zurück',
        body: 'Sie haben gewartet, bis jemand den Horst wieder herrichtet. Sei freundlich zu ihnen, sie vergessen nichts — auch keinen Weg. Ein Greif findet jeden, dem er einmal einen Brief gebracht hat.\n\nIch habe einem von ihnen etwas für dich mitgegeben. Er lässt sich Zeit. Greife lassen sich immer Zeit.',
      },
      letterMoor: {
        title: 'Ein Brief aus dem Moor',
        body: 'Liebe Wacht,\n\nder Greif sagt, bei euch brennen wieder Laternen am Weg. Er sagt es nicht mit Worten, aber er sieht sehr zufrieden aus.\n\nIch sitze bei Ragna im Moor, und sie schimpft, weil ich zu Fuß gekommen bin. Auch hier ist ein Feuer fast aus. Ich bleibe, bis es wieder brennt, dann gehe ich weiter. Halte du unseres.',
      },
      runenhalle: {
        title: 'Alte Zeichen',
        body: 'In der Runenhalle sprechen die Steine leise. Wenn du still bist, verstehst du ein Wort oder zwei.\n\nEines steht dort öfter als jedes andere: die Lange Nacht. Einmal in jedem Menschenalter bleibt die Sonne tagelang fort. Wer dann ein Feuer hütet, hütet es für alle. Die letzte habe ich als Mädchen erlebt, an der Hand meiner Meisterin.',
      },
      moonturn5: {
        title: 'Fünf Monde',
        body: 'Fünf Mondwenden. Die Leute im Tal fragen schon nach dir. Sie sagen „die neue Wacht“, und es klingt, als hätten sie das Wort vermisst.',
      },
      apprentice: {
        title: 'Ein Lehrling',
        body: 'Fenno ist also wieder da. Er hat mir früher die Körbe getragen und ist dann in die Stadt gelaufen, weil es hier „nichts mehr zu sehen“ gab. Jetzt hat er das Feuer von der Straße aus gesehen.\n\nEr redet zu viel und arbeitet zu schnell, aber er meint es ernst. Lass ihn Laternen putzen. Das habe ich auch müssen.',
      },
      sternwarte: {
        title: 'Die Kuppel',
        body: 'Die Sternwarte leuchtet wieder. Ich bin stolz auf dich — das schreibe ich nicht oft.\n\nSchau heute Nacht durch das Rohr, ganz an den Rand des Himmels. Dort fehlen Sterne. Jede Woche ein paar mehr. So fängt es an.',
      },
      moonturn10: {
        title: 'Zehn Monde',
        body: 'Zehn. Ich habe damals länger gebraucht. Mach eine Pause, wenn du magst — die Warte glimmt auch ohne dich. Dafür ist sie gebaut.',
      },
      nightNear: {
        title: 'Die Sterne am Rand',
        body: 'Jetzt siehst du es auch ohne Rohr: Am Rand wird der Himmel leer. Die Lange Nacht kommt.\n\nSie ist nicht böse. Sie ist nur lang. Alles, was du gebaut hast, wird schlafen, und sogar das Archiv hält den Atem an. Nur das Feuer oben muss brennen. Du kannst das. Ich wüsste niemanden, dem ich es lieber überließe.',
      },
      longNight: {
        title: 'Der Morgen danach',
        body: 'Du hast das Feuer durch die Lange Nacht getragen. Im Gras liegt Nachttau — er fällt nur nach solchen Nächten und zeigt dir, was bleibt.\n\nUnd jetzt sieh über die Berge. Zähl die Lichter auf den Hügeln dahinter. Das sind keine Sterne. Die Lande haben dein Feuer gesehen und antworten.',
      },
      firstRealm: {
        title: 'Hinter dem Tal',
        body: 'Hinter dem Moor beginnt ein anderes Land. Ragna wartet schon. Grüß sie von mir, sie wird schimpfen.\n\nJedes Land hat sein eigenes Feuer und seine eigene Art, es zu hüten. Du musst es ihnen nicht abnehmen. Hilf ihnen nur beim Anzünden.',
      },
      letterRoad: {
        title: 'Ein Brief von unterwegs',
        body: 'Liebe Wacht,\n\nich komme langsamer voran als gedacht, weil mich überall jemand zum Essen einlädt. Man erzählt hier von einem Tal, in dem die Laternen wieder brennen. Ich sage dann, ich hätte davon gehört.\n\nMeine Knie mögen die Berge nicht mehr. Aber ich habe noch ein Stück Karte vor mir.',
      },
      fiveRealms: {
        title: 'Viele Lande',
        body: 'Fünf Lande hängen jetzt an deinem Licht, und deines hängt an ihren. Genau so war es gemeint.\n\nVergiss die Warte nicht, wenn du unterwegs bist. Ein Weg aus Feuern braucht einen Anfang.',
      },
      tenRealms: {
        title: 'Ein Weg aus Feuern',
        body: 'Zehn Lande. Von der Sternwarte aus sieht man sie nachts wie eine Kette, von Hügel zu Hügel.\n\nAls ich aufbrach, wollte ich nur nachsehen, ob drüben noch jemand wacht. Ich hätte nicht gedacht, dass ich den Rückweg einmal an Lichtern abzählen kann.',
      },
      agesNear: {
        title: 'Der Schlüssel wird leichter',
        body: 'Hast du gemerkt, dass Fenno die Laternen inzwischen anzündet, bevor du daran denkst? Und dass er dabei nicht mehr redet?\n\nEine Wacht dauert kein Leben lang. Sie dauert, bis jemand anderes sie tragen kann. Wenn du den Schlüssel in der Tasche vergisst, weil er nicht mehr drückt, dann ist es bald so weit.',
      },
      ages: {
        title: 'Ein neues Zeitalter',
        body: 'Du hast die Wacht weitergegeben, so wie sie mir gegeben wurde und ich sie dir. Das Ahnenlicht bleibt — es ist alles, was wir je gelernt haben, und es leuchtet für jeden, der nach uns kommt.\n\nIch bin übrigens heute Morgen den Weg heruntergekommen, an allen Laternen vorbei. Ich sitze auf der Bank vor der Kräuterkate. Diesmal bin ich der Gast. Danke.',
      },
      epilogue: {
        title: 'Die erste Seite',
        body: 'Diese Seite ist nicht von Alwine. Sie hat mir die Feder hingelegt und gesagt, die erste Seite der Chronik habe sie selbst nur abgeschrieben, von ihrer Meisterin, und die von ihrer.\n\nAlso: Wenn du das liest, hast du den Schlüssel unter der dritten Stufe gefunden. Gut. Dann bist du neugierig, und mehr braucht es am Anfang nicht.',
      },
      voyageFirst: {
        title: 'Ein Brief zurück',
        body: 'Liebe Wacht,\n\ndein Greif ist angekommen, zerzaust und sehr zufrieden mit sich. Ragna hat ihm einen Fisch gegeben, den er nicht mochte, und einen zweiten, den er mochte.\n\nSchick ihn ruhig wieder los. Ein Feuer, das Briefe schreibt, ist in den Landen eine Neuigkeit. Und Neuigkeiten gehen hier langsam, aber sie kommen an.',
      },
      voyageMaps: {
        title: 'Das Fach füllt sich',
        body: 'Jeder Greif bringt ein Stück Karte mit. Kein ganzes Blatt, nur eine Ecke, einen Flusslauf, einen Namen in fremder Schrift.\n\nIch habe das leere Fach in der Kartenstube aufgeschlossen. Leg die Stücke hinein, wie sie kommen. Eine Karte, die man selbst zusammensetzt, vergisst man nicht mehr.',
      },
      voyageFenno: {
        title: 'Fenno und die Greife',
        body: 'Fenno hat den Greifen Namen gegeben. Sie hören nicht darauf, aber er behauptet, sie täten es heimlich.\n\nGestern hat er einem von ihnen den Weg nach Norden erklärt, mit beiden Armen und sehr laut. Der Greif ist nach Süden geflogen und pünktlich zurückgekommen. Fenno sagt, genau so habe er es gemeint.',
      },
      voyageCoast: {
        title: 'Ein Brief von der Küste',
        body: 'Liebe Wacht,\n\nhier unten riecht alles nach Salz, sogar die Briefe. Der Feuerwärter hat gefragt, wer bei uns im Tal das Licht hält. Ich habe gesagt: jemand, der nachts noch einmal nach den Laternen sieht.\n\nEr hat genickt und sein eigenes Feuer höher gedreht. So spricht man hier miteinander.',
      },
      voyageFires: {
        title: 'Fünfzehn Flüge',
        body: 'Ich habe nachgezählt: fünfzehn Flüge, und kein Greif ist leer zurückgekommen. Mal ein Kartenstück, mal ein Gruß, einmal nur eine Feder von einem Vogel, den hier niemand kennt.\n\nFrüher dachte ich, eine Wacht steht still und hält ein Feuer. Heute weiß ich, dass sie auch Wege offen hält.',
      },
      voyageYear: {
        title: 'Nach einem Jahr',
        body: 'Diese Seite schreibe ich selbst. Ein Jahr ist um, vielleicht auch etwas mehr oder weniger. Im Tal zählt niemand so genau.\n\nAlwine sitzt auf der Bank und sagt, das erste Jahr sei das leichte. Fenno widerspricht ihr, weil er immer widerspricht. Über den Bergen liegt Land, das auf keiner unserer Karten steht. Die Greife kennen den Weg schon.',
      },
      highFirst: {
        title: 'Der Weg geht weiter',
        body: 'Ich hatte gedacht, hinter der Himmelswarte sei die Karte zu Ende. Sie ist es auch. Der Weg ist es nicht.\n\nOben liegt ein Moor, und im Moor eine Feuerstelle, älter als unsere. Jemand hat hier ein Feuer gehütet, lange bevor es im Tal eine Warte gab. Ich möchte wissen, wer.',
      },
      roadFirst: {
        title: 'Zwei Feuer',
        body: 'Heute Abend habe ich zum ersten Mal ein Feuer zwischen zwei Landen entzündet. Es steht auf halbem Weg, gehört keinem von beiden und wärmt beide.\n\nAlwine sagt, so habe das alles einmal angefangen: nicht mit einer Warte, sondern mit dem Stück dazwischen.',
      },
      highStair: {
        title: 'Ein Brief von der Treppe',
        body: 'Liebe Wacht,\n\nich bin bei Stufe vierhundert und schreibe im Sitzen. Der Treppenwart hat mir ein Zeichen gezeigt, in den Fels gehauen, auf Kniehöhe: eine Laterne. Unsere Laterne.\n\nEr sagt, es sei schon da gewesen, als sein Großvater hier fegte. Ich steige weiter. Grüß Fenno und sag ihm, er soll die Greife nicht überfüttern.',
      },
      roadThree: {
        title: 'Fenno zählt',
        body: 'Fenno hat angefangen, die Feuer der Straße abends zu zählen. Er zählt laut, vom Turm aus, und kommt jedes Mal auf eines mehr, als wir entzündet haben.\n\nIch habe ihm gesagt, er verzähle sich. Er sagt, er zähle nur, was er sieht. Ich habe nicht weiter gefragt.',
      },
      highSaddle: {
        title: 'Was der Wind weiß',
        body: 'Die Wetterfrau am Sattel führt ein Buch über den Wind, Tag für Tag, seit dreißig Jahren. Vor ihr hat es eine andere geführt, und vor der wieder eine.\n\nAuf der ersten Seite steht kein Wetter. Dort steht nur: „Feuer brennt. Sicht bis zum Tal.“ Das Tal sind wir.',
      },
      chainThree: {
        title: 'Eine Kette',
        body: 'Drei Feuer hintereinander, ohne Lücke. Von der Warte aus sieht man sie als eine Linie, die den Berg hinaufsteigt.\n\nEin einzelnes Feuer sagt: Hier ist jemand. Eine Kette sagt etwas anderes. Sie sagt: Hier entlang.',
      },
      highTarn: {
        title: 'Ein Brief vom See',
        body: 'Liebe Wacht,\n\nder Fährjunge hat mich hinübergerudert und kein Wort gesagt. In der Mitte hat er das Ruder eingezogen und nach unten gezeigt. Auf dem Grund liegt eine Feuerschale, groß wie ein Wagenrad.\n\nNiemand wirft so etwas weg. Jemand hat sie dort hingelegt, damit sie bleibt. Ich weiß noch nicht, warum.',
      },
      highJuniper: {
        title: 'Wo Wacholder wächst',
        body: 'Die Räucherin behauptet, Wacholder wachse am liebsten dort, wo einmal ein Feuer stand. Ich habe das für eine schöne Redensart gehalten.\n\nDann bin ich den Hang abgegangen. Die Büsche stehen in einer Reihe, alle zweihundert Schritte einer, bis hinauf zum Grat. Niemand pflanzt so. Aber so stellt man Feuer auf.',
      },
      highBridge: {
        title: 'Ein Brief von der Brücke',
        body: 'Liebe Wacht,\n\nich stehe am Ende einer Brücke, die in der Luft aufhört. Der Brückenbauer setzt jedes Jahr einen Bogen an. Er sagt, von drüben baue ihm jemand entgegen.\n\nGesehen hat er nie jemanden. Aber jedes Frühjahr ist auf der anderen Seite ein Bogen mehr. Ich habe nachgezählt. Er hat recht.',
      },
      roadEight: {
        title: 'Fenno und die Lichtkiesel',
        body: 'Fenno hat ausgerechnet, was die ganze Feuerstraße kostet. Er hat dafür drei Seiten gebraucht und einen halben Abend. Das Ergebnis hat er mir nicht gesagt, nur: „Viel.“\n\nDann hat er gefragt, ob er seinen eigenen Beutel dazulegen dürfe. Ich habe Ja gesagt. Es waren elf Kiesel und ein Knopf.',
      },
      highGoat: {
        title: 'Die Laterne am Stock',
        body: 'Die Geißhirtin trägt eine Laterne am Stock, auch am hellen Tag. Ich habe gefragt, wozu.\n\n„Damit man mich von unten sieht“, hat sie gesagt. „Meine Mutter hat es so gemacht. Früher hat unten jemand zurückgeleuchtet.“ Sie hat das ohne Vorwurf gesagt. Ich habe mir trotzdem vorgenommen, abends öfter hinaufzusehen.',
      },
      highCircle: {
        title: 'Der zwanzigste Stein',
        body: 'Neunzehn Steine stehen im Kreis. Der Steinzähler zählt jeden Morgen zwanzig und ärgert sich nicht mehr darüber.\n\nIch habe mich in die Lücke gestellt. Der Boden dort ist schwarz, eine Handbreit tief. Der zwanzigste Stein war nie ein Stein. Dort hat ein Feuer gebrannt, und die neunzehn standen darum wie Leute, die sich wärmen.',
      },
      roadTwelve: {
        title: 'Was eine Stufe ist',
        body: 'Ich habe lange gebraucht, um zu verstehen, warum ein Feuer drei Stufen hat. Die erste ist ein Zeichen: Wir wissen voneinander. Die zweite ist ein Weg: Wer will, findet hinüber.\n\nDie dritte hat Alwine mir geschrieben. „Die dritte“, schreibt sie, „brennt auch dann, wenn einer von beiden einmal schläft.“',
      },
      highSprings: {
        title: 'Ein Brief von den Quellen',
        body: 'Liebe Wacht,\n\nich habe aus allen sieben Quellen getrunken und kann sie immer noch nicht unterscheiden. Die Brunnenmeisterin war höflich enttäuscht.\n\nSie sucht die achte. Die habe, sagt sie, nach Rauch geschmeckt, und die Alten hätten ihr Wasser nur von dort geholt. Rauchiges Wasser, Wacht. Ich glaube, ich weiß, was an der achten Quelle stand.',
      },
      chainEight: {
        title: 'Von unten gesehen',
        body: 'Heute kam ein Händler durchs Tal, der die Hochlande nicht kennt. Er ist am Abend stehen geblieben und hat lange hinaufgesehen.\n\n„Wohnt dort jemand?“, hat er gefragt. Ich habe gesagt: „Seit Neuestem wieder.“ Er hat genickt, als sei das die vernünftigste Antwort der Welt, und hat sein Nachtlager so aufgeschlagen, dass er die Kette sehen konnte.',
      },
      highEagle: {
        title: 'Was die Adler bauen',
        body: 'Der Horstwächter hat mir einen alten Horst gezeigt, den die Adler aufgegeben haben. Unter den Ästen lag ein Stück Eisen, flach, mit einem Griff.\n\nEs ist ein Laternendeckel. Die Adler tragen alles zusammen, was glänzt. Irgendwo an dieser Wand hing einmal eine Laterne, so hoch, dass nur Vögel sie erreichen. Wer hängt eine Laterne dorthin? Jemand, der von sehr weit gesehen werden will.',
      },
      highSlate: {
        title: 'Die richtige Seite',
        body: 'Die Schieferspalterin hat eine Platte für mich aufgeschlagen, wie man ein Buch aufschlägt. Innen war ein Abdruck: eine Hand, fünf Finger, daneben eine Flamme, mit einem Nagel geritzt.\n\n„Davon gibt es viele“, hat sie gesagt. „In jeder Schicht eine.“ Ich habe gefragt, wie alt die unterste sei. Sie hat gelacht. So tief sei noch niemand gekommen.',
      },
      roadSixteen: {
        title: 'Fenno bekommt Post',
        body: 'Ein Greif hat einen Brief gebracht, der nicht an die Wacht gerichtet war, sondern an „den Jungen, der die Feuer zählt“. Fenno hat ihn dreimal gelesen und dann sehr gerade gesessen.\n\nEr ist vom Senn auf der Letzten Weide. Er schreibt, er zähle auch, von oben, und komme auf dieselbe Zahl. Fenno hat mir den Brief nicht gezeigt. Er hat ihn mir vorgelesen. Zweimal.',
      },
      highMist: {
        title: 'Ein Brief aus dem Nebel',
        body: 'Liebe Wacht,\n\nim Kessel sieht man die eigene Hand nicht. Der Nebelfänger findet sich mit einem Horn zurecht: ein Ton für „Ich bin hier“, zwei für „Komm“.\n\nHeute Nacht hat er einmal geblasen. Von der anderen Seite des Kessels kam ein Ton zurück. Er ist erschrocken, Wacht. Er wohnt hier allein.',
      },
      highPasture: {
        title: 'Neun Feuer',
        body: 'Der Senn sagt, von der Letzten Weide sehe man am Abend neun Feuer. Früher seien es mehr gewesen, sein Vater habe noch vierzehn gezählt.\n\nIch habe mit ihm bis zur Dunkelheit gewartet. Wir haben zwölf gezählt. Er hat lange nichts gesagt und dann seine Mütze abgenommen, vor niemandem im Besonderen.',
      },
      roadTwentyTwo: {
        title: 'Nicht alle sind unsere',
        body: 'Ich habe heute die Liste gemacht, die ich längst hätte machen sollen: jedes Feuer, das wir entzündet haben, mit Tag und Ort.\n\nDann bin ich auf den Turm gestiegen und habe gezählt. Es sind drei mehr. Fenno hat sich nie verzählt. Dort oben brennen Feuer, die niemand von uns angesteckt hat.',
      },
      highHeaps: {
        title: 'Was die Alten übersahen',
        body: 'Die Erzwäscherin wäscht den Abraum der alten Stollen. Meist findet sie Eisen, manchmal Kupfer. Gestern einen Schlüssel.\n\nEr sieht aus wie unserer, bis auf den Bart. Unserer hat drei Zacken, dieser vier. Ein Schlüssel für eine Tür, die ähnlich ist wie unsere und doch eine andere. Ich trage ihn jetzt in der Manteltasche und fasse öfter hin, als nötig wäre.',
      },
      chainThirteen: {
        title: 'Die halbe Strecke',
        body: 'Dreizehn Feuer in einer Reihe. Von hier bis zur Mitte der Hochlande ist keine Lücke mehr.\n\nDie Sternwarte meldet, man könne die Kette jetzt mit dem bloßen Auge vom Sternbild der Leiter unterscheiden, aber nur knapp. Ich nehme das als Lob.',
      },
      highCloister: {
        title: 'Ein Brief aus dem Kloster',
        body: 'Liebe Wacht,\n\nim Kloster spricht nur die Pförtnerin. Ich habe sie nach der Kerze im Fenster gefragt.\n\nSie brenne, sagt sie, für jemanden, der hinaufgegangen und nicht zurückgekommen sei. Seit wann? Sie hat im Buch nachgesehen. Seit zweihundertelf Jahren. Jeden Abend eine neue Kerze. Ich habe ihr den Schlüssel mit den vier Zacken gezeigt. Sie hat sehr lange hingesehen und dann zum ersten Mal an diesem Tag geschwiegen.',
      },
      highLarch: {
        title: 'Loslassen',
        body: 'Der Harzer sagt, die Lärche sei der einzige Nadelbaum, der im Herbst alles abwirft. Die anderen hielten fest und brächen im Schnee.\n\nIch habe an die Wacht gedacht, die den Schlüssel unter die Stufe legt und geht. Ich hatte das immer für ein Fortgehen gehalten. Vielleicht ist es das, was der Harzer meint.',
      },
      roadTwentyEight: {
        title: 'Fenno will hinauf',
        body: 'Fenno hat gefragt, wann er mit in die Hochlande dürfe. Ich habe gesagt: wenn jemand anderes unten das Feuer hält. Er hat gesagt, das sei ungerecht, und dann, nach einer Weile, dass er es verstehe.\n\nAm Abend stand er auf dem Turm und hat hinaufgeleuchtet, einmal kurz, einmal lang. Von der Letzten Weide kam es zurück. Er hat sich dort oben einen Freund gemacht, ohne einen Schritt zu gehen.',
      },
      highWatershed: {
        title: 'Ein Brief von der Scheide',
        body: 'Liebe Wacht,\n\nich stehe mit einem Fuß in jedem Meer, sagt die Pegelschreiberin, und sie meint es wörtlich. Links fließt alles zu uns ins Tal. Rechts fließt es fort, in ein Land, von dem ich nichts weiß.\n\nDie Feuer laufen hier nicht nach links. Sie laufen den Grat entlang und dann nach rechts hinunter. Wer sie gebaut hat, kam nicht von uns. Er kam zu uns.',
      },
      highCave: {
        title: 'Eine Stadt ohne Himmel',
        body: 'In der Höhlenstadt gibt es eine bemalte Wand. Sie zeigt einen Zug von Leuten mit Laternen, die einen Berg hinuntersteigen. Vorn geht eine Frau mit einem Schlüssel am Gürtel.\n\nDer Lampenträger sagt, das Bild sei schon alt gewesen, als die Stadt gegraben wurde. Die Leute auf der Wand gehen von rechts nach links. Auf uns zu.',
      },
      highGorge: {
        title: 'Die Sprache der Laternen',
        body: 'In der Schlucht ist es zu laut zum Reden, also spricht man mit Laternen. Die Stegmeisterin hat mir ihre Zeichen beigebracht: kurz, lang, verdeckt.\n\nEs sind dieselben, die Fenno vom Turm aus gibt. Ich habe ihn gefragt, woher er sie hat. Von Alwine. Und die? Von ihrer Meisterin. Niemand hat diese Zeichen erfunden. Sie sind mit den Feuern den Berg heruntergekommen.',
      },
      roadThirtySix: {
        title: 'Die Hälfte der Stufen',
        body: 'Sechsunddreißig Stufen brennen. Ich merke, dass ich abends nicht mehr zuerst auf unser eigenes Feuer sehe, sondern die Kette hinauf, bis dorthin, wo sie aufhört.\n\nFrüher habe ich ein Feuer gehütet. Jetzt hüte ich die Frage, wie weit es reicht. Alwine schreibt, das sei keine andere Arbeit, nur dieselbe von weiter oben.',
      },
      chainEighteen: {
        title: 'Ein Zeichen von oben',
        body: 'Heute Nacht hat die Kette geantwortet. Nicht eines unserer Feuer, sondern eines von den dreien, die wir nicht entzündet haben. Kurz, lang, verdeckt. Kurz, lang, verdeckt.\n\nFenno hat es als Erster gelesen, weil er der Einzige ist, der nie daran gezweifelt hat. Es heißt: „Ich bin hier.“',
      },
      highFirn: {
        title: 'Ein Brief vom Firn',
        body: 'Liebe Wacht,\n\nder Spurenleser hat mir im alten Schnee eine Fährte gezeigt. Stiefel, ein Stock, daneben etwas Kleines auf vier Pfoten. Sie führt hinauf und ist zweihundert Jahre alt, sagt er, auf zehn Jahre genau.\n\nDaneben läuft eine zweite, frische. Sie führt herunter. Sie ist von gestern.',
      },
      highFair: {
        title: 'Der leere Platz',
        body: 'Der Hirtenmarkt steht das ganze Jahr leer und ist trotzdem gefegt. Die Marktvögtin sagt, ein Platz, auf den niemand warte, werde zu einer Wiese.\n\nDieses Jahr sind die Hirten früher gekommen. Sie hätten, sagen sie, von ihren Weiden aus die Feuer gesehen und gedacht, es gebe etwas zu feiern. Sie hatten recht. Ich wusste es nur noch nicht.',
      },
      highPlateau: {
        title: 'Der fehlende Stern',
        body: 'Auf der Sternplatte sind Sternbilder in den Fels geritzt. Der Nachtschreiber vergleicht sie seit Jahren mit dem Himmel. Eines stimmt nicht: Die Leiter hat im Fels eine Sprosse mehr.\n\nHeute Nacht hat er mich geweckt. Die Sprosse sei wieder da. Es ist kein Stern. Es ist unser siebzehntes Feuer. Wer das geritzt hat, hat keine Sterne gezeichnet, sondern eine Straße, die schon einmal gebrannt hat.',
      },
      roadFortyFive: {
        title: 'Fenno hält das Feuer',
        body: 'Ich habe Fenno heute zum ersten Mal das Feuer allein gelassen, eine ganze Nacht. Er hat nicht geschlafen, behauptet er. Auf dem Tisch lagen am Morgen vier leere Becher und eine Liste: jede Stunde, jedes Feuer, ein Haken.\n\nUnter der letzten Zeile stand: „Alle da. Auch die fremden.“ Ich habe die Liste in die Chronik gelegt. Sie gehört hierher.',
      },
      highKiln: {
        title: 'Ein Feuer, auf das jemand wartet',
        body: 'Der Kalte Ofen ist so groß wie ein Haus. Die Aschenhüterin fegt ihn jeden Morgen aus, obwohl er kalt ist, seit irgendwer denken kann. „Ein Feuer, auf das niemand wartet, kommt nicht zurück“, sagt sie.\n\nIch habe gefragt, was hier gebrannt wurde. Sie hat mir einen Ziegel gezeigt, den ersten, mit einem Zeichen: eine Laterne. Hier wurden die Laternen gemacht, Wacht. Alle. Auch unsere.',
      },
      highBoundary: {
        title: 'Ein Brief vom Grenzstein',
        body: 'Liebe Wacht,\n\nauf dem Stein sind zwei Zeichen. Unsere Laterne auf der einen Seite. Auf der anderen eine Laterne mit vier Strahlen statt drei. Ich habe den Schlüssel danebengehalten. Vier Zacken.\n\nDer Grenzgänger hat endlich geredet. Drüben gebe es eine Wacht wie unsere. Sie habe ihre Feuer nie ausgehen lassen. Sie habe nur aufgehört, auf Antwort zu warten. Bis vor Kurzem.',
      },
      chainTwentyFour: {
        title: 'Ein Feuer fehlt',
        body: 'Vierundzwanzig Feuer in einer Reihe, vom Tal bis unter den letzten Grat. Es fehlt eines.\n\nFenno fragt jeden Abend, wann. Ich sage jeden Abend: bald. Wir wissen beide, dass ich es hinauszögere. Man steht nicht jeden Tag vor dem letzten Stück eines Weges, den vor zweihundert Jahren jemand angefangen hat.',
      },
      highFirstWatch: {
        title: 'Die dritte Stufe',
        body: 'Von der Ersten Warte stehen nur noch die Grundmauern. Eine Feuerschale. Eine Treppe mit drei Stufen, die nirgends mehr hinführt.\n\nIch habe unter die dritte Stufe gegriffen, ohne nachzudenken. Dort lag ein Schlüssel. Drei Zacken. Und ein Zettel, in einer Schrift, die ich aus unserer eigenen Chronik kenne, von der allerersten Seite: „Wenn du das liest, bist du neugierig, und mehr braucht es am Anfang nicht.“',
      },
      roadSixty: {
        title: 'Der Weg der Feuer',
        body: 'Diese Seite schreibe ich selbst. Die Straße brennt, vom Tal bis zur Ersten Warte, und weiter, den anderen Hang hinunter, in Feuern, die nicht unsere sind.\n\nWer hat die anderen Feuer entzündet? Niemand allein. Eine hat angefangen, eine hat weitergemacht, eine hat den Schlüssel unter die Stufe gelegt. Drüben wartet eine Wacht mit vier Strahlen. Alwine packt schon. Fenno sagt, diesmal komme er mit. Ich glaube, diesmal hat er recht.',
      },
    },
  },
  ceremony: {
    fresh: (names: string) => `Neu frei: ${names}.`,
    wheel: 'Am Sternenrad drehen',
    wheelResult: (name: string, blurb: string) => `Das Sternenrad zeigt: ${name}. ${blurb}`,
    title: (layer: string) => `${layer}`,
    body: (amount: string, currency: string) => `Das Tal ruht. Im Archiv liegen jetzt ${amount} ${currency} mehr.`,
    cta: 'Ein neuer Morgen',
    milestone: (n: string) => `Meilenstein: zum ${n}. Mal. Das Tal vergisst es nicht.`,
    layers: {
      moonturn: { l1: 'Der Mond dreht sich über dem Dämmertal.', l2: 'Der Glimmer verfliegt, die Häuser sinken in den Schlaf.', l3: 'Was du gelernt hast, bleibt.' },
      longNight: { l1: 'Die Sonne bleibt fort.', l2: 'Tagelang brennt nur ein Feuer: deines.', l3: 'Dann, endlich, wird der Rand des Himmels hell.' },
      ages: { l1: 'Du legst den Schlüssel in eine andere Hand.', l2: 'Das Feuer merkt keinen Unterschied.', l3: 'So war es immer gemeint.' },
    },
  },
  fenno: {
    name: 'Fenno',
    any: {
      a: 'Ich hab die Laternen gezählt. Zweimal. Es werden mehr!',
      b: 'Alwine sagt, ich rede zu viel. Hat sie dir das auch geschrieben?',
      c: 'In der Stadt hängt an jeder Ecke eine Lampe. Keine einzige glimmt richtig.',
      d: 'Soll ich was ausbauen? Ich bau was aus.',
      e: 'Der Greif hat mich angeschaut. Er mag mich. Oder er hat Hunger.',
      f: 'Wenn man ganz still ist, hört man den Glimmer knistern. Ich bin nie ganz still.',
      g: 'Ich hab die dritte Stufe geputzt. Nur für den Fall.',
      h: 'Früher war hier abends alles dunkel. Jetzt muss ich die Augen zukneifen.',
    },
    night: { a: 'Schön, oder? Von hier sieht man das Feuer am besten.', b: 'Ich bleib noch wach. Jemand muss die Glühwürmchen zählen.' },
    dawn: { a: 'Morgen! Ich hab schon alle Laternen ausgepustet. Fast alle.' },
    winter: { a: 'Kalt! Aber in der Schmiede ist es warm. Ich geh mal „nachsehen“.' },
    rain: { a: 'Regen ist gut für die Kräuter, sagt Alwine. Meine Schuhe sehen das anders.' },
    mist: { a: 'Bei Nebel finde ich den Weg nur wegen der Laternen. Gut, dass wir die haben.' },
    wind: { a: 'Der Wind hat meine Mütze. Falls du sie siehst: Sie ist blau.' },
  },
}

export type StoryStrings = typeof storyDe
