/* =====================================================
   CHEZ MARIE – script.js
   Interactions: Header, Mobile Menu, Tabs, Scroll Reveal
   ===================================================== */

(function () {
    'use strict';

    /* ---- DOM Refs ---- */
    const header = document.getElementById('header');
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('overlay');
    const mobileClose = document.getElementById('mobile-close');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.menu-panel');
    const heroBg = document.querySelector('.hero-bg');

    /* ---- Header Scroll Behavior ---- */
    const handleScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on load

    /* ---- Hero Background Pan Effect ---- */
    if (heroBg) {
        setTimeout(() => heroBg.classList.add('loaded'), 100);
    }

    /* ---- Mobile Menu ---- */
    const openMenu = () => {
        burger.classList.add('open');
        mobileMenu.classList.add('open');
        overlay.classList.add('show');
        mobileMenu.setAttribute('aria-hidden', 'false');
        burger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        overlay.classList.remove('show');
        mobileMenu.setAttribute('aria-hidden', 'true');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    burger.addEventListener('click', () =>
        mobileMenu.classList.contains('open') ? closeMenu() : openMenu()
    );
    mobileClose.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    mobileLinks.forEach(l => l.addEventListener('click', closeMenu));

    /* ---- Keyboard: close mobile menu on Escape ---- */
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
    });

    /* ---- Menu Tabs ---- */
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            // Update tabs
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            // Reveal panel with animation
            panels.forEach(p => p.classList.remove('active'));
            const activePanel = document.getElementById(target);
            if (activePanel) {
                activePanel.classList.add('active');
                // Re-trigger reveal animations inside panel
                activePanel.querySelectorAll('.reveal').forEach(el => {
                    el.classList.remove('visible');
                    // Small delay so the animation re-runs
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => el.classList.add('visible'));
                    });
                });
            }
        });
    });

    /* ---- Scroll Reveal (Intersection Observer) ---- */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach((el, i) => {
        // Stagger siblings inside same parent
        const siblings = el.parentElement.querySelectorAll('.reveal');
        const idx = Array.from(siblings).indexOf(el);
        el.style.transitionDelay = `${idx * 0.08}s`;
        revealObserver.observe(el);
    });

    /* ---- Smooth Anchor Scroll (polyfill for older browsers) ---- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const top = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

})();
