/* Johnny Hnrx — portfolio behaviour: mobile nav, scroll reveal, lightbox, contact form. */
 
/* Guards throughout: about.html has no gallery, lightbox or form. */
 
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
 
/* ---------- Mobile navigation ---------- */
 
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
 
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
 
  siteNav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}
 
/* ---------- Scroll reveal ---------- */
 
const revealItems = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((el) => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px 20% 0px' });
 
  revealItems.forEach((el) => observer.observe(el));
}
 
/* ---------- Lightbox ----------
   Each [data-gallery] block is its own set, so arrows stay inside one project. */
 
const lightbox = document.getElementById('lightbox');
const groups = Array.from(document.querySelectorAll('[data-gallery]'));
 
if (lightbox && groups.length) {
  const lightboxImg = document.getElementById('lightboxImg');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const closeBtn = document.getElementById('lightboxClose');
 
  let activeSet = [];
  let currentIndex = 0;
  let lastFocused = null;

  const showImage = (index) => {
    if (!activeSet.length) return;
    currentIndex = (index + activeSet.length) % activeSet.length;
    const source = activeSet[currentIndex];
    lightboxImg.src = source.currentSrc || source.src;
    lightboxImg.alt = source.alt;
    const single = activeSet.length < 2;
    prevBtn.hidden = single;
    nextBtn.hidden = single;
  };
 
  const openLightbox = (set, index) => {
    activeSet = set;
    lastFocused = document.activeElement;
    showImage(index);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };
 
  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };
 
  groups.forEach((group) => {
    const set = Array.from(group.querySelectorAll('img'));
 
    set.forEach((img, index) => {
      const frame = img.parentElement;
      frame.setAttribute('tabindex', '0');
      frame.setAttribute('role', 'button');
      frame.addEventListener('click', () => openLightbox(set, index));
      frame.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(set, index);
        }
      });
    });
  });
 
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
  nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
 
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
 
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });
 
  /* Swipe on touch devices */
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) showImage(currentIndex + (delta < 0 ? 1 : -1));
  }, { passive: true });
}
 
/* ---------- Contact form ----------
   Posts to Web3Forms via fetch so the visitor stays on the page. */
 
const form = document.getElementById('contactForm');
 
if (form) {
  const status = document.getElementById('formStatus');
  const submitBtn = form.querySelector('.btn');
 
  form.addEventListener('submit', async (e) => {
    /* Reads the form itself, so any field you add later is validated too */
    const fields = Array.from(form.querySelectorAll('input[required], textarea[required], select[required]'));
    const invalid = fields.filter((field) => !field.checkValidity());
 
    fields.forEach((field) => field.removeAttribute('aria-invalid'));
 
    if (invalid.length) {
      e.preventDefault();
      invalid.forEach((field) => field.setAttribute('aria-invalid', 'true'));
 
      const missing = invalid.map((field) => {
        const label = form.querySelector('label[for="' + field.id + '"]');
        return (label ? label.textContent : field.name).replace(' *', '').trim().toLowerCase();
      });
 
      status.textContent = 'Still needed: ' + missing.join(', ') + '.';
      invalid[0].focus();
      return;
    }
 
    const keyField = form.querySelector('[name="access_key"]');
    if (!keyField || keyField.value === 'YOUR_ACCESS_KEY') {
      e.preventDefault();
      status.textContent = 'Form key not set yet. Add your Web3Forms access key to index.html.';
      return;
    }
 
    e.preventDefault();
    submitBtn.disabled = true;
    status.textContent = 'Sending...';
 
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
 
      if (!response.ok) throw new Error(response.status);
      form.reset();
      status.textContent = 'Message sent. I will reply within two working days.';
    } catch (error) {
      status.textContent = 'That did not send. Email hello@yourdomain.com instead.';
    } finally {
      submitBtn.disabled = false;
    }
  });
}
 
/* ---------- Nav highlight ----------
   Marks the nav link for the section currently crossing mid-screen. */
 
const spyLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
const spySections = spyLinks
  .map((a) => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);
 
if (spySections.length && 'IntersectionObserver' in window) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = spyLinks.find((a) => a.getAttribute('href') === '#' + entry.target.id);
      if (link) link.classList.toggle('is-active', entry.isIntersecting);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
 
  spySections.forEach((section) => spy.observe(section));
}
