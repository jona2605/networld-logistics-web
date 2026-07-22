import * as THREE from "three";
import { createEarth } from "./earth.js";
import { createLights } from "./lights.js";
import { createRoutes } from "./routes.js";

export function initScene() {
  const container = document.querySelector(".hero-map");
  if (!container) return;

  const atmosphere = container.querySelector(".hero-map-atmosphere");
  container.classList.remove("hero-map-ready", "hero-map-error", "hero-map-texture-fallback");

  try {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    42,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );

  camera.position.set(0, 0.02, 4.25);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  const getPixelRatio = () => {
    const cap = window.innerWidth <= 720 ? 1.35 : 1.9;
    return Math.min(window.devicePixelRatio || 1, cap);
  };
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(getPixelRatio());
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.13;

  container.appendChild(renderer.domElement);

  createLights(scene);

  const earthGroup = createEarth();
  earthGroup.scale.set(0.84, 0.84, 0.84);
  earthGroup.position.set(0, -0.03, 0);
  earthGroup.rotation.set(0.03, -1.12, -0.08);
  scene.add(earthGroup);

  const animateRoutes = createRoutes(earthGroup, camera);
  let lastFrameTime = performance.now();
  let elapsedTime = 0;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointerTarget = new THREE.Vector2(0, 0);
  const pointerCurrent = new THREE.Vector2(0, 0);

  if (!prefersReducedMotion) {
    container.addEventListener("pointermove", event => {
      const rect = container.getBoundingClientRect();
      pointerTarget.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerTarget.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    });

    container.addEventListener("pointerleave", () => {
      pointerTarget.set(0, 0);
    });
  }

  let firstFrameRendered = false;

  function animate() {
    requestAnimationFrame(animate);
    if (document.hidden) return;
    const now = performance.now();
    const delta = Math.min((now - lastFrameTime) / 1000, 0.05);
    lastFrameTime = now;
    elapsedTime += delta;

    // Continuous 360-degree rotation around the Y axis.
    earthGroup.rotation.y += delta * (prefersReducedMotion ? 0.045 : 0.105);
    pointerCurrent.lerp(pointerTarget, 0.035);
    earthGroup.rotation.x = 0.03 + pointerCurrent.y * 0.035;
    earthGroup.rotation.z = -0.08 + pointerCurrent.x * 0.025;
    if (earthGroup.userData.cloudLayer) {
      earthGroup.userData.cloudLayer.rotation.y += delta * (prefersReducedMotion ? 0.025 : 0.085);
    }
    animateRoutes(delta, elapsedTime);
    earthGroup.userData.animateSurfaceLights?.(elapsedTime);
    earthGroup.userData.animateAtmosphere?.(elapsedTime);

    renderer.render(scene, camera);
    firstFrameRendered = true;
  }

  animate();

  earthGroup.userData.textureReady.then(({ fallback: usesTextureFallback }) => {
    const reveal = () => {
      renderer.render(scene, camera);
      container.classList.toggle("hero-map-texture-fallback", usesTextureFallback);
      container.classList.add("hero-map-ready");
      atmosphere?.setAttribute("aria-hidden", "true");
    };

    if (firstFrameRendered) {
      window.requestAnimationFrame(reveal);
    } else {
      window.requestAnimationFrame(() => window.requestAnimationFrame(reveal));
    }
  });

  window.addEventListener("resize", () => {
    window.requestAnimationFrame(() => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(getPixelRatio());
    });
  });
  } catch (error) {
    container.querySelector("canvas")?.remove();
    container.classList.add("hero-map-error");
    console.warn("WebGL scene could not initialize. Atmospheric fallback remains active.", error);
  }
}
