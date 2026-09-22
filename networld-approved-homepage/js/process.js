(() => {
  const frame = document.querySelector('.process-frame');
  const steps = [...document.querySelectorAll('.process .step')];
  const control = document.querySelector('.process-control');
  const customsDetail = document.querySelector('.customs-intelligence');
  const stepsContainer = document.querySelector('.process .steps');
  const fields = {
    label: document.querySelector('#process-active-label'),
    title: document.querySelector('#process-active-title'),
    decision: document.querySelector('#process-decision'),
    validation: document.querySelector('#process-validation'),
    evidence: document.querySelector('#process-evidence'),
    risk: document.querySelector('#process-risk')
  };
  let transitionTimer;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const detailPanel = document.createElement('section');
  detailPanel.className = 'process-active-detail';
  detailPanel.setAttribute('aria-live', 'polite');
  detailPanel.setAttribute('aria-label', 'Detalle del hito operativo activo');
  stepsContainer?.insertAdjacentElement('afterend', detailPanel);

  const renderDetail = (step, index) => {
    if (!detailPanel) return;
    const title = step.querySelector('h3')?.textContent || '';
    detailPanel.innerHTML = `
      <div class="process-active-detail__heading">
        <span>Hito ${String(index + 1).padStart(2, '0')} · ${step.dataset.state}</span>
        <h3>${title}</h3>
      </div>
      <div class="process-active-detail__facts">
        <div><b>Decisión</b><p>${step.dataset.decision}</p></div>
        <div><b>Evidencia visible</b><p>${step.dataset.evidence}</p></div>
        <div><b>Riesgo reducido</b><p>${step.dataset.risk}</p></div>
      </div>`;
  };

  const activateStep = (step, moveFocus = false) => {
    const index = steps.indexOf(step);
    if (index < 0 || step.classList.contains('is-active')) return;

    steps.forEach((item) => {
      const active = item === step;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
      item.tabIndex = active ? 0 : -1;
    });

    frame.dataset.activeStage = String(index + 1);
    customsDetail?.classList.toggle('is-active', index === 4);
    control.classList.add('is-switching');
    window.clearTimeout(transitionTimer);
    transitionTimer = window.setTimeout(() => {
      fields.label.textContent = `Hito ${String(index + 1).padStart(2, '0')} · ${step.dataset.state}`;
      fields.title.textContent = step.querySelector('h3').textContent;
      fields.decision.textContent = step.dataset.decision;
      fields.validation.textContent = step.dataset.validation;
      fields.evidence.textContent = step.dataset.evidence;
      fields.risk.textContent = step.dataset.risk;
      renderDetail(step, index);
      control.classList.remove('is-switching');
    }, reducedMotion ? 0 : 110);

    if (moveFocus) step.focus();
  };

  steps.forEach((step, index) => {
    step.addEventListener('mouseenter', () => activateStep(step));
    step.addEventListener('focus', () => activateStep(step));
    step.addEventListener('click', () => activateStep(step, true));
    step.addEventListener('keydown', (event) => {
      const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      let target = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') target = (index + 1) % steps.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') target = (index - 1 + steps.length) % steps.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = steps.length - 1;
      activateStep(steps[target], true);
    });
  });

  if (steps[0]) renderDetail(steps[0], 0);
})();
