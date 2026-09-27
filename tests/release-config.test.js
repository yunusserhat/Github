import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const read = (path) => readFileSync(join(ROOT, path), 'utf8');

const BASE_SQL = 'supabase/migrations/20260910000001_officehours_schema.sql';
const PHASE1_SQL = 'supabase/migrations/20260927000002_officehours_phase1_hardening.sql';
const PHASE2_SQL = 'supabase/phase2/20260927000003_officehours_phase2_remove_legacy_access.sql';
const PAGES = ['layouts/officehours/booking.html', 'layouts/officehours/admin.html'];
const SCRIPTS = ['static/js/officehours-booking.js', 'static/js/officehours-admin.js'];

test('supabase-js: both pages load the same pinned release with an integrity hash', () => {
  const tags = PAGES.map((page) => {
    const tag = read(page).match(/<script[^>]*supabase-js[^>]*><\/script>/g);
    assert.equal(tag?.length, 1, `${page} loads supabase-js exactly once`);
    return tag[0];
  });
  assert.equal(tags[0], tags[1]);
  assert.match(tags[0], /@supabase\/supabase-js@2\.\d+\.\d+\/dist\/umd\/supabase\.js"/);
  assert.match(tags[0], /integrity="sha384-[A-Za-z0-9+/]{64}"/);
  assert.match(tags[0], /crossorigin="anonymous"/);
});

test('Hugo getenv allowlist exposes only public browser values', () => {
  const block = read('config.yaml').match(/getenv:\n((?:\s+(?:-\s.*|#.*)\n)+)/);
  assert.ok(block, 'getenv allowlist found');
  const patterns = [...block[1].matchAll(/-\s+'([^']+)'/g)].map((m) => new RegExp(m[1]));
  const allowed = (name) => patterns.some((pattern) => pattern.test(name));

  for (const name of ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'OFFICEHOURS_TURNSTILE_SITE_KEY']) {
    assert.equal(allowed(name), true, `${name} is readable by templates`);
  }
  for (const name of [
    'OFFICEHOURS_WEBHOOK_SECRET',
    'RESEND_API_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_DB_PASSWORD',
    'OFFICEHOURS_TURNSTILE_SECRET_KEY'
  ]) {
    assert.equal(allowed(name), false, `${name} must not be readable by templates`);
  }
});

test('New pages depend only on objects that exist after Phase 1 and survive Phase 2', () => {
  const created = read(BASE_SQL) + read(PHASE1_SQL);
  const phase2 = read(PHASE2_SQL);
  for (const script of SCRIPTS) {
    const source = read(script);
    const names = [...source.matchAll(/\.(?:from|rpc)\('([a-z_]+)'/g)].map((m) => m[1]);
    assert.ok(names.length > 0, `${script} data calls found`);
    for (const name of new Set(names)) {
      assert.match(
        created,
        new RegExp(`CREATE (?:OR REPLACE )?(?:TABLE|VIEW|FUNCTION)(?: IF NOT EXISTS)? public\\.${name}\\b`),
        `${script}: ${name} is created by the base schema or Phase 1`
      );
      assert.doesNotMatch(
        phase2,
        new RegExp(`DROP (?:TABLE|VIEW|FUNCTION)(?: IF EXISTS)? public\\.${name}\\b`),
        `${script}: ${name} is not dropped by Phase 2`
      );
    }
  }
});

test('New booking page reads masked views, not the raw schedule tables Phase 2 closes', () => {
  const source = read('static/js/officehours-booking.js');
  for (const table of ['officehours_availability_rules', 'officehours_availability_exceptions', 'officehours_date_overrides']) {
    assert.equal(source.includes(`from('${table}')`), false, `booking page must not read ${table}`);
  }
  for (const view of ['officehours_public_availability_rules', 'officehours_public_availability_exceptions', 'officehours_public_date_overrides']) {
    assert.equal(source.includes(`from('${view}')`), true, `booking page reads ${view}`);
  }
});

test('Pages no longer call the retired database OTP limiter', () => {
  for (const script of SCRIPTS) {
    const source = read(script);
    assert.equal(/check_and_record_otp_rate_limit|get_otp_rate_limit_status/.test(source), false, script);
    assert.match(source, /buildEmailOtpRequest\(/, `${script} sends OTP requests through the shared builder`);
  }
});

test('Phase 2 cannot be applied together with Phase 1 by `supabase db push`', () => {
  const migrations = readdirSync(join(ROOT, 'supabase/migrations'));
  assert.ok(migrations.includes('20260927000002_officehours_phase1_hardening.sql'));
  assert.equal(migrations.some((name) => /phase2/i.test(name)), false);
  assert.ok(existsSync(join(ROOT, PHASE2_SQL)));
  assert.match(read(PHASE2_SQL), /Phase 1 has not been applied/);
});

test('Webhook documentation targets the canonical www function URL', () => {
  for (const doc of ['supabase/README.md', 'docs/OFFICEHOURS_SETUP.md', 'supabase/RELEASE_CHECKLIST.md']) {
    const text = read(doc);
    assert.match(text, /https:\/\/www\.yunusserhat\.com\/\.netlify\/functions\/notify-appointment/, doc);
    assert.equal(/https?:\/\/yunusserhat\.com\/\.netlify/.test(text), false, `${doc} has no apex function URL`);
  }
});

test('No real secrets are committed in source, config, or documentation', () => {
  const roots = ['config', 'config.yaml', 'content/officehours', 'docs', 'layouts', 'netlify', 'netlify.toml',
    'README.md', 'scripts', 'static/js', 'supabase', 'tests', '.env.example'];
  const files = [];
  const walk = (path) => {
    const full = join(ROOT, path);
    if (!existsSync(full)) return;
    if (statSync(full).isDirectory()) {
      for (const entry of readdirSync(full)) walk(join(path, entry));
    } else {
      files.push(path);
    }
  };
  roots.forEach(walk);

  const secretPatterns = [
    /\bre_[A-Za-z0-9]{8,}_[A-Za-z0-9]{8,}/, // Resend API key
    /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/, // JWT (Supabase keys)
    /\bsb_(?:secret|publishable)_[A-Za-z0-9_-]{16,}/, // Supabase API keys
    /\bwhsec_[A-Za-z0-9+/=]{16,}/,
    /\b0x4AAAAAAA[A-Za-z0-9_-]{8,}/ // Cloudflare Turnstile keys
  ];
  for (const file of files) {
    if (file === relative(ROOT, new URL(import.meta.url).pathname)) continue;
    const text = read(file);
    for (const pattern of secretPatterns) {
      assert.equal(pattern.test(text), false, `${file} matches ${pattern}`);
    }
  }

  const envExample = read('.env.example');
  for (const line of envExample.split('\n').filter((l) => /^[A-Z_]+=/.test(l))) {
    assert.match(line, /="(?:your-|https:\/\/your-project-id)/, `placeholder only: ${line.split('=')[0]}`);
  }
});
