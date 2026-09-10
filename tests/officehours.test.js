import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ALLOWED_EMAIL_DOMAINS,
  parseAndValidateEmail,
  timeStringToMinutes,
  minutesToTimeString,
  createIstanbulIsoString,
  getIstanbulDateString,
  formatIstanbulDateOnly,
  formatIstanbulTimeOnly,
  generateDateCandidateSlots,
  annotateSlotsWithAvailability,
  evaluateStudentBookingEligibility,
  evaluateEmailRateLimit,
  formatCountdown
} from '../static/js/officehours-common.js';

test('Email Domain Allowlist: accepts exactly marun.edu.tr and marmara.edu.tr', () => {
  assert.deepEqual(ALLOWED_EMAIL_DOMAINS, ['marun.edu.tr', 'marmara.edu.tr']);

  // Valid marun.edu.tr
  const r1 = parseAndValidateEmail('123456789@marun.edu.tr');
  assert.equal(r1.valid, true);
  assert.equal(r1.email, '123456789@marun.edu.tr');
  assert.equal(r1.domain, 'marun.edu.tr');

  // Valid marmara.edu.tr
  const r2 = parseAndValidateEmail('student.name@marmara.edu.tr');
  assert.equal(r2.valid, true);
  assert.equal(r2.email, 'student.name@marmara.edu.tr');
  assert.equal(r2.domain, 'marmara.edu.tr');

  // Case normalization & surrounding whitespace
  const r3 = parseAndValidateEmail('  STUDENT@MARUN.EDU.TR  ');
  assert.equal(r3.valid, true);
  assert.equal(r3.email, 'student@marun.edu.tr');
  assert.equal(r3.domain, 'marun.edu.tr');

  const r4 = parseAndValidateEmail('  Yunus.Serhat@Marmara.Edu.Tr \t\n');
  assert.equal(r4.valid, true);
  assert.equal(r4.email, 'yunus.serhat@marmara.edu.tr');
  assert.equal(r4.domain, 'marmara.edu.tr');
});

test('Email Domain Validation: rejects common commercial and unrelated domains', () => {
  const invalidDomains = [
    'user@gmail.com',
    'user@hotmail.com',
    'user@yahoo.com',
    'user@outlook.com',
    'user@icloud.com',
    'user@boun.edu.tr',
    'user@itu.edu.tr',
    'user@metu.edu.tr'
  ];

  for (const email of invalidDomains) {
    const res = parseAndValidateEmail(email);
    assert.equal(res.valid, false, `Expected ${email} to be rejected`);
    assert.match(res.error, /authorized|accepted/i);
  }
});

test('Email Domain Validation: strictly rejects subdomains', () => {
  const subdomains = [
    'student@cs.marmara.edu.tr',
    'student@sub.marun.edu.tr',
    'student@eng.marmara.edu.tr',
    'student@fbe.marun.edu.tr',
    'student@deep.nested.marun.edu.tr'
  ];

  for (const email of subdomains) {
    const res = parseAndValidateEmail(email);
    assert.equal(res.valid, false, `Expected subdomain ${email} to be rejected`);
    assert.match(res.error, /authorized|accepted/i);
  }
});

test('Email Domain Validation: strictly rejects suffix lookalikes and attacker domains', () => {
  const lookalikes = [
    'student@marun.edu.tr.attacker.com',
    'student@marmara.edu.tr.attacker.com',
    'student@marun.edu.tr.evil.org',
    'student@notmarun.edu.tr',
    'student@fakemarmara.edu.tr',
    'student@marun.edu.tr@other.com'
  ];

  for (const email of lookalikes) {
    const res = parseAndValidateEmail(email);
    assert.equal(res.valid, false, `Expected lookalike ${email} to be rejected`);
  }
});

test('Email Domain Validation: rejects malformed and empty inputs', () => {
  const malformed = [
    '',
    '   ',
    null,
    undefined,
    12345,
    'plainaddress',
    '@marun.edu.tr',
    'user@',
    'user@@marun.edu.tr',
    'user name@marun.edu.tr',
    'user..name@marun.edu.tr',
    '.user@marun.edu.tr',
    'user.@marun.edu.tr'
  ];

  for (const input of malformed) {
    const res = parseAndValidateEmail(input);
    assert.equal(res.valid, false, `Expected invalid input ${input} to be rejected`);
  }
});

test('Time Math: conversion between time strings and minutes', () => {
  assert.equal(timeStringToMinutes('00:00'), 0);
  assert.equal(timeStringToMinutes('10:00'), 600);
  assert.equal(timeStringToMinutes('13:40'), 820);
  assert.equal(timeStringToMinutes('16:00:00'), 960);

  assert.equal(minutesToTimeString(0), '00:00');
  assert.equal(minutesToTimeString(600), '10:00');
  assert.equal(minutesToTimeString(820), '13:40');
  assert.equal(minutesToTimeString(960), '16:00');
});

test('Timezone Formatting: Europe/Istanbul canonical formatting', () => {
  // 2026-09-15 13:40 Istanbul is 10:40 UTC
  const isoUtc = '2026-09-15T10:40:00.000Z';

  const timeOnly = formatIstanbulTimeOnly(isoUtc);
  assert.equal(timeOnly, '13:40');

  const dateStr = getIstanbulDateString(isoUtc);
  assert.equal(dateStr, '2026-09-15');

  const formattedDate = formatIstanbulDateOnly(isoUtc, 'en-GB');
  assert.match(formattedDate, /Tuesday/);
  assert.match(formattedDate, /15/);
  assert.match(formattedDate, /September/);
  assert.match(formattedDate, /2026/);

  // createIstanbulIsoString verifies UTC+03:00 representation
  const generatedIso = createIstanbulIsoString('2026-09-15', '13:40');
  assert.equal(generatedIso, '2026-09-15T10:40:00.000Z');
});

test('Slot Generation: generates 20-min slots with 10-min buffer', () => {
  // Tuesday 13:00 to 16:00
  // 2026-09-15 is a Tuesday (DOW = 2)
  const rules = [
    { day_of_week: 2, start_time: '13:00:00', end_time: '16:00:00', is_active: true }
  ];

  const nowFarEarlier = new Date('2026-09-01T00:00:00Z');

  const slots = generateDateCandidateSlots({
    dateStr: '2026-09-15',
    rules,
    exceptions: [],
    durationMinutes: 20,
    bufferMinutes: 10,
    minNoticeHours: 24,
    currentTime: nowFarEarlier
  });

  // Step is 30 mins: 13:00-13:20, 13:30-13:50, 14:00-14:20, 14:30-14:50, 15:00-15:20, 15:30-15:50
  assert.equal(slots.length, 6);

  assert.equal(slots[0].startTimeStr, '13:00');
  assert.equal(slots[0].endTimeStr, '13:20');

  assert.equal(slots[1].startTimeStr, '13:30');
  assert.equal(slots[1].endTimeStr, '13:50');

  assert.equal(slots[2].startTimeStr, '14:00');
  assert.equal(slots[2].endTimeStr, '14:20');

  assert.equal(slots[3].startTimeStr, '14:30');
  assert.equal(slots[3].endTimeStr, '14:50');

  assert.equal(slots[4].startTimeStr, '15:00');
  assert.equal(slots[4].endTimeStr, '15:20');

  assert.equal(slots[5].startTimeStr, '15:30');
  assert.equal(slots[5].endTimeStr, '15:50');

  for (const s of slots) {
    assert.equal(s.isNoticeEligible, true);
  }
});

test('Slot Generation: enforces minimum 24-hour booking notice', () => {
  const rules = [
    { day_of_week: 2, start_time: '13:00:00', end_time: '16:00:00', is_active: true }
  ];

  // Current time is 2026-09-14 14:00 UTC (which is 17:00 Istanbul)
  // Tomorrow 2026-09-15 13:00 Istanbul is only 20 hours away -> notice NOT eligible
  const currentSimulatedTime = new Date('2026-09-14T14:00:00Z');

  const slots = generateDateCandidateSlots({
    dateStr: '2026-09-15',
    rules,
    exceptions: [],
    durationMinutes: 20,
    bufferMinutes: 10,
    minNoticeHours: 24,
    currentTime: currentSimulatedTime
  });

  assert.equal(slots.length, 6);
  // All slots on 15 Sept start at 13:00 - 15:30 Istanbul (10:00 - 12:30 UTC)
  // Distance from 14 Sept 14:00 UTC to 15 Sept 10:00 UTC is only 20 hours (< 24h)
  for (const slot of slots) {
    assert.equal(slot.isNoticeEligible, false);
  }
});

test('Slot Generation: blocked exception dates produce 0 slots', () => {
  const rules = [
    { day_of_week: 2, start_time: '13:00:00', end_time: '16:00:00', is_active: true }
  ];

  const exceptions = [
    { exception_date: '2026-09-22', is_blocked: true, reason: 'Conference' }
  ];

  const slots = generateDateCandidateSlots({
    dateStr: '2026-09-22',
    rules,
    exceptions,
    durationMinutes: 20,
    bufferMinutes: 10,
    currentTime: new Date('2026-09-01T00:00:00Z')
  });

  assert.equal(slots.length, 0);
});

test('Availability Annotation: marks booked slots without leaking student PII', () => {
  const rules = [
    { day_of_week: 2, start_time: '13:00:00', end_time: '15:00:00', is_active: true }
  ];

  const candidateSlots = generateDateCandidateSlots({
    dateStr: '2026-09-15',
    rules,
    durationMinutes: 20,
    bufferMinutes: 10,
    currentTime: new Date('2026-09-01T00:00:00Z')
  });

  // Candidate slots are 13:00-13:20, 13:30-13:50, 14:00-14:20, 14:30-14:50
  // Suppose slot 13:30 is booked (13:30 Istanbul = 10:30 UTC)
  const bookedSlots = [
    {
      slot_start: '2026-09-15T10:30:00.000Z',
      slot_end: '2026-09-15T10:50:00.000Z'
    }
  ];

  const annotated = annotateSlotsWithAvailability(candidateSlots, bookedSlots);

  assert.equal(annotated.length, 4);

  // 13:00-13:20 -> Available
  assert.equal(annotated[0].startTimeStr, '13:00');
  assert.equal(annotated[0].isAvailable, true);
  assert.equal(annotated[0].status, 'available');

  // 13:30-13:50 -> Booked / Unavailable
  assert.equal(annotated[1].startTimeStr, '13:30');
  assert.equal(annotated[1].isAvailable, false);
  assert.equal(annotated[1].status, 'booked');

  // 14:00-14:20 -> Available
  assert.equal(annotated[2].startTimeStr, '14:00');
  assert.equal(annotated[2].isAvailable, true);
  assert.equal(annotated[2].status, 'available');

  // Verify zero PII fields are attached
  for (const s of annotated) {
    assert.equal(s.email, undefined);
    assert.equal(s.student_id, undefined);
    assert.equal(s.topic, undefined);
  }
});

test('Student Booking Limits: enforces max 1 active future booking', () => {
  const currentTime = new Date('2026-09-10T12:00:00Z');

  // Student has an upcoming booking on 2026-09-15
  const studentAppointments = [
    {
      slot_start: '2026-09-15T10:00:00.000Z',
      slot_end: '2026-09-15T10:20:00.000Z',
      status: 'booked'
    }
  ];

  // Try to book another slot on 2026-09-24
  const check = evaluateStudentBookingEligibility({
    studentAppointments,
    candidateSlotStartIso: '2026-09-24T10:00:00.000Z',
    maxActive: 1,
    rollingDays: 7,
    currentTime
  });

  assert.equal(check.allowed, false);
  assert.match(check.reason, /active upcoming appointment/);
});

test('Student Booking Limits: enforces rolling 7-day window limit', () => {
  const currentTime = new Date('2026-09-10T12:00:00Z');

  // Student attended a past booking on 2026-09-08 (less than 7 days ago)
  const studentAppointments = [
    {
      slot_start: '2026-09-08T10:00:00.000Z',
      slot_end: '2026-09-08T10:20:00.000Z',
      status: 'booked'
    }
  ];

  // Try to book on 2026-09-12 (only 4 days away from 2026-09-08)
  const check = evaluateStudentBookingEligibility({
    studentAppointments,
    candidateSlotStartIso: '2026-09-12T10:00:00.000Z',
    maxActive: 1,
    rollingDays: 7,
    maxRolling: 1,
    currentTime
  });

  assert.equal(check.allowed, false);
  assert.match(check.reason, /Fair access policy/);

  // But trying to book on 2026-09-18 (10 days later) with past booking completed:
  const pastAppointments = [
    {
      slot_start: '2026-09-01T10:00:00.000Z',
      slot_end: '2026-09-01T10:20:00.000Z',
      status: 'booked'
    }
  ];

  const check2 = evaluateStudentBookingEligibility({
    studentAppointments: pastAppointments,
    candidateSlotStartIso: '2026-09-15T10:00:00.000Z',
    maxActive: 1,
    rollingDays: 7,
    maxRolling: 1,
    currentTime
  });

  assert.equal(check2.allowed, true);
});

test('Rate Limiting: 1st email request is immediately permitted', () => {
  const result = evaluateEmailRateLimit([], 100000);
  assert.equal(result.allowed, true);
  assert.equal(result.remainingAttempts, 1);
  assert.equal(result.waitSeconds, 0);
  assert.equal(result.willTriggerCooldown, false);
});

test('Rate Limiting: 2nd email request within 2 minutes is permitted but flags 5-minute cooldown', () => {
  const t1 = 100000;
  const t2 = 100000 + 45 * 1000; // 45 seconds later (within 2-minute window)
  const history = [t1];

  const result = evaluateEmailRateLimit(history, t2);
  assert.equal(result.allowed, true);
  assert.equal(result.remainingAttempts, 0);
  assert.equal(result.waitSeconds, 300);
  assert.equal(result.willTriggerCooldown, true);
});

test('Rate Limiting: 3rd email request within 2 minutes is BLOCKED with active cooldown', () => {
  const t1 = 100000;
  const t2 = 100000 + 30 * 1000; // 30s after t1
  const t3 = 100000 + 60 * 1000; // 60s after t1 (30s after t2)
  const history = [t1, t2];

  const result = evaluateEmailRateLimit(history, t3);
  assert.equal(result.allowed, false);
  assert.equal(result.remainingAttempts, 0);
  // Cooldown is 300s from t2 (130000 + 300000 = 430000). At t3 (160000), remaining is 270s.
  assert.equal(result.waitSeconds, 270);
  assert.match(result.reason, /Spam koruması/);
});

test('Rate Limiting: request after 5-minute cooldown period expires is permitted again', () => {
  const t1 = 100000;
  const t2 = 100000 + 30 * 1000; // 130000
  const history = [t1, t2];

  // Cooldown ends at 130000 + 300000 = 430000.
  // Test at 431000 (after cooldown):
  const tAfterCooldown = 431000;
  const result = evaluateEmailRateLimit(history, tAfterCooldown);
  assert.equal(result.allowed, true);
  assert.equal(result.remainingAttempts, 1);
  assert.equal(result.waitSeconds, 0);
});

test('Rate Limiting: 2 requests spaced more than 2 minutes apart do NOT trigger cooldown', () => {
  const t1 = 100000;
  const history = [t1];

  // 2.5 minutes later (150s later)
  const t2 = 100000 + 150 * 1000;
  const result = evaluateEmailRateLimit(history, t2);
  assert.equal(result.allowed, true);
  assert.equal(result.remainingAttempts, 1);
  assert.equal(result.waitSeconds, 0);
  assert.equal(result.willTriggerCooldown, false);
});

test('Countdown Formatting: correctly formats MM:SS and seconds', () => {
  assert.equal(formatCountdown(300), '05:00');
  assert.equal(formatCountdown(270), '04:30');
  assert.equal(formatCountdown(65), '01:05');
  assert.equal(formatCountdown(59), '59s');
  assert.equal(formatCountdown(5), '5s');
  assert.equal(formatCountdown(0), '0s');
});

test('Primary Admin Configuration: single authorized admin is yunus.serhat@marmara.edu.tr', () => {
  const primaryAdmin = 'yunus.serhat@marmara.edu.tr';
  const val = parseAndValidateEmail(primaryAdmin);
  assert.equal(val.valid, true);
  assert.equal(val.email, 'yunus.serhat@marmara.edu.tr');
  assert.equal(val.domain, 'marmara.edu.tr');
});
