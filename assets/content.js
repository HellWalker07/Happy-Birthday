/* ============================================================================
 *  content.js  —  THE ONLY FILE YOU NEED TO EDIT  💜
 * ----------------------------------------------------------------------------
 *  Everything the site says, shows, and plays lives here. Change the text
 *  inside the quotes. To use your own photos/videos/audio, drop the files in
 *  the assets/ subfolders and put the filename here.
 *
 *  Anything left as-is will just show a fun placeholder — the site works fully
 *  even before you add a single real photo.
 * ========================================================================== */

window.CONTENT = {

  /* -------- WHO IS THIS FOR -------- */
  him: {
    name: "Aditya",             // the birthday person's name
    petName: "Best Man",        // used in "Happy Birthday to the ___"
  },
  her: {
    name: "Rakshasni",             // your name / how you sign the letter
  },

  /* -------- BOOT SCREEN (the terminal intro) -------- */
  boot: {
    lines: [
      "Initializing Birthday Mode...",
      "Loading chaos...",
      "Importing inside jokes...",
      "Collecting embarrassing photos...",
      "Calibrating birthday energy...",
    ],
    errorLine: "ERROR.",
    errorSub: "Too much handsomeness detected.",
    errorEnd: "Continuing anyway...",
    startButton: "tap to begin",
  },

  /* -------- IMPOSTER GATE (all must be checked) -------- */
  gate: {
    title: "Verify you are not an imposter",
    subtitle: "(Select ALL that are true)",
    options: [
      "Annoys me on purpose",
      "Steals my food",
      "Sends the same reels I do without watching what I sent",
      "Knows my coffee order",
    ],
    grantedText: "ACCESS GRANTED",
    deniedTitle: "ACCESS DENIED",
    deniedText: "You are an imposter 🤨",
    // Optional GIF for the denied screen — drop a file in assets/img/ and name it here
    deniedGif: "",   // e.g. "assets/img/denied.gif"
  },

  /* -------- FACE SCAN -------- */
  faceScan: {
    scanningText: "Scanning face...",
    resultText: "IDENTITY CONFIRMED",
    resultSub: "100% certified birthday boy",
    noCamText: "Camera shy? That's okay — we know it's you.",
  },

  /* -------- THE MAP (the scrapbook page) -------- */
  map: {
    title: "BIRTHDAY WORLD",
    tagline: "Let's celebrate!",
    walletNote: "Collect hearts on your way — spend them on gifts later.",
    nextLockedText: "Explore everything to unlock your surprise…",
    nextButton: "Next →",

    // the torn notebook note, top-left. `welcomeLead` sits just before the
    // name, which is pulled from him.name and highlighted in marker.
    welcomeTop: "Made with Love",
    welcomeLead: "for",
    // the bottom-left notepad — one line per row of the ruled paper. Whatever
    // string is in `vibesMark` gets the highlighter swipe.
    vibesList: ["your special being", "makes life so much", "more special"],
    vibesMark: "more special",
    // speech bubble next to the top-right photo
    speechBubble: "let's gooo!",
    // the pink sticky note, bottom-right
    stickyNote: "made of\nsunshine,\nlaughter\nand mischief",

    /* Scrapbook photos. Drop replacements in assets/img/ and rename here.
     * `cutout: true` removes the polaroid frame so a background-removed PNG
     * sits directly on the page — that's how the reference art looks. Give it
     * a transparent .png and flip the flag; nothing else needs to change. */
    photos: {
      topRight:    { src: "assets/img/BW top right.jpeg" },
      leftBottom:  { src: "assets/img/BW left bottom.jpeg" },
      rightBottom: { src: "assets/img/BW right bottom.jpeg", cutout: false },
    },

    // Order of stops along the path
    districts: [
      { id: "bdaycity", label: "Bday City",         icon: "📍" },
      { id: "gallery",  label: "Memory Lane",       icon: "📷" },
      { id: "arcade",   label: "Arcade District",   icon: "🕹️" },
      { id: "letters",  label: "Open-When Letters", icon: "💌" },
      { id: "wrapped",  label: "Wrapped",           icon: "🎁" },
      { id: "store",    label: "Merch Store",       icon: "🛍️" },
    ],
  },

  /* -------- BDAY CITY: cake + balloons -------- */
  bdaycity: {
    startButton: "Start Celebration",

    /* -- the town-square landing collage -- */
    welcomeTitle: "Welcome to the town square",
    welcomeSub: "The celebration begins here.",
    // pink pinned notepad, left. One string per line.
    noteLeft: ["let the", "good times", "roll!"],
    // small clipped note, right
    noteRight: "06.06.2026",
    // grid-paper note, bottom-right. `noteGridMark` gets the highlighter.
    noteGrid: ["Aditya is", "the event.", "We're the", "audience."],
    noteGridMark: "the event.",
    photos: {
      rightTop:   { src: "assets/img/BC right top.jpeg" },
      leftBottom: { src: "assets/img/BC left bottom.jpeg" },
    },

    /* -- the screen after the candles are out, before the balloons -- */
    cakeBannerTop: "HAPPY BIRTHDAY",
    cakeBannerSub: "TO MY LOVE",
    playButton: "Play a game",
    notePlay: ["you", "make every", "moment better"],   // ruled note, left
    stickyPlay: "best days\nare the\nones with\nyou",   // pink sticky, right
    gridPlay: ["cheers to", "you today", "& always"],   // grid note, bottom-right

    cakeType: "Tiramisu",
    blowPrompt: "Blow into your mic to blow out the candles! (or tap the flames)",
    cakeMessage: "HAPPY BIRTHDAY ADITYA",
    balloonPrompt: "Pop the balloons!",
    // Rewards hidden in balloons. type: coupon | pic | meme | prize | voice | fact | heart | evil
    balloons: [
      { type: "fact",   text: "Secret fact: your eyes twinkle when you are excited" },
      { type: "fact",   text: "Secret fact: You have always liked me, you just didn't know" },
      { type: "voice",  text: "Bear with this voice", audio: "assets/audio/balloon.ogg" },
      { type: "meme",   text: "Meme Unlocked!!!", img: "assets/img/pop3.jpeg" },
      { type: "pic",    text: "Look at this photo", img: "assets/img/pop2.jpeg" },
      { type: "coupon", text: "Coupon: One free hug, redeemable anytime." },
      { type: "prize",  text: "Free Pizza!\n(T&C: Buy it yourself.)" },
      { type: "heart",  text: "Secret achievement unlocked." },
      { type: "evil",   text: "Oops. You lost absolutely nothing." },
      { type: "coupon", text: "Coupon: Winner of every argument (once)." },
    ],
  },

  /* -------- GALLERY: polaroids + netflix -------- */
  gallery: {
    wallTitle: "The Wall",
    wallNote: "Tap a photo to flip it over.",
    // these two replace "collect moments, not things" / "good vibes only",
    // exactly as the brief asked
    wallNoteLeft:  ["if it was upto me,", "I'd give us the", "cutest pictures award"],
    wallNoteRight: ["photos always tell", "a story (that's why", "I always wanna click", "just one more)"],
    // the pinned polaroid up in the top-right corner — swap for any photo
    wallPhoto: "assets/img/wall top right.jpeg",
    boothButton: "Open camera",

    photoboothTitle: "Live Photobooth",
    photoboothNote: "Mission: one photo for the wall",
    // Each polaroid: front photo + the story on the back
    polaroids: [
      { img: "assets/img/p1.jpeg", caption: "Our First Year",
        what: "Every time I think about our early days, I can't help but smile. There was something so special about stepping into a completely new chapter of life, exploring unfamiliar territory, yet somehow feeling so safe and so at home, with you.\n\nI still think about those endless hours outside the library, where we'd do everything except study, talking, laughing, and losing track of time. Our little dates where you'd happily agree to eat the most random, atpata things just because you wanted to impress me. Those amphitheatre baithaks that somehow turned into the best part of the day. The walks, the conversations, the comfortable silences, the butterflies, the excitement of getting to know each other, everything felt like an adventure.\n\nOur first year was filled with firsts. It was messy, exciting, full of laughter, love, stolen moments, and butterflies. But more than anything, it gave me a feeling I never expected to find so early, the feeling of being completely at home with someone. And even today, when I look back at those memories, they still feel just as warm, just as magical, and just as unforgettable." },
      { img: "assets/img/p2.jpeg", caption: "Felt Right at Home",
        what: "I found a home away from home in you. You are the warmest person I know. Your hugs have a way of making even the hardest days feel lighter, and simply being with you brings me a sense of peace, even when we're bickering, teasing each other, or wrestling over something silly.\n\nCreating new experiences with you is my favourite thing to do. I love the little traditions we've made our own, the memories we're constantly adding to, and the quiet joy of simply doing life together.\n\nThank you for being my safe place, my comfort, and my greatest adventure all at once. I love you, today and always." },
      { img: "assets/img/p3.jpeg", caption: "Tera mujhse hai pehle ka nata koi",
        what: "Some people are simply meant to find each other, and I truly believe God made us to be one of those lucky ones.\n\nThrough every high and every low, we have found our constant in each other. With every new chapter life has brought our way, we've somehow always ended up holding hands. Through the laughter and the tears, the celebrations and the storms, one thing has never changed, we've always had each other's back.\n\nWhat we have is rare. It's precious, worth protecting, and something I'll cherish for the rest of my life.\n\nLong before I knew who you would be, I always knew that when I found the person I would love, these would be the words I'd dedicate to him. And now, with you, they finally feel like they were always meant to.\n\nTera mujhse hai pehle ka naata koi,\nYun hi nahi dil lubhaata koi,\nJaane tu ya jaane na…\n\nMaybe the song knew our story long before we did." },
      { img: "assets/img/p4.jpeg", caption: "You are my beginning, middle and end",
        what: "I have a feeling this place will always be special to us. It's where we truly found each other. Where we confided in one another, pushed each other to grow, felt the butterflies and the nervous excitement, discovered a quiet sense of peace, and slowly realised just how much we meant to each other and just how deeply our hearts were capable of loving.\n\nI think we'll always find ourselves coming back here, not just because of the place itself, but because of everything it gave us. It gave us something that will stay with us forever, something far greater than what it ever promised, something beautifully unexpected, and something that became the beginning of us." },
    ],
  },

  /* -------- ARCADE -------- */
  arcade: {
    /* -- the "pick a game" board -- */
    pickTitle: "PICK A GAME",
    pickSub: "Abhi Majja Aayega na Bhiduu",
    warnNote: ["warning:", "extreme fun", "ahead"],
    goodNote: ["good games", "great vibes", "best memories"],
    fairNote: ["no cheating,", "just good times!"],

    /* -- escape room -- */
    escTitleTop: "Escape the",
    escTitleMain: "BIRTHDAY ROOM",
    escSolveLine: "Solve 3 riddles to escape!",
    escHint: "tap a drawer to read its riddle",
    escAsk: "What is it?",
    escFooter: "think together, laugh louder, escape faster!",
    escNote1: ["think.", "laugh.", "escape!"],
    escNote2: ["teamwork", "makes the", "dream work"],

    /* -- find the hats -- */
    hatsTitle: "Find the 10 Birthday Hats",
    hatsSub: "They're hiding… can you spot them all?",
    hatsTip: "pro tip: they love to blend in!",
    hats: { count: 10, prompt: "Find all 10 hidden birthday hats!" },
    differences: {
      prompt: "Spot all 8 differences!",
      imgA: "",  // assets/photos/diff-a.jpg
      imgB: "",  // assets/photos/diff-b.jpg
    },
    escape: {
      prompt: "Escape the Birthday Room — solve 3 riddles.",
      riddles: [
      { q: "This was a place where the evenings came alive,\nWhere little moments turned into memories we’d revive.\nNo grand stage, no fancy view,\nYet somehow it became special because of us.\n\nYou’d stand below, waiting patiently,\nWhile I’d appear above secretly.\nA wave, a smile, a little hello,\nThen I’d rush down faster than you’d ever know.\n\nSometimes I played a little hide-and-seek game,\nSneaking you treats without taking the blame.\nYou’d wait right here, I’d bring my surprise,\nAnd we’d spend hours with laughter in our eyes.\n\nSo tell me, which place am I?\nThe spot that saw our endless talks,\nOur silly laughs, our evening walks,\nAnd where two people slowly became a \"we.\"",
        a: "Amphitheatre" },
      { q: "Before the fancy setups and perfect views,\nBefore the reels and the creator’s clues,\nThere was a moment, simple and new,\nWhere a random trend became our debut.\n\nBoxes were scattered, the house was a mess,\nYet somehow we created magic from the chaos.\nNo studio, no perfect backdrop in sight,\nJust two people making memories right.\n\nIt was our first trend, our first reel,\nYour grand “release” on my private deal.\nA little embarrassing, a little iconic too…\nCan you guess what this memory grew into?",
        a: "Zootopia selfie reel" },
      { q: "We share a love that brings us both joy,\nA little adventure we never seem to avoid.\nBut when it’s time to make the final call,\nSuddenly we become experts on it all.\n\nYou bring your arguments, I bring mine,\nTrying to prove that my choice is the sign.\nA little convincing, a little debate,\nA dramatic discussion before we decide our fate.\n\nOur tastes may not always walk the same way,\nBut somehow we still find a reason to stay.\nOne of us compromises, the other gets excited,\nAnd in the end, we’re both happily delighted.\n\nSo what is this thing we never say no to,\nThat fills our hearts (and our stomachs) too?",
        a: "exploring food / cafes" },
      ],
      solvedText: "The cake is unlocked. 🎂",
    },
  },

  /* -------- OPEN-WHEN LETTERS: page furniture -------- */
  letters_page: {
    title: "Open-When Letters",
    sub: "Open each one when the moment feels right.",
    backLabel: "Back to letters",
    note: ["For all the little", "moments."],
    openNote: ["Take your time.", "I'll be here."],
  },

  /* -------- OPEN-WHEN LETTERS -------- */
  letters: [
    { when: "Open when you want to revisit us",
      body: "Chaotic, fun, cute, and absolutely awesome, that's what we are.\n\nSince you're here today, feeling like revisiting us, let's take a little walk down memory lane.\n\nWhat started as a friendship slowly became so much more, without either of us planning it or even realizing it. Ironically, what the entire world seemed to notice our chemistry, our compatibility, that undeniable spark, we were completely oblivious to. It took a couple of dates, a little bit of drama, and a whole lot of overthinking before we finally admitted to ourselves, *\"Oh... our hearts have been feeling this way all along.\"*\n\nFor me, that phase of our lives will always be one of my favourites. Every day felt like a new adventure. We were constantly exploring a new café, a new street, a new place, or simply discovering new things about each other. We were trying to impress one another without even realizing that's exactly what we were doing. The time we spent inside the library pretending to study, and outside the library doing literally everything except studying, will forever hold a special place in my heart.\n\nWe've shared so many firsts together. So many adventures. So many memories that only make sense to us.\n\nThe long drives where we'd spend more time arguing about *whose songs get the bluetooth* than actually driving. The endless rounds of *stone-paper-scissors* just to decide where or what we were going to eat. The random detours because \"let's just see where this road goes.\" The late-night conversations that somehow started with something completely random and ended with us discussing life, dreams, and everything in between.\n\nEvery little moment somehow became a core memory.\n\nLooking back, I don't think it was ever about the places we went. It was always about who I was with. Somehow, the most ordinary days became extraordinary simply because they were spent with you.\n\nWe've had our fair share of chaos, drama, silly fights, and moments where one of us wanted to strangle the other. But we've also laughed until our stomachs hurt, celebrated every tiny win together, created inside jokes that no one else understands, and built a little world that has always felt like home.\n\nAnd if there's one thing I've realized while looking back at all of this, it's that I'd choose every single memory all over again. Every laugh, every adventure, every argument over music, every spontaneous plan, every \"where are we even going?\" drive, every meal decided by stone-paper-scissors.\n\nBecause at the end of it all, my favourite part of every memory has always been you." },

    { when: "Open when you think you can win an argument against me",
      body: "Oh, you sweet, delusional soul.\n\nIf you're opening this because you genuinely think you've finally found an argument you can win against me... I admire the confidence. The optimism. The sheer audacity.\n\nSee, you may be a master manipulator when it comes to the rest of the world, but unfortunately for you, I know you inside out. I know every tactic, every dramatic pause, every random point that seems unrelated but is somehow heading towards a grand conclusion. I can literally see the storyline forming in your head before you've even finished your first sentence.\n\nAnd then comes my favourite part, that tiny look on your face when you realize your master plan isn't working because I've already figured out exactly where you're going with it.\n\nCute.\n\nI'm sorry, but when it comes to us, you simply cannot beat the master. You still have years of training left before you even qualify to challenge me.\n\nNow, before you start listing the \"times you've won,\" let me save you the effort.\n\nThose weren't victories.\n\nThose were charitable donations.\n\nOn the rare occasions I \"lost,\" it was because I valued my peace more than proving, yet again, that I was right. I simply ran out of energy, not arguments.\n\nThere's a difference.\n\nSo if you're reading this after a disagreement, take a deep breath, accept your fate, and remember one very important rule:\n\n**If I said \"fine,\" it wasn't because you won. It was because I was done.**\n\nNow close this letter, come back, apologize (whether you're wrong or not is between you and your conscience), and let's move on.\n\nWith love,\n\nThe Undisputed, Undefeated, Heavyweight Champion of Winning Arguments.\n\nP.S. Bow down." },

    { when: "Open when you need an ego boost",
      body: "First things first...\n\nYes, you're tall.\n\nYes, you're handsome.\n\nNo, this is not up for debate.\n\nNow that we've got the obvious out of the way, let's talk about the things that actually make you *you.*\n\nYou have one of the kindest hearts I've ever known. The way you care for the people you love is something I admire so much. You'd go to unbelievable lengths for them without expecting anything in return. It's never loud or showy, it's just who you are.\n\nYou're the kind of son every parent wishes for. The kind of friend everyone needs in their life. And somehow, you've managed to be the best friend and boyfriend I could ever ask for.\n\nOne of my favourite things about you is how naturally compassionate you are. You can never ignore a hungry animal on the street or someone in need. You always stop. You always help. It's such a small thing to others, but it says everything about the size of your heart. You care deeply and that is something that matters so much.\n\nYou're funny too.\n\nNot because you're trying to be.\n\nHalf the time, you're unintentionally the funniest person in the room, and I don't think you'll ever realize just how entertaining you are.\n\nYou're also the biggest gossip girl I know, which is honestly hilarious, but at the same time, you're one of the safest people to trust with a secret. I don't know how you manage to be both.\n\nWhen I look at you, I don't just see the person I love.\n\nI see comfort.\n\nI see peace.\n\nI see home.\n\nI see someone I know I can count on, no matter what.\n\nPeople like you are rare these days. A genuinely good heart is hard to come by, and you have one. Never let this world convince you otherwise.\n\nAnd before you start rolling your eyes, let me remind you of a few more things.\n\nYou're smart.\n\nYou're intelligent.\n\nYou're capable of doing anything you set your mind to.\n\nThe only thing standing between you and world domination is... your laziness.\n\nImagine the danger you'd be if you actually stopped procrastinating.\n\nSo whenever you're doubting yourself, read this again.\n\nYou are enough.\n\nYou are loved.\n\nYou are appreciated more than you know.\n\nAnd if, after reading all of this, your ego becomes slightly unbearable...\n\nYou're welcome.\n\n(Just don't get *too* confident. Someone has to keep you humble, and fortunately for the world, you have me.)\n\nLove,\nYour biggest fan... and your favourite reality check." },

    { when: "Open when life feels too much",
      body: "Hey, my love.\n\nIf you've opened this, I'm guessing life feels heavier than usual.\n\nMaybe work isn't going your way. Maybe you're exhausted. Maybe you've been carrying too much for too long. Maybe you feel pressured at home. Or maybe nothing in particular happened, and everything just feels overwhelming.\n\nWhatever it is, I need you to know something.\n\nYou don't have to have it all figured out.\n\nI know you. I know how much pressure you put on yourself. You want to do everything perfectly. You want to make everyone proud. You want to be there for everyone you love, even when you're running on empty.\n\nBut even the strongest people get tired.\n\nAnd that's okay.\n\nYou don't always have to be the one holding everything together. You don't always have to have the answers. It's okay to pause. It's okay to rest. It's okay to admit that today is just hard.\n\nNone of that makes you weak.\n\nIt makes you human.\n\nI wish I could magically take away whatever is weighing on your heart. I wish I could steal your stress for a little while, make you your favourite meal, drag you out for a long drive, play your favourite songs, and remind you that life is so much bigger than this difficult moment.\n\nBecause that's exactly what this is.\n\nA moment.\n\nNot your whole story.\n\nYou've overcome challenges before, and you'll overcome this one too. Not because you have to be invincible, but because you're stronger than you give yourself credit for.\n\nAnd if today all you can do is survive instead of thrive, that's enough.\n\nI'm so proud of you not just for your achievements, but for the person you are. Your kindness. Your resilience. Your heart.\n\nYou don't have to earn love by being productive.\n\nYou don't have to earn rest by being exhausted.\n\nYou don't have to prove your worth to anyone.\n\nEspecially not to me.\n\nTo me, you'll always be enough.\n\nSo if everything feels loud right now, here's what I want you to do.\n\nTake a deep breath.\n\nDrink some water.\n\nEat something.\n\nGo outside if you can.\n\nOr just lie down for a while.\n\nAnd if none of that helps, then call me. We'll sit in silence if that's all you have the energy for. I'll listen if you want to talk. I'll distract you if you don't. We don't have to solve everything today.\n\nYou never have to carry the weight of the world alone.\n\nNo matter how messy life gets, no matter how difficult things become, remember this:\n\nYou have me.\n\nAlways.\n\nOne bad day, one bad week, or one difficult chapter will never define the incredible person you are.\n\nSo be gentle with yourself.\n\nThe world already asks enough of you.\n\nAnd whenever you're ready, we'll take the next step together.\n\nI love you, on the easy days and the hard ones. Most importantly, I love you exactly as you are.\n\nAlways. ❤️" },

    { when: "Open when you want to know what home feels like",
      body: "Home.\n\nIt's a funny word, isn't it?\n\nMost people think it's a place. Four walls. A familiar room. An address on a map.\n\nBut somewhere along the way, home stopped being a place for me.\n\nIt became a person.\n\nYou.\n\nWhen I think of home, I don't think of buildings or cities. I think of the peace I feel when I'm with you. I think of how the loudest days become quieter, how the chaos in my mind settles just because you're there.\n\nHome is laughing so hard that we forget what we were even laughing about.\n\nHome is arguing over everything and anything and then hugging it out.\n\nHome is taking time out, going against all odds just to spend a few hours together\n\nHome is long drives with no destination, conversations that last for hours, comfortable silences that never feel awkward, and knowing that even doing absolutely nothing with you somehow feels like the best part of my day.\n\nHome is the way I never have to pretend around you.\n\nI can be happy, grumpy, dramatic, emotional, annoying, quiet, or completely chaotic, and somehow, you make room for every version of me.\n\nThat's what home does.\n\nIt lets you exist exactly as you are.\n\nWhen I look at you, I don't just see the man I love.\n\nI see safety.\n\nI see comfort.\n\nI see familiarity.\n\nI see someone who makes every unfamiliar place feel a little less unfamiliar.\n\nI see someone I can call at 2 a.m. (though you might be sleeping ), someone I can celebrate my biggest wins with, cry in front of without feeling embarrassed, and annoy endlessly without worrying that you'll ever stop loving me. Someone who accepts me and someone who makes an effort to make my family his own.\n\nThat, to me, is home.\n\nSo if you're ever wondering what home feels like...\n\nIt feels like your hand in mine.\n\nIt sounds like your laugh.\n\nIt looks like your smile after a long day.\n\nIt feels like every hug that silently says, *\"I've got you.\"*\n\nAnd maybe one day, years from now, we'll have a little place that we call ours.\n\nBut even before that day comes, I already know this much:\n\nAs long as I have you, I'll never really be homeless.\n\nBecause home was never the place.\n\nIt was always the person.\n\nIt was always you." },

    { when: "Open when you're taking the next step",
      body: "WAIT.\n\nBefore you say a single word...\n\nBefore you tell me what's happening...\n\nBefore you get down on one knee, hand me a key, or dramatically clear your throat...\n\n**My answer is YES.**\n\nThere. Now breathe.\n\nHonestly, I've probably spent more time imagining this moment than you have. So if you're opening this because you're taking the next step, whatever that step may be, I am already ridiculously excited.\n\nMaybe you're asking me to move in with you.\n\nMaybe you're standing outside a jewellery store wondering if you've picked the right ring.\n\nMaybe it's four or five years from now, and you're planning our engagement.\n\nOr maybe you're just thinking about a future that has us in it.\n\nWhatever it is...\n\nThe answer is still yes.\n\nNot because I know every detail of what life will look like.\n\nBut because I know you.\n\nAnd I know us.\n\nWe've already survived the awkward beginnings, the \"are we just friends?\" phase, the drama, the overthinking, the silly fights, the compromises, the distance, the long drives, the library days, the random food debates, and all the little moments that slowly built something beautiful.\n\nIf we've come this far, I think we'll do just fine.\n\nSo please...\n\nDon't overthink the speech.\n\nDon't worry if your hands are shaking.\n\nDon't panic if you forget half the things you wanted to say.\n\nDon't compare our story to anyone else's.\n\nBecause our story has never needed to be perfect.\n\nIt's always been perfectly ours.\n\nAnd if this *is* a proposal...\n\nFirst of all, I hope you've picked a nice outfit.\n\nSecond, I hope you've remembered that I love surprises and pictures (book a photographer)\n\nThird... if you don't make me feel at least 10% like a Bollywood heroine, I will be mildly disappointed.\n\nI'm talking wind that appears out of nowhere.\n\nBackground music that somehow only we can hear.\n\nA look that says *\"Tumse hi shuru, tumpe hi khatam.\"*\n\nBonus points if you make me cry happy tears.\n\nExtra bonus points if there's food afterwards because emotions make me hungry.\n\nBut jokes apart...\n\nThe grand gesture isn't what I'll remember.\n\nI'll remember your eyes.\n\nThe way your voice sounds.\n\nHow nervous you'll probably be.\n\nThe tiny details that only happen once.\n\nBecause years from now, when people ask me about this day, I won't remember whether everything went according to plan.\n\nI'll remember that it was you.\n\nThe boy who accidentally became my best friend.\n\nThe man who became my home.\n\nThe person I want beside me through every version of life.\n\nSo whether today is the day we get engaged, move into our first home, or simply decide to choose each other all over again...\n\nKnow this.\n\nI wasn't waiting for the perfect moment.\n\nI was waiting for **you**.\n\nNow stop overthinking.\n\nCome here.\n\nLet's write the next chapter of our story.\n\n(And please tell me someone is secretly recording this because I fully intend to relive it for the next fifty years.)\n\nForever your biggest \"yes.\"" },
  ],

  /* -------- SPOTIFY WRAPPED -------- */
  wrapped: {
    // the scrapbook surround on every Wrapped slide
    photos: { right: "assets/img/w1.jpeg", left: "assets/img/w2.jpeg" },
    // slide 2 has three photo slots in its artwork
    photos2: {
      topLeft:    "assets/img/s2 1.jpeg",
      right:      "assets/img/s2 2.jpeg",
      bottomLeft: "assets/img/s2 3.jpeg",
    },
    // slide 3 — matched to each slot's shape so nothing crops badly:
    // s3 1 is landscape, s3 3 portrait, s3 2 wide
    photos3: {
      topLeft:    "assets/img/s3 1.jpeg",
      right:      "assets/img/s3 3.jpeg",
      bottomLeft: "assets/img/s3 2.jpeg",
    },
    // slide 4 — two slots. s4 1 is very tall (0.56), so it goes in the
    // taller right-hand slot; s4 2 takes the squarer top-left one.
    photos4: {
      topLeft: "assets/img/s4 2.jpeg",
      right:   "assets/img/s4 1.jpeg",
    },
    // slide 5 — both slots are the same portrait shape, so filename order
    photos5: {
      topRight:   "assets/img/s5 1.jpeg",
      bottomLeft: "assets/img/s5 2.jpeg",
    },
    // slide 7 — `artist` fills the "Advika" polaroid in the artwork
    photos7: {
      topRight: "assets/img/s7 1.jpeg",
      artist:   "assets/img/advika.jpeg",
    },
    // slide 8 — three printed polaroids. The top-left one is the widest, so it
    // takes the only landscape photo of the three.
    photos8: {
      topLeft:     "assets/img/s8 2.jpeg",
      topRight:    "assets/img/s8 1.jpeg",
      bottomRight: "assets/img/s8 3.jpeg",
    },
    // slide 9 — the one polaroid taped up beside the pie chart
    photos9: {
      topRight: "assets/img/s9 1.jpeg",
    },
    // slide 10 — two printed polaroids. The right-hand print is the taller of
    // the two, so it takes the taller photo.
    photos10: {
      topLeft:  "assets/img/s10 2.jpeg",
      topRight: "assets/img/s10 1.jpeg",
    },
    // slide 6 — one photo per mood card, five in all. The circle in the middle
    // of the artwork is already printed with a photo, so it takes no entry.
    photos6: {
      plan:   "assets/img/plan.jpeg",
      hangry: "assets/img/hangry.jpeg",
      soft:   "assets/img/soft boy.jpeg",
      srs:    "assets/img/srs.jpeg",
      child:  "assets/img/child.jpeg",
    },
    note1: ["little", "moments,", "big", "memories ♡"],
    note2: ["you + me", "= magic ♡"],
    welcomeSub: ["The year in review: 365 days of chaos, cravings, conversations & choosing each other.","Your annual report of being dramatic, hungry, late, lovable and somehow still my favourite person."],
    /* -- slide 2: by the numbers -- */
    numbersTitle: "BY THE NUMBERS",
    numbersSub: ["A year, reduced to statistics.", "Somehow still not enough. ♡"],
    numbers: [
      { value: "365",     icon: "icCalendar", label: "Days completed together" },
      { value: "2,978",   icon: "icLaugh",    label: "Laughs caused (estimated because half were at each other's expense)" },
      { value: "519,202", icon: "icFries",    label: "Meals not shared (criminal behaviour, honestly)" },
      { value: "1",       icon: "icCakeSm",   label: "Birthday celebrated (but maximum drama generated)" },
      { value: "482",     icon: "icClock",    label: "Times “Bas 5 minute” turned into something much longer" },
      { value: "327",     icon: "icPin",      label: "Times we said “let's try this place” and made a food plan" },
      { value: "96",      icon: "icChat",     label: "Random conversations that started with “ek baat bata…”" },
      { value: "∞",  icon: "icHouse",    label: "Times you made me feel at home" },
    ],
    numbersFoot: { value: "0", label: "Days where life was boring with you" },
    phrases: ["\"5 minutes away\"", "\"I'm not hungry\" (then eats your fries)", "\"One more episode\"", "\"Trust me\"", "\"I already told you this\""],
    cravings: ["Pizza 🍕", "Anything with cheese", "Your food, specifically", "Midnight Maggi"],
    excuses: ["\"Traffic\"", "\"My phone died\"", "\"I was about to text\"", "\"I fell asleep\""],
    reels: { sent: "4,392", watched: "Maybe 400" },
    mood: ["😌 Calm: 12%", "😂 Unhinged: 58%", "🥹 Soft: 30%"],
    genre: [
      { label: "Comedy", pct: 40 },
      { label: "Romance", pct: 20 },
      { label: "Adventure", pct: 15 },
      { label: "Chaos", pct: 20 },
      { label: "\"We'll Figure It Out\"", pct: 5 },
    ],
    topArtist: "Rakshasniiii",
    blend: {
      score: "97%",
      shared: ["🍕 Trying new food", "🎬 Movie nights", "📸 Clicking random photos", "😂 Laughing at terrible jokes"],
      needsWork: ["⏰ Being on time", "🍟 Sharing fries", "📱 Replying instantly"],
    },
  },

  /* -------- MERCH STORE -------- */
  store: {
    // the free heart handed over the first time the store is opened
    giftText: "Cause I love You",
    walletNote: "Currency has no real-world value. Unfortunately.",
    items: [
      { emoji: "🏠", name: "Emergency Home Delivery", price: 2,
        desc: "Valid whenever you need a little piece of home. Redeem for: a hug, a call, comfort, listening session, or me showing up with your favourite thing." },
      { emoji: "👑", name: "One Day Where You Get To Be Spoiled Like A Kid", price: 5,
        desc: "No responsibilities. Your favourite food, your choices, your little wishes" },
      { emoji: "🏆", name: "I Admit You Were Right", price: 2,
        desc: "Rare. Limited edition. Use wisely." },
      { emoji: "🍽️", name: "No Objection Certificate: Food Edition", price: 4,
        desc: "Holder is entitled to pick the restaurant/food of their choice. No objections, negotiations, or dramatic persuasion allowed." },
      { emoji: "💆", name: "Royal Head Massage Pass", price: 3,
        desc: "Redeem this coupon for unlimited VIP head pampering. Terms include: comfortable position, happy sighs, and zero complaints." },
      { emoji: "🗂️", name: "CEO Assistant For A Day", price: 3,
        desc: "Redeem this coupon and I shall temporarily become your personal assistant. One task, one mission, zero complaints." },
      { emoji: "👨‍🍳", name: "Private Dining Experience", price: 1,
        desc: "One exclusive meal prepared specially for you. Restaurant: My kitchen. Chef: Me. Rating: Your responsibility." },
      { emoji: "🎬", name: "The Director’s Cut Pass", price: 3,
        desc: "Tonight, you are the director. You choose the movie, the snacks, the seating, and the entire cinematic experience. I promise not to say “are you sure?” (too many times)." },
    ],
    confirmText: "Confirm purchase?",
    noText: "Nice try. You already wanted it. 😏",
    generatingText: "Generating your coupon…",
  },

  /* -------- FINALE: the letter -------- */
  finale: {
    title: "One Last Thing…",
    // Your real letter goes here. Use \n\n for new paragraphs.
    letter: "My dearest,\n\nHappy birthday. I built this whole silly world just to say the thing I say every day but louder: I'm so glad you exist.\n\nThank you for the reels, the stolen fries, the terrible jokes, and every single ordinary day that you make un-ordinary.\n\nHere's to another year of us.\n\nAll my love,\n" ,
    signOff: "— Rakshasni",
    // Optional: your voice reading the letter (assets/audio/voiceover.mp3)
    voiceover: "",
    surpriseText: "The best is yet to come. 🎉",
  },

  /* -------- AUDIO --------
   * Each track loops for as long as you're in its section and stops on the way
   * out. Leave a path empty and that section simply plays no music. */
  audio: {
    bgMusic: "",                    // optional site-wide bed

    // per-district tracks
    wrapped:  "assets/audio/wrapped.mp3",     // loops for the whole Wrapped story
    arcade:   "assets/audio/arcade.mp3",      // loops across the whole Arcade district
    bdaycity: "assets/audio/candles.mp3",     // the cake screen — blowing the candles out
    letters:  "assets/audio/open-when.mp3",   // loops through the Open-When Letters
    gallery:  "assets/audio/memory-lane.mp3", // loops across all of Memory Lane
  },
};
