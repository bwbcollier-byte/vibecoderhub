# Vibe Coder Hub — Design Prompt for Claude Design

> Design the complete visual system, every screen, every state, every modal, every empty state, and every responsive breakpoint for a directory + SaaS product called **Vibe Coder Hub**. This document is self-contained — you do not need to read the 2,800-line build spec. Everything you need to design is here.

---

## 1. The product in one paragraph

Vibe Coder Hub is the canonical directory and SaaS layer for the vibe-coding ecosystem. Indie hackers, founders, design engineers, and AI-first developers come here to find UI components, MCP servers, agent skills, subagents, plugins, slash commands, hooks, rules files, prompt recipes, starter kits, IDEs, AI models, sandboxes, observability tools, backend kits, design assets, and more — across **24 resource types**, all queryable by IDE compatibility and tech stack. The product also runs a **deals page** for credits and discounts, a **news section** with a weekly newsletter, a **model price tracker**, an **install guide system**, an **alternatives engine** (`/alternatives/cursor` etc.), and a **hosted gateway** that runs MCPs and agents on behalf of users (the SaaS revenue layer).

**Personality:** Linear × Vercel × Raycast. Confident, dense, fast. **Not** Product Hunt, not Awwwards, not glassy-shadcn-default. Dark-first with a polished light mode.

**Critical UX bet:** the user picks their stack and IDE once at first visit ("I build with Cursor + Next.js + Supabase"), and the entire site reshapes around that selection — every list filtered, every recommendation ranked, every install command tailored. This decision is the centrepiece of the design.

---

## 2. Brand & visual system

### Logo
- A clean lowercase wordmark plus a geometric monogram. The monogram is a 24×24 mark that works at favicon size.
- Avoid gradients in the mark itself.
- Pick a single accent colour that survives both dark and light mode and isn't claimed by a major dev tool (skip Vercel-black, Cursor-purple, Anthropic-orange, Linear-purple).
- Suggest two accent options for review (e.g. acid-lime + electric-blue) before committing.

### Type
- **UI:** Inter or Geist Sans
- **Code & monospace:** Geist Mono or JetBrains Mono
- **Headings:** the same UI face — no display fonts, no serifs

### Colour
- **Dark mode is default.** Background `#0a0a0c` to `#0f0f12`. Primary text near-white but not `#fff` (use `#fafafa`-ish to avoid eye-strain). Borders 6–8% white.
- **Light mode** uses the same hierarchy inverted, with borders 6–8% black.
- **Six semantic colours:** success (green), warning (amber), danger (red), info (blue), accent (your brand), neutral.
- **Type badges** — each of the 24 resource types gets a unique tinted background + icon. They're scanning aids, used everywhere. Keep them subtle: 8% saturation, no full-colour fills.
- **No gradient backgrounds** on cards or buttons. Gradients reserved for hero illustrations and the brand mark only.

### Density
- 8px base grid. Cards have generous internal padding but tight outer rhythm — this is a directory, density matters.
- Information-dense lists. **No marketing fluff sections** on detail pages. Every block earns its place.
- Compare to: Linear's issue list, Vercel's project dashboard, Raycast's command palette. Avoid: Product Hunt (too marketing-y), Awwwards (too animated), default shadcn (too template-y).

### Iconography
- **Lucide** as the base set. One stroke weight throughout (1.5px).
- **Brand logos** for tools/clients/models — render at 16px monochrome in compatibility rows, full-colour on detail pages.

### Motion
- Reductive. Most transitions 120–180ms ease-out.
- Cards have a subtle hover lift (1px y-translate, slight border brighten).
- **Skeleton screens, never spinners** for loading states. Use the actual card layout shape.
- Cmd-K palette opens with a 50ms fade-in — feels instant.

### Accessibility
- AA colour contrast minimum on body, AAA on copy text.
- All interactive elements keyboard-navigable; focus rings visible (don't suppress them).
- Code blocks have a "view as plain text" affordance.
- Every icon-only button has an aria-label.

---

## 3. Top-level navigation

### Desktop layout

A persistent top navigation bar:

```
[Logo]  [Components ▾] [Models] [MCPs] [Tools] [Deals] [News] [Guides]   [⌘K Search]   [Stack: Cursor·Next·Supabase ▾]   [Avatar / Sign in]
```

- The first 7 items are primary navigation. Components, Models, MCPs, Tools are most-clicked — give them prime placement. Deals / News / Guides slot next.
- "More" dropdown shelters the other 20 resource types (Skills, Subagents, Rules, Prompts, Plugins, Marketplaces, Hooks, Commands, Starters, Sandboxes, Observability, Backend Kits, Assets, Showcase, Docs-for-LLMs, Specs, Workflows, Stacks, Evals, Scripts).
- The **Stack chip** ("Cursor · Next · Supabase") is always visible and clickable — opens the stack picker modal. This is non-negotiable; it's the single most-used UI element after search.
- **⌘K Search** is a button that opens the command palette.
- **Avatar** opens the user menu (Profile, My Stacks, Bookmarks, Submissions, Settings, Sign out). Logged-out users see a **"Sign in"** ghost button + a primary **"Get started"** filled button.

### Mobile layout

- Hamburger top-left, logo centre, search icon top-right.
- Bottom nav with 5 icons: Home, Search, Bookmarks, News, Profile.
- Stack chip becomes a sticky banner under the header on mobile, dismissable per session.
- Every detail page gets a **sticky bottom action bar** on mobile (Try / Compare / Save / Share icons).

---

## 4. The complete page list

Design these screens. Every page needs hover, focus, loading, empty, error, and (where relevant) paywalled states. Every page is responsive at 375px / 768px / 1024px / 1440px breakpoints.

### Marketing & onboarding
1. Landing page (`/`) — for logged-out visitors
2. Sign up (`/signup`) — modal + dedicated page
3. Sign in (`/signin`) — modal + dedicated page
4. Forgot password (`/auth/forgot`)
5. Email verification (`/auth/verify`)
6. Welcome onboarding flow (3 steps after first sign-up)
7. Pricing page (`/pricing`)
8. About / Manifesto (`/about`)
9. Contact (`/contact`)

### Home & discovery
10. Home (logged in) (`/`) — different from the landing page
11. Universal search results (`/search?q=…`)
12. Cmd-K palette (overlay, not a page)

### Resource directory (24 type index pages, 24 type detail pages)
13. Type index — generic template that renders for all 24 types (Components / MCPs / Skills / Subagents / Scripts / Rules / Prompts / Plugins / Marketplaces / Hooks / Commands / Starters / Tools / Models / Sandboxes / Observability / Backend / Assets / Showcase / Docs-for-LLMs / Specs / Workflows / Stacks / Evals)
14. Type detail — generic template, with type-specific blocks switched in
15. Model detail (`/models/[slug]`) — special, longest page, 22 distinct content blocks
16. Open-weights model detail variant
17. Component detail (with live Sandpack playground)
18. MCP detail (with tool inspector)
19. Showcase detail (built-with-this gallery item)

### Cross-product features
20. Stack picker modal (the most-used modal)
21. Compare drawer (right-rail slide-in for "compare 2 of these")
22. Compare full-page (`/models/compare`) — side-by-side up to 4 models
23. Best-for landing pages (`/best-for/[use-case]`)
24. Alternatives landing pages (`/alternatives/[resource-slug]`)
25. By-hardware page (`/models/by-hardware`)

### Deals
26. Deals index (`/deals`)
27. Deal detail (`/deals/[slug]`)
28. Claim flow (modal)
29. Locked Pro deal state with paywall

### News
30. News index (`/news`)
31. News article (`/news/[slug]`)
32. Newsletter signup (modal + dedicated page)
33. Newsletter archive (`/newsletter`)

### Guides
34. Guides index (`/guides`)
35. Guide reader (`/[resource-slug]/guides/[guide-slug]`)
36. Step-by-step verifier UI (inline within guide reader)

### User dashboard
37. Profile public page (`/u/[username]`)
38. User stacks public list (`/u/[username]/stacks`)
39. User stack detail public (`/u/[username]/[stack-slug]`)
40. Dashboard home (`/dashboard`)
41. My bookmarks (`/dashboard/bookmarks`)
42. My collections (`/dashboard/collections`)
43. My stacks (private + draft) (`/dashboard/stacks`)
44. My submissions (`/dashboard/submissions`)
45. My alerts (`/dashboard/alerts`) — price alerts, deal alerts, news subscriptions
46. My claimed deals (`/dashboard/deals`)
47. My gateway subscriptions (`/dashboard/gateway`)
48. My API keys (`/dashboard/api-keys`)
49. Author dashboard (`/dashboard/author`) — for resource authors

### Settings
50. Settings overview (`/settings`)
51. Account (`/settings/account`)
52. Profile (`/settings/profile`)
53. Stack & client preferences (`/settings/stack`)
54. Notifications (`/settings/notifications`)
55. Billing & subscription (`/settings/billing`)
56. Connected accounts (`/settings/connections`) — GitHub, Google, etc
57. Privacy & data (`/settings/privacy`)
58. Theme & appearance (`/settings/appearance`)

### Submission flow
59. Submit a resource (`/submit`)
60. GitHub URL auto-import step
61. Type detection + form prefill step
62. Preview & publish step

### Try It / Playgrounds / Inspector
63. Inline model playground (lives in model detail)
64. Multi-model split playground (`/playground`)
65. MCP tool inspector (lives in MCP detail)
66. Component live preview (lives in component detail)

### Legal & utility
67. 404 page
68. 500 page
69. Maintenance page
70. Terms (`/terms`)
71. Privacy (`/privacy`)
72. Cookie banner (overlay)

---

## 5. Component library to design first

Build these as a design system *before* assembling pages. Each needs default, hover, focus, active, disabled, loading, and error states.

### Layout primitives
- Page shell (header + main + optional right rail + footer)
- Section heading (with optional CTA)
- Two-column with sticky sidebar
- Three-column dense grid
- Masonry grid (showcase only)
- Right-rail drawer (compare, claim deal, etc)
- Bottom sheet (mobile equivalent of drawer)

### Cards (one per resource type)
- **Generic resource card** — 240px tall, 320–400px wide. Contains: thumbnail, type badge, name, tagline, score, install count, compatible-clients icon row, 1–3 stack chips, save bookmark icon (top-right corner).
- **Component card variant** — replaces thumbnail with a live Sandpack mini-preview.
- **Model card variant** — leads with cost + intelligence rank instead of thumbnail.
- **Workflow card variant** — shows step count + duration label.
- **Stack card variant** (user-created bundles) — shows the 3–5 resources inside as overlapping chips.
- **Deal card** — shows deal value (`$5K credits`), provider logo, expiry, redeem CTA.
- **News card** — title, source, summary, hero image, kind badge, time-ago.
- **Guide card** — kind badge, title, difficulty, duration, OS badges.

### Interactive controls
- Buttons: primary, secondary, ghost, destructive, icon-only — three sizes.
- One-click install button: special component, see §11 below.
- Stack chip (dismissible / clickable / dropdown variants).
- Compatibility matrix cell (the ✅ ⚠️ ❌ ❓ glyph + tooltip).
- Type badge (24 variants, one per type).
- Tag pill (filter chip).
- Toggle / switch.
- Slider (with two-handle range variant for the cost calculator).
- Search input (inline + cmd-K variant).
- Filter dropdown (multi-select with checkboxes).
- Code block with copy-to-clipboard button (animated "copied!" confirmation).
- File-tree component (for guide step lists, version history).
- Vertical stepper (for guides and workflows).
- Table — sortable, with sticky header and "show more rows" expansion.
- Sparkline chart (price history).
- Bar / line / radar chart (capability comparisons).
- Status pill (`🟢 Available`, `⚡ New`, `🧠 Reasoning`, `👁️ Vision`, `🔧 Tools`, `📦 Open weights`).

### Overlays
- Modal (centred, 480px / 640px / 800px / fullscreen variants).
- Drawer (right slide-in, 480px desktop / fullscreen mobile).
- Popover (small contextual menus).
- Tooltip.
- Toast notification.
- Cmd-K palette.
- Cookie banner.
- Paywall overlay (special, see §12).

### Feedback
- Skeleton screens for every card type.
- Empty state component (illustration slot + heading + description + primary action).
- Error state component (with retry).
- Inline form validation (red border + helper text).
- Progress indicators (linear + radial for guide completion).

---

## 6. The Stack Picker (the most important UI element)

Triggered from the header chip, the welcome onboarding, and an "It looks like you build with X — want to set this as your stack?" prompt that fires after a session of behavioral signal.

**Layout:** centred modal, 640px wide, 3 sections:

```
┌────────────────────────────────────────┐
│   What's your setup?                    │
│   We'll tailor everything to it.        │
├────────────────────────────────────────┤
│   AI client(s)              [+ Add]    │
│   ☑ Cursor                              │
│   ☑ Claude Code                         │
│   ☐ Windsurf  ☐ Cline  ☐ Aider  ...     │
├────────────────────────────────────────┤
│   Tech stack               [+ Add]    │
│   ☑ Next.js  ☑ React  ☑ TypeScript     │
│   ☑ Supabase  ☐ Convex  ...             │
├────────────────────────────────────────┤
│   Hardware (for local models)          │
│   [ Apple Silicon ▾ ] [ M3 Max ▾ ]     │
│   [ 36 GB ▾ ]                           │
├────────────────────────────────────────┤
│   [Skip for now]      [Save my stack]  │
└────────────────────────────────────────┘
```

- Multi-select pills with brand logos. Most-popular options appear first; "+ Add" reveals the long tail.
- **Visual feedback while saving:** the page behind the modal *previews* the change — chips light up as items are added, the home feed silently re-orders. This makes the value tangible.
- **Persistence:** logged-in users save to their account. Logged-out users save to a cookie; we prompt to save permanently after their second visit.
- **Edit anytime** via the header chip.

---

## 7. The Home Page (logged-in version)

This is the landing pad for returning users. Build it around the user's saved stack.

```
[Header]
─────────────────────────────────────────────────────────────────────
HERO STRIP — "Welcome back, [name]"
"15 new resources match your stack since Tuesday"
[Browse new]                                       [Update my stack →]
─────────────────────────────────────────────────────────────────────
PRIMARY ROW — "For your stack"
A horizontal scroll of 8 mixed-type cards, ranked by stack relevance.
Each card has a "Why this?" tooltip on hover.
─────────────────────────────────────────────────────────────────────
TWO-COLUMN
┌───────────────────────────┬────────────────────────────────────┐
│ TRENDING                   │ TODAY                               │
│ A vertical list of 10      │ Top 5 news headlines:               │
│ trending resources across  │   • Claude Opus 4.7 price cut 30%   │
│ all types, with score and  │   • New Cursor 0.5x ships agents    │
│ compatible-clients icons.  │   • 21st.dev ships agents SDK       │
│                            │   ...                                │
│                            │ [See all news →]                    │
└───────────────────────────┴────────────────────────────────────┘
─────────────────────────────────────────────────────────────────────
"WHAT ARE YOU BUILDING?" PROMPT BOX
Single-line input + send button.
"Tell us what you're working on — we'll generate a stack."
(Routes to /best-for or AI-curated stack on submit.)
─────────────────────────────────────────────────────────────────────
TYPE ROWS — collapsed by default for types outside the user's interests
▸ Top components (8 cards)
▸ Top models (8 cards)
▸ Top MCPs (8 cards)
▾ Top skills, subagents, rules, plugins (collapsed)
─────────────────────────────────────────────────────────────────────
PRICE MOVES WIDGET (compact)
Sparkline ribbons showing biggest LLM price drops this week.
[Track a model →]
─────────────────────────────────────────────────────────────────────
DEALS STRIP
3 featured deal cards, mix of Public/Member/Pro tiers.
─────────────────────────────────────────────────────────────────────
RECENTLY UPDATED
Strip of 6 small cards showing freshly updated resources.
─────────────────────────────────────────────────────────────────────
SHOWCASE STRIP
Visual eye-candy: 4 large screenshots of vibe-coded projects.
─────────────────────────────────────────────────────────────────────
[Footer]
```

**Empty state** (new user with no stack saved): the home becomes a guided onboarding instead, with the stack picker prominent and "Try the demo" CTAs on three featured resources.

---

## 8. The Landing Page (logged out)

Marketing-grade. Sells the product to first-time visitors.

```
HERO
   "Every primitive a vibe coder needs.
    One directory. One install."
   [Sign up free] [Browse anonymously]
   Animated demo: a Cmd-K palette searches across types
   and one-click installs to "your" stack.

LIVE STATS BAR
   12,400 resources · 47 IDEs supported · 357 models tracked · $4.2M in deals

THREE-PILLAR EXPLAINER
   1. Find  →  cross-type search, real install metrics
   2. Try   →  inline playgrounds, MCP tool inspector
   3. Ship  →  one-click install to Cursor / Claude Code / Windsurf

LIVE RESOURCE WALL
   30 cards in a masonry grid showing real resources, animating in.

TESTIMONIAL ROW
   3 quotes from named users (with stacks shown next to their photo).

CALCULATOR TEASER
   Embedded mini cost-calculator: "How much would your AI bill be?"
   Drives sign-up at result.

DEAL TEASER
   "Members unlock $4M+ in deals. Including:"
   3 deal cards (with Pro deals locked).

PRICING SECTION
   Free / Member / Pro three-column.

FAQ accordion.

FOOTER (substantial — every page link, sitemap-grade).
```

Hero animation: the Cmd-K demo runs in a constant loop showing the stack picker, search, and install in 8 seconds. Pause-able and replayable.

---

## 9. Universal search & Cmd-K

### Cmd-K palette (the power-user surface)

Triggered by ⌘K / Ctrl+K from anywhere. Modal centred, 640px wide, max 60vh tall.

```
┌──────────────────────────────────────────────────────┐
│ 🔍  Search resources, news, guides, deals...        │
├──────────────────────────────────────────────────────┤
│ RECENT                                                │
│   ⏱ Claude Opus 4.7                          [Model]  │
│   ⏱ Auth0 MCP                                  [MCP]  │
│                                                       │
│ COMPONENTS                                            │
│   📦 Animated dropdown menu                          │
│   📦 Pricing card with toggle                        │
│   📦 Hero with text gradient                         │
│                                                       │
│ MODELS                                                │
│   🧠 Claude Opus 4.7              $3/$15  ★4.7      │
│   🧠 Gemini 3.1 Pro               $1.25/$5  ★4.6    │
│                                                       │
│ ACTIONS                                               │
│   ➤ Open my dashboard                                │
│   ➤ Update my stack                                  │
│   ➤ Submit a resource                                │
├──────────────────────────────────────────────────────┤
│ ↑↓ navigate · ↵ open · ⌘↵ install · esc close       │
└──────────────────────────────────────────────────────┘
```

- Fuzzy search across all types.
- Results grouped by type, scrollable.
- Type filter shortcuts: type `>m` to filter to models, `>c` to components, etc.
- Up/down to navigate. Enter to open. Cmd+Enter to install (if installable).
- "Recent" shows the last 5 visited resources (per user, persisted).
- "Actions" runs commands (Update stack, Submit resource, Sign out, Switch theme).
- Empty query state: "Recent" + curated "Trending now" + "Try ⌘K shortcuts" tips.

### Full search results page (`/search?q=…`)

For long queries and richer browsing.

```
[Header with search input pre-filled]

Results for "auth"  •  47 results across 8 types

FILTERS (left rail, sticky)            RESULTS (centre)
  Type
  ☐ All (47)
  ☑ Components (6)                     [Card]
  ☑ MCPs (4)                           [Card]
  ☐ Backend Kits (12)                  [Card]
  ☐ Models (0)                         [Card]
  ...
  Compatible client                    [Card]
  ☑ Cursor                             [Card]
  ☑ Claude Code                        ...
  ...
  Stack
  ☑ Next.js
  ☑ Supabase
  ...
  Pricing
  ☐ Free only
  ☐ Open source only
  ...
  Sort by
  ◉ Relevance
  ◯ Trending
  ◯ Newest
  ◯ Most installed
```

- AI search toggle: "Use natural language" — switches from full-text to semantic search via embeddings.
- Save search → creates an alert (notify when new resources match this query).

---

## 10. Resource detail page (generic template)

This template renders for 22 of the 24 types (Models and Stacks are special). Component / MCP variations are noted inline.

```
┌───────────────────────────────────────────────────────────────────┐
│  HERO                                                              │
│  ┌──────────────┐  Type Badge  Status pills (🟢 ⚡ 🧠 👁️ 🔧)        │
│  │  Thumbnail / │  Name (very large)                                │
│  │  Component   │  Tagline (one line)                                │
│  │  preview     │  By [author] · v2.3.1 · MIT                        │
│  │  240×240     │  Compatible: [Cursor] [Claude Code] [Windsurf]    │
│  └──────────────┘  Stack: [Next.js] [Tailwind] [TypeScript]         │
│                                                                     │
│  ╔══════════════════════════════════════════════╗                  │
│  ║ One-click install                            ║  [Try]   [Save]  │
│  ║ npx shadcn add @site/component-name          ║  [Compare]       │
│  ║                                          [⎘] ║                  │
│  ╚══════════════════════════════════════════════╝                  │
│                                                                     │
│  Stats strip:                                                       │
│  ↑ 1.2K  ⬇ 4.3K installs (7d)  ★ 4.8 (89)  🟢 99.2% verified       │
│  ⚡ updated 3d ago  🍴 142 forks                                    │
├───────────────────────────────────────────────────────────────────┤
│  TABS                                                               │
│  [Overview] [Try it] [Guides] [Install] [Source] [Compatibility]   │
│  [Reviews] [Versions] [Forks] [Analytics]                          │
├───────────────────────────────────────────────────────────────────┤
│  TYPE-SPECIFIC BLOCK (this is what varies between types)           │
│                                                                     │
│  • Component → live Sandpack playground, code, dependencies         │
│  • MCP → tool inspector with form-driven invocations                │
│  • Skill → SKILL.md viewer with fork button                         │
│  • Subagent → agent.md viewer, model assignment, tool access        │
│  • Rule → diff viewer, scope rules, "fork to my version"            │
│  • Prompt → playground with variable inputs                         │
│  • Plugin → bundled-resource list with install matrix               │
│  • Hook → script block with event matchers                          │
│  • Command → command preview, args schema, "test it" runner         │
│  • Starter → live demo iframe, framework chips, deploy buttons      │
│  • Tool → screenshots gallery, pricing table, "open in tool" link   │
│  • Sandbox → cold-start chart, OS image, pricing                    │
│  • Observability → integrations grid, dashboard screenshots         │
│  • Backend kit → service cards (DB / Auth / Payments etc)           │
│  • Asset → preview grid, license, download formats                  │
│  • Showcase → big screenshot, built-with row, live URL              │
│  • Docs-for-LLMs → llms.txt preview, package metadata               │
│  • Spec → spec text, example project, fork button                   │
│  • Workflow → vertical stepper of resources, time-to-complete       │
│  • Eval → benchmark methodology, leaderboard table                  │
│                                                                     │
├───────────────────────────────────────────────────────────────────┤
│  BEST FOR / ALTERNATIVES                                            │
│  Best for these use cases:                                          │
│    [Browser automation #1]  [Web scraping #3]  [E2E testing #4]    │
│  Cheaper alternatives (3 cards · delta_summary on each)            │
│  Faster alternatives (3 cards)                                      │
│  Smarter alternatives (3 cards)                                     │
│  Open-source alternative (1 card, if applicable)                    │
├───────────────────────────────────────────────────────────────────┤
│  WORKS WELL WITH                                                    │
│  Cross-resource grid: top MCPs, skills, tools, starters that pair.  │
├───────────────────────────────────────────────────────────────────┤
│  GUIDES (count badge)                                               │
│  Grouped: GET STARTED · USAGE · ADVANCED · TROUBLESHOOT · MIGRATE  │
├───────────────────────────────────────────────────────────────────┤
│  COMMUNITY VERDICT                                                  │
│  Star rating, top tags, 3 most-helpful reviews (expandable).        │
├───────────────────────────────────────────────────────────────────┤
│  PROMPTING TIPS & QUIRKS (community-curated, upvoted)              │
├───────────────────────────────────────────────────────────────────┤
│  NEWS & RELEASES (RSS-fed)                                         │
│  Last 10 items mentioning this resource.                            │
├───────────────────────────────────────────────────────────────────┤
│  ACTIVE DEALS (cards, including locked Pro tier)                    │
├───────────────────────────────────────────────────────────────────┤
│  TIMELINE                                                           │
│  Reverse-chronological version + price + capability changes.        │
├───────────────────────────────────────────────────────────────────┤
│  SOURCES & METHODOLOGY (collapsed accordion)                        │
└───────────────────────────────────────────────────────────────────┘

RIGHT RAIL (sticky, desktop only)
  TL;DR (4 bullets)
  Quick actions: Try / Compare / Set alert / Add to stack / Share
  Mini stats (always visible)
  Best alternatives (3-name list)
  Subscribe (RSS / email)

MOBILE BOTTOM BAR (sticky)
  [Try] [Compare] [Save] [Share]
```

The hero install command should be the **most visually dominant element** after the title. Bigger than the description, bigger than the buttons. People came here for the install.

---

## 11. The model detail page (special — 22 blocks)

This page deserves its own design pass because it's the highest-traffic page on the site.

The 22 blocks, in order:

1. **Hero** — name, version, provider logo, tagline, status pills, primary CTAs (Try / Compare / Set alert / Add to stack)
2. **Stats strip** — 6–8 metrics at a glance: intelligence rank, blended cost (with delta), output speed, latency, context window (advertised + effective), knowledge cutoff, released date
3. **Try It Now** — embedded chat playground; 3 modes: free trial / BYO key / saved on account; pre-loaded with a vibe-coding starter prompt; "+ Add model" button to compare side-by-side
4. **Pricing** — current pricing table + 90-day history sparkline + cost calculator with workload presets (sliders + permalinks)
5. **Capabilities matrix** — clean checklist grid (✅/❌/⚠️/💰) for tools, parallel tools, vision, audio, PDF, JSON mode, prompt caching, batch API, fine-tuning, reasoning, computer use, etc.
6. **Provider availability** — table: provider, price (in/out), context, rate limit, latency, status
7. **Benchmarks** — sortable table with confidence indicators (1–4 dots), source links, "what does this mean?" expandable
8. **Real-world vibe coding performance** ⭐ — bars or radar chart per client (Cursor / Claude Code / Windsurf): avg session cost, avg tokens/session, success rate. (Empty state: "Be the first — set up the gateway.")
9. **Context window quality** — advertised vs effective, with needle-in-haystack mini-chart at 25/50/75/100% depth
10. **Rate limits & quotas** — practical info per tier; for gateway users, current usage in real time
11. **About** — narrative + structured fields (architecture, params, cutoff, tokenizer, license)
12. **News & releases** — RSS-fed last 10 items, subscribe button
13. **Active deals** — cards, gating Pro tier
14. **Works well with** — compatible MCPs / skills / tools / starters / prompts (cross-product graph)
15. **Compare with** — pre-populated launchers (vs previous version, vs cheaper, vs smarter, +Custom)
16. **Alternatives** — cheaper / faster / smarter / open-weights / premium upgrade
17. **Community verdict** — rating, tags, top reviews, "I picked this" counter
18. **Prompting tips & quirks** — community-edited, upvoted
19. **Safety, policy, regional availability** — content policy, data retention, HIPAA/SOC2/ISO, regions, EU AI Act tier
20. **Developer reference** — code snippets in 6 SDKs (Python/TS/Go/Rust/Curl/OpenAI-compat), with toggles for tools/vision/caching, "Run in playground"
21. **Timeline** — every change since tracking started (price drops, version releases, capability adds)
22. **Sources & methodology** — boring but essential trust signal; collapsed accordion

### Open-weights variant — additional blocks

For models with `is_open_weights = true`, insert between blocks 5 and 6:

- **5b. Hardware sizing calculator** — user picks hardware (or auto-detects); output table shows quantizations × VRAM × est. speed × recommended badge.
- **5c. Runtime selector** — Ollama / LM Studio / Jan / vLLM / llama.cpp / MLX / Continue / Cursor (custom endpoint); each expands to install instructions.
- **5d. License & commercial use** — plain-English summary.
- **5e. Hugging Face integration** — model card excerpt, top fine-tunes, GGUF/AWQ/GPTQ availability badges.

For open-weights, **Block 4** flips to "Cost to run" with electricity-cost estimate alongside hosted-API alternatives. **Block 6** becomes "Where to run it" split into Self-host and Hosted API.

---

## 12. The one-click install button (signature component)

Auto-detects the user's primary client from their saved stack and renders the right install path.

**Default state:**

```
╔════════════════════════════════════════════════════════════╗
║  Install for Cursor                                    ⌄   ║
║  └ Click to add to Cursor (cursor:// deeplink)             ║
╚════════════════════════════════════════════════════════════╝
```

The chevron opens a dropdown with all supported install methods:

```
┌──────────────────────────────────────────┐
│ ★ Install for Cursor (deeplink)         │ ← default for this user
│   Install for Claude Code (CLI)          │
│   Install for Windsurf (deeplink)        │
│   Install for Claude Desktop (config)    │
│   Copy JSON snippet                      │
│   View all install options →             │
└──────────────────────────────────────────┘
```

**States:**
- Default (idle).
- Hover (slight lift, accent border).
- Click → loading shimmer for 200ms, then success animation: button briefly shows "✓ Installing in Cursor..." with a progress hint.
- Success → "✓ Installed in Cursor" for 3 seconds, then back to default.
- Error → "Couldn't open Cursor. [Show JSON] [Copy command]".
- For Claude Desktop and other config-file clients: clicking opens a modal with the JSON snippet, the file path, and "Open the config file" if the user has the desktop helper installed.

This component appears on every detail page hero. It's the most-clicked button on the entire site — design it like the "Add to cart" of an e-commerce store.

---

## 13. The MCP Tool Inspector (signature component)

Lives in the type-specific block on MCP detail pages.

```
┌───────────────────────────────────────────────────────────┐
│ Try this MCP — no installation                            │
├───────────────────────────────────────────────────────────┤
│ Tools (12)                          [Connection: 🟢 Live] │
│ ├─ search_files                                            │
│ ├─ read_file                                               │
│ ├─ write_file ⚠️ destructive                               │
│ ├─ list_directory                                          │
│ └─ ...                                                     │
├───────────────────────────────────────────────────────────┤
│ search_files                                               │
│ Searches files matching a pattern.                         │
│                                                            │
│ Input                                                      │
│   pattern *      [____________________]                   │
│   path           [____________________]                   │
│   max_results    [_10_]                                   │
│                                                            │
│   [Run] [Reset]                                           │
├───────────────────────────────────────────────────────────┤
│ Result                                                     │
│   {                                                        │
│     "matches": [                                          │
│       "src/auth/oauth.ts",                                │
│       "src/auth/session.ts"                               │
│     ]                                                      │
│   }                                                        │
│                                  [⎘ Copy] [⤴ Open in app] │
└───────────────────────────────────────────────────────────┘
```

- Destructive tools (write, delete, send) get an ⚠️ badge and a confirmation dialog before invocation.
- Free trial: 10 invocations per IP per day, then prompt to BYO key or upgrade.
- Successful invocations record telemetry that feeds the resource's health score.

---

## 14. The compare experience

Two surfaces:

### Compare drawer (right slide-in)
- Triggered from the "Compare" button in any detail page hero.
- 480px wide, sticky as the user scrolls.
- Shows a mini-table comparing the current resource with up to 3 others (added via "+ Add" search).
- Resource names are sticky at the top; scrolling the drawer scrolls the comparison rows.
- "Open full compare" → goes to the dedicated comparison page.

### Compare full-page (`/models/compare?ids=…`)
- Up to 4 columns, one per model.
- Sticky model headers with logos, names, prices.
- Rows grouped: Pricing, Capabilities, Benchmarks, Real-world performance, Provider availability.
- Visual diff: cells that differ get subtle colour highlighting (winner in green).
- Save comparison → permalink + add to user's saved comparisons.
- "Try side-by-side" button → opens multi-model split playground.

---

## 15. The cost calculator (inline + dedicated)

Lives in the model detail page block 4, plus a dedicated `/models/pricing/calculator` page.

```
┌────────────────────────────────────────────────────────┐
│ Cost calculator — Claude Opus 4.7                      │
├────────────────────────────────────────────────────────┤
│ Workload preset                                         │
│   [▼ Agentic coding (Cursor-style)        ]            │
│                                                         │
│   ◉ Chatbot (light)        ◯ Chatbot (heavy)          │
│   ● Agentic coding (Cursor) ◯ Agentic coding (Claude)  │
│   ◯ Batch summarisation     ◯ RAG pipeline             │
│   ◯ Custom                                              │
├────────────────────────────────────────────────────────┤
│ Input tokens per call           [════════● 8,500]      │
│ Output tokens per call          [══● 1,200]            │
│ Reasoning tokens per call       [● 3,400]              │
│ Calls per day                   [══════● 1,200]        │
│ Cache hit rate                  [════● 60%]            │
├────────────────────────────────────────────────────────┤
│ Daily cost              $14.20                         │
│ Monthly cost            $432.00     ▲ 5% vs last month │
│ Annual cost             $5,184                         │
│                                                         │
│ Compared to alternatives:                               │
│   Claude Sonnet 4.6     $172/mo    -60% (similar quality)│
│   Gemini 3.1 Pro        $268/mo    -38%                 │
│   Qwen 3 32B (self-host) ~$2/mo + hardware              │
│                                                         │
│ [Save workload]   [Set alert at $300]   [Share link]   │
└────────────────────────────────────────────────────────┘
```

- Sliders update results in real time (no debounce > 100ms).
- Permalink format: `/models/claude-opus-4-7/calc?in=8500&out=1200&calls=1200&cache=60`.

---

## 16. Deals page

### Deals index (`/deals`)

```
[Header]
─────────────────────────────────────────────
HERO STRIP
"$4.2M+ in credits & deals across the vibe-coding stack"
[Browse all]   [What's new this week →]
─────────────────────────────────────────────
TABS  [All] [AI APIs] [Cloud] [Dev tools] [Productivity] [Featured]
FILTERS  [Tier ▾] [Value ▾] [Provider ▾]
SORT     [Most valuable] [Most claimed] [Newest] [Expiring soon]
─────────────────────────────────────────────
GRID OF DEAL CARDS

┌────────────────────────────┐  ┌────────────────────────────┐
│ Anthropic Startup Program  │  │ Cursor Pro 50% off          │
│ $5,000 in Claude credits   │  │ 6 months                    │
│                            │  │                             │
│ [PUBLIC]   Apply now ▸     │  │ [MEMBER]  🔒 Sign in to claim│
└────────────────────────────┘  └────────────────────────────┘

┌────────────────────────────┐  ┌────────────────────────────┐
│ DigitalOcean Hatch         │  │ Microsoft for Startups      │
│ $10,000 in cloud credits   │  │ $150,000 Azure credits      │
│                            │  │                             │
│ [PRO]  🔒 Upgrade ↗        │  │ [PRO]  🔒 Upgrade ↗         │
└────────────────────────────┘  └────────────────────────────┘
```

### Locked Pro deal card (paywall pattern)

```
┌───────────────────────────────────┐
│ Microsoft for Startups            │
│ $150,000 Azure credits            │
│                                    │
│  ┌─────────────────────────────┐  │
│  │   🔒 Pro deal                │  │
│  │                              │  │
│  │   Unlock with Pro ($99/yr)   │  │
│  │   This single deal pays for  │  │
│  │   itself 1500x over.          │  │
│  │                              │  │
│  │   [Upgrade to Pro]           │  │
│  └─────────────────────────────┘  │
│                                    │
│  Pro members also get $5K AWS,    │
│  $10K Vercel, $200K Google Cloud  │
│  + 47 more deals worth $4M+.      │
└───────────────────────────────────┘
```

The blur effect on the locked card body is a strong visual cue. Show one or two pixels of the deal underneath through the blur — make the paywall feel like a window, not a wall.

### Deal claim flow (modal)

3 steps:
1. **Eligibility check** — "This deal requires: pre-seed to Series A, less than 5 years old, less than 50 employees. [Confirm I'm eligible]"
2. **Apply** — opens the partner's application form in a new tab AND shows our redemption guide inline (eligibility tips, common gotchas, average approval time).
3. **Track** — claimed deals appear in the user's dashboard with status (started → approved → redeemed).

---

## 17. News page

### News index (`/news`)

Two-column on desktop:

```
[Header]
─────────────────────────────────────────────
HERO  Latest in the vibe-coding ecosystem.
      [Subscribe to weekly digest →]
─────────────────────────────────────────────
FILTERS (left rail)            FEED (centre)
  Kind                           ┌──────────────────────────────┐
  ☑ Ecosystem (245)              │ 🔥 BREAKING                   │
  ☑ Releases (1,204)             │ Claude Opus 4.7 input price   │
  ☑ Price changes (89)           │ dropped 30% today.            │
  ☑ Tutorials (47)               │ — auto-generated · 2h ago     │
  ☑ Op-eds (12)                  └──────────────────────────────┘
                                  ┌──────────────────────────────┐
  Topics                          │ [Hero image]                  │
  ☐ Cursor                        │ Cursor 0.5x ships background  │
  ☐ Claude Code                   │ agents that work async        │
  ☐ Models                        │ — Cursor blog · 14h ago       │
  ☐ MCPs                          │ Editorial summary: ...         │
                                  └──────────────────────────────┘
                                  ...
```

- A "🔥 BREAKING" pinned item at the top when applicable.
- Auto-generated items have a small "🤖 auto" badge and link straight to the underlying resource.
- RSS feed URL surfaced in the page header.

### Newsletter signup (modal)

```
┌────────────────────────────────────────────┐
│ Weekly digest                               │
│ One email every Tuesday morning.            │
│ Top releases, biggest price moves, top deal.│
│                                             │
│ Email  [______________________]            │
│                                             │
│ Frequency                                   │
│   ◉ Weekly digest                           │
│   ◯ Daily roundup                           │
│   ◯ Breaking only                           │
│                                             │
│ Topics (optional)                           │
│   ☑ Models     ☑ Tools     ☐ Components    │
│                                             │
│ [Subscribe]                                 │
│                                             │
│ Unsubscribe with one click anytime.         │
└────────────────────────────────────────────┘
```

---

## 18. Guides system

### Guide reader (`/[resource-slug]/guides/[guide-slug]`)

Two-column layout, focused reading mode:

```
[Header — minimal during guide reading]
─────────────────────────────────────────────
LEFT (sticky, 280px)                CENTRE (max 720px reading width)
                                     ─────────────────────────────────
Install Qwen 2.5 Coder 32B           Install Qwen 2.5 Coder 32B
on macOS via Ollama                  ⏱ 5 min · 🟢 beginner
                                     
PROGRESS  ▓▓▓░░░ 50%                  ## Step 1: Install Ollama
                                     [body markdown]
✓ Step 1 — Install Ollama            
✓ Step 2 — Pull the model            ```bash
○ Step 3 — Run a test query          curl -fsSL https://ollama.com/install.sh | sh
○ Step 4 — Connect to Cursor         ```                              [⎘ copy]
                                     
                                     **Verify:** run `ollama --version`
                                     
                                     [▶ Run check]    Expected: 0.x.x or higher
                                     
                                     ─────────────────────────────────
                                     ## Step 2: Pull the model
                                     ...
                                     
                                     [Mark step complete]
                                     [Step didn't work? →]
─────────────────────────────────────────────
[Help improve this guide → submit edit]
```

- Each step's "Mark complete" feeds `guide_completions` telemetry.
- "Step didn't work?" opens a troubleshooting drawer with common fixes mined from past failures.
- The verifier ("Run check") executes a probe — either via the connected gateway agent (if user has it) or guides the user to run it manually with copy-clipboard support and an "I ran it; the output looks like…" textarea.
- Sticky progress sidebar shows step list with completed checks.
- Reading mode dims the rest of the site — only the guide is visible.

### Guides index (`/guides`)

Same layout pattern as resource directory: filters on left, card grid on right. Filters are kind / difficulty / OS / client / runtime / duration.

---

## 19. User dashboard

The signed-in home for a returning user. Tabbed layout.

```
[Header]
─────────────────────────────────────────────
"Welcome back, [name]"  [@handle]
[Overview] [Bookmarks] [Collections] [Stacks] [Submissions] [Alerts] [Deals] [Gateway] [API keys]
─────────────────────────────────────────────
OVERVIEW

┌──────────────────────┬──────────────────────────────────┐
│ ACTIVITY                                                 │
│ • 4 resources you bookmarked got updated this week       │
│ • Claude Opus 4.7 hit your $300/mo alert (saved $48)     │
│ • New Pro deal: Anthropic Startup Program                │
└──────────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────────────┐
│ MY STACK              │  │ MY ALERTS (3 active)         │
│ Cursor + Claude Code  │  │ 2 price drops triggered       │
│ Next.js + Supabase    │  │ 1 deal expires in 14d         │
│ Apple Silicon (M3 36) │  │ [Manage →]                    │
│ [Edit →]              │  └──────────────────────────────┘
└──────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ RECENT INSTALLS                                            │
│ 12 resources installed via this site this week            │
│ [view all →]                                               │
└──────────────────────────────────────────────────────────┘
```

Each tab is its own list view with type-specific actions (rename, delete, share, export).

---

## 20. Auth flows

### Sign up

Modal-first (less disruptive than redirecting to a page); dedicated page for direct links.

```
┌─────────────────────────────────────────┐
│ Create your account                      │
├─────────────────────────────────────────┤
│ [ 🐙 Continue with GitHub ]             │ ← primary, since users come from dev
│ [ 🇬 Continue with Google ]              │
│ ──── or with email ────                  │
│ Email     [_____________________]       │
│ Password  [_____________________]       │
│ Username  [_____________________]       │
│                                          │
│ ☐ I agree to Terms and Privacy           │
│                                          │
│ [ Create account ]                       │
│                                          │
│ Already have an account? Sign in         │
└─────────────────────────────────────────┘
```

### Welcome onboarding (3 steps after first sign-up)

1. **Stack picker** (the modal from §6 — the "save my stack" of this is the sign-up's success state)
2. **What are you building?** A single optional textbox; on submit we route to `/best-for/[inferred-use-case]` with curated recommendations.
3. **Subscribe to weekly digest** (optional). Pre-checked but easy to opt out.

Each step has a skip-able CTA. Don't make people do all three to enter the product.

### Sign in

Same modal pattern. "Forgot password?" inline link.

### Email verification & forgot password

Standard transactional pages. Logo, message, single CTA. Make the success state delightful (a small celebration micro-interaction).

---

## 21. Settings

A two-column layout: nav on left, content on right.

```
[Header]
─────────────────────────────────────────────
SETTINGS                          [Account]
                                  ─────────────
Account                           Email
Profile                           ben@example.com  [Change]
Stack & client preferences        
Notifications                     Username
Billing & subscription            @benhope          [Change]
Connected accounts                
Privacy & data                    Password
Theme & appearance                ●●●●●●●●●●●     [Change]
                                  
Support                           Two-factor auth
Sign out                          ☐ Enable 2FA
                                  
                                  Danger zone
                                  [ Delete account ]
─────────────────────────────────────────────
```

Each section is its own page. Notifications has granular controls: per-resource alerts, per-deal-expiry, per-newsletter-frequency.

---

## 22. Submission flow

Three-step wizard at `/submit`:

### Step 1: Source URL
```
What are you submitting?
[ Paste a GitHub URL or npm/pypi link ]
                                       [Detect →]

Or pick the type manually:
[ Component ] [ MCP ] [ Skill ] ... (24 types)
```

### Step 2: Auto-prefill
After detection, we show the form pre-filled with everything we could extract. Editable. The user fills the gaps.

```
We detected:                          
  Type     MCP server  [change]      
  Name     Auth0 MCP  [edit]         
  Source   github.com/auth0/mcp-auth0
  License  MIT (from package.json)
  ...
  
Things we couldn't auto-detect:
  Tagline  [_______________________]
  Compatible clients (multi-select chips)
  Stack tags (multi-select chips)
```

### Step 3: Preview & publish
Final preview that renders the detail page exactly as it will appear publicly. Three buttons:

```
[ Save as draft ]    [ Publish ]    [ Submit for review ]
```

Resources from verified authors auto-publish; new authors go through review.

---

## 23. Empty, loading, and error states

Design these explicitly for every list view.

### Empty states (with personality)

- **Bookmarks empty:** illustration of a hovering bookmark; "Save things you'll want later. Click the bookmark icon on any resource."
- **Search results empty:** illustration of a magnifying glass over a blank page; "Nothing matches '[query]'. Try a broader term, or [submit it →] if you want to add it."
- **Filter result empty:** "No resources match these filters. Try removing one of: [clear filter buttons]."
- **No alerts yet:** "Set price alerts on models you care about. Two clicks on any model page."
- **No claimed deals yet:** "Browse $4M+ in deals →"
- **New user dashboard:** the dashboard is mostly empty for new users. Replace cards with onboarding nudges ("Complete your stack", "Subscribe to the digest", "Bookmark your first resource").

### Loading states

- Skeleton card layout that matches each card type's actual shape.
- Cmd-K palette opens with skeleton results that fade in real results — no jank.
- Detail pages render the hero skeleton + tabs skeleton + body skeletons in parallel.

### Error states

- **Network failure:** card-shaped error component with "Couldn't load. [Retry]" — keep the page layout, don't full-screen the error.
- **404:** illustrated empty state, "We couldn't find that resource. It may have been removed. [Browse trending →] [Search →]"
- **500:** "Something broke on our end. Our team's been notified. [Try again →] [Status page →]"
- **Rate limited:** "You're going faster than we can keep up. Try again in 30s. Or [upgrade to Pro] for unlimited."

---

## 24. Paywalled features summary

Make these clear in the UI. Locked features show a lock icon + plan tier badge.

### Free tier
- Browse all resources
- Cmd-K search
- 5 bookmarks
- 1 collection
- Stack picker (1 saved stack)
- View public deals
- Read all news
- Basic guides
- Try-it playgrounds (10 calls/day per IP)
- Sign up for weekly digest

### Member tier (free, requires sign-up)
- Unlimited bookmarks & collections
- Up to 5 saved stacks
- Member deals unlocked
- Submit resources
- Reviews and comments
- Set up to 10 price alerts
- BYO key for unlimited playground
- Save searches as alerts
- Fork rules / skills / prompts to your account

### Pro tier ($99/year)
- All Pro deals unlocked ($4M+ value)
- Unlimited price alerts
- Gateway access (managed MCP/skill execution)
- Hosted secrets vault
- Priority gateway rate limits
- Author tools dashboard (for resource authors)
- Advanced analytics on submitted resources
- Compare up to 6 resources side-by-side (vs 4)
- API access (read-only)

### Paywall design rules
- Locked Pro features show a small 🔒 + badge; click → opens the upgrade modal.
- Upgrade modal is **value-led, never desperate**: shows the user the specific deal/feature they're trying to unlock, calculates the ROI ("This deal alone is 1500x the cost of Pro"), and offers a 14-day money-back guarantee.
- Never gate browsing or search behind any paywall. The directory itself is free forever.

---

## 25. Notification system

Three surfaces:

### In-app toast
- Bottom-right (desktop), top of screen (mobile).
- Slides in, auto-dismisses after 4s, dismissable manually.
- Variants: success (green tint), info (blue), warning (amber), error (red).
- Examples: "Bookmark saved", "Price alert set", "Failed to install — see details".

### Notification centre
- Bell icon in header, badge with unread count.
- Dropdown: last 20 notifications grouped by today / this week / older.
- Each notification: icon, title, body, timestamp, "view" link, "dismiss" button.
- "Mark all as read" + "Notification settings" links at the bottom.

### Email
- Transactional: signup confirm, password reset, deal claim approved, alert triggered, weekly digest.
- All branded consistently with the site. No "donotreply@" — responses go to a real inbox.
- Every email has a one-click unsubscribe link.

---

## 26. Theme & responsiveness

### Theme support
- **System / Light / Dark** (system default, persisted per user).
- Theme switch is a 3-state pill in the user menu and in `/settings/appearance`.
- Light mode is a true alternative, not an afterthought — it has the same hierarchy and density, just inverted.
- Code blocks adopt theme too (Shiki or similar with light + dark variants).

### Responsive breakpoints
- 375px (mobile) — single column, bottom nav, sticky bottom action bar on detail pages
- 768px (tablet) — two-column where it makes sense, side rails appear
- 1024px (desktop) — full layout, all rails visible
- 1440px (wide) — content max-width 1280px, generous gutters
- 1920px+ (ultra-wide) — content stays at 1280px, no infinite-stretch

Mobile-specific patterns:
- Filter sidebars become bottom sheets.
- Compare drawer becomes fullscreen modal.
- Cmd-K palette is fullscreen.
- Hover-only affordances have tap equivalents (e.g. compatibility matrix tooltips become tap-to-open).
- Long detail pages get an in-page section index at the top (jump links).

---

## 27. Cookie banner

```
┌──────────────────────────────────────────────────────────┐
│  We use cookies for essential features and (with your     │
│  permission) analytics that help us improve.              │
│                                                            │
│  [Accept all]  [Essential only]  [Customise →]           │
└──────────────────────────────────────────────────────────┘
```

Bottom-anchored banner, dismissable. "Customise" opens a modal with toggles per category (essential / functional / analytics / marketing). No dark patterns — "Essential only" is as easy to click as "Accept all".

---

## 28. Voice & microcopy

- **Tone:** confident, concise, slightly opinionated. Treat users as peers (because they are — vibe coders).
- Avoid: "amazing", "magical", "AI-powered" (unless literally describing AI), "revolutionary".
- Use: imperatives ("Install this", "Compare these", "Try it"), specifics ("3 reviews", "12 installs/week"), real numbers.
- Empty states get a touch of warmth, not desperation. "Nothing here yet" is fine. "Oh no, your bookmarks are empty :(" is not.
- Error messages name the cause and suggest a fix. Never just "Something went wrong".
- Never use emoji in body copy except in playful empty-state illustrations and as visual aids in stat strips (🟢 ⚡ 🧠 etc).

---

## 29. What you (Claude Design) should deliver

A structured Figma file (or equivalent) with:

1. **Foundations page** — colour, type, spacing, iconography, motion specs.
2. **Component library page** — every component from §5, all states.
3. **Page library** — every page from §4, all responsive breakpoints, all states (default/loading/empty/error/paywalled where applicable).
4. **Modals & overlays page** — every modal/drawer/sheet from across the app.
5. **Brand assets page** — logo lockups, app icons, social cards.
6. **Two themes throughout** — dark and light modes for everything above.

Annotations should call out:
- Interactive behaviours (hover, click, keyboard shortcut).
- Responsive transformations (where mobile differs from desktop).
- Animation specs (duration, easing, what triggers).
- Data states (what changes when this resource has zero installs vs 10k).
- Paywall and auth gates (which states require sign-in / Pro).

---

## 30. What this product is *not*

So you don't accidentally drift toward it:

- **Not a marketplace with payments inside.** Resources link out for paid options; we don't process resource sales (yet). The Pro subscription is the only thing we charge for.
- **Not a tutorial site.** We index resources; we don't write 2,000-word "what is vibe coding" posts.
- **Not opinionated about which IDE to use.** The whole point of the stack picker is meeting users where they are. Don't lean into Cursor or Claude Code visually more than the others.
- **Not a code generator.** We point at the tools that generate; we're the directory above them.
- **Not Product Hunt for AI.** Discovery is a side effect, not the loop. The loop is install → use → return.

---

## 31. Two reference moods, in one sentence each

- **Linear:** ruthless density, considered typography, everything keyboard-navigable, subtle motion that respects the user's attention.
- **Vercel:** dark by default, monospace where it should be, code blocks as first-class UI, marketing pages that read like documentation.

If a screen would feel out of place in either of those products, it's wrong for ours.
