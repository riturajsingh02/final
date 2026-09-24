// Wishlist Slide-Out Sanctuary Drawer
document.addEventListener('DOMContentLoaded', () => {
  const wishlistTrigger = document.getElementById('wishlistTrigger');
  const wishlistDrawer = document.getElementById('wishlistDrawer');
  const closeWishlistBtn = document.getElementById('closeWishlistBtn');
  const drawerOverlay = document.getElementById('drawerOverlay');

  const openWishlist = () => {
    window.renderWishlistDrawer();
    wishlistDrawer?.classList.add('open');
    drawerOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeWishlist = () => {
    wishlistDrawer?.classList.remove('open');
    drawerOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  wishlistTrigger?.addEventListener('click', openWishlist);
  closeWishlistBtn?.addEventListener('click', closeWishlist);
});

window.kmToggleWishlist = function (productId, btnElem) {
  const numId = Number(productId);
  const added = window.CandlorreState.toggleWishlist(numId);
  window.showToast(added ? 'Saved to your Sanctuary Wishlist ♡' : 'Removed from Saved Sanctuary');
  window.updateHeaderBadges();

  if (btnElem) {
    btnElem.classList.toggle('active', added);
  }
};

window.renderWishlistDrawer = function () {
  const container = document.getElementById('wishlistItemsContainer');
  if (!container) return;

  const wishlistIds = window.CandlorreState.wishlist || [];
  const products = (window.CANDLE_PRODUCTS || []).filter(p => wishlistIds.includes(p.id));

  if (products.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3.5rem 1rem; color: var(--text-muted);">
        <p style="font-size: 2.2rem; margin-bottom: 0.5rem;">♡</p>
        <h4 style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--cabernet); margin-bottom: 0.3rem;">Your Sanctuary is Empty</h4>
        <p style="font-size: 0.85rem;">Save your favorite botanical blends and olfactory rituals for later.</p>
        <a href="full-catalog.html" class="btn btn-outline dark-outline" style="margin-top: 1.2rem; display: inline-block; font-size: 0.76rem; padding: 0.6rem 1.4rem;">
          Explore Creations
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = products.map(item => `
    <div class="wishlist-drawer-item" style="display: flex; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--border-subtle);">
      <img src="${item.images[0]}" alt="${item.name}" style="width: 68px; height: 68px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-subtle);" />
      <div style="flex: 1; min-width: 0;">
        <h4 style="font-family: var(--font-serif); font-size: 0.98rem; margin: 0 0 2px; color: var(--cabernet); text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
          ${item.name}
        </h4>
        <div style="font-weight: 600; font-size: 0.88rem; color: var(--cabernet); margin-bottom: 8px;">
          ${window.formatINR(item.price)}
        </div>
        <div style="display: flex; gap: 8px;">
          <button type="button" class="btn btn-gold" style="padding: 4px 10px; font-size: 0.72rem;" onclick="window.CandlorreState.addToCart(${item.id}); window.CandlorreState.toggleWishlist(${item.id}); window.showToast('Moved to Shopping Bag!');">
            Move to Bag
          </button>
          <button type="button" style="background: none; border: none; font-size: 0.74rem; color: var(--text-muted); cursor: pointer; text-decoration: underline;" onclick="window.kmToggleWishlist(${item.id})">
            Remove
          </button>
        </div>
      </div>
    </div>
  `).join('');
};
