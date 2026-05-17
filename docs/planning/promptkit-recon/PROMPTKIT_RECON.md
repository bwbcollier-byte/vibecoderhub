# Promptkit Reconnaissance Report
*Pre–Phase A briefing. Time budget: 15 min. Time used: ~12 min.*

## What it is

A single-page React 18 prototype of Vibe Coder Hub, served by `Promptkit.html` via Babel-standalone in the browser (no build step). The whole app is mocked in client memory — no backend, no real auth, no real data. Routing is hash-based with JSON-encoded route objects (`#%7B%22name%22:%22home%22%7D`). State is plain `useState` in a single `App` component; bookmarks/stack/user live in the root.

Visual language is **The Verge's design system** with Google-Fonts substitutes for the proprietary originals (Bebas Neue stands in for Manuka, DM Sans for PolySans, Space Mono for PolySans Mono, Newsreader for FK Roman). Editorial / hazard-tape aesthetic: black canvas, mint accent (#3cffd0), ultraviolet secondary (#5200ff), oversized display type, mono caps for kickers and labels. Dark-mode only.

## Inventory

### Screens (24 total, in 5 files)
**`pages.jsx`** — `LandingPage`, `HomePage`, `DirectoryPage`, `SearchPage`
**`pages2.jsx`** — `ResourceDetailPage` + 27 type-specific detail blocks (`ResourceOverview`, `MCPInspector`, `ComponentSandpack`, `SkillViewer`, `RuleViewer`, `SubagentViewer`, `PromptPlayground`, `PluginBundle`, `HookViewer`, `CommandRunner`, `StarterPreview`, `WorkflowStepper`, `ShowcaseHero`, `EvalLeaderboard`, `SandboxBlock`, `ToolBlock`, `AssetGrid`, `DocsPreview`, `SpecBlock`, `StackBlock`, `BackendKitBlock`, `ObservabilityBlock`, `MarketplaceBlock`, `ScriptBlock`, `GenericReadme`) + shared blocks (`ResourceTryBlock`, `ResourceGuides`, `ResourceInstallTab`, `CompatibilityMatrix`, `ReviewsBlock`, `VersionsBlock`, `RightRail`)
**`pages3.jsx`** — `ModelDetailPage`, `CostCalculator`, `ComparePage`
**`pages4.jsx`** — `DealsPage`, `NewsPage`, `NewsArticlePage`, `GuidesPage`, `GuideReader`, `DashboardPage`, `SettingsPage`, `SubmitPage`, `NotFoundPage`

### Overlays (`overlays.jsx`)
`StackPicker`, `CmdK` (with `CmdKGroup`), `CookieBanner`, `UpgradeModal`, `ClaimDealModal`, `AuthModal`, `CompareDrawer`

### Chrome (`chrome.jsx`)
`Header` (with mega-menu over "All 27 types ▾" — actually 24), `MobileNav` (bottom bar, 5 tabs), `Footer` (5 columns), `StackBanner` (mobile-only sticky strip)

### Primitives (`components.jsx`)
Icon set (~40 Lucide-style SVGs, 1.5–1.6 stroke), `TypeBadge`, `ClientRow`, `Stat`, `Sparkline`, `ProviderMark`, `ResourceCard` (7 variants: dark/mint/uv/yellow/pink/orange/blue), `ModelCard`, `DealCard` (with locked/blur Pro paywall state), `NewsCard`, `SectionH`, `SkeletonCard`, `EmptyState`, `CodeBlock`, `InstallButton` (split-button "one-click + dropdown + copy command"), `Modal`, `Drawer`, `Toast` (4 kinds: info/success/error/warning).

### Data shape (`data.js`)

**Resource record:**
```ts
{ slug, type, name, tagline, author, version, license,
  clients: string[],   // IDE compatibility
  stack: string[],     // tech tags
  score: number,       // 0–5
  installs7d: number,  // weekly window
  total: number,       // cumulative
  updated: string,     // RELATIVE — "3d ago" — needs absolute timestamp in real data
  forks: number,
  rank?: 1,            // category #1 marker
  variant?: 'mint'|'uv'|'pink'|'yellow'|'orange'|'blue'|'dark',
  desc?: string,
  openWeights?: boolean }
```

**Model record adds:** `provider`, `providerColor`, `priceIn`, `priceOut`, `intelligence` (1–5), `speed` (tok/s), `latency` (s), `ctxAdv`, `ctxEff`, `cutoff`, `released`, `delta` (% price change), `tags[]`.

**Deal record:** `slug`, `name`, `value` (display), `valueRaw` (numeric USD), `summary`, `tier` ('public'|'member'|'pro'), `provider`, `providerColor`, `expires`, `category`, `claimed`.

**News record:** `slug`, `kind` ('breaking'|'releases'|'ecosystem'|'tutorials'|'op-eds'), `headline`, `source`, `time` (relative), `summary`, `topics[]`, `variant`, `auto?` (was AI-summarized).

**Guide record:** `slug`, `resourceSlug` (FK), `title`, `kind` ('GET STARTED'|'ADVANCED'|'TROUBLESHOOT'|'MIGRATE'), `difficulty`, `duration`, `os[]`, `steps`.

**User stack:** `{ clients: string[], tags: string[], hardware: { platform, chip, ram } }`

**STATS (footer):** `resources`, `ides`, `models`, `dealsValue`.

## Tokens — what Promptkit actually defines

(Read `src/tokens.css` for the canonical list; key contrasts vs. the prompt's "locked tokens" below.)

| Dimension | Promptkit | Prompt's "locked" tokens |
|---|---|---|
| Spacing | 1, 2, 4, 5, 6, 8, 9, 10, 12, 14, 15, 16, 20, 24, 25, 32, 40, 48, 64 (off-grid values) | 4px-base only: 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 |
| Radii | input 2, image-sm 3, image 4, tile 20, feature 24, promo 30, pill 40, circle 50% | none/4/8/12/16/full; cards=12, buttons=8, inputs=8 |
| Buttons | one `.btn` (10/18 padding) + `.btn-sm` + `.btn-lg` — 3 sizes, **no fixed heights** | 5 fixed heights: 24/32/40/48/56 |
| Inputs | one `.input` (10/12 padding, 2px radius) — 1 size | 3 fixed heights: 32/40/48 |
| Type | 6-tier display + 4 heading + 9 label/body + 2 mono + 2 serif tokens; hero 107px, display-2 90px | xs(12) → 6xl(60); 4 weights only |
| Fonts | **4 families** (Bebas Neue / DM Sans / Space Mono / Newsreader) | **Max 3 fonts** |
| Theme | Dark-mode only; no light tokens | Dark default + light must work |
| Focus ring | 1px cyan #1eaedb, 2px offset | 2px theme accent, same offset |
| Hover transition | 150ms ease (matches) | 150ms ease-out (matches) |
| Z-index | header 90, modal 200, toast 300 (3-tier) | base→tooltip 0→70 (8-tier) |

## Resource type vocabulary

Promptkit defines **24 types**, not 27 (prompt mission says "27 resource types"):

`component, mcp, skill, subagent, rule, prompt, plugin, marketplace, hook, command, starter, tool, model, sandbox, observability, backend, asset, showcase, docs, spec, workflow, stack, eval, script`

Header mega-menu groups them as: **EXTENSIONS** (skill, subagent, plugin, hook, command, marketplace) · **PROMPTS** (prompt, spec, rule, workflow) · **INFRA** (sandbox, observability, backend, docs, eval) · **CONTENT** (component, asset, starter, showcase, stack, script). Top-level nav exposes the 4 most-trafficked: components, models, mcps, tools (plus deals, news, guides).

The 3 missing types are unknown until I read the spec — likely candidates from context: `gateway`, `dataset`/`benchmark`, `agent` (distinct from subagent), or splits like `cli` vs `tool`.

## Client list (10 IDEs)

cursor, claude-code, windsurf, cline, aider, continue, zed, copilot, claude-desktop, cody.

## Where Promptkit overlaps the spec docs (best-guess pre-spec read)

- **Design prompt**: tokens, primitives, screen vocabulary — Promptkit is a more concrete source than a prose design doc. Use it as the reference *implementation* of any visual that the design prompt describes verbally.
- **Detail-pages doc**: the 27 type-specific detail blocks in `pages2.jsx` should map almost 1:1 — Promptkit is likely the executable form of that doc.
- **Final spec**: covers screens (HomePage, DirectoryPage, ResourceDetailPage, ModelDetailPage, ComparePage, DealsPage, NewsPage, GuidesPage, DashboardPage, SettingsPage, SubmitPage). Submit/Settings/Dashboard are placeholder-grade in Promptkit; expect the spec to be more detailed.
- **Schema**: data.js gives field shapes but no relations, indexes, RLS, or audit fields. Schema migration will be much richer.
- **Data sourcing**: not addressed. Promptkit has hard-coded seed data only.
- **Master plan**: not addressed.

## Where Promptkit conflicts with the build prompt (must surface in Phase A)

These are the four sharpest conflicts. Each gets its own Phase-A question.

1. **Token system divergence (P0)** — Promptkit uses Verge's design system: 4 fonts, off-grid spacing, button-by-padding (no fixed heights), inputs at 2px radius. The prompt locks 4px spacing, 5 button heights, 3 input heights, 5 radii, max 3 fonts. We can't have both. Either (a) Promptkit's tokens win and the prompt's "locked tokens" section gets rewritten to match, or (b) the prompt wins and Promptkit becomes a *layout* reference whose tokens get re-mapped. Strongly recommend (a): Promptkit tokens are coherent, opinionated, and match the brand voice — the prompt's tokens read like a generic safe baseline.

2. **Resource-type count (P0)** — Promptkit has 24, prompt mission says 27. Need the spec's authoritative list before any DB or routing work.

3. **Theme scope (P1)** — Promptkit is dark-only (Canvas Black background everywhere, no light tokens defined). Build prompt requires "Dark mode is default; light mode must work and be tested per page." This is roughly +30% UI work and a non-trivial token expansion. Need to confirm whether light mode is launch-day or deferable.

4. **Font count (P1)** — Promptkit loads 4 (Bebas Neue, DM Sans, Space Mono, Newsreader). Prompt caps at 3. Most droppable: Newsreader (only used for `.t-serif` pull-quotes). Recommend dropping unless an editorial article reading view requires it.

## Things Promptkit doesn't cover (gaps to fill from the specs)

- Real auth flow (only an `AuthModal` that flips `user` state)
- Stripe checkout / Customer Portal / webhooks / failed-renewal grace / refunds
- Ingestion pipeline (no API clients, no scheduling, no `ingestion_runs` table)
- Admin / moderation queue
- Rate limiting, RLS, server-side validation
- Email templates, unsubscribe, bounce handling
- SEO infrastructure (sitemap, robots, OG generation)
- Real search (search page is a static mock)
- Real Cmd-K results (groups are hard-coded)
- Pagination (everything renders the full seed array)
- Bookmarks/collections persistence (lives in a `Set` in component state)
- Reviews submit flow
- Newsletter signup confirm flow
- Tweaks panel — useful as an internal design tool but **not part of the production app** (it's a dev-only iteration aid)

## Recommended use during build

- **Visual reference of record** for cards, headers, stat displays, install buttons, deal cards (with the Pro paywall blur), news cards, type badges, the 4-color variant system, the section-header pattern, and the 27 detail-page block layouts.
- **Pixel reference** when building each screen — open the corresponding `pages*.jsx` block in another tab and match.
- **NOT** a code source to copy from. Inline styles everywhere, no TypeScript, no a11y audit, no responsive testing, hash routing, no real data layer. Treat as Figma-in-React.
- **Tokens**: assuming we accept conflict #1 in Promptkit's favour, port `tokens.css` → Tailwind v4 theme + TS constants verbatim, then layer the prompt's *structural* rules (locked button heights, etc.) on top by introducing `--btn-h-md = 40px` style tokens that Promptkit didn't define.

## File map

```
Promptkit.html                  29 lines  entry, Babel-in-browser
src/tokens.css                 298 lines  Verge tokens (fonts/colors/spacing/radii/type/elevation)
src/app.css                    182 lines  global utilities (.btn, .card, .input, .mono-caps, .skeleton)
src/data.js                    224 lines  RESOURCE_TYPES (24), CLIENTS (10), RESOURCES (~50), MODELS (8), DEALS (9), NEWS (8), GUIDES (6), STATS, DEFAULT_STACK
src/components.jsx             480 lines  Icons + 18 primitives
src/chrome.jsx                 146 lines  Header, MobileNav, Footer, StackBanner
src/overlays.jsx               384 lines  StackPicker, CmdK, AuthModal, UpgradeModal, ClaimDealModal, CompareDrawer, CookieBanner
src/pages.jsx                  497 lines  Landing, Home, Directory, Search
src/pages2.jsx               1,168 lines  ResourceDetailPage + 27 type-specific blocks + RightRail + Reviews/Versions/Compat
src/pages3.jsx                 565 lines  ModelDetailPage, CostCalculator, ComparePage
src/pages4.jsx                 464 lines  Deals, News, NewsArticle, Guides, GuideReader, Dashboard, Settings, Submit, NotFound
src/tweaks-panel.jsx           568 lines  Internal dev tool — not for production
src/app.jsx                    133 lines  App shell, hash router, state, modal wiring
tweaks-panel.jsx               568 lines  identical duplicate of src/tweaks-panel.jsx (packaging artifact)
```
