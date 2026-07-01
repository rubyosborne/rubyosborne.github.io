/**
 * Cloudflare Worker entry: serves the static Astro site (via the ASSETS
 * binding) and handles a tiny API for the Trading Bot email capture.
 *
 *   POST /api/subscribe  { email, project }  ->  forwards to Slack
 *
 * The Slack Incoming Webhook URL is read from the SLACK_WEBHOOK_URL secret
 * (set in the Cloudflare dashboard → Settings → Variables and secrets — NOT in
 * code). If it's unset, the endpoint still returns ok so the UX never breaks.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

async function handleSubscribe(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'bad request' }, 400);
  }
  const email = (body?.email || '').trim();
  const project = (body?.project || 'site').toString().slice(0, 80);
  if (!EMAIL_RE.test(email)) return json({ error: 'invalid email' }, 400);

  const hook = env.SLACK_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          text: `📩 New signup for *${project}*\n• ${email}`,
        }),
      });
    } catch {
      // don't fail the user's signup if Slack is briefly unreachable
    }
  }
  return json({ ok: true });
}

async function handleContact(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'bad request' }, 400);
  }
  const name = (body?.name || 'someone').toString().slice(0, 120);
  const email = (body?.email || '').toString().slice(0, 200);
  const message = (body?.message || '').toString().slice(0, 2000).trim();
  if (!message) return json({ error: 'empty message' }, 400);
  if (email && !EMAIL_RE.test(email)) return json({ error: 'invalid email' }, 400);

  const hook = env.SLACK_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          text: `🍪 New message from *${name}*${email ? ` (${email})` : ''}\n> ${message.replace(/\n/g, '\n> ')}`,
        }),
      });
    } catch {
      // don't fail the user's message if Slack is briefly unreachable
    }
  }
  return json({ ok: true });
}

async function sha256hex(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Password gate for the protected deck. The password lives ONLY in the
// DECK_PASSWORD secret (Cloudflare dashboard) — never in this public repo.
async function handleDeckAuth(request, env) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'bad request' }, 400); }
  const secret = (env.DECK_PASSWORD || '').trim();
  const password = (body?.password || '').toString();
  if (!secret || password !== secret) return json({ error: 'wrong password' }, 401);
  const token = await sha256hex('deck:' + secret);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'set-cookie': `deck_auth=${token}; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Lax`,
    },
  });
}

// Guards /protected/* : serve the asset INLINE only with a valid auth cookie,
// otherwise bounce to the password page. (run_worker_first makes this run
// before the static asset is served.)
async function guardProtected(request, env) {
  const secret = (env.DECK_PASSWORD || '').trim();
  const want = secret ? await sha256hex('deck:' + secret) : null;
  const m = (request.headers.get('cookie') || '').match(/(?:^|;\s*)deck_auth=([a-f0-9]+)/);
  if (want && m && m[1] === want) {
    const res = await env.ASSETS.fetch(request);
    const h = new Headers(res.headers);
    h.set('content-disposition', 'inline');
    h.set('cache-control', 'private, no-store');
    return new Response(res.body, { status: res.status, headers: h });
  }
  return Response.redirect(new URL('/deck', request.url).toString(), 302);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/subscribe') {
      if (request.method !== 'POST') return json({ error: 'method not allowed' }, 405);
      return handleSubscribe(request, env);
    }
    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') return json({ error: 'method not allowed' }, 405);
      return handleContact(request, env);
    }
    if (url.pathname === '/api/deck-auth') {
      if (request.method !== 'POST') return json({ error: 'method not allowed' }, 405);
      return handleDeckAuth(request, env);
    }
    if (url.pathname.startsWith('/protected/')) {
      return guardProtected(request, env);
    }
    // Everything else → static assets (the built Astro site).
    return env.ASSETS.fetch(request);
  },
};
