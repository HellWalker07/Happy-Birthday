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
    name: "Advika",             // your name / how you sign the letter
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

    cakeType: "Tiramisu",
    blowPrompt: "Blow into your mic to blow out the candles! (or tap the flames)",
    cakeMessage: "HAPPY BIRTHDAY TO THE BEST MAN",
    balloonPrompt: "Pop the balloons! 🎈",
    // Rewards hidden in balloons. type: coupon | pic | meme | prize | voice | fact | heart | evil
    balloons: [
      { type: "coupon", text: "🎟️ Coupon: One free hug, redeemable anytime." },
      { type: "prize",  text: "🍕 Free Pizza!\n(T&C: Buy it yourself.)" },
      { type: "meme",   text: "😂 Meme unlocked!", img: "" /* assets/img/meme1.jpg */ },
      { type: "fact",   text: "🤫 Secret fact: You once cried at a dog commercial." },
      { type: "voice",  text: "🎵 A little voice note for you…", audio: "" /* assets/audio/voice1.mp3 */ },
      { type: "pic",    text: "📸 Look at this one 🥹", img: "" /* assets/photos/cute1.jpg */ },
      { type: "heart",  text: "🦆 Secret achievement! +1 heart" },
      { type: "evil",   text: "Oops. You lost absolutely nothing." },
      { type: "coupon", text: "🎟️ Coupon: Winner of every argument (once)." },
      { type: "fact",   text: "🤫 Secret fact: You hum when you're happy." },
    ],
  },

  /* -------- GALLERY: polaroids + netflix -------- */
  gallery: {
    photoboothTitle: "Live Photobooth",
    photoboothNote: "Strike a pose — earn a heart!",
    netflixTitle: "Memories — Now Streaming",
    // Each polaroid: front photo + the story on the back
    polaroids: [
      { img: "", caption: "That one day", where: "Somewhere lovely",
        what: "We laughed until it hurt.", fact: "Unknown fact: you still owe me a rematch." },
      { img: "", caption: "Golden hour", where: "The usual spot",
        what: "Best chai of our lives.", fact: "Unknown fact: you took 47 photos of the sky." },
      { img: "", caption: "Chaos day", where: "You know where",
        what: "Everything went wrong. Perfect day.", fact: "Unknown fact: you named the pigeon." },
      { img: "", caption: "Just us", where: "Home",
        what: "Nothing happened. It was everything.", fact: "Unknown fact: you fell asleep first." },
    ],
    // Netflix-style memory videos (drop mp4s in assets/videos/)
    videos: [
      { title: "Our Greatest Hits", src: "", thumb: "" },
    ],
  },

  /* -------- ARCADE -------- */
  arcade: {
    hats: { count: 6, prompt: "Find all 6 hidden birthday hats! 🎩" },
    differences: {
      prompt: "Spot all 8 differences!",
      imgA: "",  // assets/photos/diff-a.jpg
      imgB: "",  // assets/photos/diff-b.jpg
    },
    escape: {
      prompt: "Escape the Birthday Room — solve 3 riddles.",
      riddles: [
        { q: "I get shorter as I burn for you every year. What am I?", a: "candle" },
        { q: "Sweet, layered, and your favourite. One word.", a: "tiramisu" },
        { q: "What do you make before you blow the candles?", a: "wish" },
      ],
      solvedText: "The cake is unlocked. 🎂",
    },
  },

  /* -------- OPEN-WHEN LETTERS -------- */
  letters: [
    { when: "Open when you miss me",      body: "Then just look up — same sky, always thinking of you." },
    { when: "Open when you're sad",       body: "You are so loved. More than you'll ever fully believe." },
    { when: "Open when you can't sleep",  body: "Close your eyes. I'm counting sheep with you." },
    { when: "Open when you're proud",     body: "I KNEW you'd do it. I always knew." },
  ],

  /* -------- SPOTIFY WRAPPED -------- */
  wrapped: {
    welcomeSub: ["The soundtrack was average.", "The memories were elite."],
    numbers: [
      { label: "Days Completed", value: "365", emoji: "📅" },
      { label: "Laughs Caused", value: "2,947", emoji: "😂" },
      { label: "Meals Shared", value: "Not enough", emoji: "🍕" },
      { label: "Birthdays Celebrated", value: "1", emoji: "🎂" },
      { label: "Photos Taken", value: "Still counting…", emoji: "📸" },
    ],
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
    topArtist: "Advikaaaaa",
    blend: {
      score: "97%",
      shared: ["🍕 Trying new food", "🎬 Movie nights", "📸 Clicking random photos", "😂 Laughing at terrible jokes"],
      needsWork: ["⏰ Being on time", "🍟 Sharing fries", "📱 Replying instantly"],
    },
  },

  /* -------- MERCH STORE -------- */
  store: {
    walletNote: "Currency has no real-world value. Unfortunately.",
    items: [
      { name: "A Real Hug", price: 2, emoji: "🤗" },
      { name: "Breakfast in Bed", price: 5, emoji: "🍳" },
      { name: "Movie Night (Your Pick)", price: 3, emoji: "🎬" },
      { name: "No-Reason Gift", price: 4, emoji: "🎁" },
      { name: "One Won Argument", price: 6, emoji: "🏆" },
      { name: "Unlimited Fries (from me)", price: 8, emoji: "🍟" },
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
    signOff: "— Advika",
    // Optional: your voice reading the letter (assets/audio/voiceover.mp3)
    voiceover: "",
    surpriseText: "The best is yet to come. 🎉",
  },

  /* -------- AUDIO -------- */
  audio: {
    // Background music (drop a file in assets/audio/ and name it). Leave "" for none.
    bgMusic: "",  // e.g. "assets/audio/bg.mp3"
  },
};
