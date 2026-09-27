-- Behaviour that must hold after Phase 1 and again after Phase 2.
-- Fixtures are rolled back at the end.
BEGIN;

INSERT INTO auth.users (id, email) VALUES
  ('a1111111-1111-4111-8111-111111111111', 'student.one@marun.edu.tr'),
  ('a2222222-2222-4222-8222-222222222222', 'student.two@marmara.edu.tr'),
  ('a3333333-3333-4333-8333-333333333333', 'yunus.serhat@marmara.edu.tr');

INSERT INTO public.officehours_availability_rules
  (day_of_week, start_time, end_time, meeting_type, location_or_link)
VALUES
  (6, '09:00', '10:00', 'online', 'https://meet.example.test/private-rule'),
  (6, '10:00', '11:00', 'both', 'Mixed-mode room'),
  (6, '11:00', '12:00', 'office', 'Room 6');

INSERT INTO public.officehours_date_overrides
  (override_date, start_time, end_time, meeting_type, location_or_link)
VALUES
  ('2099-12-31', '09:00', '10:00', 'online', 'https://meet.example.test/private-override'),
  ('2099-12-31', '10:00', '11:00', 'both', 'Mixed-mode override room'),
  ('2099-12-31', '11:00', '12:00', 'office', 'Override Room 6');

INSERT INTO public.officehours_availability_exceptions (exception_date, reason, is_blocked)
VALUES ('2099-12-30', 'Private administrator reason', true);

-- Function hardening ---------------------------------------------------------
SELECT smoke.ok(
  count(*) = 9 AND bool_and(prosecdef) AND bool_and(proconfig @> ARRAY['search_path=""']),
  'security-definer helpers and RPCs pin an empty search path'
)
FROM pg_proc
WHERE oid IN (
  'public.is_admin()'::regprocedure,
  'public.trg_fn_on_auth_user_created()'::regprocedure,
  'public.trg_fn_sync_admin_user()'::regprocedure,
  'public.book_officehours_appointment(timestamptz, timestamptz, text, text, text)'::regprocedure,
  'public.cancel_officehours_appointment(uuid, text)'::regprocedure,
  'internal.get_officehours_booked_slots()'::regprocedure,
  'internal.get_officehours_public_availability_rules()'::regprocedure,
  'internal.get_officehours_public_date_overrides()'::regprocedure,
  'internal.get_officehours_public_availability_exceptions()'::regprocedure
);

SELECT smoke.ok(
  NOT EXISTS (
    SELECT 1
    FROM pg_proc AS p, LATERAL aclexplode(p.proacl) AS g
    WHERE p.pronamespace = 'internal'::regnamespace::oid
      AND g.grantee = 0::oid
  ),
  'internal helpers are not executable through PUBLIC'
);

SELECT smoke.ok(
  NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'officehours_public_availability_exceptions'
      AND column_name = 'reason'
  ),
  'masked blocked-date view has no reason column'
);

-- Retired OTP limiter ------------------------------------------------------
SELECT smoke.ok(
  to_regprocedure('public.check_and_record_otp_rate_limit(text)') IS NULL
    AND to_regprocedure('public.get_otp_rate_limit_status(text)') IS NULL,
  'database OTP limiter RPCs no longer exist'
);

SELECT smoke.ok(
  NOT EXISTS (
    SELECT 1
    FROM pg_proc AS p
    WHERE p.pronamespace IN ('public'::regnamespace::oid, 'internal'::regnamespace::oid)
      AND p.prosrc ILIKE '%officehours_email_rate_limits%'
  ),
  'no function reads the retired limiter table'
);

-- A leftover "blocked" record from the old limiter must not stop a sign-up.
DO $$
BEGIN
  IF to_regclass('public.officehours_email_rate_limits') IS NOT NULL THEN
    EXECUTE $sql$
      INSERT INTO public.officehours_email_rate_limits (email, attempts, blocked_until)
      VALUES ('fresh.student@marun.edu.tr', 3, now() + interval '5 minutes')
    $sql$;
  END IF;
END;
$$;

WITH created AS (
  INSERT INTO auth.users (email) VALUES ('fresh.student@marun.edu.tr') RETURNING id
)
SELECT smoke.ok(count(*) = 1, 'sign-up is not blocked by another visitor''s OTP activity')
FROM created;

SELECT smoke.fails(
  $$INSERT INTO auth.users (email) VALUES ('outsider@gmail.com')$$,
  'not authorized',
  'auth trigger still rejects non-university domains'
);

-- Anonymous visitors ------------------------------------------------------
SET LOCAL ROLE anon;

SELECT smoke.fails(
  $$SELECT public.check_and_record_otp_rate_limit('victim@marun.edu.tr')$$,
  'does not exist',
  'anonymous callers cannot record OTP attempts for someone else'
);
SELECT smoke.fails(
  $$SELECT public.get_otp_rate_limit_status('victim@marun.edu.tr')$$,
  'does not exist',
  'anonymous callers cannot learn whether an address requested a code'
);
SELECT smoke.fails(
  $$INSERT INTO public.officehours_email_rate_limits (email) VALUES ('arbitrary string')$$,
  'permission denied|does not exist',
  'anonymous callers cannot create limiter records'
);
SELECT smoke.fails(
  $$SELECT 1 FROM public.officehours_appointments$$,
  'permission denied',
  'anonymous users cannot read appointments'
);
SELECT smoke.fails(
  $$SELECT 1 FROM public.officehours_admin_allowlist$$,
  'permission denied',
  'anonymous users cannot read the admin allowlist'
);
SELECT smoke.fails(
  $$SELECT public.book_officehours_appointment(now(), now(), 'Anonymous')$$,
  'permission denied',
  'anonymous users cannot call the booking RPC'
);
SELECT smoke.fails(
  $$INSERT INTO public.officehours_availability_rules (day_of_week, start_time, end_time) VALUES (1, '09:00', '10:00')$$,
  'permission denied',
  'anonymous users cannot write schedule tables'
);
SELECT smoke.fails(
  $$UPDATE public.officehours_settings SET buffer_minutes = 0$$,
  'permission denied',
  'anonymous users cannot change settings'
);

SELECT smoke.ok(
  (SELECT array_agg(meeting_type || ':' || location_or_link ORDER BY start_time)
   FROM public.officehours_public_availability_rules
   WHERE day_of_week = 6) = ARRAY['online:', 'both:', 'office:Room 6'],
  'rule view masks online and mixed-mode locations'
);
SELECT smoke.ok(
  (SELECT array_agg(meeting_type || ':' || location_or_link ORDER BY start_time)
   FROM public.officehours_public_date_overrides
   WHERE override_date = '2099-12-31') = ARRAY['online:', 'both:', 'office:Override Room 6'],
  'override view masks online and mixed-mode locations'
);
SELECT smoke.ok(
  EXISTS (
    SELECT 1 FROM public.officehours_public_availability_exceptions
    WHERE exception_date = '2099-12-30' AND is_blocked
  ),
  'blocked-date view exposes the date'
);
SELECT smoke.ok(
  (SELECT count(*) FROM public.officehours_settings) = 1,
  'settings remain readable for the booking page'
);
SELECT smoke.ok(
  (SELECT count(*) FROM public.officehours_booked_slots) >= 0,
  'booked-slot view remains readable'
);

RESET ROLE;

-- Students ---------------------------------------------------------------
SET LOCAL ROLE authenticated;
SELECT smoke.as_user('a1111111-1111-4111-8111-111111111111', 'student.one@marun.edu.tr');

SELECT smoke.ok(NOT public.is_admin(), 'students are not administrators');
SELECT smoke.ok(
  (SELECT count(*) FROM public.officehours_admin_allowlist) = 0,
  'students cannot see the admin allowlist'
);

SELECT smoke.fails(
  format('SELECT public.book_officehours_appointment(%L, %L, %L)',
    smoke.at(smoke.next_dow(2), '13:10'), smoke.at(smoke.next_dow(2), '13:30'), 'Misaligned'),
  'Invalid slot alignment',
  'booking rejects a slot that is not on the displayed grid'
);
SELECT smoke.fails(
  format('SELECT public.book_officehours_appointment(%L, %L, %L)',
    smoke.at(smoke.next_dow(2), '13:00:30'), smoke.at(smoke.next_dow(2), '13:20:30'), 'Seconds'),
  'Invalid slot alignment',
  'booking rejects second offsets'
);
SELECT smoke.fails(
  format('SELECT public.book_officehours_appointment(%L, %L, %L)',
    smoke.at(smoke.next_dow(2), '13:00'), smoke.at(smoke.next_dow(2), '13:25'), 'Duration'),
  'Invalid meeting duration',
  'booking rejects a non-configured duration'
);
SELECT smoke.fails(
  format('SELECT public.book_officehours_appointment(%L, %L, %L)',
    smoke.at(smoke.next_dow(2), '17:00'), smoke.at(smoke.next_dow(2), '17:20'), 'Outside'),
  'outside scheduled office hours',
  'booking rejects times outside office hours'
);

SELECT smoke.ok(
  (public.book_officehours_appointment(
    smoke.at(smoke.next_dow(2), '13:30'), smoke.at(smoke.next_dow(2), '13:50'), 'Thesis question'
  ) ->> 'success')::boolean,
  'an aligned slot books successfully'
);
SELECT set_config(
  'smoke.appointment',
  (SELECT id::text FROM public.officehours_appointments WHERE status = 'booked'),
  true
);

SELECT smoke.fails(
  format('SELECT public.book_officehours_appointment(%L, %L, %L)',
    smoke.at(smoke.next_dow(2), '14:00'), smoke.at(smoke.next_dow(2), '14:20'), 'Second'),
  'Booking limit reached',
  'the per-student active booking limit holds'
);
SELECT smoke.fails(
  $$INSERT INTO public.officehours_appointments (student_id, student_email, slot_start, slot_end, topic)
    VALUES ('a1111111-1111-4111-8111-111111111111', 'student.one@marun.edu.tr', now() + interval '5 days', now() + interval '5 days 20 minutes', 'Direct')$$,
  'permission denied',
  'students cannot insert appointments directly'
);
SELECT smoke.fails(
  $$UPDATE public.officehours_appointments SET status = 'cancelled_by_admin'$$,
  'permission denied',
  'students cannot update appointments directly'
);
SELECT smoke.fails(
  $$DELETE FROM public.officehours_appointments$$,
  'permission denied',
  'students cannot delete appointments directly'
);
SELECT smoke.ok(
  (SELECT count(*) FROM public.officehours_appointments) = 1,
  'students read their own appointment'
);

WITH changed AS (
  UPDATE public.officehours_settings SET buffer_minutes = 0 WHERE id = 1 RETURNING 1
)
SELECT smoke.ok(count(*) = 0, 'students cannot change settings') FROM changed;

SELECT smoke.fails(
  $$INSERT INTO public.officehours_availability_rules (day_of_week, start_time, end_time) VALUES (1, '09:00', '10:00')$$,
  'row-level security',
  'students cannot add availability rules'
);

SELECT smoke.as_user('a2222222-2222-4222-8222-222222222222', 'student.two@marmara.edu.tr');

SELECT smoke.fails(
  format('SELECT public.book_officehours_appointment(%L, %L, %L)',
    smoke.at(smoke.next_dow(2), '13:30'), smoke.at(smoke.next_dow(2), '13:50'), 'Same slot'),
  'just reserved by another student',
  'a taken slot returns the friendly collision message'
);
SELECT smoke.ok(
  (SELECT count(*) FROM public.officehours_appointments) = 0,
  'students cannot see other students'' appointments'
);
SELECT smoke.fails(
  format('SELECT public.cancel_officehours_appointment(%L)', current_setting('smoke.appointment')),
  'only cancel your own',
  'students cannot cancel another student''s appointment'
);

SELECT smoke.as_user('a1111111-1111-4111-8111-111111111111', 'student.one@marun.edu.tr');

SELECT smoke.ok(
  public.cancel_officehours_appointment(current_setting('smoke.appointment')::uuid) ->> 'status'
    = 'cancelled_by_student',
  'students can cancel their own future appointment'
);
SELECT smoke.fails(
  format('SELECT public.cancel_officehours_appointment(%L)', current_setting('smoke.appointment')),
  'already cancelled',
  'a cancelled appointment cannot be cancelled again'
);

SELECT set_config(
  'smoke.appointment',
  public.book_officehours_appointment(
    smoke.at(smoke.next_dow(2), '14:00'), smoke.at(smoke.next_dow(2), '14:20'), 'Rebooked'
  ) ->> 'appointment_id',
  true
);

-- Administrator ---------------------------------------------------------
SELECT smoke.as_user('a3333333-3333-4333-8333-333333333333', 'yunus.serhat@marmara.edu.tr');

SELECT smoke.ok(public.is_admin(), 'the configured administrator is recognised');
SELECT smoke.ok(
  (SELECT count(*) FROM public.officehours_availability_rules) >= 5,
  'administrators read raw availability rules'
);
SELECT smoke.ok(
  (SELECT reason FROM public.officehours_availability_exceptions WHERE exception_date = '2099-12-30')
    = 'Private administrator reason',
  'administrators read blocked-date reasons'
);
SELECT smoke.ok(
  (SELECT count(*) FROM public.officehours_appointments) = 2,
  'administrators read every appointment'
);
SELECT smoke.ok(
  (SELECT count(*) FROM public.officehours_admin_allowlist) >= 1,
  'administrators read the allowlist'
);

WITH changed AS (
  UPDATE public.officehours_settings SET buffer_minutes = buffer_minutes WHERE id = 1 RETURNING 1
)
SELECT smoke.ok(count(*) = 1, 'administrators can update settings') FROM changed;

WITH added AS (
  INSERT INTO public.officehours_availability_rules (day_of_week, start_time, end_time)
  VALUES (5, '09:00', '10:00')
  RETURNING id
)
SELECT smoke.ok(count(*) = 1, 'administrators can add availability rules') FROM added;

WITH removed AS (
  DELETE FROM public.officehours_availability_rules WHERE day_of_week = 5 RETURNING id
)
SELECT smoke.ok(count(*) = 1, 'administrators can delete availability rules') FROM removed;

SELECT smoke.ok(
  public.cancel_officehours_appointment(current_setting('smoke.appointment')::uuid) ->> 'status'
    = 'cancelled_by_admin',
  'administrators can cancel any appointment'
);

RESET ROLE;
ROLLBACK;
