// Product Quick View PDP Modal & Pincode Verification
let currentPdpProduct = null;
let currentPdpImageIndex = 0;
let selectedVariant = '';

window.openPDP = function (productId) {
  const numId = Number(productId);
  const prod = (window.CANDLE_PRODUCTS || []).find(p => p.id === numId);
  if (!prod) return;

  currentPdpProduct = prod;
  currentPdpImageIndex = 0;
  selectedVariant = prod.variants?.[0]?.name || '';

  const pdpModal = document.getElementById('pdpModal');
  const drawerOverlay = document.getElementById('drawerOverlay');

  document.getElementById('pdpTitle').textContent = prod.name;
  document.getElementById('pdpCategory').textContent = prod.category.toUpperCase();
  document.getElementById('pdpPrice').textContent = window.formatINR(prod.price);
  document.getElementById('pdpOrigPrice').textContent = window.formatINR(prod.originalPrice);
  document.getElementById('pdpDescription').textContent = prod.description;

  document.getElementById('pdpTopNotes').textContent = prod.topNotes || prod.scentNotes;
  document.getElementById('pdpHeartNotes').textContent = prod.heartNotes || 'Botanical Heart';
  document.getElementById('pdpBaseNotes').textContent = prod.baseNotes || 'Amber Woods';
  document.getElementById('pdpBurnTime').textContent = prod.burnTime || '50+ Hours';

  // Render main image
  const pdpImage = document.getElementById('pdpImage');
  if (pdpImage) pdpImage.src = prod.images[0];

  // Render Thumbnails
  const thumbsRow = document.getElementById('pdpThumbsRow');
  if (thumbsRow) {
    thumbsRow.innerHTML = prod.images.map((img, i) => `
      <img src="${img}" alt="View ${i+1}" class="pdp-thumb-img ${i === 0 ? 'active' : ''}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-subtle); cursor: pointer;" onclick="window.setPdpImage(${i})" />
    `).join('');
  }

  // Variant selector
  const variantBlock = document.getElementById('pdpVariantBlock');
  const variantGrid = document.getElementById('pdpVariantSelectorGrid');
  const variantVal = document.getElementById('pdpVariantCurrentVal');

  if (prod.variants && prod.variants.length > 1) {
    variantBlock.style.display = 'block';
    if (variantVal) variantVal.textContent = selectedVariant;
    if (variantGrid) {
      variantGrid.innerHTML = prod.variants.map((v, idx) => `
        <button type="button" class="variant-pill-btn ${idx === 0 ? 'active' : ''}" style="padding: 6px 12px; font-size: 0.8rem; border: 1px solid var(--border-subtle); background: #FFF; border-radius: 4px; cursor: pointer; margin-right: 6px; margin-bottom: 6px;" onclick="window.selectPdpVariant('${v.name}', this, '${v.image}')">
          ${v.name}
        </button>
      `).join('');
    }
  } else {
    variantBlock.style.display = 'none';
  }

  pdpModal?.classList.add('active');
  drawerOverlay?.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closePDP = function () {
  const pdpModal = document.getElementById('pdpModal');
  const drawerOverlay = document.getElementById('drawerOverlay');
  pdpModal?.classList.remove('active');
  drawerOverlay?.classList.remove('active');
  document.body.style.overflow = '';
};

window.setPdpImage = function (index) {
  if (!currentPdpProduct) return;
  currentPdpImageIndex = index;
  const pdpImage = document.getElementById('pdpImage');
  if (pdpImage) pdpImage.src = currentPdpProduct.images[index];

  document.querySelectorAll('.pdp-thumb-img').forEach((th, i) => {
    th.classList.toggle('active', i === index);
  });
};

window.scrollPdpGallery = function (dir) {
  if (!currentPdpProduct || !currentPdpProduct.images.length) return;
  const newIdx = (currentPdpImageIndex + dir + currentPdpProduct.images.length) % currentPdpProduct.images.length;
  window.setPdpImage(newIdx);
};

window.selectPdpVariant = function (name, btnElem, img) {
  selectedVariant = name;
  const variantVal = document.getElementById('pdpVariantCurrentVal');
  if (variantVal) variantVal.textContent = name;
  document.querySelectorAll('.variant-pill-btn').forEach(b => b.classList.remove('active'));
  btnElem?.classList.add('active');
  if (img) {
    const pdpImage = document.getElementById('pdpImage');
    if (pdpImage) pdpImage.src = img;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Add to cart from PDP
  document.getElementById('pdpAddToCartBtn')?.addEventListener('click', () => {
    if (currentPdpProduct) {
      window.CandlorreState.addToCart(currentPdpProduct.id, 1, selectedVariant);
      window.showToast(`Added ${currentPdpProduct.name} to your Shopping Bag`);
      window.closePDP();
    }
  });

  // Pincode Verification button
  document.getElementById('checkPincodeBtn')?.addEventListener('click', () => {
    const pincode = document.getElementById('pincodeInput')?.value.trim();
    const msg = document.getElementById('pincodeMsg');
    if (!pincode || pincode.length !== 6) {
      if (msg) {
        msg.style.color = '#B91C1C';
        msg.textContent = 'Please enter a valid 6-digit Indian Postal PIN code.';
      }
      return;
    }
    if (msg) {
      msg.style.color = '#166534';
      msg.textContent = `✓ PIN ${pincode} is eligible for Free Express Shipping & Cash on Delivery. Expected delivery in 3-5 business days.`;
    }
  });
});
