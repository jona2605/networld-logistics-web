import { initPageMotion } from "./reveal.js";
import { initSiteShell, whatsappUrl } from "./site-shell.js";
import { initGlobalSearch } from "./global-search.js";
import { initGlobalStatus } from "./global-status.js";

const faqItems = document.querySelectorAll(".tools-faq-item");

initSiteShell();
initGlobalSearch();
initGlobalStatus();

initPageMotion({
  revealSelector: "[data-tools-reveal]",
  cardSelector: "[data-tools-card]",
  counterSelector: "[data-tools-count]",
  counterDataset: "toolsCount",
  glowSelector: ".tools-command-panel, .tool-card, .calculator-mockup, .document-grid article, .conversion-panel, .conversion-stack article, .tools-faq-list, .tools-final-card",
  cardOptions: { delay: 70, maxDelay: 360 }
});

faqItems.forEach(item => {
  const button = item.querySelector("button");
  const panel = item.querySelector("p");
  const panelId = panel?.id || `tools-faq-${Array.from(faqItems).indexOf(item) + 1}`;
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

document.querySelectorAll(".tool-card button").forEach(button => {
  const card = button.closest(".tool-card");
  const title = card?.querySelector("h3")?.textContent?.trim() || "herramienta logistica";
  const status = card?.querySelector(".tool-status")?.textContent?.trim() || "Disponible";
  button.addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("networld:tool-request", {
      detail: { title, status, source: window.location.pathname }
    }));
    window.open(
      whatsappUrl(`Hola, quiero solicitar acceso a la herramienta: ${title}. Estado visto en la web: ${status}.`),
      "_blank",
      "noopener"
    );
  });
});
