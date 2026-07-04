import { bindPointerGlow, observeReveal } from "./reveal.js";

export const NETWORLD = {
  siteUrl: "https://networldslogistics.com",
  logicTrackUrl: "https://logicstrack-app.web.app",
  email: "aduana@networldslogistics.com",
  phoneDisplay: "+503 7420 9546",
  phoneCompact: "50374209546",
  company: "Networld Logistics"
};

export function whatsappUrl(message) {
  return `https://wa.me/${NETWORLD.phoneCompact}?text=${encodeURIComponent(message)}`;
}

function isInternalLanding() {
  const path = window.location.pathname.replace(/\/index\.html$/, "/");
  return path === "/" || path.endsWith("/networld-v3/");
}

function pathPrefix() {
  return isInternalLanding() ? "" : "../";
}

function route(path) {
  if (path.startsWith("http") || path.startsWith("mailto:")) return path;
  return `${pathPrefix()}${path}`;
}

function ensureSkipLink() {
  if (document.querySelector(".skip-link")) return;
  const main = document.querySelector("main");
  if (!main) return;
  if (!main.id) main.id = "main-content";

  const link = document.createElement("a");
  link.className = "skip-link";
  link.href = `#${main.id}`;
  link.textContent = "Saltar al contenido";
  document.body.insertBefore(link, document.body.firstChild);
}

function initMobileNav() {
  document.querySelectorAll(".atlas-navbar").forEach((navbar, index) => {
    const links = navbar.querySelector(".nav-links");
    const brand = navbar.querySelector(".brand");
    if (!links || !brand || navbar.querySelector("[data-nav-menu-toggle]")) return;

    const linksId = links.id || `main-navigation-${index + 1}`;
    links.id = linksId;

    const toggle = document.createElement("button");
    toggle.className = "nav-menu-toggle";
    toggle.type = "button";
    toggle.dataset.navMenuToggle = "true";
    toggle.setAttribute("aria-controls", linksId);
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir navegacion");
    toggle.innerHTML = "<span></span><span></span><span></span>";
    brand.insertAdjacentElement("afterend", toggle);

    const closeMenu = () => {
      navbar.classList.remove("is-menu-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir navegacion");
    };

    toggle.addEventListener("click", () => {
      const isOpen = navbar.classList.toggle("is-menu-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Cerrar navegacion" : "Abrir navegacion");
      if (isOpen) links.querySelector("a")?.focus({ preventScroll: true });
    });

    links.addEventListener("click", event => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
  });
}

function setLogicTrackLinks() {
  document.querySelectorAll("[data-logictrack-link]").forEach(link => {
    link.setAttribute("href", NETWORLD.logicTrackUrl);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });
}

function normalizeNavbarLinks() {
  document.querySelectorAll(".brand[href='#']").forEach(link => {
    link.setAttribute("href", route("index.html"));
  });

  document.querySelectorAll(".nav-links").forEach(nav => {
    const links = Array.from(nav.querySelectorAll("a"));
    links.forEach(link => {
      const label = link.textContent.trim().toLowerCase();
      if (label === "recursos") link.href = new URL(route("recursos/index.html"), window.location.href).href;
      if (label === "contacto") link.href = new URL(route("contacto/index.html"), window.location.href).href;
      if (label === "portal logictrack") {
        link.href = NETWORLD.logicTrackUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.removeAttribute("aria-current");
      }
    });
  });
}

function footerTemplate() {
  const prefix = pathPrefix();
  return `
    <footer class="site-footer" aria-label="Informacion corporativa de Networld Logistics">
      <div class="footer-particles" aria-hidden="true">
        <span></span><span></span><span></span><span></span><span></span>
      </div>
      <div class="footer-shell">
        <div class="footer-command" data-footer-reveal>
          <div class="footer-brand">
            <a href="${prefix}index.html" aria-label="Networld Logistics">
              <img src="${prefix}img/logotipo1.png" alt="Networld Logistics">
            </a>
            <p>Centro de inteligencia logistica para operaciones internacionales con seguimiento, gestion aduanera y acompanamiento experto.</p>
            <div class="footer-status" aria-label="Estado operativo">
              <i aria-hidden="true"></i>
              <span>Operaciones activas</span>
            </div>
          </div>
          <div class="footer-grid">
            <nav class="footer-column" aria-label="Navegacion">
              <h3>Navegacion</h3>
              <a href="${prefix}servicios/index.html">Servicios</a>
              <a href="${prefix}nosotros/index.html">Nosotros</a>
              <a href="${prefix}recursos/index.html">Recursos</a>
              <a href="${prefix}academia/index.html">Academia</a>
              <a href="${prefix}herramientas/index.html">Herramientas</a>
              <a href="${prefix}casos/index.html">Casos</a>
              <a href="${NETWORLD.logicTrackUrl}" target="_blank" rel="noopener noreferrer">Portal LogicTrack</a>
              <a href="${prefix}contacto/index.html">Contacto</a>
            </nav>
            <nav class="footer-column" aria-label="Servicios">
              <h3>Servicios</h3>
              <a href="${prefix}servicios/index.html#maritimo">Transporte maritimo</a>
              <a href="${prefix}servicios/index.html#aereo">Transporte aereo</a>
              <a href="${prefix}servicios/index.html#servicios-grid">Transporte terrestre</a>
              <a href="${prefix}servicios/index.html#aduanas">Tramites aduanales</a>
              <a href="${prefix}servicios/index.html#tracking">Seguimiento de carga</a>
            </nav>
            <div class="footer-column">
              <h3>Cobertura</h3>
              <span>Asia</span>
              <span>Estados Unidos</span>
              <span>Europa</span>
              <span>Centroamerica</span>
              <span>Sudamerica</span>
            </div>
            <div class="footer-column footer-contact">
              <h3>Contacto</h3>
              <a href="${whatsappUrl("Hola, quiero contactar a Networld Logistics")}" target="_blank" rel="noopener noreferrer">WhatsApp ${NETWORLD.phoneDisplay}</a>
              <a href="mailto:${NETWORLD.email}">${NETWORLD.email}</a>
              <a href="${NETWORLD.logicTrackUrl}" target="_blank" rel="noopener noreferrer">Portal LogicTrack</a>
              <span>Lunes a Viernes</span>
              <span>8:00 AM - 5:30 PM</span>
            </div>
          </div>
        </div>
        <div class="footer-bottom" data-footer-reveal>
          <p>&copy; 2026 Networld Logistics. Todos los derechos reservados.</p>
          <div class="footer-social" aria-label="Canales de contacto">
            <a href="mailto:${NETWORLD.email}" aria-label="Correo">mail</a>
            <a href="${whatsappUrl("Hola, quiero contactar a Networld Logistics")}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">wa</a>
            <a href="${prefix}contacto/index.html" aria-label="Contacto">ct</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

function normalizeFooter() {
  document.querySelectorAll("footer").forEach(footer => {
    if (footer.classList.contains("site-footer")) {
      return;
    }
    if (footer.className.includes("page-footer")) {
      footer.outerHTML = footerTemplate();
    }
  });

  observeReveal(document.querySelectorAll(".site-footer [data-footer-reveal]"), {
    threshold: 0.08,
    rootMargin: "0px 0px 14% 0px",
    delay: 120,
    maxDelay: 240
  });
  bindPointerGlow(document.querySelectorAll(".site-footer .footer-command"));
}

function initExternalActionEvents() {
  document.addEventListener("click", event => {
    const action = event.target.closest("[data-integration-action], [data-tool-action]");
    if (!action) return;
    document.dispatchEvent(new CustomEvent("networld:integration-action", {
      detail: {
        action: action.dataset.integrationAction,
        label: action.textContent.trim(),
        href: action.getAttribute("href") || null,
        source: window.location.pathname
      }
    }));
  });
}

export function initSiteShell() {
  if (window.__networldSiteShellReady) return;
  window.__networldSiteShellReady = true;

  ensureSkipLink();
  normalizeNavbarLinks();
  initMobileNav();
  setLogicTrackLinks();
  normalizeFooter();
  initExternalActionEvents();
}

initSiteShell();
