import * as THREE from "three";
import { latLngToVector } from "./earth.js";
import { createCargoPlane } from "./airplane.js";
import { createContainerShip } from "./ship.js";

const ROUTE_RADIUS = 1.535;
const HUB_COLORS = {
  port: 0x22c93c,
  airport: 0x4caff4,
  center: 0xffffff
};
const ROUTE_LAYERS = {
  near: { radius: 1.555, height: 1.68, opacity: 0.48 },
  mid: { radius: 1.69, height: 1.98, opacity: 0.36 },
  far: { radius: 1.82, height: 2.28, opacity: 0.14 }
};
const ROUTE_WEIGHTS = {
  primary: { thickness: 0.0028, opacity: 1 },
  secondary: { thickness: 0.00155, opacity: 0.58 },
  background: { thickness: 0.0009, opacity: 0.26 }
};

function hub(lat, lon, radius = ROUTE_RADIUS) {
  return latLngToVector(lat, lon, radius);
}

function liftPoints(points, radius) {
  return points.map(point => point.clone().normalize().multiplyScalar(radius));
}

function createDataPulse(color = 0x4caff4, radius = 0.009) {
  const group = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 12, 12),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.96,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 3.3, 12, 12),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.09,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );

  group.add(core, halo);
  group.userData = { core, halo };
  return group;
}

function createHubMarker(color, profile) {
  const group = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(profile.radius, 12, 12),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: profile.coreOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(profile.radius * profile.haloScale, 14, 14),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: profile.haloOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(profile.radius * 1.9, profile.radius * 2.35, 22),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: profile.ringOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    })
  );

  ring.rotation.x = Math.PI / 2;
  group.add(halo, ring, core);
  group.userData = { core, halo, ring, profile };
  return group;
}

function hubProfile(tier = "medium") {
  const profiles = {
    major: { radius: 0.0098, haloScale: 4.1, coreOpacity: 0.98, haloOpacity: 0.12, ringOpacity: 0.22, pulseDepth: 0.2, pulseSpeed: 1.55 },
    medium: { radius: 0.0074, haloScale: 3.45, coreOpacity: 0.92, haloOpacity: 0.08, ringOpacity: 0.13, pulseDepth: 0.16, pulseSpeed: 1.75 },
    small: { radius: 0.0056, haloScale: 3.1, coreOpacity: 0.82, haloOpacity: 0.055, ringOpacity: 0.08, pulseDepth: 0.12, pulseSpeed: 1.95 }
  };

  return profiles[tier] || profiles.medium;
}

function createRoutePath(points, height) {
  const segments = [];

  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    const mid = new THREE.Vector3()
      .addVectors(start, end)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(height);

    segments.push(new THREE.QuadraticBezierCurve3(start, mid, end));
  }

  return segments;
}

function getRoutePoint(segments, t) {
  const scaled = t * segments.length;
  const index = Math.min(Math.floor(scaled), segments.length - 1);
  const localT = scaled - index;
  return segments[index].getPointAt(localT);
}

function createRouteTrace(segments, color, opacity, thickness) {
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  segments.forEach(segment => {
    group.add(new THREE.Mesh(
      new THREE.TubeGeometry(segment, 28, thickness, 5, false),
      material
    ));
  });

  group.userData = { material, baseOpacity: opacity };
  return group;
}

function intensitySettings(level = "secondary") {
  const settings = {
    primary: { trace: 0.95, pulse: 0.92, count: [0, 0.22, 0.47, 0.73] },
    secondary: { trace: 0.52, pulse: 0.74, count: [0, 0.31, 0.66] },
    background: { trace: 0.2, pulse: 0.54, count: [0, 0.46] }
  };

  return settings[level] || settings.secondary;
}

function routeHeightLimit(type) {
  return type === "air" ? 2.22 : type === "sea" ? 1.86 : 1.92;
}

function createOrbitalNode(color = 0x9feeff) {
  const group = new THREE.Group();
  const node = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.017, 0),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(0.052, 12, 12),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.045,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );

  group.add(halo, node);
  return group;
}

function orientAlongRoute(object, segments, t) {
  const pos = getRoutePoint(segments, t);
  const next = getRoutePoint(segments, Math.min(t + 0.006, 0.999));
  const prev = getRoutePoint(segments, Math.max(t - 0.006, 0.001));
  const turn = next.clone().sub(pos).normalize().cross(pos.clone().sub(prev).normalize()).dot(pos.clone().normalize());
  const isShip = object.userData.vehicleType === "ship";
  const bank = isShip ? 0.08 : 1.8;
  const maxBank = isShip ? 0.08 : 0.34;

  object.up.copy(pos.clone().normalize());
  object.position.copy(pos);
  object.lookAt(next);
  object.rotateZ(THREE.MathUtils.clamp(turn * bank, -maxBank, maxBank));
}

function addRoute(earthGroup, routes, config, routeIndex) {
  const intensity = intensitySettings(config.intensity);
  const visibilityBoost = config.intensity === "primary" ? 1.35 : config.intensity === "secondary" ? 1.65 : 1.45;
  const layer = ROUTE_LAYERS[
    config.layer || (config.intensity === "background" ? "far" : config.type === "air" ? "mid" : "near")
  ];
  const weight = ROUTE_WEIGHTS[config.intensity || "secondary"];
  const routePoints = liftPoints(config.points, layer.radius);
  const routeHeight = Math.min(config.height ?? layer.height, routeHeightLimit(config.type));
  const segments = createRoutePath(routePoints, routeHeight);
  const vehicleSegments = config.loopPoints
    ? createRoutePath(liftPoints(config.loopPoints, layer.radius), routeHeight)
    : segments;
  const baseOpacity = config.traceOpacity * layer.opacity * weight.opacity * intensity.trace * visibilityBoost;
  const trace = createRouteTrace(segments, config.color, baseOpacity, config.thickness || weight.thickness);
  const offsets = config.particles || config.pulseOffsets ? (config.pulseOffsets || intensity.count) : [];
  const pulses = offsets.map(offset => {
    const pulse = createDataPulse(config.color, config.pulseRadius * intensity.pulse);
    earthGroup.add(pulse);
    return { mesh: pulse, offset };
  });
  const vehicle = config.vehicleFactory?.();

  earthGroup.add(trace);
  if (vehicle) earthGroup.add(vehicle);

  routes.push({
    ...config,
    segments,
    vehicleSegments,
    pulses,
    vehicle,
    t: config.start ?? routeIndex * 0.13,
    lastT: config.start ?? routeIndex * 0.13,
    dashboard: config.dashboard,
    trace,
    baseOpacity,
    fadeSpeed: config.fadeSpeed ?? (config.type === "air" ? 0.34 : 0.22),
    fadePhase: config.fadePhase ?? routeIndex * 0.73,
    minVisibility: config.minVisibility ?? (config.intensity === "primary" ? 0.34 : config.intensity === "secondary" ? 0.16 : 0.04)
  });
}


export function createRoutes(earthGroup) {
  const routes = [];
  const cityMarkers = [];
  const orbitalNodes = [];

  const points = {
    shenzhen: hub(22.5431, 114.0579),
    shanghai: hub(31.2304, 121.4737),
    ningbo: hub(29.8683, 121.544),
    singapore: hub(1.3521, 103.8198),
    busan: hub(35.1796, 129.0756),
    hongKong: hub(22.3193, 114.1694),
    tokyo: hub(35.6762, 139.6503),
    dubai: hub(25.2048, 55.2708),
    doha: hub(25.2854, 51.531),
    miami: hub(25.7617, -80.1918),
    houston: hub(29.7604, -95.3698),
    newYork: hub(40.7128, -74.006),
    chicago: hub(41.8781, -87.6298),
    losAngeles: hub(34.0522, -118.2437),
    longBeach: hub(33.7701, -118.1937),
    seattle: hub(47.6061, -122.3328),
    panama: hub(8.9824, -79.5199),
    hamburg: hub(53.5511, 9.9937),
    valencia: hub(39.4699, -0.3763),
    rotterdam: hub(51.9244, 4.4777),
    antwerp: hub(51.2194, 4.4025),
    london: hub(51.5072, -0.1276),
    paris: hub(48.8566, 2.3522),
    sanSalvador: hub(13.6929, -89.2182),
    acajutla: hub(13.5928, -89.8398),
    manzanillo: hub(19.1138, -104.3385),
    callao: hub(-12.0464, -77.1428),
    santos: hub(-23.9608, -46.3336),
    buenaventura: hub(3.8801, -77.0312),
    buenosAires: hub(-34.6037, -58.3816),
    cartagena: hub(10.391, -75.4794),
    bogota: hub(4.711, -74.0721),
    sydney: hub(-33.8688, 151.2093),
    melbourne: hub(-37.8136, 144.9631),
    auckland: hub(-36.8485, 174.7633),
    northPacific: hub(29, 168, 1.57),
    centralPacific: hub(16, -145, 1.565),
    eastPacific: hub(12, -108, 1.56),
    westPacific: hub(8, 142, 1.56),
    northAtlantic: hub(42, -32, 1.56),
    midAtlantic: hub(12, -36, 1.555),
    caribbean: hub(16, -67, 1.555),
    canalAtlantic: hub(10, -79, 1.55),
    southAtlantic: hub(-18, -28, 1.555),
    westSouthAmerica: hub(-10, -86, 1.555)
  };

  const hubSpecs = [
    ["shenzhen", "port", "major"],
    ["shanghai", "port", "major"],
    ["miami", "airport", "major"],
    ["losAngeles", "airport", "major"],
    ["panama", "port", "major"],
    ["acajutla", "port", "medium"],
    ["sanSalvador", "center", "small"],
    ["hamburg", "port", "major"],
    ["valencia", "port", "medium"],
    ["rotterdam", "port", "major"]
  ];
  const routeSpecs = [
    {
      type: "air",
      points: [points.shenzhen, points.centralPacific, points.sanSalvador],
      height: 2.72,
      speed: 0.00275,
      color: 0x9feeff,
      traceOpacity: 0.052,
      pulseRadius: 0.0088,
      vehicleFactory: createCargoPlane,
      loopPoints: [points.shenzhen, points.centralPacific, points.sanSalvador, points.miami, points.northPacific, points.shenzhen],
      intensity: "primary",
      dashboard: { origin: "Shenzhen", destination: "San Salvador", mode: "Carga aerea" },
      particles: true,
      pulseOffsets: [0, 0.34, 0.68],
      start: 0.12
    },
    {
      type: "air",
      points: [points.shenzhen, points.northPacific, points.miami],
      height: 2.82,
      speed: 0.00255,
      color: 0x9feeff,
      traceOpacity: 0.058,
      pulseRadius: 0.008,
      vehicleFactory: createCargoPlane,
      loopPoints: [points.shenzhen, points.northPacific, points.miami, points.losAngeles, points.centralPacific, points.shenzhen],
      intensity: "primary",
      dashboard: { origin: "Shenzhen", destination: "Miami", mode: "Carga consolidada" },
      start: 0.58
    },
    {
      type: "sea",
      points: [points.shenzhen, points.singapore, points.westPacific, points.centralPacific, points.panama],
      height: 1.82,
      speed: 0.00105,
      color: 0x4caff4,
      traceOpacity: 0.055,
      pulseRadius: 0.0076,
      vehicleFactory: createContainerShip,
      loopPoints: [points.shenzhen, points.singapore, points.westPacific, points.centralPacific, points.panama, points.centralPacific, points.westPacific, points.singapore, points.shenzhen],
      intensity: "primary",
      dashboard: { origin: "Shenzhen", destination: "Panama", mode: "Ruta maritima" },
      particles: true,
      start: 0.48,
      pulseOffsets: [0, 0.25, 0.5, 0.75]
    },
    {
      type: "air",
      points: [points.shanghai, points.northPacific, points.losAngeles],
      height: 2.58,
      speed: 0.00265,
      color: 0x9feeff,
      traceOpacity: 0.058,
      pulseRadius: 0.0084,
      intensity: "secondary",
      start: 0.76
    },
    {
      type: "air",
      points: [points.tokyo, points.northPacific, points.seattle, points.chicago],
      height: 2.52,
      speed: 0.00238,
      color: 0x9feeff,
      traceOpacity: 0.048,
      pulseRadius: 0.0076,
      pulseOffsets: [0, 0.24, 0.48, 0.72, 0.9],
      intensity: "secondary",
      start: 0.44
    },
    {
      type: "air",
      points: [points.dubai, points.london, points.miami],
      height: 2.62,
      speed: 0.0021,
      color: 0x9feeff,
      traceOpacity: 0.046,
      pulseRadius: 0.0076,
      intensity: "background",
      start: 0.67
    },
    {
      type: "air",
      points: [points.shanghai, points.northPacific, points.losAngeles, points.sanSalvador],
      height: 2.38,
      speed: 0.00225,
      color: 0x9feeff,
      traceOpacity: 0.052,
      pulseRadius: 0.0078,
      pulseOffsets: [0, 0.22, 0.44, 0.66, 0.88],
      intensity: "secondary",
      start: 0.32
    },
    {
      type: "sea",
      points: [points.busan, points.northPacific, points.longBeach],
      height: 1.74,
      speed: 0.00112,
      color: 0x4caff4,
      traceOpacity: 0.048,
      pulseRadius: 0.007,
      vehicleFactory: createContainerShip,
      loopPoints: [points.busan, points.northPacific, points.longBeach, points.northPacific, points.busan],
      intensity: "primary",
      dashboard: { origin: "Busan", destination: "Long Beach", mode: "Ocean freight" },
      particles: true,
      start: 0.7,
      pulseOffsets: [0, 0.34, 0.68]
    },
    {
      type: "sea",
      points: [points.singapore, points.dubai, points.valencia, points.rotterdam],
      height: 1.78,
      speed: 0.00084,
      color: 0x4caff4,
      traceOpacity: 0.04,
      pulseRadius: 0.0068,
      intensity: "secondary",
      start: 0.58,
      pulseOffsets: [0, 0.27, 0.54, 0.81]
    },
    {
      type: "sea",
      points: [points.hamburg, points.rotterdam, points.northAtlantic, points.canalAtlantic, points.acajutla],
      height: 1.86,
      speed: 0.00086,
      color: 0x4caff4,
      traceOpacity: 0.052,
      pulseRadius: 0.0072,
      vehicleFactory: createContainerShip,
      loopPoints: [points.hamburg, points.rotterdam, points.northAtlantic, points.canalAtlantic, points.acajutla, points.canalAtlantic, points.northAtlantic, points.rotterdam, points.hamburg],
      intensity: "primary",
      dashboard: { origin: "Hamburgo", destination: "Acajutla", mode: "Ocean freight" },
      particles: true,
      start: 0.18,
      pulseOffsets: [0, 0.28, 0.56, 0.84]
    },
    {
      type: "sea",
      points: [points.valencia, points.northAtlantic, points.canalAtlantic, points.acajutla],
      height: 1.82,
      speed: 0.00096,
      color: 0x4caff4,
      traceOpacity: 0.048,
      pulseRadius: 0.007,
      intensity: "secondary",
      start: 0.38,
      pulseOffsets: [0, 0.3, 0.6]
    },
    {
      type: "sea",
      points: [points.rotterdam, points.northAtlantic, points.caribbean, points.panama],
      height: 1.8,
      speed: 0.001,
      color: 0x4caff4,
      traceOpacity: 0.046,
      pulseRadius: 0.007,
      intensity: "background",
      start: 0.66,
      pulseOffsets: [0, 0.32, 0.64]
    },
    {
      type: "sea",
      points: [points.antwerp, points.northAtlantic, points.newYork, points.houston],
      height: 1.76,
      speed: 0.00095,
      color: 0x4caff4,
      traceOpacity: 0.036,
      pulseRadius: 0.0067,
      intensity: "background",
      start: 0.14,
      pulseOffsets: [0, 0.31, 0.62, 0.9]
    },
    {
      type: "sea",
      points: [points.santos, points.southAtlantic, points.cartagena, points.panama],
      height: 1.7,
      speed: 0.00092,
      color: 0x4caff4,
      traceOpacity: 0.04,
      pulseRadius: 0.0068,
      intensity: "secondary",
      start: 0.24,
      pulseOffsets: [0, 0.34, 0.68]
    },
    {
      type: "sea",
      points: [points.callao, points.westSouthAmerica, points.panama, points.acajutla],
      height: 1.68,
      speed: 0.001,
      color: 0x4caff4,
      traceOpacity: 0.04,
      pulseRadius: 0.0068,
      intensity: "secondary",
      start: 0.84,
      pulseOffsets: [0, 0.33, 0.66]
    },
    {
      type: "sea",
      points: [points.sydney, points.auckland, points.centralPacific, points.longBeach],
      height: 1.84,
      speed: 0.00088,
      color: 0x4caff4,
      traceOpacity: 0.035,
      pulseRadius: 0.0067,
      intensity: "background",
      start: 0.52,
      pulseOffsets: [0, 0.35, 0.7]
    },
    {
      type: "sea",
      points: [points.melbourne, points.centralPacific, points.callao],
      height: 1.78,
      speed: 0.00082,
      color: 0x4caff4,
      traceOpacity: 0.033,
      pulseRadius: 0.0066,
      intensity: "background",
      start: 0.78,
      pulseOffsets: [0, 0.38, 0.76]
    },
    {
      type: "air",
      points: [points.miami, points.sanSalvador],
      height: 2.12,
      speed: 0.00255,
      color: 0x9feeff,
      traceOpacity: 0.056,
      pulseRadius: 0.0078,
      intensity: "secondary"
    },
    {
      type: "regional",
      points: [points.panama, points.sanSalvador],
      height: 1.75,
      speed: 0.00205,
      color: 0x22c93c,
      traceOpacity: 0.05,
      pulseRadius: 0.007,
      intensity: "secondary",
      particles: true,
      pulseOffsets: [0, 0.34, 0.68]
    },
    {
      type: "regional",
      points: [points.houston, points.miami, points.panama],
      height: 1.92,
      speed: 0.00185,
      color: 0x22c93c,
      traceOpacity: 0.038,
      pulseRadius: 0.0068,
      intensity: "background",
      pulseOffsets: [0, 0.28, 0.56, 0.84]
    },
    {
      type: "regional",
      points: [points.manzanillo, points.acajutla, points.sanSalvador],
      height: 1.62,
      speed: 0.0019,
      color: 0x22c93c,
      traceOpacity: 0.038,
      pulseRadius: 0.0064,
      intensity: "secondary",
      pulseOffsets: [0, 0.34, 0.68]
    },
    {
      type: "regional",
      points: [points.cartagena, points.bogota, points.panama],
      height: 1.58,
      speed: 0.00175,
      color: 0x22c93c,
      traceOpacity: 0.036,
      pulseRadius: 0.0063,
      intensity: "background",
      pulseOffsets: [0, 0.36, 0.72]
    },
    {
      type: "air",
      points: [points.losAngeles, points.sanSalvador],
      height: 2.26,
      speed: 0.00245,
      color: 0x9feeff,
      traceOpacity: 0.054,
      pulseRadius: 0.0078,
      intensity: "secondary"
    },
    {
      type: "sea",
      points: [points.ningbo, points.shanghai, points.busan, points.northPacific, points.longBeach],
      height: 1.78,
      speed: 0.00094,
      color: 0x4caff4,
      traceOpacity: 0.046,
      pulseRadius: 0.0069,
      intensity: "primary",
      particles: true,
      pulseOffsets: [0, 0.32, 0.64],
      fadePhase: 1.1
    },
    {
      type: "sea",
      points: [points.hongKong, points.singapore, points.dubai, points.valencia, points.antwerp],
      height: 1.84,
      speed: 0.00078,
      color: 0x4caff4,
      traceOpacity: 0.04,
      pulseRadius: 0.0066,
      intensity: "secondary",
      pulseOffsets: [0, 0.36, 0.72],
      fadePhase: 2.6
    },
    {
      type: "sea",
      points: [points.rotterdam, points.hamburg, points.northAtlantic, points.newYork],
      height: 1.72,
      speed: 0.00098,
      color: 0x4caff4,
      traceOpacity: 0.038,
      pulseRadius: 0.0065,
      intensity: "secondary",
      pulseOffsets: [0, 0.42, 0.84],
      fadePhase: 3.4
    },
    {
      type: "sea",
      points: [points.buenaventura, points.panama, points.cartagena, points.miami],
      height: 1.64,
      speed: 0.00112,
      color: 0x22c93c,
      traceOpacity: 0.042,
      pulseRadius: 0.0064,
      intensity: "secondary",
      pulseOffsets: [0, 0.38, 0.76],
      fadePhase: 4.2
    },
    {
      type: "sea",
      points: [points.callao, points.buenaventura, points.panama, points.longBeach],
      height: 1.72,
      speed: 0.00092,
      color: 0x22c93c,
      traceOpacity: 0.036,
      pulseRadius: 0.0062,
      intensity: "background",
      pulseOffsets: [0, 0.5],
      fadePhase: 5.1
    },
    {
      type: "air",
      points: [points.hongKong, points.northPacific, points.losAngeles, points.miami],
      height: 2.2,
      speed: 0.00245,
      color: 0x9feeff,
      traceOpacity: 0.052,
      pulseRadius: 0.0076,
      intensity: "primary",
      particles: true,
      pulseOffsets: [0, 0.28, 0.56, 0.84],
      fadeSpeed: 0.38,
      fadePhase: 0.4
    },
    {
      type: "air",
      points: [points.shanghai, points.northPacific, points.newYork],
      height: 2.18,
      speed: 0.00228,
      color: 0x9feeff,
      traceOpacity: 0.044,
      pulseRadius: 0.0072,
      intensity: "secondary",
      pulseOffsets: [0, 0.36, 0.72],
      fadeSpeed: 0.32,
      fadePhase: 2.1
    },
    {
      type: "air",
      points: [points.miami, points.panama, points.cartagena],
      height: 1.92,
      speed: 0.0021,
      color: 0x4caff4,
      traceOpacity: 0.04,
      pulseRadius: 0.0065,
      intensity: "secondary",
      pulseOffsets: [0, 0.4, 0.8],
      fadeSpeed: 0.42,
      fadePhase: 3.7
    },
    {
      type: "regional",
      points: [points.houston, points.miami, points.newYork],
      height: 1.9,
      speed: 0.0019,
      color: 0x22c93c,
      traceOpacity: 0.032,
      pulseRadius: 0.006,
      intensity: "background",
      pulseOffsets: [0, 0.5],
      fadePhase: 4.9
    }
  ];

  routeSpecs.slice(0, 12).forEach((route, index) => addRoute(earthGroup, routes, route, index));

  hubSpecs.forEach(([key, type, tier], index) => {
    const profile = hubProfile(tier);
    const marker = createHubMarker(HUB_COLORS[type], profile);
    const pos = points[key];
    marker.position.copy(pos);
    earthGroup.add(marker);
    cityMarkers.push({ marker, profile, phase: index * 0.58 });
  });

  [
    { color: 0x9feeff, radius: 1.88, tilt: 0.28, speed: 0.18, phase: 0 },
    { color: 0x4caff4, radius: 1.98, tilt: -0.42, speed: -0.13, phase: 1.5 },
    { color: 0x22c93c, radius: 1.82, tilt: 0.74, speed: 0.16, phase: 2.7 },
    { color: 0x9feeff, radius: 2.08, tilt: -0.78, speed: -0.1, phase: 4.1 }
  ].forEach(config => {
    const orbit = new THREE.Group();
    const node = createOrbitalNode(config.color);
    node.position.set(config.radius, 0, 0);
    orbit.rotation.z = config.tilt;
    orbit.rotation.y = config.phase;
    orbit.add(node);
    earthGroup.add(orbit);
    orbitalNodes.push({ orbit, node, speed: config.speed, phase: config.phase });
  });

  return function animateRoutes(delta = 0.016) {
    const frame = performance.now() * 0.001;
    cityMarkers.forEach(({ marker, profile, phase }) => {
      const pulse = 1 - profile.pulseDepth + Math.sin(frame * profile.pulseSpeed + phase) * profile.pulseDepth;
      marker.scale.setScalar(pulse);
      marker.userData.core.material.opacity = profile.coreOpacity * (0.82 + pulse * 0.18);
      marker.userData.halo.material.opacity = profile.haloOpacity * (0.72 + pulse * 0.4);
      marker.userData.ring.material.opacity = profile.ringOpacity * (0.55 + pulse * 0.35);
    });

    orbitalNodes.forEach(({ orbit, node, speed, phase }) => {
      orbit.rotation.y += delta * speed;
      const pulse = 0.84 + Math.sin(frame * 1.8 + phase) * 0.16;
      node.scale.setScalar(pulse);
    });

    routes.forEach(route => {
      route.lastT = route.t;
      route.t += route.speed * delta * 60;
      if (route.t > 1) {
        route.t -= 1;
      }

      const wave = (Math.sin(frame * route.fadeSpeed + route.fadePhase) + 1) * 0.5;
      const easedVisibility = wave * wave * (3 - 2 * wave);
      const visibility = route.minVisibility + (1 - route.minVisibility) * easedVisibility;
      route.trace.userData.material.opacity = route.baseOpacity * visibility;

      route.pulses.forEach(({ mesh, offset }, index) => {
        const t = (route.t + offset) % 1;
        const pulse = 0.76 + Math.sin(frame * (route.type === "sea" ? 2 : 3.4) + index) * 0.18;
        mesh.position.copy(getRoutePoint(route.segments, t));
        mesh.scale.setScalar(pulse);
        mesh.userData.core.material.opacity = (route.type === "air" ? 0.72 + pulse * 0.13 : 0.62 + pulse * 0.12) * visibility;
        mesh.userData.halo.material.opacity = (route.type === "air" ? 0.052 : 0.04) * visibility;
      });

      if (route.vehicle) {
        orientAlongRoute(route.vehicle, route.vehicleSegments, route.t);
      }
    });
  };
}

