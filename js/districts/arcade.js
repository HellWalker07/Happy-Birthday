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

  const games = { hats: false, diff: false, escape: false };
  function checkDone() {
    if (games.hats && games.diff && games.escape && !BdayState.isComplete('arcade')) {
      BdayState.markComplete('arcade');
      UI.confetti();
      UI.toast('Arcade cleared! 🏆');
    }
  }

  renderMenu();

  function renderMenu() {
    wrap.innerHTML = '';
    wrap.appendChild(el('h2.neon-cyan', { text: 'Pick a game' }));
    const grid = el('.arcade-menu');
    [
      { id: 'hats', label: '🎩 Find 6 Hats', done: games.hats, go: gameHats },
      { id: 'diff', label: '🔍 Spot 8 Differences', done: games.diff, go: gameDiff },
      { id: 'escape', label: '🚪 Escape Room', done: games.escape, go: gameEscape },
    ].forEach(gm => {
      const card = el('.arcade-card' + (gm.done ? '.done' : ''), { onclick: () => { BdayAudio.whoosh(); gm.go(); } });
      card.appendChild(el('.arcade-emoji', { text: gm.label.split(' ')[0] }));
      card.appendChild(el('.arcade-name', { text: gm.label.replace(/^\S+\s/, '') }));
      card.appendChild(el('.arcade-badge', { text: gm.done ? '✓ done' : 'play' }));
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
  }

  function award(which, msg) {
    if (!games[which]) {
      games[which] = true;
      BdayAudio.cha();
      BdayState.awardHearts(1);
      UI.toast(msg);
      checkDone();
    }
  }

  /* ---------- FIND 6 HATS ---------- */
  function gameHats() {
    wrap.innerHTML = '';
    wrap.appendChild(backRow(renderMenu));
    wrap.appendChild(el('p', { text: a.hats.prompt }));
    const counter = el('h2.neon-yellow', { text: `0 / ${a.hats.count}` });
    wrap.appendChild(counter);

    const room = el('.hat-room');
    // clutter emojis as camouflage
    const clutter = ['🪑', '📦', '🎈', '🛋️', '🪴', '📚', '🧸', '🖼️', '☕', '🎸', '🕰️', '🎨', '📺', '🧦', '🪄', '🎁'];
    for (let i = 0; i < 34; i++) {
      const d = el('.hat-decoy', { text: clutter[(Math.random() * clutter.length) | 0] });
      place(d); room.appendChild(d);
    }
    let found = 0;
    for (let i = 0; i < a.hats.count; i++) {
      const hat = el('.hat', { text: '🎩' });
      place(hat);
      hat.addEventListener('click', (e) => {
        e.stopPropagation();
        if (hat.classList.contains('found')) return;
        hat.classList.add('found');
        BdayAudio.pop();
        found++;
        counter.textContent = `${found} / ${a.hats.count}`;
        const r = hat.getBoundingClientRect();
        UI.confetti({ count: 16, x: r.left + 10, y: r.top + 10 });
        if (found >= a.hats.count) {
          award('hats', 'All hats found! +1 ❤️');
          setTimeout(renderMenu, 900);
        }
      });
      room.appendChild(hat);
    }
    wrap.appendChild(room);

    function place(node) {
      node.style.left = (3 + Math.random() * 90) + '%';
      node.style.top = (3 + Math.random() * 90) + '%';
      node.style.transform = `rotate(${Math.random() * 40 - 20}deg) scale(${0.8 + Math.random() * 0.5})`;
    }
  }

  /* ---------- SPOT 8 DIFFERENCES ---------- */
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

  /* ---------- ESCAPE ROOM ---------- */
  function gameEscape() {
    wrap.innerHTML = '';
    wrap.appendChild(backRow(renderMenu));
    wrap.appendChild(el('p', { text: a.escape.prompt }));
    const riddles = a.escape.riddles;
    let solved = 0;
    const counter = el('h2.neon-yellow', { text: `Clues: 0 / ${riddles.length}` });
    wrap.appendChild(counter);

    const drawers = el('.escape-drawers');
    riddles.forEach((rd, i) => {
      const drawer = el('.drawer');
      drawer.appendChild(el('.drawer-face', { text: '🗄️ Drawer ' + (i + 1) }));
      drawer.addEventListener('click', () => {
        if (drawer.classList.contains('solved')) return;
        openRiddle(rd, drawer);
      });
      drawers.appendChild(drawer);
    });
    wrap.appendChild(drawers);

    function openRiddle(rd, drawer) {
      const box = el('.riddle-box');
      box.appendChild(el('h3', { text: '🔑 Riddle' }));
      box.appendChild(el('p', { text: rd.q }));
      const input = el('input.riddle-input', { type: 'text', placeholder: 'your answer…' });
      box.appendChild(input);
      const feedback = el('p.riddle-feedback');
      box.appendChild(feedback);
      const submit = el('button.btn', {
        text: 'Unlock', onclick: () => {
          const val = (input.value || '').trim().toLowerCase();
          if (val === rd.a.toLowerCase() || val.includes(rd.a.toLowerCase())) {
            BdayAudio.ding();
            drawer.classList.add('solved');
            drawer.querySelector('.drawer-face').textContent = '✅ Solved';
            solved++;
            counter.textContent = `Clues: ${solved} / ${riddles.length}`;
            UI.closeModal();
            if (solved >= riddles.length) {
              setTimeout(() => {
                const done = el('.escape-done');
                done.appendChild(el('.gate-big', { text: '🎂' }));
                done.appendChild(el('h2.neon-text', { text: a.escape.solvedText }));
                UI.modal(done, { closeText: 'Yesss' });
                award('escape', 'Escaped! +1 ❤️');
                setTimeout(renderMenu, 500);
              }, 300);
            }
          } else {
            BdayAudio.buzz();
            feedback.textContent = 'Not quite… try again 🤔';
            input.classList.add('shake');
            setTimeout(() => input.classList.remove('shake'), 400);
          }
        }
      });
      box.appendChild(submit);
      UI.modal(box, { closeText: 'Later' });
      setTimeout(() => input.focus(), 100);
    }
  }

  function backRow(fn) {
    return el('button.btn.ghost.mini-back', { text: '‹ games', onclick: () => { BdayAudio.whoosh(); fn(); } });
  }
});
