'use strict';

/* ============================================================
   AGE GATE
============================================================ */
(function initAgeGate() {
    const gate  = document.getElementById('age-gate');
    const site  = document.getElementById('site');
    const btnIn = document.getElementById('btn-enter');
    const btnOut= document.getElementById('btn-exit');

    function showSite() {
        gate.style.transition    = 'opacity 0.55s ease';
        gate.style.opacity       = '0';
        gate.style.pointerEvents = 'none';
        setTimeout(() => {
            gate.classList.add('hidden');
            site.classList.remove('hidden');
            initSite();
        }, 560);
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

/* ============================================================
   SITE INIT
============================================================ */
function initSite() {
    initNavbar();
    initScrollProgress();
    initScrollReveal();
    initModals();
    initFab();
    initCountdown();
    initSplitText();
    initCounters();
    initCursorGlow();
    initMagneticButtons();
    initCardTilt();
    initParticles();
    initParallax();
}

/* ============================================================
   NAVBAR
============================================================ */
function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ============================================================
   SCROLL PROGRESS BAR
============================================================ */
function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const h = document.documentElement;
        const pct = (window.scrollY / (h.scrollHeight - h.clientHeight)) * 100;
        bar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
}

/* ============================================================
   SCROLL REVEAL
============================================================ */
function initScrollReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });
    els.forEach(el => io.observe(el));
}

/* ============================================================
   FAB
============================================================ */
function initFab() {
    const fab  = document.getElementById('fab');
    const hero = document.getElementById('hero');
    if (!fab || !hero) return;
    new IntersectionObserver(([e]) => {
        fab.classList.toggle('hidden', e.isIntersecting);
    }, { threshold: 0.2 }).observe(hero);
}

/* ============================================================
   MODALES
============================================================ */
function initModals() {
    const modals = {
        legal:   document.getElementById('modal-legal'),
        privacy: document.getElementById('modal-privacy'),
    };
    const open = (key) => {
        const m = modals[key]; if (!m) return;
        m.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        setTimeout(() => m.querySelector('button')?.focus(), 60);
    };
    const closeAll = () => {
        Object.values(modals).forEach(m => m?.classList.add('hidden'));
        document.body.style.overflow = '';
    };
    document.addEventListener('click', (e) => {
        const t = e.target.closest('[data-modal]');
        if (t) { e.preventDefault(); open(t.dataset.modal); }
        if (e.target.classList.contains('modal__backdrop')) closeAll();
        if (e.target.closest('.modal__close')) closeAll();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });
}

/* ============================================================
   COUNTDOWN
============================================================ */
function initCountdown() {
    const dEl = document.getElementById('cd-d');
    const hEl = document.getElementById('cd-h');
    const mEl = document.getElementById('cd-m');
    const sEl = document.getElementById('cd-s');
    if (!dEl) return;
    const pad = n => String(n).padStart(2, '0');
    const end = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth() + 1, 1); };
    const tick = () => {
        const diff = end() - Date.now();
        if (diff <= 0) { dEl.textContent = hEl.textContent = mEl.textContent = sEl.textContent = '00'; return; }
        dEl.textContent = pad(Math.floor(diff / 86400000));
        hEl.textContent = pad(Math.floor((diff % 86400000) / 3600000));
        mEl.textContent = pad(Math.floor((diff % 3600000) / 60000));
        sEl.textContent = pad(Math.floor((diff % 60000) / 1000));
    };
    tick(); setInterval(tick, 1000);
}

/* ============================================================
   SPLIT TEXT — hero name letter by letter
============================================================ */
function initSplitText() {
    const name = document.querySelector('.hero__name');
    if (!name) return;
    const text = name.textContent.trim();
    name.textContent = '';
    [...text].forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char === ' ' ? ' ' : char;
        span.style.animationDelay = `${0.18 + i * 0.06}s`;
        name.appendChild(span);
    });
}

/* ============================================================
   COUNTERS — animate numbers up
============================================================ */
function initCounters() {
    const items = document.querySelectorAll('.proof-item__num');
    if (!items.length) return;

    const parseNum = (str) => parseFloat(str.replace(/[^\d.]/g, '')) || 0;
    const suffix   = (str) => str.replace(/[\d.]/g, '');

    const animateCounter = (el) => {
        const raw   = el.textContent.trim();
        const end   = parseNum(raw);
        const suf   = suffix(raw);
        const isInt = Number.isInteger(end);
        const dur   = 1400;
        const start = performance.now();

        const step = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            const cur = end * ease;
            el.textContent = (isInt ? Math.round(cur) : cur.toFixed(1)) + suf;
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                animateCounter(e.target);
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });

    items.forEach(el => io.observe(el));
}

/* ============================================================
   CURSOR GLOW
============================================================ */
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow || window.matchMedia('(pointer: coarse)').matches) {
        if (glow) glow.style.display = 'none';
        return;
    }
    let mx = 0, my = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function lerp() {
        cx += (mx - cx) * 0.09;
        cy += (my - cy) * 0.09;
        glow.style.left = cx + 'px';
        glow.style.top  = cy + 'px';
        requestAnimationFrame(lerp);
    })();
}

/* ============================================================
   MAGNETIC BUTTONS
============================================================ */
function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('.btn--coral, .btn--glass').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const r = btn.getBoundingClientRect();
            const dx = (e.clientX - r.left - r.width  / 2) * 0.22;
            const dy = (e.clientY - r.top  - r.height / 2) * 0.22;
            btn.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

/* ============================================================
   3D CARD TILT
============================================================ */
function initCardTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('.feature-card, .link-row').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const r  = card.getBoundingClientRect();
            const dx = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2);
            const dy = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
            const rx = -dy * 7;
            const ry =  dx * 7;
            card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
            card.style.boxShadow = `${-ry * 2}px ${rx * 2}px 40px rgba(232,88,64,0.18)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });
}

/* ============================================================
   FLOATING PARTICLES
============================================================ */
function initParticles() {
    const count = 18;
    const colors = ['rgba(232,88,64,0.7)', 'rgba(201,162,39,0.6)', 'rgba(244,122,98,0.6)', 'rgba(249,192,176,0.5)'];
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.cssText = `
            left: ${Math.random() * 100}vw;
            width: ${1 + Math.random() * 3}px;
            height: ${1 + Math.random() * 3}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            --dur: ${3 + Math.random() * 5}s;
            --delay: ${Math.random() * 6}s;
            --dx: ${(Math.random() - 0.5) * 80}px;
        `;
        document.body.appendChild(p);
    }
}

/* ============================================================
   PARALLAX — hero photo + orbs on scroll
============================================================ */
function initParallax() {
    const photo = document.querySelector('.hero__photo-wrap');
    const orbs  = document.querySelectorAll('.orb');

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (photo) photo.style.transform = `translateY(${y * 0.08}px)`;
        orbs.forEach((orb, i) => {
            const speed = 0.03 + i * 0.015;
            const dir   = i % 2 === 0 ? 1 : -1;
            orb.style.transform = `translateY(${y * speed * dir}px)`;
        });
    }, { passive: true });
}

/* ============================================================
   MOUSE PARALLAX on hero name
============================================================ */
document.addEventListener('mousemove', (e) => {
    const name = document.querySelector('.hero__name');
    if (!name) return;
    const dx = (e.clientX - window.innerWidth  / 2) / window.innerWidth;
    const dy = (e.clientY - window.innerHeight / 2) / window.innerHeight;
    name.style.textShadow = `${dx * 12}px ${dy * 6}px 40px rgba(232,88,64,0.3)`;
}, { passive: true });
