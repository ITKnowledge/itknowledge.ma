import assert from 'node:assert/strict';
import test from 'node:test';

import { onRequestPost } from '../functions/api/contact.js';

const env = {
  RESEND_API_KEY: 'secret-token',
};

function contactRequest(overrides = {}, headers = {}) {
  const values = {
    name: 'Amal Benali',
    email: 'amal@example.com',
    outcome: 'Reduce the time required to qualify incoming support requests.',
    systems: 'Email, ERP and the support portal',
    constraint: 'Customer data must remain access controlled.',
    consent: 'accepted',
    website: '',
    lang: 'en',
    ...overrides,
  };
  const form = new FormData();
  for (const [key, value] of Object.entries(values)) form.set(key, value);
  return new Request('https://www.itknowledge.ma/api/contact', {
    method: 'POST',
    body: form,
    headers: {
      Accept: 'application/json',
      Origin: 'https://www.itknowledge.ma',
      ...headers,
    },
  });
}

test('valid submissions send one fixed-recipient email', async () => {
  const originalFetch = globalThis.fetch;
  let sent;
  globalThis.fetch = async (url, options) => {
    sent = { url, options, payload: JSON.parse(options.body) };
    return Response.json({ id: 'email-id' });
  };

  try {
    const response = await onRequestPost({ request: contactRequest(), env });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, code: 'sent' });
    assert.equal(sent.url, 'https://api.resend.com/emails');
    assert.deepEqual(sent.payload.to, ['contact@itknowledge.ma']);
    assert.equal(sent.payload.from, 'ITKnowledge Website <website@itknowledge.ma>');
    assert.equal(sent.payload.reply_to, 'amal@example.com');
    assert.match(sent.payload.text, /Customer data must remain access controlled\./);
    assert.equal(sent.options.headers.Authorization, 'Bearer secret-token');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('invalid customer data is rejected before email delivery', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => assert.fail('email provider must not be called');
  try {
    const response = await onRequestPost({ request: contactRequest({ email: 'not-an-email' }), env });
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { ok: false, code: 'invalid_email' });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('honeypot submissions are accepted without sending email', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => assert.fail('email provider must not be called');
  try {
    const response = await onRequestPost({ request: contactRequest({ website: 'https://spam.example' }), env });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, code: 'sent' });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('provider failures return a retryable form error', async () => {
  const originalFetch = globalThis.fetch;
  const originalError = console.error;
  globalThis.fetch = async () => Response.json({ message: 'provider unavailable' }, { status: 503 });
  console.error = () => {};
  try {
    const response = await onRequestPost({ request: contactRequest(), env });
    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), { ok: false, code: 'delivery_failed' });
  } finally {
    globalThis.fetch = originalFetch;
    console.error = originalError;
  }
});
