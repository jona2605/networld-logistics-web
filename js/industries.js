import { animateCountOnce, bindPointerGlow, observeReveal } from "./reveal.js";

export function initIndustries() {
  const section = document.querySelector(".industries-section");
  if (!section) return;

  const revealItems = section.querySelectorAll("[data-industries-reveal]");
  const panels = section.querySelectorAll("[data-industry-panel]");
  const counters = section.querySelectorAll("[data-count-to]");
  const animateCounter = counter => animateCountOnce(counter, "countTo");

  observeReveal(revealItems, { delay: 90, maxDelay: 220 });
  observeReveal(panels, {
    threshold: 0.06,
    rootMargin: "0px 0px 20% 0px",
    delay: 80,
    maxDelay: 400,
    onReveal: panel => panel.querySelectorAll("[data-count-to]").forEach(animateCounter)
  });

  bindPointerGlow(panels);

  counters.forEach(counter => {
    if (counter.closest(".industry-panel.is-visible")) animateCounter(counter);
  });
}
