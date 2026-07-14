import { getCurrentOperationsSnapshot } from "./operations-data.js";

function getVisibleCount() {
  if (window.innerWidth <= 720) return 3;
  if (window.innerHeight >= 860 && window.innerWidth >= 1400) return 4;
  return 3;
}

function ensureOperationRows(container, count) {
  const rows = [...container.querySelectorAll(".op-item")];
  const template = rows[0];
  if (!template) return rows;

  while (rows.length < count) {
    const clone = template.cloneNode(true);
    container.appendChild(clone);
    rows.push(clone);
  }

  rows.forEach((row, index) => {
    row.hidden = index >= count;
  });

  return rows.slice(0, count);
}

function renderOperations(rows, operations, offset, animate) {
  rows.forEach((row, index) => {
    const operation = operations[(offset + index) % operations.length];
    const apply = () => {
      const code = row.querySelector(":scope > span");
      const title = row.querySelector("p");
      const status = row.querySelector("em");

      if (code) code.textContent = operation.countryCode;
      if (title) {
        title.innerHTML = `${operation.origin} &rarr; ${operation.destination}<small>${operation.mode} &middot; ${operation.detail}</small>`;
      }
      if (status) status.textContent = operation.status;
      row.style.opacity = "1";
    };

    if (!animate) {
      apply();
      return;
    }

    row.style.opacity = "0.32";
    window.setTimeout(apply, 160 + index * 48);
  });
}

function renderMetrics(dashboard, snapshot) {
  const metrics = dashboard.querySelectorAll(".dashboard-metrics strong");
  const metricValues = [
    String(snapshot.activeOperations),
    String(snapshot.connectedCountries),
    snapshot.averageEta,
    snapshot.onTimeRate
  ];

  metrics.forEach((metric, index) => {
    metric.textContent = metricValues[index];
  });
}

export function initHeroDashboard() {
  const dashboard = document.querySelector(".hero-dashboard");
  if (!dashboard) return;

  const snapshot = getCurrentOperationsSnapshot();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const visibleCount = getVisibleCount();
  const rows = ensureOperationRows(dashboard.querySelector(".recent-ops"), visibleCount);

  renderMetrics(dashboard, snapshot);
  dashboard.querySelectorAll(".dashboard-metrics strong, .op-item").forEach(element => {
    element.style.transition = "opacity .38s ease";
  });

  renderOperations(rows, snapshot.recentOperations, 0, false);
  if (reducedMotion) return;

  let offset = 0;
  window.setInterval(() => {
    offset = (offset + 1) % snapshot.recentOperations.length;
    renderOperations(rows, snapshot.recentOperations, offset, true);
  }, 30000);
}
