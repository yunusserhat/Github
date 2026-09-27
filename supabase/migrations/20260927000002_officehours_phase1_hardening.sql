-- ============================================================================
-- Office Hours Hardening, Phase 1 of 2 (backward compatible)
--
-- Apply this BEFORE deploying the matching site and Netlify function release.
-- It adds everything the new release needs and closes every hole that the
-- currently deployed pages do not depend on. It deliberately leaves the legacy
-- public reads of the raw schedule tables in place, because the old booking
-- page still reads them. Phase 2 (supabase/phase2/) removes that access after
-- the new release has been verified in production.
--
-- Nothing in this file grants the legacy access, so re-running it after
-- Phase 2 does not reopen it. Run the whole file in one transaction; the
-- precondition block below aborts it if the live schema has drifted.
-- ============================================================================

-- 0. Preconditions: stop before changing anything if production differs from
-- the schema this migration was reviewed against.
DO $$
DECLARE
  v_missing text;
  v_unexpected text;
  v_count integer;
BEGIN
  SELECT string_agg(required.name, ', ')
    INTO v_missing
  FROM (VALUES
    ('public.officehours_settings'),
    ('public.officehours_availability_rules'),
    ('public.officehours_availability_exceptions'),
    ('public.officehours_date_overrides'),
    ('public.officehours_admin_allowlist'),
    ('public.officehours_admin_users'),
    ('public.officehours_appointments'),
    ('public.officehours_booked_slots')
  ) AS required(name)
  WHERE to_regclass(required.name) IS NULL;

  IF v_missing IS NOT NULL THEN
    RAISE EXCEPTION 'Office-hours objects missing: %. Apply the base schema first.', v_missing;
  END IF;

  -- Another overload would keep the old, unhardened logic callable.
  SELECT count(*) INTO v_count
  FROM pg_proc AS p
  JOIN pg_namespace AS n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
    AND p.proname IN ('book_officehours_appointment', 'cancel_officehours_appointment');

  IF v_count <> 2
     OR to_regprocedure('public.book_officehours_appointment(timestamptz, timestamptz, text, text, text)') IS NULL
     OR to_regprocedure('public.cancel_officehours_appointment(uuid, text)') IS NULL THEN
    RAISE EXCEPTION 'Unexpected booking/cancellation RPC overloads. Inspect them before applying this migration.';
  END IF;

  -- Policies outside the reviewed set could keep exposing rows after this
  -- migration, because RLS combines permissive policies with OR.
  SELECT string_agg(format('%s: "%s"', p.tablename, p.policyname), '; ' ORDER BY p.tablename, p.policyname)
    INTO v_unexpected
  FROM pg_policies AS p
  WHERE p.schemaname = 'public'
    AND p.tablename LIKE 'officehours\_%'
    AND (p.tablename, p.policyname) NOT IN (VALUES
      ('officehours_settings', 'Public can view settings'),
      ('officehours_settings', 'Admin can update settings'),
      ('officehours_availability_rules', 'Public can view active availability rules'),
      ('officehours_availability_rules', 'Admin can manage availability rules'),
      ('officehours_availability_rules', 'Admin can view availability rules'),
      ('officehours_availability_exceptions', 'Public can view exceptions'),
      ('officehours_availability_exceptions', 'Admin can manage exceptions'),
      ('officehours_availability_exceptions', 'Admin can view exceptions'),
      ('officehours_date_overrides', 'Public can view active date overrides'),
      ('officehours_date_overrides', 'Admin can manage date overrides'),
      ('officehours_date_overrides', 'Admin can view date overrides'),
      ('officehours_admin_allowlist', 'Allowlist read access'),
      ('officehours_admin_allowlist', 'Allowlist admin manage'),
      ('officehours_admin_allowlist', 'Admin can view allowlist'),
      ('officehours_admin_allowlist', 'User can check own allowlist'),
      ('officehours_admin_users', 'Admin can view admin users'),
      ('officehours_admin_users', 'Admin can manage admin users'),
      ('officehours_email_rate_limits', 'Admin can view rate limits'),
      ('officehours_appointments', 'Students view own appointments, admin views all'),
      ('officehours_appointments', 'Students insert own appointment with allowed email'),
      ('officehours_appointments', 'Students cancel own future appointment')
    );

  IF v_unexpected IS NOT NULL THEN
    RAISE EXCEPTION 'Unexpected office-hours RLS policies: %. Review or remove them before applying this migration.', v_unexpected;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgrelid = 'auth.users'::regclass
      AND tgname = 'trg_auth_user_domain_check'
      AND NOT tgisinternal
  ) THEN
    RAISE NOTICE 'auth.users domain trigger is missing; the booking RPC still enforces the email domain.';
  END IF;
END;
$$;

ALTER TABLE public.officehours_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officehours_availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officehours_availability_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officehours_date_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officehours_admin_allowlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officehours_admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officehours_appointments ENABLE ROW LEVEL SECURITY;

-- 1. Verify (or create) the database-enforced active-slot overlap guard.
-- Range GiST operator classes are built into PostgreSQL; btree_gist is not
-- required for this range-only exclusion constraint. A partial start-time
-- index alone is not sufficient protection.
DO $$
DECLARE
  v_constraint_definition text;
BEGIN
  SELECT pg_get_constraintdef(c.oid)
    INTO v_constraint_definition
  FROM pg_constraint AS c
  WHERE c.conrelid = 'public.officehours_appointments'::regclass
    AND c.conname = 'no_overlapping_officehours_active_appointments';

  IF v_constraint_definition IS NULL THEN
    ALTER TABLE public.officehours_appointments
      ADD CONSTRAINT no_overlapping_officehours_active_appointments
      EXCLUDE USING gist (
        tstzrange(slot_start, slot_end, '[)') WITH &&
      ) WHERE (status = 'booked');
  ELSIF lower(v_constraint_definition) !~
      'exclude using gist.*tstzrange\(slot_start, slot_end.*\).*&&.*status.*booked' THEN
    RAISE EXCEPTION
      'Existing office-hours overlap constraint has an unexpected definition: %',
      v_constraint_definition;
  END IF;
END;
$$;

-- 2. Security-definer helpers, redefined from known source with an empty
-- search path. Redefining (instead of only altering the search path) makes
-- the result independent of whatever body is currently deployed.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
DECLARE
  v_uid uuid;
  v_email text;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RETURN false;
  END IF;

  v_email := lower(trim(coalesce(auth.jwt() ->> 'email', '')));
  IF v_email = '' THEN
    SELECT lower(trim(u.email)) INTO v_email FROM auth.users AS u WHERE u.id = v_uid;
  END IF;

  IF v_email = 'yunus.serhat@marmara.edu.tr' THEN
    RETURN true;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.officehours_admin_allowlist AS al
    WHERE lower(trim(al.email)) = v_email
  ) OR EXISTS (
    SELECT 1 FROM public.officehours_admin_users AS au
    WHERE au.user_id = v_uid
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Domain enforcement only. The previous version also refused sign-ups while
-- an anonymous, unauthenticated rate-limit record was active for the address,
-- which let anyone lock another person out. Email sending is now throttled by
-- Supabase Auth itself (see the release checklist).
CREATE OR REPLACE FUNCTION public.trg_fn_on_auth_user_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_email text;
  v_is_admin_candidate boolean;
BEGIN
  IF NEW.email IS NULL THEN
    RETURN NEW;
  END IF;

  v_user_email := lower(trim(NEW.email));

  SELECT EXISTS (
    SELECT 1 FROM public.officehours_admin_allowlist AS al
    WHERE lower(trim(al.email)) = v_user_email
  ) INTO v_is_admin_candidate;

  IF NOT v_is_admin_candidate AND NOT public.is_allowed_email_domain(v_user_email) THEN
    RAISE EXCEPTION 'Registration rejected: Email "%" is not authorized. Only @marun.edu.tr and @marmara.edu.tr email addresses may create accounts.', v_user_email;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_fn_sync_admin_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_email text;
BEGIN
  IF NEW.email IS NULL THEN
    RETURN NEW;
  END IF;

  v_user_email := lower(trim(NEW.email));

  IF EXISTS (
    SELECT 1 FROM public.officehours_admin_allowlist AS al
    WHERE lower(trim(al.email)) = v_user_email
  ) THEN
    INSERT INTO public.officehours_admin_users (user_id, email)
    VALUES (NEW.id, v_user_email)
    ON CONFLICT (user_id) DO UPDATE SET email = EXCLUDED.email;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Never block authentication if secondary admin tracking fails.
    RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.trg_fn_on_auth_user_created() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trg_fn_sync_admin_user() FROM PUBLIC, anon, authenticated;

CREATE SCHEMA IF NOT EXISTS internal;
GRANT USAGE ON SCHEMA internal TO anon, authenticated;

CREATE OR REPLACE FUNCTION internal.get_officehours_booked_slots()
RETURNS TABLE (slot_start timestamptz, slot_end timestamptz)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
  SELECT a.slot_start, a.slot_end
  FROM public.officehours_appointments AS a
  WHERE a.status = 'booked';
$$;

REVOKE EXECUTE ON FUNCTION internal.get_officehours_booked_slots() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION internal.get_officehours_booked_slots() TO anon, authenticated;
REVOKE ALL ON public.officehours_booked_slots FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.officehours_booked_slots TO anon, authenticated;

-- 3. Retire the database-side OTP limiter. Both RPCs were callable by anyone
-- for any string: they let one visitor exhaust another person's allowance,
-- filled a table with arbitrary values, revealed whether an address had
-- recently asked for a code, raced on concurrent first requests, and could be
-- bypassed by calling Supabase Auth directly. The deployed pages ignore an
-- error from these RPCs and continue to Supabase Auth, so removing them is
-- compatible. The emptied table is dropped in Phase 2.
DROP FUNCTION IF EXISTS public.check_and_record_otp_rate_limit(text);
DROP FUNCTION IF EXISTS public.get_otp_rate_limit_status(text);

DO $$
BEGIN
  IF to_regclass('public.officehours_email_rate_limits') IS NOT NULL THEN
    DELETE FROM public.officehours_email_rate_limits;
    DROP POLICY IF EXISTS "Admin can view rate limits" ON public.officehours_email_rate_limits;
    REVOKE ALL ON TABLE public.officehours_email_rate_limits FROM PUBLIC, anon, authenticated;
  END IF;
END;
$$;

-- 4. Booking RPC with a transaction-scoped per-student lock. The lock closes
-- the race between the active/rolling-limit reads and the INSERT when the
-- same student submits two bookings concurrently.
CREATE OR REPLACE FUNCTION public.book_officehours_appointment(
  p_slot_start timestamptz,
  p_slot_end timestamptz,
  p_topic text,
  p_note text DEFAULT '',
  p_meeting_type text DEFAULT 'office'
)
RETURNS jsonb AS $$
DECLARE
  v_student_id uuid;
  v_student_email text;
  v_settings public.officehours_settings%ROWTYPE;
  v_duration_min integer;
  v_dow integer;
  v_slot_date date;
  v_slot_end_date date;
  v_slot_start_time time;
  v_slot_end_time time;
  v_slot_step_seconds bigint;
  v_active_future_count integer;
  v_rolling_count integer;
  v_new_appointment public.officehours_appointments%ROWTYPE;
  v_allowed_meeting_type text;
  v_location_or_link text := '';
  v_requested_type text;
BEGIN
  v_student_id := auth.uid();
  IF v_student_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to book office hours.';
  END IF;

  v_student_email := lower(trim(coalesce(auth.jwt() ->> 'email', '')));
  IF NOT public.is_allowed_email_domain(v_student_email) THEN
    RAISE EXCEPTION 'Only verified @marun.edu.tr and @marmara.edu.tr accounts may book appointments.';
  END IF;

  -- Transaction-level advisory locks are released automatically at commit or
  -- rollback and serialize limit checks for this student only.
  PERFORM pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('officehours-student:' || v_student_id::text, 0)
  );

  v_requested_type := lower(trim(coalesce(p_meeting_type, 'office')));
  IF v_requested_type NOT IN ('office', 'online') THEN
    v_requested_type := 'office';
  END IF;

  SELECT * INTO v_settings
  FROM public.officehours_settings
  WHERE id = 1;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'System settings configuration missing.';
  END IF;

  IF NOT v_settings.is_booking_enabled THEN
    RAISE EXCEPTION 'Office hours bookings are currently suspended.';
  END IF;

  IF p_slot_start IS NULL
     OR p_slot_end IS NULL
     OR p_slot_end <= p_slot_start
     OR (p_slot_end - p_slot_start)
        <> make_interval(mins => v_settings.meeting_duration_minutes) THEN
    v_duration_min := coalesce(
      round(extract(epoch FROM (p_slot_end - p_slot_start)) / 60.0),
      0
    );
    RAISE EXCEPTION
      'Invalid meeting duration: % minutes. Configured duration is % minutes.',
      v_duration_min, v_settings.meeting_duration_minutes;
  END IF;

  IF p_slot_start < (now() + (v_settings.min_booking_notice_hours || ' hours')::interval) THEN
    RAISE EXCEPTION
      'Appointments must be booked at least % hours in advance.',
      v_settings.min_booking_notice_hours;
  END IF;

  v_slot_date := (p_slot_start AT TIME ZONE v_settings.timezone)::date;
  v_slot_end_date := (p_slot_end AT TIME ZONE v_settings.timezone)::date;
  v_dow := extract(DOW FROM (p_slot_start AT TIME ZONE v_settings.timezone));
  v_slot_start_time := (p_slot_start AT TIME ZONE v_settings.timezone)::time;
  v_slot_end_time := (p_slot_end AT TIME ZONE v_settings.timezone)::time;

  -- The browser creates minute-aligned slots on one local calendar date.
  -- Reject seconds, cross-midnight intervals, and any other shape that the
  -- displayed schedule cannot produce.
  IF v_slot_end_date <> v_slot_date
     OR extract(second FROM v_slot_start_time) <> 0
     OR extract(second FROM v_slot_end_time) <> 0 THEN
    RAISE EXCEPTION
      'Invalid slot alignment: choose one of the displayed office-hours slots.';
  END IF;

  v_slot_step_seconds :=
    (v_settings.meeting_duration_minutes + v_settings.buffer_minutes) * 60;

  IF v_settings.semester_start_date IS NOT NULL
     AND v_slot_date < v_settings.semester_start_date THEN
    RAISE EXCEPTION 'The requested date is before the start of the current semester schedule.';
  END IF;
  IF v_settings.semester_end_date IS NOT NULL
     AND v_slot_date > v_settings.semester_end_date THEN
    RAISE EXCEPTION 'The requested date is after the end of the current semester schedule.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.officehours_availability_exceptions
    WHERE exception_date = v_slot_date
      AND is_blocked = true
  ) THEN
    RAISE EXCEPTION 'The selected date is marked as unavailable.';
  END IF;

  SELECT meeting_type, coalesce(location_or_link, '')
    INTO v_allowed_meeting_type, v_location_or_link
  FROM public.officehours_date_overrides
  WHERE override_date = v_slot_date
    AND is_active = true
    AND start_time <= v_slot_start_time
    AND end_time >= v_slot_end_time
    AND mod(
      extract(epoch FROM (v_slot_start_time - start_time))::bigint,
      v_slot_step_seconds
    ) = 0
  ORDER BY start_time ASC
  LIMIT 1;

  IF v_allowed_meeting_type IS NULL THEN
    SELECT meeting_type, coalesce(location_or_link, '')
      INTO v_allowed_meeting_type, v_location_or_link
    FROM public.officehours_availability_rules
    WHERE day_of_week = v_dow
      AND is_active = true
      AND start_time <= v_slot_start_time
      AND end_time >= v_slot_end_time
      AND mod(
        extract(epoch FROM (v_slot_start_time - start_time))::bigint,
        v_slot_step_seconds
      ) = 0
    ORDER BY start_time ASC
    LIMIT 1;
  END IF;

  IF v_allowed_meeting_type IS NULL THEN
    IF EXISTS (
      SELECT 1
      FROM public.officehours_date_overrides
      WHERE override_date = v_slot_date
        AND is_active = true
        AND start_time <= v_slot_start_time
        AND end_time >= v_slot_end_time
    ) OR EXISTS (
      SELECT 1
      FROM public.officehours_availability_rules
      WHERE day_of_week = v_dow
        AND is_active = true
        AND start_time <= v_slot_start_time
        AND end_time >= v_slot_end_time
    ) THEN
      RAISE EXCEPTION
        'Invalid slot alignment: choose one of the displayed office-hours slots.';
    END IF;
    RAISE EXCEPTION 'The requested time is outside scheduled office hours for this day.';
  END IF;

  IF v_allowed_meeting_type = 'office' AND v_requested_type = 'online' THEN
    RAISE EXCEPTION 'Bu randevu saati sadece okulda/ofiste yüz yüze görüşmeye uygundur.';
  ELSIF v_allowed_meeting_type = 'online' AND v_requested_type = 'office' THEN
    RAISE EXCEPTION 'Bu randevu saati sadece online (çevrim içi) görüşmeye uygundur.';
  END IF;

  SELECT count(*) INTO v_active_future_count
  FROM public.officehours_appointments
  WHERE student_id = v_student_id
    AND status = 'booked'
    AND slot_end > now();

  IF v_active_future_count >= v_settings.max_active_bookings_per_student THEN
    RAISE EXCEPTION
      'Booking limit reached: You already have % active upcoming appointment. Please attend or cancel it before booking another.',
      v_active_future_count;
  END IF;

  SELECT count(*) INTO v_rolling_count
  FROM public.officehours_appointments
  WHERE student_id = v_student_id
    AND status = 'booked'
    AND slot_start >= (p_slot_start - (v_settings.rolling_days_limit || ' days')::interval)
    AND slot_start <= (p_slot_start + (v_settings.rolling_days_limit || ' days')::interval);

  IF v_rolling_count >= v_settings.max_bookings_in_rolling_days THEN
    RAISE EXCEPTION
      'Fair access rule: Maximum % appointment allowed within a %-day period.',
      v_settings.max_bookings_in_rolling_days,
      v_settings.rolling_days_limit;
  END IF;

  BEGIN
    INSERT INTO public.officehours_appointments (
      student_id,
      student_email,
      slot_start,
      slot_end,
      topic,
      note,
      meeting_type,
      location_or_link,
      status
    )
    VALUES (
      v_student_id,
      v_student_email,
      p_slot_start,
      p_slot_end,
      trim(p_topic),
      trim(coalesce(p_note, '')),
      v_requested_type,
      v_location_or_link,
      'booked'
    )
    RETURNING * INTO v_new_appointment;
  EXCEPTION
    WHEN exclusion_violation OR unique_violation THEN
      RAISE EXCEPTION
        'This appointment slot was just reserved by another student. Please choose a different available time.';
  END;

  RETURN jsonb_build_object(
    'success', true,
    'appointment_id', v_new_appointment.id,
    'slot_start', v_new_appointment.slot_start,
    'slot_end', v_new_appointment.slot_end,
    'topic', v_new_appointment.topic,
    'meeting_type', v_new_appointment.meeting_type,
    'location_or_link', v_new_appointment.location_or_link
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 5. Cancellation is server-owned as well, and serialized with any other
-- change to the same appointment row.
CREATE OR REPLACE FUNCTION public.cancel_officehours_appointment(
  p_appointment_id uuid,
  p_reason text DEFAULT ''
)
RETURNS jsonb AS $$
DECLARE
  v_caller_id uuid;
  v_is_admin boolean;
  v_appt public.officehours_appointments%ROWTYPE;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  v_is_admin := public.is_admin();

  SELECT * INTO v_appt
  FROM public.officehours_appointments
  WHERE id = p_appointment_id
    AND (v_is_admin OR student_id = v_caller_id)
  FOR UPDATE;

  IF NOT FOUND THEN
    IF v_is_admin THEN
      RAISE EXCEPTION 'Appointment not found.';
    END IF;
    RAISE EXCEPTION 'Unauthorized: You may only cancel your own appointments.';
  END IF;

  IF v_appt.status <> 'booked' THEN
    RAISE EXCEPTION 'This appointment is already cancelled.';
  END IF;

  IF v_is_admin THEN
    UPDATE public.officehours_appointments
    SET status = 'cancelled_by_admin', updated_at = now()
    WHERE id = p_appointment_id;
  ELSE
    IF v_appt.slot_start <= now() THEN
      RAISE EXCEPTION 'Past appointments cannot be cancelled.';
    END IF;

    UPDATE public.officehours_appointments
    SET status = 'cancelled_by_student', updated_at = now()
    WHERE id = p_appointment_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'appointment_id', p_appointment_id,
    'status', CASE WHEN v_is_admin THEN 'cancelled_by_admin' ELSE 'cancelled_by_student' END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

REVOKE EXECUTE ON FUNCTION public.book_officehours_appointment(
  timestamptz, timestamptz, text, text, text
) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.book_officehours_appointment(
  timestamptz, timestamptz, text, text, text
) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.cancel_officehours_appointment(uuid, text)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cancel_officehours_appointment(uuid, text)
  TO authenticated;

-- 6. Masked read-only schedule views for the new booking page. The internal
-- security-definer helpers bypass the raw-table RLS policies but return only
-- active schedule rows and never return online meeting links, locations for
-- mixed-mode rows, or blocked-date reasons.
CREATE OR REPLACE FUNCTION internal.get_officehours_public_availability_rules()
RETURNS TABLE (
  day_of_week integer,
  start_time time,
  end_time time,
  meeting_type text,
  is_active boolean,
  location_or_link text
)
SECURITY DEFINER
SET search_path = ''
LANGUAGE sql
STABLE
AS $$
  SELECT
    r.day_of_week,
    r.start_time,
    r.end_time,
    r.meeting_type,
    r.is_active,
    CASE
      WHEN r.meeting_type = 'office' THEN coalesce(r.location_or_link, '')
      ELSE ''
    END AS location_or_link
  FROM public.officehours_availability_rules AS r
  WHERE r.is_active = true;
$$;

CREATE OR REPLACE FUNCTION internal.get_officehours_public_date_overrides()
RETURNS TABLE (
  override_date date,
  start_time time,
  end_time time,
  meeting_type text,
  is_active boolean,
  location_or_link text
)
SECURITY DEFINER
SET search_path = ''
LANGUAGE sql
STABLE
AS $$
  SELECT
    o.override_date,
    o.start_time,
    o.end_time,
    o.meeting_type,
    o.is_active,
    CASE
      WHEN o.meeting_type = 'office' THEN coalesce(o.location_or_link, '')
      ELSE ''
    END AS location_or_link
  FROM public.officehours_date_overrides AS o
  WHERE o.is_active = true;
$$;

CREATE OR REPLACE FUNCTION internal.get_officehours_public_availability_exceptions()
RETURNS TABLE (
  exception_date date,
  is_blocked boolean
)
SECURITY DEFINER
SET search_path = ''
LANGUAGE sql
STABLE
AS $$
  SELECT e.exception_date, e.is_blocked
  FROM public.officehours_availability_exceptions AS e
  WHERE e.is_blocked = true;
$$;

REVOKE EXECUTE ON FUNCTION internal.get_officehours_public_availability_rules() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION internal.get_officehours_public_date_overrides() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION internal.get_officehours_public_availability_exceptions() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION internal.get_officehours_public_availability_rules() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION internal.get_officehours_public_date_overrides() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION internal.get_officehours_public_availability_exceptions() TO anon, authenticated;

CREATE OR REPLACE VIEW public.officehours_public_availability_rules
WITH (security_invoker = true)
AS
SELECT * FROM internal.get_officehours_public_availability_rules();

CREATE OR REPLACE VIEW public.officehours_public_date_overrides
WITH (security_invoker = true)
AS
SELECT * FROM internal.get_officehours_public_date_overrides();

CREATE OR REPLACE VIEW public.officehours_public_availability_exceptions
WITH (security_invoker = true)
AS
SELECT * FROM internal.get_officehours_public_availability_exceptions();

REVOKE ALL ON public.officehours_public_availability_rules FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.officehours_public_date_overrides FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.officehours_public_availability_exceptions FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.officehours_public_availability_rules TO anon, authenticated;
GRANT SELECT ON public.officehours_public_date_overrides TO anon, authenticated;
GRANT SELECT ON public.officehours_public_availability_exceptions TO anon, authenticated;

-- 7. Policies the final model depends on, recreated from known definitions
-- and limited to signed-in users. The three legacy "Public can view ..."
-- policies on the raw schedule tables are intentionally left untouched here;
-- the deployed booking page still needs them until Phase 2.
DROP POLICY IF EXISTS "Public can view settings" ON public.officehours_settings;
CREATE POLICY "Public can view settings"
  ON public.officehours_settings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin can update settings" ON public.officehours_settings;
CREATE POLICY "Admin can update settings"
  ON public.officehours_settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can view availability rules" ON public.officehours_availability_rules;
DROP POLICY IF EXISTS "Admin can manage availability rules" ON public.officehours_availability_rules;
CREATE POLICY "Admin can manage availability rules"
  ON public.officehours_availability_rules FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can view exceptions" ON public.officehours_availability_exceptions;
DROP POLICY IF EXISTS "Admin can manage exceptions" ON public.officehours_availability_exceptions;
CREATE POLICY "Admin can manage exceptions"
  ON public.officehours_availability_exceptions FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can view date overrides" ON public.officehours_date_overrides;
DROP POLICY IF EXISTS "Admin can manage date overrides" ON public.officehours_date_overrides;
CREATE POLICY "Admin can manage date overrides"
  ON public.officehours_date_overrides FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Appointments: reads through RLS, every write through the two RPCs above.
-- The deployed pages already book and cancel only through those RPCs.
DROP POLICY IF EXISTS "Students insert own appointment with allowed email" ON public.officehours_appointments;
DROP POLICY IF EXISTS "Students cancel own future appointment" ON public.officehours_appointments;
DROP POLICY IF EXISTS "Students view own appointments, admin views all" ON public.officehours_appointments;
CREATE POLICY "Students view own appointments, admin views all"
  ON public.officehours_appointments FOR SELECT
  TO authenticated
  USING (public.is_admin() OR auth.uid() = student_id);

-- Admin allowlist contents are private to administrators.
DROP POLICY IF EXISTS "Admin can view allowlist" ON public.officehours_admin_allowlist;
DROP POLICY IF EXISTS "User can check own allowlist" ON public.officehours_admin_allowlist;
DROP POLICY IF EXISTS "Allowlist read access" ON public.officehours_admin_allowlist;
DROP POLICY IF EXISTS "Allowlist admin manage" ON public.officehours_admin_allowlist;
CREATE POLICY "Allowlist admin manage"
  ON public.officehours_admin_allowlist FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can view admin users" ON public.officehours_admin_users;
CREATE POLICY "Admin can view admin users"
  ON public.officehours_admin_users FOR SELECT
  TO authenticated
  USING (public.is_admin() OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin can manage admin users" ON public.officehours_admin_users;
CREATE POLICY "Admin can manage admin users"
  ON public.officehours_admin_users FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 8. Table privileges. Only write privileges the deployed pages never use are
-- removed from anonymous users here; the anonymous and student SELECT access
-- to the raw schedule tables is removed in Phase 2.
REVOKE ALL ON TABLE public.officehours_appointments FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.officehours_appointments TO authenticated;
GRANT ALL ON TABLE public.officehours_appointments TO service_role;

REVOKE ALL ON TABLE public.officehours_admin_allowlist FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.officehours_admin_allowlist TO authenticated;
GRANT ALL ON TABLE public.officehours_admin_allowlist TO service_role;

REVOKE ALL ON TABLE public.officehours_admin_users FROM PUBLIC, anon;
REVOKE TRUNCATE, REFERENCES, TRIGGER ON TABLE public.officehours_admin_users FROM authenticated;
GRANT ALL ON TABLE public.officehours_admin_users TO service_role;

REVOKE ALL ON TABLE public.officehours_settings FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.officehours_settings TO anon, authenticated;
GRANT UPDATE ON TABLE public.officehours_settings TO authenticated;
GRANT ALL ON TABLE public.officehours_settings TO service_role;

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
  ON TABLE public.officehours_availability_rules FROM PUBLIC, anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
  ON TABLE public.officehours_availability_exceptions FROM PUBLIC, anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
  ON TABLE public.officehours_date_overrides FROM PUBLIC, anon;
REVOKE TRUNCATE, REFERENCES, TRIGGER
  ON TABLE public.officehours_availability_rules FROM authenticated;
REVOKE TRUNCATE, REFERENCES, TRIGGER
  ON TABLE public.officehours_availability_exceptions FROM authenticated;
REVOKE TRUNCATE, REFERENCES, TRIGGER
  ON TABLE public.officehours_date_overrides FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.officehours_availability_rules TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.officehours_availability_exceptions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.officehours_date_overrides TO authenticated;
GRANT ALL ON TABLE public.officehours_availability_rules TO service_role;
GRANT ALL ON TABLE public.officehours_availability_exceptions TO service_role;
GRANT ALL ON TABLE public.officehours_date_overrides TO service_role;
