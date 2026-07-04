import * as THREE from "three";

export function createCargoPlane() {
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xf8fdff,
    metalness: 0.24,
    roughness: 0.18,
    emissive: 0x4caff4,
    emissiveIntensity: 0.028
  });
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0xcff6ff,
    metalness: 0.18,
    roughness: 0.24
  });
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x4caff4,
    transparent: true,
    opacity: 0.04
  });

  const group = new THREE.Group();
  const fuselage = new THREE.Mesh(new THREE.CapsuleGeometry(0.013, 0.22, 5, 14), bodyMaterial);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.0135, 0.05, 18), bodyMaterial);
  const wings = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.003, 0.026), bodyMaterial);
  const tailWing = new THREE.Mesh(new THREE.BoxGeometry(0.064, 0.003, 0.016), accentMaterial);
  const tailFin = new THREE.Mesh(new THREE.BoxGeometry(0.007, 0.052, 0.018), accentMaterial);
  const engineLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.0048, 0.0048, 0.025, 12), accentMaterial);
  const engineRight = engineLeft.clone();
  const aura = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), glowMaterial);

  fuselage.rotation.x = Math.PI / 2;
  nose.rotation.x = -Math.PI / 2;
  engineLeft.rotation.x = Math.PI / 2;
  engineRight.rotation.x = Math.PI / 2;

  nose.position.z = -0.125;
  wings.position.z = -0.018;
  tailWing.position.z = 0.118;
  tailFin.position.set(0, 0.027, 0.122);
  engineLeft.position.set(-0.052, -0.008, -0.018);
  engineRight.position.set(0.052, -0.008, -0.018);
  aura.scale.set(1.35, 0.34, 0.62);

  group.add(aura, fuselage, nose, wings, tailWing, tailFin, engineLeft, engineRight);

  const trail = new THREE.Mesh(
    new THREE.ConeGeometry(0.01, 0.16, 16, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0x9feeff,
      transparent: true,
      opacity: 0.04,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  trail.rotation.x = Math.PI / 2;
  trail.position.z = 0.19;
  group.add(trail);

  group.userData.vehicleType = "plane";
  group.scale.setScalar(0.235);
  return group;
}
