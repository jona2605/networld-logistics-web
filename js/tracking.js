const TRACKING_CONFIG = Object.freeze({
  gaMeasurementId: 'G-0G8CCC8MKX',
  clarityProjectId: 'XXXXXXXXXX',
  searchConsoleVerification: 'GOOGLE_SEARCH_CONSOLE_CODE_HERE'
});

const placeholders = new Set([
  'G-XXXXXXXXXX',
  'XXXXXXXXXX',
  'GOOGLE_SEARCH_CONSOLE_CODE_HERE'
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

function injectPrivacyFooterLinks() {
  document.querySelectorAll('footer.site-footer, footer[data-od-id="institutional-footer"], footer.page-footer').forEach(footer => {
    if (footer.querySelector('.privacy-footer-links')) return;
    const host = footer.querySelector('.legal, .footer-bottom') || footer;
    const links = document.createElement('p');
    links.className = 'privacy-footer-links';
    links.innerHTML = '<a href="/politica-de-privacidad/">Política de privacidad</a><a href="/politica-de-privacidad/#cookies">Aviso de cookies</a>';
    host.append(links);
  });
}

function ensurePrivacyStyles() {
  if (document.querySelector('#networld-privacy-ui')) return;
  const styles = document.createElement('style');
  styles.id = 'networld-privacy-ui';
  styles.textContent = `
    .privacy-footer-links{display:flex;flex-wrap:wrap;gap:14px;margin:12px 0 0;font-size:.72rem}.privacy-footer-links a{color:inherit;opacity:.82;text-decoration:underline;text-underline-offset:3px}.privacy-footer-links a:hover{opacity:1}.lead-privacy-notice{margin:0;padding:14px 44px 26px;color:#617789;font-size:.72rem;line-height:1.6}.networld-cookie-notice{position:fixed;right:18px;bottom:18px;z-index:100;display:flex;align-items:center;flex-wrap:wrap;gap:12px;max-width:470px;padding:15px 17px;border:1px solid rgba(159,238,255,.38);background:#071c33;color:#edf7ff;box-shadow:0 18px 48px rgba(7,28,51,.3);font:500 .76rem/1.5 Poppins,Arial,sans-serif}.networld-cookie-notice p{flex:1 1 220px;margin:0}.networld-cookie-notice a{color:#9feeff;font-weight:700;text-decoration:underline;text-underline-offset:3px}.networld-cookie-notice button{min-height:36px;border:0;background:#22c93c;color:#05200c;padding:0 14px;font:800 .72rem/1 Poppins,Arial,sans-serif;cursor:pointer}.networld-cookie-notice button:focus-visible,.networld-cookie-notice a:focus-visible{outline:2px solid #fff;outline-offset:3px}@media(max-width:560px){.networld-cookie-notice{right:12px;bottom:12px;left:12px;max-width:none;padding:14px}.networld-cookie-notice button{margin-left:auto}.lead-privacy-notice{padding:14px 20px 22px}.privacy-footer-links{justify-content:center}}`;
  document.head.append(styles);
}

function initCookieNotice() {
  const storageKey = 'networldCookieNoticeAccepted';
  try { if (window.localStorage.getItem(storageKey) === 'true') return; } catch (_) { /* Local storage can be unavailable. */ }
  if (document.querySelector('[data-cookie-notice]')) return;
  const banner = document.createElement('aside');
  banner.className = 'networld-cookie-notice';
  banner.dataset.cookieNotice = 'true';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Aviso de cookies');
  banner.innerHTML = '<p>Usamos cookies y herramientas de analítica para medir el uso del sitio y mejorar la experiencia.</p><a href="/politica-de-privacidad/#cookies">Política de privacidad</a><button type="button">Aceptar</button>';
  banner.querySelector('button').addEventListener('click', () => {
    try { window.localStorage.setItem(storageKey, 'true'); } catch (_) { /* Dismiss for the current visit if storage is unavailable. */ }
    banner.remove();
  });
  document.body.append(banner);
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
ensurePrivacyStyles();
injectPrivacyFooterLinks();
initCookieNotice();

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
