import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { handler } from '../netlify/functions/notify-appointment.js';

const originalEnv = {
  secret: process.env.OFFICEHOURS_WEBHOOK_SECRET,
  resend: process.env.RESEND_API_KEY,
  admin: process.env.ADMIN_EMAIL
};
const originalFetch = globalThis.fetch;

afterEach(() => {
  for (const [key, value] of Object.entries({
    OFFICEHOURS_WEBHOOK_SECRET: originalEnv.secret,
    RESEND_API_KEY: originalEnv.resend,
    ADMIN_EMAIL: originalEnv.admin
  })) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  globalThis.fetch = originalFetch;
});

const bookingRecord = {
  id: 'eb37b24c-12ed-4404-83b9-8ae981500755',
  student_email: '150119001@marun.edu.tr',
  slot_start: '2026-10-14T11:00:00Z',
  slot_end: '2026-10-14T11:20:00Z',
  topic: 'Bitirme Projesi Danışmanlığı',
  note: 'Hocam kaynak kodları githuba yükledim.',
  meeting_type: 'office',
  location_or_link: 'Mühendislik Fakültesi D-Blok Oda: 304',
  status: 'booked'
};

function webhook(type = 'INSERT', record = bookingRecord, oldRecord = null) {
  return { type, schema: 'public', table: 'officehours_appointments', record, old_record: oldRecord };
}

function request(payload = webhook(), secret = 'test-secret') {
  return {
    httpMethod: 'POST',
    headers: { 'X-OfficeHours-Webhook-Secret': secret },
    body: JSON.stringify(payload)
  };
}

function mockResend() {
  const dispatched = [];
  globalThis.fetch = async (url, options) => {
    dispatched.push({ url, body: JSON.parse(options.body), headers: options.headers });
    return { ok: true, status: 200, json: async () => ({ id: `mock-${dispatched.length}` }) };
  };
  return dispatched;
}

function configure() {
  process.env.OFFICEHOURS_WEBHOOK_SECRET = 'test-secret';
  process.env.RESEND_API_KEY = 're_mock_test_key';
  process.env.ADMIN_EMAIL = 'yunus.serhat@marmara.edu.tr';
}

test('rejects non-POST methods', async () => {
  assert.equal((await handler({ httpMethod: 'GET' })).statusCode, 405);
});

test('fails closed when the shared secret is not configured', async () => {
  delete process.env.OFFICEHOURS_WEBHOOK_SECRET;
  const dispatched = mockResend();
  assert.equal((await handler(request())).statusCode, 503);
  assert.equal(dispatched.length, 0);
});

test('rejects missing and incorrect webhook secrets before sending mail', async () => {
  configure();
  const dispatched = mockResend();
  const unsigned = request();
  unsigned.headers = {};
  assert.equal((await handler(unsigned)).statusCode, 401);
  assert.equal((await handler(request(webhook(), 'wrong-secret'))).statusCode, 401);
  assert.equal(dispatched.length, 0);
});

test('accepts the lowercase header name that Netlify delivers', async () => {
  configure();
  const dispatched = mockResend();
  const res = await handler({
    httpMethod: 'POST',
    headers: { 'x-officehours-webhook-secret': 'test-secret', 'content-type': 'application/json' },
    body: JSON.stringify(webhook())
  });
  assert.equal(res.statusCode, 200);
  assert.equal(dispatched.length, 2);
});

test('requires Resend configuration for authenticated requests', async () => {
  configure();
  delete process.env.RESEND_API_KEY;
  assert.equal((await handler(request())).statusCode, 500);
});

test('rejects malformed or unrelated events and invalid appointment data', async () => {
  configure();
  const dispatched = mockResend();
  const malformed = request();
  malformed.body = '{';
  assert.equal((await handler(malformed)).statusCode, 400);
  assert.equal((await handler(request({ ...webhook(), table: 'other_table' }))).statusCode, 400);
  assert.equal((await handler(request(webhook('DELETE')))).statusCode, 400);
  assert.equal((await handler(request(webhook('INSERT', { ...bookingRecord, student_email: 'outside@gmail.com' })))).statusCode, 400);
  assert.equal((await handler(request(webhook('INSERT', { ...bookingRecord, slot_end: 'invalid' })))).statusCode, 400);
  assert.equal(dispatched.length, 0);
});

test('sends exactly two booking emails for an authenticated INSERT', async () => {
  configure();
  const dispatched = mockResend();
  const res = await handler(request(webhook('INSERT', { ...bookingRecord, topic: '<script>Test</script>' })));
  assert.equal(res.statusCode, 200);
  assert.equal(JSON.parse(res.body).results.adminSent, true);
  assert.equal(JSON.parse(res.body).results.studentSent, true);
  assert.equal(dispatched.length, 2);

  const admin = dispatched.find((r) => r.body.to.includes('yunus.serhat@marmara.edu.tr'));
  const student = dispatched.find((r) => r.body.to.includes(bookingRecord.student_email));
  assert.match(admin.body.subject, /Yeni Ofis Saati Randevusu/);
  assert.match(admin.body.html, /&lt;script&gt;Test&lt;\/script&gt;/);
  assert.match(student.body.html, /calendar\.google\.com/);
  assert.match(student.body.html, /Mühendislik Fakültesi D-Blok/);
  assert.equal(admin.headers['Idempotency-Key'], `officehours:booked:${bookingRecord.id}:admin`);
  assert.equal(student.headers['Idempotency-Key'], `officehours:booked:${bookingRecord.id}:student`);
});

test('uses stable distinct Resend keys across duplicate webhook deliveries', async () => {
  configure();
  const dispatched = mockResend();
  await handler(request());
  await handler(request());
  assert.deepEqual(
    dispatched.slice(0, 2).map((r) => r.headers['Idempotency-Key']),
    dispatched.slice(2).map((r) => r.headers['Idempotency-Key'])
  );
  assert.notEqual(dispatched[0].headers['Idempotency-Key'], dispatched[1].headers['Idempotency-Key']);
});

for (const status of ['cancelled_by_student', 'cancelled_by_admin']) {
  test(`sends cancellation emails for booked to ${status} transition`, async () => {
    configure();
    const dispatched = mockResend();
    const res = await handler(request(webhook('UPDATE', { ...bookingRecord, status }, { status: 'booked' })));
    assert.equal(res.statusCode, 200);
    assert.equal(dispatched.length, 2);
    assert.match(dispatched[0].body.subject, /İPTAL/);
    assert.match(dispatched[1].body.subject, /İptal/);
  });
}

test('does not resend mail for ordinary updates or repeated cancellations', async () => {
  configure();
  const dispatched = mockResend();
  const updated = await handler(request(webhook('UPDATE', bookingRecord, { status: 'booked' })));
  const repeated = await handler(request(webhook('UPDATE', { ...bookingRecord, status: 'cancelled_by_student' }, { status: 'cancelled_by_student' })));
  assert.equal(JSON.parse(updated.body).ignored, true);
  assert.equal(JSON.parse(repeated.body).ignored, true);
  assert.equal(dispatched.length, 0);
});

test('reports provider failure instead of marking dispatch successful', async () => {
  configure();
  globalThis.fetch = async () => ({ ok: false, status: 503, json: async () => ({ message: 'Unavailable' }) });
  const res = await handler(request());
  assert.equal(res.statusCode, 502);
  assert.equal(JSON.parse(res.body).success, false);
  assert.equal(JSON.parse(res.body).results.errors.length, 2);
});
