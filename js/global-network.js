import { observeReveal } from "./reveal.js";

export function initGlobalNetwork() {
  const section = document.querySelector(".global-network-section");
  if (!section) return;

  const revealItems = section.querySelectorAll("[data-network-reveal]");
  const hubs = section.querySelectorAll(".network-hub");
  const tooltip = section.querySelector(".network-tooltip");
  const map = section.querySelector(".network-map");

  observeReveal(revealItems, { delay: 90, maxDelay: 220 });

  if (!tooltip || !map || !hubs.length) return;

  const showTooltip = hub => {
    const route = hub.dataset.route || "";
    const type = hub.dataset.type || "";
    const hubRect = hub.getBoundingClientRect();
    const mapRect = map.getBoundingClientRect();
    const x = hubRect.left - mapRect.left + hubRect.width / 2;
    const y = hubRect.top - mapRect.top;

    hubs.forEach(item => item.classList.toggle("is-active", item === hub));
    tooltip.querySelector("strong").innerHTML = route;
    tooltip.querySelector("span").textContent = type;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    tooltip.classList.add("is-visible");
  };

  const hideTooltip = () => {
    hubs.forEach(item => item.classList.remove("is-active"));
    tooltip.classList.remove("is-visible");
  };

  hubs.forEach(hub => {
    hub.addEventListener("pointerenter", () => showTooltip(hub));
    hub.addEventListener("focus", () => showTooltip(hub));
    hub.addEventListener("pointerleave", hideTooltip);
    hub.addEventListener("blur", hideTooltip);
  });
}
