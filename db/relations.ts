// Drizzle relations file — STUB.
//
// Deferred from Session 2 to Session 3. Boot Step 3 schema mirror landed
// without relations populated; the Drizzle client and the standard query API
// (db.select().from(...)) work fine without these. The relations described
// here only enable the typed eager-load syntax:
//
//     db.query.profiles.findFirst({ with: { authoredResources: true } })
//
// No slice in Session 3-4's scope (auth, root providers, UI primitives,
// layout chrome) uses this syntax — the foundation slice's queries
// (Session 5+) are the first consumers. Populate before Session 5.
//
// When populating: read db/schema.ts for all FK columns, mirror each into a
// matching one()/many() pair. Pay particular attention to:
//   - resources has TWO FKs to profiles (authorId, reviewedBy) → use
//     relationName to disambiguate.
//   - Self-references (userStacks.forkedFromId, resources.forkedFromId,
//     comments.parentCommentId) need both halves with a shared relationName.
//   - Operational tables (rate_limit_buckets, ingestion_runs) have no
//     relations — they're standalone.
//
// Track: KNOWN_ISSUES.md "Drizzle relations deferred to Session 3".

export {};
