/**
 * Office Hours Booking System - Administrator Portal Controller
 * Manages appointment inspection, appointment cancellation, recurring schedules,
 * blocked date exceptions, and global meeting rules.
 */

import {
  formatIstanbulDateTime,
  formatIstanbulDateOnly,
  formatIstanbulTimeOnly
} from './officehours-common.js';

(function () {
  'use strict';

  // State
  let supabase = null;
  let currentAdminUser = null;
  let adminOtpTargetEmail = '';
  let activeTab = 'appointments';
  let appointmentFilter = 'upcoming';

  let cachedAppointments = [];
  let cachedRules = [];
  let cachedExceptions = [];
  let cachedOverrides = [];
  let cachedSettings = null;

  // DOM Elements
  const elConfigWarning = document.getElementById('oh-admin-config-warning');
  const elAlert = document.getElementById('oh-admin-alert');
  const elAlertMessage = document.getElementById('oh-admin-alert-message');
  const elBtnCloseAlert = document.getElementById('oh-btn-admin-close-alert');

  const elLoading = document.getElementById('oh-admin-loading');
  const elLoginSection = document.getElementById('oh-admin-login-section');
  const elUnauthorizedSection = document.getElementById('oh-admin-unauthorized-section');
  const elDashboard = document.getElementById('oh-admin-dashboard');

  const elFormEmail = document.getElementById('oh-admin-form-email');
  const elInputEmail = document.getElementById('oh-admin-input-email');
  const elBtnSendEmail = document.getElementById('oh-admin-btn-send-email');
  const elFormOtp = document.getElementById('oh-admin-form-otp');
  const elInputOtp = document.getElementById('oh-admin-input-otp');
  const elBtnVerifyOtp = document.getElementById('oh-admin-btn-verify-otp');
  const elOtpTarget = document.getElementById('oh-admin-otp-target');
  const elBtnBackEmail = document.getElementById('oh-admin-btn-back-email');

  const elUnauthEmail = document.getElementById('oh-unauth-email');
  const elBtnUnauthSignout = document.getElementById('oh-btn-unauth-signout');
  const elAdminEmailDisplay = document.getElementById('oh-admin-email-display');
  const elBtnSignout = document.getElementById('oh-admin-btn-signout');

  // Tab Buttons
  const tabButtons = document.querySelectorAll('.oh-nav-pills button[data-tab]');
  const tabContents = document.querySelectorAll('.oh-tab-content');

  // Appointments Tab
  const elFilterGroup = document.getElementById('oh-filter-appointments');
  const elApptsLoading = document.getElementById('oh-admin-appts-loading');
  const elApptsEmpty = document.getElementById('oh-admin-appts-empty');
  const elApptsList = document.getElementById('oh-admin-appts-list');

  // Rules Tab
  const elRulesLoading = document.getElementById('oh-rules-loading');
  const elRulesEmpty = document.getElementById('oh-rules-empty');
  const elRulesList = document.getElementById('oh-rules-list');
  const elFormAddRule = document.getElementById('oh-form-add-rule');
  const elRuleDay = document.getElementById('oh-rule-day');
  const elRuleStart = document.getElementById('oh-rule-start');
  const elRuleEnd = document.getElementById('oh-rule-end');
  const elRuleLocation = document.getElementById('oh-rule-location');

  // Exceptions & Date Overrides Tab
  const elOverridesLoading = document.getElementById('oh-overrides-loading');
  const elOverridesEmpty = document.getElementById('oh-overrides-empty');
  const elOverridesList = document.getElementById('oh-overrides-list');
  const elFormAddOverride = document.getElementById('oh-form-add-override');
  const elOverrideDate = document.getElementById('oh-override-date');
  const elOverrideStart = document.getElementById('oh-override-start');
  const elOverrideEnd = document.getElementById('oh-override-end');
  const elOverrideLocation = document.getElementById('oh-override-location');

  const elExceptionsLoading = document.getElementById('oh-exceptions-loading');
  const elExceptionsEmpty = document.getElementById('oh-exceptions-empty');
  const elExceptionsList = document.getElementById('oh-exceptions-list');
  const elFormAddException = document.getElementById('oh-form-add-exception');
  const elExceptionDate = document.getElementById('oh-exception-date');
  const elExceptionReason = document.getElementById('oh-exception-reason');

  // Settings Tab
  const elFormSettings = document.getElementById('oh-form-settings');
  const elSettingDuration = document.getElementById('oh-setting-duration');
  const elSettingBuffer = document.getElementById('oh-setting-buffer');
  const elSettingNotice = document.getElementById('oh-setting-notice');
  const elSettingMaxActive = document.getElementById('oh-setting-max-active');
  const elSettingRollingDays = document.getElementById('oh-setting-rolling-days');
  const elSettingRollingMax = document.getElementById('oh-setting-rolling-max');
  const elSettingSemStart = document.getElementById('oh-setting-sem-start');
  const elSettingSemEnd = document.getElementById('oh-setting-sem-end');
  const elSettingEnabled = document.getElementById('oh-setting-enabled');
  const elBtnSaveSettings = document.getElementById('oh-btn-save-settings');

  const DOW_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Alert Utility
  function showAlert(msg, type = 'danger') {
    if (!elAlert) return;
    elAlertMessage.textContent = msg;
    elAlert.className = `oh-alert oh-alert-${type} mb-4`;
    elAlert.classList.remove('d-none');
  }

  function hideAlert() {
    if (elAlert) elAlert.classList.add('d-none');
  }

  function setButtonLoading(btn, isLoading) {
    if (!btn) return;
    const spinner = btn.querySelector('.oh-spinner');
    if (spinner) {
      if (isLoading) spinner.classList.remove('d-none');
      else spinner.classList.add('d-none');
    }
    btn.disabled = isLoading;
  }

  // Initialization
  async function init() {
    const config = window.__OFFICEHOURS_CONFIG__ || {};
    const supabaseUrl = config.supabaseUrl || window.OFFICEHOURS_SUPABASE_URL;
    const supabaseAnonKey = config.supabaseAnonKey || window.OFFICEHOURS_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) {
      if (elConfigWarning) elConfigWarning.classList.remove('d-none');
      if (elLoading) elLoading.classList.add('d-none');
      return;
    }

    supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });

    bindEvents();
    await checkSession();

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        if (window.location.hash && (window.location.hash.includes('access_token') || window.location.hash.includes('error'))) {
          window.history.replaceState(null, '', window.location.pathname);
        }
        await checkSession();
      } else if (event === 'SIGNED_OUT') {
        currentAdminUser = null;
        showLoginView();
      }
    });
  }

  async function checkSession() {
    elLoading.classList.remove('d-none');
    elLoginSection.classList.add('d-none');
    elUnauthorizedSection.classList.add('d-none');
    elDashboard.classList.add('d-none');

    try {
      const sessionPromise = supabase.auth.getSession();
      const sessionTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Session retrieval timed out.')), 7000)
      );
      const { data: { session } } = await Promise.race([sessionPromise, sessionTimeout]);

      if (!session || !session.user) {
        showLoginView();
        return;
      }

      // Check admin authorization via database function with timeout
      const rpcPromise = supabase.rpc('is_admin');
      const rpcTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Yetki doğrulaması zaman aşımına uğradı. Lütfen Supabase SQL Editor üzerinden SQL güncellemesini çalıştırın.')), 7000)
      );
      const { data: isAdmin, error: adminErr } = await Promise.race([rpcPromise, rpcTimeout]);

      if (adminErr || !isAdmin) {
        elUnauthEmail.textContent = session.user.email;
        elUnauthorizedSection.classList.remove('d-none');
        return;
      }

      currentAdminUser = session.user;
      elAdminEmailDisplay.textContent = currentAdminUser.email;
      elDashboard.classList.remove('d-none');

      // Load initial tab data
      switchTab('appointments');
    } catch (err) {
      showAlert('Giriş yetkisi kontrol edilirken hata oluştu: ' + (err.message || err), 'danger');
      showLoginView();
    } finally {
      elLoading.classList.add('d-none');
    }
  }

  function showLoginView() {
    elLoading.classList.add('d-none');
    elUnauthorizedSection.classList.add('d-none');
    elDashboard.classList.add('d-none');
    elLoginSection.classList.remove('d-none');
    elFormEmail.classList.remove('d-none');
    elFormOtp.classList.add('d-none');
  }

  const AUTHORIZED_ADMIN_EMAIL = 'yunus.serhat@marmara.edu.tr';
  let adminCooldownTimer = null;

  function startAdminCooldown(seconds) {
    if (!elBtnSendEmail) return;
    if (adminCooldownTimer) clearInterval(adminCooldownTimer);

    let remaining = seconds;
    elBtnSendEmail.disabled = true;

    const updateLabel = () => {
      const formatted = window.OfficeHoursCommon?.formatCountdown
        ? window.OfficeHoursCommon.formatCountdown(remaining)
        : `${remaining}s`;
      elBtnSendEmail.querySelector('span:last-child').textContent = `Bekleyin (${formatted})`;
    };

    updateLabel();

    adminCooldownTimer = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(adminCooldownTimer);
        adminCooldownTimer = null;
        elBtnSendEmail.disabled = false;
        elBtnSendEmail.querySelector('span:last-child').innerHTML = 'Send Login Code <i class="fas fa-paper-plane ms-1"></i>';
      } else {
        updateLabel();
      }
    }, 1000);
  }

  function bindEvents() {
    if (elBtnCloseAlert) elBtnCloseAlert.addEventListener('click', hideAlert);

    // Admin login email
    if (elFormEmail) {
      elFormEmail.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlert();
        const email = elInputEmail.value.trim().toLowerCase();

        if (email !== AUTHORIZED_ADMIN_EMAIL) {
          showAlert('Sadece yetkili yönetici adresi (yunus.serhat@marmara.edu.tr) ile giriş yapılabilir.', 'danger');
          return;
        }

        // We always query Supabase server RPC as the single authoritative source of truth,
        // preventing client-side localStorage de-synchronization issues.
        setButtonLoading(elBtnSendEmail, true);
        try {
          // Check & record rate limit on server side
          const { data: rlData, error: rlErr } = await supabase.rpc('check_and_record_otp_rate_limit', {
            p_email: email
          });

          if (!rlErr && rlData && rlData.allowed === false) {
            const waitSec = rlData.wait_seconds || 300;
            if (window.OfficeHoursCommon?.recordClientRateLimit) {
              window.OfficeHoursCommon.recordClientRateLimit(email, waitSec);
            }
            showAlert(rlData.reason || `Spam koruması: Lütfen ${waitSec} saniye bekleyin.`, 'warning');
            startAdminCooldown(waitSec);
            return;
          }

          // If allowed, clear any stale client-side rate limit lock
          if (window.OfficeHoursCommon?.clearClientRateLimit) {
            window.OfficeHoursCommon.clearClientRateLimit(email);
          }

          const redirectUrl = window.location.origin + window.location.pathname;
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: redirectUrl
            }
          });
          if (error) {
            showAlert(error.message, 'danger');
          } else {
            const waitSec = rlData?.wait_seconds || 0;
            if (window.OfficeHoursCommon?.recordClientRateLimit) {
              window.OfficeHoursCommon.recordClientRateLimit(email, waitSec);
            }
            adminOtpTargetEmail = email;
            elOtpTarget.textContent = email;
            elFormEmail.classList.add('d-none');
            elFormOtp.classList.remove('d-none');
            elInputOtp.focus();
          }
        } finally {
          setButtonLoading(elBtnSendEmail, false);
        }
      });
    }

    // Admin login OTP
    if (elFormOtp) {
      elFormOtp.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlert();
        const token = elInputOtp.value.trim();
        if (!token) return;

        setButtonLoading(elBtnVerifyOtp, true);
        try {
          const { data, error } = await supabase.auth.verifyOtp({
            email: adminOtpTargetEmail,
            token,
            type: 'email'
          });
          if (error) {
            showAlert(error.message, 'danger');
          } else {
            await checkSession();
          }
        } finally {
          setButtonLoading(elBtnVerifyOtp, false);
        }
      });
    }

    if (elBtnBackEmail) {
      elBtnBackEmail.addEventListener('click', () => {
        elFormOtp.classList.add('d-none');
        elFormEmail.classList.remove('d-none');
        elInputEmail.focus();
      });
    }

    if (elBtnSignout) {
      elBtnSignout.addEventListener('click', () => supabase.auth.signOut());
    }
    if (elBtnUnauthSignout) {
      elBtnUnauthSignout.addEventListener('click', () => supabase.auth.signOut());
    }

    // Tab navigation buttons
    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        switchTab(tab);
      });
    });

    // Appointment filter pills
    if (elFilterGroup) {
      elFilterGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-filter]');
        if (!btn) return;
        elFilterGroup.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        appointmentFilter = btn.getAttribute('data-filter');
        renderAppointments();
      });
    }

    // Add availability rule form
    if (elFormAddRule) {
      elFormAddRule.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlert();
        const dow = parseInt(elRuleDay.value, 10);
        const startTime = elRuleStart.value;
        const endTime = elRuleEnd.value;

        if (startTime >= endTime) {
          showAlert('Start time must be strictly earlier than end time.', 'danger');
          return;
        }

        const meetingType = elFormAddRule.querySelector('input[name="oh-rule-meeting-type"]:checked')?.value || 'office';
        const locationOrLink = elRuleLocation?.value?.trim() || '';

        try {
          const { error } = await supabase.from('officehours_availability_rules').insert([
            {
              day_of_week: dow,
              start_time: startTime,
              end_time: endTime,
              meeting_type: meetingType,
              location_or_link: locationOrLink,
              is_active: true
            }
          ]);
          if (error) {
            showAlert(error.message, 'danger');
          } else {
            showAlert('Haftalık müsaitlik saati eklendi.', 'success');
            if (elRuleLocation) elRuleLocation.value = '';
            await loadRules();
          }
        } catch (err) {
          showAlert(err.message, 'danger');
        }
      });
    }

    // Add Date Override Form
    if (elFormAddOverride) {
      elFormAddOverride.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlert();
        const date = elOverrideDate.value;
        const startTime = elOverrideStart.value;
        const endTime = elOverrideEnd.value;
        const meetingType = elFormAddOverride.querySelector('input[name="oh-override-meeting-type"]:checked')?.value || 'office';
        const locationOrLink = elOverrideLocation?.value?.trim() || '';

        if (!date) {
          showAlert('Lütfen bir tarih seçin.', 'danger');
          return;
        }

        if (startTime >= endTime) {
          showAlert('Başlangıç saati bitiş saatinden önce olmalıdır.', 'danger');
          return;
        }

        try {
          const { error } = await supabase.from('officehours_date_overrides').insert([
            {
              override_date: date,
              start_time: startTime,
              end_time: endTime,
              meeting_type: meetingType,
              location_or_link: locationOrLink,
              is_active: true
            }
          ]);
          if (error) {
            showAlert(error.message, 'danger');
          } else {
            showAlert(`${date} tarihi için özel müsaitlik saati eklendi.`, 'success');
            elOverrideDate.value = '';
            if (elOverrideLocation) elOverrideLocation.value = '';
            await loadOverrides();
          }
        } catch (err) {
          showAlert(err.message, 'danger');
        }
      });
    }

    // Add exception form
    if (elFormAddException) {
      elFormAddException.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlert();
        const date = elExceptionDate.value;
        const reason = elExceptionReason.value.trim() || 'Unavailable';

        if (!date) return;

        try {
          const { error } = await supabase.from('officehours_availability_exceptions').insert([
            { exception_date: date, reason, is_blocked: true }
          ]);
          if (error) {
            showAlert(error.message, 'danger');
          } else {
            showAlert('Blocked date added.', 'success');
            elExceptionDate.value = '';
            elExceptionReason.value = '';
            await loadExceptions();
          }
        } catch (err) {
          showAlert(err.message, 'danger');
        }
      });
    }

    // Save settings form
    if (elFormSettings) {
      elFormSettings.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlert();
        setButtonLoading(elBtnSaveSettings, true);

        const updates = {
          meeting_duration_minutes: parseInt(elSettingDuration.value, 10),
          buffer_minutes: parseInt(elSettingBuffer.value, 10),
          min_booking_notice_hours: parseInt(elSettingNotice.value, 10),
          max_active_bookings_per_student: parseInt(elSettingMaxActive.value, 10),
          rolling_days_limit: parseInt(elSettingRollingDays.value, 10),
          max_bookings_in_rolling_days: parseInt(elSettingRollingMax.value, 10),
          semester_start_date: elSettingSemStart.value || null,
          semester_end_date: elSettingSemEnd.value || null,
          is_booking_enabled: elSettingEnabled.checked,
          updated_at: new Date().toISOString()
        };

        try {
          const { error } = await supabase
            .from('officehours_settings')
            .update(updates)
            .eq('id', 1);

          if (error) {
            showAlert('Failed to update settings: ' + error.message, 'danger');
          } else {
            showAlert('Office hours settings saved successfully.', 'success');
          }
        } catch (err) {
          showAlert(err.message, 'danger');
        } finally {
          setButtonLoading(elBtnSaveSettings, false);
        }
      });
    }
  }

  function switchTab(tabName) {
    activeTab = tabName;
    tabButtons.forEach((btn) => {
      if (btn.getAttribute('data-tab') === tabName) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    tabContents.forEach((tc) => {
      if (tc.id === `oh-tab-${tabName}`) tc.classList.remove('d-none');
      else tc.classList.add('d-none');
    });

    if (tabName === 'appointments') loadAppointments();
    else if (tabName === 'availability') loadRules();
    else if (tabName === 'exceptions') {
      loadOverrides();
      loadExceptions();
    }
    else if (tabName === 'settings') loadSettings();
  }

  // --- TAB 1: Appointments ---
  async function loadAppointments() {
    elApptsLoading.classList.remove('d-none');
    elApptsEmpty.classList.add('d-none');
    elApptsList.classList.add('d-none');

    try {
      const { data, error } = await supabase
        .from('officehours_appointments')
        .select('*')
        .order('slot_start', { ascending: false });

      if (error) throw error;
      cachedAppointments = data || [];
      renderAppointments();
    } catch (err) {
      showAlert('Failed to load appointments: ' + err.message, 'danger');
    } finally {
      elApptsLoading.classList.add('d-none');
    }
  }

  function renderAppointments() {
    elApptsList.innerHTML = '';
    const now = new Date();

    let filtered = cachedAppointments.filter((a) => {
      const start = new Date(a.slot_start);
      if (appointmentFilter === 'upcoming') {
        return a.status === 'booked' && start >= now;
      } else if (appointmentFilter === 'past') {
        return start < now;
      } else if (appointmentFilter === 'cancelled') {
        return a.status.startsWith('cancelled');
      }
      return true; // 'all'
    });

    if (!filtered.length) {
      elApptsEmpty.classList.remove('d-none');
      return;
    }

    elApptsEmpty.classList.add('d-none');
    elApptsList.classList.remove('d-none');

    filtered.forEach((appt) => {
      const card = document.createElement('div');
      const isCancelled = appt.status.startsWith('cancelled');
      card.className = `oh-admin-appt-card ${isCancelled ? 'oh-status-cancelled' : ''}`;

      const domain = appt.student_email.split('@')[1] || '';
      const isUpcoming = appt.status === 'booked' && new Date(appt.slot_start) >= now;

      let statusBadge = '';
      if (appt.status === 'booked') {
        statusBadge = isUpcoming
          ? '<span class="badge bg-success">Confirmed Upcoming</span>'
          : '<span class="badge bg-secondary">Completed / Past</span>';
      } else if (appt.status === 'cancelled_by_student') {
        statusBadge = '<span class="badge bg-warning text-dark">Cancelled by Student</span>';
      } else {
        statusBadge = '<span class="badge bg-danger">Cancelled by Admin</span>';
      }

      let meetingBadge = '';
      if (appt.meeting_type === 'online') {
        meetingBadge = '<span class="badge bg-info text-dark ms-1"><i class="fas fa-video me-1"></i> Online</span>';
      } else {
        meetingBadge = '<span class="badge bg-success text-white ms-1"><i class="fas fa-building me-1"></i> Ofiste</span>';
      }

      card.innerHTML = `
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
          <div>
            <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
              <span class="fw-bold fs-6 text-primary">
                ${formatIstanbulDateOnly(appt.slot_start)} • ${formatIstanbulTimeOnly(appt.slot_start)}–${formatIstanbulTimeOnly(appt.slot_end)}
              </span>
              ${statusBadge}
              ${meetingBadge}
            </div>
            <div class="small text-muted mb-2">
              <i class="fas fa-user-graduate me-1"></i>
              <strong>${appt.student_email}</strong>
              <span class="oh-domain-badge ms-1">@${domain}</span>
            </div>
          </div>
          ${
            appt.status === 'booked'
              ? `<button type="button" class="btn btn-outline-danger btn-sm oh-btn-admin-cancel" data-id="${appt.id}">
                  <i class="fas fa-times me-1"></i> Cancel Appointment
                </button>`
              : ''
          }
        </div>
        <div class="p-2 rounded bg-white dark-bg-alt border">
          <div><strong>Konu / Topic:</strong> ${escapeHtml(appt.topic)}</div>
          ${
            appt.location_or_link
              ? `<div class="small text-muted mt-1"><i class="fas fa-map-marker-alt me-1 text-danger"></i><strong>Konum / Link:</strong> ${escapeHtml(appt.location_or_link)}</div>`
              : ''
          }
          ${
            appt.note
              ? `<div class="small text-muted mt-1"><strong>Not:</strong> ${escapeHtml(appt.note)}</div>`
              : ''
          }
        </div>
      `;

      const cancelBtn = card.querySelector('.oh-btn-admin-cancel');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => cancelAppointment(appt.id));
      }

      elApptsList.appendChild(card);
    });
  }

  async function cancelAppointment(id) {
    const confirmMsg = window.confirm('Are you sure you want to cancel this student appointment?');
    if (!confirmMsg) return;

    try {
      const { error } = await supabase.rpc('cancel_officehours_appointment', {
        p_appointment_id: id
      });
      if (error) {
        showAlert(error.message, 'danger');
      } else {
        showAlert('Appointment cancelled.', 'success');
        await loadAppointments();
      }
    } catch (err) {
      showAlert(err.message, 'danger');
    }
  }

  // --- TAB 2: Weekly Availability Rules ---
  async function loadRules() {
    elRulesLoading.classList.remove('d-none');
    elRulesEmpty.classList.add('d-none');
    elRulesList.classList.add('d-none');

    try {
      const { data, error } = await supabase
        .from('officehours_availability_rules')
        .select('*')
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      cachedRules = data || [];
      renderRules();
    } catch (err) {
      showAlert('Failed to load availability rules: ' + err.message, 'danger');
    } finally {
      elRulesLoading.classList.add('d-none');
    }
  }

  function renderRules() {
    elRulesList.innerHTML = '';
    if (!cachedRules.length) {
      elRulesEmpty.classList.remove('d-none');
      return;
    }

    elRulesEmpty.classList.add('d-none');
    elRulesList.classList.remove('d-none');

    cachedRules.forEach((rule) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center py-3';

      const dowName = DOW_NAMES[rule.day_of_week] || `Day ${rule.day_of_week}`;
      const startStr = rule.start_time.slice(0, 5);
      const endStr = rule.end_time.slice(0, 5);

      let typeBadge = '';
      if (rule.meeting_type === 'online') {
        typeBadge = '<span class="badge bg-info text-dark me-2"><i class="fas fa-video me-1"></i> Online</span>';
      } else if (rule.meeting_type === 'both') {
        typeBadge = '<span class="badge bg-primary text-white me-2"><i class="fas fa-handshake me-1"></i> Ofis / Online</span>';
      } else {
        typeBadge = '<span class="badge bg-success text-white me-2"><i class="fas fa-building me-1"></i> Ofiste</span>';
      }

      const locationText = rule.location_or_link
        ? `<span class="small text-muted ms-1"><i class="fas fa-map-marker-alt me-1 text-danger"></i>${escapeHtml(rule.location_or_link)}</span>`
        : '';

      li.innerHTML = `
        <div>
          <span class="fw-bold text-primary fs-6 me-2">${dowName}</span>
          <span class="badge bg-light text-dark border font-monospace me-2">${startStr} – ${endStr}</span>
          ${typeBadge}
          <span class="badge ${rule.is_active ? 'bg-success' : 'bg-secondary'} me-2">${rule.is_active ? 'Active' : 'Paused'}</span>
          ${locationText}
        </div>
        <div class="btn-group btn-group-sm">
          <button type="button" class="btn btn-outline-secondary btn-toggle-rule">
            ${rule.is_active ? 'Pause' : 'Activate'}
          </button>
          <button type="button" class="btn btn-outline-danger btn-delete-rule">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `;

      li.querySelector('.btn-toggle-rule').addEventListener('click', async () => {
        await supabase
          .from('officehours_availability_rules')
          .update({ is_active: !rule.is_active })
          .eq('id', rule.id);
        await loadRules();
      });

      li.querySelector('.btn-delete-rule').addEventListener('click', async () => {
        if (confirm(`Delete recurring hours for ${dowName} (${startStr}–${endStr})?`)) {
          await supabase.from('officehours_availability_rules').delete().eq('id', rule.id);
          await loadRules();
        }
      });

      elRulesList.appendChild(li);
    });
  }

  // --- TAB 3: Date Overrides & Blocked Dates ---
  async function loadOverrides() {
    if (!elOverridesLoading) return;
    elOverridesLoading.classList.remove('d-none');
    if (elOverridesEmpty) elOverridesEmpty.classList.add('d-none');
    if (elOverridesList) elOverridesList.classList.add('d-none');

    try {
      const { data, error } = await supabase
        .from('officehours_date_overrides')
        .select('*')
        .order('override_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      cachedOverrides = data || [];
      renderOverrides();
    } catch (err) {
      showAlert('Özel müsaitlik saatleri yüklenemedi: ' + err.message, 'danger');
    } finally {
      if (elOverridesLoading) elOverridesLoading.classList.add('d-none');
    }
  }

  function renderOverrides() {
    if (!elOverridesList) return;
    elOverridesList.innerHTML = '';
    if (!cachedOverrides.length) {
      if (elOverridesEmpty) elOverridesEmpty.classList.remove('d-none');
      return;
    }

    if (elOverridesEmpty) elOverridesEmpty.classList.add('d-none');
    elOverridesList.classList.remove('d-none');

    cachedOverrides.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center py-3 flex-wrap gap-2';

      const startStr = item.start_time.slice(0, 5);
      const endStr = item.end_time.slice(0, 5);

      let typeBadge = '';
      if (item.meeting_type === 'online') {
        typeBadge = '<span class="badge bg-info text-dark me-2"><i class="fas fa-video me-1"></i> Online</span>';
      } else if (item.meeting_type === 'both') {
        typeBadge = '<span class="badge bg-primary text-white me-2"><i class="fas fa-handshake me-1"></i> Ofis / Online</span>';
      } else {
        typeBadge = '<span class="badge bg-success text-white me-2"><i class="fas fa-building me-1"></i> Ofiste</span>';
      }

      const locationText = item.location_or_link
        ? `<span class="small text-muted ms-1"><i class="fas fa-map-marker-alt me-1 text-danger"></i>${escapeHtml(item.location_or_link)}</span>`
        : '';

      li.innerHTML = `
        <div>
          <span class="fw-bold fs-6 text-primary me-2"><i class="fas fa-calendar-day me-1"></i> ${item.override_date}</span>
          <span class="badge bg-light text-dark border font-monospace me-2">${startStr} – ${endStr}</span>
          ${typeBadge}
          ${locationText}
        </div>
        <button type="button" class="btn btn-outline-danger btn-sm btn-delete-override">
          <i class="fas fa-trash-alt me-1"></i> Sil
        </button>
      `;

      li.querySelector('.btn-delete-override').addEventListener('click', async () => {
        if (confirm(`${item.override_date} (${startStr}–${endStr}) için özel müsaitliği silmek istiyor musunuz?`)) {
          await supabase.from('officehours_date_overrides').delete().eq('id', item.id);
          await loadOverrides();
        }
      });

      elOverridesList.appendChild(li);
    });
  }

  async function loadExceptions() {
    elExceptionsLoading.classList.remove('d-none');
    elExceptionsEmpty.classList.add('d-none');
    elExceptionsList.classList.add('d-none');

    try {
      const { data, error } = await supabase
        .from('officehours_availability_exceptions')
        .select('*')
        .order('exception_date', { ascending: true });

      if (error) throw error;
      cachedExceptions = data || [];
      renderExceptions();
    } catch (err) {
      showAlert('Failed to load exceptions: ' + err.message, 'danger');
    } finally {
      elExceptionsLoading.classList.add('d-none');
    }
  }

  function renderExceptions() {
    elExceptionsList.innerHTML = '';
    if (!cachedExceptions.length) {
      elExceptionsEmpty.classList.remove('d-none');
      return;
    }

    elExceptionsEmpty.classList.add('d-none');
    elExceptionsList.classList.remove('d-none');

    cachedExceptions.forEach((exc) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center py-3';

      li.innerHTML = `
        <div>
          <span class="fw-bold fs-6 text-danger me-2"><i class="fas fa-ban me-1"></i> ${exc.exception_date}</span>
          <span class="text-muted small">&bull; ${escapeHtml(exc.reason)}</span>
        </div>
        <button type="button" class="btn btn-outline-danger btn-sm btn-delete-exc">
          <i class="fas fa-trash-alt me-1"></i> Remove
        </button>
      `;

      li.querySelector('.btn-delete-exc').addEventListener('click', async () => {
        if (confirm(`Unblock date ${exc.exception_date}?`)) {
          await supabase.from('officehours_availability_exceptions').delete().eq('id', exc.id);
          await loadExceptions();
        }
      });

      elExceptionsList.appendChild(li);
    });
  }

  // --- TAB 4: Global Settings ---
  async function loadSettings() {
    try {
      const { data, error } = await supabase
        .from('officehours_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;
      cachedSettings = data;

      elSettingDuration.value = data.meeting_duration_minutes;
      elSettingBuffer.value = data.buffer_minutes;
      elSettingNotice.value = data.min_booking_notice_hours;
      elSettingMaxActive.value = data.max_active_bookings_per_student;
      elSettingRollingDays.value = data.rolling_days_limit;
      elSettingRollingMax.value = data.max_bookings_in_rolling_days;
      elSettingSemStart.value = data.semester_start_date || '';
      elSettingSemEnd.value = data.semester_end_date || '';
      elSettingEnabled.checked = data.is_booking_enabled;
    } catch (err) {
      showAlert('Failed to load settings: ' + err.message, 'danger');
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
