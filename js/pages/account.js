// Account Dashboard, Address Management, Order Lists & Details
document.addEventListener('DOMContentLoaded', () => {
  const customer = window.ShopifyService?.getCurrentCustomer();

  // Populate Account Dashboard Header
  if (customer) {
    const fullNameElem = document.getElementById('customerFullName');
    const emailElem = document.getElementById('customerEmail');
    const monogramElem = document.getElementById('customerMonogram');
    const tierElem = document.getElementById('customerTier');
    const memberSinceElem = document.getElementById('customerMemberSince');

    if (fullNameElem) fullNameElem.textContent = customer.fullName || 'Patron';
    if (emailElem) emailElem.textContent = customer.email || customer.phone || 'Member';
    if (monogramElem && customer.fullName) monogramElem.textContent = customer.fullName[0].toUpperCase();
    if (tierElem) tierElem.textContent = customer.tier || 'Sanctuary Connoisseur';
    if (memberSinceElem) memberSinceElem.textContent = customer.memberSince || '2026';
  }

  // Load Recent Order on Account Dashboard
  const recentOrderContainer = document.getElementById('recentOrderContainer');
  if (recentOrderContainer) {
    fetchOrders().then(orders => {
      if (orders && orders.length > 0) {
        const recent = orders[0];
        recentOrderContainer.innerHTML = `
          <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); border-radius: 6px; padding: 1.2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <div>
              <span class="badge-pill badge-gold" style="margin-bottom: 4px; display: inline-block;">${recent.statusLabel || 'In Transit'}</span>
              <h4 style="font-family: var(--font-serif); font-size: 1.1rem; color: var(--cabernet); margin: 0 0 2px;">
                Order ${recent.id}
              </h4>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0;">
                Placed on ${new Date(recent.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • Total: ${window.formatINR(recent.pricing.total)}
              </p>
            </div>
            <a href="tracking.html?orderId=${encodeURIComponent(recent.id)}" class="btn btn-gold" style="padding: 0.55rem 1.2rem; font-size: 0.74rem;">
              Track Parcel →
            </a>
          </div>
        `;
      } else {
        recentOrderContainer.innerHTML = `
          <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
            No recent orders. Explore our botanical candle collection!
          </div>
        `;
      }
    });
  }

  // Load Saved Addresses on Dashboard
  const dashboardAddressContainer = document.getElementById('dashboardAddressContainer');
  if (dashboardAddressContainer && customer) {
    const addr = customer.defaultAddress || (customer.addresses && customer.addresses[0]);
    if (addr) {
      dashboardAddressContainer.innerHTML = `
        <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); border-radius: 6px; padding: 1.2rem;">
          <div style="font-weight: 600; color: var(--cabernet); margin-bottom: 4px;">${addr.fullName} (${addr.addressType || 'HOME'})</div>
          <div style="font-size: 0.86rem; color: var(--text-muted); line-height: 1.5;">
            ${addr.addressLine1}${addr.addressLine2 ? `, ${addr.addressLine2}` : ''}<br />
            ${addr.city}, ${addr.state || ''} - ${addr.pincode}<br />
            Phone: ${addr.phone}
          </div>
        </div>
      `;
    } else {
      dashboardAddressContainer.innerHTML = `
        <div style="padding: 1.2rem; background: #FFF; border: 1px dashed var(--border-subtle); border-radius: 6px; text-align: center; color: var(--text-muted);">
          No delivery address saved yet.
        </div>
      `;
    }
  }

  // Load Orders List on Orders.html
  const ordersListContainer = document.getElementById('ordersListContainer');
  if (ordersListContainer) {
    fetchOrders().then(orders => {
      if (!orders || orders.length === 0) {
        ordersListContainer.innerHTML = `
          <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
            <p style="font-size: 2rem; margin-bottom: 0.5rem;">📦</p>
            <h3 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--cabernet); margin-bottom: 0.4rem;">No Orders Placed Yet</h3>
            <p style="font-size: 0.86rem;">Your bespoke fragrance journeys will be recorded here.</p>
            <a href="full-catalog.html" class="btn btn-gold" style="margin-top: 1.2rem; display: inline-block;">Explore Full Catalog</a>
          </div>
        `;
        return;
      }

      ordersListContainer.innerHTML = orders.map(ord => `
        <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem; margin-bottom: 1rem;">
            <div>
              <span class="badge-pill badge-gold" style="margin-bottom: 6px; display: inline-block;">${ord.statusLabel || ord.status}</span>
              <h3 style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--cabernet); margin: 0 0 4px;">
                Order ${ord.id}
              </h3>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0;">
                Placed on ${new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 1.15rem; font-weight: 700; color: var(--cabernet);">${window.formatINR(ord.pricing.total)}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">${ord.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid (Razorpay)'}</div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 1.2rem;">
            ${ord.items.map(item => `
              <div style="display: flex; justify-content: space-between; font-size: 0.86rem;">
                <span>${item.quantity}x ${item.name} ${item.variant ? `(${item.variant})` : ''}</span>
                <span style="font-weight: 600;">${window.formatINR(item.price * item.quantity)}</span>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
            <a href="order-details.html?id=${encodeURIComponent(ord.id)}" class="btn btn-outline dark-outline" style="padding: 0.55rem 1.2rem; font-size: 0.74rem;">
              View Breakdown
            </a>
            <a href="tracking.html?orderId=${encodeURIComponent(ord.id)}" class="btn btn-gold" style="padding: 0.55rem 1.2rem; font-size: 0.74rem;">
              Track Shipment →
            </a>
          </div>
        </div>
      `).join('');
    });
  }

  // Load Order Details on order-details.html
  const orderDetailsWrapper = document.getElementById('orderDetailsWrapper');
  if (orderDetailsWrapper) {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id') || 'CND-2026-8891';
    fetch(`/api/orders/${encodeURIComponent(orderId)}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.data) {
          const ord = data.data;
          orderDetailsWrapper.innerHTML = `
            <div class="account-breadcrumb">
              <a href="orders.html">My Orders</a>
              <span>/</span>
              <span>${ord.id}</span>
            </div>
            <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); border-radius: 8px; padding: 2rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
                <div>
                  <span class="badge-pill badge-gold" style="margin-bottom: 6px; display: inline-block;">${ord.statusLabel || ord.status}</span>
                  <h1 style="font-family: var(--font-serif); font-size: 2rem; color: var(--cabernet); margin: 0 0 4px;">
                    Order ${ord.id}
                  </h1>
                  <p style="font-size: 0.86rem; color: var(--text-muted); margin: 0;">
                    Carrier: ${ord.courierPartner || 'Delhivery'} • Waybill: ${ord.waybillNumber}
                  </p>
                </div>
                <div>
                  <a href="tracking.html?orderId=${encodeURIComponent(ord.id)}" class="btn btn-gold">
                    Track Real-Time Status →
                  </a>
                </div>
              </div>

              <h3 style="font-family: var(--font-serif); font-size: 1.3rem; color: var(--cabernet); margin-bottom: 1rem;">Items in Order</h3>
              <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
                ${ord.items.map(item => `
                  <div style="display: flex; gap: 16px; align-items: center; padding: 10px 0;">
                    <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-subtle);" onerror="this.src='asset/luxury.jpg'" />
                    <div style="flex: 1;">
                      <div style="font-weight: 600; color: var(--cabernet);">${item.name}</div>
                      ${item.variant ? `<div style="font-size: 0.78rem; color: var(--text-muted);">Option: ${item.variant}</div>` : ''}
                      <div style="font-size: 0.84rem; color: var(--text-muted);">Quantity: ${item.quantity}</div>
                    </div>
                    <div style="font-weight: 700; color: var(--cabernet);">${window.formatINR(item.price * item.quantity)}</div>
                  </div>
                `).join('')}
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 2rem;">
                <div>
                  <h4 style="font-family: var(--font-serif); font-size: 1.1rem; color: var(--cabernet); margin-bottom: 0.5rem;">Delivery Destination</h4>
                  <div style="font-size: 0.86rem; color: var(--text-muted); line-height: 1.5;">
                    <strong>${ord.shippingAddress?.fullName || ord.customerName}</strong><br />
                    ${ord.shippingAddress?.addressLine1 || ''}<br />
                    ${ord.shippingAddress?.city || ''} - ${ord.shippingAddress?.pincode || ''}<br />
                    Contact: ${ord.shippingAddress?.phone || ord.customerPhone}
                  </div>
                </div>
                <div>
                  <h4 style="font-family: var(--font-serif); font-size: 1.1rem; color: var(--cabernet); margin-bottom: 0.5rem;">Payment &amp; Invoice Breakdown</h4>
                  <div style="font-size: 0.86rem; color: var(--text-muted); line-height: 1.6;">
                    <div style="display: flex; justify-content: space-between;"><span>Subtotal:</span> <span>${window.formatINR(ord.pricing.subtotal)}</span></div>
                    ${ord.pricing.discount > 0 ? `<div style="display: flex; justify-content: space-between; color: #166534;"><span>Discount:</span> <span>-${window.formatINR(ord.pricing.discount)}</span></div>` : ''}
                    <div style="display: flex; justify-content: space-between;"><span>Shipping:</span> <span>${ord.pricing.shipping === 0 ? 'FREE' : window.formatINR(ord.pricing.shipping)}</span></div>
                    <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--cabernet); font-size: 1.05rem; border-top: 1px solid var(--border-subtle); padding-top: 6px; margin-top: 6px;">
                      <span>Total Paid:</span> <span>${window.formatINR(ord.pricing.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }
      })
      .catch(() => {});
  }

  // Load Addresses on addresses.html
  const addressesGrid = document.getElementById('addressesGrid');
  if (addressesGrid && customer) {
    renderAddressesPage();

    const addNewAddressBtn = document.getElementById('addNewAddressBtn');
    const addressModalOverlay = document.getElementById('addressModalOverlay');
    const closeAddressModalBtn = document.getElementById('closeAddressModalBtn');

    addNewAddressBtn?.addEventListener('click', () => {
      addressModalOverlay?.classList.add('active');
    });

    closeAddressModalBtn?.addEventListener('click', () => {
      addressModalOverlay?.classList.remove('active');
    });

    const addressForm = document.getElementById('addressForm');
    addressForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullName = document.getElementById('addrFullName')?.value.trim();
      const phone = document.getElementById('addrPhone')?.value.trim();
      const addressLine1 = document.getElementById('addrLine1')?.value.trim();
      const city = document.getElementById('addrCity')?.value.trim();
      const pincode = document.getElementById('addrPincode')?.value.trim();

      if (!fullName || !phone || !addressLine1 || !city || !pincode) {
        window.showToast?.('Please fill in required fields');
        return;
      }

      const newAddr = {
        id: 'addr_' + Date.now(),
        fullName,
        phone,
        addressLine1,
        city,
        pincode,
        isDefault: customer.addresses.length === 0
      };

      customer.addresses.push(newAddr);
      window.ShopifyService.saveCustomer(customer);
      addressModalOverlay?.classList.remove('active');
      window.showToast?.('Delivery address saved successfully');
      renderAddressesPage();
    });
  }

  function renderAddressesPage() {
    if (!addressesGrid || !customer) return;
    const addrs = customer.addresses || [];
    if (addrs.length === 0) {
      addressesGrid.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: var(--text-muted); grid-column: 1 / -1;">
          No saved addresses found. Click "+ Add New Address" above.
        </div>
      `;
      return;
    }

    addressesGrid.innerHTML = addrs.map((a, idx) => `
      <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); border-radius: 8px; padding: 1.5rem; position: relative;">
        ${a.isDefault ? `<span class="badge-pill badge-gold" style="position: absolute; top: 12px; right: 12px;">Default</span>` : ''}
        <h4 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--cabernet); margin: 0 0 6px;">
          ${a.fullName}
        </h4>
        <p style="font-size: 0.86rem; color: var(--text-muted); line-height: 1.5; margin: 0 0 1rem;">
          ${a.addressLine1}${a.addressLine2 ? `, ${a.addressLine2}` : ''}<br />
          ${a.city} - ${a.pincode}<br />
          Phone: ${a.phone}
        </p>
        <div style="display: flex; gap: 8px;">
          <button type="button" class="btn btn-outline dark-outline" style="padding: 4px 10px; font-size: 0.72rem;" onclick="removeAddress(${idx})">
            Remove
          </button>
        </div>
      </div>
    `).join('');
  }

  window.removeAddress = function (idx) {
    if (!customer) return;
    customer.addresses.splice(idx, 1);
    window.ShopifyService.saveCustomer(customer);
    renderAddressesPage();
    window.showToast?.('Address removed');
  };

  async function fetchOrders() {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.status === 'success') return data.data;
    } catch (e) {}
    return [];
  }
});
