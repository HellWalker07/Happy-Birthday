/* ============================================================================
 *  state.js — hearts, progress, persistence
 * ========================================================================== */

const BdayState = {
  KEY: 'bday_world_v1',

  data: {
    hearts: 0,
    visited: {},        // districtId -> true
    completed: {},      // districtId -> true (fully done, lights up map)
    photos: [],         // photobooth dataURLs
    purchased: [],      // store item names
    read: {},           // id -> true, for things that pay out once (polaroids…)
    paid: {},           // id -> count, caps how many hearts a game can ever pay
    seenIntro: false,   // skip boot+gate if already entered
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (raw) this.data = Object.assign(this.data, JSON.parse(raw));
    } catch (e) { /* ignore */ }
  },

  save() {
    try { localStorage.setItem(this.KEY, JSON.stringify(this.data)); } catch (e) {}
  },

  reset() {
    localStorage.removeItem(this.KEY);
    location.reload();
  },

  /* Marks something as opened. Returns true only the first time, so callers
   * can pay out a heart without it being farmable by re-opening. */
  markRead(id) {
    if (!this.data.read) this.data.read = {};
    if (this.data.read[id]) return false;
    this.data.read[id] = true;
    this.save();
    return true;
  },
  isRead(id) { return !!(this.data.read && this.data.read[id]); },

  /* Claims one payout against a capped, persisted budget. Returns false once
   * `max` have been claimed, so replaying a game can never mint more hearts —
   * including across a page reload, which plain in-memory flags don't survive. */
  claim(id, max) {
    if (!this.data.paid) this.data.paid = {};
    const n = this.data.paid[id] || 0;
    if (n >= max) return false;
    this.data.paid[id] = n + 1;
    this.save();
    return true;
  },

  /* hearts */
  awardHearts(n, silent) {
    this.data.hearts += n;
    this.save();
    UI.updateWallet(true);
    if (!silent) UI.toast(`+${n} ❤️`);
  },
  spendHearts(n) {
    if (this.data.hearts < n) return false;
    this.data.hearts -= n;
    this.save();
    UI.updateWallet(true);
    return true;
  },

  /* progress */
  markVisited(id) { this.data.visited[id] = true; this.save(); },
  markComplete(id) {
    if (this.data.completed[id]) return;
    this.data.completed[id] = true;
    this.save();
  },
  isComplete(id) { return !!this.data.completed[id]; },

  allComplete() {
    return CONTENT.map.districts.every(d => this.data.completed[d.id]);
  },

  /* photobooth */
  addPhoto(dataUrl) { this.data.photos.push(dataUrl); this.save(); },
};
