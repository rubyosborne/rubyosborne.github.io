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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/subscribe') {
      if (request.method !== 'POST') return json({ error: 'method not allowed' }, 405);
      return handleSubscribe(request, env);
    }
    // Everything else → static assets (the built Astro site).
    return env.ASSETS.fetch(request);
  },
};
