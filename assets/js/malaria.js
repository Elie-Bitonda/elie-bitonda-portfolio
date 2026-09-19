'use strict';
(() => {
  // Gallery links remain normal image links if native dialog is unavailable.
  const viewer = document.createElement('dialog');
  if (typeof viewer.showModal !== 'function') return;
  viewer.className = 'malaria-lightbox';
  viewer.setAttribute('aria-labelledby', 'malaria-image-title');
  viewer.innerHTML = `<div class="malaria-lightbox-header"><h2 id="malaria-image-title">Experiment image</h2><button type="button" data-action="close" aria-label="Close image gallery">Close ×</button></div><div class="malaria-lightbox-viewport" tabindex="0" aria-label="Image viewport; scroll to inspect when zoomed"><img alt=""></div><p class="malaria-lightbox-caption"></p><div class="malaria-lightbox-footer"><output aria-live="polite"></output><button type="button" data-action="previous">← Previous</button><button type="button" data-action="next">Next →</button><button type="button" data-action="zoom" aria-pressed="false">Zoom image</button></div>`;
  document.body.append(viewer);
  const image = viewer.querySelector('img');
  const viewport = viewer.querySelector('.malaria-lightbox-viewport');
  const zoomButton = viewer.querySelector('[data-action="zoom"]');
  let links = [], index = 0, opener, parentWasOpen = false;
  function showImage() {
    const link = links[index];
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    viewer.querySelector('h2').textContent = image.alt;
    viewer.querySelector('.malaria-lightbox-caption').textContent = link.dataset.caption;
    viewer.querySelector('output').textContent = `${index + 1} / ${links.length}`;
    viewport.classList.remove('is-zoomed'); viewport.scrollTo(0, 0);
    zoomButton.setAttribute('aria-pressed', 'false'); zoomButton.textContent = 'Zoom image';
  }
  document.addEventListener('click', event => {
    const jump = event.target.closest('[data-malaria-jump]');
    if (jump) {
      const section = jump.closest('.malaria-case').querySelector(`[data-story-step="${jump.dataset.malariaJump}"]`);
      section.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      return;
    }
    const link = event.target.closest('[data-malaria-image]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); opener = link;
    links = [...link.closest('.malaria-case').querySelectorAll('[data-malaria-image]')];
    index = links.indexOf(link);
    parentWasOpen = document.querySelector('#project-dialog').open;
    document.body.classList.add('modal-open');
    showImage(); viewer.showModal(); viewer.querySelector('[data-action="close"]').focus();
  });
  viewer.addEventListener('click', event => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'close') viewer.close();
    if (action === 'next' || action === 'previous') { index = (index + (action === 'next' ? 1 : -1) + links.length) % links.length; showImage(); }
    if (action === 'zoom') {
      const zoomed = viewport.classList.toggle('is-zoomed');
      zoomButton.setAttribute('aria-pressed', String(zoomed)); zoomButton.textContent = zoomed ? 'Fit image' : 'Zoom image';
    }
    if (event.target === viewer) {
      const bounds = viewer.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.close();
    }
  });
  viewer.addEventListener('keydown', event => {
    if ((event.key === 'ArrowRight' || event.key === 'ArrowLeft') && !viewport.classList.contains('is-zoomed')) {
      event.preventDefault(); index = (index + (event.key === 'ArrowRight' ? 1 : -1) + links.length) % links.length; showImage();
    }
    if (event.key !== 'Tab') return;
    const focusable = [...viewer.querySelectorAll('button, [tabindex="0"]')];
    if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1).focus(); }
    else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0].focus(); }
  });
  viewer.addEventListener('close', () => {
    if (!parentWasOpen) document.body.classList.remove('modal-open');
    opener?.focus();
  });
})();
