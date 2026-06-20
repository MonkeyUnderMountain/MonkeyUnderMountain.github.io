/* PIXEL PORTFOLIO - Main Script */

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const STAR_COUNT = 50;
const REVEAL_SELECTOR = [
  '.notice-board',
  '.about-container',
  '.about-info-card',
  '.note-panel',
  '.note-card',
  '.research-panel',
  '.paper-card',
  '.collaborator-card',
  '.side-quests-panel',
  '.side-quest-card',
].join(', ');

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

  initStarField(prefersReducedMotion);
  initDialogTypewriter(prefersReducedMotion);
  initNavScroll(prefersReducedMotion);
  initScrollReveal(prefersReducedMotion);
});

function initStarField(prefersReducedMotion) {
  const field = document.getElementById('starField');
  if (!field) return;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement('span');
    const size = Math.random() > 0.5 ? 4 : 2;

    star.className = 'pixel-bg-star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    if (!prefersReducedMotion) {
      star.style.animationDelay = `${Math.random() * 3}s`;
      star.style.animationDuration = `${1.5 + Math.random() * 2}s`;
    }

    fragment.appendChild(star);
  }

  field.appendChild(fragment);
}

function initDialogTypewriter(prefersReducedMotion) {
  const dialogEl = document.getElementById('dialogText');
  if (!dialogEl || prefersReducedMotion) return;

  const fullText = dialogEl.textContent.trim().replace(/\s+/g, ' ');
  let charIndex = 0;
  let started = false;

  dialogEl.textContent = '';

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || started) return;

      started = true;
      typeNextChar(dialogEl, fullText, charIndex, (nextIndex) => {
        charIndex = nextIndex;
      });
      observer.unobserve(dialogEl);
    });
  }, { threshold: 0.3 });

  observer.observe(dialogEl);
}

function typeNextChar(element, text, index, updateIndex) {
  if (index >= text.length) return;

  element.textContent += text[index];
  const nextIndex = index + 1;
  updateIndex(nextIndex);

  window.setTimeout(
    () => typeNextChar(element, text, nextIndex, updateIndex),
    getTypeDelay(text[index])
  );
}

function getTypeDelay(character) {
  if (character === '.') return 200;
  if (character === ',') return 100;
  if (character === '!') return 150;
  return 30;
}

function initNavScroll(prefersReducedMotion) {
  document.querySelectorAll('.nav-link, .nav-logo, .skip-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href?.startsWith('#')) return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  });
}

function initScrollReveal(prefersReducedMotion) {
  const revealElements = document.querySelectorAll(REVEAL_SELECTOR);
  if (prefersReducedMotion || !revealElements.length) return;

  revealElements.forEach((element) => {
    element.classList.add('is-reveal-pending');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      window.setTimeout(() => {
        element.classList.add('is-revealed');
      }, getRevealDelay(element));

      observer.unobserve(element);
    });
  }, { threshold: 0.1 });

  revealElements.forEach((element) => observer.observe(element));
}

function getRevealDelay(element) {
  const parent = element.parentElement;
  if (!parent) return 0;

  return Array.from(parent.children).indexOf(element) * 80;
}
