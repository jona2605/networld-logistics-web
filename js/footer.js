import { bindPointerGlow, observeReveal } from "./reveal.js";

export function initFooter() {
  const footer = document.querySelector(".site-footer");
  if (!footer) return;

  observeReveal(footer.querySelectorAll("[data-footer-reveal]"), {
    threshold: 0.08,
    rootMargin: "0px 0px 14% 0px",
    delay: 120,
    maxDelay: 240
  });

  bindPointerGlow(footer.querySelectorAll(".footer-command"));
}
