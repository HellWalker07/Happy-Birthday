/* ============================================================================
 *  letters.js — open-when envelopes
 * ========================================================================== */

BdayRouter.register('letters', function (app) {
  BdayState.markVisited('letters');
  const letters = CONTENT.letters || [];
  const screen = el('.district.letters');
  screen.appendChild(districtHead('Open-When Letters 💌'));
  screen.appendChild(el('p', { text: 'Open each one when the moment feels right.' }));

  const opened = new Set();
  const grid = el('.letter-grid');

  letters.forEach((L, i) => {
    const env = el('.envelope');
    env.appendChild(el('.env-flap'));
    env.appendChild(el('.env-body', {}, el('.env-when', { text: L.when })));
    env.appendChild(el('.env-seal', { text: '♥' }));
    env.addEventListener('click', () => {
      BdayAudio.whoosh();
      env.classList.add('opening');
      opened.add(i);
      const box = el('.letter-open');
      box.appendChild(el('h3.neon-text', { text: L.when }));
      box.appendChild(el('.letter-paper', {}, el('p', { text: L.body })));
      UI.modal(box, { closeText: 'Close 💜' });
      if (opened.size >= letters.length && !BdayState.isComplete('letters')) {
        BdayState.markComplete('letters');
        BdayState.awardHearts(1);
        UI.toast('All letters read 💌 +1 ❤️');
      }
    });
    grid.appendChild(env);
  });

  screen.appendChild(grid);
  app.appendChild(screen);
});
