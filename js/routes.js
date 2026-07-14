import * as THREE from "three";
import { latLngToVector } from "./earth.js";

const EARTH_RADIUS = 1.535;
const TRAIL_POINTS = 52;
const ROUTE_COLORS = {
  primaryBlue: 0x9feeff,
  primaryGreen: 0x22c93c,
  secondaryBlue: 0x4caff4,
  secondaryGreen: 0x43d6a1
};
const HUB_COLORS = {
  port: 0x22c93c,
  airport: 0x4caff4,
  center: 0xffffff
};

function point(lat, lon, radius = EARTH_RADIUS) {
  return latLngToVector(lat, lon, radius);
}

function createRouteCurve(routePoints, altitude) {
  const segments = [];

  for (let index = 0; index < routePoints.length - 1; index += 1) {
    const start = routePoints[index].clone().normalize().multiplyScalar(EARTH_RADIUS + 0.014);
    const end = routePoints[index + 1].clone().normalize().multiplyScalar(EARTH_RADIUS + 0.014);
    const angularDistance = start.angleTo(end);
    const segmentLift = Math.min(altitude, 0.045 + angularDistance * altitude * 0.52);
    const midpoint = start.clone()
      .add(end)
      .normalize()
      .multiplyScalar(EARTH_RADIUS + segmentLift);

    segments.push(new THREE.QuadraticBezierCurve3(start, midpoint, end));
  }

  return segments;
}

function getCurvePoint(segments, progress) {
  const normalized = THREE.MathUtils.clamp(progress, 0, 0.999999);
  const scaled = normalized * segments.length;
  const segmentIndex = Math.min(Math.floor(scaled), segments.length - 1);
  return segments[segmentIndex].getPointAt(scaled - segmentIndex);
}

function createTrailGeometry(color, strength = 1) {
  const positions = new Float32Array(TRAIL_POINTS * 3);
  const colors = new Float32Array(TRAIL_POINTS * 3);
  const routeColor = new THREE.Color(color);

  for (let index = 0; index < TRAIL_POINTS; index += 1) {
    const fade = index / (TRAIL_POINTS - 1);
    const intensity = (0.035 + Math.pow(fade, 1.28) * 0.965) * strength;
    colors[index * 3] = routeColor.r * intensity;
    colors[index * 3 + 1] = routeColor.g * intensity;
    colors[index * 3 + 2] = routeColor.b * intensity;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geometry;
}

function createTrail(route) {
  const visualScale = route.level === 1 ? 1.18 : route.level === 2 ? 0.88 : 0.64;
  const group = new THREE.Group();
  const glowGeometry = createTrailGeometry(route.color, route.level === 1 ? 0.82 : 0.64);
  const coreGeometry = createTrailGeometry(route.color, 1);
  const particleGeometry = createTrailGeometry(route.color, 1);
  const glowMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true
  });
  const coreMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true
  });
  const glow = new THREE.Line(glowGeometry, glowMaterial);
  const core = new THREE.Line(coreGeometry, coreMaterial);
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.018 + visualScale * 0.012,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  const headMaterial = new THREE.MeshBasicMaterial({
    color: route.color,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true
  });
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.01 + visualScale * 0.008, 12, 12), headMaterial);
  const haloMaterial = headMaterial.clone();
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(0.028 + visualScale * 0.024, 12, 12),
    haloMaterial
  );
  const destinationMaterial = headMaterial.clone();
  const destinationPulse = new THREE.Mesh(
    new THREE.RingGeometry(0.012, 0.022, 24),
    destinationMaterial
  );

  haloMaterial.opacity = 0;
  destinationMaterial.opacity = 0;
  glow.renderOrder = 4;
  core.renderOrder = 5;
  particles.renderOrder = 5;
  halo.renderOrder = 5;
  head.renderOrder = 6;
  destinationPulse.renderOrder = 6;
  group.add(glow, core, particles, halo, head, destinationPulse);

  return {
    group,
    core,
    glow,
    particles,
    head,
    halo,
    destinationPulse,
    materials: {
      core: coreMaterial,
      glow: glowMaterial,
      particles: particleMaterial,
      head: headMaterial,
      halo: haloMaterial,
      destination: destinationMaterial
    }
  };
}

function createBaseTrace(route) {
  const positions = [];
  const samplesPerSegment = 20;

  route.segments.forEach((segment, segmentIndex) => {
    for (let index = 0; index <= samplesPerSegment; index += 1) {
      if (segmentIndex > 0 && index === 0) continue;
      const position = segment.getPointAt(index / samplesPerSegment);
      positions.push(position.x, position.y, position.z);
    }
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.LineBasicMaterial({
    color: route.color,
    transparent: true,
    opacity: route.level === 1 ? 0.26 : route.level === 2 ? 0.145 : 0.068,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true
  });
  const line = new THREE.Line(geometry, material);
  line.renderOrder = 3;
  line.userData.baseOpacity = material.opacity;
  return line;
}

function updateTrail(route, visual = route.visual, progress = route.progress) {
  const start = Math.max(0, progress - route.tailLength);
  const span = Math.max(progress - start, 0.0001);
  const destination = getCurvePoint(route.segments, 0.999);

  [visual.core, visual.glow, visual.particles].forEach(line => {
    const positions = line.geometry.attributes.position.array;
    for (let index = 0; index < TRAIL_POINTS; index += 1) {
      const local = index / (TRAIL_POINTS - 1);
      const trailProgress = start + span * local;
      const position = getCurvePoint(route.segments, trailProgress);
      positions[index * 3] = position.x;
      positions[index * 3 + 1] = position.y;
      positions[index * 3 + 2] = position.z;
    }
    line.geometry.attributes.position.needsUpdate = true;
  });

  const headPosition = getCurvePoint(route.segments, progress);
  visual.head.position.copy(headPosition);
  visual.halo.position.copy(headPosition);
  visual.destinationPulse.position.copy(destination);
  visual.destinationPulse.lookAt(destination.clone().multiplyScalar(1.3));
}

function setRouteVisibility(route, visibility, visual = route.visual, progress = route.progress, strength = 1) {
  const premiumSupport = route.premiumMode ? 1.18 : 1;
  const level = route.level === 1 ? 1.16 : route.level === 2 ? 0.9 : 0.62;
  const opacity = visibility * strength * premiumSupport;
  visual.materials.core.opacity = opacity * level;
  visual.materials.glow.opacity = 0.68 * opacity * level;
  visual.materials.particles.opacity = opacity * level;
  visual.materials.head.opacity = 0.95 * opacity;
  visual.materials.halo.opacity = 0.22 * opacity * level;

  const arrival = THREE.MathUtils.smoothstep(progress, 0.86, 1);
  visual.materials.destination.opacity = arrival * (1 - arrival) * 0.55 * opacity;
  visual.destinationPulse.scale.setScalar(0.72 + arrival * 1.45);
}

function createHubMarker(color, size, phase) {
  const group = new THREE.Group();
  const coreMaterial = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true
  });
  const haloMaterial = coreMaterial.clone();
  haloMaterial.opacity = 0.09;
  const ringMaterial = coreMaterial.clone();
  ringMaterial.opacity = 0.24;
  const core = new THREE.Mesh(new THREE.SphereGeometry(size, 10, 10), coreMaterial);
  const halo = new THREE.Mesh(new THREE.SphereGeometry(size * 3.2, 10, 10), haloMaterial);
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(size * 1.8, size * 2.45, 24),
    ringMaterial
  );
  ring.renderOrder = 7;
  group.add(halo, ring, core);
  group.userData = { coreMaterial, haloMaterial, ringMaterial, ring, phase, size };
  return group;
}

function createLabelStem(normal, color) {
  const geometry = new THREE.BufferGeometry().setFromPoints([
    normal.clone().multiplyScalar(EARTH_RADIUS + 0.02),
    normal.clone().multiplyScalar(EARTH_RADIUS + 0.12)
  ]);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true
  });
  const stem = new THREE.Line(geometry, material);
  stem.renderOrder = 8;
  return stem;
}

function createHubLabel(title, subtitle, color) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 112;
  const context = canvas.getContext("2d");
  const accent = `#${new THREE.Color(color).getHexString()}`;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.shadowColor = "rgba(76, 175, 244, 0.38)";
  context.shadowBlur = 18;
  const glass = context.createLinearGradient(18, 8, 494, 100);
  glass.addColorStop(0, "rgba(4, 31, 55, 0.96)");
  glass.addColorStop(0.58, "rgba(2, 18, 35, 0.9)");
  glass.addColorStop(1, "rgba(1, 9, 21, 0.84)");
  context.fillStyle = glass;
  context.strokeStyle = "rgba(159, 238, 255, 0.5)";
  context.lineWidth = 2;
  context.beginPath();
  context.roundRect(18, 8, 476, 92, 18);
  context.fill();
  context.stroke();
  context.shadowBlur = 0;
  const accentLine = context.createLinearGradient(18, 20, 18, 90);
  accentLine.addColorStop(0, accent);
  accentLine.addColorStop(1, "rgba(76, 175, 244, 0.12)");
  context.fillStyle = accentLine;
  context.beginPath();
  context.roundRect(18, 22, 4, 62, 2);
  context.fill();
  context.fillStyle = accent;
  context.shadowColor = accent;
  context.shadowBlur = 12;
  context.beginPath();
  context.arc(48, 54, 7, 0, Math.PI * 2);
  context.fill();
  context.shadowBlur = 0;
  context.fillStyle = "#f4fbff";
  context.font = "600 26px Poppins, Arial, sans-serif";
  context.fillText(title, 70, 47);
  context.fillStyle = "#9feeff";
  context.font = "400 17px Poppins, Arial, sans-serif";
  context.fillText(subtitle, 70, 75);
  context.fillStyle = "rgba(34, 201, 60, 0.9)";
  context.font = "600 13px Poppins, Arial, sans-serif";
  context.fillText("LIVE", 430, 31);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0,
    depthTest: true,
    depthWrite: false
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.78, 0.1705, 1);
  sprite.renderOrder = 9;
  return sprite;
}

export function createRoutes(earthGroup, camera) {
  const premiumMode = document.querySelector(".atlas-hero")?.classList.contains("hero-premium-2") || false;
  const locations = {
    shenzhen: point(22.5431, 114.0579),
    shanghai: point(31.2304, 121.4737),
    singapore: point(1.3521, 103.8198),
    busan: point(35.1796, 129.0756),
    miami: point(25.7617, -80.1918),
    losAngeles: point(34.0522, -118.2437),
    houston: point(29.7604, -95.3698),
    newYork: point(40.7128, -74.006),
    panama: point(8.9824, -79.5199),
    hamburg: point(53.5511, 9.9937),
    valencia: point(39.4699, -0.3763),
    rotterdam: point(51.9244, 4.4777),
    sanSalvador: point(13.6929, -89.2182),
    acajutla: point(13.5928, -89.8398),
    cartagena: point(10.391, -75.4794),
    callao: point(-12.0464, -77.1428),
    santos: point(-23.9608, -46.3336),
    mexicoCity: point(19.4326, -99.1332),
    dubai: point(25.2048, 55.2708),
    lagos: point(6.5244, 3.3792),
    dakar: point(14.7167, -17.4677),
    mombasa: point(-4.0435, 39.6682),
    durban: point(-29.8587, 31.0218),
    northPacific: point(33, 168),
    centralPacific: point(17, -145),
    eastPacific: point(13, -111),
    northAtlantic: point(43, -35),
    midAtlantic: point(18, -40),
    caribbean: point(16, -67),
    southAtlantic: point(-10, -30),
    indianOcean: point(-15, 75)
  };

  // Three route levels keep the network global without flattening its hierarchy.
  const routeDefinitions = [
    { id: "sz-sv", points: ["shenzhen", "centralPacific", "sanSalvador"], type: "air", level: 1, primary: true, color: ROUTE_COLORS.primaryBlue },
    { id: "sh-sv", points: ["shanghai", "northPacific", "losAngeles", "sanSalvador"], type: "air", level: 1, primary: true, color: ROUTE_COLORS.primaryBlue },
    { id: "mia-sv", points: ["miami", "sanSalvador"], type: "air", level: 1, primary: true, color: ROUTE_COLORS.primaryGreen },
    { id: "lax-aca", points: ["losAngeles", "acajutla"], type: "air", level: 1, primary: true, color: ROUTE_COLORS.primaryBlue },
    { id: "hou-sv", points: ["houston", "sanSalvador"], type: "air", level: 1, primary: true, color: ROUTE_COLORS.primaryGreen },
    { id: "pty-sv", points: ["panama", "sanSalvador"], type: "regional", level: 1, primary: true, color: ROUTE_COLORS.primaryGreen },
    { id: "ctg-aca", points: ["cartagena", "panama", "acajutla"], type: "sea", level: 1, primary: true, color: ROUTE_COLORS.secondaryGreen },
    { id: "vlc-aca", points: ["valencia", "midAtlantic", "caribbean", "acajutla"], type: "sea", level: 1, primary: true, color: ROUTE_COLORS.secondaryGreen },
    { id: "ham-aca", points: ["hamburg", "northAtlantic", "caribbean", "acajutla"], type: "sea", level: 1, primary: true, color: ROUTE_COLORS.secondaryBlue },
    { id: "rtm-aca", points: ["rotterdam", "northAtlantic", "caribbean", "acajutla"], type: "sea", level: 1, primary: true, color: ROUTE_COLORS.secondaryBlue },
    { id: "mex-sv", points: ["mexicoCity", "sanSalvador"], type: "regional", level: 1, primary: true, color: ROUTE_COLORS.primaryGreen },
    { id: "cll-aca", points: ["callao", "eastPacific", "acajutla"], type: "sea", level: 1, primary: true, color: ROUTE_COLORS.secondaryBlue },

    { id: "sh-rtm", points: ["shanghai", "dubai", "valencia", "rotterdam"], type: "sea", level: 2, color: ROUTE_COLORS.secondaryBlue },
    { id: "sz-lax", points: ["shenzhen", "northPacific", "losAngeles"], type: "air", level: 2, color: ROUTE_COLORS.secondaryBlue },
    { id: "ham-mia", points: ["hamburg", "northAtlantic", "miami"], type: "air", level: 2, color: ROUTE_COLORS.secondaryBlue },
    { id: "pty-ctg", points: ["panama", "cartagena"], type: "regional", level: 2, color: ROUTE_COLORS.secondaryGreen },
    { id: "vlc-ham", points: ["valencia", "hamburg"], type: "regional", level: 2, color: ROUTE_COLORS.secondaryBlue },
    { id: "hou-mex", points: ["houston", "mexicoCity"], type: "regional", level: 2, color: ROUTE_COLORS.secondaryGreen },
    { id: "bus-lax", points: ["busan", "northPacific", "losAngeles"], type: "sea", level: 2, color: ROUTE_COLORS.secondaryBlue },
    { id: "rtm-vlc", points: ["rotterdam", "valencia"], type: "regional", level: 2, color: ROUTE_COLORS.secondaryBlue },
    { id: "mia-pty", points: ["miami", "panama"], type: "regional", level: 2, color: ROUTE_COLORS.secondaryGreen },
    { id: "ctg-cll", points: ["cartagena", "panama", "callao"], type: "sea", level: 2, color: ROUTE_COLORS.secondaryGreen },

    { id: "rtm-los", points: ["rotterdam", "lagos"], type: "air", level: 3, color: ROUTE_COLORS.secondaryBlue },
    { id: "vlc-dkr", points: ["valencia", "dakar"], type: "sea", level: 3, color: ROUTE_COLORS.secondaryBlue }
  ];
  const altitudeByType = { air: 0.34, sea: 0.14, regional: 0.095 };
  const durationByType = { air: 13.5, sea: 17.5, regional: 11.5 };
  const routes = routeDefinitions.map((definition, index) => {
    const route = {
      ...definition,
      segments: createRouteCurve(
        definition.points.map(key => locations[key]),
        altitudeByType[definition.type] * (0.9 + (index % 3) * 0.09)
      ),
      duration: durationByType[definition.type] + (index % 4) * 0.85,
      tailLength: definition.type === "sea" ? 0.19 : definition.type === "regional" ? 0.16 : 0.24,
      progress: 0,
      phase: (index * 0.137 + (index % 3) * 0.071) % 1,
      visibility: 0,
      lifecycleVisibility: 0,
      premiumMode,
      visual: null,
      baseTrace: null
    };
    route.baseTrace = createBaseTrace(route);
    earthGroup.add(route.baseTrace);
    route.visual = createTrail(route);
    route.visual.group.visible = true;
    earthGroup.add(route.visual.group);
    return route;
  });

  const hubDefinitions = [
    ["shenzhen", "airport", 0.011, "Shenzhen", "China"],
    ["shanghai", "airport", 0.011],
    ["miami", "airport", 0.0115, "Miami", "EE.UU."],
    ["losAngeles", "airport", 0.0105],
    ["houston", "airport", 0.009],
    ["panama", "port", 0.0115],
    ["acajutla", "port", 0.0105, "Acajutla", "El Salvador"],
    ["sanSalvador", "center", 0.011, "El Salvador", "Centro operativo"],
    ["hamburg", "port", 0.0105, "Hamburgo", "Alemania"],
    ["valencia", "port", 0.0095],
    ["rotterdam", "port", 0.011],
    ["cartagena", "port", 0.009],
    ["callao", "port", 0.009],
    ["mexicoCity", "center", 0.009],
    ["lagos", "port", 0.008],
    ["dakar", "port", 0.0075],
    ["mombasa", "port", 0.008],
    ["durban", "port", 0.008]
  ];
  const hubs = hubDefinitions.map(([key, type, size, title, subtitle], index) => {
    const marker = createHubMarker(HUB_COLORS[type], size, index * 0.63);
    const normal = locations[key].clone().normalize();
    marker.position.copy(normal.clone().multiplyScalar(EARTH_RADIUS + 0.012));
    marker.lookAt(normal.clone().multiplyScalar(EARTH_RADIUS + 1));
    earthGroup.add(marker);
    const label = title ? createHubLabel(title, subtitle, HUB_COLORS[type]) : null;
    const stem = title ? createLabelStem(normal, HUB_COLORS[type]) : null;
    if (label) {
      label.position.copy(normal.clone().multiplyScalar(EARTH_RADIUS + 0.17));
      label.visible = false;
      stem.visible = false;
      earthGroup.add(label, stem);
    }
    return { marker, label, stem, normal, title };
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.matchMedia("(max-width: 720px)").matches;
  const maxActive = reducedMotion ? (mobile ? 4 : 8) : mobile ? 6 : 12;
  const maxLabels = mobile ? 2 : 5;
  return function animateRoutes(delta = 0.016, elapsed = performance.now() * 0.001) {
    hubs.forEach(({ marker }) => {
      const { coreMaterial, haloMaterial, ringMaterial, ring, phase } = marker.userData;
      const pulse = 0.86 + Math.sin(elapsed * 1.65 + phase) * 0.14;
      marker.scale.setScalar(reducedMotion ? 0.94 : pulse);
      coreMaterial.opacity = 0.78 + pulse * 0.16;
      haloMaterial.opacity = 0.065 + pulse * 0.035;
      ringMaterial.opacity = 0.14 + pulse * 0.12;
      ring.scale.setScalar(0.86 + pulse * 0.3);
    });

    routes.forEach((route, index) => {
      route.progress = reducedMotion
        ? 0.12 + (index % 7) * 0.115
        : (elapsed / route.duration + route.phase) % 1;
      const fadeIn = THREE.MathUtils.smoothstep(route.progress, 0.015, 0.1);
      const fadeOut = 1 - THREE.MathUtils.smoothstep(route.progress, 0.88, 0.985);
      route.lifecycleVisibility = fadeIn * fadeOut;
      updateTrail(route);
      const traceBreath = reducedMotion ? 0.82 : 0.78 + Math.sin(elapsed * 0.48 + index * 0.71) * 0.18;
      route.baseTrace.material.opacity = route.baseTrace.userData.baseOpacity * traceBreath * (premiumMode ? 0.72 : 1);
    });

    earthGroup.updateMatrixWorld(true);
    const cameraDirection = camera.position.clone().normalize();
    const routeCandidates = routes
      .map(route => {
        const worldPosition = route.visual.head.getWorldPosition(new THREE.Vector3());
        return {
          route,
          score: worldPosition.normalize().dot(cameraDirection) + (route.level === 1 ? 0.1 : route.level === 2 ? 0.035 : 0)
        };
      })
      .filter(item => item.score > -0.66)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxActive);
    const visibleRouteSet = new Set(routeCandidates.map(item => item.route));

    routes.forEach(route => {
      const target = visibleRouteSet.has(route) ? 1 : 0;
      const response = reducedMotion ? 1 : Math.min(1, delta * (target ? 2.6 : 1.9));
      route.visibility = THREE.MathUtils.lerp(route.visibility, target, response);
      setRouteVisibility(route, route.visibility * route.lifecycleVisibility);
    });

    const labelCandidates = hubs
      .filter(hub => hub.label)
      .map(hub => {
        const worldPosition = hub.marker.getWorldPosition(new THREE.Vector3());
        const projected = worldPosition.clone().project(camera);
        return {
          hub,
          score: worldPosition.normalize().dot(cameraDirection),
          screen: new THREE.Vector2(projected.x, projected.y)
        };
      })
      .filter(item => item.score > 0.3 && (mobile || item.screen.x > -0.04))
      .sort((a, b) => b.score - a.score);
    const visibleLabels = [];
    labelCandidates.forEach(candidate => {
      const hasCollision = visibleLabels.some(selected =>
        selected.screen.distanceTo(candidate.screen) < (mobile ? 0.34 : 0.2)
      );
      if (!hasCollision && visibleLabels.length < maxLabels) visibleLabels.push(candidate);
    });
    const visibleLabelSet = new Set(visibleLabels.map(item => item.hub));

    hubs.forEach(hub => {
      if (!hub.label) return;
      const shouldShow = visibleLabelSet.has(hub);
      hub.label.visible = shouldShow;
      hub.stem.visible = shouldShow;
      hub.label.material.opacity = shouldShow
        ? THREE.MathUtils.lerp(hub.label.material.opacity, 0.86, reducedMotion ? 1 : 0.08)
        : 0;
      hub.stem.material.opacity = shouldShow ? 0.34 : 0;
    });
  };
}
