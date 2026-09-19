'use strict';
(() => {
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');
  const button = document.querySelector('#send-message');
  const fields = [...form.querySelectorAll('[required]')];
  // The native form action is the single source of truth for the recipient.
  const recipient = decodeURIComponent(new URL(form.action).pathname.slice(1));
  const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`;
  const directEmail = document.querySelector('#contact .inline-link[href^="mailto:"]');
  directEmail.href = `mailto:${recipient}`;
  let submitting = false;
  form.noValidate = true;
  function validate(field) {
    const error = !field.value.trim() ? `Please enter your ${field.name}.` : field.validity.typeMismatch ? 'Please enter a valid email address.' : !field.validity.valid ? 'Please check this field.' : '';
    field.setAttribute('aria-invalid', String(Boolean(error)));
    document.querySelector(`#${field.id}-error`).textContent = error;
    return !error;
  }
  fields.forEach(field => field.addEventListener('input', () => {
    if (field.getAttribute('aria-invalid') === 'true') validate(field);
  }));
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting) return;
    const valid = fields.map(validate).every(Boolean);
    if (!valid) {
      status.dataset.state = 'error';
      status.textContent = 'Please correct the highlighted fields before sending.';
      fields.find(field => field.getAttribute('aria-invalid') === 'true').focus(); return;
    }
    if (form.elements._honey.value) return;
    submitting = true;
    button.disabled = true;
    button.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    status.dataset.state = 'loading';
    status.textContent = 'Sending your message…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const payload = new FormData(form);
      fields.forEach(field => payload.set(field.name, field.value.trim()));
      payload.set('_subject', `Portfolio Contact — ${form.elements.subject.value.trim().replace(/[\r\n]/g, ' ')}`);
      payload.set('_replyto', form.elements.email.value.trim());
      const response = await fetch(endpoint, { method: 'POST', body: payload, headers: { Accept: 'application/json' }, signal: controller.signal });
      const result = await response.json();
      if (!response.ok || !(result.success === true || result.success === 'true')) throw new Error('Submission not accepted');
      status.dataset.state = 'success';
      status.textContent = 'Message sent successfully. Thank you — I’ll get back to you soon.';
      form.reset();
      fields.forEach(field => field.removeAttribute('aria-invalid'));
    } catch {
      status.dataset.state = 'error';
      status.textContent = `Your message could not be sent right now. Your text has been kept. Please email me directly at ${recipient}.`;
    } finally {
      clearTimeout(timeout);
      submitting = false;
      button.disabled = false;
      button.innerHTML = 'Send Message <span aria-hidden="true">↗</span>';
      form.removeAttribute('aria-busy');
      status.focus();
    }
  });
})();
