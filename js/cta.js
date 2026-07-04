import { observeReveal } from "./reveal.js";

export function initCta() {
  const section = document.querySelector(".premium-cta-section");
  if (!section) return;

  const revealItems = section.querySelectorAll("[data-cta-reveal]");
  const points = section.querySelectorAll("[data-cta-point]");

  observeReveal(revealItems, { delay: 110, maxDelay: 260 });
  observeReveal(points, {
    threshold: 0.08,
    rootMargin: "0px 0px 18% 0px",
    delay: 85,
    maxDelay: 320
  });
}
