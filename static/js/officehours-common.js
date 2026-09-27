/**
 * Office Hours Booking System - Common Utilities & Business Logic
 * Shared between student booking, admin dashboard, and automated unit tests.
 */

export const ALLOWED_EMAIL_DOMAINS = Object.freeze(['marun.edu.tr', 'marmara.edu.tr']);

export const DEFAULT_SETTINGS = Object.freeze({
  meetingDurationMinutes: 20,
  bufferMinutes: 10,
  minBookingNoticeHours: 24,
  maxActiveBookingsPerStudent: 1,
  rollingDaysLimit: 7,
  maxBookingsInRollingDays: 1,
  timezone: 'Europe/Istanbul'
});

/**
 * Strict email parsing and domain allowlist validation.
 * Rejects subdomains, lookalikes, malformed strings, and unapproved domains.
 *
 * @param {string} rawEmail
 * @returns {{ valid: boolean, email?: string, domain?: string, error?: string }}
 */
export function parseAndValidateEmail(rawEmail) {
  if (typeof rawEmail !== 'string') {
    return { valid: false, error: 'Email address must be a valid text string.' };
  }

  const trimmed = rawEmail.trim().toLowerCase();
  if (!trimmed) {
    return { valid: false, error: 'Email address cannot be empty.' };
  }

  // Ensure there is at least one '@' and local part is not empty
  const atIndex = trimmed.lastIndexOf('@');
  if (atIndex <= 0 || atIndex === trimmed.length - 1) {
    return { valid: false, error: 'Please enter a complete and valid email address.' };
  }

  const localPart = trimmed.slice(0, atIndex);
  const domainPart = trimmed.slice(atIndex + 1);

  // Reject multiple '@' symbols
  if (localPart.includes('@')) {
    return { valid: false, error: 'Email address cannot contain multiple "@" symbols.' };
  }

  // Basic local part format validation (no consecutive dots, no whitespace)
  if (/\s/.test(localPart) || localPart.includes('..') || localPart.startsWith('.') || localPart.endsWith('.')) {
    return { valid: false, error: 'The email local part contains invalid characters.' };
  }

  // Domain part checks:
  // Must match EXACT allowlist domain (no subdomains, no suffix lookalikes)
  if (!ALLOWED_EMAIL_DOMAINS.includes(domainPart)) {
    return {
      valid: false,
      error: 'Only official university email addresses (@marun.edu.tr or @marmara.edu.tr) are authorized.'
    };
  }

  return {
    valid: true,
    email: `${localPart}@${domainPart}`,
    domain: domainPart
  };
}

/**
 * Parses an HH:MM:SS or HH:MM time string into minutes from midnight.
 * @param {string} timeStr
 * @returns {number}
 */
export function timeStringToMinutes(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.split(':').map((p) => parseInt(p, 10));
  const hours = parts[0] || 0;
  const minutes = parts[1] || 0;
  return hours * 60 + minutes;
}

/**
 * Formats minutes from midnight into HH:MM.
 * @param {number} totalMinutes
 * @returns {string}
 */
export function minutesToTimeString(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Formats an ISO datetime string into human-readable Istanbul local time.
 * @param {string|Date} isoOrDate
 * @param {string} locale
 * @returns {string}
 */
export function formatIstanbulDateTime(isoOrDate, locale = 'en-GB') {
  const date = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(locale, {
    timeZone: 'Europe/Istanbul',
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
}

/**
 * Formats an ISO datetime into Istanbul date only (e.g. Tuesday, 15 September 2026).
 * @param {string|Date} isoOrDate
 * @param {string} locale
 * @returns {string}
 */
export function formatIstanbulDateOnly(isoOrDate, locale = 'en-GB') {
  const date = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(locale, {
    timeZone: 'Europe/Istanbul',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * Formats an ISO datetime into Istanbul time only (e.g. 13:40).
 * @param {string|Date} isoOrDate
 * @returns {string}
 */
export function formatIstanbulTimeOnly(isoOrDate) {
  const date = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Istanbul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
}

/**
 * Extracts the YYYY-MM-DD string in Europe/Istanbul for a given Date/ISO string.
 * @param {Date|string} dateOrIso
 * @returns {string}
 */
export function getIstanbulDateString(dateOrIso) {
  const date = typeof dateOrIso === 'string' ? new Date(dateOrIso) : dateOrIso;
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);

  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  const day = parts.find((p) => p.type === 'day')?.value;
  return `${year}-${month}-${day}`;
}

/**
 * Constructs an ISO string for a given date string (YYYY-MM-DD) and time string (HH:MM)
 * specifically in Europe/Istanbul (+03:00 fixed timezone).
 *
 * @param {string} dateStr YYYY-MM-DD
 * @param {string} timeStr HH:MM or HH:MM:SS
 * @returns {string} Canonical UTC ISO string
 */
export function createIstanbulIsoString(dateStr, timeStr) {
  const cleanTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr.slice(0, 8);
  // Europe/Istanbul is permanent UTC+03:00 since 2016
  const dateWithOffset = new Date(`${dateStr}T${cleanTime}+03:00`);
  return dateWithOffset.toISOString();
}

/**
 * Generates candidate time slots for a single date based on recurring availability rules and settings.
 *
 * @param {Object} params
 * @param {string} params.dateStr YYYY-MM-DD
 * @param {Array<{ day_of_week: number, start_time: string, end_time: string, is_active: boolean }>} params.rules
 * @param {Array<{ exception_date: string, is_blocked: boolean, reason?: string }>} params.exceptions
 * @param {number} [params.durationMinutes=20]
 * @param {number} [params.bufferMinutes=10]
 * @param {number} [params.minNoticeHours=24]
 * @param {Date} [params.currentTime=new Date()]
 * @returns {Array<{ slotStartIso: string, slotEndIso: string, startTimeStr: string, endTimeStr: string, dateStr: string, isNoticeEligible: boolean, isBlocked: boolean, blockReason?: string }>}
 */
export function generateDateCandidateSlots({
  dateStr,
  rules = [],
  exceptions = [],
  dateOverrides = [],
  durationMinutes = 20,
  bufferMinutes = 10,
  minNoticeHours = 24,
  currentTime = new Date()
}) {
  const slots = [];

  // Check if entire date is blocked by exception
  const exception = exceptions.find((e) => e.exception_date === dateStr && e.is_blocked);
  if (exception) {
    return slots; // Date is completely blocked
  }

  // Calculate day of week for dateStr in Europe/Istanbul
  const sampleTime = new Date(`${dateStr}T12:00:00+03:00`);
  const dayOfWeek = sampleTime.getUTCDay(); // UTC day for 12:00 UTC+3 is same day

  // Date-specific overrides matching this date
  const matchingOverrides = dateOverrides.filter((o) => o.is_active && o.override_date === dateStr);

  // Active recurring rules matching this day of week
  const matchingRules = rules.filter((r) => r.is_active && r.day_of_week === dayOfWeek);

  const combinedWindows = [];

  // Date overrides take precedence
  for (const o of matchingOverrides) {
    combinedWindows.push({
      start_time: o.start_time,
      end_time: o.end_time,
      meeting_type: o.meeting_type || 'office',
      location_or_link: o.location_or_link || '',
      isOverride: true
    });
  }

  // Then recurring rules
  for (const r of matchingRules) {
    combinedWindows.push({
      start_time: r.start_time,
      end_time: r.end_time,
      meeting_type: r.meeting_type || 'office',
      location_or_link: r.location_or_link || '',
      isOverride: false
    });
  }

  if (!combinedWindows.length) {
    return slots;
  }

  const stepMinutes = durationMinutes + bufferMinutes;
  const minNoticeThreshold = new Date(currentTime.getTime() + minNoticeHours * 60 * 60 * 1000);
  const seenSlotKeys = new Set();

  for (const win of combinedWindows) {
    const windowStartMin = timeStringToMinutes(win.start_time);
    const windowEndMin = timeStringToMinutes(win.end_time);

    let currentSlotStartMin = windowStartMin;
    while (currentSlotStartMin + durationMinutes <= windowEndMin) {
      const currentSlotEndMin = currentSlotStartMin + durationMinutes;

      const startTimeStr = minutesToTimeString(currentSlotStartMin);
      const endTimeStr = minutesToTimeString(currentSlotEndMin);
      const slotKey = `${startTimeStr}-${endTimeStr}`;

      if (!seenSlotKeys.has(slotKey)) {
        seenSlotKeys.add(slotKey);

        const slotStartIso = createIstanbulIsoString(dateStr, startTimeStr);
        const slotEndIso = createIstanbulIsoString(dateStr, endTimeStr);

        const slotStartDate = new Date(slotStartIso);
        const isNoticeEligible = slotStartDate >= minNoticeThreshold;

        slots.push({
          dateStr,
          startTimeStr,
          endTimeStr,
          slotStartIso,
          slotEndIso,
          meetingType: win.meeting_type || 'office',
          locationOrLink: win.location_or_link || '',
          isNoticeEligible,
          isBlocked: false
        });
      }

      currentSlotStartMin += stepMinutes;
    }
  }

  // Sort chronologically
  slots.sort((a, b) => new Date(a.slotStartIso) - new Date(b.slotStartIso));
  return slots;
}

/**
 * Checks candidate slots against booked appointments to mark availability.
 * Guarantees that no student PII is required.
 *
 * @param {Array<Object>} candidateSlots
 * @param {Array<{ slot_start: string, slot_end: string }>} bookedSlots
 * @returns {Array<Object>}
 */
export function annotateSlotsWithAvailability(candidateSlots, bookedSlots = []) {
  const bookedIntervals = bookedSlots.map((b) => ({
    start: new Date(b.slot_start).getTime(),
    end: new Date(b.slot_end).getTime()
  }));

  return candidateSlots.map((slot) => {
    const slotStart = new Date(slot.slotStartIso).getTime();
    const slotEnd = new Date(slot.slotEndIso).getTime();

    // Check overlap with any booked interval: start < bEnd && end > bStart
    const isBooked = bookedIntervals.some(
      (b) => slotStart < b.end && slotEnd > b.start
    );

    let status = 'available';
    if (!slot.isNoticeEligible) {
      status = 'too_soon';
    } else if (isBooked) {
      status = 'booked';
    }

    return {
      ...slot,
      isBooked,
      isAvailable: slot.isNoticeEligible && !isBooked,
      status
    };
  });
}

/**
 * Evaluates whether a student is eligible to book a candidate slot based on active and rolling limits.
 *
 * @param {Object} params
 * @param {Array<{ slot_start: string, slot_end: string, status: string }>} params.studentAppointments
 * @param {string} params.candidateSlotStartIso
 * @param {number} [params.maxActive=1]
 * @param {number} [params.rollingDays=7]
 * @param {number} [params.maxRolling=1]
 * @param {Date} [params.currentTime=new Date()]
 * @returns {{ allowed: boolean, reason?: string }}
 */
export function evaluateStudentBookingEligibility({
  studentAppointments = [],
  candidateSlotStartIso,
  maxActive = 1,
  rollingDays = 7,
  maxRolling = 1,
  currentTime = new Date()
}) {
  const activeBookings = studentAppointments.filter(
    (a) => a.status === 'booked' && new Date(a.slot_end) > currentTime
  );

  if (activeBookings.length >= maxActive) {
    return {
      allowed: false,
      reason: `You already have ${activeBookings.length} active upcoming appointment. You must attend or cancel it before booking another.`
    };
  }

  const candidateStartTime = new Date(candidateSlotStartIso).getTime();
  const rollingWindowMs = rollingDays * 24 * 60 * 60 * 1000;

  const rollingCollisions = studentAppointments.filter((a) => {
    if (a.status !== 'booked') return false;
    const existingStart = new Date(a.slot_start).getTime();
    return Math.abs(existingStart - candidateStartTime) <= rollingWindowMs;
  });

  if (rollingCollisions.length >= maxRolling) {
    return {
      allowed: false,
      reason: `Fair access policy allows a maximum of ${maxRolling} appointment every ${rollingDays} days.`
    };
  }

  return { allowed: true };
}

/**
 * Supabase Auth's default minimum interval between two emails to the same
 * address (Authentication > Rate Limits). Used only to pace the resend button;
 * the limit itself is enforced by Supabase Auth.
 */
export const OTP_RESEND_INTERVAL_SECONDS = 60;

const AUTH_RATE_LIMIT_CODES = Object.freeze(['over_email_send_rate_limit', 'over_request_rate_limit']);

/**
 * Returns how long to wait after a Supabase Auth rate-limit error, or null for
 * any other error. Per-address limits report "...after N seconds."; project or
 * IP limits carry no interval, so the fallback is used.
 *
 * @param {{ status?: number, code?: string, message?: string } | null | undefined} error
 * @param {number} [fallbackSeconds=OTP_RESEND_INTERVAL_SECONDS]
 * @returns {number | null}
 */
export function getAuthRateLimitWaitSeconds(error, fallbackSeconds = OTP_RESEND_INTERVAL_SECONDS) {
  if (!error) return null;
  if (error.status !== 429 && !AUTH_RATE_LIMIT_CODES.includes(error.code)) return null;

  const match = /after\s+(\d+)\s+seconds?/i.exec(String(error.message || ''));
  const seconds = match ? Number(match[1]) : fallbackSeconds;
  return Math.max(1, seconds);
}

/**
 * @param {{ code?: string, message?: string } | null | undefined} error
 * @returns {boolean} true when Supabase Auth rejected the CAPTCHA token.
 */
export function isCaptchaError(error) {
  if (!error) return false;
  return error.code === 'captcha_failed' || /captcha/i.test(String(error.message || ''));
}

/**
 * Builds the argument for supabase.auth.signInWithOtp(). The CAPTCHA token is
 * included only when one was issued, so the call is unchanged while CAPTCHA
 * protection is disabled.
 *
 * @param {string} email
 * @param {{ redirectTo?: string, captchaToken?: string, shouldCreateUser?: boolean }} [options]
 */
export function buildEmailOtpRequest(email, { redirectTo, captchaToken, shouldCreateUser = true } = {}) {
  const options = { shouldCreateUser };
  if (redirectTo) options.emailRedirectTo = redirectTo;
  if (captchaToken) options.captchaToken = captchaToken;
  return { email, options };
}

/**
 * Formats remaining seconds into MM:SS or Xs.
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatCountdown(totalSeconds) {
  const s = Math.max(0, Math.ceil(totalSeconds));
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;
  if (minutes > 0) {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${seconds}s`;
}

const LEGACY_RATE_LIMIT_STORAGE_PREFIX = 'oh_rate_limit_';

/**
 * Removes the email-keyed records that earlier versions kept in localStorage
 * for a client-side OTP limiter. Returns the number of records removed.
 *
 * @param {Storage} [storage] defaults to window.localStorage
 * @returns {number}
 */
export function clearLegacyRateLimitRecords(storage) {
  try {
    const target = storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined);
    if (!target) return 0;
    const keys = [];
    for (let i = 0; i < target.length; i++) {
      const key = target.key(i);
      if (key && key.startsWith(LEGACY_RATE_LIMIT_STORAGE_PREFIX)) keys.push(key);
    }
    keys.forEach((key) => target.removeItem(key));
    return keys.length;
  } catch {
    return 0;
  }
}

export function filterSlotsByMeetingType(slots = [], filterType = 'all') {
  if (!filterType || filterType === 'all') return slots;
  return slots.filter((s) => {
    if (filterType === 'office') {
      return s.meetingType === 'office' || s.meetingType === 'both';
    }
    if (filterType === 'online') {
      return s.meetingType === 'online' || s.meetingType === 'both';
    }
    return true;
  });
}

export function formatMeetingTypeLabel(type) {
  switch (type) {
    case 'online':
      return 'Online (Çevrim içi)';
    case 'both':
      return 'Ofis veya Online (Öğrenci Seçer)';
    case 'office':
    default:
      return 'Yüz Yüze (Ofiste)';
  }
}

export function getMeetingTypeBadge(type) {
  switch (type) {
    case 'online':
      return '<span class="badge bg-info text-white"><i class="fas fa-video me-1"></i> Online</span>';
    case 'both':
      return '<span class="badge bg-primary text-white"><i class="fas fa-handshake me-1"></i> Ofis / Online</span>';
    case 'office':
    default:
      return '<span class="badge bg-success text-white"><i class="fas fa-building me-1"></i> Ofiste</span>';
  }
}

export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Attach to window if running in browser
if (typeof window !== 'undefined') {
  window.OfficeHoursCommon = {
    ALLOWED_EMAIL_DOMAINS,
    DEFAULT_SETTINGS,
    OTP_RESEND_INTERVAL_SECONDS,
    escapeHtml,
    parseAndValidateEmail,
    timeStringToMinutes,
    minutesToTimeString,
    formatIstanbulDateTime,
    formatIstanbulDateOnly,
    formatIstanbulTimeOnly,
    getIstanbulDateString,
    createIstanbulIsoString,
    generateDateCandidateSlots,
    annotateSlotsWithAvailability,
    evaluateStudentBookingEligibility,
    getAuthRateLimitWaitSeconds,
    isCaptchaError,
    buildEmailOtpRequest,
    formatCountdown,
    clearLegacyRateLimitRecords,
    filterSlotsByMeetingType,
    formatMeetingTypeLabel,
    getMeetingTypeBadge
  };
}

