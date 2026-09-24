// The Candlorre Client Analytics Tracker
(function () {
  window.CandlorreAnalytics = {
    track: function (eventName, eventData) {
      if (window.dataLayer) {
        window.dataLayer.push({ event: eventName, ...eventData });
      }
    },
    trackProductView: function (product) {
      this.track('view_item', {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_category: product.category
      });
    },
    trackAddToCart: function (product, quantity) {
      this.track('add_to_cart', {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: quantity || 1
      });
    },
    trackCheckout: function (cart) {
      this.track('begin_checkout', {
        value: cart.total,
        currency: 'INR',
        items: cart.items
      });
    }
  };
})();
