'use strict';

(function initAgeGate() {
  const gate   = document.getElementById('age-gate');
  const site   = document.getElementById('site');
  const btnIn  = document.getElementById('btn-enter');
  const btnOut = document.getElementById('btn-exit');

  function showSite() {
    gate.style.transition = 'opacity 0.5s ease';
    gate.style.opacity = '0';
    gate.style.pointerEvents = 'none';
    setTimeout(() => {
      gate.classList.add('hidden');
      site.classList.remove('hidden');
      initSite();
    }, 520);
  }

  if (localStorage.getItem('gaby_age_ok') === '1') {
    gate.classList.add('hidden');
    site.classList.remove('hidden');
    initSite();
    return;
  }

  btnIn.addEventListener('click', () => {
    localStorage.setItem('gaby_age_ok', '1');
    showSite();
  });
  btnOut.addEventListener('click', () => { window.location.href = 'https://www.google.com'; });
})();

function initSite() {
  initNav();
  initReveal();
  initCounters();
  initModals();
  initCardHover();
}

/* NAV — scroll glass effect */
function initNav() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* SCROLL REVEAL */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

/* ANIMATED COUNTERS */
function initCounters() {
  const items = document.querySelectorAll('.stats__num[data-target]');
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const isInt  = Number.isInteger(target);
      const dur    = 1200;
      const start  = performance.now();

      (function tick(now) {
        const p    = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const val  = target * ease;
        el.textContent = (isInt ? Math.round(val) : val.toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(start);

      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  items.forEach(el => io.observe(el));
}

/* MODALS */
function initModals() {
  const modals = {
    legal:   document.getElementById('modal-legal'),
    privacy: document.getElementById('modal-privacy'),
  };
  const closeAll = () => {
    Object.values(modals).forEach(m => m?.classList.add('hidden'));
    document.body.style.overflow = '';
  };
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal]');
    if (trigger) {
      e.preventDefault();
      const m = modals[trigger.dataset.modal];
      if (m) { m.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
    }
    if (e.target.classList.contains('modal__backdrop')) closeAll();
    if (e.target.closest('.modal__close')) closeAll();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
}

/* LINK CARD SUBTLE HOVER TILT */
function initCardHover() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.link-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
      card.style.transform = `translateY(-2px) perspective(600px) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}
