// Catalog Grid & Carousel Filters
document.addEventListener('DOMContentLoaded', () => {
  // Rituals Filter Pills
  const ritualPills = document.querySelectorAll('#ritualFilterBar .km-pill');
  const ritualCards = document.querySelectorAll('.km-rituals-track .km-ritual-card');

  ritualPills.forEach(pill => {
    pill.addEventListener('click', () => {
      ritualPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.dataset.ritualFilter;
      ritualCards.forEach(card => {
        if (filter === 'all' || card.dataset.cat === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // New Arrivals Filter Pills
  const arrivalPills = document.querySelectorAll('#arrivalFilterBar .km-pill');
  const arrivalCards = document.querySelectorAll('#arrivalsTrack .km-product-card');

  arrivalPills.forEach(pill => {
    pill.addEventListener('click', () => {
      arrivalPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.dataset.arrivalFilter;
      arrivalCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Carousel Next/Prev buttons
  const setupCarousel = (prevBtnId, nextBtnId, trackId) => {
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const track = document.getElementById(trackId);

    if (prevBtn && track) {
      prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -320, behavior: 'smooth' });
      });
    }
    if (nextBtn && track) {
      nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: 320, behavior: 'smooth' });
      });
    }
  };

  setupCarousel('ritualPrevBtn', 'ritualNextBtn', 'ritualsTrack');
  setupCarousel('arrivalPrevBtn', 'arrivalNextBtn', 'arrivalsTrack');
});

// Helper for card image gallery navigation
window.scrollCardGallery = function (productId, direction) {
  const slider = document.getElementById(`cardSlider${productId}`);
  if (slider) {
    slider.scrollBy({ left: direction * slider.clientWidth, behavior: 'smooth' });
  }
};

window.scrollCardGalleryTo = function (productId, index) {
  const slider = document.getElementById(`cardSlider${productId}`);
  if (slider) {
    slider.scrollTo({ left: index * slider.clientWidth, behavior: 'smooth' });
  }
};

window.updateCardGalleryDots = function (slider, productId) {
  const index = Math.round(slider.scrollLeft / slider.clientWidth);
  const dots = document.querySelectorAll(`#cardDots${productId} .km-gallery-dot`);
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
};
