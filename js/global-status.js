import { getCurrentOperationsSnapshot, getUpdatedText } from "./operations-data.js";

function createStatusBar(snapshot) {
  const bar = document.createElement("div");
  bar.className = "global-status";
  bar.setAttribute("role", "region");
  bar.setAttribute("aria-label", "Estado operativo global");
  bar.innerHTML = `
    <div class="global-status__track">
      <span class="global-status__item is-primary"><i class="global-status__dot" aria-hidden="true"></i>Centro operativo activo</span>
      <i class="global-status__divider" aria-hidden="true"></i>
      <span class="global-status__item"><strong data-status-operations>${snapshot.activeOperations}</strong> operaciones</span>
      <i class="global-status__divider" aria-hidden="true"></i>
      <span class="global-status__item"><strong data-status-countries>${snapshot.connectedCountries}</strong> paises</span>
      <i class="global-status__divider" aria-hidden="true"></i>
      <span class="global-status__item global-status__time" data-status-updated>${snapshot.lastUpdatedText}</span>
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

function updateStatusTime(bar, snapshot) {
  const updated = bar.querySelector("[data-status-updated]");
  if (!updated) return;

  let seconds = snapshot.updatedAgo;
  window.setInterval(() => {
    seconds = seconds >= 35 ? 7 : seconds + 7;
    updated.textContent = getUpdatedText(seconds);
  }, 7000);
}

export function initGlobalStatus() {
  if (window.__networldGlobalStatusReady) return;
  window.__networldGlobalStatusReady = true;

  const snapshot = getCurrentOperationsSnapshot();
  document.querySelectorAll(".atlas-navbar").forEach(navbar => {
    if (navbar.nextElementSibling?.classList.contains("global-status")) return;

    const bar = createStatusBar(snapshot);
    navbar.insertAdjacentElement("afterend", bar);
    bindGlow(bar);
    updateStatusTime(bar, snapshot);
  });
}

initGlobalStatus();
