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
  const fuselage = new THREE.Mesh(new THREE.CapsuleGeometry(0.014, 0.235, 5, 14), bodyMaterial);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.0145, 0.052, 18), bodyMaterial);
  const wings = new THREE.Mesh(new THREE.BoxGeometry(0.205, 0.0032, 0.026), bodyMaterial);
  const tailWing = new THREE.Mesh(new THREE.BoxGeometry(0.072, 0.003, 0.017), accentMaterial);
  const tailFin = new THREE.Mesh(new THREE.BoxGeometry(0.0075, 0.058, 0.019), accentMaterial);
  const engineLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.0054, 0.0054, 0.028, 12), accentMaterial);
  const engineRight = engineLeft.clone();
  const aura = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), glowMaterial);

  fuselage.rotation.x = Math.PI / 2;
  nose.rotation.x = -Math.PI / 2;
  engineLeft.rotation.x = Math.PI / 2;
  engineRight.rotation.x = Math.PI / 2;

  nose.position.z = -0.132;
  wings.position.z = -0.018;
  tailWing.position.z = 0.128;
  tailFin.position.set(0, 0.03, 0.132);
  engineLeft.position.set(-0.058, -0.008, -0.018);
  engineRight.position.set(0.058, -0.008, -0.018);
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
  group.scale.setScalar(0.39);
  return group;
}
