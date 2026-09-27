-- Transitional schema after Phase 1: the pages deployed BEFORE this release
-- (booking page and admin page at the previous commit) must keep working,
-- while the new pages' views are already available.
-- Fixtures are rolled back at the end.
BEGIN;

INSERT INTO auth.users (id, email) VALUES
  ('b1111111-1111-4111-8111-111111111111', 'legacy.student@marun.edu.tr'),
  ('b3333333-3333-4333-8333-333333333333', 'yunus.serhat@marmara.edu.tr');

INSERT INTO public.officehours_availability_rules
  (day_of_week, start_time, end_time, meeting_type, location_or_link)
VALUES (6, '09:00', '10:00', 'online', 'https://meet.example.test/legacy-rule');

INSERT INTO public.officehours_date_overrides
  (override_date, start_time, end_time, meeting_type, location_or_link)
VALUES ('2099-12-31', '09:00', '10:00', 'office', 'Legacy override room');

INSERT INTO public.officehours_availability_exceptions (exception_date, reason, is_blocked)
VALUES ('2099-12-30', 'Legacy reason', true);

SELECT smoke.ok(
  (SELECT count(*) FROM pg_policies
   WHERE schemaname = 'public'
     AND policyname IN (
       'Public can view active availability rules',
       'Public can view exceptions',
       'Public can view active date overrides'
     )) = 3,
  'transitional: legacy raw-table read policies remain until Phase 2'
);

-- Deployed booking page, signed-in student -------------------------------
SET LOCAL ROLE authenticated;
SELECT smoke.as_user('b1111111-1111-4111-8111-111111111111', 'legacy.student@marun.edu.tr');

-- The same reads the previous booking page issues after sign-in.
SELECT smoke.ok(
  (SELECT count(*) FROM public.officehours_settings WHERE id = 1) = 1,
  'legacy page: settings read works'
);
SELECT smoke.ok(
  (SELECT count(*) FROM public.officehours_availability_rules WHERE is_active = true) >= 3,
  'legacy page: raw availability-rule read still works'
);
SELECT smoke.ok(
  (SELECT count(*) FROM public.officehours_availability_exceptions WHERE is_blocked = true) >= 1,
  'legacy page: raw blocked-date read still works'
);
SELECT smoke.ok(
  (SELECT count(*) FROM public.officehours_date_overrides WHERE is_active = true) >= 1,
  'legacy page: raw date-override read still works'
);
SELECT smoke.ok(
  (SELECT count(*) FROM public.officehours_booked_slots) >= 0,
  'legacy page: booked-slot view read works'
);

-- The previous page books and cancels only through the RPCs.
SELECT set_config(
  'smoke.legacy_appointment',
  public.book_officehours_appointment(
    p_slot_start => smoke.at(smoke.next_dow(2), '15:00'),
    p_slot_end => smoke.at(smoke.next_dow(2), '15:20'),
    p_topic => 'Legacy page booking',
    p_note => '',
    p_meeting_type => 'office'
  ) ->> 'appointment_id',
  true
);
SELECT smoke.ok(
  current_setting('smoke.legacy_appointment') <> '',
  'legacy page: booking RPC with its named arguments works'
);
SELECT smoke.ok(
  (SELECT count(*) FROM public.officehours_appointments) = 1,
  'legacy page: own appointment list read works'
);
SELECT smoke.ok(
  (public.cancel_officehours_appointment(
    p_appointment_id => current_setting('smoke.legacy_appointment')::uuid
  ) ->> 'success')::boolean,
  'legacy page: cancellation RPC works'
);

-- The previous page calls this before Supabase Auth and continues on error.
SELECT smoke.fails(
  $$SELECT public.check_and_record_otp_rate_limit('legacy.student@marun.edu.tr')$$,
  'does not exist',
  'legacy page: OTP pre-check now errors, which that page ignores'
);

-- New booking page against the transitional schema -----------------------
SELECT smoke.ok(
  (SELECT count(*) FROM public.officehours_public_availability_rules WHERE is_active = true) >= 3,
  'new page: masked availability view works during the transition'
);
SELECT smoke.ok(
  (SELECT count(*) FROM public.officehours_public_availability_exceptions WHERE is_blocked = true) >= 1,
  'new page: masked blocked-date view works during the transition'
);
SELECT smoke.ok(
  (SELECT count(*) FROM public.officehours_public_date_overrides WHERE is_active = true) >= 1,
  'new page: masked date-override view works during the transition'
);

-- Deployed admin page -----------------------------------------------------
SELECT smoke.as_user('b3333333-3333-4333-8333-333333333333', 'yunus.serhat@marmara.edu.tr');

SELECT smoke.ok(public.is_admin(), 'legacy admin page: is_admin RPC works');

WITH toggled AS (
  UPDATE public.officehours_availability_rules
  SET is_active = is_active
  WHERE day_of_week = 6
  RETURNING id
)
SELECT smoke.ok(count(*) = 1, 'legacy admin page: rule toggle works') FROM toggled;

WITH added AS (
  INSERT INTO public.officehours_availability_exceptions (exception_date, reason)
  VALUES ('2099-12-29', 'Admin test')
  RETURNING id
)
SELECT smoke.ok(count(*) = 1, 'legacy admin page: blocked-date insert works') FROM added;

WITH changed AS (
  UPDATE public.officehours_settings SET min_booking_notice_hours = min_booking_notice_hours
  WHERE id = 1
  RETURNING 1
)
SELECT smoke.ok(count(*) = 1, 'legacy admin page: settings update works') FROM changed;

RESET ROLE;
ROLLBACK;
