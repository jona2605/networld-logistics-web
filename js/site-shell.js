import { bindPointerGlow, observeReveal } from "./reveal.js";

export const NETWORLD = {
  siteUrl: "https://networld-logistics-web.vercel.app",
  logicTrackUrl: "https://logicstrack-app.web.app",
  email: "aduana@networldslogistics.com",
  phoneDisplay: "+503 7420 9546",
  phoneCompact: "50374209546",
  company: "Networld Logistics"
};

// Replace only when the production GA4 property exists. No Analytics script is loaded here.
export const GA4_MEASUREMENT_ID = "G-XXXXXXXXXX";

export function trackEvent(eventName, parameters = {}) {
  if (typeof window.gtag !== "function") return false;

  window.gtag("event", eventName, {
    page_location: window.location.href,
    page_path: window.location.pathname,
    ...parameters
  });
  return true;
}

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
    const current = Array.from(nav.querySelectorAll("a")).find(link => link.getAttribute("aria-current") === "page")?.textContent.trim().toLowerCase();
    const prefix = pathPrefix();
    const pageLink = (href, label, key) => `<a href="${href}"${current === key ? ' aria-current="page"' : ""}>${label}</a>`;

    nav.innerHTML = `
      ${pageLink(`${prefix}servicios/index.html`, "Servicios", "servicios")}
      ${pageLink(`${prefix}nosotros/index.html`, "Nosotros", "nosotros")}
      <div class="nav-dropdown" data-nav-dropdown>
        <button class="nav-dropdown__trigger" type="button" aria-expanded="false" aria-haspopup="true">
          Recursos
          <span aria-hidden="true"></span>
        </button>
        <div class="nav-dropdown__menu" role="menu">
          ${pageLink(`${prefix}recursos/index.html`, "Recursos", "recursos")}
          ${pageLink(`${prefix}academia/index.html`, "Academia", "academia")}
          ${pageLink(`${prefix}herramientas/index.html`, "Herramientas", "herramientas")}
          ${pageLink(`${prefix}casos/index.html`, "Casos", "casos")}
        </div>
      </div>
      ${pageLink(`${prefix}contacto/index.html`, "Contacto", "contacto")}
      <a class="nav-mobile-only" href="${NETWORLD.logicTrackUrl}" target="_blank" rel="noopener noreferrer">Portal LogicTrack</a>
    `;
  });

  document.querySelectorAll(".atlas-navbar").forEach(navbar => {
    if (navbar.querySelector(".nav-portal")) return;
    const portal = document.createElement("a");
    portal.className = "nav-portal";
    portal.href = NETWORLD.logicTrackUrl;
    portal.target = "_blank";
    portal.rel = "noopener noreferrer";
    portal.textContent = "Portal LogicTrack";
    navbar.querySelector(".nav-links")?.insertAdjacentElement("afterend", portal);
  });
}

function initResourceDropdowns() {
  document.querySelectorAll("[data-nav-dropdown]").forEach(dropdown => {
    const trigger = dropdown.querySelector(".nav-dropdown__trigger");
    if (!trigger || dropdown.dataset.bound === "true") return;
    dropdown.dataset.bound = "true";

    const close = () => {
      dropdown.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    };

    trigger.addEventListener("click", event => {
      event.stopPropagation();
      const isOpen = dropdown.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(isOpen));
    });

    dropdown.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;
      close();
      trigger.focus({ preventScroll: true });
    });

    document.addEventListener("click", event => {
      if (!dropdown.contains(event.target)) close();
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
    const link = event.target.closest("a[href]");
    if (link) {
      const href = link.href;
      const label = link.textContent.trim();
      const normalizedLabel = label.toLowerCase();
      const quoteIntent = /cotizar|cotizaci|planificar|coordinar|evaluar|especialista|estrategia|documentos|visibilidad/.test(normalizedLabel);
      let eventName = null;

      if (href.startsWith("mailto:")) {
        eventName = "click_email";
      } else if (href.includes("logicstrack-app.web.app")) {
        eventName = normalizedLabel.includes("portal") ? "click_portal" : "click_logictrack";
      } else if (href.includes("wa.me/")) {
        eventName = quoteIntent ? "click_quote" : "click_whatsapp";
      }

      if (eventName) {
        trackEvent(eventName, {
          link_text: label,
          link_url: href,
          source: window.location.pathname
        });
      }
    }

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
  initResourceDropdowns();
  initMobileNav();
  setLogicTrackLinks();
  normalizeFooter();
  initExternalActionEvents();
}

window.networldTrackEvent = trackEvent;

initSiteShell();
