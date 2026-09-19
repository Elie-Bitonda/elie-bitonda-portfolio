'use strict';
const header = document.querySelector('#header');
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const navLinks = [...navigation.querySelectorAll('a')];
const backToTop = document.querySelector('.back-to-top');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

function closeMenu(returnFocus = false) {
  navigation.classList.remove('open');
  header.classList.remove('menu-open');
  menu.setAttribute('aria-expanded', 'false');
  if (returnFocus) menu.focus();
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
  header.classList.toggle('menu-open', open);
});
navLinks.forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) closeMenu(true);
});
document.addEventListener('click', event => {
  if (!header.contains(event.target)) closeMenu();
});
header.addEventListener('focusout', () => {
  requestAnimationFrame(() => { if (!header.contains(document.activeElement)) closeMenu(); });
});
matchMedia('(min-width: 801px)').addEventListener('change', () => closeMenu());

const sections = navLinks.map(link => document.querySelector(link.getAttribute('href')));
function updateScroll() {
  header.classList.toggle('scrolled', scrollY > 30);
  backToTop.hidden = scrollY < 500;
  let current = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= innerHeight * .35) current = section;
  }
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 5) current = sections.at(-1);
  navLinks.forEach(link => {
    if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
let scheduled = false;
addEventListener('scroll', () => {
  if (!scheduled) requestAnimationFrame(() => { updateScroll(); scheduled = false; });
  scheduled = true;
}, { passive: true });
updateScroll();
document.querySelector('#year').textContent = new Date().getFullYear();

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.remove('is-pending'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(element => {
    element.classList.add('is-pending'); revealObserver.observe(element);
  });
}

// Decorative video pauses outside the hero, in background tabs, and for reduced motion.
const video = document.querySelector('#hero-video');
const videoToggle = document.querySelector('#video-toggle');
let manuallyPaused = reducedMotion.matches;
let heroVisible = true;
function syncVideo() {
  video.autoplay = !manuallyPaused;
  if (manuallyPaused || !heroVisible || document.hidden) video.pause();
  else video.play().catch(() => { videoToggle.textContent = 'Play video'; });
}
video.addEventListener('play', () => {
  if (manuallyPaused || !heroVisible || document.hidden) { video.pause(); return; }
  videoToggle.textContent = 'Pause video';
});
video.addEventListener('pause', () => { videoToggle.textContent = 'Play video'; });
video.addEventListener('error', () => { videoToggle.hidden = true; });
videoToggle.addEventListener('click', () => { manuallyPaused = !video.paused; syncVideo(); });
reducedMotion.addEventListener('change', event => { manuallyPaused = event.matches; syncVideo(); });
document.addEventListener('visibilitychange', syncVideo);
if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
  heroVisible = entries[0].isIntersecting; syncVideo();
}).observe(document.querySelector('#home'));
syncVideo();

// Load the toolkit background only near the viewport; leave its poster for reduced motion.
const skillsVideo = document.querySelector('.skills-background-video');
const skillsSource = skillsVideo.querySelector('source');
let skillsNearby = false;
function syncSkillsVideo() {
  const shouldPlay = skillsNearby && !reducedMotion.matches && !document.hidden && !document.querySelector('#project-dialog').open;
  skillsVideo.muted = true;
  skillsVideo.autoplay = shouldPlay;
  if (!shouldPlay) { skillsVideo.pause(); return; }
  if (!skillsSource.hasAttribute('src')) {
    skillsSource.src = skillsSource.dataset.src;
    skillsVideo.load();
  }
  skillsVideo.play().catch(() => { /* The poster and navy background remain usable. */ });
}
skillsVideo.addEventListener('play', () => {
  if (!skillsNearby || reducedMotion.matches || document.hidden || document.querySelector('#project-dialog').open) skillsVideo.pause();
});
reducedMotion.addEventListener('change', syncSkillsVideo);
document.addEventListener('visibilitychange', syncSkillsVideo);
if ('IntersectionObserver' in window) {
  new IntersectionObserver(entries => {
    skillsNearby = entries[0].isIntersecting;
    syncSkillsVideo();
  }, { rootMargin: '200px 0px' }).observe(document.querySelector('#skills'));
}
syncSkillsVideo();

// Multiple categories can describe the same project; every filter has verified work.
const cards = [...document.querySelectorAll('.project')];
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  let count = 0;
  cards.forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && !card.dataset.category.split(' ').includes(button.dataset.filter);
    if (!card.hidden) { count++; if (!reducedMotion.matches) card.animate([{opacity:0, transform:'translateY(12px)'}, {opacity:1, transform:'none'}], {duration:300}); }
  });
  document.querySelector('#filter-status').textContent = `${count} project${count === 1 ? '' : 's'} shown`;
}));

// Native dialog provides keyboard containment and Escape; the inline articles work without JS.
const dialog = document.querySelector('#project-dialog');
const dialogContent = document.querySelector('#dialog-content');
let trigger;
if (typeof dialog.showModal === 'function') {
  document.querySelector('#case-studies').classList.add('enhanced');
  document.querySelectorAll('[data-project]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    trigger = link;
    const source = document.querySelector(link.hash);
    dialogContent.replaceChildren(source.cloneNode(true));
    dialogContent.firstElementChild.removeAttribute('id');
    dialogContent.querySelector('h2').id = 'dialog-title';
    dialog.classList.toggle('malaria-dialog', link.dataset.project === 'malaria');
    if (!['malaria', 'baho', 'accident', 'kwanda'].includes(link.dataset.project)) {
    const figure = document.createElement('figure');
    figure.style.margin = '28px 0 0';
    const image = document.querySelector(`.project-visual[data-project="${link.dataset.project}"] img`).cloneNode();
    image.classList.add('dialog-image');
    const caption = document.createElement('figcaption');
    caption.className = 'diagram-caption'; caption.textContent = 'Engineering schematic. Not a project photograph or measured result.';
    const zoom = document.createElement('button'); zoom.type = 'button'; zoom.className = 'diagram-zoom'; zoom.textContent = 'Enlarge diagram'; zoom.setAttribute('aria-expanded', 'false');
    zoom.addEventListener('click', () => { const expanded = figure.classList.toggle('diagram-expanded'); zoom.setAttribute('aria-expanded', String(expanded)); zoom.textContent = expanded ? 'Fit diagram' : 'Enlarge diagram'; });
    figure.append(image); dialogContent.append(figure, caption, zoom);
    }
    document.body.classList.add('modal-open'); dialog.showModal(); dialog.scrollTop = 0;
    syncSkillsVideo();
    document.querySelector('.dialog-close').focus();
  }));
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button, a[href], input, textarea, [tabindex="0"]')].filter(element => !element.disabled && element.getClientRects().length);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    dialog.querySelectorAll('video').forEach(media => media.pause());
    syncSkillsVideo();
    document.body.classList.remove('modal-open'); trigger?.focus();
  });
}
