import { bindPointerGlow, observeReveal } from "./reveal.js";

export function initCases() {
  const section = document.querySelector(".cases-section");
  if (!section) return;

  const revealItems = section.querySelectorAll("[data-cases-reveal]");
  const cards = section.querySelectorAll("[data-case-card]");

  observeReveal(revealItems, { delay: 90, maxDelay: 220 });
  observeReveal(cards, {
    threshold: 0.08,
    rootMargin: "0px 0px 18% 0px",
    delay: 90,
    maxDelay: 300
  });

  bindPointerGlow(cards);
}
