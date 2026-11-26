/* ============================================================
   PARSA FATHI — FIELD SURVEY · MK II "SPECTRUM" interactions
   Vanilla JS. No dependencies. Progressive enhancement only:
   everything works with this file absent or JS disabled.
   ============================================================ */
(function () {
  'use strict';

  var doc = document;
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia('(pointer: fine)').matches;
  var raf = window.requestAnimationFrame.bind(window);

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function pad3(n) { return String(n).padStart(3, '0'); }

  /* ---------- 1 · Preloader ---------- */
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
    /* arm the living network ~1.7s after entrance */
    if (!RM) {
      setTimeout(function () {
        var net = doc.querySelector('.hero-net');
        if (net) net.classList.add('net-live');
      }, 1700);
    }
  }

  if (pre) {
    doc.body.classList.add('no-scroll');
    if (RM || !preCount || !preBar) {
      finishPre();
    } else {
      var t0 = null;
      var DUR = 900;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / DUR, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        preCount.textContent = pad3(Math.round(eased * 100));
        preBar.style.transform = 'scaleX(' + eased + ')';
        if (p < 1) { raf(step); }
        else { setTimeout(finishPre, 180); }
      }
      raf(step);
      setTimeout(finishPre, 2600); /* failsafe */
    }
  } else {
    finishPre();
  }

  /* ---------- 2 · Split chars (big-line kinetics) ---------- */
  doc.querySelectorAll('[data-chars]').forEach(function (el) {
    var text = el.textContent;
    el.setAttribute('aria-label', text);
    el.textContent = '';
    var idx = 0;
    text.split(/\s+/).forEach(function (word, wi, arr) {
      var w = doc.createElement('span');
      w.className = 'w';
      w.setAttribute('aria-hidden', 'true');
      for (var i = 0; i < word.length; i++) {
        var c = doc.createElement('span');
        c.className = 'c';
        c.textContent = word[i];
        c.style.setProperty('--i', idx++);
        w.appendChild(c);
      }
      el.appendChild(w);
      if (wi < arr.length - 1) el.appendChild(doc.createTextNode(' '));
    });
  });

  /* ---------- 3 · Stagger groups ---------- */
  var GROUPS = [
    '.principles', '.ri-list', '.sperlus-cols', '.dec-list', '.sp-stats',
    '.chips', '.stack-tags', '.feature-points', '.vs-list'
  ];
  GROUPS.forEach(function (sel) {
    doc.querySelectorAll(sel).forEach(function (group) {
      var children = group.children;
      for (var i = 0; i < children.length; i++) {
        children[i].style.setProperty('--stagger', Math.min(i * 85, 500));
      }
    });
  });
  /* table rows get their own stagger */
  var tbody = doc.querySelector('.spec-table tbody');
  if (tbody) {
    var rows = tbody.rows;
    for (var r = 0; r < rows.length; r++) {
      rows[r].style.setProperty('--stagger', r * 95);
    }
  }

  /* ---------- 4 · Reveal on scroll ---------- */
  var REVEAL_SEL = '[data-reveal], .station-head, [data-chars], .principles, .ri-list, .sperlus-cols, .dec-list, .sp-stats, .chips, .stack-tags, .feature-points, .vs-list, .spec-table tbody, .sperlus-problem, .github-panel';
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in-view');
          io.unobserve(en.target);
          /* decode-on-arrival for the station label */
          var label = en.target.querySelector ? en.target.querySelector('.station-label') : null;
          if (label && !RM && !label.dataset.scrambled) {
            label.dataset.scrambled = '1';
            setTimeout(function () { scramble(label, 520); }, 250);
          }
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    doc.querySelectorAll(REVEAL_SEL).forEach(function (el) { io.observe(el); });
  } else {
    doc.querySelectorAll(REVEAL_SEL).forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- 5 · Text scramble (decode effect) ---------- */
  var GLYPHS = '!<>-_\\/[]{}—=+*^?#░▒▓01';
  var scrambling = new WeakMap();

  function scramble(el, dur) {
    if (RM) return;
    if (scrambling.get(el)) return;
    var original = el.dataset.orig || el.textContent;
    el.dataset.orig = original;
    scrambling.set(el, true);
    var t0 = null;
    var len = original.length;
    function frame(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var reveal = Math.floor(p * len);
      var out = '';
      for (var i = 0; i < len; i++) {
        var ch = original[i];
        if (ch === ' ' || i < reveal) { out += ch; }
        else { out += GLYPHS[(Math.random() * GLYPHS.length) | 0]; }
      }
      el.textContent = out;
      if (p < 1) { raf(frame); }
      else {
        el.textContent = original;
        scrambling.set(el, false);
      }
    }
    raf(frame);
  }

  /* nav links scramble on hover */
  if (FINE && !RM) {
    doc.querySelectorAll('.site-nav ul a, .brand').forEach(function (a) {
      a.addEventListener('pointerenter', function () {
        var label = a.childNodes.length ? a : null;
        /* scramble only the text node, not the index <i> */
        if (!label) return;
        var textNode = null;
        for (var i = 0; i < a.childNodes.length; i++) {
          if (a.childNodes[i].nodeType === 3 && a.childNodes[i].textContent.trim()) {
            textNode = a.childNodes[i]; break;
          }
        }
        if (!textNode) return;
        var holder = { t: textNode.textContent };
        var original = holder.t;
        var t0s = null;
        function fr(ts) {
          if (t0s === null) t0s = ts;
          var p = Math.min((ts - t0s) / 420, 1);
          var reveal = Math.floor(p * original.length);
          var out = '';
          for (var j = 0; j < original.length; j++) {
            out += (j < reveal || original[j] === ' ') ? original[j]
              : GLYPHS[(Math.random() * GLYPHS.length) | 0];
          }
          textNode.textContent = out;
          if (p < 1) raf(fr);
          else textNode.textContent = original;
        }
        raf(fr);
      });
    });
  }

  /* ---------- 6 · Counters ---------- */
  function runCount(el) {
    if (RM || !el.dataset.count) return;
    var target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    var dec = parseInt(el.dataset.decimals || '0', 10);
    var suffix = el.dataset.suffix || '';
    var t0 = null;
    var DUR = 1400;
    function frame(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / DUR, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = (target * eased).toFixed(dec) + (p === 1 ? suffix : '');
      if (p < 1) raf(frame);
      else el.textContent = target.toFixed(dec) + suffix;
    }
    raf(frame);
  }
  var counters = doc.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          runCount(en.target);
          cio.unobserve(en.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- 7 · Scroll engine: header, progress, station, parallax, rail ---------- */
  var head = doc.getElementById('siteHead');
  var prog = doc.getElementById('headProgress');
  var pct = doc.getElementById('surveyPct');
  var net = doc.querySelector('.hero-net');
  var heroCanvas = doc.getElementById('heroCanvas');
  var ghosts = doc.querySelectorAll('.ghost-no');
  var archSvg = doc.querySelector('.arch');
  var recList = doc.querySelector('.rec-list');
  var recRail = null;

  /* build the records timeline rail */
  if (recList) {
    recRail = doc.createElement('span');
    recRail.className = 'rec-rail';
    recRail.innerHTML = '<i></i>';
    recList.insertBefore(recRail, recList.firstChild);
  }
  var railFill = recRail ? recRail.firstElementChild : null;

  var ticking = false;
  function onScrollFrame() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;
    var vh = window.innerHeight;
    if (head) head.classList.toggle('scrolled', y > 24);
    var h = doc.documentElement.scrollHeight - vh;
    var p = h > 0 ? Math.min(y / h, 1) : 0;
    if (prog) prog.style.transform = 'scaleX(' + p + ')';
    if (pct) pct.textContent = pad3(Math.round(p * 100));

    if (!RM) {
      /* multi-layer parallax via independent translate property */
      if (net && y < vh * 1.6) net.style.translate = '0 ' + (y * 0.12).toFixed(1) + 'px';
      if (heroCanvas && y < vh * 1.6) heroCanvas.style.translate = '0 ' + (y * 0.05).toFixed(1) + 'px';
      ghosts.forEach(function (g) {
        var r = g.parentElement ? g.parentElement.getBoundingClientRect() : null;
        if (!r) return;
        if (r.bottom > -200 && r.top < vh + 200) {
          var local = (vh - r.top) / (vh + r.height);
          g.style.translate = '0 ' + ((local - 0.5) * -46).toFixed(1) + 'px';
          g.style.rotate = ((local - 0.5) * 2.4).toFixed(2) + 'deg';
        }
      });
      if (archSvg) {
        var ar = archSvg.getBoundingClientRect();
        if (ar.bottom > -100 && ar.top < vh + 100) {
          var al = (vh - ar.top) / (vh + ar.height);
          archSvg.style.translate = '0 ' + ((al - 0.5) * -24).toFixed(1) + 'px';
        }
      }
    }

    /* records timeline fill */
    if (railFill && recList) {
      var lr = recList.getBoundingClientRect();
      var rp = clamp((vh * 0.72 - lr.top) / lr.height, 0, 1);
      railFill.style.transform = 'scaleY(' + rp.toFixed(3) + ')';
    }
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    raf(onScrollFrame);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScrollFrame();

  /* ---------- 8 · Active station → body[data-station] + nav ---------- */
  var navLinks = {};
  doc.querySelectorAll('.site-nav [data-nav]').forEach(function (a) {
    var id = a.getAttribute('data-nav');
    (navLinks[id] = navLinks[id] || []).push(a);
  });
  var STATIONS = ['about', 'sperlus', 'systems', 'vision', 'stack', 'records', 'contact'];
  if ('IntersectionObserver' in window) {
    var sectionIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        var no = STATIONS.indexOf(id);
        if (no > -1) {
          var code = pad3(no + 1);
          if (doc.body.dataset.station !== code) {
            doc.body.dataset.station = code;
          }
        }
        Object.keys(navLinks).forEach(function (k) {
          navLinks[k].forEach(function (a) { a.classList.toggle('active', k === id); });
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    STATIONS.forEach(function (id) {
      var s = doc.getElementById(id);
      if (s) sectionIO.observe(s);
    });
  }

  /* ---------- 9 · Mobile menu ---------- */
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

  /* ---------- 10 · Crosshair survey cursor ---------- */
  if (FINE && !RM) {
    var ch = doc.querySelector('.crosshair');
    if (ch) {
      var chX = ch.querySelector('.ch-x');
      var chY = ch.querySelector('.ch-y');
      var chDot = ch.querySelector('.ch-dot');
      var chRead = doc.getElementById('chRead');
      var chRaf = null, chTx = 0, chTy = 0;
      var chApply = function () {
        chRaf = null;
        chX.style.transform = 'translateY(' + chTy + 'px)';
        chY.style.transform = 'translateX(' + chTx + 'px)';
        if (chDot) {
          chDot.style.left = chTx + 'px';
          chDot.style.top = chTy + 'px';
        }
        if (chRead) {
          chRead.textContent =
            'E ' + String(Math.round(chTx)).padStart(4, '0') +
            ' · N ' + String(Math.round(chTy)).padStart(4, '0');
        }
      };
      window.addEventListener('pointermove', function (e) {
        chTx = e.clientX; chTy = e.clientY;
        ch.classList.add('on');
        if (!chRaf) chRaf = raf(chApply);
      }, { passive: true });
      doc.documentElement.addEventListener('mouseleave', function () {
        ch.classList.remove('on');
      });
    }
  }

  /* ---------- 11 · Magnetic buttons ---------- */
  if (FINE && !RM) {
    doc.querySelectorAll('.magnetic').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) / r.width;
        var dy = (e.clientY - r.top - r.height / 2) / r.height;
        btn.style.transform =
          'translate(' + (dx * 9).toFixed(1) + 'px,' + (dy * 9).toFixed(1) + 'px)' +
          ' rotate(' + (dx * 2).toFixed(2) + 'deg)';
      });
      btn.addEventListener('pointerleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ---------- 12 · Card spotlight + micro-lean ---------- */
  var LEAN_SEL = '.sp-card, .channel, .github-panel, .principle';
  if (FINE) {
    doc.querySelectorAll(LEAN_SEL).forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        if (!RM) {
          var dx = (e.clientX - r.left) / r.width - 0.5;
          var dy = (e.clientY - r.top) / r.height - 0.5;
          card.style.rotate = (dx * 1.6).toFixed(2) + 'deg';
          card.style.translate = '0 ' + (dy * -5).toFixed(1) + 'px';
        }
      });
      card.addEventListener('pointerleave', function () {
        card.style.rotate = '';
        card.style.translate = '';
      });
    });
  }

  /* ---------- 13 · Marquee: scroll-velocity boost ---------- */
  var mqTracks = doc.querySelectorAll('[data-mq]');
  if (mqTracks.length && !RM) {
    var mqRate = 1, lastY = window.scrollY || 0;
    function mqFrame() {
      var y = window.scrollY || window.pageYOffset;
      var v = y - lastY;
      lastY = y;
      var target = 1 + Math.min(Math.abs(v) / 90, 3.2);
      mqRate += (target - mqRate) * 0.14;
      mqTracks.forEach(function (tr) {
        try {
          tr.getAnimations().forEach(function (a) {
            a.playbackRate = clamp(mqRate, 0.6, 4.2);
          });
        } catch (err) { /* older engines — ignore */ }
      });
      raf(mqFrame);
    }
    raf(mqFrame);
  }

  /* ---------- 14 · Hero constellation canvas ---------- */
  (function constellation() {
    if (RM) return;
    var canvas = doc.getElementById('heroCanvas');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var hero = doc.querySelector('.hero');
    var COLORS = ['#0E7A52', '#0B8FA8', '#C77414', '#6C4FD8', '22,25,26'];
    var pts = [];
    var W = 0, H = 0, DPR = 1;
    var running = false;
    var mouse = { x: -9999, y: -9999 };

    function resize() {
      var r = hero.getBoundingClientRect();
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      var n = clamp(Math.floor(W / 18), 26, 84);
      pts = [];
      for (var i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          c: COLORS[(Math.random() * COLORS.length) | 0],
          r: 1 + Math.random() * 1.4
        });
      }
    }

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      var LINK = 118;
      for (var i = 0; i < pts.length; i++) {
        var a = pts[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < -20) a.x = W + 20; else if (a.x > W + 20) a.x = -20;
        if (a.y < -20) a.y = H + 20; else if (a.y > H + 20) a.y = -20;
        /* gentle mouse repulsion */
        var mdx = a.x - mouse.x, mdy = a.y - mouse.y;
        var md = mdx * mdx + mdy * mdy;
        if (md < 21000 && md > 1) {
          var f = (1 - md / 21000) * 0.05;
          var d = Math.sqrt(md);
          a.x += (mdx / d) * f * 9;
          a.y += (mdy / d) * f * 9;
        }
        for (var j = i + 1; j < pts.length; j++) {
          var b = pts[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            var alpha = (1 - Math.sqrt(d2) / LINK) * 0.16;
            /* near the mouse, links light up in cyan */
            var mx = (a.x + b.x) / 2 - mouse.x, my = (a.y + b.y) / 2 - mouse.y;
            var near = (mx * mx + my * my) < 32000;
            if (near) { ctx.strokeStyle = 'rgba(11,143,168,' + (alpha * 2.4).toFixed(3) + ')'; }
            else { ctx.strokeStyle = 'rgba(22,25,26,' + alpha.toFixed(3) + ')'; }
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        /* particle dot */
        if (a.c.indexOf(',') > -1) {
          ctx.fillStyle = 'rgba(' + a.c + ',.5)';
        } else {
          ctx.fillStyle = a.c + 'B3'; /* 70% */
        }
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, 6.2832);
        ctx.fill();
      }
      raf(draw);
    }

    function start() { if (!running) { running = true; raf(draw); } }
    function stop() { running = false; }

    window.addEventListener('resize', function () {
      resize();
    }, { passive: true });

    if (FINE) {
      window.addEventListener('pointermove', function (e) {
        var r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
      }, { passive: true });
    }

    resize();
    if ('IntersectionObserver' in window) {
      var hio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) start(); else stop();
        });
      }, { threshold: 0.02 });
      hio.observe(hero);
    } else {
      start();
    }
  })();

})();
