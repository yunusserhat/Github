# Student Office Hours Booking System - Setup & Operations Guide

This guide documents the architecture, database setup, environment configuration, and operations for the Student Office Hours booking system on [yunusserhat.com](https://www.yunusserhat.com/officehours/).

---

## 1. System Overview & URLs

- **Student Booking Interface**: `https://www.yunusserhat.com/officehours/`
- **Admin Management Portal**: `https://www.yunusserhat.com/officehours/admin/`
- **Database / Auth Provider**: [Supabase](https://supabase.com)
- **Hosting / Deployment**: [Netlify](https://netlify.com)

The system integrates directly into the existing Hugo academic site (Wowchemy theme). It requires zero third-party UI framework bloat, compiles cleanly with Hugo, and uses Supabase for passwordless email verification, PostgreSQL concurrency constraints, and Row Level Security (RLS).

---

## 2. University Domain Restriction Policy

To reserve an appointment, students must verify ownership of an email address belonging to either of these two exact university domains:
1. `marun.edu.tr`
2. `marmara.edu.tr`

### Multi-Tier Defense Model

| Tier | Enforcement Point | Behavior |
| :--- | :--- | :--- |
| **Tier 1: Client UX** | `static/js/officehours-common.js` | Parses email, trims whitespace, extracts domain after the final `@`, and rejects unapproved domains before making network requests. |
| **Tier 2: Auth Trigger** | PostgreSQL `BEFORE INSERT OR UPDATE` trigger on `auth.users` | Rejects account creation or updates for an email outside the allowed domains. It does not fire for OTP requests from existing users. |
| **Tier 3: Table Constraint** | PostgreSQL `CHECK (public.is_allowed_email_domain(student_email))` | Rejects appointment insertions containing invalid domains at the database level. |
| **Tier 4: Booking RPC and read policy** | `book_officehours_appointment` and appointment RLS | The RPC checks the authenticated email and stores the caller's user ID; the read policy limits students to their own appointments. Direct table writes are revoked by the Phase 1 hardening migration. |
| **Tier 5: OTP sending limits** | Supabase Auth rate limits and optional Turnstile CAPTCHA | Supabase Auth enforces per-address, per-IP, and project email limits for every caller. The pages only show the wait time Supabase returns; there is no database or browser-side OTP limiter. |

Subdomains (e.g. `user@cs.marmara.edu.tr`) and suffix lookalikes (e.g. `user@marun.edu.tr.attacker.com` or `user@notmarun.edu.tr`) are rejected across all tiers.

---

## 3. Supabase Configuration

### A. Create Project & Execute Migrations
**Existing (production) project:** follow [`supabase/RELEASE_CHECKLIST.md`](../supabase/RELEASE_CHECKLIST.md): backup, live inspection with `supabase/checks/live_preflight.sql` (`pg_get_functiondef` of the affected functions, unexpected RLS policies, grants, webhook URL and secret fingerprint), then Phase 1 → deploy → Phase 2, each migration in one transaction. Repository migrations are not proof of the live state. Steps 1–5 below apply only to a new project.

1. Create a project at [supabase.com](https://app.supabase.com) (e.g. `yunusserhat-officehours`).
2. Navigate to **SQL Editor** in your Supabase dashboard.
3. Open `supabase/migrations/20260910000001_officehours_schema.sql` from this repository, paste it into the editor, and click **Run**.
4. The migration creates:
   - Configuration table `public.officehours_settings`
   - Recurring rules table `public.officehours_availability_rules`
   - Exceptions table `public.officehours_availability_exceptions`
   - Admin allowlist and user tables `public.officehours_admin_allowlist` / `public.officehours_admin_users`
   - Appointments table `public.officehours_appointments` with a GiST exclusion constraint
   - Secure anonymized view `public.officehours_booked_slots` (exposes only `slot_start` and `slot_end` without student PII)
   - Procedures: `book_officehours_appointment`, `cancel_officehours_appointment`, and `is_admin`
5. Apply `supabase/migrations/20260927000002_officehours_phase1_hardening.sql`, then `supabase/phase2/20260927000003_officehours_phase2_remove_legacy_access.sql` (each as one query/transaction). On a new project Phase 2 can follow immediately.

### B. Configure Supabase Auth (Email OTP)
1. Go to **Authentication** > **Providers** > **Email**:
   - Turn **Enable Email provider** ON.
   - Turn **Confirm email** ON.
2. Go to **Authentication** > **URL Configuration**:
   - **Site URL**: `https://www.yunusserhat.com`
   - **Redirect URLs**:
     - `https://www.yunusserhat.com/officehours/`
     - `https://www.yunusserhat.com/officehours/admin/`
     - `https://yunusserhat.com/officehours/`
     - `https://yunusserhat.com/officehours/admin/`
     - `http://localhost:1313/officehours/` (for local development)
     - `http://localhost:1313/officehours/admin/`
3. Customize email templates under **Authentication** > **Email Templates** if desired.
4. Review **Authentication** > **Rate Limits**: custom SMTP, an hourly email limit sized for class bursts, and a per-address interval of at least 60 seconds. For CAPTCHA, follow step 5 of the release checklist (site key in Netlify first, then enable Turnstile in Supabase).

### C. Promote Your Initial Admin Account
The schema uses `public.officehours_admin_allowlist`. The original setup migration seeds only `yunus.serhat@marmara.edu.tr`; confirm the live allowlist before changing it.

If you wish to add or change the administrative email:
```sql
INSERT INTO public.officehours_admin_allowlist (email, notes)
VALUES ('your-email@marmara.edu.tr', 'Professor Serhat Bicakci')
ON CONFLICT (email) DO NOTHING;
```
When you sign in using this email at `/officehours/admin/`, the database trigger automatically grants you administrative rights.

---

## 4. Netlify Environment Variables

In your Netlify Dashboard (**Site configuration** > **Environment variables**), add:

| Key | Description | Example / Notes |
| :--- | :--- | :--- |
| `SUPABASE_URL` | Supabase API endpoint | `https://your-project-id.supabase.co` |
| `SUPABASE_ANON_KEY` | Browser-safe public anon key | Found under Project Settings > API |
| `RESEND_API_KEY` | Server-side Resend email API key | Netlify Functions scope only |
| `OFFICEHOURS_WEBHOOK_SECRET` | Long random shared webhook secret | Netlify Functions scope only; configure the same value as a Supabase webhook header |
| `OFFICEHOURS_TURNSTILE_SITE_KEY` | Optional public Turnstile site key | Builds scope; leave unset until the CAPTCHA step of the release checklist |

> [!WARNING]
> The GitHub repository is public. **NEVER** commit service-role keys, database passwords, or private tokens to the repository or Netlify frontend environment variables.

In Supabase **Database > Webhooks**, ensure the webhook for `public.officehours_appointments` sends `INSERT` and `UPDATE` events to `https://www.yunusserhat.com/.netlify/functions/notify-appointment` with the custom header `x-officehours-webhook-secret` set to the Netlify `OFFICEHOURS_WEBHOOK_SECRET` value. Set both sides before deploying the new function. Check that the payload contains `schema`, `table`, `type`, `record`, and `old_record` on updates. The function fails closed without a configured secret and sends cancellation mail only on `booked` to `cancelled_by_student` or `cancelled_by_admin` transitions.

After deployment, test a real student booking, student cancellation, admin cancellation, and two concurrent booking attempts. Verify grants and RLS against the *live* database with student and admin accounts; tests against repository SQL cannot establish production permissions.

The hardening is split so that no step breaks the running site: Phase 1 adds the masked schedule views and hardened RPCs while keeping the raw-table reads that the currently deployed page uses; the new page works against Phase 1; Phase 2 removes the raw-table reads only after the new page is verified. Confirm that online meeting links and blocked-date reasons are hidden before booking, while booked students and administrators retain the details they need.

---

## 5. Local Development & Testing

### Running Tests
Automated unit tests use the native Node.js test runner:
```bash
npm test
```
This runs the Node.js automated tests verifying:
- Email domain validation (acceptance of `marun.edu.tr` and `marmara.edu.tr`, rejection of lookalikes and subdomains)
- Slot generation (20-minute meetings with 10-minute buffers)
- 24-hour minimum notice rule
- Blocked exception dates
- Student booking limits (1 active future booking, rolling 7-day limits)
- Europe/Istanbul timezone conversions
- Supabase Auth rate-limit and CAPTCHA responses, the optional Turnstile gate, the pinned supabase-js release, the Hugo `getenv` allowlist, and a secret scan
- Webhook authentication and notification dispatch

Database smoke tests (Docker required) apply the base schema, Phase 1, and Phase 2 to a disposable PostgreSQL container and check the behaviour, the transitional compatibility of the previously deployed pages, concurrent booking, and the migrations' precondition guards:
```bash
npm run test:db
```

### Running Hugo Locally
```bash
# Set environment variables for local testing
export SUPABASE_URL="https://your-project-id.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key"

# Start Hugo server
hugo server
```
Then visit `http://localhost:1313/officehours/`.

---

## 6. Business Rules & Customization

Default settings:
- **Meeting Duration**: 20 minutes
- **Buffer Between Meetings**: 10 minutes
- **Minimum Advance Notice**: 24 hours
- **Maximum Active Future Bookings Per Student**: 1
- **Rolling Window Limit**: 1 appointment every 7 days
- **Timezone**: `Europe/Istanbul` (UTC+03:00)

### How to Adjust Settings
Admins can adjust all of these settings directly through the web interface at `/officehours/admin/` under the **Settings & Rules** tab, or run SQL:
```sql
UPDATE public.officehours_settings
SET meeting_duration_minutes = 30,
    buffer_minutes = 15,
    min_booking_notice_hours = 12
WHERE id = 1;
```

### How to Block Holidays / Conference Dates
In the Admin Dashboard under **Blocked Dates**, or run:
```sql
INSERT INTO public.officehours_availability_exceptions (exception_date, reason, is_blocked)
VALUES ('2026-10-06', 'Conference', true);
```

### How to Add / Remove Accepted Email Domains
If a new domain is introduced by the university:
1. Update SQL function `is_allowed_email_domain` in Supabase:
   ```sql
   CREATE OR REPLACE FUNCTION public.is_allowed_email_domain(email_address text)
   RETURNS boolean AS $$
   BEGIN
     RETURN public.extract_email_domain(email_address) IN ('marun.edu.tr', 'marmara.edu.tr', 'newdomain.edu.tr');
   END;
   $$ LANGUAGE plpgsql IMMUTABLE;
   ```
2. Update `ALLOWED_EMAIL_DOMAINS` array in `static/js/officehours-common.js`.

---

## 7. Troubleshooting

- **"Configuration Required" banner appears**:
  The page could not find `SUPABASE_URL` or `SUPABASE_ANON_KEY`. Check your Netlify environment variables and trigger a redeploy (`Clear cache and deploy site`).
- **Student reports "Email domain is not authorized"**:
  Ensure the student is using their official university address ending exactly in `@marun.edu.tr` or `@marmara.edu.tr`. Personal email addresses (`@gmail.com`, `@hotmail.com`, etc.) are intentionally rejected.
- **Admin sees "Unauthorized Access"**:
  Ensure the logged-in email matches an entry in `public.officehours_admin_allowlist` (matching case-insensitively). Test `public.is_admin()` through an authenticated admin session; the SQL editor has no user's auth context.
- **Concurrent booking collision**:
  If two students select the exact same slot and click "Book" simultaneously, the PostgreSQL GiST exclusion constraint automatically allows only one transaction to commit. The second student receives an immediate, user-friendly notice: *"This appointment slot was just reserved by another student. Please choose a different available time."*
