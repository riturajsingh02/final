// DOM Helper Utilities for The Candlorre
window.formatINR = function (amount) {
  return '₹' + Number(amount || 0).toLocaleString('en-IN');
};

window.updateHeaderBadges = function () {
  const cartCountElem = document.getElementById('cartCount');
  const wishlistCountElem = document.getElementById('wishlistCount');
  const cartItemCountDisplay = document.getElementById('cartItemCountDisplay');

  const totalCartQty = (window.CandlorreState?.cart?.items || []).reduce((sum, i) => sum + i.quantity, 0);
  const totalWishlistQty = (window.CandlorreState?.wishlist || []).length;

  if (cartCountElem) cartCountElem.textContent = totalCartQty;
  if (cartItemCountDisplay) cartItemCountDisplay.textContent = totalCartQty;
  if (wishlistCountElem) wishlistCountElem.textContent = totalWishlistQty;

  const wishlistSubtitle = document.getElementById('wishlistSubtitle');
  if (wishlistSubtitle) {
    wishlistSubtitle.textContent = `${totalWishlistQty} Fragrance${totalWishlistQty === 1 ? '' : 's'} Saved`;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.updateHeaderBadges();
});
