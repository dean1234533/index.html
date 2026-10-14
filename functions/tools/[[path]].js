// SPA fallback for /tools/* with per-tool static pages.
// Each known tool has a prerendered /tools/<slug>.html with its own title, description and
// canonical, so crawlers that do not run JavaScript see the right head tags. Anything else
// falls back to the SPA shell (/tools/index.html). Static files (assets, images, etc.) pass through.
const BADGE = '<a href="https://fazier.com" target="_blank"><img src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&theme=light" width="120" alt="Fazier badge" /></a>';

async function loadToolPage(context, url) {
  const slug = url.pathname.replace(/^\/tools\/?/, "").replace(/\/+$/, "");
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const pageUrl = new URL(`/tools/${slug}.html`, url);
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
  return new Response(html.replace("</body>", BADGE + "</body>"), {
    headers: { "Content-Type": "text/html;charset=UTF-8" },
  });
}
