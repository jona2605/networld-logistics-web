const messages = {
  international: 'Hola, quiero solicitar una cotización logística.\nServicio:\nOrigen:\nDestino:\nTipo de carga:\nPeso/volumen:\nFecha estimada:',
  customs: 'Hola, necesito orientación sobre un trámite aduanal.\nProducto:\nTipo de operación:\nDocumentos disponibles:\nConsulta:',
  courier: 'Hola, quiero cotizar CHEROBOX.\nProducto:\nTienda o enlace:\nValor aproximado:\nPeso estimado:\nDestino en El Salvador:',
  academy: 'Hola, quiero información sobre Networld Academy.\nTema de interés:\nModalidad:\nCantidad de participantes:\nEmpresa/persona:',
  human: 'Hola, necesito hablar con alguien de Networld Logistics.'
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
        <a data-tracking-event="assistant_select_international" href="${whatsappUrl(messages.international)}" target="_blank" rel="noopener noreferrer"><b>01</b><span>Cotizar transporte internacional</span><i>↗</i></a>
        <a data-tracking-event="assistant_select_customs" href="${whatsappUrl(messages.customs)}" target="_blank" rel="noopener noreferrer"><b>02</b><span>Consultar trámite aduanal</span><i>↗</i></a>
        <a data-tracking-event="assistant_select_courier" href="${whatsappUrl(messages.courier)}" target="_blank" rel="noopener noreferrer"><b>03</b><span>Courier / CHEROBOX</span><i>↗</i></a>
        <a data-tracking-event="assistant_select_academy" href="${whatsappUrl(messages.academy)}" target="_blank" rel="noopener noreferrer"><b>04</b><span>Networld Academy</span><i>↗</i></a>
        <a data-tracking-event="assistant_select_human" href="${whatsappUrl(messages.human)}" target="_blank" rel="noopener noreferrer"><b>05</b><span>Hablar con una persona</span><i>↗</i></a>
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
  assistant.querySelectorAll('.commercial-assistant__choices a').forEach(choice => {
    choice.addEventListener('click', () => window.trackEvent?.(choice.dataset.trackingEvent, { location: window.location.pathname }));
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
