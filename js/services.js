import { bindPointerGlow, observeReveal } from "./reveal.js";

export function initServices() {
  const items = document.querySelectorAll("[data-service-reveal]");
  const serviceUnits = document.querySelectorAll(".service-unit");

  if (!items.length) return;

  observeReveal(items, { delay: 70, maxDelay: 360 });
  bindPointerGlow(serviceUnits);
}
