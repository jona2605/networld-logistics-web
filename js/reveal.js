export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function observeReveal(items, options = {}) {
  const elements = Array.from(items || []);
  if (!elements.length) return null;

  const {
    visibleClass = "is-visible",
    threshold = 0.06,
    rootMargin = "0px 0px 18% 0px",
    delay = 90,
    maxDelay = 260,
    onReveal
  } = options;

  const reveal = element => {
    const index = elements.indexOf(element);
    element.style.transitionDelay = `${Math.min(index * delay, maxDelay)}ms`;
    element.classList.add(visibleClass);
    if (typeof onReveal === "function") onReveal(element, index);
  };

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    elements.forEach(reveal);
    return null;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold, rootMargin });

  elements.forEach(element => observer.observe(element));
  return observer;
}

export function bindPointerGlow(items) {
  if (prefersReducedMotion()) return;

  Array.from(items || []).forEach(item => {
    item.addEventListener("pointermove", event => {
      const rect = item.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      item.style.setProperty("--mx", `${x}%`);
      item.style.setProperty("--my", `${y}%`);
    });
  });
}

export function animateNumber(counter, target, options = {}) {
  if (prefersReducedMotion()) {
    counter.textContent = Math.round(target);
    return;
  }

  const duration = options.duration || 1000;
  const start = performance.now();

  const tick = now => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(target * eased);

    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

export function animateCountOnce(counter, datasetName, options = {}) {
  if (!counter || counter.dataset.counted === "true") return;
  counter.dataset.counted = "true";
  animateNumber(counter, Number(counter.dataset[datasetName] || 0), options);
}

export function initPageMotion(config = {}) {
  const {
    revealSelector,
    cardSelector,
    counterSelector,
    counterDataset,
    glowSelector,
    revealOptions = {},
    cardOptions = {}
  } = config;

  const revealItems = document.querySelectorAll(revealSelector);
  const cards = document.querySelectorAll(cardSelector);
  const counters = counterSelector ? document.querySelectorAll(counterSelector) : [];

  const animateCounter = counter => animateCountOnce(counter, counterDataset, { duration: 1200 });

  observeReveal(revealItems, {
    threshold: 0.07,
    rootMargin: "0px 0px 16% 0px",
    delay: 90,
    maxDelay: 260,
    ...revealOptions,
    onReveal(element, index) {
      if (counterSelector) element.querySelectorAll(counterSelector).forEach(animateCounter);
      if (typeof revealOptions.onReveal === "function") revealOptions.onReveal(element, index);
    }
  });

  observeReveal(cards, {
    threshold: 0.06,
    rootMargin: "0px 0px 18% 0px",
    delay: 70,
    maxDelay: 340,
    ...cardOptions
  });

  counters.forEach(counter => {
    if (counter.closest(revealSelector)) return;
    animateCounter(counter);
  });

  if (glowSelector) bindPointerGlow(document.querySelectorAll(glowSelector));
  bindPointerGlow(cards);

  return { revealItems, cards, counters };
}
