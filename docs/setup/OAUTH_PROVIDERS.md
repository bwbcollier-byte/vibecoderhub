# OAuth provider setup — GitHub + Google

The Supabase project already accepts OAuth callbacks at
`https://oerfmtjpwrefxuitsphl.supabase.co/auth/v1/callback`. The
`AuthModal` UI ships with both **Continue with Google** and **Continue
with GitHub** buttons (Session 18). To make either flow actually
complete, configure the provider in Supabase Studio with credentials
issued by the provider's developer console.

This is a one-time **dashboard task** — there's no code change to make
once the credentials exist.

## GitHub

1. github.com → **Settings → Developer settings → OAuth Apps → New OAuth App**.
   - **Application name:** `Vibe Coder Hub` (local dev) — create a second one later for production.
   - **Homepage URL:** `http://localhost:3001`
   - **Authorization callback URL:** `https://oerfmtjpwrefxuitsphl.supabase.co/auth/v1/callback`
2. Click **Register application**, then **Generate a new client secret**.
3. Supabase Studio → **Authentication → Providers → GitHub**:
   - Enable
   - Paste **Client ID** + **Client secret**
   - Save
4. Smoke test: open the app, click **Continue with GitHub** → GitHub
   approval screen → land back on `/?next=…` → check `pk_profiles`
   for the new row (`select * from pk_profiles order by created_at desc limit 1`).

## Google

1. console.cloud.google.com → **APIs & Services → Credentials → + Create Credentials → OAuth Client ID**.
   - First run will ask you to configure the **OAuth consent screen** — choose **External**, enter app name + support email, leave scopes default, add yourself as a test user.
   - Application type: **Web application**.
   - **Authorized JavaScript origins:** `http://localhost:3001`
   - **Authorized redirect URIs:** `https://oerfmtjpwrefxuitsphl.supabase.co/auth/v1/callback`
2. After **Create**, copy **Client ID** + **Client Secret**.
3. Supabase Studio → **Authentication → Providers → Google**:
   - Enable
   - Paste **Client ID** + **Client secret**
   - Save
4. Smoke test: open the app, click **Continue with Google** → Google
   account picker → consent → land back → check `pk_profiles` for the row.

## Notes

- **Profile upsert is automatic.** `app/auth/callback/route.ts` already
  calls `ensureProfile()` after a successful code exchange (see Session
  15). Username is derived from `user_metadata.user_name` (GitHub) or
  `email`'s local part (Google fallback) → slugified.
- **Return-to.** The OAuth `redirectTo` includes
  `?next=${encodeURIComponent(window.location.pathname)}` so the user
  lands back on the page they were on when they hit "Sign in".
- **Production callback.** When the production domain lands, add a
  second OAuth App (GitHub) / second OAuth Client ID (Google) with the
  prod callback URL, OR add the prod URL to the existing app's allow
  list. Supabase only supports one redirect host per app.
- **Magic link.** The third option in `AuthModal` (`signInWithOtp`)
  only works once a Resend domain is verified and `RESEND_API_KEY` is
  set. Until then it returns successfully but no email actually sends.
