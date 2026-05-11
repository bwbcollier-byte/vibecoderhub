# Pass 2 — Functional Completeness Sweep

**Lens:** QA tester, click every interactive element.
**Scope:** API endpoints (newsletter, firehose, health) + key client interactions (search, sort, Cmd-K, bookmark) + auth-gated route redirects.
**Method:** Programmatic via `preview_eval` + Bash curl spot-checks.

## Verified

| Check | Status | Notes |
|---|---|---|
| 1. Interactive elements respond | ✓ | Header buttons, footer newsletter form, model card bookmarks, filter pills, sort buttons all wired. |
| 2. Labels match behaviour | ✓ | "Subscribe" subscribes, "Sign in" opens auth modal, "Set your stack" opens stack picker. |
| 3. Newsletter signup CRUD | ✓ | `POST /api/newsletter/subscribe` with valid email → 200 `{ok:true}` + `vch_newsletter=1` cookie. Invalid email → 400. Footer form posts and shows success state. |
| 4. Auth state transitions | ✓ (stubbed) | Anon → click "Get started" → opens AuthModal with sign-up tab. Pro upgrade flows open UpgradeModal. Real auth round-trip stubbed until Supabase prod project lands. |
| 5. Protected route gates | ✓ | `/dashboard`, `/settings`, `/submit` all 307 → `/?signin=1` when anon (verified via curl `redirect:'manual'` → opaque-redirect). |
| 6. Search on /models | ✓ | Typing "claude" filters cards 6 → 2 (matches `lib/seed/models.ts`). Debounced via React state. |
| 7. Sort on /models | ✓ | 4 sort buttons rendered (Cheapest/Fastest/Smartest/Newest). Click changes order. |
| 8. Pagination / load-more | ✓ | "Load more" button visible when seed > 6 entries. Models seed has 8 entries → button renders + works. |
| 9. Cmd-K | ✓ | Click search trigger → modal opens with input autofocused. Typing "gpt" yields 40 results across types. ArrowDown selects next item. Escape closes. Open time was ~1s in dev mode (first compile); cached opens are instant. |
| 10. Firehose API | ✓ | `GET /api/firehose?since=2020-01-01` returns 30 events JSON. SSE stream verified Session 12. |
| 11. Health endpoint | ✓ | `GET /api/health` returns `{status, env, version}`. |

## Issues found

**P0:** none.

**P1:** none. Cmd-K keyboard shortcut re-verified post-write: `window.dispatchEvent(new KeyboardEvent('keydown', {key:'k', metaKey:true}))` opens the modal. (First attempt above failed because the event was dispatched at `document`, not `window`, and the listener binds to `window`.)

**P2:**
- **`/api/firehose` per-IP limit uses in-process Map.** Won't survive multiple Node processes / serverless cold starts. Acceptable until Supabase backs real event stream. Already flagged in KNOWN_ISSUES.
- **Newsletter signup persists nothing yet.** Cookie-stub only. Real persist into `newsletter_subscribers` lands with Supabase (Slice S24). Already flagged.

**P3:**
- Cmd-K type-prefix filter (`>models foo`) deferred per Q2.5 — basic search across all types works.

## Fixes landed this pass
None — functional layer is intact for the stubs we ship Phase 1.

## Conclusion
Pass 2 PASS. Every wire is connected to something — even if some endpoints are cookie-stubs awaiting Supabase. **One manual smoke test owed before launch:** confirm ⌘K opens via real keyboard from a real browser.
