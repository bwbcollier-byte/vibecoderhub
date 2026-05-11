# Ingestion workflow template

Every `ingest-*.yml` workflow follows the same shape:

1. Checkout
2. Setup pnpm + Node 22
3. Install deps with frozen lockfile
4. Run `pnpm tsx scripts/ingest/<source>.ts`
5. Forward all secrets the script may need (DATABASE_URL_DIRECT, R2_*,
   GITHUB_INGESTION_TOKEN, SMITHERY_API_KEY, ...) via the workflow env.

Cron cadences come from `docs/planning/specs/vibe-coder-hub-data-sourcing.md`.
Every workflow exposes `workflow_dispatch` so we can manually re-run any source
from the Actions tab when debugging.
