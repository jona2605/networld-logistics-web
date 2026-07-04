import { initPageMotion } from "./reveal.js";
import { initSiteShell } from "./site-shell.js";
import { initGlobalSearch } from "./global-search.js";
import { initGlobalStatus } from "./global-status.js";

const operations = [
  {
    id: "OPERACIÓN #0248",
    title: "Maquinaria industrial",
    origin: "Shenzhen, China",
    destination: "San Salvador",
    type: "Marítimo FCL",
    status: "Entregado",
    time: "28 días",
    documentation: "Completa",
    complexity: "Alta",
    savings: "12%",
    progress: 100,
    stages: ["Proveedor confirmado", "Puerto origen", "Transporte internacional", "Aduana", "Liberación", "Entrega final"]
  },
  {
    id: "OPERACIÓN #0257",
    title: "Carga farmacéutica",
    origin: "Miami, USA",
    destination: "San Salvador",
    type: "Aéreo",
    status: "Entregado",
    time: "5 días",
    documentation: "Permisos especiales",
    complexity: "Crítica",
    savings: "8%",
    progress: 100,
    stages: ["Proveedor validado", "AWB emitido", "Vuelo internacional", "Aduana prioritaria", "Liberación", "Entrega final"]
  },
  {
    id: "OPERACIÓN #0262",
    title: "Retail consolidado",
    origin: "Valencia, España",
    destination: "Acajutla",
    type: "Marítimo LCL",
    status: "Finalizado",
    time: "24 días",
    documentation: "Controlada",
    complexity: "Media",
    savings: "10%",
    progress: 100,
    stages: ["Consolidación", "Puerto origen", "Tránsito marítimo", "Aduana", "Liberación", "Distribución"]
  },
  {
    id: "OPERACIÓN #0271",
    title: "Tecnología empresarial",
    origin: "Los Ángeles, USA",
    destination: "San Salvador",
    type: "Aéreo consolidado",
    status: "Entregado",
    time: "7 días",
    documentation: "Completa",
    complexity: "Media",
    savings: "9%",
    progress: 100,
    stages: ["Proveedor", "Warehouse", "Transporte aéreo", "Aduana", "Liberación", "Entrega final"]
  },
  {
    id: "OPERACIÓN #0280",
    title: "Reabastecimiento regional",
    origin: "Panamá",
    destination: "San Salvador",
    type: "Regional",
    status: "Entregado",
    time: "4 días",
    documentation: "Liberada",
    complexity: "Baja",
    savings: "7%",
    progress: 100,
    stages: ["Orden lista", "Recolecta", "Cruce regional", "Aduana", "Liberación", "Entrega final"]
  },
  {
    id: "OPERACIÓN #0294",
    title: "Proyecto industrial europeo",
    origin: "Hamburgo, Alemania",
    destination: "Acajutla",
    type: "Marítimo FCL",
    status: "Finalizado",
    time: "31 días",
    documentation: "Completa",
    complexity: "Alta",
    savings: "11%",
    progress: 100,
    stages: ["Proveedor", "Puerto Hamburgo", "Ruta marítima", "Aduana", "Liberación", "Entrega final"]
  }
];

const sectors = [
  ["Retail", "Reposición, inventario y alta rotación."],
  ["Industrial", "Maquinaria, repuestos y líneas productivas."],
  ["Farmacéutica", "Permisos, trazabilidad y prioridad."],
  ["Tecnología", "Carga sensible y coordinación rápida."],
  ["Alimentos", "Control sanitario y tiempos críticos."],
  ["Automotriz", "Partes, repuestos y abastecimiento."],
  ["Textil", "Temporadas, distribución y consolidación."]
];

const testimonials = [
  {
    company: "Empresa regional de retail",
    country: "El Salvador",
    service: "Marítimo LCL",
    result: "Entrega sin fricción documental",
    status: "Cerrado",
    comment: "El seguimiento nos permitió anticipar documentos y coordinar distribución con mayor claridad."
  },
  {
    company: "Importador farmacéutico",
    country: "El Salvador",
    service: "Aéreo",
    result: "Liberación prioritaria",
    status: "Cerrado",
    comment: "La coordinación de permisos y tiempos fue clave para cumplir la ventana de entrega."
  },
  {
    company: "Operador industrial",
    country: "Centroamérica",
    service: "FCL + Aduanas",
    result: "Proyecto entregado",
    status: "Cerrado",
    comment: "Tuvimos visibilidad del proceso completo y un ejecutivo acompañando cada hito operativo."
  }
];

const caseGrid = document.querySelector("[data-case-grid]");
const detailTitle = document.querySelector("[data-detail-title]");
const detailStatus = document.querySelector("[data-detail-status]");
const detailFlow = document.querySelector("[data-detail-flow]");
const sectorGrid = document.querySelector("[data-sector-grid]");
const testimonialGrid = document.querySelector("[data-testimonial-grid]");

initSiteShell();
initGlobalSearch();
initGlobalStatus();

function renderOperations() {
  if (!caseGrid) return;

  caseGrid.innerHTML = operations.map((operation, index) => `
    <article class="case-card${index === 0 ? " is-active" : ""}" data-cases-card data-operation-index="${index}">
      <div class="case-card-top"><strong>${operation.id}</strong><span>${operation.status}</span></div>
      <h3>${operation.title}</h3>
      <dl>
        <div><dt>Origen</dt><dd>${operation.origin}</dd></div>
        <div><dt>Destino</dt><dd>${operation.destination}</dd></div>
        <div><dt>Tipo</dt><dd>${operation.type}</dd></div>
        <div><dt>Tiempo total</dt><dd>${operation.time}</dd></div>
        <div><dt>Documentación</dt><dd>${operation.documentation}</dd></div>
        <div><dt>Complejidad</dt><dd>${operation.complexity}</dd></div>
        <div><dt>Ahorro estimado</dt><dd>${operation.savings}</dd></div>
      </dl>
      <div class="case-progress" aria-hidden="true"><i style="width:${operation.progress}%"></i></div>
      <button type="button" data-operation-select="${index}">Ver operación</button>
    </article>
  `).join("");
}

function renderDetail(operation) {
  if (!operation || !detailTitle || !detailStatus || !detailFlow) return;

  detailTitle.textContent = `${operation.id} · ${operation.title}`;
  detailStatus.textContent = operation.status;
  detailFlow.innerHTML = operation.stages.map((stage, index) => `
    <article class="detail-step">
      <i aria-hidden="true"></i>
      <div><strong>${stage}</strong><span>${operation.origin} → ${operation.destination}</span></div>
      <small>${String(index + 1).padStart(2, "0")}</small>
    </article>
  `).join("");
}

function renderSectors() {
  if (!sectorGrid) return;

  sectorGrid.innerHTML = sectors.map(([title, description]) => `
    <article class="sector-card" data-cases-card>
      <div class="sector-icon" aria-hidden="true"></div>
      <h3>${title}</h3>
      <p>${description}</p>
    </article>
  `).join("");
}

function renderTestimonials() {
  if (!testimonialGrid) return;

  testimonialGrid.innerHTML = testimonials.map(item => `
    <article class="testimonial-panel" data-cases-card>
      <div class="testimonial-head"><strong>${item.company}</strong><span>${item.status}</span></div>
      <dl>
        <div><dt>País</dt><dd>${item.country}</dd></div>
        <div><dt>Servicio</dt><dd>${item.service}</dd></div>
        <div><dt>Resultado</dt><dd>${item.result}</dd></div>
      </dl>
      <blockquote>${item.comment}</blockquote>
    </article>
  `).join("");
}

function bindOperationSelection() {
  document.querySelectorAll("[data-operation-index]").forEach(card => {
    const selectOperation = () => {
      const operation = operations[Number(card.dataset.operationIndex)];
      document.querySelectorAll("[data-operation-index]").forEach(item => item.classList.toggle("is-active", item === card));
      renderDetail(operation);
    };

    card.addEventListener("click", selectOperation);
  });
}

renderOperations();
renderSectors();
renderTestimonials();
renderDetail(operations[0]);
bindOperationSelection();

initPageMotion({
  revealSelector: "[data-cases-reveal]",
  cardSelector: "[data-cases-card]",
  counterSelector: "[data-cases-count]",
  counterDataset: "casesCount",
  glowSelector: ".cases-command-panel, .mission-map, .case-card, .detail-panel, .kpi-grid article, .sector-card, .testimonial-panel, .cases-final-card",
  cardOptions: { delay: 70, maxDelay: 360 }
});
