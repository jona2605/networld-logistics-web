import { initPageMotion } from "./reveal.js";
import { initSiteShell, whatsappUrl } from "./site-shell.js";
import { initGlobalSearch } from "./global-search.js";
import { initGlobalStatus } from "./global-status.js";

const searchInput = document.querySelector("[data-resource-search]");
const filterButtons = document.querySelectorAll("[data-resource-filter]");
const articleCards = document.querySelectorAll(".article-card[data-resource-card]");
const resultsCount = document.querySelector("[data-resource-results]");

let activeFilter = "all";

initSiteShell();
initGlobalSearch();
initGlobalStatus();

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function updateArticles() {
  const query = normalize(searchInput?.value || "");
  let visibleCount = 0;

  articleCards.forEach(card => {
    const title = normalize(card.dataset.title || card.textContent);
    const category = normalize(card.dataset.category || "");
    const matchesQuery = !query || title.includes(query) || category.includes(query);
    const matchesFilter = activeFilter === "all" || category.includes(activeFilter);
    const isVisible = matchesQuery && matchesFilter;

    card.classList.toggle("is-hidden", !isVisible);
    if (isVisible) visibleCount += 1;
  });

  if (resultsCount) resultsCount.textContent = visibleCount;
}

initPageMotion({
  revealSelector: "[data-resource-reveal]",
  cardSelector: "[data-resource-card]",
  counterSelector: "[data-resource-count]",
  counterDataset: "resourceCount",
  glowSelector: ".intel-panel, .resource-search-panel, .article-card, .guide-stack article, .calculator-card, .resources-final-card"
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.resourceFilter || "all";
    filterButtons.forEach(item => item.classList.toggle("is-active", item === button));
    updateArticles();
  });
});

searchInput?.addEventListener("input", updateArticles);

document.querySelectorAll('.resources-page a[href="#"]').forEach(link => {
  const label = link.getAttribute("aria-label") || link.closest("article")?.querySelector("h3")?.textContent || "recurso logistico";
  link.href = whatsappUrl(`Hola, quiero recibir informacion sobre: ${label}`);
  link.target = "_blank";
  link.rel = "noopener";
  link.dataset.integrationAction = "resource-request";
});

updateArticles();
