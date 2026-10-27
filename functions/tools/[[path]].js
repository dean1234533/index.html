// SPA fallback for /tools/* with per-tool static pages.
// Each known tool has a prerendered /tools/<slug>.html with its own title, description and
// canonical, so crawlers that do not run JavaScript see the right head tags. Anything else
// falls back to the SPA shell (/tools/index.html). Static files (assets, images, etc.) pass through.
import { addToolBadgeCarousel } from "../../lib/tool-badge-carousel.js";

async function loadToolPage(context, url) {
  const slug = url.pathname.replace(/^\/tools\/?/, "").replace(/\/+$/, "");
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  // Ask for the clean URL: ASSETS answers /tools/<slug>.html with a 308 redirect to /tools/<slug>
  // (and does not follow it), which used to make every tool fall through to the hub page.
  const pageUrl = new URL(`/tools/${slug}`, url);
  const res = await context.env.ASSETS.fetch(pageUrl.toString());
  if (!res.ok) return null;
  const html = await res.text();
  // With no 404.html, ASSETS returns the site root for missing files, so confirm this is the tool's page.
  return html.includes(`rel="canonical" href="https://dbworkouts.co.uk/tools/${slug}"`) ? html : null;
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (/\.[a-z0-9]+$/i.test(url.pathname)) {
    return context.env.ASSETS.fetch(context.request);
  }
  let html = await loadToolPage(context, url);
  if (html === null) {
    url.pathname = "/tools/index.html";
    const response = await context.env.ASSETS.fetch(url.toString());
    html = await response.text();
  }
  return new Response(addToolBadgeCarousel(html), {
    headers: { "Content-Type": "text/html;charset=UTF-8" },
  });
}
