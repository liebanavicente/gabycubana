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
  initHeroEntrance();
  initSectionTitles();
  initReveal();
  initCounters();
  initModals();
  initCardHover();
}

/* ── NAV ── */
function initNav() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ── HERO ENTRANCE — pill + split-text chars + staggered elements ── */
function initHeroEntrance() {
  /* 1. Pill slides in immediately */
  const pill = document.querySelector('.hero__pill');
  if (pill) setTimeout(() => pill.classList.add('visible'), 80);

  /* 2. Split hero title into chars */
  const title = document.querySelector('.hero__title');
  if (title) {
    const html = title.innerHTML;
    // Parse text nodes and span.accent, preserve <br>
    const nodes = [...title.childNodes];
    title.innerHTML = '';
    let charIndex = 0;

    nodes.forEach(node => {
      if (node.nodeName === 'BR') {
        title.appendChild(document.createElement('br'));
        return;
      }
      const isAccent = node.nodeName === 'SPAN';
      const text = node.textContent;
      [...text].forEach(ch => {
        const span = document.createElement('span');
        span.className = ch === ' ' ? 'char is-space' : 'char';
        span.textContent = ch;
        const delay = 0.12 + charIndex * 0.038;
        span.style.animationDelay = `${delay}s`;
        if (isAccent) span.classList.add('accent');
        title.appendChild(span);
        if (ch !== ' ') charIndex++;
      });
    });
  }

  /* 3. Staggered fade-up for sub, ctas, proof, photo */
  const els = [
    { sel: '.hero__sub',    delay: 680 },
    { sel: '.hero__ctas',   delay: 820 },
    { sel: '.hero__proof',  delay: 960 },
    { sel: '.hero__photo',  delay: 500 },
  ];
  els.forEach(({ sel, delay }) => {
    const el = document.querySelector(sel);
    if (el) setTimeout(() => el.classList.add('visible'), delay);
  });
}

/* ── SECTION TITLES — word by word on scroll ── */
function initSectionTitles() {
  document.querySelectorAll('.section-title').forEach(title => {
    // Split into words, preserve <br> and .accent spans
    const nodes = [...title.childNodes];
    title.innerHTML = '';
    let wordIndex = 0;

    nodes.forEach(node => {
      if (node.nodeName === 'BR') {
        title.appendChild(document.createElement('br'));
        return;
      }
      const isAccent = node.nodeName === 'SPAN' && node.classList.contains('accent');
      const text = node.textContent;
      const words = text.split(/(\s+)/);

      words.forEach(w => {
        if (/^\s+$/.test(w)) {
          title.appendChild(document.createTextNode(' '));
          return;
        }
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = w;
        span.style.animationDelay = `${wordIndex * 0.1}s`;
        span.style.animationPlayState = 'paused';
        if (isAccent) span.classList.add('accent');
        title.appendChild(span);
        wordIndex++;
      });
    });

    // Trigger on scroll
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      title.querySelectorAll('.word').forEach(w => {
        w.style.animationPlayState = 'running';
      });
      io.unobserve(title);
    }, { threshold: 0.2 });
    io.observe(title);
  });
}

/* ── SCROLL REVEAL ── */
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

/* ── ANIMATED COUNTERS ── */
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
      const t0     = performance.now();

      (function tick(now) {
        const p    = Math.min((now - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = (isInt ? Math.round(target * ease) : (target * ease).toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);

      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  items.forEach(el => io.observe(el));
}

/* ── MODALS ── */
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

/* ── LINK CARD 3D TILT ── */
function initCardHover() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.link-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
      card.style.transform = `translateY(-2px) perspective(600px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}
