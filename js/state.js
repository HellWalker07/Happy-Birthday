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
