const OPERATIONS_POOL = [
  ["CN", "Shenzhen", "San Salvador", "Maritimo FCL", "En transito", "Embarque monitoreado"],
  ["CN", "Shanghai", "San Salvador", "Aereo consolidado", "Conexion internacional", "Ruta activa"],
  ["CN", "Ningbo", "Acajutla", "Maritimo LCL", "Consolidacion confirmada", "Documentacion"],
  ["HK", "Hong Kong", "San Salvador", "Carga aerea", "Conexion internacional", "En transito"],
  ["SG", "Singapore", "Acajutla", "Maritimo FCL", "Transbordo programado", "Coordinacion portuaria"],
  ["KR", "Busan", "Acajutla", "Maritimo FCL", "Salida de puerto", "Embarque confirmado"],
  ["US", "Miami", "San Salvador", "Aereo consolidado", "Aduana liberada", "Entrega final"],
  ["US", "Miami", "Santa Tecla", "Carga consolidada", "Distribucion local", "Ruta asignada"],
  ["US", "Houston", "San Salvador", "Carga aerea", "Clasificacion validada", "En proceso"],
  ["US", "Los Angeles", "Acajutla", "Maritimo FCL", "Reserva confirmada", "En preparacion"],
  ["US", "Long Beach", "Acajutla", "Maritimo LCL", "Ingreso a terminal", "En proceso"],
  ["US", "New York", "San Salvador", "Carga aerea", "Conexion regional", "En transito"],
  ["PA", "Panama", "San Salvador", "Regional", "Ultima milla", "Ruta asignada"],
  ["PA", "Colon", "Acajutla", "Maritimo regional", "Transito de canal", "En transito"],
  ["DE", "Hamburgo", "Acajutla", "Maritimo FCL", "Documentacion de origen", "Documentacion"],
  ["NL", "Rotterdam", "Acajutla", "Maritimo europeo", "Embarque confirmado", "En transito"],
  ["BE", "Amberes", "Acajutla", "Maritimo LCL", "Consolidacion europea", "En proceso"],
  ["ES", "Valencia", "Acajutla", "LCL consolidado", "En proceso", "Coordinacion portuaria"],
  ["ES", "Madrid", "San Salvador", "Carga aerea", "Recepcion en terminal", "En transito"],
  ["CO", "Cartagena", "Acajutla", "Conexion portuaria", "Coordinacion regional", "En transito"],
  ["CO", "Bogota", "San Salvador", "Carga aerea", "Permisos aprobados", "Clasificacion validada"],
  ["PE", "Callao", "Acajutla", "Maritimo regional", "ETA confirmado", "En transito"],
  ["BR", "Santos", "Acajutla", "Maritimo FCL", "Inspeccion completada", "En proceso"],
  ["MX", "Manzanillo", "Acajutla", "Maritimo regional", "Escala operativa", "En transito"],
  ["MX", "Ciudad de Mexico", "San Salvador", "Carga aerea", "Clasificacion validada", "En proceso"],
  ["SV", "Acajutla", "San Salvador", "Transporte terrestre", "Despacho autorizado", "Entrega final"],
  ["SV", "Aeropuerto SAL", "Santa Ana", "Distribucion terrestre", "Ruta asignada", "En curso"],
  ["CL", "San Antonio", "Acajutla", "Maritimo regional", "Carga recibida", "En preparacion"],
  ["AR", "Buenos Aires", "San Salvador", "Carga aerea", "Conexion confirmada", "En transito"],
  ["JP", "Tokyo", "Los Angeles", "Carga aerea", "Transferencia internacional", "En curso"],
  ["CN", "Shenzhen", "Miami", "Aereo consolidado", "Conexion confirmada", "En transito"],
  ["CN", "Shanghai", "Rotterdam", "Maritimo FCL", "Cruce intercontinental", "Embarque confirmado"],
  ["DE", "Hamburgo", "Miami", "Carga aerea", "Conexion Atlantica", "En transito"],
  ["ES", "Valencia", "Panama", "Maritimo LCL", "Transbordo programado", "En proceso"],
  ["NL", "Rotterdam", "Cartagena", "Maritimo europeo", "Escala confirmada", "Coordinacion portuaria"],
  ["US", "Houston", "Ciudad de Mexico", "Regional", "Ruta asignada", "En curso"],
  ["CO", "Cartagena", "Callao", "Maritimo regional", "Coordinacion regional", "En transito"],
  ["AE", "Dubai", "Rotterdam", "Maritimo FCL", "Conexion intermodal", "En preparacion"],
  ["SG", "Singapore", "Los Angeles", "Maritimo FCL", "Reserva confirmada", "En transito"],
  ["HN", "Puerto Cortes", "San Salvador", "Regional", "Despacho autorizado", "Ultima milla"]
].map(([countryCode, origin, destination, mode, detail, status]) => ({
  countryCode,
  origin,
  destination,
  mode,
  detail,
  status,
  phase: status
}));

let cachedSnapshot;
let cachedBlock;

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function stableShuffle(items, random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function getTimeBlock(date = new Date()) {
  return Math.floor(date.getTime() / (3 * 60 * 60 * 1000));
}

function formatUpdated(seconds) {
  return `Actualizado hace ${seconds} segundo${seconds === 1 ? "" : "s"}`;
}

export function getCurrentOperationsSnapshot(date = new Date()) {
  const block = getTimeBlock(date);
  if (cachedSnapshot && cachedBlock === block) return cachedSnapshot;

  const random = seededRandom(block ^ 0x4e57534c);
  const recentOperations = stableShuffle(OPERATIONS_POOL, random);
  const updatedAgo = 7 + Math.floor(random() * 4) * 7;

  cachedBlock = block;
  cachedSnapshot = {
    block,
    activeOperations: 16 + Math.floor(random() * 9),
    connectedCountries: 4 + Math.floor(random() * 4),
    averageEta: `${(2.1 + random() * 0.7).toFixed(1)} dias`,
    onTimeRate: `${(97.8 + random() * 1.3).toFixed(1)}%`,
    updatedAgo,
    lastUpdatedText: formatUpdated(updatedAgo),
    recentOperations
  };

  return cachedSnapshot;
}

export function getUpdatedText(seconds) {
  return formatUpdated(seconds);
}
