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
      'A hands-free investing engine, it pulls live market data, runs every idea through a seven-step funnel, tracks my portfolio and keeps a research vault. I jot ideas; it does the work.',
    long: `<p>The system behind my long-term equity investing. Every Monday a scheduled routine pulls real prices, macro, fundamentals and my actual holdings, then runs the analysis: a seven-step funnel and ten valuation frameworks, three-scenario DCFs on real free cash flow, position-sizing rules, and a weekly exit review against each holding's invalidation trigger.</p>
    <p>Underneath sits a structured knowledge base of stocks, themes and policy. The investment policy is enforced, not advisory, breaches get flagged. Computed numbers come from Python and live data feeds; the model interprets, it never invents prices. The full write-up is public.</p>`,
    links: [{ label: 'Read the full write-up', href: 'https://gist.github.com/rubyosborne/1a16f804bb9db0b62b521980116f028a' }],
  },
  {
    id: 'investing-newsletter',
    name: 'Investing Newsletter',
    tag: 'Finance · Writing',
    accent: '#c98a3c',
    short:
      'A plain-English investing newsletter for women who were never shown where to start, no jargon, no advice that needs a licence, just how I actually invest, so starting feels possible.',
    long: `<p>Most investing content is written for people who already invest. Women, especially, get left out, not for any lack of ability, but because the on-ramp is intimidating: no one tells you where to begin, and the fear of "getting it wrong" keeps a lot of capable people on the sidelines.</p>
    <p>This is my answer to that. My system already writes a weekly brief from its own analysis, portfolio versus the S&amp;P 500, the week's thinking, the picks, and the newsletter is the public-facing, plain-language version of it. It's shared as education, not personal financial advice, which keeps it the right side of regulation while still being genuinely useful. The aim is simple: make starting feel possible.</p>`,
    email: true,
  },
  {
    id: 'trading-bot',
    name: 'Trading Bot',
    tag: 'Finance · Research',
    accent: '#b5482f',
    status: 'training',
    short:
      'The research engine behind the trades, it turns finance podcasts into data, extracting every stock mention to test whether podcast hype actually predicts where a price goes next.',
    long: `<p>It asks a question the finance world assumes but rarely measures: when a popular podcast talks a stock up, does the price actually move? The system ingests finance shows, transcribes them, Whisper, or imported captions where a show has them, and uses a single, consistent LLM labeller to extract every stock mention with its sentiment and conviction, so the whole dataset is provably comparable.</p>
    <p>From there it runs an event study: does a mention predict short-term drift against the broader market in the days after? It's deliberately measurement-first, prove the signal is real before any of it ever touches a trade. Currently training on the data it's gathering.</p>`,
  },
  {
    id: 'life-operating-system',
    name: 'Life Operating System',
    tag: 'Personal · AI',
    accent: '#3b6f78',
    status: 'dev',
    short:
      "A personal operating system for training and nutrition, an AI agent that plans my gym and food, checks in over Slack, and adapts each day to how I'm actually recovering.",
    long: `<p>The problem it solves is the daily overhead of doing health well: knowing what to train, what to eat, and how to adjust when life gets in the way. The Life Operating System is an AI agent that owns that loop, it plans gym sessions and nutrition, takes my reports and check-ins over Slack, and rewrites the next day against my real recovery rather than a fixed calendar.</p>
    <p>It's in active development while I work through the part that matters most for something this personal: data sovereignty. The approach pairs self-hosting with temporal knowledge bases, time-versioned stores I own outright, so the full history of my health data stays mine and can be queried as it was at any point in time, with nothing handed to a third party. I'm settling that foundation before opening it up more widely.</p>`,
  },
  {
    id: 'tallow-lab',
    name: 'Tallow Lab',
    tag: 'Product · Skincare',
    accent: '#cda06a',
    short:
      "For anyone who wants to feel confident in their own skin, a premium, minimalist skincare brand built on one hero ingredient: rendered beef tallow, biologically close to our own skin's lipids.",
    long: `<p>It starts with a simple human want: to feel confident in your own skin. Tallow Lab sits at the intersection of ancestral nutrition and clean, bio-compatible skincare, built on a simple thesis, skin thrives on biologically compatible fats, and tallow is one of the most skin-identical, nutrient-dense moisturising bases there is. The range is whipped tallow balms for face and body, lightly infused with botanicals, built around minimal-ingredient formulations for low irritation and barrier repair.</p>
    <p>As a business it's direct-to-consumer (Shopify-led, with natural pull into subscription replenishment and ancestral / clean-living communities). Its edge is narrative as much as formulation: where most brands compete on synthetic actives and complex routines, Tallow Lab competes on radical simplicity and ingredient transparency, "back to what skin actually recognises." I built it end-to-end, brand to store.</p>
    <p>My co-founder has since left Auckland, and without a local manufacturing base the brand is now being sold as a complete, turnkey asset.</p>`,
    links: [{ label: 'Visit the store', href: 'https://nfvzbg-vw.myshopify.com' }],
  },
  {
    id: 'tend-robotics',
    name: 'Tend Robotics',
    tag: 'Robotics · Hardware',
    accent: '#5b6b7a',
    short: 'A physical AI deployment that could truly ameliorate the home-care gap for the elderly.',
    long: `<p>A physical AI deployment that could truly ameliorate the home-care gap for the elderly.</p>`,
    links: [{ label: 'View the preread (password protected)', href: '/deck' }],
  },
  {
    id: 'closed-loop-hydroponic-farm',
    name: 'Closed Loop Hydroponic Plant Farm',
    tag: 'Engineering · Thesis',
    accent: '#4f7d3f',
    short:
      'My final-year mechatronics thesis, an IoT-controlled hydroponic system that automatically holds perfect growing conditions, and grew measurably better plants than a non-automated setup.',
    long: `<p>A closed-loop, Internet-of-Things hydroponic system for productive food-growing in small urban spaces. Sensors and actuators, run by an Arduino and a Raspberry Pi, continuously hold the parameters that matter: pH, light, electrical conductivity (nutrients), temperature and humidity, using on-off control with hysteresis windows for stable real-time regulation and cloud-based data logging.</p>
    <p>Designed, built and validated end to end, it grew measurably better plants than a non-automated hydroponic setup, with as much care given to a clean interface and a design you'd actually want in your home as to the control loop. My ME024-2023 mechatronics research project; the full report is below.</p>`,
    download: { label: 'Download the thesis (PDF)', href: '/projects/closed-loop-hydroponic-thesis.pdf' },
  },
  {
    id: 'born-nutrition',
    name: 'BornNutrition',
    tag: 'App · Health',
    accent: '#c96f7e',
    status: 'discontinued',
    short:
      "An early React app that let my sister's nutrition clients work with her directly, tracking macros and training in one place. Now retired.",
    long: `<p>Built to solve a real problem close to home, BornNutrition gave my sister's nutrition clients a shared space to log macros, follow training and stay in contact with their coach between sessions. It was one of my first real builds, a single-page React app where learning the craft and shipping something useful happened at the same time.</p>
    <p>It's since been discontinued. As my sister moved into formal university study, purpose-built academic resources covered the same ground more thoroughly, and BornNutrition was gracefully retired, a fond early marker of where the craft started.</p>`,
  },
  {
    id: 'personal-writing-style',
    name: 'Personal Writing Style',
    tag: 'Tooling · AI',
    accent: '#7d6aa8',
    short:
      "A system that learns how I write and drafts in my voice on any device, including a locked-down work laptop that can't touch git, GitHub or cloud sync.",
    long: `<p>I write across a phone, a home Mac, and a locked-down work laptop that allows only a browser and Claude. To keep one consistent voice everywhere, I built a private corpus of real samples distilled into editable, plain-language style rules, served as a portable skill rather than a trained model.</p>
    <p>Capture works anywhere: a custom remote connector queues new writing into the repo, and a weekly job on my Mac ingests it, re-distils the voice and rebuilds the bundle. No copy-paste, least-privilege auth, $0 infra. Full setup is on GitHub.</p>`,
    links: [{ label: 'View on GitHub', href: 'https://github.com/rubyosborne/personal-voice' }],
  },
];
