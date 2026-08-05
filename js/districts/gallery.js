/* ============================================================================
 *  gallery.js — polaroid wall + live photobooth + netflix memories
 * ========================================================================== */

BdayRouter.register('gallery', function (app) {
  BdayState.markVisited('gallery');
  const g = CONTENT.gallery;
  const screen = el('.district.gallery');
  screen.appendChild(districtHead('Memory Lane 📸'));

  /* ---- polaroid wall ---- */
  screen.appendChild(el('h2.neon-cyan.sec-title', { text: 'The Wall' }));
  screen.appendChild(el('p', { text: 'Tap a photo to flip it over.' }));
  const wall = el('.polaroid-wall');

  function addPolaroid(p, isUser) {
    const card = el('.polaroid');
    card.style.setProperty('--tilt', (Math.random() * 8 - 4) + 'deg');
    const inner = el('.polaroid-inner');
    // front
    const front = el('.polaroid-face.front');
    front.appendChild(UI.imageOrPlaceholder(p.img, '🖼️', 'polaroid-photo'));
    front.appendChild(el('.polaroid-caption', { text: p.caption || '♥' }));
    // back
    const back = el('.polaroid-face.back');
    if (isUser) {
      back.appendChild(el('p', { text: '📅 ' + (p.where || 'Just now') }));
      back.appendChild(el('p', { text: p.what || 'A brand new memory.' }));
    } else {
      back.appendChild(el('p', { html: '📍 <b>' + (p.where || '') + '</b>' }));
      back.appendChild(el('p', { text: p.what || '' }));
      back.appendChild(el('p.fact', { text: p.fact || '' }));
    }
    inner.appendChild(front); inner.appendChild(back);
    card.appendChild(inner);
    card.addEventListener('click', () => { BdayAudio.pop(); card.classList.toggle('flipped'); });
    wall.appendChild(card);
  }

  g.polaroids.forEach(p => addPolaroid(p, false));
  BdayState.data.photos.forEach((src, i) => addPolaroid({ img: src, caption: 'Photobooth', where: 'Right here', what: 'Look at that face 🥹' }, true));
  screen.appendChild(wall);

  /* ---- photobooth ---- */
  screen.appendChild(el('h2.neon-yellow.sec-title', { text: g.photoboothTitle }));
  screen.appendChild(el('p', { text: g.photoboothNote }));
  const booth = el('.photobooth');
  const boothBtn = el('button.btn', { text: '📷 Open camera', onclick: openBooth });
  booth.appendChild(boothBtn);
  screen.appendChild(booth);

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
      const b = el('button.btn', { text: '⬆️ Choose photo', onclick: () => upload.click() });
      booth.appendChild(upload); booth.appendChild(b);
    }

    function savePhoto(url) {
      BdayState.addPhoto(url);
      addPolaroid({ img: url, caption: 'Photobooth', where: 'Right here', what: 'Look at that face 🥹' }, true);
      wall.scrollIntoView({ behavior: 'smooth' });
      UI.confetti({ count: 60 });
      if (!BdayState.isComplete('gallery')) {
        BdayState.markComplete('gallery');
        BdayAudio.ding();
        BdayState.awardHearts(1);
        UI.toast('Photo added! Memory Lane complete 📸');
      } else {
        BdayAudio.ding();
        UI.toast('Added to the wall!');
      }
      booth.innerHTML = '';
      booth.appendChild(el('button.btn', { text: '📷 Take another', onclick: openBooth }));
    }
  }

  /* ---- netflix memories ---- */
  screen.appendChild(el('h2.sec-title', { text: g.netflixTitle, style: 'color:#e50914' }));
  const row = el('.netflix-row');
  (g.videos || []).forEach(v => {
    const tile = el('.netflix-tile');
    if (v.thumb) tile.appendChild(el('img', { src: v.thumb }));
    else tile.appendChild(el('.ph', { text: '▶️', style: 'height:100%' }));
    tile.appendChild(el('.netflix-label', { text: v.title }));
    tile.addEventListener('click', () => playVideo(v));
    row.appendChild(tile);
  });
  screen.appendChild(row);
  app.appendChild(screen);

  function playVideo(v) {
    const box = el('.video-modal');
    if (v.src) {
      const vid = el('video', { src: v.src, controls: '', autoplay: '', style: 'width:100%;border-radius:12px' });
      box.appendChild(vid);
    } else {
      box.appendChild(el('.ph', { text: '🎬', style: 'height:200px;border-radius:12px' }));
      box.appendChild(el('p', { text: 'Add your video in content.js → gallery.videos', style: 'color:var(--muted)' }));
    }
    box.appendChild(el('h3', { text: v.title }));
    UI.modal(box);
  }
});
