const messages = {
  quote: 'Hola, quiero solicitar una cotización logística. Mis datos iniciales son: servicio, origen, destino, tipo de carga, peso/volumen y fecha estimada.',
  customs: 'Hola, necesito orientación sobre trámites aduanales. Quiero consultar sobre documentación, requisitos o proceso de importación.',
  academy: 'Hola, quiero información sobre Networld Academy y capacitaciones en logística, importaciones o aduanas.',
  general: 'Hola, necesito ayuda con un servicio de Networld Logistics.'
};

const whatsappUrl = message => `https://wa.me/50374209546?text=${encodeURIComponent(message)}`;

export function initCommercialAssistant() {
  if (document.querySelector('[data-commercial-assistant]')) return;

  const assistant = document.createElement('aside');
  assistant.className = 'commercial-assistant';
  assistant.dataset.commercialAssistant = 'true';
  assistant.innerHTML = `
    <section class="commercial-assistant__panel" id="commercial-assistant-panel" aria-label="Opciones de atención Networld" hidden>
      <div class="commercial-assistant__heading"><span>Atención Networld</span><button type="button" data-assistant-close aria-label="Cerrar asistente">×</button></div>
      <h2>¿Cómo podemos ayudarte?</h2>
      <p>Elige una ruta y prepara tu consulta para el equipo.</p>
      <div class="commercial-assistant__choices">
        <a href="${whatsappUrl(messages.quote)}" target="_blank" rel="noopener noreferrer"><b>01</b><span>Solicitar cotización logística</span><i>↗</i></a>
        <a href="${whatsappUrl(messages.customs)}" target="_blank" rel="noopener noreferrer"><b>02</b><span>Consultar trámites aduanales</span><i>↗</i></a>
        <a href="${whatsappUrl(messages.academy)}" target="_blank" rel="noopener noreferrer"><b>03</b><span>Capacitación / Networld Academy</span><i>↗</i></a>
        <a href="${whatsappUrl(messages.general)}" target="_blank" rel="noopener noreferrer"><b>04</b><span>Hablar por WhatsApp</span><i>↗</i></a>
      </div>
      <small>La orientación inicial no sustituye la revisión de una operación específica.</small>
      <small>Al contactarnos por WhatsApp, aceptas que usemos la información enviada para responder tu solicitud.</small>
    </section>
    <button class="commercial-assistant__trigger" type="button" aria-expanded="false" aria-controls="commercial-assistant-panel"><span class="commercial-assistant__signal" aria-hidden="true"></span><span>¿Necesitas ayuda?</span><i aria-hidden="true">+</i></button>`;
  document.body.append(assistant);

  const trigger = assistant.querySelector('.commercial-assistant__trigger');
  const panel = assistant.querySelector('.commercial-assistant__panel');
  const close = assistant.querySelector('[data-assistant-close]');
  const setOpen = open => {
    panel.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
    assistant.classList.toggle('is-open', open);
    if (open) panel.querySelector('a')?.focus({ preventScroll: true });
    else trigger.focus({ preventScroll: true });
  };

  trigger.addEventListener('click', () => {
    const opening = panel.hidden;
    setOpen(opening);
    window.trackEvent?.(opening ? 'assistant_open' : 'assistant_close', { location: window.location.pathname });
  });
  close.addEventListener('click', () => {
    setOpen(false);
    window.trackEvent?.('assistant_close', { location: window.location.pathname });
  });
  const assistantEvents = ['assistant_select_quote', 'assistant_select_customs', 'assistant_select_academy', 'assistant_select_general'];
  assistant.querySelectorAll('.commercial-assistant__choices a').forEach((choice, index) => {
    choice.addEventListener('click', () => window.trackEvent?.(assistantEvents[index], { location: window.location.pathname }));
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || panel.hidden) return;
    setOpen(false);
    window.trackEvent?.('assistant_close', { location: window.location.pathname });
  });
  document.addEventListener('pointerdown', event => {
    if (panel.hidden || assistant.contains(event.target)) return;
    setOpen(false);
    window.trackEvent?.('assistant_close', { location: window.location.pathname });
  });
}

initCommercialAssistant();
