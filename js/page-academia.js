import { initPageMotion } from "./reveal.js";
import { initSiteShell } from "./site-shell.js";
import { initGlobalSearch } from "./global-search.js";
import { initGlobalStatus } from "./global-status.js";

const searchInput = document.querySelector("[data-academy-search]");
const resourceItems = document.querySelectorAll("[data-academy-resource]");
const resultsCount = document.querySelector("[data-academy-results]");

initSiteShell();
initGlobalSearch();
initGlobalStatus();

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function updateResources() {
  const query = normalize(searchInput?.value || "");
  let visibleCount = 0;

  resourceItems.forEach(item => {
    const text = normalize(`${item.dataset.title || ""} ${item.textContent}`);
    const isVisible = !query || text.includes(query);
    item.classList.toggle("is-hidden", !isVisible);
    if (isVisible) visibleCount += 1;
  });

  if (resultsCount) resultsCount.textContent = visibleCount;
}

initPageMotion({
  revealSelector: "[data-academy-reveal]",
  cardSelector: "[data-academy-card]",
  counterSelector: "[data-academy-count]",
  counterDataset: "academyCount",
  glowSelector: ".academy-command-panel, .academy-category-card, .academy-course-card, .academy-library-panel, .academy-video-card, .academy-indicator-grid article, .academy-final-card",
  cardOptions: { delay: 70, maxDelay: 360 }
});

searchInput?.addEventListener("input", updateResources);
updateResources();
