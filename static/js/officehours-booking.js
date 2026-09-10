/**
 * Office Hours Booking System - Student Booking Flow
 * Handles student authentication via Email OTP, slot display, appointment booking,
 * and cancellation of student's own active bookings.
 */

import {
  parseAndValidateEmail,
  formatIstanbulDateOnly,
  formatIstanbulTimeOnly,
  getIstanbulDateString,
  generateDateCandidateSlots,
  annotateSlotsWithAvailability,
  evaluateStudentBookingEligibility
} from './officehours-common.js';

(function () {
  'use strict';

  // State
  let supabase = null;
  let currentUser = null;
  let currentEmailForOtp = '';
  let activeStudentAppointment = null;
  let selectedCandidateSlot = null;
  let cachedSettings = null;
  let cachedRules = [];
  let cachedExceptions = [];
  let cachedOverrides = [];
  let cachedBookedSlots = [];
  let cachedMyAppointments = [];
  let activeMeetingTypeFilter = 'all';

  // DOM Elements
  const elConfigWarning = document.getElementById('oh-config-warning');
  const elGlobalAlert = document.getElementById('oh-global-alert');
  const elAlertMessage = document.getElementById('oh-alert-message');
  const elBtnCloseAlert = document.getElementById('oh-btn-close-alert');

  const elAuthSection = document.getElementById('oh-auth-section');
  const elEmailPanel = document.getElementById('oh-email-panel');
  const elFormEmail = document.getElementById('oh-form-email');
  const elInputEmail = document.getElementById('oh-input-email');
  const elEmailError = document.getElementById('oh-email-error');
  const elBtnSubmitEmail = document.getElementById('oh-btn-submit-email');

  const elOtpPanel = document.getElementById('oh-otp-panel');
  const elFormOtp = document.getElementById('oh-form-otp');
  const elInputOtp = document.getElementById('oh-input-otp');
  const elOtpError = document.getElementById('oh-otp-error');
  const elOtpRecipient = document.getElementById('oh-otp-recipient-email');
  const elBtnSubmitOtp = document.getElementById('oh-btn-submit-otp');
  const elBtnChangeEmail = document.getElementById('oh-btn-change-email');
  const elBtnResendOtp = document.getElementById('oh-btn-resend-otp');

  const elBookingSection = document.getElementById('oh-booking-section');
  const elLoggedInEmail = document.getElementById('oh-logged-in-email');
  const elBtnSignout = document.getElementById('oh-btn-signout');

  const elActiveBookingCard = document.getElementById('oh-active-booking-card');
  const elActiveDateTime = document.getElementById('oh-active-date-time');
  const elActiveTopic = document.getElementById('oh-active-topic');
  const elActiveNoteWrap = document.getElementById('oh-active-note-wrap');
  const elActiveNote = document.getElementById('oh-active-note');
  const elActiveTypeBadge = document.getElementById('oh-active-type-badge');
  const elActiveLocationWrap = document.getElementById('oh-active-location-wrap');
  const elActiveLocation = document.getElementById('oh-active-location');
  const elBtnCancelActive = document.getElementById('oh-btn-cancel-active');

  const elFilterMeetingType = document.getElementById('oh-filter-meeting-type');
  const elSlotsLoading = document.getElementById('oh-slots-loading');
  const elSlotsEmpty = document.getElementById('oh-slots-empty');
  const elSlotsList = document.getElementById('oh-slots-list');

  const elModal = document.getElementById('oh-booking-form-modal');
  const elModalSlotDisplay = document.getElementById('oh-modal-slot-display');
  const elModalMeetingBadge = document.getElementById('oh-modal-meeting-badge');
  const elModalChoiceWrap = document.getElementById('oh-modal-choice-wrap');
  const elModalLocationInfo = document.getElementById('oh-modal-location-info');
  const elModalLocationText = document.getElementById('oh-modal-location-text');
  const elFormConfirm = document.getElementById('oh-form-confirm-booking');
  const elInputTopic = document.getElementById('oh-input-topic');
  const elInputNote = document.getElementById('oh-input-note');
  const elModalError = document.getElementById('oh-modal-error');
  const elBtnCloseModal = document.getElementById('oh-btn-close-modal');
  const elBtnModalCancel = document.getElementById('oh-btn-modal-cancel');
  const elBtnModalConfirm = document.getElementById('oh-btn-modal-confirm');

  const elConfirmationCard = document.getElementById('oh-confirmation-card');
  const elConfirmDatetime = document.getElementById('oh-confirm-datetime');
  const elConfirmType = document.getElementById('oh-confirm-type');
  const elConfirmLocationWrap = document.getElementById('oh-confirm-location-wrap');
  const elConfirmLocation = document.getElementById('oh-confirm-location');
  const elConfirmEmail = document.getElementById('oh-confirm-email');
  const elConfirmTopic = document.getElementById('oh-confirm-topic');
  const elBtnConfirmDone = document.getElementById('oh-btn-confirm-done');

  // UI Helpers
  function showAlert(message, type = 'danger') {
    if (!elGlobalAlert) return;
    elAlertMessage.textContent = message;
    elGlobalAlert.className = `oh-alert oh-alert-${type} mb-4`;
    elGlobalAlert.classList.remove('d-none');
  }

  function hideAlert() {
    if (elGlobalAlert) elGlobalAlert.classList.add('d-none');
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

  let resendCountdownTimer = null;

  function startResendCooldown(seconds) {
    if (!elBtnResendOtp) return;
    if (resendCountdownTimer) clearInterval(resendCountdownTimer);

    let remaining = seconds;
    elBtnResendOtp.disabled = true;

    const updateLabel = () => {
      const formatted = window.OfficeHoursCommon?.formatCountdown
        ? window.OfficeHoursCommon.formatCountdown(remaining)
        : `${remaining}s`;
      elBtnResendOtp.textContent = `Yeniden gönder (${formatted})`;
    };

    updateLabel();

    resendCountdownTimer = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(resendCountdownTimer);
        resendCountdownTimer = null;
        elBtnResendOtp.disabled = false;
        elBtnResendOtp.textContent = 'Resend code';
      } else {
        updateLabel();
      }
    }, 1000);
  }

  // Initialization
  async function init() {
    const config = window.__OFFICEHOURS_CONFIG__ || {};
    const supabaseUrl = config.supabaseUrl || window.OFFICEHOURS_SUPABASE_URL;
    const supabaseAnonKey = config.supabaseAnonKey || window.OFFICEHOURS_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) {
      if (elConfigWarning) elConfigWarning.classList.remove('d-none');
      if (elSlotsLoading) elSlotsLoading.classList.add('d-none');
      return;
    }

    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      showAlert('Unable to load Supabase client library. Please check your network connection.', 'danger');
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

    // Check existing session
    const { data: { session } } = await supabase.auth.getSession();
    if (session && session.user) {
      handleSession(session.user);
    } else {
      showAuthSection();
    }

    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        if (window.location.hash && (window.location.hash.includes('access_token') || window.location.hash.includes('error'))) {
          window.history.replaceState(null, '', window.location.pathname);
        }
        handleSession(session.user);
      } else if (event === 'SIGNED_OUT') {
        currentUser = null;
        showAuthSection();
      }
    });
  }

  function bindEvents() {
    if (elBtnCloseAlert) elBtnCloseAlert.addEventListener('click', hideAlert);

    // Email form submit
    if (elFormEmail) {
      elFormEmail.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlert();
        elEmailError.classList.add('d-none');

        const rawEmail = elInputEmail.value;
        const validation = parseAndValidateEmail(rawEmail);

        if (!validation.valid) {
          elEmailError.textContent = validation.error;
          elEmailError.classList.remove('d-none');
          elInputEmail.focus();
          return;
        }

        currentEmailForOtp = validation.email;

        // We always query Supabase server RPC as the single authoritative source of truth,
        // preventing client-side localStorage de-synchronization issues.
        setButtonLoading(elBtnSubmitEmail, true);

        try {
          // Check & record rate limit on server side
          const { data: rlData, error: rlErr } = await supabase.rpc('check_and_record_otp_rate_limit', {
            p_email: currentEmailForOtp
          });

          if (!rlErr && rlData && rlData.allowed === false) {
            const waitSec = rlData.wait_seconds || 300;
            if (window.OfficeHoursCommon?.recordClientRateLimit) {
              window.OfficeHoursCommon.recordClientRateLimit(currentEmailForOtp, waitSec);
            }
            showAlert(rlData.reason || `Spam koruması: Lütfen ${waitSec} saniye bekleyin.`, 'warning');
            return;
          }

          // If allowed, clear any stale client-side rate limit lock
          if (window.OfficeHoursCommon?.clearClientRateLimit) {
            window.OfficeHoursCommon.clearClientRateLimit(currentEmailForOtp);
          }

          const redirectUrl = window.location.origin + window.location.pathname;
          const { error } = await supabase.auth.signInWithOtp({
            email: currentEmailForOtp,
            options: {
              shouldCreateUser: true,
              emailRedirectTo: redirectUrl
            }
          });

          if (error) {
            showAlert(error.message || 'Failed to dispatch verification code.', 'danger');
          } else {
            const waitSec = rlData?.wait_seconds || 0;
            if (window.OfficeHoursCommon?.recordClientRateLimit) {
              window.OfficeHoursCommon.recordClientRateLimit(currentEmailForOtp, waitSec);
            }
            elEmailPanel.classList.add('d-none');
            elOtpRecipient.textContent = currentEmailForOtp;
            elOtpPanel.classList.remove('d-none');
            elInputOtp.focus();

            startResendCooldown(waitSec > 0 ? waitSec : 60);
          }
        } catch (err) {
          showAlert(err.message || 'An unexpected error occurred.', 'danger');
        } finally {
          setButtonLoading(elBtnSubmitEmail, false);
        }
      });
    }

    // OTP form submit
    if (elFormOtp) {
      elFormOtp.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlert();
        elOtpError.classList.add('d-none');

        const token = elInputOtp.value.trim();
        if (!token || token.length < 6) {
          elOtpError.textContent = 'Please enter a valid 6-digit confirmation code.';
          elOtpError.classList.remove('d-none');
          return;
        }

        setButtonLoading(elBtnSubmitOtp, true);

        try {
          const { data, error } = await supabase.auth.verifyOtp({
            email: currentEmailForOtp,
            token,
            type: 'email'
          });

          if (error) {
            elOtpError.textContent = error.message || 'Invalid or expired code. Please check and try again.';
            elOtpError.classList.remove('d-none');
          } else if (data?.user) {
            handleSession(data.user);
          }
        } catch (err) {
          elOtpError.textContent = err.message || 'Verification failed.';
          elOtpError.classList.remove('d-none');
        } finally {
          setButtonLoading(elBtnSubmitOtp, false);
        }
      });
    }

    // Change email button
    if (elBtnChangeEmail) {
      elBtnChangeEmail.addEventListener('click', () => {
        elOtpPanel.classList.add('d-none');
        elEmailPanel.classList.remove('d-none');
        elInputEmail.focus();
      });
    }

    // Resend OTP button with Rate Limiting & Cooldown Protection
    if (elBtnResendOtp) {
      elBtnResendOtp.addEventListener('click', async () => {
        if (!currentEmailForOtp) return;
        hideAlert();

        elBtnResendOtp.disabled = true;

        try {
          const { data: rlData, error: rlErr } = await supabase.rpc('check_and_record_otp_rate_limit', {
            p_email: currentEmailForOtp
          });

          if (!rlErr && rlData && rlData.allowed === false) {
            const waitSec = rlData.wait_seconds || 300;
            if (window.OfficeHoursCommon?.recordClientRateLimit) {
              window.OfficeHoursCommon.recordClientRateLimit(currentEmailForOtp, waitSec);
            }
            showAlert(rlData.reason || `Spam koruması: Lütfen ${waitSec} saniye bekleyin.`, 'warning');
            startResendCooldown(waitSec);
            return;
          }

          // If allowed, clear any stale client-side rate limit lock
          if (window.OfficeHoursCommon?.clearClientRateLimit) {
            window.OfficeHoursCommon.clearClientRateLimit(currentEmailForOtp);
          }

          const redirectUrl = window.location.origin + window.location.pathname;
          const { error } = await supabase.auth.signInWithOtp({
            email: currentEmailForOtp,
            options: {
              shouldCreateUser: true,
              emailRedirectTo: redirectUrl
            }
          });

          if (error) {
            showAlert(error.message, 'danger');
            startResendCooldown(30);
          } else {
            const waitSec = rlData?.wait_seconds || 0;
            if (window.OfficeHoursCommon?.recordClientRateLimit) {
              window.OfficeHoursCommon.recordClientRateLimit(currentEmailForOtp, waitSec);
            }
            showAlert(`Yeni doğrulama kodu gönderildi: ${currentEmailForOtp}`, 'success');
            startResendCooldown(waitSec > 0 ? waitSec : 60);
          }
        } catch (err) {
          showAlert(err.message || 'Hata oluştu.', 'danger');
          startResendCooldown(30);
        }
      });
    }

    // Sign out button
    if (elBtnSignout) {
      elBtnSignout.addEventListener('click', async () => {
        await supabase.auth.signOut();
      });
    }

    // Modal close buttons
    if (elBtnCloseModal) elBtnCloseModal.addEventListener('click', closeModal);
    if (elBtnModalCancel) elBtnModalCancel.addEventListener('click', closeModal);

    // Confirm booking form
    if (elFormConfirm) {
      elFormConfirm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!selectedCandidateSlot) return;

        const topic = elInputTopic.value.trim();
        const note = elInputNote.value.trim();

        if (topic.length < 2) {
          elModalError.textContent = 'Please enter a valid meeting topic (at least 2 characters).';
          elModalError.classList.remove('d-none');
          return;
        }

        const chosenType = selectedCandidateSlot.meetingType === 'both'
          ? (elFormConfirm.querySelector('input[name="oh-modal-choice-type"]:checked')?.value || 'office')
          : (selectedCandidateSlot.meetingType || 'office');

        setButtonLoading(elBtnModalConfirm, true);
        elModalError.classList.add('d-none');

        try {
          const { data, error } = await supabase.rpc('book_officehours_appointment', {
            p_slot_start: selectedCandidateSlot.slotStartIso,
            p_slot_end: selectedCandidateSlot.slotEndIso,
            p_topic: topic,
            p_note: note,
            p_meeting_type: chosenType
          });

          if (error) {
            elModalError.textContent = error.message || 'Unable to complete reservation.';
            elModalError.classList.remove('d-none');
          } else {
            closeModal();
            showConfirmation(selectedCandidateSlot, topic, data);
            await loadStudentData();
          }
        } catch (err) {
          elModalError.textContent = err.message || 'An unexpected error occurred.';
          elModalError.classList.remove('d-none');
        } finally {
          setButtonLoading(elBtnModalConfirm, false);
        }
      });
    }

    // Meeting type filter pills
    if (elFilterMeetingType) {
      elFilterMeetingType.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-filter]');
        if (!btn) return;
        elFilterMeetingType.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeMeetingTypeFilter = btn.getAttribute('data-filter') || 'all';
        renderAvailableSlots(cachedRules, cachedExceptions, cachedBookedSlots, cachedMyAppointments);
      });
    }

    // Cancel active appointment button
    if (elBtnCancelActive) {
      elBtnCancelActive.addEventListener('click', async () => {
        if (!activeStudentAppointment) return;

        const confirmed = window.confirm(
          'Are you sure you want to cancel your upcoming office hours appointment?'
        );
        if (!confirmed) return;

        elBtnCancelActive.disabled = true;
        try {
          const { error } = await supabase.rpc('cancel_officehours_appointment', {
            p_appointment_id: activeStudentAppointment.id
          });

          if (error) {
            showAlert(error.message || 'Failed to cancel appointment.', 'danger');
          } else {
            showAlert('Your appointment has been successfully cancelled.', 'success');
            await loadStudentData();
          }
        } catch (err) {
          showAlert(err.message, 'danger');
        } finally {
          elBtnCancelActive.disabled = false;
        }
      });
    }

    // Confirmation done button
    if (elBtnConfirmDone) {
      elBtnConfirmDone.addEventListener('click', () => {
        elConfirmationCard.classList.add('d-none');
        loadStudentData();
      });
    }
  }

  function showAuthSection() {
    if (elAuthSection) elAuthSection.classList.remove('d-none');
    if (elBookingSection) elBookingSection.classList.add('d-none');
    if (elConfirmationCard) elConfirmationCard.classList.add('d-none');
    if (elEmailPanel) elEmailPanel.classList.remove('d-none');
    if (elOtpPanel) elOtpPanel.classList.add('d-none');
  }

  async function handleSession(user) {
    // Validate domain
    const validation = parseAndValidateEmail(user.email);
    if (!validation.valid) {
      showAlert('Unauthorized domain. Only @marun.edu.tr and @marmara.edu.tr emails are allowed.', 'danger');
      await supabase.auth.signOut();
      return;
    }

    currentUser = user;
    elLoggedInEmail.textContent = user.email;

    elAuthSection.classList.add('d-none');
    elBookingSection.classList.remove('d-none');

    await loadStudentData();
  }

  async function loadStudentData() {
    elSlotsLoading.classList.remove('d-none');
    elSlotsEmpty.classList.add('d-none');
    elSlotsList.classList.add('d-none');

    try {
      // 1. Fetch student's own appointments
      const { data: myAppointments } = await supabase
        .from('officehours_appointments')
        .select('*')
        .order('slot_start', { ascending: true });

      const now = new Date();
      activeStudentAppointment = (myAppointments || []).find(
        (a) => a.status === 'booked' && new Date(a.slot_end) > now
      );

      // Render active appointment banner if exists
      if (activeStudentAppointment) {
        elActiveDateTime.textContent = `${formatIstanbulDateOnly(activeStudentAppointment.slot_start)} • ${formatIstanbulTimeOnly(activeStudentAppointment.slot_start)}–${formatIstanbulTimeOnly(activeStudentAppointment.slot_end)}`;
        elActiveTopic.textContent = activeStudentAppointment.topic;

        if (elActiveTypeBadge) {
          if (activeStudentAppointment.meeting_type === 'online') {
            elActiveTypeBadge.className = 'badge bg-info text-dark';
            elActiveTypeBadge.innerHTML = '<i class="fas fa-video me-1"></i> Online Görüşme';
          } else {
            elActiveTypeBadge.className = 'badge bg-success text-white';
            elActiveTypeBadge.innerHTML = '<i class="fas fa-building me-1"></i> Ofiste (Yüz Yüze)';
          }
        }

        if (elActiveLocationWrap) {
          if (activeStudentAppointment.location_or_link) {
            elActiveLocation.textContent = activeStudentAppointment.location_or_link;
            elActiveLocationWrap.classList.remove('d-none');
          } else {
            elActiveLocationWrap.classList.add('d-none');
          }
        }

        if (activeStudentAppointment.note) {
          elActiveNote.textContent = activeStudentAppointment.note;
          elActiveNoteWrap.classList.remove('d-none');
        } else {
          elActiveNoteWrap.classList.add('d-none');
        }
        elActiveBookingCard.classList.remove('d-none');
      } else {
        elActiveBookingCard.classList.add('d-none');
      }

      // 2. Fetch system settings, rules, exceptions, overrides, and booked slots
      const [settingsRes, rulesRes, exceptionsRes, overridesRes, bookedRes] = await Promise.all([
        supabase.from('officehours_settings').select('*').single(),
        supabase.from('officehours_availability_rules').select('*').eq('is_active', true),
        supabase.from('officehours_availability_exceptions').select('*').eq('is_blocked', true),
        supabase.from('officehours_date_overrides').select('*').eq('is_active', true),
        supabase.from('officehours_booked_slots').select('slot_start, slot_end')
      ]);

      cachedSettings = settingsRes.data || {
        meeting_duration_minutes: 20,
        buffer_minutes: 10,
        min_booking_notice_hours: 24,
        max_active_bookings_per_student: 1,
        rolling_days_limit: 7,
        max_bookings_in_rolling_days: 1
      };
      cachedRules = rulesRes.data || [];
      cachedExceptions = exceptionsRes.data || [];
      cachedOverrides = overridesRes.data || [];
      cachedBookedSlots = bookedRes.data || [];
      cachedMyAppointments = myAppointments || [];

      // 3. Generate slots for the upcoming 28 days
      renderAvailableSlots(cachedRules, cachedExceptions, cachedBookedSlots, cachedMyAppointments);
    } catch (err) {
      showAlert('Failed to load schedule data: ' + err.message, 'danger');
    } finally {
      elSlotsLoading.classList.add('d-none');
    }
  }

  function renderAvailableSlots(rules, exceptions, bookedSlots, myAppointments) {
    elSlotsList.innerHTML = '';
    const now = new Date();
    const duration = cachedSettings.meeting_duration_minutes || 20;
    const buffer = cachedSettings.buffer_minutes || 10;
    const minNotice = cachedSettings.min_booking_notice_hours || 24;

    const daysToScan = 28;
    let totalAvailableSlots = 0;

    for (let i = 0; i < daysToScan; i++) {
      const scanDate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = getIstanbulDateString(scanDate);

      const candidateSlots = generateDateCandidateSlots({
        dateStr,
        rules,
        exceptions,
        dateOverrides: cachedOverrides,
        durationMinutes: duration,
        bufferMinutes: buffer,
        minNoticeHours: minNotice,
        currentTime: now
      });

      if (!candidateSlots.length) continue;

      // Filter candidate slots by selected meeting type
      const filteredCandidates = (window.OfficeHoursCommon?.filterSlotsByMeetingType)
        ? window.OfficeHoursCommon.filterSlotsByMeetingType(candidateSlots, activeMeetingTypeFilter)
        : candidateSlots;

      if (!filteredCandidates.length) continue;

      const annotatedSlots = annotateSlotsWithAvailability(filteredCandidates, bookedSlots);
      const openCount = annotatedSlots.filter((s) => s.isAvailable).length;
      totalAvailableSlots += openCount;

      // Create Date Group Container
      const dateGroup = document.createElement('div');
      dateGroup.className = 'oh-date-group';

      const heading = document.createElement('div');
      heading.className = 'oh-date-heading';
      heading.innerHTML = `
        <span><i class="far fa-calendar-alt text-primary me-2"></i>${formatIstanbulDateOnly(filteredCandidates[0].slotStartIso)}</span>
        <span class="badge ${openCount > 0 ? 'bg-primary' : 'bg-secondary'} ms-auto small">
          ${openCount} available
        </span>
      `;
      dateGroup.appendChild(heading);

      // Create Slots Grid
      const grid = document.createElement('div');
      grid.className = 'oh-slots-grid';

      for (const slot of annotatedSlots) {
        const slotBtn = document.createElement('button');
        slotBtn.type = 'button';
        slotBtn.className = `oh-slot-btn oh-slot-${slot.status}`;

        let typeBadge = '';
        if (slot.meetingType === 'online') {
          typeBadge = '<span class="badge bg-info text-dark ms-1"><i class="fas fa-video"></i> Online</span>';
        } else if (slot.meetingType === 'both') {
          typeBadge = '<span class="badge bg-primary text-white ms-1"><i class="fas fa-handshake"></i> Ofis/Online</span>';
        } else {
          typeBadge = '<span class="badge bg-success text-white ms-1"><i class="fas fa-building"></i> Ofiste</span>';
        }

        slotBtn.innerHTML = `
          <span class="oh-slot-time">${slot.startTimeStr}</span>
          <span class="oh-slot-status">${slot.isAvailable ? 'Available' : 'Unavailable'} ${typeBadge}</span>
        `;

        if (slot.isAvailable) {
          if (activeStudentAppointment) {
            slotBtn.title = 'You already have an active appointment.';
            slotBtn.addEventListener('click', () => {
              showAlert(
                'You already have an active appointment. Please cancel your existing meeting first if you wish to reschedule.',
                'warning'
              );
            });
          } else {
            slotBtn.addEventListener('click', () => openBookingModal(slot));
          }
        } else {
          slotBtn.disabled = true;
          slotBtn.setAttribute('aria-disabled', 'true');
        }

        grid.appendChild(slotBtn);
      }

      dateGroup.appendChild(grid);
      elSlotsList.appendChild(dateGroup);
    }

    if (totalAvailableSlots === 0 && !elSlotsList.children.length) {
      elSlotsEmpty.classList.remove('d-none');
    } else {
      elSlotsList.classList.remove('d-none');
    }
  }

  function openBookingModal(slot) {
    selectedCandidateSlot = slot;
    elModalSlotDisplay.textContent = `${formatIstanbulDateOnly(slot.slotStartIso)} • ${slot.startTimeStr}–${slot.endTimeStr}`;
    elInputTopic.value = '';
    elInputNote.value = '';

    if (elModalMeetingBadge) {
      if (slot.meetingType === 'online') {
        elModalMeetingBadge.className = 'badge bg-info text-dark';
        elModalMeetingBadge.innerHTML = '<i class="fas fa-video me-1"></i> Online Görüşme';
      } else if (slot.meetingType === 'both') {
        elModalMeetingBadge.className = 'badge bg-primary text-white';
        elModalMeetingBadge.innerHTML = '<i class="fas fa-handshake me-1"></i> Ofis veya Online Seçimi';
      } else {
        elModalMeetingBadge.className = 'badge bg-success text-white';
        elModalMeetingBadge.innerHTML = '<i class="fas fa-building me-1"></i> Ofiste (Yüz Yüze)';
      }
    }

    if (elModalChoiceWrap) {
      if (slot.meetingType === 'both') {
        elModalChoiceWrap.classList.remove('d-none');
      } else {
        elModalChoiceWrap.classList.add('d-none');
      }
    }

    if (elModalLocationInfo && elModalLocationText) {
      if (slot.locationOrLink) {
        elModalLocationText.textContent = slot.locationOrLink;
        elModalLocationInfo.classList.remove('d-none');
      } else {
        elModalLocationInfo.classList.add('d-none');
      }
    }

    elModalError.classList.add('d-none');
    elModal.classList.remove('d-none');
    elInputTopic.focus();
  }

  function closeModal() {
    elModal.classList.add('d-none');
    selectedCandidateSlot = null;
  }

  function showConfirmation(slot, topic, rpcResult = null) {
    elConfirmDatetime.textContent = `${formatIstanbulDateOnly(slot.slotStartIso)} • ${slot.startTimeStr}–${slot.endTimeStr}`;
    elConfirmEmail.textContent = currentUser.email;
    elConfirmTopic.textContent = topic;

    if (elConfirmType) {
      const type = rpcResult?.meeting_type || slot.meetingType;
      elConfirmType.textContent = type === 'online' ? 'Online Görüşme (Google Meet)' : 'Ofiste (Yüz Yüze)';
    }

    if (elConfirmLocationWrap && elConfirmLocation) {
      const loc = rpcResult?.location_or_link || slot.locationOrLink;
      if (loc) {
        elConfirmLocation.textContent = loc;
        elConfirmLocationWrap.classList.remove('d-none');
      } else {
        elConfirmLocationWrap.classList.add('d-none');
      }
    }

    elConfirmationCard.classList.remove('d-none');
    elConfirmationCard.scrollIntoView({ behavior: 'smooth' });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
