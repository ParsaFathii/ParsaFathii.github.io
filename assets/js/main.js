/* ============================================================
   PARSA FATHI — FIELD SURVEY · interactions
   Vanilla JS. No dependencies. Progressive enhancement only:
   everything works with this file absent or JS disabled.
   ============================================================ */
(function () {
  'use strict';

  var doc = document;
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia('(pointer: fine)').matches;

  /* ---------- Preloader ---------- */
  var pre = doc.querySelector('.preloader');
  var preCount = doc.getElementById('preCount');
  var preBar = doc.getElementById('preBar');
  var preDone = false;

  function finishPre() {
    if (preDone) return;
    preDone = true;
    doc.body.classList.add('loaded');
    doc.body.classList.remove('no-scroll');
    if (pre) pre.classList.add('done');
  }

  if (pre) {
    doc.body.classList.add('no-scroll');
    if (RM || !preCount || !preBar) {
      finishPre();
    } else {
      var t0 = null;
      var DUR = 850;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / DUR, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = Math.round(eased * 100);
        preCount.textContent = String(val).padStart(3, '0');
        preBar.style.transform = 'scaleX(' + eased + ')';
        if (p < 1) { requestAnimationFrame(step); }
        else { setTimeout(finishPre, 160); }
      }
      requestAnimationFrame(step);
      setTimeout(finishPre, 2400); /* failsafe */
    }
  } else {
    doc.body.classList.add('loaded');
  }

  /* ---------- Stagger groups: move reveal to children ---------- */
  doc.querySelectorAll('.principles, .ri-list').forEach(function (group) {
    if (group.hasAttribute('data-reveal')) group.removeAttribute('data-reveal');
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.setAttribute('data-reveal', '');
      child.style.transitionDelay = Math.min(i * 90, 420) + 'ms';
    });
  });

  /* ---------- Reveal on scroll ---------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in-view');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    doc.querySelectorAll('[data-reveal], .station-head').forEach(function (el) { io.observe(el); });
  } else {
    doc.querySelectorAll('[data-reveal], .station-head').forEach(function (el) {
      el.classList.add('in-view');
    });
  }

  /* ---------- Header state + survey progress ---------- */
  var head = doc.getElementById('siteHead');
  var prog = doc.getElementById('headProgress');
  var pct = doc.getElementById('surveyPct');
  var net = doc.querySelector('.hero-net');
  var ticking = false;

  function onScrollFrame() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;
    if (head) head.classList.toggle('scrolled', y > 24);
    var h = doc.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? Math.min(y / h, 1) : 0;
    if (prog) prog.style.transform = 'scaleX(' + p + ')';
    if (pct) pct.textContent = String(Math.round(p * 100)).padStart(3, '0');
    if (!RM && net && y < window.innerHeight * 1.5) {
      net.style.transform = 'translateY(' + (y * 0.1) + 'px)';
    }
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScrollFrame);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScrollFrame();

  /* ---------- Active station in nav ---------- */
  var navLinks = {};
  doc.querySelectorAll('.site-nav [data-nav]').forEach(function (a) {
    var id = a.getAttribute('data-nav');
    (navLinks[id] = navLinks[id] || []).push(a);
  });
  if ('IntersectionObserver' in window) {
    var sectionIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        Object.keys(navLinks).forEach(function (k) {
          navLinks[k].forEach(function (a) { a.classList.toggle('active', k === id); });
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    ['about', 'sperlus', 'systems', 'vision', 'stack', 'records', 'contact'].forEach(function (id) {
      var s = doc.getElementById(id);
      if (s) sectionIO.observe(s);
    });
  }

  /* ---------- Mobile menu ---------- */
  var navToggle = doc.getElementById('navToggle');
  var mobileMenu = doc.getElementById('mobileMenu');
  var menuOpen = false;

  function openMenu() {
    menuOpen = true;
    if (mobileMenu.hidden) mobileMenu.hidden = false;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { mobileMenu.classList.add('open'); });
    });
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
    doc.body.classList.add('no-scroll');
  }
  function closeMenu() {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    doc.body.classList.remove('no-scroll');
    setTimeout(function () { if (!menuOpen) mobileMenu.hidden = true; }, 400);
  }
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      if (menuOpen) closeMenu(); else openMenu();
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuOpen) { closeMenu(); navToggle.focus(); }
    });
  }

  /* ---------- Crosshair survey cursor ---------- */
  if (FINE && !RM) {
    var ch = doc.querySelector('.crosshair');
    if (ch) {
      var chX = ch.querySelector('.ch-x');
      var chY = ch.querySelector('.ch-y');
      var chRead = doc.getElementById('chRead');
      var chRaf = null, chTx = 0, chTy = 0;
      var chApply = function () {
        chRaf = null;
        chX.style.transform = 'translateY(' + chTy + 'px)';
        chY.style.transform = 'translateX(' + chTx + 'px)';
        if (chRead) {
          chRead.textContent =
            'E ' + String(Math.round(chTx)).padStart(4, '0') +
            ' · N ' + String(Math.round(chTy)).padStart(4, '0');
        }
      };
      window.addEventListener('pointermove', function (e) {
        chTx = e.clientX; chTy = e.clientY;
        ch.classList.add('on');
        if (!chRaf) chRaf = requestAnimationFrame(chApply);
      }, { passive: true });
      doc.documentElement.addEventListener('mouseleave', function () {
        ch.classList.remove('on');
      });
    }
  }

  /* ---------- Magnetic buttons ---------- */
  if (FINE && !RM) {
    doc.querySelectorAll('.magnetic').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) / r.width;
        var dy = (e.clientY - r.top - r.height / 2) / r.height;
        btn.style.transform =
          'translate(' + (dx * 7).toFixed(1) + 'px,' + (dy * 7).toFixed(1) + 'px)';
      });
      btn.addEventListener('pointerleave', function () {
        btn.style.transform = '';
      });
    });
  }
})();
