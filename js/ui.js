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
    const colors = ['#ff4d8d', '#35e0ff', '#ffe14d', '#4dffa6', '#b06bff', '#ff5a5a'];
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
    text: '← Map',
    onclick: () => { BdayAudio.whoosh(); BdayRouter.go('map'); },
  }));
  head.appendChild(el('.title', { text: title }));
  return head;
}
