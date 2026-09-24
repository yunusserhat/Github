import test from 'node:test';
import assert from 'node:assert/strict';
import { handler } from '../netlify/functions/notify-appointment.js';

test('notify-appointment: rejects non-POST HTTP methods', async () => {
  const res = await handler({ httpMethod: 'GET' });
  assert.equal(res.statusCode, 405);
});

test('notify-appointment: returns 500 when RESEND_API_KEY is missing', async () => {
  const originalKey = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;

  const res = await handler({
    httpMethod: 'POST',
    body: JSON.stringify({ record: {} })
  });

  assert.equal(res.statusCode, 500);
  assert.match(res.body, /RESEND_API_KEY/);

  process.env.RESEND_API_KEY = originalKey;
});

test('notify-appointment: validates required appointment payload fields', async () => {
  process.env.RESEND_API_KEY = 'test_key';

  // Empty record
  const res1 = await handler({
    httpMethod: 'POST',
    body: JSON.stringify({ record: {} })
  });
  assert.equal(res1.statusCode, 400);

  // Missing slot_start
  const res2 = await handler({
    httpMethod: 'POST',
    body: JSON.stringify({ record: { student_email: 'test@marun.edu.tr' } })
  });
  assert.equal(res2.statusCode, 400);

  delete process.env.RESEND_API_KEY;
});

test('notify-appointment: correctly invokes Resend API for booking notification', async () => {
  process.env.RESEND_API_KEY = 're_mock_test_key';
  process.env.ADMIN_EMAIL = 'yunus.serhat@marmara.edu.tr';

  const dispatchedRequests = [];
  const originalFetch = globalThis.fetch;

  // Mock fetch
  globalThis.fetch = async (url, options) => {
    dispatchedRequests.push({
      url,
      body: JSON.parse(options.body),
      headers: options.headers
    });
    return {
      ok: true,
      status: 200,
      json: async () => ({ id: 'mock_email_id_' + dispatchedRequests.length })
    };
  };

  const payload = {
    type: 'INSERT',
    record: {
      id: 'app-uuid-123',
      student_email: '150119001@marun.edu.tr',
      slot_start: '2026-10-14T11:00:00Z',
      slot_end: '2026-10-14T11:20:00Z',
      topic: 'Bitirme Projesi Danışmanlığı',
      note: 'Hocam kaynak kodları githuba yükledim.',
      meeting_type: 'office',
      location_or_link: 'Mühendislik Fakültesi D-Blok Oda: 304',
      status: 'booked'
    }
  };

  const res = await handler({
    httpMethod: 'POST',
    body: JSON.stringify(payload)
  });

  // Restore fetch
  globalThis.fetch = originalFetch;
  delete process.env.RESEND_API_KEY;

  assert.equal(res.statusCode, 200);
  const data = JSON.parse(res.body);
  assert.equal(data.success, true);
  assert.equal(data.results.adminSent, true);
  assert.equal(data.results.studentSent, true);

  // Verify two emails were dispatched
  assert.equal(dispatchedRequests.length, 2);

  // 1. Admin Email checks
  const adminReq = dispatchedRequests.find((r) => r.body.to.includes('yunus.serhat@marmara.edu.tr'));
  assert.ok(adminReq, 'Admin email must be dispatched');
  assert.match(adminReq.body.subject, /Yeni Ofis Saati Randevusu/);
  assert.match(adminReq.body.html, /150119001@marun.edu.tr/);
  assert.match(adminReq.body.html, /Bitirme Projesi Danışmanlığı/);

  // 2. Student Email checks
  const studentReq = dispatchedRequests.find((r) => r.body.to.includes('150119001@marun.edu.tr'));
  assert.ok(studentReq, 'Student email must be dispatched');
  assert.match(studentReq.body.subject, /Ofis Saati Randevunuz Onaylandı/);
  assert.match(studentReq.body.html, /calendar\.google\.com/); // Google Calendar link
  assert.match(studentReq.body.html, /Mühendislik Fakültesi D-Blok/);
});

test('notify-appointment: correctly invokes Resend API for cancellation notification', async () => {
  process.env.RESEND_API_KEY = 're_mock_test_key';

  const dispatchedRequests = [];
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url, options) => {
    dispatchedRequests.push({
      url,
      body: JSON.parse(options.body)
    });
    return {
      ok: true,
      status: 200,
      json: async () => ({ id: 'mock_cancel_id' })
    };
  };

  const payload = {
    type: 'UPDATE',
    old_record: { status: 'booked' },
    record: {
      id: 'app-uuid-123',
      student_email: '150119001@marun.edu.tr',
      slot_start: '2026-10-14T11:00:00Z',
      slot_end: '2026-10-14T11:20:00Z',
      topic: 'Bitirme Projesi Danışmanlığı',
      status: 'cancelled'
    }
  };

  const res = await handler({
    httpMethod: 'POST',
    body: JSON.stringify(payload)
  });

  globalThis.fetch = originalFetch;
  delete process.env.RESEND_API_KEY;

  assert.equal(res.statusCode, 200);
  const data = JSON.parse(res.body);
  assert.equal(data.results.adminSent, true);
  assert.equal(data.results.studentSent, true);
  assert.equal(dispatchedRequests.length, 2);

  // Verify cancellation subjects
  assert.match(dispatchedRequests[0].body.subject, /İPTAL/);
  assert.match(dispatchedRequests[1].body.subject, /İptal/);
});
