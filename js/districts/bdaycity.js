/* ============================================================================
 *  bdaycity.js — blow the candles + balloon pop
 * ========================================================================== */

BdayRouter.register('bdaycity', function (app) {
  BdayState.markVisited('bdaycity');
  const c = CONTENT.bdaycity;
  const screen = el('.district.bdaycity');
  screen.appendChild(districtHead('Bday City 🎂'));

  const stage = el('.city-stage');
  screen.appendChild(stage);
  app.appendChild(screen);

  // sub-progress: need to do cake AND balloons
  const prog = { cake: false, balloons: false };
  function maybeComplete() {
    if (prog.cake && prog.balloons && !BdayState.isComplete('bdaycity')) {
      BdayState.markComplete('bdaycity');
      UI.toast('Bday City complete! 🎉');
    }
  }

  renderIntro();

  /* ---------------- TOWN SQUARE (landing collage) ---------------- */
  function renderIntro() {
    stage.innerHTML = '';
    stage.classList.add('bc-square');

    stage.appendChild(el('h2.bc-title', { text: c.welcomeTitle || 'Welcome to the town square' }));
    stage.appendChild(el('p.bc-sub', { text: (c.welcomeSub || 'The celebration begins here.') + ' 💚' }));

    const cta = el('.bc-cta');
    cta.appendChild(el('button.btn.big.sticker', {
      text: c.startButton,
      onclick: () => { stage.classList.remove('bc-square'); renderCake(); },
    }));
    cta.appendChild(el('span.bc-cta-heart',  { html: BW_DOODLE.heart() }));
    cta.appendChild(el('span.bc-cta-smiley', { html: BW_DOODLE.smiley() }));
    stage.appendChild(cta);

    stage.appendChild(buildSquareScraps());
  }

  function buildSquareScraps() {
    const P = c.photos || {};
    const scraps = el('.bw-scraps');

    const doodle = (kind, slot, arg) =>
      el('span.bw-doodle.bw-float.' + slot, { html: BW_DOODLE[kind](arg) });

    function photo(cfg, slot, rot, tape) {
      if (!cfg || !cfg.src) return null;
      const f = el('.bw-photo.' + slot + (cfg.cutout ? '.is-cutout' : ''), { style: '--rot:' + rot });
      f.appendChild(el('img', { src: cfg.src, alt: '', loading: 'lazy' }));
      if (!cfg.cutout) f.appendChild(el('.bw-tape', { style: tape }));
      return f;
    }
    function lines(arr, mark) {
      return (arr || []).map(t => el('div', {
        html: (mark && t.includes(mark)) ? t.replace(mark, `<span class="hl">${mark}</span>`) : t,
      }));
    }

    /* left: pinned pink notepad + smiley */
    const pink = el('.bw-note.bw-note--pink.bw-note--tornb', {}, lines(c.noteLeft));
    pink.appendChild(el('div', { text: '♥' }));
    const pinkWrap = el('.bw-note-wrap.sl-bc-note-l', {}, pink);
    pinkWrap.appendChild(el('span.bw-pin', { html: BW_DOODLE.pin(), style: 'top:-20px;right:16px' }));
    scraps.appendChild(pinkWrap);
    scraps.appendChild(doodle('smiley', 'sl-bc-smiley'));

    /* left-bottom photo, with a daisy tucked in the corner */
    const pLB = photo(P.leftBottom, 'sl-bc-photo-lb', '-4deg', 'top:-13px;left:-22px;transform:rotate(-26deg)');
    if (pLB) {
      pLB.appendChild(el('span.bw-doodle', { html: BW_DOODLE.daisy(), style: 'position:absolute;bottom:-10px;right:-12px;width:36px;height:36px;z-index:4' }));
      scraps.appendChild(pLB);
    }
    scraps.appendChild(doodle('heart', 'sl-bc-heart-l', '#fff'));
    scraps.appendChild(doodle('sparkle', 'sl-bc-sparkle-l'));

    /* right-top photo + star */
    const pRT = photo(P.rightTop, 'sl-bc-photo-rt', '3deg', 'top:-13px;right:-20px;transform:rotate(24deg)');
    if (pRT) scraps.appendChild(pRT);
    scraps.appendChild(doodle('star', 'sl-bc-star-rt'));

    /* right: the clipped date note */
    if (c.noteRight) {
      const dn = el('.bw-note.bw-note--plain', { text: c.noteRight });
      const dw = el('.bw-note-wrap.sl-bc-note-r', {}, dn);
      dw.appendChild(el('span.bw-clip', { html: BW_DOODLE.clip(), style: 'top:-16px;right:14px;transform:rotate(8deg)' }));
      scraps.appendChild(dw);
    }

    /* right-bottom: grid-paper note + teddy */
    if (c.noteGrid && c.noteGrid.length) {
      const gn = el('.bw-note.bw-note--grid.bw-note--tornb', {}, lines(c.noteGrid, c.noteGridMark));
      const gw = el('.bw-note-wrap.sl-bc-note-rb', {}, gn);
      gw.appendChild(el('span.bw-clip', { html: BW_DOODLE.clip(), style: 'top:-16px;left:12px;transform:rotate(-10deg)' }));
      scraps.appendChild(gw);
    }
    scraps.appendChild(doodle('teddy', 'sl-bc-teddy'));
    scraps.appendChild(doodle('heart', 'sl-bc-heart-r'));

    /* loose scatter across the top and bottom */
    scraps.appendChild(doodle('heart', 'sl-bc-heart-t'));
    scraps.appendChild(doodle('star', 'sl-bc-star-t', '#fff'));
    scraps.appendChild(doodle('loop', 'sl-bc-loop'));
    scraps.appendChild(doodle('plane', 'sl-bc-plane'));
    scraps.appendChild(doodle('star', 'sl-bc-star-tr', '#fff'));
    scraps.appendChild(doodle('twinkle', 'sl-bc-twink-l'));
    scraps.appendChild(doodle('twinkle', 'sl-bc-twink-r'));
    scraps.appendChild(doodle('star', 'sl-bc-star-b', '#fff'));
    scraps.appendChild(doodle('star', 'sl-bc-star-br', '#fff'));

    return scraps;
  }

  /* ---------------- CAKE ---------------- */
  function renderCake() {
    stage.innerHTML = '';
    stage.appendChild(el('p', { text: c.blowPrompt }));

    const cake = el('.cake');
    cake.appendChild(el('.cake-plate'));
    cake.appendChild(el('.cake-layer.l1'));
    cake.appendChild(el('.cake-layer.l2', { text: c.cakeType, style: '' }));
    cake.appendChild(el('.cake-top'));
    const candleRow = el('.candle-row');
    const flames = [];
    for (let i = 0; i < 5; i++) {
      const candle = el('.candle');
      const flame = el('.flame', {
        onclick: function () { blowOut(flame); },
      });
      candle.appendChild(flame);
      candleRow.appendChild(candle);
      flames.push(flame);
    }
    cake.appendChild(candleRow);
    stage.appendChild(cake);

    const meter = el('.blow-meter');
    const fill = el('.blow-meter-fill');
    meter.appendChild(fill);
    stage.appendChild(meter);
    const hint = el('p.blow-hint', { text: 'Listening for your breath… (or tap each flame)' });
    stage.appendChild(hint);

    let lit = flames.length;
    function blowOut(flame) {
      if (flame.classList.contains('out')) return;
      flame.classList.add('out');
      BdayAudio.tone(200, 0.12, 'sine', 0.1);
      lit--;
      if (lit <= 0) cakeDone(cake);
    }

    // mic blow detection
    startMic(fill, () => {
      const next = flames.find(f => !f.classList.contains('out'));
      if (next) blowOut(next);
    }, hint);
  }

  function startMic(fill, onBlow, hint) {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) return;
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      BdayAudio.ensureCtx();
      const ctx = BdayAudio.ctx;
      if (!ctx) return;
      const src = ctx.createMediaStreamSource(stream);
      const an = ctx.createAnalyser();
      an.fftSize = 512;
      src.connect(an);
      const buf = new Uint8Array(an.frequencyBinCount);
      let cooldown = 0;
      (function loop() {
        if (!document.body.contains(fill)) { stream.getTracks().forEach(t => t.stop()); return; }
        an.getByteFrequencyData(buf);
        let sum = 0; for (let i = 0; i < buf.length; i++) sum += buf[i];
        const vol = sum / buf.length;
        fill.style.width = Math.min(100, vol * 2.2) + '%';
        if (vol > 42 && cooldown <= 0) { onBlow(); cooldown = 18; }
        if (cooldown > 0) cooldown--;
        requestAnimationFrame(loop);
      })();
    }).catch(() => {
      if (hint) hint.textContent = 'No mic? Just tap each flame to blow it out! 👆';
    });
  }

  function cakeDone(cake) {
    BdayAudio.tune();
    UI.confetti({ count: 180 });
    cake.classList.add('explode');
    setTimeout(() => {
      stage.innerHTML = '';
      stage.appendChild(el('.sprinkle-burst', { text: '🎂✨🎉' }));
      stage.appendChild(el('h1.neon-text.cake-msg', { text: c.cakeMessage }));
      const btn = el('button.btn.big', { text: 'Play a game 🎈', onclick: renderBalloons });
      stage.appendChild(btn);
      prog.cake = true;
      maybeComplete();
    }, 900);
  }

  /* ---------------- BALLOON POP ---------------- */
  function renderBalloons() {
    stage.innerHTML = '';
    stage.appendChild(el('h2.neon-cyan', { text: c.balloonPrompt }));
    const counter = el('p.balloon-counter');
    stage.appendChild(counter);

    const field = el('.balloon-field');
    stage.appendChild(field);

    const pool = c.balloons.slice();
    // shuffle
    for (let i = pool.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0;[pool[i], pool[j]] = [pool[j], pool[i]]; }
    let popped = 0;
    const colors = ['#B84E6B', '#C08A2E', '#7E9A72', '#6B4A7A', '#7A93A8', '#E0A64A'];

    pool.forEach((reward, i) => {
      const b = el('.balloon');
      const hue = colors[i % colors.length];
      b.style.setProperty('--bcolor', hue);
      b.style.left = (6 + Math.random() * 82) + '%';
      b.style.animationDuration = (7 + Math.random() * 6) + 's';
      b.style.animationDelay = (Math.random() * 5) + 's';
      b.appendChild(el('.balloon-knot'));
      b.addEventListener('click', () => {
        if (b.classList.contains('popped')) return;
        b.classList.add('popped');
        BdayAudio.pop();
        const r = b.getBoundingClientRect();
        UI.confetti({ count: 24, x: r.left + r.width / 2, y: r.top + r.height / 2 });
        popped++;
        counter.textContent = `Popped ${popped} / ${pool.length}`;
        setTimeout(() => b.remove(), 200);
        revealReward(reward);
        if (popped >= pool.length) {
          prog.balloons = true;
          maybeComplete();
          setTimeout(() => UI.toast('All popped! 🎈'), 400);
        }
      });
      field.appendChild(b);
    });
    counter.textContent = `Popped 0 / ${pool.length}`;
  }

  function revealReward(r) {
    if (r.type === 'heart') { BdayState.awardHearts(1); return; }
    const box = el('.reward-box');
    box.appendChild(el('p', { text: r.text }));
    if (r.img) box.appendChild(UI.imageOrPlaceholder(r.img, '📸'));
    if (r.type === 'meme' && !r.img) box.appendChild(el('.ph', { text: '😹', style: 'height:160px;border-radius:12px' }));
    if (r.type === 'pic' && !r.img) box.appendChild(el('.ph', { text: '🥹', style: 'height:160px;border-radius:12px' }));
    if (r.audio) {
      const a = el('audio', { src: r.audio, controls: '' });
      box.appendChild(a);
    } else if (r.type === 'voice') {
      box.appendChild(el('p', { text: '(add a voice note in content.js → balloons)', style: 'font-size:.8rem;color:var(--muted)' }));
    }
    if (r.type === 'evil') box.querySelector('p').style.color = 'var(--rose-deep)';
    UI.modal(box, { closeText: 'Nice 👍' });
    BdayAudio.ding();
  }
});
