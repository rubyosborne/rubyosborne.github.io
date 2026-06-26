/* =============================================================
   SITE CONFIG — edit everything here.
   Change text, colors, links, and toggles without touching
   the HTML/CSS. This object drives the whole page.
   ============================================================= */

window.SITE_CONFIG = {
  // ---- Identity ----
  name: "RUBY OSBORNE",
  // The bracketed status line. Shown big and red.
  bracketText: "RED IS COMING",
  // Smaller supporting line under the headline.
  tagline: "Something is being built here.",
  // Tiny line at the very bottom.
  footer: "© 2026 Ruby Osborne",

  // ---- Theme (every color is a CSS variable, change freely) ----
  theme: {
    bg:        "#0a0a0a", // page background
    fg:        "#f5f5f5", // primary text
    muted:     "#8a8a8a", // secondary text
    accent:    "#ff2222", // the red
    accentDim: "#7a0d0d", // darker red for glows/borders
    bracket:   "#ff2222", // color of the [ ] brackets
    font:      "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace",
  },

  // ---- Feature toggles ----
  features: {
    blinkingCursor:  true,  // terminal-style blinking cursor after headline
    typeEffect:      true,  // type out the bracket text on load
    glow:            true,  // red glow behind the headline
    scanlines:      false,  // retro CRT scanline overlay
    showSocials:     true,  // render the social/contact row
  },

  // ---- Social / contact links (empty array hides the row) ----
  // Add as many as you like: { label, href }
  socials: [
    { label: "EMAIL",  href: "mailto:ruby.osborne@gmail.com" },
    // { label: "GITHUB", href: "https://github.com/yourhandle" },
    // { label: "X",      href: "https://x.com/yourhandle" },
  ],
};
