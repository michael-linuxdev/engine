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
      coasts: (n: string) => `Öffnet sich mit ${n} Küstenlanden.`,
      sky: (n: string) => `Öffnet sich mit ${n} Sternen auf der Himmelskarte.`,
      constellations: (n: string) => `Öffnet sich mit ${n} vollständigen Sternbildern.`,
      isles: (n: string) => `Öffnet sich mit ${n} Inseln.`,
      trained: (n: string) => `Öffnet sich mit ${n} ausgebildeten Lehrlingen.`,
      posted: (n: string) => `Öffnet sich mit ${n} Lehrlingen in einem eigenen Land.`,
      rim: (n: string) => `Öffnet sich mit ${n} Landen am Rand der Karte.`,
      beacon: (n: string) => `Öffnet sich mit ${n} Stufen des Großen Leuchtfeuers.`,
    },
    menu: 'Chronik',
    title: 'Chronik der Wächterin',
    unread: 'Neue Seite',
    empty: 'Noch steht nichts darin.',
    signature: '— Alwine',
    signatureYou: '— die Wacht vor dir',
    signatureFenno: '— Fenno',
    letterFenno: 'Ein Brief von Fenno, vom Greif gebracht',
    letter: 'Ein Brief, vom Greif gebracht',
    prev: 'Zurück',
    next: 'Weiter',
    close: 'Buch schließen',
    page: (n: string, total: string) => `Seite ${n} von ${total}`,
    chapter: (n: string, name: string) => `Kapitel ${n} · ${name}`,
    books: { watch: 'Buch 1 · Die Wacht', wayOfFires: 'Buch 2 · Der Weg der Feuer', deepTime: 'Buch 3 · Die tiefe Zeit', apprentices: 'Buch 4 · Die Lehrlinge', greatLight: 'Buch 5 · Das große Licht' },
    bookShort: (n: string) => `Buch ${n}`,
    bookLocked: { wayOfFires: 'Beginnt mit dem ersten Hochland.', deepTime: 'Beginnt jenseits der Ersten Warte.', apprentices: 'Beginnt mit der ersten Insel.', greatLight: 'Beginnt hinter der Äußersten Insel.' },
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
      descent: 'Der andere Hang',
      lights: 'Lichter am Wasser',
      twoLists: 'Zwei Listen',
      deepTime: 'Die tiefe Zeit',
      fourRays: 'Vier Strahlen',
      school: 'Die Schulinsel',
      candidates: 'Wer kommt',
      lessons: 'Was man nicht lehren kann',
      names: 'Namen',
      newWatch: 'Die Neue Warte',
      beyondChart: 'Hinter der Karte',
      foreignFires: 'Fremde Feuer',
      everyStone: 'Ein Stein aus jedem Land',
      thousandLamps: 'Tausend Lampen',
      greatLight: 'Das große Licht',
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
        title: 'Achtundzwanzig Stufen',
        body: 'Achtundzwanzig Stufen brennen. Ich merke, dass ich abends nicht mehr zuerst auf unser eigenes Feuer sehe, sondern die Kette hinauf, bis dorthin, wo sie aufhört.\n\nFrüher habe ich ein Feuer gehütet. Jetzt hüte ich die Frage, wie weit es reicht. Alwine schreibt, das sei keine andere Arbeit, nur dieselbe von weiter oben.',
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
      coastDescent: {
        title: 'Bergab',
        body: 'Liebe Wacht,\n\nwir sind über den Grat. Fenno ist die ersten hundert Kehren gerannt und die nächsten hundert getragen worden, von einem Maultier, das ihn nicht leiden kann.\n\nAn jeder zehnten Kehre steht ein Stein mit einer Laterne darauf. Vier Strahlen. Jemand hat diesen Weg für Leute gebaut, die von unten heraufkommen. Wir gehen ihn in der falschen Richtung, und er stimmt trotzdem.',
      },
      skyFirst: {
        title: 'Der erste Stern',
        body: 'Solange die beiden fort sind, habe ich in der Sternwarte etwas angefangen. Unter der Kuppel hängt eine leere Karte, groß wie ein Tischtuch. Ich habe den ersten Stern eingetragen.\n\nEs hat länger gedauert, als ich dachte. Man muss warten, bis er wirklich dort steht, wo man ihn vermutet. Der Himmel lässt sich nicht drängen.',
      },
      coastWood: {
        title: 'Fenno schreibt',
        body: 'Hallo Wacht,\n\nAlwine sagt, ich soll auch mal schreiben. Also: Hier ist ein Wald, in dem es nie regnet und in dem trotzdem alles tropft. Ich bin seit zwei Tagen nass. Der Pilzsammler sagt, er hört die Pilze wachsen. Ich habe eine Stunde gelauscht und nur Alwine schnarchen gehört.\n\nNachts leuchten die Pilze. Ich habe einen eingepackt. Er leuchtet jetzt in meinem Rucksack und riecht.',
      },
      coastSalt: {
        title: 'Hundert Spiegel',
        body: 'Liebe Wacht,\n\nam Hang liegen Salzbecken, hundert Stück, und in der Nacht liegt in jedem ein Stück Himmel. Die Salzharkerin hat mir die untersten gezeigt. Dort spiegeln sich keine Sterne. Dort spiegeln sich Lichter, die tiefer stehen, knapp über dem Wasser.\n\n„Die am Rand“, hat sie gesagt, „das sind die von der Küste.“ Wacht, ich habe an unsere Sternwarte gedacht. An den Rand des Himmels. An das, was dort fehlt, bevor eine Lange Nacht kommt.',
      },
      conLadder: {
        title: 'Die Leiter',
        body: 'Das erste Sternbild ist vollständig: die Leiter. Sieben Sterne, zwei Holme, drei Sprossen, wenn man großzügig zählt.\n\nIch habe sie mit der alten Karte verglichen, die in der Schublade unter dem Rohr liegt. Dort hat die Leiter neun Sterne. Zwei davon stehen so tief, dass man sie von hier gar nicht sehen dürfte. Jemand hat sie trotzdem eingetragen. Jemand hat sie einmal gesehen.',
      },
      coastMill: {
        title: 'Zweimal am Tag',
        body: 'Hallo Wacht,\n\nich habe das Meer gesehen. Es ist größer, als Alwine gesagt hat, und sie hat schon übertrieben. Es kommt zweimal am Tag und geht zweimal wieder, und niemand regt sich darüber auf.\n\nDer Müller mahlt, wenn es kommt. Ich habe gefragt, was er macht, wenn es einmal nicht kommt. Er hat mich angesehen wie du, wenn ich frage, was passiert, wenn das Feuer ausgeht.',
      },
      skyEdge: {
        title: 'Am Rand',
        body: 'Vier Sterne stehen auf der Karte. Der fünfte gehört an den Rand, knapp über die Berge. Ich warte seit einer Woche auf ihn.\n\nEr ist da, aber er benimmt sich nicht wie ein Stern. Er flackert bei Wind. Er ist gelber als die anderen. Und gestern Abend war er eine halbe Stunde früher zu sehen, als er dürfte. Ich habe ihn mit Bleistift eingetragen.',
      },
      coastCliffs: {
        title: 'Die hellste Wand',
        body: 'Liebe Wacht,\n\ndie Klippen hier sind so weiß, dass sie nachts noch leuchten, wenn längst kein Licht mehr da ist. Oben steht ein Stuhl aus Stein, mit Blick aufs Meer. In die Lehne ist die Laterne mit den vier Strahlen geritzt.\n\nIch habe mich hineingesetzt. Von dort sieht man die ganze Küste, und an der Küste elf Feuer. Die Kreidebrecherin sagt, ihre Großmutter habe von diesem Stuhl aus vierzig gezählt.',
      },
      coastBoats: {
        title: 'Dreihundert Laternen',
        body: 'Hallo Wacht,\n\nhier liegen alte Boote, und ein Mann nimmt sie auseinander und hebt von jedem die Laterne auf. Dreihundert Stück, alle geputzt, keine brennt. Ich habe gefragt, warum er sie nicht anzündet.\n\n„Wem denn?“, hat er gefragt. Ich habe gesagt: uns. Er hat lange nichts gesagt und dann eine angezündet. Nur eine. Aber er hat sie ins Fenster gestellt, zum Berg hin.',
      },
      coastPilot: {
        title: 'Wer zuerst sieht',
        body: 'Liebe Wacht,\n\ndie Lotsin sieht jedes Schiff, bevor es selbst etwas sieht. Ich habe sie gefragt, woran sich die Schiffe nachts halten. „An die Feuer“, hat sie gesagt, „und wo keins mehr ist, an mich.“\n\nSie hat eine Liste der Feuer, die es nicht mehr gibt. Sie ist länger als die der Feuer, die brennen. Am Ende der Liste steht eines, das in ihren Karten „das Feuer hinter dem Berg“ heißt. Daneben ein Fragezeichen, und seit letztem Herbst ein zweites Zeichen: ein Haken.',
      },
      skyOldChart: {
        title: 'Die alte Karte',
        body: 'Neun Sterne. Ich habe die alte Karte jetzt neben die neue gehängt, und der Unterschied ist nicht mehr zu übersehen. Oben, in der Mitte des Himmels, stimmen sie überein. Am Rand hat die alte Karte einen ganzen Kranz von Sternen, die es bei mir nicht gibt.\n\nSie sind alle gleich hell gezeichnet. Sie stehen alle gleich hoch. Kein Himmel ordnet seine Sterne so.',
      },
      coastSeagrass: {
        title: 'Unter Wasser mähen',
        body: 'Hallo Wacht,\n\nes gibt hier Wiesen, die zweimal am Tag untergehen. Ich durfte mähen. Ich habe mir in den Schuh gemäht, aber nur in den Schuh.\n\nDer Mäher schläft auf Stroh, obwohl er Seegras für alle Betten der Küste macht. Er sagt, wer den ganzen Tag etwas für andere macht, will abends was anderes. Ich glaube, deshalb sitzt du abends nie am Feuer, sondern in der Küche.',
      },
      conSecond: {
        title: 'Der Schlüssel am Himmel',
        body: 'Das zweite Sternbild heißt der Schlüssel. Fünf Sterne, ein Schaft und ein Bart. Ich habe gezählt: drei Zacken.\n\nAuf der alten Karte hat er vier. Der vierte Stern steht wieder am Rand, wieder zu tief, wieder gelb eingezeichnet statt weiß. Wer immer diese Karte gemacht hat, wusste den Unterschied. Er hat zwei Farben benutzt. Ich habe nur nie darauf geachtet.',
      },
      coastBuoy: {
        title: 'Eine Glocke, die niemand läutet',
        body: 'Liebe Wacht,\n\ndraußen auf der Sandbank schlägt eine Glocke im Seegang. Seit hundert Jahren, sagt die Tonnenlegerin, und kein Mensch hat sie je angefasst außer zum Ölen.\n\nIch habe sie gefragt, ob das nicht traurig sei: etwas zu pflegen, das einem nie antwortet. Sie hat gelacht. „Sie antwortet jedem Schiff“, hat sie gesagt. „Nur nicht mir. Ich bin nicht gemeint.“ Ich habe lange nichts so Kluges über unsere Arbeit gehört.',
      },
      coastNets: {
        title: 'Die richtigen Löcher',
        body: 'Hallo Wacht,\n\nich kann jetzt einen Netzknoten. Er hält. Der Netzflicker sagt, ein Netz ist vor allem Loch, und man muss die richtigen Löcher lassen.\n\nIch habe ihm von der Feuerstraße erzählt, und er hat gesagt, das sei dasselbe: lauter Dunkel mit Knoten drin. Wenn ein Knoten reißt, fällt nicht das ganze Netz. Aber der Fisch findet das Loch. Ich weiß nicht, wer bei uns der Fisch ist. Alwine sagt: die Nacht.',
      },
      skyTwoSkies: {
        title: 'Zwei Himmel',
        body: 'Vierzehn Sterne, und ich führe inzwischen zwei Karten. Auf der einen stehen die Sterne, die bleiben. Auf der anderen die am Rand, die flackern.\n\nGestern ist auf der zweiten einer dazugekommen. Einfach so, an einem Abend, an dem kein Stern aufgehen sollte. Heute kam ein Greif mit einem Brief von Fenno. Er schreibt von einem Mann, der eine Laterne ins Fenster gestellt hat, zum Berg hin.',
      },
      coastHarbour: {
        title: 'Vier Striche',
        body: 'Liebe Wacht,\n\nim Hafenbuch stehen hinten Namen in einer Schrift aus vier Strichen. Die Hafenmeisterin kann sie nicht lesen, aber sie schreibt sie ab, wenn das Buch voll ist, ins nächste. Seit zwölf Büchern.\n\nIch habe ihr den Schlüssel gezeigt. Sie hat genickt und eine Seite aufgeschlagen, auf der nur ein einziger Name steht, und daneben, in ihrer eigenen Hand: „Ist den Berg hinauf. Kommt wieder.“ Das Datum ist zweihundertelf Jahre alt.',
      },
      conThird: {
        title: 'Was ein Sternbild ist',
        body: 'Drei Sternbilder sind vollständig. Ich habe heute verstanden, dass ein Sternbild keine Entdeckung ist, sondern eine Verabredung. Die Sterne der Laterne haben nichts miteinander zu tun. Jemand hat beschlossen, dass sie zusammengehören, und es weitergesagt.\n\nSo ist es mit den Feuern auch. Zwischen unserem Tal und dem Hohen Moor ist nichts als Dunkel. Die Straße ist nur das, was wir darüber verabredet haben.',
      },
      coastLightship: {
        title: 'Ein Schiff, das bleibt',
        body: 'Hallo Wacht,\n\nich war auf einem Schiff, das nirgends hinfährt. Es hat sein Feuer oben am Mast und liegt genau dort, wo kein Turm stehen kann. Der Schiffsjunge ist sechzig. Er sagt, er sei mit vierzehn an Bord gekommen und habe nie jemanden gefunden, der es besser kann.\n\nIch habe gefragt, ob er einen Lehrling will. Er hat mich sehr lange angesehen. Keine Sorge. Ich habe gesagt, ich hätte schon eine Stelle.',
      },
      coastKiln: {
        title: 'Der kleine Bruder',
        body: 'Liebe Wacht,\n\nhier brennt ein Ofen, der Muscheln zu Kalk macht. Die Kalkbrennerin kennt den Kalten Ofen in den Bergen. Sie nennt ihn „den großen Bruder“. Ihrer ist nie ausgegangen.\n\nIch habe gefragt, wie man ein Feuer zweihundert Jahre hält. „Gar nicht“, hat sie gesagt. „Man hält es bis morgen. Das hat meine Mutter gemacht und ihre auch.“ Ich schreibe es dir auf, weil ich es selbst erst hier begriffen habe.',
      },
      skyLow: {
        title: 'Zu tief für Sterne',
        body: 'Zwanzig Sterne auf der ersten Karte. Auf der zweiten, der mit den flackernden, sind es inzwischen sechs.\n\nIch habe gerechnet, mit dem Rohr und einem Faden. Die sechs stehen nicht am Himmel. Sie stehen darunter, hinter dem Grat, dort wo die Erde sich wegkrümmt und nur noch das Hellste herüberreicht. Ich habe die ganze Zeit keine Sterne gezählt. Ich habe die Küste gezählt.',
      },
      coastPath: {
        title: 'Ein Weg für sechs Stunden',
        body: 'Hallo Wacht,\n\nhier gibt es einen Weg, der nur sechs Stunden am Tag da ist. Dann kommt das Meer und nimmt ihn wieder mit. Der Wattführer steckt ihn jeden Morgen neu ab. Jeden Morgen!\n\nIch habe gesagt, das sei doch Unsinn, er könne ja auch eine Brücke bauen. Er hat gesagt: „Und wer steckt dann morgens den Weg ab?“ Alwine hat so gelacht, dass sie sich setzen musste. Ich verstehe es immer noch nicht ganz. Aber fast.',
      },
      coastBirds: {
        title: 'Die Vögel wissen es',
        body: 'Liebe Wacht,\n\ndie Vogelwartin sagt, die Zugvögel flögen nach den Feuern. In den Jahren, in denen viele brannten, seien sie in einer geraden Linie gekommen. In den dunklen Jahren seien sie umhergeirrt und zu spät gewesen.\n\nSeit zwei Sommern kommen sie wieder gerade. Sie führt Buch darüber, wie über alles. Im Buch steht bei jedem Jahr eine Zahl: wie viele Feuer man von der Insel sah. Die Zahlen fallen, vierzig Jahre lang. Dann, ganz unten auf der letzten Seite, steigen sie.',
      },
      conFifth: {
        title: 'Fünf Bilder, ein Rand',
        body: 'Fünf Sternbilder. Der obere Himmel ist fast fertig, und er ist genau so, wie er auf der alten Karte steht. Kein Stern fehlt. Es hat nie einer gefehlt.\n\nWas vor einer Langen Nacht verschwindet, sind die gelben am Rand. Die Sternwarte hat es immer richtig gesehen und immer falsch genannt. „Dort fehlen Sterne“, stand in der Chronik. Es müsste heißen: Dort ist jemand eingeschlafen.',
      },
      coastVillage: {
        title: 'Für ein Dorf, das es nicht mehr gibt',
        body: 'Liebe Wacht,\n\nbei Ebbe ragt hier ein Kirchturm aus dem Watt. Der Glöckner läutet ihn, für ein Dorf, das seit hundert Jahren unter Wasser liegt.\n\nIch habe ihn gefragt, für wen. „Für die, die hier wohnen werden“, hat er gesagt. „Das Meer kommt und geht. Vor dem Dorf war hier auch schon ein Dorf.“ Er hat mir im Schlick drei Schichten Mauern gezeigt, übereinander. Unter jeder lag Asche von einem Feuer.',
      },
      coastCharts: {
        title: 'Karten ohne Land',
        body: 'Hallo Wacht,\n\nich war in einem Haus voller Karten, auf denen das Land leer ist. Nur das Meer ist bemalt, und am Ufer stehen Punkte. Jeder Punkt ist ein Feuer. Die Zeichnerin hat mich in den Keller gelassen, zu den alten Blättern.\n\nAuf dem ältesten ist die Küste ein einziger Strich aus Punkten. Auf dem nächsten fehlen ein paar. Dann viele. Dann wieder mehr. Dann wieder weniger. Wacht, das geht so durch den ganzen Keller. Es sieht aus, als würde die Küste atmen.',
      },
      skyCount: {
        title: 'Was Fenno gesehen hat',
        body: 'Achtundzwanzig Sterne. Ich habe Fennos Brief dreimal gelesen und dann das Archiv aufgeschlossen. Dort liegen die Karten der Wächter vor uns, eine in jedem Fach. Ich habe sie nie nebeneinandergelegt.\n\nHeute habe ich es getan. Auf jeder ist der obere Himmel gleich. Auf jeder ist der Rand anders: einmal voll, einmal leer, einmal halb. Was wir ein Zeitalter nennen, ist ein Atemzug dieser Küste. Die Lange Nacht ist der Moment, in dem sie ausgeatmet hat.',
      },
      coastArch: {
        title: 'Was man dem Meer schuldet',
        body: 'Liebe Wacht,\n\nam Strand steht ein Tor aus zwei Walrippen. Wer hindurchgeht, muss dem Strandvogt sagen, was er dem Meer schuldet. Fenno hat gesagt: „Einen Schuh.“ Der Vogt hat es ernst aufgeschrieben.\n\nIch habe lange überlegt. Dann habe ich gesagt: einen Weg zurück. Er hat geblättert, weit nach vorn, und mir einen Eintrag gezeigt, zweihundertelf Jahre alt, in der Schrift mit den vier Strichen. Er konnte ihn nicht lesen. Ich inzwischen schon. Es ist dieselbe Antwort.',
      },
      coastGlow: {
        title: 'Das Meer leuchtet selbst',
        body: 'Hallo Wacht,\n\ndas glaubst du mir nicht: Hier leuchtet nachts das Wasser. Bei jedem Schritt. Ich bin eine Stunde am Ufer hin und her gerannt und habe eine Spur aus Licht gemacht, bis Alwine gesagt hat, ich solle die Fische schlafen lassen.\n\nDie Fischerin fährt ohne Laterne hinaus. Sie sagt, hier brauche es kein Feuer, das Meer wisse selbst, wo sie ist. Ich habe gefragt, ob sie dann nie Angst hat. „Doch“, hat sie gesagt. „Wenn es mal nicht leuchtet.“',
      },
      conSeventh: {
        title: 'Vor den Sternen',
        body: 'Sieben Sternbilder. Im untersten Fach des Archivs habe ich die älteste Karte gefunden, auf Leder, nicht auf Papier. Der Rand ist ein geschlossener Ring aus gelben Punkten, ohne eine einzige Lücke.\n\nDas hat die Sternwarte gesehen, bevor die Sterne fehlten: einen Horizont, der rundherum bewohnt war. Kein Wunder, dass niemand die Lichter für etwas anderes hielt als für den Himmel. Sie waren immer da gewesen.',
      },
      coastRose: {
        title: 'Vier aus zweiunddreißig',
        body: 'Liebe Wacht,\n\nauf einem Platz am Meer liegt eine Rose aus Stein, zweiunddreißig Striche. Vier sind aus Messing. Der Kompassmacher sagt, sie zeigten auf vier Feuer, die nie ausgehen dürfen, damit alle anderen wieder angezündet werden können. Eines davon, sagt er, sei erloschen gewesen.\n\nIch habe mich auf den vierten Strich gestellt und ihm nachgesehen. Er zeigt den Berg hinauf, über den Grat, über die Hochlande. Wacht, er zeigt auf dich.',
      },
      skyRing: {
        title: 'Vier Strahlen',
        body: 'Vierunddreißig Sterne. Alwines Brief von der Kompassrose liegt neben der Lederkarte, und jetzt sehe ich, was ich vorher für Schmuck gehalten habe: Vier der gelben Punkte im Ring sind größer gezeichnet, mit Strahlen. Einer steht dort, wo unser Tal ist.\n\nDie Laterne mit den vier Strahlen ist kein fremdes Zeichen. Es ist das ganze Zeichen. Unseres hat drei, weil wir vergessen haben, uns selbst mitzuzählen.',
      },
      coastHorn: {
        title: 'Ein Ton',
        body: 'Hallo Wacht,\n\nhier ist ein Fels mit einem Loch, und wenn der Wind durchgeht, klingt es wie ein Horn. Wenn kein Wind geht, bläst eine Frau hinein. Ein Ton: „Ich bin hier.“ Sie hat ihn von ihrer Großmutter, und die hatte ihn aus den Bergen.\n\nIch habe meine Laterne genommen und geantwortet. Kurz, lang, verdeckt. Sie hat das Horn sinken lassen und mich angestarrt. Dann hat sie gefragt, wer mir das beigebracht hat. Ich habe gesagt: du. Also du, Wacht. Ich hoffe, das war richtig.',
      },
      coastBottles: {
        title: 'Der älteste Brief',
        body: 'Liebe Wacht,\n\nin dieser Bucht landet jede Flaschenpost der Küste. Der Briefsammler liest alle und beantwortet die, die es verdienen. Er hat mir den ältesten Brief gezeigt, den er besitzt. Er steckt noch in der Flasche, weil das Papier sonst zerfällt.\n\nMan kann ihn durch das Glas lesen. Vier Striche. „Bin oben. Das Feuer brennt. Schickt jemanden, wenn ihr mich braucht. Wenn nicht, bleibe ich, bis hier jemand lesen kann.“ Er hat nie eine Antwort hineingeworfen. Er wusste nicht, wohin.',
      },
      conNinth: {
        title: 'Die Antwort',
        body: 'Neun Sternbilder. Ich habe heute Abend etwas getan, das in keiner Chronik steht. Ich habe das Feuer oben nicht einfach brennen lassen. Ich habe es abgedeckt und wieder aufgedeckt. Kurz, lang, verdeckt. Den Berg hinauf, damit die Kette es weiterträgt.\n\nEs hat die halbe Nacht gedauert. Dann hat am Rand, hinter dem Grat, einer der gelben Punkte geblinkt. Kurz, lang, verdeckt. Zweihundertelf Jahre, und die Antwort hat eine halbe Nacht gebraucht.',
      },
      coastObservatory: {
        title: 'Zwei Listen',
        body: 'Liebe Wacht,\n\nüber dem Meer steht eine Sternwarte wie unsere, nur aus Kupfer und grün vom Salz. Die Sternzählerin führt zwei Listen, eine für den Himmel, eine für die Küste. Sie hat gelacht, als ich ihr von deinem Brief erzählte. „Zwei Karten“, hat sie gesagt, „natürlich. Wie denn sonst.“\n\nAuf ihrer zweiten Liste gibt es eine leere Zeile, ganz oben. Sie hat sie nie gestrichen. Heute Nacht hat sie etwas hineingeschrieben und das Buch zu mir gedreht. Dort steht jetzt: „Das Feuer hinter dem Berg. Brennt.“',
      },
      skyReturn: {
        title: 'Der Rand füllt sich',
        body: 'Dreiundvierzig Sterne oben, und unten am Rand komme ich mit dem Eintragen kaum nach. Jede Woche ein gelber Punkt mehr. Der Mann mit den dreihundert Laternen muss angefangen haben, sie zu verteilen.\n\nIch trage sie jetzt mit Tinte ein, nicht mehr mit Bleistift. Die Lange Nacht wird wiederkommen, so wie die Ebbe. Aber ich weiß jetzt, was dann am Rand geschieht, und dass man hinüberleuchten kann.',
      },
      coastCauseway: {
        title: 'Die letzte Laterne',
        body: 'Hallo Wacht,\n\nwir stehen auf einem Damm, der gerade ins Meer hinausgeht. Alle hundert Schritte eine Laterne. Der Wärter zündet sie an, eine nach der anderen, und ich durfte die Fackel tragen. Am Ende steht ein Turm. Ich habe gefragt, wer dort wohnt. Er hat gesagt, er zünde nur die Laternen an, den Turm habe er nie betreten. Das gehöre sich nicht.\n\nAlwine ist sehr still. Sie hat den Schlüssel mit den vier Zacken in der Hand, seit wir losgegangen sind. Morgen früh gehen wir hin. Ich schreibe dir danach. Versprochen.',
      },
      coastFourRays: {
        title: 'Zwei Becher',
        body: 'Liebe Wacht,\n\ndie Tür war nicht verschlossen. Den Schlüssel habe ich trotzdem ins Schloss gesteckt, weil man das so macht. Er passt.\n\nDrinnen ist es wie bei uns, bis hin zum Haken, an dem der Mantel hängt. Auf dem Tisch standen zwei Becher, einer noch warm. Am Feuer saß ein Mädchen in Fennos Alter und hat eine Chronik abgeschrieben. Ihre Meisterin ist im Frühjahr gestorben, sagt sie. Seither hält sie das Feuer allein und stellt jeden Abend einen zweiten Becher hin, falls jemand den Berg herunterkommt.\n\nFenno hat ihr den Pilz geschenkt. Er leuchtet noch.',
      },
      conAll: {
        title: 'Die tiefe Zeit',
        body: 'Die Himmelskarte ist fertig, alle zwölf Bilder. Ich habe sie neben die Lederkarte gehängt. Oben gleichen sie sich Stern für Stern. Am Rand fehlt meiner noch viel zum geschlossenen Ring. Aber er wächst, und zum ersten Mal weiß jemand, warum.\n\nWas sah die Sternwarte, bevor die Sterne fehlten? Nachbarn. Alwine schreibt, sie bleibe den Winter über unten und lehre das Mädchen, was es noch nicht weiß. Fenno schreibt, er lehre es auch. Ich fürchte, wir werden bald mehr Lehrlinge haben als Laternen. Es gibt Schlimmeres.',
      },
      isleSchool: {
        title: 'Eine Schule',
        body: 'Hallo Wacht,\n\nwir haben eine Schule gefunden. Also ein Haus mit Bänken und eine Frau, die seit Jahren auf Schüler wartet. Die vom Damm will nicht, dass ich ihren Namen in einen Brief schreibe, also schreibe ich: die vom Damm. Sie hat sich in die erste Bank gesetzt.\n\nDie Schulmeisterin hat mich angesehen und gefragt, was ich unterrichte. Ich habe gesagt, ich sei der Lehrling. Sie hat gesagt: „Nicht mehr lange.“',
      },
      trainedFirst: {
        title: 'Der erste',
        body: 'Heute ist jemand den Berg heraufgekommen, mit einem Brief von Fenno in der Hand. Darin stand nur: „Der kann Laternen putzen und stellt keine dummen Fragen. Bring ihm den Rest bei.“\n\nIch habe zwei Tage gebraucht. Am Ende konnte er alle Zeichen, und ich hatte zum ersten Mal erklärt, was ich bisher nur getan habe. Es ist erstaunlich, wie wenig man von seiner eigenen Arbeit weiß, bis jemand danach fragt.',
      },
      isleSister: {
        title: 'Zehn Minuten',
        body: 'Liebe Wacht,\n\ndie Insel ist so klein, dass ich sie in zehn Minuten umrundet hatte. Der Fährknecht sitzt hier jeden Abend, obwohl er nur Wasser holen will.\n\nIch habe ihn gefragt, ob er eine Wacht haben möchte. Er hat lange aufs Meer gesehen. „Ich habe schon eine“, hat er gesagt. „Ich wusste nur nicht, dass man das so nennt.“ Ich fange an zu glauben, dass wir die Leute nicht suchen müssen. Wir müssen es ihnen nur sagen.',
      },
      postedFirst: {
        title: 'Ein eigenes Land',
        body: 'Der erste Lehrling ist heute losgezogen, in ein Land, das ich ihm auf der Karte gezeigt habe. Er hat die Laterne mitgenommen, die ich ihm gegeben habe, und meinen zweitbesten Mantel, den ich ihm nicht gegeben habe.\n\nAm Abend war dort ein neues Licht in der Kette. Es hat zweimal geflackert, als wüsste es nicht recht, ob es darf. Dann hat es gehalten.',
      },
      isleTwins: {
        title: 'Zur selben Minute',
        body: 'Hallo Wacht,\n\nhier wohnen zwei Brüder auf zwei Inseln und reden nicht miteinander. Seit zwanzig Jahren. Aber sie zünden jeden Abend zur selben Minute ihre Laternen an. Ich habe es mit Alwines Uhr nachgemessen.\n\nIch habe den linken gefragt, warum. Er hat gesagt, er wolle nicht, dass der andere glaubt, er sei nachlässig. Der rechte hat dasselbe gesagt. Die vom Damm meint, das sei auch eine Art, sich gern zu haben.',
      },
      trainedSecond: {
        title: 'Was man nicht lehren kann',
        body: 'Die zweite Schülerin kann alles besser als der erste. Sie putzt die Linse schneller, sie liest die Zeichen flüssiger, und sie fragt nie zweimal.\n\nGestern Nacht ging ein Sturm. Sie hat das Feuer gehalten, tadellos. Aber sie hat kein einziges Mal aus dem Fenster gesehen, ob drüben noch jemand brennt. Ich weiß nicht, wie man das lehrt. Ich weiß nicht einmal, ob ich es gelernt habe oder ob es schon da war.',
      },
      isleHerring: {
        title: 'Fässer für die Geduld',
        body: 'Liebe Wacht,\n\nder Fassbinder sagt, der Hering komme, wann er wolle, und ein Fischer sei jemand, der das aushält. Die meisten jungen Leute hier gehen fort, weil sie es nicht aushalten.\n\nGeblieben ist ein Mädchen, das die Fässer zählt, jeden Abend, auch wenn keins dazugekommen ist. Fenno hat ihr unsere Zeichen gezeigt. Sie konnte sie nach einer Stunde. Sie hat gesagt, das sei wie Zählen, nur dass jemand zurückzählt.',
      },
      isleSheep: {
        title: 'Was ein Lamm weitersagt',
        body: 'Hallo Wacht,\n\ndie Schafe hier fressen Tang. Die Schäferin sagt, sie habe es einem einzigen Lamm beigebracht, als sie klein war, und das habe es den anderen gezeigt. Jetzt können es alle, und keines weiß mehr, von wem.\n\nIch habe gesagt, das sei ja wie bei uns. Alwine hat gelacht und gefragt, wer von uns beiden das Lamm sei. Ich habe gesagt: du. Sie hat gesagt, das habe sie befürchtet.',
      },
      isleShards: {
        title: 'Was einmal eine Laterne war',
        body: 'Liebe Wacht,\n\ndas Meer wirft hier Glas an, rund und matt. Der Glassammler behält die grünen Stücke. Er sagt, grün sei das Glas der alten Laternen gewesen.\n\nEr hat einen Krug voll. Ich habe ihn gefragt, was er damit vorhat. „Wenn es genug ist“, hat er gesagt, „mache ich eine neue daraus.“ Wie viel genug sei? Er wusste es nicht. Fenno hat nachgezählt und gesagt, es reiche seit Jahren.',
      },
      trainedFour: {
        title: 'Vier',
        body: 'Vier sind ausgebildet. Die Küche ist zu klein geworden, und irgendwer hat meinen Becher benutzt.\n\nIch habe heute Abend zugehört, wie sie über mich reden, wenn sie glauben, ich sei oben. Sie machen nach, wie ich die Stufen zähle. Ich wusste nicht, dass ich die Stufen zähle. Alwine hat es getan. Ich muss es von ihr haben.',
      },
      isleTwoTowers: {
        title: 'Welches ist das richtige?',
        body: 'Hallo Wacht,\n\nauf einer Insel stehen zwei Türme, und eine Frau hält beide Feuer, weil ihr nie jemand gesagt hat, welches das richtige ist. Jede Nacht zweimal die Treppe. Seit elf Jahren.\n\nIch habe gesagt, ich könne ja mal nachfragen. Die vom Damm hat mich gegen das Schienbein getreten. Später hat sie gesagt: „Sie will es nicht wissen. Wenn eins das falsche wäre, müsste sie es ausmachen.“',
      },
      postedThree: {
        title: 'Drei Lichter mehr',
        body: 'Drei Lehrlinge haben jetzt ein eigenes Land. Ich sehe ihre Feuer von hier, und ich erkenne jedes. Der erste hält seines zu klein, aus Sparsamkeit. Die zweite hält ihres zu groß, aus Stolz. Der dritte vergisst es bis zur letzten Minute und ist dann pünktlich.\n\nIch habe keinem etwas gesagt. Alwine hat mir auch nie gesagt, dass meines schief brennt. Ich habe es erst gemerkt, als ich es von außen sah.',
      },
      isleEggs: {
        title: 'Ein Handel',
        body: 'Liebe Wacht,\n\nder Eiersammler nimmt aus jedem zehnten Nest ein Ei und legt einen Fisch hinein. Er sagt, die Vögel hätten das vorgeschlagen. Ich habe gelacht. Er nicht.\n\n„Wer etwas nimmt, ohne etwas dazulassen“, hat er gesagt, „kommt genau einmal.“ Fenno hat das aufgeschrieben. Er schreibt neuerdings Dinge auf. Ich habe ihm nicht gesagt, dass so eine Chronik anfängt.',
      },
      isleHalf: {
        title: 'Die Stunde, in der man es bereut',
        body: 'Hallo Wacht,\n\nich bin zu spät losgegangen. Es gibt hier eine Insel, zu der man bei Ebbe laufen kann, und eine Frau, die genau weiß, bis wann. Ich wusste es besser. Ich wusste es nicht besser.\n\nSie hat mich herausgezogen und kein Wort gesagt. Am Abend hat sie mir gezeigt, wie man die Flut an den Vögeln abliest. Die vom Damm sagt, das sei meine beste Unterrichtsstunde gewesen, weil ich diesmal der war, der nass ist.',
      },
      trainedSix: {
        title: 'Wer kommt',
        body: 'Sechs. Ich habe mir aufgeschrieben, woher sie kamen. Zwei hat Fenno geschickt. Eine stand eines Morgens vor der Tür und sagte, sie habe das Feuer gesehen. Einer ist der Sohn des Händlers, der damals im Tal sein Lager so aufschlug, dass er die Kette sah.\n\nKeiner von ihnen ist gekommen, weil er eine Wacht haben wollte. Sie sind gekommen, weil sie eine gesehen haben.',
      },
      isleGarden: {
        title: 'Kerne aus dem Tal',
        body: 'Liebe Wacht,\n\nauf einer Insel weit draußen wachsen Apfelbäume. Der Gärtner sagt, jemand habe die ersten Kerne aus einem Tal in den Bergen mitgebracht, vor sehr langer Zeit.\n\nIch habe einen Apfel gegessen. Wacht, es ist unsere Sorte. Die vom Hang hinter der Kräuterkate, die so sauer ist, dass nur wir sie mögen. Wer immer vor zweihundertelf Jahren den Berg hinaufging, ist vorher hier gewesen und hat Heimweh gehabt.',
      },
      isleYard: {
        title: 'Das letzte Brett',
        body: 'Hallo Wacht,\n\ndie Bootsbauerin baut Boote bis auf ein Brett. Das letzte muss der setzen, der damit fährt. Sie sagt, sonst sei es ihr Boot und nicht seins, und dann passe er nicht darauf auf.\n\nIch habe heute ein Brett gesetzt. Es ist ein kleines Boot. Die vom Damm hat den Namen draufgemalt, den verrate ich nicht. Aber er ist kurz, und es ist ein Pilz.',
      },
      postedFive: {
        title: 'Von selbst',
        body: 'Fünf Lande werden jetzt von jemandem gepflegt, der nicht ich bin. Ich habe heute zum ersten Mal einen ganzen Tag lang nichts für sie getan, und am Abend war alles ein Stück weiter als am Morgen.\n\nEs ist ein seltsames Gefühl. Ein bisschen wie überflüssig sein. Alwine schreibt, das sei das Gefühl, auf das sie dreißig Jahre hingearbeitet habe, und ich solle es gefälligst genießen.',
      },
      isleSilent: {
        title: 'Ohne ein Wort',
        body: 'Liebe Wacht,\n\nauf dieser Insel wird nicht gesprochen, wegen der brütenden Vögel. Die Frau, die hier lebt, redet mit Laternen. Unsere Zeichen, und noch dreißig mehr, die ich nicht kannte. Eines heißt „Ich sehe dich“. Eines heißt „Schlaf ruhig, ich bin wach“.\n\nIch habe alle abgeschrieben. Wacht, wir haben zweihundert Jahre lang mit drei Zeichen gelebt. Es ist, als hätte man nur „ja“, „nein“ und „hier“ gehabt.',
      },
      trainedNine: {
        title: 'Neue Zeichen',
        body: 'Neun. Alwines Liste mit den dreißig Zeichen hängt jetzt in der Küche. Die Lehrlinge konnten sie nach einer Woche. Ich brauche länger.\n\nHeute Nacht hat mir der erste von seinem Land aus etwas herübergeleuchtet, das ich nachschlagen musste. Es hieß: „Schlaf ruhig, ich bin wach.“ Ich bin trotzdem aufgeblieben. Aber ich habe mich dabei hingesetzt.',
      },
      isleWhite: {
        title: 'Weiß',
        body: 'Hallo Wacht,\n\nhier ist alles weiß gestrichen. Häuser, Steine, der Baum. Der Maler sagt, eine weiße Insel sehe man auch ohne Feuer. Ich habe gefragt, warum er dann trotzdem eins hat.\n\n„Bei Tag sieht man die Insel“, hat er gesagt. „Bei Nacht sieht man, dass jemand da ist. Das ist nicht dasselbe.“ Ich habe den Satz zwei Lehrlingen geschickt, die mich gefragt haben, wozu sie das Feuer brauchen, wenn ihr Land eh jeder kennt.',
      },
      isleFresh: {
        title: 'Neuigkeiten',
        body: 'Liebe Wacht,\n\ndie Wasserträgerin nimmt für ihr Wasser nichts als Neuigkeiten. Sie wusste von dir, bevor ich den Mund aufgemacht hatte. Sie wusste von der Feuerstraße, von der Himmelskarte und davon, dass Fenno ins Watt gefallen ist.\n\nIch habe gefragt, was sie mit all dem tut. „Weitergeben“, hat sie gesagt. „An den Nächsten, der Wasser braucht. Was glaubst du, woher die Leute wissen, dass sie zu euch können?“',
      },
      postedEight: {
        title: 'Der erste Fehler',
        body: 'Heute Nacht ist eines der neuen Feuer ausgegangen. Eine Stunde lang war dort, wo das achte Land liegt, nichts. Ich habe am Fenster gestanden und mich nicht gerührt.\n\nDann ging links davon ein Licht an und aus, an und aus: der Nachbar, der hinüberrief. Und dann brannte es wieder. Am Morgen kam ein Greif mit vier Wörtern: „Eingeschlafen. Kommt nicht wieder vor.“ Es wird wieder vorkommen. Dafür gibt es Nachbarn.',
      },
      isleMills: {
        title: 'Elf Inseln, ein Müller',
        body: 'Hallo Wacht,\n\nder Müller hier mahlt für elf Inseln und erkennt jede am Mehl. Er hat mir mit verbundenen Augen gesagt, von welcher Insel ich das Brot in der Tasche hatte.\n\nIch habe gefragt, wie man das lernt. Er hat gesagt: „Gar nicht. Man macht es vierzig Jahre.“ Ich habe gesagt, so lange hätte ich nicht. Die vom Damm hat gesagt, ich hätte genau so lange. Manchmal ist sie unheimlich.',
      },
      isleLetters: {
        title: 'Wem man schreiben sollte',
        body: 'Liebe Wacht,\n\nalle Post des Inselmeers geht durch ein Haus. Die Postmeisterin liest nichts, sagt sie. Dann hat sie mir einen Stapel hingelegt: Briefe, die an „die Wacht“ gerichtet sind, ohne Ort. Vierzig Stück, aus zwanzig Jahren.\n\nLeute, die fragen, ob es das noch gibt. Ob man kommen darf. Ob man zu alt ist. Sie hat sie nie zugestellt, weil sie nicht wusste, wohin. Wacht, ich beantworte sie alle. Es wird ein langer Winter.',
      },
      trainedTwelve: {
        title: 'Zu alt',
        body: 'Zwölf. Die zwölfte ist zweiundsechzig. Sie hat vor zwanzig Jahren einen Brief geschrieben und nie eine Antwort bekommen. Alwines Antwort kam im Herbst. Im Frühjahr stand sie vor der Tür.\n\nSie hat länger gebraucht als die anderen, für die Treppe und für die Zeichen. Aber sie ist die Einzige, die nachts aus dem Fenster sieht, ohne dass ich es ihr gesagt hätte. Sie sagt, sie habe zwanzig Jahre lang geübt, auf ein Licht zu warten.',
      },
      isleRope: {
        title: 'Rückwärts',
        body: 'Hallo Wacht,\n\nder Seiler geht den ganzen Tag rückwärts. Beim Seildrehen muss man das. Er sagt, man sehe dabei die ganze Zeit, was man schon gemacht hat, und nie, wo man hingeht.\n\nIch habe gesagt, das sei doch furchtbar. Er hat gesagt, er finde es beruhigend. Alwine hat mich später gefragt, was ich sehe, wenn ich zurückschaue. Ich habe angefangen aufzuzählen und nach einer Weile gemerkt, dass sie eingeschlafen war. Es war eine lange Liste.',
      },
      postedEleven: {
        title: 'Eine Wacht ist kein Turm',
        body: 'Elf Lehrlinge sind in elf Landen. Zwei von ihnen haben gar keinen Turm. Einer hängt seine Laterne in einen Baum, eine stellt ihre auf ein Boot.\n\nIch wollte ihnen zuerst schreiben, das gehe nicht. Dann habe ich an das Leuchtschiff gedacht, von dem Fenno erzählt hat, und an die Drachen, von denen Alwine schreibt. Eine Wacht ist kein Turm. Ich hätte es wissen müssen. Unserer war auch nur der Ort, an dem zufällig der Schlüssel lag.',
      },
      isleKites: {
        title: 'Ein Feuer am Himmel',
        body: 'Liebe Wacht,\n\nüber dieser Insel stehen nachts Drachen mit Lichtern. Die Drachenbauerin sagt, ein Feuer am Himmel sehe man weiter als eins am Boden, solange der Wind hält.\n\nUnd wenn er nicht hält? „Dann“, hat sie gesagt, „renne ich.“ Sie hat mir die Narben an den Knien gezeigt. Ich habe selten jemanden gesehen, der so genau weiß, wofür er fällt.',
      },
      isleSeals: {
        title: 'Die Fehlende',
        body: 'Hallo Wacht,\n\nder Robbenwächter zählt seine Robben nicht. Er sagt, wer zählt, merke nur, dass eine fehlt. Wer sie kennt, weiß, welche.\n\nGestern fehlte eine. Er ist bei Sturm hinausgefahren, und ich bin mit, weil die vom Damm schon im Boot saß. Wir haben sie gefunden, in einem Netz. Ich habe auf der Rückfahrt überlegt, ob ich wüsste, welches unserer Feuer fehlt, wenn eins fehlt. Ich glaube ja. Schreib mir, ob du es auch weißt.',
      },
      trainedSixteen: {
        title: 'Ja, ich weiß es',
        body: 'Sechzehn. Fenno hat gefragt, ob ich wüsste, welches Feuer fehlt, wenn eins fehlt. Ich habe es heute Nacht geprüft. Ich habe die Augen geschlossen und sie aufgesagt, von hier bis zum Meer, jedes mit dem, der es hält.\n\nIch weiß es. Ich weiß sogar, welches zu früh brennt und welches zu sparsam. Ich habe Fenno geschrieben: ja. Und dass er mir fehlt. Das zweite habe ich wieder durchgestrichen und dann doch stehen lassen.',
      },
      isleBlack: {
        title: 'Ein Feuer von unten',
        body: 'Liebe Wacht,\n\ndie Insel ist aus schwarzem Stein und innen noch warm. Der Mann, der hier Kürbisse zieht, sagt, sein Feuer brenne von unten und brauche ihn nicht.\n\n„Warum bleibst du dann?“, hat Fenno gefragt. Der Mann hat eine Weile überlegt. „Damit jemand sagen kann, dass es warm ist“, hat er gesagt. Die vom Damm hat genickt. Ich glaube, die beiden haben gerade etwas über unsere Arbeit begriffen, wofür ich länger gebraucht habe.',
      },
      isleNames: {
        title: 'Ein Stein mit einem Namen',
        body: 'Liebe Wacht,\n\nes gibt eine Insel, auf der für jede Wacht ein Stein steht. Ich habe meine Meisterin gefunden. Und ihre. Und elf davor. Der erste Stein trägt keinen Namen, nur das Zeichen mit den vier Strahlen.\n\nNeben dem Stein meiner Meisterin steht ein leerer. Die Namenshüterin hat mich angesehen und den Meißel hingehalten. Ich habe den Kopf geschüttelt. „Noch nicht“, habe ich gesagt. Sie hat gesagt: „Das sagen alle. Der Stein kann warten.“',
      },
      isleOutermost: {
        title: 'Ein Licht, weit draußen',
        body: 'Hallo Wacht,\n\nwir sind auf der letzten Insel. Dahinter ist auf der Karte nichts. Der Mann hier sagt, die Karte sei von Leuten, die nie hier waren. Er sieht nachts manchmal ein Licht, weit draußen. Er hat ein Buch darüber: Datum, Uhrzeit, wie lange.\n\nIch habe heute Nacht mit ihm gewacht. Um zwei war es da. Ich habe meine Laterne genommen. Kurz, lang, verdeckt. Es hat nicht geantwortet. Aber es ist auch nicht ausgegangen.',
      },
      postedFifteen: {
        title: 'Wem man eine Wacht gibt',
        body: 'Fünfzehn Lande, fünfzehn Lehrlinge. Ich habe heute versucht aufzuschreiben, wonach ich sie ausgesucht habe, damit der Nächste es leichter hat.\n\nIch bin nicht weit gekommen. Die Geschickten waren nicht die Besten. Die Mutigen auch nicht. Am Ende steht auf dem Blatt nur ein Satz, und der ist nicht von mir, sondern von einem Maler auf einer weißen Insel: Bei Nacht soll man sehen, dass jemand da ist.',
      },
      isleTrial: {
        title: 'Eine Nacht',
        body: 'Liebe Wacht,\n\nwer hier eine Wacht will, verbringt eine Nacht allein mit einem Feuer. Die Prüferin sieht nicht hin. Am Morgen fragt sie nur eines: „Wem willst du es zeigen?“\n\nDie vom Damm ist gestern hinübergerudert. Sie hält seit einem Jahr ein Feuer allein, sie hätte es nicht gebraucht. Am Morgen hat die Prüferin gefragt. Die vom Damm hat auf Fenno gezeigt, der am Ufer stand und so tat, als habe er nicht die ganze Nacht dort gestanden.',
      },
      trainedTwenty: {
        title: 'Zwanzig',
        body: 'Zwanzig. Die Schule ist voll, und ich bilde vorerst niemanden mehr aus. Nicht, weil es genug wären. Sondern weil die ersten inzwischen selbst jemanden bei sich haben, der Laternen putzt und keine dummen Fragen stellt.\n\nIch habe gezählt: Von hier aus sehe ich mehr Feuer, als ich je entzündet habe. Die meisten davon hat jemand angesteckt, den ich nicht kenne, weil ihn jemand gelehrt hat, den ich gelehrt habe.',
      },
      isleNoFire: {
        title: 'Für die Erste, die bleibt',
        body: 'Hallo Wacht,\n\nes gibt einen Turm, der fertig ist und nie gebrannt hat. Öl im Keller, Docht in der Lampe, Holz gestapelt. An der Tür ein Zettel: „Für die Erste, die bleibt.“\n\nWir standen zu dritt davor. Alwine hat nichts gesagt. Ich habe nichts gesagt, und du weißt, wie schwer mir das fällt. Die vom Damm hat den Zettel abgenommen, gefaltet und eingesteckt. Dann hat sie mich gefragt, ob ich ein Streichholz habe.',
      },
      postedNineteen: {
        title: 'Ein neuer Stern am Rand',
        body: 'Heute Nacht ist am Rand der Himmelskarte ein gelber Punkt dazugekommen, weiter draußen als alle anderen. Ich habe ihn mit Tinte eingetragen, ohne zu warten.\n\nEr flackert. Er ist ein wenig zu groß, aus Stolz, und ein wenig schief. Ich würde ihn unter tausend erkennen, obwohl ich ihn noch nie gesehen habe. Er brennt wie alles, was Fenno je angezündet hat.',
      },
      isleNewWatch: {
        title: 'Die Lehrlinge',
        body: 'Liebe Wacht,\n\ndie Neue Warte brennt seit einer Woche. Sie halten sie zu zweit, die vom Damm und Fenno, abwechselnd, und streiten darüber, wer dran ist. Ich habe ihnen den Schlüssel mit den vier Zacken gegeben. Fenno hat ihn unter die dritte Stufe gelegt, bevor ich etwas sagen konnte.\n\nWem gibt man eine Wacht? Dem, der bleibt. Und der am Morgen jemandem zeigen will, dass sie noch brennt. Ich komme nach Hause, Wacht. Stell einen zweiten Becher hin.',
      },
      rimOpenSea: {
        title: 'Ein Winter',
        body: 'Liebe Wacht,\n\nich habe gesagt, ich komme nach Hause, und ich bin gekommen. Einen Winter lang. Du hast es ertragen, dass ich deine Stufen nachzähle, und ich habe ertragen, dass du es besser machst als ich. Dann kam die Nachricht von der Äußersten Insel: Das Licht weit draußen hat geantwortet.\n\nVerzeih mir den Becher, der jetzt wieder leer steht. Die Steuerfrau hält auf etwas zu, das nur sie sieht. Ich sitze im Bug und sehe es inzwischen auch.',
      },
      stageOne: {
        title: 'Der erste Stein',
        body: 'Aus der Mitte der Karte kam eine Bitte, mit einem fremden Greif: ein Stein aus jedem Land, für einen Turm, den alle sehen sollen. Ich habe den Lehrlingen geschrieben. Acht Lande haben gegeben, was sie in sechs Stunden schaffen.\n\nUnser Stein ist der von der dritten Stufe. Ich habe ihn selbst herausgehoben. Darunter lag nichts mehr. Der Schlüssel ist ja unterwegs. Es hat sich trotzdem angefühlt, als gäbe ich etwas her, das mir nicht gehört.',
      },
      rimDrifting: {
        title: 'Dieselbe Insel',
        body: 'Hallo Wacht,\n\nich bin dran mit Reisen, sie ist dran mit dem Feuer. Wir haben gelost. Ich glaube, sie hat geschummelt, damit ich fahre.\n\nWir liegen an einer Insel aus Schilf. Der Floßbauer flickt jeden Tag eine Ecke. In einem Jahr ist nichts mehr von der alten übrig, sagt er, und es ist trotzdem dieselbe. Alwine hat gefragt, woran man das merkt. „Daran, dass keiner weggegangen ist“, hat er gesagt.',
      },
      rimWhales: {
        title: 'In den dunklen Jahren',
        body: 'Liebe Wacht,\n\ndie Wale ziehen hier immer auf derselben Linie. Die Walruferin sagt, sie folgten den Feuern am Ufer. In den dunklen Jahren seien sie im Kreis geschwommen, wochenlang.\n\nIch habe gefragt, welche Jahre sie meint. Sie hat sie mir aufgezählt. Wacht, es sind meine. Die Jahre, in denen ich allein war und das Feuer nur noch glomm. Ich habe nicht gewusst, dass jemand so weit draußen darauf gewartet hat.',
      },
      stageTwo: {
        title: 'Was ein Land gibt',
        body: 'Die zweite Stufe hat elf Lande gebraucht. Ich habe zugesehen, was jedes schickt. Das Moor schickt Torf. Die Schieferbrüche schicken Platten für das Dach. Die Heringsinsel hat ein Fass geschickt, und niemand weiß, wofür. Die Baumeisterin hat es eingemauert.\n\n„Ich sortiere nicht“, schreibt sie. „Wer anfängt zu sortieren, was dazugehört, baut am Ende einen Turm für sich allein.“',
      },
      rimIce: {
        title: 'Wegen des Lichts',
        body: 'Hallo Wacht,\n\nes ist so kalt, dass meine Tinte friert. Ich schreibe mit Kohle. Der Eisfischer schlägt jeden Morgen dasselbe Loch frei und stellt eine Laterne daneben. Die Fische kämen wegen des Lichts, sagt er.\n\nIch habe gefragt, ob das nicht ein bisschen gemein sei. Er hat gesagt, er nehme drei und füttere dreißig. Dann hat er mir einen gegeben. Ich weiß jetzt nicht, zu welchen ich gehöre.',
      },
      rimAurora: {
        title: 'Öfter, als der Zufall erlaubt',
        body: 'Liebe Wacht,\n\nder Himmel hängt hier voller Farben, und eine Frau schreibt sie mit wie Zeichen. Ich habe gelächelt. Dann hat sie mir ihre Bücher gezeigt. Kurz, lang, verdeckt. Hunderte Male, in zwanzig Jahren.\n\nIch glaube nicht, dass der Himmel mit uns spricht. Ich glaube aber auch nicht mehr, dass wir die Zeichen erfunden haben. Vielleicht haben die Ersten sie nur abgeschrieben, in einer Nacht wie dieser.',
      },
      stageThree: {
        title: 'Acht Tage',
        body: 'Nach jeder Stufe muss der Mörtel acht Tage ruhen. Ich bin schlecht im Warten, das weiß jeder, der mir je beim Kochen zugesehen hat.\n\nAber es sind gute acht Tage. Die Lande, die gegeben haben, füllen ihre Lager wieder. Die, die noch nicht dran waren, fragen, wann sie dürfen. Gestern hat ein Lehrling geschrieben, sein Land habe „leider erst zweimal“ gegeben. Als wäre es ein Vorrecht. Vielleicht ist es eins.',
      },
      rimMarket: {
        title: 'Drei Strahlen',
        body: 'Hallo Wacht,\n\nhundert Boote, und auf jedem will mir jemand etwas verkaufen. Ich habe eine Laterne für sie gekauft, eine mit drei Strahlen. Der Händler sagt, die seien wieder gefragt. Vor zehn Jahren habe er sie als Altglas verkauft.\n\nIch habe ihn gefragt, was sich geändert hat. Er hat mit dem Daumen über die Schulter gezeigt, dorthin, woher wir kommen. „Es ist heller geworden da hinten“, hat er gesagt. „Das spricht sich herum.“',
      },
      stageFive: {
        title: 'Die Liste der Geber',
        body: 'Fünf Stufen. Ich führe eine Liste, welches Land wie oft gegeben hat, und habe heute gemerkt, dass ich sie falsch führe. Ich hatte sie nach der Menge geordnet.\n\nDie Kleine Schwester gibt in sechs Stunden so viel, wie die Schieferbrüche in einer Minute brechen. Aber es hat jedes Mal gegeben. Ich habe die Liste neu geschrieben, nach dem Alphabet. So steht keiner oben.',
      },
      rimCoral: {
        title: 'Die steht da richtig',
        body: 'Liebe Wacht,\n\nich bin getaucht. In meinem Alter. Die Taucherin hat mich an einem Seil hinabgelassen wie einen Anker. Unten steht eine Laterne mit vier Strahlen, ganz eingewachsen, und kleine Fische wohnen darin.\n\nIch wollte sie heraufholen. Sie ist das Älteste, was ich je von uns gesehen habe. Die Taucherin hat den Kopf geschüttelt. Oben hat sie gesagt: „Die steht da richtig.“ Sie hat recht. Nicht alles, was man findet, muss man mitnehmen. Ich lerne das spät.',
      },
      rimSandbank: {
        title: 'Eine Stadt, die mitgeht',
        body: 'Hallo Wacht,\n\ndie Sandbank wandert, und die Stadt wandert mit. Am einen Ende neue Pfähle, am anderen alte heraus. Ich habe einen Tag lang Pfähle geschleppt. Der Pfahlsetzer sagt, in sechzig Jahren sei die Stadt einmal um sich selbst herum.\n\nIch habe gefragt, ob es nicht einfacher wäre, auf Fels zu bauen. „Einfacher schon“, hat er gesagt. „Aber dann wären wir die, die dageblieben sind. So sind wir die, die zusammengeblieben sind.“',
      },
      stageSeven: {
        title: 'Ein Stein, den ich nicht kenne',
        body: 'Bei der siebten Stufe lag ein Stein dabei, den keines unserer Lande geschickt hat. Rot, mit einem eingeritzten Zeichen: vier Strahlen und ein fünfter, kürzer.\n\nDie Baumeisterin schreibt, er sei eines Morgens einfach dagelegen. Sie habe ihn eingemauert wie alle anderen. Ich habe lange auf die Zeichnung gesehen. Irgendwo baut jemand mit, von dem ich nichts weiß. Und der von uns weiß.',
      },
      rimRoots: {
        title: 'Nur bei Nacht',
        body: 'Liebe Wacht,\n\nein Wald, der im Meer steht. Bei Tag sieht jede Wurzel aus wie die andere, und selbst die Krabbenfängerin verirrt sich. Bei Nacht, mit der Laterne am Bug, kennt sie jeden Weg.\n\n„Bei Tag sehe ich zu viel“, sagt sie. „Bei Nacht nur das, was mein Licht erreicht. Das genügt immer bis zur nächsten Wurzel.“ Ich habe an all die Jahre gedacht, in denen ich wissen wollte, wohin das alles führt. Es hätte bis zur nächsten Wurzel gereicht.',
      },
      rimBuoys: {
        title: 'Dieselbe Idee, nur nasser',
        body: 'Hallo Wacht,\n\neine Kette aus Lichtern quer durch die Meerenge. Der Bojenwart hat von unserer Feuerstraße gehört und will alles wissen. Ich habe ihm aufgezeichnet, wie ein Feuer das nächste hält.\n\nEr hat mir aufgezeichnet, was er tut, wenn eine Boje abreißt: Die beiden Nachbarn brennen doppelt so hell, bis sie wieder hängt. Das machen wir nicht. Das sollten wir machen. Ich schicke dir die Zeichnung mit. Sie ist nass geworden, dieselbe Idee eben.',
      },
      stageNine: {
        title: 'Über den Bäumen',
        body: 'Neun Stufen. Die Baumeisterin schreibt, der Turm sei jetzt höher als die Bäume, und man sehe von oben das erste Mal zwei Feuer zugleich: eines im Norden, eines im Süden.\n\nIch habe Fennos nasse Zeichnung an die Wand gehängt. Seit gestern brennen bei uns die Nachbarn doppelt, wenn eines ausfällt. Es ist in der ersten Nacht schon gebraucht worden. Niemand hat es gemerkt außer mir. So soll es sein.',
      },
      rimForeign: {
        title: 'Drei Wörter für Wacht',
        body: 'Liebe Wacht,\n\nhier steht nichts auf unseren Karten, und ich verstehe kein Wort. Die Leute zünden ihr Feuer mit der linken Hand an. Die Dolmetscherin sagt, sie hätten drei Wörter für „Wacht“: eines für die, die man hält, eines für die, die man bekommt, und eines für die, die man weitergibt.\n\nFür „allein“ haben sie keines. Ich habe versucht, es zu erklären. Sie haben mich angesehen, höflich und ratlos, und mir dann noch einen Teller gebracht.',
      },
      stageEleven: {
        title: 'Wem der Turm gehört',
        body: 'Ein Händler hat mich heute gefragt, wem das Leuchtfeuer am Ende gehöre. Er meinte es praktisch: Wer zahlt das Öl?\n\nIch habe nachgezählt, wer gegeben hat. Es ist niemand dabei, dem es nicht gehört. Und es ist niemand dabei, dem es mehr gehört als dem Land mit dem Heringsfass. Ich habe dem Händler gesagt, das Öl zahle der, der gerade welches habe. Er fand das unordentlich. Er hat dann aber ein Fass dagelassen.',
      },
      rimDunes: {
        title: 'Holz für Unbekannt',
        body: 'Hallo Wacht,\n\nSand, überall. In meinen Stiefeln, in meinem Brot, in diesem Brief. Der Karawanenführer reist nachts nach Feuern auf den höchsten Dünen. Er weiß nicht, wer sie anzündet. Er lässt jedes Mal Holz da.\n\nIch habe gefragt, ob er nie nachgesehen hat. „Wozu?“, hat er gesagt. „Er weiß nicht, wer das Holz bringt. So sind wir quitt.“ Ich habe auch ein Scheit dagelassen. Jetzt gehöre ich dazu und weiß nicht, wozu.',
      },
      rimWell: {
        title: 'Ein Stern im Boden',
        body: 'Liebe Wacht,\n\neine Stadt um einen einzigen Brunnen. Nachts lässt die Wächterin eine Laterne am Seil hinab, damit man das Wasser sieht. Von den Dächern aus sieht es aus, als brenne ein Stern im Boden.\n\nIch habe sie gefragt, warum sie das Licht nicht einfach oben hinstellt. Sie hat gesagt: „Oben weiß jeder, dass die Stadt da ist. Unten muss man zeigen, dass noch Wasser da ist. Ein Feuer gehört dahin, wo die Sorge ist.“',
      },
      stageThirteen: {
        title: 'Wer nicht geben kann',
        body: 'Ein Land hat diesmal nicht gegeben. Sein Lager war leer, der Lehrling dort ist krank gewesen. Er hat sich in drei Briefen entschuldigt.\n\nIch habe ihm geschrieben, was mir Alwine einmal geschrieben hat, als ich eine Nacht verschlafen hatte: Eine Kette, die nur hält, wenn keiner je fehlt, ist keine Kette, sondern ein Glücksfall. Die Stufe ist trotzdem fertig geworden. Zwei andere Lande haben, ohne dass ich fragte, eher gegeben.',
      },
      rimStoneWood: {
        title: 'Ruß, und darüber wieder Holz',
        body: 'Hallo Wacht,\n\nBäume aus Stein. Der Steinförster zählt Ringe an den Bruchstellen und ist bei einem Stamm seit elf Jahren nicht fertig. Er hat mir eine Schicht gezeigt, tief innen: schwarz. Ruß. Der Wald hat einmal gebrannt.\n\nUnd darüber: wieder Holz. Hunderte Ringe. Ich habe an unseren kalten Ofen gedacht und an die dunklen Jahre. Von innen sieht es aus wie das Ende. Von außen ist es ein Strich, und danach geht es weiter.',
      },
      rimMirror: {
        title: 'Der untere Himmel',
        body: 'Liebe Wacht,\n\nein See, so flach und still, dass man nachts zwischen zwei Himmeln geht. Die Salzläuferin kennt den unteren besser als den oberen. Am Rand, wo die niedrigen Sterne stehen, hätten früher viele gefehlt, sagt sie. Neuerdings fehlten weniger.\n\nIch bin stehen geblieben, mitten auf dem See. Wacht, die niedrigen Sterne am Rand. Das sind keine Sterne. Das wissen wir doch. Sie sieht von hier aus deine Arbeit, gespiegelt, und zählt sie mit.',
      },
      stageFifteen: {
        title: 'Die Hälfte',
        body: 'Fünfzehn Stufen. Die Hälfte. Die Baumeisterin hat eine Zeichnung geschickt, auf der der Turm so hoch ist wie das Blatt, und daneben einen Punkt: ein Mensch.\n\nIch habe sie den Lehrlingen in der Küche gezeigt. Einer hat gefragt, ob wir das je fertig sehen. Die Zweiundsechzigjährige hat gelacht und gesagt, sie habe vor zu bleiben, bis es brennt, und er solle sich gefälligst anschließen.',
      },
      rimWindTowers: {
        title: 'Der dreizehnte Ton',
        body: 'Hallo Wacht,\n\nzwölf hohle Türme, die im Wind singen. Der Turmstimmer klettert den ganzen Tag herum und verstellt Klappen. Heute Abend haben zum ersten Mal seit dem Frühjahr alle zwölf gestimmt.\n\nUnd dann war da noch ein Ton. Tiefer. Von keinem Turm. Ich habe ihn im Bauch gespürt. Der Turmstimmer hat genickt, als sei das selbstverständlich: „Den baut keiner. Der kommt, wenn alle da sind.“ Ich muss dauernd daran denken, was das für Feuer heißt.',
      },
      stageEighteen: {
        title: 'Was Fenno gehört hat',
        body: 'Fenno schreibt von einem dreizehnten Ton, den niemand gebaut hat. Ich habe es der Rechenmeisterin in der Stadt der Sternwarten geschrieben, weil sie die Einzige ist, die so etwas nachrechnet.\n\nIhre Antwort kam heute. Eine Zeile: „Wenn genug Feuer brennen, sieht man von jedem aus mindestens zwei andere. Dann gibt es keinen dunklen Weg mehr zwischen zwei Menschen. Ich weiß nicht, wie man das nennt. Aber es fehlen noch einundvierzig.“',
      },
      rimLamps: {
        title: 'Ein Abend im Jahr',
        body: 'Liebe Wacht,\n\nein Berghang voller Lampen, und sie brennen nur an einem Abend im Jahr alle zugleich. Die Lampenputzerin putzt dafür das ganze Jahr. Ich habe gefragt, ob das nicht ein schlechter Tausch sei.\n\nSie hat mich mitgenommen, heute, an dem Abend. Ich schreibe dir nicht, wie es aussah. Ich könnte es nicht. Ich schreibe dir nur, dass ich dreißig Jahre lang ein einziges Feuer gehalten habe und heute Abend zum ersten Mal verstanden habe, wofür.',
      },
      rimBridges: {
        title: 'Was man erneuern muss',
        body: 'Hallo Wacht,\n\nBrücken aus Gras, zwischen den Gipfeln. Jedes Jahr neu. Ich habe drei Tage lang Gras gedreht, bis meine Hände aussahen wie die des Seilers. Der Brückenflechter sagt, eine Brücke, die man nie erneuern müsse, vergesse man.\n\nIch habe ihm vom Leuchtfeuer erzählt, aus Stein, für immer. Er hat die Stirn gerunzelt. „Und wer kommt dann jedes Jahr zusammen?“, hat er gefragt. Ich wusste keine Antwort. Weißt du eine?',
      },
      stageTwentyOne: {
        title: 'Eine Antwort für den Brückenflechter',
        body: 'Fenno fragt, wer jedes Jahr zusammenkommt, wenn der Turm aus Stein ist und für immer hält. Ich habe eine Woche darüber nachgedacht.\n\nDann habe ich der Baumeisterin geschrieben. Ihr Vorschlag: Das Feuer oben bekommt keinen Vorrat. Kein Keller, kein Lager. Was es brennt, bringt jedes Land selbst, jedes Jahr, an einem Abend. Der Turm hält. Das Feuer muss man erneuern. Ich habe dem Brückenflechter geschrieben, er habe gerade mitgebaut.',
      },
      rimCloud: {
        title: 'Jeder hält jemanden',
        body: 'Liebe Wacht,\n\nein Wald in den Wolken. Pflanzen, die auf Pflanzen wachsen, die auf Pflanzen wachsen. Die Nebelgärtnerin hat mir eine gezeigt, die ganz oben sitzt und den Boden nie berührt hat.\n\n„Hier hält jeder jemanden“, hat sie gesagt. „Sonst fiele alles herunter.“ Ich habe gefragt, wer den Untersten hält. Sie hat auf die Wurzeln gezeigt, die von ganz oben wieder herabhängen, bis in die Erde. Es ist ein Kreis, Wacht. Es gibt keinen Untersten.',
      },
      rimCrater: {
        title: 'Gesellschaft',
        body: 'Hallo Wacht,\n\nein Berg mit einem Feuer darin, das keiner angezündet hat. Der Mann am Rand sagt, er bewache es nicht. Er leiste ihm Gesellschaft. Seit neunzehn Jahren.\n\nIch habe eine Nacht neben ihm gesessen. Wir haben nichts geredet. Gegen Morgen hat er gesagt: „Ihr macht das Gleiche. Ihr glaubt nur, ihr macht mehr.“ Ich wollte widersprechen. Dann habe ich an sie gedacht, allein am Feuer, und dass ich nach Hause will.',
      },
      stageTwentyFour: {
        title: 'Fenno fährt heim',
        body: 'Fenno hat geschrieben, er fahre zurück zur Neuen Warte. Er habe genug gesehen, und sie habe lange genug allein gesessen. Den Rest der Reise mache Alwine ohne ihn.\n\nIch habe heute Nacht hinübergesehen. Der gelbe Punkt am Rand, der etwas zu groß brennt, hat einmal kurz doppelt so hell geleuchtet. Dann wieder wie immer. Er ist angekommen. Ich habe das neue Zeichen dafür nachgeschlagen: „Ich sehe dich.“ Es steht jetzt als erstes auf der Liste.',
      },
      rimObservatories: {
        title: 'Wie viele es braucht',
        body: 'Liebe Wacht,\n\neine Stadt, in der jedes Haus eine Kuppel hat. Die Rechenmeisterin kennt deine Listen besser als ich. Sie hat an die Wand geschrieben, wie viele Feuer es braucht, bis der Rand des Himmels überall geschlossen ist.\n\nDarunter steht, wie viele brennen. Die zweite Zahl hat sie so oft ausgewischt und neu geschrieben, dass die Wand dort heller ist. Es fehlen noch neun. Sie hat mir die Kreide gegeben und gesagt, wenn es so weit sei, dürfe ich.',
      },
      rimLastHarbour: {
        title: 'Wo man bleiben kann',
        body: 'Liebe Wacht,\n\nvon hier fährt niemand mehr weiter. Der Ankerschmied schmiedet trotzdem Anker. Ich habe ihm zugesehen und gefragt, für wen.\n\n„Für dich zum Beispiel“, hat er gesagt und mir einen kleinen in die Hand gelegt, nicht größer als ein Schlüssel. „Du fährst seit Jahren. Irgendwann musst du sagen, wo.“ Ich habe ihn in die Tasche gesteckt, zu dem Meißel von der Insel der Namen. Meine Taschen füllen sich mit Dingen, die auf mich warten.',
      },
      stageTwentySeven: {
        title: 'Neun fehlen',
        body: 'Neun Feuer fehlen noch, schreibt Alwine. Ich habe die Karte auf den Küchentisch gelegt und mit den Lehrlingen gesucht, wo es noch dunkel ist. Wir haben sieben Stellen gefunden.\n\nFür jede hat sich jemand gemeldet, noch bevor ich gefragt habe. Die Zweiundsechzigjährige nimmt die am weitesten entfernte. Sie sagt, sie habe am längsten gewartet, also dürfe sie am weitesten gehen. Zwei Stellen finden wir nicht. Vielleicht sind es nicht unsere.',
      },
      rimWholeMap: {
        title: 'Eine Kerze für jedes Feuer',
        body: 'Liebe Wacht,\n\nein Saal, dessen Boden die ganze Karte ist. Ich bin über das Meer gegangen, in Strümpfen, und habe unser Tal gefunden. Dort steckt eine Kerze. Sie brennt. Die Kartenhüterin sagt, es sei die älteste hier, und sie habe sie in den dunklen Jahren nie gelöscht, obwohl keine Nachricht kam.\n\n„Ich hätte es gemerkt, wenn sie aus wäre“, hat sie gesagt. Ich habe gefragt, wie. Sie hat die Schultern gehoben. Ich habe mich neben die Kerze gesetzt und eine Weile nichts gesagt.',
      },
      rimSite: {
        title: 'Der Stein von der dritten Stufe',
        body: 'Liebe Wacht,\n\nich stehe am Fuß des Turms. Die Baumeisterin hat mir gezeigt, wo unser Stein sitzt: ganz unten, in der ersten Reihe, neben einem Heringsfass. Ich habe die Hand daraufgelegt. Dreißig Jahre bin ich über ihn hinweggestiegen.\n\nZwei rote Steine sind auch dabei, mit dem fünften Strahl. Sie weiß nicht, von wem. „Sie kommen nachts“, sagt sie, „und sie kommen von draußen.“ Morgen wird die letzte Stufe gesetzt. Dann ruht er. Dann sehen wir.',
      },
      stageTwentyNine: {
        title: 'Der Abend davor',
        body: 'Alle Lande haben ihr Holz geschickt, jedes ein Bündel, wie es die Baumeisterin wollte. Unseres ist von dem Apfelbaum hinter der Kräuterkate, dem sauren.\n\nHeute Nacht brennt bei uns jedes Feuer, das wir haben. Ich habe sie gezählt, zweimal, mit geschlossenen Augen. Keines fehlt. Die Rechenmeisterin hat geschrieben, an ihrer Wand stünden jetzt zwei gleiche Zahlen. Alwine habe die Kreide gehalten und eine ganze Weile gebraucht.',
      },
      rimBeacon: {
        title: 'Das große Licht',
        body: 'Liebe Wacht,\n\nes brennt. Es hat so viele Strahlen, wie es Wachten gibt. Ich habe unseren gesucht und gefunden: Er ist ein wenig schief.\n\nUnd dann, Wacht, gegen Mitternacht: draußen, hinter dem Rand, wo auf keiner Karte etwas steht. Ein Licht. Dann zwei. Dann eine ganze Kette. Kurz, lang, verdeckt. Sie haben gewartet, bis wir vollständig sind. Ich habe den kleinen Anker hier in den Boden gesteckt. Ich bleibe. Komm mich besuchen. Die Tür hat kein Schloss.',
      },
      stageThirty: {
        title: 'Für wen auch immer',
        body: 'Was geschieht, wenn alle Feuer zugleich brennen? Man sieht, dass man nie die Einzigen war. Und dahinter fängt eine Karte an, die noch niemand gezeichnet hat.\n\nFenno hat den Schlüssel zurückgeschickt. Ich habe einen neuen Stein in die dritte Stufe gesetzt und ihn daruntergelegt, mit einem Zettel. Ich habe lange überlegt, was daraufstehen soll. Dann habe ich abgeschrieben, was auf meinem stand: Wenn du das liest, bist du neugierig. Mehr braucht es am Anfang nicht.',
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
