/* ============================================================================
 *  store.js — merch store with cart + checkout
 * ========================================================================== */

BdayRouter.register('store', function (app) {
  BdayState.markVisited('store');
  // visiting the store counts as complete (browsing is enough; buying is optional)
  if (!BdayState.isComplete('store')) { BdayState.markComplete('store'); }
  const s = CONTENT.store;
  const screen = el('.district.store');
  screen.appendChild(districtHead('Merch Store 🛍️'));

  const cart = [];

  screen.appendChild(el('.store-wallet', {}, [
    el('span.store-wallet-amt', { html: '❤️ <b id="store-hearts">' + BdayState.data.hearts + '</b> Birthday Heart Stamps' }),
    el('p', { text: s.walletNote, style: 'font-size:.85rem' }),
  ]));

  const grid = el('.store-grid');
  s.items.forEach(item => {
    const owned = BdayState.data.purchased.includes(item.name);
    const cardEl = el('.store-item');
    cardEl.appendChild(el('.store-emoji', { text: item.emoji }));
    cardEl.appendChild(el('.store-name', { text: item.name }));
    if (item.desc) cardEl.appendChild(el('.store-desc', { text: item.desc }));
    cardEl.appendChild(el('.store-price', { text: '❤️ ' + item.price }));
    const btn = el('button.btn' + (owned ? '.ghost' : ''), {
      text: owned ? 'Owned ✓' : 'Add to cart',
      onclick: () => {
        if (owned) return;
        if (cart.find(c => c.name === item.name)) { UI.toast('Already in cart'); return; }
        cart.push(item); BdayAudio.pop(); renderCart();
      },
    });
    cardEl.appendChild(btn);
    grid.appendChild(cardEl);
  });
  screen.appendChild(grid);

  const cartBar = el('.cart-bar.hidden');
  screen.appendChild(cartBar);
  app.appendChild(screen);

  function renderCart() {
    cartBar.innerHTML = '';
    if (!cart.length) { cartBar.classList.add('hidden'); return; }
    cartBar.classList.remove('hidden');
    const total = cart.reduce((s, i) => s + i.price, 0);
    cartBar.appendChild(el('.cart-info', { html: `🛒 ${cart.length} item(s) · <b>❤️ ${total}</b>` }));
    cartBar.appendChild(el('button.btn.big', { text: 'Checkout', onclick: () => checkout(total) }));
  }

  function checkout(total) {
    const box = el('.checkout-box');
    box.appendChild(el('h3', { text: s.confirmText }));
    const list = el('ul.checkout-list', {}, cart.map(i => el('li', { text: `${i.emoji} ${i.name} — ❤️${i.price}` })));
    box.appendChild(list);
    box.appendChild(el('p', { html: `Total: <b>❤️ ${total}</b> · You have ❤️ ${BdayState.data.hearts}` }));
    const row = el('.checkout-actions');
    row.appendChild(el('button.btn.big', {
      text: 'YES', onclick: () => {
        if (BdayState.data.hearts < total) { BdayAudio.buzz(); UI.toast('Not enough hearts — go collect more! 🎈'); return; }
        confirmYes(total);
      }
    }));
    row.appendChild(el('button.btn.ghost.big', {
      text: 'NO', onclick: () => {
        UI.closeModal();
        const nb = el('.checkout-box', {}, el('h3.neon-text', { text: s.noText }));
        UI.modal(nb, { closeText: 'Ha, okay' });
        BdayAudio.buzz();
      }
    }));
    box.appendChild(row);
    UI.modal(box, { noClose: true, noBackdropClose: true });
  }

  function confirmYes(total) {
    UI.closeModal();
    // "generating" moment
    const gen = el('.checkout-box.generating');
    gen.appendChild(el('.gen-spinner'));
    gen.appendChild(el('p', { text: s.generatingText }));
    UI.modal(gen, { noClose: true, noBackdropClose: true });
    BdayAudio.cha();
    setTimeout(() => {
      BdayState.spendHearts(total);
      cart.forEach(i => { if (!BdayState.data.purchased.includes(i.name)) BdayState.data.purchased.push(i.name); });
      BdayState.save();
      document.getElementById('store-hearts').textContent = BdayState.data.hearts;
      UI.confetti();
      showReceipt(total);
      cart.length = 0; renderCart();
    }, 1500);
  }

  function showReceipt(total) {
    const lines = cart.slice();
    const box = el('.receipt');
    box.appendChild(el('.receipt-head', { text: '🧾 BIRTHDAY RECEIPT' }));
    box.appendChild(el('.receipt-sub', { text: new Date().toLocaleString() }));
    box.appendChild(el('.receipt-hr'));
    lines.forEach(i => box.appendChild(el('.receipt-line', { html: `<span>${i.emoji} ${i.name}</span><span>❤️${i.price}</span>` })));
    box.appendChild(el('.receipt-hr'));
    box.appendChild(el('.receipt-line', { html: `<span><b>TOTAL</b></span><span><b>❤️${total}</b></span>` }));
    box.appendChild(el('.receipt-hr'));
    box.appendChild(el('p.receipt-foot', { text: 'Redeemable with one (1) real human. No refunds. Only love. 💜' }));
    // when they close the receipt, re-render the store so items show "Owned ✓"
    const layer = document.getElementById('modal-layer');
    UI.modal(box, { closeText: 'Claim later ✨' });
    layer.querySelector('.btn').onclick = () => { UI.closeModal(); BdayRouter.go('store'); };
  }
});
