import { initPageMotion } from "./reveal.js";
import { initSiteShell, NETWORLD } from "./site-shell.js";
import { initGlobalSearch } from "./global-search.js";
import { initGlobalStatus } from "./global-status.js";

const form = document.querySelector("[data-contact-form]");
const formState = document.querySelector("[data-form-state]");
const faqItems = document.querySelectorAll(".faq-item");

initSiteShell();
initGlobalSearch();
initGlobalStatus();

initPageMotion({
  revealSelector: "[data-contact-reveal]",
  cardSelector: "[data-contact-card]",
  counterSelector: "[data-contact-count]",
  counterDataset: "contactCount",
  glowSelector: ".operations-panel, .smart-form, .info-grid article, .world-map-panel, .faq-list, .contact-final-card",
  cardOptions: { maxDelay: 320 }
});

faqItems.forEach(item => {
  const button = item.querySelector("button");
  const panel = item.querySelector("p");
  const panelId = panel?.id || `contact-faq-${Array.from(faqItems).indexOf(item) + 1}`;
  if (panel) {
    panel.id = panelId;
    panel.setAttribute("role", "region");
  }
  button?.setAttribute("aria-controls", panelId);

  button?.addEventListener("click", () => {
    const willOpen = !item.classList.contains("is-open");
    faqItems.forEach(faq => {
      faq.classList.remove("is-open");
      faq.querySelector("button")?.setAttribute("aria-expanded", "false");
    });
    if (willOpen) {
      item.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

form?.addEventListener("input", () => {
  if (!formState) return;
  const completed = Array.from(form.elements).filter(element => {
    if (!("value" in element)) return false;
    return element.type === "checkbox" ? element.checked : element.value.trim();
  }).length;
  formState.textContent = completed > 5 ? "Brief avanzado" : completed > 2 ? "Brief en progreso" : "Preparando brief";
});

form?.addEventListener("submit", event => {
  event.preventDefault();
  if (!form) return;
  const data = new FormData(form);
  const payload = Object.fromEntries(data.entries());
  payload.prioridad = data.get("prioridad") ? "Si" : "No";
  payload.source = window.location.pathname;
  payload.createdAt = new Date().toISOString();

  document.dispatchEvent(new CustomEvent("networld:lead-submit", { detail: payload }));

  try {
    const stored = JSON.parse(localStorage.getItem("networldLeadQueue") || "[]");
    stored.push(payload);
    localStorage.setItem("networldLeadQueue", JSON.stringify(stored.slice(-20)));
  } catch (error) {
    console.warn("Lead queue could not be persisted.", error);
  }

  const subject = encodeURIComponent(`Solicitud de operacion - ${payload.empresa || payload.nombre || "Networld"}`);
  const body = encodeURIComponent(
    Object.entries(payload)
      .map(([key, value]) => `${key}: ${value || "-"}`)
      .join("\n")
  );
  if (formState) formState.textContent = "Solicitud preparada";
  window.location.href = `mailto:${NETWORLD.email}?subject=${subject}&body=${body}`;
});
