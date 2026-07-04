import { observeReveal } from "./reveal.js";

export function initWorkflow() {
  const section = document.querySelector(".workflow-section");
  if (!section) return;

  const revealItems = section.querySelectorAll("[data-workflow-reveal]");
  const steps = section.querySelectorAll("[data-workflow-step]");
  const track = section.querySelector(".workflow-track");

  observeReveal(revealItems, { delay: 90, maxDelay: 220 });
  observeReveal(steps, {
    visibleClass: "is-active",
    threshold: 0.14,
    rootMargin: "0px 0px 12% 0px",
    delay: 90,
    maxDelay: 420,
    onReveal: (_step, index) => {
      if (track && window.matchMedia("(min-width: 1181px)").matches) {
        const progress = steps.length > 1 ? (index / (steps.length - 1)) * 84 : 0;
        track.style.setProperty("--workflow-progress", `${Math.max(0, progress)}%`);
      }
    }
  });
}
