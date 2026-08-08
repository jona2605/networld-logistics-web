function createStatusBar() {
  const bar = document.createElement("div");
  bar.className = "global-status";
  bar.setAttribute("role", "region");
  bar.setAttribute("aria-label", "Estado operativo global");
  bar.innerHTML = `
    <div class="global-status__track">
      <span class="global-status__item is-primary"><i class="global-status__dot" aria-hidden="true"></i>Coordinaci&oacute;n operativa activa &middot; El Salvador</span>
      <span class="global-status__item global-status__time">Atenci&oacute;n: lunes a viernes &middot; 08:00&ndash;17:30</span>
    </div>
  `;
  return bar;
}

function bindGlow(bar) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  bar.addEventListener("pointermove", event => {
    const rect = bar.getBoundingClientRect();
    bar.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    bar.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  });
}

export function initGlobalStatus() {
  if (window.__networldGlobalStatusReady) return;
  window.__networldGlobalStatusReady = true;

  document.querySelectorAll(".atlas-navbar").forEach(navbar => {
    if (navbar.previousElementSibling?.classList.contains("global-status")) return;

    const bar = createStatusBar();
    navbar.insertAdjacentElement("beforebegin", bar);
    bindGlow(bar);
  });
}

initGlobalStatus();
