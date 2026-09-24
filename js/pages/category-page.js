// Category Page Dynamic Renderer
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryName = urlParams.get('cat') || urlParams.get('category') || 'All Fragrances';
  
  const categoryTitleElem = document.getElementById('categoryTitle') || document.querySelector('.category-hero-title');
  if (categoryTitleElem) {
    categoryTitleElem.textContent = categoryName;
  }

  const gridContainer = document.getElementById('categoryProductsGrid') || document.getElementById('categoryGrid');
  if (gridContainer) {
    const products = (window.CANDLE_PRODUCTS || []).filter(p => 
      categoryName === 'All Fragrances' || 
      p.category.toLowerCase().includes(categoryName.toLowerCase()) ||
      p.categorySlug?.toLowerCase() === categoryName.toLowerCase()
    );

    if (products.length === 0) {
      gridContainer.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted); grid-column: 1 / -1;">
          <p style="font-size: 1.8rem; margin-bottom: 0.5rem;">🕯️</p>
          <h3 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--cabernet); margin-bottom: 0.4rem;">Collection Arriving Soon</h3>
          <p style="font-size: 0.86rem;">Our atelier master-perfumers are hand-pouring new micro-batches for this ritual.</p>
          <a href="full-catalog.html" class="btn btn-gold" style="margin-top: 1.2rem; display: inline-block;">View Full Catalog</a>
        </div>
      `;
      return;
    }

    gridContainer.innerHTML = products.map(p => `
      <article class="km-product-card" data-id="${p.id}" id="kmCard${p.id}">
        <div class="km-card-figure" onclick="window.openPDP(${p.id})">
          <div class="km-figure-badges">
            <span class="km-badge-new">${p.tag || 'BOTANICAL'}</span>
            <span class="km-badge-discount">${p.discountBadge || 'SPECIAL'}</span>
          </div>
          <button type="button" class="km-wishlist-toggle" aria-label="Save to wishlist" onclick="event.stopPropagation(); window.kmToggleWishlist(${p.id}, this);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
          </button>
          
          <img src="${p.images[0]}" alt="${p.name}" class="km-product-img" loading="lazy" style="width: 100%; height: 260px; object-fit: cover;" onerror="this.src='asset/luxury.jpg'" />
          <div class="km-quickview-btn">Quick View</div>
        </div>
        <div class="km-card-details">
          <div class="km-collection-label">${p.category.toUpperCase()}</div>
          <h3 class="km-card-name" onclick="window.openPDP(${p.id})">${p.name}</h3>
          <div class="km-scent-notes">${p.scentNotes}</div>
          <div class="km-spec-row">
            <span>⏳ ${p.burnTime}</span>
            <span>•</span>
            <span>100% Soy Wax</span>
          </div>
          <div class="km-price-block">
            <span class="km-price-current">${window.formatINR(p.price)}</span>
            <span class="km-price-original">${window.formatINR(p.originalPrice)}</span>
          </div>
          <button type="button" class="km-add-cart-btn" onclick="window.kmAddToCart(${p.id}, this)">
            <span>Add to Bag</span>
          </button>
        </div>
      </article>
    `).join('');
  }
});
