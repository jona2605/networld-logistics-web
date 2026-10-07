import { trackEvent } from './tracking.js';

trackEvent('view_courier', { line: 'cherobox' });

document.querySelectorAll('.courier-accordions details').forEach((item, index) => {
  item.addEventListener('toggle', () => {
    if (item.open) trackEvent('click_courier_faq', { question_index: index + 1, question: item.querySelector('summary')?.textContent.trim() });
  });
});
