# Vibe Coder Hub — Master Plan & Checklist

> The complete 12-month build sequence. Every item from the original spec and all 90 deep-dive items, dated and checkboxed. Group items by phase. Each item has: owner role (Eng / Ed / BD / You), effort estimate, dependencies, success metric.

**Roles**
- **Eng** — engineering (you or contractor)
- **Ed** — editorial (you, Claude agents, or contracted editor)
- **BD** — business development / partnerships (you or contractor)
- **You** — strategic / founder-only decisions
- **Agent** — Claude agent does the work (with human review)

**Effort key**: `1h` `1d` `3d` `1w` `2w` `1mo` `Q` `Y`

---

## Phase 0 — Pre-launch (Weeks -4 to 0)

This is the foundation. Skip nothing in this phase.

### Foundation infrastructure

- [ ] **Provision Supabase project** (Pro tier, $25/mo) — *Eng, 1d*
- [ ] **Run the schema migration** (`vibe-coder-hub-schema.sql`) — *Eng, 1h*
- [ ] **Enable extensions**: `pgvector`, `pg_cron`, `uuid-ossp` — *Eng, 1h*
- [ ] **Set up GitHub repo** with branch protection + CI — *Eng, 1d*
- [ ] **Configure Vercel deployment** for Next.js 15 app — *Eng, 1d*
- [ ] **Provision Cloudflare R2 bucket** for raw-dump storage (you already have this) — *Eng, 1h*
- [ ] **Configure Resend** for transactional email — *Eng, 1h*
- [ ] **Create environment variable management** (Vercel envs + GitHub secrets) — *Eng, 1d*
- [ ] **Set up error tracking** (Sentry free tier) — *Eng, 1h*
- [ ] **Set up analytics** (Plausible $9/mo or PostHog self-hosted) — *Eng, 1d*

### Auth + minimum data model

- [ ] **Implement GitHub OAuth** via Supabase Auth — *Eng, 1d*
- [ ] **Build /signup, /signin, /signout flows** — *Eng, 1d*
- [ ] **Build profile creation + edit page** — *Eng, 1d*
- [ ] **Seed `use_cases` table** (12 starting use cases from schema) — *Eng, 1h*
- [ ] **Seed 10 stack-picker presets** — *Ed, 1d*

### Brand + design system

- [ ] **Finalize brand name & domain** (vibecoderhub.com) — *You, 1d*
- [ ] **Buy domain + secondary domains** (vibecoder.dev, vchub.dev) — *You, 1h*
- [ ] **Set up logo + brand kit** (use Claude for design system .md) — *You + Agent, 1d*
- [ ] **Implement Tailwind v4 + shadcn customised** per design prompt — *Eng, 3d*
- [ ] **Build top-nav with mega-menu** for 27 resource types — *Eng, 2d*
- [ ] **Build the generic detail-page chassis** — *Eng, 3d*
- [ ] **Build Cmd-K palette skeleton** — *Eng, 2d*

### First data ingestion: Track A (Real-time APIs)

- [ ] **Source 1 (original sourcing plan): OpenRouter `/api/v1/models`** — *Eng, 1d*
- [ ] **Source 2: shadcn registry sync** — *Eng, 1d*
- [ ] **Source 3: 21st.dev sitemap crawl** — *Eng, 1d*
- [ ] **Source 4: MCP Official Registry** — *Eng, 1d*
- [ ] **Source 5: Smithery API mirror** — *Eng, 1d*
- [ ] **Source 6 (deep-dive #1): `quemsah/awesome-claude-plugins`** — *Eng, 1d*
- [ ] **Source 7 (deep-dive #2): `VoltAgent/awesome-agent-skills`** — *Eng, 1d*

### GitHub Actions infrastructure

- [ ] **Set up 7 cron workflows** for above sources (`.github/workflows/*.yml`) — *Eng, 1d*
- [ ] **Set up Slack notifications** on workflow failure — *Eng, 1h*
- [ ] **Set up secrets in GitHub** (Supabase service key, R2, etc.) — *Eng, 1h*
- [ ] **Verify first run succeeded for all 7 sources** — *Eng, 1d*

### Editorial seed content

- [ ] **Write `AGENT.md` for Workflow Author personality** — *You + Agent, 1d*
- [ ] **Write `AGENT.md` for News Editor personality** — *You + Agent, 1d*
- [ ] **Write `AGENT.md` for Guide Writer personality** — *You + Agent, 1d*
- [ ] **Write `AGENT.md` for Reviewer (QA pass) personality** — *You + Agent, 1d*
- [ ] **Seed 10 evergreen guides** — *Agent + You review, 1w*
- [ ] **Write the first newsletter issue** (manual, sets the voice) — *You, 1d*

### Phase 0 success criteria
- [ ] At least 5,000 resources in the database
- [ ] 7 ingestion jobs running daily without errors
- [ ] Site deployed to staging, full nav works
- [ ] 10 guides published
- [ ] Newsletter list set up, first issue ready to send
- [ ] Brand visual identity locked

---

## Phase 1 — Launch (Weeks 1-4 / Month 1)

Launch the directory publicly. Focus: shipping the core experience that turns visitors into bookmarkers into Pro subscribers.

### Week 1

- [ ] **Build /resources index page** (filterable, sortable, paginated) — *Eng, 3d*
- [ ] **Build /models index page** (with the model card from spec) — *Eng, 3d*
- [ ] **Build /mcps index page** — *Eng, 2d*
- [ ] **Build generic detail page rendering** for components, MCPs, models — *Eng, 3d*
- [ ] **Add OpenRouter + LMArena Elo to model detail pages** — *Eng, 1d*
- [ ] **Implement search (postgres tsvector first, pgvector later)** — *Eng, 2d*
- [ ] **Source 8 (original): GitHub code search for skills** — *Eng, 1d*
- [ ] **Source 9 (original): cursor.directory + buildwithclaude scrape** — *Eng, 1d*

### Week 2

- [ ] **Build /skills, /subagents, /rules, /plugins, /commands, /hooks index pages** — *Eng, 1w*
- [ ] **Build detail pages for top 6 types** per detail-pages spec — *Eng, 1w*
- [ ] **Build the Stack Picker modal** — *Eng, 2d*
- [ ] **Build user_stack creation + management** — *Eng, 2d*
- [ ] **Source 10 (deep-dive #11): arXiv API + awesome-ai-agent-papers** — *Eng, 1d*
- [ ] **Source 11 (deep-dive #6): Product Hunt RSS** — *Eng, 1d*

### Week 3

- [ ] **Build /news landing page** with auto-generated items from `change_events` — *Eng, 2d*
- [ ] **Build /deals landing page** with 3-tier reveal pattern — *Eng, 2d*
- [ ] **Build /guides reader page** — *Eng, 2d*
- [ ] **Build /showcase index page** — *Eng, 2d*
- [ ] **Build bookmarks + collections UX** — *Eng, 2d*
- [ ] **Source 12 (deep-dive #12): GitHub stargazer velocity** — *Eng, 1d*
- [ ] **Source 13 (deep-dive #7): Hacker News Algolia API** — *Eng, 1d*

### Week 4 — public launch

- [ ] **Build /best-for/[use-case] SEO pages** for top 12 use cases — *Eng, 2d*
- [ ] **Build /compare drawer** (2-4 resource comparison) — *Eng, 2d*
- [ ] **Build the "Adopt this stack" mechanic** — *Eng, 2d*
- [ ] **Implement Pro upgrade flow** (Stripe) — *Eng, 2d*
- [ ] **Build settings + dashboard** — *Eng, 2d*
- [ ] **Idea 1 (deep-dive): "Used by these projects" reverse lookup** — *Eng, 4h*
- [ ] **Idea 9 (deep-dive): real-time /firehose endpoint** — *Eng, 1d*
- [ ] **Idea 19 (deep-dive R2): public roadmap + changelog** — *Eng, 1d*
- [ ] **Plan 14 (deep-dive R2): launch the automated Pulse newsletter** — *Eng, 3d*
- [ ] **Submit to Hacker News, Product Hunt, relevant subs** — *You, 1d*
- [ ] **Announce on Twitter / X + Discord communities** — *You, 1d*

### Phase 1 success criteria
- [ ] Public site live with 27 resource types showing data
- [ ] 10,000+ resources in database from 13 sources
- [ ] 1,000+ unique visitors in launch week
- [ ] First 10 Pro subscribers
- [ ] Newsletter list crosses 500 subscribers
- [ ] First user-submitted resource

---

## Phase 2 — Compound (Months 2-3)

Launch is done. Now compound: more sources, more content, more features that drive depth.

### Month 2

#### Sources
- [ ] **Source: GHArchive on BigQuery** (deep-dive #13) — *Eng, 2d*
- [ ] **Source: HuggingFace datasets API** (deep-dive #14) — *Eng, 1d*
- [ ] **Source: Stack Overflow Data Explorer** (deep-dive #15) — *Eng, 1d*
- [ ] **Source: Discord widget endpoints** (deep-dive #16) — *Eng, 1d*
- [ ] **Source: Crunchbase funding RSS** (deep-dive #17) — *Eng, 1d*
- [ ] **Source: npm/PyPI downloads** (deep-dive #8) — *Eng, 1d*
- [ ] **Source: Reddit JSON endpoints** (deep-dive #9) — *Eng, 1d*

#### Features
- [ ] **Build the next 6 detail page types** (Skills/Subagents/Rules/Plugins/Hooks/Starters) per spec — *Eng, 2w*
- [ ] **Idea 3 (deep-dive): personalised weekly release notes (Pro)** — *Eng, 1d*
- [ ] **Idea 13 (deep-dive R2): stack quality score** — *Eng, 5d*
- [ ] **Idea 18 (deep-dive R2): "viewed this also viewed" heatmap** — *Eng, 1d*
- [ ] **Idea 15 (deep-dive R2): migrate-from-X-to-Y guides for top 6 tools** — *Eng, 5d*

#### Editorial
- [ ] **Publish 8 new guides** — *Agent + Ed, ongoing*
- [ ] **Launch monthly "VCH Index" report** (deep-dive plan #2) — *Ed, 1w*
- [ ] **Launch MCP Pulse weekly newsletter** (deep-dive plan #4) — *Ed, 4hrs/wk*

#### Operations
- [ ] **Reach out to first 5 awesome-list maintainers** (deep-dive plan #12) — *BD, 1w*
- [ ] **Identify first 10 sponsor candidates** (deep-dive plan #5) — *BD, 3d*
- [ ] **Reach out to first 3 awesome-claude-* maintainers** — *BD, 2d*

### Month 3

#### Sources
- [ ] **Source: YouTube Data API for tutorial volume** (deep-dive #10) — *Eng, 2d*
- [ ] **Source: Wayback Machine for pricing history** (deep-dive #18) — *Eng, 2d*
- [ ] **Source: GitHub code search for CLAUDE.md/.cursorrules** (deep-dive #19) — *Eng, 1d*
- [ ] **Source: Status-page aggregators** (deep-dive #20) — *Eng, 2d*
- [ ] **Source: AGENTS.md adoption survey** (deep-dive R3 #22) — *Eng, 2d*

#### Features
- [ ] **Build the next 8 detail page types** per spec — *Eng, 2w*
- [ ] **Idea 14 (deep-dive R2): in-browser MCP Tool Inspector** — *Eng, 1w*
- [ ] **Idea 16 (deep-dive R2): Sandpack live sandboxes** (top 5 types) — *Eng, 1w*
- [ ] **Idea 22 (deep-dive R3): custom personal feeds** — *Eng, 1w*
- [ ] **Plan: launch /design-systems library** (deep-dive plan #1) — *Eng + Ed, 3d*

#### Editorial
- [ ] **Publish 8 more guides** — *Agent + Ed, ongoing*
- [ ] **2nd monthly Index report** — *Ed, 1w*

#### Operations
- [ ] **Sign first 3 sponsors** — *BD, ongoing*
- [ ] **Set up affiliate revenue with 5 deal partners** (deep-dive plan #6) — *BD, 1w*
- [ ] **Define VCH Certified partner program criteria** (deep-dive R2 plan #13) — *You + BD, 3d*

### Phase 2 success criteria
- [ ] 30,000+ resources tracked
- [ ] 20+ detail page types complete
- [ ] 100+ Pro subscribers
- [ ] Newsletter list crosses 2,500
- [ ] First $1K MRR from sponsors + Pro
- [ ] 5 awesome-list inbound links secured

---

## Phase 3 — Authority (Months 4-6)

Phase 2 made the directory comprehensive. Phase 3 makes it authoritative — original research, certified partnerships, the CLI launch.

### Month 4

#### Sources
- [ ] **Source: Cloudflare/Vercel/Supabase reports** (deep-dive R3 #23) — *Eng, 1d*
- [ ] **Source: Translated docs trackers (i18n)** (deep-dive R3 #25) — *Eng, 1w*
- [ ] **Source: USPTO/EPO patent filings** (deep-dive R3 #27) — *Eng, 2d*
- [ ] **Source: Job postings analysis** (deep-dive R3 #28) — *Eng, 2d*

#### Features — the CLI launch
- [ ] **Build `vchctl` CLI v1** (deep-dive R3 idea #21) — *Eng, 2w*
  - [ ] `vchctl init`
  - [ ] `vchctl add <resource>`
  - [ ] `vchctl install <resource-id>` (cross-platform from Idea #25)
  - [ ] `vchctl audit`
  - [ ] `vchctl sync`
- [ ] **Set up opt-in telemetry receiver** (Cloudflare Worker) — *Eng, 3d*
- [ ] **Publish privacy policy + telemetry transparency page** — *You + Ed, 1d*

#### Editorial
- [ ] **Begin first Quarterly Survey** (deep-dive R2 plan #11) — *Ed, 3wk runtime*
- [ ] **Launch first "Consumer Reports" independent review** of Cursor (deep-dive R3 plan #28) — *Ed, 1w*

#### Operations
- [ ] **Launch VCH Certified partner program** (deep-dive R2 plan #13) — *BD, 1w*
- [ ] **Sign first 5 certified partners** — *BD, ongoing*
- [ ] **Macro-creator partnership outreach** (deep-dive R3 plan #23) — *BD, 1w*

### Month 5

#### Sources
- [ ] **Source: Conference talk transcripts** (deep-dive R3 #26) — *Eng, 1w*
- [ ] **Source: VC portfolio tracking** (deep-dive R3 #29) — *Eng, 2d*
- [ ] **Source: University/research-lab repos** (deep-dive R3 #30) — *Eng, 2d*

#### Features
- [ ] **Idea: one-shot scaffold agent (Pro)** (deep-dive R2 #14) — *Eng + Agent, 2w*
- [ ] **Idea: stack rental marketplace** (deep-dive R3 #28) — *Eng, 3d*
- [ ] **Idea: "Compare with Claude" agent chat** (deep-dive R3 #27) — *Eng + Agent, 1w*
- [ ] **Idea: live status indicators** (deep-dive R3 #29) — *Eng, 3d*

#### Editorial
- [ ] **Publish first Quarterly Survey results** — *Ed, 1w*
- [ ] **Publish first set of translated guides** (JA + CN) — *Ed + Agent, 2w*
- [ ] **Begin annual State of Vibe Coding report prep** (deep-dive R3 plan #24) — *Ed, ongoing*

#### Operations
- [ ] **Sign first macro-creator partnership** — *BD, ongoing*
- [ ] **Define industry vertical strategy** (deep-dive R3 plan #26) — *You + BD, 3d*
- [ ] **Reach out to first university/bootcamp partner** (deep-dive R3 plan #25) — *BD, 1w*

### Month 6

#### Sources
- [ ] **Source: vibe-coding platform output galleries** (deep-dive R3 #21) — *Eng, 1w*

#### Features
- [ ] **Idea: "what-if" stack simulator** (deep-dive R3 #30) — *Eng, 1w*
- [ ] **Idea: achievement system + leaderboard** (deep-dive R3 #23) — *Eng, 5d*
- [ ] **Idea: affiliate-link manager for creators** (deep-dive R3 #26) — *Eng, 1w*
- [ ] **Idea: browser-side API key vault** (deep-dive R2 #20) — *Eng, 1w*
- [ ] **Idea: embeddable comparison widget** (deep-dive R2 #12) — *Eng, 1w*

#### Editorial
- [ ] **Launch first industry vertical landing page (`/fintech`)** — *Eng + Ed, 1w*
- [ ] **Half-year recap newsletter** — *Ed, 2d*

#### Operations
- [ ] **VCH Certified milestone: 10 partners** — *BD*
- [ ] **Sponsor revenue milestone: $5K/mo** — *BD*
- [ ] **First enterprise white-label conversation** (deep-dive R2 plan #19) — *BD*

### Phase 3 success criteria
- [ ] **40,000+ resources tracked**
- [ ] **All 27 detail page types complete**
- [ ] **vchctl CLI shipped with 500+ daily users**
- [ ] **300+ Pro subscribers**
- [ ] **Newsletter list crosses 8,000**
- [ ] **$10K+ MRR**
- [ ] **10 certified partners**
- [ ] **First quarterly survey published with 1,000+ respondents**

---

## Phase 4 — Institution (Months 7-9)

The directory is the canonical reference. Phase 4 builds the institutions around it: research, capital, standards, education.

### Month 7

- [ ] **Plan: launch industry verticals 2-4** (`/healthcare`, `/gamedev`, `/edtech`) — *Eng + Ed, 1w each*
- [ ] **Plan: 10 definitive guides — first 3 published** (deep-dive R2 plan #20) — *Ed + Agent, 1mo*
- [ ] **Plan: open-source the directory schema + scrapers** (deep-dive R2 plan #15) — *Eng, 1w*
- [ ] **Plan: launch educational partnerships pilot** (deep-dive R3 plan #25) — *BD, ongoing*
- [ ] **Idea: cross-platform install with VCH** (formal launch, deep-dive R3 #25) — *Eng, 1w*

### Month 8

- [ ] **Plan: kick off State of Vibe Coding annual report** — *Ed, 2mo lead*
- [ ] **Plan: define awards categories** (deep-dive R1 plan #10 + R3 plan #29) — *You + Ed, 1w*
- [ ] **Plan: conference planning kickoff** (target: December) — *You + BD, 1mo*
- [ ] **Idea: "Resource of the day" homepage rotation** — *Eng, 2d*
- [ ] **Idea: "Build with AI" coaching mode (Pro)** (deep-dive R2 #17) — *Eng + Agent, 1w*

### Month 9

- [ ] **Sources: Quarterly survey #2 runs** — *Ed, 3wk*
- [ ] **Plan: launch fund / accelerator concept** (deep-dive R3 plan #27) — *You, 1mo*
- [ ] **Plan: standardisation initiative kickoff** (deep-dive R3 plan #30) — *You + BD, 1mo*
- [ ] **Plan: open ecosystem fund — first 2 investments** — *You, 2mo*

### Phase 4 success criteria
- [ ] 4 industry verticals launched
- [ ] 600+ Pro subscribers
- [ ] $20K+ MRR
- [ ] Newsletter list crosses 15,000
- [ ] First annual report production underway
- [ ] First standardisation RFC published
- [ ] 2 ecosystem fund investments closed
- [ ] First university partnership signed

---

## Phase 5 — Defining (Months 10-12)

The directory now defines the category. Phase 5 builds the moats that compound for years.

### Month 10

- [ ] **Conference final preparation** — *BD + Ed, 1mo*
- [ ] **State of Vibe Coding 2026 report finalisation** — *Ed, 3wk*
- [ ] **Awards voting opens** — *BD, 2wk*
- [ ] **Definitive guides 4-6 published** — *Ed + Agent*

### Month 11

- [ ] **Awards voting closes; results decided** — *BD + You*
- [ ] **State of Vibe Coding 2026 — public release** — *Ed + You*
- [ ] **Press push for annual report** — *BD, 2wk*
- [ ] **Conference promotion week** — *BD, 1wk*

### Month 12 — Annual peak

- [ ] **Run inaugural Vibe Coder Conference** (Plan 10) — *3d event*
- [ ] **Best of Vibe Coding 2026 Awards ceremony** at conference — *You*
- [ ] **OSS Contributor Stipends announced** (deep-dive R3 plan #29) — *You*
- [ ] **Year-end retrospective + year 2 planning** — *You, 1w*
- [ ] **Definitive guides 7-10 published** — *Ed + Agent*

### Phase 5 success criteria
- [ ] **First annual Vibe Coder Conference executed** (target: 500+ attendees)
- [ ] **State of Vibe Coding 2026 published with major press coverage**
- [ ] **1,000+ Pro subscribers**
- [ ] **$50K+ MRR** (Pro + sponsors + partners + enterprise + affiliate)
- [ ] **20+ certified partners**
- [ ] **3+ enterprise white-label deals signed**
- [ ] **Newsletter list crosses 25,000**
- [ ] **2 universities + 2 bootcamps in pipeline programs**
- [ ] **10 definitive guides published, ranking #1-3 for target keywords**
- [ ] **First standardisation RFC adopted by 2+ ecosystem vendors**

---

## Cross-cutting workstreams (always-on)

These don't fit neatly in phases — they run continuously.

### Editorial cadence

- [ ] **Weekly editorial newsletter** — *Ed, every Monday*
- [ ] **Automated Pulse newsletter** — *Eng cron, every Sunday*
- [ ] **MCP Pulse weekly** — *Ed, every Tuesday*
- [ ] **2-3 new guides per month** — *Ed + Agent*
- [ ] **1 independent product review per week** — *Ed*
- [ ] **Monthly Index report** — *Ed, 1st of month*

### Community

- [ ] **Discord moderation + engagement** — *You + community lead*
- [ ] **Weekly Twitter Spaces office hours** — *You, Fridays*
- [ ] **Reddit / HN engagement** — *You + Ed, ongoing*
- [ ] **Submission queue review** — *Ed + Agent + You, daily*

### Data quality

- [ ] **Daily health-check dashboard review** — *Eng, 5min*
- [ ] **Weekly schema migration review** — *Eng*
- [ ] **Monthly resource deprecation review** — *Ed*
- [ ] **Quarterly stale-content audit** — *Ed*

### Revenue ops

- [ ] **Monthly sponsor renewal check** — *BD*
- [ ] **Monthly certified-partner check-ins** — *BD*
- [ ] **Quarterly enterprise customer reviews** — *BD + You*
- [ ] **Monthly affiliate revenue payout** — *Eng + BD*

---

## KPI tracking — what to measure every week

Track these in a simple Notion dashboard or Supabase view:

```
WEEKLY SCORECARD                    MONTH 1   MONTH 3   MONTH 6   MONTH 12
─────────────────────────────────────────────────────────────────────────
Resources tracked                   10K       30K       40K       60K
Daily active visitors               300       2K        6K        20K
Unique weekly visitors              1.5K      8K        25K       80K
Newsletter subscribers              500       2.5K      8K        25K
Pro subscribers                     10        100       300       1000
MRR                                 $100      $1K       $10K      $50K
Sponsor MRR                         $0        $500      $5K       $15K
Certified partner MRR               $0        $0        $3K       $15K
Enterprise white-label MRR          $0        $0        $0        $10K
Affiliate revenue MRR               $0        $200      $1K       $5K
CLI daily active                    -         -         500       5K
Definitive guides ranking #1-3      0         0         3         10
Awesome-list inbound links          0         5         15        30+
Certified partners signed           0         3         10        20+
Press mentions / citations          0         5         20        100+
```

---

## Risk register

The plan is ambitious. These are the things most likely to go wrong, with mitigations.

### Risk: Ingestion source breakage
**Likelihood:** High. APIs change, sites add rate limits, scrapers fail.
**Mitigation:** Monitoring dashboard. GHA Slack alerts. Per-source retry + fallback. Weekly source-health review.

### Risk: Editorial output quality drift
**Likelihood:** Medium. Agent output can become formulaic.
**Mitigation:** Reviewer agent + human editor-in-chief. Quarterly voice audit. Mix human + agent content.

### Risk: Slow Pro conversion
**Likelihood:** Medium. Hard to predict adoption.
**Mitigation:** Multiple revenue streams (sponsor, affiliate, certified, enterprise) reduce reliance on Pro alone. Test pricing in month 3, adjust.

### Risk: Competitor moves
**Likelihood:** High. Cursor.directory, buildwithclaude, etc. could expand.
**Mitigation:** Move faster. Acquire (Plan 17). Build moats (CLI, original research, standards) that take >6 months to copy.

### Risk: Vendor dependence (Anthropic, Cursor, etc.)
**Likelihood:** Low. Reputation-grade institutions usually engage positively with independent directories.
**Mitigation:** Maintain editorial independence, attribution, fact-checking. Build relationships before they're needed.

### Risk: Conference fails / doesn't break even year 1
**Likelihood:** Medium.
**Mitigation:** Virtual format Year 1 (lower cost). Frame as "first annual" — Year 1 is for proof, Year 2 for ROI.

### Risk: Burnout
**Likelihood:** High. This is a 12-month sprint.
**Mitigation:** Hire help by month 3 (editorial), month 6 (BD). Use agents aggressively. Take quarterly weeks off.

---

## Hiring milestones

The plan is solo-feasible for the first 3 months. After that:

- **Month 3:** Part-time editorial reviewer ($1-2K/mo)
- **Month 6:** Part-time business development / partnerships ($2-4K/mo)
- **Month 9:** Full-time engineer (you + 1 = leverage)
- **Month 12:** Editor-in-chief (could be a contractor)

By end of year 1: team of 3-4. Revenue supports it.

---

## What success looks like at month 12

- **Brand**: "Vibe Coder Hub" is the canonical reference for the AI coding ecosystem
- **Traffic**: 80K+ unique weekly visitors. SEO-driven, compounding monthly.
- **Revenue**: $50-75K MRR across 5+ streams. Profitable.
- **Product**: 27 resource types covered. 60K resources. The CLI is daily-driver for 5K developers.
- **Editorial**: Multiple newsletters totalling 25K subscribers. Monthly Index, weekly Pulse, annual State-of-the-Ecosystem report — all citable.
- **Ecosystem**: 20+ certified partners. 5+ enterprise customers. 2+ ecosystem fund investments.
- **Authority**: First standardisation RFC adopted. Annual conference + awards launched. Featured in HN front-page, TechCrunch, podcasts.

This is no longer a side project. It's the canonical institution of the AI coding ecosystem.

---

## Immediate next steps (the first 14 days)

If you're ready to start tomorrow:

**Day 1-2:** Set up Supabase, GitHub, Vercel. Run the schema. Lock the brand.

**Day 3-5:** Build auth + minimum nav. Wire up first 3 sources (OpenRouter, shadcn, Smithery).

**Day 6-8:** Build /models and /mcps index pages. First content alive.

**Day 9-11:** Write first agent personality files. Generate first 5 guides.

**Day 12-14:** Polish, then soft-launch to a private list of 50 people for feedback before public launch.

Ship the rest from there, phase by phase, item by item, ticking off boxes as you go.

The plan is built. The schema is migrated. The sourcing is mapped. The features are scoped. The 90 deep-dive items give you a full year of compounding work.

Start with the first checkbox.
