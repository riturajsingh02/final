// Shopify & Local Client Service for The Candlorre
(function (window) {
  const STORAGE_KEY_AUTH = 'candlorre_customer_session';
  const STORAGE_KEY_CART = 'candlorre_cart_items';
  const STORAGE_KEY_WISHLIST = 'candlorre_wishlist_items';

  window.ShopifyService = {
    // Current customer session
    getCurrentCustomer: function () {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_AUTH) || sessionStorage.getItem(STORAGE_KEY_AUTH);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      // Fallback demo user if not logged in
      return {
        id: 'cust_demo_101',
        fullName: 'Rituraj Singh',
        email: 'riturajsinghrana153@gmail.com',
        phone: '9762831995',
        tier: 'Sanctuary Connoisseur',
        memberSince: '2026',
        addresses: [
          {
            id: 'addr_demo_01',
            fullName: 'Rituraj Singh',
            phone: '9762831995',
            addressLine1: 'Villa 14, Royal Palm Residences, Sector 45',
            addressLine2: 'Near Botanical Conservatory',
            city: 'Gurugram',
            state: 'Haryana',
            pincode: '122003',
            addressType: 'HOME',
            isDefault: true
          }
        ],
        defaultAddress: {
          id: 'addr_demo_01',
          fullName: 'Rituraj Singh',
          phone: '9762831995',
          addressLine1: 'Villa 14, Royal Palm Residences, Sector 45',
          addressLine2: 'Near Botanical Conservatory',
          city: 'Gurugram',
          state: 'Haryana',
          pincode: '122003',
          addressType: 'HOME',
          isDefault: true
        }
      };
    },

    saveCustomer: function (customer) {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(customer));
    },

    logout: function () {
      localStorage.removeItem(STORAGE_KEY_AUTH);
      sessionStorage.removeItem(STORAGE_KEY_AUTH);
      fetch('/api/customer/logout', { method: 'POST' }).catch(() => {});
      window.location.href = 'login.html';
    },

    login: async function (identifier, password) {
      try {
        const res = await fetch('/api/customer/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password })
        });
        const data = await res.json();
        if (data.status === 'success') {
          this.saveCustomer(data.data.customer);
          return { success: true, customer: data.data.customer };
        }
        return { success: false, message: data.message };
      } catch (err) {
        // Local fallback for offline/demo
        const fallbackCustomer = this.getCurrentCustomer();
        this.saveCustomer(fallbackCustomer);
        return { success: true, customer: fallbackCustomer };
      }
    },

    register: async function (userData) {
      try {
        const res = await fetch('/api/customer/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        const data = await res.json();
        if (data.status === 'success') {
          this.saveCustomer(data.data.customer);
          return { success: true, customer: data.data.customer };
        }
        return { success: false, message: data.message };
      } catch (err) {
        const newCust = {
          id: 'cust_' + Date.now(),
          ...userData,
          tier: 'Sanctuary Explorer',
          memberSince: '2026',
          addresses: []
        };
        this.saveCustomer(newCust);
        return { success: true, customer: newCust };
      }
    },

    getProducts: async function (filter) {
      try {
        let url = '/api/products';
        if (filter?.category) url += '?category=' + encodeURIComponent(filter.category);
        const res = await fetch(url);
        const data = await res.json();
        if (data.status === 'success') return data.data;
      } catch (e) {}
      return window.CANDLE_PRODUCTS || [];
    },

    getProductById: function (id) {
      const num = Number(id);
      return (window.CANDLE_PRODUCTS || []).find(p => p.id === num) || null;
    }
  };
})(window);
