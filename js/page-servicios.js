import { initPageMotion } from "./reveal.js";
import { initSiteShell } from "./site-shell.js";
import { initGlobalSearch } from "./global-search.js";
import { initGlobalStatus } from "./global-status.js";

initSiteShell();
initGlobalSearch();
initGlobalStatus();

initPageMotion({
  revealSelector: "[data-service-page-reveal]",
  cardSelector: "[data-service-page-card]",
  glowSelector: ".decision-panel, .advantages-panel, .proof-console",
  revealOptions: { delay: 100 },
  cardOptions: { delay: 80, maxDelay: 360 }
});
