import * as THREE from "three";

export function createCargoTruck() {
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xeaf8ff,
    metalness: 0.12,
    roughness: 0.28,
    emissive: 0x4caff4,
    emissiveIntensity: 0.018
  });
  const trailerMaterial = new THREE.MeshStandardMaterial({
    color: 0x013693,
    metalness: 0.14,
    roughness: 0.3
  });
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0x22c93c,
    metalness: 0.1,
    roughness: 0.32
  });
  const wheelMaterial = new THREE.MeshStandardMaterial({
    color: 0x06111f,
    metalness: 0.2,
    roughness: 0.38
  });
  const glassMaterial = new THREE.MeshBasicMaterial({
    color: 0x9feeff,
    transparent: true,
    opacity: 0.72
  });

  const group = new THREE.Group();
  const trailer = new THREE.Mesh(new THREE.BoxGeometry(0.062, 0.032, 0.105), trailerMaterial);
  const cab = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.04, 0.042), bodyMaterial);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.011, 0.03), bodyMaterial);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.064, 0.004, 0.013), accentMaterial);
  const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.034, 0.014, 0.003), glassMaterial);
  const headlightLeft = new THREE.Mesh(new THREE.SphereGeometry(0.004, 8, 8), accentMaterial);
  const headlightRight = headlightLeft.clone();

  trailer.position.set(0, 0.025, 0.018);
  cab.position.set(0, 0.029, -0.062);
  roof.position.set(0, 0.055, -0.064);
  stripe.position.set(0, 0.044, 0.012);
  windshield.position.set(0, 0.043, -0.085);
  headlightLeft.position.set(-0.014, 0.027, -0.085);
  headlightRight.position.set(0.014, 0.027, -0.085);

  group.add(trailer, cab, roof, stripe, windshield, headlightLeft, headlightRight);

  [-0.025, 0.025].forEach(x => {
    [-0.046, 0.018, 0.058].forEach(z => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.006, 12), wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, 0.004, z);
      group.add(wheel);
    });
  });

  group.userData.vehicleType = "truck";
  group.scale.setScalar(0.42);
  return group;
}
