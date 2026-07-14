function createSvgElement(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}

function createAmbientOverlay() {
  const container = document.createElement("div");
  container.className = "hero-premium-network";
  container.setAttribute("aria-hidden", "true");

  const svg = createSvgElement("svg");
  svg.setAttribute("viewBox", "0 0 800 640");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `
    <g class="premium-globe-grid">
      <ellipse cx="400" cy="320" rx="282" ry="282" />
      <ellipse cx="400" cy="320" rx="216" ry="282" />
      <ellipse cx="400" cy="320" rx="126" ry="282" />
      <path d="M118 320H682" />
      <path d="M148 226C260 250 540 250 652 226" />
      <path d="M148 414C260 390 540 390 652 414" />
      <path d="M400 38V602" />
    </g>
    <g class="premium-geo-haze">
      <path d="M174 238C242 172 354 142 464 168C538 185 608 236 630 316C574 270 490 252 404 272C330 290 248 288 174 238Z" />
      <path d="M188 392C270 346 360 360 430 410C498 460 570 444 630 398C596 506 492 592 374 578C282 566 216 498 188 392Z" />
      <path d="M470 154C550 164 620 214 652 294C602 278 552 260 520 220C502 198 484 176 470 154Z" />
    </g>
  `;

  container.appendChild(svg);
  return container;
}

export function initHeroPremium() {
  const page = document.querySelector(".atlas-page");
  const hero = document.querySelector(".atlas-hero");
  const center = hero?.querySelector(".hero-center");
  if (!page || !hero || !center || center.querySelector(".hero-premium-network")) return;

  page.classList.add("has-hero-premium-2");
  hero.classList.add("hero-premium-2");
  center.appendChild(createAmbientOverlay());

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let ticking = false;
  const updateScrollProgress = () => {
    const rect = hero.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height * 0.72, 1)));
    hero.style.setProperty("--hero-scroll-progress", progress.toFixed(3));
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateScrollProgress);
  }, { passive: true });
  updateScrollProgress();
}
