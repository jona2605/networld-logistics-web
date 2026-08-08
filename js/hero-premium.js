export function initHeroPremium() {
  const page = document.querySelector(".atlas-page");
  const hero = document.querySelector(".atlas-hero");
  if (!page || !hero || hero.classList.contains("hero-premium-2")) return;

  page.classList.add("has-hero-premium-2");
  hero.classList.add("hero-premium-2");
}
