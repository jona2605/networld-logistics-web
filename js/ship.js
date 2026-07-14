import * as THREE from "three";

function createShipHullGeometry() {
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    -0.034, 0.000, 0.128,
     0.034, 0.000, 0.128,
    -0.052, 0.026, 0.078,
     0.052, 0.026, 0.078,
    -0.048, 0.026, -0.09,
     0.048, 0.026, -0.09,
    -0.026, 0.005, -0.158,
     0.026, 0.005, -0.158,
     0.000, -0.02, 0.034,
     0.000, -0.016, -0.122
  ]);
  const indices = [
    0, 1, 3, 0, 3, 2,
    2, 3, 5, 2, 5, 4,
    4, 5, 7, 4, 7, 6,
    0, 2, 8, 2, 4, 8, 4, 6, 9, 4, 9, 8,
    1, 8, 3, 3, 8, 5, 5, 8, 9, 5, 9, 7,
    6, 7, 9
  ];

  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function createContainerShip() {
  const hullMaterial = new THREE.MeshStandardMaterial({
    color: 0x061f36,
    metalness: 0.16,
    roughness: 0.3,
    emissive: 0x013693,
    emissiveIntensity: 0.035
  });
  const deckMaterial = new THREE.MeshStandardMaterial({
    color: 0x174e78,
    metalness: 0.12,
    roughness: 0.28
  });
  const bridgeMaterial = new THREE.MeshStandardMaterial({ color: 0xf6fdff, metalness: 0.08, roughness: 0.2 });
  const containerMaterials = [
    new THREE.MeshStandardMaterial({ color: 0x013693, roughness: 0.26, emissive: 0x013693, emissiveIntensity: 0.03 }),
    new THREE.MeshStandardMaterial({ color: 0x4caff4, roughness: 0.24, emissive: 0x4caff4, emissiveIntensity: 0.025 }),
    new THREE.MeshStandardMaterial({ color: 0x22c93c, roughness: 0.26, emissive: 0x22c93c, emissiveIntensity: 0.022 }),
    new THREE.MeshStandardMaterial({ color: 0xd8e4ee, roughness: 0.28 })
  ];

  const group = new THREE.Group();
  const hull = new THREE.Mesh(createShipHullGeometry(), hullMaterial);
  const deck = new THREE.Mesh(new THREE.BoxGeometry(0.064, 0.009, 0.202), deckMaterial);
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.032, 0.034), bridgeMaterial);
  const bridgeTop = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.012, 0.024), bridgeMaterial);
  const bridgeGlass = new THREE.Mesh(
    new THREE.BoxGeometry(0.03, 0.005, 0.003),
    new THREE.MeshBasicMaterial({ color: 0x9feeff, transparent: true, opacity: 0.78 })
  );

  deck.position.y = 0.024;
  bridge.position.set(0, 0.057, 0.086);
  bridgeTop.position.set(0, 0.079, 0.087);
  bridgeGlass.position.set(0, 0.064, 0.068);

  group.add(hull, deck, bridge, bridgeTop, bridgeGlass);

  [-0.068, -0.032, 0.004, 0.04].forEach((z, index) => {
    const container = new THREE.Mesh(
      new THREE.BoxGeometry(0.044, 0.013, 0.028),
      containerMaterials[index]
    );
    container.position.set(0, 0.044, z);
    group.add(container);
  });

  group.userData.vehicleType = "ship";
  group.scale.setScalar(0.18);
  return group;
}
