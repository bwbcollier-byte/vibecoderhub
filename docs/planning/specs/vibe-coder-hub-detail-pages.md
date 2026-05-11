# Vibe Coder Hub — Detail Page Design Prompt

> **Standalone design prompt for Claude Design.** Specifies every detail page that opens when a user clicks a listing across all 27 resource types. Pair this with `vibe-coder-hub-design-prompt.md` (the system-wide design prompt). This document goes one level deeper: it tells you what fills the page once a user is *on* it.

> Read the shared anatomy in §1 carefully. Sections §2–§28 then define every type-specific page. Each section describes what's shown, what the user does there, dummy data to populate the design, and what makes that page the best in its category.

---

## §1 Shared anatomy — every detail page

Every type detail page is built from the same chassis. **Nine zones.** Type-specific blocks slot into Zone 5.

```
ZONE 1  — HERO              (always)  — name, tagline, install button, badges
ZONE 2  — STATS STRIP       (always)  — 6–8 metrics at a glance
ZONE 3  — TAB BAR           (always)  — Overview, Try It, Guides, Install, Source, Compatibility, Reviews, Versions, Forks, Analytics
ZONE 4  — RIGHT RAIL        (desktop) — TL;DR, quick actions, mini stats, alternatives
ZONE 5  — TYPE-SPECIFIC     (varies)  — the heart of the page; defined per type below
ZONE 6  — BEST FOR / ALTS   (always)  — best-for use cases, cheaper/faster/smarter alternatives
ZONE 7  — WORKS WELL WITH   (always)  — cross-product graph
ZONE 8  — SOCIAL & TIPS     (always)  — reviews, prompting tips, comments
ZONE 9  — META              (always)  — news mentions, deals, timeline, sources
```

**Mobile:** sticky bottom action bar with [Try] [Compare] [Save] [Share]. Right rail collapses into a fold-out section above Zone 6.

**Universal hero anatomy:**

```
┌────────────────────────────────────────────────────────────────┐
│  [Thumbnail/Preview]  TYPE BADGE  ⚡New  🟢Verified  📦Open     │
│  240×240              Resource Name (very large)                │
│                       One-line tagline                          │
│                       By @author · v2.3.1 · MIT                 │
│                       Compatible: [Cursor][Claude Code]…        │
│                       Stack:      [Next.js][Tailwind][TS]       │
│                                                                 │
│  ╔═══════════════════════════════════════════════╗              │
│  ║ One-click install                             ║  [Try]       │
│  ║ npx shadcn add @site/auth-form                ║  [Compare]   │
│  ║                                          [⎘]  ║  [Save]      │
│  ╚═══════════════════════════════════════════════╝              │
└────────────────────────────────────────────────────────────────┘
```

**Universal stats strip** (8 cells):
- ↑ score (votes)
- ⬇ install count (7-day delta)
- ★ avg rating (review count)
- 🟢 verified-working badge
- ⚡ last updated (relative time)
- 🍴 forks
- 👁 views (7-day)
- 💬 reviews

Type-specific pages override 1–3 of these cells with metrics that matter for that type (model pages swap two for cost + intelligence rank; sandboxes swap one for cold-start latency).

**Universal tab bar:**
`[Overview] [Try It] [Guides] [Install] [Source] [Compatibility] [Reviews] [Versions] [Forks] [Analytics]`

For types where a tab is N/A (e.g. Showcase doesn't have a "Source" tab), it's omitted. Don't grey it out.

---

## §2 Components — `/components/[slug]`

### What this page is for
A vibe coder lands here from search, the components index, or a recommendation. They want to (a) see the component running, (b) copy it into their project. The page must answer "does this look right and how do I install it?" in under 30 seconds.

### Hero specifics
- Thumbnail is replaced by a **live Sandpack mini-preview** at 240×240. The component runs inline.
- Install button reads: `npx shadcn add @vch/auth-form-with-oauth` (auto-resolves to the right registry URL).
- Badges: framework chip (`React`/`Vue`/`Svelte`), styling chip (`Tailwind`/`CSS`), `Responsive`, `Dark mode`, `A11y AA`.

### Zone 5 — type-specific blocks

**Live playground (full-width, the heart of the page)**

A Sandpack editor at full width, ~520px tall:
- Left pane: editable file tree (App.tsx, component.tsx, package.json, tailwind.config.js).
- Right pane: live preview with viewport toggle (mobile / tablet / desktop).
- Top bar: theme switcher (light / dark — to test the component in both), reset button, "Open in StackBlitz", "Open in CodeSandbox", "Fork to my account".
- Below: a **prop explorer** rendering the component's props as form controls. Toggle a `disabled` prop, watch it change. Pick from variant enums.

**Code & dependencies card**

Tabs: `Source` / `Dependencies` / `Tailwind config` / `Types`.
- `Source`: syntax-highlighted full file with line numbers and inline copy.
- `Dependencies`: `lucide-react@0.383`, `framer-motion@11.x`, `class-variance-authority@0.7` — each as a chip with version + npm/jsr link.
- `Tailwind config`: extra theme tokens needed (e.g. custom colours).
- `Types`: TypeScript prop interface.

**Variants gallery**
A horizontal scroll of 4–8 visual variants of the same component (e.g. for an auth form: with social, password-only, magic-link, code-input, OAuth-grid). Click any to swap into the playground.

**Visual design notes**
A short editorial section: "Why this component looks the way it does." Contrast ratios, animation timing rationale, inspiration credits. Differentiates us from "just another shadcn list."

### Best-in-class moves
- The viewport toggle isn't fake: it actually re-renders the component at iPhone, iPad, and desktop widths.
- "Test it with my real data" — a button that reveals a JSON textarea where the user can paste their own data shape and watch the component re-render.
- "Add this entire suite to my project" if the component belongs to a family (e.g. all auth components).

### Dummy data
- **Name:** "Auth form with OAuth grid"
- **Tagline:** "Email/password + 6 OAuth providers. Animated, accessible, zero config."
- **Author:** @sergeicodes
- **Variants:** Email-only, Email + Google, Magic link, OAuth grid (default), Passkey-first, Two-step
- **Used by:** 4,231 projects · 14 forks · ★ 4.8 (89 reviews)
- **Compatible:** all React-based clients (Cursor, Claude Code, Windsurf, v0, Lovable, Bolt)
- **Tags:** `auth` `forms` `oauth` `accessibility` `dark-mode`

---

## §3 Models — `/models/[slug]`

### What this page is for
The single highest-traffic detail page. Users arrive asking *"should I use this?"*. The page must answer 12 questions in scrollable order: cost, coding ability, IDE compatibility, context capacity, speed, capabilities, hosting, what changed, the catch, real usage signal, alternatives, and "can I try it now?"

### Hero specifics
- Provider logo + version (e.g. `claude-opus-4-7`).
- Status pills cluster: 🟢 Available · ⚡ New · 🧠 Reasoning · 👁 Vision · 🔧 Tool use · 📦 Open weights (when applicable).
- Primary CTAs: **Try it now** (anchor scroll) · **Compare** · **Set price alert** · **Add to my stack**.

### Stats strip (model-specific override)
- Intelligence rank (e.g. "#3 of 357")
- Blended cost ($/Mtok with 30-day delta)
- Output speed (tokens/sec)
- Latency (TTFT)
- Context (advertised + effective in parens)
- Knowledge cutoff
- Released (relative)
- Provider count (how many host it)

### Zone 5 — 22 blocks

This is the only page in the product with a 22-block type-specific zone. Build them in order (described in `vibe-coder-hub-final.md` §11) but the visual structure is:

1. Try It Now playground (BYO key + free trial + saved-on-account modes)
2. Pricing — current table + 90-day history sparkline + cost calculator with workload presets and permalinks
3. Capabilities matrix (16-row checklist with notes)
4. Provider availability table (sortable, with cheapest highlighted)
5. Benchmarks table (with confidence dots and source links)
6. Real-world vibe coding performance (radar chart per client — Cursor / Claude Code / Windsurf)
7. Context window quality (advertised vs effective + needle-in-haystack at 25/50/75/100%)
8. Rate limits & quotas (per tier; live for gateway users)
9. About (narrative + structured fields)
10. News & releases (RSS-fed last 10)
11. Active deals
12. Works well with
13. Compare with (pre-populated launchers: vs previous, vs cheaper, vs smarter)
14. Alternatives (cheaper / faster / smarter / open-weights / premium upgrade)
15. Community verdict
16. Prompting tips & quirks (community, upvoted)
17. Safety, policy, regional availability (HIPAA/SOC2/ISO/EU AI Act/regions)
18. Developer reference (snippets in 6 SDKs with toggles)
19. Timeline (price drops + version releases + capability changes)
20. Sources & methodology
21. (Open-weights only) Hardware sizing calculator
22. (Open-weights only) Runtime selector

### Best-in-class moves
- The Try It Now playground supports **side-by-side comparison** — "+ Add model" splits it into two panes running the same prompt.
- The cost calculator updates in real time and links to a permalink the user can share.
- The "Real-world vibe coding performance" block is unique to us — pulled from gateway telemetry, no competitor has this.

### Dummy data
- **Name:** "Claude Opus 4.7"
- **Provider:** Anthropic
- **Tagline:** "The smartest Claude. Built for agents, hard reasoning, and long sessions."
- **Pricing:** $3 in / $15 out / $0.30 cached / $15 reasoning / 50% batch discount
- **Context:** 1M advertised, ~720K effective
- **Capabilities:** Tools ✅, Vision ✅, PDF ✅, Caching ✅, Batch ✅, Reasoning ✅, Computer use ⚠️ beta
- **Intelligence rank:** #3 of 357 (Intelligence Index 57)
- **Hosted on:** Anthropic, Bedrock, Vertex, OpenRouter (with prices ranging $3–$3.30 in)
- **Real-world Cursor avg:** $0.42/session, 11.2K tokens/session, 94% success
- **Top tip (community):** "Don't put system instructions inside the user message — Claude follows the system role strictly."

---

## §4 MCP Servers — `/mcps/[slug]`

### What this page is for
A user is choosing between several MCPs that solve a similar problem (e.g. five GitHub MCPs). They need to compare tools each one exposes, see them work without installing, and one-click install to their client.

### Hero specifics
- Transport badge: `stdio` / `SSE` / `HTTP`.
- Auth badge: `OAuth` / `API key` / `No auth`.
- Tool count badge: `12 tools`.
- Source language: TypeScript / Python / Go.
- One-click install button with per-client deeplinks (Cursor / Claude Code / Windsurf / Claude Desktop).

### Stats strip overrides
- Replace "score" cell with **🛠 12 tools** count
- Replace "rating" with **⏱ p95 240ms** (latency from gateway telemetry)
- Replace "forks" with **🟢 99.4% uptime**

### Zone 5 — type-specific blocks

**Tool Inspector (full-width, the heart of the page)**

```
┌─────────────────────────────────────────────────────────┐
│ Try this MCP — no installation              🟢 Live    │
├─────────────────┬───────────────────────────────────────┤
│ Tools (12)      │ search_files                          │
│ ▸ search_files  │ Searches files matching a pattern.    │
│   read_file     │                                       │
│   write_file ⚠  │ Input                                 │
│   list_dir      │   pattern *  [______________]         │
│   ...           │   path       [______________]         │
│                 │   max_results [10]                    │
│                 │   [▶ Run]   [Reset]                   │
│                 ├───────────────────────────────────────┤
│                 │ Result                                │
│                 │   { matches: [...] }    [⎘] [↗ App]   │
└─────────────────┴───────────────────────────────────────┘
```

- Destructive tools (write/delete/send) marked ⚠️, require confirmation before invocation.
- Free trial: 10 invocations/day per IP. Then BYO key or upgrade.
- Each invocation feeds the resource's health score.

**Configuration card**

JSON config with per-client tab swapping:

```
[Cursor mcp.json]  [Claude Desktop]  [Windsurf]  [Claude Code]
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
    }
  }
}
[⎘ Copy]  [Open my config file]  [Install via deeplink →]
```

**Schema browser**

For each tool: input schema rendered as a structured form with field types, required flags, and descriptions. Output schema rendered the same way. Click any tool name in the inspector to jump here.

**Authentication walkthrough**

If `OAuth`: a step-by-step illustrated guide showing what the user will see in their browser, what scopes they'll grant, what data is visible to the MCP. Trust signal — most MCPs don't surface this and users are rightly cautious.

### Best-in-class moves
- Tool Inspector is *interactive* before install. No competitor offers this.
- Per-client install paths — Cursor gets a deeplink, Claude Desktop gets a JSON snippet with config-file path, Claude Code gets a one-line CLI command.
- Health metrics live (uptime, p95 latency) from our gateway telemetry.

### Dummy data
- **Name:** "GitHub MCP"
- **Tagline:** "12 tools for repos, issues, PRs, and Actions. Official server by GitHub × Anthropic."
- **Tools:** `search_files`, `read_file`, `create_issue`, `list_pull_requests`, `merge_pull_request` ⚠, `dispatch_workflow`, `get_repo`, `add_comment`, `assign_reviewer`, `create_branch`, `push_files`, `delete_branch` ⚠
- **Transport:** stdio + HTTP
- **Auth:** OAuth (GitHub App) or PAT
- **Health:** 99.4% uptime, p50 180ms, p95 410ms
- **Compatible:** all major clients
- **Sample successful invocation cached:** "List the 5 most recent issues in `vercel/next.js`" → resolves to JSON

---

## §5 Tools (IDEs / Agents / App Builders) — `/tools/[slug]`

### What this page is for
Users are deciding between AI IDEs (Cursor / Windsurf / Zed / Cline / Roo / Aider) or app builders (Lovable / Bolt / v0 / Replit Agent). The page must show what it looks like, what makes it different, who it's for, and what it costs.

### Hero specifics
- Big screenshot or a 15-second auto-playing screencast of the tool in action.
- Tool category chip: `IDE` / `App builder` / `CLI agent` / `Extension` / `Terminal`.
- Pricing pill: `Free`, `$20/mo`, `BYOK`, `Open source`.
- Platform chips: 🍎 Mac · 🪟 Windows · 🐧 Linux · 🌐 Web · 📱 iOS · 🤖 Android.

### Zone 5 — type-specific blocks

**Screenshots gallery**

Horizontal scrollable strip of 6–10 high-res screenshots showing different views (file editor, agent panel, MCP integration, settings). Click any → lightbox.

**"What it does" three-pillar block**

Three short cards: how it edits, how it agents, how it integrates. 1 sentence each, with a screenshot snippet.

**Pricing table**

```
┌────────────────────────────────────────────────────┐
│ Free                Pro              Team           │
│ $0                  $20/mo            $40/user/mo   │
│                                                     │
│ Limited completions  Unlimited        Unlimited     │
│ Cursor Tab           Background agents Background   │
│ —                    Agent Composer    Composer     │
│ —                    1,500 fast/mo     Unlimited fast│
│ —                    Premium models    Premium      │
│ Community support    Priority email    SSO + Admin  │
└────────────────────────────────────────────────────┘
```

**Models supported**

A grid of model logos showing which the tool supports natively, plus "BYOK supported" / "OpenRouter supported" badges.

**Open in tool button**

If we can deep-link the tool to itself: `cursor://` or `code://` etc. Otherwise a download button with platform auto-detection.

**Real-world performance**

Telemetry-sourced per-task averages from our gateway: average tokens per session, average cost per session, average session duration. Same chart that appears on model pages, inverted (model → tool instead of tool → model).

**Comparison strip**

Side-by-side: name, primary differentiator, pricing, top model. "Cursor (this) vs Windsurf vs Zed vs Cline."

### Best-in-class moves
- Pricing table is honest about what each tier actually unlocks (no marketing fog).
- Real-world performance: actual telemetry, not vendor claims.
- "Models supported" grid clickable — go to model page and back.

### Dummy data
- **Name:** "Cursor"
- **Tagline:** "The AI code editor. Forked from VS Code, rebuilt for agents."
- **Category:** IDE
- **Platforms:** Mac, Windows, Linux
- **Pricing:** Free / Pro $20 / Business $40 / Enterprise contact
- **Default models:** GPT-5, Claude Opus 4.7, Sonnet 4.6, Gemini 3.1 Pro
- **BYOK:** ✅
- **Open source:** ❌
- **Telemetry avg:** $0.41/session, 8.2K tokens, 12 min duration

---

## §6 Deals — `/deals/[slug]`

### What this page is for
Users arrived from the deals index, a news article, or organic search ("AWS startup credits"). They want to know: am I eligible, what do I do, what's the catch, and how long do I have?

### Hero specifics
- Massive value statement: **$10,000** in DigitalOcean credits.
- Provider logo + name.
- Tier badge: `PUBLIC` / `MEMBER` / `PRO`.
- Expiry: "Expires Jan 31, 2027" or "Ongoing".
- Primary CTA: `[Apply now ↗]` (opens partner form in new tab AND records claim).

### Stats strip (deal-specific)
- 💰 Value
- 👥 Claims (lifetime)
- ✅ Approval rate (community-reported)
- ⏱ Avg approval time
- 📅 Expires in
- 🏷 Tier

### Zone 5 — type-specific blocks

**Eligibility checklist**

```
Are you eligible?
  ☐ Pre-seed to Series A
  ☐ Less than 5 years old
  ☐ Less than $5M raised
  ☐ Less than 50 employees
  ☐ Have not previously claimed this deal

[All boxes checked? → Apply now]
[Not sure? → Read full requirements]
```

The checkboxes don't *enforce* — they're informational. But they help users self-qualify before they spend 20 minutes on a partner application.

**Step-by-step redemption guide**

```
1. Click [Apply now] — opens DigitalOcean's startup form.
2. Fill out company info (5 min).
3. Use referral code: VCH-2026 (auto-applied via our link).
4. Submit. Approval typically takes 3–5 business days.
5. Once approved, you'll get $10K credits posted within 24h.
   Use within 12 months.

⚠️ Common reasons applications get rejected:
   • Personal email instead of company domain
   • Missing company website
   • Already claimed via another partner
```

**What you get**

A list breakdown:
- $10,000 in DigitalOcean credits
- Free Droplet for first month (any size)
- Priority support during evaluation
- Access to DO startup community Slack

**Other deals from this provider**

A strip of cards showing what else this provider offers (e.g. AWS Activate has tiers).

**Reviews from members who claimed**

Short testimonials: "Approved in 4 days. Used $4K in the first month for our staging cluster."

### Best-in-class moves
- Eligibility self-check upfront saves wasted applications.
- Redemption guide demystifies the partner's process — most deal sites just dump a link.
- Tracking the user's claim through stages (started → approved → redeemed) so we can email them when it expires.

### Locked Pro deal state

If the user is on Free or Member tier and this is a Pro deal:

```
┌────────────────────────────────────────┐
│ DigitalOcean Hatch                      │
│ $10,000 in cloud credits                │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │     🔒 Pro deal                    │  │
│  │                                    │  │
│  │  Unlock with Pro — $99/year        │  │
│  │  This deal alone is 100x the cost. │  │
│  │  + $4M+ in other Pro deals.        │  │
│  │                                    │  │
│  │  [Upgrade to Pro]                  │  │
│  │  14-day money-back guarantee.      │  │
│  └───────────────────────────────────┘  │
└────────────────────────────────────────┘
```

The blur effect on the locked card body shows 1–2 pixels of the deal underneath — like a window, not a wall.

### Dummy data
- **Title:** "DigitalOcean Hatch — $10K cloud credits"
- **Provider:** DigitalOcean
- **Value:** $10,000
- **Tier:** PRO
- **Eligibility:** Pre-seed to Series A, <5y old, <$5M raised
- **Approval rate:** 78% (from 412 community reports)
- **Avg approval time:** 3.2 days
- **Expires:** Ongoing
- **Claims this month:** 89

---

## §7 News — `/news/[slug]`

### What this page is for
A news item is one of: ecosystem story, auto-generated release note, auto-generated price-change item, editorial op-ed. The page renders the content with full citations and links to every resource mentioned.

### Hero specifics
- Hero image (16:9 ratio, with sensible cropping).
- Kind badge: `Ecosystem` / `Release` / `Price change` / `Tutorial` / `Op-ed`.
- Source badge: official blog (with logo) / our editorial / auto-generated 🤖.
- Published date + reading time.
- Primary CTAs: `[Read original ↗]` (only on ecosystem stories) and `[Subscribe to digest]`.

### Zone 5 — type-specific blocks

**Article body**

Markdown-rendered, max 720px reading width, generous line-height. Inline images, code blocks with syntax highlighting, callouts for important quotes, embedded charts where data appears.

**Resources mentioned**

A sidebar (right rail on desktop, fold-out on mobile) listing every resource referenced in the article. Each is a small card with one-click "View" or "Install".

**For price-change stories specifically**

Auto-rendered price comparison chart inside the article body:

```
GPT-5 input cost — last 30 days
$5 ────────────────────────────────────
   ╲
$4  ╲___
        ╲
$3       ╲╱╲___╲___ ← today $3.50
$2 ────────────────────────────────────
        Apr 15           May 8
```

**For release stories specifically**

Auto-rendered release notes with version diff vs previous, capability changes highlighted.

**Newsletter promo (inline)**

Mid-article, a single-line promo: "Get this kind of news weekly. → Subscribe."

**Comments**

Threaded discussion on the article, ordered by upvotes.

### Best-in-class moves
- Auto-generated stories cite their data sources in the article body, so readers can verify numbers.
- Resources-mentioned sidebar lets readers act on the news immediately, not weeks later.
- Inline newsletter promo without being annoying.

### Dummy data
- **Title:** "Anthropic drops Claude Opus 4.7 input pricing 30%"
- **Kind:** Price change
- **Source kind:** auto-generated 🤖
- **Published:** 2 hours ago
- **Reading time:** 1 min
- **Body:** "Anthropic's Claude Opus 4.7 input cost dropped from $5/Mtok to $3.50/Mtok today, a 30% reduction. Output and cached pricing remain unchanged. The change brings Opus 4.7 to within 12% of Gemini 3.1 Pro on blended cost…"
- **Resources mentioned:** Claude Opus 4.7 (model), Anthropic API (provider)

---

## §8 Guides — `/[resource-slug]/guides/[guide-slug]`

### What this page is for
A user just landed in install or usage mode. They want to follow steps, copy commands, verify each step worked, and finish. The page is a focused-reading environment, not a directory page.

### Layout
Different from other detail pages — this is the only type that uses **focused-reading mode**. The site header dims, the page becomes two columns (sticky 280px sidebar + 720px reading column).

### Hero specifics
- Title.
- Difficulty badge (`🟢 Beginner` / `🟡 Intermediate` / `🔴 Advanced`).
- Duration estimate (`⏱ 5 min`).
- Prerequisites (collapsible): "Node 18+, macOS 13+".
- Last verified by us (`Verified working as of May 8, 2026`).

### Zone 5 — type-specific blocks

**Sticky progress sidebar**

```
Install Qwen 2.5 Coder 32B
on macOS via Ollama

PROGRESS  ▓▓▓░░░  3/6 steps

✓ 1. Install Ollama
✓ 2. Pull the model
✓ 3. Run a test query
○ 4. Connect to Cursor
○ 5. Configure your rules
○ 6. Verify it works

[Mark step complete]
[Step didn't work? →]
```

**Step-by-step body (centre column)**

Each step is a card:

```
## Step 1: Install Ollama

Ollama is a CLI tool that runs LLMs locally. Open Terminal
and run:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```                                            [⎘ Copy]

**Verify it worked:** run `ollama --version`

[▶ Run check via gateway]      Expected: 0.x.x or higher

[ Mark step complete ]   [ Step didn't work? ]
```

**Run check** is the verifier:
- If user has connected the gateway agent: runs the probe, returns the result inline.
- Otherwise: shows expected output, asks user to paste their result for matching.

**"Step didn't work?" drawer**

A right-rail drawer slides in with troubleshooting. Common errors mined from `guide_completions.failure_reason` table — e.g. "If you see `command not found: ollama`, your PATH may not include `/usr/local/bin`. Try…"

**Help improve this guide**

Bottom of page: "Found a step that's outdated? → Submit a fix" — opens an editorial form.

### Best-in-class moves
- Real-time verifier separates working installs from "looks fine but isn't."
- Troubleshooting drawer with crowdsourced fixes — gets smarter the more it's used.
- Crowdsourced edits keep guides fresh as resources update.

### Dummy data
- **Title:** "Install Qwen 2.5 Coder 32B on macOS via Ollama"
- **Difficulty:** Beginner
- **Duration:** 5 min
- **Prerequisites:** macOS 13+, 24GB RAM minimum, 20GB disk
- **Steps:** Install Ollama → Pull model (4 min download) → Run test query → Connect to Cursor → Configure rules → Verify
- **Completions:** 1,247 (94% completed all steps)

---

## §9 Skills — `/skills/[slug]`

### What this page is for
A user wants a reusable agent skill (SKILL.md format). They need to see the skill content, understand when it triggers, fork it, and install it to their `.claude/skills/` directory.

### Hero specifics
- Skill name in monospace.
- Invocation mode badges: `Auto-invoke` / `Manual` / `Both`.
- Allowed-tools chips: `Read`, `Write`, `Bash`, `WebFetch`.
- Compatible clients: which agents support SKILL.md format (Claude Code, Codex, ChatGPT, Cursor experimental).
- Install button: `claude skill install @vch/secret-detector` (one-line CLI for Claude Code; per-client variants for others).

### Zone 5 — type-specific blocks

**SKILL.md viewer (full-width, the heart of the page)**

```
─── frontmatter ─────────────────────────
name: secret-detector
description: Catches secrets before commit
disable-model-invocation: false
allowed-tools: Read, Bash
─── content ─────────────────────────────
You are a security-aware reviewer. Before
any git commit, scan staged files for...
─────────────────────────────────────────
```

Rendered with markdown formatting, syntax highlighting on the frontmatter, and inline copy.

**Triggers**

What makes this skill auto-fire:
- "When user runs `git commit`"
- "When user asks about staging files"
- "When agent is about to write to .env files"

**Fork to my account button**

Big, prominent. Clicking forks the skill into the user's namespace, opens an inline editor for tweaking, saves under their account.

**Pairs well with subagents**

A grid showing which subagents commonly use this skill (forked from `resource_dependencies`).

**Test the skill**

A mini playground that runs Claude Code with this skill enabled, on a sample task:

```
Try this skill on:
  ◉ "Commit my staged files"
  ◯ "Review src/auth/oauth.ts"
  ◯ "Custom prompt: [_______________]"

[▶ Run]
─────────────────────────────────────────
[claude] reading staged files...
[claude] DETECTED: API key on line 24 of .env
[claude] Refusing commit. Suggestion: ...
```

### Best-in-class moves
- Test the skill before installing — competitor skill directories don't.
- Fork mechanism with full lineage (`forked_from_id` from schema).
- Triggers are explicit, not buried in description.

### Dummy data
- **Name:** "secret-detector"
- **Tagline:** "Catches secrets in staged files before commit. Saved my bacon 12 times this month."
- **Author:** @sergeicodes
- **Triggers:** git commit · staging files · .env writes
- **Allowed tools:** Read, Bash
- **Compatible:** Claude Code (native), Codex, ChatGPT
- **Forks:** 47
- **Installs (7d):** 612

---

## §10 Rules — `/rules/[slug]`

### What this page is for
A user wants a `.cursorrules` / `.windsurfrules` / `CLAUDE.md` / `AGENTS.md` file. They need to see exactly what rules are in there, fork to tweak, and install (drop into their project root).

### Hero specifics
- Rule format badge: `cursorrules` / `mdc` / `windsurfrules` / `claude-md` / `agents-md`.
- Scope: `Global` / `Project` / `Subdirectory`.
- Globs (if applicable): `**/*.tsx`, `src/**/*`.
- Stack chips: which frameworks this rules file targets (Next.js + Tailwind + Convex).
- Install button: drops the file into the user's project (gateway-assisted) or copies content + path to clipboard.

### Zone 5 — type-specific blocks

**Diff viewer (full-width)**

```
.cursorrules                              [⎘ Copy file]
─────────────────────────────────────────
You are a TypeScript-first React developer
working on a Next.js 15 + Convex project.

CODING STYLE:
- Use server components by default
- Mark client components with 'use client'
+ Always use convex/react hooks (NEW)
- Tailwind v4 utilities only, no @apply
- Zod for all schema validation
─────────────────────────────────────────
```

Show as a diff vs the closest "vanilla" cursorrules so users see what's customised.

**Compatible IDEs grid**

Each rule format works with specific IDEs. Show which:

```
✅ Cursor (.cursorrules)        — works as-is
⚠️ Windsurf (.windsurfrules)   — needs minor edit
✅ Claude Code (CLAUDE.md)      — works as-is via /init
❌ Cline                        — doesn't support this format yet
```

**Fork to my account**

Same as skills. Edit inline, save under user.

**Real-world feedback**

"Users with this rule file report 23% fewer 'wrong-framework' suggestions from Cursor compared to no rules." (Sourced from `compatibility_reports` and `install_events` from schema.)

**Pairs well with starter kits**

Cross-link to starter kits that come pre-configured with this rules file.

### Best-in-class moves
- Diff viewer vs vanilla makes the rule's value obvious.
- Real-world impact data sets us apart from cursor.directory's flat list.
- Per-IDE compatibility matrix — most rules don't translate cleanly across IDEs.

### Dummy data
- **Name:** "Next 15 + Convex + Tailwind v4"
- **Tagline:** "Battle-tested rules for the modern T3-style stack."
- **Format:** cursorrules
- **Compatible:** Cursor ✅, Windsurf ⚠️, Claude Code ✅
- **Lines:** 142
- **Forks:** 89
- **Stars:** 1.4K
- **Real impact:** "23% fewer wrong-framework suggestions"

---

## §11 Plugins — `/plugins/[slug]`

### What this page is for
A user wants a bundle of skills + MCPs + commands + hooks distributed as one installable unit. They need to see what's inside, install it via marketplace command, and understand what it adds to their setup.

### Hero specifics
- Plugin name in monospace.
- Marketplace badge linking to source marketplace (e.g. `from buildwithclaude`).
- Bundle counts: `4 skills · 2 MCPs · 6 commands · 3 hooks · 1 agent`.
- Install button: `claude plugin install @marketplace/plugin-name`.

### Stats strip overrides
- 📦 Bundled count (e.g. "16 components")
- 🍴 Forks
- 🟢 Verified
- ⚡ Updated

### Zone 5 — type-specific blocks

**Bundled resources grid**

Five sub-grids — one per bundled type:

```
SKILLS (4)
[skill card] [skill card] [skill card] [skill card]

MCPS (2)
[mcp card] [mcp card]

COMMANDS (6)
[/refactor] [/test] [/deploy] [/scaffold] [/audit] [/release]

HOOKS (3)
[pre-commit] [post-tool] [session-start]

AGENTS (1)
[code-reviewer subagent]
```

Each card links to its own detail page within the plugin context (so user can read the skill spec, fork a hook, etc.).

**Install matrix**

Per-client install paths. Plugins differ from MCPs — they install via Claude Code marketplace command, not deeplinks:

```
Claude Code      `claude plugin install @bwc/full-stack-orchestration`
Cursor           Manual install per resource (no plugin format)
Windsurf         Manual install per resource (no plugin format)
```

**What this plugin adds to your setup**

Visual diagram (conceptual ASCII or designed graphic) showing: "Before plugin: 4 things in your `.claude/`. After plugin: 16 things, organised into 4 commands and 1 agent."

**License & attribution**

Plugins often bundle resources with mixed licenses. Surface this clearly: "This plugin contains 4 MIT-licensed components and 1 Apache-2.0 component."

### Best-in-class moves
- Visual diff of "before / after" install — most users have no idea what a plugin actually changes.
- License surfacing is a unique differentiator for enterprise users.
- Each bundled item is browsable individually.

### Dummy data
- **Name:** "full-stack-orchestration"
- **Marketplace:** buildwithclaude
- **Tagline:** "Multi-agent workflows for full-stack apps. Includes 4 specialised agents and 16 skills."
- **Bundled:** 4 skills, 2 MCPs, 6 commands, 3 hooks, 1 agent
- **Compatible:** Claude Code only (plugin format)
- **Installs (7d):** 1,247
- **License:** MIT (with 1 Apache-2.0 component)

---

## §12 Hooks — `/hooks/[slug]`

### What this page is for
A user wants a lifecycle hook (pre/post tool use, session start/stop, user prompt submit). They need to see the script, understand which events it matches, and install it.

### Hero specifics
- Event badge: `pre_tool_use` / `post_tool_use` / `session_start` / `stop` / `user_prompt_submit`.
- Matcher rules: which tools this hook responds to (`Bash`, `Edit`, `Write` — or all).
- Script language: `bash` / `python` / `node`.
- Compatible clients: typically Claude Code (other clients have limited hook support).

### Zone 5 — type-specific blocks

**Event flow diagram**

```
┌──────────┐    ┌─────────┐    ┌──────────────┐    ┌──────────┐
│ User msg │ → │ Pre-hook │ → │ Tool runs    │ → │ Post-hook│
└──────────┘    │  (this)  │    │ (e.g. Edit) │    └──────────┘
                └─────────┘    └──────────────┘
```

The hook's position in the lifecycle, visually obvious.

**Script viewer**

Full script with syntax highlighting and inline copy:

```bash
#!/usr/bin/env bash
# pre-tool-use hook: prevent edits to .env files

if [[ "$1" == *.env* ]]; then
  echo "BLOCKED: Refusing to edit .env files."
  exit 1
fi
exit 0
```

**Matcher configuration**

Show the JSON config that registers the hook:

```json
{
  "hooks": {
    "pre_tool_use": [{
      "matcher": { "tool": "Edit|Write", "path": "*.env*" },
      "command": "./hooks/no-env-edit.sh"
    }]
  }
}
```

**Test in sandbox**

A mini sandbox: paste a sample tool call, the hook runs against it, you see whether it'd be blocked or allowed.

```
Test this hook
Tool:    [Edit ▾]
Path:    [.env.local]
[▶ Test]

Result: 🛑 BLOCKED — "Refusing to edit .env files."
```

**Pairs well with**

Other hooks in the same lifecycle stage; skills that complement this hook.

### Best-in-class moves
- Visual lifecycle position — most hook docs are confusing about *when* a hook fires.
- Test sandbox before installing — users see exactly what gets blocked.
- Matcher config rendered separately from the script for clarity.

### Dummy data
- **Name:** "no-env-edit"
- **Tagline:** "Block any tool from writing to `.env` files. Five lines, one peace of mind."
- **Event:** pre_tool_use
- **Matcher:** Edit | Write, paths matching `*.env*`
- **Language:** bash
- **Installs (7d):** 234

---

## §13 Starters — `/starters/[slug]`

### What this page is for
A user wants a SaaS boilerplate. They need to see what's in it, deploy a demo, fork to GitHub, and install rules files for their AI IDE.

### Hero specifics
- Live demo iframe (320×200 thumbnail in hero, full-width below).
- Stack chips: framework + database + auth + payments + email + deploy target.
- Has-rules badges: `✅ .cursorrules` `✅ CLAUDE.md` `❌ AGENTS.md`.
- Deploy buttons: `Deploy to Vercel`, `Deploy to Netlify`, `Clone to Replit`, `Open in StackBlitz`.

### Zone 5 — type-specific blocks

**Live demo (full-width iframe, 16:9)**

The actual deployed demo runs inline. Users click around in the demo without leaving our page.

**What's included**

A structured tree showing the project structure:

```
my-saas-starter/
├── app/                  ← Next.js 15 App Router
│   ├── auth/             ← Better Auth integration
│   ├── (dashboard)/      ← Protected routes
│   └── api/
├── convex/               ← Convex backend
├── components/           ← shadcn-styled
├── .cursorrules          ✅ Pre-configured
├── CLAUDE.md             ✅ Pre-configured
├── package.json
└── README.md
```

**Stack details**

Per-service breakdown:
- **Framework:** Next.js 15 (App Router)
- **Database:** Convex (free tier covers MVP)
- **Auth:** Better Auth (with email + Google + GitHub OAuth)
- **Payments:** Stripe (subscriptions)
- **Email:** Resend (with React Email templates)
- **Deploy:** Vercel (one-click)
- **Cost to run:** $0/mo on free tiers, ~$20/mo with paid Convex when you hit scale

Each chip clickable to that backend kit's detail page.

**Time to first deploy**

Honest timer: "Most users go from clone to deployed in **9 minutes**." Median pulled from `guide_completions`.

**Pairs well with**

The rules file that comes pre-configured (also lives as its own resource), MCPs that match this stack, components from the directory that drop in, prompt recipes optimised for this stack.

**Recent deploys**

A small public log: "Deployed 14 times in the past 24 hours." Trust signal that this thing works.

### Best-in-class moves
- Live demo iframe — no other directory does this for starters.
- "Time to first deploy" with real telemetry.
- Stack details show *cost to run*, not just service names.

### Dummy data
- **Name:** "Next 15 + Convex SaaS Starter"
- **Tagline:** "Auth, payments, email, dashboard. Deploy in 10 minutes."
- **Stack:** Next.js 15, Convex, Better Auth, Stripe, Resend, Vercel
- **Has rules:** `.cursorrules`, `CLAUDE.md`
- **Stars:** 4.7K
- **Deploys (24h):** 14
- **Time to first deploy median:** 9 min

---

## §14 Observability — `/observability/[slug]`

### What this page is for
A user is choosing a tool to monitor or evaluate their LLM/agent app. They need to see features, integrations, and pricing.

### Hero specifics
- Feature chips: `Tracing`, `Evals`, `Prompt mgmt`, `Dashboards`, `A/B testing`.
- Self-hostable badge if applicable.
- Free-tier badge if applicable.
- Integrations chips: which model providers and frameworks it supports.

### Zone 5 — type-specific blocks

**Dashboard screenshots**

A horizontal carousel of 4–6 high-res screenshots of the actual dashboard. Each captioned with the feature it shows.

**Features matrix**

```
                          This tool   Alt 1   Alt 2
Tracing                       ✅       ✅      ✅
Evals (LLM judges)            ✅       ⚠️       ❌
Prompt management             ✅       ❌      ✅
A/B testing                   ✅       ❌      ⚠️
User feedback capture         ⚠️       ✅      ❌
Self-hostable                 ✅       ❌      ✅
Free tier                     ✅       ✅      ✅
SOC2 compliant                ✅       ✅      ⚠️
```

**Integrations grid**

Logo grid of: model providers (Anthropic, OpenAI, Google, AWS), frameworks (LangChain, LlamaIndex, Vercel AI SDK), and observability targets (DataDog, Slack, PagerDuty).

**Pricing**

Identical pattern to the Tools page (free / pro / team / enterprise tiers).

**Quick-start integration**

Inline code snippet showing how to add this tool to an existing project:

```typescript
import { Langfuse } from "langfuse";

const langfuse = new Langfuse({
  publicKey: "pk-...",
  secretKey: "sk-...",
});

// Wrap your LLM calls
langfuse.trace({ name: "user-query", input: prompt })
```

**Real-world performance**

If we have telemetry through our gateway: "Users running this tool see X% lower error rates after 2 weeks."

### Best-in-class moves
- Features matrix vs alternatives — competitive truth, not vendor self-praise.
- Quick-start snippet right on the detail page; click to copy.
- Integration grid is clickable — go to the related model/framework page.

### Dummy data
- **Name:** "Langfuse"
- **Tagline:** "LLM engineering platform. Open-source observability and prompt management."
- **Features:** Tracing, Evals, Prompts, Datasets, Playground
- **Self-hostable:** ✅
- **Free tier:** Up to 50K observations/mo
- **Integrations:** Anthropic, OpenAI, LangChain, LlamaIndex, Vercel AI SDK, Mistral
- **Pricing:** Free / Core $59/mo / Pro $199/mo / Enterprise

---

## §15 Backend Kits — `/backend/[slug]`

### What this page is for
A user is choosing the building blocks of their app: auth, database, payments, email. They need to see what it does, what it costs, and whether it ships with rules files for their AI IDE.

### Hero specifics
- Backend-kind badge: `Auth` / `DB` / `Payments` / `Email` / `Storage` / `Realtime` / `Search` / `Full-stack`.
- Free-tier badge.
- Has-rules badge: `✅ Ships with .cursorrules` (a unique differentiator for AI-aware backends).
- Primary language chip.

### Zone 5 — type-specific blocks

**What it replaces**

A clear "instead of" framing:

```
This replaces:
  • Auth0 / Clerk (for auth)
  • RDS / DynamoDB (for database)
  • S3 (for file storage)

For projects under 100K MAU, all of the above can be replaced
by this one service for $0–$25/mo.
```

**Pricing tiers**

Honest breakdown with real-usage examples:

```
Free       $0       50K MAU, 500MB DB, unlimited requests
Pro        $25/mo   100K MAU, 8GB DB, daily backups
Team       $599/mo  500K MAU, 100GB DB, priority support
```

**Code examples**

Tabbed snippets: connect, query, mutate, listen-to-changes. Copy-friendly, language-toggleable (TS / Python / Go).

**Compatible AI IDEs**

If this backend ships with rules files, surface the link:

```
✅ Ships with .cursorrules pre-configured
✅ Ships with CLAUDE.md pre-configured
   → View rules file
```

**Pairs well with**

Starter kits that use this backend (cross-linked).

**Real-world cost calculator**

Inline calculator: "If you have X users making Y requests/day, this costs $Z/mo." Same UX as the model cost calculator but for SaaS scaling.

**Migration guides**

"Migrating from Firebase? → 12-min guide." "Migrating from Supabase? → 8-min guide." Cross-link to guides.

### Best-in-class moves
- "What it replaces" framing matches how vibe coders think.
- Real-world cost calculator with workload presets.
- Migration guides surfaced prominently — most users are already on something else.

### Dummy data
- **Name:** "Convex"
- **Tagline:** "The reactive backend for vibe-coded apps. Database + functions + auth + storage."
- **Kind:** Full-stack
- **Free tier:** ✅ (1GB DB, unlimited reads, 1M function calls/mo)
- **Ships with rules:** `.cursorrules`, `CLAUDE.md`, `AGENTS.md`
- **Languages:** TypeScript, Python (preview)
- **Pricing:** Free / Pro $25/mo / Team $599/mo
- **Used by:** 14,200 projects in our directory

---

## §16 Assets — `/assets/[slug]`

### What this page is for
A user wants design assets — icons, illustrations, fonts, Lottie files, gradients, 3D meshes. They need to see them, download them, and use them with confidence on the licensing.

### Hero specifics
- Asset-kind badge: `Icon set` / `Illustration` / `Font` / `Shader` / `Lottie` / `3D` / `Gradient`.
- Asset count: "1,847 icons in 4 styles".
- Format chips: `SVG`, `PNG`, `Figma`, `Sketch`, `Lottie JSON`.
- License badge: `MIT` / `CC0` / `CC-BY` / `Commercial`.

### Zone 5 — type-specific blocks

**Preview grid (full-width, the heart of the page)**

For an icon set: a giant searchable grid of icons.
- Search bar at top: "search 1,847 icons".
- Filter chips: stroke (thin / regular / bold), category (UI / commerce / weather…).
- Each icon hoverable; click → opens a modal with: SVG preview at large size, the SVG code, copy buttons (SVG / JSX / Vue / React component), download formats.

For an illustration pack: a masonry grid of full illustrations.
For a font: a typography specimen sheet — every weight, every glyph table.
For Lottie: a row of animated previews playing in loop.
For a 3D pack: WebGL previews rotating slowly.
For gradients: a grid of gradient swatches with copy-CSS-to-clipboard.

**License clarity**

```
License: MIT
✅ Use commercially
✅ Modify and redistribute
✅ Use in client work
❌ Resell as-is

Attribution required: No (but appreciated).

Read full license →
```

This is far better than competitors' vague licensing.

**How to install**

Asset-specific install paths:
- Icon set: `npm install lucide-react` + import snippet.
- Font: download `.woff2` files + `@font-face` snippet OR Google Fonts `<link>`.
- Illustration pack: download as ZIP or import via Figma plugin.
- Lottie: download JSON or use CDN URL.

**Pairs well with**

Components that ship with this asset already (e.g. components using Lucide icons).

### Best-in-class moves
- Searchable preview grid for icon sets — most asset directories show 12 icons and force a download to see the rest.
- Per-icon copy as JSX/Vue/React component — saves the user converting SVG manually.
- License clarity unique vs sites that bury the license in a footer.

### Dummy data
- **Name:** "Lucide"
- **Tagline:** "1,847 carefully crafted open-source icons. Successor to Feather."
- **Kind:** Icon set
- **Count:** 1,847 icons, 4 stroke weights
- **Formats:** SVG, React, Vue, Svelte, Solid, Preact, Flutter, Font
- **License:** ISC (essentially MIT)
- **Used by:** 23,000+ projects in our directory

---

## §17 Docs-for-LLMs — `/docs-for-llms/[slug]`

### What this page is for
A user wants up-to-date docs feed for an LLM (`llms.txt`, Context7 entry, or structured docs). They need to see what's in the docs, install the URL into their AI's rules, and trust that it's fresh.

### Hero specifics
- Doc-kind badge: `Library` / `Framework` / `API` / `Platform`.
- Package name in monospace.
- Last updated: "Auto-refreshed 4h ago".
- Coverage badge: "Covers 247 doc pages, 1.2M tokens".
- Install button: copies the `llms.txt` URL or `Context7` ID to clipboard with a "Add to my .cursorrules" suggestion.

### Zone 5 — type-specific blocks

**Coverage breakdown**

```
What this docs feed includes
  ✅ API reference (89 pages)
  ✅ Quickstart guides (12 pages)
  ✅ Tutorials (34 pages)
  ✅ Examples (47 pages)
  ⚠️ Blog posts (last 90 days only)
  ❌ Videos (not parsed)

Last full re-crawl: 4 hours ago
Total tokens: 1.2M
```

**Sample preview**

A scrollable preview of the first ~5KB of the `llms.txt` file. Renders as plaintext with syntax highlighting where appropriate.

**Add to my AI IDE**

Per-IDE install instructions:

**Cursor:** Add this to your `.cursorrules`:
```
Always use Context7 when I need Convex documentation.
Use library ID: /convex-dev/convex
```

**Claude Code:** Add this MCP server: `[Install Context7 MCP →]`

**Direct fetch:** `curl https://context7.com/convex-dev/convex/llms.txt`

**Freshness signal**

A timeline showing the last 7 re-crawls and their delta sizes. Trust signal that this isn't stale.

**Pairs well with**

The MCP server (Context7 itself), rules files that reference this doc, models that benefit from this context.

### Best-in-class moves
- Coverage breakdown removes ambiguity about what's actually in the feed.
- Per-IDE install with specific snippets — most directories just show the URL.
- Freshness timeline as trust signal.

### Dummy data
- **Name:** "Convex llms.txt"
- **Tagline:** "Always-fresh Convex docs for your AI IDE. Auto-refreshed 6× per day."
- **Kind:** Framework
- **Package:** convex-dev/convex
- **Coverage:** 247 pages, 1.2M tokens
- **Last refresh:** 4h ago
- **Provider:** Context7

---

## §18 Workflows — `/workflows/[slug]`

### What this page is for
A user wants an end-to-end recipe — "Solo SaaS MVP in a weekend with Cursor + supastarter + Supabase + Stripe." They follow the steps, install resources along the way, and ship.

### Hero specifics
- Outcome chip: `SaaS MVP` / `Landing page` / `Automation` / `Game` / `Content`.
- Difficulty: `🟢 Beginner` / `🟡 Intermediate` / `🔴 Advanced`.
- Duration: `Weekend` / `One day` / `One hour`.
- Step count: `12 steps`.

### Zone 5 — type-specific blocks

**Vertical stepper (full-width, the heart of the page)**

```
1 ── Pick a starter kit
     [Next 15 + Convex SaaS Starter]  ← embedded resource card
     ⏱ 2 min · "Clone to your machine"

2 ── Add the AI rules
     [.cursorrules for Next + Convex]  ← embedded resource card
     ⏱ 1 min

3 ── Set up auth
     [Better Auth backend kit]  ← embedded resource card
     ⏱ 5 min · "Run npx better-auth init"

4 ── Wire up payments
     [Stripe backend kit]  ← embedded
     [stripe-payments MCP]  ← embedded MCP
     ⏱ 10 min

...

12 ── Deploy
      [Deploy to Vercel] button
      ⏱ 2 min · "First deploy is the easiest"
```

Each step is a card containing:
- Step number + title
- An embedded resource card (the resource the user will install at this step)
- Duration estimate
- A short instruction
- "Mark step complete" / "Skipped this step" buttons (logged-in users — feeds telemetry)

**Time to complete**

A horizontal timeline showing where users typically slow down. "Most users finish steps 1–6 in 47 minutes. Step 7 (Stripe webhooks) is where 23% pause." Sourced from `guide_completions`.

**The prompts that worked**

Specific prompts to paste into Cursor / Claude Code / Windsurf at each step:

```
Step 4 prompt for Cursor:
"Create a Stripe subscription flow with monthly/yearly billing.
 Use the Stripe MCP I just installed. Generate the webhook handler,
 the customer portal page, and the pricing component."
```

**Real outcomes**

A strip of showcase cards: "Things people built with this workflow." Each links to its showcase page.

### Best-in-class moves
- Embedded resource cards mean the user installs as they go — no tab-switching.
- Telemetry-driven "where people pause" is a unique value-add.
- Specific prompts per step — most workflows are vague about *what to ask the AI*.

### Dummy data
- **Title:** "Solo SaaS MVP in a Weekend"
- **Outcome:** SaaS MVP
- **Difficulty:** Intermediate
- **Duration:** Weekend (12–18 hours)
- **Steps:** 12
- **Resources used:** 1 starter, 2 rules files, 4 backend kits, 3 MCPs, 6 prompts
- **Completions:** 1,247 (78% finish all steps)
- **Median time:** 14h 22m

---

## §19 Evals — `/evals/[slug]`

### What this page is for
A user (often technical, often building AI products) wants to find a benchmark or eval set. They need to see the methodology, the leaderboard, and how to reproduce it on their own model.

### Hero specifics
- Benchmark-kind badge: `SWE-Bench` / `AGENTbench` / `Custom` / `Golden tasks`.
- Task count: "303 tasks".
- Reproducibility badge: `🟢 Reproducible` / `⚠️ Closed`.
- Leaderboard URL link.

### Zone 5 — type-specific blocks

**Leaderboard table**

Top 20 models on this benchmark, sortable. Each row: model name (with link to model page), score, methodology variant, date measured, source link.

```
Rank  Model              Score   Method          Date         Source
#1    GPT-5.5 (xhigh)    71.4%   Pass@1          Apr 2026     [link]
#2    Claude Opus 4.7    68.2%   Pass@1          Apr 2026     [link]
#3    Gemini 3.1 Pro     66.8%   Pass@1          Apr 2026     [link]
...
```

**Methodology**

Plain-English explanation of what's measured, with the official paper / technical report linked.

**Sample tasks**

3–5 sample tasks from the benchmark, fully shown. Builds trust that the benchmark is testing real things, not gaming.

```
Sample task #142
"Fix the bug where the test runner hangs on async fixtures
 in pytest-asyncio. Submit a PR that passes the existing
 regression test."

Repository: pytest-dev/pytest-asyncio
```

**Reproduce locally**

A code block showing how to run this benchmark on a model:

```bash
git clone https://github.com/swe-bench/SWE-bench
cd SWE-bench
python -m swebench.run --model claude-opus-4-7 --tasks 1-50
```

**Critique**

A short editorial section on where this benchmark fails — saturation, distribution shift, gaming patterns. Honest assessment, not just promotion.

### Best-in-class moves
- Live leaderboard pulled from sources, with source links per row.
- Sample tasks for transparency.
- "Critique" section is rare and valuable — gives users a real sense of how to weight this benchmark.

### Dummy data
- **Name:** "SWE-Bench Verified"
- **Kind:** SWE-Bench
- **Task count:** 500
- **Reproducible:** ✅
- **Last updated:** 3 weeks ago
- **Top score:** 71.4% (GPT-5.5 xhigh)
- **Methodology:** Pass@1 with verified solutions

---

## §20 Subagents — `/subagents/[slug]`

### What this page is for
A user wants a Claude Code subagent — a specialised agent with its own tool access, model assignment, and proactive behaviours. They need to see the agent.md, fork to tweak, and install.

### Hero specifics
- Model assignment: `Inherits from main` / `sonnet` / `opus` / `haiku`.
- Tool access chips: `Read`, `Write`, `Bash`, `WebFetch`.
- Proactive flag: `🤖 Use proactively`.
- Context isolation badge: `Isolated context` (most are).

### Zone 5 — type-specific blocks

**agent.md viewer (full-width)**

```
─── frontmatter ─────────────────────────
name: code-reviewer
description: Expert code review specialist.
  Proactively reviews code for quality,
  security, and maintainability.
tools: Read, Grep, Glob, Bash
model: inherit
─── system prompt ───────────────────────
You are a senior code reviewer ensuring
high standards of code quality...
─────────────────────────────────────────
```

**When to use this**

Plain-English: "Use this subagent for…" A bullet list of when Claude Code should delegate to it. This is where the proactive triggers from the agent's description get expanded with examples.

**Test the agent**

A mini playground: paste a code change, the agent reviews it. Shows the kind of feedback the user would get in their real workflow.

```
Test on this code change:
  +  function getUserById(id) {
  +    return db.query(`SELECT * FROM users WHERE id = ${id}`);
  +  }

[▶ Run code-reviewer]
─────────────────────────────────────────
[reviewer] Found 1 critical issue:
  • SQL injection risk on line 2. Use parameterised
    queries instead.
[reviewer] Found 1 suggestion:
  • Consider adding error handling for missing user.
```

**Fork to my account**

Same forking pattern as skills.

**Pairs well with**

Skills that this agent uses; commands that invoke this agent (e.g. `/review` invokes `code-reviewer`).

### Best-in-class moves
- Test-the-agent before installing.
- Plain-English "when to use" expanding the proactive description.
- Visual highlighting of which tools the agent has access to (security signal).

### Dummy data
- **Name:** "code-reviewer"
- **Tagline:** "Expert code review specialist. Proactive reviewer with security focus."
- **Tools:** Read, Grep, Glob, Bash
- **Model:** inherit
- **Use proactively:** ✅
- **Forks:** 89

---

## §21 Prompts — `/prompts/[slug]`

### What this page is for
A user wants a prompt recipe — a proven multi-turn workflow with variables. They paste it into their LLM, fill the variables, get the result.

### Hero specifics
- Steps count: `Single-turn` / `3-turn workflow` / `5-turn workflow`.
- Best-for tags: `coding` / `writing` / `research`.
- Variable count: `4 variables`.

### Zone 5 — type-specific blocks

**Prompt viewer with variable substitution**

The prompt rendered with `{variables}` highlighted. Below it, an inline form to fill them:

```
Prompt template
─────────────────────────────────────────
Generate a landing page for {{product_name}},
which solves {{pain_point}} for {{audience}}.

The page should include:
- A hero with {{cta_text}} as the primary CTA
- 3 feature cards
- A pricing section with monthly/yearly toggle
- Social proof (3 logos placeholder + 1 quote)

Use Tailwind v4 + shadcn/ui components.
─────────────────────────────────────────

Fill in the variables:
  product_name  [______________]
  pain_point    [______________]
  audience      [______________]
  cta_text      [______________]

[Preview] [Copy filled prompt] [Run in playground]
```

**Run in playground**

The "Run" button feeds the filled prompt into a model playground (model picker visible), shows the response inline.

**Example output**

Cached examples of what users got when they ran this prompt with sample inputs. 2–3 worked examples.

**Pairs well with**

Models known to work well with this prompt (some prompts perform better with reasoning models, others with non-reasoning).

**Variations**

Forks of this prompt with different framings ("more formal", "for a technical audience", "shorter version").

### Best-in-class moves
- Variable substitution form is interactive — most prompt directories show the prompt as plain text.
- Run-in-playground without leaving the page.
- Cached example outputs build trust.

### Dummy data
- **Title:** "Generate a landing page from positioning"
- **Steps:** Single-turn
- **Variables:** product_name, pain_point, audience, cta_text
- **Best for:** landing-page generation
- **Used:** 4,231 times this month
- **Avg user rating:** 4.7

---

## §22 Marketplaces — `/marketplaces/[slug]`

### What this page is for
A user wants to subscribe to a Claude Code marketplace — a GitHub repo that bundles plugins. They need to see what's inside, add it via CLI, and browse contained plugins.

### Hero specifics
- Curator name + GitHub handle.
- Plugin count: "57 plugins".
- Skill / MCP / command counts (aggregated from all bundled plugins).
- Add button: `claude plugin marketplace add davepoon/buildwithclaude`.

### Zone 5 — type-specific blocks

**Plugins grid**

A searchable grid of all plugins in this marketplace. Each card links to that plugin's detail page (within the marketplace context).

```
Showing 57 plugins  [search]  [filter by type]

[plugin card] [plugin card] [plugin card]
[plugin card] [plugin card] [plugin card]
...
```

**About the curator**

A short bio about who maintains this marketplace, why it exists, what philosophy guides plugin selection.

**How to subscribe**

```bash
> /plugin marketplace add davepoon/buildwithclaude
✓ Fetching marketplace registry...
✓ Adding buildwithclaude marketplace
Available plugins:
  • frontend-design-pro
  • nextjs-expert
  • interview
  • + 54 more

Run /plugin install <name> to install
```

**Recent additions**

A timeline of newly added plugins to this marketplace, last 30 days.

**Stats**

```
Plugins:   57
Skills:    131
Subagents: 117
Commands:  175
Hooks:     28
Subscribers: 4,231
Updated weekly
```

### Best-in-class moves
- Plugin grid searchable + filterable.
- "About the curator" section — trust signal.
- Recent additions timeline tells users this is alive.

### Dummy data
- **Name:** "Build with Claude"
- **Curator:** @davepoon
- **Plugins:** 57
- **Subscribers:** 4,231
- **Last update:** 2 days ago

---

## §23 Commands — `/commands/[slug]`

### What this page is for
A user wants a slash command — a reusable `.claude/commands/*.md` file. They paste it in, type `/the-command` in Claude Code, get the result.

### Hero specifics
- Slash command syntax: `/refactor`, `/test`, `/deploy`.
- Args schema: `<file-path> [--coverage]`.
- Invokes-subagent badge if applicable.

### Zone 5 — type-specific blocks

**Command file viewer**

Full markdown rendering of the command file, with frontmatter syntax-highlighted.

**Args schema**

Visual breakdown of arguments:

```
/refactor <file-path> [--style=tight|verbose] [--test]

  file-path     required    Path to the file to refactor
  --style       optional    Default: tight
  --test        optional    Generate tests after refactor
```

**Sample invocations**

```
> /refactor src/auth/oauth.ts
> /refactor src/auth/oauth.ts --style=verbose
> /refactor src/auth/oauth.ts --test
```

Each clickable to copy.

**What this command does**

Plain-English: "When you run this command, Claude Code will: 1. Read the target file. 2. Identify code smells. 3. Refactor without changing public API. 4. Optionally generate tests."

**Pairs well with**

The subagent it invokes (if any), skills it triggers, related commands in the same workflow.

### Best-in-class moves
- Args schema as a structured visual.
- Sample invocations as a copy-able list.
- "What this command does" makes the agent's behaviour transparent.

### Dummy data
- **Name:** "/refactor"
- **Tagline:** "Refactor a file without breaking its public API. Generates tests on demand."
- **Args:** `<file-path> [--style] [--test]`
- **Invokes subagent:** code-reviewer (after refactor)
- **Installs:** 2,341

---

## §24 Sandboxes — `/sandboxes/[slug]`

### What this page is for
A user wants ephemeral compute for running Claude Code agents, MCP servers, or scripts. They need to know cold-start times, persistence behaviour, and pricing.

### Hero specifics
- Cold-start chip: `~150ms cold start`.
- Max session: `Unlimited` / `8h max`.
- GPU support badge.
- Filesystem persistence badge.
- OS image chip: `Ubuntu 22.04` / `Alpine 3.18`.

### Zone 5 — type-specific blocks

**Cold-start latency chart**

A bar chart comparing this sandbox to alternatives on cold start time. Sourced from real measurements.

**What it can run**

```
✅ Claude Code agents (full filesystem)
✅ Long-running MCP servers
✅ Bash + Node + Python + Go
✅ Docker containers (nested)
⚠️ GPU workloads (paid tier only)
❌ Persistent state across sessions (use the persistence add-on)
```

**Pricing**

Honest hourly + monthly:

```
Free        100 hours/mo · 4 vCPU · 8GB RAM · 10GB disk
Pro         $0.18/hour · 8 vCPU · 16GB RAM · 50GB disk
Pro+GPU     $0.74/hour · with A10 GPU · 24GB VRAM
Enterprise  contact us
```

**Quickstart code**

Inline snippet showing how to spawn a sandbox session and run code in it:

```typescript
import { Sandbox } from "@e2b/code-interpreter";

const sandbox = await Sandbox.create();
const result = await sandbox.runCode("print('hello')");
```

**Use cases**

Short list of common patterns: "running Claude Code in production", "executing user-submitted code safely", "ephemeral agent runtimes".

**Real-world performance**

If we have telemetry: average session duration, average cost/session.

### Best-in-class moves
- Honest cold-start chart vs alternatives.
- "What it can run" is explicit about edge cases (GPU workloads, persistence).
- Quickstart snippet immediately copy-able.

### Dummy data
- **Name:** "E2B"
- **Tagline:** "Open-source secure sandboxes for AI code interpreters."
- **Cold start:** 150ms
- **Max session:** 24h
- **GPU:** Yes (paid)
- **OS:** Ubuntu 22.04
- **Pricing:** Free / $0.18/hr / $0.74/hr (GPU)

---

## §25 Showcase — `/showcase/[slug]`

### What this page is for
A user wants inspiration — they want to see real, shipped projects built with vibe-coding tools. They click through to the live site, but more importantly, they see the *stack* used and can replicate it.

### Hero specifics
- Big screenshot or video as the hero (16:9 or square).
- Live URL chip: `[Visit ↗]`.
- Built-with stack chips: 8–12 chips of every resource used.

### Zone 5 — type-specific blocks

**Screenshot gallery**

Lightbox-able grid of 4–8 screenshots showing different views of the project.

**Built with — full breakdown**

This is the value-add. A grid of every resource used:

```
FRAMEWORK                         AI TOOLS
[Next.js 15]                      [Cursor]
                                  [Claude Code]
DATABASE & AUTH
[Convex]                          MCPs USED
[Better Auth]                     [GitHub MCP]
                                  [Figma MCP]
PAYMENTS                          [Stripe MCP]
[Stripe]
                                  STARTERS
EMAIL                             [Next 15 + Convex SaaS]
[Resend]
                                  COMPONENTS
DEPLOYMENT                        [3 from our directory]
[Vercel]
```

Each clickable to that resource's detail page.

**Builder's notes**

A short editorial section by the builder: how they vibe-coded this, where they got stuck, what surprised them. Trust + relatability.

**Build timeline**

How long it took: "Built in 14 days, soft-launched on day 9."

**Stats (if shared)**

If the project has shared stats: MAU, revenue, traffic. Optional but powerful.

**Replicate this**

A "Replicate this stack" button that creates a new user stack pre-loaded with all the resources used. One click → ready to clone.

### Best-in-class moves
- "Built with" cross-references the entire directory — no other showcase site does this with our depth.
- "Replicate this" is the killer — converts inspiration into action.
- Builder's notes humanise the project.

### Dummy data
- **Name:** "MealMatch"
- **Tagline:** "Recipe-matching app. Built solo in 14 days."
- **Builder:** @bens-cooking
- **Live URL:** mealmatch.app
- **Stack:** Next.js 15, Convex, Better Auth, Stripe, Resend, Vercel
- **AI tools:** Cursor, Claude Code
- **MCPs:** GitHub, Figma, Stripe
- **Build time:** 14 days
- **MAU:** 4,200 (3 months in)

---

## §26 Specs — `/specs/[slug]`

### What this page is for
A user wants a spec template — PRD, AGENTS.md, architecture spec — designed to be fed to coding agents. They fork it, customise to their project, and use it as the source of truth.

### Hero specifics
- Spec-kind badge: `PRD` / `Feature spec` / `AGENTS.md` / `Architecture` / `Data model`.
- Length: "1,200 words".
- Best-for tags: which kinds of projects use this.

### Zone 5 — type-specific blocks

**Spec viewer**

Full markdown rendering of the spec content.

**Why this works**

Editorial section: "What makes this spec effective for AI agents." Cites Karpathy / Addy Osmani / Augment Code research where applicable.

**Fork to my project**

Same fork pattern. Forking opens an inline editor pre-filled with placeholders for the user to swap (`{your_project_name}`, `{your_stack}`, etc.).

**Example completed**

A worked example showing this spec filled in for a real project — gives users a sense of what their version should look like.

**Pairs well with**

Workflow guides that use this spec, prompt recipes that reference it.

### Best-in-class moves
- Worked example removes guesswork.
- Editorial "why this works" gives the spec credibility.
- Fork-with-placeholders is efficient.

### Dummy data
- **Name:** "AGENTS.md for SaaS MVP"
- **Tagline:** "Battle-tested AGENTS.md template that gets coding agents on the same page in 200 lines."
- **Kind:** AGENTS.md
- **Length:** 247 lines
- **Used by:** 1,400+ projects in our directory

---

## §27 Stacks — `/u/[username]/[stack-slug]`

### What this page is for
A user is browsing someone else's curated stack — "Ben's Next.js + Claude Code + Convex stack". They see what's in it, can adopt it as their own, and share it.

### Hero specifics
- Stack name + tagline.
- Curator: avatar + handle.
- Item count: "14 resources across 6 types".
- Privacy: 🌐 Public / 🔒 Private (only owner sees private).
- Primary CTA: `[Adopt this stack]` (copies into the viewing user's own stacks).

### Zone 5 — type-specific blocks

**Stack contents grid**

Resources grouped by type:

```
AI TOOLS (2)
[Cursor] [Claude Code]

FRAMEWORKS (3)
[Next.js 15] [Tailwind v4] [TypeScript 5.6]

BACKEND (3)
[Convex] [Better Auth] [Resend]

MCPS (4)
[GitHub MCP] [Convex MCP] [Figma MCP] [Stripe MCP]

RULES (1)
[Next 15 + Convex .cursorrules]

STARTERS (1)
[Next 15 + Convex SaaS Starter]
```

**Curator's notes**

The curator's commentary on why they picked these resources, what the trade-offs were.

**Discussion**

Threaded comments on the stack — recommendations for additions, questions, alternatives.

**Adopt this stack**

The killer button:

```
[Adopt this stack →]

This will:
  ✓ Add 14 resources to your bookmarks
  ✓ Update your stack picker preferences
  ✓ Save this stack to your profile
```

**Forks of this stack**

Other users who started from this stack and customised. Visual fork tree.

### Best-in-class moves
- Stacks are *both* a feature and a resource. They show up in the directory, get rankings, get votes — like a Spotify playlist for vibe coders.
- One-click adopt.
- Public stacks have their own SEO-friendly URLs.

### Dummy data
- **Name:** "Ben's Solo SaaS Stack"
- **Curator:** @bens-cooking
- **Resources:** 14 across 6 types
- **Adopters:** 247
- **Forks:** 23

---

## §28 Scripts — `/scripts/[slug]`

### What this page is for
A user wants a standalone script or CLI that runs alongside their AI workflow — anything from a setup script to a build helper.

### Hero specifics
- Language badge: `bash` / `python` / `typescript` / `rust` / `go`.
- Entrypoint: `./install.sh` or `python -m vch_helper`.
- Args schema (if applicable).

### Zone 5 — type-specific blocks

**Script viewer**

Full source with syntax highlighting and inline copy.

**What it does**

Plain-English breakdown of the script's behaviour. For longer scripts, a step-by-step.

**Args & flags**

Structured table of CLI arguments and flags.

**Run instructions**

Per-OS install + run instructions:

```bash
# macOS / Linux
curl -sSL https://vch.example/install.sh | bash

# Windows (PowerShell)
iwr https://vch.example/install.ps1 | iex
```

**Safety review**

Important for scripts: what permissions does this script need? What does it touch on the filesystem? This is a trust differentiator. Show the answer plainly:

```
This script:
  ✅ Installs in ~/.local/bin (no sudo)
  ✅ Touches only ~/.config/vch/
  ❌ Does not run sudo
  ❌ Does not phone home
```

**Pairs well with**

Workflow guides that use this script.

### Best-in-class moves
- Safety review unique among script directories — most scripts are "curl | bash" with no transparency.
- Per-OS run instructions.
- Clear args/flags schema.

### Dummy data
- **Name:** "vch-cli"
- **Tagline:** "Install, manage, and update Vibe Coder Hub resources from your terminal."
- **Language:** TypeScript
- **Entrypoint:** `vch`
- **Args:** `vch install <slug> [--client=cursor]`
- **Installs:** 8,420

---

## §29 Cross-cutting design notes

A few patterns that recur across all detail pages — design these once, reuse everywhere.

### The "Forks" tab pattern
For every resource type that supports forking (Skills, Rules, Prompts, Subagents, Commands, Specs, Stacks, Hooks), the Forks tab shows:
- Fork tree visualisation (vertical, with the original at the top, descendants flowing down)
- "Most popular fork" highlighted
- "Forks that are now bigger than the original" called out
- Each fork links to its detail page

### The "Versions" tab pattern
For every resource that ships in versions, the Versions tab shows:
- Reverse-chronological list of versions
- Each entry: version number, release date, changelog summary, "install this version" button
- Diff view between any two versions (text-based diff for code/skills/rules/specs; metadata diff for everything else)

### The "Compatibility" tab pattern
For every installable resource:
- Matrix of clients × test status (✅ ⚠️ ❌ ❓)
- Test method per cell (automated / user-report / curator)
- Last test date per cell
- "Submit a compatibility report" button for users who tried it

### The "Analytics" tab pattern
For every resource with usage data:
- 30/90/365-day install chart
- 30/90/365-day view chart
- Top 5 referrers (which pages drove installs)
- Top 5 client IDs (which IDEs are installing this)
- Author-only: revenue / gateway usage / paid tier conversions

---

## §30 Dummy data principles

When designing each detail page, populate with:
- **Realistic resource names** — not "Lorem Component", but names that match how the ecosystem actually names things ("AuthForm with OAuth grid", "Better Auth", "Next 15 + Convex SaaS Starter").
- **Realistic stat numbers** — install counts in the 10s to 10,000s, not millions. Reviews in the 5–500 range. Forks in the 0–500 range.
- **Plausible authors** — username-shaped, not fake-celebrity names.
- **Real tech stack chips** — Next.js 15, React 19, Tailwind v4, Convex, Better Auth, etc. Not "FrameworkA", "DatabaseX".
- **Real model versions** — Claude Opus 4.7, GPT-5.5, Gemini 3.1 Pro, Qwen 3 32B. Pricing within ~20% of current real prices for credibility.

---

## §31 Final checklist

For every detail page in §2–§28, deliver:

- [ ] Default state (with realistic dummy data populated)
- [ ] Loading state (skeleton matching the layout)
- [ ] Empty state (where applicable — e.g. zero reviews, zero forks)
- [ ] Error state (resource fetch failure, deleted resource)
- [ ] Mobile responsive variant (375px and 768px)
- [ ] Dark and light theme variants
- [ ] Logged-out variant (where features are gated)
- [ ] Pro-paywall variant (where applicable — see Models, Deals, MCPs with gateway)
- [ ] Author-owned variant (when the viewing user owns this resource — adds Edit / Analytics access)

---

## §32 What this delivers

After Claude Design completes this prompt, the team has:
- 27 fully designed detail page templates, each tuned to its resource type
- Consistent shared chassis (zones 1–4, 6–9) so the user always knows where they are
- Type-specific zone 5 that makes each page genuinely useful for *that* resource type
- 9 cross-cutting tab patterns (Overview, Try It, Guides, Install, Source, Compatibility, Reviews, Versions, Forks, Analytics) that work across all 27 types
- Dummy data that makes the designs credible during stakeholder review
- All states accounted for so engineering doesn't get blocked on missing edge cases

Each page is best-in-class for its category. Together, they form a directory experience nothing in the vibe-coding space currently offers.
