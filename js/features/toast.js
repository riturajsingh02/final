// Luxury Toast Notifications
(function () {
  let toastContainer = document.getElementById('candlorreToastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'candlorreToastContainer';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }

  window.showToast = function (message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `
      background: #2B050B;
      color: #FFF0C2;
      border: 1px solid #D4AF37;
      padding: 12px 20px;
      border-radius: 4px;
      font-size: 0.85rem;
      font-family: var(--font-sans, -apple-system, BlinkMacSystemFont, sans-serif);
      letter-spacing: 0.5px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      gap: 10px;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: auto;
    `;
    toast.innerHTML = `<span>✦</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  };
})();
