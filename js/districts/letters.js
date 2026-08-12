/* ============================================================================
 *  letters.js — open-when envelopes
 *
 *  Two views, swapped in place: the envelope grid, and a single opened letter
 *  sitting on its envelope. The letter is a full view rather than a modal —
 *  these run to a couple of thousand words each.
 * ========================================================================== */

BdayRouter.register('letters', function (app) {
  BdayState.markVisited('letters');
  BdayAudio.playTrack(CONTENT.audio && CONTENT.audio.letters);
  const c = CONTENT.letters_page || {};
  const letters = CONTENT.letters || [];
  const screen = el('.district.letters');
  screen.appendChild(districtHead('Open-When Letters 💌'));

  const stage = el('.lt-stage');
  screen.appendChild(stage);
  app.appendChild(screen);

  renderGrid();

  function renderGrid() {
    stage.innerHTML = '';
    stage.appendChild(el('.lt-banner', { text: (c.title || 'Open-When Letters') + ' 💌' }));
    stage.appendChild(el('.lt-sub', { text: c.sub || 'Open each one when the moment feels right.' }));

    const grid = el('.letter-grid');
    letters.forEach((L, i) => {
      const read = BdayState.isRead('letter:' + i);
      const env = el('.envelope' + (read ? '.read' : ''));
      env.appendChild(el('.env-flap'));
      env.appendChild(el('.env-body', {}, el('.env-when', { text: L.when })));
      env.appendChild(el('span.env-seal', { html: BW_DOODLE.daisy() }));
      env.appendChild(el('.env-tape'));
      env.addEventListener('click', () => { BdayAudio.whoosh(); openLetter(L, i); });
      grid.appendChild(env);
    });
    stage.appendChild(grid);
    stage.appendChild(buildGridScraps());
  }

  function openLetter(L, i) {
    stage.innerHTML = '';
    stage.appendChild(el('button.lt-back', {
      text: '←  ' + (c.backLabel || 'Back to letters'),
      onclick: () => { BdayAudio.whoosh(); renderGrid(); },
    }));

    const box = el('.lt-open');
    box.appendChild(el('.lt-env-back'));
    const sheet = el('.lt-sheet');
    sheet.appendChild(el('h3', { text: L.when + ' ♡' }));
    sheet.appendChild(el('p', { html: emphasise(L.body) }));
    box.appendChild(sheet);
    box.appendChild(el('.lt-env-front'));
    box.appendChild(el('span.lt-env-seal', { html: BW_DOODLE.daisy() }));
    stage.appendChild(box);
    stage.appendChild(buildOpenScraps());

    BdayState.markRead('letter:' + i);
    // the whole set read once pays a single heart
    const all = letters.every((_, k) => BdayState.isRead('letter:' + k));
    if (all && !BdayState.isComplete('letters')) {
      BdayState.markComplete('letters');
      if (BdayState.claim('letters:all', 1)) BdayState.awardHearts(1);
      UI.toast('All letters read');
    }
  }

  /* The letters are written with **bold** and *italic* markers. Escape the text
   * first, then turn only those markers into tags — nothing else is treated
   * as markup. */
  function emphasise(text) {
    return (text || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  }

  function doodle(kind, slot, arg) {
    return el('span.bw-doodle.bw-float.' + slot, { html: BW_DOODLE[kind](arg) });
  }
  function noteOf(lines, slot, cls) {
    const n = el('.bw-note' + (cls || '') + '.bw-note--tornb', {},
      (lines || []).map(t => el('div', { text: t })));
    return el('.bw-note-wrap.' + slot, {}, n);
  }

  function buildGridScraps() {
    const s = el('.bw-scraps');
    if (c.note) s.appendChild(noteOf(c.note, 'sl-lt-note1', '.bw-note--plain'));
    s.appendChild(doodle('teddy', 'sl-lt-teddy'));
    s.appendChild(doodle('sprig', 'sl-lt-sprig1'));
    s.appendChild(doodle('heart', 'sl-lt-heart1', '#fff'));
    s.appendChild(doodle('heart', 'sl-lt-heart2', '#fff'));
    s.appendChild(doodle('heart', 'sl-lt-heart3', '#A9C998'));
    s.appendChild(doodle('star', 'sl-lt-star1', '#fff'));
    s.appendChild(doodle('sparkle', 'sl-lt-spark1'));
    return s;
  }

  function buildOpenScraps() {
    const s = el('.bw-scraps');
    if (c.openNote) s.appendChild(noteOf(c.openNote, 'sl-lo-note', '.bw-note--plain'));
    s.appendChild(doodle('stamp', 'sl-lo-stamp'));
    s.appendChild(doodle('sprig', 'sl-lo-sprig'));
    s.appendChild(doodle('heart', 'sl-lo-heart', '#A9C998'));
    s.appendChild(doodle('daisy', 'sl-lo-daisy'));
    s.appendChild(el('span.bw-doodle.bw-float.sl-lo-clip', { html: BW_DOODLE.clip() }));
    return s;
  }
});
