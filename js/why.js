import { bindPointerGlow, observeReveal } from "./reveal.js";

export function initWhy() {
  const section = document.querySelector(".why-section");
  if (!section) return;

  const revealItems = section.querySelectorAll("[data-why-reveal]");
  const cards = section.querySelectorAll("[data-why-card]");

  observeReveal(revealItems, { delay: 90, maxDelay: 220 });
  observeReveal(cards, {
    threshold: 0.04,
    rootMargin: "0px 0px 24% 0px",
    delay: 90,
    maxDelay: 360
  });

  bindPointerGlow(cards);
}
