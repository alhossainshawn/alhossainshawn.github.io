/* =====================================================
   Portfolio interactions — sticky nav, scroll progress,
   active section indicator, reveals, mouse parallax,
   live uptime counter, animated background.
   ===================================================== */
(function () {
  'use strict';

  // -------------------------------------------------------
  // 1. Scroll reveals — fade-up sections as they enter view
  // -------------------------------------------------------
  function setupReveals() {
    if (!('IntersectionObserver' in window)) return;

    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    // First: mark anything in initial viewport so it never flashes blank.
    revealEls.forEach(function (el) {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in');
    });

    // NOW activate the CSS that hides un-revealed items.
    document.documentElement.classList.add('js-loaded');

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) {
      if (!el.classList.contains('in')) io.observe(el);
    });
  }

  // -------------------------------------------------------
  // 2. Scroll progress bar + top pill nav compact state
  // -------------------------------------------------------
  function setupStickyNav() {
    const progressBar = document.querySelector('.scroll-progress');
    const siteNav = document.querySelector('.site-nav');

    let ticking = false;
    function update() {
      const y = window.scrollY;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0;

      if (progressBar) progressBar.style.transform = 'scaleX(' + pct + ')';

      // Compact nav after 60px of scroll
      if (siteNav) {
        if (y > 60) {
          siteNav.classList.add('scrolled');
        } else {
          siteNav.classList.remove('scrolled');
        }
      }

      ticking = false;
    }
    update();
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  }

  // -------------------------------------------------------
  // 3. Active section indicator in nav
  // -------------------------------------------------------
  function setupActiveNav() {
    if (!('IntersectionObserver' in window)) return;
    const links = document.querySelectorAll('.site-nav .nav-links a[href^="#"], .titleblock .nav a[href^="#"]');
    if (!links.length) return;

    const sectionIds = [...links].map(function (a) { return a.getAttribute('href').slice(1); });
    const sections = sectionIds
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    if (!sections.length) return;

    const linkById = {};
    links.forEach(function (a) {
      const id = a.getAttribute('href').slice(1);
      linkById[id] = a;
    });

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (a) { a.classList.remove('current'); });
          const link = linkById[entry.target.id];
          if (link) link.classList.add('current');
        }
      });
    }, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });

    sections.forEach(function (s) { io.observe(s); });
  }

  // -------------------------------------------------------
  // 4. Mouse parallax on hero — portrait + corners drift
  // -------------------------------------------------------
  function setupParallax() {
    const hero = document.querySelector('.hero');
    const portrait = document.querySelector('.hero .portrait');
    if (!hero || !portrait) return;

    // Honour reduced motion preference.
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = null;
    let mx = 0, my = 0;
    hero.addEventListener('mousemove', function (e) {
      const r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;   // -0.5 .. 0.5
      my = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(apply);
    });
    hero.addEventListener('mouseleave', function () {
      mx = 0; my = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    });

    function apply() {
      portrait.style.transform = 'translate3d(' + (mx * -8) + 'px,' + (my * -6) + 'px, 0)';
      raf = null;
    }
  }

  // -------------------------------------------------------
  // 5. Live uptime counter — days since 2022-01-15
  // -------------------------------------------------------
  function setupUptime() {
    const el = document.querySelector('[data-uptime]');
    if (el) {
      const start = new Date(2022, 0, 15).getTime(); // Jan 15, 2022
      const update = function () {
        const days = Math.floor((Date.now() - start) / 86400000);
        el.textContent = 'T+' + days.toLocaleString() + 'd';
      };
      update();
      setInterval(update, 60000);
    }
    // Current-role "since" counter (days as Research Assistant)
    const since = document.querySelector('[data-uptime-since]');
    if (since) {
      const roleStart = new Date(2026, 2, 1).getTime(); // Mar 1, 2026
      const upd = function () {
        const d = Math.max(0, Math.floor((Date.now() - roleStart) / 86400000));
        since.textContent = 'NOW · T+' + d + 'd';
      };
      upd();
      setInterval(upd, 60000);
    }
  }

  // -------------------------------------------------------
  // 6. Animated FPGA-grid background — occasional lit cells
  // -------------------------------------------------------
  function setupGridPulse() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const layer = document.querySelector('.grid-pulse');
    if (!layer) return;
    const size = 40; // px per cell

    function spawn() {
      const w = window.innerWidth;
      const h = window.innerHeight * 0.9;
      const col = Math.floor(Math.random() * (w / size));
      const row = Math.floor(Math.random() * (h / size));
      const dot = document.createElement('div');
      dot.className = 'grid-pulse-cell';
      dot.style.left = (col * size) + 'px';
      dot.style.top = (row * size) + 'px';
      layer.appendChild(dot);
      // Remove after animation completes
      setTimeout(function () { dot.remove(); }, 2400);
    }

    function loop() {
      spawn();
      setTimeout(loop, 600 + Math.random() * 1200);
    }
    loop();
  }

  // -------------------------------------------------------
  // 7. Stack diagram — hover a layer to highlight it
  //    (CSS does most of the work; this just adds a small
  //    interaction: clicking a row "pins" the highlight.)
  // -------------------------------------------------------
  function setupStackInteraction() {
    const cells = document.querySelectorAll('.stack-cell.label');
    cells.forEach(function (cell) {
      cell.addEventListener('click', function () {
        cells.forEach(function (c) { c.classList.remove('pinned'); });
        cell.classList.add('pinned');
      });
    });
  }

  // -------------------------------------------------------
  // 8. Page transitions — synapser-style curtain wipe
  //    Injects a full-screen curtain, lifts it on load,
  //    and drops it over the screen before navigating to
  //    another page (real multi-page navigation).
  // -------------------------------------------------------
  function setupTransitions() {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return; // CSS hides the curtain; links navigate normally

    const curtain = document.querySelector('.pt-curtain');
    if (!curtain) return;

    const bar = curtain.querySelector('.pt-bar i');
    const count = curtain.querySelector('.pt-count');

    // Enter counter flourish (the lift itself is pure CSS)
    animateCount(count, null, 800);

    // Safety net: guarantee the curtain is gone shortly after load even if
    // the CSS reveal animation fails to run in some environment.
    setTimeout(function () {
      if (!curtain.classList.contains('is-covering')) {
        curtain.style.visibility = 'hidden';
        curtain.style.pointerEvents = 'none';
      }
    }, 1700);

    // ---- EXIT: intercept internal link clicks, cover, then navigate ----
    document.addEventListener('click', function (e) {
      const a = e.target.closest('a');
      if (!a) return;

      const href = a.getAttribute('href');
      if (!href) return;

      // Skip: hash links, new-tab, downloads, mailto/tel, modified clicks
      if (href.startsWith('#')) return;
      if (a.target && a.target !== '_self') return;
      if (a.hasAttribute('download')) return;
      if (/^(mailto:|tel:)/.test(href)) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      // Same-origin only
      let url;
      try { url = new URL(a.href, location.href); } catch (_) { return; }
      if (url.origin !== location.origin) return;

      e.preventDefault();

      curtain.style.visibility = 'visible';
      curtain.style.pointerEvents = '';
      curtain.classList.add('is-covering');
      if (bar) { bar.style.animation = 'none'; }
      animateCount(count, bar, 560);

      // Navigate once the panels have fully covered the screen.
      let navigated = false;
      const go = function () { if (!navigated) { navigated = true; window.location.href = url.href; } };
      setTimeout(go, 880);
    });
  }

  function animateCount(countEl, barEl, duration, done) {
    if (!countEl && !barEl) { if (done) done(); return; }
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const v = Math.round(t * 100);
      if (countEl) countEl.textContent = String(v).padStart(3, '0');
      if (barEl) barEl.style.width = v + '%';
      if (t < 1) requestAnimationFrame(frame);
      else if (done) done();
    }
    requestAnimationFrame(frame);
  }

  // -------------------------------------------------------
  // 9. Tool proficiency dots — build 5 dots from data-level
  // -------------------------------------------------------
  function setupToolDots() {
    document.querySelectorAll('.t-dots').forEach(function (el) {
      const level = parseInt(el.getAttribute('data-level'), 10) || 0;
      let html = '';
      for (let i = 0; i < 5; i++) html += '<i class="' + (i < level ? 'on' : '') + '"></i>';
      el.innerHTML = html;
    });
  }

  // -------------------------------------------------------
  // 10. Special section reveals — fire the scan-beam on the
  //     current-role block when the experience section enters.
  // -------------------------------------------------------
  function setupSpecialReveals() {
    if (!('IntersectionObserver' in window)) return;
    const exp = document.querySelector('.exp-section');
    if (exp) {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const cr = entry.target.querySelector('.current-role');
            if (cr) cr.classList.add('beam');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      io.observe(exp);
    }
  }

  // -------------------------------------------------------
  // 11. Typing animation for whoami — character by character
  // -------------------------------------------------------
  function setupTypingAnimation() {
    const el = document.getElementById('typing-whoami');
    if (!el) return;

    const text = 'whoami';
    let isDeleting = false;
    let txt = '';
    
    function tick() {
      if (isDeleting) {
        txt = text.substring(0, txt.length - 1);
      } else {
        txt = text.substring(0, txt.length + 1);
      }

      el.textContent = txt;

      let delta = isDeleting ? 80 : 150;

      if (!isDeleting && txt === text) {
        delta = 2000; // Pause when word is complete
        isDeleting = true;
      } else if (isDeleting && txt === '') {
        isDeleting = false;
        delta = 500; // Pause when word is fully deleted
      }

      setTimeout(tick, delta);
    }

    tick();
  }

  // -------------------------------------------------------
  // NEW: Cursor follower
  // -------------------------------------------------------
  function setupCursorFollower() {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    // hide on mobile / touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      dot.style.display = 'none';
      ring.style.display = 'none';
      document.body.style.cursor = '';
      return;
    }

    let mx = -100, my = -100;
    let rx = -100, ry = -100;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = 'translate(' + (mx - 4) + 'px, ' + (my - 4) + 'px)';
    });

    (function animateRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.transform = 'translate(' + (rx - 20) + 'px, ' + (ry - 20) + 'px)';
      requestAnimationFrame(animateRing);
    })();

    // scale dot on clickable hover
    document.addEventListener('mouseover', function (e) {
      const el = e.target.closest('a, button, [role="button"], .cap-cell, .res-card, .int-card, .proj-row');
      dot.style.transform = el
        ? 'translate(' + (mx - 4) + 'px, ' + (my - 4) + 'px) scale(2.5)'
        : 'translate(' + (mx - 4) + 'px, ' + (my - 4) + 'px) scale(1)';
    });
  }

  // -------------------------------------------------------
  // NEW: Scroll clip-reveals for section titles
  // -------------------------------------------------------
  function setupClipReveals() {
    if (!('IntersectionObserver' in window)) return;
    const clips = document.querySelectorAll('.reveal-clip');
    if (!clips.length) return;

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    clips.forEach(function (el) { io.observe(el); });
  }

  // -------------------------------------------------------
  // NEW: Card hover tilt effect
  // -------------------------------------------------------
  function setupCardTilt() {
    const cards = document.querySelectorAll('.res-card, .int-card');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        card.style.transform = 'perspective(600px) rotateY(' + (dx * 4) + 'deg) rotateX(' + (-dy * 3) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  // -------------------------------------------------------
  // NEW: Magnetic button hover effect
  // -------------------------------------------------------
  function setupMagneticButtons() {
    const btns = document.querySelectorAll('.hero-scroll, .site-nav .nav-links a');
    btns.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.25;
        const dy = (e.clientY - cy) * 0.25;
        btn.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s cubic-bezier(.16,1,.3,1)';
        setTimeout(function () { btn.style.transition = ''; }, 400);
      });
    });
  }

  // -------------------------------------------------------
  // Init
  // -------------------------------------------------------
  function init() {
    setupTransitions();
    setupReveals();
    setupStickyNav();
    setupActiveNav();
    setupParallax();
    setupUptime();
    setupGridPulse();
    setupStackInteraction();
    setupToolDots();
    setupSpecialReveals();
    setupTypingAnimation();
    // New interactions
    setupCursorFollower();
    setupClipReveals();
    setupCardTilt();
    setupMagneticButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
