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
  star: (fill) => `<svg viewBox="0 0 40 38" width="100%" height="100%"><path d="M20 2 L25.5 14.5 L39 16 L29 25 L31.7 38 L20 31.4 L8.3 38 L11 25 L1 16 L14.5 14.5 Z" fill="${fill || '#F6E27E'}" stroke="#2A3326" stroke-width="2.4" stroke-linejoin="round"/></svg>`,
  heart: (fill) => `<svg viewBox="0 0 36 32" width="100%" height="100%"><path d="M18 30 C4 20 1 12 6 6 C10 1 16 3 18 8 C20 3 26 1 30 6 C35 12 32 20 18 30 Z" fill="${fill || '#F3A8BC'}" stroke="#2A3326" stroke-width="2.2" stroke-linejoin="round"/></svg>`,
  smiley: () => `<svg viewBox="0 0 44 44" width="100%" height="100%"><circle cx="22" cy="22" r="19" fill="#FBE79A" stroke="#2A3326" stroke-width="2.6"/><circle cx="15.5" cy="18" r="2.4" fill="#2A3326"/><circle cx="28.5" cy="18" r="2.4" fill="#2A3326"/><path d="M14 27 q8 8 16 0" fill="none" stroke="#2A3326" stroke-width="2.6" stroke-linecap="round"/></svg>`,
  plane: () => `<svg viewBox="0 0 60 40" width="100%" height="100%"><path d="M2 18 L56 3 L38 37 L28 24 Z" fill="#fff" stroke="#2A3326" stroke-width="2.2" stroke-linejoin="round"/><path d="M2 18 L28 24 L56 3" fill="none" stroke="#2A3326" stroke-width="2.2" stroke-linejoin="round"/></svg>`,
  trail: () => `<svg viewBox="0 0 120 60" width="100%" height="100%"><path d="M4 52 C30 57 52 41 62 22 C70 8 92 6 116 12" fill="none" stroke="#2A3326" stroke-width="2" stroke-dasharray="5 6" stroke-linecap="round" opacity=".5"/></svg>`,
  loop: () => `<svg viewBox="0 0 130 60" width="100%" height="100%"><path d="M4 48 C26 56 40 48 46 34 C50 24 42 16 34 20 C26 24 30 38 46 42 C70 48 100 34 126 8" fill="none" stroke="#2A3326" stroke-width="2" stroke-dasharray="5 6" stroke-linecap="round" opacity=".55"/></svg>`,
  cloud: () => `<svg viewBox="0 0 100 62" width="100%" height="100%"><path d="M22 52 Q6 52 6 39 Q6 27 21 27 Q23 10 41 10 Q59 10 63 25 Q82 23 84 38 Q86 52 69 52 Z" fill="#DCE8F2" stroke="#2A3326" stroke-width="2.6" stroke-linejoin="round"/><circle cx="36" cy="35" r="2.3" fill="#2A3326"/><circle cx="56" cy="35" r="2.3" fill="#2A3326"/><path d="M43 41 q3.5 3.5 7 0" fill="none" stroke="#2A3326" stroke-width="2.1" stroke-linecap="round"/><circle cx="28" cy="40" r="3.6" fill="#F3B9C6" opacity=".7"/><circle cx="64" cy="40" r="3.6" fill="#F3B9C6" opacity=".7"/></svg>`,
  daisy: () => `<svg viewBox="0 0 40 40" width="100%" height="100%"><g stroke="#2A3326" stroke-width="2"><circle cx="20" cy="8" r="6.2" fill="#fff"/><circle cx="32" cy="20" r="6.2" fill="#fff"/><circle cx="20" cy="32" r="6.2" fill="#fff"/><circle cx="8" cy="20" r="6.2" fill="#fff"/><circle cx="20" cy="20" r="6" fill="#F6E27E"/></g></svg>`,
  sparkle: () => `<svg viewBox="0 0 30 30" width="100%" height="100%"><g stroke="#2A3326" stroke-width="2.4" stroke-linecap="round" opacity=".7"><path d="M7 17 L2 22"/><path d="M15 10 L14 3"/><path d="M22 16 L28 13"/></g></svg>`,
  twinkle: (fill) => `<svg viewBox="0 0 40 40" width="100%" height="100%"><path d="M20 2 C22 14 26 18 38 20 C26 22 22 26 20 38 C18 26 14 22 2 20 C14 18 18 14 20 2 Z" fill="${fill || '#FBD84E'}" stroke="#2A3326" stroke-width="2" stroke-linejoin="round"/></svg>`,
  clip: () => `<svg viewBox="0 0 40 90" width="100%" height="100%"><path d="M28 20 v44 a10 10 0 0 1 -20 0 v-48 a7 7 0 0 1 14 0 v44 a4 4 0 0 1 -8 0 v-40" fill="none" stroke="#E3667F" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  pin: () => `<svg viewBox="0 0 40 48" width="100%" height="100%"><path d="M20 46 L20 27" stroke="#2A3326" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="20" cy="17" rx="13" ry="11.5" fill="#8FBF7A" stroke="#2A3326" stroke-width="2.4"/><ellipse cx="15" cy="13" rx="4" ry="2.8" fill="#fff" opacity=".6"/></svg>`,
  /* drawn back-to-front so each later shape covers the strokes behind it —
     limb outlines then only show where they actually stick out */
  teddy: () => `<svg viewBox="0 0 84 90" width="100%" height="100%"><g fill="#A9C998" stroke="#2A3326" stroke-width="2.4" stroke-linejoin="round"><ellipse cx="14" cy="58" rx="7.5" ry="11" transform="rotate(-16 14 58)"/><ellipse cx="70" cy="58" rx="7.5" ry="11" transform="rotate(16 70 58)"/><ellipse cx="30" cy="80" rx="9.5" ry="7.5"/><ellipse cx="54" cy="80" rx="9.5" ry="7.5"/><ellipse cx="42" cy="62" rx="20" ry="18"/><circle cx="25" cy="20" r="9"/><circle cx="59" cy="20" r="9"/><ellipse cx="42" cy="31" rx="19.5" ry="17"/></g><circle cx="25" cy="20" r="4.4" fill="#E7BFC8"/><circle cx="59" cy="20" r="4.4" fill="#E7BFC8"/><ellipse cx="42" cy="37" rx="9" ry="6.6" fill="#E4EEDA" stroke="#2A3326" stroke-width="1.8"/><circle cx="34" cy="28" r="2.6" fill="#2A3326"/><circle cx="50" cy="28" r="2.6" fill="#2A3326"/><ellipse cx="42" cy="34.5" rx="3.2" ry="2.3" fill="#2A3326"/><path d="M42 37 v2.5 M38.5 41.5 q3.5 2.6 7 0" fill="none" stroke="#2A3326" stroke-width="1.7" stroke-linecap="round"/><path d="M42 50 l-8 -4.5 v9 z M42 50 l8 -4.5 v9 z" fill="#F3B9C6" stroke="#2A3326" stroke-width="2" stroke-linejoin="round"/><circle cx="42" cy="50" r="2.8" fill="#F3B9C6" stroke="#2A3326" stroke-width="2"/></svg>`,
};
