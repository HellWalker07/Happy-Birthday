/* ============================================================================
 *  gate.js — imposter checkbox gate  +  face scan
 * ========================================================================== */

BdayRouter.register('gate', function (app) {
  const g = CONTENT.gate;
  const screen = el('.screen.gate-screen');
  screen.appendChild(el('h1.neon-cyan', { text: g.title }));
  screen.appendChild(el('p', { text: g.subtitle }));

  const list = el('.gate-list');
  const checks = [];
  g.options.forEach((opt, idx) => {
    const box = el('.gate-check');
    const cb = el('input', { type: 'checkbox', id: 'gc' + idx });
    const label = el('label', { for: 'gc' + idx, text: opt });
    cb.addEventListener('change', () => { BdayAudio.pop(); box.classList.toggle('on', cb.checked); });
    box.appendChild(cb); box.appendChild(label);
    box.addEventListener('click', (e) => { if (e.target !== cb) { cb.checked = !cb.checked; cb.dispatchEvent(new Event('change')); } });
    list.appendChild(box);
    checks.push(cb);
  });
  screen.appendChild(list);

  const verify = el('button.btn.big', {
    text: 'Verify',
    onclick: () => {
      const all = checks.every(c => c.checked);
      if (all) {
        BdayAudio.ding();
        showResult(true);
      } else {
        BdayAudio.buzz();
        showResult(false);
      }
    },
  });
  screen.appendChild(verify);
  app.appendChild(screen);

  function showResult(granted) {
    const box = el('.gate-result' + (granted ? '.granted' : '.denied'));
    if (granted) {
      box.appendChild(el('.gate-big', { text: '✅' }));
      box.appendChild(el('h2.neon-text', { text: g.grantedText }));
      UI.modal(box, { closeText: 'Continue →', noBackdropClose: true });
      document.querySelector('#modal-layer .btn').onclick = () => { UI.closeModal(); BdayRouter.go('facescan'); };
    } else {
      box.appendChild(el('.gate-big', { text: '🚫' }));
      box.appendChild(el('h2', { text: g.deniedTitle, style: 'color:var(--neon-red);text-shadow:0 0 12px var(--neon-red)' }));
      box.appendChild(el('p', { text: g.deniedText }));
      if (g.deniedGif) box.appendChild(el('img', { src: g.deniedGif, alt: '' }));
      else box.appendChild(el('.gate-big', { text: '🤥🤥🤥', style: 'font-size:2.4rem' }));
      UI.modal(box, { closeText: 'Try again', noBackdropClose: true });
    }
  }
});


BdayRouter.register('facescan', function (app) {
  const f = CONTENT.faceScan;
  const screen = el('.screen.facescan-screen');
  screen.appendChild(el('h2.neon-cyan', { text: f.scanningText }));

  const frame = el('.scan-frame');
  const video = el('video', { autoplay: '', playsinline: '', muted: '' });
  video.muted = true;
  const scanline = el('.scan-line');
  const reticle = el('.scan-reticle', { html: '<span></span><span></span><span></span><span></span>' });
  frame.appendChild(video); frame.appendChild(scanline); frame.appendChild(reticle);
  screen.appendChild(frame);

  const status = el('p', { text: 'Requesting camera…' });
  screen.appendChild(status);
  app.appendChild(screen);

  let stream = null;
  function finish(confirmed) {
    if (stream) stream.getTracks().forEach(t => t.stop());
    BdayAudio.ding();
    frame.classList.add('scan-done');
    screen.querySelector('h2').textContent = f.resultText;
    status.innerHTML = '';
    status.appendChild(el('strong.neon-text', { text: f.resultSub }));
    const go = el('button.btn.big', {
      text: 'Enter Birthday World →',
      onclick: () => { BdayState.data.seenIntro = true; BdayState.save(); UI.confetti(); BdayRouter.go('map'); },
    });
    screen.appendChild(go);
  }

  navigator.mediaDevices && navigator.mediaDevices.getUserMedia
    ? navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
        .then(s => {
          stream = s; video.srcObject = s;
          status.textContent = 'Hold still…';
          setTimeout(() => finish(true), 3200);
        })
        .catch(() => {
          frame.classList.add('no-cam');
          video.replaceWith(el('.ph.scan-noface', { text: '🙂' }));
          status.textContent = f.noCamText;
          setTimeout(() => finish(true), 1800);
        })
    : (function () {
        frame.classList.add('no-cam');
        video.replaceWith(el('.ph.scan-noface', { text: '🙂' }));
        status.textContent = f.noCamText;
        setTimeout(() => finish(true), 1800);
      })();
});
