/* ============================================================================
 *  gallery.js — polaroid wall + live photobooth + netflix memories
 * ========================================================================== */

BdayRouter.register('gallery', function (app) {
  BdayState.markVisited('gallery');
  BdayAudio.playTrack(CONTENT.audio && CONTENT.audio.gallery);
  const g = CONTENT.gallery;
  const screen = el('.district.gallery');
  screen.appendChild(districtHead('Memory Lane 📸'));

  /* ---- polaroid wall ---- */
  const stage = el('.gl-stage');
  screen.appendChild(stage);

  stage.appendChild(el('h2.gl-title', { text: g.wallTitle || 'The Wall' }));
  stage.appendChild(el('.gl-tape-note', { text: (g.wallNote || 'Tap a photo to flip it over.') + ' ♡' }));
  const wall = el('.polaroid-wall.gl-wall');
  const mine = el('.polaroid-wall.gl-mine');   // your photobooth shot lives here

  const CAP_MARKS = ['♡', '✧', '☆', '♡'];   // the little glyph after each caption

  function addPolaroid(p, isUser, idx) {
    const card = el('.polaroid');
    card.style.setProperty('--tilt', (Math.random() * 5 - 2.5) + 'deg');
    card.appendChild(el('span.polaroid-pin', { html: BW_DOODLE.pin() }));
    const inner = el('.polaroid-inner');
    // front
    const front = el('.polaroid-face.front');
    front.appendChild(UI.imageOrPlaceholder(p.img, '', 'polaroid-photo'));
    const cap = el('.polaroid-caption', { text: p.caption || '♥' });
    if (!isUser) cap.appendChild(el('span.mark', { text: CAP_MARKS[idx % CAP_MARKS.length] }));
    front.appendChild(cap);
    // back
    const back = el('.polaroid-face.back');
    if (isUser) {
      back.appendChild(el('p', { text: p.what || 'A brand new memory.' }));
    } else {
      // `where` / `fact` are optional — the real polaroids only carry a story
      if (p.where) back.appendChild(el('p', { html: '📍 <b>' + p.where + '</b>' }));
      if (p.what) back.appendChild(el('p', { text: p.what }));
      if (p.fact) back.appendChild(el('p.fact', { text: p.fact }));
    }
    inner.appendChild(front); inner.appendChild(back);
    card.appendChild(inner);
    card.addEventListener('click', () => { BdayAudio.pop(); openLightbox(p, idx, isUser); });
    (isUser ? mine : wall).appendChild(card);
  }

  g.polaroids.forEach((p, i) => addPolaroid(p, false, i));
  stage.appendChild(wall);
  // your own shot gets its own row, under the four stories
  const mineLabel = el('p.gl-mine-label', { text: 'and one of yours' });
  stage.appendChild(mineLabel);
  stage.appendChild(mine);
  BdayState.data.photos.forEach((src) => addPolaroid({ img: src, caption: 'Photobooth', what: 'Look at that face' }, true, 0));
  function syncMine() {
    const has = mine.children.length > 0;
    mineLabel.style.display = has ? '' : 'none';
    mine.style.display = has ? '' : 'none';
  }
  syncMine();

  /* ---- lightbox: the photo pops out over the page, and flips to read ---- */
  function openLightbox(p, idx, isUser) {
    const overlay = el('.pl-lightbox');
    const stageEl = el('.pl-stage');
    const box = el('.pl-box');
    const inner = el('.pl-inner');

    const front = el('.pl-face.front');
    front.appendChild(UI.imageOrPlaceholder(p.img, '', 'pl-photo'));
    front.appendChild(el('.pl-caption', { text: p.caption || '' }));

    const back = el('.pl-face.back');
    back.appendChild(el('h3.pl-back-title', { text: p.caption || '' }));
    back.appendChild(el('p.pl-story', { text: p.what || '' }));

    inner.appendChild(front); inner.appendChild(back);
    box.appendChild(inner);
    stageEl.appendChild(box);

    const flipBtn = el('button.pl-flip');
    const label = el('span', { text: 'Read the story' });
    flipBtn.appendChild(label);
    flipBtn.appendChild(el('span.pl-flip-arrow', { html: BW_DOODLE.flipArrow() }));
    stageEl.appendChild(flipBtn);

    overlay.appendChild(stageEl);
    overlay.appendChild(el('button.pl-close', { text: '×', onclick: close }));
    document.body.appendChild(overlay);

    let flipped = false;
    function flip() {
      flipped = !flipped;
      box.classList.toggle('flipped', flipped);
      flipBtn.classList.toggle('is-back', flipped);
      label.textContent = flipped ? 'Back to the photo' : 'Read the story';
      BdayAudio.pop();
      // reading the story pays a heart, once, keyed by caption
      if (flipped && !isUser && BdayState.markRead('polaroid:' + (p.caption || idx))) {
        BdayState.awardHearts(1);
      }
    }
    function close() { overlay.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }

    box.addEventListener('click', flip);
    flipBtn.addEventListener('click', (e) => { e.stopPropagation(); flip(); });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', onKey);
  }

  /* ---- photobooth ---- */
  const boothWrap = el('.gl-booth');
  boothWrap.appendChild(el('h2.gl-title', { text: g.photoboothTitle + ' ♡' }));
  boothWrap.appendChild(el('.gl-tape-note', { text: g.photoboothNote }));
  const booth = el('.photobooth');
  const btnWrap = el('.gl-booth-btn');
  const boothBtn = el('button.btn.big.sticker', { text: g.boothButton || 'Open camera', onclick: openBooth });
  btnWrap.appendChild(boothBtn);
  btnWrap.appendChild(el('span.gl-booth-daisy', { html: BW_DOODLE.daisy() }));
  booth.appendChild(btnWrap);
  boothWrap.appendChild(booth);
  stage.appendChild(boothWrap);

  /* the booth is a one-shot: once a photo is on the wall, it closes for good */
  function boothDone() {
    booth.innerHTML = '';
    booth.appendChild(el('p.booth-done', { text: 'Your photo is up on the wall.' }));
  }
  if (BdayState.data.photos.length) boothDone();

  stage.appendChild(buildWallScraps());

  function buildWallScraps() {
    const scraps = el('.bw-scraps');
    const doodle = (kind, slot, arg) =>
      el('span.bw-doodle.bw-float.' + slot, { html: BW_DOODLE[kind](arg) });
    const lines = arr => (arr || []).map(t => el('div', { text: t }));

    /* left note — cream, paperclip */
    if (g.wallNoteLeft) {
      const n = el('.bw-note.bw-note--tornb', {}, lines(g.wallNoteLeft));
      n.appendChild(el('div', { text: '♡' }));
      const w = el('.bw-note-wrap.sl-gl-note-l', {}, n);
      w.appendChild(el('span.bw-clip', { html: BW_DOODLE.clip(), style: 'top:-16px;left:10px;transform:rotate(-10deg)' }));
      scraps.appendChild(w);
    }
    /* right note — sage stock, pinned */
    if (g.wallNoteRight) {
      const n = el('.bw-note.bw-note--grid.bw-note--tornb', {}, lines(g.wallNoteRight));
      n.appendChild(el('div', { text: '♡' }));
      const w = el('.bw-note-wrap.sl-gl-note-r', {}, n);
      w.appendChild(el('span.bw-pin', { html: BW_DOODLE.pin(), style: 'top:-20px;right:14px' }));
      scraps.appendChild(w);
    }
    /* pinned polaroid, top-right */
    if (g.wallPhoto) {
      const f = el('.bw-photo.sl-gl-photo-rt', { style: '--rot:3deg' });
      f.appendChild(el('img', { src: g.wallPhoto, alt: '', loading: 'lazy' }));
      f.appendChild(el('.bw-tape', { style: 'top:-12px;right:-16px;transform:rotate(20deg)' }));
      f.appendChild(el('span.bw-doodle', { html: BW_DOODLE.smiley(), style: 'position:absolute;bottom:-14px;right:-12px;width:40px;height:40px;z-index:4' }));
      scraps.appendChild(f);
    }

    scraps.appendChild(doodle('daisyFace', 'sl-gl-daisy'));
    scraps.appendChild(doodle('shootStar', 'sl-gl-shoot'));
    scraps.appendChild(doodle('trail', 'sl-gl-trail'));
    scraps.appendChild(doodle('plane', 'sl-gl-plane'));
    scraps.appendChild(doodle('heart', 'sl-gl-heart1', '#A9C998'));
    scraps.appendChild(doodle('heart', 'sl-gl-heart2', '#C9DFB6'));
    scraps.appendChild(doodle('heart', 'sl-gl-heart3', '#A9C998'));
    scraps.appendChild(doodle('heart', 'sl-gl-heart4', '#fff'));
    scraps.appendChild(doodle('sparkle', 'sl-gl-spark1'));
    scraps.appendChild(doodle('sparkle', 'sl-gl-spark2'));
    return scraps;
  }

  function openBooth() {
    booth.innerHTML = '';
    const frame = el('.booth-frame');
    const video = el('video', { autoplay: '', playsinline: '' });
    video.muted = true;
    frame.appendChild(video);
    const count = el('.booth-count');
    frame.appendChild(count);
    booth.appendChild(frame);
    const canvas = el('canvas', { style: 'display:none' });
    booth.appendChild(canvas);

    // upload fallback
    const upload = el('input', { type: 'file', accept: 'image/*', style: 'display:none' });
    upload.addEventListener('change', (e) => {
      const file = e.target.files[0]; if (!file) return;
      const rd = new FileReader();
      rd.onload = () => savePhoto(rd.result);
      rd.readAsDataURL(file);
    });
    booth.appendChild(upload);

    let stream = null;
    navigator.mediaDevices && navigator.mediaDevices.getUserMedia
      ? navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
          .then(s => {
            stream = s; video.srcObject = s;
            const snap = el('button.btn.big', { text: '3… 2… 1… Snap!', onclick: () => countdown() });
            booth.appendChild(snap);
            function countdown() {
              snap.disabled = true;
              let n = 3;
              count.textContent = n;
              const iv = setInterval(() => {
                n--; BdayAudio.pop();
                if (n > 0) count.textContent = n;
                else {
                  clearInterval(iv); count.textContent = '📸';
                  const w = video.videoWidth || 480, h = video.videoHeight || 360;
                  canvas.width = w; canvas.height = h;
                  const cx = canvas.getContext('2d');
                  cx.translate(w, 0); cx.scale(-1, 1); // mirror
                  cx.drawImage(video, 0, 0, w, h);
                  const url = canvas.toDataURL('image/jpeg', 0.85);
                  if (stream) stream.getTracks().forEach(t => t.stop());
                  savePhoto(url);
                }
              }, 800);
            }
          })
          .catch(() => showUpload())
      : showUpload();

    function showUpload() {
      booth.innerHTML = '';
      booth.appendChild(el('p', { text: 'Camera unavailable — upload a selfie instead:' }));
      const b = el('button.btn.sticker', { text: 'Choose photo', onclick: () => upload.click() });
      booth.appendChild(upload); booth.appendChild(b);
    }

    function savePhoto(url) {
      BdayState.addPhoto(url);
      addPolaroid({ img: url, caption: 'Photobooth', what: 'Look at that face' }, true, 0);
      syncMine();
      mine.scrollIntoView({ behavior: 'smooth', block: 'center' });
      UI.confetti({ count: 60 });
      // no heart for the photo itself — only reading the stories pays out
      if (!BdayState.isComplete('gallery')) BdayState.markComplete('gallery');
      BdayAudio.ding();
      UI.toast('Photo added to the wall!');
      boothDone();   // one shot only
    }
  }

  app.appendChild(screen);
});
