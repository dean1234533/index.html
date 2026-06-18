export async function onRequest(context) {
  const url = new URL(context.request.url);

  const targetPath = url.pathname.replace(/^\/smart/, '') || '/';
  const targetUrl = `https://smart-life-app.pages.dev${targetPath}${url.search}`;

  const res = await fetch(targetUrl, {
    method: context.request.method,
    headers: {
      'accept': context.request.headers.get('accept') || '*/*',
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
    html = html
      .replace(/(src|href)="\/assets\//g, '$1="/smart/assets/')
      .replace(/(src|href)="\/manifest\.json"/g, '$1="/smart/manifest.json"')
      .replace(/content="\/manifest\.json"/g, 'content="/smart/manifest.json"')
      .replace(/(src|href)="\/favicon\./g, '$1="/smart/favicon.')
      .replace(/(src|href)="\/icon-/g, '$1="/smart/icon-')
      .replace(/(src|href)="\/sw\.js"/g, '$1="/smart/sw.js"')
      .replace(/(src|href)="\/registerSW\.js"/g, '$1="/smart/registerSW.js"');

    return new Response(html, {
      status: res.status,
      headers: { 'content-type': 'text/html;charset=UTF-8', 'cache-control': 'no-store' },
    });
  }

  const safe = new Headers();
  for (const h of ['content-type', 'content-length', 'cache-control', 'etag', 'last-modified']) {
    const v = res.headers.get(h);
    if (v) safe.set(h, v);
  }
  return new Response(res.body, { status: res.status, headers: safe });
}
