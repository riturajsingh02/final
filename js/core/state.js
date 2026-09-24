// Reactive Global Client State for The Candlorre
window.CandlorreState = {
  cart: {
    items: JSON.parse(localStorage.getItem('candlorre_cart_items') || '[]'),
    coupon: null,
    discountPercent: 0
  },
  wishlist: JSON.parse(localStorage.getItem('candlorre_wishlist_ids') || '[]'),

  saveCart: function () {
    localStorage.setItem('candlorre_cart_items', JSON.stringify(this.cart.items));
    window.updateHeaderBadges && window.updateHeaderBadges();
  },

  saveWishlist: function () {
    localStorage.setItem('candlorre_wishlist_ids', JSON.stringify(this.wishlist));
    window.updateHeaderBadges && window.updateHeaderBadges();
  },

  addToCart: function (productId, quantity = 1, variant = '') {
    const numId = Number(productId);
    const prod = (window.CANDLE_PRODUCTS || []).find(p => p.id === numId);
    if (!prod) return;

    const existing = this.cart.items.find(i => i.id === numId && (!variant || i.variant === variant));
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cart.items.push({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        originalPrice: prod.originalPrice,
        image: prod.images[0],
        variant: variant || (prod.variants && prod.variants[0]?.name) || '',
        quantity
      });
    }
    this.saveCart();
    window.renderCartDrawer && window.renderCartDrawer();
  },

  removeFromCart: function (productId, variant = '') {
    const numId = Number(productId);
    this.cart.items = this.cart.items.filter(i => !(i.id === numId && (!variant || i.variant === variant)));
    this.saveCart();
    window.renderCartDrawer && window.renderCartDrawer();
  },

  updateCartQty: function (productId, variant, newQty) {
    const numId = Number(productId);
    const item = this.cart.items.find(i => i.id === numId && (!variant || i.variant === variant));
    if (item) {
      if (newQty <= 0) {
        this.removeFromCart(productId, variant);
      } else {
        item.quantity = newQty;
        this.saveCart();
        window.renderCartDrawer && window.renderCartDrawer();
      }
    }
  },

  toggleWishlist: function (productId) {
    const numId = Number(productId);
    const idx = this.wishlist.indexOf(numId);
    let added = false;
    if (idx > -1) {
      this.wishlist.splice(idx, 1);
      added = false;
    } else {
      this.wishlist.push(numId);
      added = true;
    }
    this.saveWishlist();
    window.renderWishlistDrawer && window.renderWishlistDrawer();
    return added;
  }
};
