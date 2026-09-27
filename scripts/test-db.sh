#!/usr/bin/env bash
# Smoke tests for the office-hours Supabase migrations in a disposable,
# network-less PostgreSQL container. Requires Docker. Run with: npm run test:db
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE="${OFFICEHOURS_TEST_PG_IMAGE:-postgres:15-alpine}"
NAME="officehours-db-smoke-$$"
TMP="$(mktemp -d)"

STUB=supabase/smoke/00_supabase_stub.sql
BASE=supabase/migrations/20260910000001_officehours_schema.sql
PHASE1=supabase/migrations/20260927000002_officehours_phase1_hardening.sql
PHASE2=supabase/phase2/20260927000003_officehours_phase2_remove_legacy_access.sql

PASSED=0

cleanup() {
  docker rm -f "$NAME" >/dev/null 2>&1 || true
  rm -rf "$TMP"
}
trap cleanup EXIT

fail() {
  echo "not ok - $1" >&2
  [ -n "${2:-}" ] && printf '%s\n' "$2" >&2
  exit 1
}

pass() {
  echo "  ok - $1"
  PASSED=$((PASSED + 1))
}

psql_in() {
  docker exec -i "$NAME" psql -X -q -v ON_ERROR_STOP=1 -U postgres "$@"
}

# Migrations run in one transaction, as they must in production.
apply() {
  local db="$1" file="$2" out
  out=$(psql_in -d "$db" -1 -f "/work/$file" 2>&1) || fail "apply $file to $db" "$out"
  pass "applied $(basename "$file") to $db"
}

check() {
  local db="$1" file="$2" out
  echo "# $(basename "$file") on $db"
  out=$(psql_in -d "$db" -f "/work/$file" 2>&1) || fail "$file" "$out"
  while IFS= read -r line; do
    pass "$line"
  done < <(printf '%s\n' "$out" | sed -n 's/^.*NOTICE:  ok - //p')
}

expect_apply_failure() {
  local db="$1" file="$2" pattern="$3" label="$4" out
  if out=$(psql_in -d "$db" -1 -f "/work/$file" 2>&1); then
    fail "$label (migration applied)"
  fi
  printf '%s' "$out" | grep -qiE "$pattern" || fail "$label (unexpected error)" "$out"
  pass "$label"
}

scalar() {
  psql_in -d "$1" -tA -c "$2"
}

echo "# starting $IMAGE"
docker run -d --rm --name "$NAME" --network none \
  -e POSTGRES_PASSWORD=smoke \
  -v "$ROOT/supabase:/work/supabase:ro" \
  "$IMAGE" >/dev/null

# The image starts a temporary server during initialisation; wait for the real one.
for _ in $(seq 1 60); do
  if docker logs "$NAME" 2>&1 | grep -q 'PostgreSQL init process complete' &&
     docker exec "$NAME" pg_isready -U postgres >/dev/null 2>&1; then
    break
  fi
  sleep 1
done
docker exec "$NAME" pg_isready -U postgres >/dev/null 2>&1 || fail "database did not start"

# --- Release path: base -> Phase 1 -> (deploy) -> Phase 2 -------------------
DB=postgres
apply "$DB" "$STUB"
apply "$DB" "$BASE"
apply "$DB" "$PHASE1"
apply "$DB" "$PHASE1"
pass "Phase 1 is idempotent"

check "$DB" supabase/smoke/10_behaviour_checks.sql
check "$DB" supabase/smoke/20_phase1_compat_checks.sql

echo "# concurrency on the transitional schema"
psql_in -d "$DB" -c "INSERT INTO auth.users (id, email) VALUES
  ('d1111111-1111-4111-8111-111111111111', 'concurrent.one@marun.edu.tr'),
  ('d2222222-2222-4222-8222-222222222222', 'concurrent.two@marun.edu.tr'),
  ('d3333333-3333-4333-8333-333333333333', 'concurrent.three@marmara.edu.tr');" >/dev/null

book_sql() {
  # $1 user id, $2 email, $3 start time, $4 end time, $5 seconds to hold the transaction
  printf "BEGIN;
SET LOCAL ROLE authenticated;
SELECT smoke.as_user('%s', '%s');
SELECT public.book_officehours_appointment(
  smoke.at(smoke.next_dow(4), '%s'), smoke.at(smoke.next_dow(4), '%s'), 'Concurrency check');
SELECT pg_sleep(%s);
COMMIT;" "$1" "$2" "$3" "$4" "$5"
}

# Same student, two tabs, two different slots at once: only one may succeed.
book_sql d1111111-1111-4111-8111-111111111111 concurrent.one@marun.edu.tr 10:00 10:20 2 \
  | psql_in -d "$DB" >"$TMP/a" 2>&1 &
sleep 1
book_sql d1111111-1111-4111-8111-111111111111 concurrent.one@marun.edu.tr 10:30 10:50 0 \
  | psql_in -d "$DB" >"$TMP/b" 2>&1 || true
wait
[ "$(scalar "$DB" "SELECT count(*) FROM public.officehours_appointments WHERE student_id = 'd1111111-1111-4111-8111-111111111111' AND status = 'booked'")" = 1 ] \
  || fail "same-student concurrent bookings" "$(cat "$TMP/a" "$TMP/b")"
grep -q 'Booking limit reached' "$TMP/b" || fail "same-student concurrent bookings" "$(cat "$TMP/b")"
pass "a student's concurrent bookings are serialized (one succeeds, one hits the limit)"

# Two students, same slot at once: the exclusion constraint admits one.
book_sql d2222222-2222-4222-8222-222222222222 concurrent.two@marun.edu.tr 11:00 11:20 2 \
  | psql_in -d "$DB" >"$TMP/c" 2>&1 &
sleep 1
book_sql d3333333-3333-4333-8333-333333333333 concurrent.three@marmara.edu.tr 11:00 11:20 0 \
  | psql_in -d "$DB" >"$TMP/d" 2>&1 || true
wait
[ "$(scalar "$DB" "SELECT count(*) FROM public.officehours_appointments WHERE slot_start = (SELECT smoke.at(smoke.next_dow(4), '11:00')) AND status = 'booked'")" = 1 ] \
  || fail "same-slot concurrent bookings" "$(cat "$TMP/c" "$TMP/d")"
grep -q 'just reserved by another student' "$TMP/d" || fail "same-slot concurrent bookings" "$(cat "$TMP/d")"
pass "two students racing for one slot: one booking, one friendly collision message"

psql_in -d "$DB" -c "DELETE FROM public.officehours_appointments WHERE student_id IN (
  'd1111111-1111-4111-8111-111111111111', 'd2222222-2222-4222-8222-222222222222', 'd3333333-3333-4333-8333-333333333333');
  DELETE FROM auth.users WHERE email LIKE 'concurrent.%';" >/dev/null

out=$(psql_in -d "$DB" -f /work/supabase/checks/live_preflight.sql 2>&1) || fail "preflight on the Phase 1 schema" "$out"
pass "read-only preflight runs against the Phase 1 schema"

apply "$DB" "$PHASE2"
check "$DB" supabase/smoke/10_behaviour_checks.sql
check "$DB" supabase/smoke/30_phase2_final_checks.sql

# Re-running Phase 1 after Phase 2 must not reopen legacy access.
apply "$DB" "$PHASE1"
check "$DB" supabase/smoke/30_phase2_final_checks.sql
apply "$DB" "$PHASE2"
pass "Phase 2 is idempotent"

# --- Precondition guards on a separate database ------------------------------
GUARD=guardtest
scalar postgres "CREATE DATABASE $GUARD" >/dev/null
apply "$GUARD" "$STUB"
apply "$GUARD" "$BASE"

# A Database Webhook as Supabase stores it: URL and headers are trigger arguments.
psql_in -d "$GUARD" >/dev/null <<'SQL'
CREATE SCHEMA supabase_functions;
CREATE FUNCTION supabase_functions.http_request() RETURNS trigger
  LANGUAGE plpgsql AS 'BEGIN RETURN NEW; END';
CREATE TRIGGER notify_officehours_appointment
  AFTER INSERT OR UPDATE ON public.officehours_appointments
  FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request(
    'https://www.yunusserhat.com/.netlify/functions/notify-appointment', 'POST',
    '{"Content-Type":"application/json","x-officehours-webhook-secret":"smoke-webhook-secret"}',
    '{}', '5000');
SQL
out=$(psql_in -d "$GUARD" -f /work/supabase/checks/live_preflight.sql 2>&1) || fail "preflight on the base schema" "$out"
secret_hash=$(docker exec "$NAME" sh -c "printf %s smoke-webhook-secret | sha256sum" | cut -d' ' -f1)
printf '%s' "$out" | grep -q "$secret_hash" || fail "preflight shows the webhook secret fingerprint" "$out"
printf '%s' "$out" | grep -q 'www.yunusserhat.com/.netlify/functions/notify-appointment' \
  || fail "preflight shows the webhook URL" "$out"
if printf '%s' "$out" | grep -q 'smoke-webhook-secret'; then
  fail "preflight must never print the webhook secret"
fi
pass "read-only preflight shows the webhook URL and secret fingerprint, never the secret"

expect_apply_failure "$GUARD" "$PHASE2" 'Phase 1 has not been applied' \
  "Phase 2 refuses to run before Phase 1"

scalar "$GUARD" "CREATE POLICY \"Dashboard read-all\" ON public.officehours_appointments FOR SELECT USING (true)" >/dev/null
expect_apply_failure "$GUARD" "$PHASE1" 'Unexpected office-hours RLS policies.*Dashboard read-all' \
  "Phase 1 aborts on an unreviewed RLS policy"
[ "$(scalar "$GUARD" "SELECT to_regclass('public.officehours_public_availability_rules') IS NULL AND to_regprocedure('public.check_and_record_otp_rate_limit(text)') IS NOT NULL")" = t ] \
  || fail "aborted Phase 1 left partial changes"
pass "an aborted Phase 1 leaves the database unchanged"
scalar "$GUARD" "DROP POLICY \"Dashboard read-all\" ON public.officehours_appointments" >/dev/null

scalar "$GUARD" "CREATE FUNCTION public.book_officehours_appointment(timestamptz, timestamptz, text) RETURNS jsonb LANGUAGE sql AS 'SELECT NULL::jsonb'" >/dev/null
expect_apply_failure "$GUARD" "$PHASE1" 'overloads' \
  "Phase 1 aborts when an extra booking RPC overload exists"
scalar "$GUARD" "DROP FUNCTION public.book_officehours_appointment(timestamptz, timestamptz, text)" >/dev/null

apply "$GUARD" "$PHASE1"
scalar "$GUARD" "CREATE FUNCTION public.legacy_limiter_reader() RETURNS bigint LANGUAGE sql AS 'SELECT count(*) FROM public.officehours_email_rate_limits'" >/dev/null
expect_apply_failure "$GUARD" "$PHASE2" 'still reference officehours_email_rate_limits' \
  "Phase 2 refuses to drop the limiter table while a function reads it"

echo "# $PASSED checks passed"
