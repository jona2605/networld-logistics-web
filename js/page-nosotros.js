import { initPageMotion } from "./reveal.js";
import { initSiteShell } from "./site-shell.js";
import { initGlobalSearch } from "./global-search.js";
import { initGlobalStatus } from "./global-status.js";

initSiteShell();
initGlobalSearch();
initGlobalStatus();

initPageMotion({
  revealSelector: "[data-about-reveal]",
  cardSelector: "[data-about-card]",
  counterSelector: "[data-about-count]",
  counterDataset: "aboutCount",
  glowSelector: ".about-command, .manifesto-panel, .client-timeline, .metric-card, .coverage-map, .coverage-content, .team-console, .about-final-card",
  cardOptions: { delay: 80 }
});
