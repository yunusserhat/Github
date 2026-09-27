import test from 'node:test';
import assert from 'node:assert/strict';
import { createCaptchaGate, TURNSTILE_SCRIPT_URL } from '../static/js/officehours-captcha.js';

function fakeBrowser() {
  const appended = [];
  const doc = {
    head: { appendChild: (el) => appended.push(el) },
    createElement: () => ({ attributes: {}, setAttribute(name, value) { this.attributes[name] = value; } }),
    querySelector: () => appended.find((el) => 'data-officehours-turnstile' in el.attributes) || null
  };
  const win = {};
  return { doc, win, appended };
}

function fakeContainer() {
  const classes = new Set(['oh-captcha', 'd-none']);
  return { classes, classList: { remove: (name) => classes.delete(name) } };
}

function fakeTurnstile() {
  const calls = { render: [], reset: [] };
  return {
    calls,
    render(container, params) {
      calls.render.push({ container, params });
      return 'widget-1';
    },
    reset(id) {
      calls.reset.push(id);
    }
  };
}

test('CAPTCHA gate: inactive without a site key and loads no third-party script', () => {
  const { doc, win, appended } = fakeBrowser();
  const gate = createCaptchaGate({ siteKey: '', container: fakeContainer(), doc, win });
  assert.equal(gate.enabled, false);
  assert.equal(gate.getToken(), '');
  gate.reset();
  assert.equal(appended.length, 0);
});

test('CAPTCHA gate: loads Turnstile once in explicit mode and renders when ready', () => {
  const { doc, win, appended } = fakeBrowser();
  const container = fakeContainer();
  const gate = createCaptchaGate({ siteKey: 'site-key', container, doc, win });
  createCaptchaGate({ siteKey: 'site-key', container: fakeContainer(), doc, win });

  assert.equal(gate.enabled, true);
  assert.equal(appended.length, 1);
  assert.equal(appended[0].src, TURNSTILE_SCRIPT_URL);
  assert.match(TURNSTILE_SCRIPT_URL, /^https:\/\/challenges\.cloudflare\.com\/turnstile\/v0\/api\.js\?render=explicit&onload=/);

  win.turnstile = fakeTurnstile();
  win.__officehoursTurnstileReady();
  assert.equal(win.turnstile.calls.render.length, 2);
  assert.equal(win.turnstile.calls.render[0].params.sitekey, 'site-key');
  assert.equal(container.classes.has('d-none'), false);
});

test('CAPTCHA gate: tokens are single-use and cleared on expiry or reset', () => {
  const { doc, win } = fakeBrowser();
  win.turnstile = fakeTurnstile();
  const gate = createCaptchaGate({ siteKey: 'site-key', container: fakeContainer(), doc, win });
  const params = win.turnstile.calls.render[0].params;

  assert.equal(gate.getToken(), '');
  params.callback('token-1');
  assert.equal(gate.getToken(), 'token-1');
  gate.reset();
  assert.equal(gate.getToken(), '');
  assert.deepEqual(win.turnstile.calls.reset, ['widget-1']);

  params.callback('token-2');
  params['expired-callback']();
  assert.equal(gate.getToken(), '');
  params.callback('token-3');
  params['error-callback']();
  assert.equal(gate.getToken(), '');
});
