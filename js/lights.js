import * as THREE from "three";

export function createLights(scene) {
  scene.add(new THREE.AmbientLight(0x9fcfff, 1.65));

  const key = new THREE.DirectionalLight(0xffffff, 2.15);
  key.position.set(-2.5, 1.5, 4);
  scene.add(key);

  const rim = new THREE.PointLight(0x4caff4, 6.5, 9);
  rim.position.set(2.2, 1.2, 2.4);
  scene.add(rim);

  const green = new THREE.PointLight(0x22c93c, 3.2, 7);
  green.position.set(0, -2.2, 1.5);
  scene.add(green);
}
