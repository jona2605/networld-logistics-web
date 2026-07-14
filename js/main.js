import { initScene } from "./scene.js";
import { initHeroPremium } from "./hero-premium.js";
import { initSiteShell } from "./site-shell.js";
import { initServices } from "./services.js";
import { initWorkflow } from "./workflow.js";
import { initGlobalNetwork } from "./global-network.js";
import { initControlCenter } from "./control-center.js";
import { initWhy } from "./why.js";
import { initIndustries } from "./industries.js";
import { initCases } from "./cases.js";
import { initCta } from "./cta.js";
import { initFooter } from "./footer.js";
import { initGlobalSearch } from "./global-search.js";
import { initGlobalStatus } from "./global-status.js";
import { initHeroDashboard } from "./dashboard.js";

initSiteShell();
initGlobalSearch();
initGlobalStatus();

try {
  initHeroPremium();
} catch (error) {
  console.error("Hero Premium 2.0 could not initialize. Base hero remains active.", error);
}

try {
  initScene();
} catch (error) {
  console.error("Hero scene could not initialize.", error);
}

try {
  initHeroDashboard();
} catch (error) {
  console.error("Hero dashboard could not initialize.", error);
}

try {
  initServices();
} catch (error) {
  console.error("Services section could not initialize.", error);
}

try {
  initWorkflow();
} catch (error) {
  console.error("Workflow section could not initialize.", error);
}

try {
  initGlobalNetwork();
} catch (error) {
  console.error("Global network section could not initialize.", error);
}

try {
  initControlCenter();
} catch (error) {
  console.error("Control center section could not initialize.", error);
}

try {
  initWhy();
} catch (error) {
  console.error("Why Networld section could not initialize.", error);
}

try {
  initIndustries();
} catch (error) {
  console.error("Industries section could not initialize.", error);
}

try {
  initCases();
} catch (error) {
  console.error("Success cases section could not initialize.", error);
}

try {
  initCta();
} catch (error) {
  console.error("Premium CTA section could not initialize.", error);
}

try {
  initFooter();
} catch (error) {
  console.error("Footer could not initialize.", error);
}
