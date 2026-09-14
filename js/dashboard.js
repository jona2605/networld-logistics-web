import { getCurrentOperationsView } from "./operations-data.js";

function renderRoutes(view) {
  document.querySelectorAll(".ops-panel .op").forEach((row, index) => {
    const route = view.routes[index];
    if (!route) {
      row.hidden = true;
      return;
    }

    row.hidden = false;
    const code = row.querySelector("b");
    const description = row.querySelector("span");
    const detail = row.querySelector("small");
    const status = row.querySelector("em");

    if (code) code.textContent = route.countryCode;
    if (description) description.lastChild.textContent = `${route.origin} → ${route.destination}`;
    if (detail) detail.textContent = route.detail;
    if (status) status.textContent = route.status;
  });
}

function renderOperationalView() {
  const view = getCurrentOperationsView();
  renderRoutes(view);
  window.setTimeout(renderOperationalView, Math.max(1000, view.expiresAt - Date.now() + 250));
}

export function initHeroDashboard() {
  if (!document.querySelector(".ops-panel")) return;
  renderOperationalView();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHeroDashboard, { once: true });
} else {
  initHeroDashboard();
}
