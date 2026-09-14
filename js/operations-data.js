const ROUTE_MODELS = [
  ["CN", "Shenzhen", "Acajutla", "Ruta y documentación", "Ruta monitoreada"],
  ["US", "Miami", "San Salvador", "Conexión y entrega", "Tramo en seguimiento"],
  ["NL", "Rotterdam", "Acajutla", "Hitos marítimos", "Ruta monitoreada"],
  ["DE", "Hamburgo", "Acajutla", "Origen y documentos", "Conexión documentada"],
  ["PA", "Panamá", "San Salvador", "Conexión regional", "Tramo en seguimiento"],
  ["CO", "Cartagena", "Acajutla", "Coordinación portuaria", "Ruta monitoreada"],
  ["US", "Houston", "San Salvador", "Ruta y entrega", "Tramo en seguimiento"],
  ["US", "Los Angeles", "Acajutla", "Origen y conexión", "Conexión documentada"]
].map(([countryCode, origin, destination, detail, status]) => ({
  countryCode,
  origin,
  destination,
  detail,
  status
}));

const STORAGE_KEY = "networld.operations.view.v2";
const VIEW_TTL = 3 * 60 * 60 * 1000;

let cachedView;

function readStoredView(now) {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (
      Number.isInteger(stored?.routeIndex) &&
      stored.routeIndex >= 0 &&
      stored.routeIndex < ROUTE_MODELS.length &&
      Number.isFinite(stored.expiresAt) &&
      stored.expiresAt > now
    ) return stored;
  } catch {
    // Continue with a new visual selection when storage is unavailable or invalid.
  }
  return null;
}

function createView(now) {
  const randomIndex = Math.floor(Math.random() * ROUTE_MODELS.length);
  return {
    routeIndex: randomIndex,
    expiresAt: now + VIEW_TTL
  };
}

function persistView(view) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(view));
  } catch {
    // The in-memory selection still avoids changes during the current visit.
  }
}

export function getCurrentOperationsView(date = new Date()) {
  const now = date.getTime();
  if (!cachedView || cachedView.expiresAt <= now) {
    cachedView = readStoredView(now) || createView(now);
    persistView(cachedView);
  }

  const firstIndex = cachedView.routeIndex;
  const secondIndex = (firstIndex + 1) % ROUTE_MODELS.length;
  return {
    expiresAt: cachedView.expiresAt,
    routes: [ROUTE_MODELS[firstIndex], ROUTE_MODELS[secondIndex]]
  };
}
