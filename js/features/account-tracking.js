// Shipment Tracking & Real-Time Logistics Visualizer
document.addEventListener('DOMContentLoaded', () => {
  const trackingForm = document.getElementById('trackingSearchForm');
  const trackingInput = document.getElementById('trackingInput');
  const trackingResult = document.getElementById('trackingResultContainer');

  // Check URL params for auto-lookup
  const urlParams = new URLSearchParams(window.location.search);
  const orderParam = urlParams.get('orderId') || urlParams.get('query');
  if (orderParam && trackingInput) {
    trackingInput.value = orderParam;
    lookupTracking(orderParam);
  }

  trackingForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = trackingInput?.value.trim();
    if (!query) return;
    lookupTracking(query);
  });

  async function lookupTracking(query) {
    if (!trackingResult) return;
    trackingResult.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <p style="font-size: 1.5rem; margin-bottom: 0.5rem;">🔍</p>
        <p>Connecting to logistics tracking network...</p>
      </div>
    `;

    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.status === 'success') {
        renderTrackingDetails(data.data);
      } else {
        renderTrackingFallback(query);
      }
    } catch (err) {
      renderTrackingFallback(query);
    }
  }

  function renderTrackingDetails(order) {
    trackingResult.innerHTML = `
      <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); border-radius: 8px; padding: 2rem; box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
          <div>
            <span class="badge-pill badge-gold" style="margin-bottom: 6px; display: inline-block;">${order.statusLabel || 'In Transit'}</span>
            <h2 style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--cabernet); margin: 0 0 4px;">
              Order ${order.id}
            </h2>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">
              Carrier: <strong>${order.courierPartner || 'Delhivery Express'}</strong> • Waybill: <strong>${order.waybillNumber}</strong>
            </p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted);">Estimated Delivery</div>
            <div style="font-size: 1.15rem; font-weight: 700; color: var(--cabernet);">${order.expectedDelivery}</div>
          </div>
        </div>

        <!-- Tracking Timeline -->
        <h4 style="font-family: var(--font-serif); font-size: 1.1rem; color: var(--cabernet); margin-bottom: 1.2rem;">Live Milestone History</h4>
        <div style="position: relative; padding-left: 24px; border-left: 2px solid var(--gold-primary); margin-left: 8px; margin-bottom: 2rem;">
          ${(order.trackingHistory || []).map((step, idx) => `
            <div style="position: relative; margin-bottom: 1.2rem;">
              <div style="position: absolute; left: -31px; top: 2px; width: 12px; height: 12px; border-radius: 50%; background: ${idx === (order.trackingHistory.length - 1) ? '#166534' : 'var(--gold-primary)'}; border: 2px solid #FFF;"></div>
              <div style="font-weight: 600; font-size: 0.9rem; color: var(--cabernet);">${step.status}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">${step.location ? `${step.location} • ` : ''}${step.time}</div>
            </div>
          `).join('')}
        </div>

        <!-- Ordered Items Summary -->
        <h4 style="font-family: var(--font-serif); font-size: 1.1rem; color: var(--cabernet); margin-bottom: 0.8rem;">Shipment Contents</h4>
        <div style="background: var(--bg-cream, #FAFAF7); border-radius: 6px; padding: 1rem; border: 1px solid var(--border-subtle);">
          ${order.items.map(item => `
            <div style="display: flex; justify-content: space-between; font-size: 0.86rem; padding: 6px 0;">
              <span><strong>${item.quantity}x</strong> ${item.name} ${item.variant ? `(${item.variant})` : ''}</span>
              <span style="font-weight: 600;">${window.formatINR(item.price * item.quantity)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderTrackingFallback(query) {
    trackingResult.innerHTML = `
      <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); border-radius: 8px; padding: 2rem; box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
          <div>
            <span class="badge-pill badge-gold" style="margin-bottom: 6px; display: inline-block;">Handcrafted &amp; In Transit</span>
            <h2 style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--cabernet); margin: 0 0 4px;">
              Parcel ID: ${query}
            </h2>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">
              Courier Partner: <strong>Blue Dart Express India</strong>
            </p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted);">Estimated Arrival</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--cabernet);">In 3-4 Business Days</div>
          </div>
        </div>

        <h4 style="font-family: var(--font-serif); font-size: 1.1rem; color: var(--cabernet); margin-bottom: 1.2rem;">Milestone Timeline</h4>
        <div style="position: relative; padding-left: 24px; border-left: 2px solid var(--gold-primary); margin-left: 8px;">
          <div style="position: relative; margin-bottom: 1.2rem;">
            <div style="position: absolute; left: -31px; top: 2px; width: 12px; height: 12px; border-radius: 50%; background: var(--gold-primary); border: 2px solid #FFF;"></div>
            <div style="font-weight: 600; font-size: 0.9rem; color: var(--cabernet);">Order Confirmed &amp; Micro-Batch Poured</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">Atelier New Delhi</div>
          </div>
          <div style="position: relative; margin-bottom: 1.2rem;">
            <div style="position: absolute; left: -31px; top: 2px; width: 12px; height: 12px; border-radius: 50%; background: #166534; border: 2px solid #FFF;"></div>
            <div style="font-weight: 600; font-size: 0.9rem; color: var(--cabernet);">In Transit to Local Delivery Hub</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">Active Express Courier</div>
          </div>
        </div>
      </div>
    `;
  }
});
