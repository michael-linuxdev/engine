/** Story (English): prologue, chronicle in five chapters, letters, ceremonies, the apprentice's lines. Same keys as story.de.ts. */
import type { StoryStrings } from './story.de'

export const storyEn: StoryStrings = {
  intro: {
    l1: 'At the edge of Duskvale stands an old watchtower.',
    l2: 'Its fire has kept the valley safe for longer than anyone can count.',
    l3: 'Now it is barely an ember.',
    l4: 'Under the third step lies a key. Beside it, a book.',
    cta: 'Unlock the tower',
  },
  chronicle: {
    contents: 'Contents',
    resume: (title: string) => `Read on: ${title}`,
    lockedPage: 'Not written yet.',
    clue: {
      build: (name: string) => `Opens with: ${name}.`,
      buildLevel: (name: string, level: string) => `Opens with: ${name} at level ${level}.`,
      turns: (n: string, layer: string) => `Opens after ${n}× ${layer}.`,
      near: (layer: string) => `Opens when it draws near: ${layer}.`,
      realms: (n: string) => `Opens with ${n} realms.`,
      helper: 'Opens when someone helps with the work.',
      voyages: (n: string) => `Opens after ${n} far flights.`,
      highlands: (n: string) => `Opens with ${n} highlands.`,
      road: (n: string) => `Opens with ${n} levels of the Road of Fires.`,
      chain: (n: string) => `Opens with a chain of ${n} fires.`,
    },
    menu: 'Chronicle',
    title: "The Warden's Chronicle",
    unread: 'New page',
    empty: 'Nothing written yet.',
    signature: '— Alwine',
    signatureYou: '— the warden before you',
    letter: 'A letter, brought by griffin',
    prev: 'Back',
    next: 'Next',
    close: 'Close the book',
    page: (n, total) => `Page ${n} of ${total}`,
    chapter: (n, name) => `Chapter ${n} · ${name}`,
    books: { watch: 'Book 1 · The Watch', wayOfFires: 'Book 2 · The Way of the Fires' },
    bookShort: (n: string) => `Book ${n}`,
    bookLocked: { wayOfFires: 'Begins with the first highland.' },
    chapters: {
      key: 'The Key',
      remains: 'What Stays',
      wakes: 'The Valley Wakes',
      night: 'The Long Night',
      handover: 'Passing the Watch',
      firstYear: 'The First Year',
      upward: 'Above the Tree Line',
      traces: 'Marks in the Stone',
      otherFires: 'Other People\'s Fires',
      coldKiln: 'The Cold Kiln',
      firstWatch: 'The First Watch',
    },
    comeback: { title: 'There you are', body: 'Not a word for so long. The watch kept glowing, I kept an eye on it. Here, for the road: a few Glowpebbles.' },
    entries: {
      welcome: {
        title: 'For whoever finds this',
        body: 'If you are reading this, you found the key under the third step. Good. That means you are curious, and curiosity is all it takes to begin.\n\nThe tower is old, the valley is tired, and so am I. The fire up top is barely an ember. Start with the herb cottage. The light does not come back all at once, but it comes — even while you sleep.',
      },
      firstBuild: {
        title: 'The first spark',
        body: 'Do you see the glimmer above the cottage? That is how it began for me too, forty-one winters ago.\n\nGlimmer is not a treasure you find. It gathers wherever someone does a thing with care. Call the sparks whenever you are impatient. They like that.',
      },
      holzlager: {
        title: 'Wood for the winter',
        body: 'With the woodshed, a little house becomes a beginning. Look at the path: for every house that stands again, the valley lights a lantern.\n\nI used to count them every evening. Towards the end it did not take long.',
      },
      steinbruch: {
        title: 'Stone on stone',
        body: 'The mountain does not give gladly, but it gives. The whole tower once stood on these stones.\n\nYou must be wondering where I am. Not under the ground, do not worry. I only grew too old to tend a fire alone — and too stubborn to watch it go out. I will tell you the rest when you are ready.',
      },
      spring: {
        title: 'The spring',
        body: 'I drank here every morning. The water comes from far up, and at night it shimmers when there is enough light in the valley. Tonight it shimmers a little again. That was you.\n\nRemember the stream. I followed it when I left.',
      },
      moonturnReady: {
        title: 'When the moon turns',
        body: 'The first Moonturn is near. It will startle you: when the moon turns, the Glimmer drifts away and the houses sink back into sleep.\n\nDo not be afraid of it. The light is not in the beams. It is in what you have learned to do. What you build will pass — what you learn stays in the archive. After that, everything is easier.',
      },
      afterMoonturn: {
        title: 'The archive',
        body: "There it is: the Wardens' Archive. Every warden before you left something in it — a lantern, a stick of chalk, a trick of the hand. Take what you need.\n\nAnd look up: the tower's fire is burning properly again. It can be seen from the whole valley now. Someone is bound to notice.",
      },
      schmiede: {
        title: 'Fire and iron',
        body: 'The forge glows again. I missed its ringing for years. When the lights grew fewer, people moved away one by one, and in the end the anvil fell silent too.\n\nListen. That is the sound of a valley someone is coming back to.',
      },
      kartenstube: {
        title: 'The empty shelf',
        body: 'In the map room lie paths nobody has walked in a long time. One shelf is empty, you will have seen it. I took the map of the realms beyond the mountains with me.\n\nOne fire alone is only a fire. Many fires are a road. I wanted to see whether anyone over there still tends one.',
      },
      alchemistenturm: {
        title: 'Coloured flames',
        body: "When the alchemist's tower smokes, keep your distance and stay curious. Usually both at once.\n\nUp there, as an apprentice girl, I first heard of the Long Night. I took it for a tale to send children to bed. It is not.",
      },
      moonturn3: {
        title: 'Three moons',
        body: 'You noticed: every Moonturn is a little easier. That is how it is meant to be.\n\nThe old ones said: the moon only takes what you could not carry anyway. As a child I found that very unfair, and today I find it very wise.',
      },
      greifenhorst: {
        title: 'The griffins return',
        body: 'They waited until someone repaired the roost. Be kind to them, they forget nothing — not even a road. A griffin will find anyone it has once carried a letter to.\n\nI gave one of them something for you. It is taking its time. Griffins always take their time.',
      },
      letterMoor: {
        title: 'A letter from the bog',
        body: 'Dear warden,\n\nthe griffin says lanterns are burning along your path again. It does not say so in words, but it looks very pleased.\n\nI am sitting with Ragna in the bog, and she scolds me for coming on foot. Here too a fire has almost gone out. I will stay until it burns again, then I will move on. You keep ours.',
      },
      runenhalle: {
        title: 'Old signs',
        body: 'In the rune hall the stones speak softly. If you are quiet, you understand a word or two.\n\nOne is carved there more often than any other: the Long Night. Once in every lifetime the sun stays away for days. Whoever tends a fire then, tends it for everyone. I lived through the last one as a girl, holding my teacher by the hand.',
      },
      moonturn5: {
        title: 'Five moons',
        body: 'Five Moonturns. People in the valley already ask about you. They say "the new warden", and it sounds as if they had missed the word.',
      },
      apprentice: {
        title: 'An apprentice',
        body: 'So Fenno is back. He used to carry my baskets, then ran off to the city because there was "nothing left to see" here. Now he has seen the fire from the road.\n\nHe talks too much and works too fast, but he means it. Let him polish lanterns. I had to as well.',
      },
      sternwarte: {
        title: 'The dome',
        body: 'The observatory shines again. I am proud of you — I do not write that often.\n\nLook through the glass tonight, right at the rim of the sky. Stars are missing there. A few more every week. That is how it begins.',
      },
      moonturn10: {
        title: 'Ten moons',
        body: 'Ten. It took me longer back then. Take a break if you like — the tower glows without you too. That is what it was built for.',
      },
      nightNear: {
        title: 'The stars at the rim',
        body: 'Now you can see it without the glass: the rim of the sky is going empty. The Long Night is coming.\n\nIt is not wicked. It is only long. Everything you built will sleep, and even the archive will hold its breath. Only the fire up top has to burn. You can do this. I cannot think of anyone I would rather leave it to.',
      },
      longNight: {
        title: 'The morning after',
        body: 'You carried the fire through the Long Night. There is Nightdew in the grass — it falls only after nights like that, and it shows you what stays.\n\nAnd now look across the mountains. Count the lights on the hills beyond. Those are not stars. The realms have seen your fire, and they are answering.',
      },
      firstRealm: {
        title: 'Beyond the valley',
        body: 'Beyond the bog another land begins. Ragna is waiting. Greet her from me, she will grumble.\n\nEvery realm has its own fire and its own way of tending it. You need not take it off their hands. Just help them light it.',
      },
      letterRoad: {
        title: 'A letter from the road',
        body: 'Dear warden,\n\nI am slower than I planned, because someone invites me to supper everywhere I go. People here tell of a valley where the lanterns burn again. I say I have heard of it.\n\nMy knees no longer care for mountains. But I still have a piece of map ahead of me.',
      },
      fiveRealms: {
        title: 'Many realms',
        body: 'Five realms now hang on your light, and yours hangs on theirs. That is exactly how it was meant.\n\nDo not forget the tower while you travel. A road of fires needs a beginning.',
      },
      tenRealms: {
        title: 'A road of fires',
        body: 'Ten realms. From the observatory you can see them at night like a chain, from hill to hill.\n\nWhen I set out, I only wanted to see whether anyone over there still keeps watch. I never thought I would one day count my way home by lights.',
      },
      agesNear: {
        title: 'The key grows lighter',
        body: 'Have you noticed that Fenno now lights the lanterns before you think of it? And that he no longer talks while he does?\n\nA watch does not last a lifetime. It lasts until someone else can carry it. When you forget the key in your pocket because it no longer weighs on you, the time is near.',
      },
      ages: {
        title: 'A new age',
        body: 'You passed the watch on, as it was passed to me and I passed it to you. The Forebear Light stays — it is everything we ever learned, and it shines for everyone who comes after us.\n\nBy the way, I came down the path this morning, past every lantern. I am sitting on the bench outside the herb cottage. This time I am the guest. Thank you.',
      },
      epilogue: {
        title: 'The first page',
        body: 'This page is not by Alwine. She laid the quill in front of me and said she had only copied the first page of the chronicle herself, from her teacher, who had it from hers.\n\nSo: if you are reading this, you found the key under the third step. Good. That means you are curious, and curiosity is all it takes to begin.',
      },
      voyageFirst: {
        title: 'A letter back',
        body: 'Dear warden,\n\nyour griffin has arrived, ruffled and very pleased with itself. Ragna gave it a fish it did not like, and a second one it did.\n\nDo send it out again. A fire that writes letters is news in the realms. And news travels slowly here, but it arrives.',
      },
      voyageMaps: {
        title: 'The shelf fills up',
        body: 'Every griffin brings back a piece of map. Never a whole sheet, just a corner, the course of a river, a name in an unfamiliar hand.\n\nI have unlocked the empty shelf in the map room. Lay the pieces in as they come. A map you put together yourself is one you never forget.',
      },
      voyageFenno: {
        title: 'Fenno and the griffins',
        body: 'Fenno has given the griffins names. They do not answer to them, but he insists they do so in secret.\n\nYesterday he explained the way north to one of them, with both arms and very loudly. The griffin flew south and came back on time. Fenno says that is exactly what he meant.',
      },
      voyageCoast: {
        title: 'A letter from the coast',
        body: 'Dear warden,\n\ndown here everything smells of salt, even the letters. The beacon keeper asked who holds the light in our valley. I said: someone who checks the lanterns once more at night.\n\nHe nodded and turned his own fire up. That is how people talk to each other here.',
      },
      voyageFires: {
        title: 'Fifteen flights',
        body: 'I counted: fifteen flights, and no griffin has come back empty. Sometimes a piece of map, sometimes a greeting, once only a feather from a bird nobody here knows.\n\nI used to think a watch stands still and keeps a fire. Now I know it also keeps roads open.',
      },
      voyageYear: {
        title: 'After a year',
        body: 'I am writing this page myself. A year has passed, perhaps a little more or less. Nobody in the valley counts that closely.\n\nAlwine sits on the bench and says the first year is the easy one. Fenno disagrees, because he always disagrees. Beyond the mountains lies land that is on none of our maps. The griffins already know the way.',
      },
      highFirst: {
        title: 'The path goes on',
        body: 'I had thought the map ended behind the Sky Watch. It does. The path does not.\n\nUp there lies a moor, and in the moor a hearth older than ours. Someone kept a fire here long before the valley had a watchtower. I would like to know who.',
      },
      roadFirst: {
        title: 'Two fires',
        body: 'Tonight I lit a fire between two realms for the first time. It stands halfway, belongs to neither and warms both.\n\nAlwine says this is how it all began once: not with a watchtower, but with the stretch in between.',
      },
      highStair: {
        title: 'A letter from the stair',
        body: 'Dear Watch,\n\nI am at step four hundred and writing sitting down. The stair keeper showed me a mark cut into the rock at knee height: a lantern. Our lantern.\n\nHe says it was already there when his grandfather swept these steps. I am climbing on. Give Fenno my regards and tell him not to overfeed the griffins.',
      },
      roadThree: {
        title: 'Fenno counts',
        body: 'Fenno has started counting the fires of the road each evening. He counts out loud, from the tower, and each time arrives at one more than we have lit.\n\nI told him he was miscounting. He says he only counts what he sees. I did not ask further.',
      },
      highSaddle: {
        title: 'What the wind knows',
        body: 'The weather woman on the saddle keeps a book about the wind, day by day, and has for thirty years. Before her another woman kept it, and before that one another.\n\nThe first page holds no weather. It says only: “Fire burning. View down to the valley.” The valley is us.',
      },
      chainThree: {
        title: 'A chain',
        body: 'Three fires in a row, without a gap. From the watchtower they look like one line climbing the mountain.\n\nA single fire says: someone is here. A chain says something else. It says: this way.',
      },
      highTarn: {
        title: 'A letter from the tarn',
        body: 'Dear Watch,\n\nthe ferry boy rowed me across and did not say a word. In the middle he shipped the oar and pointed down. On the bottom lies a fire bowl as big as a cartwheel.\n\nNobody throws such a thing away. Someone laid it there so that it would stay. I do not know why yet.',
      },
      highJuniper: {
        title: 'Where juniper grows',
        body: 'The smoke maker claims juniper grows best where a fire once stood. I took that for a pretty saying.\n\nThen I walked the slope. The bushes stand in a row, one every two hundred paces, all the way up to the ridge. Nobody plants like that. But that is how you set out fires.',
      },
      highBridge: {
        title: 'A letter from the bridge',
        body: 'Dear Watch,\n\nI am standing at the end of a bridge that stops in mid-air. The bridge builder adds one arch every year. He says someone is building toward him from the far side.\n\nHe has never seen anyone. But each spring there is one more arch over there. I counted. He is right.',
      },
      roadEight: {
        title: 'Fenno and the glowpebbles',
        body: 'Fenno has worked out what the whole Road of Fires costs. It took him three pages and half an evening. He did not tell me the result, only: “A lot.”\n\nThen he asked whether he could add his own pouch. I said yes. It held eleven pebbles and a button.',
      },
      highGoat: {
        title: 'The lantern on the staff',
        body: 'The goatherd carries a lantern on her staff, even in broad daylight. I asked what for.\n\n“So they can see me from below,” she said. “My mother did it this way. Someone down there used to signal back.” She said it without reproach. I have resolved to look up more often in the evenings all the same.',
      },
      highCircle: {
        title: 'The twentieth stone',
        body: 'Nineteen stones stand in the ring. The stone counter counts twenty every morning and has stopped being annoyed about it.\n\nI stood in the gap. The ground there is black, a hand\'s breadth deep. The twentieth stone was never a stone. A fire burned there, and the nineteen stood around it like people keeping warm.',
      },
      roadTwelve: {
        title: 'What a level is',
        body: 'It took me a long time to understand why a fire has three levels. The first is a sign: we know of each other. The second is a way: whoever wants to can find across.\n\nAlwine wrote to me about the third. “The third,” she writes, “keeps burning even when one of the two is asleep for once.”',
      },
      highSprings: {
        title: 'A letter from the springs',
        body: 'Dear Watch,\n\nI have drunk from all seven springs and still cannot tell them apart. The well mistress was politely disappointed.\n\nShe is looking for the eighth. It tasted of smoke, she says, and the old ones fetched their water only from there. Smoky water, Watch. I think I know what stood beside the eighth spring.',
      },
      chainEight: {
        title: 'Seen from below',
        body: 'A trader came through the valley today who does not know the highlands. In the evening he stopped and looked up for a long time.\n\n“Does someone live up there?” he asked. I said: “Again, as of recently.” He nodded as if that were the most sensible answer in the world, and pitched his camp so that he could see the chain.',
      },
      highEagle: {
        title: 'What the eagles build',
        body: 'The eyrie warden showed me an old nest the eagles have given up. Under the branches lay a piece of iron, flat, with a handle.\n\nIt is the lid of a lantern. Eagles gather whatever shines. Somewhere on this wall a lantern once hung, so high that only birds could reach it. Who hangs a lantern up there? Someone who wants to be seen from very far away.',
      },
      highSlate: {
        title: 'The right page',
        body: 'The slate splitter opened a slab for me the way one opens a book. Inside was an imprint: a hand, five fingers, and beside it a flame scratched with a nail.\n\n“There are many of those,” she said. “One in every layer.” I asked how old the lowest was. She laughed. Nobody had got that deep yet.',
      },
      roadSixteen: {
        title: 'Fenno gets mail',
        body: 'A griffin brought a letter addressed not to the Watch but to “the boy who counts the fires”. Fenno read it three times and then sat very straight.\n\nIt is from the herdsman on the Last Pasture. He writes that he counts too, from above, and arrives at the same number. Fenno did not show me the letter. He read it to me. Twice.',
      },
      highMist: {
        title: 'A letter out of the mist',
        body: 'Dear Watch,\n\nin the hollow you cannot see your own hand. The mist catcher finds his way with a horn: one note for “I am here”, two for “come”.\n\nTonight he blew once. From the far side of the hollow a note came back. It startled him, Watch. He lives here alone.',
      },
      highPasture: {
        title: 'Nine fires',
        body: 'The herdsman says you can see nine fires from the Last Pasture at dusk. There used to be more; his father still counted fourteen.\n\nI waited with him until dark. We counted twelve. For a long time he said nothing, and then he took off his cap, to no one in particular.',
      },
      roadTwentyTwo: {
        title: 'Not all of them are ours',
        body: 'Today I made the list I should have made long ago: every fire we have lit, with day and place.\n\nThen I climbed the tower and counted. There are three more. Fenno never miscounted. Fires are burning up there that none of us set alight.',
      },
      highHeaps: {
        title: 'What the old ones overlooked',
        body: 'The ore washer washes the spoil of the old galleries. Mostly she finds iron, sometimes copper. Yesterday, a key.\n\nIt looks like ours except for the bit. Ours has three teeth, this one four. A key for a door much like ours and yet another one. I carry it in my coat pocket now and reach for it more often than I need to.',
      },
      chainThirteen: {
        title: 'Halfway',
        body: 'Thirteen fires in a row. From here to the middle of the highlands there is no gap left.\n\nThe observatory reports that the chain can now be told from the constellation of the Ladder with the naked eye, but only just. I am taking that as praise.',
      },
      highCloister: {
        title: 'A letter from the cloister',
        body: 'Dear Watch,\n\nin the cloister only the gatekeeper speaks. I asked her about the candle in the window.\n\nIt burns, she says, for someone who went up and did not come back. Since when? She looked it up in the book. For two hundred and eleven years. A new candle every evening. I showed her the key with the four teeth. She looked at it for a very long time and then, for the first time that day, said nothing.',
      },
      highLarch: {
        title: 'Letting go',
        body: 'The resin tapper says the larch is the only conifer that drops everything in autumn. The others hold on and break under the snow.\n\nI thought of the warden who lays the key under the step and leaves. I had always taken that for a going-away. Perhaps it is what the resin tapper means.',
      },
      roadTwentyEight: {
        title: 'Fenno wants to go up',
        body: 'Fenno asked when he would be allowed to come along into the highlands. I said: when someone else keeps the fire down here. He said that was unfair and then, after a while, that he understood.\n\nIn the evening he stood on the tower and signalled upward, once short, once long. From the Last Pasture it came back. He has made a friend up there without taking a single step.',
      },
      highWatershed: {
        title: 'A letter from the watershed',
        body: 'Dear Watch,\n\nI am standing with one foot in each sea, says the gauge writer, and she means it literally. To the left everything flows down to us in the valley. To the right it flows away, into a land I know nothing about.\n\nThe fires do not run to the left here. They run along the ridge and then down to the right. Whoever built them did not come from us. They came to us.',
      },
      highCave: {
        title: 'A town without a sky',
        body: 'In the Cave Town there is a painted wall. It shows a procession of people with lanterns descending a mountain. At the front walks a woman with a key on her belt.\n\nThe lamp bearer says the picture was already old when the town was dug. The people on the wall walk from right to left. Toward us.',
      },
      highGorge: {
        title: 'The language of lanterns',
        body: 'In the gorge it is too loud to talk, so people speak with lanterns. The walkway mistress taught me her signs: short, long, covered.\n\nThey are the same ones Fenno gives from the tower. I asked him where he got them. From Alwine. And she? From her mistress. Nobody invented these signs. They came down the mountain with the fires.',
      },
      roadThirtySix: {
        title: 'Half the levels',
        body: 'Thirty-six levels are burning. I notice that in the evening I no longer look at our own fire first, but up along the chain, to the place where it ends.\n\nI used to keep a fire. Now I keep the question of how far it reaches. Alwine writes that it is not different work, only the same work from higher up.',
      },
      chainEighteen: {
        title: 'A sign from above',
        body: 'Tonight the chain answered. Not one of our fires, but one of the three we did not light. Short, long, covered. Short, long, covered.\n\nFenno read it first, because he is the only one who never doubted. It means: “I am here.”',
      },
      highFirn: {
        title: 'A letter from the firn',
        body: 'Dear Watch,\n\nthe tracker showed me a trail in the old snow. Boots, a staff, and beside them something small on four paws. It leads upward and is two hundred years old, he says, give or take ten.\n\nBeside it runs a second one, fresh. It leads down. It is from yesterday.',
      },
      highFair: {
        title: 'The empty square',
        body: 'The Herders\' Fair stands empty all year and is swept all the same. The fair reeve says a square nobody waits for turns into a meadow.\n\nThis year the herders came early. From their pastures, they say, they had seen the fires and thought there was something to celebrate. They were right. I just did not know it yet.',
      },
      highPlateau: {
        title: 'The missing star',
        body: 'On the Star Plateau constellations are scratched into the rock. The night scribe has been comparing them with the sky for years. One does not match: in the rock, the Ladder has one rung more.\n\nTonight he woke me. The rung was back, he said. It is not a star. It is our seventeenth fire. Whoever scratched this did not draw stars, but a road that has burned once before.',
      },
      roadFortyFive: {
        title: 'Fenno keeps the fire',
        body: 'Today I left Fenno alone with the fire for the first time, for a whole night. He did not sleep, he claims. In the morning there were four empty mugs on the table and a list: every hour, every fire, a tick.\n\nUnder the last line it said: “All there. The strange ones too.” I laid the list into the chronicle. It belongs here.',
      },
      highKiln: {
        title: 'A fire someone waits for',
        body: 'The Cold Kiln is as big as a house. The ash keeper sweeps it out every morning although it has been cold for as long as anyone can think. “A fire no one waits for does not come back,” she says.\n\nI asked what was fired here. She showed me a brick, the first one, with a mark: a lantern. This is where the lanterns were made, Watch. All of them. Ours too.',
      },
      highBoundary: {
        title: 'A letter from the boundary stone',
        body: 'Dear Watch,\n\nthere are two marks on the stone. Our lantern on one side. On the other a lantern with four rays instead of three. I held the key up beside it. Four teeth.\n\nThe border walker has spoken at last. Over there, he says, is a watch like ours. It never let its fires go out. It only stopped waiting for an answer. Until recently.',
      },
      chainTwentyFour: {
        title: 'One fire missing',
        body: 'Twenty-four fires in a row, from the valley to just below the last ridge. One is missing.\n\nFenno asks every evening: when? Every evening I say: soon. We both know I am putting it off. It is not every day that you stand before the last stretch of a road someone began two hundred years ago.',
      },
      highFirstWatch: {
        title: 'The third step',
        body: 'Of the First Watch only the foundations still stand. A fire bowl. A stair of three steps that no longer leads anywhere.\n\nI reached under the third step without thinking. A key lay there. Three teeth. And a note, in a hand I know from our own chronicle, from the very first page: “If you are reading this, you are curious, and curiosity is all it takes to begin.”',
      },
      roadSixty: {
        title: 'The way of the fires',
        body: 'I am writing this page myself. The road is burning, from the valley to the First Watch and on, down the other slope, in fires that are not ours.\n\nWho lit the other fires? No one alone. One began, one carried on, one laid the key under the step. Over there a watch with four rays is waiting. Alwine is already packing. Fenno says this time he is coming along. I think this time he is right.',
      },
    },
  },
  ceremony: {
    fresh: (names: string) => `Newly open: ${names}.`,
    wheel: 'Spin the Star Wheel',
    wheelResult: (name: string, blurb: string) => `The Star Wheel shows: ${name}. ${blurb}`,
    title: (layer) => `${layer}`,
    body: (amount, currency) => `The valley rests. The archive now holds ${amount} more ${currency}.`,
    cta: 'A new morning',
    milestone: (n) => `Milestone: run ${n}. The valley will not forget.`,
    layers: {
      moonturn: { l1: 'The moon turns above Duskvale.', l2: 'The Glimmer drifts away, the houses sink into sleep.', l3: 'What you have learned stays.' },
      longNight: { l1: 'The sun stays away.', l2: 'For days only one fire burns: yours.', l3: 'Then, at last, the rim of the sky grows bright.' },
      ages: { l1: 'You lay the key in another hand.', l2: 'The fire cannot tell the difference.', l3: 'That is how it was always meant.' },
    },
  },
  fenno: {
    name: 'Fenno',
    any: {
      a: 'I counted the lanterns. Twice. There are more of them!',
      b: 'Alwine says I talk too much. Did she write that to you as well?',
      c: 'In the city there is a lamp on every corner. Not one of them glimmers properly.',
      d: 'Shall I upgrade something? I will upgrade something.',
      e: 'The griffin looked at me. It likes me. Or it is hungry.',
      f: 'If you are very quiet you can hear the Glimmer crackle. I am never very quiet.',
      g: 'I scrubbed the third step. Just in case.',
      h: 'It used to be pitch dark here at night. Now I have to squint.',
    },
    night: { a: 'Lovely, is it not? You see the fire best from here.', b: 'I will stay up a while. Someone has to count the fireflies.' },
    dawn: { a: 'Morning! I have already blown out all the lanterns. Nearly all.' },
    winter: { a: 'Cold! But the forge is warm. I will just go and "check on it".' },
    rain: { a: 'Rain is good for the herbs, Alwine says. My shoes disagree.' },
    mist: { a: 'In the mist I only find the path because of the lanterns. Good thing we have them.' },
    wind: { a: 'The wind took my cap. If you see it: it is blue.' },
  },
}
