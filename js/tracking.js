const TRACKING_CONFIG = Object.freeze({
  gaMeasurementId: 'G-XXXXXXXXXX',
  clarityProjectId: 'XXXXXXXXXX',
  searchConsoleVerification: 'GOOGLE_SEARCH_CONSOLE_CODE_HERE'
});

const placeholders = new Set([
  TRACKING_CONFIG.gaMeasurementId,
  TRACKING_CONFIG.clarityProjectId,
  TRACKING_CONFIG.searchConsoleVerification
]);

const configured = value => Boolean(value && !placeholders.has(value));
const pagePath = () => `${window.location.pathname}${window.location.search}`;

function ensureSearchConsoleMeta() {
  if (document.querySelector('meta[name="google-site-verification"]')) return;
  const verification = document.createElement('meta');
  verification.name = 'google-site-verification';
  verification.content = TRACKING_CONFIG.searchConsoleVerification;
  document.head.append(verification);
}

function loadGa4() {
  if (!configured(TRACKING_CONFIG.gaMeasurementId)) return false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', TRACKING_CONFIG.gaMeasurementId, { send_page_view: true });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(TRACKING_CONFIG.gaMeasurementId)}`;
  document.head.append(script);
  return true;
}

function loadClarity() {
  if (!configured(TRACKING_CONFIG.clarityProjectId)) return false;
  if (window.clarity) return true;
  window.clarity = window.clarity || function clarity() { (window.clarity.q = window.clarity.q || []).push(arguments); };
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${encodeURIComponent(TRACKING_CONFIG.clarityProjectId)}`;
  document.head.append(script);
  return true;
}

const gaActive = loadGa4();
loadClarity();
ensureSearchConsoleMeta();

export function trackEvent(name, params = {}) {
  const payload = { page_path: pagePath(), ...params };
  if (gaActive && typeof window.gtag === 'function') {
    window.gtag('event', name, payload);
  } else {
    console.info('[Networld tracking]', name, payload);
  }
  window.dispatchEvent(new CustomEvent('networld:track', { detail: { name, params: payload } }));
}

window.trackEvent = trackEvent;
window.NETWORLD_TRACKING_CONFIG = TRACKING_CONFIG;

function textFor(element) {
  return element.getAttribute('aria-label') || element.textContent.replace(/\s+/g, ' ').trim();
}

function whatsappEvent(link) {
  const explicit = link.dataset.trackingEvent;
  if (explicit) return explicit;
  const text = textFor(link).toLowerCase();
  const path = window.location.pathname;
  if (link.closest('[data-commercial-assistant]')) return 'click_whatsapp_assistant';
  if (path.includes('/contacto/')) return 'click_whatsapp_contact';
  if (text.includes('cotiz') || text.includes('evaluar') || text.includes('revisar')) return path === '/' ? 'click_whatsapp_quote' : 'click_whatsapp_landing';
  if (link.closest('footer')) return 'click_whatsapp_footer';
  if (link.closest('nav, header')) return 'click_whatsapp_header';
  return path === '/' ? 'click_whatsapp_quote' : 'click_whatsapp_landing';
}

function ctaEvent(link) {
  const explicit = link.dataset.trackingEvent;
  if (explicit) return explicit;
  const href = link.getAttribute('href') || '';
  const text = textFor(link).toLowerCase();
  if (href.includes('logicstrack-app.web.app')) return 'click_portal_logictrack';
  if (href.includes('/academia/')) return 'click_academy_cta';
  if (href.includes('/servicios/')) return 'click_services_cta';
  if (href.includes('/contacto/')) return window.location.pathname === '/' ? 'click_contact_cta' : 'click_landing_quote';
  if (href === '#cotizar' || text.includes('cotiz') || text.includes('planificar')) return link.closest('nav') ? 'click_quote_nav' : 'click_quote_home';
  return null;
}

document.addEventListener('click', event => {
  const link = event.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href') || '';
  const isWhatsapp = /(?:wa\.me|api\.whatsapp\.com)/i.test(href);
  const eventName = isWhatsapp ? whatsappEvent(link) : ctaEvent(link);
  if (!eventName) return;
  trackEvent(eventName, {
    location: link.dataset.trackingLocation || (link.closest('footer') ? 'footer' : link.closest('nav, header') ? 'header' : 'content'),
    button_text: textFor(link),
    service: link.dataset.service || undefined
  });
});
