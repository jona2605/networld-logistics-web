import { initPageMotion } from "./reveal.js";
import { initSiteShell, NETWORLD } from "./site-shell.js";
import { initGlobalSearch } from "./global-search.js";
import { initGlobalStatus } from "./global-status.js";

const logicTrackUrl = NETWORLD.logicTrackUrl;
const logicTrackLinks = document.querySelectorAll("[data-logictrack-link]");

initSiteShell();
initGlobalSearch();
initGlobalStatus();

logicTrackLinks.forEach(link => {
  link.setAttribute("href", logicTrackUrl);
});

initPageMotion({
  revealSelector: "[data-portal-reveal]",
  cardSelector: "[data-portal-card]",
  glowSelector: ".portal-access-panel, .access-steps, .portal-final-card",
  revealOptions: { delay: 100 },
  cardOptions: { delay: 80, maxDelay: 360 }
});
