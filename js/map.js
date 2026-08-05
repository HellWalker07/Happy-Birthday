/* ============================================================================
 *  map.js — "Birthday World": a scrapbook pinboard.
 *
 *  The title card, ribbon path and progress pill are the spine (normal flow).
 *  Everything else — photos, torn notes, sticky, doodles — lives in .bw-scraps,
 *  which floats them around the spine on desktop and reflows them into a
 *  column on phones.
 * ========================================================================== */

/* BW_DOODLE (the shared sticker library) lives in ui.js — it's used by every
 * collage page now, not just this one. */

/* small heart/star confetti pinned to some stops, echoing the reference art */
const BW_SPARKS = ['heart', '', 'star', 'heart', '', 'heart'];

BdayRouter.register('map', function (app) {
  const m = CONTENT.map;
  const name = ((CONTENT.him && CONTENT.him.name) || '').toUpperCase();
  const screen = el('.screen.map-screen');
  const stage = el('.bw-stage');

  /* ------------------------------- title ------------------------------- */
  const titlewrap = el('.bw-titlewrap');
  const title = el('.bw-title', {}, el('h1', { text: m.title }));
  title.appendChild(el('.bw-tape', { style: 'top:-14px;left:-28px;transform:rotate(-24deg)' }));
  title.appendChild(el('.bw-tape', { style: 'bottom:6px;right:-36px;transform:rotate(-14deg)' }));
  titlewrap.appendChild(el('.bw-crown', { text: '👑' }));
  titlewrap.appendChild(title);
  if (m.tagline) titlewrap.appendChild(el('.bw-tagline', { text: m.tagline + ' 💚' }));
  stage.appendChild(titlewrap);

  /* ----------------------------- the path ------------------------------ */
  const scroller = el('.map-scroller');
  const track = el('.map-track');
  const districts = m.districts;
  const N = districts.length;

  const W = Math.max(N * 200, 960), H = 340;
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('class', 'map-svg');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  /* Pin the track to the viewBox's own pixel size. The bulbs are placed as a
   * percentage of the track, so any letterboxing from `meet` would slide the
   * path out from under them — at 1440 that was a 54px drift. */
  track.style.width = W + 'px';
  track.style.height = H + 'px';

  const pad = 100;
  const step = (W - pad * 2) / (N - 1 || 1);
  const pts = districts.map((d, i) => ({
    x: pad + step * i,
    y: H / 2 + (i % 2 === 0 ? -58 : 58),
  }));
  let dPath = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1], p1 = pts[i];
    const cx = (p0.x + p1.x) / 2;
    dPath += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  // three stacked strokes: dark edge, sage body, dashed centre line
  ['map-wire-base', 'map-wire', 'map-wire-dash'].forEach(cls => {
    const p = document.createElementNS(svgNS, 'path');
    p.setAttribute('d', dPath);
    p.setAttribute('class', cls);
    svg.appendChild(p);
  });
  track.appendChild(svg);

  /* ------------------------------- stops ------------------------------- */
  const bulbLayer = el('.map-bulbs');
  districts.forEach((d, i) => {
    const px = (pts[i].x / W) * 100;
    const py = (pts[i].y / H) * 100;
    const done = BdayState.isComplete(d.id);
    const bulb = el('.map-bulb' + (done ? '.lit' : ''), {
      style: `left:${px}%; top:${py}%`,
      onclick: () => { BdayAudio.whoosh(); BdayRouter.go(d.id); },
    });

    const body = el('.bulb-body', { text: done ? '✓' : (i + 1) });
    const spark = BW_SPARKS[i % BW_SPARKS.length];
    if (spark) body.appendChild(el('span.bulb-spark', { html: BW_DOODLE[spark]() , style: 'width:19px;height:19px' }));
    bulb.appendChild(body);

    const label = el('.bulb-label');
    label.appendChild(el('span', { text: d.label }));
    if (d.icon) label.appendChild(el('span.ic', { text: d.icon }));
    bulb.appendChild(label);

    bulbLayer.appendChild(bulb);
  });
  track.appendChild(bulbLayer);
  scroller.appendChild(track);
  stage.appendChild(scroller);

  /* ---------------------------- progress ------------------------------- */
  const total = districts.length;
  const done = districts.filter(d => BdayState.isComplete(d.id)).length;
  stage.appendChild(el('.map-progress', { text: `${done} / ${total} stops explored` }));

  const allDone = BdayState.allComplete();
  const next = el('button.btn.big.map-next' + (allDone ? '' : '.locked'), {
    text: allDone ? m.nextButton : '🔒 ' + m.nextLockedText,
    onclick: () => {
      if (BdayState.allComplete()) { BdayAudio.cha(); BdayRouter.go('finale'); }
      else { BdayAudio.buzz(); UI.toast('Explore every stop first!'); }
    },
  });
  stage.appendChild(next);
  stage.appendChild(el('p.map-wallet-note', { text: m.walletNote }));

  /* --------------------------- the scrapbook --------------------------- */
  const scraps = el('.bw-scraps');
  const P = m.photos || {};

  /* Positions come from .sl-* slot classes in the stylesheet, never inline —
   * an inline offset outranks any media query, so the collage could never
   * unstick itself on a phone. Only --rot stays inline. */
  function doodle(kind, slot, arg) {
    return el('span.bw-doodle.bw-float.' + slot, { html: BW_DOODLE[kind](arg) });
  }
  function photo(cfg, slot, rot) {
    if (!cfg || !cfg.src) return null;
    const frame = el('.bw-photo.' + slot + (cfg.cutout ? '.is-cutout' : ''), { style: '--rot:' + rot });
    frame.appendChild(el('img', { src: cfg.src, alt: '', loading: 'lazy' }));
    return frame;
  }

  /* top-left: torn welcome note with a paperclip */
  const note = el('.bw-note');
  note.appendChild(el('div', { text: m.welcomeTop || 'Made with Love' }));
  note.appendChild(el('div.nm', { html: `${m.welcomeLead || 'for'} <span class="hl">${name}</span> ♥` }));
  const noteWrap = el('.bw-note-wrap.sl-note-tl', {}, note);
  noteWrap.appendChild(el('span.bw-clip', { html: BW_DOODLE.clip(), style: 'top:-16px;left:6px;transform:rotate(-12deg)' }));
  scraps.appendChild(noteWrap);

  scraps.appendChild(doodle('smiley', 'sl-smiley'));
  scraps.appendChild(doodle('star', 'sl-star1', '#B7DC9B'));
  scraps.appendChild(doodle('trail', 'sl-trail'));
  scraps.appendChild(doodle('plane', 'sl-plane'));

  /* top-right: photo + speech bubble */
  const pTR = photo(P.topRight, 'sl-photo-tr', '4deg');
  if (pTR) {
    pTR.appendChild(el('.bw-tape', { style: 'top:-13px;left:-24px;transform:rotate(-28deg)' }));
    scraps.appendChild(pTR);
    if (m.speechBubble) {
      scraps.appendChild(el('.bw-bubble.sl-bubble', { text: m.speechBubble }));
    }
  }
  scraps.appendChild(doodle('cloud', 'sl-cloud'));
  scraps.appendChild(doodle('star', 'sl-star2', '#C7E3A9'));

  /* bottom-left: photo + the vibes list */
  const pLB = photo(P.leftBottom, 'sl-photo-lb', '-5deg');
  if (pLB) {
    pLB.appendChild(el('.bw-tape', { style: 'top:-12px;right:-22px;transform:rotate(26deg)' }));
    scraps.appendChild(pLB);
  }

  if (m.vibesList && m.vibesList.length) {
    const list = el('ul.bw-list');
    m.vibesList.forEach(line => {
      const mark = m.vibesMark;
      const html = (mark && line.includes(mark))
        ? line.replace(mark, `<span class="hl">${mark}</span>`)
        : line;
      list.appendChild(el('li', { html: html }));
    });
    scraps.appendChild(el('.bw-note-wrap.sl-note-bl', {}, el('.bw-note', {}, list)));
  }
  scraps.appendChild(doodle('star', 'sl-star3'));
  scraps.appendChild(doodle('heart', 'sl-heart1'));

  /* bottom-right: the big photo + sticky note */
  const pRB = photo(P.rightBottom, 'sl-photo-rb', '2deg');
  if (pRB) {
    if (!P.rightBottom.cutout) {
      pRB.appendChild(el('.bw-tape', { style: 'top:-12px;left:-20px;transform:rotate(-22deg)' }));
    }
    pRB.appendChild(el('span.bw-doodle', { html: BW_DOODLE.star('#F6E27E'), style: 'position:absolute;top:-22px;right:-8px;width:30px;height:28px;transform:rotate(18deg);z-index:4' }));
    scraps.appendChild(pRB);
  }

  if (m.stickyNote) {
    const sticky = el('.bw-sticky.sl-sticky', { text: m.stickyNote, style: '--rot:3deg' });
    sticky.appendChild(el('span.bw-doodle', { html: BW_DOODLE.daisy(), style: 'position:absolute;bottom:8px;right:12px;width:26px;height:26px' }));
    scraps.appendChild(sticky);
  }
  scraps.appendChild(doodle('sparkle', 'sl-sparkle'));

  stage.appendChild(scraps);
  screen.appendChild(stage);

  /* reset (tiny, corner) */
  screen.appendChild(el('button.map-reset', {
    text: 'reset progress',
    onclick: () => { if (confirm('Reset everything and start over?')) BdayState.reset(); },
  }));

  app.appendChild(screen);
  UI.updateWallet();
});
