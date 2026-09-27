-- Read-only inspection of the LIVE office-hours schema before Phase 1 and
-- Phase 2 (see supabase/RELEASE_CHECKLIST.md). Run it in the Supabase SQL
-- editor or with psql against production. It changes nothing.
--
-- The output contains function source and row counts. Do not commit it. The
-- webhook secret itself is never printed, only its SHA-256 fingerprint.
BEGIN READ ONLY;

-- 1. Source of every function Phase 1 replaces, drops, or relies on.
-- Compare each definition with the repository before applying Phase 1:
-- Phase 1 redefines these from the repository, so any intentional production
-- change would be overwritten.
SELECT
  p.oid::regprocedure AS function,
  p.prosecdef AS security_definer,
  p.proconfig AS settings,
  pg_get_functiondef(p.oid) AS definition
FROM pg_proc AS p
JOIN pg_namespace AS n ON n.oid = p.pronamespace
WHERE (n.nspname = 'public' AND p.proname IN (
        'is_admin',
        'is_allowed_email_domain',
        'extract_email_domain',
        'trg_fn_on_auth_user_created',
        'trg_fn_sync_admin_user',
        'book_officehours_appointment',
        'cancel_officehours_appointment',
        'check_and_record_otp_rate_limit',
        'get_otp_rate_limit_status'))
   OR (n.nspname = 'internal' AND p.proname LIKE 'get_officehours\_%')
ORDER BY 1;

-- 2. Every RLS policy on office-hours tables. Phase 1 aborts if a policy
-- name is not in its reviewed list; decide about each unexpected one first.
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename LIKE 'officehours\_%'
ORDER BY tablename, policyname;

-- 3. RLS switched on for every office-hours table.
SELECT c.relname, c.relkind, c.relrowsecurity AS rls_enabled, c.relforcerowsecurity AS rls_forced
FROM pg_class AS c
WHERE c.relnamespace = 'public'::regnamespace
  AND c.relname LIKE 'officehours\_%'
  AND c.relkind IN ('r', 'v')
ORDER BY c.relname;

-- 4. Privileges held by the API roles.
SELECT table_name, grantee, string_agg(privilege_type, ', ' ORDER BY privilege_type) AS privileges
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name LIKE 'officehours\_%'
  AND grantee IN ('PUBLIC', 'anon', 'authenticated', 'service_role')
GROUP BY table_name, grantee
ORDER BY table_name, grantee;

-- 5. Extra overloads of the booking/cancellation RPCs (Phase 1 requires one each).
SELECT p.oid::regprocedure AS overload
FROM pg_proc AS p
WHERE p.pronamespace = 'public'::regnamespace
  AND p.proname IN ('book_officehours_appointment', 'cancel_officehours_appointment')
ORDER BY 1;

-- 6. Anything else that still uses the OTP limiter Phase 1 removes.
SELECT p.oid::regprocedure AS function_using_limiter
FROM pg_proc AS p
JOIN pg_namespace AS n ON n.oid = p.pronamespace
WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
  AND (p.prosrc ILIKE '%officehours_email_rate_limits%'
       OR p.prosrc ILIKE '%check_and_record_otp_rate_limit%'
       OR p.prosrc ILIKE '%get_otp_rate_limit_status%');

-- 7. Overlap guard and data it must accept. A non-zero count means Phase 1
-- cannot create the exclusion constraint until the overlap is resolved.
SELECT conname, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.officehours_appointments'::regclass
  AND contype IN ('x', 'u');

SELECT count(*) AS overlapping_active_booking_pairs
FROM public.officehours_appointments AS a
JOIN public.officehours_appointments AS b
  ON a.id < b.id
 AND a.status = 'booked'
 AND b.status = 'booked'
 AND tstzrange(a.slot_start, a.slot_end, '[)') && tstzrange(b.slot_start, b.slot_end, '[)');

-- 8. Triggers on auth.users and on appointments. For Database Webhooks this
-- shows the target URL and the custom header names, plus a SHA-256
-- fingerprint of x-officehours-webhook-secret. Compare the fingerprint with
-- the Netlify value locally:  printf %s "$OFFICEHOURS_WEBHOOK_SECRET" | sha256sum
WITH triggers AS (
  SELECT
    t.tgrelid::regclass AS on_table,
    t.tgname,
    t.tgenabled,
    t.tgfoid::regproc::text AS function,
    string_to_array(encode(t.tgargs, 'escape'), '\000') AS args
  FROM pg_trigger AS t
  WHERE t.tgrelid IN ('auth.users'::regclass, 'public.officehours_appointments'::regclass)
    AND NOT t.tgisinternal
)
SELECT
  on_table,
  tgname,
  tgenabled,
  function,
  CASE WHEN function LIKE '%http_request' THEN args[1] END AS webhook_url,
  CASE WHEN function LIKE '%http_request' THEN
    (SELECT array_agg(key ORDER BY key) FROM jsonb_object_keys(args[3]::jsonb) AS key)
  END AS webhook_header_names,
  CASE WHEN function LIKE '%http_request' THEN
    encode(sha256(convert_to(args[3]::jsonb ->> 'x-officehours-webhook-secret', 'UTF8')), 'hex')
  END AS webhook_secret_sha256
FROM triggers
ORDER BY on_table::text, tgname;

ROLLBACK;
