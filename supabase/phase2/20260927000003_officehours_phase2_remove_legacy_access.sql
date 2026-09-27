-- ============================================================================
-- Office Hours Hardening, Phase 2 of 2 (removes legacy access)
--
-- Apply ONLY after Phase 1 is live AND the new site release has been verified
-- in production (student schedule loads from the masked views, booking,
-- cancellation, admin editing, and notification mail all work).
--
-- After this runs, a pre-release booking page can no longer load the schedule,
-- so do not roll the Netlify deploy back to a build older than the release.
--
-- This file lives outside supabase/migrations/ on purpose, so that
-- `supabase db push` cannot apply it together with Phase 1. Once it has been
-- applied in production, move it into supabase/migrations/ unchanged.
-- ============================================================================

-- 0. Preconditions: Phase 1 must already be in place.
DO $$
DECLARE
  v_missing text;
  v_referencing text;
BEGIN
  SELECT string_agg(required.name, ', ')
    INTO v_missing
  FROM (VALUES
    ('public.officehours_public_availability_rules'),
    ('public.officehours_public_date_overrides'),
    ('public.officehours_public_availability_exceptions')
  ) AS required(name)
  WHERE to_regclass(required.name) IS NULL;

  IF v_missing IS NOT NULL THEN
    RAISE EXCEPTION 'Phase 1 has not been applied (missing: %).', v_missing;
  END IF;

  IF to_regprocedure('public.check_and_record_otp_rate_limit(text)') IS NOT NULL
     OR to_regprocedure('public.get_otp_rate_limit_status(text)') IS NOT NULL
     OR NOT EXISTS (
       SELECT 1
       FROM pg_proc
       WHERE oid = 'public.book_officehours_appointment(timestamptz, timestamptz, text, text, text)'::regprocedure
         AND prosecdef
         AND prosrc LIKE '%pg_advisory_xact_lock%'
     ) THEN
    RAISE EXCEPTION 'Phase 1 has not been applied (OTP limiter RPCs or unhardened booking RPC still present).';
  END IF;

  -- Dropping the retired limiter table must not break a function that still
  -- reads it, such as the auth.users trigger function.
  SELECT string_agg(p.oid::regprocedure::text, ', ')
    INTO v_referencing
  FROM pg_proc AS p
  JOIN pg_namespace AS n ON n.oid = p.pronamespace
  WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
    AND p.prosrc ILIKE '%officehours_email_rate_limits%';

  IF v_referencing IS NOT NULL THEN
    RAISE EXCEPTION 'Functions still reference officehours_email_rate_limits: %', v_referencing;
  END IF;
END;
$$;

-- 1. Remove the legacy public reads of the raw schedule tables. These exposed
-- online meeting links, mixed-mode locations, and blocked-date reasons to
-- every visitor; the booking page now reads the masked views instead.
DROP POLICY IF EXISTS "Public can view active availability rules"
  ON public.officehours_availability_rules;
DROP POLICY IF EXISTS "Public can view exceptions"
  ON public.officehours_availability_exceptions;
DROP POLICY IF EXISTS "Public can view active date overrides"
  ON public.officehours_date_overrides;

REVOKE ALL ON TABLE public.officehours_availability_rules FROM PUBLIC, anon;
REVOKE ALL ON TABLE public.officehours_availability_exceptions FROM PUBLIC, anon;
REVOKE ALL ON TABLE public.officehours_date_overrides FROM PUBLIC, anon;

-- 2. Drop the retired OTP limiter table (emptied and made private in Phase 1).
DROP TABLE IF EXISTS public.officehours_email_rate_limits;

-- 3. Postcondition: each raw schedule table is left with only its
-- administrator policy.
DO $$
DECLARE
  v_extra text;
BEGIN
  SELECT string_agg(format('%s: "%s"', p.tablename, p.policyname), '; ')
    INTO v_extra
  FROM pg_policies AS p
  WHERE p.schemaname = 'public'
    AND p.tablename IN (
      'officehours_availability_rules',
      'officehours_availability_exceptions',
      'officehours_date_overrides'
    )
    AND p.policyname NOT IN (
      'Admin can manage availability rules',
      'Admin can manage exceptions',
      'Admin can manage date overrides'
    );

  IF v_extra IS NOT NULL THEN
    RAISE EXCEPTION 'Unexpected policies remain on raw schedule tables: %', v_extra;
  END IF;
END;
$$;
