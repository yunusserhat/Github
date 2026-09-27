-- Minimal stand-in for the parts of a Supabase database that the office-hours
-- migrations use, plus assertion helpers for the smoke checks. For disposable
-- local test databases only (see scripts/test-db.sh); never apply to Supabase.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN BYPASSRLS;
  END IF;
END;
$$;

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS extensions;
GRANT USAGE ON SCHEMA auth, public TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS auth.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text
);

-- Same claim lookup as Supabase's auth.uid() / auth.jwt().
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;

CREATE OR REPLACE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $$
  SELECT coalesce(
    nullif(current_setting('request.jwt.claim', true), ''),
    nullif(current_setting('request.jwt.claims', true), '')
  )::jsonb
$$;

GRANT EXECUTE ON FUNCTION auth.uid(), auth.jwt() TO anon, authenticated, service_role;

-- Older Supabase projects grant everything in public to the API roles by
-- default; the migrations must hold up against that.
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

CREATE SCHEMA IF NOT EXISTS smoke;
GRANT USAGE ON SCHEMA smoke TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION smoke.ok(p_condition boolean, p_label text)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  IF p_condition IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'not ok - %', p_label;
  END IF;
  RAISE NOTICE 'ok - %', p_label;
END;
$$;

-- Runs p_sql as the current role and passes only if it fails with an error
-- message matching p_expected (case-insensitive regular expression).
CREATE OR REPLACE FUNCTION smoke.fails(p_sql text, p_expected text, p_label text)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  BEGIN
    EXECUTE p_sql;
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM ~* p_expected THEN
      RAISE NOTICE 'ok - % [%]', p_label, SQLERRM;
      RETURN;
    END IF;
    RAISE EXCEPTION 'not ok - %: unexpected error: %', p_label, SQLERRM;
  END;
  RAISE EXCEPTION 'not ok - %: statement succeeded', p_label;
END;
$$;

CREATE OR REPLACE FUNCTION smoke.as_user(p_sub uuid, p_email text)
RETURNS void LANGUAGE sql AS $$
  SELECT set_config(
    'request.jwt.claims',
    json_build_object('sub', p_sub, 'email', p_email, 'role', 'authenticated')::text,
    true
  );
$$;

-- First date at least two days ahead that falls on the given weekday, so a
-- slot on it passes the default 24-hour notice rule.
CREATE OR REPLACE FUNCTION smoke.next_dow(p_dow integer)
RETURNS date LANGUAGE sql STABLE AS $$
  SELECT d::date
  FROM generate_series(current_date + 2, current_date + 8, interval '1 day') AS d
  WHERE extract(dow FROM d) = p_dow
  ORDER BY d
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION smoke.at(p_date date, p_time time)
RETURNS timestamptz LANGUAGE sql IMMUTABLE AS $$
  SELECT (p_date + p_time) AT TIME ZONE 'Europe/Istanbul';
$$;

GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA smoke TO anon, authenticated, service_role;
