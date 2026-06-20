'use strict';

/* ============================================================
   AGE GATE
============================================================ */
(function initAgeGate() {
    const gate   = document.getElementById('age-gate');
    const site   = document.getElementById('site');
    const btnIn  = document.getElementById('btn-enter');
    const btnOut = document.getElementById('btn-exit');

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

    btnOut.addEventListener('click', () => {
        window.location.href = 'https://www.google.com';
    });
})();

/* ============================================================
   SITE INIT
============================================================ */
function initSite() {
    initNavbar();
    initScrollReveal();
    initModals();
    initFab();
    initCountdown();
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
   SCROLL REVEAL
============================================================ */
function initScrollReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });
    els.forEach(el => observer.observe(el));
}

/* ============================================================
   FAB — botón flotante OnlyFans
============================================================ */
function initFab() {
    const fab  = document.getElementById('fab');
    const hero = document.getElementById('hero');
    if (!fab || !hero) return;

    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                fab.classList.add('hidden');
            } else {
                fab.classList.remove('hidden');
            }
        },
        { threshold: 0.2 }
    );
    observer.observe(hero);
}

/* ============================================================
   MODALES
============================================================ */
function initModals() {
    const modals = {
        legal:   document.getElementById('modal-legal'),
        privacy: document.getElementById('modal-privacy'),
    };

    function openModal(key) {
        const modal = modals[key];
        if (!modal) return;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        const focusable = modal.querySelector('button');
        if (focusable) setTimeout(() => focusable.focus(), 60);
    }

    function closeAll() {
        Object.values(modals).forEach(m => m && m.classList.add('hidden'));
        document.body.style.overflow = '';
    }

    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-modal]');
        if (trigger) { e.preventDefault(); openModal(trigger.dataset.modal); }
        if (e.target.classList.contains('modal__backdrop')) closeAll();
        if (e.target.closest('.modal__close')) closeAll();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAll();
    });
}

/* ============================================================
   COUNTDOWN — cuenta atrás al fin de mes
============================================================ */
function initCountdown() {
    const dEl = document.getElementById('cd-d');
    const hEl = document.getElementById('cd-h');
    const mEl = document.getElementById('cd-m');
    const sEl = document.getElementById('cd-s');
    if (!dEl) return;

    function getEndOfMonth() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
    }

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
        const diff = getEndOfMonth() - Date.now();
        if (diff <= 0) {
            dEl.textContent = hEl.textContent = mEl.textContent = sEl.textContent = '00';
            return;
        }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        dEl.textContent = pad(d);
        hEl.textContent = pad(h);
        mEl.textContent = pad(m);
        sEl.textContent = pad(s);
    }

    tick();
    setInterval(tick, 1000);
}

/* ============================================================
   PARALLAX sutil en el nombre del hero
============================================================ */
document.addEventListener('mousemove', (e) => {
    const name = document.querySelector('.hero__name');
    if (!name) return;
    const dx = (e.clientX - window.innerWidth  / 2) / window.innerWidth;
    const dy = (e.clientY - window.innerHeight / 2) / window.innerHeight;
    name.style.transform = `translate(${dx * 6}px, ${dy * 3}px)`;
}, { passive: true });
