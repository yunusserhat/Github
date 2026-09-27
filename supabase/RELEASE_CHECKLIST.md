# Office Hours Release Checklist (Phase 1 → deploy → Phase 2)

This release hardens the office-hours database without downtime. The repository migrations are **not** proof of what runs in production, so every step below that touches Supabase starts from the live database.

| File | When it runs |
| :--- | :--- |
| `supabase/checks/live_preflight.sql` | Read-only. Before Phase 1 and again before Phase 2. |
| `supabase/migrations/20260927000002_officehours_phase1_hardening.sql` | Before the site deploy. Keeps the access the currently deployed pages need. |
| `supabase/phase2/20260927000003_officehours_phase2_remove_legacy_access.sql` | Only after the new site is verified in production. Kept outside `migrations/` so `supabase db push` cannot apply it early. |

Each migration checks its own preconditions and aborts, changing nothing, if the live schema differs from what it was reviewed against (unexpected RLS policies, extra RPC overloads, Phase 2 before Phase 1, functions still reading the retired OTP table).

## 0. Before touching production

- [ ] `npm test` and `npm run test:db` pass locally (the second needs Docker).
- [ ] Push the branch (not `main`) and confirm the Netlify deploy preview builds with Hugo 0.166.0.
- [ ] **Backup:** take a database backup (Supabase **Database → Backups**, or `pg_dump`/`supabase db dump` for schema and data). Store it outside the repository: it contains student data and the webhook secret.
- [ ] **Live function source:** run `supabase/checks/live_preflight.sql` and compare every `pg_get_functiondef` result in query 1 with the repository. Phase 1 redefines `is_admin`, both `auth.users` trigger functions, the booking and cancellation RPCs, and `internal.get_officehours_booked_slots`, and drops the two OTP limiter RPCs; any production-only change to them would be lost.
- [ ] **Unexpected RLS policies:** review query 2. Any policy name not created by the repository's migrations must be understood and removed (or the migration updated) before Phase 1, which otherwise aborts.
- [ ] Queries 5–7 show one overload of each RPC, nothing else using the OTP limiter, and zero overlapping active bookings.

## 1. Supabase Auth limits (replaces the old database OTP limiter)

Email sending is limited by Supabase Auth itself, which the Auth API enforces for every caller. In **Authentication → Rate Limits** (and the Email provider settings):

- [ ] Custom SMTP is configured (the built-in mailer only sends to project members), and the hourly **email sent** limit suits a class-sized burst.
- [ ] The minimum interval between emails to the same address is at least 60 seconds (Supabase default). The pages use this value for the resend countdown and read the remaining time from Supabase's 429 response.
- [ ] Per-IP limits for sign-ins/sign-ups and token verifications are left at their defaults or tightened.

## 2. Webhook secret and URL (before deploying the new function)

The current function ignores the header, so setting it now is safe; the new function rejects requests without it.

- [ ] Generate a long random secret (for example `openssl rand -base64 48`). Never put it in the repository, Hugo config, or browser code.
- [ ] Netlify → **Site configuration → Environment variables**: set `OFFICEHOURS_WEBHOOK_SECRET` with the **Functions** scope, alongside `RESEND_API_KEY`.
- [ ] Supabase → **Database → Webhooks** → the `officehours_appointments` webhook (`INSERT` and `UPDATE`):
  - URL: `https://www.yunusserhat.com/.netlify/functions/notify-appointment`. The apex `https://yunusserhat.com/...` answers POST requests with a redirect, which webhook requests do not follow.
  - Header `x-officehours-webhook-secret` set to the same secret.
- [ ] Re-run preflight query 8: the URL is the `www` address, the header name is present, and `webhook_secret_sha256` equals `printf %s "$OFFICEHOURS_WEBHOOK_SECRET" | sha256sum` computed from the Netlify value.

## 3. Phase 1 (database, before the site deploy)

- [ ] Apply the Phase 1 file as **one transaction**:
  - psql: `psql "$DATABASE_URL" --single-transaction -v ON_ERROR_STOP=1 -f supabase/migrations/20260927000002_officehours_phase1_hardening.sql`
  - or the Supabase SQL editor with the whole file pasted as one query (PostgreSQL runs a multi-statement query as a single transaction; an error rolls everything back).
  - or `supabase db push`, which runs each migration in its own transaction. If the base schema was originally pasted into the SQL editor, first run `supabase migration repair --status applied 20260910000001` so the CLI does not try to replay it.
- [ ] Verify the **currently deployed** site still works: student sign-in, schedule, booking, cancellation, admin sign-in and schedule editing. It ignores the removed OTP pre-check and still reads the raw schedule tables, which Phase 1 keeps readable.

## 4. Deploy the site and function

- [ ] Merge to `main` (Netlify deploys automatically).
- [ ] Unsigned and wrong-secret POSTs to the function return `401`.
- [ ] A test booking sends one admin and one student email; a student cancellation and an admin cancellation each send two cancellation emails (check Resend and Netlify function logs).
- [ ] The new booking page loads the schedule from the masked views; online meeting links and blocked-date reasons are not visible before booking.
- [ ] Admin portal: sign-in, appointment list, rule/override/blocked-date editing, settings save.

## 5. Optional: Supabase Auth CAPTCHA (Cloudflare Turnstile)

Order matters: enabling CAPTCHA in Supabase before the pages send tokens blocks every sign-in.

- [ ] Create a Turnstile widget for `www.yunusserhat.com`.
- [ ] Netlify: set `OFFICEHOURS_TURNSTILE_SITE_KEY` (public site key, **Builds** scope) and redeploy. Both office-hours pages now show the check.
- [ ] Verify student and admin sign-in still work with the widget.
- [ ] Supabase → **Authentication → Attack Protection**: enable CAPTCHA protection with provider Turnstile and the Turnstile **secret** key. Verify sign-in again.
- [ ] Confirm the privacy page still describes the check (it names Cloudflare Turnstile for when the widget is shown).

## 6. Phase 2 (after the new release is verified)

Wait until the new release has run without errors (for example one day), so open tabs with the old page have reloaded.

- [ ] Re-run `supabase/checks/live_preflight.sql`; confirm Phase 1 objects are present.
- [ ] Apply `supabase/phase2/20260927000003_officehours_phase2_remove_legacy_access.sql` as one transaction (same methods as Phase 1).
- [ ] Verify the booking page, a booking and cancellation, and the admin portal again.
- [ ] Move the Phase 2 file into `supabase/migrations/` unchanged.
- [ ] From now on, do not roll the Netlify deploy back to a build older than this release: those pages read the raw schedule tables that Phase 2 closes.

## Rollback

- **Before Phase 2:** rolling the Netlify deploy back is safe; the previous pages work against Phase 1. Reverting Phase 1 itself should not be necessary; if it is, restore the function definitions saved from preflight query 1 or the backup.
- **After Phase 2:** roll forward instead of back.

## What remains temporary

Between Phase 1 and Phase 2 only these remain: the three legacy "Public can view …" policies on `officehours_availability_rules`, `officehours_availability_exceptions`, and `officehours_date_overrides`, the anonymous `SELECT` grants on those tables, and the emptied, inaccessible `officehours_email_rate_limits` table. Phase 2 removes all of them; nothing temporary survives it. (Signed-in users keep the `SELECT` grant on the raw tables permanently, because the admin portal needs it; RLS limits it to administrators once the legacy policies are gone.)
