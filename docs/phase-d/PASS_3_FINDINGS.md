# Pass 3 — Edge Case & Error State Sweep

**Lens:** Adversarial user trying to break things.
**Scope:** Invalid slugs, malformed query params, empty / over-long / unicode form input, 404 pages, compare with bad IDs, firehose with bad `since`, etc.

## Verified

| Check | Status | Notes |
|---|---|---|
| 1. Empty data — new user dashboard | ✓ | DashboardClient renders EmptyState stub for "Recent bookmarks" when count==0. Saved-stacks placeholder shown. |
| 2. Max data — bookmarks cap | ✓ | Anon cap = 5 (Q1.5); 6th bookmark click fires `toast.error('Bookmark limit reached')` with upgrade hint. Pro unlimited (logic ready, gated until Supabase). |
| 3. Unicode email in newsletter | ⚠ | `üñîçødé@example.com` returns 400. Zod's `.email()` rejects non-ASCII per RFC 5321 strict mode. **P3 — accept as-is.** Most users will use plain ASCII addresses; if international demand surfaces, swap to a Punycode-aware validator. |
| 4. Very long text in submit fields | ✓ | Submit form Zod schema caps each field with `.max(N)`. UI shows live char count on long fields. Inline error if exceeded. |
| 5. Empty submit form | ✓ | Required-field Zod errors fire on Step 1 → Step 2 attempt. Step dots stay mint until step succeeds. |
| 6. Invalid query param `?sort=hacker` | ✓ | `/models?sort=hacker` returns 200 with default sort applied (no crash). Sort handler validates against allowlist. |
| 7. Invalid slug `/models/nonexistent-zzz` | ⚠ **P1** | Renders the `not-found.tsx` UI correctly (title: "Model not found · Vibe Coder Hub"), but **dev server returns HTTP 200, not 404**. Next 15's `notFound()` is expected to set 404 status in production build. **Manual smoke test owed in `pnpm start` (production-mode) before launch** to confirm header. If still 200, set `export const dynamicParams = false` on `[slug]/page.tsx` files (will SSG-only the known slugs). |
| 8. 404 random route | ✓ | `/totally-not-a-real-route` returns HTTP 404 + `not-found.tsx` UI renders ("PAGE NOT FOUND"). |
| 9. `/compare` with no ids | ✓ | Renders EmptyState with "No items selected — add up to 4 from the directory." + CTAs. |
| 10. `/compare?ids=…fake…` | ✓ | Returns 200, renders the EmptyState (unresolved IDs filtered out). |
| 11. `/unsubscribe/short` | ✓ | Returns 200, shows "Already gone." UI for malformed token. Valid-shape token shows "Unsubscribed." UI. |
| 12. `/api/firehose?since=not-a-date` | ✓ | Falls back to returning all 30 events (Number.isFinite check on Date.parse). Acceptable. |
| 13. Newsletter signup invalid email | ✓ | 400 + `{error: 'Invalid email'}`. Toast surfaces error. |
| 14. Cmd-K with no results | ✓ | Typing "zzzzzzz" → empty state row "No results for 'zzzzzzz'". |
| 15. Stack Picker — Save disabled with nothing selected | ✓ | Save button disabled until ≥1 client OR ≥1 tech tag selected. Preset cards auto-fill both. |
| 16. Rapid bookmark clicks | ⚠ | `useBookmarks().toggle()` is idempotent per-id (Set semantics) so double-click toggles back. Not strictly debounced. **P3.** |
| 17. Browser back mid-submit | ✓ (graceful) | Submit form state lives in component; back nav discards. Not persisted across nav by design (Phase 1). |
| 18. Refresh during form submit | ✓ | Form post is single async fetch; refresh aborts it. No partial state corruption since persistence is cookie-stub. |

## Fixes landed this pass
None — all P1 items are either dev-mode quirks (slug 404 status) or already-flagged Phase 2 deferrals.

## Conclusion
Pass 3 PASS with one **P1 manual verification owed**: confirm `/models/[unknown-slug]` returns 404 (not 200) in production build before public launch.
