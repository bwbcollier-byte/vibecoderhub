# Vibe Coder Hub — Data Sourcing Plan

> **Where every row in the database comes from, how often it refreshes, and what breaks when each source goes down.**

This plan maps every one of the 27 resource types plus deals, news, and guides to its actual data source. It distinguishes between:

- **Primary feeds** — APIs we read on a schedule
- **Mirrors** — registries we mirror in bulk
- **Scrapers** — sites without APIs, parsed with care
- **Webhooks** — push-based updates (cheaper than polling)
- **Manual editorial** — human-curated content
- **Community submissions** — user-contributed via `/submit`

Every source has a cron cadence, an owner, a fallback, and a degradation strategy.

---

## §1. The four-track data strategy

Don't try to do everything via API. Vibe Coder Hub's data needs split into four tracks with different economics:

**Track A — Real-time, machine-readable (cheap, reliable).** Models, MCPs, components, hardware. Sources have APIs or structured JSON. Update hourly to daily. ~70% of the database lives here.

**Track B — Scraped or RSS'd (medium cost, medium reliability).** News stories from vendor blogs, deal updates, guide source material. Update every 1-6 hours. Builds the "What's New" feed and feeds change events.

**Track C — Editorial (high cost, high quality).** Curated lists, alternatives mappings, "best for" rankings, deal verification, workflow recipes, prompting tips. Updated weekly by a small editorial team (1 person at start). The defensible moat.

**Track D — Community (low cost, high volume).** User submissions, reviews, compatibility reports, prompting tips, forks, stacks. Driven by the `/submit` flow and gated on a 24-hour review SLA for new authors, auto-publish for verified ones.

The mix matters. Pure aggregators (Smithery, OpenRouter) only do Track A and lose to whoever does B+C better. Editorial-only sites (Awesome lists) only do C and miss real-time signal. Vibe Coder Hub wins by being the only site doing all four.

---

## §2. Models — sources and schedule

The single most-visited page on the site needs the most accurate data. Pricing changes daily, benchmarks update weekly, new models drop weekly.

### Primary source: Artificial Analysis API v2

The authoritative source. Their `/api/v2/data/llms/models` endpoint returns full model metadata for 377+ models including:

- Intelligence Index v4.0 (composite of GDPval-AA, τ²-Bench, Terminal-Bench Hard, SciCode, AA-LCR, AA-Omniscience, IFBench, HLE, GPQA Diamond, CritPt)
- Coding Index, Math Index
- Per-benchmark scores (mmlu_pro, gpqa, hle, livecodebench, scicode, math_500, aime)
- Pricing: input, output, cached, blended (3:1 ratio)
- Median tokens/sec, median TTFT, end-to-end response time
- Context window, parameters (total + active)
- Release date, openness index (for open-weights)

**Cost:** API key required. Pricing not public — assume $200-500/month for our volume.
**Cadence:** Every 4 hours. Their data refreshes a few times per day.
**Maps to:** `models`, `model_benchmarks`, populates `resources` parent row.
**Fallback:** If down, we keep serving last cached values. Card stat strip shows "as of [timestamp]".

### Secondary source: OpenRouter Models API

OpenRouter's `/api/v1/models` endpoint lists 400+ models with pricing across providers. Free, no auth required.

**Use:** Provider-availability table (which providers host which models, at what price). This is what makes the `model_providers` table actually populate. Also catches models AA doesn't track yet.
**Cadence:** Every 6 hours.
**Maps to:** `model_providers` table, plus `models` records for anything AA missed.

### Tertiary: First-party provider APIs

For models from Anthropic, OpenAI, Google, Mistral, Cohere, xAI, Groq, Together, Fireworks — hit each provider's own model-list endpoint. Most expose `/v1/models`. Use these to:

- Catch capability flags AA doesn't track (e.g., audio support, computer use)
- Verify pricing matches what providers actually charge
- Pick up beta/preview models before AA indexes them

**Cadence:** Daily. Each provider gets its own scraper task.
**Maps to:** Capability flags on `models`, regional availability.

### For open-weights specifically: HuggingFace Hub API

`huggingface_hub` Python library, or the `/api/models?search={query}` REST endpoint.

**Use:** Pull HF model card, license, downloads count, recommended GGUF/AWQ quantizations. Populates the open-weights detail page blocks.
**Cadence:** Daily for already-tracked models, weekly full search to find new ones.
**Maps to:** `models.huggingface_id`, `models.parameters_billions`, `models.architecture`, `models.recommended_quantization`.

### Pricing history: our own change_events

Every time the AA poller sees a price differ from what's stored, write to `model_price_history` AND `change_events`. The change_events row triggers:

- `news` auto-generated story (if delta > 10%)
- All `alerts` for users watching this model
- The price sparkline on the model detail page

**No external dependency.** Pricing history is built by us, accumulating over time.

### Schedule summary

```
Every 4h    AA API poll        → models, benchmarks, pricing
Every 6h    OpenRouter poll    → model_providers, new models
Daily 02:00 Provider APIs      → capability verification
Daily 03:00 HuggingFace poll   → open-weights metadata
Weekly Sun  HF full search     → discover new open-weights models
```

---

## §3. MCP Servers — sources and schedule

The MCP ecosystem has three competing registries. We mirror all three and deduplicate.

### Primary: Official MCP Registry

`registry.modelcontextprotocol.io` — Anthropic-backed, this is becoming canonical. Has an API (under `/v0/`) and publishes daily snapshots.

**Use:** Source of truth for officially listed MCPs. ~500+ servers at launch, growing.
**Cadence:** Snapshot ingest every 6 hours. Diff against our store to find new/updated.
**Maps to:** `mcps`, parent `resources` row, `mcps.tools` array from server metadata.

### Secondary: Smithery Registry API

`GET https://registry.smithery.ai/servers` with semantic search and filters (`owner:`, `repo:`, `is:deployed`). 7,300+ servers, including local + hosted variants.

**Use:** Broader coverage including hosted servers we wouldn't otherwise see. The Smithery CLI is itself open source — we can mirror its registry index.
**Auth:** API key required for higher rate limits.
**Cadence:** Every 6 hours.
**Maps to:** New `mcps` records, `mcps.install_configs` (Smithery provides per-client install JSON).

### Tertiary: Glama

`glama.ai/mcp/servers` — third aggregator, lighter coverage but catches some not in the other two.

**Cadence:** Daily.

### Deduplication strategy

A canonical MCP is identified by its `source_url` (GitHub repo URL). When the same MCP appears in multiple registries, merge to one `resources` row and store registry-specific install configs in `mcps.install_configs`:

```jsonb
{
  "official": { "command": "npx", "args": ["..."] },
  "smithery_hosted": "https://server.smithery.ai/abc",
  "smithery_local": { "command": "...", ... },
  "cursor_deeplink": "cursor://anysphere.cursor-deeplink/mcp/install?...",
  "claude_desktop": { "mcpServers": { ... } }
}
```

### Tool extraction

For self-hosted (stdio) MCPs we can't inspect remotely. For Smithery-hosted MCPs, hit `https://server.smithery.ai/{id}/.well-known/mcp.json` to get the tool schema. For Official Registry entries, the schema is usually published in the registry record.

**Fallback for stdio MCPs:** Parse the GitHub README for tool descriptions. Imperfect but better than nothing. Mark `mcps.tools` with `source: 'readme_parsed'` so we know which entries to trust less.

### Schedule summary

```
Every 6h    Official Registry → mcps, resources
Every 6h    Smithery API      → mcps, install_configs
Daily       Glama scrape      → mcps backfill
Daily       Tool schema fetch → mcps.tools refresh
Weekly      README re-parse   → stdio-only MCP tools
```

---

## §4. Components — sources and schedule

Components are the most fragmented. Multiple competing registries with no unified API.

### Primary: shadcn/ui official registry

`https://ui.shadcn.com/r/{component}.json` — JSON registry following the shadcn schema. Plus the official directory at `/docs/directory` lists community registries.

**Use:** Ground truth for shadcn-style components.
**Cadence:** Daily.
**Maps to:** `components`, `resources`.

### Secondary: 21st.dev API

21st.dev is the biggest community marketplace (~5K components). They expose a JSON registry per component at `/r/{username}/{slug}` following the shadcn schema. The website itself has a sitemap we can crawl.

**Approach:** Pull their sitemap, queue each component URL, fetch the registry JSON, ingest.
**Cadence:** Daily for known components, weekly sitemap re-crawl to find new ones.
**Maps to:** `components`, with `install_command = "npx shadcn@latest add https://21st.dev/r/{...}"`.

### Tertiary: registry.directory aggregated list

`registry.directory` lists every known shadcn-compatible registry. Use it as a discovery feed — when it shows a new registry, add it to our crawl list.

**Cadence:** Weekly.

### Specific registries to mirror

Each is a JSON registry endpoint we can ingest as-is:

- MagicUI (`magicui.design/r/{component}.json`)
- Aceternity UI
- Origin UI
- AnimateUI
- Tremor
- KokonutUI
- skiper-ui
- shadcn-form-build
- Plus the ~30 others listed on registry.directory

For each: hit the registry index, mirror to our `components` table, store source URL for re-fetch.

### Live previews

The `preview_url` field on `components` should point to a working live demo. Three strategies:

1. **Sandpack-render in-browser** for components that work standalone. Best UX, free.
2. **Iframe to the source registry's preview page** (e.g., `https://21st.dev/preview/...`). Cheap, but breaks if source moves.
3. **Self-hosted preview deployment** on Cloudflare Pages for heavy components. Expensive, only worth it for editor's picks.

Pick strategy 1 by default. Fall back to 2.

### Schedule summary

```
Daily        shadcn registry      → components
Daily        21st.dev sitemap     → components (known)
Weekly Sun   21st.dev full crawl  → discover new
Weekly Mon   registry.directory   → discover new registries
Daily        Each known registry  → refresh components
```

---

## §5. Tools (IDEs, agents, app builders) — sources

Mostly editorial. There's no API for "all AI IDEs." This is Track C.

### Source: editorial + GitHub repos

For open-source tools (Cline, Aider, Continue, Zed, Roo, Cody), pull from their GitHub repos:
- `package.json` for name + description + version
- `README.md` for features
- `/releases` API for version history
- Latest release notes for changelog

For closed-source tools (Cursor, Windsurf, GitHub Copilot, Replit Agent, Lovable, Bolt, v0, Base44, Tempo, Emergent), pull from:
- Vendor pricing page (scraped)
- Vendor changelog page (RSS where available)
- App stores (Mac App Store, Microsoft Store) for download counts where exposed

### Schedule

```
Weekly Mon  Editorial review     → tools (pricing tier updates)
Daily       Vendor changelog RSS → change_events, news
Weekly      GitHub release polls → tools.versions
Monthly     Manual price audit   → tools.pricing_tiers
```

### List to maintain manually

Start with these 22 tools curated. Editorial team adds new entrants weekly:

`Cursor, Claude Code, Windsurf, Cline, Roo, Aider, Continue, Zed, Kiro, Codex, Gemini CLI, Claude Desktop, GitHub Copilot, Cody, Bolt, Lovable, v0, Replit Agent, Base44, Tempo, Emergent, Rosebud`

---

## §6. Skills, Subagents, Rules, Prompts, Commands, Hooks, Specs — sources

The "agent extension" categories. Heavy on community contributions.

### Primary: GitHub search

GitHub has the data. Run targeted searches:

```
# Find SKILL.md files
GET /search/code?q=filename:SKILL.md+language:markdown

# Find agent.md files
GET /search/code?q=filename:agent.md

# Find .cursorrules
GET /search/code?q=filename:.cursorrules

# Find CLAUDE.md
GET /search/code?q=filename:CLAUDE.md

# Find AGENTS.md
GET /search/code?q=filename:AGENTS.md

# Find slash commands
GET /search/code?q=path:.claude/commands+extension:md
```

**Rate limits:** 30 requests/minute authenticated. 10/min unauthenticated. Use an auth token.

**Process:** For each result, parse the file, extract frontmatter, store. Skip files in repos with < 5 stars to filter noise.

**Cadence:** Daily for incremental search (`pushed:>YYYY-MM-DD`), weekly for full re-scan.

### Secondary: cursor.directory

`cursor.directory` — the largest community rules directory. Has a JSON dump at `/api/rules`. Mirror it.

**Cadence:** Daily.
**Maps to:** `rules`.

### Tertiary: buildwithclaude marketplace

`buildwithclaude` is a Claude Code marketplace. Their plugins.json is on GitHub. Mirror it.

**Cadence:** Daily.
**Maps to:** `plugins`, `marketplaces`, all bundled `skills`/`subagents`/`commands`/`hooks`.

### Quaternary: dotcursorrules.com, rules.directory

Smaller registries. Mirror weekly.

### Frontmatter parsing pipeline

Each file type has a known frontmatter schema. Parse it strictly. If frontmatter is missing or malformed, mark the resource as `status = 'draft'` and queue for editorial review rather than auto-publishing garbage.

### Schedule summary

```
Daily        GitHub code search    → skills, subagents, rules, prompts, commands, hooks
Daily        cursor.directory      → rules
Daily        buildwithclaude       → plugins, marketplaces, bundled resources
Weekly Sat   GitHub full re-scan   → catch what daily search missed
Weekly Mon   Stale-content check   → mark unmaintained resources
```

### Quality filter

GitHub search returns millions of files. We can't index all of them. Apply these filters at ingestion:

- Repository has ≥ 5 stars OR resource has ≥ 3 forks OR file is in a curated marketplace
- Frontmatter is valid (parses cleanly)
- Description field is ≥ 20 characters
- File is not in a `.example/` or `/templates/` or `/test/` directory

Approve everything else through `/submit`.

---

## §7. Starters, Showcase, Workflows — sources

Mix of curated and community-submitted.

### Starters: GitHub repo search + editorial

Search GitHub for repos tagged `nextjs-starter`, `saas-starter`, `react-starter`, etc. Filter by:

- Has README mentioning AI IDE compatibility (Cursor, Claude Code, etc.)
- Has `.cursorrules` OR `CLAUDE.md` OR `AGENTS.md`
- ≥ 50 stars

**Auto-import metadata:** README parsing for stack, deploy targets, features. Editorial verifies pricing/cost-to-run.

### Showcase: community submissions + Twitter monitoring

Submitted via `/submit` for builders showcasing their projects. Verified by:

1. URL is reachable
2. Built-with claims spot-checked (e.g., "built with Cursor" — we ask for a screenshot of the project in Cursor)
3. Live URL is HTTPS, loads in <3 seconds

**Discovery:** Watch Twitter for tweets matching `("built with" OR "vibe coded") (cursor OR claude code OR windsurf)`. Editorial team triages weekly.

### Workflows: pure editorial

These are recipes. They take time to write and verify. Editorial team produces 1-2 per week. Outsource generation to vetted contributors paid per published workflow (~$200 each).

### Schedule summary

```
Weekly Mon   GitHub starter search → starters (candidates)
Weekly Tue   Editorial review      → starters (publish)
Daily        /submit queue review  → showcase, all types
Weekly Wed   Twitter showcase scan → showcase candidates
Weekly       Editorial workflow    → workflows (1-2 new per week)
```

---

## §8. Sandboxes, Observability, Backend Kits — sources

Small, slow-changing categories. Editorial primary.

### List to maintain (~50 entries total across the three types)

**Sandboxes:** E2B, Daytona, CodeSandbox, StackBlitz WebContainer, Modal, RunPod, fly.io machines, Replicate, BeamAI, Together compute, Cloudflare Workers/Containers.

**Observability:** Langfuse, Helicone, LangSmith, Braintrust, Weights & Biases (W&B), Datadog LLM Observability, Lunary, PromptLayer, Comet/Opik, Pezzo, Traceloop.

**Backend Kits:** Convex, Supabase, Firebase, Neon, PlanetScale, Better Auth, Clerk, Auth0, WorkOS, Stripe, Lemon Squeezy, Polar, Resend, Loops, Postmark, R2, S3, Cloudflare D1, Upstash.

### Approach

For each entry: editorial creates the row, populates pricing tiers, then maintains via:

- **RSS/changelog** for product updates → feed `change_events`
- **Pricing page scraper** weekly for `pricing_tiers` accuracy
- **GitHub releases poll** for version tracking

**Cadence:**
```
Weekly Mon   Pricing page audit       → backend_kits, observability, sandboxes
Daily        Vendor changelog RSS     → change_events
Daily        GitHub release polls     → version tracking
```

---

## §9. Assets — sources

The asset category covers icons, illustrations, fonts, Lottie, 3D, gradients.

### Source: known asset registries + editorial

**Open-source registries to mirror:**

- Lucide (`lucide.dev/api/icons`)
- Heroicons (`heroicons.com/api`)
- Phosphor Icons
- Tabler Icons
- Iconify (one API, 100+ icon sets)
- Google Fonts API
- Bunny Fonts
- LottieFiles (community API)

**Discovery:** Weekly scan of Awwwards "free assets" + Smashing Magazine releases + Twitter `#freeassets`.

### Schedule

```
Weekly       Asset registry mirror    → assets
Weekly       Editorial discovery scan → assets (candidates)
```

---

## §10. Docs-for-LLMs (llms.txt) — sources

### Primary: Context7

`context7.com` indexes thousands of libraries. They expose `/{library}/llms.txt` and `/{library}/llms-full.txt`. Mirror their index.

**Cadence:** Weekly to discover new libraries. Per-library refresh handled by Context7.

### Secondary: llmstxt.org directory

`llmstxt.org/listing` lists sites that publish their own llms.txt. Crawl it.

**Cadence:** Weekly.

### Tertiary: Direct site crawling

For sites not in either index but on our `must-have` list (Convex, Better Auth, our partner backends), check `{site}/llms.txt` directly weekly.

**Maps to:** `docs_for_llms` table with `coverage` JSONB populated from analyzing the llms.txt content.

---

## §11. Stacks — only user-generated

No external source. Stacks are created by users via the stack picker and stored in `user_stacks`. Public stacks become discoverable via the directory.

**Seeding strategy at launch:** Editorial team creates ~30 starter stacks under a `@vch-curated` account. "Solo SaaS Stack," "Marketing Site Stack," "AI Chatbot Stack," etc. These give early visitors something to adopt.

---

## §12. Scripts — sources

Same as Skills/Rules: GitHub code search for shell, Python, TS scripts in repos tagged `vibe-coding`, `claude-code`, `cursor`, etc.

**Safety filter at ingestion:**
- Static analysis on every script
- Flag scripts that: write outside `~/`, use `sudo`, `curl | bash` patterns, network calls to unknown domains
- Surface flags in the safety review block on the detail page
- Auto-reject scripts that look obviously malicious

---

## §13. Evals — sources

Editorial-only at launch. There are ~30 important benchmarks:

`SWE-Bench Verified, SWE-Bench Multimodal, Terminal-Bench Hard, BrowseComp, GDPval, τ²-Bench, AIDER Polyglot, Aider, HumanEval, BigCodeBench, LiveCodeBench, MMLU-Pro, GPQA Diamond, HLE, IFBench, AIME, MATH-500, CritPt, AA-Omniscience, AA-LCR, GPQA, KLER, RewardBench, Chatbot Arena, MTEB, SciCode, OSWorld, WebArena, BrowserUse-Bench, BrowserGym, Mind2Web, RE-Bench`

For each, populate manually. Pull leaderboard data from the benchmark's own website (mostly HF Spaces). Then auto-refresh via:

- HuggingFace Spaces API for HF-hosted leaderboards
- GitHub for benchmark repos (sample tasks, methodology)
- Twitter for new benchmark releases

**Cadence:**
```
Weekly      HF Spaces leaderboard polls    → model_benchmarks (refresh)
Weekly      Editorial benchmark review     → evals (new entries)
```

---

## §14. Deals — sources

Pure editorial + partnerships. This is the highest-margin part of the product (the Pro tier hook).

### Tier 1 — Public deals (everyone sees)

Public startup programs we can list without partnership:

- AWS Activate ($1K-$100K)
- Microsoft for Startups ($150K)
- Google Cloud for Startups ($200K)
- Anthropic Startup Program ($5K)
- OpenAI Startup ($150K)
- DigitalOcean Hatch ($10K)
- Hetzner startup credits
- Linode (Akamai) for Startups
- Vercel for Startups
- Cloudflare for Startups
- Fly.io free credits
- Supabase startup ($300-$5K)
- Convex startup ($500)
- MongoDB for Startups ($500-$2K)

These get a `deal` record with `tier = 'public'`. ~30 deals total.

### Tier 2 — Member deals (auth required)

Direct relationships with vendors. Cursor 50% off, Windsurf 50% off, Lovable Pro discounts, etc. We negotiate these.

### Tier 3 — Pro deals (paid subscription)

This is FounderPass-style. Exclusive negotiated deals for our Pro members. AWS via reseller, MongoDB via Atlas-for-startups partner, special Linear/Notion/Figma rates. Editorial sales effort.

### Maintenance

- **Weekly** — Audit eligibility (terms change), referral codes (sometimes burn out), expiry dates
- **Daily** — Track `deal_claims` status changes; users self-report
- **Monthly** — New deal acquisition (target 2-3 new deals per month)

### Schedule summary

```
Daily        deal_claims status check  → notifications
Weekly Wed   Eligibility/expiry audit  → deals
Monthly      New deal acquisition      → deals (target 2-3 new)
```

---

## §15. News — sources

Cross-cutting. Three flows:

### Flow A — Auto-generated from change_events

When `change_events` fires with `kind = 'price_change'` and `abs(delta_pct) > 10`, the existing trigger creates a news row. Same for version releases, capability additions, new deals. **Cost: zero.** This produces ~5-15 articles per week.

### Flow B — Editorial vendor blogs (RSS)

Subscribe to RSS feeds from every vendor we track. ~50 feeds:

**Model providers:** Anthropic, OpenAI, Google DeepMind, Mistral, xAI, Cohere, Together AI, Fireworks, Groq, Cerebras
**AI IDE vendors:** Cursor, Anthropic (Claude Code), Codeium (Windsurf), Cline, Continue, Zed, Aider
**Backend:** Convex, Supabase, Firebase, Neon, Better Auth, Clerk, Stripe, Resend, Vercel, Cloudflare, Fly.io
**Infra:** E2B, Modal, Daytona, Langfuse, Helicone, LangSmith
**Community:** Latent Space, Simon Willison, AI Engineer Foundation

**Ingestion:** Poll every 30 min. For each new item: extract title, summary, body, hero image. Match against tracked resources (resource_ids found in body) → populate `news.related_resource_ids`. Editorial reviews queue, publishes ~70% as-is, edits ~30%.

**Auto-publish thresholds:** If source is on a trusted-vendor list AND content has no obvious editorial issues (no marketing fluff, has substance), auto-publish. Else queue for human review.

### Flow C — Original editorial

Long-form pieces from us: deep dives, weekly digests, op-eds. ~1-2 per week, written by editorial team or paid contributors.

### Weekly digest assembly

Tuesday 9am UTC cron runs `fn_generate_weekly_digest()`:
- Top 5 news items by view_count over last 7 days
- Biggest 3 price moves
- Top 1 deal
- 1 editorial highlight
- Subscribers receive via Resend

### Schedule summary

```
Every 30min  RSS poll                  → news (review queue)
Hourly       Auto-publish trusted RSS  → news (published)
Daily 10am   Editorial review batch    → news (publish or kill)
Tuesday 9am  Weekly digest send        → email subscribers
Weekly Mon   Editorial planning        → news (assign 1-2 originals)
```

---

## §16. Guides — sources

### Primary: editorial

Workflow guides are written by the editorial team and paid contributors. The "How to install Qwen 2.5 Coder on macOS" type. Aim for 5 new guides per week initially.

### Secondary: GitHub README extraction

For every resource we ingest, parse its README for an "Installation" section. If present, auto-create a `guide` of `kind = 'install'` with the extracted steps. Mark `is_published = false` until editorial verifies it works.

### Tertiary: community submissions

The `/submit` flow allows users to submit guides for any resource. Verified-author submissions auto-publish; new authors go through review.

### Verification

Every guide has a `last_verified_at` date. If it's > 90 days old, surface a "needs verification" badge on the guide reader. Editorial team picks the most-viewed unverified guides each Monday and runs through them on a clean environment, updating `last_verified_at` and step content as needed.

### Schedule summary

```
On ingest    README parse              → guides (draft)
Daily        Editorial verify queue    → guides (publish)
Weekly Mon   Stale-guide audit         → guides (re-verify)
Weekly       Editorial new guides      → guides (5 per week)
```

---

## §17. Pricing history & benchmark history — strategy

These two need special attention because they're how we beat competitors.

### Pricing history

Every time we observe a price difference for a model, write to `model_price_history` with the new price, timestamp, source. Never overwrite.

**Why:** Builds the 90-day sparkline that no aggregator displays. Lets us send alert emails when a user's tracked model drops 20%. Powers "biggest movers this week" in the news.

### Benchmark history

When AA refreshes a benchmark score, append a new `model_benchmarks` row rather than updating in place. Use `measured_at` as the dedup key.

**Why:** Shows benchmark improvement over time. Detects when a model gets upgraded in place (e.g., "GPT-5.5 quietly improved on SWE-Bench from 71.4 to 73.2").

---

## §18. Telemetry → real-world performance

This is unique to us. No competitor has it.

### Sources

1. **Install events** — every `install_events` row gives us "X people installed this in the last 7 days, mostly from Cursor users."

2. **Gateway invocations** — every `gateway_invocations` row gives us "average tokens/session, average cost/session, success rate per resource per client."

3. **Guide completions** — every `guide_completions` row gives us "78% of users finished this guide; step 7 is where they get stuck."

### Aggregation

Nightly cron rolls up raw events into denormalized aggregates on `resources` (`install_count_7d`, `health_score`, etc.) and creates `model_benchmarks` rows for the "real-world vibe coding performance" block.

### Privacy

- Hash IPs (sha256 + salt) before storing
- Aggregates require ≥ 10 unique users before publishing (k-anonymity)
- Users can opt out via settings
- We never expose individual user installs to other users

---

## §19. The data pipeline architecture

How all this orchestrates in practice.

### Stack

- **Workers:** Trigger.dev for scheduled jobs (cron-friendly, retries built in, good observability) or Inngest as an alternative
- **Queue:** Postgres + pg_cron for simple jobs, BullMQ on Upstash Redis for bursty work
- **Storage:** raw JSON dumps to S3/R2 before parsing — gives us audit trail and ability to re-process
- **Parser:** TypeScript scripts running on Cloudflare Workers (cheap, fast) or Vercel Cron (simpler)
- **Embeddings:** OpenAI `text-embedding-3-small` (cheap) for `resources.embedding`, run on insert/update

### Flow per source

```
Schedule fires
     ↓
Worker fetches API/scrapes
     ↓
Raw response stored to R2 (audit trail)
     ↓
Parser extracts structured data
     ↓
Upsert into staging table
     ↓
Diff vs production resources
     ↓
On change → write change_events row
     ↓
Trigger fires: notify alerts, generate news, refresh denorm counters
     ↓
Done
```

### Failure modes

Every source has a `last_successful_run_at` timestamp. If a source hasn't succeeded in 24h, alert the team via Slack. If a source has been failing for 7 days, surface "Source: stale" on the resource detail page so users know.

### Rate limit budgets

```
GitHub API:        5,000 req/hr authenticated → 30 req/min comfortable budget
OpenRouter:        Unlimited /models endpoint  → poll every 5 min if needed
Artificial Analysis: per their plan            → 4-hourly is conservative
Smithery:          5,000 req/hr with key       → every 6h leaves headroom
HuggingFace:       1,000 req/hr unauth         → 30 req/min when scanning
```

### Cost estimate at launch scale

For a database of ~15K resources at launch growing to ~50K in year one:

```
Trigger.dev / Inngest scheduled jobs:    $20-40/mo (free tier covers MVP)
Cloudflare R2 raw-dump storage:          $5-15/mo (~500GB)
OpenAI embeddings (text-embedding-3-small): $20-50/mo
Postgres (Supabase Pro):                  $25/mo (already paying)
RSS aggregator service (optional):        $0 (build own with feedparser)
Artificial Analysis API:                  $200-500/mo (estimate)
GitHub API token:                         free
Smithery API:                             free tier likely sufficient
HuggingFace:                              free
                                         ─────────
TOTAL:                                    ~$270-630/mo at launch
```

The Artificial Analysis subscription is the biggest line item but it's the most defensible source. Cheap to operate overall.

---

## §20. Bootstrap order — what to do in week 1

If you're starting from zero, this is the sequence.

### Day 1-2: Foundation

- Set up Supabase with schema
- Provision Cloudflare R2 bucket for raw dumps
- Set up Trigger.dev account, GitHub auth token, Artificial Analysis API key

### Day 3-4: Models pipeline (highest user value)

- Ship AA API poller → seeds ~377 models
- Ship OpenRouter poller → enriches model_providers
- Ship pricing-history writer + change_events trigger
- Verify model detail page renders with real data

### Day 5-6: MCPs pipeline

- Ship Official MCP Registry mirror → seeds ~500 MCPs
- Ship Smithery API mirror → seeds 7,000+ MCPs
- Dedupe by source_url
- Verify MCP detail page renders

### Day 7-8: Components pipeline

- Ship shadcn registry mirror → seeds ~50 official
- Ship 21st.dev sitemap crawler → seeds ~5K community
- Verify component detail page renders with live Sandpack

### Day 9-10: Tools, deals, news seed

- Editorial: manually create 22 tools rows
- Editorial: manually create 30 public deals
- Set up 50 RSS feeds, point to news ingestion queue

### Day 11-14: Everything else + editorial review

- GitHub code search for skills, subagents, rules, prompts, commands, hooks → seeds ~5K resources
- Editorial review queue cleanup
- Set up the 4-hourly / 6-hourly / daily cron schedules
- Launch with ~15K resources

### Week 2+: maintenance mode

- Monitor source health daily
- Run editorial planning meetings weekly
- Track new ecosystem players and add sources as they emerge

---

## §21. Editorial team — what one person does

For solo founders, a realistic week-1-of-month for one editorial person:

```
Monday      Stale-guide audit + new guide planning (5h)
Tuesday     Pricing audit + deal eligibility check (3h)
Wednesday   New deal acquisition outreach (4h)
Thursday    /submit queue review (3h) + news editorial review (2h)
Friday      Weekly digest finalization + content planning (3h)
```

Roughly 20 hours/week. Augment with vetted paid contributors for:

- Workflow recipes ($200 per published recipe)
- Long-form news pieces ($300 per piece)
- Guide writing for specific stacks ($150 per guide)

Cost: ~$2,000-4,000/month in contributor pay at launch scale.

---

## §22. Defensibility — why this data is hard to copy

Worth being explicit about, because anyone could call OpenRouter's `/models` API:

1. **Multi-source dedup** — we mirror 3 MCP registries, 5+ component registries, every model provider. Building the dedup logic right takes weeks of edge cases.

2. **Pricing history accumulates** — competitor starts today, has 0 days of history. We started 6 months ago, have 180 days of price sparklines.

3. **Real-world telemetry is exclusive** — `gateway_invocations` data exists only for our users. Nobody else can show "Cursor users average $0.41/session on Opus 4.7."

4. **Editorial curation is rate-limited by people, not money** — Best-for tables, alternatives mappings, prompting tips. Takes time. Compounds.

5. **Community submissions create a moat** — once forks/comments/reviews live on our domain, users come back. Mirrored sites can't take that.

6. **The 27 types are the breadth bet** — Smithery only does MCPs. cursor.directory only does rules. We index everything; the search graph is more valuable than any single category.

---

## §23. What can go wrong

Common failure modes and how to handle them.

**Artificial Analysis raises prices or shuts off our access.** We've built model_providers from OpenRouter as a backup; we'd lose some intelligence-rank precision but pricing/capabilities stay accurate.

**A major MCP registry shuts down (Smithery, Glama).** We have three sources; losing one degrades but doesn't kill us. The Official Registry is most important to keep.

**GitHub rate-limits us during a search burst.** Authenticated tokens give 5K/hr. If we hit it, we slow scanners and serve stale data for a few hours.

**A vendor blocks our user agent on scraping.** Most don't. If one does, fall back to RSS or accept staleness for that vendor.

**Spam in /submit.** Auto-reject obvious garbage. Manual review queue for borderline. Verified-author flag bypasses review.

**Editorial bandwidth maxes out.** Outsource to paid contributors. Don't reduce quality bar; reduce velocity.

**One of the source APIs starts charging.** AA, Smithery — both could pivot. Budget for ~$1K/month in unforeseen API costs.

---

## §24. Checklist before launch

```
[ ] Schema deployed in Supabase
[ ] Trigger.dev / Inngest workspace set up
[ ] R2 bucket created for raw dumps
[ ] Artificial Analysis API key obtained
[ ] Smithery API key obtained
[ ] GitHub token created (read-only, no scope creep)
[ ] OpenAI key for embeddings
[ ] Resend account for newsletter
[ ] 8 ingestion workers shipped (models, mcps, components, rules, skills, news_rss, deals_audit, telemetry_rollup)
[ ] First seed run completed (15K+ resources)
[ ] First editorial pass complete (deals tier, tools list, starter stacks)
[ ] Source health monitoring dashboard live
[ ] Slack alerts wired for failed sources
[ ] Privacy policy mentions data sources we ingest
```

---

## §25. The single most important rule

**Never ship a data source without an `updated_at` and a publicly-visible "as of" timestamp on the front-end.**

Stale pricing = lost trust. Show users when data was last refreshed. If it's > 24h on a fast-moving field, surface that. Honesty about freshness is the difference between a credible directory and a vibe-coded weekend project.
