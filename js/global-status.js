const STATUS_STATE = {
  operations: 18,
  regions: 4,
  onTime: "98.7%",
  updatedAgo: 14
};

function formatUpdated(seconds) {
  return `Actualizado hace ${seconds} segundo${seconds === 1 ? "" : "s"}`;
}

function createStatusBar() {
  const bar = document.createElement("div");
  bar.className = "global-status";
  bar.setAttribute("role", "region");
  bar.setAttribute("aria-label", "Estado operativo global");
  bar.innerHTML = `
    <div class="global-status__track">
      <span class="global-status__item is-primary"><i class="global-status__dot" aria-hidden="true"></i>Centro operativo activo</span>
      <i class="global-status__divider" aria-hidden="true"></i>
      <span class="global-status__item"><strong data-status-operations>${STATUS_STATE.operations}</strong> operaciones monitoreadas</span>
      <i class="global-status__divider optional-mobile" aria-hidden="true"></i>
      <span class="global-status__item optional-mobile"><strong data-status-regions>${STATUS_STATE.regions}</strong> regiones conectadas</span>
      <i class="global-status__divider optional-mobile" aria-hidden="true"></i>
      <span class="global-status__item optional-mobile"><strong data-status-ontime>${STATUS_STATE.onTime}</strong> entregas a tiempo</span>
      <i class="global-status__divider" aria-hidden="true"></i>
      <span class="global-status__item global-status__time" data-status-updated>${formatUpdated(STATUS_STATE.updatedAgo)}</span>
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

function updateStatus(bar) {
  const updated = bar.querySelector("[data-status-updated]");

  window.setInterval(() => {
    STATUS_STATE.updatedAgo = STATUS_STATE.updatedAgo >= 28 ? 3 : STATUS_STATE.updatedAgo + 7;
    if (updated) updated.textContent = formatUpdated(STATUS_STATE.updatedAgo);
  }, 7000);
}

export function initGlobalStatus() {
  if (window.__networldGlobalStatusReady) return;
  window.__networldGlobalStatusReady = true;

  document.querySelectorAll(".atlas-navbar").forEach(navbar => {
    if (navbar.nextElementSibling?.classList.contains("global-status")) return;

    const bar = createStatusBar();
    navbar.insertAdjacentElement("afterend", bar);
    bindGlow(bar);
    updateStatus(bar);
  });
}

initGlobalStatus();
