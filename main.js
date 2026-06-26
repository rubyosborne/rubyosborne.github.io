/* Renders the page from window.SITE_CONFIG. No build step, no dependencies. */
(function () {
  const cfg = window.SITE_CONFIG || {};
  const t = cfg.theme || {};
  const f = cfg.features || {};

  // 1. Apply theme tokens as CSS variables
  const root = document.documentElement.style;
  const map = {
    "--bg": t.bg, "--fg": t.fg, "--muted": t.muted,
    "--accent": t.accent, "--accent-dim": t.accentDim,
    "--bracket": t.bracket, "--font": t.font,
  };
  for (const [k, v] of Object.entries(map)) if (v) root.setProperty(k, v);

  // 2. Static text
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || ""; };
  set("name", cfg.name);
  set("tagline", cfg.tagline);
  set("footer", cfg.footer);
  document.title = cfg.name ? cfg.name.replace(/\b\w/g, c => c.toUpperCase()) : "Coming soon";

  // 3. Feature toggles
  if (f.glow === false) { const g = document.getElementById("glow"); if (g) g.style.display = "none"; }
  if (f.scanlines) document.getElementById("scanlines").classList.add("on");

  const cursor = document.getElementById("cursor");
  if (!f.blinkingCursor && cursor) cursor.style.display = "none";
  else if (cursor) cursor.classList.add("blink");

  // 4. Headline: type effect or instant
  const status = document.getElementById("status");
  const text = cfg.bracketText || "COMING SOON";
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (f.typeEffect && !prefersReduced && status) {
    let i = 0;
    status.textContent = "";
    const tick = () => {
      if (i <= text.length) {
        status.textContent = text.slice(0, i);
        i++;
        setTimeout(tick, 70);
      }
    };
    setTimeout(tick, 400);
  } else if (status) {
    status.textContent = text;
  }

  // 5. Socials
  const nav = document.getElementById("socials");
  if (nav) {
    if (f.showSocials === false || !Array.isArray(cfg.socials) || cfg.socials.length === 0) {
      nav.style.display = "none";
    } else {
      nav.innerHTML = "";
      for (const s of cfg.socials) {
        const a = document.createElement("a");
        a.href = s.href;
        a.textContent = s.label;
        if (!s.href.startsWith("mailto:")) { a.target = "_blank"; a.rel = "noopener"; }
        nav.appendChild(a);
      }
    }
  }
})();
