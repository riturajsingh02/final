// Cart Drawer & Checkout Triggers
document.addEventListener('DOMContentLoaded', () => {
  const cartTrigger = document.getElementById('cartTrigger');
  const cartDrawer = document.getElementById('cartDrawer');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const proceedCheckoutBtn = document.getElementById('proceedCheckoutBtn');

  const openCart = () => {
    window.renderCartDrawer();
    cartDrawer?.classList.add('open');
    drawerOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeCart = () => {
    cartDrawer?.classList.remove('open');
    drawerOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  cartTrigger?.addEventListener('click', openCart);
  closeCartBtn?.addEventListener('click', closeCart);

  proceedCheckoutBtn?.addEventListener('click', () => {
    closeCart();
    window.openCheckoutModal && window.openCheckoutModal();
  });
});

window.kmAddToCart = function (productId, btnElem) {
  const numId = Number(productId);
  window.CandlorreState.addToCart(numId, 1);
  window.showToast('Added to your Shopping Bag');
  window.updateHeaderBadges();

  if (btnElem) {
    const origHtml = btnElem.innerHTML;
    btnElem.innerHTML = '<span>✓ Added</span>';
    setTimeout(() => {
      btnElem.innerHTML = origHtml;
    }, 1500);
  }
};

window.renderCartDrawer = function () {
  const container = document.getElementById('cartItemsContainer');
  const subtotalText = document.getElementById('cartSubtotalText');
  const meterBarFill = document.getElementById('meterBarFill');
  const shippingMeterText = document.getElementById('shippingMeterText');

  if (!container) return;

  const items = window.CandlorreState.cart.items || [];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (subtotalText) subtotalText.textContent = window.formatINR(subtotal);

  // Free shipping progress meter (Threshold: ₹999)
  const freeThreshold = 999;
  if (meterBarFill && shippingMeterText) {
    if (subtotal >= freeThreshold) {
      meterBarFill.style.width = '100%';
      meterBarFill.style.background = '#166534';
      shippingMeterText.innerHTML = '✨ <strong>Complimentary Express Shipping Unlocked!</strong>';
    } else {
      const remaining = freeThreshold - subtotal;
      const pct = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
      meterBarFill.style.width = `${pct}%`;
      meterBarFill.style.background = 'var(--gold-primary, #D4AF37)';
      shippingMeterText.textContent = `Add ${window.formatINR(remaining)} more for FREE Express Delivery`;
    }
  }

  if (items.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3.5rem 1rem; color: var(--text-muted);">
        <p style="font-size: 2.2rem; margin-bottom: 0.5rem;">🕯️</p>
        <h4 style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--cabernet); margin-bottom: 0.3rem;">Your Bag is Empty</h4>
        <p style="font-size: 0.85rem;">Discover our micro-batch hand-poured botanical collections.</p>
        <a href="full-catalog.html" class="btn btn-outline dark-outline" style="margin-top: 1.2rem; display: inline-block; font-size: 0.76rem; padding: 0.6rem 1.4rem;">
          Explore Fragrances
        </a>
      </div>
    `;
    const checkoutBtn = document.getElementById('proceedCheckoutBtn');
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  const checkoutBtn = document.getElementById('proceedCheckoutBtn');
  if (checkoutBtn) checkoutBtn.disabled = false;

  container.innerHTML = items.map(item => `
    <div class="cart-drawer-item" style="display: flex; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--border-subtle);">
      <img src="${item.image}" alt="${item.name}" style="width: 68px; height: 68px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-subtle);" onerror="this.src='asset/luxury.jpg'" />
      <div style="flex: 1; min-width: 0;">
        <h4 style="font-family: var(--font-serif); font-size: 0.98rem; margin: 0 0 2px; color: var(--cabernet); text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
          ${item.name}
        </h4>
        ${item.variant ? `<div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px;">Option: ${item.variant}</div>` : ''}
        <div style="font-weight: 600; font-size: 0.88rem; color: var(--cabernet); margin-bottom: 8px;">
          ${window.formatINR(item.price)}
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: inline-flex; align-items: center; border: 1px solid var(--border-subtle); border-radius: 3px; background: #FFF;">
            <button type="button" style="padding: 2px 8px; background: none; border: none; cursor: pointer; font-size: 0.9rem;" onclick="window.CandlorreState.updateCartQty(${item.id}, '${item.variant}', ${item.quantity - 1})">−</button>
            <span style="padding: 0 8px; font-size: 0.82rem; font-weight: 600;">${item.quantity}</span>
            <button type="button" style="padding: 2px 8px; background: none; border: none; cursor: pointer; font-size: 0.9rem;" onclick="window.CandlorreState.updateCartQty(${item.id}, '${item.variant}', ${item.quantity + 1})">+</button>
          </div>
          <button type="button" style="background: none; border: none; font-size: 0.76rem; color: var(--text-muted); cursor: pointer; text-decoration: underline;" onclick="window.CandlorreState.removeFromCart(${item.id}, '${item.variant}')">
            Remove
          </button>
        </div>
      </div>
    </div>
  `).join('');
};
