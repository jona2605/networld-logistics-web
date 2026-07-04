import { observeReveal } from "./reveal.js";

export function initControlCenter() {
  const section = document.querySelector(".control-center-section");
  if (!section) return;

  const revealItems = section.querySelectorAll("[data-control-reveal]");
  observeReveal(revealItems, { delay: 90, maxDelay: 220 });
}
