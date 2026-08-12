/* ============================================================================
 *  router.js — view registration + switching
 * ========================================================================== */

const BdayRouter = {
  views: {},          // id -> render(app)
  current: null,

  register(id, renderFn) { this.views[id] = renderFn; },

  start() {
    BdayAudio.init();
    UI.init();
    UI.updateWallet();
    // if they've already entered, skip straight to the map
    if (BdayState.data.seenIntro) this.go('map');
    else this.go('boot');
  },

  go(id, opts) {
    const app = document.getElementById('app');
    UI.closeModal();
    BdayAudio.stopTrack();   // section music never outlives its section
    app.innerHTML = '';
    app.scrollTop = 0;
    window.scrollTo(0, 0);
    this.current = id;

    // chrome (wallet/home/audio) hidden until they're inside the world
    const inWorld = !['boot', 'gate', 'facescan'].includes(id);
    UI.showChrome(inWorld);
    // hide home button on the map itself
    document.getElementById('home-btn').classList.toggle('hidden', id === 'map' || !inWorld);

    const fn = this.views[id];
    if (fn) fn(app, opts || {});
    else app.appendChild(el('.screen', {}, el('h1', { text: 'Coming soon ✨' })));

    // smooth cascading reveal of text/items + blur-up images
    UI.afterRender(app);
  },
};
