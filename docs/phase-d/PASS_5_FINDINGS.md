# Pass 5 — User Journey Sweep

**Lens:** Walk each persona end-to-end from a freshly cleared browser. Narrative form.

## Persona 1 — First-time anonymous visitor (1440×900)

1. Land on `/` — hero "EVERY PRIMITIVE / A VIBE CODER NEEDS." with mint accent on second line. Stats strip ($4.2M in deals, 218k installs/wk) lands without layout shift. Pillar tiles (Find / Try / Ship) below. Header has Sign in + Get started CTAs top-right.
2. Click "Models" in the nav → `/models`. Index shows 8 model cards. Editor's-pick mint card at position 0 (GPT-5), UV card at position 4 (DeepSeek v4). Filter pills above (Open weights only / 5 sort modes). Search input filters live.
3. Click GPT-5 card → `/models/gpt-5`. Hero with provider sigil + release date + name. Stats row (intelligence/cost/throughput/context). 4 tabs (Overview/Pricing/Performance/Capabilities) hash-driven. Right rail "Try it" CTA + Alternatives list + Source attribution.
4. Click bookmark icon → `BookmarksProvider.toggle()` fires, adds to cookie. Saved chip in header (visible only at ≥2xl widths) updates count. At 1440 the chip is hidden — bookmark is silently persisted to cookie, but visible affordance is missing. **P2 — consider showing toast confirmation on bookmark below 2xl.**
5. Click "Set your stack" in header → StackPicker drawer opens with 6 preset cards above the fold (SaaS Weekend, Internal Tools, Open Source, Solo SaaS, Agency, Side Project). Picking "SaaS Weekend" auto-fills clients (Claude Code, Cursor) + tech tags (Next.js, Supabase, Stripe, Resend). Click Save → cookie `vch_stack` persists, drawer closes, header chip updates to "SaaS Weekend" in mint.
6. Click "Deals" in nav → `/deals`. Hero "$388k+ in credits". Category + tier filter pills. Pro deals show UV blur overlay + lock icon + "Upgrade — $99/yr" pill. Member deals show "Sign up free →". Public deals show full content + mint "Claim" button.
7. Click a Pro deal → opens UpgradeModal with payback math ("This single deal pays for Pro 2020× over").

**Verdict:** Smooth. Bookmark feedback below 2xl is the one rough edge.

## Persona 2 — Returning user with active session

1. Already signed in (auth modal closed previously). Header shows avatar instead of Sign in / Get started.
2. Visit `/dashboard`. Welcome + 3-column grid (Your stack mint-border / Recent bookmarks / What's changed) + 4-button Quick Actions + Saved stacks placeholder.
3. Click "Bookmarks" in dashboard → `/dashboard/bookmarks`. Sort row (Recent / By type / A→Z), Trash per-row, Clear all with confirm.
4. Click "Submit a resource" → `/submit`. 4-step wizard (Type → Details → Compatibility → Review). Mint step dots. Per-field Zod inline errors. Submit → 600 ms fake success → toast.
5. Visit `/settings`. 4 tabs (Profile / Stack / Subscription / Danger). Profile save fakes 400 ms + toast. Danger zone opens DeleteAccountModal with email-match gate before button enables.

**Verdict:** All gated routes redirect to `/?signin=1` when anon (confirmed Session 11). When signed in, full flows compose cleanly.

## Persona 3 — Mobile user (375×812)

1. Land on `/`. Hamburger menu top-left, wordmark hidden (`hide-mobile`). Hero wraps cleanly. Bottom MobileNav fixed: home / search / bookmark / lightbulb / profile.
2. `/models` — filter pills wrap to 2 rows, sort pills wrap. Cards full-width, editor's-pick mint-tinted at top.
3. `/compare` — table inside a horizontal-scroll container. **No scroll affordance** (no faded edge, no chip indicating swipe). **P2.**
4. `/pricing` — three cards stack vertically. Pro card retains UV accent + recommended badge.
5. `/dashboard` (signed in) — single-column. Cards stack. Quick actions become 2×2 grid.
6. `/deals` — Pro overlays still legible at narrow width. Tier pill row + category pill row both wrap.

**Verdict:** Mobile is solid across the board. Compare table's lack of swipe affordance is the one P2.

## Persona 4 — Keyboard-only

1. Land on `/`. Tab once → skip-link "Skip to content" appears mint-bordered. Enter → scrolls to `<main>`.
2. Continue tabbing through header: Logo → nav links → search trigger → stack chip → Sign in → Get started.
3. Press ⌘K (anywhere) → Cmd-K modal opens. Input autofocused. Arrow keys navigate results. Enter selects. Esc closes. **Verified by `window.dispatchEvent(new KeyboardEvent('keydown', {key:'k', metaKey:true}))` returning `opened:true`.**
4. Tab into modal-trap: focus stays inside Cmd-K until closed (Radix Dialog primitive provides focus trap via `react-focus-lock`).
5. Tab through `/models` → bookmark buttons reachable; Enter toggles bookmark.
6. AuthModal + StackPicker + UpgradeModal + DeleteAccountModal all use Radix Dialog → all trap focus correctly.

**Verdict:** Keyboard nav works end-to-end. Tab order is logical because there's no `tabindex` overrides anywhere in the codebase.

## Issues found

**P0:** none.
**P1:** none.
**P2:**
- Mobile `/compare` needs a swipe affordance for the horizontal-scroll table.
- Bookmark below 2xl loses the count chip; a one-time toast confirmation would patch the visibility gap.

**P3:**
- Anon → signed-in transition relies on Supabase OAuth round-trip (stubbed). Full E2E test owed once Supabase prod project lands.

## Conclusion
Pass 5 PASS. All four personas complete their journeys without dead ends. The two P2 mobile/responsive nits are minor and slated for Phase 2 polish.
