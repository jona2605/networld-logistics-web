const SEARCH_ITEMS = [
  { title: "Inicio", category: "Páginas", description: "Volver a la landing principal de Networld Logistics.", url: "/", keywords: "home landing networld" },
  { title: "Servicios", category: "Páginas", description: "Portafolio de servicios logísticos internacionales.", url: "/servicios/", keywords: "transporte aduanas tracking asesoria" },
  { title: "Nosotros", category: "Páginas", description: "Criterio operativo y atención personalizada.", url: "/nosotros/", keywords: "empresa enfoque valores equipo" },
  { title: "Contacto", category: "Páginas", description: "Inicia una operación con el equipo de Networld.", url: "/contacto/", keywords: "cotizar whatsapp correo operacion" },
  { title: "Trámites aduanales en El Salvador", category: "Servicios", description: "Gestión documental, requisitos, DUCA y acompañamiento para liberación de carga.", url: "/tramites-aduanales-el-salvador/", keywords: "aduana aduanales duca permisos importacion liberacion el salvador" },
  { title: "Transporte marítimo en El Salvador", category: "Servicios", description: "Coordinación de carga FCL y LCL desde origen hasta entrega.", url: "/transporte-maritimo-el-salvador/", keywords: "maritimo fcl lcl contenedor acajutla flete el salvador" },
  { title: "Carga desde China a El Salvador", category: "Servicios", description: "Coordinación marítima o aérea, documentos y preparación aduanal desde China.", url: "/carga-desde-china-a-el-salvador/", keywords: "china shenzhen shanghai importaciones carga el salvador" },
  { title: "Carga desde Estados Unidos a El Salvador", category: "Servicios", description: "Coordinación de origen, transporte, documentos y gestión aduanal desde Estados Unidos.", url: "/carga-desde-estados-unidos-a-el-salvador/", keywords: "estados unidos usa miami importacion compras flete el salvador" },
  { title: "Transporte aéreo en El Salvador", category: "Servicios", description: "Carga aérea, documentos, seguimiento y coordinación de arribo.", url: "/transporte-aereo-el-salvador/", keywords: "aereo carga urgente aeropuerto flete importacion el salvador" },
  { title: "Transporte terrestre en Centroamérica", category: "Servicios", description: "Coordinación regional, fronteras y entrega terrestre.", url: "/transporte-terrestre-centroamerica/", keywords: "terrestre regional guatemala honduras duca centroamerica" },
  { title: "Logística para pymes en El Salvador", category: "Servicios", description: "Coordinación de importaciones, documentos y rutas para pymes.", url: "/logistica-para-pymes-el-salvador/", keywords: "pymes emprendedores importacion asesoria logistica el salvador" },
  { title: "Portal LogicTrack", category: "Páginas", description: "Portal privado para clientes activos.", url: "https://logicstrack-app.web.app", external: true, keywords: "portal cliente tracking documentos" },
  { title: "Transporte marítimo", category: "Servicios", description: "FCL, LCL, puertos y rutas internacionales.", url: "/servicios/#maritimo", keywords: "ocean freight barco contenedor fcl lcl" },
  { title: "Transporte aéreo", category: "Servicios", description: "Carga urgente, prioritaria y consolidada.", url: "/servicios/#aereo", keywords: "air cargo avion urgente" },
  { title: "Transporte terrestre", category: "Servicios", description: "Distribución regional y entrega final.", url: "/servicios/#terrestre", keywords: "camion regional ultima milla" },
  { title: "Trámites aduanales", category: "Servicios", description: "Documentación, permisos y liberación aduanera.", url: "/servicios/#aduanas", keywords: "aduana permisos clasificacion partidas" },
  { title: "Seguimiento de carga", category: "Servicios", description: "Tracking operativo de documentos, tránsito y entrega.", url: "/servicios/#tracking", keywords: "tracking rastreo seguimiento logictrack" },
  { title: "Aduanas", category: "Servicios", description: "Coordinación documental, permisos y liberación.", url: "/servicios/#aduanas", keywords: "aduanero duca permisos partidas" }
];

const QUICK_ACTIONS = [
  { title: "Cotizar operación", category: "Acciones rápidas", description: "Abrir WhatsApp con solicitud de cotización.", url: "https://wa.me/50374209546?text=Hola%2C%20quiero%20cotizar%20una%20operaci%C3%B3n%20log%C3%ADstica", external: true, keywords: "cotizar precio operacion" },
  { title: "Hablar por WhatsApp", category: "Acciones rápidas", description: "Contactar a un especialista de Networld.", url: "https://wa.me/50374209546?text=Hola%2C%20quiero%20hablar%20con%20un%20especialista%20de%20Networld", external: true, keywords: "whatsapp asesor especialista" },
  { title: "Acceder a LogicTrack", category: "Acciones rápidas", description: "Ir al portal privado para clientes activos.", url: "https://logicstrack-app.web.app", external: true, keywords: "portal logictrack clientes" }
];

const ALL_ITEMS = [...QUICK_ACTIONS, ...SEARCH_ITEMS];

let activeIndex = 0;
let currentItems = [];
let lastFocusedElement = null;
let triggerButtons = [];

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function resolveUrl(item) {
  if (item.external) return item.url;
  return new URL(item.url, window.location.origin).href;
}

function scoreItem(item, query) {
  if (!query) return item.category === "Acciones rápidas" ? 4 : 2;
  const haystack = normalize(`${item.title} ${item.category} ${item.description} ${item.keywords || ""}`);
  const title = normalize(item.title);
  if (title === query) return 100;
  if (title.startsWith(query)) return 70;
  if (haystack.includes(query)) return 35;
  return 0;
}

function getMatches(query) {
  const normalizedQuery = normalize(query.trim());
  return ALL_ITEMS
    .map(item => ({ ...item, score: scoreItem(item, normalizedQuery) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 18);
}

function iconFor(item) {
  const map = {
    "Acciones rápidas": "↗",
    "Páginas": "⌘",
    "Servicios": "S",
    "Herramientas": "H",
    "Recursos": "R",
    "Academia": "A"
  };
  return map[item.category] || "N";
}

function grouped(items) {
  return items.reduce((groups, item) => {
    if (!groups.has(item.category)) groups.set(item.category, []);
    groups.get(item.category).push(item);
    return groups;
  }, new Map());
}

function renderResults(root, items) {
  const body = root.querySelector("[data-command-body]");
  const empty = root.querySelector("[data-command-empty]");
  currentItems = items;
  activeIndex = Math.min(activeIndex, Math.max(items.length - 1, 0));

  if (!items.length) {
    body.innerHTML = "";
    empty.classList.add("is-visible");
    return;
  }

  empty.classList.remove("is-visible");
  let itemIndex = 0;

  body.innerHTML = Array.from(grouped(items)).map(([category, groupItems]) => `
    <section class="command-group" aria-label="${category}">
      <h3 class="command-group__title">${category}</h3>
      <div class="command-results">
        ${groupItems.map(item => {
          const index = itemIndex++;
          return `
            <button id="command-item-${index}" class="command-item${index === activeIndex ? " is-active" : ""}" type="button" role="option" aria-selected="${index === activeIndex ? "true" : "false"}" data-command-index="${index}">
              <span class="command-item__icon" aria-hidden="true">${iconFor(item)}</span>
              <span>
                <strong>${item.title}</strong>
                <span>${item.description}</span>
              </span>
              <small>${item.external ? "Externo" : "Abrir"}</small>
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `).join("");
  root.querySelector("[data-command-input]")?.setAttribute("aria-activedescendant", `command-item-${activeIndex}`);
}

function updateActive(root, nextIndex) {
  if (!currentItems.length) return;
  activeIndex = (nextIndex + currentItems.length) % currentItems.length;
  root.querySelectorAll("[data-command-index]").forEach(button => {
    const isActive = Number(button.dataset.commandIndex) === activeIndex;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    if (isActive) button.scrollIntoView({ block: "nearest" });
  });
  root.querySelector("[data-command-input]")?.setAttribute("aria-activedescendant", `command-item-${activeIndex}`);
}

function navigateTo(item) {
  if (!item) return;
  if (item.external) {
    window.open(resolveUrl(item), "_blank", "noopener,noreferrer");
    return;
  }
  window.location.href = resolveUrl(item);
}

function createPalette() {
  const root = document.createElement("div");
  root.className = "command-palette";
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.setAttribute("aria-label", "Buscador global");
  root.id = "command-palette";
  root.innerHTML = `
    <div class="command-palette__dialog" role="document">
      <div class="command-palette__header">
        <label>
          <span>Buscar</span>
          <input class="command-palette__input" type="search" role="combobox" aria-controls="command-results" aria-expanded="true" aria-autocomplete="list" placeholder="Servicios, contacto, LogicTrack..." autocomplete="off" data-command-input>
        </label>
        <button class="command-palette__close" type="button" aria-label="Cerrar búsqueda" data-command-close>×</button>
      </div>
      <div class="command-palette__body" id="command-results" role="listbox" data-command-body></div>
      <p class="command-palette__empty" data-command-empty>No encontramos resultados para esa búsqueda.</p>
      <div class="command-palette__footer" aria-label="Atajos de teclado">
        <span><kbd>↑</kbd> <kbd>↓</kbd> Navegar</span>
        <span><kbd>Enter</kbd> Abrir</span>
        <span><kbd>Esc</kbd> Cerrar</span>
      </div>
    </div>
  `;
  document.body.appendChild(root);
  return root;
}

function injectTrigger(openPalette) {
  document.querySelectorAll(".atlas-navbar").forEach(navbar => {
    if (navbar.querySelector("[data-global-search-trigger]")) return;

    const button = document.createElement("button");
    button.className = "global-search-trigger";
    button.type = "button";
    button.dataset.globalSearchTrigger = "true";
    button.innerHTML = `
      <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
        <circle cx="11" cy="11" r="6"></circle>
        <path d="m16 16 4 4"></path>
      </svg>
      <kbd>Ctrl K</kbd>
    `;
    button.setAttribute("aria-label", "Abrir búsqueda global");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", "command-palette");
    button.addEventListener("click", openPalette);

    const cta = navbar.querySelector(".nav-cta");
    navbar.insertBefore(button, cta || null);
  });
}

function getFocusableElements(root) {
  return Array.from(root.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'))
    .filter(element => element.offsetParent !== null || element === document.activeElement);
}

function setBackgroundState(isOpen) {
  document.body.classList.toggle("is-command-open", isOpen);
  document.querySelectorAll("main").forEach(main => {
    if (isOpen) {
      main.setAttribute("inert", "");
      main.setAttribute("aria-hidden", "true");
    } else {
      main.removeAttribute("inert");
      main.removeAttribute("aria-hidden");
    }
  });
  triggerButtons.forEach(button => button.setAttribute("aria-expanded", String(isOpen)));
}

export function initGlobalSearch() {
  if (window.__networldGlobalSearchReady) return;
  window.__networldGlobalSearchReady = true;

  const palette = createPalette();
  const input = palette.querySelector("[data-command-input]");
  const dialog = palette.querySelector(".command-palette__dialog");

  const openPalette = () => {
    lastFocusedElement = document.activeElement;
    palette.classList.add("is-open");
    setBackgroundState(true);
    activeIndex = 0;
    input.value = "";
    renderResults(palette, getMatches(""));
    window.setTimeout(() => input.focus(), 0);
  };

  const closePalette = () => {
    palette.classList.remove("is-open");
    setBackgroundState(false);
    input.value = "";
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  };

  injectTrigger(openPalette);
  triggerButtons = Array.from(document.querySelectorAll("[data-global-search-trigger]"));

  dialog?.addEventListener("pointermove", event => {
    const rect = dialog.getBoundingClientRect();
    dialog.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    dialog.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  });

  input.addEventListener("input", () => {
    activeIndex = 0;
    renderResults(palette, getMatches(input.value));
  });

  palette.addEventListener("click", event => {
    if (event.target === palette || event.target.closest("[data-command-close]")) {
      closePalette();
      return;
    }

    const itemButton = event.target.closest("[data-command-index]");
    if (itemButton) navigateTo(currentItems[Number(itemButton.dataset.commandIndex)]);
  });

  document.addEventListener("keydown", event => {
    const isMac = navigator.platform.toUpperCase().includes("MAC");
    const commandPressed = isMac ? event.metaKey : event.ctrlKey;

    if (commandPressed && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openPalette();
      return;
    }

    if (!palette.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closePalette();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      updateActive(palette, activeIndex + 1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      updateActive(palette, activeIndex - 1);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      navigateTo(currentItems[activeIndex]);
      return;
    }

    if (event.key === "Tab") {
      const focusable = getFocusableElements(palette);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  renderResults(palette, getMatches(""));
}

initGlobalSearch();
