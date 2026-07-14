import * as THREE from "three";

function seededRandom(seed) {
  let value = seed;

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function mapPoint(lon, lat, width, height) {
  return [
    ((lon + 180) / 360) * width,
    ((90 - lat) / 180) * height
  ];
}

function drawLandMass(ctx, points, width, height) {
  const [startX, startY] = mapPoint(points[0][0], points[0][1], width, height);

  ctx.beginPath();
  ctx.moveTo(startX, startY);

  for (let i = 1; i < points.length; i += 1) {
    const [x, y] = mapPoint(points[i][0], points[i][1], width, height);
    const [prevX, prevY] = mapPoint(points[i - 1][0], points[i - 1][1], width, height);
    ctx.quadraticCurveTo(prevX, prevY, x, y);
  }

  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawTextureSpeckles(ctx, random, color, count, sizeRange, width, height) {
  ctx.fillStyle = color;

  for (let i = 0; i < count; i += 1) {
    const size = sizeRange[0] + random() * (sizeRange[1] - sizeRange[0]);
    ctx.fillRect(random() * width, random() * height, size, size);
  }
}

function createAtmosphereMaterial(color, opacity, power) {
  return new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(color) },
      opacity: { value: opacity },
      power: { value: power }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vViewPosition = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      uniform float opacity;
      uniform float power;
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      void main() {
        float rim = pow(1.0 - max(dot(vNormal, vViewPosition), 0.0), power);
        gl_FragColor = vec4(glowColor, rim * opacity);
      }
    `,
    transparent: true,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
}

function createDaylightWashMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      tint: { value: new THREE.Color(0xbfeaff) },
      opacity: { value: 0.072 }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vViewPosition = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 tint;
      uniform float opacity;
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      void main() {
        float facing = pow(max(dot(vNormal, vViewPosition), 0.0), 1.85);
        gl_FragColor = vec4(tint, facing * opacity);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
}

function createEarthTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  const random = seededRandom(42);

  const sea = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sea.addColorStop(0, "#0d5a90");
  sea.addColorStop(0.42, "#063b6b");
  sea.addColorStop(1, "#02162b");
  ctx.fillStyle = sea;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 140; i += 1) {
    const x = random() * canvas.width;
    const y = random() * canvas.height;
    const radius = 16 + random() * 70;
    const gradient = ctx.createRadialGradient(x, y, 2, x, y, radius);
    gradient.addColorStop(0, "rgba(76,175,244,0.065)");
    gradient.addColorStop(1, "rgba(76,175,244,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(42, 126, 89, 0.94)";
  ctx.strokeStyle = "rgba(159,238,255,0.16)";
  ctx.lineWidth = 1.1;

  [
    [[-168, 72], [-142, 62], [-125, 50], [-105, 52], [-82, 44], [-66, 30], [-83, 18], [-105, 22], [-124, 32], [-136, 45], [-160, 55]],
    [[-82, 13], [-68, 8], [-56, -8], [-62, -24], [-70, -40], [-65, -55], [-78, -48], [-86, -30], [-82, -10]],
    [[-18, 34], [8, 38], [31, 31], [48, 15], [40, -12], [22, -34], [7, -35], [-9, -18], [-17, 8]],
    [[-10, 72], [22, 68], [50, 58], [76, 54], [102, 44], [126, 34], [146, 46], [170, 58], [160, 23], [128, 9], [104, 2], [78, 19], [52, 11], [34, 28], [8, 42], [-8, 52]],
    [[96, 22], [113, 20], [122, 8], [116, -3], [102, 3]],
    [[108, -10], [152, -14], [154, -35], [134, -43], [114, -31]],
    [[-52, 74], [-28, 72], [-18, 62], [-42, 58], [-60, 64]]
  ].forEach(points => drawLandMass(ctx, points, canvas.width, canvas.height));

  ctx.globalCompositeOperation = "screen";
  drawTextureSpeckles(ctx, random, "rgba(159,238,255,0.035)", 320, [0.6, 1.8], canvas.width, canvas.height);

  ctx.globalCompositeOperation = "multiply";
  drawTextureSpeckles(ctx, random, "rgba(0,0,0,0.055)", 210, [0.8, 2.8], canvas.width, canvas.height);

  ctx.globalCompositeOperation = "screen";
  [
    [-74.006, 40.7128],
    [-118.2437, 34.0522],
    [-80.1918, 25.7617],
    [-89.2182, 13.6929],
    [-95.3698, 29.7604],
    [-46.6333, -23.5505],
    [121.4737, 31.2304],
    [114.0579, 22.5431],
    [103.8198, 1.3521],
    [139.6503, 35.6762],
    [9.9937, 53.5511],
    [4.4777, 51.9244],
    [-0.1276, 51.5072],
    [2.3522, 48.8566]
  ].forEach(([lon, lat]) => {
    const [x, y] = mapPoint(lon, lat, canvas.width, canvas.height);
    const glow = ctx.createRadialGradient(x, y, 0, x, y, 6);
    glow.addColorStop(0, "rgba(255,224,150,0.7)");
    glow.addColorStop(1, "rgba(255,224,150,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(159, 238, 255, 0.08)";
  for (let i = 0; i < 90; i += 1) {
    ctx.fillRect(random() * canvas.width, random() * canvas.height, 1, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createCloudTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  const random = seededRandom(84);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 110; i += 1) {
    const x = random() * canvas.width;
    const y = random() * canvas.height;
    const radiusX = 26 + random() * 76;
    const radiusY = 7 + random() * 21;
    const gradient = ctx.createRadialGradient(x, y, 2, x, y, radiusX);
    gradient.addColorStop(0, "rgba(255,255,255,0.28)");
    gradient.addColorStop(0.58, "rgba(255,255,255,0.1)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((random() - 0.5) * 0.7);
    ctx.scale(1, radiusY / radiusX);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, radiusX, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function addSurfaceLights(earthGroup) {
  const lights = [];
  const nightLights = [];
  const sunDirection = new THREE.Vector3(-0.28, 0.18, 1).normalize();
  const worldPosition = new THREE.Vector3();

  [
    [25.7617, -80.1918, 0x4caff4],
    [13.6929, -89.2182, 0x22c93c],
    [22.5431, 114.0579, 0x4caff4],
    [53.5511, 9.9937, 0x22c93c],
    [31.2304, 121.4737, 0x4caff4],
    [34.0522, -118.2437, 0x4caff4],
    [40.7128, -74.006, 0x22c93c],
    [-23.5505, -46.6333, 0x4caff4],
    [19.4326, -99.1332, 0x22c93c],
    [51.5072, -0.1276, 0x4caff4],
    [35.6762, 139.6503, 0x22c93c],
    [1.3521, 103.8198, 0x4caff4]
  ].forEach(([lat, lon, color], index) => {
    const group = new THREE.Group();
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.0075, 10, 10),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 })
    );
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(0.021, 12, 12),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.16 })
    );

    group.position.copy(latLngToVector(lat, lon, 1.466));
    group.add(core, halo);
    group.userData = { core, halo, phase: index * 0.57 };
    earthGroup.add(group);
    lights.push(group);
  });

  [
    [35.6762, 139.6503],
    [31.2304, 121.4737],
    [22.5431, 114.0579],
    [1.3521, 103.8198],
    [35.1796, 129.0756],
    [53.5511, 9.9937],
    [51.9244, 4.4777],
    [39.4699, -0.3763],
    [51.5072, -0.1276],
    [48.8566, 2.3522],
    [25.7617, -80.1918],
    [29.7604, -95.3698],
    [34.0522, -118.2437],
    [33.7701, -118.1937],
    [8.9824, -79.5199],
    [13.6929, -89.2182],
    [-12.0464, -77.1428],
    [-23.9608, -46.3336],
    [10.391, -75.4794],
    [4.711, -74.0721]
  ].forEach(([lat, lon], index) => {
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.006, 8, 8),
      new THREE.MeshBasicMaterial({
        color: 0xfff1b8,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );

    glow.position.copy(latLngToVector(lat, lon, 1.468));
    glow.userData = { phase: index * 0.43 };
    earthGroup.add(glow);
    nightLights.push(glow);
  });

  earthGroup.userData.animateSurfaceLights = elapsed => {
    earthGroup.updateMatrixWorld();

    lights.forEach(light => {
      const pulse = 0.72 + Math.sin(elapsed * 2.2 + light.userData.phase) * 0.28;
      light.scale.setScalar(pulse);
      light.userData.halo.material.opacity = 0.1 + pulse * 0.08;
    });

    nightLights.forEach(light => {
      light.getWorldPosition(worldPosition);
      const darkness = THREE.MathUtils.clamp(0.18 - worldPosition.normalize().dot(sunDirection), 0, 1);
      const flicker = 0.74 + Math.sin(elapsed * 1.7 + light.userData.phase) * 0.18;
      light.material.opacity = darkness * 0.72 * flicker;
      light.scale.setScalar(0.9 + darkness * 0.75);
    });
  };
}

export function latLngToVector(lat, lon, radius = 1.5) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export function createEarth() {
  const earthGroup = new THREE.Group();
  const texture = createEarthTexture();

  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1.45, 128, 128),
    new THREE.MeshStandardMaterial({
      map: texture,
      color: 0xffffff,
      roughness: 0.58,
      metalness: 0.02,
      emissive: 0x07131c,
      emissiveIntensity: 0.105
    })
  );

  const daylightWash = new THREE.Mesh(
    new THREE.SphereGeometry(1.452, 128, 128),
    createDaylightWashMaterial()
  );

  new THREE.TextureLoader().load(
    "./assets/textures/earth-blue-marble.jpg",
    loadedTexture => {
      loadedTexture.colorSpace = THREE.SRGBColorSpace;
      loadedTexture.anisotropy = 8;
      earth.material.map = loadedTexture;
      earth.material.needsUpdate = true;
    },
    undefined,
    error => {
      console.warn("Earth texture could not be loaded. Canvas fallback remains active.", error);
    }
  );

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.525, 128, 128),
    createAtmosphereMaterial(0x4caff4, 0.185, 3.65)
  );

  const deepAtmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.565, 96, 96),
    createAtmosphereMaterial(0x9feeff, 0.036, 4.8)
  );

  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(1.485, 96, 96),
    new THREE.MeshBasicMaterial({
      map: createCloudTexture(),
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
      depthWrite: false
    })
  );

  earthGroup.userData.cloudLayer = clouds;
  earthGroup.userData.atmosphereLayers = [
    { mesh: atmosphere, baseOpacity: 0.185, baseScale: 1 },
    { mesh: deepAtmosphere, baseOpacity: 0.036, baseScale: 1 }
  ];
  earthGroup.userData.animateAtmosphere = elapsed => {
    earthGroup.userData.atmosphereLayers.forEach((layer, index) => {
      const breath = 0.5 + Math.sin(elapsed * 0.72 + index * 0.9) * 0.5;
      layer.mesh.material.uniforms.opacity.value = layer.baseOpacity * (0.88 + breath * 0.18);
      layer.mesh.scale.setScalar(layer.baseScale + breath * (index === 0 ? 0.006 : 0.01));
    });
  };

  earthGroup.add(earth, daylightWash, clouds, atmosphere, deepAtmosphere);
  addSurfaceLights(earthGroup);

  return earthGroup;
}
