# rubyosborne.com

A zero-build, fully static landing page. No frameworks, no dependencies — just
HTML/CSS/JS. Everything is customizable from a single file.

## Customize

Open **`config.js`** and edit. That one file controls:

- `name`, `bracketText`, `tagline`, `footer` — all the text
- `theme` — every color (the red is `accent`) and the font
- `features` — toggle the typing effect, blinking cursor, red glow, CRT
  scanlines, and the socials row on/off
- `socials` — add email / GitHub / X / anything as `{ label, href }`

No rebuild needed. Save and refresh the browser.

## Preview locally

Just open `index.html` in a browser, or run a tiny server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy (free) — Cloudflare Pages

1. Push this folder to a GitHub repo.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   connect the repo. Build command: *(none)*. Output dir: `/`.
3. **Custom domains** → add `rubyosborne.com` and `www.rubyosborne.com`.
   Cloudflare gives you the DNS records (or auto-configures them if your
   domain's nameservers are on Cloudflare). HTTPS is automatic.

### Or — GitHub Pages

1. Push to a repo named anything.
2. Repo **Settings → Pages** → Source: deploy from `main` / root.
3. Add `rubyosborne.com` under **Custom domain**, then create a `CNAME`
   file (this repo includes one) and point DNS at GitHub.

## Files

| File         | Purpose                                  |
|--------------|------------------------------------------|
| `index.html` | Markup skeleton (rarely needs editing)   |
| `styles.css` | Styling + animations (CSS variables)     |
| `config.js`  | **All content + theme — edit this**      |
| `main.js`    | Renders the page from config (logic)     |
| `CNAME`      | Custom domain for GitHub Pages           |
