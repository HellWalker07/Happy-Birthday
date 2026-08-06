/* ============================================================================
 *  ui.js — DOM helpers, wallet, toasts, confetti, modal
 * ========================================================================== */

// tiny element builder:  el('div.cls#id', {attrs}, [children | 'text'])
function el(sel, attrs, children) {
  const parts = sel.split(/(?=[.#])/);
  const tag = parts[0].match(/^[a-z0-9]+/i) ? parts[0].replace(/[.#].*/, '') : 'div';
  const node = document.createElement(tag || 'div');
  parts.forEach(p => {
    if (p[0] === '.') node.classList.add(p.slice(1));
    else if (p[0] === '#') node.id = p.slice(1);
  });
  if (attrs) for (const k in attrs) {
    if (k === 'html') node.innerHTML = attrs[k];
    else if (k === 'text') node.textContent = attrs[k];
    else if (k.startsWith('on') && typeof attrs[k] === 'function') node.addEventListener(k.slice(2), attrs[k]);
    else if (k === 'style') node.setAttribute('style', attrs[k]);
    else node.setAttribute(k, attrs[k]);
  }
  if (children != null) (Array.isArray(children) ? children : [children]).forEach(c => {
    if (c == null) return;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return node;
}

const UI = {
  wallet: null, walletCount: null,

  init() {
    this.wallet = document.getElementById('wallet');
    this.walletCount = document.getElementById('wallet-count');

    document.getElementById('audio-toggle').addEventListener('click', function () {
      const m = BdayAudio.toggleMute();
      this.textContent = m ? '🔇' : '🔊';
    });
    document.getElementById('home-btn').addEventListener('click', () => BdayRouter.go('map'));
  },

  showChrome(show) {
    ['wallet', 'audio-toggle', 'home-btn'].forEach(id => {
      document.getElementById(id).classList.toggle('hidden', !show);
    });
  },

  updateWallet(bump) {
    if (!this.walletCount) return;
    this.walletCount.textContent = BdayState.data.hearts;
    if (bump) {
      this.wallet.classList.remove('bump');
      void this.wallet.offsetWidth;
      this.wallet.classList.add('bump');
    }
  },

  toast(msg) {
    const layer = document.getElementById('toast-layer');
    const t = el('.toast', { text: msg });
    layer.appendChild(t);
    setTimeout(() => t.remove(), 2700);
  },

  modal(contentNode, opts) {
    opts = opts || {};
    const layer = document.getElementById('modal-layer');
    layer.innerHTML = '';
    const card = el('.modal-card');
    card.appendChild(contentNode);
    if (!opts.noClose) {
      card.appendChild(el('button.btn', { text: opts.closeText || 'Close', onclick: () => this.closeModal() }));
    }
    layer.appendChild(card);
    layer.classList.remove('hidden');
    layer.onclick = (e) => { if (e.target === layer && !opts.noBackdropClose) this.closeModal(); };
  },

  closeModal() {
    const layer = document.getElementById('modal-layer');
    layer.classList.add('hidden');
    layer.innerHTML = '';
  },

  // ---- confetti ----
  confetti(opts) {
    opts = opts || {};
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    const DPR = window.devicePixelRatio || 1;
    canvas.width = innerWidth * DPR; canvas.height = innerHeight * DPR;
    ctx.scale(DPR, DPR);
    const colors = ['#B84E6B', '#C08A2E', '#7E9A72', '#6B4A7A', '#7A93A8', '#E0A64A'];
    const N = opts.count || 140;
    const originX = opts.x != null ? opts.x : innerWidth / 2;
    const originY = opts.y != null ? opts.y : innerHeight / 2;
    const parts = [];
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2, sp = 4 + Math.random() * 9;
      parts.push({
        x: originX, y: originY,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 4,
        size: 5 + Math.random() * 7, color: colors[(Math.random() * colors.length) | 0],
        rot: Math.random() * 6, vr: (Math.random() - .5) * .4, life: 1,
      });
    }
    let raf;
    const tick = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      let alive = false;
      parts.forEach(p => {
        p.vy += 0.22; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 0.006;
        if (p.life > 0 && p.y < innerHeight + 40) {
          alive = true;
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });
      if (alive) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, innerWidth, innerHeight);
    };
    cancelAnimationFrame(raf); tick();
  },

  // ---- smooth reveal after a view renders ----
  // cascades the root's children (and common grids) in, and blur-up fades images
  afterRender(root) {
    if (!root) return;
    this.reveal(root.firstElementChild, { skipImages: true });
    root.querySelectorAll('.polaroid-wall, .letter-grid, .store-grid, .arcade-menu, .netflix-row, .escape-drawers, .wr-card')
      .forEach(c => this.reveal(c, { skipImages: true }));
    this.enhanceImages(root);
  },

  // cascade a container's direct children in (reusable for dynamic re-renders)
  reveal(container, opts) {
    if (!container) return;
    opts = opts || {};
    const kids = container.children;
    for (let i = 0; i < kids.length; i++) {
      const k = kids[i];
      if (k.classList.contains('no-reveal')) continue;
      k.classList.remove('reveal-in');
      void k.offsetWidth;                       // restart animation on re-render
      k.style.setProperty('--reveal-d', Math.min(i, 12) * 55 + 'ms');
      k.classList.add('reveal-in');
    }
    if (!opts.skipImages) this.enhanceImages(container);
  },

  // fade + de-blur each image once it has actually loaded
  enhanceImages(root) {
    root.querySelectorAll('img:not([data-fade])').forEach(img => {
      img.setAttribute('data-fade', '1');
      img.classList.add('img-fade');
      const done = () => img.classList.add('loaded');
      if (img.complete && img.naturalWidth > 0) requestAnimationFrame(done);
      else { img.addEventListener('load', done); img.addEventListener('error', done); }
    });
  },

  // shared district header with back-to-map
  // (also exposed as global districtHead below)
  imageOrPlaceholder(src, phEmoji, cls) {
    if (src) return el('img' + (cls ? '.' + cls : ''), { src: src, loading: 'lazy' });
    return el('.ph' + (cls ? '.' + cls : ''), { text: phEmoji || '📷' });
  },
};

// shared district header (sticky, with back-to-map button)
function districtHead(title) {
  const head = el('.district-head');
  head.appendChild(el('button.btn.ghost.back-btn', {
    text: '🗺️ Map',
    onclick: () => { BdayAudio.whoosh(); BdayRouter.go('map'); },
  }));
  head.appendChild(el('.title', { text: title }));
  return head;
}

/* ============================================================================
 *  Scrapbook stickers, shared by every collage page (map, bdaycity, …).
 *  Hand-authored SVG rather than emoji so the outline weight stays identical
 *  to the cards on every OS. Each returns markup for an `html:` attr.
 * ========================================================================== */
const BW_DOODLE = {
  /* `stroke` lets a sticker be drawn in white when it sits on a dark card */
  star: (fill, stroke) => `<svg viewBox="0 0 40 38" width="100%" height="100%"><path d="M20 2 L25.5 14.5 L39 16 L29 25 L31.7 38 L20 31.4 L8.3 38 L11 25 L1 16 L14.5 14.5 Z" fill="${fill || '#F6E27E'}" stroke="${stroke || '#2A3326'}" stroke-width="2.4" stroke-linejoin="round"/></svg>`,
  heart: (fill, stroke) => `<svg viewBox="0 0 36 32" width="100%" height="100%"><path d="M18 30 C4 20 1 12 6 6 C10 1 16 3 18 8 C20 3 26 1 30 6 C35 12 32 20 18 30 Z" fill="${fill || '#F3A8BC'}" stroke="${stroke || '#2A3326'}" stroke-width="2.2" stroke-linejoin="round"/></svg>`,
  smiley: () => `<svg viewBox="0 0 44 44" width="100%" height="100%"><circle cx="22" cy="22" r="19" fill="#FBE79A" stroke="#2A3326" stroke-width="2.6"/><circle cx="15.5" cy="18" r="2.4" fill="#2A3326"/><circle cx="28.5" cy="18" r="2.4" fill="#2A3326"/><path d="M14 27 q8 8 16 0" fill="none" stroke="#2A3326" stroke-width="2.6" stroke-linecap="round"/></svg>`,
  plane: () => `<svg viewBox="0 0 60 40" width="100%" height="100%"><path d="M2 18 L56 3 L38 37 L28 24 Z" fill="#fff" stroke="#2A3326" stroke-width="2.2" stroke-linejoin="round"/><path d="M2 18 L28 24 L56 3" fill="none" stroke="#2A3326" stroke-width="2.2" stroke-linejoin="round"/></svg>`,
  trail: () => `<svg viewBox="0 0 120 60" width="100%" height="100%"><path d="M4 52 C30 57 52 41 62 22 C70 8 92 6 116 12" fill="none" stroke="#2A3326" stroke-width="2" stroke-dasharray="5 6" stroke-linecap="round" opacity=".5"/></svg>`,
  loop: () => `<svg viewBox="0 0 130 60" width="100%" height="100%"><path d="M4 48 C26 56 40 48 46 34 C50 24 42 16 34 20 C26 24 30 38 46 42 C70 48 100 34 126 8" fill="none" stroke="#2A3326" stroke-width="2" stroke-dasharray="5 6" stroke-linecap="round" opacity=".55"/></svg>`,
  cloud: () => `<svg viewBox="0 0 100 62" width="100%" height="100%"><path d="M22 52 Q6 52 6 39 Q6 27 21 27 Q23 10 41 10 Q59 10 63 25 Q82 23 84 38 Q86 52 69 52 Z" fill="#DCE8F2" stroke="#2A3326" stroke-width="2.6" stroke-linejoin="round"/><circle cx="36" cy="35" r="2.3" fill="#2A3326"/><circle cx="56" cy="35" r="2.3" fill="#2A3326"/><path d="M43 41 q3.5 3.5 7 0" fill="none" stroke="#2A3326" stroke-width="2.1" stroke-linecap="round"/><circle cx="28" cy="40" r="3.6" fill="#F3B9C6" opacity=".7"/><circle cx="64" cy="40" r="3.6" fill="#F3B9C6" opacity=".7"/></svg>`,
  daisy: () => `<svg viewBox="0 0 40 40" width="100%" height="100%"><g stroke="#2A3326" stroke-width="2"><circle cx="20" cy="8" r="6.2" fill="#fff"/><circle cx="32" cy="20" r="6.2" fill="#fff"/><circle cx="20" cy="32" r="6.2" fill="#fff"/><circle cx="8" cy="20" r="6.2" fill="#fff"/><circle cx="20" cy="20" r="6" fill="#F6E27E"/></g></svg>`,
  /* `muted` returns the camouflaged version used for the hidden hats — it sits
     in the room illustration's own sage/tan range instead of shouting. */
  tophat: (muted) => {
    const c = muted
      ? { brim: '#9FB08A', crown: '#B0C09B', top: '#BECDA9', band: '#C6B597', line: '#83936F', lw: 2 }
      : { brim: '#414552', crown: '#4C5060', top: '#5C6172', band: '#E58AA6', line: '#2A3326', lw: 2.6 };
    return `<svg viewBox="0 0 92 82" width="100%" height="100%"><ellipse cx="46" cy="66" rx="40" ry="9.5" fill="${c.brim}" stroke="${c.line}" stroke-width="${c.lw}"/><path d="M25 66 V24 h42 V66 z" fill="${c.crown}" stroke="${c.line}" stroke-width="${c.lw}" stroke-linejoin="round"/><ellipse cx="46" cy="24" rx="21" ry="7.5" fill="${c.top}" stroke="${c.line}" stroke-width="${c.lw}"/><rect x="25" y="49" width="42" height="12" fill="${c.band}" stroke="${c.line}" stroke-width="${c.lw - .2}"/></svg>`;
  },
  door: () => `<svg viewBox="0 0 72 98" width="100%" height="100%"><rect x="5" y="5" width="62" height="88" rx="5" fill="#D8B87A" stroke="#2A3326" stroke-width="2.6"/><rect x="12" y="12" width="48" height="74" rx="4" fill="#A9C998" stroke="#2A3326" stroke-width="2.4"/><g fill="#93B980" stroke="#2A3326" stroke-width="2"><rect x="19" y="20" width="14" height="26" rx="2"/><rect x="39" y="20" width="14" height="26" rx="2"/><rect x="19" y="53" width="14" height="26" rx="2"/><rect x="39" y="53" width="14" height="26" rx="2"/></g><circle cx="55" cy="52" r="3.6" fill="#E0B94A" stroke="#2A3326" stroke-width="2"/></svg>`,
  /* line-art stat icons for the Wrapped "by the numbers" slide */
  icCalendar: () => `<svg viewBox="0 0 48 46" width="100%" height="100%" fill="none" stroke="#8AA277" stroke-width="2" stroke-linejoin="round"><rect x="4" y="8" width="40" height="34" rx="4"/><path d="M4 18 h40M14 4 v8M34 4 v8"/><path d="M24 34 c-6-4-8-8-6-11 2-2 5-1 6 2 1-3 4-4 6-2 2 3 0 7-6 11z" stroke-linecap="round"/></svg>`,
  icLaugh: () => `<svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" stroke="#8AA277" stroke-width="2" stroke-linecap="round"><circle cx="24" cy="24" r="19"/><path d="M14 20 q4-4 8 0M26 20 q4-4 8 0"/><path d="M13 28 q11 12 22 0 q-11 4-22 0z" stroke-linejoin="round"/></svg>`,
  icFries: () => `<svg viewBox="0 0 44 48" width="100%" height="100%" fill="none" stroke="#8AA277" stroke-width="2" stroke-linejoin="round"><path d="M9 20 h26 l-3 24 h-20 z"/><path d="M9 26 h26"/><path d="M14 20 V8M20 20 V4M26 20 V7M32 20 V11" stroke-linecap="round"/></svg>`,
  icCakeSm: () => `<svg viewBox="0 0 48 46" width="100%" height="100%" fill="none" stroke="#8AA277" stroke-width="2" stroke-linejoin="round"><path d="M8 26 h32 v14 a3 3 0 0 1-3 3 H11 a3 3 0 0 1-3-3z"/><path d="M8 26 q4 5 8 0 q4 5 8 0 q4 5 8 0 q4 5 8 0"/><path d="M24 26 V14" stroke-linecap="round"/><path d="M24 8 q3 4 0 6 q-3-2 0-6z"/></svg>`,
  icClock: () => `<svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" stroke="#8AA277" stroke-width="2" stroke-linecap="round"><circle cx="24" cy="26" r="16"/><path d="M24 17 v9 l6 4"/><path d="M11 11 l4 4M37 11 l-4 4"/></svg>`,
  icPin: () => `<svg viewBox="0 0 40 48" width="100%" height="100%" fill="none" stroke="#8AA277" stroke-width="2" stroke-linejoin="round"><path d="M20 44 C8 30 4 24 4 18 a16 16 0 0 1 32 0 c0 6-4 12-16 26z" fill="#B9CFA4" stroke="#8AA277"/><circle cx="20" cy="18" r="5" fill="#FCFAF2"/></svg>`,
  icChat: () => `<svg viewBox="0 0 52 44" width="100%" height="100%" fill="none" stroke="#8AA277" stroke-width="2" stroke-linejoin="round"><path d="M4 8 h26 v18 h-14 l-8 6 v-6 h-4 z"/><path d="M22 18 h26 v16 h-4 v6 l-8-6 h-14 z"/></svg>`,
  icHouse: () => `<svg viewBox="0 0 48 46" width="100%" height="100%" fill="none" stroke="#8AA277" stroke-width="2" stroke-linejoin="round"><path d="M6 22 L24 6 L42 22"/><path d="M10 22 v20 h28 V22"/><rect x="20" y="30" width="8" height="12"/><rect x="14" y="26" width="5" height="5"/><rect x="29" y="26" width="5" height="5"/></svg>`,
  sprig: () => `<svg viewBox="0 0 58 76" width="100%" height="100%"><path d="M29 74 C29 52 27 30 22 8" fill="none" stroke="#7C8C6A" stroke-width="2.4" stroke-linecap="round"/><g fill="#B6CCA2" stroke="#6F805E" stroke-width="1.8"><ellipse cx="15" cy="22" rx="9" ry="5.5" transform="rotate(-28 15 22)"/><ellipse cx="38" cy="30" rx="9" ry="5.5" transform="rotate(24 38 30)"/><ellipse cx="17" cy="41" rx="9" ry="5.5" transform="rotate(-22 17 41)"/><ellipse cx="41" cy="50" rx="9" ry="5.5" transform="rotate(20 41 50)"/><ellipse cx="19" cy="60" rx="8" ry="5" transform="rotate(-18 19 60)"/></g></svg>`,
  stamp: () => `<svg viewBox="0 0 72 88" width="100%" height="100%"><path d="M4 4 h64 v80 h-64 z" fill="#E9F0DC" stroke="#7C8C6A" stroke-width="2.2" stroke-dasharray="5 3"/><g stroke="#6F805E" stroke-width="1.8"><circle cx="36" cy="30" r="7" fill="#F6E4A8"/><ellipse cx="24" cy="26" rx="7" ry="4.5" fill="#fff"/><ellipse cx="48" cy="26" rx="7" ry="4.5" fill="#fff"/><ellipse cx="36" cy="18" rx="4.5" ry="7" fill="#fff"/><ellipse cx="36" cy="42" rx="4.5" ry="7" fill="#fff"/></g><path d="M36 48 v18" stroke="#7C8C6A" stroke-width="2.2" stroke-linecap="round"/><text x="36" y="80" font-family="monospace" font-size="12" fill="#5E6E4E" text-anchor="middle" letter-spacing="1.5">LOVE</text></svg>`,
  padlock: (open) => `<svg viewBox="0 0 62 72" width="100%" height="100%"><path d="${open ? 'M19 31 V22 a12 12 0 0 1 24 0' : 'M19 31 V22 a12 12 0 0 1 24 0 V31'}" fill="none" stroke="#93A382" stroke-width="5.2" stroke-linecap="round"/><rect x="10" y="31" width="42" height="35" rx="6" fill="#8FA47C" stroke="#3E4A34" stroke-width="2.6"/><circle cx="31" cy="45" r="4.6" fill="#3E4A34"/><rect x="28.8" y="47" width="4.4" height="10" rx="2" fill="#3E4A34"/></svg>`,
  key: () => `<svg viewBox="0 0 46 98" width="100%" height="100%"><path d="M23 31 C12 31 6 22 10.5 13.5 C14 7 21 8.5 23 15 C25 8.5 32 7 35.5 13.5 C40 22 34 31 23 31 Z" fill="#8FA47C" stroke="#3E4A34" stroke-width="2.6" stroke-linejoin="round"/><rect x="19.6" y="29" width="6.8" height="58" fill="#8FA47C" stroke="#3E4A34" stroke-width="2.4"/><rect x="26" y="64" width="11" height="6.5" fill="#8FA47C" stroke="#3E4A34" stroke-width="2.2"/><rect x="26" y="77" width="15" height="6.5" fill="#8FA47C" stroke="#3E4A34" stroke-width="2.2"/></svg>`,
  joystick: () => `<svg viewBox="0 0 62 62" width="100%" height="100%"><ellipse cx="31" cy="47" rx="20" ry="10" fill="#9C8AD0" stroke="#2A3326" stroke-width="2.6"/><path d="M31 41 V20" stroke="#2A3326" stroke-width="3.4" stroke-linecap="round"/><circle cx="31" cy="14" r="8.5" fill="#E3667F" stroke="#2A3326" stroke-width="2.6"/></svg>`,
  arcadeCab: () => `<svg viewBox="0 0 84 112" width="100%" height="100%"><rect x="8" y="5" width="68" height="102" rx="9" fill="#F5C3D0" stroke="#2A3326" stroke-width="2.6"/><rect x="17" y="15" width="50" height="36" rx="5" fill="#5E7050" stroke="#2A3326" stroke-width="2.4"/><rect x="19" y="62" width="46" height="22" rx="5" fill="#FAD9E1" stroke="#2A3326" stroke-width="2.2"/><g fill="#2A3326"><circle cx="31" cy="73" r="3"/><circle cx="42" cy="73" r="3"/><circle cx="53" cy="73" r="3"/></g><path d="M26 62 v-7" stroke="#2A3326" stroke-width="2.6" stroke-linecap="round"/><circle cx="26" cy="53" r="4.2" fill="#E3667F" stroke="#2A3326" stroke-width="2.2"/></svg>`,
  flipArrow: () => `<svg viewBox="0 0 66 42" width="100%" height="100%"><path d="M5 30 C8 13 24 4 41 9 C50 11.5 56 17 59 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/><path d="M50 20.5 L60.5 24.5 L55.5 34" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 34 C15.5 30 18 27.5 21 26" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" opacity=".5"/></svg>`,
  shootStar: () => `<svg viewBox="0 0 62 44" width="100%" height="100%"><g stroke="#2A3326" stroke-width="2.2" stroke-linecap="round" fill="none"><path d="M22 25 L3 35"/><path d="M25 32 L10 41"/><path d="M20 17 L5 22"/></g><path d="M41 3 L45.6 13.4 L57 14.8 L48.6 22.4 L50.9 34 L41 28.4 L31.1 34 L33.4 22.4 L25 14.8 L36.4 13.4 Z" fill="#fff" stroke="#2A3326" stroke-width="2.2" stroke-linejoin="round"/></svg>`,
  daisyFace: () => `<svg viewBox="0 0 92 92" width="100%" height="100%"><g stroke="#2A3326" stroke-width="2.4"><ellipse cx="46" cy="17" rx="13.5" ry="14.5" fill="#C9DFB6"/><ellipse cx="75" cy="46" rx="14.5" ry="13.5" fill="#C9DFB6"/><ellipse cx="46" cy="75" rx="13.5" ry="14.5" fill="#C9DFB6"/><ellipse cx="17" cy="46" rx="14.5" ry="13.5" fill="#C9DFB6"/><circle cx="46" cy="46" r="16.5" fill="#F6E4A8"/></g><circle cx="40" cy="43" r="2.4" fill="#2A3326"/><circle cx="52" cy="43" r="2.4" fill="#2A3326"/><path d="M40 51 q6 5.5 12 0" fill="none" stroke="#2A3326" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  sparkle: () => `<svg viewBox="0 0 30 30" width="100%" height="100%"><g stroke="#2A3326" stroke-width="2.4" stroke-linecap="round" opacity=".7"><path d="M7 17 L2 22"/><path d="M15 10 L14 3"/><path d="M22 16 L28 13"/></g></svg>`,
  twinkle: (fill) => `<svg viewBox="0 0 40 40" width="100%" height="100%"><path d="M20 2 C22 14 26 18 38 20 C26 22 22 26 20 38 C18 26 14 22 2 20 C14 18 18 14 20 2 Z" fill="${fill || '#FBD84E'}" stroke="#2A3326" stroke-width="2" stroke-linejoin="round"/></svg>`,
  clip: () => `<svg viewBox="0 0 40 90" width="100%" height="100%"><path d="M28 20 v44 a10 10 0 0 1 -20 0 v-48 a7 7 0 0 1 14 0 v44 a4 4 0 0 1 -8 0 v-40" fill="none" stroke="#E3667F" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  pin: () => `<svg viewBox="0 0 40 48" width="100%" height="100%"><path d="M20 46 L20 27" stroke="#2A3326" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="20" cy="17" rx="13" ry="11.5" fill="#8FBF7A" stroke="#2A3326" stroke-width="2.4"/><ellipse cx="15" cy="13" rx="4" ry="2.8" fill="#fff" opacity=".6"/></svg>`,
  cake: () => `<svg viewBox="0 0 80 86" width="100%" height="100%"><path d="M40 4 q5 6 0 11 q-5-5 0-11z" fill="#FFB648" stroke="#2A3326" stroke-width="1.7" stroke-linejoin="round"/><rect x="37.6" y="15" width="4.8" height="10" fill="#F6EFDC" stroke="#2A3326" stroke-width="1.7"/><path d="M22 36 h36 v14 a6 6 0 0 1-6 6 H28 a6 6 0 0 1-6-6z" fill="#F2F6E7" stroke="#2A3326" stroke-width="2.2" stroke-linejoin="round"/><path d="M22 32 h36 v4 q-4.5 7-9 0 q-4.5 7-9 0 q-4.5 7-9 0 q-4.5 7-9 0z" fill="#C6DDB0" stroke="#2A3326" stroke-width="2" stroke-linejoin="round"/><path d="M13 57 h54 v16 a6 6 0 0 1-6 6 H19 a6 6 0 0 1-6-6z" fill="#F2F6E7" stroke="#2A3326" stroke-width="2.2" stroke-linejoin="round"/><path d="M13 53 h54 v4 q-5.4 8-10.8 0 q-5.4 8-10.8 0 q-5.4 8-10.8 0 q-5.4 8-10.8 0 q-5.4 8-10.8 0z" fill="#C6DDB0" stroke="#2A3326" stroke-width="2" stroke-linejoin="round"/><path d="M40 45 l-3 3 3 3 3-3z" fill="#F3A8BC"/></svg>`,
  gift: () => `<svg viewBox="0 0 88 78" width="100%" height="100%"><rect x="11" y="30" width="66" height="42" rx="4" fill="#A9C998" stroke="#2A3326" stroke-width="2.4"/><rect x="11" y="30" width="66" height="11" rx="3" fill="#95B983" stroke="#2A3326" stroke-width="2.4"/><rect x="37" y="30" width="13" height="42" fill="#F6EFDC" stroke="#2A3326" stroke-width="2.2"/><path d="M43.5 30 C35 21 24 21 26.5 29 C28.5 34.5 39 32 43.5 30 Z" fill="#F6EFDC" stroke="#2A3326" stroke-width="2.2" stroke-linejoin="round"/><path d="M43.5 30 C52 21 63 21 60.5 29 C58.5 34.5 48 32 43.5 30 Z" fill="#F6EFDC" stroke="#2A3326" stroke-width="2.2" stroke-linejoin="round"/><circle cx="43.5" cy="30" r="3.6" fill="#F6EFDC" stroke="#2A3326" stroke-width="2"/><path d="M62 54 l15 5 -15 5z" fill="#F6EFDC" stroke="#2A3326" stroke-width="2" stroke-linejoin="round"/></svg>`,
  /* drawn back-to-front so each later shape covers the strokes behind it —
     limb outlines then only show where they actually stick out */
  teddy: () => `<svg viewBox="0 0 84 90" width="100%" height="100%"><g fill="#A9C998" stroke="#2A3326" stroke-width="2.4" stroke-linejoin="round"><ellipse cx="14" cy="58" rx="7.5" ry="11" transform="rotate(-16 14 58)"/><ellipse cx="70" cy="58" rx="7.5" ry="11" transform="rotate(16 70 58)"/><ellipse cx="30" cy="80" rx="9.5" ry="7.5"/><ellipse cx="54" cy="80" rx="9.5" ry="7.5"/><ellipse cx="42" cy="62" rx="20" ry="18"/><circle cx="25" cy="20" r="9"/><circle cx="59" cy="20" r="9"/><ellipse cx="42" cy="31" rx="19.5" ry="17"/></g><circle cx="25" cy="20" r="4.4" fill="#E7BFC8"/><circle cx="59" cy="20" r="4.4" fill="#E7BFC8"/><ellipse cx="42" cy="37" rx="9" ry="6.6" fill="#E4EEDA" stroke="#2A3326" stroke-width="1.8"/><circle cx="34" cy="28" r="2.6" fill="#2A3326"/><circle cx="50" cy="28" r="2.6" fill="#2A3326"/><ellipse cx="42" cy="34.5" rx="3.2" ry="2.3" fill="#2A3326"/><path d="M42 37 v2.5 M38.5 41.5 q3.5 2.6 7 0" fill="none" stroke="#2A3326" stroke-width="1.7" stroke-linecap="round"/><path d="M42 50 l-8 -4.5 v9 z M42 50 l8 -4.5 v9 z" fill="#F3B9C6" stroke="#2A3326" stroke-width="2" stroke-linejoin="round"/><circle cx="42" cy="50" r="2.8" fill="#F3B9C6" stroke="#2A3326" stroke-width="2"/></svg>`,
};
