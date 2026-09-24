(() => {
  const tabs = [...document.querySelectorAll('.service-tab')];
  const stage = document.querySelector('.service-visual');
  const image = document.querySelector('#service-image');
  const label = document.querySelector('#service-label');
  const title = document.querySelector('#service-title');
  const description = document.querySelector('#service-description');
  const decision = document.querySelector('#service-decision');
  const risk = document.querySelector('#service-risk');
  let transitionTimer;

  const assets = {
    port: new URL('../assets/port-blue-hour.webp', import.meta.url).href,
    air: new URL('../assets/air-freight-ramp.webp', import.meta.url).href,
    road: new URL('../assets/road-freight-documentary.webp', import.meta.url).href,
    customs: new URL('../assets/customs-team-documentary.webp', import.meta.url).href,
    dispatch: new URL('../assets/logistics-dispatch-documentary.webp', import.meta.url).href,
    specialists: new URL('../assets/operations-specialists.webp', import.meta.url).href
  };

  tabs[0].dataset.image = assets.port;
  tabs[1].dataset.image = assets.air;
  tabs[2].dataset.image = assets.road;
  tabs[2].dataset.alt = 'Camiones de carga en corredor regional al amanecer';
  tabs[3].dataset.image = assets.customs;
  tabs[3].dataset.alt = 'Especialistas aduanales revisando documentación logística';
  tabs[4].dataset.image = assets.dispatch;
  tabs[4].dataset.alt = 'Especialista monitoreando operaciones logísticas';
  tabs[5].dataset.image = assets.specialists;

  const selectService = (tab, moveFocus = false) => {
    if (tab.getAttribute('aria-selected') === 'true') return;

    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });

    stage.classList.add('is-switching');
    window.clearTimeout(transitionTimer);
    transitionTimer = window.setTimeout(() => {
      image.src = tab.dataset.image;
      image.alt = tab.dataset.alt;
      label.textContent = tab.dataset.label;
      title.textContent = tab.dataset.title;
      description.textContent = tab.dataset.description;
      decision.textContent = tab.dataset.decision;
      risk.textContent = tab.dataset.risk;
      stage.classList.remove('is-switching');
    }, 160);

    if (moveFocus) tab.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectService(tab));
    tab.addEventListener('keydown', (event) => {
      const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      let target = index;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') target = (index + 1) % tabs.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = tabs.length - 1;
      selectService(tabs[target], true);
    });
  });
})();
