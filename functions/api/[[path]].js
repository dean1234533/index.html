// Catch-all: forwards any /api/* call that doesn't match a specific website
// function to the DB's Workouts app API on its canonical domain.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const targetUrl = `https://app.dbworkouts.co.uk${url.pathname}${url.search}`;

  const reqHeaders = new Headers();
  for (const h of ['content-type', 'authorization', 'x-api-key', 'accept', 'user-agent']) {
    const v = context.request.headers.get(h);
    if (v) reqHeaders.set(h, v);
  }

  const res = await fetch(targetUrl, {
    method: context.request.method,
    headers: reqHeaders,
    body: ['GET', 'HEAD'].includes(context.request.method) ? undefined : context.request.body,
  });

  const safe = new Headers();
  for (const h of ['content-type', 'cache-control', 'x-request-id']) {
    const v = res.headers.get(h);
    if (v) safe.set(h, v);
  }
  safe.set('access-control-allow-origin', '*');

  return new Response(res.body, { status: res.status, headers: safe });
}
