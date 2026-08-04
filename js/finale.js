/* ============================================================================
 *  finale.js — the letter, music, optional voiceover, final surprise
 * ========================================================================== */

BdayRouter.register('finale', function (app) {
  const f = CONTENT.finale;
  const screen = el('.screen.finale-screen');

  screen.appendChild(el('h1.neon-text', { text: f.title }));

  const paper = el('.finale-paper');
  paper.appendChild(el('.finale-text', { text: f.letter }));
  paper.appendChild(el('.finale-sign', { text: f.signOff }));
  screen.appendChild(paper);

  // optional voiceover
  if (f.voiceover) {
    const vo = el('audio', { src: f.voiceover, controls: '' });
    const wrap = el('.finale-voice');
    wrap.appendChild(el('p', { text: '🎙️ Press play to hear it in my voice' }));
    wrap.appendChild(vo);
    screen.appendChild(wrap);
    vo.play().catch(() => {});
  }

  const surprise = el('.finale-surprise.hidden');
  surprise.appendChild(el('h2.neon-cyan', { text: f.surpriseText }));
  screen.appendChild(surprise);

  const btn = el('button.btn.big', {
    text: '🎉 Reveal', onclick: () => {
      surprise.classList.remove('hidden');
      BdayAudio.tune();
      let bursts = 0;
      const iv = setInterval(() => {
        UI.confetti({ count: 90, x: Math.random() * innerWidth, y: innerHeight * 0.3 });
        if (++bursts >= 5) clearInterval(iv);
      }, 500);
      btn.remove();
    }
  });
  screen.appendChild(btn);

  screen.appendChild(el('button.btn.ghost', { text: '← back to map', onclick: () => BdayRouter.go('map'), style: 'margin-top:8px' }));

  app.appendChild(screen);
  // gentle confetti on arrival
  UI.confetti({ count: 60 });
});
