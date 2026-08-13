/* ============================================================================
 *  wrapped.js — Spotify-Wrapped-style story cards + Blend
 * ========================================================================== */

BdayRouter.register('wrapped', function (app) {
  BdayState.markVisited('wrapped');
  BdayAudio.playTrack(CONTENT.audio && CONTENT.audio.wrapped);
  const w = CONTENT.wrapped;
  const him = CONTENT.him.name;
  const screen = el('.district.wrapped');
  screen.appendChild(districtHead('Wrapped 🎧'));

  const stageWrap = el('.wrapped-stage');
  screen.appendChild(stageWrap);
  app.appendChild(screen);

  // build cards
  const cards = [];

  // welcome
  cards.push(card('w-welcome', [
    el('.wr-big', { text: `${him}` }),
    el('.wr-huge', { text: 'Wrapped' }),
    el('.wr-year', { text: '2026' }),
    ...(w.welcomeSub || []).map(t => el('p.wr-sub', { text: t })),
  ]));

  // by the numbers — a cream paper sheet with a stat grid, not a sage card
  const numHead = el('.wr-num-head');
  const tornTitle = el('.wr-num-title', { text: `${him} Wrapped ♡` });
  numHead.appendChild(tornTitle);
  numHead.appendChild(el('.wr-num-year', { text: '2026' }));
  numHead.appendChild(el('h2.wr-num-h2', { text: w.numbersTitle || 'BY THE NUMBERS' }));
  (w.numbersSub || []).forEach(t => numHead.appendChild(el('p.wr-num-sub', { text: t })));

  const numGrid = el('.wr-num-grid');
  (w.numbers || []).forEach(n => {
    const cell = el('.wr-num-cell');
    cell.appendChild(el('.wr-num-val', { text: n.value }));
    cell.appendChild(el('.wr-num-label', { text: n.label }));
    if (n.icon && BW_DOODLE[n.icon]) cell.appendChild(el('span.wr-num-ic', { html: BW_DOODLE[n.icon]() }));
    numGrid.appendChild(cell);
  });

  const numKids = [numHead, numGrid];
  if (w.numbersFoot) {
    const foot = el('.wr-num-foot');
    foot.appendChild(el('span.v', { text: w.numbersFoot.value }));
    foot.appendChild(el('span.l', { text: w.numbersFoot.label }));
    foot.appendChild(el('span.wr-num-foot-heart', { html: BW_DOODLE.heart('#A9C998') }));
    numKids.push(foot);
  }
  cards.push(card('w-numbers.is-paper', numKids));

  // phrases
  cards.push(listCard('Most Used Phrases', '💬', w.phrases));
  cards.push(listCard('Top Cravings', '🍕', w.cravings));
  cards.push(listCard('Top Excuses', '🙃', w.excuses));

  // reels
  cards.push(card('w-reels', [
    el('h2', { text: 'Reels Wrapped' }),
    el('.wr-reel-num', { text: w.reels.sent }),
    el('p.wr-sub', { text: 'reels sent' }),
    el('.wr-reel-num.dim', { text: w.reels.watched }),
    el('p.wr-sub', { text: 'actually watched' }),
  ]));

  // mood
  cards.push(listCard('Mood Wrapped', '🌈', w.mood));

  // genre pie
  cards.push(genreCard());

  // top artist
  cards.push(card('w-artist', [
    el('p.wr-sub', { text: 'Your Top Artist' }),
    el('.wr-artist-circle', { text: '🎤' }),
    el('.wr-huge', { text: w.topArtist }),
    el('p.wr-sub', { text: '#1 on your charts, all year' }),
  ]));

  // blend
  cards.push(blendCard());

  let idx = 0;
  renderCard();

  function renderCard() {
    stageWrap.innerHTML = '';
    if (idx === 0) { renderPoster(); return; }
    if (ART_SLIDES[idx]) { renderArtSlide(ART_SLIDES[idx]); return; }
    const c = cards[idx];
    // the little white doodles inside the card, as in the reference
    c.appendChild(el('span.wr-mark.h1', { html: BW_DOODLE.heart('none', '#FBF9F1') }));
    c.appendChild(el('span.wr-mark.h2', { html: BW_DOODLE.heart('none', '#FBF9F1') }));
    c.appendChild(el('span.wr-mark.s1', { html: BW_DOODLE.star('none', '#FBF9F1') }));
    stageWrap.appendChild(c);

    // progress dots
    const dots = el('.wr-dots');
    cards.forEach((_, i) => dots.appendChild(el('.wr-dot' + (i === idx ? '.on' : ''))));
    stageWrap.appendChild(dots);

    const nav = el('.wr-nav');
    nav.appendChild(el('.wr-page', { text: (idx + 1) + ' / ' + cards.length }));
    if (idx > 0) nav.appendChild(el('button.btn.ghost', { text: '‹ Back', onclick: () => { idx--; BdayAudio.pop(); renderCard(); } }));
    if (idx < cards.length - 1) nav.appendChild(el('button.btn', { text: 'Next ›', onclick: () => { idx++; BdayAudio.pop(); renderCard(); } }));
    else nav.appendChild(el('button.btn', { text: 'Done ✨', onclick: finish }));
    stageWrap.appendChild(nav);
    stageWrap.appendChild(buildScraps());

    // each slide is its own page — land at the top of it, never mid-scroll
    window.scrollTo({ top: 0, behavior: 'auto' });

    // smooth cascade of this card's contents each time it changes
    UI.reveal(c);
  }

  /* The end of the deck, wherever it is reached from — the last plain card or
   * the last artwork, which both hand off to it */
  function finish() {
    if (!BdayState.isComplete('wrapped')) {
      BdayState.markComplete('wrapped');
      BdayState.awardHearts(1);
      UI.confetti();
      UI.toast('Wrapped complete! +1 ❤️');
    }
    BdayRouter.go('map');
  }

  /* Slide 1 is the reference artwork itself, with the live card text, your two
   * photos and working controls laid over the regions they occupy in it. */
  function renderPoster() {
    const P = w.photos || {};
    const wrap = el('.wr-poster-wrap');
    const poster = el('.wr-poster');
    wrap.appendChild(poster);

    const card = el('.wp-card');
    card.appendChild(el('.wp-name', { text: him }));
    card.appendChild(el('.wp-huge', { text: 'Wrapped' }));
    card.appendChild(el('.wp-year', { text: '2026' }));
    (w.welcomeSub || []).forEach(t => card.appendChild(el('p.wp-sub', { text: t })));
    poster.appendChild(card);

    const framed = (src, cls) =>
      el('.wp-ph.' + cls, {}, el('.shot', {}, el('img', { src: src, alt: '' })));
    if (P.right) poster.appendChild(framed(P.right, 'tr'));
    if (P.left)  poster.appendChild(framed(P.left, 'bl'));

    // no live dot row here: the artwork already prints one with the first dot
    // active, which is exactly right for slide 1. A second row on top of it
    // was the one thing that gave the overlay away.
    poster.appendChild(el('button.wp-next', {
      text: 'Next  ›',
      onclick: () => { idx++; BdayAudio.pop(); renderCard(); },
    }));

    stageWrap.appendChild(wrap);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  /* Slides 2-5 are all the same shape: an artwork that IS the page, with your
   * photos dropped into its printed polaroids and live Back/Next over its
   * printed controls. Their stats and copy are already part of the artwork, so
   * nothing else needs overlaying. One config entry per slide.
   *   key   — deck index
   *   art   — modifier class carrying the background image
   *   from  — which content.js photo set to read
   *   slots — [content key, slot class, focus?] triples, measured off that
   *           artwork; `focus` is described at refocus() below
   */
  const ART_SLIDES = {
    1: { art: 's2', from: 'photos2',
         slots: [['topLeft', 's2tl'], ['right', 's2r'], ['bottomLeft', 's2bl']] },
    2: { art: 's3', from: 'photos3',
         slots: [['topLeft', 's3tl'], ['right', 's3r'], ['bottomLeft', 's3bl']] },
    3: { art: 's4', from: 'photos4',
         slots: [['topLeft', 's4tl'], ['right', 's4r']] },
    4: { art: 's5', from: 'photos5',
         slots: [['topRight', 's5tr'], ['bottomLeft', 's5bl']] },
    // Slide 6's moods are dashed boxes printed on the mood cards, so they take
    // the .wp-mood treatment. Every one of them is landscape and every photo
    // supplied is portrait, so `cover` alone would drop between a third and two
    // thirds of each photo's height and take faces with it — each slot names
    // what has to survive the crop instead:
    //   plan   — asleep with the phone still in hand
    //   hangry — his face and the food, which sit right of centre
    //   soft   — a wide garden scene, so it holds the two of them, not the sky
    //   srs    — him hunched at the laptop, both ends of that kept in frame
    //   child  — the tiara down to the phone he is watching
    5: { art: 's6', from: 'photos6', mood: true,
         slots: [['plan',   'm-plan',   [.05, .43, .60, .72]],
                 ['hangry', 'm-hangry', [.50, .24, .95, .62]],
                 ['soft',   'm-soft',   [.20, .48, .78, .80]],
                 ['srs',    'm-srs',    [.02, .48, .82, .76]],
                 ['child',  'm-child',  [.20, .53, .85, .95]]] },
    // `bare` on the Advika slot so the artwork's caption stays visible
    6: { art: 's7', from: 'photos7',
         // held on her face — this print is square, so its box swings from tall
         // and narrow on a phone to wider than high on a laptop
         slots: [['topRight', 's7tr'], ['artist', 's7adv.bare', [.40, .55, .60, .75]]] },
    // slide 8's three polaroids are all `bare`: each printed frame is drawn at
    // its own angle, so the photo drops into the print itself rather than
    // wearing a second frame on top of the first
    7: { art: 's8', from: 'photos8', ar: 1448 / 1086,
         slots: [['topLeft', 's8tl.bare'], ['topRight', 's8tr.bare'],
                 ['bottomRight', 's8br.bare']],
         over: true },
    8: { art: 's9', from: 'photos9', ar: 1024 / 717,
         // held on him at the table, so the cakes and the banner come along
         slots: [['topRight', 's9tr.bare', [.14, .30, .56, .60]]] },
    9: { art: 's10', from: 'photos10', ar: 1024 / 818,
         // both prints are near enough square, so each photo is held on the two
         // of them rather than left to `cover`
         slots: [['topLeft', 's10tl.bare', [.32, .37, .74, .58]],
                 ['topRight', 's10tr.bare', [.28, .27, .72, .58]]] },
  };

  /* The artwork is stretched to fill the window, and a rotated rectangle does
   * not survive a non-uniform stretch — its corners shear. On a phone a 13°
   * printed tilt lands at 5° across and 35° down, so no plain rotation can sit
   * on it. Given the artwork's own aspect (`ar` on the slide), rebuild each
   * tilt as the matrix that the stretch turns back into the printed angle.
   * The CSS keeps holding the printed angles; this only re-expresses them. */
  function unstretchTilts(poster, ar) {
    const k = (window.innerWidth / window.innerHeight) / ar;
    poster.querySelectorAll('.wp-ph, .wp-mood').forEach(el => {
      if (el.dataset.tilt === undefined) {
        const m = new DOMMatrix(getComputedStyle(el).transform);
        el.dataset.tilt = Math.atan2(m.b, m.a);
      }
      const th = +el.dataset.tilt;
      if (!th) return;
      const c = Math.cos(th), s = Math.sin(th);
      el.style.transform = `matrix(${c}, ${s / k}, ${-s * k}, ${c}, 0, 0)`;
    });
  }

  /* A slot changes shape with the window. The artwork is stretched to fill the
   * viewport, so the same printed polaroid is tall and narrow on a phone and
   * wider than it is high on a laptop — and one crop written in CSS cannot suit
   * both: tuned for the phone it slices the top of a head off on the laptop.
   *
   * `focus` names the part of the photo that has to stay in frame, as
   * [x0, y0, x1, y1] fractions of the source. This solves, for the shape the
   * box has right now, the object-position and zoom that keep exactly that part
   * visible and fill the rest of the box with whatever surrounds it. The two
   * are set to the same point on purpose: the pixel at object-position is the
   * one that lands at the matching point of the box whatever the shape, so it
   * is also the one to zoom around. Where the box is too wide to hold the whole
   * region, it keeps the top of it — in a photo of people, that is the faces. */
  function refocus(img, roi) {
    const sw = img.naturalWidth, sh = img.naturalHeight;
    const W = img.offsetWidth, H = img.offsetHeight;
    if (!sw || !W) return;
    const rx = roi[0] * sw, ry = roi[1] * sh;
    const rw = roi[2] * sw - rx, rh = roi[3] * sh - ry;
    const ar = W / H;
    // smallest window of the box's shape that still holds the whole region
    let cw = Math.max(rw, rh * ar), ch = cw / ar;
    if (cw > sw) { cw = sw; ch = cw / ar; }
    if (ch > sh) { ch = sh; cw = ch * ar; }
    let left = rx + rw / 2 - cw / 2;
    let top = ch < rh ? ry : ry + rh / 2 - ch / 2;
    left = Math.max(0, Math.min(left, sw - cw));
    top = Math.max(0, Math.min(top, sh - ch));
    // object-position is a fraction of the slack, which is what makes this the
    // window's own offset divided by how far it is free to travel
    const px = sw - cw > .5 ? left / (sw - cw) : .5;
    const py = sh - ch > .5 ? top / (sh - ch) : .5;
    const at = (px * 100).toFixed(2) + '% ' + (py * 100).toFixed(2) + '%';
    img.style.objectPosition = at;
    img.style.transformOrigin = at;
    img.style.transform = 'scale(' + (W / Math.max(W / sw, H / sh) / cw).toFixed(3) + ')';
  }

  function renderArtSlide(cfg) {
    const P = w[cfg.from] || {};
    const wrap = el('.wr-poster-wrap');
    const poster = el('.wr-poster.' + cfg.art);
    wrap.appendChild(poster);

    const held = [];   // [img, focus] pairs to keep framed as the box reshapes
    cfg.slots.forEach(([key, slot, focus]) => {
      if (!P[key]) return;
      const img = el('img', { src: P[key], alt: '' });
      poster.appendChild(cfg.mood
        ? el('.wp-mood.' + slot, {}, img)
        : el('.wp-ph.' + slot, {}, el('.shot', {}, img)));
      if (focus) held.push([img, focus]);
    });

    // the tape and stickers are printed into the artwork, so a photo dropped
    // into a polaroid buries them; this lays the same artwork back over the
    // top, masked to those shapes, which puts the photo under them again
    if (cfg.over) poster.appendChild(el('.wp-over'));

    poster.appendChild(el('button.wp-back', {
      text: '‹  Back',
      onclick: () => { idx--; BdayAudio.pop(); renderCard(); },
    }));
    // the deck now ends on an artwork, so that slide's button is the Done one
    const last = idx === cards.length - 1;
    poster.appendChild(el('button.wp-next.' + cfg.art, {
      text: last ? 'Done  ✨' : 'Next  ›',
      onclick: last ? finish : () => { idx++; BdayAudio.pop(); renderCard(); },
    }));

    stageWrap.appendChild(wrap);
    if (cfg.ar || held.length) {
      const fix = () => {
        if (cfg.ar) unstretchTilts(poster, cfg.ar);
        held.forEach(([img, focus]) => refocus(img, focus));
      };
      fix();
      // a photo still decoding has no size to measure yet, so frame it on arrival
      held.forEach(([img]) => { if (!img.complete) img.addEventListener('load', fix); });
      window.addEventListener('resize', fix);
      // the stage is emptied on every slide change, so drop the listener with it
      new MutationObserver((_, o) => {
        if (!poster.isConnected) { window.removeEventListener('resize', fix); o.disconnect(); }
      }).observe(stageWrap, { childList: true });
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }


  function buildScraps() {
    const P = w.photos || {};
    const s = el('.bw-scraps');
    const doodle = (kind, slot, arg) =>
      el('span.bw-doodle.bw-float.' + slot, { html: BW_DOODLE[kind](arg) });
    function photo(src, slot, rot, tape) {
      if (!src) return null;
      const f = el('.bw-photo.' + slot, { style: '--rot:' + rot });
      f.appendChild(el('img', { src: src, alt: '', loading: 'lazy' }));
      f.appendChild(el('.bw-tape', { style: tape }));
      return f;
    }
    // ruled torn paper, as in the reference — not a plain card
    function note(lines, slot) {
      const n = el('.bw-note.bw-note--tornb', {},
        (lines || []).map(t => el('div', { text: t })));
      return el('.bw-note-wrap.' + slot, {}, n);
    }

    const a = photo(P.right, 'sl-wr-photo1', '3deg', 'top:-12px;right:-16px;transform:rotate(20deg)');
    if (a) s.appendChild(a);
    const b = photo(P.left, 'sl-wr-photo2', '-4deg', 'top:-12px;left:-18px;transform:rotate(-24deg)');
    if (b) s.appendChild(b);
    if (w.note1) s.appendChild(note(w.note1, 'sl-wr-note1'));
    if (w.note2) s.appendChild(note(w.note2, 'sl-wr-note2'));

    s.appendChild(doodle('teddy', 'sl-wr-teddy'));
    s.appendChild(doodle('sprig', 'sl-wr-sprig1'));
    s.appendChild(doodle('sprig', 'sl-wr-sprig2'));
    // filled sage hearts get a white keyline, like the reference's stickers
    s.appendChild(el('span.bw-doodle.bw-float.sl-wr-heart1', { html: BW_DOODLE.heart('#8FAB77', '#FBF9F1') }));
    s.appendChild(el('span.bw-doodle.bw-float.sl-wr-heart2', { html: BW_DOODLE.heart('#8FAB77', '#FBF9F1') }));
    s.appendChild(doodle('heart', 'sl-wr-heart3', 'none'));
    s.appendChild(doodle('star', 'sl-wr-star1', 'none'));
    s.appendChild(doodle('star', 'sl-wr-star2', 'none'));
    s.appendChild(doodle('sparkle', 'sl-wr-spark1'));
    s.appendChild(doodle('sparkle', 'sl-wr-spark2'));
    return s;
  }

  function card(cls, children) {
    return el('.wr-card.' + cls, {}, children);
  }
  function listCard(title, emoji, items) {
    return card('w-list', [
      el('h2', { text: title }),
      el('.wr-list-emoji', { text: emoji }),
      el('ol.wr-list', {}, (items || []).map(t => el('li', { text: t }))),
    ]);
  }
  function genreCard() {
    const total = w.genre.reduce((s, g) => s + g.pct, 0) || 100;
    let acc = 0;
    // light tints — the pie sits on the dark brass w-genre card
    const colors = ['#9FD98A', '#7FC4D8', '#F0C44E', '#F2A9BC', '#C0A3D6'];
    const stops = w.genre.map((g, i) => {
      const from = (acc / total) * 100; acc += g.pct;
      const to = (acc / total) * 100;
      return `${colors[i % colors.length]} ${from}% ${to}%`;
    }).join(', ');
    const pie = el('.wr-pie', { style: `background: conic-gradient(${stops})` });
    const legend = el('.wr-legend', {}, w.genre.map((g, i) =>
      el('.wr-leg-item', {}, [
        el('.wr-leg-dot', { style: `background:${colors[i % colors.length]}` }),
        el('span', { text: `${g.label} · ${g.pct}%` }),
      ])
    ));
    return card('w-genre', [el('h2', { text: 'Genre Wrapped' }), pie, legend]);
  }
  function blendCard() {
    const b = w.blend;
    return card('w-blend', [
      el('h2', { text: 'Our Blend' }),
      el('.wr-blend-imgs', { html: '<span>🧑</span><div class="wr-blend-score">' + b.score + '</div><span>👩</span>' }),
      el('p.wr-sub', { text: 'Compatibility Score' }),
      el('h3', { text: 'Shared Interests', style: 'color:var(--on-dark-ok);margin-top:10px' }),
      el('ul.wr-blend-list', {}, b.shared.map(t => el('li', { text: t }))),
      el('h3', { text: 'Needs Improvement', style: 'color:var(--on-dark-warn);margin-top:10px' }),
      el('ul.wr-blend-list', {}, b.needsWork.map(t => el('li', { text: t }))),
    ]);
  }
});
