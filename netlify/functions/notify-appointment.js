/**
 * Netlify Serverless Function: Office Hours Email Notifications
 * 
 * Triggered automatically by Supabase Database Webhooks when an appointment
 * is booked or cancelled in `public.officehours_appointments`.
 * 
 * Sends branded, responsive HTML emails to:
 * 1. The Professor (Admin) - Instant booking alert with details and direct admin link
 * 2. The Student - Confirmation with meeting instructions and 1-click Google Calendar button
 */

const RESEND_API_URL = 'https://api.resend.com/emails';

// Configuration defaults (can be overridden via Netlify Environment Variables)
const DEFAULT_ADMIN_EMAIL = 'yunus.serhat@marmara.edu.tr';
const DEFAULT_FROM_EMAIL = 'Dr. Yunus Serhat Bıçakçı <ofis@yunusserhat.com>';
const SITE_URL = 'https://yunusserhat.com';

/**
 * Format ISO datetime into Europe/Istanbul Turkish readable format.
 * Example: "14 Ekim 2026 Çarşamba", "14:00 - 14:30"
 */
function formatAppointmentTimes(slotStartIso, slotEndIso) {
  const startDate = new Date(slotStartIso);
  const endDate = new Date(slotEndIso);

  const dateFormatted = new Intl.DateTimeFormat('tr-TR', {
    timeZone: 'Europe/Istanbul',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(startDate);

  const startTime = new Intl.DateTimeFormat('tr-TR', {
    timeZone: 'Europe/Istanbul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(startDate);

  const endTime = new Intl.DateTimeFormat('tr-TR', {
    timeZone: 'Europe/Istanbul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(endDate);

  return {
    dateFormatted,
    timeRange: `${startTime} – ${endTime}`,
    startTime,
    endTime
  };
}

/**
 * Generate Google Calendar 1-click template URL (using UTC timestamps)
 */
function generateGoogleCalendarUrl({ title, slotStartIso, slotEndIso, description, location }) {
  const formatUtc = (iso) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const dates = `${formatUtc(slotStartIso)}/${formatUtc(slotEndIso)}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: dates,
    details: description || '',
    location: location || ''
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * HTML Escaping helper for safe email templates
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Professor (Admin) Email Template for New Bookings
 */
function renderAdminBookingEmail(record) {
  const { dateFormatted, timeRange } = formatAppointmentTimes(record.slot_start, record.slot_end);
  const isOnline = record.meeting_type === 'online';
  const meetingTypeLabel = isOnline ? 'Online (Çevrim İçi Görüşme)' : 'Ofiste (Yüz Yüze Görüşme)';
  const locationText = record.location_or_link || (isOnline ? 'Bağlantı henüz eklenmedi' : 'Ofis');
  const safeNote = record.note ? `<div style="margin-top:12px;padding:12px;background:#f8fafc;border-left:4px solid #0284c7;border-radius:4px;"><strong style="color:#0f172a;display:block;margin-bottom:4px;font-size:13px;">Öğrenci Notu:</strong><span style="color:#334155;font-size:14px;">${escapeHtml(record.note)}</span></div>` : '';

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#1e293b;background-color:#f1f5f9;margin:0;padding:24px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
    <tr>
      <td style="background:#0f172a;padding:28px 32px;color:#ffffff;">
        <span style="display:inline-block;padding:4px 10px;background:#0284c7;color:#ffffff;font-size:12px;font-weight:600;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Ofis Saati Sistemi</span>
        <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">Yeni Randevu Alındı</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:32px;">
        <p style="margin-top:0;font-size:15px;color:#475569;">Bir öğrenci ofis saatiniz için yeni bir randevu oluşturdu:</p>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin:20px 0;">
          <tr>
            <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;width:120px;color:#64748b;font-size:13px;font-weight:600;">Öğrenci</td>
            <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-weight:600;font-size:15px;">
              <a href="mailto:${escapeHtml(record.student_email)}" style="color:#0284c7;text-decoration:none;">${escapeHtml(record.student_email)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;font-weight:600;">Tarih</td>
            <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;font-weight:600;">${dateFormatted}</td>
          </tr>
          <tr>
            <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;font-weight:600;">Saat</td>
            <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;font-weight:600;">${timeRange}</td>
          </tr>
          <tr>
            <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;font-weight:600;">Görüşme Türü</td>
            <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;">
              <span style="display:inline-block;padding:3px 8px;border-radius:4px;font-size:12px;font-weight:600;background:${isOnline ? '#e0f2fe;color:#0369a1;' : '#dcfce7;color:#15803d;'}">
                ${meetingTypeLabel}
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;font-weight:600;">Konum / Bağlantı</td>
            <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;">${escapeHtml(locationText)}</td>
          </tr>
          <tr>
            <td style="padding:14px 18px;color:#64748b;font-size:13px;font-weight:600;">Görüşme Konusu</td>
            <td style="padding:14px 18px;color:#0f172a;font-size:14px;font-weight:600;">${escapeHtml(record.topic)}</td>
          </tr>
        </table>

        ${safeNote}

        <div style="margin-top:28px;text-align:center;">
          <a href="${SITE_URL}/officehours/admin/" style="display:inline-block;padding:12px 24px;background:#0f172a;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">Admin Panelinde Görüntüle</a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;color:#94a3b8;font-size:12px;">
        yunusserhat.com • Öğrenci Ofis Saatleri Otomasyonu
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Student Email Template for New Bookings
 */
function renderStudentBookingEmail(record) {
  const { dateFormatted, timeRange } = formatAppointmentTimes(record.slot_start, record.slot_end);
  const isOnline = record.meeting_type === 'online';
  const meetingTypeLabel = isOnline ? 'Online (Çevrim İçi Görüşme)' : 'Ofiste (Yüz Yüze Görüşme)';
  const locationText = record.location_or_link || (isOnline ? 'Toplantı bağlantısı ayrıca iletilecektir' : 'Öğretim Üyesi Ofisi');

  const gcalUrl = generateGoogleCalendarUrl({
    title: `Ofis Saati: Dr. Yunus Serhat Bıçakçı - ${record.topic}`,
    slotStartIso: record.slot_start,
    slotEndIso: record.slot_end,
    description: `Ofis Saati Randevusu\nKonu: ${record.topic}\nGörüşme Türü: ${meetingTypeLabel}\nKonum: ${locationText}\n\nİptal etmek veya detayları incelemek için: ${SITE_URL}/officehours/`,
    location: locationText
  });

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#1e293b;background-color:#f1f5f9;margin:0;padding:24px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
    <tr>
      <td style="background:#0284c7;padding:28px 32px;color:#ffffff;">
        <span style="display:inline-block;padding:4px 10px;background:rgba(255,255,255,0.2);color:#ffffff;font-size:12px;font-weight:600;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Randevu Onayı</span>
        <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">Ofis Saati Randevunuz Onaylandı</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:32px;">
        <p style="margin-top:0;font-size:15px;color:#334155;">Merhaba,</p>
        <p style="font-size:15px;color:#475569;"><strong>Dr. Yunus Serhat Bıçakçı</strong> ile ofis saati randevunuz başarıyla onaylanmıştır. Randevu detaylarınız aşağıdadır:</p>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin:20px 0;">
          <tr>
            <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;width:120px;color:#64748b;font-size:13px;font-weight:600;">Tarih</td>
            <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;font-weight:600;">${dateFormatted}</td>
          </tr>
          <tr>
            <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;font-weight:600;">Saat</td>
            <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;font-weight:600;">${timeRange}</td>
          </tr>
          <tr>
            <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;font-weight:600;">Görüşme Türü</td>
            <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;">
              <span style="display:inline-block;padding:3px 8px;border-radius:4px;font-size:12px;font-weight:600;background:${isOnline ? '#e0f2fe;color:#0369a1;' : '#dcfce7;color:#15803d;'}">
                ${meetingTypeLabel}
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;font-weight:600;">Yer / Link</td>
            <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;font-weight:600;">${escapeHtml(locationText)}</td>
          </tr>
          <tr>
            <td style="padding:14px 18px;color:#64748b;font-size:13px;font-weight:600;">Konu</td>
            <td style="padding:14px 18px;color:#0f172a;font-size:14px;font-weight:600;">${escapeHtml(record.topic)}</td>
          </tr>
        </table>

        <!-- Google Calendar 1-Click Button -->
        <div style="margin:24px 0;text-align:center;">
          <a href="${gcalUrl}" target="_blank" style="display:inline-block;padding:12px 24px;background:#0284c7;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;border-radius:8px;box-shadow:0 2px 4px rgba(2,132,199,0.25);">📅 Google Takvim'e Ekle</a>
        </div>

        <div style="margin-top:28px;padding:14px;background:#fffbeb;border:1px solid #fef3c7;border-radius:8px;color:#92400e;font-size:13px;">
          <strong>Önemli Bilgilendirme:</strong> Randevunuza katılamayacaksanız, lütfen diğer öğrenci arkadaşlarınıza yer açmak amacıyla randevunuzu en az 24 saat önceden <a href="${SITE_URL}/officehours/" style="color:#b45309;font-weight:600;">${SITE_URL}/officehours/</a> adresinden iptal ediniz.
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;color:#94a3b8;font-size:12px;">
        Dr. Yunus Serhat Bıçakçı • <a href="${SITE_URL}" style="color:#0284c7;text-decoration:none;">yunusserhat.com</a>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Professor & Student Cancellation Template
 */
function renderCancellationEmail(record, isForAdmin) {
  const { dateFormatted, timeRange } = formatAppointmentTimes(record.slot_start, record.slot_end);

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#1e293b;background-color:#f1f5f9;margin:0;padding:24px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
    <tr>
      <td style="background:#e11d48;padding:24px 32px;color:#ffffff;">
        <span style="display:inline-block;padding:4px 10px;background:rgba(255,255,255,0.2);color:#ffffff;font-size:12px;font-weight:600;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">İptal Bildirimi</span>
        <h1 style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">Ofis Saati Randevusu İptal Edildi</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:32px;">
        <p style="margin-top:0;font-size:15px;color:#334155;">${isForAdmin ? `Öğrenci <strong>${escapeHtml(record.student_email)}</strong> randevusunu iptal etti:` : 'Aşağıdaki ofis saati randevusu iptal edilmiştir:'}</p>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff1f2;border:1px solid #fecdd3;border-radius:8px;margin:20px 0;">
          <tr>
            <td style="padding:14px 18px;border-bottom:1px solid #fecdd3;color:#9f1239;font-size:13px;font-weight:600;width:120px;">Tarih & Saat</td>
            <td style="padding:14px 18px;border-bottom:1px solid #fecdd3;color:#0f172a;font-size:14px;font-weight:600;">${dateFormatted} (${timeRange})</td>
          </tr>
          <tr>
            <td style="padding:14px 18px;color:#9f1239;font-size:13px;font-weight:600;">Konu</td>
            <td style="padding:14px 18px;color:#0f172a;font-size:14px;">${escapeHtml(record.topic)}</td>
          </tr>
        </table>

        ${!isForAdmin ? `<p style="font-size:14px;color:#475569;">Yeni bir tarih için randevu almak isterseniz <a href="${SITE_URL}/officehours/" style="color:#0284c7;font-weight:600;">${SITE_URL}/officehours/</a> sayfasını ziyaret edebilirsiniz.</p>` : ''}
      </td>
    </tr>
    <tr>
      <td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;color:#94a3b8;font-size:12px;">
        Dr. Yunus Serhat Bıçakçı • yunusserhat.com
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Dispatch an email via Resend API
 */
async function sendResendEmail({ apiKey, from, to, subject, html }) {
  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ from, to, subject, html })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Resend API error (${response.status})`);
  }
  return data;
}

/**
 * Main Handler
 * Works with Netlify Functions v1 and v2, and Supabase Database Webhook payloads.
 */
export const handler = async (event) => {
  // Only accept POST requests
  const method = event.httpMethod || (event.request && event.request.method);
  if (method && method.toUpperCase() !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY environment variable is missing.');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'RESEND_API_KEY environment variable is not configured.' })
    };
  }

  const adminEmail = process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
  const fromEmail = process.env.FROM_EMAIL || DEFAULT_FROM_EMAIL;

  let body = {};
  try {
    const raw = typeof event.body === 'string' ? event.body : JSON.stringify(event.body || {});
    body = JSON.parse(raw);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON payload' })
    };
  }

  // Parse Supabase Database Webhook payload:
  // Can be { type: 'INSERT'|'UPDATE', record: { ... }, old_record: { ... } }
  // or direct { record: { ... } }
  const webhookType = body.type || 'INSERT';
  const record = body.record || body.appointment || body;
  const oldRecord = body.old_record;

  if (!record || !record.student_email || !record.slot_start) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required appointment fields (student_email, slot_start)' })
    };
  }

  const results = {
    adminSent: false,
    studentSent: false,
    errors: []
  };

  try {
    const isCancellation = record.status === 'cancelled' || (oldRecord && oldRecord.status === 'booked' && record.status === 'cancelled');

    if (isCancellation) {
      // 1. Send Cancellation Email to Admin
      try {
        await sendResendEmail({
          apiKey,
          from: fromEmail,
          to: [adminEmail],
          subject: `[İPTAL] Ofis Saati Randevusu: ${record.student_email}`,
          html: renderCancellationEmail(record, true)
        });
        results.adminSent = true;
      } catch (err) {
        results.errors.push(`Admin cancellation email failed: ${err.message}`);
      }

      // 2. Send Cancellation Email to Student
      try {
        await sendResendEmail({
          apiKey,
          from: fromEmail,
          to: [record.student_email],
          subject: `Ofis Saati Randevunuz İptal Edildi - Dr. Yunus Serhat Bıçakçı`,
          html: renderCancellationEmail(record, false)
        });
        results.studentSent = true;
      } catch (err) {
        results.errors.push(`Student cancellation email failed: ${err.message}`);
      }

    } else if (record.status === 'booked') {
      const { dateFormatted, timeRange } = formatAppointmentTimes(record.slot_start, record.slot_end);

      // 1. Send Booking Alert Email to Professor (Admin)
      try {
        await sendResendEmail({
          apiKey,
          from: fromEmail,
          to: [adminEmail],
          subject: `📅 Yeni Ofis Saati Randevusu: ${record.student_email} (${dateFormatted} ${timeRange})`,
          html: renderAdminBookingEmail(record)
        });
        results.adminSent = true;
      } catch (err) {
        results.errors.push(`Admin booking email failed: ${err.message}`);
      }

      // 2. Send Confirmation Email to Student (with Google Calendar button)
      try {
        await sendResendEmail({
          apiKey,
          from: fromEmail,
          to: [record.student_email],
          subject: `Ofis Saati Randevunuz Onaylandı - Dr. Yunus Serhat Bıçakçı`,
          html: renderStudentBookingEmail(record)
        });
        results.studentSent = true;
      } catch (err) {
        results.errors.push(`Student booking email failed: ${err.message}`);
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        recordId: record.id,
        results
      })
    };
  } catch (globalErr) {
    console.error('Notification dispatch error:', globalErr);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: globalErr.message, results })
    };
  }
};
