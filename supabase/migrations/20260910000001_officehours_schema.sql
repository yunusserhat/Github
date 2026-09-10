-- ==============================================================================
-- Office Hours Booking System - Database Schema, Constraints & RLS Policies
-- Target Domains: marun.edu.tr and marmara.edu.tr
-- Concurrency: btree_gist interval exclusion & partial unique indexes
-- Privacy: Zero-PII public slot views; strictly scoped student access
-- ==============================================================================

-- 1. Optional Extensions (wrapped safely for Supabase environments)
-- Note: gen_random_uuid() is natively built into PostgreSQL 13+ without any extensions.
DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS "btree_gist" WITH SCHEMA extensions;
EXCEPTION
  WHEN OTHERS THEN
    -- If extension creation is restricted by transaction mode, it can be enabled via Supabase UI: Database > Extensions
    NULL;
END;
$$;

-- 2. Domain Extraction & Validation Functions
-- Extracts exact domain after the LAST '@', trimmed and lowercased
CREATE OR REPLACE FUNCTION public.extract_email_domain(email_address text)
RETURNS text AS $$
DECLARE
  clean_email text;
  at_pos integer;
BEGIN
  IF email_address IS NULL THEN
    RETURN '';
  END IF;
  clean_email := lower(trim(email_address));
  at_pos := length(clean_email) - position('@' in reverse(clean_email)) + 1;
  IF at_pos <= 1 OR at_pos >= length(clean_email) THEN
    RETURN '';
  END IF;
  RETURN substring(clean_email from at_pos + 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Explicit domain allowlist: exact match against marun.edu.tr or marmara.edu.tr
CREATE OR REPLACE FUNCTION public.is_allowed_email_domain(email_address text)
RETURNS boolean AS $$
BEGIN
  RETURN public.extract_email_domain(email_address) IN ('marun.edu.tr', 'marmara.edu.tr');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3. Office Hours Settings (Singleton Configuration Table)
CREATE TABLE IF NOT EXISTS public.officehours_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  meeting_duration_minutes integer NOT NULL DEFAULT 20 CHECK (meeting_duration_minutes > 0),
  buffer_minutes integer NOT NULL DEFAULT 10 CHECK (buffer_minutes >= 0),
  min_booking_notice_hours integer NOT NULL DEFAULT 24 CHECK (min_booking_notice_hours >= 0),
  max_active_bookings_per_student integer NOT NULL DEFAULT 1 CHECK (max_active_bookings_per_student >= 1),
  rolling_days_limit integer NOT NULL DEFAULT 7 CHECK (rolling_days_limit >= 1),
  max_bookings_in_rolling_days integer NOT NULL DEFAULT 1 CHECK (max_bookings_in_rolling_days >= 1),
  timezone text NOT NULL DEFAULT 'Europe/Istanbul',
  semester_start_date date,
  semester_end_date date,
  is_booking_enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Weekly Recurring Availability Rules
-- day_of_week: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
CREATE TABLE IF NOT EXISTS public.officehours_availability_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT check_valid_time_window CHECK (start_time < end_time)
);

-- 5. Availability Exceptions / Blocked Dates
CREATE TABLE IF NOT EXISTS public.officehours_availability_exceptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exception_date date NOT NULL UNIQUE,
  reason text NOT NULL DEFAULT 'Unavailable',
  is_blocked boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. Rate Limiting Table to Prevent Email OTP Spam
CREATE TABLE IF NOT EXISTS public.officehours_email_rate_limits (
  email text PRIMARY KEY,
  attempts integer NOT NULL DEFAULT 1,
  window_start timestamptz NOT NULL DEFAULT now(),
  blocked_until timestamptz,
  last_attempt_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.officehours_email_rate_limits ENABLE ROW LEVEL SECURITY;

-- 7. Admin Allowlist & Active Admin Roles
CREATE TABLE IF NOT EXISTS public.officehours_admin_allowlist (
  email text PRIMARY KEY,
  notes text DEFAULT 'Office Hours Administrator',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.officehours_admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Check whether current authenticated user is an administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.officehours_admin_users WHERE user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.officehours_admin_allowlist
    WHERE lower(trim(email)) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 7. Appointments Table with Strong Concurrency & Integrity Constraints
CREATE TABLE IF NOT EXISTS public.officehours_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_email text NOT NULL,
  slot_start timestamptz NOT NULL,
  slot_end timestamptz NOT NULL,
  topic text NOT NULL,
  note text DEFAULT '',
  status text NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'cancelled_by_student', 'cancelled_by_admin')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT check_appointment_window CHECK (slot_start < slot_end),
  CONSTRAINT check_valid_student_domain CHECK (public.is_allowed_email_domain(student_email)),
  CONSTRAINT check_topic_length CHECK (length(trim(topic)) >= 2 AND length(topic) <= 250),
  CONSTRAINT check_note_length CHECK (note IS NULL OR length(note) <= 1000)
);

-- Exclusion constraint to guarantee NO two active appointments can ever overlap (if btree_gist is present)
DO $$
BEGIN
  ALTER TABLE public.officehours_appointments
    DROP CONSTRAINT IF EXISTS no_overlapping_officehours_active_appointments;

  ALTER TABLE public.officehours_appointments
    ADD CONSTRAINT no_overlapping_officehours_active_appointments
    EXCLUDE USING gist (
      tstzrange(slot_start, slot_end, '[)') WITH &&
    ) WHERE (status = 'booked');
EXCEPTION
  WHEN OTHERS THEN
    -- If btree_gist is not enabled, the partial unique index below ensures discrete slot collision protection
    NULL;
END;
$$;

-- Additional partial index on slot_start for fast slot matching
CREATE UNIQUE INDEX IF NOT EXISTS idx_officehours_active_slot_start
  ON public.officehours_appointments (slot_start)
  WHERE status = 'booked';

CREATE INDEX IF NOT EXISTS idx_officehours_student_appointments
  ON public.officehours_appointments (student_id, status, slot_start);

-- 8. OTP Rate Limiting Functions (Max 2 requests per 2 minutes, 5-minute cooldown on abuse)
CREATE OR REPLACE FUNCTION public.get_otp_rate_limit_status(p_email text)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_email text;
  v_record public.officehours_email_rate_limits%ROWTYPE;
  v_now timestamptz := now();
  v_wait_seconds integer;
BEGIN
  v_email := lower(trim(p_email));
  IF v_email = '' OR v_email IS NULL THEN
    RETURN jsonb_build_object('is_blocked', false, 'wait_seconds', 0);
  END IF;

  SELECT * INTO v_record
  FROM public.officehours_email_rate_limits
  WHERE email = v_email;

  IF FOUND AND v_record.blocked_until IS NOT NULL AND v_record.blocked_until > v_now THEN
    v_wait_seconds := ceil(extract(epoch from (v_record.blocked_until - v_now)));
    RETURN jsonb_build_object(
      'is_blocked', true,
      'wait_seconds', v_wait_seconds,
      'reason', 'Kısa süre içinde 2 defa kod istendi. Spam ve güvenlik koruması nedeniyle lütfen ' || v_wait_seconds || ' saniye bekleyin.'
    );
  END IF;

  RETURN jsonb_build_object('is_blocked', false, 'wait_seconds', 0);
END;
$$;

CREATE OR REPLACE FUNCTION public.check_and_record_otp_rate_limit(p_email text)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_email text;
  v_record public.officehours_email_rate_limits%ROWTYPE;
  v_now timestamptz := now();
  v_wait_seconds integer;
BEGIN
  v_email := lower(trim(p_email));

  IF v_email = '' OR v_email IS NULL THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'Geçersiz e-posta adresi.');
  END IF;

  -- Clean up old rate limits (older than 2 hours)
  DELETE FROM public.officehours_email_rate_limits
  WHERE last_attempt_at < (v_now - interval '2 hours');

  SELECT * INTO v_record
  FROM public.officehours_email_rate_limits
  WHERE email = v_email;

  IF FOUND THEN
    -- Check if currently blocked by cooldown
    IF v_record.blocked_until IS NOT NULL AND v_record.blocked_until > v_now THEN
      v_wait_seconds := ceil(extract(epoch from (v_record.blocked_until - v_now)));
      RETURN jsonb_build_object(
        'allowed', false,
        'wait_seconds', v_wait_seconds,
        'remaining_attempts', 0,
        'reason', 'Kısa süre içinde 2 defa kod istendi. Spam ve güvenlik koruması nedeniyle lütfen ' || v_wait_seconds || ' saniye bekleyin.'
      );
    END IF;

    -- If 2-minute sliding window has passed, start fresh window
    IF v_record.window_start < (v_now - interval '2 minutes') THEN
      UPDATE public.officehours_email_rate_limits
      SET attempts = 1,
          window_start = v_now,
          blocked_until = NULL,
          last_attempt_at = v_now
      WHERE email = v_email;

      RETURN jsonb_build_object('allowed', true, 'remaining_attempts', 1, 'wait_seconds', 0);
    ELSE
      -- Within 2-minute window:
      IF v_record.attempts >= 2 THEN
        -- Already reached 2 attempts: block and set 5 minutes cooldown
        v_wait_seconds := 300;
        UPDATE public.officehours_email_rate_limits
        SET attempts = v_record.attempts + 1,
            blocked_until = v_now + interval '5 minutes',
            last_attempt_at = v_now
        WHERE email = v_email;

        RETURN jsonb_build_object(
          'allowed', false,
          'wait_seconds', v_wait_seconds,
          'remaining_attempts', 0,
          'reason', 'Kısa süre içinde 2 defa kod istendi. Spam ve güvenlik koruması nedeniyle 5 dakika boyunca yeni kod gönderilemez.'
        );
      ELSE
        -- 2nd attempt within 2 minutes: ALLOW this request, but initiate 5-minute cooldown for subsequent requests!
        UPDATE public.officehours_email_rate_limits
        SET attempts = 2,
            blocked_until = v_now + interval '5 minutes',
            last_attempt_at = v_now
        WHERE email = v_email;

        RETURN jsonb_build_object('allowed', true, 'remaining_attempts', 0, 'wait_seconds', 300);
      END IF;
    END IF;
  ELSE
    -- First attempt for this email
    INSERT INTO public.officehours_email_rate_limits (email, attempts, window_start, last_attempt_at, blocked_until)
    VALUES (v_email, 1, v_now, v_now, NULL);

    RETURN jsonb_build_object('allowed', true, 'remaining_attempts', 1, 'wait_seconds', 0);
  END IF;
END;
$$;

-- 9. Supabase Auth Triggers: Prevent Signups/OTPs from Non-Allowlisted Domains & Sync Admins
CREATE OR REPLACE FUNCTION public.trg_fn_on_auth_user_created()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_email text;
  is_admin_candidate boolean;
BEGIN
  IF NEW.email IS NULL THEN
    RETURN NEW;
  END IF;

  user_email := lower(trim(NEW.email));

  -- Check if rate limit cooldown is active for this email
  IF EXISTS (
    SELECT 1 FROM public.officehours_email_rate_limits
    WHERE email = user_email AND blocked_until > now()
  ) THEN
    RAISE EXCEPTION 'Rate limit exceeded: Spam koruması nedeniyle lütfen bekleyin.';
  END IF;

  -- Check if user is an admin from allowlist
  SELECT EXISTS (
    SELECT 1 FROM public.officehours_admin_allowlist WHERE lower(trim(email)) = user_email
  ) INTO is_admin_candidate;

  -- Enforce university domain restriction for students
  IF NOT is_admin_candidate AND NOT public.is_allowed_email_domain(user_email) THEN
    RAISE EXCEPTION 'Registration rejected: Email "%" is not authorized. Only @marun.edu.tr and @marmara.edu.tr email addresses may create accounts.', user_email;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auth_user_domain_check ON auth.users;
CREATE TRIGGER trg_auth_user_domain_check
  BEFORE INSERT OR UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.trg_fn_on_auth_user_created();

-- Automatically sync admin table AFTER user is inserted into auth.users (avoids foreign key conflict)
CREATE OR REPLACE FUNCTION public.trg_fn_sync_admin_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_email text;
BEGIN
  IF NEW.email IS NULL THEN
    RETURN NEW;
  END IF;

  user_email := lower(trim(NEW.email));

  IF EXISTS (SELECT 1 FROM public.officehours_admin_allowlist WHERE lower(trim(email)) = user_email) THEN
    INSERT INTO public.officehours_admin_users (user_id, email)
    VALUES (NEW.id, user_email)
    ON CONFLICT (user_id) DO UPDATE SET email = EXCLUDED.email;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Never block authentication if secondary admin table tracking fails
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auth_user_admin_sync ON auth.users;
CREATE TRIGGER trg_auth_user_admin_sync
  AFTER INSERT OR UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.trg_fn_sync_admin_user();

-- 9. Secure Anonymized Function & Security-Invoker View for Public Slot Availability
-- Exposes ONLY the occupied time ranges. ZERO student PII (no emails, no names, no topics, no IDs).
-- Uses a SECURITY DEFINER function with explicit search_path wrapped in a view with security_invoker = true.
-- This resolves Supabase Advisor linter rule 0010_security_definer_view cleanly.
CREATE OR REPLACE FUNCTION public.get_officehours_booked_slots()
RETURNS TABLE (slot_start timestamptz, slot_end timestamptz)
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
STABLE
AS $$
  SELECT slot_start, slot_end
  FROM public.officehours_appointments
  WHERE status = 'booked';
$$;

DROP VIEW IF EXISTS public.officehours_booked_slots;
CREATE VIEW public.officehours_booked_slots
WITH (security_invoker = true)
AS
SELECT
  slot_start,
  slot_end
FROM public.get_officehours_booked_slots();

-- 10. Core RPC: Book Appointment (Server-Enforced Rules & Concurrency Lock)
CREATE OR REPLACE FUNCTION public.book_officehours_appointment(
  p_slot_start timestamptz,
  p_slot_end timestamptz,
  p_topic text,
  p_note text DEFAULT ''
)
RETURNS jsonb AS $$
DECLARE
  v_student_id uuid;
  v_student_email text;
  v_settings public.officehours_settings%ROWTYPE;
  v_duration_min integer;
  v_dow integer;
  v_slot_date date;
  v_slot_start_time time;
  v_slot_end_time time;
  v_active_future_count integer;
  v_rolling_count integer;
  v_new_appointment public.officehours_appointments%ROWTYPE;
BEGIN
  -- Verify authentication
  v_student_id := auth.uid();
  IF v_student_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to book office hours.';
  END IF;

  v_student_email := lower(trim(coalesce(auth.jwt() ->> 'email', '')));
  IF NOT public.is_allowed_email_domain(v_student_email) THEN
    RAISE EXCEPTION 'Only verified @marun.edu.tr and @marmara.edu.tr accounts may book appointments.';
  END IF;

  -- Load global settings
  SELECT * INTO v_settings FROM public.officehours_settings WHERE id = 1;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'System settings configuration missing.';
  END IF;

  IF NOT v_settings.is_booking_enabled THEN
    RAISE EXCEPTION 'Office hours bookings are currently suspended.';
  END IF;

  -- Validate meeting duration
  v_duration_min := round(extract(epoch from (p_slot_end - p_slot_start)) / 60.0);
  IF v_duration_min <> v_settings.meeting_duration_minutes THEN
    RAISE EXCEPTION 'Invalid meeting duration: % minutes. Configured duration is % minutes.', v_duration_min, v_settings.meeting_duration_minutes;
  END IF;

  -- Minimum notice validation
  IF p_slot_start < (now() + (v_settings.min_booking_notice_hours || ' hours')::interval) THEN
    RAISE EXCEPTION 'Appointments must be booked at least % hours in advance.', v_settings.min_booking_notice_hours;
  END IF;

  -- Slot date & day of week in target timezone
  v_slot_date := (p_slot_start AT TIME ZONE v_settings.timezone)::date;
  v_dow := extract(DOW from (p_slot_start AT TIME ZONE v_settings.timezone));
  v_slot_start_time := (p_slot_start AT TIME ZONE v_settings.timezone)::time;
  v_slot_end_time := (p_slot_end AT TIME ZONE v_settings.timezone)::time;

  -- Check semester boundaries if configured
  IF v_settings.semester_start_date IS NOT NULL AND v_slot_date < v_settings.semester_start_date THEN
    RAISE EXCEPTION 'The requested date is before the start of the current semester schedule.';
  END IF;
  IF v_settings.semester_end_date IS NOT NULL AND v_slot_date > v_settings.semester_end_date THEN
    RAISE EXCEPTION 'The requested date is after the end of the current semester schedule.';
  END IF;

  -- Check exceptions (blocked dates)
  IF EXISTS (
    SELECT 1 FROM public.officehours_availability_exceptions
    WHERE exception_date = v_slot_date AND is_blocked = true
  ) THEN
    RAISE EXCEPTION 'The selected date is marked as unavailable.';
  END IF;

  -- Check availability rules for this day of week
  IF NOT EXISTS (
    SELECT 1 FROM public.officehours_availability_rules
    WHERE day_of_week = v_dow
      AND is_active = true
      AND start_time <= v_slot_start_time
      AND end_time >= v_slot_end_time
  ) THEN
    RAISE EXCEPTION 'The requested time is outside scheduled office hours for this day.';
  END IF;

  -- Check limit: Maximum active future bookings per student
  SELECT count(*) INTO v_active_future_count
  FROM public.officehours_appointments
  WHERE student_id = v_student_id
    AND status = 'booked'
    AND slot_end > now();

  IF v_active_future_count >= v_settings.max_active_bookings_per_student THEN
    RAISE EXCEPTION 'Booking limit reached: You already have % active upcoming appointment. Please attend or cancel it before booking another.', v_active_future_count;
  END IF;

  -- Check limit: Rolling window booking frequency
  SELECT count(*) INTO v_rolling_count
  FROM public.officehours_appointments
  WHERE student_id = v_student_id
    AND status = 'booked'
    AND slot_start >= (p_slot_start - (v_settings.rolling_days_limit || ' days')::interval)
    AND slot_start <= (p_slot_start + (v_settings.rolling_days_limit || ' days')::interval);

  IF v_rolling_count >= v_settings.max_bookings_in_rolling_days THEN
    RAISE EXCEPTION 'Fair access rule: Maximum % appointment allowed within a %-day period.', v_settings.max_bookings_in_rolling_days, v_settings.rolling_days_limit;
  END IF;

  -- Insert appointment (exclusion constraint protects against simultaneous race conditions)
  BEGIN
    INSERT INTO public.officehours_appointments (
      student_id,
      student_email,
      slot_start,
      slot_end,
      topic,
      note,
      status
    )
    VALUES (
      v_student_id,
      v_student_email,
      p_slot_start,
      p_slot_end,
      trim(p_topic),
      trim(coalesce(p_note, '')),
      'booked'
    )
    RETURNING * INTO v_new_appointment;
  EXCEPTION
    WHEN exclusion_violation OR unique_violation THEN
      RAISE EXCEPTION 'This appointment slot was just reserved by another student. Please choose a different available time.';
  END;

  RETURN jsonb_build_object(
    'success', true,
    'appointment_id', v_new_appointment.id,
    'slot_start', v_new_appointment.slot_start,
    'slot_end', v_new_appointment.slot_end,
    'topic', v_new_appointment.topic
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Core RPC: Cancel Appointment
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
  WHERE id = p_appointment_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Appointment not found.';
  END IF;

  IF v_appt.status <> 'booked' THEN
    RAISE EXCEPTION 'This appointment is already cancelled.';
  END IF;

  IF v_is_admin THEN
    UPDATE public.officehours_appointments
    SET status = 'cancelled_by_admin',
        updated_at = now()
    WHERE id = p_appointment_id;
  ELSE
    IF v_appt.student_id <> v_caller_id THEN
      RAISE EXCEPTION 'Unauthorized: You may only cancel your own appointments.';
    END IF;

    IF v_appt.slot_start <= now() THEN
      RAISE EXCEPTION 'Past appointments cannot be cancelled.';
    END IF;

    UPDATE public.officehours_appointments
    SET status = 'cancelled_by_student',
        updated_at = now()
    WHERE id = p_appointment_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'appointment_id', p_appointment_id,
    'status', CASE WHEN v_is_admin THEN 'cancelled_by_admin' ELSE 'cancelled_by_student' END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Row Level Security (RLS) Configuration
ALTER TABLE public.officehours_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officehours_availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officehours_availability_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officehours_admin_allowlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officehours_admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officehours_appointments ENABLE ROW LEVEL SECURITY;

-- Settings: Anyone can read; only admin can modify
CREATE POLICY "Public can view settings"
  ON public.officehours_settings FOR SELECT
  USING (true);

CREATE POLICY "Admin can update settings"
  ON public.officehours_settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Rules: Anyone can view active rules; admin can manage all
CREATE POLICY "Public can view active availability rules"
  ON public.officehours_availability_rules FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin can manage availability rules"
  ON public.officehours_availability_rules FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Exceptions: Anyone can view exceptions; admin can manage
CREATE POLICY "Public can view exceptions"
  ON public.officehours_availability_exceptions FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage exceptions"
  ON public.officehours_availability_exceptions FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admin Lists: Only admins can view or manage
CREATE POLICY "Admin can view allowlist"
  ON public.officehours_admin_allowlist FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can view admin users"
  ON public.officehours_admin_users FOR SELECT
  USING (public.is_admin() OR auth.uid() = user_id);

CREATE POLICY "Admin can manage admin users"
  ON public.officehours_admin_users FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Appointments:
-- Students see ONLY their own bookings.
-- Admin sees all bookings.
CREATE POLICY "Students view own appointments, admin views all"
  ON public.officehours_appointments FOR SELECT
  USING (
    public.is_admin()
    OR (auth.uid() = student_id)
  );

CREATE POLICY "Students insert own appointment with allowed email"
  ON public.officehours_appointments FOR INSERT
  WITH CHECK (
    public.is_admin()
    OR (
      auth.uid() = student_id
      AND public.is_allowed_email_domain(auth.jwt() ->> 'email')
      AND student_email = (auth.jwt() ->> 'email')
    )
  );

CREATE POLICY "Students cancel own future appointment"
  ON public.officehours_appointments FOR UPDATE
  USING (
    public.is_admin()
    OR (auth.uid() = student_id AND slot_start > now())
  )
  WITH CHECK (
    public.is_admin()
    OR (auth.uid() = student_id AND status = 'cancelled_by_student')
  );

-- 13. Grant Permissions
GRANT SELECT ON public.officehours_settings TO anon, authenticated;
GRANT SELECT ON public.officehours_availability_rules TO anon, authenticated;
GRANT SELECT ON public.officehours_availability_exceptions TO anon, authenticated;
GRANT SELECT ON public.officehours_booked_slots TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_officehours_booked_slots TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_and_record_otp_rate_limit TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_otp_rate_limit_status TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.officehours_appointments TO authenticated;
GRANT EXECUTE ON FUNCTION public.book_officehours_appointment TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_officehours_appointment TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO anon, authenticated;

-- 14. Initial Seed Data
INSERT INTO public.officehours_settings (
  id,
  meeting_duration_minutes,
  buffer_minutes,
  min_booking_notice_hours,
  max_active_bookings_per_student,
  rolling_days_limit,
  max_bookings_in_rolling_days,
  timezone,
  is_booking_enabled
) VALUES (
  1,
  20,
  10,
  24,
  1,
  7,
  1,
  'Europe/Istanbul',
  true
)
ON CONFLICT (id) DO NOTHING;

-- Seed Regular Availability (Tuesday 13:00-16:00, Thursday 10:00-12:00)
INSERT INTO public.officehours_availability_rules (day_of_week, start_time, end_time, is_active)
VALUES
  (2, '13:00:00', '16:00:00', true),
  (4, '10:00:00', '12:00:00', true)
ON CONFLICT DO NOTHING;

-- Seed Single Primary Administrator Account (yunus.serhat@marmara.edu.tr)
INSERT INTO public.officehours_admin_allowlist (email, notes)
VALUES
  ('yunus.serhat@marmara.edu.tr', 'Professor Yunus Serhat Bicakci - Primary Administrator')
ON CONFLICT (email) DO UPDATE SET notes = EXCLUDED.notes;

DELETE FROM public.officehours_admin_allowlist WHERE email <> 'yunus.serhat@marmara.edu.tr';
