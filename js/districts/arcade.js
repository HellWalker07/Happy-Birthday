/* ============================================================================
 *  arcade.js — find hats + spot differences + escape room
 * ========================================================================== */

BdayRouter.register('arcade', function (app) {
  BdayState.markVisited('arcade');
  const a = CONTENT.arcade;
  const screen = el('.district.arcade');
  screen.appendChild(districtHead('Arcade District 🕹️'));

  const wrap = el('.arcade-wrap');
  screen.appendChild(wrap);
  app.appendChild(screen);

  // `diff` (Spot 8 Differences) is parked — see the commented block below.
  const games = { hats: false, escape: false };
  function checkDone() {
    if (games.hats && games.escape && !BdayState.isComplete('arcade')) {
      BdayState.markComplete('arcade');
      UI.confetti();
      UI.toast('Arcade cleared!');
    }
  }

  renderMenu();

  function renderMenu() {
    wrap.innerHTML = '';
    wrap.classList.add('ar-menu');

    const banner = el('.ar-banner', { text: a.pickTitle || 'PICK A GAME' });
    banner.appendChild(el('.ar-banner-tape'));
    wrap.appendChild(banner);
    wrap.appendChild(el('.ar-sub', { text: '✦ ' + (a.pickSub || 'choose your adventure!') + ' ✦' }));

    const cards = el('.ar-cards');
    [
      { id: 'hats',   icon: 'tophat', name: 'Find 6 Hats',  sticker: 'heart', go: gameHats },
      // { id: 'diff', icon: 'magnifier', name: 'Spot 8 Differences', sticker: 'star', go: gameDiff },
      { id: 'escape', icon: 'door',   name: 'Escape Room',  sticker: 'heart', go: gameEscape },
    ].forEach((gm, i) => {
      const card = el('.ar-card' + (games[gm.id] ? '.done' : ''), {
        onclick: () => { BdayAudio.whoosh(); gm.go(); },
      });
      const tile = el('.ar-tile');
      tile.appendChild(el('span', { html: BW_DOODLE[gm.icon]() }));
      card.appendChild(tile);
      card.appendChild(el('.ar-name', { text: gm.name }));
      card.appendChild(el('.ar-rule'));
      card.appendChild(el('.ar-play', { text: games[gm.id] ? 'done ✓' : 'play' }));
      card.appendChild(el('span.ar-card-sticker', { html: BW_DOODLE[gm.sticker]() }));
      card.appendChild(el('span.ar-card-pin', { html: BW_DOODLE.pin() }));
      cards.appendChild(card);
    });
    wrap.appendChild(cards);
    wrap.appendChild(buildMenuScraps());
  }

  function buildMenuScraps() {
    const scraps = el('.bw-scraps');
    const doodle = (kind, slot, arg) =>
      el('span.bw-doodle.bw-float.' + slot, { html: BW_DOODLE[kind](arg) });
    const lines = arr => (arr || []).map(t => el('div', { text: t }));

    if (a.warnNote) {
      const n = el('.bw-note.bw-note--tornb', {}, lines(a.warnNote));
      const w = el('.bw-note-wrap.sl-ar-warn', {}, n);
      w.appendChild(el('span.bw-clip', { html: BW_DOODLE.clip(), style: 'top:-16px;left:12px;transform:rotate(-8deg)' }));
      scraps.appendChild(w);
    }
    if (a.goodNote) {
      const n = el('.bw-note.bw-note--grid.bw-note--tornb', {}, lines(a.goodNote));
      n.appendChild(el('div', { text: '♡' }));
      scraps.appendChild(el('.bw-note-wrap.sl-ar-good', {}, n));
      scraps.appendChild(doodle('smiley', 'sl-ar-smiley'));
    }
    if (a.fairNote) {
      const n = el('.bw-note.bw-note--plain', {}, lines(a.fairNote));
      scraps.appendChild(el('.bw-note-wrap.sl-ar-fair', {}, n));
    }
    scraps.appendChild(doodle('daisyFace', 'sl-ar-flower'));
    scraps.appendChild(el('span.bw-doodle.bw-float.sl-ar-clip', { html: BW_DOODLE.clip() }));
    scraps.appendChild(doodle('arcadeCab', 'sl-ar-cab'));
    scraps.appendChild(doodle('star', 'sl-ar-star1', '#fff'));
    scraps.appendChild(doodle('star', 'sl-ar-star2', '#fff'));
    scraps.appendChild(doodle('star', 'sl-ar-star3', '#fff'));
    scraps.appendChild(doodle('star', 'sl-ar-star4', '#F6E27E'));
    scraps.appendChild(doodle('heart', 'sl-ar-heart1', '#fff'));
    scraps.appendChild(doodle('sparkle', 'sl-ar-spark1'));
    scraps.appendChild(doodle('sparkle', 'sl-ar-spark2'));
    return scraps;
  }

  /* `hearts` defaults to 1; pass 0 for games that already paid out per-find */
  function award(which, msg, hearts) {
    if (!games[which]) {
      games[which] = true;
      BdayAudio.cha();
      const n = hearts === undefined ? 1 : hearts;
      // capped + persisted, so replaying a game can't mint more hearts
      if (n > 0 && BdayState.claim('arcade:' + which, n)) BdayState.awardHearts(n);
      UI.toast(msg);
      checkDone();
    }
  }

  /* ---------- FIND 6 HATS ---------- */
  function gameHats() {
    wrap.innerHTML = '';
    wrap.classList.remove('ar-menu');
    wrap.appendChild(backRow(renderMenu));
    wrap.appendChild(el('.hat-title', { text: '✧ ' + (a.hatsTitle || 'Find the 6 Birthday Hats') }));
    wrap.appendChild(el('.hat-sub', { text: a.hatsSub || "They're hiding… can you spot them all?" }));
    const counter = el('.hat-count', { text: `0 / ${a.hats.count}` });
    wrap.appendChild(counter);

    const room = el('.hat-room');
    // the room illustration is already busy, so only a few extra decoys
    const clutter = ['🎈', '🎀', '⭐', '🍬', '🎐'];
    for (let i = 0; i < 10; i++) {
      const d = el('.hat-decoy', { text: clutter[(Math.random() * clutter.length) | 0] });
      place(d); room.appendChild(d);
    }
    let found = 0;
    for (let i = 0; i < a.hats.count; i++) {
      const hat = el('span.hat', { html: BW_DOODLE.tophat(true) });   // camouflaged
      place(hat);
      hat.addEventListener('click', (e) => {
        e.stopPropagation();
        if (hat.classList.contains('found')) return;
        hat.classList.add('found');
        BdayAudio.pop();
        found++;
        counter.textContent = `${found} / ${a.hats.count}`;
        // a heart per hat, but only up to `count` ever — replays pay nothing
        if (BdayState.claim('arcade:hats', a.hats.count)) BdayState.awardHearts(1);
        const r = hat.getBoundingClientRect();
        UI.confetti({ count: 16, x: r.left + 10, y: r.top + 10 });
        if (found >= a.hats.count) {
          award('hats', 'All hats found!', 0);   // …and nothing extra for finishing
          setTimeout(renderMenu, 1100);
        }
      });
      room.appendChild(hat);
    }
    wrap.appendChild(room);
    wrap.appendChild(el('.hat-tip', { text: a.hatsTip || 'pro tip: they love to blend in!' }));

    function place(node) {
      node.style.left = (3 + Math.random() * 90) + '%';
      node.style.top = (3 + Math.random() * 90) + '%';
      node.style.transform = `rotate(${Math.random() * 40 - 20}deg) scale(${0.8 + Math.random() * 0.5})`;
    }
  }

  /* ---------- SPOT 8 DIFFERENCES — parked, may come back ----------
   * Removed from the menu for now. To restore: un-comment this whole block,
   * add `diff: false` back to `games`, put `diff` back in checkDone(), and
   * un-comment the menu entry in renderMenu().

  function gameDiff() {
    wrap.innerHTML = '';
    wrap.appendChild(backRow(renderMenu));
    wrap.appendChild(el('p', { text: a.differences.prompt }));
    const counter = el('h2.neon-yellow', { text: '0 / 8' });
    wrap.appendChild(counter);

    // 8 difference hotspots as relative coords (%). Works over your images OR placeholders.
    const spots = [
      { x: 20, y: 25 }, { x: 70, y: 18 }, { x: 40, y: 60 }, { x: 82, y: 55 },
      { x: 15, y: 78 }, { x: 55, y: 35 }, { x: 30, y: 45 }, { x: 65, y: 80 },
    ];
    let found = 0;
    const board = el('.diff-board');
    [a.differences.imgA, a.differences.imgB].forEach((src, side) => {
      const pane = el('.diff-pane');
      if (src) pane.appendChild(el('img', { src: src }));
      else pane.appendChild(el('.ph.diff-ph', { text: side === 0 ? '🖼️ A' : '🖼️ B' }));
      spots.forEach((s, i) => {
        const hs = el('.diff-spot', { style: `left:${s.x}%; top:${s.y}%` });
        hs.dataset.i = i;
        hs.addEventListener('click', () => {
          if (hs.classList.contains('found')) return;
          // mark both panes
          board.querySelectorAll(`.diff-spot[data-i="${i}"]`).forEach(n => n.classList.add('found'));
          BdayAudio.ding();
          found++;
          counter.textContent = `${found} / 8`;
          if (found >= 8) { award('diff', 'Sharp eyes! +1 ❤️'); setTimeout(renderMenu, 900); }
        });
        pane.appendChild(hs);
      });
      board.appendChild(pane);
    });
    wrap.appendChild(board);
    wrap.appendChild(el('p', { text: '(Tip: differences are marked as clickable spots — add your two photos in content.js)', style: 'font-size:.8rem;color:var(--muted)' }));
  }

  * ---------- end of parked block ---------- */

  /* ---------- ESCAPE ROOM ---------- */
  function gameEscape() {
    wrap.innerHTML = '';
    wrap.classList.remove('ar-menu');
    wrap.appendChild(backRow(renderMenu));

    const riddles = a.escape.riddles;
    let solved = 0;

    const head = el('.esc-head');
    const banner = el('.esc-banner');
    banner.appendChild(el('.small', { text: a.escTitleTop || 'Escape the' }));
    banner.appendChild(el('.big', { text: a.escTitleMain || 'BIRTHDAY ROOM' }));
    banner.appendChild(el('.bw-tape', { style: 'top:-12px;left:-24px;transform:rotate(-22deg)' }));
    head.appendChild(banner);
    head.appendChild(el('.esc-solve', { text: '✧ ' + (a.escSolveLine || 'Solve 3 riddles to escape!') + ' ✧' }));
    const counter = el('.esc-count', { text: `Clues: 0 / ${riddles.length}` });
    head.appendChild(counter);
    wrap.appendChild(head);

    /* the three drawer fronts — they mirror the riddles below */
    const drawers = el('.escape-drawers');
    const drawerEls = riddles.map((rd, i) => {
      const drawer = el('.drawer');
      const lock = el('span.esc-lock', { html: BW_DOODLE.padlock(false) });
      drawer.appendChild(lock);
      drawer.appendChild(el('.esc-label', { text: 'Drawer ' + (i + 1) }));
      drawer.appendChild(el('.esc-tape'));
      drawer.appendChild(el('span.esc-sticker', { html: BW_DOODLE[i === 1 ? 'heart' : 'star'](i === 1 ? '#A9C998' : '#F6E27E') }));
      drawers.appendChild(drawer);
      return { drawer, lock };
    });
    wrap.appendChild(drawers);

    wrap.appendChild(el('.esc-hint', { text: a.escHint || 'tap a drawer to read its riddle' }));

    /* each drawer opens its riddle in a pop-up */
    drawerEls.forEach((d, i) => {
      d.drawer.addEventListener('click', () => {
        if (d.drawer.classList.contains('solved')) return;
        BdayAudio.whoosh();
        openRiddle(riddles[i], i);
      });
    });

    function openRiddle(rd, i) {
      const noteWrap = el('.esc-note-wrap.esc-modal');
      const note = el('.esc-note');
      note.appendChild(el('.esc-scroll', {}, el('.esc-q', { text: rd.q })));
      note.appendChild(el('.esc-ask', { text: a.escAsk || 'What is it?' }));

      const row = el('.esc-row');
      const input = el('input.esc-input', { type: 'text', placeholder: 'your answer…' });
      const go = el('button.esc-go', { text: 'Unlock' });
      row.appendChild(input); row.appendChild(go);
      note.appendChild(row);
      const feedback = el('.esc-feedback');
      note.appendChild(feedback);
      noteWrap.appendChild(note);
      // badge + pin sit on the wrapper so the torn clip-path can't crop them
      noteWrap.appendChild(el('.esc-num', { text: String(i + 1) }));
      noteWrap.appendChild(el('span.esc-note-pin', { html: BW_DOODLE.pin() }));

      function attempt() {
        const val = (input.value || '').trim().toLowerCase();
        const ans = rd.a.toLowerCase();
        if (val && (val === ans || val.includes(ans) || ans.includes(val))) {
          BdayAudio.ding();
          input.disabled = true; go.disabled = true;
          feedback.classList.add('ok');
          feedback.textContent = 'Unlocked!';
          drawerEls[i].drawer.classList.add('solved');
          drawerEls[i].lock.innerHTML = BW_DOODLE.padlock(true);
          solved++;
          counter.textContent = `Clues: ${solved} / ${riddles.length}`;
          setTimeout(() => {
            UI.closeModal();
            if (solved >= riddles.length) {
              setTimeout(() => {
                const done = el('.escape-done');
                done.appendChild(el('span', { html: BW_DOODLE.key(), style: 'display:block;width:52px;height:110px;margin:0 auto 10px' }));
                done.appendChild(el('h2', { text: a.escape.solvedText, style: 'color:#4F7C3C' }));
                UI.modal(done, { closeText: 'Yesss' });
                award('escape', 'Escaped!');
                setTimeout(renderMenu, 600);
              }, 350);
            }
          }, 700);
        } else {
          BdayAudio.buzz();
          feedback.classList.remove('ok');
          feedback.textContent = 'Not quite… try again';
          input.classList.add('shake');
          setTimeout(() => input.classList.remove('shake'), 400);
        }
      }
      go.addEventListener('click', attempt);
      input.addEventListener('keydown', e => { if (e.key === 'Enter') attempt(); });

      UI.modal(noteWrap, { closeText: 'Later' });
      setTimeout(() => input.focus(), 120);
    }

    wrap.appendChild(el('.esc-footer', { text: a.escFooter || 'think together, laugh louder, escape faster!' }));
    wrap.appendChild(buildEscapeScraps());
  }

  function buildEscapeScraps() {
    const scraps = el('.bw-scraps');
    const doodle = (kind, slot, arg) =>
      el('span.bw-doodle.bw-float.' + slot, { html: BW_DOODLE[kind](arg) });
    const lines = arr => (arr || []).map(t => el('div', { text: t }));

    if (a.escNote1) {
      const n = el('.bw-note.bw-note--grid.bw-note--tornb', {}, lines(a.escNote1));
      n.appendChild(el('div', { text: '♡' }));
      const w = el('.bw-note-wrap.sl-es-note1', {}, n);
      w.appendChild(el('span.bw-clip', { html: BW_DOODLE.clip(), style: 'top:-16px;right:16px;transform:rotate(8deg)' }));
      scraps.appendChild(w);
    }
    if (a.escNote2) {
      const n = el('.bw-note.bw-note--plain', {}, lines(a.escNote2));
      n.appendChild(el('div', { text: '♡' }));
      const w = el('.bw-note-wrap.sl-es-note2', {}, n);
      w.appendChild(el('.bw-tape', { style: 'top:-12px;left:22px;transform:rotate(-12deg)' }));
      scraps.appendChild(w);
    }
    scraps.appendChild(doodle('key', 'sl-es-key'));
    scraps.appendChild(doodle('padlock', 'sl-es-lock'));
    scraps.appendChild(doodle('cake', 'sl-es-cake'));
    scraps.appendChild(doodle('heart', 'sl-es-heart1', '#A9C998'));
    scraps.appendChild(doodle('heart', 'sl-es-heart2', '#fff'));
    scraps.appendChild(doodle('star', 'sl-es-star1', '#fff'));
    scraps.appendChild(doodle('sparkle', 'sl-es-spark1'));
    scraps.appendChild(doodle('sparkle', 'sl-es-spark2'));
    return scraps;
  }

  function backRow(fn) {
    return el('button.btn.ghost.mini-back', { text: '‹ games', onclick: () => { BdayAudio.whoosh(); fn(); } });
  }
});
