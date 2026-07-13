// SPA fallback for /tools/* — serves /tools/index.html for all sub-routes.
// Passes through requests for static files (assets, images, etc.) unchanged.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  // Let static assets pass through unchanged
  if (/\.[a-z0-9]+$/i.test(url.pathname)) {
    return context.env.ASSETS.fetch(context.request);
  }
  url.pathname = "/tools/index.html";
  const response = await context.env.ASSETS.fetch(url.toString());
  const html = await response.text();
  const badge = '<a href="https://fazier.com" target="_blank"><img src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&theme=light" width="120" alt="Fazier badge" /></a>';
  const modified = html.replace("</body>", badge + "</body>");
  return new Response(modified, {
    headers: { "Content-Type": "text/html;charset=UTF-8" },
  });
}
