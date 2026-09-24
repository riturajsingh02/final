// Policy & FAQ Accordion Interactions
document.addEventListener('DOMContentLoaded', () => {
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !isExpanded);
      const answer = btn.nextElementSibling;
      if (answer && answer.classList.contains('faq-answer')) {
        answer.style.display = isExpanded ? 'none' : 'block';
      }
    });
  });
});
