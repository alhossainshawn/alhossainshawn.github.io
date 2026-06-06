/**
 * Al Hossain Shawn — Portfolio
 * interactive.js — Simplified behaviours:
 *   1. Mobile nav toggle
 *   2. Active nav link on scroll
 *   3. Fade-in reveal on scroll (IntersectionObserver)
 *   4. Smooth anchor scrolling
 */

(function () {
  'use strict';

  /* ── 1. Mobile Navigation ──────────────────────────── */
  const menuToggle   = document.getElementById('menu-toggle');
  const mobileNav    = document.getElementById('mobile-nav');
  const mobileClose  = document.getElementById('mobile-nav-close');

  function openMenu() {
    if (!mobileNav) return;
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!mobileNav) return;
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);

  // Close when clicking the backdrop
  if (mobileNav) {
    mobileNav.addEventListener('click', function (e) {
      if (e.target === mobileNav) closeMenu();
    });
  }

  // Close when a nav link is clicked
  document.querySelectorAll('.mobile-nav__drawer a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ── 2. Active Nav Link on Scroll ─────────────────── */
  const sections = Array.from(document.querySelectorAll('section[id], footer[id]'));
  const navLinks  = Array.from(document.querySelectorAll('.site-nav a'));

  function updateActiveNav() {
    let current = '';
    const scrollY = window.scrollY + 100;

    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollY) {
        current = sec.id;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ── 3. Reveal on Scroll (IntersectionObserver) ─────── */
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) { revealObs.observe(el); });
  } else {
    // Fallback: show all immediately
    reveals.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ── 4. Smooth Anchor Scrolling ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = anchor.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const headerH = 70; // site-header height
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── 5. Dark Mode Toggle ────────────────────────────── */
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);

  if (isDark) {
    document.body.classList.add('dark-mode');
  }

  function updateThemeButton(btn, isDark) {
    if (!btn) return;
    const moonSvg = `<svg class="theme-toggle__icon" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    const sunSvg = `<svg class="theme-toggle__icon" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    btn.innerHTML = isDark ? sunSvg : moonSvg;
  }

  const headerInner = document.querySelector('.site-header__inner');
  if (headerInner) {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'theme-toggle';
    toggleBtn.className = 'theme-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle theme');
    
    updateThemeButton(toggleBtn, isDark);

    toggleBtn.addEventListener('click', function () {
      const currentlyDark = document.body.classList.toggle('dark-mode');
      localStorage.setItem('theme', currentlyDark ? 'dark' : 'light');
      updateThemeButton(toggleBtn, currentlyDark);
    });

    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
      headerInner.insertBefore(toggleBtn, menuToggle);
    } else {
      headerInner.appendChild(toggleBtn);
    }
  }

})();
