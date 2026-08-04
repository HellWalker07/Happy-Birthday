/* ============================================================================
 *  audio.js — background music (starts on first tap) + generated SFX
 *  No external sound files required; SFX are synthesised with Web Audio.
 * ========================================================================== */

const BdayAudio = {
  ctx: null,
  bg: null,
  muted: false,
  started: false,

  init() {
    // create bg music element if a file was provided
    const src = CONTENT.audio && CONTENT.audio.bgMusic;
    if (src) {
      this.bg = new Audio(src);
      this.bg.loop = true;
      this.bg.volume = 0.4;
    }
  },

  ensureCtx() {
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { this.ctx = null; }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },

  // call on first user interaction
  start() {
    if (this.started) return;
    this.started = true;
    this.ensureCtx();
    if (this.bg && !this.muted) this.bg.play().catch(() => {});
  },

  toggleMute() {
    this.muted = !this.muted;
    if (this.bg) { if (this.muted) this.bg.pause(); else this.bg.play().catch(() => {}); }
    return this.muted;
  },

  // ---- synthesised SFX ----
  tone(freq, dur, type, vol) {
    if (this.muted) return;
    this.ensureCtx();
    if (!this.ctx) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type || 'sine';
    o.frequency.value = freq;
    g.gain.value = vol == null ? 0.15 : vol;
    o.connect(g); g.connect(this.ctx.destination);
    const t = this.ctx.currentTime;
    g.gain.setValueAtTime(g.gain.value, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (dur || 0.15));
    o.start(t); o.stop(t + (dur || 0.15));
  },

  pop()   { this.tone(420 + Math.random() * 200, 0.12, 'triangle', 0.2); },
  ding()  { this.tone(880, 0.15, 'sine', 0.2); setTimeout(() => this.tone(1320, 0.2, 'sine', 0.15), 90); },
  cha()   { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.tone(f, 0.18, 'square', 0.12), i * 70)); },
  buzz()  { this.tone(120, 0.3, 'sawtooth', 0.18); },
  whoosh(){ this.tone(300, 0.25, 'sine', 0.1); },

  // little goofy birthday tune
  tune() {
    const notes = [523, 523, 587, 523, 698, 659];
    notes.forEach((f, i) => setTimeout(() => this.tone(f, 0.28, 'triangle', 0.18), i * 220));
  },
};
