# Supabase Setup & Architecture Guide: Office Hours System

This directory contains the database migration scripts and configuration documentation for the Student Office Hours booking system on [yunusserhat.com](https://www.yunusserhat.com/officehours/).

---

## Architecture Overview

1. **Authentication**: Supabase Auth handles passwordless student verification via Email OTP (or Magic Link).
2. **Booking Domain Enforcement**:
   - **Tier 1 (Client UX)**: Instant feedback rejecting non-university domains before network request.
   - **Tier 2 (Supabase Auth Trigger)**: A `BEFORE INSERT OR UPDATE` trigger on `auth.users` rejects account creation or updates outside `@marun.edu.tr` and `@marmara.edu.tr`. It does not fire for OTP requests from existing users; those are throttled by Supabase Auth (see Tier 5).
   - **Tier 3 (Table CHECK Constraints)**: `public.officehours_appointments` enforces `public.is_allowed_email_domain(student_email)`.
   - **Tier 4 (Booking RPC and read policy)**: `book_officehours_appointment` checks the authenticated email and stores the caller's user ID; appointment RLS limits student reads to their own rows. Direct table writes are revoked by the Phase 1 hardening migration.
   - **Tier 5 (OTP sending limits)**: Supabase Auth's own rate limits (per address, per IP, per project) and optional Turnstile CAPTCHA. There is no database-side OTP limiter: the earlier one could be called by anyone for any address, which let one visitor lock another out, and it could be bypassed by calling Supabase Auth directly.
3. **Concurrency & Race Condition Elimination**:
   - A PostgreSQL `EXCLUDE USING gist` constraint guarantees that two students clicking "Book" simultaneously cannot reserve overlapping active slots.
   - Partial unique index on active `(slot_start) WHERE status = 'booked'`.
   - The booking RPC takes a per-student transaction lock, so one student's concurrent requests cannot both pass the booking limits.
4. **Student Privacy**:
   - Students can query only their own appointments.
   - Slot availability is served through `public.officehours_booked_slots`, exposing strictly `(slot_start, slot_end)`. No student names, emails, topics, notes, or database IDs are ever exposed to the public or other students.
   - The booking page reads masked schedule views (added in Phase 1), and Phase 2 removes public reads of the raw schedule tables, so online and mixed-mode meeting links and blocked-date reasons are not returned before booking.
5. **Admin Authorization**:
   - Protected by `public.is_admin()`, a `SECURITY DEFINER` function checking `officehours_admin_users` and `officehours_admin_allowlist`. An ordinary student or anonymous user cannot elevate privileges via client-side attributes.

---

## Step-by-Step Supabase Project Setup

### 1. Create a Supabase Project
1. Log in to [Supabase](https://app.supabase.com) and click **New Project**.
2. Choose a project name (e.g., `yunusserhat-website`), set a secure database password, and select the region nearest to Turkey (e.g. Frankfurt `eu-central-1`).

### 2. Run Database Migrations
**Existing project (production):** follow [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md). It starts from the live database (backup, function-source and policy inspection with [checks/live_preflight.sql](checks/live_preflight.sql)) and applies the hardening in two phases around the site deploy. Do not replay the original setup migration.

**New project:** apply these in order, each as one transaction (SQL editor with the whole file as one query, or `psql --single-transaction -v ON_ERROR_STOP=1 -f <file>`):
1. [migrations/20260910000001_officehours_schema.sql](migrations/20260910000001_officehours_schema.sql) — tables, RLS, triggers, RPCs.
2. [migrations/20260927000002_officehours_phase1_hardening.sql](migrations/20260927000002_officehours_phase1_hardening.sql) — hardened RPCs and helpers, masked schedule views, direct appointment writes revoked, database OTP limiter removed.
3. [phase2/20260927000003_officehours_phase2_remove_legacy_access.sql](phase2/20260927000003_officehours_phase2_remove_legacy_access.sql) — removes the legacy public reads of the raw schedule tables. On a new project it can run immediately; in production only after the new site is verified.

Local smoke tests for all three (Docker required): `npm run test:db`.

### 3. Configure Supabase Authentication (Email OTP)
1. Go to **Authentication** > **Providers** > **Email**:
   - **Enable Email Provider**: ON
   - **Confirm email**: ON
   - **Secure email change**: ON
2. Under **Authentication** > **URL Configuration**:
   - **Site URL**: `https://www.yunusserhat.com`
   - **Redirect URLs**:
     - `https://www.yunusserhat.com/officehours/`
     - `https://www.yunusserhat.com/officehours/admin/`
     - `https://yunusserhat.com/officehours/`
     - `https://yunusserhat.com/officehours/admin/`
     - `http://localhost:1313/officehours/` (for local development)
     - `http://localhost:1313/officehours/admin/`
3. Under **Authentication** > **Email Templates**:
   - Customize the "Magic Link" or "Confirmation / OTP" subject and body to academic branding (e.g. "Yunus Serhat Bıçakçı - Office Hours Verification Code: {{ .Token }}").
4. Under **Authentication** > **Rate Limits**, keep the per-address email interval at 60 seconds or more and size the hourly email limit for class bursts (custom SMTP required). Optional CAPTCHA: see step 5 of [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md); enable it in Supabase only after the pages carry the Turnstile site key.

### 4. Promote Admin Account
The schema includes an automatic admin allowlist table `public.officehours_admin_allowlist`.

To promote or verify your admin email:
```sql
-- Insert your university or personal administrative email:
INSERT INTO public.officehours_admin_allowlist (email, notes)
VALUES ('yunus.serhat@marmara.edu.tr', 'Professor Admin')
ON CONFLICT (email) DO NOTHING;
```
When you sign in using that email at `/officehours/admin/`, the trigger automatically registers your user ID in `public.officehours_admin_users` and grants full access to the admin dashboard.

---

## Netlify Environment Variables

In your Netlify Dashboard (**Site configuration** > **Environment variables**), add:

| Variable Name | Description | Example / Location in Supabase |
| :--- | :--- | :--- |
| `SUPABASE_URL` | Public API URL | Found in Supabase **Project Settings** > **API** > `Project URL` |
| `SUPABASE_ANON_KEY` | Public Anon/Publishable API Key | Found in Supabase **Project Settings** > **API** > `Project API keys` > `anon / public` |
| `RESEND_API_KEY` | Resend API Key | Generated in Resend Dashboard (**API Keys** > `Create API Key`) |
| `OFFICEHOURS_WEBHOOK_SECRET` | Shared webhook secret, available to Netlify Functions only | Generate a long random value and store it in Netlify; never put it in Hugo config or browser code |
| `OFFICEHOURS_TURNSTILE_SITE_KEY` | Optional public Turnstile site key (Builds scope) | Cloudflare Turnstile widget for `www.yunusserhat.com`; its secret key goes only into Supabase Auth |
| `ADMIN_EMAIL` | Professor notification target email | e.g. `yunus.serhat@marmara.edu.tr` |
| `FROM_EMAIL` | Sender address shown on emails | e.g. `Dr. Yunus Serhat Bıçakçı <ofis@yunusserhat.com>` (or `onboarding@resend.dev` for initial tests) |

> [!WARNING]
> **NEVER** add `service_role` keys or database passwords to Netlify client-facing environment variables or commit them to git. `RESEND_API_KEY` is kept secure inside Netlify serverless functions and is never exposed to browser clients.

---

## Automatic Email Notifications Setup (Supabase Webhook)

Whenever a student books or cancels an appointment, Supabase triggers the Netlify serverless function at `/.netlify/functions/notify-appointment`.

### Step-by-Step Webhook Configuration in Supabase:
1. In your **Supabase Dashboard**, navigate to **Database** > **Webhooks** (or **Integrations** > **Webhooks**).
2. Click **Create a new webhook** (or **Enable Webhooks** if first time).
3. Fill in the following fields:
   - **Name**: `notify-officehours-appointment`
   - **Table**: `public.officehours_appointments`
   - **Events**: Check both `Insert` (for new bookings) and `Update` (for cancellations).
   - **Type of Webhook**: `HTTP Request`
   - **Method**: `POST`
   - **URL**: `https://www.yunusserhat.com/.netlify/functions/notify-appointment`
   - **HTTP Headers**:
     - `Content-Type`: `application/json`
     - `x-officehours-webhook-secret`: the exact value of `OFFICEHOURS_WEBHOOK_SECRET` in Netlify
4. Click **Create webhook**.

For an existing deployment, set the Netlify function secret and the webhook custom header before deploying the authenticated function. Verify that unsigned and incorrect-secret requests return 401 and a test booking sends one admin and one student email. The function intentionally returns 503 until its secret is configured. Check that the live webhook includes `schema`, `table`, `type`, `record`, and `old_record` on updates; cancellation email is sent only for a `booked` appointment becoming `cancelled_by_student` or `cancelled_by_admin`. Keep the secret out of source control and rotate it in both services if it is exposed.

Notification requests use a stable Resend idempotency key per appointment, event, and recipient to suppress duplicate delivery attempts within [Resend's 24-hour idempotency window](https://resend.com/changelog/idempotency-keys). Check Resend and Netlify logs after any failed webhook response; a failed provider request returns HTTP 502.

These repository files cannot confirm the current production database or Netlify environment. After deploying, verify grants/RLS with real student and admin accounts, booking limits with concurrent requests, cancellation, and notification delivery in the deployed environment.

**Release order:** see [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md). In short: secret and `www` webhook URL on both sides → Phase 1 → deploy → verify → Phase 2. Phase 1 keeps the currently deployed pages working, and the new pages work on the Phase 1 schema, so no step causes downtime.

---

## Modifying Rules & Managing Domains

### How to Change Office-Hour Schedules
Admins can modify schedules directly from the web interface at `/officehours/admin/`, or execute SQL:
```sql
-- Example: Add Monday 14:00-16:00 (day 1 = Monday)
INSERT INTO public.officehours_availability_rules (day_of_week, start_time, end_time, is_active)
VALUES (1, '14:00:00', '16:00:00', true);

-- Example: Block a specific date for a conference
INSERT INTO public.officehours_availability_exceptions (exception_date, reason, is_blocked)
VALUES ('2026-10-06', 'International Conference', true);
```

### How to Safely Add / Remove Email Domains
If the university adds a new student domain in the future, update the helper function in SQL:
```sql
CREATE OR REPLACE FUNCTION public.is_allowed_email_domain(email_address text)
RETURNS boolean AS $$
BEGIN
  RETURN public.extract_email_domain(email_address) IN (
    'marun.edu.tr',
    'marmara.edu.tr',
    'newdomain.edu.tr' -- added safely
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```
And add the domain to `ALLOWED_EMAIL_DOMAINS` in `static/js/officehours-common.js`.

---

## Troubleshooting

- **OTP Email Not Received**: Check Supabase **Authentication** > **Logs**. Ensure the student email is exactly `@marun.edu.tr` or `@marmara.edu.tr`. Non-matching domains are intentionally rejected at the database trigger before any email is dispatched. A "you can only request this after N seconds" message comes from Supabase Auth's per-address limit.
- **"Unauthorized Admin Access"**: Verify that your email is listed in `public.officehours_admin_allowlist` (matching case-insensitively). `public.is_admin()` reads the signed-in user's token, so test it through an authenticated admin session rather than the SQL editor.
- **Timezone Inconsistencies**: All internal timestamps are stored in UTC (`timestamptz`). When displayed to students and admins, they are formatted in the academic timezone `Europe/Istanbul` (UTC+3).
