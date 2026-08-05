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

  // by the numbers
  cards.push(card('w-numbers', [
    el('h2', { text: 'By the numbers' }),
    ...w.numbers.map(n => el('.wr-stat', {}, [
      el('.wr-stat-emoji', { text: n.emoji }),
      el('.wr-stat-val', { text: n.value }),
      el('.wr-stat-label', { text: n.label }),
    ])),
  ]));

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
    const c = cards[idx];
    stageWrap.appendChild(c);

    // progress dots
    const dots = el('.wr-dots');
    cards.forEach((_, i) => dots.appendChild(el('.wr-dot' + (i === idx ? '.on' : ''))));
    stageWrap.appendChild(dots);

    const nav = el('.wr-nav');
    if (idx > 0) nav.appendChild(el('button.btn.ghost', { text: '‹', onclick: () => { idx--; BdayAudio.pop(); renderCard(); } }));
    if (idx < cards.length - 1) nav.appendChild(el('button.btn', { text: 'Next ›', onclick: () => { idx++; BdayAudio.pop(); renderCard(); } }));
    else nav.appendChild(el('button.btn', {
      text: 'Done ✨', onclick: () => {
        if (!BdayState.isComplete('wrapped')) { BdayState.markComplete('wrapped'); BdayState.awardHearts(1); UI.confetti(); UI.toast('Wrapped complete! +1 ❤️'); }
        BdayRouter.go('map');
      }
    }));
    stageWrap.appendChild(nav);

    // smooth cascade of this card's contents each time it changes
    UI.reveal(c);
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
