export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Strip /dbsai prefix to get the path on the app host
  const targetPath = url.pathname.replace(/^\/dbsai/, '') || '/';
  const targetUrl = `https://pt-ai-helper.pages.dev${targetPath}${url.search}`;

  const res = await fetch(targetUrl, {
    method: context.request.method,
    headers: {
      'accept': context.request.headers.get('accept') || '*/*',
      'accept-encoding': context.request.headers.get('accept-encoding') || '',
      'accept-language': context.request.headers.get('accept-language') || '',
      'user-agent': context.request.headers.get('user-agent') || '',
      'cache-control': context.request.headers.get('cache-control') || '',
    },
    body: ['GET', 'HEAD'].includes(context.request.method)
      ? undefined
      : context.request.body,
  });

  const contentType = res.headers.get('content-type') || '';

  if (contentType.includes('text/html')) {
    let html = await res.text();
    // Rewrite absolute asset paths so the browser requests them through /dbsai/
    html = html
      .replace(/(src|href)="\/assets\//g, '$1="/dbsai/assets/')
      .replace(/(src|href)="\/manifest\.json"/g, '$1="/dbsai/manifest.json"')
      .replace(/content="\/manifest\.json"/g, 'content="/dbsai/manifest.json"')
      .replace(/(src|href)="\/logo\.png"/g, '$1="/dbsai/logo.png"')
      .replace(/(src|href)="\/favicon\./g, '$1="/dbsai/favicon.')
      .replace(/(src|href)="\/icon-/g, '$1="/dbsai/icon-')
      .replace(/(src|href)="\/sw\.js"/g, '$1="/dbsai/sw.js"')
      .replace(/(src|href)="\/registerSW\.js"/g, '$1="/dbsai/registerSW.js"');

    return new Response(html, {
      status: res.status,
      headers: {
        'content-type': 'text/html;charset=UTF-8',
        'cache-control': 'no-store',
      },
    });
  }

  // Pass other responses (JS, CSS, images, JSON) with a safe header allowlist
  const safe = new Headers();
  for (const h of ['content-type', 'content-length', 'cache-control', 'etag', 'last-modified']) {
    const v = res.headers.get(h);
    if (v) safe.set(h, v);
  }
  return new Response(res.body, { status: res.status, headers: safe });
}
