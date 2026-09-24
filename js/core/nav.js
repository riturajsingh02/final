// Sticky Navigation, Mobile Drawer & Announcement Carousel
document.addEventListener('DOMContentLoaded', () => {
  // Announcement Carousel
  const items = document.querySelectorAll('.announcement-item');
  let currentAnnouncement = 0;
  if (items.length > 0) {
    const showAnnouncement = (index) => {
      items.forEach((it, i) => {
        it.classList.toggle('active', i === index);
      });
    };

    document.querySelector('.announcement-next')?.addEventListener('click', () => {
      currentAnnouncement = (currentAnnouncement + 1) % items.length;
      showAnnouncement(currentAnnouncement);
    });

    document.querySelector('.announcement-prev')?.addEventListener('click', () => {
      currentAnnouncement = (currentAnnouncement - 1 + items.length) % items.length;
      showAnnouncement(currentAnnouncement);
    });

    setInterval(() => {
      currentAnnouncement = (currentAnnouncement + 1) % items.length;
      showAnnouncement(currentAnnouncement);
    }, 4500);
  }

  // Mobile Drawer Toggle
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const closeMobileNavBtn = document.getElementById('closeMobileNavBtn');
  const drawerOverlay = document.getElementById('drawerOverlay');

  const openMobileNav = () => {
    mobileDrawer?.classList.add('open');
    drawerOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileNav = () => {
    mobileDrawer?.classList.remove('open');
    drawerOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburgerBtn?.addEventListener('click', openMobileNav);
  closeMobileNavBtn?.addEventListener('click', closeMobileNav);
  drawerOverlay?.addEventListener('click', closeMobileNav);

  // Search Modal Trigger
  const searchTrigger = document.getElementById('searchTrigger');
  const searchModal = document.getElementById('searchModal');
  const closeSearchBtn = document.getElementById('closeSearchBtn');
  const headerSearchInput = document.getElementById('headerSearchInput');

  searchTrigger?.addEventListener('click', (e) => {
    if (searchModal) {
      e.preventDefault();
      searchModal.classList.add('active');
      headerSearchInput?.focus();
    }
  });

  closeSearchBtn?.addEventListener('click', () => {
    searchModal?.classList.remove('active');
  });

  // Sticky Header elevation
  const siteHeader = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  });
});
