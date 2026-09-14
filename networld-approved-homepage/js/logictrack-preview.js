(() => {
  const shell = document.querySelector('.portal-shell');
  const tabs = [...document.querySelectorAll('.portal-side [role="tab"]')];
  const panels = [...document.querySelectorAll('.logic-panel')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let transitionTimer;

  const activateTab = (tab, moveFocus = false) => {
    if (tab.getAttribute('aria-selected') === 'true') return;
    const targetId = tab.dataset.panel;

    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });

    shell.classList.add('is-switching');
    window.clearTimeout(transitionTimer);
    transitionTimer = window.setTimeout(() => {
      panels.forEach((panel) => {
        const active = panel.id === targetId;
        panel.hidden = !active;
        panel.classList.toggle('is-active', active);
      });
      shell.classList.remove('is-switching');
    }, reducedMotion ? 0 : 100);

    if (moveFocus) tab.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (event) => {
      const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      let target = index;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') target = (index + 1) % tabs.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = tabs.length - 1;
      activateTab(tabs[target], true);
    });
  });
})();
