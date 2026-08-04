/* ============================================================================
 *  map.js — horizontal fairy-light garland map
 * ========================================================================== */

BdayRouter.register('map', function (app) {
  const m = CONTENT.map;
  const screen = el('.screen.map-screen');
  screen.appendChild(el('.map-banner', {}, el('h1.neon-text', { text: m.title })));

  // scroll hint for narrow screens
  const scroller = el('.map-scroller');
  const track = el('.map-track');

  const districts = m.districts;
  const N = districts.length;

  // build SVG wavy garland string
  const W = Math.max(N * 200, 900), H = 300;
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('class', 'map-svg');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  // wavy path through evenly spaced points
  const pad = 90;
  const step = (W - pad * 2) / (N - 1 || 1);
  const pts = districts.map((d, i) => ({
    x: pad + step * i,
    y: H / 2 + (i % 2 === 0 ? -34 : 34),
  }));
  let dPath = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1], p1 = pts[i];
    const cx = (p0.x + p1.x) / 2;
    dPath += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  const wire = document.createElementNS(svgNS, 'path');
  wire.setAttribute('d', dPath);
  wire.setAttribute('class', 'map-wire');
  svg.appendChild(wire);
  track.appendChild(svg);

  // place bulbs (districts) as HTML over the svg
  const bulbLayer = el('.map-bulbs');
  districts.forEach((d, i) => {
    const px = (pts[i].x / W) * 100;
    const py = (pts[i].y / H) * 100;
    const done = BdayState.isComplete(d.id);
    const bulb = el('.map-bulb' + (done ? '.lit' : ''), {
      style: `left:${px}%; top:${py}%`,
      onclick: () => { BdayAudio.whoosh(); BdayRouter.go(d.id); },
    });
    bulb.appendChild(el('.bulb-glow'));
    bulb.appendChild(el('.bulb-body', { text: done ? '✓' : (i + 1) }));
    bulb.appendChild(el('.bulb-label', { text: d.label }));
    bulbLayer.appendChild(bulb);
  });
  track.appendChild(bulbLayer);
  scroller.appendChild(track);
  screen.appendChild(scroller);

  // progress + next
  const total = districts.length;
  const done = districts.filter(d => BdayState.isComplete(d.id)).length;
  const prog = el('.map-progress');
  prog.appendChild(el('span', { text: `${done} / ${total} stops explored` }));
  screen.appendChild(prog);

  const allDone = BdayState.allComplete();
  const next = el('button.btn.big.map-next' + (allDone ? '' : '.locked'), {
    text: allDone ? m.nextButton : '🔒 ' + m.nextLockedText,
    onclick: () => {
      if (BdayState.allComplete()) { BdayAudio.cha(); BdayRouter.go('finale'); }
      else { BdayAudio.buzz(); UI.toast('Explore every stop first!'); }
    },
  });
  if (!allDone) next.disabled = false; // keep clickable to show the toast
  screen.appendChild(next);

  // wallet note under everything (per sketch: hearts, not passport)
  screen.appendChild(el('p.map-wallet-note', { text: m.walletNote }));

  // reset (tiny, corner)
  screen.appendChild(el('button.map-reset', {
    text: 'reset progress',
    onclick: () => { if (confirm('Reset everything and start over?')) BdayState.reset(); },
  }));

  app.appendChild(screen);
  UI.updateWallet();
});
