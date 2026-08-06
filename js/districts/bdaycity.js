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
    // one heart for blowing the candles out, once ever
    if (BdayState.claim('bdaycity:candles', 1)) BdayState.awardHearts(1);
    setTimeout(renderBanner, 900);
  }

  /* ------- candles out -> "Play a game" (the banner collage) ------- */
  function renderBanner() {
    stage.innerHTML = '';
    stage.classList.add('bc-square');

    const banner = el('.bc-banner');
    banner.appendChild(el('.bc-banner-top', { text: c.cakeBannerTop || 'HAPPY BIRTHDAY' }));
    const sub = el('.bc-banner-sub');
    sub.appendChild(el('span.tick', { text: '≥' }));
    sub.appendChild(el('span', { text: c.cakeBannerSub || 'TO MY LOVE' }));
    sub.appendChild(el('span.tick', { text: '≤' }));
    banner.appendChild(sub);
    banner.appendChild(el('.bw-tape', { style: 'top:-12px;left:-26px;transform:rotate(-26deg)' }));
    banner.appendChild(el('span.bc-banner-heart', { html: BW_DOODLE.heart('#fff') }));
    banner.appendChild(el('span.bc-banner-daisy', { html: BW_DOODLE.daisy() }));
    stage.appendChild(banner);

    const play = el('.bc-play');
    play.appendChild(el('button.btn.big.sticker', {
      text: c.playButton || 'Play a game',
      onclick: () => { stage.classList.remove('bc-square'); renderBalloons(); },
    }));
    play.appendChild(el('span.bc-play-heart', { html: BW_DOODLE.heart() }));
    stage.appendChild(play);

    stage.appendChild(buildBannerScraps());
    prog.cake = true;
    maybeComplete();
  }

  function buildBannerScraps() {
    const P = c.photos || {};
    const scraps = el('.bw-scraps');
    const doodle = (kind, slot, arg) =>
      el('span.bw-doodle.bw-float.' + slot, { html: BW_DOODLE[kind](arg) });
    function photo(cfg, slot, rot, tape) {
      if (!cfg || !cfg.src) return null;
      const f = el('.bw-photo.' + slot, { style: '--rot:' + rot });
      f.appendChild(el('img', { src: cfg.src, alt: '', loading: 'lazy' }));
      f.appendChild(el('.bw-tape', { style: tape }));
      return f;
    }
    const lines = arr => (arr || []).map(t => el('div', { text: t }));

    /* the row of stickers sitting on top of the banner */
    scraps.appendChild(doodle('heart', 'sl-pg-heart-t'));
    scraps.appendChild(doodle('cake', 'sl-pg-cake'));
    scraps.appendChild(doodle('gift', 'sl-pg-gift'));
    scraps.appendChild(doodle('heart', 'sl-pg-heartsm', '#fff'));
    scraps.appendChild(doodle('star', 'sl-pg-star-t', '#fff'));

    /* left: ruled note + smiley + photo */
    const note = el('.bw-note', {}, lines(c.notePlay));
    note.appendChild(el('div', { text: '♥' }));
    const nw = el('.bw-note-wrap.sl-pg-note-l', {}, note);
    nw.appendChild(el('span.bw-clip', { html: BW_DOODLE.clip(), style: 'top:-16px;left:14px;transform:rotate(-8deg)' }));
    scraps.appendChild(nw);
    scraps.appendChild(doodle('star', 'sl-pg-star-l', '#9CC77F'));
    scraps.appendChild(doodle('smiley', 'sl-pg-smiley'));

    const pLB = photo(P.leftBottom, 'sl-pg-photo-lb', '-4deg', 'top:-12px;left:-20px;transform:rotate(-24deg)');
    if (pLB) {
      pLB.appendChild(el('span.bw-doodle', { html: BW_DOODLE.daisy(), style: 'position:absolute;bottom:-12px;right:-10px;width:38px;height:38px;z-index:4' }));
      scraps.appendChild(pLB);
    }
    scraps.appendChild(doodle('heart', 'sl-pg-heart-lb', '#fff'));
    scraps.appendChild(doodle('star', 'sl-pg-star-lb', '#fff'));

    /* right: photo, pink sticky, teddy, grid note */
    const pRT = photo(P.rightTop, 'sl-pg-photo-rt', '4deg', 'top:-12px;right:-18px;transform:rotate(22deg)');
    if (pRT) scraps.appendChild(pRT);
    scraps.appendChild(doodle('heart', 'sl-pg-heart-rt'));
    scraps.appendChild(doodle('star', 'sl-pg-star-rt', '#9CC77F'));

    if (c.stickyPlay) {
      const sticky = el('.bw-sticky.sl-pg-sticky', { text: c.stickyPlay + '\n♥', style: '--rot:2deg' });
      sticky.appendChild(el('span.bw-clip', { html: BW_DOODLE.clip(), style: 'top:-16px;left:16px;transform:rotate(-6deg)' }));
      scraps.appendChild(sticky);
    }
    scraps.appendChild(doodle('star', 'sl-pg-star-rb', '#9CC77F'));
    scraps.appendChild(doodle('teddy', 'sl-pg-teddy'));

    if (c.gridPlay && c.gridPlay.length) {
      const g = el('.bw-note.bw-note--grid.bw-note--tornb', {}, lines(c.gridPlay));
      g.appendChild(el('div', { text: '♥' }));
      const gw = el('.bw-note-wrap.sl-pg-grid', {}, g);
      gw.appendChild(el('.bw-tape', { style: 'top:-12px;left:22px;transform:rotate(-14deg)' }));
      scraps.appendChild(gw);
    }
    scraps.appendChild(doodle('heart', 'sl-pg-heart-br'));

    scraps.appendChild(doodle('star', 'sl-pg-star-b', '#fff'));
    scraps.appendChild(doodle('sparkle', 'sl-pg-sparkle'));
    return scraps;
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
        // Every balloon is worth a heart, capped at the number of balloons so
        // replaying can't mint more. Silent, because the reward pop-up says so
        // — a toast per pop would stack ten deep behind the modal.
        if (BdayState.claim('bdaycity:balloons', pool.length)) BdayState.awardHearts(1, true);
        counter.textContent = `Popped ${popped} / ${pool.length}`;
        setTimeout(() => b.remove(), 200);
        revealReward(reward);
        if (popped >= pool.length) {
          prog.balloons = true;
          maybeComplete();
          setTimeout(() => UI.toast('All popped!'), 400);
        }
      });
      field.appendChild(b);
    });
    counter.textContent = `Popped 0 / ${pool.length}`;
  }

  function revealReward(r) {
    const box = el('.reward-box');
    box.appendChild(el('p', { text: r.text }));
    // exactly one heart per balloon — no reward type pays extra
    // no emoji anywhere in these pop-ups, and no placeholder tile when there
    // is no image yet — an empty grey box just reads as broken
    if (r.img) box.appendChild(el('img.reward-img', { src: r.img, alt: '', loading: 'lazy' }));
    if (r.audio) box.appendChild(el('audio', { src: r.audio, controls: '' }));
    if (r.type === 'evil') box.querySelector('p').style.color = 'var(--rose-deep)';
    box.appendChild(el('.reward-heart', { text: '+1 heart' }));
    UI.modal(box, { closeText: 'Nice' });
    BdayAudio.ding();
  }
});
