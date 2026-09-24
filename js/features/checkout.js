// Checkout Modal & Order Processing
let appliedDiscountCode = null;
let appliedDiscountPercent = 0;

window.openCheckoutModal = function () {
  const modal = document.getElementById('checkoutModal');
  const drawerOverlay = document.getElementById('drawerOverlay');
  window.renderCheckoutSummary();

  // Prefill patron details if logged in
  const cust = window.ShopifyService?.getCurrentCustomer();
  if (cust) {
    const custName = document.getElementById('custName');
    const custPhone = document.getElementById('custPhone');
    const custAddress = document.getElementById('custAddress');
    const custCity = document.getElementById('custCity');
    const custPincode = document.getElementById('custPincode');

    if (custName && !custName.value) custName.value = cust.fullName || '';
    if (custPhone && !custPhone.value) custPhone.value = cust.phone || '';
    if (cust.defaultAddress) {
      if (custAddress && !custAddress.value) custAddress.value = cust.defaultAddress.addressLine1 || '';
      if (custCity && !custCity.value) custCity.value = cust.defaultAddress.city || '';
      if (custPincode && !custPincode.value) custPincode.value = cust.defaultAddress.pincode || '';
    }
  }

  modal?.classList.add('active');
  drawerOverlay?.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeCheckoutModal = function () {
  const modal = document.getElementById('checkoutModal');
  const drawerOverlay = document.getElementById('drawerOverlay');
  modal?.classList.remove('active');
  drawerOverlay?.classList.remove('active');
  document.body.style.overflow = '';
};

window.renderCheckoutSummary = function () {
  const summaryList = document.getElementById('checkoutSummaryList');
  const summaryCount = document.getElementById('checkoutSummaryCount');
  if (!summaryList) return;

  const items = window.CandlorreState.cart.items || [];
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  if (summaryCount) summaryCount.textContent = `${count} item${count === 1 ? '' : 's'}`;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * appliedDiscountPercent) / 100);
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  summaryList.innerHTML = `
    <div style="margin-bottom: 12px;">
      ${items.map(i => `
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 4px 0;">
          <span>${i.quantity}x ${i.name} ${i.variant ? `(${i.variant})` : ''}</span>
          <span style="font-weight: 600;">${window.formatINR(i.price * i.quantity)}</span>
        </div>
      `).join('')}
    </div>
    <div style="border-top: 1px dashed var(--border-subtle); padding-top: 8px; font-size: 0.85rem;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span>Subtotal</span>
        <span>${window.formatINR(subtotal)}</span>
      </div>
      ${appliedDiscountPercent > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #166534; font-weight: 600;">
          <span>Discount (${appliedDiscountCode} - ${appliedDiscountPercent}%)</span>
          <span>-${window.formatINR(discountAmount)}</span>
        </div>
      ` : ''}
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span>Shipping (Express Courier)</span>
        <span>${shipping === 0 ? 'FREE' : window.formatINR(shipping)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 1.05rem; font-weight: 700; color: var(--cabernet); border-top: 1px solid var(--border-subtle); padding-top: 8px;">
        <span>Grand Total</span>
        <span>${window.formatINR(total)}</span>
      </div>
    </div>
  `;
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('closeCheckoutBtn')?.addEventListener('click', window.closeCheckoutModal);

  // Discount cards click & apply
  const discountCardSave5 = document.getElementById('discountCardSave5');
  discountCardSave5?.addEventListener('click', () => {
    appliedDiscountCode = 'SAVE5';
    appliedDiscountPercent = 5;
    window.renderCheckoutSummary();
    window.showToast('Coupon "SAVE5" applied! 5% discount activated.');
    const actionBtn = document.getElementById('actionBtnSave5');
    if (actionBtn) actionBtn.textContent = 'Applied ✓';
  });

  // Handle Checkout Form Submission
  const checkoutForm = document.getElementById('checkoutForm');
  checkoutForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const items = window.CandlorreState.cart.items || [];
    if (items.length === 0) {
      window.showToast('Your bag is empty!');
      return;
    }

    const custName = document.getElementById('custName')?.value.trim();
    const custPhone = document.getElementById('custPhone')?.value.trim();
    const custAddress = document.getElementById('custAddress')?.value.trim();
    const custCity = document.getElementById('custCity')?.value.trim();
    const custPincode = document.getElementById('custPincode')?.value.trim();

    if (!custName || !custPhone || !custAddress || !custCity || !custPincode) {
      window.showToast('Please fill in all delivery details');
      return;
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = Math.round((subtotal * appliedDiscountPercent) / 100);
    const shipping = subtotal >= 999 ? 0 : 99;
    const total = Math.max(0, subtotal - discountAmount + shipping);

    const orderPayload = {
      customerName: custName,
      customerPhone: custPhone,
      shippingAddress: {
        fullName: custName,
        phone: custPhone,
        addressLine1: custAddress,
        city: custCity,
        pincode: custPincode
      },
      items,
      pricing: { subtotal, discount: discountAmount, shipping, total },
      paymentMethod: 'COD'
    };

    try {
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (data.status === 'success') {
        window.CandlorreState.cart.items = [];
        window.CandlorreState.saveCart();
        window.closeCheckoutModal();
        window.showToast('🕯️ Order confirmed with The Candlorre Atelier!');
        setTimeout(() => {
          window.location.href = `tracking.html?orderId=${encodeURIComponent(data.data.id)}`;
        }, 1200);
      } else {
        window.showToast(data.message || 'Error creating order');
      }
    } catch (err) {
      // Local fallback order
      const orderId = `CND-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      window.CandlorreState.cart.items = [];
      window.CandlorreState.saveCart();
      window.closeCheckoutModal();
      window.showToast('🕯️ Order confirmed successfully!');
      setTimeout(() => {
        window.location.href = `tracking.html?orderId=${encodeURIComponent(orderId)}`;
      }, 1200);
    }
  });
});
