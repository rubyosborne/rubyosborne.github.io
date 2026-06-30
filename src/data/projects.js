// Projects shown on /work. Short/long descriptions mined from Ruby's own
// knowledge bases (vaults + repos). Images/logos are added per project at
// /public/projects/<id>.jpg (until then a gradient + monogram shows).
//
// Fields:
//   id, name, tag, accent, short, long(HTML), status('dev'|'discontinued'|null),
//   image(true once a real photo exists), links[{label,href}], email(bool),
//   download({label,href})

export const projects = [
  {
    id: 'long-term-investing-bot',
    name: 'Long Term Investing Bot',
    tag: 'Finance · Automation',
    accent: '#3f6b4a',
    short:
      'A hands-free investing engine — it pulls live market data, runs every idea through a seven-step funnel, tracks my portfolio and keeps a research vault. I jot ideas; it does the work.',
    long: `<p>The system behind my long-term equity investing. Every Monday a scheduled routine pulls real prices, macro, fundamentals and my actual holdings, then runs the analysis: a seven-step funnel and ten valuation frameworks, three-scenario DCFs on real free cash flow, position-sizing rules, and a weekly exit review against each holding's invalidation trigger.</p>
    <p>Underneath sits a structured knowledge base of stocks, themes and policy. The investment policy is enforced, not advisory — breaches get flagged. Computed numbers come from Python and live data feeds; the model interprets, it never invents prices. The full write-up is public.</p>`,
    links: [{ label: 'Read the full write-up', href: 'https://gist.github.com/rubyosborne/1a16f804bb9db0b62b521980116f028a' }],
  },
  {
    id: 'investing-newsletter',
    name: 'Investing Newsletter',
    tag: 'Finance · Writing',
    accent: '#c98a3c',
    short:
      'A weekly brief my system writes and sends itself — a technical version for me (portfolio vs the S&P 500) and a plain-English one for friends, no jargon.',
    long: `<p>Every Monday the system turns its analysis into two written pieces. The technical brief lands in my inbox: portfolio versus benchmark, the week's trades, the full funnel, and picks with conviction ratings and bear cases. The friend newsletter is the public-facing one — the same thinking translated into plain language, with a jargon-buster.</p>
    <p>It writes both, opens a pull request, and emails them automatically when the brief merges. No drafting, no send button. The tone is the part I care about: confident, concrete and lightly personal — the way I'd actually explain a stock to a friend.</p>`,
  },
  {
    id: 'trading-bot',
    name: 'Trading Bot',
    tag: 'Finance · Automation',
    accent: '#b5482f',
    short:
      'An automated investing system running a picks-and-shovels AI & robotics thesis — quantitative technicals paired with an LLM decision layer, always with human sign-off.',
    long: `<p>Each scheduled run collects live market data and technicals, feeds a structured briefing to a reasoning layer, and returns a ranked trade decision against a defined strategy and hard risk guardrails — concentration caps, fee ceilings and RSI-based sizing. Nothing executes without me: the bot emails a recommendation, waits for approval, then places fee-optimised orders and logs the result.</p>
    <p>It currently runs in paper-trading mode as a single-operator system, in private testing. A waitlist is open for early access ahead of a wider release.</p>`,
    email: true,
  },
  {
    id: 'life-operating-system',
    name: 'Life Operating System',
    tag: 'Personal · AI',
    accent: '#3b6f78',
    status: 'dev',
    short:
      "An AI agent that runs my daily training and wellness on autopilot — reading my logs and recovery markers each evening, then writing the next day's session.",
    long: `<p>A self-directing daily engine. Every evening it clones a structured repo of my profile, goals, training phases and recovery gates, scans my reports and wearable check-ins, recalibrates the plan against missed or modified work, and posts tomorrow's fully specified session. Recovery markers — not the calendar — gate progression, and durable preferences persist as long-term memory.</p>
    <p>It runs as isolated "athletes" off one shared, parameterised skill, each writing only to its own space. Actively in development: I'm hardening the recalibration logic, expanding image-based check-ins, and onboarding a second user.</p>`,
  },
  {
    id: 'tallow-lab',
    name: 'Tallow Lab',
    tag: 'Product · Skincare',
    accent: '#cda06a',
    short:
      'A premium, minimalist skincare brand built on one hero ingredient — rendered beef tallow, biologically close to our own skin lipids. Barrier repair through radical simplicity, not synthetic actives.',
    long: `<p>Tallow Lab sits at the intersection of ancestral nutrition and clean, bio-compatible skincare, built on a simple thesis: skin thrives on biologically compatible fats, and tallow is one of the most skin-identical, nutrient-dense moisturising bases there is. The range — whipped tallow balms for face and body, lightly infused with botanicals — is built around minimal-ingredient formulations for low irritation and barrier repair.</p>
    <p>As a business it's direct-to-consumer (Shopify-led, with natural pull into subscription replenishment and ancestral / clean-living communities). Its edge is narrative as much as formulation: where most brands compete on synthetic actives and complex routines, Tallow Lab competes on radical simplicity and ingredient transparency — "back to what skin actually recognises." I built it end-to-end, brand to store.</p>`,
    logo: true,
  },
  {
    id: 'tend-robotics',
    name: 'Tend Robotics',
    tag: 'Robotics · Hardware',
    accent: '#5b6b7a',
    short:
      'An early-stage robotics venture exploring how embodied machines can take on the physical work people would rather hand off — mechatronics meets frontier AI.',
    long: `<p>Tend Robotics starts from a simple question: what does it take to make a capable machine you can actually trust in the real world? The focus is the embodied layer where software meets motion and perception — drawing on a mechatronics background to keep hardware, control and intelligence in one coherent design loop.</p>
    <p>The intent is sovereign by default: systems whose behaviour is legible to their owner, built on open standards rather than locked platforms. Tend is exploratory rather than finished — a working thesis about how frontier AI should meet the physical world.</p>`,
  },
  {
    id: 'closed-loop-hydroponic-farm',
    name: 'Closed Loop Hydroponic Plant Farm',
    tag: 'Engineering · Thesis',
    accent: '#4f7d3f',
    short:
      'A self-sustaining, closed-loop hydroponic farm — my final-year engineering thesis, recycling water and nutrients for high yield with minimal waste.',
    long: `<p>My final-year engineering thesis: a closed-loop hydroponic system that recirculates water and nutrients to grow high yields with a fraction of the inputs of conventional farming. The full thesis covers the system design, control loop and results.</p>`,
    download: { label: 'Download the thesis (PDF)', href: '/projects/closed-loop-hydroponic-thesis.pdf' },
  },
  {
    id: 'born-nutrition',
    name: 'BornNutrition',
    tag: 'App · Health',
    accent: '#c96f7e',
    status: 'discontinued',
    short:
      "An early React app that let my sister's nutrition clients work with her directly — tracking macros and training in one place. Now retired.",
    long: `<p>Built to solve a real problem close to home, BornNutrition gave my sister's nutrition clients a shared space to log macros, follow training and stay in contact with their coach between sessions. It was one of my first real builds — a single-page React app where learning the craft and shipping something useful happened at the same time.</p>
    <p>It's since been discontinued. As my sister moved into formal university study, purpose-built academic resources covered the same ground more thoroughly, and BornNutrition was gracefully retired — a fond early marker of where the craft started.</p>`,
    logo: true,
  },
  {
    id: 'personal-writing-style',
    name: 'Personal Writing Style',
    tag: 'Tooling · AI',
    accent: '#7d6aa8',
    short:
      "A system that learns how I write and drafts in my voice on any device — including a locked-down work laptop that can't touch git, GitHub or cloud sync.",
    long: `<p>I write across a phone, a home Mac, and a locked-down work laptop that allows only a browser and Claude. To keep one consistent voice everywhere, I built a private corpus of real samples distilled into editable, plain-language style rules — served as a portable skill rather than a trained model.</p>
    <p>Capture works anywhere: a custom remote connector queues new writing into the repo, and a weekly job on my Mac ingests it, re-distils the voice and rebuilds the bundle. No copy-paste, least-privilege auth, $0 infra. Full setup is on GitHub.</p>`,
    links: [{ label: 'View on GitHub', href: 'https://github.com/rubyosborne/personal-voice' }],
  },
];
