-- Final security model after Phase 2. Fixtures are rolled back at the end.
BEGIN;

INSERT INTO auth.users (id, email) VALUES
  ('c1111111-1111-4111-8111-111111111111', 'final.student@marun.edu.tr');

INSERT INTO public.officehours_availability_rules
  (day_of_week, start_time, end_time, meeting_type, location_or_link)
VALUES (6, '09:00', '10:00', 'online', 'https://meet.example.test/final-rule');

INSERT INTO public.officehours_availability_exceptions (exception_date, reason, is_blocked)
VALUES ('2099-12-30', 'Final private reason', true);

SELECT smoke.ok(
  to_regclass('public.officehours_email_rate_limits') IS NULL,
  'retired OTP limiter table is dropped'
);

-- Exact policy set: nothing left over from the legacy model.
SELECT smoke.ok(
  (SELECT array_agg(tablename || ': ' || policyname ORDER BY tablename, policyname)
   FROM pg_policies
   WHERE schemaname = 'public' AND tablename LIKE 'officehours\_%')
  = ARRAY[
    'officehours_admin_allowlist: Allowlist admin manage',
    'officehours_admin_users: Admin can manage admin users',
    'officehours_admin_users: Admin can view admin users',
    'officehours_appointments: Students view own appointments, admin views all',
    'officehours_availability_exceptions: Admin can manage exceptions',
    'officehours_availability_rules: Admin can manage availability rules',
    'officehours_date_overrides: Admin can manage date overrides',
    'officehours_settings: Admin can update settings',
    'officehours_settings: Public can view settings'
  ],
  'only the final policy set remains'
);

-- Exact anonymous privileges on office-hours relations.
SELECT smoke.ok(
  (SELECT array_agg(c.relname || ':' || g.privilege_type ORDER BY c.relname, g.privilege_type)
   FROM pg_class AS c,
     LATERAL aclexplode(c.relacl) AS g
   WHERE c.relnamespace = 'public'::regnamespace
     AND c.relname LIKE 'officehours\_%'
     AND g.grantee IN ('anon'::regrole::oid, 0::oid))
  = ARRAY[
    'officehours_booked_slots:SELECT',
    'officehours_public_availability_exceptions:SELECT',
    'officehours_public_availability_rules:SELECT',
    'officehours_public_date_overrides:SELECT',
    'officehours_settings:SELECT'
  ],
  'anonymous and PUBLIC privileges are limited to the masked read surface'
);

SELECT smoke.ok(
  NOT EXISTS (
    SELECT 1
    FROM pg_class AS c, LATERAL aclexplode(c.relacl) AS g
    WHERE c.relnamespace = 'public'::regnamespace
      AND c.relname = 'officehours_appointments'
      AND g.grantee = 'authenticated'::regrole::oid
      AND g.privilege_type <> 'SELECT'
  ),
  'signed-in users hold only SELECT on appointments'
);

SET LOCAL ROLE anon;

SELECT smoke.fails(
  $$SELECT * FROM public.officehours_availability_rules$$,
  'permission denied',
  'anonymous users cannot read raw availability rules'
);
SELECT smoke.fails(
  $$SELECT * FROM public.officehours_availability_exceptions$$,
  'permission denied',
  'anonymous users cannot read raw blocked-date reasons'
);
SELECT smoke.fails(
  $$SELECT * FROM public.officehours_date_overrides$$,
  'permission denied',
  'anonymous users cannot read raw date overrides'
);
SELECT smoke.ok(
  (SELECT count(*) FROM public.officehours_public_availability_rules WHERE day_of_week = 6) = 1,
  'anonymous users still read the masked availability view'
);

RESET ROLE;
SET LOCAL ROLE authenticated;
SELECT smoke.as_user('c1111111-1111-4111-8111-111111111111', 'final.student@marun.edu.tr');

SELECT smoke.ok(
  (SELECT count(*) FROM public.officehours_availability_rules) = 0,
  'students no longer read raw availability rules'
);
SELECT smoke.ok(
  (SELECT count(*) FROM public.officehours_availability_exceptions) = 0,
  'students no longer read blocked-date reasons'
);
SELECT smoke.ok(
  (SELECT count(*) FROM public.officehours_date_overrides) = 0,
  'students no longer read raw date overrides'
);
SELECT smoke.ok(
  (SELECT location_or_link FROM public.officehours_public_availability_rules
   WHERE day_of_week = 6 AND start_time = '09:00') = '',
  'students see the online rule without its meeting link'
);

RESET ROLE;
ROLLBACK;
