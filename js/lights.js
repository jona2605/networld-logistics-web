import * as THREE from "three";

export function createLights(scene) {
  scene.add(new THREE.AmbientLight(0xc7e8ff, 1.55));
  scene.add(new THREE.HemisphereLight(0xd7efff, 0x071018, 1.16));

  const key = new THREE.DirectionalLight(0xf4fbff, 2.35);
  key.position.set(-2.1, 1.8, 4.6);
  scene.add(key);

  const frontFill = new THREE.DirectionalLight(0xb8ddff, 0.96);
  frontFill.position.set(0.4, -0.15, 5.2);
  scene.add(frontFill);

  const rim = new THREE.PointLight(0x4caff4, 6.5, 9);
  rim.position.set(2.2, 1.2, 2.4);
  scene.add(rim);

  const green = new THREE.PointLight(0x22c93c, 3.2, 7);
  green.position.set(0, -2.2, 1.5);
  scene.add(green);
}
