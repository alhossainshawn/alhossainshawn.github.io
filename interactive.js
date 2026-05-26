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
  // 2. Sticky nav — compact state + scroll progress bar
  // -------------------------------------------------------
  function setupStickyNav() {
    const tb = document.querySelector('.titleblock');
    const progressBar = document.querySelector('.scroll-progress');
    if (!tb && !progressBar) return;

    let ticking = false;
    function update() {
      const y = window.scrollY;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0;

      if (tb) tb.classList.toggle('scrolled', y > 60);
      if (progressBar) progressBar.style.transform = 'scaleX(' + pct + ')';
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
    const links = document.querySelectorAll('.titleblock .nav a[href^="#"]');
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
    if (!el) return;
    const start = new Date(2022, 0, 15).getTime(); // Jan 15, 2022
    function update() {
      const days = Math.floor((Date.now() - start) / 86400000);
      el.textContent = 'T+' + days.toLocaleString() + 'd';
    }
    update();
    setInterval(update, 60000); // refresh once a minute
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
  // Init
  // -------------------------------------------------------
  function init() {
    setupReveals();
    setupStickyNav();
    setupActiveNav();
    setupParallax();
    setupUptime();
    setupGridPulse();
    setupStackInteraction();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
