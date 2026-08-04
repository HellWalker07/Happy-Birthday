/* ============================================================================
 *  boot.js — authentic terminal boot screen with typewriter effect,
 *  smooth glowing progress bars, timestamped logs, and slower realistic feel.
 * ========================================================================== */

BdayRouter.register('boot', function (app) {
  const c = CONTENT.boot;
  const screen = el('.screen.boot-screen');
  
  // Ensure AudioContext is ready & listen for first user tap to un-mute Web Audio
  BdayAudio.ensureCtx();
  const unlockAudio = () => {
    BdayAudio.start();
    BdayAudio.ensureCtx();
  };
  window.addEventListener('pointerdown', unlockAudio, { once: true });
  window.addEventListener('keydown', unlockAudio, { once: true });

  // Terminal container with header and body
  const term = el('.terminal');
  
  const header = el('.term-header');
  const dots = el('.term-dots');
  dots.appendChild(el('span.dot.red'));
  dots.appendChild(el('span.dot.yellow'));
  dots.appendChild(el('span.dot.green'));
  header.appendChild(dots);
  header.appendChild(el('.term-title', { text: 'bday_kernel_v4.2.0.sh' }));
  term.appendChild(header);

  const termBody = el('.term-body');
  term.appendChild(termBody);
  screen.appendChild(term);
  app.appendChild(screen);

  const startBtn = el('button.btn.big.boot-start.hidden', {
    text: c.startButton,
    onclick: () => {
      BdayAudio.start();
      BdayState.data.seenIntro = false;
      BdayRouter.go('gate');
    },
  });

  // Prepare loading sequence
  const seq = [];
  c.lines.forEach((t, index) => {
    seq.push({
      time: `[0.0${(index + 1) * 14}s]`,
      text: t,
      hasBar: true
    });
  });
  seq.push({ time: '[0.088s]', text: c.errorLine, cls: 'err', isErr: true });
  seq.push({ time: '[0.092s]', text: c.errorSub, cls: 'err', isErr: true });
  seq.push({ time: '[0.105s]', text: c.errorEnd, cls: 'warn' });

  let stepIdx = 0;

  function typeText(element, text, speed = 25, onComplete) {
    let charIdx = 0;
    const cursor = el('span.term-cursor', { text: '█' });
    element.appendChild(cursor);

    function charStep() {
      if (charIdx < text.length) {
        cursor.before(document.createTextNode(text[charIdx]));
        charIdx++;
        if (charIdx % 2 === 0) {
          BdayAudio.tone(650 + Math.random() * 250, 0.035, 'square', 0.12);
        }
        setTimeout(charStep, speed);
      } else {
        cursor.remove();
        if (onComplete) onComplete();
      }
    }
    charStep();
  }

  function runNextStep() {
    if (stepIdx >= seq.length) {
      // Boot complete line
      const readyLine = el('.term-line.ok');
      readyLine.appendChild(el('span.term-time', { text: '[READY]' }));
      readyLine.appendChild(el('span.term-prompt', { text: ' > ' }));
      const textSpan = el('span.term-text');
      readyLine.appendChild(textSpan);
      termBody.appendChild(readyLine);

      typeText(textSpan, 'System initialized. Ready to celebrate! 🎂', 20, () => {
        const cursor = el('span.term-cursor.blink', { text: '█' });
        textSpan.appendChild(cursor);
        BdayAudio.cha();

        // Reveal start button with entrance animation
        startBtn.classList.remove('hidden');
        screen.appendChild(startBtn);
      });
      return;
    }

    const item = seq[stepIdx++];
    const line = el('.term-line' + (item.cls ? '.' + item.cls : ''));
    
    line.appendChild(el('span.term-time', { text: item.time }));
    line.appendChild(el('span.term-prompt', { text: ' > ' }));

    const textSpan = el('span.term-text');
    line.appendChild(textSpan);
    termBody.appendChild(line);

    typeText(textSpan, item.text, 22, () => {
      if (item.hasBar) {
        const barWrap = el('.term-bar-wrap');
        const track = el('.term-bar-track');
        const fill = el('.term-bar-fill');
        const pctSpan = el('span.term-pct', { text: '0%' });
        const statusSpan = el('span.term-status', { text: '[ RUNNING ]' });

        track.appendChild(fill);
        barWrap.appendChild(track);
        barWrap.appendChild(pctSpan);
        barWrap.appendChild(statusSpan);
        line.appendChild(barWrap);

        // Smooth fill over 1000ms - 1400ms
        const duration = 1100 + Math.random() * 300;
        const startTime = performance.now();

        function animateBar(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = Math.pow(progress, 0.85); 
          const currentPct = Math.floor(easedProgress * 100);

          fill.style.width = `${currentPct}%`;
          pctSpan.textContent = `${currentPct}%`;

          if (progress < 1) {
            requestAnimationFrame(animateBar);
          } else {
            statusSpan.textContent = '[ OK ]';
            statusSpan.classList.add('ok');
            BdayAudio.ding();
            setTimeout(runNextStep, 380);
          }
        }

        requestAnimationFrame(animateBar);
      } else if (item.isErr) {
        const statusSpan = el('span.term-status.err', { text: '[ WARN ]' });
        line.appendChild(statusSpan);
        BdayAudio.buzz();
        setTimeout(runNextStep, 600);
      } else {
        const statusSpan = el('span.term-status.ok', { text: '[ BYPASS ]' });
        line.appendChild(statusSpan);
        BdayAudio.pop();
        setTimeout(runNextStep, 500);
      }
    });
  }

  setTimeout(runNextStep, 400);
});

