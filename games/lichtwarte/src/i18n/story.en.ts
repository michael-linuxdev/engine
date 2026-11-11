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
    chapters: {
      key: 'The Key',
      remains: 'What Stays',
      wakes: 'The Valley Wakes',
      night: 'The Long Night',
      handover: 'Passing the Watch',
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
