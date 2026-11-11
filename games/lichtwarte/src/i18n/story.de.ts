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
    chapters: {
      key: 'Der Schlüssel',
      remains: 'Was bleibt',
      wakes: 'Das Tal erwacht',
      night: 'Die Lange Nacht',
      handover: 'Die Wacht weitergeben',
      firstYear: 'Das erste Jahr',
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
