# Supabase Setup & Architecture Guide: Office Hours System

This directory contains the database migration scripts and configuration documentation for the Student Office Hours booking system on [yunusserhat.com](https://yunusserhat.com/officehours/).

---

## Architecture Overview

1. **Authentication**: Supabase Auth handles passwordless student verification via Email OTP (or Magic Link).
2. **Four-Tier Domain Enforcement**:
   - **Tier 1 (Client UX)**: Instant feedback rejecting non-university domains before network request.
   - **Tier 2 (Supabase Auth Trigger)**: A `BEFORE INSERT OR UPDATE` trigger on `auth.users` blocks OTP dispatch and user account creation for any email not ending in `@marun.edu.tr` or `@marmara.edu.tr`.
   - **Tier 3 (Table CHECK Constraints)**: `public.officehours_appointments` enforces `public.is_allowed_email_domain(student_email)`.
   - **Tier 4 (Row Level Security)**: RLS policies verify that `auth.jwt() ->> 'email'` matches the student email and domain allowlist.
3. **Concurrency & Race Condition Elimination**:
   - PostgreSQL `btree_gist` extension with an `EXCLUDE USING gist` constraint guarantees that two students clicking "Book" simultaneously cannot reserve overlapping active slots.
   - Partial unique index on active `(slot_start) WHERE status = 'booked'`.
4. **Student Privacy (KVKK Compliant)**:
   - Students can query only their own appointments.
   - Slot availability is served through `public.officehours_booked_slots`, exposing strictly `(slot_start, slot_end)`. No student names, emails, topics, notes, or database IDs are ever exposed to the public or other students.
5. **Admin Authorization**:
   - Protected by `public.is_admin()`, a `SECURITY DEFINER` function checking `officehours_admin_users` and `officehours_admin_allowlist`. An ordinary student or anonymous user cannot elevate privileges via client-side attributes.

---

## Step-by-Step Supabase Project Setup

### 1. Create a Supabase Project
1. Log in to [Supabase](https://app.supabase.com) and click **New Project**.
2. Choose a project name (e.g., `yunusserhat-website`), set a secure database password, and select the region nearest to Turkey (e.g. Frankfurt `eu-central-1`).

### 2. Run Database Migrations
1. In the Supabase Dashboard, navigate to **SQL Editor** > **New Query**.
2. Copy the entire contents of [20260910000001_officehours_schema.sql](migrations/20260910000001_officehours_schema.sql).
3. Paste into the SQL editor and click **Run**.
4. Confirm that all tables, views, RLS policies, triggers, and RPC functions were created successfully.

### 3. Configure Supabase Authentication (Email OTP)
1. Go to **Authentication** > **Providers** > **Email**:
   - **Enable Email Provider**: ON
   - **Confirm email**: ON
   - **Secure email change**: ON
2. Under **Authentication** > **URL Configuration**:
   - **Site URL**: `https://yunusserhat.com`
   - **Redirect URLs**:
     - `https://yunusserhat.com/officehours/`
     - `https://yunusserhat.com/officehours/admin/`
     - `http://localhost:1313/officehours/` (for local development)
     - `http://localhost:1313/officehours/admin/`
3. Under **Authentication** > **Email Templates**:
   - Customize the "Magic Link" or "Confirmation / OTP" subject and body to academic branding (e.g. "Yunus Serhat Bıçakçı - Office Hours Verification Code: {{ .Token }}").

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

> [!WARNING]
> **NEVER** add `service_role` keys or database passwords to Netlify client-facing environment variables or commit them to git.

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

- **OTP Email Not Received**: Check Supabase **Authentication** > **Logs**. Ensure the student email is exactly `@marun.edu.tr` or `@marmara.edu.tr`. Non-matching domains are intentionally rejected at the database trigger before any email is dispatched.
- **"Unauthorized Admin Access"**: Verify that your email is listed in `public.officehours_admin_allowlist` (matching case-insensitively) or run:
  ```sql
  SELECT public.is_admin();
  ```
- **Timezone Inconsistencies**: All internal timestamps are stored in UTC (`timestamptz`). When displayed to students and admins, they are formatted in the academic timezone `Europe/Istanbul` (UTC+3).
