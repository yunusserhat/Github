/**
 * Office Hours - optional Cloudflare Turnstile gate for Supabase Auth CAPTCHA.
 *
 * Supabase Auth verifies the token server-side when CAPTCHA protection is
 * enabled for the project, so the widget cannot be skipped by calling the Auth
 * API directly. Without a configured site key the gate is inactive, loads no
 * third-party script, and sign-in requests are sent exactly as before.
 */

const READY_CALLBACK = '__officehoursTurnstileReady';

export const TURNSTILE_SCRIPT_URL =
  `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=${READY_CALLBACK}`;

const INACTIVE_GATE = Object.freeze({
  enabled: false,
  getToken: () => '',
  reset() {}
});

/**
 * @param {Object} params
 * @param {string} [params.siteKey] public Turnstile site key
 * @param {HTMLElement} [params.container] element the widget renders into
 * @param {string} [params.action] label reported with the token
 * @param {Document} [params.doc]
 * @param {Window} [params.win]
 * @returns {{ enabled: boolean, getToken: () => string, reset: () => void }}
 */
export function createCaptchaGate({
  siteKey,
  container,
  action = 'officehours-otp',
  doc = globalThis.document,
  win = globalThis.window
} = {}) {
  if (!siteKey || !container || !doc || !win) return INACTIVE_GATE;

  let token = '';
  let widgetId = null;

  const render = () => {
    if (widgetId !== null || !win.turnstile) return;
    container.classList.remove('d-none');
    widgetId = win.turnstile.render(container, {
      sitekey: siteKey,
      action,
      callback: (value) => { token = value; },
      'expired-callback': () => { token = ''; },
      'error-callback': () => { token = ''; }
    });
  };

  if (win.turnstile) {
    render();
  } else {
    const previousReady = win[READY_CALLBACK];
    win[READY_CALLBACK] = () => {
      if (typeof previousReady === 'function') previousReady();
      render();
    };
    if (!doc.querySelector('script[data-officehours-turnstile]')) {
      const script = doc.createElement('script');
      script.src = TURNSTILE_SCRIPT_URL;
      script.async = true;
      script.setAttribute('data-officehours-turnstile', '');
      doc.head.appendChild(script);
    }
  }

  return {
    enabled: true,
    getToken: () => token,
    // Tokens are single-use: reset after every sign-in attempt.
    reset() {
      token = '';
      if (widgetId !== null && win.turnstile) win.turnstile.reset(widgetId);
    }
  };
}
