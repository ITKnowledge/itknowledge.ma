const MAX_BODY_BYTES = 32 * 1024;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function responseFor(request, lang, ok, code, status = ok ? 200 : 400) {
  const headers = { 'Cache-Control': 'no-store' };
  if (request.headers.get('Accept')?.includes('application/json')) {
    headers['Content-Type'] = 'application/json; charset=utf-8';
    return new Response(JSON.stringify({ ok, code }), { status, headers });
  }

  const home = lang === 'en' ? '/en/' : '/';
  headers.Location = `${home}?contact=${ok ? 'sent' : 'error'}#contact`;
  return new Response(null, { status: 303, headers });
}

function validate(formData) {
  const input = {
    name: clean(formData.get('name')).replace(/\s+/g, ' '),
    email: clean(formData.get('email')).toLowerCase(),
    outcome: clean(formData.get('outcome')),
    systems: clean(formData.get('systems')),
    constraint: clean(formData.get('constraint')),
    consent: clean(formData.get('consent')),
    website: clean(formData.get('website')),
    lang: clean(formData.get('lang')) === 'en' ? 'en' : 'fr',
  };

  if (input.website) return { input, spam: true };
  if (input.name.length < 2 || input.name.length > 100) return { input, error: 'invalid_name' };
  if (input.email.length > 254 || !EMAIL_PATTERN.test(input.email)) return { input, error: 'invalid_email' };
  if (input.outcome.length < 10 || input.outcome.length > 1500) return { input, error: 'invalid_outcome' };
  if (input.systems.length < 2 || input.systems.length > 500) return { input, error: 'invalid_systems' };
  if (input.constraint.length < 2 || input.constraint.length > 1000) return { input, error: 'invalid_constraint' };
  if (input.consent !== 'accepted') return { input, error: 'consent_required' };
  return { input };
}

export async function onRequestPost({ request, env }) {
  const requestURL = new URL(request.url);
  const origin = request.headers.get('Origin');
  if ((origin && origin !== requestURL.origin) || request.headers.get('Sec-Fetch-Site') === 'cross-site') {
    return responseFor(request, 'fr', false, 'forbidden', 403);
  }

  const bodyLength = Number(request.headers.get('Content-Length') || 0);
  if (bodyLength > MAX_BODY_BYTES) return responseFor(request, 'fr', false, 'request_too_large', 413);

  const contentType = request.headers.get('Content-Type') || '';
  if (!contentType.startsWith('multipart/form-data') && !contentType.startsWith('application/x-www-form-urlencoded')) {
    return responseFor(request, 'fr', false, 'unsupported_media_type', 415);
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return responseFor(request, 'fr', false, 'invalid_form', 400);
  }

  const { input, error, spam } = validate(formData);
  if (spam) return responseFor(request, input.lang, true, 'sent');
  if (error) return responseFor(request, input.lang, false, error, 400);

  if (!env.RESEND_API_KEY) {
    console.error('Contact form email delivery is not configured');
    return responseFor(request, input.lang, false, 'delivery_unavailable', 503);
  }

  const endpoint = env.RESEND_API_URL || 'https://api.resend.com/emails';
  const recipient = env.CONTACT_TO_EMAIL || 'contact@itknowledge.ma';
  const sender = env.CONTACT_FROM_EMAIL || 'ITKnowledge Website <website@itknowledge.ma>';
  const subjectName = input.name.replace(/[\r\n]+/g, ' ');
  const text = [
    'Nouveau cas d’usage soumis sur itknowledge.ma',
    '',
    `Nom : ${input.name}`,
    `E-mail : ${input.email}`,
    `Langue : ${input.lang.toUpperCase()}`,
    '',
    'Résultat attendu :',
    input.outcome,
    '',
    'Outils et systèmes concernés :',
    input.systems,
    '',
    'Contrainte principale :',
    input.constraint,
  ].join('\n');

  let delivery;
  try {
    delivery = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: [recipient],
        from: sender,
        reply_to: input.email,
        subject: `[itknowledge.ma] Nouveau cas d’usage — ${subjectName}`,
        text,
      }),
    });
  } catch (error) {
    console.error('Contact form email request failed', error instanceof Error ? error.message : 'unknown error');
    return responseFor(request, input.lang, false, 'delivery_failed', 502);
  }

  let deliveryResult = null;
  try {
    deliveryResult = await delivery.json();
  } catch {
    // The HTTP status remains authoritative when the provider omits JSON.
  }
  if (!delivery.ok || !deliveryResult?.id) {
    console.error('Contact form email delivery failed', delivery.status);
    return responseFor(request, input.lang, false, 'delivery_failed', 502);
  }

  return responseFor(request, input.lang, true, 'sent');
}
