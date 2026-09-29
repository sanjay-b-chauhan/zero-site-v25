/* Real scenario data from the Zero product (Business Analyst roadmap). Edit copy here, nowhere else. */
window.ZERO = window.ZERO || {};
ZERO.START_URL = 'https://sanjay-b-chauhan.github.io/github-project/zero-start.html?from=site';
/* after the zero is drawn on this page: the onboarding, entered past its own draw screen */
ZERO.START_DIRECT = 'https://sanjay-b-chauhan.github.io/github-project/zero-start.html';
/* every Start button: the onboarding, which opens by asking you to draw the zero yourself */

ZERO.VERSION = 'v25';
ZERO.VERSIONS = [
 { id: 'v1', n: 'V1', t: 'The first pass', s: 'Orange, invented UI', url: 'https://zero-site-v1.vercel.app' },
 { id: 'v2', n: 'V2', t: 'The dark cut', s: 'Full bleed film, glass', url: 'https://zero-site-v2.vercel.app' },
 { id: 'v3', n: 'V3', t: 'The editorial one', s: 'Hairlines and square frames', url: 'https://zero-site-v3.vercel.app' },
 { id: 'v4', n: 'V4', t: 'One camera', s: 'Map in the zero, masks', url: 'https://zero-site-v4.vercel.app' },
 { id: 'v5', n: 'V5', t: 'The real product', s: 'Storyboard first, real footage', url: 'https://zero-site-v5.vercel.app' },
 { id: 'v6', n: 'V6', t: 'One nav', s: 'Dock, XP meter, levels', url: 'https://zero-site-v6.vercel.app' },
 { id: 'v7', n: 'V7', t: 'Butter light', s: 'Glass dock, ASCII world, colour reveals', url: 'https://zero-site-v7.vercel.app' },
 { id: 'v8', n: 'V8', t: 'Sticky chapters', s: 'Stacked cards, scroll seam, big ink', url: 'https://zero-site-v8.vercel.app' },
 { id: 'v9', n: 'V9', t: 'Navid opening', s: 'Zero portal, light type, ASCII zero', url: 'https://zero-site-v9.vercel.app' },
 { id: 'v10', n: 'V10', t: 'Live Zero World', s: 'Real opportunities on the map, green frost', url: 'https://zero-site-v10.vercel.app' },
 { id: 'v11', n: 'V11', t: 'More air', s: 'Centred titles, halftone coaches, green footer', url: 'https://zero-site-v11.vercel.app' },
 { id: 'v12', n: 'V12', t: 'Room to breathe', s: 'Coach network, thick ink, wordmark footer', url: 'https://zero-site-v12.vercel.app' },
 { id: 'v13', n: 'V13', t: 'Quiet footer', s: 'Lit wordmark, sound off, no drone', url: 'https://zero-site-v13.vercel.app' },
 { id: 'v14', n: 'V14', t: 'Three tabs', s: 'Kickoff, workspace, feedback; chips back', url: 'https://zero-site-v14.vercel.app' },
 { id: 'v15', n: 'V15', t: 'Clean tabs', s: 'Three tabs, no chip rows', url: 'https://zero-site-v15.vercel.app' },
 { id: 'v16', n: 'V16', t: 'Navid\u2019s story', s: 'Why, immerse, network, roles, how, match, start', url: 'https://zero-site-v16.vercel.app' },
 { id: 'v17', n: 'V17', t: 'Zoom out to the laptop', s: 'Zero fonts, full-screen sections', url: 'https://zero-site-v17.vercel.app' },
 { id: 'v18', n: 'V18', t: 'One system', s: 'Logo marquee, grain field, real product', url: 'https://zero-site-v18.vercel.app' },
 { id: 'v19', n: 'V19', t: 'Three layouts a section', s: 'Layout key, bubbles, edge to edge', url: 'https://zero-site-v19.vercel.app' },
 { id: 'v20', n: 'V20', t: 'One flow', s: 'theagi system, world in the laptop, portfolio to match', url: 'https://zero-site-v20.vercel.app' },
 { id: 'v21', n: 'V21', t: 'Centred flow', s: 'Mark to laptop, orbit, flip board, tabs', url: 'https://zero-site-v21.vercel.app' },
 { id: 'v22', n: 'V22', t: 'Less text', s: 'UI skills pass, transform-only motion', url: 'https://zero-site-v22.vercel.app' },
 { id: 'v23', n: 'V23', t: 'Premium pass', s: 'Scouted-by slot, role cinema, bigger type', url: 'https://zero-site-v23.vercel.app' },
 { id: 'v24', n: 'V24', t: 'One ink', s: 'Black only, tighter type, bigger Start', url: 'https://zero-site-v24.vercel.app' },
 { id: 'v25', n: 'V25', t: 'Best roles', s: 'Role showcase, click credits, browser tabs', url: 'https://zero-site-v25.vercel.app' }
];
ZERO.categories = [
 {
  "id": "growth-revenue",
  "title": "Growth and revenue"
 },
 {
  "id": "operational-efficiency",
  "title": "Operations"
 },
 {
  "id": "product-kpi-architecture",
  "title": "Product and KPIs"
 },
 {
  "id": "market-entry",
  "title": "Market entry"
 },
 {
  "id": "ai-enablement",
  "title": "AI and automation"
 }
];
ZERO.scenarios = [
 {
  "id": "ba-01",
  "order": 1,
  "company": "Notion",
  "title": "Find the leak in a signup funnel",
  "brief": "Only 5.9% of visitors become accounts. Find the step that leaks the most and size what fixing it is worth.",
  "role": "Business Analyst, Growth",
  "minutes": 150,
  "level": "Beginner",
  "skills": [
   "Funnel and conversion analysis",
   "Opportunity sizing",
   "A/B test design"
  ],
  "tools": [
   "Google Sheets",
   "SQL",
   "Claude"
  ],
  "cat": "growth-revenue",
  "tint": "#f2f0ea",
  "logo": "notion"
 },
 {
  "id": "ba-02",
  "order": 2,
  "company": "Spotify",
  "title": "Isolate an early-churn driver",
  "brief": "Subscribers leave in their first weeks. Work out which week they go, and why.",
  "role": "Business Analyst, Retention",
  "minutes": 165,
  "level": "Beginner",
  "skills": [
   "Cohort analysis",
   "LTV/CAC",
   "Behavioral segmentation"
  ],
  "tools": [
   "Google Sheets",
   "SQL",
   "ChatGPT"
  ],
  "cat": "growth-revenue",
  "tint": "#1db954",
  "logo": "spotify",
  "art": "spotify",
  "show": "Skip Loop",
  "x": 63.8,
  "y": 57.3
 },
 {
  "id": "ba-03",
  "order": 3,
  "company": "Shopify",
  "title": "Price a support-ticket problem",
  "brief": "Support tickets have climbed for twelve months. Cost the problem and model what you can really deflect.",
  "role": "Junior Business Analyst",
  "minutes": 150,
  "level": "Beginner",
  "skills": [
   "Cost-driver analysis",
   "Automation-opportunity identification",
   "Adoption and deflection modeling"
  ],
  "tools": [
   "Google Sheets",
   "Google Docs",
   "Tableau"
  ],
  "cat": "operational-efficiency",
  "tint": "#95bf47",
  "logo": "shopify"
 },
 {
  "id": "ba-04",
  "order": 4,
  "company": "Netflix",
  "title": "Decompose a revenue slowdown",
  "brief": "Revenue growth dropped and leadership got caught out. Split it into subscribers and price, then cost the recovery.",
  "role": "Business Analyst, Growth & Strategy",
  "minutes": 180,
  "level": "Intermediate",
  "skills": [
   "Revenue decomposition",
   "Multi-driver diagnosis",
   "Lever selection and costing"
  ],
  "tools": [
   "Google Sheets",
   "Google Slides",
   "ChatGPT"
  ],
  "cat": "growth-revenue",
  "tint": "#e50914",
  "logo": "netflix",
  "art": "netflix",
  "show": "Volume vs Value",
  "x": 61.6,
  "y": 41.6
 },
 {
  "id": "ba-05",
  "order": 5,
  "company": "Slack",
  "title": "Read an experiment and scope the rollout",
  "brief": "An onboarding test lifted activation. Check the lift is real and decide who it ships to.",
  "role": "Business Analyst, Product",
  "minutes": 165,
  "level": "Intermediate",
  "skills": [
   "A/B interpretation",
   "Guardrail metrics",
   "Decision under uncertainty"
  ],
  "tools": [
   "Google Sheets",
   "SQL",
   "Claude"
  ],
  "cat": "growth-revenue",
  "tint": "#611f69",
  "logo": "slack",
  "art": "slack",
  "show": "Decision Hunt"
 },
 {
  "id": "ba-06",
  "order": 6,
  "company": "Airbnb",
  "title": "Trace cancellations to a root cause",
  "brief": "Hosts are cancelling and nobody knows why. Find the leading reason and size what a fix would catch.",
  "role": "Business Analyst, Marketplace Operations",
  "minutes": 165,
  "level": "Intermediate",
  "skills": [
   "Marketplace root-cause diagnosis",
   "Addressable-share modeling",
   "Fix-effectiveness estimation"
  ],
  "tools": [
   "Google Sheets",
   "Claude",
   "Lucidchart"
  ],
  "cat": "operational-efficiency",
  "tint": "#ff5a5f",
  "logo": "airbnb",
  "art": "airbnb",
  "show": "Cancel Crisis",
  "x": 56.1,
  "y": 60.4
 },
 {
  "id": "ba-07",
  "order": 7,
  "company": "Amazon",
  "title": "Sequence a fix behind a pilot",
  "brief": "Packages are missing their deadlines. Map the flow, name the bottleneck, and stage the rollout.",
  "role": "Business Analyst, Fulfillment Center Operations",
  "minutes": 180,
  "level": "Intermediate",
  "skills": [
   "Process mapping",
   "Bottleneck identification",
   "Sensitivity analysis"
  ],
  "tools": [
   "Google Sheets",
   "Claude",
   "Miro"
  ],
  "cat": "operational-efficiency",
  "tint": "#ff9900",
  "logo": "amazon",
  "art": "amazon",
  "show": "Stock Detour",
  "x": 38.4,
  "y": 45.6
 },
 {
  "id": "ba-08",
  "order": 8,
  "company": "Microsoft",
  "title": "Design a retention KPI framework",
  "brief": "Retention is measured with numbers nobody acts on. Set the north star and the metric that stops it being gamed.",
  "role": "Business Analyst, Product Analytics",
  "minutes": 195,
  "level": "Intermediate",
  "skills": [
   "North-star design",
   "Leading vs lagging",
   "KPI hierarchy"
  ],
  "tools": [
   "Google Sheets",
   "Power BI",
   "Confluence"
  ],
  "cat": "product-kpi-architecture",
  "tint": "#2f6fde",
  "logo": "microsoft"
 },
 {
  "id": "ba-09",
  "order": 9,
  "company": "Canva",
  "title": "Price a new tier against cannibalization",
  "brief": "A cheaper ad tier is on the table. Find the downgrade share where it breaks even.",
  "role": "Business Analyst, Strategy",
  "minutes": 180,
  "level": "Intermediate",
  "skills": [
   "Pricing strategy",
   "Cannibalization analysis",
   "Revenue modeling"
  ],
  "tools": [
   "Google Sheets",
   "Google Slides",
   "ChatGPT"
  ],
  "cat": "market-entry",
  "tint": "#7d2ae8",
  "logo": "canva"
 },
 {
  "id": "ba-10",
  "order": 10,
  "company": "Meta",
  "title": "Untangle blended KPIs",
  "brief": "Self serve and enterprise share one set of numbers, and it flatters both. Split them.",
  "role": "Business Analyst, Product Analytics",
  "minutes": 195,
  "level": "Advanced",
  "skills": [
   "KPI hierarchy",
   "Leading vs lagging",
   "Measurement bias"
  ],
  "tools": [
   "Google Sheets",
   "SQL",
   "Power BI"
  ],
  "cat": "product-kpi-architecture",
  "tint": "#0866ff",
  "logo": "meta"
 },
 {
  "id": "ba-11",
  "order": 11,
  "company": "Stripe",
  "title": "Size a market two ways",
  "brief": "A new format is proposed. Size the demand from both directions, then ask if it is the right question.",
  "role": "Business Analyst, New Verticals",
  "minutes": 180,
  "level": "Intermediate",
  "skills": [
   "Market sizing",
   "Demand and supply economics",
   "Reframing the product question"
  ],
  "tools": [
   "Google Sheets",
   "Claude",
   "Google Slides"
  ],
  "cat": "market-entry",
  "tint": "#635bff",
  "logo": "stripe"
 },
 {
  "id": "ba-12",
  "order": 12,
  "company": "HubSpot",
  "title": "Automate lead qualification, then prove it",
  "brief": "Lead qualification is manual and slow. Build the classifier, test it against a human, route the unsure ones.",
  "role": "Business Analyst, Revenue Operations",
  "minutes": 195,
  "level": "Advanced",
  "skills": [
   "Workflow automation",
   "AI classification",
   "Prompt design"
  ],
  "tools": [
   "Zapier",
   "Gemini",
   "Google Sheets"
  ],
  "cat": "ai-enablement",
  "tint": "#ff7a59",
  "logo": "hubspot"
 },
 {
  "id": "ba-13",
  "order": 13,
  "company": "Google",
  "title": "Rebuild an OKR set that mismeasures",
  "brief": "Developer OKRs treat solo builders and big teams as one group. Split the tracks and fix the key result.",
  "role": "Business Analyst, Developer Ecosystem",
  "minutes": 210,
  "level": "Advanced",
  "skills": [
   "OKR design",
   "Leading indicators",
   "Measurement bias"
  ],
  "tools": [
   "Google Sheets",
   "SQL",
   "Confluence"
  ],
  "cat": "product-kpi-architecture",
  "tint": "#4285f4",
  "logo": "google",
  "art": "google",
  "show": "Draft Doctor"
 },
 {
  "id": "ba-14",
  "order": 14,
  "company": "Duolingo",
  "title": "Turn 2,000 reviews into ranked themes",
  "brief": "2,000 reviews and no time to read them. Build a pipeline that ranks the themes, then prove it.",
  "role": "Business Analyst, Customer Insights",
  "minutes": 180,
  "level": "Intermediate",
  "skills": [
   "AI text analysis",
   "Theme clustering",
   "Prompt design"
  ],
  "tools": [
   "Claude Code",
   "Google Sheets",
   "Python"
  ],
  "cat": "ai-enablement",
  "tint": "#58cc02",
  "logo": "duolingo",
  "art": "duolingo",
  "show": "Streak Break"
 },
 {
  "id": "ba-15",
  "order": 15,
  "company": "Uber",
  "title": "Condition a market entry on a gap",
  "brief": "A corporate push against a $6B market. Size it down to what is reachable. Go, no, or not yet.",
  "role": "Business Analyst, Corporate Strategy",
  "minutes": 210,
  "level": "Advanced",
  "skills": [
   "TAM/SAM/SOM",
   "Competitive landscape",
   "Procurement and regulatory risk"
  ],
  "tools": [
   "Google Sheets",
   "Google Slides",
   "Claude"
  ],
  "cat": "market-entry",
  "tint": "#ffffff",
  "logo": "uber",
  "art": "uber",
  "show": "Curbside Chase",
  "x": 52.7,
  "y": 64.6
 },
 {
  "id": "ba-16",
  "order": 16,
  "company": "OpenAI",
  "title": "Gate an AI pilot on quality",
  "brief": "A support copilot could save millions. Decide what has to be true about quality before it ships.",
  "role": "Business Analyst, Service Operations",
  "minutes": 225,
  "level": "Advanced",
  "skills": [
   "Human-vs-AI task mapping",
   "Automation ROI",
   "Risk register"
  ],
  "tools": [
   "Google Sheets",
   "Claude",
   "Confluence"
  ],
  "cat": "ai-enablement",
  "tint": "#10a37f",
  "logo": "openai",
  "x": 40.6,
  "y": 60.6
 }
];
ZERO.coaches = [
 {
  "key": "jenna",
  "name": "Jenna",
  "style": "Warm",
  "line": "Hey, you are doing better than you think. Let us fix one small thing together.",
  "about": "Patient and encouraging. Celebrates small wins and never makes you feel behind."
 },
 {
  "key": "ian",
  "name": "Ian",
  "style": "Motivational",
  "line": "Two KPIs are one band from a jump. Pick one and we go take it.",
  "about": "High energy and competitive. Frames every gap as a level to beat."
 },
 {
  "key": "jessica",
  "name": "Jessica",
  "style": "Strategic",
  "line": "Before the fix, the pattern. What is the one habit driving most of this?",
  "about": "Calm and big picture. Helps you see the pattern behind the score."
 },
 {
  "key": "navi",
  "name": "Navi",
  "style": "Direct",
  "line": "Communication is below bar and it is costing you trust. Fix it.",
  "about": "Blunt and allergic to excuses. Respects effort, nothing else."
 }
];

/* Zero World: the four live opportunities from why.zero.university's map, verbatim, with the building each
   one stands on (u, v across the city image, same coordinates the real map uses) */
ZERO.world = [
 { id: 'spotify', name: 'Spotify', logo: 'spotify', video: 'Spotify-Card', u: 0.634, v: 0.585, role: 'Business Analyst', scenario: 'Restoring Free-to-Premium Conversion at Spotify', description: '', tools: ['anthropic', 'googlesheets', 'googleslides'] },
 { id: 'openai', name: 'OpenAI (ChatGPT)', logo: 'openai', video: 'ChatGPT-Card', u: 0.407, v: 0.628, role: 'Business Analyst', scenario: 'ChatGPT Conversion Analysis', description: 'Identify why ChatGPT users aren\u2019t upgrading and propose a solution to improve conversion.', tools: ['codex', 'canva', 'googlesheets'] },
 { id: 'google', name: 'Google', logo: 'google', video: 'Google-Card', u: 0.385, v: 0.314, role: 'Software Engineer', scenario: 'Gmail AI Rewrite Prototype', description: 'Build an AI rewrite prototype in Gmail that helps users finish long email drafts.', tools: ['cursor', 'nextjs', 'vercel', 'supabase', 'gemini'] },
 { id: 'nike', name: 'Nike', logo: 'nike', video: 'Nike-Card', u: 0.824, v: 0.462, role: 'Data Scientist', scenario: 'Demand Forecasting Model for Nike Zoom Launch', description: 'Build a demand forecasting model that predicts weekly sales for the Nike Zoom launch.', tools: ['cursor', 'pandas', 'jupyter', 'notebook', 'python'] }
];
ZERO.toolNames = { python: 'Python', jupyter: 'Jupyter', notebook: 'Notebook', pandas: 'Pandas', cursor: 'Cursor', codex: 'Codex', canva: 'Canva', googlesheets: 'Google Sheets', googleslides: 'Google Slides', nextjs: 'Next.js', vercel: 'Vercel', supabase: 'Supabase', gemini: 'Gemini', anthropic: 'Claude' };

/* ---------------- V16: Navid's narrative ---------------- */
ZERO.VERSION = 'v25';
/* tools: product tool icons live in assets/zw/tools, brand marks in assets/brands */
ZERO.tools = {
  cursor: ['zw/tools/cursor.svg', 'Cursor'], anthropic: ['zw/tools/anthropic.svg', 'Claude'], nextjs: ['zw/tools/nextjs.svg', 'Next.js'],
  vercel: ['zw/tools/vercel.svg', 'Vercel'], supabase: ['zw/tools/supabase.svg', 'Supabase'], python: ['zw/tools/python.svg', 'Python'],
  pandas: ['zw/tools/pandas.svg', 'Pandas'], jupyter: ['zw/tools/jupyter.svg', 'Jupyter'], codex: ['zw/tools/codex.svg', 'Codex'],
  canva: ['zw/tools/canva.svg', 'Canva'], googlesheets: ['zw/tools/googlesheets.svg', 'Google Sheets'], googleslides: ['zw/tools/googleslides.svg', 'Google Slides'],
  gemini: ['zw/tools/gemini.svg', 'Gemini'], figma: ['brands/figma.svg', 'Figma'], hubspot: ['brands/hubspot.svg', 'HubSpot'], notion: ['brands/notion.svg', 'Notion']
};
/* roles Navid named, with the work you'd ship and the tools you'd use. video = a real Zero clip */
ZERO.roles = [
  { id: 'ai-engineer', t: 'AI Engineer', tag: 'Hot', v: 'zw/Google-Card', ship: 'An AI rewrite prototype inside Gmail', tools: ['cursor', 'anthropic', 'nextjs', 'vercel'] },
  { id: 'product-engineer', t: 'Product Engineer', tag: 'Trending', v: 'film/clean', ship: 'A fare engine refactor that keeps every price right', tools: ['cursor', 'nextjs', 'supabase'] },
  { id: 'design-engineer', t: 'Design Engineer', tag: 'Trending', v: 'film/tools', ship: 'A playable onboarding for a new game mechanic', tools: ['figma', 'cursor', 'vercel'] },
  { id: 'product-designer', t: 'Product Designer', tag: '', v: 'film/slides', ship: 'A cancellation flow people actually trust', tools: ['figma', 'googleslides'] },
  { id: 'gtm-engineer', t: 'GTM Engineer', tag: 'Hot', v: 'zw/Spotify-Card', ship: 'Automated lead qualification, proven with data', tools: ['hubspot', 'googlesheets', 'anthropic'] },
  { id: 'data-scientist', t: 'Data Scientist', tag: '', v: 'zw/Nike-Card', ship: 'A demand forecast for the Nike Zoom launch', tools: ['python', 'pandas', 'jupyter'] },
  { id: 'business-analyst', t: 'Business Analyst', tag: '', v: 'zw/ChatGPT-Card', ship: 'A fix for ChatGPT free-to-paid conversion', tools: ['codex', 'googlesheets', 'canva'] },
  { id: 'full-stack-engineer', t: 'Full-stack Engineer', tag: '', v: 'film/read', ship: 'Pagination and filtering for a production API', tools: ['nextjs', 'supabase', 'vercel'] },
  { id: 'growth-marketer', t: 'Growth Marketer', tag: '', v: 'film/chat', ship: '2,000 reviews turned into ranked themes', tools: ['googlesheets', 'canva', 'anthropic'] },
  { id: 'investment-banking', t: 'Investment Banking Analyst', tag: 'Trending', v: 'film/report', ship: 'A comps model and a pitch deck', tools: ['googlesheets', 'googleslides'] },
  { id: 'chief-of-staff', t: 'Chief of Staff', tag: '', v: 'film/room', ship: 'A weekly operating review the CEO reads', tools: ['notion', 'googleslides', 'anthropic'] }
];
/* outcome: the better you perform, the more roles unlock */
ZERO.matches = [
  { co: 'notion', role: 'Growth Analyst', lvl: 1 }, { co: 'spotify', role: 'Data Analyst', lvl: 1 },
  { co: 'airbnb', role: 'Product Analyst', lvl: 2 }, { co: 'shopify', role: 'Business Analyst', lvl: 2 },
  { co: 'duolingo', role: 'Product Designer', lvl: 3 }, { co: 'canva', role: 'Marketing Analyst', lvl: 3 }, { co: 'hubspot', role: 'GTM Engineer', lvl: 3 },
  { co: 'figma', role: 'Design Engineer', lvl: 4 }, { co: 'stripe', role: 'Product Engineer', lvl: 4 }, { co: 'uber', role: 'Operations Analyst', lvl: 4 },
  { co: 'netflix', role: 'Strategy Analyst', lvl: 5 }, { co: 'openai', role: 'AI Engineer', lvl: 5 }
];
/* the talent network wall. brand colours come from simple-icons; a few read better in ink */
ZERO.network = ['google', 'openai', 'spotify', 'airbnb', 'netflix', 'notion', 'stripe', 'shopify', 'uber', 'figma', 'nike', 'canva', 'duolingo', 'hubspot', 'anthropic', 'slack'];
ZERO.brandInk = { openai: '#000000', notion: '#000000', uber: '#000000', nike: '#111111', anthropic: '#191919', google: '#4285F4' };
/* Ask Zero. answers come from Navid's own FAQ copy */
ZERO.faq = [
  { q: 'What is Zero?', k: ['what is', 'zero', 'about', 'how does it work'], a: 'Zero helps you build experience through projects in simulated teams. You practice with modern tools, get feedback, and create work that shows what you can do.' },
  { q: 'Do I need experience?', k: ['experience', 'beginner', 'start', 'no experience', 'need'], a: 'No. Pick a role you are curious about. Learn the skills in context, as you work through the project.' },
  { q: 'What are credits?', k: ['credit', 'points', 'free', 'price', 'cost', 'pay'], a: 'Credits are how you use Zero. The more credits you earn, the more you use Zero for free. You are earning some right now.' },
  { q: 'How does this get me hired?', k: ['hired', 'job', 'recruit', 'match', 'network', 'intro'], a: 'Your projects become evidence of your skills. We combine that evidence with your profile and connect you through the Zero talent network. Hiring decisions stay with each employer.' },
  { q: 'Are these real companies?', k: ['real', 'companies', 'company', 'partner', 'netflix', 'spotify', 'google'], a: 'The projects are simulations inspired by familiar business problems. Company names describe the project context, not employment, endorsement or a partnership.' },
  { q: 'Which roles can I train for?', k: ['role', 'roles', 'engineer', 'designer', 'analyst', 'banking', 'marketing'], a: 'AI and product engineering, design, data, growth, business analysis, banking and more. Tap a role on this page, or hit Start and tell us yours.' }
];
ZERO.faqMiss = 'Good question. Hit Start and ask your manager inside Zero, or write to team@zero.university.';
/* your manager, in the workspace step */
ZERO.manager = {
  replies: [
    'Good call. Start with the brief, then pull the last 90 days of data. I will check in at 2.',
    'Start with the pricing rules. Then we will work through the refactor together.',
    'The structure can change. The prices can’t. Protect that with tests first.',
    'Send me what you have by end of day. Rough is fine.'
  ],
  keys: [
    { k: ['stuck', 'help', 'confused', 'lost'], a: 'Tell me the last thing that worked. We will go from there, one step at a time.' },
    { k: ['data', 'numbers', 'sheet', 'spreadsheet'], a: 'Open the sheet I sent. Look at who drops off after day one. That is our story.' },
    { k: ['hi', 'hello', 'hey', 'yo'], a: 'Hey. Glad you are here. Where do you want to start, the brief or the data?' }
  ]
};
