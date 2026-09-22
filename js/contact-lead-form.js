const form = document.querySelector('[data-lead-form]');

if (form) {
  const intentControls = [...form.querySelectorAll('input[name="lead_type"]')];
  const quoteFields = form.querySelector('.lead-quote-fields');
  const academyFields = form.querySelector('.lead-academy-fields');
  const title = form.querySelector('[data-form-title]');
  const kicker = form.querySelector('[data-form-kicker]');
  const guidance = form.querySelector('[data-form-guidance]');
  const success = form.querySelector('[data-lead-success]');
  const whatsapp = form.querySelector('[data-lead-whatsapp]');
  const email = form.querySelector('[data-lead-email]');
  const config = {
    quote: { kicker: 'Cotización logística', title: 'Información para revisar su operación.', guidance: 'Comparta datos aproximados si aún no cuenta con el expediente completo.' },
    academy: { kicker: 'Networld Academy', title: 'Información para orientar la capacitación.', guidance: 'Las áreas y modalidades se coordinan bajo consulta según el contexto del participante o equipo.' },
  };

  const setDisabled = (fieldset, disabled) => {
    fieldset.hidden = disabled;
    fieldset.disabled = disabled;
    fieldset.querySelectorAll('[data-required]').forEach(field => { field.required = !disabled; });
  };

  const setIntent = intent => {
    setDisabled(quoteFields, intent !== 'quote');
    setDisabled(academyFields, intent !== 'academy');
    const content = config[intent];
    kicker.textContent = content.kicker;
    title.textContent = content.title;
    guidance.textContent = content.guidance;
    success.hidden = true;
  };

  form.querySelectorAll('.lead-quote-fields [required], .lead-academy-fields select, .lead-academy-fields input').forEach(field => { field.dataset.required = 'true'; });
  intentControls.forEach(control => control.addEventListener('change', () => setIntent(control.value)));
  const initial = new URLSearchParams(window.location.search).get('tipo') === 'academy' ? 'academy' : 'quote';
  form.querySelector(`input[value="${initial}"]`).checked = true;
  setIntent(initial);

  document.querySelectorAll('a[href="#academy-request"]').forEach(link => {
    link.addEventListener('click', () => {
      form.querySelector('input[value="academy"]').checked = true;
      setIntent('academy');
      requestAnimationFrame(() => academyFields.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    });
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const data = new FormData(form);
    const intent = data.get('lead_type');
    const label = intent === 'academy' ? 'Solicitud de capacitación — Networld Academy' : 'Solicitud de cotización logística';
    const labels = { nombre: 'Nombre', empresa: 'Empresa', whatsapp: 'WhatsApp', correo: 'Correo', tipo_servicio: 'Tipo de servicio', origen: 'Origen', destino: 'Destino', tipo_carga: 'Tipo de carga', peso_volumen: 'Peso o volumen', fecha_estimada: 'Fecha estimada', documentos: 'Factura o documentos', tema_capacitacion: 'Tema de capacitación', tipo_participante: 'Solicita como', participantes: 'Participantes', modalidad: 'Modalidad preferida', mensaje: 'Mensaje adicional' };
    const lines = [...data.entries()].filter(([key, value]) => key !== 'lead_type' && String(value).trim()).map(([key, value]) => `• ${labels[key] || key}: ${value}`);
    const message = `Hola, deseo compartir una ${label.toLowerCase()}.\n\n${lines.join('\n')}`;
    const encoded = encodeURIComponent(message);
    whatsapp.href = `https://wa.me/50374209546?text=${encoded}`;
    email.href = `mailto:aduana@networldslogistics.com?subject=${encodeURIComponent(label)}&body=${encoded}`;
    success.hidden = false;
    success.focus();
    try { sessionStorage.setItem('networldLeadDraft', JSON.stringify({ intent, createdAt: new Date().toISOString(), values: Object.fromEntries(data) })); } catch (_) { /* Draft storage is optional. */ }
  });
}
