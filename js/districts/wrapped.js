/* ============================================================================
 *  wrapped.js — Spotify-Wrapped-style story cards + Blend
 * ========================================================================== */

BdayRouter.register('wrapped', function (app) {
  BdayState.markVisited('wrapped');
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
    else nav.appendChild(el('button.btn', {
      text: 'Done ✨', onclick: () => {
        if (!BdayState.isComplete('wrapped')) { BdayState.markComplete('wrapped'); BdayState.awardHearts(1); UI.confetti(); UI.toast('Wrapped complete! +1 ❤️'); }
        BdayRouter.go('map');
      }
    }));
    stageWrap.appendChild(nav);
    stageWrap.appendChild(buildScraps());

    // each slide is its own page — land at the top of it, never mid-scroll
    window.scrollTo({ top: 0, behavior: 'auto' });

    // smooth cascade of this card's contents each time it changes
    UI.reveal(c);
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
   *   slots — [content key, slot class] pairs, measured off that artwork
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
    // slide 6's moods are cut-outs, so they take the .wp-mood treatment
    5: { art: 's6', from: 'photos6', mood: true,
         slots: [['hangry', 'm-hangry'], ['plan', 'm-plan'], ['soft', 'm-soft'],
                 ['srs', 'm-srs'], ['child', 'm-child']] },
    // `bare` on the Advika slot so the artwork's caption stays visible
    6: { art: 's7', from: 'photos7',
         slots: [['topRight', 's7tr'], ['artist', 's7adv.bare']] },
  };

  function renderArtSlide(cfg) {
    const P = w[cfg.from] || {};
    const wrap = el('.wr-poster-wrap');
    const poster = el('.wr-poster.' + cfg.art);
    wrap.appendChild(poster);

    cfg.slots.forEach(([key, slot]) => {
      if (!P[key]) return;
      poster.appendChild(cfg.mood
        ? el('.wp-mood.' + slot, {}, el('img', { src: P[key], alt: '' }))
        : el('.wp-ph.' + slot, {}, el('.shot', {}, el('img', { src: P[key], alt: '' }))));
    });

    poster.appendChild(el('button.wp-back', {
      text: '‹  Back',
      onclick: () => { idx--; BdayAudio.pop(); renderCard(); },
    }));
    poster.appendChild(el('button.wp-next.' + cfg.art, {
      text: 'Next  ›',
      onclick: () => { idx++; BdayAudio.pop(); renderCard(); },
    }));

    stageWrap.appendChild(wrap);
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
