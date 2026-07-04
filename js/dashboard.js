const OPERATIONS = [
  {
    code: "CN",
    route: "Shenzhen → San Salvador",
    detail: "Carga aérea · En tránsito",
    status: "En curso"
  },
  {
    code: "US",
    route: "Miami → San Salvador",
    detail: "Aduana liberada · Entrega final",
    status: "En tránsito"
  },
  {
    code: "DE",
    route: "Hamburgo → Acajutla",
    detail: "Ocean freight · Documentación",
    status: "En preparación"
  },
  {
    code: "ES",
    route: "Valencia → Acajutla",
    detail: "LCL consolidado · En proceso",
    status: "En proceso"
  },
  {
    code: "PA",
    route: "Panamá → San Salvador",
    detail: "Regional · Última milla",
    status: "En curso"
  }
];

function updateMetric(metric, value) {
  if (!metric) return;
  metric.style.opacity = "0.72";
  window.setTimeout(() => {
    metric.textContent = value;
    metric.style.opacity = "1";
  }, 180);
}

function renderOperations(items, offset) {
  const operationNodes = document.querySelectorAll(".recent-ops .op-item");
  operationNodes.forEach((node, index) => {
    const operation = items[(offset + index) % items.length];
    const code = node.querySelector(":scope > span");
    const title = node.querySelector("p");
    const status = node.querySelector("em");

    node.style.opacity = "0.72";
    window.setTimeout(() => {
      if (code) code.textContent = operation.code;
      if (title) title.innerHTML = `${operation.route} <small>${operation.detail}</small>`;
      if (status) status.textContent = operation.status;
      node.style.opacity = "1";
    }, 180 + index * 50);
  });
}

export function initHeroDashboard() {
  const dashboard = document.querySelector(".hero-dashboard");
  if (!dashboard) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const metricValues = [
    ["18", "19", "18"],
    ["4", "4", "5"],
    ["2.4 días", "2.3 días", "2.5 días"],
    ["98.7%", "98.8%", "98.6%"]
  ];
  const metrics = dashboard.querySelectorAll(".dashboard-metrics strong");
  let tick = 0;

  dashboard.querySelectorAll(".dashboard-metrics strong, .op-item").forEach(element => {
    element.style.transition = "opacity .28s ease";
  });

  if (prefersReducedMotion) return;

  window.setInterval(() => {
    tick += 1;
    metrics.forEach((metric, index) => {
      updateMetric(metric, metricValues[index][tick % metricValues[index].length]);
    });
  }, 6500);

  window.setInterval(() => {
    renderOperations(OPERATIONS, tick % OPERATIONS.length);
  }, 7600);
}
