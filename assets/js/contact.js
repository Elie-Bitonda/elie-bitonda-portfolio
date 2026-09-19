'use strict';
(() => {
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');
  const button = document.querySelector('#send-message');
  const fields = [...form.querySelectorAll('[required]')];
  const endpoint = 'https://formsubmit.co/ajax/ebitonda@andrew.cmu.edu';
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
    if (!valid) { fields.find(field => field.getAttribute('aria-invalid') === 'true').focus(); return; }
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
      const response = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, signal: controller.signal });
      const result = await response.json();
      if (!response.ok || !(result.success === true || result.success === 'true')) throw new Error('Submission not accepted');
      status.dataset.state = 'success';
      status.textContent = 'Thank you. Your message has been submitted successfully. You can also reach me directly by email.';
      form.reset();
      fields.forEach(field => field.removeAttribute('aria-invalid'));
    } catch {
      status.dataset.state = 'error';
      status.textContent = 'Your message could not be confirmed. Your text has been kept. Please try again, or email ebitonda@andrew.cmu.edu directly.';
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
