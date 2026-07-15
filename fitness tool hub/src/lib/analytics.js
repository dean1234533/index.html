// GA4 is loaded directly — GTM containers on the site are for other tags only.
const CLARITY_ID = import.meta.env.VITE_CLARITY_PROJECT_ID;
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const isProd = import.meta.env.PROD;

export function initGA() {
  if (!isProd || !GA_ID) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { send_page_view: false });
}

export function initClarity() {
  if (!isProd || !CLARITY_ID) return;
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', CLARITY_ID);
}

export function trackPageView(path) {
  if (!isProd || !GA_ID) return;
  window.gtag?.('config', GA_ID, { page_path: path });
}

export function track(eventName, params = {}) {
  if (!isProd) return;
  window.gtag?.('event', eventName, params);
}
