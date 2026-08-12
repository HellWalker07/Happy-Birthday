# 🎂 Birthday World

An interactive neon "birthday world" you travel through — a boot screen, an imposter gate, a face scan, a fairy-light map, six districts of games and memories, and a final letter.

---

## 🚀 See it right now (2 ways)

### A. Quick peek (no camera/mic)
Just double-click **`index.html`**. Everything works **except** the webcam + microphone features (face scan, blow-the-candles-by-breath, live photobooth) — browsers block those unless the page is served over `http://localhost` or `https://`.

### B. Full experience locally (camera + mic work)
Open a terminal in this folder and run **one** of these, then visit the printed URL (usually `http://localhost:8000`):

```bash
# if you have Python
python -m http.server 8000

# or if you have Node
npx serve
```

---

## ✏️ Make it yours — edit ONE file

Open **`assets/content.js`** and change the text inside the quotes. That's it. Names, jokes, the letter, the wrapped cards, merch, everything lives there.

To add your own photos / videos / voice:
1. Drop files into `assets/photos`, `assets/videos`, or `assets/audio`.
2. Put the filename in `content.js` where it says `""` (each spot has a comment showing the path).

The site works fully with fun placeholders even before you add a single file.

### Handy things to set first
| What | Where in `content.js` |
|---|---|
| His name / your name | `him.name`, `her.name` |
| Your real letter | `finale.letter`, `finale.signOff` |
| Background music | `audio.bgMusic` |
| Your voice reading the letter | `finale.voiceover` |
| Photos on the wall + their stories | `gallery.polaroids` |
| Memory video(s) | `gallery.videos` |
| Wrapped card wording | `wrapped` |
| Store items | `store.items` |

---

## 🌐 Put it online (free, gives a shareable link — recommended)

Camera/mic need HTTPS, so hosting is the best way to send it to him.

**Easiest — Netlify Drop:** go to <https://app.netlify.com/drop> and drag this whole `Didi` folder onto the page. You get a live link in seconds.

**Or GitHub Pages:** push this folder to a GitHub repo → Settings → Pages → deploy from `main` / root.

**Or Vercel:** `npx vercel` in this folder.

---

## ❤️ How it flows
Boot screen → Imposter gate (tick all 4) → Face scan → **Map** → explore all 6 districts to collect hearts and light up the map → **Next** unlocks your letter finale.

Progress + hearts are saved in his browser, so he can leave and come back. (Tiny "reset progress" link is on the map, bottom-left.)

## 🎮 The districts
1. **Bday City** — blow out candles (breath or tap) → cake explodes into a message → balloon-pop game with hidden rewards.
2. **Memory Lane** — flip-over polaroid wall, live photobooth (earns a heart), Netflix-style memories.
3. **Arcade** — find 10 hats, escape room with 3 riddles.
4. **Open-When Letters** — envelopes that open to your notes.
5. **Wrapped** — Spotify-Wrapped-style story cards + a Blend.
6. **Merch Store** — spend hearts, cart + checkout, "Confirm purchase?" gag, printed receipt.

Made with 💜
