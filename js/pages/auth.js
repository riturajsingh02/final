// Authentication Pages Handler (Sign In / Register / Password Reset)
document.addEventListener('DOMContentLoaded', () => {
  // Login Form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const identifier = document.getElementById('loginIdentifier')?.value.trim();
      const password = document.getElementById('loginPassword')?.value;

      if (!identifier || !password) {
        window.showToast?.('Please enter your email/phone and password');
        return;
      }

      const submitBtn = loginForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Authenticating...';
      }

      const res = await window.ShopifyService.login(identifier, password);
      if (res.success) {
        window.showToast?.('Welcome to your Candlorre Sanctuary ♡');
        setTimeout(() => {
          window.location.href = 'account.html';
        }, 800);
      } else {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Sign In';
        }
        window.showToast?.(res.message || 'Invalid credentials');
      }
    });
  }

  // Signup / Register Form
  const signupForm = document.getElementById('signupForm') || document.getElementById('registerForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fullName = document.getElementById('signupName')?.value.trim() || document.getElementById('fullName')?.value.trim();
      const email = document.getElementById('signupEmail')?.value.trim() || document.getElementById('email')?.value.trim();
      const phone = document.getElementById('signupPhone')?.value.trim() || document.getElementById('phone')?.value.trim();
      const password = document.getElementById('signupPassword')?.value || document.getElementById('password')?.value;

      if (!fullName || !password) {
        window.showToast?.('Please fill in your name and password');
        return;
      }

      const submitBtn = signupForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating Account...';
      }

      const res = await window.ShopifyService.register({ fullName, email, phone, password });
      if (res.success) {
        window.showToast?.('Welcome to The Candlorre VIP Circle ♡');
        setTimeout(() => {
          window.location.href = 'account.html';
        }, 800);
      } else {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Create Sanctuary Account';
        }
        window.showToast?.(res.message || 'Error creating account');
      }
    });
  }
});
