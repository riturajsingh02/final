// Global Event Handlers for The Candlorre
document.addEventListener('DOMContentLoaded', () => {
  // Live search input in search overlay
  const searchInput = document.getElementById('headerSearchInput');
  const resultsContainer = document.getElementById('searchResultsContainer');
  const searchClearBtn = document.getElementById('searchClearBtn');

  if (searchInput && resultsContainer) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      if (searchClearBtn) searchClearBtn.hidden = !q;

      if (!q) {
        resultsContainer.innerHTML = '';
        return;
      }

      const products = (window.CANDLE_PRODUCTS || []).filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.scentNotes.toLowerCase().includes(q)
      );

      if (products.length === 0) {
        resultsContainer.innerHTML = `
          <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
            No botanical fragrances found matching "${q}".
          </div>
        `;
        return;
      }

      resultsContainer.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-top: 1rem;">
          ${products.map(p => `
            <div class="search-result-card" style="border: 1px solid var(--border-subtle); border-radius: 6px; padding: 10px; cursor: pointer; background: #FFF;" onclick="window.openPDP(${p.id})">
              <img src="${p.images[0]}" alt="${p.name}" style="width: 100%; height: 130px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" />
              <h5 style="font-family: var(--font-serif); font-size: 0.95rem; margin: 0 0 4px; color: var(--cabernet);">${p.name}</h5>
              <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 6px;">${p.scentNotes}</div>
              <div style="font-weight: 700; color: var(--cabernet); font-size: 0.88rem;">${window.formatINR(p.price)}</div>
            </div>
          `).join('')}
        </div>
      `;
    });

    searchClearBtn?.addEventListener('click', () => {
      searchInput.value = '';
      searchClearBtn.hidden = true;
      resultsContainer.innerHTML = '';
      searchInput.focus();
    });
  }

  // Search popular tag buttons
  const searchTags = document.querySelectorAll('.search-tag');
  searchTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const val = tag.dataset.tag || tag.textContent;
      if (searchInput) {
        searchInput.value = val;
        searchInput.dispatchEvent(new Event('input'));
      }
    });
  });
});
